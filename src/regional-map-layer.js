import * as THREE from 'three';
import {createCropMiniature,disposeMiniature} from './plant-miniatures.js';

// This marker identifies the environmental teaching sample, never a recorded
// individual plant. Botanical area records remain a separate layer.
export function createRegionalMapLayer({globe,camera,globeRoot,vector,svgRoot,projection,getContext,moveTo,requestDraw,crops}){
  const root=new THREE.Group();root.visible=false;globe.add(root);
  const marker=new THREE.Mesh(new THREE.SphereGeometry(.012,12,8),new THREE.MeshBasicMaterial({color:'#ffe3a1',depthTest:false}));marker.renderOrder=20;root.add(marker);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.023,.029,40),new THREE.MeshBasicMaterial({color:'#ffe3a1',side:THREE.DoubleSide,transparent:true,opacity:.85,depthTest:false}));ring.renderOrder=19;root.add(ring);
  const label=document.createElement('div');label.className='regional-map-label';label.hidden=true;globeRoot.append(label);
  const group=document.createElementNS('http://www.w3.org/2000/svg','g');group.classList.add('regional-svg-sample');svgRoot.append(group);
  let region=null,cropId=null,plant=null,step=0,modelBounds=null;
  const plantBox=new THREE.Box3(),corner=new THREE.Vector3();
  function clearBounds(){modelBounds=null;for(const key of ['modelBoundsLeft','modelBoundsTop','modelBoundsRight','modelBoundsBottom','modelBoundsSpace'])delete label.dataset[key];}
  function publishBounds(){
    clearBounds();if(!plant)return;plant.updateWorldMatrix(true,true);plantBox.setFromObject(plant,true);if(plantBox.isEmpty())return;
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight;let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
    // With the atlas orthographic camera, projecting the precise world-space
    // box gives conservative bounds for the actual transformed model, including
    // its crown. This is a screen footprint, never a geographic plant range.
    for(const x of [plantBox.min.x,plantBox.max.x])for(const y of [plantBox.min.y,plantBox.max.y])for(const z of [plantBox.min.z,plantBox.max.z]){corner.set(x,y,z).project(camera);const px=(corner.x+1)*width/2,py=(1-corner.y)*height/2;left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);}
    if(![left,top,right,bottom].every(Number.isFinite))return;left=Math.max(0,left);top=Math.max(0,top);right=Math.min(width,right);bottom=Math.min(height,bottom);if(right<=left||bottom<=top)return;
    modelBounds={left,top,right,bottom};label.dataset.modelBoundsSpace='globe-root';for(const [key,value]of Object.entries(modelBounds))label.dataset['modelBounds'+key[0].toUpperCase()+key.slice(1)]=String(value);
  }
  function releasePlant(){if(!plant)return;disposeMiniature(plant);for(const m of plant.userData.ownMaterials||[])m.dispose();plant=null;}
  function set(next,id,{move=false,lessonStep=2}={}){
    step=lessonStep;clearBounds();
    const changed=region?.id!==next?.id||cropId!==id;region=next||null;cropId=id||null;group.replaceChildren();
    if(!region){releasePlant();root.visible=false;label.hidden=true;requestDraw();return;}
    marker.position.copy(vector(region.lon,region.lat,1.022));ring.position.copy(vector(region.lon,region.lat,1.012));ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),vector(region.lon,region.lat,1).normalize());
    if(changed){
      releasePlant();plant=createCropMiniature(id);const owned=new Map(),meshes=[];
      plant.traverse(o=>{if(o.isMesh)meshes.push(o);});
      // A pale silhouette separates the teaching miniature from country fills.
      // Geometry stays shared; only this one active marker gets an extra pass.
      const outlineMaterial=new THREE.MeshBasicMaterial({color:'#f3eed4',side:THREE.DoubleSide,transparent:true,depthTest:false,depthWrite:false,toneMapped:false});
      for(const o of meshes){
        const clone=m=>{if(!owned.has(m)){const c=m.clone();c.depthTest=false;c.depthWrite=false;c.transparent=true;c.opacity=1;if(c.emissive&&c.color){c.emissive.copy(c.color);c.emissiveIntensity=.35;}owned.set(m,c);}return owned.get(m);};
        o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);o.renderOrder=21;
        const outline=new THREE.Mesh(o.geometry,outlineMaterial);outline.scale.setScalar(1.13);outline.renderOrder=20;o.add(outline);
      }
      plant.userData.ownMaterials=[...owned.values(),outlineMaterial];plant.position.copy(vector(region.lon,region.lat,1.045));root.add(plant);
    }
    label.replaceChildren();const title=document.createElement('strong');title.textContent=(crops.get(id)?.name||id)+' · '+region.name;const note=document.createElement('small');note.textContent='环境教学采样点 · 非植物观测点';label.append(title,note);
    const point=projection([region.lon,region.lat]);if(point){const dot=document.createElementNS(group.namespaceURI,'circle');for(const [k,v]of Object.entries({cx:point[0],cy:point[1],r:5,fill:'#ffe2a1',stroke:'#172f35','stroke-width':2}))dot.setAttribute(k,String(v));const t=document.createElementNS(group.namespaceURI,'text');t.setAttribute('x',String(Math.min(770,point[0]+10)));t.setAttribute('y',String(point[1]-8));t.setAttribute('fill','#ffe2a1');t.setAttribute('paint-order','stroke');t.setAttribute('stroke','#172f35');t.setAttribute('stroke-width','3');t.setAttribute('font-size','12');t.textContent=region.name+' · 环境采样';group.append(dot,t);}
    if(move)moveTo(region.lon,region.lat);requestDraw();
  }
  function beforeRender(){
    clearBounds();const context=getContext(),active=!!region&&context.enabled;group.style.display=active&&context.fullMap?'':'none';root.visible=active&&!context.fullMap;label.hidden=!root.visible;if(!root.visible)return;
    const point=vector(region.lon,region.lat,1.055).applyMatrix4(globe.matrixWorld),front=point.clone().normalize().dot(camera.position.clone().sub(point).normalize())>.18;root.visible=front;label.hidden=!front;if(!front)return;
    if(plant){plant.scale.setScalar((camera.top-camera.bottom)/globeRoot.clientHeight*(Number.isFinite(context.glyphPixels)?Math.max(32,Math.min(96,context.glyphPixels)):(innerWidth<=760?40:49)));plant.quaternion.copy(globe.getWorldQuaternion(new THREE.Quaternion()).invert()).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.16,-.3,0)));}
    publishBounds();const screen=point.project(camera);label.style.left=(screen.x+1)*globeRoot.clientWidth/2+'px';label.style.top=((1-screen.y)*globeRoot.clientHeight/2+28)+'px';label.dataset.step=String(step);
  }
  return {set,beforeRender,clear:()=>set(null),getState:()=>({regionId:region?.id||null,cropId,step,modelBounds:modelBounds?{...modelBounds}:null})};
}
