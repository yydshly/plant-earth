import * as THREE from 'three';
import {createCropMiniature,disposeMiniature} from './plant-miniatures.js';
import {resolveClassGlobeAnchors,classGlobeAnchorFocus} from './class-globe-anchor-model.js';
import {layoutGeographyLabels} from './geography-label-layout.js';

const NS='http://www.w3.org/2000/svg';
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const svg=(tag,attrs={})=>{const e=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
const rectangle=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height});
const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
const clamp=(value,low,high)=>Math.max(low,Math.min(high,value));

/** Small teaching symbols stay tethered to their own existing geographic
 * examples. This layer does not run audio or create botanical range claims. */
export function createClassGlobeAnchors({data,crops,globe,camera,globeRoot,vector,requestDraw,onSelect}={}){
  const group=new THREE.Group();group.name='class-geographic-plant-examples';group.visible=false;globe.add(group);
  const layer=node('section',null,'class-globe-anchor-labels');layer.hidden=true;layer.setAttribute('aria-label','植物课程在地球上的有来源地区示例');globeRoot.append(layer);
  const leaders=svg('svg',{class:'class-globe-anchor-leaders','aria-hidden':'true'});leaders.hidden=true;leaders.style.display='none';globeRoot.append(leaders);
  const dotGeometry=new THREE.SphereGeometry(.01,12,8),ringGeometry=new THREE.RingGeometry(.019,.024,32);
  const dotMaterial=new THREE.MeshBasicMaterial({color:'#f7e1a2',depthTest:false,depthWrite:false}),ringMaterial=new THREE.MeshBasicMaterial({color:'#e9d6a2',side:THREE.DoubleSide,depthTest:false,depthWrite:false,transparent:true,opacity:.85}),leaderMaterial=new THREE.LineBasicMaterial({color:'#d3ddae',depthTest:false,depthWrite:false,transparent:true,opacity:.85});
  let enabled=false,fullMap=false,scene=null,entries=[],sourceKey='',destroyed=false;
  const pointOrigin=new THREE.Vector3(),cameraWorld=new THREE.Vector3(),inverse=new THREE.Quaternion(),orientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(.12,-.27,0));

  function visibleRect(selector){
    const element=document.querySelector(selector);if(!element||element.hidden||!element.getClientRects?.().length)return null;
    const style=getComputedStyle(element);if(style.display==='none'||style.visibility==='hidden')return null;
    const r=element.getBoundingClientRect();return r.width>0&&r.height>0?r:null;
  }
  function blockers(){
    const origin=globeRoot.getBoundingClientRect(),selectors=['.global-header','#global-catalog','.global-tour','.class-globe-companion','.class-course-caption','.course-globe-caption','#globe-guide-controls','#globe-appearance-controls','.guided-route-bar','.regional-map-label','.course-directory','.guided-journey-home'];
    return selectors.map(visibleRect).filter(Boolean).map(r=>rectangle(r.left-origin.left,r.top-origin.top,r.width,r.height));
  }
  function clearEntries(){
    for(const entry of entries){
      disposeMiniature(entry.plant);for(const material of entry.materials)material.dispose();entry.tether.geometry.dispose();entry.root.removeFromParent();entry.label.remove();entry.leader.remove();entry.dot.remove();
    }
    entries=[];
  }
  function build(descriptors){
    clearEntries();
    for(const descriptor of descriptors){
      const itemRoot=new THREE.Group();itemRoot.name='course-example-'+descriptor.cropId;group.add(itemRoot);
      const pin=new THREE.Mesh(dotGeometry,dotMaterial);pin.renderOrder=31;pin.position.copy(vector(descriptor.lon,descriptor.lat,1.026));itemRoot.add(pin);
      const ring=new THREE.Mesh(ringGeometry,ringMaterial);ring.renderOrder=30;ring.position.copy(vector(descriptor.lon,descriptor.lat,1.018));ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),vector(descriptor.lon,descriptor.lat,1).normalize());itemRoot.add(ring);
      const plant=createCropMiniature(descriptor.cropId),materials=new Map();plant.name='course-plant-'+descriptor.cropId;
      plant.traverse(object=>{if(!object.isMesh)return;object.renderOrder=33;const own=original=>{if(!materials.has(original)){const clone=original.clone();clone.depthTest=false;clone.depthWrite=false;materials.set(original,clone);}return materials.get(original);};object.material=Array.isArray(object.material)?object.material.map(own):own(object.material);});itemRoot.add(plant);
      const tetherGeometry=new THREE.BufferGeometry();tetherGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6),3));const tether=new THREE.Line(tetherGeometry,leaderMaterial);tether.renderOrder=32;tether.frustumCulled=false;itemRoot.add(tether);
      const label=node('button',null,'class-globe-anchor-label');label.type='button';label.dataset.cropId=descriptor.cropId;label.setAttribute('aria-label',descriptor.name+' · '+descriptor.region+'；'+descriptor.evidenceLabel+'。点选定位本例。');label.title=descriptor.sourceScope+' '+descriptor.coordinateMeaning+' 模型为邻近展示；连线指向教学地区。';
      const title=node('strong'),region=node('span',null,'class-anchor-region'),evidence=node('small',null,'class-anchor-evidence'),note=node('span',null,'class-anchor-note');label.append(title,region,evidence,note);label.onclick=()=>onSelect?.(descriptor.cropId,{...entry.descriptor});layer.append(label);
      const leader=svg('line'),dot=svg('circle',{r:3});leaders.append(leader,dot);
      const ownedMaterials=[...materials.values()],baseEmission=new Map(ownedMaterials.filter(m=>m.emissive).map(m=>[m,m.emissive.clone()]));
      const entry={descriptor,root:itemRoot,pin,ring,plant,materials:ownedMaterials,baseEmission,highlighted:null,tether,label,title,region,evidence,note,leader,dot,visible:false,labelVisible:false,screen:null,modelRect:null,labelRect:null,modelOffset:{x:0,y:0}};entries.push(entry);
    }
  }
  function setScene(next,{activeCropId,fullMap:flat=false}={}){
    if(destroyed)return [];
    scene=next||null;fullMap=flat===true;const descriptors=resolveClassGlobeAnchors(scene,data,{activeCropId});enabled=descriptors.length>0;
    const key=descriptors.map(d=>[d.id,d.lon,d.lat].join(':')).join('|');if(key!==sourceKey){sourceKey=key;build(descriptors);}
    descriptors.forEach((d,index)=>{const e=entries[index];e.descriptor=d;e.title.textContent=d.name;e.region.textContent=d.region;e.evidence.textContent=d.evidenceLabel;e.note.textContent=d.note;e.label.dataset.active=String(d.active);e.label.setAttribute('aria-pressed',String(d.active));
      if(e.highlighted!==d.active){e.highlighted=d.active;e.plant.userData.focusActive=d.active;for(const [material,base] of e.baseEmission){material.emissive.copy(base);if(d.active&&material.color)material.emissive.add(material.color.clone().multiplyScalar(.14));}}
    });
    group.visible=enabled&&!fullMap;layer.hidden=leaders.hidden=!group.visible;leaders.style.display=group.visible?'':'none';if(!group.visible)for(const entry of entries){entry.visible=entry.labelVisible=false;entry.label.hidden=true;entry.leader.style.display=entry.dot.style.display='none';}requestDraw?.();return descriptors.map(d=>({...d}));
  }
  function project(point){const p=point.clone().applyMatrix4(globe.matrixWorld),normal=p.clone().sub(pointOrigin).normalize(),facing=normal.dot(cameraWorld.clone().sub(p).normalize());p.project(camera);return {x:(p.x+1)*globeRoot.clientWidth/2,y:(1-p.y)*globeRoot.clientHeight/2,facing};}
  function beforeRender(){
    const active=enabled&&!fullMap&&!destroyed;group.visible=active;layer.hidden=leaders.hidden=!active;leaders.style.display=active?'':'none';
    for(const entry of entries){entry.label.hidden=true;entry.leader.style.display=entry.dot.style.display='none';entry.visible=entry.labelVisible=false;entry.labelRect=null;}
    if(!active)return;
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight;if(!width||!height)return;
    globe.getWorldPosition(pointOrigin);camera.getWorldPosition(cameraWorld);globe.getWorldQuaternion(inverse).invert();const bill=inverse.clone().multiply(orientation),pixels=(camera.top-camera.bottom)/height,miniatureHeight=width<=760?64:82,hardBlocks=blockers(),modelBoxes=[],candidates=[];
    leaders.setAttribute('viewBox','0 0 '+width+' '+height);
    const ordered=[...entries].sort((a,b)=>Number(b.descriptor.active)-Number(a.descriptor.active));
    for(const entry of ordered){
      const d=entry.descriptor,anchor=vector(d.lon,d.lat,1.032),p=project(anchor);entry.root.visible=p.facing>.15&&p.x>=4&&p.x<=width-4&&p.y>=4&&p.y<=height-4;entry.screen={...p};if(!entry.root.visible)continue;
      const offsets=[[0,0],[-52,0],[52,0],[-42,-34],[42,-34],[0,-65],[-68,-15],[68,-15]],boxAt=([dx,dy])=>rectangle(p.x+dx-miniatureHeight*.37,p.y+dy-miniatureHeight,miniatureHeight*.74,miniatureHeight+6);
      const selectedOffset=offsets.find(offset=>{const r=boxAt(offset);return r.left>=4&&r.right<=width-4&&r.top>=4&&r.bottom<=height-4&&![...hardBlocks,...modelBoxes].some(b=>overlap(r,b));});
      if(!selectedOffset){entry.root.visible=false;continue;}
      const [dx,dy]=selectedOffset,displacement=new THREE.Vector3(dx*pixels,-dy*pixels,0).applyQuaternion(inverse),modelPosition=vector(d.lon,d.lat,1.044).add(displacement);
      entry.plant.position.copy(modelPosition);entry.plant.quaternion.copy(bill);entry.plant.scale.setScalar(miniatureHeight*pixels);entry.modelOffset={x:dx,y:dy};entry.modelRect=boxAt(selectedOffset);modelBoxes.push(entry.modelRect);entry.visible=true;
      const positions=entry.tether.geometry.attributes.position;positions.setXYZ(0,anchor.x,anchor.y,anchor.z);positions.setXYZ(1,modelPosition.x,modelPosition.y,modelPosition.z);positions.needsUpdate=true;entry.tether.visible=Math.hypot(dx,dy)>2;
      entry.label.hidden=false;const measured=entry.label.getBoundingClientRect(),labelWidth=Math.min(width<=760?172:205,measured.width||185),labelHeight=measured.height||(d.active?96:61);entry.label.hidden=true;
      candidates.push({id:d.id,x:p.x,y:p.y,width:labelWidth,height:labelHeight,priority:d.active?100:40,maxOffset:width<=760?185:225,required:false,offsets:[[90,-28],[-90,-28],[0,38],[130,-30],[-130,-30],[0,-miniatureHeight-37],[100,35],[-100,35],[0,85]]});
    }
    const placed=layoutGeographyLabels(candidates,{bounds:{left:6,top:6,width:width-12,height:height-12},obstacles:[...hardBlocks,...modelBoxes],maxLabels:3,gap:5});
    for(const placement of placed){
      const entry=entries.find(e=>e.descriptor.id===placement.id);if(!entry||placement.crowded)continue;
      entry.label.hidden=false;entry.label.style.left=placement.left+'px';entry.label.style.top=placement.top+'px';entry.labelRect=rectangle(placement.left,placement.top,placement.width,placement.height);entry.labelVisible=true;
      for(const [k,v]of Object.entries({x1:placement.anchorX,y1:placement.anchorY,x2:placement.leaderEndX,y2:placement.leaderEndY}))entry.leader.setAttribute(k,String(v));entry.leader.style.display='';entry.dot.setAttribute('cx',String(placement.anchorX));entry.dot.setAttribute('cy',String(placement.anchorY));entry.dot.style.display='';entry.leader.dataset.active=entry.dot.dataset.active=String(entry.descriptor.active);
    }
  }
  function clear(){enabled=false;scene=null;sourceKey='';clearEntries();group.visible=false;layer.hidden=leaders.hidden=true;leaders.style.display='none';requestDraw?.();}
  return {setScene,beforeRender,clear,getState:()=>({enabled,fullMap,scope:scene?.scope||null,anchors:entries.map(e=>({...e.descriptor,visible:e.visible,labelVisible:e.labelVisible,screen:e.screen?{...e.screen}:null,labelRect:e.labelRect?{...e.labelRect}:null,modelOffset:{...e.modelOffset}})),focus:classGlobeAnchorFocus(entries.map(e=>e.descriptor))}),destroy(){if(destroyed)return;clear();destroyed=true;group.removeFromParent();layer.remove();leaders.remove();dotGeometry.dispose();ringGeometry.dispose();dotMaterial.dispose();ringMaterial.dispose();leaderMaterial.dispose();}};
}
