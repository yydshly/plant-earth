import * as THREE from 'three';
import {createCropMiniature} from './plant-miniatures.js';

// Every location below comes from the lesson's documented example or an existing
// representative plant anchor. The rings locate examples; they are not ranges.
export function createLearningMap({globe,camera,globeRoot,vector,requestDraw,stops,crops,onSelectStop}){
  const group=new THREE.Group();group.name='learning-example-locations';group.visible=false;globe.add(group);
  const labels=document.createElement('div');labels.id='learning-map-labels';labels.hidden=true;globeRoot.append(labels);
  const key=document.createElement('aside');key.id='learning-map-key';key.hidden=true;key.setAttribute('aria-label','学习地图图例');globeRoot.append(key);
  const geometry=new THREE.SphereGeometry(.012,12,8),pointMaterial=new THREE.MeshBasicMaterial({color:'#f1d798'});
  const points=stops.map((stop,index)=>{
    const mesh=new THREE.Mesh(geometry,pointMaterial);mesh.position.copy(vector(stop.lon,stop.lat,1.025));group.add(mesh);
    const label=document.createElement('button');label.type='button';label.className='learning-map-label';label.textContent=stop.landscape||stop.title;label.setAttribute('aria-label','进入'+stop.title);label.onclick=()=>onSelectStop?.(index);labels.append(label);
    return {stop,index,mesh,label};
  });
  const caseLabel=document.createElement('span');caseLabel.className='learning-map-label';caseLabel.hidden=true;labels.append(caseLabel);
  const ringGeometry=new THREE.BufferGeometry().setFromPoints(Array.from({length:65},(_,i)=>new THREE.Vector3(Math.cos(i*Math.PI/32)*.037,Math.sin(i*Math.PI/32)*.037,0)));
  const ring=new THREE.LineLoop(ringGeometry,new THREE.LineBasicMaterial({color:'#fff0c2',transparent:true,opacity:.85}));group.add(ring);
  const models=new Map(),orientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(.18,-.35,0));
  let enabled=false,mode='overview',stopId=null,plantId=null,anchor=null,activeModel=null;
  function clearModels(){for(const model of models.values())model.visible=false;activeModel=null;}
  function activate(){enabled=true;group.visible=true;labels.hidden=false;key.hidden=false;}
  function overview(){activate();caseLabel.hidden=true;mode='overview';stopId=null;plantId=null;anchor=null;clearModels();ring.visible=false;key.replaceChildren();const title=document.createElement('strong');title.textContent='先看水、热与季节，再认识植物';const legend=document.createElement('div');legend.className='learning-climate-key';for(const [name,color] of [['热带','#4e9dba'],['干旱','#c1a276'],['温带','#74ad8a'],['冷温带','#ab8fa9'],['极地','#c0cacc']]){const item=document.createElement('span'),dot=document.createElement('i');dot.style.background=color;item.append(dot,document.createTextNode(name));legend.append(item);}const note=document.createElement('p');note.textContent='底色为历史气候组；六个名牌是本次学习案例。';key.append(title,legend,note);requestDraw();}
  function focus(stop,id,point,kind){
    activate();clearModels();mode=kind;stopId=stop.id;plantId=id;anchor={lon:point.lon,lat:point.lat,region:point.region||stop.title};
    if(id){if(!models.has(id)){const model=createCropMiniature(id);model.traverse(object=>{if(!object.isMesh)return;object.renderOrder=15;const copy=material=>{const m=material.clone();m.depthTest=false;m.depthWrite=false;return m;};object.material=Array.isArray(object.material)?object.material.map(copy):copy(object.material);});models.set(id,model);}activeModel=models.get(id);if(!activeModel.parent)group.add(activeModel);activeModel.position.copy(vector(anchor.lon,anchor.lat,1.025));activeModel.visible=true;}
    ring.position.copy(vector(anchor.lon,anchor.lat,1.022));ring.lookAt(ring.position.clone().multiplyScalar(2));ring.visible=true;
    key.replaceChildren();const title=document.createElement('strong'),note=document.createElement('p');
    title.textContent=kind==='plant'?crops.get(id)?.name+' · '+anchor.region:stop.climateCodes?.length?'亮色：'+stop.title+'的气候线索':'水域：先看水深、盐度与光照';
    const identity={native_region:'原生地区示例',cultivation_region:'栽培地区示例',introduced_region:'引入地区示例',documented_region:'文献分布示例',teaching_region:'教学举例地区'}[point.evidenceType]||'代表地区示例';
    note.textContent=kind==='plant'?identity+'；模型与区域中心都不代表现场或完整范围。':stop.climateCodes?.length?'1951–2000历史气候，不等于现状植被或物种范围。':'水域跨越气候带；这里只定位案例，不推断全球湿地范围。';
    if(kind==='case'){title.textContent=stop.title;note.textContent=stop.mapNote||'教学定位；条件以题目线索为准，不代表此点的实测环境或完整植物范围。';}
    caseLabel.hidden=true;key.append(title,note);requestDraw();
  }
  function hide(){enabled=false;group.visible=false;labels.hidden=true;key.hidden=true;clearModels();requestDraw();}
  function beforeRender(){
    if(!enabled)return;const w=globeRoot.clientWidth,h=globeRoot.clientHeight;
    key.style.top=((document.querySelector('.learn-header')?.getBoundingClientRect().bottom||140)+8)+'px';
    const inverse=globe.getWorldQuaternion(new THREE.Quaternion()).invert(),scale=(camera.top-camera.bottom)/Math.max(1,h)*(w<761?42:54);
    if(activeModel){const position=activeModel.position.clone().applyMatrix4(globe.matrixWorld),toward=camera.position.clone().sub(position).normalize();activeModel.visible=position.clone().normalize().dot(toward)>.15;ring.visible=activeModel.visible;activeModel.quaternion.copy(inverse).multiply(orientation);activeModel.scale.setScalar(scale);}
    caseLabel.hidden=true;
    if(mode==='case'&&anchor){const pos=vector(anchor.lon,anchor.lat,1.025).applyMatrix4(globe.matrixWorld),front=pos.clone().normalize().dot(camera.position.clone().sub(pos).normalize())>.15,projected=pos.project(camera),x=(projected.x+1)*w/2,y=(1-projected.y)*h/2;ring.visible=front;caseLabel.textContent=(plantId?crops.get(plantId)?.name+' · ':'')+anchor.region;caseLabel.style.left=x+'px';caseLabel.style.top=(y+19)+'px';caseLabel.hidden=!front||x<35||x>w-35||y<80||y>h-40;}
    for(const point of points){
      const selected=mode!=='overview'&&point.stop.id===stopId;
      const lon=selected?anchor.lon:point.stop.lon,lat=selected?anchor.lat:point.stop.lat;
      point.mesh.position.copy(vector(lon,lat,1.025));const pos=point.mesh.position.clone().applyMatrix4(globe.matrixWorld),toward=camera.position.clone().sub(pos).normalize(),visible=pos.clone().normalize().dot(toward)>.15&&(mode==='overview'||selected);
      point.mesh.visible=visible;point.label.hidden=!visible;if(!visible)continue;
      const projected=pos.project(camera),x=(projected.x+1)*w/2,y=(1-projected.y)*h/2;
      point.label.textContent=selected?(plantId?crops.get(plantId)?.name+' · ':'')+anchor.region:(point.stop.landscape||point.stop.title);
      point.label.style.left=x+'px';point.label.style.top=(y+19)+'px';
      if(x<35||x>w-35||y<80||y>h-40)point.label.hidden=true;
    }
  }
  return {overview,focusStop:stop=>focus(stop,stop.focusPlantId,stop,'environment'),focusPlant:(stop,id,point)=>focus(stop,id,point,'plant'),focusCase:context=>focus({...context,id:'application'},context.plantId||null,{...context,region:context.region||context.title},'case'),hide,beforeRender,getState:()=>({enabled,mode,stopId,plantId,anchor})};
}
