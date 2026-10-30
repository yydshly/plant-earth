import {geoEquirectangular,geoPath,geoGraticule10,geoContains,geoDistance} from 'd3';
import {COUNTRY_LABELS} from './country-label-data.js';
import {layoutGeographyLabels} from './geography-label-layout.js';

const NS='http://www.w3.org/2000/svg';
const svg=(tag,attributes={})=>{const n=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attributes))n.setAttribute(key,String(value));return n;};
const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const REFERENCES=[
  ['亚洲',82,43],['欧洲',13,58],['非洲',20,5],['北美洲',-110,47],['南美洲',-63,-16],['大洋洲',137,-23],['南极洲',0,-80],
  ['太平洋',-142,1],['大西洋',-34,6],['印度洋',76,-26]
];

export function normalizeLearningMapContext(input={}){
  const source=input&&typeof input==='object'?input:{},point=source.point||source.focus||source.stop||source.foundationStep||source;
  const lon=finite(source.lon)?source.lon:point.lon,lat=finite(source.lat)?source.lat:point.lat;
  return {...source,lon:finite(lon)?Math.max(-180,Math.min(180,lon)):null,lat:finite(lat)?Math.max(-90,Math.min(90,lat)):null,
    title:source.title||point.label||point.region||point.landscape||point.title||'当前讲解位置',
    pointMeaning:source.pointMeaning||'当前教学案例位置，不代表植物观测点或完整分布。',
    lessonId:source.foundationStep?.id||source.stop?.id||source.lessonId||source.id||null};
}

// Use the same placement policy in the actual map and the regression check.
// Major reference countries precede region names; nearby countries precede
// unrelated small territories. A leader keeps a moved name tied to its anchor.
export function layoutLearningMapLabels(world,rect,input={}){
  const context=normalizeLearningMapContext(input),scale=Math.min(rect.width/960,rect.height/480),fontSize=rect.width<500?10.5:12;
  if(!Number.isFinite(scale)||scale<=0)return {placed:[],scale:1,fontSize};
  const projection=geoEquirectangular().translate([480,240]).scale(960/(2*Math.PI));
  const active=finite(context.lon)&&finite(context.lat)?[context.lon,context.lat]:null;
  const selected=active?world.features.find(f=>geoContains(f,active))?.properties.id:null;
  const offsets=[[0,0],[0,-18],[0,18],[-18,0],[18,0],[0,-30],[0,30],[-30,0],[30,0],[-24,-24],[24,-24],[-24,24],[24,24]];
  const countries=COUNTRY_LABELS.filter(p=>p.kind!=='continent').map(p=>({...p,near:active?geoDistance(active,[p.lon,p.lat])*180/Math.PI:180}))
    .filter(p=>p.id===selected||p.priority<100||p.area>.05||(p.near<25&&p.area>.002))
    .map(p=>({...p,text:p.nameZh,priority:p.id===selected?100000:p.priority<=9?9000-p.priority*10:7000-p.priority*8+Math.max(0,30-p.near)*40,kind:'country',required:p.id===selected,maxOffset:p.priority<=9?36:30}));
  const items=[...REFERENCES.map(([text,lon,lat],i)=>({id:'reference-'+i,text,lon,lat,priority:8500,kind:'reference',maxOffset:56})),...countries]
    .map(p=>{const [x,y]=projection([p.lon,p.lat]);return {...p,x:x*scale,y:y*scale,width:p.text.length*fontSize+6,height:fontSize+6,offsets};});
  const obstacles=[0,23.4,-23.4,66.6,-66.6].map(lat=>({left:0,top:(projection([0,lat])[1]-19)*scale,width:155*scale,height:21*scale}));
  const placed=layoutGeographyLabels(items,{bounds:{left:3,top:3,width:960*scale-6,height:480*scale-6},obstacles,maxLabels:rect.width<500?22:36,gap:3});
  return {placed,scale,fontSize};
}

// A second view of the same basemap. It deliberately adds no inferred plant
// ranges, climate values or vegetation coverage to the introductory lessons.
export function createLearningFlatMap({data,container=document.body,onModeChange,onLayout}={}){
  const world=data?.world;if(!world?.features)throw new TypeError('The learning map needs the existing world features');
  let enabled=false,mode='globe',context=normalizeLearningMapContext(),frame=0,lastControlBottom=-1;
  // A fresh module starts on the globe; a learner can explicitly unfold it.
  let manualMode=false;
  const root=node('section',null,'learning-flat-map');root.id='learning-flat-map';root.hidden=true;root.setAttribute('aria-label','入门课程的世界展开地图');
  const heading=node('div',null,'learning-flat-map-heading'),title=node('strong','同一颗地球，完整展开看'),current=node('span','先认识洲、海洋和国家');heading.append(title,current);
  const note=node('p','上北下南，左右为东西；赤道、回归线和国界帮助定位。球面展开后极区被拉伸，图上面积不能直接比较。','learning-flat-map-note');
  const map=svg('svg',{viewBox:'0 0 960 480',role:'img','aria-label':'带国家名、洲洋、赤道与回归线的完整世界地图'}),projection=geoEquirectangular().translate([480,240]).scale(960/(2*Math.PI)),path=geoPath(projection);
  const land=svg('g'),reference=svg('g',{'pointer-events':'none'}),focusLayer=svg('g',{'pointer-events':'none'}),labels=svg('g',{'pointer-events':'none'}),pointLayer=svg('g',{'pointer-events':'none'});
  map.append(svg('rect',{width:960,height:480,fill:'#203b4b'}),land,reference,focusLayer,labels,pointLayer);
  for(const feature of world.features){const shape=svg('path',{d:path(feature),fill:'#4c6769',stroke:'#a6b8b6','stroke-width':.55}),tooltip=svg('title');tooltip.textContent=COUNTRY_LABELS.find(p=>p.id===feature.properties.id)?.nameZh||feature.properties.name||'';shape.append(tooltip);land.append(shape);}
  reference.append(svg('path',{d:path(geoGraticule10()),fill:'none',stroke:'#bfd2d5','stroke-width':.45,opacity:.28}));
  for(const [lat,text]of [[0,'赤道 0°'],[23.4,'北回归线 23.4°N'],[-23.4,'南回归线 23.4°S'],[66.6,'北极圈 66.6°N'],[-66.6,'南极圈 66.6°S']]){
    const y=projection([0,lat])[1];reference.append(svg('line',{x1:0,y1:y,x2:960,y2:y,stroke:lat===0?'#f4df9b':'#d4ddb8','stroke-width':lat===0?1.6:1,'stroke-dasharray':lat===0?'':'6 4'}));const label=svg('text',{x:8,y:y-4,fill:lat===0?'#f5df9c':'#d4ddb8','font-size':12,stroke:'#203b4b','stroke-width':3,'paint-order':'stroke'});label.textContent=text;reference.append(label);
  }
  const boundary=node('p','国家与教学位置只帮助定位；分布、环境机制和因果解释仍以当前课程的资料为准。','learning-flat-map-boundary');root.append(heading,note,map,boundary);
  const controls=node('nav',null,'learning-view-switch');controls.id='learning-map-view-controls';controls.hidden=true;controls.setAttribute('aria-label','入门课程地球与地图视图');
  const globeButton=node('button','3D地球'),mapButton=node('button','展开地图');globeButton.type=mapButton.type='button';globeButton.id='learning-view-globe';mapButton.id='learning-view-map';controls.append(globeButton,mapButton);container.append(root,controls);
  globeButton.onclick=()=>setMode('globe');mapButton.onclick=()=>setMode('map');

  function renderFocus(){
    focusLayer.replaceChildren();pointLayer.replaceChildren();current.textContent=context.title;
    if(!finite(context.lon)||!finite(context.lat))return;
    const country=world.features.find(f=>geoContains(f,[context.lon,context.lat]));
    if(country)focusLayer.append(svg('path',{d:path(country),fill:'#b8c79b','fill-opacity':.22,stroke:'#f7e5a7','stroke-width':1.6}));
    const [x,y]=projection([context.lon,context.lat]);pointLayer.append(svg('circle',{cx:x,cy:y,r:7,fill:'#f8e0a0',stroke:'#18343b','stroke-width':2}));
    const countryName=COUNTRY_LABELS.find(p=>p.id===country?.properties.id)?.nameZh;
    // The highlighted country and live heading already name this place. Avoid
    // writing the same name a second time over the geographic label.
    if(!countryName||!context.title.includes(countryName)){const label=svg('text',{x:Math.max(10,Math.min(948-context.title.length*15,x+12)),y:Math.max(18,y-12),fill:'#fff0bd','font-size':15,stroke:'#19333c','stroke-width':4,'paint-order':'stroke'});label.textContent=context.title;pointLayer.append(label);}boundary.textContent=context.pointMeaning;
  }
  function renderLabels(){
    labels.replaceChildren();const rect=map.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const {placed,scale,fontSize}=layoutLearningMapLabels(world,rect,context);
    for(const p of placed)if(p.leader)labels.append(svg('line',{x1:p.anchorX/scale,y1:p.anchorY/scale,x2:p.leaderEndX/scale,y2:p.leaderEndY/scale,stroke:p.kind==='country'?'#cfe2d3':'#a8c8d2','stroke-width':.85/scale,opacity:.8,'data-label-leader':p.id}));
    for(const p of placed){const label=svg('text',{x:(p.left+p.width/2)/scale,y:(p.top+p.height/2)/scale,'text-anchor':'middle','dominant-baseline':'central',fill:p.kind==='reference'?'#c5d9de':p.required?'#fff0ad':'#f1f3e6','font-size':fontSize/scale,'font-weight':p.kind==='country'?600:400,stroke:'#203b4b','stroke-width':2.8/scale,'paint-order':'stroke','data-place-id':p.id});label.textContent=p.text;labels.append(label);}
  }
  function layout(){
    frame=0;if(!enabled)return;
    const margin=innerWidth<=760?10:26,header=document.querySelector('.learn-header')?.getBoundingClientRect(),player=document.querySelector('.imm-player')?.getBoundingClientRect();
    const top=(header?.bottom||80)+8;controls.style.left=margin+'px';controls.style.top=top+'px';
    document.body.style.setProperty?.('--learning-map-controls-top',top+'px');
    // A collapsed explanation is a short title bar, not a reserved column.
    // Measure it after setting the control-row variable so the map starts below
    // both the view buttons and the live lesson title.
    const panel=document.querySelector('.learn-panel')?.getBoundingClientRect(),collapsed=document.querySelector('.learning-journey')?.classList.contains('learn-collapsed');
    const wideMap=mode==='map'&&!!collapsed;
    const mapTop=Math.max(top+controls.getBoundingClientRect().height+9,wideMap?(panel?.bottom||0)+10:0);
    const lower=wideMap?(player?.top||innerHeight-155)-12:innerWidth<=760?(panel?.top||innerHeight-220)-9:(player?.top||innerHeight-155)-12;
    root.dataset.wide=String(wideMap);root.style.left=margin+'px';root.style.top=mapTop+'px';
    root.style.right=(wideMap||innerWidth<=760?margin:Math.max(margin,innerWidth-(panel?.left||innerWidth-350)+18))+'px';root.style.bottom=Math.max(12,innerHeight-lower)+'px';
    root.style.maxHeight=Math.max(160,lower-mapTop)+'px';renderLabels();
    const controlBottom=controls.getBoundingClientRect().bottom;if(controlBottom!==lastControlBottom){lastControlBottom=controlBottom;onLayout?.();}
  }
  function queueLayout(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(layout);}
  function apply(){root.hidden=!enabled||mode!=='map';controls.hidden=!enabled;globeButton.setAttribute('aria-pressed',String(mode==='globe'));mapButton.setAttribute('aria-pressed',String(mode==='map'));document.body.classList.toggle('is-learning-flat-map',enabled&&mode==='map');queueLayout();}
  function setMode(value){const next=value==='map'?'map':'globe';manualMode=true;if(mode===next){apply();return;}mode=next;try{localStorage.setItem('plant-earth-learning-map-view-v1',mode);}catch{}apply();onModeChange?.(mode);onLayout?.();}
  function setEnabled(value){if(value&&!enabled){mode='globe';manualMode=false;}enabled=!!value;apply();}
  function setContext(value){context=normalizeLearningMapContext(value);renderFocus();apply();}
  window.addEventListener('resize',queueLayout);const observer=new ResizeObserver(()=>{if(enabled)queueLayout();});observer.observe(map);apply();
  return {setEnabled,setContext,setMode,getState:()=>({enabled,mode,manualMode,context:{...context}}),
    getInsets(base={}){if(!enabled)return base;return {...base,top:Math.max(base.top||0,controls.getBoundingClientRect().bottom+12)};},
    relayout:queueLayout,destroy(){setEnabled(false);if(frame)cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',queueLayout);root.remove();controls.remove();}
  };
}
