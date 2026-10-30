import * as THREE from 'three';
import {createCropMiniature,supportedCropIds,disposeMiniature} from './crop-miniatures.js';
const names=['水稻','小麦','玉米','大麦','燕麦','黑麦','高粱','谷子（小米）','珍珠粟','马铃薯','木薯','甘薯','大豆','花生','向日葵','油菜','鹰嘴豆','小扁豆','豇豆','棉花','甘蔗','甜菜','茶','阿拉比卡咖啡','罗布斯塔咖啡','可可','油棕','香蕉','椰子','葡萄','油橄榄','甜橙','苹果','椰枣'];
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setSize(320,320);renderer.setPixelRatio(1.5);renderer.setClearColor(0x14232b,1);
const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xeaf5e9,0x52654c,2.4));const light=new THREE.DirectionalLight(0xffe8c3,2.6);light.position.set(-3,4,5);scene.add(light);const fill=new THREE.DirectionalLight(0x93c4e9,.7);fill.position.set(3,2,-3);scene.add(fill);
const camera=new THREE.OrthographicCamera(-.67,.67,.67,-.67,.01,30);camera.position.set(2.5,1.3,4.8);camera.lookAt(0,.48,0);
const report=[];
supportedCropIds.forEach((id,i)=>{
 const model=createCropMiniature(id);scene.add(model);model.rotation.y=.08;model.updateMatrixWorld(true);
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());let meshes=0,vertices=0,invalid=0;
 model.traverse(o=>{if(o.isMesh){meshes++;const p=o.geometry.getAttribute('position');vertices+=p.count;for(const n of p.array)if(!Number.isFinite(n))invalid++;}});
 const extent=Math.max(size.x,size.z,size.y)*.66;camera.left=-extent;camera.right=extent;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();camera.lookAt(0,.5,0);renderer.render(scene,camera);
 const card=document.createElement('article'),name=document.createElement('h2'),img=document.createElement('img'),caption=document.createElement('p');name.textContent=names[i];img.src=renderer.domElement.toDataURL('image/png');img.alt=names[i]+'立体形态示意';caption.textContent=id+' · '+meshes+' meshes';card.append(name,img,caption);document.querySelector('#grid').append(card);
 report.push({id,meshes,vertices,invalid,minY:box.min.y,height:size.y,width:size.x,depth:size.z});disposeMiniature(model);
});
window.MINIATURE_REPORT=report;document.body.dataset.ready='true';
