import {geoContains,geoDistance} from 'd3';
import {COUNTRY_LABELS,countryLabel,countryNameZh} from './country-label-data.js';
import {layoutGeographyLabels} from './geography-label-layout.js';

const NS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={})=>{const n=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));return n;};
const referencePlaces=[
  {id:'ref-asia',nameZh:'亚洲',lon:82,lat:43,kind:'continent'},
  {id:'ref-europe',nameZh:'欧洲',lon:15,lat:58,kind:'continent'},
  {id:'ref-africa',nameZh:'非洲',lon:20,lat:3,kind:'continent'},
  {id:'ref-north-america',nameZh:'北美洲',lon:-109,lat:49,kind:'continent'},
  {id:'ref-south-america',nameZh:'南美洲',lon:-64,lat:-16,kind:'continent'},
  {id:'ref-oceania',nameZh:'大洋洲',lon:137,lat:-22,kind:'continent'},
  {id:'ref-antarctica',nameZh:'南极洲',lon:0,lat:-80,kind:'continent'},
  {id:'ref-pacific',nameZh:'太平洋',lon:-140,lat:0,kind:'ocean'},
  {id:'ref-atlantic',nameZh:'大西洋',lon:-33,lat:5,kind:'ocean'},
  {id:'ref-indian',nameZh:'印度洋',lon:76,lat:-23,kind:'ocean'},
];
const visibleRect=e=>{if(!e||e.hidden||getComputedStyle(e).display==='none'||getComputedStyle(e).visibility==='hidden')return null;const r=e.getBoundingClientRect();return r.width&&r.height?r:null;};
const px=value=>Math.round(value*10)/10;

/** Geographic orientation only: country labels never assert plant occurrence. */
export function createGlobalGeographyLabels({world,globe,camera,globeRoot,vector,svgRoot,projection,path,getContext,getPlantBounds,requestDraw}){
  const features=new Map(world.features.map(f=>[f.properties.id,f]));
  const globeLayer=document.createElement('div');globeLayer.className='global-geographic-labels';globeLayer.setAttribute('aria-hidden','true');globeRoot.append(globeLayer);
  const globeLeaders=svg('svg',{class:'global-geographic-leaders','aria-hidden':'true'});globeRoot.append(globeLeaders);
  const worldBorders=svg('g',{class:'global-geographic-borders','pointer-events':'none'}),worldFocus=svg('g',{class:'global-geographic-focus','pointer-events':'none'}),worldLeaders=svg('g',{'pointer-events':'none'}),worldLabels=svg('g',{class:'global-world-place-labels','pointer-events':'none','aria-hidden':'true'});
  svgRoot.append(worldBorders,worldFocus,worldLeaders,worldLabels);
  let worldKey='',hoverId=null,hoverFrame=0,pointer=null,globeNodes=new Map(),leaderNodes=new Map(),visibleNames=[];
  function selectedCountry(context){return countryLabel(context.referenceCountryId)||(context.mode==='production'?countryLabel(context.selected):null);}
  function countryCandidates(context){
    const active=selectedCountry(context),top=new Set(context.topCountryIds||[]),focus=context.focus||(active?[active.lon,active.lat]:null);
    return COUNTRY_LABELS.filter(p=>p.kind!=='continent').map(p=>{
      const near=focus?geoDistance([p.lon,p.lat],focus)*180/Math.PI:180;
      const required=p.id===active?.id||p.id===hoverId;
      const priority=required?100000:focus?1000+Math.max(0,40-near)*240+(top.has(p.iso3)?400:0):(p.priority<100?3000-p.priority*10:600+Math.min(600,p.area*6000))+(top.has(p.iso3)?2500:0);
      return {...p,text:p.nameZh,kind:'country',required,active:p.id===active?.id,hovered:p.id===hoverId,priority,near,maxOffset:24,offsets:[[0,0],[0,-14],[0,14],[-14,0],[14,0],[-16,-12],[16,-12],[-16,12],[16,12]]};
    }).filter(p=>context.density==='more'||p.required||p.priority>1500||p.area>.035||p.near<20);
  }
  function candidates(context){return [...countryCandidates(context),...referencePlaces.map(p=>({...p,text:p.nameZh,priority:p.kind==='ocean'?3600:3200,required:false}))];}
  function sizes(p,fontSize){return {width:p.text.length*fontSize+(p.active?16:6),height:fontSize+(p.active?10:6)};}
  function buildTextLabel(parent,item,fontSize,scale=1,offset=[0,0]){
    const x=(item.left-offset[0])/scale,y=(item.top-offset[1])/scale,w=item.width/scale,h=item.height/scale;
    const group=svg('g',{'data-place-id':item.id,'data-place-kind':item.kind,class:'global-world-place'+(item.active?' is-current':'')+(item.hovered?' is-hovered':'')});
    if(item.active||item.hovered)group.append(svg('rect',{x,y,width:w,height:h,rx:4/scale,fill:'#18323b',stroke:item.active?'#ffe6a1':'#dcebe1','stroke-width':1/scale}));
    const text=svg('text',{x:x+w/2,y:y+h/2,'text-anchor':'middle','dominant-baseline':'central','font-size':fontSize/scale,'font-weight':item.active?750:item.kind==='country'?600:500,fill:item.active?'#ffe6a1':item.kind==='country'?'#f2f3e6':'#a5c2cf',stroke:'#152932','stroke-width':3/scale,'paint-order':'stroke','stroke-linejoin':'round'});text.textContent=item.text;group.append(text);parent.append(group);
  }
  function renderWorld(){
    const context=getContext();if(!context.enabled||!context.fullMap)return;
    const rect=svgRoot.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const scale=Math.min(rect.width/960,rect.height/480),offset=[(rect.width-960*scale)/2,(rect.height-480*scale)/2],active=selectedCountry(context);
    const key=[rect.width,rect.height,context.mode,context.selected,context.referenceCountryId,context.focus?.join(','),context.cropId,context.density,(context.topCountryIds||[]).join(','),hoverId].join('|');if(key===worldKey)return;worldKey=key;
    worldBorders.replaceChildren();worldFocus.replaceChildren();worldLabels.replaceChildren();worldLeaders.replaceChildren();
    if(context.mode==='botanical')worldBorders.append(svg('path',{d:path(world),fill:'none',stroke:'#d9e3df','stroke-width':.65/scale,opacity:.68}));
    for(const id of new Set([active?.id,hoverId].filter(Boolean))){const feature=features.get(id);if(feature)worldFocus.append(svg('path',{d:path(feature),fill:'none',stroke:id===active?.id?'#ffe6a1':'#e8f1ec','stroke-width':1.8/scale}));}
    if(context.density==='off')return;
    const contentWidth=960*scale,fontSize=contentWidth<420?10.5:contentWidth<650?11.5:12;
    const list=candidates(context).map(p=>{const projected=projection([p.lon,p.lat]);return {...p,x:offset[0]+projected[0]*scale,y:offset[1]+projected[1]*scale,...sizes(p,fontSize)};});
    const placed=layoutGeographyLabels(list,{bounds:{left:offset[0]+3,top:offset[1]+3,width:960*scale-6,height:480*scale-6},maxLabels:context.density==='more'?Math.min(65,Math.floor(contentWidth/10)):contentWidth<420?18:contentWidth<650?22:32,gap:3});
    for(const item of placed){if(item.leader)worldLeaders.append(svg('line',{x1:(item.anchorX-offset[0])/scale,y1:(item.anchorY-offset[1])/scale,x2:(item.leaderEndX-offset[0])/scale,y2:(item.leaderEndY-offset[1])/scale,stroke:item.active?'#ffe6a1':'#b9cccf','stroke-width':.8/scale,opacity:.8}));buildTextLabel(worldLabels,item,fontSize,scale,offset);}
  }
  function obstacles(){return [...document.querySelectorAll('.global-header,.global-panel,.global-list,.global-key,.global-tour,#global-catalog,.class-globe-companion,#globe-data-controls,#regional-classroom,#regional-scene-card,.regional-map-label,.class-globe-anchor-labels button,.regional-globe-cues button,.learn-header,.learn-panel,#learning-globe-actions,#imm-player,.narration-scene-card,.narration-point-label,#globe-guide-controls,#globe-appearance-controls,.global-plant-label')].map(visibleRect).filter(Boolean);}
  function prioritizeCountryNames(placed=[],bounds={left:0,top:0}){
    for(const tag of document.querySelectorAll('#globe-guide-labels button')){const r=tag.getBoundingClientRect();const overlaps=!tag.hidden&&placed.some(p=>p.left+bounds.left<r.right+3&&p.left+p.width+bounds.left>r.left-3&&p.top+bounds.top<r.bottom+3&&p.top+p.height+bounds.top>r.top-3);tag.classList.toggle('country-name-overlap',overlaps);}
  }
  function beforeRender(){
    const context=getContext();if((!context.enabled||!context.fullMap)&&(hoverId||pointer)){hoverId=null;pointer=null;worldKey='';if(hoverFrame)cancelAnimationFrame(hoverFrame);hoverFrame=0;}globeLayer.hidden=!context.enabled||context.fullMap||context.density==='off';globeLeaders.style.display=globeLayer.hidden?'none':'';renderWorld();
    if(globeLayer.hidden){visibleNames=[];prioritizeCountryNames();return;}
    const bounds=globeRoot.getBoundingClientRect(),fontSize=innerWidth<=760?11:12,points=[];
    for(const p of candidates(context)){
      const worldPoint=vector(p.lon,p.lat,1.019).applyMatrix4(globe.matrixWorld),front=worldPoint.clone().normalize().dot(camera.position.clone().sub(worldPoint).normalize());if(front<.19)continue;
      const projected=worldPoint.project(camera),x=(projected.x+1)*bounds.width/2,y=(1-projected.y)*bounds.height/2;
      if(x<3||y<3||x>bounds.width-3||y>bounds.height-3)continue;points.push({...p,x,y,...sizes(p,fontSize)});
    }
    const blocked=obstacles().map(r=>({left:r.left-bounds.left,top:r.top-bounds.top,width:r.width,height:r.height}));
    const plantBounds=getPlantBounds?.();if(plantBounds)blocked.push(plantBounds);
    const placed=layoutGeographyLabels(points,{bounds:{left:5,top:5,width:bounds.width-10,height:bounds.height-10},obstacles:blocked,maxLabels:context.density==='more'?42:context.selected?16:24,gap:4});
    prioritizeCountryNames(placed,bounds);
    const ids=new Set(placed.map(p=>p.id));for(const [id,n] of globeNodes)if(!ids.has(id)){n.remove();globeNodes.delete(id);}for(const [id,n] of leaderNodes)if(!ids.has(id)){n.remove();leaderNodes.delete(id);}
    for(const item of placed){let label=globeNodes.get(item.id);if(!label){label=document.createElement('span');label.dataset.placeId=item.id;globeNodes.set(item.id,label);globeLayer.append(label);}label.className='global-country-label '+item.kind+(item.active?' is-current':'');label.textContent=item.text;label.style.left=px(item.left)+'px';label.style.top=px(item.top)+'px';label.style.fontSize=fontSize+'px';label.style.width=px(item.width)+'px';label.style.height=px(item.height)+'px';let line=leaderNodes.get(item.id);if(item.leader){if(!line){line=svg('line');leaderNodes.set(item.id,line);globeLeaders.append(line);}for(const [key,value] of Object.entries({x1:item.anchorX,y1:item.anchorY,x2:item.leaderEndX,y2:item.leaderEndY}))line.setAttribute(key,px(value));line.setAttribute('class',item.active?'is-current':'');line.style.display='';}else if(line)line.style.display='none';}
    visibleNames=placed.map(({id,text,active})=>({id,text,active}));
  }
  function updateHover(){hoverFrame=0;const context=getContext();if(!context.enabled||!context.fullMap||!pointer)return;const r=svgRoot.getBoundingClientRect(),scale=Math.min(r.width/960,r.height/480),offset=[(r.width-960*scale)/2,(r.height-480*scale)/2],xy=[(pointer[0]-r.left-offset[0])/scale,(pointer[1]-r.top-offset[1])/scale],point=projection.invert(xy);const found=xy[0]>=0&&xy[0]<=960&&xy[1]>=0&&xy[1]<=480?world.features.find(f=>geoContains(f,point)):null;const id=found?.properties.id||null;if(id!==hoverId){hoverId=id;worldKey='';renderWorld();}}
  svgRoot.addEventListener('pointermove',e=>{pointer=[e.clientX,e.clientY];if(!hoverFrame)hoverFrame=requestAnimationFrame(updateHover);});
  svgRoot.addEventListener('pointerleave',()=>{pointer=null;if(hoverFrame)cancelAnimationFrame(hoverFrame);hoverFrame=0;if(hoverId){hoverId=null;worldKey='';renderWorld();}});
  const observer=new ResizeObserver(()=>{worldKey='';renderWorld();requestDraw();});observer.observe(svgRoot);
  return {beforeRender,renderWorld,invalidate(){worldKey='';requestDraw();},getState:()=>({visibleGlobeNames:visibleNames,visibleWorldNames:[...worldLabels.querySelectorAll('text')].map(n=>n.textContent)})};
}
