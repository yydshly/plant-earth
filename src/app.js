import * as THREE from 'three';
import {geoEquirectangular,geoPath,geoGraticule10,geoCentroid,geoDistance,geoCircle,geoArea} from 'd3';
import {renderMorphology} from './morphology.js';
import {initExplorer} from './explorer.js';
import {createImmersiveGlobe} from './immersive.js';
import {createPlantCatalog} from './catalog.js';
import {renderMiniaturePreview} from './plant-miniatures.js';
import {createDistributionExplorer} from './distribution.js';
import {createGlobalEvidence} from './global-evidence.js';
import {createLearningJourney} from './learning.js';
import {connectGuidedLearning} from './guided-integration.js';
import {createCourseDirectory} from './course-directory.js';
import {createCourseDirectoryGroups,createCourseDirectoryNavigator} from './course-directory-model.js';
import {createLearningFlatMap} from './learning-flat-map.js';
import {isAutoContinueEnabled,setAutoContinueEnabled,subscribeAutoContinue} from './playback-preferences.js';
import {createLearningMap} from './learning-map.js';
import {LEARNING_STOPS,LEARNING_INTRO} from './learning-content.js';
import {createGeographyOrientation} from './geography-orientation.js';
import {createGlobeGuides} from './globe-guides.js';
import {createGlobeGuideControls} from './globe-guide-controls.js';
import {learningPlaybackInput as getLearningPlaybackInput,learningPlayerPreview} from './learning-playback.js';
import {createNarrationStage} from './narration-stage.js';
import {createEnvironmentDemonstration} from './environment-demonstration.js';
import {createGlobeAppearance} from './globe-appearance.js';
import {createEarthSurface} from './earth-surface.js';
import {createVisualFocus} from './visual-focus.js';
import {scenesForPlayback,sceneAtCharacter,timeAtCharacter,characterAtTime,captionAtTime} from './narration-clock.js';

// Release the boot-only input guard before controllers install their own modal
// focus rules. Do not overwrite those rules after the learning entry opens.
for(const node of document.querySelectorAll('[data-startup-inert]'))node.inert=false;
const D=window.ATLAS_DATA;
const $=id=>document.getElementById(id);
const audio=$('audio');
const chapters=D.chapters;
const crops=new Map(D.crops.map(c=>[c.id,c]));
const recordings=new Map((D.audioManifest?.chapters||[]).map(c=>[c.id,c]));
const colors={bg:'#101b22',ocean:'#213845',land:'#3b5055',border:'#91a3a4',grid:'#617780',typical:'#82c5a3',conditional:'#cda66d',unlisted:'#42585b',rivers:'#8fc2dc',groups:['#4e9dba','#c1a276','#74ad8a','#ab8fa9','#c0cacc']};
const grid=new Uint8Array(D.climate.width*D.climate.height);let offset=0;
for(const run of D.climate.runs){const n=Math.floor(run/32);grid.fill(run%32,offset,offset+n);offset+=n;}
if(offset!==grid.length)throw new Error('气候网格不完整');
let index=0,beatIndex=-1,recording=null,follow=true,freeRotation=false,loadToken=0,restoredTime=0,lastSaved=0;
let view={lon:108,lat:20},zoom=1,resizeObserver,frame=0,movement=0;
let labels=[],labelElements=[],currentMarkers=new THREE.Group(),lastCue=-2;
let layer='crop',selectedPoint=null,explorer=null,immersive=null,catalog=null,distribution=null;
let distributionRoute=null,routeTimer=0,routeLoading=false;
let globalEvidence=null,guidedCourse=null,learningFlatMap=null,courseDirectory=null;
let learning=null,learningMap=null,learningContext=null,geographyOrientation=null;
let globeGuides=null,guideControls=null;
let environmentDemonstration=null;
let narrationStage=null,narrationActive=false,narrationScenes=[],narrationKey='',narrationScene=null,narrationFollowing=true,narrationPreference=true,narrationCameraId='';
try{narrationPreference=JSON.parse(localStorage.getItem('plant-earth-narration-follow-v1')||'true')!==false;narrationFollowing=narrationPreference;}catch{}
const countryNames={CHN:'中国',IND:'印度',IDN:'印度尼西亚',RUS:'俄罗斯',BRA:'巴西',ARG:'阿根廷',USA:'美国',CAN:'加拿大',AUS:'澳大利亚',ZAF:'南非',EGY:'埃及',NGA:'尼日利亚',ETH:'埃塞俄比亚',FRA:'法国',ESP:'西班牙',IRN:'伊朗',SAU:'沙特阿拉伯',MEX:'墨西哥',PER:'秘鲁',KAZ:'哈萨克斯坦',MNG:'蒙古',TUR:'土耳其',TZA:'坦桑尼亚',COD:'刚果（金）',COL:'哥伦比亚',UKR:'乌克兰',SDN:'苏丹',DZA:'阿尔及利亚',NZL:'新西兰',JPN:'日本'};
const countries=D.world.features.filter(f=>countryNames[f.properties.id]).map(f=>{
  const geometry=f.geometry.type==='MultiPolygon'?f.geometry.coordinates.map(coordinates=>({type:'Polygon',coordinates})).sort((a,b)=>geoArea(b)-geoArea(a))[0]:f.geometry;
  return {text:countryNames[f.properties.id],point:geoCentroid(geometry),kind:'country'};
});
const climateNames={Af:'热带雨林',Am:'热带季风',Aw:'热带冬干',As:'热带夏干',BWh:'热沙漠',BWk:'冷沙漠',BSh:'热半干旱',BSk:'冷半干旱',Cfa:'温暖湿润、夏热',Cfb:'温和湿润、夏凉',Cfc:'温和湿润、短夏',Csa:'夏热干燥、冬季有雨',Csb:'夏凉干燥、冬季有雨',Csc:'夏干、短夏',Cwa:'冬干、夏热',Cwb:'冬干、夏凉',Cwc:'冬干、短夏',Dfa:'冷冬湿润、夏热',Dfb:'冷冬湿润、夏暖',Dfc:'冷冬湿润、短夏',Dfd:'严冬、短夏',Dwa:'冷冬干燥、夏热',Dwb:'冷冬干燥、夏暖',Dwc:'冷冬干燥、短夏',Dwd:'极寒干冬',Dsa:'冷冬夏干、夏热',Dsb:'冷冬夏干、夏暖',Dsc:'冷冬夏干、短夏',ET:'苔原',EF:'冰原'};
const formatTime=t=>{t=Math.max(0,Math.floor(t||0));return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');};
const normalize=text=>(text||'').replace(/[\p{P}\p{Z}\s]/gu,'');
const vector=(lon,lat,r=1.015)=>{const a=lat*Math.PI/180,b=lon*Math.PI/180;return new THREE.Vector3(r*Math.cos(a)*Math.cos(b),r*Math.sin(a),-r*Math.cos(a)*Math.sin(b));};
function lookup(lon,lat){lon=((lon+180)%360+360)%360-180;const x=Math.min(719,Math.max(0,Math.floor((lon+180)*2))),y=Math.min(359,Math.max(0,Math.floor((90-lat)*2)));return D.climate.classes[grid[y*720+x]];}
function match(code,crop){return crop?.typical.includes(code)?1:crop?.conditional.includes(code)?2:0;}
function make(tag,text,cls){const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;}
function save(){try{localStorage.setItem('crop-atlas-narrated-v1',JSON.stringify({chapterId:chapters[index].id,time:audio.currentTime||0,rate:audio.playbackRate,follow}));}catch{}}
function loadSaved(){try{const s=JSON.parse(localStorage.getItem('crop-atlas-narrated-v1'));if(s){const i=chapters.findIndex(c=>c.id===s.chapterId);if(i>=0){index=i;restoredTime=s.time||0;}if([.8,1,1.15,1.3].includes(s.rate))$('speed').value=String(s.rate);follow=s.follow!==false;}}catch{}}
loadSaved();

const globeRoot=$('globe');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setClearColor(0,0);
renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','带真实国界与河流的三维植物地球');globeRoot.prepend(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1.5,1.5,1.16,-1.16,.1,30);camera.position.set(0,0,4);
const globe=new THREE.Group();scene.add(globe);globe.add(currentMarkers);
const textureCanvas=document.createElement('canvas');textureCanvas.width=2880;textureCanvas.height=1440;
const ctx=textureCanvas.getContext('2d'),texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const material=new THREE.MeshStandardMaterial({map:texture,roughness:.94,metalness:0});
const earth=new THREE.Mesh(new THREE.SphereGeometry(1,128,80),material);globe.add(earth);
const locationPin=new THREE.Mesh(new THREE.SphereGeometry(.017,16,12),new THREE.MeshBasicMaterial({color:'#f5d393'}));locationPin.visible=false;globe.add(locationPin);
const globeAppearance=createGlobeAppearance({scene,globe});
const visualFocus=createVisualFocus({globe,camera,globeRoot,vector,requestDraw});
let naturalSurface=true;
const earthSurface=createEarthSurface({source:D.earthSurface,onReady:()=>paintTexture()});
const appearanceControls=make('nav',null,'globe-appearance-controls');appearanceControls.id='globe-appearance-controls';appearanceControls.setAttribute('aria-label','地球底图外观');
const surfaceButton=make('button','地表影像'),simpleButton=make('button','简洁底图'),surfaceCredit=make('a','NASA · 2004合成');surfaceButton.type=simpleButton.type='button';surfaceCredit.href=D.earthSurface?.sourceUrl||'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/';surfaceCredit.target='_blank';surfaceCredit.rel='noopener noreferrer';surfaceCredit.title='历史无云合成及地形阴影；不是当前植物分布、实时天气或高程测量。';appearanceControls.append(surfaceButton,simpleButton,surfaceCredit);globeRoot.append(appearanceControls);
function setNaturalSurface(value){naturalSurface=value;surfaceButton.setAttribute('aria-pressed',String(value));simpleButton.setAttribute('aria-pressed',String(!value));paintTexture();}surfaceButton.onclick=()=>setNaturalSurface(true);simpleButton.onclick=()=>setNaturalSurface(false);surfaceButton.setAttribute('aria-pressed','true');simpleButton.setAttribute('aria-pressed','false');
function layoutGlobeAppearance(){
  const fullMap=globalEvidence?.isEnabled()?globalEvidence.getState().fullMap:learningFlatMap?.getState().enabled&&learningFlatMap.getState().mode==='map'||distribution?.isEnabled()&&distribution.getState().mapOpen;appearanceControls.hidden=!!fullMap;
  if(appearanceControls.hidden)return;
  const rootBox=globeRoot.getBoundingClientRect(),visibleRect=selector=>{const element=document.querySelector(selector);if(!element||element.hidden||!element.getClientRects().length)return null;const style=getComputedStyle(element);if(style.visibility==='hidden'||style.display==='none')return null;return element.getBoundingClientRect();};
  const header=globalEvidence?.isEnabled()?visibleRect('.global-header'):learning?.isEnabled()?visibleRect('.learn-header'):visibleRect('.imm-header');
  let top=immersive?.isEnabled()?(header?.bottom||rootBox.top+70)-rootBox.top+12:12;
  const rightEdge=rootBox.right-(innerWidth<=760?10:20),controlLeft=rightEdge-158;
  for(const selector of ['.learn-panel','#learning-globe-actions','#globe-data-controls']){const box=visibleRect(selector);if(box&&box.left<rightEdge&&box.right>controlLeft&&box.height<185&&box.bottom-rootBox.top>=top&&box.top-rootBox.top<top+180)top=box.bottom-rootBox.top+9;}
  const guides=visibleRect('#globe-guide-controls');if(guides&&guides.right>rootBox.right-230&&guides.bottom-rootBox.top>=top&&guides.top-rootBox.top<top+130)top=guides.bottom-rootBox.top+9;
  if(globalEvidence?.isEnabled()&&innerWidth>760){top=(header?.bottom||rootBox.top+70)-rootBox.top+10;appearanceControls.style.left=(guides?guides.right-rootBox.left+10:20)+'px';appearanceControls.style.right='auto';}
  else if(learning?.isEnabled()&&innerWidth>760){const collapsed=document.querySelector('.learning-journey')?.classList.contains('learn-collapsed'),panel=visibleRect('.learn-panel');top=Math.max(header?.bottom||rootBox.top+70,collapsed?(panel?.bottom||0):0)-rootBox.top+10;appearanceControls.style.left=(collapsed&&guides?guides.right-rootBox.left+10:26)+'px';appearanceControls.style.right='auto';}else{appearanceControls.style.left='';appearanceControls.style.right='';}
  appearanceControls.style.top=top+'px';appearanceControls.dataset.ready=String(earthSurface.getState().ready);surfaceCredit.hidden=!naturalSurface;surfaceButton.title=earthSurface.getState().ready?'历史地表影像；国家统计、气候和原生引入填色仍覆盖在上层。':'影像加载后显示；原简图仍可使用。';
}
function syncVisualFocus(){
  let target=null;
  if(globalEvidence?.isEnabled())target=globalEvidence.getVisualFocus();
  else if(learning?.isEnabled()){
    const narrated=narrationStage?.getState(),mapped=learningMap?.getState(),point=narrated?.enabled?narrated.focus:mapped?.anchor||learningContext?.stop;
    if(point)target={id:narrated?.enabled?'narration:'+narrated.id:'lesson:'+learningContext?.mode+':'+mapped?.plantId,lon:point.lon,lat:point.lat,kind:mapped?.plantId?'plant':'geography',playing:!audio.paused,following:narrated?.enabled?narrated.following:follow,fullMap:learningFlatMap?.getState().mode==='map'};
  }else if(distribution?.isEnabled()){
    const state=distribution.getState(),point=(D.placements?.placements||[]).find(p=>p.id===state.previewPlacementId);
    if(point)target={id:point.id,lon:point.lon,lat:point.lat,kind:'plant',playing:!audio.paused,following:follow,fullMap:state.mapOpen};
  }else if(immersive?.isEnabled()){
    const beat=chapters[index]?.beats?.[Math.max(0,beatIndex)];if(beat)target={id:chapters[index].id+':'+beatIndex,lon:beat.lon,lat:beat.lat,kind:'plant',playing:!audio.paused,following:follow};
  }
  visualFocus.setFocus(target);visualFocus.beforeRender();
}
const projection=geoEquirectangular().translate([1440,720]).scale(2880/(2*Math.PI)).precision(.1),path=geoPath(projection,ctx);
function paintTexture(){
  const crop=crops.get(chapters[index].crop),referenceOnly=layer==='crop'&&crop?.mapModel==='reference-only',geographic=layer==='geography'||referenceOnly||globalEvidence?.isEnabled(),overview=layer==='climate'||!crop;
  const foundation=learningContext?.mode==='foundation';
  const referenceManaged=!!(immersive?.isEnabled()&&globeGuides);
  const surfaceImage=naturalSurface?earthSurface.getImage():null;
  ctx.fillStyle=foundation?'#234d6c':colors.ocean;ctx.fillRect(0,0,2880,1440);
  if(surfaceImage)ctx.drawImage(surfaceImage,0,0,2880,1440);
  else{ctx.fillStyle=foundation?'#527d61':colors.land;ctx.beginPath();path(D.world);ctx.fill();}
  const lessonCodes=learningContext?.mode==='environment'?new Set(learningContext.stop.climateCodes||[]):null;
  const palette=D.climate.classes.map(code=>lessonCodes?.size?(lessonCodes.has(code)?'#91cfa0':'#35494e'):overview?colors.groups['ABCDE'.indexOf(code[0])]||colors.land:match(code,crop)===1?colors.typical:match(code,crop)===2?colors.conditional:colors.unlisted);
  if(!geographic)for(let y=0;y<360;y++){let x=0;while(x<720){const c=grid[y*720+x];let end=x+1;while(end<720&&grid[y*720+end]===c)end++;if(c){ctx.fillStyle=palette[c];ctx.fillRect(x*4,y*4,(end-x)*4,4);}x=end;}}
  if(!foundation&&!referenceManaged){ctx.globalAlpha=.20;ctx.strokeStyle=colors.grid;ctx.lineWidth=.75;ctx.beginPath();path(geoGraticule10());ctx.stroke();}
  globalEvidence?.paint(ctx,path);
  ctx.globalAlpha=.5;ctx.strokeStyle=colors.border;ctx.lineWidth=.8;ctx.beginPath();path(D.world);ctx.stroke();
  if(!foundation){ctx.globalAlpha=.9;ctx.strokeStyle=colors.rivers;ctx.lineWidth=3.5;ctx.beginPath();path(D.rivers);ctx.stroke();}
  if($('latitude-lines').checked&&!foundation&&!referenceManaged){ctx.globalAlpha=.6;ctx.strokeStyle='#ece1ae';ctx.lineWidth=1.5;ctx.setLineDash([9,7]);for(const lat of [0,23.44,-23.44]){const y=(90-lat)*8;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2880,y);ctx.stroke();}ctx.setLineDash([]);}
  ctx.globalAlpha=1;texture.needsUpdate=true;requestDraw();
  const legend=$('legend');legend.replaceChildren();
  const entries=geographic?[['陆地',colors.land],['海洋',colors.ocean],['主要河流',colors.rivers]]:overview?[['热带',colors.groups[0]],['干旱',colors.groups[1]],['温带',colors.groups[2]],['冷温带',colors.groups[3]],['极地',colors.groups[4]]]:[['典型气候候选',colors.typical],['需额外条件',colors.conditional],['未纳入候选',colors.unlisted]];
  for(const [name,color] of entries){const e=make('span');const i=make('i');i.style.background=color;e.append(i,document.createTextNode(name));legend.append(e);}
  $('map-context').textContent=(referenceOnly?'本植物仅展示文献支持的代表地区 · 未计算全球适生范围':geographic?'真实国界与主要河流 · 无高程测量':'历史气候 1951–2000 · 0.5° 网格 · '+(overview?'颜色表示五大气候组':'颜色为气候候选，不表示实际农田'))+(surfaceImage?' · NASA 2004年4月地表合成底图，非当前植被':'')+(referenceManaged?' · 地理参考线可在“辅助标线”中切换':$('latitude-lines').checked?' · 虚线为赤道与回归线':'');
  document.querySelector('[data-layer="crop"]').textContent=crop?.mapModel==='reference-only'?'代表地区':'气候候选';
  immersive?.updateLegend();
  updateDistributionLayerLegend();
}
function updateDistributionLayerLegend(){const host=$('dist-layer-legend');if(!host)return;host.replaceChildren();host.hidden=layer==='geography';if(host.hidden)return;host.append(make('p',layer==='climate'?'历史气候 · 1951–2000':(crops.get(chapters[index].crop)?.name||'气候总览')+' · 当前底图'));const key=make('div',null,'legend');for(const item of $('legend').children)key.append(item.cloneNode(true));host.append(key);if(layer==='crop')host.append(make('p',$('map-context').textContent));}
function draw(){
  globe.rotation.set(view.lat*Math.PI/180,(-90-view.lon)*Math.PI/180,0,'XYZ');scene.updateMatrixWorld(true);if(globalEvidence?.isEnabled())immersive?.setNarrationMode(true);immersive?.beforeRender();layoutGlobeAppearance();distribution?.beforeRender();learningMap?.beforeRender();geographyOrientation?.beforeRender();globalEvidence?.beforeRender();globeGuides?.beforeRender();narrationStage?.beforeRender();syncVisualFocus();renderer.render(scene,camera);drawLabels();frame=0;
}
function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
function resize(){const w=globeRoot.clientWidth,h=globeRoot.clientHeight;if(!w||!h)return;const aspect=w/h;let vertical=Math.max(1.12,1.12/aspect)/zoom,offset=0,offsetX=0;if(immersive?.isEnabled()){let insets=(globalEvidence?.isEnabled()&&globalEvidence.getInsets?.())||(learning?.isEnabled()&&(learningFlatMap?.getInsets(learning.getInsets?.())||learning.getInsets?.()))||(distribution?.isEnabled()&&distribution.getInsets?.())||immersive.getInsets();if(learning?.isEnabled())insets=environmentDemonstration?.getInsets(insets)||insets;const available=Math.max(globalEvidence?.isEnabled()?60:150,h-insets.top-insets.bottom),availableWidth=Math.max(180,w-(insets.left||0)-(insets.right||0)),diameter=Math.min((learning?.isEnabled()||globalEvidence?.isEnabled())?availableWidth*.9:w*(w<700?.86:.61),available*.9);vertical=h/diameter/zoom/(insets.focusScale||1);const center=insets.top+available/2;offset=vertical*(center*2/h-1);if(learning?.isEnabled()||globalEvidence?.isEnabled())offsetX=vertical*aspect*(1-2*((insets.left||0)+availableWidth/2)/w);}camera.left=-vertical*aspect+offsetX;camera.right=vertical*aspect+offsetX;camera.top=vertical+offset;camera.bottom=-vertical+offset;camera.updateProjectionMatrix();renderer.setSize(w,h,false);globeRoot.dataset.earthViewport=JSON.stringify({left:w/2-offsetX*h/(2*vertical)-h/(2*vertical),top:h/2+offset*h/(2*vertical)-h/(2*vertical),diameter:h/vertical});learningFlatMap?.relayout();environmentDemonstration?.relayout();requestDraw();}
function moveTo(lon,lat,animate=true){
  cancelAnimationFrame(movement);const target={lon,lat:Math.max(-82,Math.min(82,lat))};
  if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){view=target;requestDraw();return;}
  const start={...view},delta=(((target.lon-start.lon+180)%360)+360)%360-180,t0=performance.now();
  function tick(now){const p=Math.min(1,(now-t0)/1200),e=p*p*(3-2*p);view={lon:start.lon+delta*e,lat:start.lat+(target.lat-start.lat)*e};requestDraw();if(p<1)movement=requestAnimationFrame(tick);}
  movement=requestAnimationFrame(tick);
}
function disposeMarkers(){for(const child of [...currentMarkers.children]){currentMarkers.remove(child);child.geometry?.dispose();child.material?.dispose();}}
function showMarkers(){
  disposeMarkers();const chapter=chapters[index],beats=chapter.beats||[],active=beats[Math.max(0,beatIndex)]||chapter;
  const points=chapter.labels?.length?chapter.labels:beats.map(b=>({text:b.label,lon:b.lon,lat:b.lat}));
  for(const point of points){if(!Number.isFinite(point.lon)||!Number.isFinite(point.lat))continue;const dot=new THREE.Mesh(new THREE.SphereGeometry(.009,12,8),new THREE.MeshBasicMaterial({color:'#f2ebbf'}));dot.position.copy(vector(point.lon,point.lat,1.011));currentMarkers.add(dot);}
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.015,16,12),new THREE.MeshBasicMaterial({color:'#f4edbe'}));dot.position.copy(vector(active.lon,active.lat,1.014));currentMarkers.add(dot);
  const circle=geoCircle().center([active.lon,active.lat]).radius(3.5).precision(5)();
  const vertices=circle.coordinates[0].map(([lon,lat])=>vector(lon,lat,1.008));
  const geometry=new THREE.BufferGeometry().setFromPoints(vertices);const ring=new THREE.LineLoop(geometry,new THREE.LineBasicMaterial({color:'#f1e5b1',transparent:true,opacity:.9}));currentMarkers.add(ring);
  buildLabels();requestDraw();
}
function buildLabels(){
  const chapter=chapters[index],beat=chapter.beats?.[Math.max(0,beatIndex)]||chapter;
  const nearest=(chapter.labels||[]).find(p=>geoDistance([p.lon,p.lat],[beat.lon,beat.lat])<.03);
  const geographicName=beat.shapeMode==='morphology'?(nearest?.text||'形态观察位置'):(beat.label||chapter.title);
  labels=selectedPoint?[{text:'选中网格',point:[selectedPoint.lon,selectedPoint.lat],kind:'selected'}]:[];
  labels.push({text:geographicName,point:[beat.lon,beat.lat],kind:'active'});
  for(const p of chapter.labels||[]){if(geoDistance([p.lon,p.lat],[beat.lon,beat.lat])>.025)labels.push({text:p.text,point:[p.lon,p.lat],kind:'region'});}
  const riverFeatures=D.rivers.features.filter(f=>geoDistance(f.properties.labelPosition,[beat.lon,beat.lat])<.65).sort((a,b)=>geoDistance(a.properties.labelPosition,[beat.lon,beat.lat])-geoDistance(b.properties.labelPosition,[beat.lon,beat.lat])).slice(0,3);
  for(const f of riverFeatures)labels.push({text:f.properties.name,point:f.properties.labelPosition,kind:'river'});
  labels.push(...countries);
  const host=$('map-labels');host.replaceChildren();labelElements=labels.map(label=>{
    const interactive=label.kind==='active'||label.kind==='region',e=make(interactive?'button':'span',label.text,'geo-label '+label.kind);if(interactive){e.type='button';e.setAttribute('aria-label','定位到'+label.text);const dot=make('span',null,'dot');e.prepend(dot);e.onclick=()=>{freeRotation=true;setFollowing(false);moveTo(...label.point);};}else e.setAttribute('aria-hidden','true');host.append(e);return e;
  });
}
function drawLabels(){
  const w=globeRoot.clientWidth,h=globeRoot.clientHeight,occupied=[];
  labels.forEach((label,i)=>{
    const e=labelElements[i];const p=vector(...label.point,1.018).applyMatrix4(globe.matrixWorld);const normal=p.clone().normalize();const toward=camera.position.clone().sub(p).normalize();
    if(learning?.isEnabled()){e.hidden=true;return;}
    if(immersive?.isEnabled()&&label.kind!=='country'&&label.kind!=='river'){e.hidden=true;return;}
    if(normal.dot(toward)<.12){e.hidden=true;return;}
    const screen=p.clone().project(camera);let x=(screen.x+1)/2*w,y=(1-screen.y)/2*h;
    if(label.kind==='active')y-=24;
    e.hidden=false;const ew=e.offsetWidth,eh=e.offsetHeight;
    if(x<ew/2+3||x>w-ew/2-3||y<eh/2+3||y>h-eh/2-3){e.hidden=true;return;}
    const box={x:x-ew/2-4,y:y-eh/2-4,w:ew+8,h:eh+8};
    if(occupied.some(b=>box.x<b.x+b.w&&box.x+box.w>b.x&&box.y<b.y+b.h&&box.y+box.h>b.y)){e.hidden=true;return;}
    if(label.kind==='country'&&occupied.filter(b=>b.kind==='country').length>5){e.hidden=true;return;}
    occupied.push({...box,kind:label.kind});e.style.left=x+'px';e.style.top=y+'px';
  });
}
function setFollowing(value){follow=value;$('follow').setAttribute('aria-pressed',String(follow));$('follow').textContent=follow?'跟随讲解':'自由查看';save();immersive?.onTime();}
let drag=null;
renderer.domElement.addEventListener('pointerdown',e=>{cancelAnimationFrame(movement);drag={x:e.clientX,y:e.clientY,lon:view.lon,lat:view.lat,moved:false};renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)drag.moved=true;if(drag.moved){freeRotation=true;view={lon:drag.lon-dx*.28,lat:Math.max(-82,Math.min(82,drag.lat+dy*.24))};requestDraw();}});
renderer.domElement.addEventListener('pointerup',e=>{if(drag?.moved){globalEvidence?.userExplore();setFollowing(false);if(narrationActive)setNarrationFollowing(false,false);}else if(drag){if(distribution?.pick(e)||immersive?.pick(e)){drag=null;return;}const bounds=renderer.domElement.getBoundingClientRect(),pointer=new THREE.Vector2((e.clientX-bounds.left)/bounds.width*2-1,-(e.clientY-bounds.top)/bounds.height*2+1),ray=new THREE.Raycaster();scene.updateMatrixWorld(true);ray.setFromCamera(pointer,camera);const hit=ray.intersectObject(earth)[0];if(hit){const p=globe.worldToLocal(hit.point.clone()).normalize();inspectPoint(Math.atan2(-p.z,p.x)*180/Math.PI,Math.asin(p.y)*180/Math.PI);}}drag=null;});
renderer.domElement.addEventListener('pointercancel',()=>{drag=null;});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.85,Math.min(1.7,zoom-e.deltaY*.001));resize();},{passive:false});
$('follow').onclick=()=>{if(narrationActive){setNarrationFollowing(!narrationFollowing);return;}setFollowing(!follow);if(follow){freeRotation=false;focusBeat();}};
$('focus').onclick=()=>{freeRotation=false;setFollowing(true);focusBeat();};
function setLayer(value){layer=value;document.querySelectorAll('[data-layer]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layer===value)));paintTexture();}
for(const button of document.querySelectorAll('[data-layer]'))button.onclick=()=>setLayer(button.dataset.layer);
$('latitude-lines').onchange=paintTexture;
$('zoom-in').onclick=()=>{zoom=Math.min(1.7,zoom+.15);resize();};$('zoom-out').onclick=()=>{zoom=Math.max(.85,zoom-.15);resize();};
function describeClimate(code){
  if(!code)return '此处没有可用的陆地气候网格。可能是海洋、小岛、海岸线尺度差异或资料空缺；不能据此判断适种。';
  const group={A:'全年暖热，关键差异往往在雨季、干季长度和排水。',B:'水分供给是主要限制。灌溉可改变田间条件，但需要核对水源、盐分和可持续性。',C:'具有季节差异，需把作物生育期与当地冷暖、干湿季节匹配。',D:'冬季寒冷；能种什么还取决于夏季热量、无霜期和品种成熟速度。',E:'低温和极短生长季限制明显，已有映射的作物未列入常规露地气候候选。'};
  return group[code[0]]||'需要结合当地气候资料进一步判断。';
}
function inspectPoint(lon,lat,move=false){
  if(globalEvidence?.isEnabled()){globalEvidence.onPoint(lon,lat);return;}
  if(learning?.isEnabled())return;
  lon=((lon+180)%360+360)%360-180;lat=Math.max(-90,Math.min(90,lat));selectedPoint={lon,lat};$('clear-point').hidden=false;$('point-lon').value=lon.toFixed(2);$('point-lat').value=lat.toFixed(2);freeRotation=true;setFollowing(false);if(narrationActive)setNarrationFollowing(false,false);locationPin.position.copy(vector(lon,lat,1.021));locationPin.visible=true;renderLocation();buildLabels();requestDraw();if(move)moveTo(lon,lat);immersive?.onPoint({lon,lat,code:lookup(lon,lat)});
  if(distribution?.isEnabled())distribution.onPoint?.({lon,lat,code:lookup(lon,lat)});
}
function renderLocation(){
  if(!selectedPoint)return;const {lon,lat}=selectedPoint,code=lookup(lon,lat),crop=crops.get(chapters[index].crop),host=$('location-content');host.replaceChildren();
  const title=make('div',null,'location-result-heading');title.append(make('strong',code?(code+' · '+climateNames[code]):'无可用气候网格'),make('span',`${Math.abs(lat).toFixed(2)}°${lat>=0?'N':'S'} / ${Math.abs(lon).toFixed(2)}°${lon>=0?'E':'W'}`));host.append(title,make('p',describeClimate(code)));
  if(!code)return;
  if(crop?.mapModel==='reference-only'){const selected=make('div',null,'location-current');selected.append(make('strong',crop.name+'：未建立全球适生模型'),make('p','本条目只提供有文献支持的代表地区。这里的历史气候不能证明该植物存在，也不能据此判断是否适生。'),make('p',crop.needs));host.append(selected);}
  else if(crop){const status=match(code,crop),selected=make('div',null,'location-current');selected.append(make('strong',crop.name+'：'+['未纳入当前气候候选','典型气候候选','需要额外条件'][status]),make('p',status===1?crop.needs+'。仍需核对品种、生长季、土壤与水源。':crop.limits));if(!status)selected.append(make('p','未纳入并不等于绝对不能种植；本图谱没有模拟设施农业或当地微气候。'));host.append(selected);}
  const typical=[...crops.values()].filter(c=>match(code,c)===1),conditional=[...crops.values()].filter(c=>match(code,c)===2);
  const details=make('details',null,'candidate-details');details.append(make('summary',`查看 ${[...crops.values()].filter(c=>c.mapModel!=='reference-only').length} 个已建立映射条目的候选 · 典型 ${typical.length} / 需条件 ${conditional.length}`));
  for(const [name,list] of [['典型气候候选',typical],['需要额外条件',conditional]]){details.append(make('h4',name));const row=make('div',null,'candidate-crops');for(const c of list){const b=make('button',c.name);b.onclick=()=>{setChapter(chapters.findIndex(ch=>ch.crop===c.id),false);inspectPoint(lon,lat,true);};row.append(b);}if(!list.length)row.append(make('span','本图谱未列入'));details.append(row);}host.append(details,make('p','这里没有该地点的实测温度、雨量或土壤值；候选仅根据历史气候类型归纳。','point-note'));
}
$('inspect-focus').onclick=()=>{const b=chapters[index].beats?.[Math.max(0,beatIndex)]||chapters[index];inspectPoint(b.lon,b.lat,true);};
$('coordinate-form').onsubmit=e=>{e.preventDefault();inspectPoint(Number($('point-lon').value),Number($('point-lat').value),true);};
$('clear-point').onclick=()=>{selectedPoint=null;locationPin.visible=false;$('clear-point').hidden=true;$('location-content').replaceChildren();buildLabels();requestDraw();};

function createChapters(){
  const nav=$('chapter-list');nav.replaceChildren();let group='';
  chapters.forEach((chapter,i)=>{
    if(chapter.group!==group){group=chapter.group;nav.append(make('div',group,'chapter-group'));}
    const b=make('button',null,'chapter-btn');b.type='button';b.dataset.index=String(i);b.setAttribute('aria-label',(i+1)+' '+chapter.title);
    b.append(make('span',String(i+1).padStart(2,'0'),'num'),make('span',crops.get(chapter.crop)?.name||chapter.title,'chapter-name'),make('span',formatTime(recordings.get(chapter.id)?.duration),'chapter-time'));
    b.onclick=()=>{const playing=!audio.paused;setChapter(i,playing);$('chapters').classList.remove('open');$('chapter-toggle').setAttribute('aria-expanded','false');};nav.append(b);
  });
}
$('crop-search').oninput=()=>{const query=$('crop-search').value.trim().toLocaleLowerCase();let count=0;document.querySelectorAll('.chapter-btn').forEach(b=>{const c=chapters[Number(b.dataset.index)],crop=crops.get(c.crop);b.hidden=!((c.title+' '+c.group+' '+[crop?.latin,...(crop?.synonyms||[])].join(' ')).toLocaleLowerCase().includes(query));if(!b.hidden)count++;});document.querySelectorAll('.chapter-group').forEach(g=>{let next=g.nextElementSibling,any=false;while(next&&!next.classList.contains('chapter-group')){if(!next.hidden)any=true;next=next.nextElementSibling;}g.hidden=!any;});$('search-status').textContent=query?(count?'找到 '+count+' 个章节':'没有找到相关植物，请换一个词。'):'';};
function renderPlant(){
  const chapter=chapters[index],crop=crops.get(chapter.crop),host=$('plant-diagram');
  if(crop){let caption='';if(crop.mapModel==='reference-only'){host.replaceChildren(renderMiniaturePreview(crop.id,{width:460,height:400}));const organs=make('div',null,'plant-organs');for(const part of chapter.morphology?.parts||[])organs.append(make('span',part));host.append(organs);caption=chapter.morphology?.note;}else{const result=renderMorphology(crop.id);host.innerHTML=typeof result==='string'?result:result.svg;caption=typeof result==='object'?result.caption:'';}$('morph-caption').textContent=caption||'结构示意，不按比例；品种之间存在差异。';$('latin').textContent=crop.latin;
    const needs=$('crop-needs');needs.replaceChildren();for(const [label,text] of [['环境偏好',crop.needs],['主要限制',crop.limits]]){const item=make('div');item.append(make('div',label,'need-label'),make('div',text,'need-text'));needs.append(item);}
  }else{
    $('latin').textContent='从形态理解植物，从地理理解生长';host.innerHTML='';const panel=make('div',null,'overview-plant');
    for(const [title,sub] of [['热量','季节节律与温度'],['水分','降水、水位与湿度'],['生境','基质、光照与盐度']]){const row=make('div',null,'overview-item');row.append(make('i',null,'overview-orb'));const text=make('div',title);text.append(make('span',sub));row.append(text);panel.append(row);}host.append(panel);$('morph-caption').textContent='多种条件共同作用，不能只按纬度或国家判断。';$('crop-needs').replaceChildren();
  }
}
function beatStarts(chapter,rec){
  const beats=chapter.beats||[];if(!beats.length)return [0];
  const cues=rec?.cues||[];const starts=[0];let consumed=0;const cueOffsets=[];let total=0;
  cues.forEach(c=>{cueOffsets.push(total);total+=normalize(c.text).length;});
  for(let b=1;b<beats.length;b++){
    consumed+=normalize(beats[b-1].text).length;
    let found=-1;const prefix=normalize(beats[b].text).slice(0,10);
    const exactOffset=chapter.text.indexOf(beats[b].text);
    if(exactOffset>=0&&cues.every(c=>Number.isFinite(c.textStart)&&Number.isFinite(c.textEnd))){
      const containing=cues.find(c=>c.textStart<=exactOffset&&c.textEnd>exactOffset);
      if(containing){
        // The subtitle boundaries are provider timestamps; camera cuts inside a cue
        // are estimated by character position, rather than presented as word alignment.
        const fraction=(exactOffset-containing.textStart)/Math.max(1,containing.textEnd-containing.textStart);
        starts.push(containing.start+fraction*(containing.end-containing.start));continue;
      }
      found=cues.findIndex(c=>c.textStart>=exactOffset);
    }
    if(found<0&&prefix)found=cues.findIndex(c=>normalize(c.text).includes(prefix));
    if(found<0)found=cueOffsets.findIndex((x,i)=>x>=consumed-3&&i>0);
    starts.push(found>=0?cues[found].start:Math.min(rec?.duration||0,(consumed/Math.max(1,normalize(chapter.text).length))*(rec?.duration||0)));
  }
  return starts;
}
let starts=[];
function focusBeat(){if(globalEvidence?.isEnabled())return;if(narrationActive&&narrationScene){setNarrationFollowing(true,false);return;}const chapter=chapters[index],b=chapter.beats?.[Math.max(0,beatIndex)]||chapter;moveTo(b.lon,b.lat);}
function updateBeat(next,force=false){
  if(next===beatIndex&&!force)return;beatIndex=next;const chapter=chapters[index],b=chapter.beats?.[next]||chapter;
  $('focus-label').textContent=b.label||chapter.title;const code=lookup(b.lon,b.lat);$('coordinates').textContent=(code||'沿海 / 无陆地网格')+' · '+Math.abs(b.lat).toFixed(1)+'°'+(b.lat>=0?'N':'S')+' / '+Math.abs(b.lon).toFixed(1)+'°'+(b.lon>=0?'E':'W');
  showMarkers();if(follow&&!freeRotation&&!narrationActive&&!globalEvidence?.isEnabled())moveTo(b.lon,b.lat);
  $('plant-diagram').classList.toggle('speaking',b.shapeMode==='morphology');
  const list=$('geography');list.replaceChildren();
  (chapter.beats||[]).forEach((beat,i)=>{const button=make('button',(i+1)+' '+(beat.shapeMode==='morphology'?'形态观察':beat.label||'观察点'),'geo-step'+(i===next?' active':''));button.type='button';button.onclick=()=>{freeRotation=false;setFollowing(true);if(recording&&audio.readyState>=1)audio.currentTime=starts[i]||0;updateBeat(i,true);sync();};list.append(button);});
  immersive?.onBeat();
}
function sync(){
  const t=audio.currentTime||0,duration=Number.isFinite(audio.duration)?audio.duration:recording?.duration||0;
  $('elapsed').textContent=formatTime(t);$('duration').textContent=formatTime(duration);$('seek').value=String(duration?Math.round(t/duration*1000):0);
  let next=0;for(let i=0;i<starts.length;i++)if(t+.01>=starts[i])next=i;updateBeat(next);
  const cues=recording?.cues||[];let ci=cues.findIndex(c=>t>=c.start&&t<c.end);if(ci<0){ci=cues.findLastIndex(c=>c.start<=t);}
  lastCue=ci;const currentCaption=captionAtTime(chapters[index],recording,t);if($('caption').textContent!==currentCaption)$('caption').textContent=currentCaption;
  const characterOffset=characterAtTime(chapters[index],recording,t);
  learning?.onTime({chapterId:chapters[index].id,characterOffset,playing:!audio.paused});
  syncNarration(characterOffset);
  $('dock-time').textContent=formatTime(t)+' / '+formatTime(duration);$('dock-subtitle').textContent=$('caption').textContent;
  immersive?.onTime();
  distribution?.onTime();renderDistributionPlayback();
  if(Date.now()-lastSaved>2500){lastSaved=Date.now();save();}
}
function setChapter(i,shouldPlay=false,startTime=0){
  if(!routeLoading){learning?.close();cancelDistributionRoute();if(distribution?.isEnabled())distribution.setEnabled(false);}
  const token=++loadToken;audio.pause();index=Math.max(0,Math.min(chapters.length-1,i));beatIndex=-1;lastCue=-2;freeRotation=false;
  const chapter=chapters[index];recording=recordings.get(chapter.id)||null;starts=beatStarts(chapter,recording);
  $('chapter-group').textContent=chapter.group;$('chapter-title').textContent=chapter.title;$('chapter-count').textContent=(index+1)+' / '+chapters.length+' 章';
  document.querySelectorAll('.chapter-btn').forEach((b,j)=>{b.classList.toggle('active',j===index);b.setAttribute('aria-current',j===index?'step':'false');});
  $('previous').disabled=index===0;$('next').disabled=index===chapters.length-1;
  $('caption').textContent=chapter.subtitle||chapter.beats?.[0]?.text||chapter.text;
  $('transcript').replaceChildren(...(chapter.beats||[{text:chapter.text}]).map(b=>{const p=make('p',b.text);p.style.marginBottom='10px';return p;}));
  $('sources').replaceChildren(...[...new Set(chapter.sources||[])].map(url=>{const known=(D.environment?.profiles||[]).find(p=>p.id===chapter.crop)?.sources.find(s=>s.url===url)||(D.evidence?.sources||[]).find(s=>s.url===url);const title=known?.title||(url.includes('ecocrop')?'FAO EcoCrop · '+(crops.get(chapter.crop)?.name||'作物资料'):new URL(url).hostname.replace(/^www\./,''));const a=make('a',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}));
  renderPlant();paintTexture();updateBeat(0,true);explorer?.render(chapter.crop);if(selectedPoint)renderLocation();$('dock-title').textContent=chapter.title;$('dock-next').disabled=index===chapters.length-1;$('dock-subtitle').textContent=$('caption').textContent;
  if(!follow){const first=chapter.beats?.[0]||chapter;moveTo(first.lon,first.lat);}
  if(recording){audio.src=recording.file;audio.playbackRate=Number($('speed').value);$('audio-status').textContent='MiniMax 合成旁白 · 字幕与地理镜头同步';
    const ready=()=>{if(token!==loadToken)return;if(startTime>0)audio.currentTime=Math.min(startTime,Math.max(0,audio.duration-.1));sync();if(startTime>0&&!follow&&!learning?.isEnabled()&&!globalEvidence?.isEnabled())focusBeat();if(shouldPlay&&!globalEvidence?.isEnabled())play();};audio.onloadedmetadata=ready;audio.load();
  }else{audio.removeAttribute('src');audio.load();$('audio-status').textContent='本章尚未提供录音。';$('duration').textContent='00:00';}
  for(const id of ['play','top-play','dock-play']){$(id).disabled=!recording;$(id).textContent='播放讲解';}$('elapsed').textContent='00:00';$('seek').value='0';
  immersive?.onChapter();
  distribution?.onChapter();
  if(startTime===0)save();
}
async function play({requestContinuation=true}={}){if(!recording)return;const token=loadToken;if(requestContinuation&&distributionRoute)distributionRoute.allowContinue=true;try{await audio.play();if(token===loadToken){$('play').textContent='暂停讲解';$('audio-status').textContent='MiniMax 合成旁白 · 字幕与地理镜头同步';}}catch(e){if(token===loadToken&&e.name!=='AbortError')$('audio-status').textContent='播放未开始，请再次点击播放按钮。';}}
audio.addEventListener('timeupdate',sync);
audio.addEventListener('play',()=>{for(const id of ['play','top-play','dock-play'])$(id).textContent='暂停讲解';});
audio.addEventListener('pause',()=>{const route=distributionRoute;if(audio.paused&&route&&!audio.ended&&!route.loading&&!route.advancing&&!route.finished)route.allowContinue=false;for(const id of ['play','top-play','dock-play'])$(id).textContent=audio.paused?'继续讲解':'暂停讲解';save();});
audio.addEventListener('ended',()=>{save();if(globalEvidence?.isEnabled())return;if(distributionRoute){if(!audio.ended||distributionRoute.loading)return;advanceDistributionRoute();return;}if(learning?.isEnabled()||distribution?.isEnabled()){renderDistributionPlayback();return;}if($('continuous').checked&&index<chapters.length-1)setChapter(index+1,true);else{for(const id of ['play','top-play','dock-play'])$(id).textContent='重播本章';$('audio-status').textContent=index===chapters.length-1?'完整导览播放完毕。':'本章播放完毕。';}});
audio.addEventListener('error',()=>{if(recording&&audio.getAttribute('src')){$('audio-status').textContent='音频读取失败，请确认演示文件与音频文件保存在一起。';$('play').textContent='重试播放';}});
$('play').onclick=()=>{if(learning?.isEnabled()&&!distributionRoute){const input=learningPlaybackInput();if(input)startDistributionRoute(input);return;}if(distribution?.isEnabled()&&!distributionRoute){const point=previewPlacement();startDistributionRoute(point?[{...point,beatIndex:0},point]:null);return;}if(distributionRoute?.finished){const items=[...distributionRoute.items];startDistributionRouteItems(items);return;}if(audio.paused){if(audio.ended)audio.currentTime=0;play();}else audio.pause();};
$('top-play').onclick=()=>{$('play').click();};
$('dock-play').onclick=()=>{$('play').click();};$('dock-next').onclick=()=>{$('next').click();};$('dock-caption').onclick=()=>{$('caption').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});};
$('previous').onclick=()=>setChapter(index-1,!audio.paused);
$('next').onclick=()=>setChapter(index+1,!audio.paused);
$('seek').addEventListener('input',()=>{if(audio.readyState>=1&&Number.isFinite(audio.duration)){if(distributionRoute)distributionRoute.allowContinue=false;audio.currentTime=Number($('seek').value)/1000*audio.duration;freeRotation=false;sync();}});
$('speed').onchange=()=>{audio.playbackRate=Number($('speed').value);save();};
$('chapter-toggle').onclick=()=>{const open=$('chapters').classList.toggle('open');$('chapter-toggle').setAttribute('aria-expanded',String(open));};
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
window.addEventListener('beforeunload',save);
$('follow').setAttribute('aria-pressed',String(follow));$('follow').textContent=follow?'跟随讲解':'自由查看';
$('runtime').textContent=chapters.length+' 章 · '+Math.round((D.audioManifest?.totalDuration||0)/60)+' 分钟';
function restoreLearningVisual(){
  if(!learning?.isEnabled()||!learningContext)return;
  const {mode,stop,plantId}=learningContext;
  if(mode==='foundation')foundationGeography(stop);
  else if(mode==='overview')learningMap.overview();
  else if(mode==='environment'||mode==='question')learningMap.focusStop(stop);
  else if(mode==='plant'){const point=teachingPlacement(plantId,stop);if(point)learningMap.focusPlant(stop,plantId,point);}
  else if(mode==='application'&&Number.isFinite(stop?.lon))learningMap.focusCase(stop);
  globeGuides?.setContext({scope:mode==='foundation'?'foundation':'learning',lesson:stop?.id||mode});guideControls?.relayout();
}
function clearNarration(){
  environmentDemonstration?.clear();
  if(!narrationActive)return;
  narrationActive=false;narrationKey='';narrationScene=null;narrationCameraId='';narrationScenes=[];
  narrationStage?.clear();immersive?.setNarrationMode(false);
  document.body.classList.remove('has-narration-scene','narration-playing');
  if(learning?.isEnabled())restoreLearningVisual();else{distribution?.setVisualsHidden(false);globeGuides?.setContext({scope:'explore'});}
  resize();requestDraw();
}
function syncNarration(characterOffset=null,forceFocus=false){
  if(!narrationStage)return;
  const route=distributionRoute;
  const eligible=!globalEvidence?.isEnabled()&&immersive?.isEnabled()&&recording&&(!distribution?.isEnabled()||route&&!route.loading&&route.activeChapter===chapters[index].id);
  if(!eligible){clearNarration();return;}
  const chapter=chapters[index],range=route?{start:route.clipStart,end:route.clipEnd}:null;
  const key=chapter.id+':'+(range?range.start+':'+range.end:'whole');
  if(key!==narrationKey){narrationKey=key;narrationScenes=scenesForPlayback(chapter,recording,range,crops);narrationCameraId='';}
  const position=characterOffset??characterAtPlayback(),next=sceneAtCharacter(narrationScenes,position);
  if(!next){clearNarration();return;}
  const changed=narrationScene?.id!==next.id;
  narrationScene=next;narrationActive=true;
  document.body.classList.add('has-narration-scene');document.body.classList.toggle('narration-playing',!audio.paused);
  immersive?.setNarrationMode(true);distribution?.setVisualsHidden(true);learningMap?.hide();geographyOrientation?.hide();
  if(changed||forceFocus){narrationStage.setScenes(narrationScenes,next.stepIndex);environmentDemonstration?.setScenes(narrationScenes,next.stepIndex);}
  narrationStage.setScene(next,{playing:!audio.paused,following:narrationFollowing});
  environmentDemonstration?.setScene(next,{playing:!audio.paused,following:narrationFollowing,currentTime:audio.currentTime||0});
  if(changed)learning?.applyNarrationScene?.(next,chapter.id);
  if(narrationFollowing&&(narrationCameraId!==next.id||forceFocus)){
    narrationCameraId=next.id;freeRotation=false;moveTo(next.focus.lon,next.focus.lat);
    globeGuides?.setContext({scope:'learning',lesson:next.guideLesson||next.effect,guideGroups:next.guideGroups,reason:next.lookAt,focus:next.focus});guideControls?.relayout();
  }
  if(changed||forceFocus){if(learning?.isEnabled())learningFlatMap?.setContext({lon:next.focus.lon,lat:next.focus.lat,title:next.focus.label||next.focus.region||next.lookAt||next.title||chapter.title,foundationStep:learningContext?.mode==='foundation'?learningContext.stop:undefined,stop:learningContext?.stop,pointMeaning:'当前语音的教学定位；不表示完整物种分布或适生范围。'});resize();}
}
function characterAtPlayback(){return characterAtTime(chapters[index],recording,audio.currentTime||0);}
function setNarrationFollowing(value,persist=true){
  narrationFollowing=!!value;if(persist){narrationPreference=narrationFollowing;try{localStorage.setItem('plant-earth-narration-follow-v1',JSON.stringify(narrationFollowing));}catch{}}
  setFollowing(narrationFollowing);if(narrationFollowing)narrationCameraId='';syncNarration(null,narrationFollowing);requestDraw();
}
function seekNarrationScene(targetIndex,targetScene){
  const target=targetScene||narrationScenes[targetIndex];if(!target||!recording||audio.readyState<1)return;
  let time=timeAtCharacter(chapters[index],recording,target.anchorOffset);
  if(distributionRoute){distributionRoute.allowContinue=false;time=Math.max(distributionRoute.clipStart,Math.min(time,distributionRoute.clipEnd-.03));distributionRoute.finished=false;}
  audio.currentTime=time;narrationFollowing=true;setFollowing(true);narrationCameraId='';sync();syncNarration(null,true);scheduleDistributionClip();
}
function cancelDistributionRoute(pause=false){clearTimeout(routeTimer);routeTimer=0;distributionRoute=null;clearNarration();learning?.endNarrationWatch?.();if(pause)audio.pause();}
function previewPlacement(){const state=distribution?.getState();return state?.previewPlacementId?(D.placements?.placements||[]).find(p=>p.id===state.previewPlacementId):null;}
function teachingPlacement(id,stop){return (D.placements?.placements||[]).filter(p=>p.cropId===id).sort((a,b)=>geoDistance([a.lon,a.lat],[stop.lon,stop.lat])-geoDistance([b.lon,b.lat],[stop.lon,stop.lat]))[0];}
function learningPlaybackInput(){return getLearningPlaybackInput(learningContext,teachingPlacement);}
function startDistributionRoute(input){
  if(learningContext?.mode==='foundation')learning?.prepareFoundationPlayback?.();
  const points=input==null?[{chapterId:chapters.find(c=>c.id.startsWith('plant-world-intro-'))?.id||'plant-world-map',beatIndex:null},{chapterId:'plant-world-map',beatIndex:null}]:Array.isArray(input)?input:[input];
  const items=points.map(p=>({chapterId:p.chapterId||p.id,beatIndex:Number.isInteger(p.beatIndex)?p.beatIndex:null,placementId:p.cropId?p.id:null,region:p.region||'全球概览',focus:Number.isFinite(p.lon)&&Number.isFinite(p.lat)?{lon:p.lon,lat:p.lat}:null})).filter(p=>chapters.some(c=>c.id===p.chapterId)&&recordings.has(p.chapterId));
  if(items.length)startDistributionRouteItems(items);
}
function startDistributionRouteItems(items){cancelDistributionRoute(true);narrationFollowing=learning?.isEnabled()?true:narrationPreference;learning?.beginNarrationWatch?.();distributionRoute={items,cursor:0,finished:false,clipStart:0,clipEnd:0,loading:false,allowContinue:true,advancing:false};loadDistributionRouteItem();}
function loadDistributionRouteItem(){
  const route=distributionRoute;if(!route)return;const item=route.items[route.cursor];route.loading=true;route.finished=false;clearTimeout(routeTimer);audio.pause();routeLoading=true;setChapter(chapters.findIndex(c=>c.id===item.chapterId),false);routeLoading=false;
  const token=loadToken;const ready=()=>{if(distributionRoute!==route||token!==loadToken)return;const b=item.beatIndex;route.clipStart=b==null?0:Math.min((starts[b]||0)+.02,audio.duration-.05);route.clipEnd=b==null?audio.duration:(starts[b+1]||audio.duration);route.activeChapter=item.chapterId;route.loading=false;freeRotation=false;setFollowing(true);audio.currentTime=route.clipStart;updateBeat(b??0,true);if(item.focus&&b===0){freeRotation=true;setFollowing(false);moveTo(item.focus.lon,item.focus.lat);}sync();route.advancing=false;play({requestContinuation:false});};
  if(audio.readyState>=1&&Number.isFinite(audio.duration))ready();else audio.addEventListener('loadedmetadata',ready,{once:true});
}
function advanceDistributionRoute(){
  const route=distributionRoute;if(!route||route.finished||route.loading)return;const allowContinue=route.allowContinue===true;clearTimeout(routeTimer);route.advancing=true;audio.pause();if(route.cursor+1<route.items.length){route.cursor++;loadDistributionRouteItem();}else{route.finished=true;setFollowing(false);learning?.endNarrationWatch?.();if(learning?.onNarrationFinished?.({chapterId:route.activeChapter,natural:true,allowContinue}))return;renderDistributionPlayback();}
}
function scheduleDistributionClip(){
  clearTimeout(routeTimer);routeTimer=0;const route=distributionRoute;if(!route||route.finished||route.loading||audio.paused||audio.seeking)return;
  const seconds=(route.clipEnd-audio.currentTime)/audio.playbackRate;routeTimer=setTimeout(()=>{if(distributionRoute!==route||audio.paused)return;if(audio.currentTime<route.clipEnd-.075){scheduleDistributionClip();return;}advanceDistributionRoute();},Math.max(20,seconds*1000));
}
function renderDistributionPlayback(){
  if(!distribution?.isEnabled())return;const route=distributionRoute;
  if(!route&&learning?.isEnabled()){
    const input=learningPlaybackInput(),items=Array.isArray(input)?input:[input],canPlay=items.some(item=>item&&recordings.has(item.chapterId));
    const preview=learningPlayerPreview(learningContext,crops,canPlay);
    $('imm-caption').textContent=preview.caption;$('imm-play').textContent=preview.label;$('imm-play').disabled=!canPlay;$('imm-seek').disabled=true;$('imm-seek').value='0';$('imm-elapsed').textContent='00:00';$('imm-duration').textContent='00:00';$('imm-prev').disabled=true;$('imm-next').disabled=true;$('imm-chapter-count').textContent=preview.stages;$('imm-audio-status').textContent=preview.status;return;
  }
  if(!route){const point=previewPlacement(),plant=point?crops.get(point.cropId):null;$('imm-caption').textContent=plant?`${plant.name}：${plant.needs}。点击播放，先认识它的形态，再听${point.region}的生长原因。`:'先看地球上的植物和中文名。点一种植物，就能看它长什么样、在哪里生长、为什么适应那里；也可以从水稻、小麦、玉米开始。';$('imm-play').textContent=plant?'听'+plant.name+'讲解':'听全球介绍';$('imm-play').disabled=false;$('imm-seek').disabled=true;$('imm-seek').value='0';$('imm-elapsed').textContent='00:00';$('imm-duration').textContent='00:00';$('imm-chapter-count').textContent=plant?'形态 → 地区 → 原因':'看形象 → 点植物 → 听原因';$('imm-prev').disabled=true;$('imm-next').disabled=true;$('imm-audio-status').textContent=plant?'MiniMax 讲解 · 围绕当前植物与地区':'小模型是植物形态示意 · 点名称可继续认识';return;}
  const item=route.items[route.cursor],chapter=chapters[index],beat=item.beatIndex==null?null:chapter.beats[item.beatIndex],duration=Math.max(0,route.clipEnd-route.clipStart),elapsed=Math.max(0,audio.currentTime-route.clipStart);
  if(beat){const cue=recording?.cues[lastCue],a=chapter.text.indexOf(beat.text),b=a+beat.text.length;const text=captionAtTime(chapter,recording,audio.currentTime,{startOffset:a,endOffset:b});$('imm-caption').textContent=text||beat.text;}
  else $('imm-caption').textContent=route.loading?chapter.beats?.[0]?.text||chapter.text:$('caption').textContent;
  $('imm-play').textContent=route.finished?'重听本次导览':audio.paused?'继续导览':'暂停导览';$('imm-play').disabled=false;$('imm-seek').disabled=route.loading;$('imm-elapsed').textContent=formatTime(Math.min(elapsed,duration));$('imm-duration').textContent=formatTime(duration);$('imm-seek').value=String(duration?Math.min(1000,Math.round(elapsed/duration*1000)):0);$('imm-chapter-count').textContent=(route.cursor+1)+' / '+route.items.length+' 段';$('imm-prev').disabled=route.cursor===0;$('imm-next').disabled=route.cursor===route.items.length-1;
  $('imm-audio-status').textContent=(route.finished?'本次导览已结束 · ':learning?.isEnabled()?'MiniMax 入门导览 · ':'MiniMax 地区导览 · ')+(route.cursor+1)+' / '+route.items.length+' · '+(item.region||chapter.title);
}
for(const event of ['playing','pause','seeked','ratechange','ended'])audio.addEventListener(event,()=>{scheduleDistributionClip();renderDistributionPlayback();syncNarration();});
explorer=initExplorer({data:D,crops,selectCrop:id=>setChapter(chapters.findIndex(c=>c.crop===id),false)});
function seekBeat(i,shouldPlay=false){const token=loadToken;freeRotation=false;setFollowing(true);const ready=()=>{if(token!==loadToken)return;audio.currentTime=Math.min((starts[i]||0)+.02,Math.max(0,audio.duration-.05));updateBeat(i,true);sync();if(shouldPlay)play();};if(audio.readyState>=1)ready();else audio.addEventListener('loadedmetadata',ready,{once:true});}
const currentState=()=>({index,beatIndex,chapter:chapters[index],recording,starts:[...starts],follow,layer,view:{...view}});
immersive=createImmersiveGlobe({data:D,crops,globe,camera,renderer,globeRoot,vector,requestDraw,resize,getCurrent:currentState,selectChapter:(id,playing=false)=>setChapter(chapters.findIndex(c=>c.id===id),playing),seekBeat,setLayer,moveTo,focusBeat,setFollowing,formatTime,audio,onEnabledChange:value=>{globeGuides?.setEnabled(value);guideControls?.setEnabled(value);if(!value)clearNarration();else syncNarration();},onDistributionTime:renderDistributionPlayback,onDistributionRequest:()=>distribution?.setEnabled(true),onLearningExit:()=>learning?.close(),onDistributionExit:()=>{learning?.close();if(distribution?.isEnabled())distribution.setEnabled(false);}});
catalog=createPlantCatalog({data:D,selectPlant:id=>{immersive.clearFilter();setChapter(chapters.findIndex(c=>c.crop===id),!audio.paused);},showOnGlobe:(ids,label)=>{distribution.setPlantFilter(ids,label);distribution.setEnabled(true);}});
distribution=createDistributionExplorer({data:D,crops,globe,camera,renderer,globeRoot,vector,requestDraw,moveTo,setLayer,setZoom:value=>{zoom=Math.max(.85,Math.min(1.7,value));resize();},lookup,audio,getCurrent:currentState,enterMap:()=>immersive.setEnabled(true),openCatalog:()=>catalog.open(),onNavigate:()=>{cancelDistributionRoute(true);renderDistributionPlayback();},onPreview:()=>{cancelDistributionRoute(true);renderDistributionPlayback();},onActiveChange:enabled=>{cancelDistributionRoute(true);$('imm-distribution').textContent='全球分布';$('imm-distribution').setAttribute('aria-pressed',String(enabled));document.querySelector('.imm-selects label').firstChild.textContent=enabled?'旁白章节':'讲解植物';document.body.classList.toggle('is-distribution',enabled);immersive.setDistributionMode(enabled);currentMarkers.visible=!enabled;locationPin.visible=!enabled&&!!selectedPoint;if(enabled){immersive.clearFilter();setLayer('geography');setFollowing(false);}else{$('imm-seek').disabled=false;immersive.onTime();}requestAnimationFrame(()=>{resize();renderDistributionPlayback();});},onSelectPlant:(id,placement)=>{cancelDistributionRoute(true);if(distribution.isEnabled())distribution.setEnabled(false);immersive.clearFilter();setChapter(chapters.findIndex(c=>c.crop===id),false);if(placement)seekBeat(placement.beatIndex,false);$('imm-distribution').textContent='返回地区';},onCompare:ids=>{explorer.compare(ids);immersive.openDetails();},onListen:startDistributionRoute});
const distributionLayerLegend=make('div');distributionLayerLegend.id='dist-layer-legend';distributionLayerLegend.hidden=true;document.querySelector('#distribution-ui .dist-dot-legend').after(distributionLayerLegend);
learningMap=createLearningMap({globe,camera,globeRoot,vector,requestDraw,stops:LEARNING_STOPS,crops,onSelectStop:i=>learning.selectStop(i)});
geographyOrientation=createGeographyOrientation({globe,camera,globeRoot,vector,requestDraw,moveTo,data:D,managedGuides:true});
function syncLearningFlatMap(){if(!learningFlatMap)return;const enabled=learning?.isEnabled()&&!globalEvidence?.isEnabled();learningFlatMap.setEnabled(enabled);if(!enabled||!learningContext)return;const c=learningContext,s=c.stop||{};learningFlatMap.setContext({lon:s.lon,lat:s.lat,title:s.title||s.label||'当前讲解位置',foundationStep:c.mode==='foundation'?s:undefined,stop:s,pointMeaning:s.mapNote||'教学案例定位；不是物种精确观测位置或完整分布。'});}
function setLearningFocus(mode,stop=null,plantId=null){
  if(mode==='overview'&&!stop)stop={id:'overview',title:'全球植物景观',summary:LEARNING_INTRO.summary,lon:35,lat:12};
  cancelDistributionRoute(true);learningContext={mode,stop,plantId};distribution.setVisualsHidden(true);geographyOrientation.hide();setFollowing(false);zoom=.98;
  globeGuides?.setContext({scope:'learning',lesson:stop?.id||mode,focus:stop?{lon:stop.lon,lat:stop.lat}:null});guideControls?.relayout();
  if(mode==='overview'){setLayer('climate');learningMap.overview();moveTo(25,12);}
  else if(mode==='environment'){setLayer(stop.climateCodes?.length?'climate':'geography');learningMap.focusStop(stop);moveTo(stop.lon,stop.lat);}
  else{const point=teachingPlacement(plantId,stop);if(point){setLayer('geography');learningMap.focusPlant(stop,plantId,point);moveTo(point.lon,point.lat);}}
  syncLearningFlatMap();resize();renderDistributionPlayback();
}
function foundationGeography(step,point=null){learningFlatMap?.setEnabled(learning?.isEnabled());learningFlatMap?.setContext({foundationStep:step,lon:point?.lon??step.lon,lat:point?.lat??step.lat,title:point?.label||step.title,pointMeaning:'本课地理参照位置；用于认识海陆、纬度与环境。'});const mode=['watercycle','forest','contrast'].includes(step.mode)?'rainforest':step.mode;const p=point||{lon:step.lon,lat:step.lat,label:step.id==='check-pattern'?'非洲 · 对照起点':step.id==='water-cycle'||step.id==='forest'||step.id==='rainforest'?'婆罗洲 · 东南亚':step.title};geographyOrientation.setMode(mode,{...p,path:p.label?.includes('撒哈拉')?'非洲 → 撒哈拉中部':p.label?.includes('非洲')?'非洲':p.label?.includes('南美')?'南美洲':'亚洲 → 东南亚 → 婆罗洲（岛屿）'});}
function setFoundationFocus(step){cancelDistributionRoute(true);learningContext={mode:'foundation',stop:step,plantId:null};distribution.setVisualsHidden(true);learningMap.hide();globeGuides?.setContext({scope:'foundation',lesson:step.id,focus:{lon:step.lon,lat:step.lat}});guideControls?.relayout();setFollowing(false);zoom=1;setLayer('geography');foundationGeography(step);moveTo(step.lon,step.lat);resize();renderDistributionPlayback();}
function setApplicationFocus(context){
  cancelDistributionRoute(true);const point=context.plantId?teachingPlacement(context.plantId,context):null;
  const location={...context,lon:point?.lon??context.lon,lat:point?.lat??context.lat,region:point?.region||context.label||context.title,mapNote:context.mapNote||(point?'栽培地区示例；模型与区域中心不表示现场、种植面积或完整范围。':'假设练习定位；条件以题目线索为准，不代表此点的实测环境或完整植物范围。')};
  learningContext={...context,mode:'application',stop:location};distribution.setVisualsHidden(true);geographyOrientation.hide();setFollowing(false);zoom=.98;setLayer('geography');
  if(Number.isFinite(location.lon)&&Number.isFinite(location.lat)){learningMap.focusCase(location);moveTo(location.lon,location.lat);}else learningMap.hide();
  globeGuides?.setContext({scope:'learning',lesson:context.plantId?'crops':'transfer',focus:location});guideControls?.relayout();resize();renderDistributionPlayback();
}
function setLessonContext(context){
  cancelDistributionRoute(true);learningContext={...context,stop:context.stop||context};
  distribution.setVisualsHidden(true);if(context.mode!=='question'){learningMap.hide();geographyOrientation.hide();setFollowing(false);setLayer('geography');globeGuides?.setContext({scope:'learning',lesson:context.mode});guideControls?.relayout();}
  renderDistributionPlayback();
}
learning=createLearningJourney({data:D,crops,distribution,audio,onProgress:location=>{guidedCourse?.onLearningProgress(location);syncLearningFlatMap();},onStageNext:(stage,options)=>guidedCourse?.onStageNext(stage,options),onRouteHome:()=>guidedCourse?.onRouteHome(),getStageNextLabel:stage=>guidedCourse?.getStageNextLabel(stage),getPlacement:teachingPlacement,onPause:()=>{cancelDistributionRoute(true);renderDistributionPlayback();},onFoundation:setFoundationFocus,onApplication:setApplicationFocus,onLessonContext:setLessonContext,onFoundationLocate:(point,step)=>{foundationGeography(step,point);moveTo(point.lon,point.lat);},onOverview:()=>setLearningFocus('overview'),onFocus:stop=>setLearningFocus('environment',stop),onPlant:(id,stop)=>setLearningFocus('plant',stop,id),onListen:input=>startDistributionRoute(input),onLayout:resize,requestDraw,onClose:()=>{learningFlatMap?.setEnabled(false);guidedCourse?.onLearningClose();cancelDistributionRoute(true);learningContext=null;globeGuides?.setContext({scope:'explore'});guideControls?.relayout();learningMap.hide();geographyOrientation.hide();distribution.setVisualsHidden(false);setLayer('geography');if(distribution.isEnabled())distribution.goGlobal();resize();renderDistributionPlayback();}});
globeGuides=createGlobeGuides({globe,camera,globeRoot,vector,requestDraw,onExplain:meta=>guideControls?.explain(meta)});
guideControls=createGlobeGuideControls({guides:globeGuides,getContext:()=>({learning:learning.isEnabled()}),onChange:state=>{$('latitude-lines').checked=state.groups.equator&&state.groups.tropics;requestDraw();}});
narrationStage=createNarrationStage({globe,camera,globeRoot,vector,requestDraw,onSeek:seekNarrationScene,onFollow:setNarrationFollowing});
environmentDemonstration=createEnvironmentDemonstration({data:D,onSeek:seekNarrationScene,onFollow:setNarrationFollowing,onLayout:resize});
$('latitude-lines').onchange=()=>{if(immersive.isEnabled()){globeGuides.setGroup('equator',$('latitude-lines').checked);globeGuides.setGroup('tropics',$('latitude-lines').checked);guideControls.sync();}else paintTexture();};
$('imm-exit').addEventListener('click',()=>learning.close(),{capture:true});
$('imm-distribution').onclick=()=>{if(learning.isEnabled())learning.close();else if(distribution.isEnabled())distribution.goGlobal();else if(distribution.getState().level==='plant')distribution.backToRegion();else distribution.setEnabled(true);};$('open-distribution').onclick=()=>distribution.setEnabled(true);
const defaultImmSeek=$('imm-seek').oninput;$('imm-seek').oninput=()=>{const route=distributionRoute;if(distribution.isEnabled()&&route&&!route.loading){route.allowContinue=false;route.finished=false;audio.currentTime=route.clipStart+Number($('imm-seek').value)/1000*Math.max(0,route.clipEnd-route.clipStart-.04);sync();scheduleDistributionClip();}else defaultImmSeek();};
for(const [id,delta] of [['imm-prev',-1],['imm-next',1]]){const fallback=$(id).onclick;$(id).onclick=()=>{if(distributionRoute&&distribution.isEnabled()){distributionRoute.allowContinue=false;const next=distributionRoute.cursor+delta;if(next>=0&&next<distributionRoute.items.length){distributionRoute.cursor=next;loadDistributionRouteItem();}}else fallback();};}
for(const event of ['play','playing','pause','ended','error','ratechange','seeked'])audio.addEventListener(event,renderDistributionPlayback);
$('imm-reset-view').onclick=()=>{if(distribution.isEnabled()){if(distribution.getState().regionId)distribution.backToRegion();else distribution.goGlobal();}else $('focus').click();};
$('open-catalog').onclick=()=>catalog.open();$('imm-catalog').onclick=()=>{learning.close();catalog.open();};$('imm-filter').onclick=()=>catalog.open();
$('catalog-total').textContent=D.crops.length+' 个代表植物条目';
createChapters();setChapter(index,false,restoredTime);resizeObserver=new ResizeObserver(resize);resizeObserver.observe(globeRoot);resize();$('loading').hidden=true;
document.body.dataset.ready='true';
globalEvidence=createGlobalEvidence({data:D,crops,getLearningGeographyContext:()=>{if(!learning?.isEnabled())return null;const point=narrationScene?.focus||learningMap?.getState().anchor||learningContext?.stop;return point&&Number.isFinite(point.lon)&&Number.isFinite(point.lat)?{...point,fullMap:learningFlatMap?.getState().mode==='map'}:null;},onRegionalOpen:()=>guidedCourse?.pauseForExplore(),onClassProgress:location=>guidedCourse?.onClassProgress(location),onMapProgress:location=>guidedCourse?.onMapProgress(location),onCourseNext:input=>guidedCourse?.onCourseNext(input),onCourseOpen:input=>guidedCourse?.onOpenCourse(input),onLectureComplete:input=>guidedCourse?.onLectureComplete(input),globe,camera,globeRoot,vector,requestDraw,moveTo,onLayout:resize,onChange:paintTexture,onOpen:()=>{audio.pause();learning.close();cancelDistributionRoute(true);distribution.setEnabled(false);immersive.setEnabled(true);clearNarration();immersive.setNarrationMode(true);currentMarkers.visible=false;locationPin.visible=false;setFollowing(false);setLayer('geography');globeGuides.setContext({scope:'explore'});},onClose:options=>{immersive.setNarrationMode(false);document.body.classList.remove('global-show-world');if(!guidedCourse?.onGlobalClose(options))learning.open();resize();},onNarratePlant:id=>{guidedCourse?.pauseForExplore();learning.close();distribution.setEnabled(false);setChapter(chapters.findIndex(c=>c.crop===id),true);}});
for(const selector of ['.learn-header-actions','.imm-header-actions','.topbar']){const parent=document.querySelector(selector);if(parent){const b=make('button','真实全球地图');b.className='global-open';b.onclick=()=>globalEvidence.open('rice','production');parent.prepend(b);}}
learningFlatMap=createLearningFlatMap({data:D,controlsHost:document.querySelector('.learn-panel-heading'),onModeChange:resize,onLayout:resize});
for(const id of ['continuous','imm-continuous']){const control=$(id);control.checked=isAutoContinueEnabled();control.addEventListener('change',()=>setAutoContinueEnabled(control.checked));}
subscribeAutoContinue(value=>{for(const id of ['continuous','imm-continuous'])$(id).checked=value;});
guidedCourse=connectGuidedLearning({learning,globalEvidence,audio,onLayout:resize,onOpenDirectory:()=>courseDirectory?.open()});
courseDirectory=createCourseDirectory({groups:createCourseDirectoryGroups(D),photos:D.plantPhotos?.photos,surface:D.earthSurface,onPause:()=>{audio.pause();globalEvidence.pause();if(distributionRoute?.loading)cancelDistributionRoute(true);},onSelect:createCourseDirectoryNavigator({guidedCourse,globalEvidence})});
for(const selector of ['.topbar','.imm-header-actions','.learn-header-actions','.global-head-actions','.guided-route-controls']){
  const parent=document.querySelector(selector);if(!parent)continue;
  const b=make('button','课程目录');b.type='button';b.className='course-directory-launch';b.setAttribute('aria-label','打开课程目录，按模块选课');b.onclick=()=>courseDirectory.open();parent.prepend(b);
  if(selector!=='.guided-route-controls'){const link=make('a','项目说明','project-overview-entry');link.href='about.html';link.setAttribute('aria-label','项目总览与后续计划');link.onclick=()=>{audio.pause();globalEvidence.pause();};parent.append(link);}
}

const learningEntry=document.getElementById('learn-start');if(learningEntry)learningEntry.onclick=()=>guidedCourse.showHome();
window.CROP_ATLAS={chapters,crops,recordings,lookup,setChapter,sync,inspectPoint,immersive,catalog,distribution,learning,globeGuides,guideControls,startDistributionRoute,getState:()=>({index,beatIndex,chapter:chapters[index].id,view:{...view},playing:!audio.paused,follow,starts:[...starts],layer,zoom,selectedPoint,explorer:explorer.getState(),immersive:immersive.getState(),catalog:catalog.getState(),distribution:distribution.getState(),learning:learning.getState(),learningMap:learningMap.getState(),guides:globeGuides.getState(),guideControls:guideControls.getState(),distributionRoute:distributionRoute?{items:distributionRoute.items.map(p=>({...p})),itemCount:distributionRoute.items.length,cursor:distributionRoute.cursor,finished:distributionRoute.finished,clipStart:distributionRoute.clipStart,clipEnd:distributionRoute.clipEnd,activeChapter:distributionRoute.activeChapter,loading:distributionRoute.loading}:null}),renderer};
const params=new URLSearchParams(location.search);if(['globe','distribution','learn','global'].includes(params.get('mode'))){const cropId=params.get('crop');if(cropId&&chapters.some(c=>c.crop===cropId))setChapter(chapters.findIndex(c=>c.crop===cropId),false);immersive.setEnabled(true);if(['distribution','learn'].includes(params.get('mode')))distribution.setEnabled(true);if(params.get('mode')==='learn')learning.open();if(params.get('mode')==='global')globalEvidence.open(crops.has(cropId)?cropId:'rice',params.get('layer')==='botanical'?'botanical':undefined);}

if(params.get('mode')==='global'&&(params.get('view')==='classes'||params.has('class')))globalEvidence.openClassroom(params.get('class'));

if(!params.has('mode')||params.get('mode')==='learn')guidedCourse.showHome();

if(params.get('mode')==='global'&&(params.has('course')||params.get('view')==='plants'))globalEvidence.openBiodiversity(params.get('course')||params.get('crop'));

if(params.get('mode')==='global'&&(params.get('view')==='regions'||params.has('region')))globalEvidence.openRegionalCourse({regionId:params.get('region')||undefined,cropId:params.get('crop')||undefined});

if(params.has('mode')&&params.get('mode')!=='learn'&&params.get('mode')!=='directory')guidedCourse.offerOrientation();
if(params.get('mode')==='directory'||params.get('view')==='directory')courseDirectory.open({groupId:params.get('module')||undefined,query:params.get('q')||undefined});

// Local startup diagnostics only. Exposed as DOM attributes for reproducible
// offline measurements; nothing is sent or stored in the user's learning data.
document.body.dataset.startupInteractiveMs=performance.now().toFixed(1);
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  document.body.dataset.startupFrameMs=performance.now().toFixed(1);
  document.body.dataset.startupComplete='true';
  window.dispatchEvent(new Event('atlas:ready'));
}));
