import * as THREE from 'three';
import {layoutGeographyLabels} from './geography-label-layout.js';

export const REGION_CONTINENT_COLORS={亚洲:'#f1cd82',欧洲:'#c1b7eb',非洲:'#eca68a',北美洲:'#a7d4a1',南美洲:'#82cdd4',大洋洲:'#d7b6cf',南极洲:'#c8dde6'};
export const regionContinent=region=>region.continentZh||region.continent||'地区';
const colorFor=region=>REGION_CONTINENT_COLORS[regionContinent(region)]||'#e9dba4';
const angularDistance=(a,b)=>{const d=Math.PI/180,x=(a[1]-b[1])*d,y=(a[0]-b[0])*d;return 2*Math.asin(Math.min(1,Math.sqrt(Math.sin(x/2)**2+Math.cos(a[1]*d)*Math.cos(b[1]*d)*Math.sin(y/2)**2)))/d;};

// Each marker stands for one sourced environmental teaching case. It never
// denotes an individual plant, a field, density or a plant's suitable range.
export function createRegionalOverviewLayer({globe,camera,globeRoot,vector,svgRoot,projection,getContext,requestDraw,onPick}){
  const root=new THREE.Group();root.visible=false;globe.add(root);
  const namespace='http://www.w3.org/2000/svg',group=document.createElementNS(namespace,'g');group.setAttribute('class','regional-overview-points');svgRoot.append(group);
  const labels=document.createElement('div');labels.className='regional-overview-labels';labels.hidden=true;globeRoot.append(labels);
  const geometry=new THREE.SphereGeometry(.009,10,7),materials=new Map(),markers=[];let regions=[];
  function set(next=[]){
    for(const child of [...root.children])root.remove(child);markers.length=0;group.replaceChildren();labels.replaceChildren();regions=[...next];
    for(const [index,region]of regions.entries()){
      const color=colorFor(region);if(!materials.has(color))materials.set(color,new THREE.MeshBasicMaterial({color,depthTest:false}));
      const marker=new THREE.Mesh(geometry,materials.get(color));marker.position.copy(vector(region.lon,region.lat,1.016));marker.renderOrder=18;root.add(marker);
      const label=document.createElement('span');label.textContent=region.name;labels.append(label);markers.push({region,marker,label});
      const point=projection([region.lon,region.lat]);if(!point)continue;
      const button=document.createElementNS(namespace,'g');button.setAttribute('role','button');button.setAttribute('tabindex','0');button.setAttribute('aria-label',`${region.name}：进入地区课程`);
      const hit=document.createElementNS(namespace,'circle');for(const [k,v]of Object.entries({cx:point[0],cy:point[1],r:10,fill:'transparent'}))hit.setAttribute(k,String(v));
      const circle=document.createElementNS(namespace,'circle');for(const [k,v]of Object.entries({cx:point[0],cy:point[1],r:4.5,fill:color,stroke:'#102e36','stroke-width':1.4}))circle.setAttribute(k,String(v));
      const title=document.createElementNS(namespace,'title');title.textContent=`${region.name} · ${regionContinent(region)} · 环境教学采样点`;
      const pick=()=>onPick?.(region.id);button.onclick=e=>{e.stopPropagation();pick();};button.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();pick();}};button.append(hit,circle,title);group.append(button);
    }
    requestDraw();
  }
  function beforeRender(){
    const context=getContext(),enabled=context.enabled&&regions.length>0;group.style.display=enabled&&context.fullMap?'':'none';root.visible=enabled&&!context.fullMap;labels.hidden=!root.visible;
    if(!root.visible)return;
    const candidates=[],width=globeRoot.clientWidth,height=globeRoot.clientHeight,insets=context.insets||{};
    for(const [index,item]of markers.entries()){
      const point=vector(item.region.lon,item.region.lat,1.025).applyMatrix4(globe.matrixWorld),front=point.clone().normalize().dot(camera.position.clone().sub(point).normalize())>.22;
      item.marker.visible=front;item.label.hidden=true;if(!front)continue;const screen=point.project(camera),x=(screen.x+1)*width/2,y=(1-screen.y)*height/2;
      candidates.push({id:index,text:item.region.name,x,y,width:Math.min(180,item.region.name.length*10+14),height:20,priority:100-index,maxOffset:26,offsets:[[0,-18],[0,18],[24,0],[-24,0]]});
    }
    const left=insets.left||15,top=insets.top||110,right=insets.right||15,bottom=insets.bottom||20;
    const placed=layoutGeographyLabels(candidates,{bounds:{left,top,width:Math.max(50,width-left-right),height:Math.max(50,height-top-bottom)},maxLabels:innerWidth<761?5:9,gap:6});
    for(const p of placed){const item=markers[p.id];item.label.hidden=false;item.label.style.left=p.left+'px';item.label.style.top=p.top+'px';item.label.style.width=p.width+'px';}
  }
  function pick(lon,lat){const nearest=regions.map(region=>({region,distance:angularDistance([lon,lat],[region.lon,region.lat])})).sort((a,b)=>a.distance-b.distance)[0];return nearest?.distance<7?nearest.region:null;}
  return {set,clear:()=>set([]),beforeRender,pick,getState:()=>({count:regions.length,ids:regions.map(r=>r.id)}),destroy(){set([]);geometry.dispose();for(const material of materials.values())material.dispose();globe.remove(root);group.remove();labels.remove();}};
}
