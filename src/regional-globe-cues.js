import * as THREE from 'three';
import {resolveRegionalGlobeCuePosition,resolveRegionalGlobeCues} from './regional-globe-cue-model.js';
import {layoutGeographyLabels} from './geography-label-layout.js';
export {resolveRegionalGlobeCuePosition,resolveRegionalGlobeCues};
const NS='http://www.w3.org/2000/svg',Y=new THREE.Vector3(0,1,0);
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const svg=(tag,attrs={})=>{const e=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;

/** A source-labelled teaching symbol attached to the exact evidence location.
 * It has no player/timer and cannot invent weather or plant occurrences. */
export function createRegionalGlobeCues({globe,camera,globeRoot,vector,requestDraw,onDetails}={}){
  const root=new THREE.Group();root.name='regional-evidence-globe-cues';root.visible=false;globe.add(root);
  const layer=el('section',null,'regional-globe-cues');layer.hidden=true;layer.setAttribute('aria-label','当前地区的气候、土壤与水源证据');globeRoot.append(layer);
  const leaders=svg('svg',{class:'regional-globe-cue-leaders','aria-hidden':'true'});leaders.hidden=true;leaders.style.display='none';globeRoot.append(leaders);
  const materials=new Set(),geometries=new Set();let model=null,fullMap=false,key='',entries=[],destroyed=false;
  const origin=new THREE.Vector3(),cameraPosition=new THREE.Vector3(),inverse=new THREE.Quaternion();
  const own=g=>{geometries.add(g);return g;};
  function mat(color,opacity=1){const m=new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthTest:false,depthWrite:false,side:THREE.DoubleSide});materials.add(m);return m;}
  function mesh(parent,g,color,at=[0,0,0],scale=[1,1,1],opacity=1){const m=new THREE.Mesh(own(g),mat(color,opacity));m.position.set(...at);m.scale.set(...scale);m.renderOrder=35;parent.add(m);return m;}
  const ball=(p,at,scale,color)=>mesh(p,new THREE.SphereGeometry(1,12,8),color,at,scale);
  function line(parent,a,b,color,radius=.012){const p=new THREE.Vector3(...a),delta=new THREE.Vector3(...b).sub(p),length=delta.length();if(!length)return;const tube=mesh(parent,new THREE.CylinderGeometry(radius,radius,length,7),color,p.addScaledVector(delta,.5).toArray());tube.quaternion.setFromUnitVectors(Y,delta.divideScalar(length));return tube;}
  function arrow(parent,a,b,color){line(parent,a,b,color,.014);const delta=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize(),head=mesh(parent,new THREE.ConeGeometry(.04,.09,8),color,b);head.quaternion.setFromUnitVectors(Y,delta);}
  function buildSymbol(group,kind,missing){
    if(model.teachingContext==='marine'){
      // Underwater process sketch, not a reconstructed bay or measured water depth.
      for(let i=0;i<7;i++)line(group,[-.43+i*.14,.63+(i%2)*.025,.04],[-.29+i*.14,.63+((i+1)%2)*.025,.04],'#91c9e2',.012);
      if(kind==='soil')mesh(group,new THREE.BoxGeometry(.90,.12,.1),'#a58a65',[0,.08,0]);
      for(const x of [-.2,0,.2]){line(group,[x,.13,.06],[x+.07,.44,.06],'#9fc695',.02);if(kind==='soil')line(group,[x,.13,.06],[x-.07,.02,.06],'#dbc292',.012);}
      if(kind==='climate'){for(const x of [-.32,.0,.32])arrow(group,[x,.83,.05],[x+.07,.48,.05],'#ecd18d');}
      if(kind==='water'){arrow(group,[-.4,.24,.05],[-.4,.56,.05],'#91c9e2');arrow(group,[.4,.56,.05],[.4,.24,.05],'#91c9e2');}
      return;
    }
    if(kind==='climate'){
      ball(group,[-.24,.56,.02],[.15,.15,.05],'#ecd18d');for(let i=0;i<8;i++){const a=i*Math.PI/4;line(group,[-.24+Math.cos(a)*.2,.56+Math.sin(a)*.2,.02],[-.24+Math.cos(a)*.26,.56+Math.sin(a)*.26,.02],'#ecd18d',.008);}
      for(const [x,y,s]of [[.16,.50,.15],[.32,.56,.18],[.48,.50,.13]])ball(group,[x,y,.03],[s,s*.65,s*.3],'#d4e7ed');for(const x of [.12,.31,.50])line(group,[x,.34,.05],[x-.04,.19,.05],'#91c9e2',.013);
      line(group,[-.35,.08,.04],[.48,.08,.04],'#acc8b0',.009);arrow(group,[.3,.23,.04],[.3,.09,.04],'#9bd0e0');
    }else if(kind==='soil'){
      if(!missing){mesh(group,new THREE.BoxGeometry(.90,.24,.12),'#8c7251',[0,.12,0]);mesh(group,new THREE.BoxGeometry(.90,.18,.12),'#a58a65',[0,-.08,0]);line(group,[0,.62,.03],[0,.18,.03],'#a4bf8d',.018);for(const x of [-.29,-.12,.13,.30])line(group,[0,.19,.08],[x,-.14,.08],'#e0c79b',.012);arrow(group,[-.48,.45,.05],[-.23,.23,.05],'#94d0e0');arrow(group,[.48,.25,.05],[.25,.46,.05],'#d8e9c0');}
      else{for(const [a,b]of [[[-.34,.13,.02],[.34,.13,.02]],[[-.34,.13,.02],[-.34,.48,.02]],[[.34,.13,.02],[.34,.48,.02]]])line(group,a,b,'#b3bda4',.012);line(group,[-.26,.2,.06],[.26,.46,.06],'#d6c69b',.02);line(group,[.26,.2,.06],[-.26,.46,.06],'#d6c69b',.02);}
    }else{
      // A pixel box denotes the observation footprint, never a real lake edge.
      const noWater=missing||model.values.find(v=>v.field==='occurrencePct')?.value===0,color=noWater?'#a7b8bc':'#94d1e5';for(const [a,b]of [[[-.32,.13,0],[.32,.13,0]],[[.32,.13,0],[.32,.64,0]],[[.32,.64,0],[-.32,.64,0]],[[-.32,.64,0],[-.32,.13,0]]])line(group,a,b,color,.012);
      const drop=mesh(group,new THREE.SphereGeometry(.16,16,10),color,[0,.36,.04],[.72,1,.35],noWater?.25:.8);mesh(group,new THREE.ConeGeometry(.115,.22,12),color,[0,.51,.04],[1,1,.5],noWater?.25:.8);drop.name='evidence-water-symbol';
    }
  }
  function release(){for(const e of entries){e.label.remove();e.leader.remove();e.screenDot.remove();}entries=[];root.clear();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();geometries.clear();materials.clear();}
  function makeEntry(point,reference=false){
    const group=new THREE.Group();root.add(group);const pin=mesh(group,new THREE.SphereGeometry(.009,10,7),reference?'#9cd9ef':'#ffe5a1');pin.position.copy(vector(point.lon,point.lat,1.027));
    const symbol=new THREE.Group();group.add(symbol);if(!reference)buildSymbol(symbol,model.kind,model.missing);
    const tetherGeometry=own(new THREE.BufferGeometry());tetherGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6),3));const tetherMaterial=new THREE.LineBasicMaterial({color:reference?'#9cd9ef':'#c8d7ad',depthTest:false,depthWrite:false,transparent:true,opacity:.85});materials.add(tetherMaterial);const tether=new THREE.Line(tetherGeometry,tetherMaterial);tether.renderOrder=34;tether.frustumCulled=false;group.add(tether);
    const label=el(onDetails?'button':'div',null,'regional-globe-cue'+(reference?' is-reference':''));if(onDetails){label.type='button';label.onclick=()=>onDetails?.({kind:model.kind,point:{...point}});}label.title=reference?point.note:model.scopeNote+' '+model.coordinateMeaning;label.dataset.kind=model.kind;const title=el('strong'),readout=el('span',null,'regional-cue-values'),period=el('small');label.append(title,readout,period);layer.append(label);
    const leader=svg('line'),screenDot=svg('circle',{r:2.6});leaders.append(leader,screenDot);const e={point,reference,group,pin,symbol,tether,label,title,readout,period,leader,screenDot,visible:false,labelVisible:false,modelOffset:{x:0,y:0},labelRect:null};entries.push(e);return e;
  }
  function refreshText(){for(const e of entries){e.title.textContent=e.reference?e.point.label:model.title;e.readout.textContent=e.reference?'参照像元 '+e.point.value+'% · 与主点分开':model.lines.map(line=>line.replace(/[。；]+$/,'')).join('；');e.period.textContent=e.reference?e.point.period+' · 独立水面参照':model.dataNote+' · '+(model.kind==='soil'&&model.missing?model.missingLabel:'符号为原理示意');e.label.title=e.reference?e.point.note:model.scopeNote+' '+model.coordinateMeaning;}}
  function setScene(input={}){
    if(destroyed)return null;model=resolveRegionalGlobeCues(input);fullMap=input.fullMap===true;if(!model){clear();return null;}
    const nextKey=[model.kind,model.teachingContext,model.focus.lon,model.focus.lat,model.missing,...model.references.flatMap(p=>[p.lon,p.lat,p.value])].join(':');if(nextKey!==key){release();key=nextKey;makeEntry(model.focus);for(const p of model.references)makeEntry(p,true);}entries[0].point=model.focus;model.references.forEach((p,i)=>{entries[i+1].point=p;});refreshText();root.visible=!fullMap;layer.hidden=leaders.hidden=fullMap;leaders.style.display=fullMap?'none':'';if(fullMap)for(const e of entries){e.visible=e.labelVisible=false;e.label.hidden=true;e.leader.style.display=e.screenDot.style.display='none';}requestDraw?.();return {...model.focus};
  }
  function projected(point){const p=point.clone().applyMatrix4(globe.matrixWorld),normal=p.clone().sub(origin).normalize(),front=normal.dot(cameraPosition.clone().sub(p).normalize());p.project(camera);return {x:(p.x+1)*globeRoot.clientWidth/2,y:(1-p.y)*globeRoot.clientHeight/2,front};}
  function hardBlocks(){const base=globeRoot.getBoundingClientRect();return ['.global-header','#regional-classroom','#regional-scene-card','#course-player-dock','#regional-player-dock','.regional-compact-cue','#globe-data-controls','.global-tour','.regional-map-label','#global-catalog','.class-globe-companion','.guided-route-bar','#globe-guide-controls','#globe-appearance-controls','.course-directory'].map(selector=>{const e=document.querySelector(selector);if(!e||e.hidden||!e.getClientRects?.().length)return null;const style=getComputedStyle(e);if(style.display==='none'||style.visibility==='hidden')return null;const r=e.getBoundingClientRect();return r.width&&r.height?rect(r.left-base.left,r.top-base.top,r.width,r.height):null;}).filter(Boolean);}
  function beforeRender(){
    const active=!!model&&!fullMap&&!destroyed;root.visible=active;layer.hidden=leaders.hidden=!active;leaders.style.display=active?'':'none';for(const e of entries){e.label.hidden=true;e.leader.style.display=e.screenDot.style.display='none';e.visible=e.labelVisible=false;e.labelRect=null;}if(!active)return;
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight;if(!width||!height)return;globe.getWorldPosition(origin);camera.getWorldPosition(cameraPosition);globe.getWorldQuaternion(inverse).invert();const pixels=(camera.top-camera.bottom)/height,small=width<=760,size=small?56:70,blocked=hardBlocks(),occupied=[],items=[];leaders.setAttribute('viewBox',`0 0 ${width} ${height}`);
    for(const e of entries){const anchor=vector(e.point.lon,e.point.lat,1.03),p=projected(anchor);e.group.visible=p.front>.15&&p.x>4&&p.x<width-4&&p.y>4&&p.y<height-4;if(!e.group.visible)continue;
      let dx=0,dy=0;const offsets=[[82,-5],[-82,-5],[78,-53],[-78,-53],[0,-82],[110,13],[-110,13]];
      // An independent reference has only a small geographic pin, no 70px
      // illustration. A nearby sample's label may cover its pin on screen;
      // still offer a separately placed, led label at the unchanged coordinate.
      // Testing an imaginary symbol footprint here could hide it permanently.
      const place=e.reference?[0,0]:offsets.find(([x,y])=>{const box=rect(p.x+x-size*.48,p.y+y-size,size*.96,size+4);return box.left>=4&&box.right<width-4&&box.top>=4&&box.bottom<height-4&&![...blocked,...occupied].some(b=>overlap(box,b));});
      if(!place){e.group.visible=false;continue;}[dx,dy]=place;const position=vector(e.point.lon,e.point.lat,1.046).add(new THREE.Vector3(dx*pixels,-dy*pixels,0).applyQuaternion(inverse));e.symbol.position.copy(position);e.symbol.quaternion.copy(inverse);e.symbol.scale.setScalar(size*pixels);e.visible=true;e.modelOffset={x:dx,y:dy};
      if(!e.reference)occupied.push(rect(p.x+dx-size*.48,p.y+dy-size,size*.96,size+4));const array=e.tether.geometry.attributes.position;array.setXYZ(0,anchor.x,anchor.y,anchor.z);array.setXYZ(1,position.x,position.y,position.z);array.needsUpdate=true;e.tether.visible=!e.reference;
      // These are the current two evidence readouts, rather than optional
      // background place names. Search bounded free space beyond the preferred
      // offsets when neighbouring regional labels occupy all eight positions.
      // Primary remains first; an infeasible/crowded result is still hidden.
      e.label.hidden=false;const measured=e.label.getBoundingClientRect(),w=Math.min(small?205:244,measured.width||220),h=measured.height||(e.reference?61:88);e.label.hidden=true;items.push({id:e.reference?'reference':'primary',x:p.x,y:p.y,width:w,height:h,priority:e.reference?50:100,maxOffset:small?220:265,required:true,offsets:[[112,32],[-112,32],[110,-95],[-110,-95],[0,70],[0,-130],[160,-20],[-160,-20]]});
    }
    const placed=layoutGeographyLabels(items,{bounds:{left:6,top:6,width:width-12,height:height-12},obstacles:[...blocked,...occupied],maxLabels:2,gap:5});
    for(const p of placed){const e=entries.find(e=>(e.reference?'reference':'primary')===p.id);if(!e||p.crowded)continue;e.label.hidden=false;e.labelVisible=true;e.label.style.left=p.left+'px';e.label.style.top=p.top+'px';e.labelRect=rect(p.left,p.top,p.width,p.height);for(const [k,v]of Object.entries({x1:p.anchorX,y1:p.anchorY,x2:p.leaderEndX,y2:p.leaderEndY}))e.leader.setAttribute(k,String(v));e.screenDot.setAttribute('cx',String(p.anchorX));e.screenDot.setAttribute('cy',String(p.anchorY));e.leader.style.display=e.screenDot.style.display='';}
  }
  function clear(){model=null;key='';release();root.visible=false;layer.hidden=leaders.hidden=true;leaders.style.display='none';requestDraw?.();}
  return {setScene,beforeRender,clear,getState:()=>({enabled:!!model,fullMap,kind:model?.kind||null,focus:model?.focus?{...model.focus}:null,values:model?.values.map(v=>({...v}))||[],scopeNote:model?.scopeNote||'',anchors:entries.map(e=>({lon:e.point.lon,lat:e.point.lat,reference:e.reference,visible:e.visible,labelVisible:e.labelVisible,modelOffset:{...e.modelOffset},labelRect:e.labelRect?{...e.labelRect}:null}))}),destroy(){if(destroyed)return;clear();destroyed=true;root.removeFromParent();layer.remove();leaders.remove();}};
}
