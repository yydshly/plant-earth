import * as THREE from 'three';
import {narrationTeachingFocus,queueTeachingFocus} from './teaching-focus.js';
import {createCropMiniature,supportedCropIds} from './plant-miniatures.js';

const NS='http://www.w3.org/2000/svg',TAU=Math.PI*2,Y=new THREE.Vector3(0,1,0);
const element=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const svgNode=(tag,attributes={})=>{const n=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attributes))n.setAttribute(key,String(value));return n;};
const EFFECT_NOTES={ocean:'海面、海岸与波纹为教学示意，不是海流或实时海况',wind:'海向陆输送的原理示意，不是当地实时风向或风速',terrain:'山地抬升与迎背风差异示意；不是真实高程或该地降雨预测',location:'代表地区定位，不是完整分布范围',equator:'赤道是定位参照，不是地面上的实线',hemispheres:'以赤道为参照看南北位置',sunlight:'同束光的方向与面积示意，不模拟实时日照',evaporation:'水汽位置示意；水汽本身看不见',cloud:'上升冷却、凝结成云的原理示意',rain:'云雨过程示意，不是当地实测天气',forest:'森林结构与层次示意，不按真实比例',canopy:'聚焦森林上层枝叶，不是林分测量',understory:'聚焦树冠下方，示意光照差异',plant:'植物识别示意，器官比例有放大',roots:'根与根区供水原理示意，不是地下实测',water:'水分可用性的原理示意，不是实测水位',cold:'低温影响示意，不是当地实时气温',season:'季节节律示意，各植物的节律并不相同',compare:'条件对照示意，不是两地实测值'};
const intersectArea=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const rect=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height});
const clamp=(value,low,high)=>Math.max(low,Math.min(high,value));

// A small pure contract makes the physical meaning inspectable without WebGL.
// Left-to-right arrows describe a teaching cross-section, never a map wind field.
export function getNarrationEnvironmentDiagram(scene={}){
  const hinted=scene.demonstration?.kind,phase=String(scene.demonstration?.phase??scene.phase??'');
  const kind=['ocean','wind','terrain'].includes(scene.effect)?scene.effect:['ocean','wind','terrain'].includes(hinted)?hinted:scene.effect==='compare'&&['terrain','limits'].includes(phase)?'terrain':null;
  return kind?{kind,phase:phase||({ocean:'basins',wind:'transport',terrain:'uplift'}[kind]),schematic:true,realTimeWind:false,actualElevation:false,flowDirection:kind==='terrain'?'迎风上升 → 背风下降':kind==='wind'?'海洋 → 陆地（教学截面）':null}:null;
}

/** A scene follows narration supplied by the application; it never owns audio. */
export function createNarrationStage({globe,camera,globeRoot,vector,requestDraw,onSeek,onFollow}){
  const root=new THREE.Group();root.name='narration-current-scene';root.visible=false;globe.add(root);
  const billboard=new THREE.Group(),worldEffects=new THREE.Group();root.add(worldEffects,billboard);
  const ringMaterial=new THREE.LineBasicMaterial({color:'#ffe6a1',transparent:true,opacity:.95,depthWrite:false});
  const ring=new THREE.LineLoop(new THREE.BufferGeometry(),ringMaterial);ring.name='narration-focus-ring';root.add(ring);
  const pin=new THREE.Mesh(new THREE.SphereGeometry(.012,12,8),new THREE.MeshBasicMaterial({color:'#fff1be',depthWrite:false}));pin.name='narration-region-anchor';root.add(pin);
  const host=element('section',null,'narration-stage');host.id='narration-stage';host.hidden=true;host.setAttribute('aria-label','当前旁白的观察位置与演示');globeRoot.append(host);
  const connector=svgNode('svg',{'aria-hidden':'true',class:'narration-connector'}),leader=svgNode('polyline',{fill:'none',stroke:'#f1d991','stroke-width':1.5}),leaderDot=svgNode('circle',{r:3,fill:'#f6dfa0'});connector.append(leader,leaderDot);connector.style.display='none';host.append(connector);
  const cueConnector=svgNode('svg',{'aria-hidden':'true',class:'narration-connector narration-cue-connectors'});cueConnector.style.display='none';host.append(cueConnector);
  const cueNodes=Array.from({length:4},(_,index)=>{const label=element('span',null,'narration-effect-label');label.id='narration-effect-label-'+index;label.hidden=true;const line=svgNode('line',{stroke:'#c5d8ae','stroke-width':1}),dot=svgNode('circle',{r:2,fill:'#d6e6be'});line.style.display='none';dot.style.display='none';cueConnector.append(line,dot);host.append(label);return {label,line,dot};});
  const tag=element('div',null,'narration-point-label');tag.id='narration-point-label';tag.hidden=true;tag.append(element('strong'),element('span'));host.append(tag);
  const card=element('aside',null,'narration-scene-card');card.id='narration-scene-card';card.innerHTML='<div class="narration-scene-heading"><span id="narration-scene-count"></span><strong id="narration-scene-title"></strong></div><p class="narration-look"><span>现在看哪里</span><strong id="narration-look-at"></strong></p><p class="narration-explain"><span>抓住这点</span><span id="narration-scene-explanation"></span></p><p id="narration-scene-status"></p><div class="narration-scene-controls"><button id="narration-previous" type="button" aria-label="上一幕">上一幕</button><button id="narration-follow" type="button" aria-pressed="true">跟随中</button><button id="narration-next" type="button" aria-label="下一幕">下一幕</button></div><nav id="narration-scene-steps" aria-label="旁白演示步骤"></nav>';
  host.append(card);const $=id=>host.querySelector('#'+id)||card.querySelector('#'+id);
  const detailsButton=element('button','展开说明','narration-details-toggle');detailsButton.id='narration-details';detailsButton.type='button';detailsButton.setAttribute('aria-expanded','false');detailsButton.onclick=()=>{const open=host.classList.toggle('narration-details-open');card.classList.toggle('narration-details-open',open);detailsButton.setAttribute('aria-expanded',String(open));detailsButton.textContent=open?'收起说明':'展开说明';requestDraw?.();};card.querySelector('.narration-scene-heading').append(detailsButton);
  const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  const ownedGeometries=new Set(),ownedMaterials=new Set(),movers=[],surfaceMarks=[];
  let environmentDiagram=null,renderEffect='location',current=null,enabled=false,playing=false,following=true,sequence=[],sequenceIndex=0,elapsed=0,lastFrame=0,animation=0,anchorVisible=false,cardRect=null,tagRect=null,targetOffset=new THREE.Vector3(0,.25,0),note='',uiKey='',cueSpecs=[],cueState=[];

  const ownGeometry=g=>{ownedGeometries.add(g);return g;};
  function material(color,opacity=1){const m=new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthTest:false,depthWrite:false,side:THREE.DoubleSide});ownedMaterials.add(m);return m;}
  function mesh(geometry,m,position=[0,0,0],scale=[1,1,1],parent=billboard){const object=new THREE.Mesh(ownGeometry(geometry),m);object.position.set(...position);object.scale.set(...scale);object.renderOrder=24;parent.add(object);return object;}
  function ball(position,scale,m,parent=billboard){return mesh(new THREE.SphereGeometry(1,12,8),m,position,scale,parent);}
  function line(a,b,color='#a9d6d8',radius=.009,parent=billboard){const start=new THREE.Vector3(...a),delta=new THREE.Vector3(...b).sub(start),length=delta.length();if(length<1e-8)return null;const object=mesh(new THREE.CylinderGeometry(radius,radius,length,6),material(color),start.addScaledVector(delta,.5).toArray(),[1,1,1],parent);object.quaternion.setFromUnitVectors(Y,delta.divideScalar(length));return object;}
  function arrow(a,b,color='#e9d793',parent=billboard){const start=new THREE.Vector3(...a),delta=new THREE.Vector3(...b).sub(start),length=delta.length();if(length<1e-8)return;line(a,b,color,.008,parent);const cone=mesh(new THREE.ConeGeometry(.035,.085,9),material(color),b,[1,1,1],parent);cone.quaternion.setFromUnitVectors(Y,delta.divideScalar(length));}
  function ellipse(position,scale,color='#f0d88b',parent=billboard){const points=Array.from({length:64},(_,i)=>new THREE.Vector3(Math.cos(i*TAU/64),Math.sin(i*TAU/64),0)),m=new THREE.LineBasicMaterial({color,transparent:true,opacity:.9,depthTest:false,depthWrite:false});ownedMaterials.add(m);const object=new THREE.LineLoop(ownGeometry(new THREE.BufferGeometry().setFromPoints(points)),m);object.position.set(...position);object.scale.set(...scale);object.renderOrder=26;parent.add(object);return object;}
  function surfaceArc(latitude,span=50,color='#f8dc93'){
    const points=Array.from({length:65},(_,i)=>vector(current.focus.lon-span/2+span*i/64,latitude,1.025));const m=new THREE.LineBasicMaterial({color,transparent:true,opacity:.9,depthWrite:false});ownedMaterials.add(m);const arc=new THREE.Line(ownGeometry(new THREE.BufferGeometry().setFromPoints(points)),m);arc.name='narration-latitude-focus';worldEffects.add(arc);return arc;
  }
  function soil(water=false){ball([0,-.025,0],[.50,.075,.11],material(water?'#5299b8':'#6a8051',.9));}
  function cloud(){const white=material('#e2edf0',.95);for(const [x,y,z,s] of [[-.20,.69,0,.16],[0,.75,.02,.22],[.22,.69,0,.17],[-.03,.61,.015,.19]])ball([x,y,z],[s,s*.65,s*.48],white);}
  function forest(){const leaf=material('#82b275'),shade=material('#527c5d');for(const [x,h] of [[-.30,.63],[.03,.87],[.30,.68]]){line([x,0,0],[x,h*.78,0],'#a8845b',.019);ball([x,h,0],[.22,.18,.12],leaf);}line([-.09,0,.08],[-.09,.23,.08],'#a0b382',.009);ball([-.09,.24,.08],[.12,.07,.045],shade);ball([.16,.14,.09],[.12,.05,.04],shade);}
  function polyline(points,color='#96d5e6',radius=.008){
    const objects=[];for(let i=1;i<points.length;i++)objects.push(line(points[i-1],points[i],color,radius));return objects;
  }
  function shape(points,color,name){
    const profile=new THREE.Shape();points.forEach(([x,y],i)=>i?profile.lineTo(x,y):profile.moveTo(x,y));profile.closePath();
    const object=mesh(new THREE.ExtrudeGeometry(profile,{depth:.08,bevelEnabled:false,steps:1}),material(color),[0,0,-.04]);object.name=name;return object;
  }
  function waves(left=-.67,right=.67,y=.02){
    shape([[left,y-.10],[right,y-.10],[right,y+.025],[left,y+.025]],'#397caa','narration-ocean-surface');
    for(let row=0;row<3;row++){const points=Array.from({length:24},(_,i)=>{const x=left+(right-left)*i/23;return [x,y+row*.045+Math.sin(i/23*TAU*3+row)*.012,.065];});polyline(points,'#a1dcea',.005);}
  }
  function flow(points,{color='#a7e0ef',count=5,type='flow',size=.023}={}){
    polyline(points,color,.009);arrow(points.at(-2),points.at(-1),color);
    const route=points.map(point=>new THREE.Vector3(...point));
    for(let i=0;i<count;i++){const particle=ball(points[0],[size,size*.75,size*.7],material(color));particle.name='narration-'+type+'-marker';movers.push({object:particle,type:'path',phase:i/count,path:route});}
  }
  function buildOcean(){
    const coast=environmentDiagram?.phase==='coast';waves(-.68,coast ? .16 : .68);
    if(coast){shape([[.16,-.08],[.67,-.08],[.67,.12],[.34,.13],[.16,.015]],'#7d9d6a','narration-coast-land');line([.19,.04,.07],[.33,.13,.07],'#e8d6a4',.017);}
    for(let i=0;i<4;i++){const ring=ellipse([-.32+i*.19,.06,.09],[.12,.035,1],'#b1e1e5');ring.name='narration-ocean-wave';movers.push({object:ring,type:'wave',phase:i/4,x:ring.position.x,y:ring.position.y});}
    if(!coast){note='太平洋、大西洋与印度洋标签连接各自海上参照；波纹不表示海流或实时海况';for(const [name,lon,lat]of [['太平洋',-142,1],['大西洋',-34,6],['印度洋',76,-26]]){
      const n=vector(lon,lat,1).normalize(),east=new THREE.Vector3(-Math.sin(lon*Math.PI/180),0,-Math.cos(lon*Math.PI/180)),north=new THREE.Vector3().crossVectors(n,east).normalize(),points=Array.from({length:48},(_,i)=>east.clone().multiplyScalar(Math.cos(i*TAU/48)*.045).addScaledVector(north,Math.sin(i*TAU/48)*.045));
      const m=new THREE.LineBasicMaterial({color:'#92deef',transparent:true,opacity:.7,depthTest:true,depthWrite:false});ownedMaterials.add(m);
      const marker=new THREE.LineLoop(ownGeometry(new THREE.BufferGeometry().setFromPoints(points)),m);marker.name='narration-ocean-reference-'+name;marker.position.copy(vector(lon,lat,1.035));worldEffects.add(marker);surfaceMarks.push({object:marker,lon,lat});movers.push({object:marker,type:'surface-pulse',phase:surfaceMarks.length/3});
    }}
    targetOffset.set(coast ? .16 : 0,.06,.11);
  }
  function buildWind(){
    waves(-.70,-.10);shape([[-.10,-.08],[.70,-.08],[.70,.09],[.15,.11],[-.10,.02]],'#7e9e68','narration-wind-land');
    flow([[-.64,.28,.10],[-.26,.37,.10],[.13,.41,.10],[.60,.43,.10]],{count:7});
    for(const x of [-.48,-.28])arrow([x,.09,.10],[x,.25,.10],'#83c8e1');
    if(environmentDiagram?.phase==='seasonal'){arrow([.59,.61,.10],[-.53,.61,.10],'#e8c48b');note='箭头示意输送方向可以改变；不是当地实时风场，也不表示所有季风都走同一路径';}
    targetOffset.set(.10,.40,.13);
  }
  function buildTerrain(){
    // The schematic ridge has a visibly raised crest and separate wet/dry sides.
    // It is not sampled DEM geometry, and the anchor does not name a real ridge.
    waves(-.80,-.46,-.03);
    shape([[-.46,-.10],[.03,-.10],[.03,.63],[-.11,.48],[-.26,.29]],'#719666','narration-mountain-windward');
    shape([[.03,-.10],[.74,-.10],[.58,.08],[.38,.22],[.19,.45],[.03,.63]],'#b79a68','narration-mountain-leeward');
    polyline([[-.46,.01,.10],[-.26,.29,.10],[-.11,.48,.10],[.03,.63,.10],[.19,.45,.10],[.38,.22,.10],[.58,.08,.10]],'#e4d5ad',.012);
    const lee=environmentDiagram?.phase==='leeward';
    flow([[-.72,.24,.15],[-.39,.30,.15],[-.23,.51,.15],[-.08,.80,.15]],{color:lee?'#8bb4ba':'#ace2ec',count:6});
    flow([[.04,.83,.15],[.26,.66,.15],[.43,.43,.15],[.68,.26,.15]],{color:'#edc585',count:4});
    const white=material('#e7eef0',.95);for(const [x,y,scale]of [[-.29,.83,.13],[-.13,.89,.16],[.02,.84,.13]])ball([x,y,.09],[scale,scale*.58,scale*.40],white);
    for(let i=0;i<5;i++){const drop=line([0,0,0],[0,-.08,0],'#91cce8',.008);drop.name='narration-windward-rain';movers.push({object:drop,type:'orographic-rain',phase:i/5,x:-.36+i*.075});}
    for(const [x,y]of [[.45,.12],[.59,.07]]){line([x-.06,y,.11],[x+.06,y,.11],'#d9b47c',.007);}
    targetOffset.set(lee ? .42 : -.13,lee ? .35 : .65,.17);
    note='迎风侧湿空气被迫上升冷却，条件合适才降雨；背风侧下降可能较暖较干。山形、左右方向与比例均为原理示意';
  }
  function buildCues(effect){
    const local=(label,x,y,z=.15)=>({label,position:new THREE.Vector3(x,y,z),space:'miniature'});
    if(['equator','hemispheres'].includes(effect))cueSpecs=[{label:'北半球',position:vector(current.focus.lon,35,1.035),space:'surface',lon:current.focus.lon,lat:35,tone:'north'},{label:'南半球',position:vector(current.focus.lon,-35,1.035),space:'surface',lon:current.focus.lon,lat:-35,tone:'south'}];
    else if(effect==='ocean')cueSpecs=environmentDiagram?.phase==='coast'?[local('海洋',-.36,.07),local('陆地与海岸',.43,.12)]:[['太平洋',-142,1],['大西洋',-34,6],['印度洋',76,-26]].map(([label,lon,lat])=>({label,lon,lat,position:vector(lon,lat,1.035),space:'surface'}));
    else if(effect==='wind')cueSpecs=[local('海洋水汽来源',-.48,.07),local('风携带水汽',.02,.42),local('陆地',.46,.10)];
    else if(effect==='terrain')cueSpecs=[local('迎风抬升',-.30,.40),local('上升冷却，可能降雨',-.16,.85),local('背风下降，可能较干',.43,.36)];
    else if(effect==='evaporation')cueSpecs=[local('水分蒸发',-.22,.07),local('上升',.24,.43)];
    else if(effect==='cloud')cueSpecs=[local('上升冷却',-.23,.43),local('凝结成云',.15,.74)];
    else if(effect==='rain')cueSpecs=[local('云滴',.20,.70),local('降雨',.20,.30)];
    else if(['forest','canopy','understory'].includes(effect)){cueSpecs=[local('树冠',.30,.74,.17),local('林下',.16,.18,.17)];if(effect==='understory')cueSpecs.reverse();}
    else cueSpecs=[];
    cueState=cueSpecs.map(({label,space,lon,lat})=>({label,space,...space==='surface'?{lon,lat}:{},visible:false,rect:null}));
    cueNodes.forEach(({label},index)=>{const spec=cueSpecs[index];label.hidden=true;label.textContent=spec?.label||'';label.dataset.anchorSpace=spec?.space||'';label.dataset.tone=spec?.tone||'process';});
  }
  function buildEffect(){
    environmentDiagram=getNarrationEnvironmentDiagram(current);renderEffect=environmentDiagram?.kind||current.effect||'location';
    const effect=renderEffect,scarce=effect==='water'&&/scarce|drought|dry|缺水|干旱/.test(String(current.phase||current.id));note=EFFECT_NOTES[effect]||EFFECT_NOTES.location;targetOffset.set(0,.25,0);if(!['location','equator','hemispheres','sunlight','roots','ocean','wind','terrain'].includes(effect))soil(effect==='evaporation'||(effect==='water'&&!scarce));
    if(effect==='ocean')buildOcean();
    else if(effect==='wind')buildWind();
    else if(effect==='terrain')buildTerrain();
    else if(effect==='equator'){surfaceArc(0,76);targetOffset.set(0,.04,0);}
    else if(effect==='hemispheres'){surfaceArc(0,76);surfaceArc(35,55,'#b9d9a2');surfaceArc(-35,55,'#94c7df');arrow([-.14,.06,0],[-.14,.53,0]);arrow([.14,.04,0],[.14,-.39,0],'#9dcddd');targetOffset.set(0,.05,0);}
    else if(effect==='sunlight'){
      const slant=/slant|oblique|斜/.test(String(current.phase||current.id)),angle=slant?Math.PI/3:0,half=.16/Math.cos(angle);
      ball([0,.03,.03],[half,.04,.04],material('#e5c96f',.9));for(const k of [-1,0,1]){const x=k*.14/Math.cos(angle);arrow([x-.70*Math.sin(angle),.04+.70*Math.cos(angle),.02],[x,.05,.02]);}targetOffset.set(0,.04,.03);
    }else if(['evaporation','cloud','rain'].includes(effect)){
      if(effect!=='evaporation')cloud();
      const blue=material('#94d0d9',.9);
      if(effect!=='rain'){for(const x of [-.26,0,.26])arrow([x,.05,.03],[x,.56,.03],'#85cbd2');for(let i=0;i<7;i++){const p=ball([0,0,.05],[.024,.035,.025],blue);movers.push({object:p,type:'rise',phase:i/7,x:(i%3-1)*.23});}targetOffset.set(0,effect==='cloud'?.72:.38,.06);}
      else{for(let i=0;i<8;i++){const p=line([0,0,0],[0,-.12,0],'#89c4eb',.01);movers.push({object:p,type:'rain',phase:i/8,x:(i%4-1.5)*.15});}targetOffset.set(0,.36,.06);}
    }else if(['forest','canopy','understory'].includes(effect)){
      forest();if(effect==='understory'){ellipse([.03,.20,.11],[.28,.14,1]);arrow([-.26,.93,.13],[-.26,.56,.13],'#b3c890');targetOffset.set(.02,.22,.12);}
      else{for(const x of [-.24,0,.24])arrow([x,1.12,.02],[x,.88,.02]);if(effect==='canopy')ellipse([.03,.80,.12],[.47,.23,1]);targetOffset.set(.03,effect==='canopy'?.80:.5,.14);}
    }else if(effect==='plant'||effect==='location'&&current.plantId){
      if(current.plantId&&supportedCropIds.includes(current.plantId)){
        const model=createCropMiniature(current.plantId);model.name='narration-plant-'+current.plantId;model.traverse(object=>{if(!object.isMesh)return;object.renderOrder=25;const clone=m=>{const copy=m.clone();copy.depthTest=false;copy.depthWrite=false;ownedMaterials.add(copy);return copy;};object.material=Array.isArray(object.material)?object.material.map(clone):clone(object.material);});billboard.add(model);
        // Existing miniatures identify species, but do not expose reliable organ
        // meshes. Highlight the whole teaching model rather than inventing a
        // precise anatomical target from an arbitrary mesh position.
        if(current.organ){ellipse([0,.5,.17],[.40,.55,1]);note='看“'+String(current.organ)+'”的识别示意；高亮整株，不是精确器官定位';}targetOffset.set(0,.52,.18);
      }else{note='当前仅定位代表地区；未提供可用植物模型';targetOffset.set(0,.05,0);}
    }else if(effect==='roots'&&(/water-air|aerial/.test(String(current.phase))||current.plantId==='orchid')){
      // Epiphytic orchid roots are exposed around a support, not buried in a
      // soil cross-section. This is a functional sketch, not anatomy at scale.
      line([-.43,.38,0],[.43,.38,0],'#a8845b',.045);
      const leaf=material('#89b783');ball([-.10,.56,.02],[.18,.07,.035],leaf);ball([.11,.59,.02],[.19,.065,.035],leaf);
      for(let i=0;i<5;i++){const x=(i-2)*.11;line([x,.39,.04],[x+.025,.22,.06],'#d8d3a6',.012);line([x+.025,.22,.06],[x-.04,.06+(i%2)*.04,.065],'#d8d3a6',.012);}
      arrow([-.43,.12,.09],[-.15,.19,.09],'#95cbd8');arrow([.42,.22,.09],[.16,.22,.09],'#d7e9bf');
      note='附生根接触水与空气的功能示意；树枝提供支撑，不是土中根系';targetOffset.set(0,.19,.10);
    }else if(effect==='roots'){
      mesh(new THREE.PlaneGeometry(1,.50),material('#806847',.9),[0,-.22,-.05]);line([0,.35,.02],[0,-.08,.02],'#90b77d',.02);for(let i=0;i<5;i++){const x=(i-2)*.17;line([0,-.04,.03],[x,-.35-(i%2)*.05,.03],'#dfc09a',.012);}for(const x of [-.31,.31])arrow([x,-.36,.08],[x*.4,-.08,.08],'#91cdd5');targetOffset.set(0,-.22,.10);
    }else if(effect==='water'){
      if(scarce){note='少量水分与干土的对照示意，不是实测干旱程度';for(const [a,b] of [[[-.28,-.02,.13],[.06,.01,.13]],[[.06,.01,.13],[.24,-.04,.13]],[[.06,.01,.13],[.16,.05,.13]]])line(a,b,'#d0ae7e',.008);ball([-.31,.24,.09],[.022,.035,.021],material('#8dc8dd'));line([.12,0,.02],[.12,.34,.02],'#9ba36e',.014);line([.12,.34,.02],[.28,.23,.02],'#9ba36e',.013);ellipse([-.31,.24,.10],[.075,.075,1],'#d8bf80');targetOffset.set(.12,.12,.10);}
      else{for(let i=0;i<4;i++){const drop=ball([0,0,.08],[.035,.055,.025],material('#8dc8dd'));movers.push({object:drop,type:'water',phase:i/4,x:0});}ellipse([0,.02,.13],[.44,.10,1],'#99d2e2');arrow([-.37,.32,.08],[0,.09,.08],'#9cd9e1');targetOffset.set(0,.03,.10);}
    }else if(effect==='cold'){
      const m=material('#c3e4ef');for(let i=0;i<3;i++){const x=(i-1)*.27,y=.42+(i%2)*.18;for(let j=0;j<3;j++){const a=j*Math.PI/3;line([x-Math.cos(a)*.08,y-Math.sin(a)*.08,.03],[x+Math.cos(a)*.08,y+Math.sin(a)*.08,.03],'#c3e4ef',.007);}arrow([x,y-.13,.03],[x,.07,.03],'#a8d9e5');}targetOffset.set(0,.48,.04);
    }else if(effect==='season'){
      const colors=['#91c6b9','#e4c983','#a9b3c4'];for(let i=0;i<3;i++){const x=(i-1)*.34;ellipse([x,.35,.02],[.13,.13,1],colors[i]);ball([x,.35,.02],[.055,.055,.03],material(colors[i]));if(i<2)arrow([x+.16,.35,.03],[x+.24,.35,.03],colors[i]);}targetOffset.set(0,.35,.04);
    }else if(effect==='compare'){
      for(const [x,color] of [[-.28,'#80bdcd'],[.28,'#d6bd83']]){ball([x,.20,.03],[.18,.18,.06],material(color,.85));}arrow([-.10,.20,.08],[.10,.20,.08]);targetOffset.set(0,.20,.09);
    }else{arrow([0,.38,0],[0,.06,0]);targetOffset.set(0,.03,0);}
    buildCues(effect);applyMotion();
  }
  function disposeEffect(){billboard.clear();worldEffects.clear();for(const resource of ownedGeometries)resource.dispose();for(const resource of ownedMaterials)resource.dispose();ownedGeometries.clear();ownedMaterials.clear();movers.length=0;surfaceMarks.length=0;}
  function updateRing(){const {lon,lat}=current.focus,n=vector(lon,lat,1).normalize(),east=new THREE.Vector3(-Math.sin(lon*Math.PI/180),0,-Math.cos(lon*Math.PI/180)),north=new THREE.Vector3().crossVectors(n,east).normalize(),angle=.073,points=Array.from({length:72},(_,i)=>n.clone().multiplyScalar(Math.cos(angle)).addScaledVector(east,Math.sin(angle)*Math.cos(i*TAU/72)).addScaledVector(north,Math.sin(angle)*Math.sin(i*TAU/72)).multiplyScalar(1.022));ring.geometry.dispose();ring.geometry=new THREE.BufferGeometry().setFromPoints(points);pin.position.copy(vector(lon,lat,1.025));billboard.position.copy(vector(lon,lat,1.036));}
  function applyMotion(){for(const mover of movers){const t=(elapsed*.35+mover.phase)%1;if(mover.type==='rise')mover.object.position.set(mover.x+Math.sin(t*TAU)*.025,.07+t*.54,.07);else if(mover.type==='rain')mover.object.position.set(mover.x,.56-t*.49,.10);else if(mover.type==='path'){const scaled=t*(mover.path.length-1),index=Math.min(mover.path.length-2,Math.floor(scaled));mover.object.position.lerpVectors(mover.path[index],mover.path[index+1],scaled-index);}else if(mover.type==='orographic-rain')mover.object.position.set(mover.x,.77-t*.33,.16);else if(mover.type==='surface-pulse'){mover.object.scale.setScalar(.75+t*.6);mover.object.material.opacity=.25+(1-t)*.55;}else if(mover.type==='wave'){mover.object.scale.x=.09+t*.07;mover.object.scale.y=.025+t*.025;mover.object.material.opacity=.25+(1-t)*.65;}else mover.object.position.set(-.45+t*.50,.15+Math.sin(t*Math.PI)*.08,.09);}}
  function canAnimate(){return enabled&&playing&&following&&movers.length>0&&!reduced.matches&&!document.hidden;}
  function tick(now){animation=0;if(!canAnimate()){lastFrame=0;return;}if(lastFrame)elapsed+=Math.min(.06,Math.max(0,(now-lastFrame)/1000));lastFrame=now;applyMotion();requestDraw?.();animation=requestAnimationFrame(tick);}
  function updateAnimation(){if(!canAnimate()){if(animation)cancelAnimationFrame(animation);animation=0;lastFrame=0;}else if(!animation)animation=requestAnimationFrame(tick);}
  function seek(index){if(index<0||index>=sequence.length)return;onSeek?.(index,sequence[index]);}
  function renderSteps(){const nav=$('narration-scene-steps');nav.replaceChildren();const count=sequence.length||current?.stepCount||1,index=sequence.length?sequenceIndex:Number.isInteger(current?.stepIndex)?current.stepIndex:0;const begin=clamp(index-2,0,Math.max(0,count-5));for(let i=begin;i<Math.min(count,begin+5);i++){const button=element('button',String(i+1));button.type='button';button.dataset.sceneIndex=String(i);button.setAttribute('aria-label','第'+(i+1)+'幕：'+(sequence[i]?.title||''));button.setAttribute('aria-current',i===index?'step':'false');button.disabled=!sequence.length||!onSeek;button.onclick=()=>seek(i);nav.append(button);}updateControls();}
  function updateControls(){const count=sequence.length||current?.stepCount||1,index=sequence.length?sequenceIndex:Number.isInteger(current?.stepIndex)?current.stepIndex:0;$('narration-scene-count').textContent='第 '+(index+1)+' / '+count+' 幕';$('narration-previous').disabled=!onSeek||!sequence.length||index<=0;$('narration-next').disabled=!onSeek||!sequence.length||index>=count-1;const follow=$('narration-follow');follow.setAttribute('aria-pressed',String(following));follow.textContent=following?'跟随中':'回到当前讲解';follow.title=following?'拖动地球可以自由观察':'回到当前旁白正在说明的位置';}
  function updateText(){const key=[current?.title,current?.lookAt,current?.explain,current?.focus?.label,note].join('|');if(key!==uiKey){uiKey=key;$('narration-scene-title').textContent=current.title||'跟着旁白观察';$('narration-look-at').textContent=current.lookAt||current.focus.label||'当前高亮位置';$('narration-scene-explanation').textContent=current.explain||note;tag.querySelector('strong').textContent=current.focus.label||current.lookAt||'当前看点';tag.querySelector('span').textContent=note;queueTeachingFocus(narrationTeachingFocus(current));}host.dataset.sceneId=current.id;host.dataset.effect=current.effect||'location';host.dataset.renderEffect=renderEffect;host.dataset.playing=String(playing);host.dataset.following=String(following);updateControls();}
  function setScenes(scenes,index=0){const next=Array.isArray(scenes)?scenes:[],ids=next.map(scene=>scene.id).join('|'),oldIds=sequence.map(scene=>scene.id).join('|'),oldIndex=sequenceIndex,oldBegin=clamp(oldIndex-2,0,Math.max(0,sequence.length-5));sequence=next;sequenceIndex=clamp(Number.isInteger(index)?index:0,0,Math.max(0,next.length-1));const begin=clamp(sequenceIndex-2,0,Math.max(0,next.length-5));if(ids!==oldIds||begin!==oldBegin)renderSteps();else if(oldIndex!==sequenceIndex){for(const button of $('narration-scene-steps').children)button.setAttribute('aria-current',Number(button.dataset.sceneIndex)===sequenceIndex?'step':'false');updateControls();}requestDraw?.();}
  function setScene(scene,{playing:nextPlaying=false,following:nextFollowing=true}={}){
    if(!scene||!Number.isFinite(scene.focus?.lon)||!Number.isFinite(scene.focus?.lat)){clear();return;}
    const id=String(scene.id||'narration-scene'),changed=!current||id!==current.id;current={...scene,id,focus:{...scene.focus}};enabled=true;playing=!!nextPlaying;following=!!nextFollowing;root.visible=true;host.hidden=false;card.hidden=false;host.dataset.enabled='true';document.body.classList.add('has-narration-stage');globeRoot.classList.add('has-narration-stage');
    if(changed){disposeEffect();elapsed=0;lastFrame=0;updateRing();buildEffect();uiKey='';if(sequence.length){const index=sequence.findIndex(item=>String(item.id)===current.id);if(index>=0)sequenceIndex=index;}renderSteps();}
    updateText();updateAnimation();requestDraw?.();
  }
  function clear(){enabled=false;playing=false;current=null;environmentDiagram=null;renderEffect='location';anchorVisible=false;cardRect=null;tagRect=null;cueSpecs=[];cueState=[];hideCues();root.visible=false;host.hidden=true;card.hidden=true;host.dataset.enabled='false';host.dataset.playing='false';host.dataset.anchorVisible='false';tag.hidden=true;connector.style.display='none';document.body.classList.remove('has-narration-stage');globeRoot.classList.remove('has-narration-stage');updateAnimation();requestDraw?.();}
  function project(position){const world=position.clone().applyMatrix4(globe.matrixWorld),normal=world.clone().normalize(),toward=camera.position.clone().sub(world).normalize(),screen=world.project(camera);return {x:(screen.x+1)*globeRoot.clientWidth/2,y:(1-screen.y)*globeRoot.clientHeight/2,front:normal.dot(toward)};}
  function visibleRect(selector){const n=document.querySelector(selector);if(!n||n.hidden)return null;const style=typeof getComputedStyle==='function'?getComputedStyle(n):null;if(style&&(style.display==='none'||style.visibility==='hidden'))return null;if(n.id==='guide-controls-panel'&&!n.closest('details')?.open)return null;const r=n.getBoundingClientRect();return r.width&&r.height?r:null;}
  function hideCues(){cueConnector.style.display='none';for(const node of cueNodes){node.label.hidden=true;node.line.style.display='none';node.dot.style.display='none';}for(const state of cueState){state.visible=false;state.rect=null;}}
  function layoutCues(blockers,otherTags){
    if(!anchorVisible)return;const w=globeRoot.clientWidth,h=globeRoot.clientHeight,placed=[...blockers];cueConnector.setAttribute('viewBox','0 0 '+w+' '+h);
    cueSpecs.forEach((spec,index)=>{const node=cueNodes[index],point=project(spec.space==='surface'?spec.position:spec.position.clone().applyMatrix4(billboard.matrix));if(point.front<=.13||point.x<0||point.x>w||point.y<0||point.y>h)return;node.label.hidden=false;const box=node.label.getBoundingClientRect(),width=box.width||spec.label.length*12+14,height=box.height||23,candidates=[[point.x+9,point.y-height/2],[point.x-width-9,point.y-height/2],[point.x-width/2,point.y-height-9],[point.x-width/2,point.y+9]].map(([x,y])=>rect(x,y,width,height));
      const safe=candidates.filter(r=>r.left>=6&&r.right<=w-6&&r.top>=6&&r.bottom<=h-6&&!placed.some(b=>intersectArea(r,b)>0));const chosen=safe.sort((a,b)=>otherTags.reduce((sum,r)=>sum+intersectArea(a,r)-intersectArea(b,r),0))[0];if(!chosen){node.label.hidden=true;return;}placed.push(chosen);node.label.style.left=chosen.left+'px';node.label.style.top=chosen.top+'px';const endX=clamp(point.x,chosen.left,chosen.right),endY=clamp(point.y,chosen.top,chosen.bottom);for(const [key,value] of Object.entries({x1:point.x,y1:point.y,x2:endX,y2:endY}))node.line.setAttribute(key,value);node.dot.setAttribute('cx',point.x);node.dot.setAttribute('cy',point.y);node.line.style.display='';node.dot.style.display='';cueConnector.style.display='';cueState[index]={...cueState[index],visible:true,rect:{...chosen}};
    });
  }
  function layout(anchorPoint,targetPoint){
    hideCues();
    const w=globeRoot.clientWidth,h=globeRoot.clientHeight,narrow=w<=760,origin=globeRoot.getBoundingClientRect(),local=r=>rect(r.left-origin.left,r.top-origin.top,r.width,r.height);
    const playerDock=document.body.classList.contains('is-learning')?document.querySelector('#imm-player'):null;
    card.dataset.docked=String(!!playerDock);
    if(card.parentElement!==(playerDock||host)){const active=document.activeElement,restoreFocus=card.contains(active);(playerDock||host).prepend(card);if(restoreFocus)active.focus?.({preventScroll:true});}
    const blockers=['.learn-header','.learn-panel','#learning-globe-actions','.imm-header','.imm-info','.imm-overview','#distribution-ui .dist-toolbar','#distribution-ui .dist-side','#distribution-ui .dist-analysis-side','#geo-orientation-note','#learning-map-key','#imm-player','#guide-toggle','#globe-appearance-controls','#guide-controls-panel','.environment-demonstration'].map(visibleRect).filter(Boolean).map(local);
    const header=visibleRect('.learn-header')||visibleRect('.imm-header'),panel=visibleRect('.learn-panel'),player=visibleRect('#imm-player');
    const lessonCollapsed=document.querySelector('.learning-journey')?.classList.contains('learn-collapsed');
    const left=narrow?13:20,right=!narrow&&panel&&!lessonCollapsed?panel.left-origin.left-12:w-left,top=Math.max((header?header.bottom-origin.top:70)+8,lessonCollapsed&&panel?panel.bottom-origin.top+8:0),bottom=Math.min(player?player.top-origin.top-8:h-12,narrow&&panel?panel.top-origin.top-8:h-12),areaHeight=bottom-top;
    host.classList.toggle('narration-tight',areaHeight<185||narrow);
    if(playerDock){for(const property of ['left','top','width'])card.style[property]='';cardRect=local(card.getBoundingClientRect());}
    else{
    card.style.width=Math.max(190,Math.min(narrow?310:330,right-left))+'px';
    const size=card.getBoundingClientRect(),cw=size.width||Math.min(330,right-left),ch=size.height||128,candidates=[rect(left,bottom-ch,cw,ch),rect(right-cw,top,cw,ch),rect(left,top,cw,ch),rect(left,top+Math.max(0,(areaHeight-ch)/2),cw,ch)];
    const earthOrigin=new THREE.Vector3().project(camera),cx=(earthOrigin.x+1)*w/2,cy=(1-earthOrigin.y)*h/2,radius=h/(camera.top-camera.bottom),earthRect=rect(cx-radius,cy-radius,radius*2,radius*2);
    const cost=r=>blockers.reduce((sum,b)=>sum+intersectArea(r,b)*100,0)+intersectArea(r,earthRect)*.12+(anchorPoint.x>r.left-15&&anchorPoint.x<r.right+15&&anchorPoint.y>r.top-15&&anchorPoint.y<r.bottom+15?1e6:0);
    cardRect=candidates.map(r=>rect(clamp(r.left,6,Math.max(6,w-r.width-6)),clamp(r.top,6,Math.max(6,h-r.height-6)),r.width,r.height)).sort((a,b)=>cost(a)-cost(b))[0];card.style.left=cardRect.left+'px';card.style.top=cardRect.top+'px';globeRoot.style.setProperty('--narration-stage-card-top',cardRect.top+'px');globeRoot.style.setProperty('--narration-stage-card-bottom',cardRect.bottom+'px');
    }
    tag.hidden=true;connector.style.display='none';tagRect=null;if(!anchorVisible)return;
    const tagWidth=narrow?154:200;tag.style.maxWidth=tagWidth+'px';tag.hidden=false;const tr=tag.getBoundingClientRect(),tw=tr.width||tagWidth,th=tr.height||55,otherTags=[...document.querySelectorAll('.globe-guide-label:not([hidden]),.geo-orientation-label:not([hidden])')].map(n=>local(n.getBoundingClientRect()));
    const tagCandidates=[[targetPoint.x+40,targetPoint.y-65],[targetPoint.x-tw-40,targetPoint.y-65],[targetPoint.x+35,targetPoint.y+25],[targetPoint.x-tw-35,targetPoint.y+25],[targetPoint.x-tw/2,targetPoint.y+65]].map(([x,y])=>rect(x,y,tw,th));
    const blocked=[...blockers,cardRect],safe=r=>r.left>6&&r.right<w-6&&r.top>6&&r.bottom<h-6&&!blocked.some(b=>intersectArea(r,b)>0);let chosen=tagCandidates.find(r=>safe(r)&&!otherTags.some(b=>intersectArea(r,b)>0));
    // A spoken current point has priority over a passive continent/reference
    // label. Never cover reading cards or controls to make a label fit.
    if(!chosen)chosen=tagCandidates.filter(safe).sort((a,b)=>otherTags.reduce((sum,r)=>sum+intersectArea(a,r)-intersectArea(b,r),0))[0];
    if(!chosen){tag.hidden=true;layoutCues(blocked,otherTags);return;}tagRect=chosen;tag.style.left=chosen.left+'px';tag.style.top=chosen.top+'px';const endX=clamp(targetPoint.x,chosen.left,chosen.right),endY=clamp(targetPoint.y,chosen.top,chosen.bottom);connector.setAttribute('viewBox','0 0 '+w+' '+h);leader.setAttribute('points',targetPoint.x+','+targetPoint.y+' '+endX+','+targetPoint.y+' '+endX+','+endY);leaderDot.setAttribute('cx',targetPoint.x);leaderDot.setAttribute('cy',targetPoint.y);connector.style.display='';layoutCues([...blocked,chosen],otherTags);
  }
  function beforeRender(){if(!enabled||!current)return;const w=globeRoot.clientWidth,h=globeRoot.clientHeight;if(!w||!h)return;const inverse=globe.getWorldQuaternion(new THREE.Quaternion()).invert();billboard.quaternion.copy(inverse);billboard.scale.setScalar((camera.top-camera.bottom)/h*(w<=760?68:92));billboard.updateMatrixWorld(true);const anchor=project(vector(current.focus.lon,current.focus.lat,1.025));anchorVisible=anchor.front>.13&&anchor.x>0&&anchor.x<w&&anchor.y>0&&anchor.y<h;billboard.visible=anchorVisible;worldEffects.visible=anchorVisible;for(const mark of surfaceMarks)mark.object.visible=project(vector(mark.lon,mark.lat,1.035)).front>.13;ring.visible=anchorVisible;pin.visible=anchorVisible;const localTarget=targetOffset.clone().applyMatrix4(billboard.matrix),target=project(localTarget);layout(anchor,target);$('narration-scene-status').textContent=!following?'自由观察中 · 可回到当前讲解':!anchorVisible?'正在定位当前看点…':note;host.dataset.anchorVisible=String(anchorVisible);}
  $('narration-follow').onclick=()=>{following=!following;updateText();updateAnimation();onFollow?.(following);requestDraw?.();};$('narration-previous').onclick=()=>seek(sequenceIndex-1);$('narration-next').onclick=()=>seek(sequenceIndex+1);reduced.addEventListener?.('change',updateAnimation);document.addEventListener('visibilitychange',updateAnimation);
  return {setScene,setScenes,clear,beforeRender,getState:()=>({enabled,id:current?.id||null,effect:current?.effect||null,renderEffect,environmentDiagram:environmentDiagram?{...environmentDiagram}:null,motionMarkers:movers.length,surfaceReferences:surfaceMarks.map(mark=>({lon:mark.lon,lat:mark.lat,visible:mark.object.visible})),playing,following,anchorVisible,stepIndex:sequence.length?sequenceIndex:current?.stepIndex||0,stepCount:sequence.length||current?.stepCount||0,phase:current?.phase??null,focus:current?.focus?{...current.focus}:null,cardRect:cardRect?{...cardRect}:null,tagRect:tagRect?{...tagRect}:null,labels:cueState.map(state=>({...state,rect:state.rect?{...state.rect}:null})),animated:canAnimate(),elapsed,effectObjectCount:billboard.children.length+worldEffects.children.length,note})};
}
