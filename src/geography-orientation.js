import * as THREE from 'three';

// Broad label positions help readers orient themselves. They are not geographic
// boundaries, vegetation ranges, or occurrence records.
const PLACES=[
  {id:'china',name:'中国 · 在亚洲',short:'中国',lon:105,lat:35,kind:'familiar',priority:0},
  {id:'asia',name:'亚洲',lon:88,lat:48,kind:'land',priority:1},
  {id:'africa',name:'非洲',lon:20,lat:2,kind:'land',priority:1},
  {id:'europe',name:'欧洲',lon:15,lat:53,kind:'land',priority:2},
  {id:'north-america',name:'北美洲',lon:-105,lat:42,kind:'land',priority:1},
  {id:'south-america',name:'南美洲',lon:-61,lat:-18,kind:'land',priority:1},
  {id:'oceania',name:'大洋洲',lon:136,lat:-25,kind:'land',priority:2},
  {id:'antarctica',name:'南极洲',lon:20,lat:-78,kind:'land',priority:3},
  {id:'pacific',name:'太平洋',lon:158,lat:1,kind:'ocean',priority:2},
  {id:'atlantic',name:'大西洋',lon:-32,lat:15,kind:'ocean',priority:2},
  {id:'indian',name:'印度洋',lon:76,lat:-23,kind:'ocean',priority:2},
  {id:'arctic',name:'北冰洋',lon:0,lat:81,kind:'ocean',priority:3},
  {id:'southern',name:'南大洋',lon:70,lat:-62,kind:'ocean',priority:3}
];
const LATITUDE_MODES=new Set(['equator','sunlight','rainforest']);
const VALID_MODES=new Set(['landsea','equator','sunlight','rainforest']);
const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};

export function createGeographyOrientation({globe,camera,globeRoot,vector,requestDraw,moveTo,managedGuides=false}){
  const group=new THREE.Group();group.name='geography-orientation';group.visible=false;globe.add(group);
  const host=node('div',null,'geo-orientation-labels');host.id='geo-orientation-labels';host.hidden=true;globeRoot.append(host);
  const note=node('aside',null,'geo-orientation-note');note.id='geo-orientation-note';note.hidden=true;note.setAttribute('aria-label','怎样读这颗地球');globeRoot.append(note);
  const noteSummary=node('button',null,'geo-orientation-summary'),noteBody=node('div',null,'geo-orientation-copy');noteSummary.type='button';noteBody.id='geo-orientation-copy';noteSummary.setAttribute('aria-controls',noteBody.id);note.append(noteSummary,noteBody);
  const north=node('span','向北 · 北极方向','geo-direction north'),south=node('span','向南 · 南极方向','geo-direction south');host.append(north,south);
  const labels=new Map();
  function getLabel(id,interactive=true){
    if(labels.has(id))return labels.get(id);
    const label=node(interactive?'button':'span',null,'geo-orientation-label');if(interactive)label.type='button';label.dataset.place=id;label.hidden=true;host.append(label);labels.set(id,label);return label;
  }
  function latitudeLine(latitude,color,dashed=false){
    const geometry=new THREE.BufferGeometry().setFromPoints(Array.from({length:181},(_,i)=>vector(i*2-180,latitude,1.014)));
    const material=dashed?new THREE.LineDashedMaterial({color,transparent:true,opacity:.62,dashSize:.025,gapSize:.016}):new THREE.LineBasicMaterial({color,transparent:true,opacity:.98});
    const line=new THREE.LineLoop(geometry,material);if(dashed)line.computeLineDistances();group.add(line);return line;
  }
  const equator=latitudeLine(0,'#f4d37d');
  const equatorBack=latitudeLine(0,'#f4d37d',true);equatorBack.material.depthTest=false;equatorBack.material.opacity=.20;equatorBack.renderOrder=6;
  const northTropic=latitudeLine(23.44,'#a7c9a1',true),southTropic=latitudeLine(-23.44,'#a7c9a1',true);
  const tropics=new THREE.Mesh(new THREE.SphereGeometry(1.007,96,32,0,Math.PI*2,(90-23.44)*Math.PI/180,46.88*Math.PI/180),new THREE.MeshBasicMaterial({color:'#dcb76a',transparent:true,opacity:.11,depthWrite:false}));group.add(tropics);
  // A camera-facing principle sketch: equal-width parallel beams intersect a
  // spherical section. This does not model the present terminator or seasons.
  const sunRays=new THREE.Group();sunRays.name='parallel-sunlight-principle';sunRays.visible=false;group.add(sunRays);
  const rayZ=.025,surfaceX=y=>-Math.sqrt(Math.max(0,1-y*y-rayZ*rayZ));
  for(const middle of [0,.72]){
    for(const delta of [-.06,0,.06]){
      const y=middle+delta,start=new THREE.Vector3(-1.36,y,rayZ),end=surfaceX(y),arrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),start,end-start.x,'#f3d581',.045,.023);arrow.renderOrder=20;
      arrow.traverse(object=>{if(object.material){object.material.depthTest=false;object.material.depthWrite=false;object.material.transparent=true;object.material.opacity=.88;}object.renderOrder=20;});sunRays.add(arrow);
    }
    const footprintPoints=Array.from({length:25},(_,i)=>{const y=middle-.06+.12*i/24;return new THREE.Vector3(surfaceX(y),y,rayZ+.006);});
    const footprint=new THREE.Line(new THREE.BufferGeometry().setFromPoints(footprintPoints),new THREE.LineBasicMaterial({color:'#ffe5a2',depthTest:false,depthWrite:false}));footprint.renderOrder=21;sunRays.add(footprint);
  }
  const focusDot=new THREE.Mesh(new THREE.SphereGeometry(.014,12,8),new THREE.MeshBasicMaterial({color:'#fff1b4'}));group.add(focusDot);
  let enabled=false,mode='landsea',focus=null,visibleLabelIds=[],noteExpanded=false,noteNarrow=false;
  function compactNote(narrow){
    noteNarrow=narrow;note.dataset.narrow=String(narrow);noteSummary.hidden=!narrow;noteBody.hidden=narrow&&!noteExpanded;
    const title={landsea:'陆地与海洋',equator:'赤道分南北',sunlight:'热带通常较暖',rainforest:'当前位置'}[mode];
    noteSummary.textContent=title+(noteExpanded?' · 收起':' · 查看提示');noteSummary.setAttribute('aria-expanded',String(noteExpanded));
  }
  noteSummary.onclick=()=>{noteExpanded=!noteExpanded;compactNote(noteNarrow);requestDraw();};
  function noteLayout(narrow){
    const rootBox=globeRoot.getBoundingClientRect(),compact=document.querySelector('.learning-journey')?.classList.contains('learn-collapsed')===true;
    const visibleBox=element=>{if(!element)return null;for(let parent=element;parent;parent=parent.parentElement)if(parent.hidden)return null;const rect=element.getBoundingClientRect();return rect.width>0&&rect.height>0?rect:null;};
    const header=visibleBox(document.querySelector('.learn-header'))||visibleBox(document.querySelector('.foundation-header'));
    const controls=compact?[document.getElementById('learning-map-view-controls'),document.getElementById('learning-globe-actions'),document.querySelector('.learn-panel')].map(visibleBox).filter(Boolean):[];
    const headerBottom=(header?.bottom??rootBox.top+90)-rootBox.top;
    // These rows wrap as the window changes. Use their current boxes, not a
    // second hard-coded copy of the header or action-row CSS offsets.
    note.style.top=(Math.max(header?.bottom??rootBox.top+90,...controls.map(rect=>rect.bottom))-rootBox.top+8)+'px';
    note.dataset.learningCompact=String(compact);compactNote(narrow);
    const relative=rect=>({left:rect.left-rootBox.left,right:rect.right-rootBox.left,top:rect.top-rootBox.top,bottom:rect.bottom-rootBox.top});
    const appearance=visibleBox(document.getElementById('globe-appearance-controls'));
    return {compact,headerBottom,noteBox:relative(note.getBoundingClientRect()),blocked:controls.map(relative).concat(relative(note.getBoundingClientRect()),appearance?[relative(appearance)]:[])};
  }

  function setMode(next,currentFocus=null){
    if(!VALID_MODES.has(next)){hide();return;}
    enabled=true;mode=next;focus=currentFocus&&Number.isFinite(currentFocus.lon)&&Number.isFinite(currentFocus.lat)?{...currentFocus}:null;
    group.visible=true;host.hidden=false;note.hidden=false;host.dataset.mode=mode;note.dataset.mode=mode;
    const latitudeMode=LATITUDE_MODES.has(mode)&&!managedGuides;equator.visible=latitudeMode;equatorBack.visible=latitudeMode;northTropic.visible=mode==='sunlight'&&!managedGuides;southTropic.visible=northTropic.visible;tropics.visible=northTropic.visible;sunRays.visible=mode==='sunlight';
    focusDot.visible=mode==='rainforest';if(focusDot.visible)focusDot.position.copy(vector(focus?.lon??114,focus?.lat??2,1.02));
    noteBody.replaceChildren();
    const title=node('strong',mode==='landsea'?'先认陆地和海洋':mode==='equator'?'黄色线是赤道，把地球分成南北两半':mode==='sunlight'?'同向阳光示意：球面不同位置，照射角度不同':'我们现在在哪里？');noteBody.append(title);
    if(mode==='landsea'){
      const legend=node('div',null,'geo-landsea-key');for(const [name,color] of [['陆地','#527d61'],['海洋','#234d6c']]){const item=node('span'),swatch=node('i');swatch.style.background=color;item.append(swatch,document.createTextNode(name));legend.append(item);}noteBody.append(legend,node('p','洲是大片陆地区域，洋是大片海域。点地名，可以转到它面前。'));
    }else if(mode==='rainforest')noteBody.append(node('p',focus?.path||'亚洲 → 东南亚 → 婆罗洲（岛屿）'),node('small','黄线帮你看它离赤道有多近；黄点只定位这次的例子。'));
    else if(mode==='sunlight')noteBody.append(node('p','上下两条浅绿色虚线之间叫热带，通常全年较暖；不表示处处多雨。'),node('small','左侧平行光是球面受光原理示意，不模拟此刻日照、季节或真实温度。'));
    else noteBody.append(node('p','赤道上方是北半球，下方是南半球；先找中国在它的哪一侧。'),node('small','这些线是帮助定位的想象线，地面没有画线；淡虚线表示背面延续。'));
    compactNote(noteNarrow);
    for(const label of labels.values())label.hidden=true;requestDraw();
  }
  function hide(){enabled=false;group.visible=false;host.hidden=true;note.hidden=true;visibleLabelIds=[];for(const label of labels.values())label.hidden=true;requestDraw();}

  function beforeRender(){
    if(!enabled)return;
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight,narrow=width<=760;
    const layout=noteLayout(narrow),{noteBox}=layout,rootBox=globeRoot.getBoundingClientRect();
    const player=document.getElementById('imm-player'),playerTop=(player?.getBoundingClientRect().top??rootBox.top+height)-rootBox.top;
    const panel=document.querySelector('.learn-panel'),panelBox=panel?.getBoundingClientRect(),drawer=!layout.compact&&panelBox&&panelBox.width>0;
    const sideLimit=!narrow&&drawer?panelBox.left-rootBox.left-10:width-8;
    const floor=narrow&&drawer?Math.min(playerTop,panelBox.top-rootBox.top)-6:playerTop-8;
    const front=globe.getWorldQuaternion(new THREE.Quaternion()).invert(),direction=new THREE.Vector3(0,0,1).applyQuaternion(front);
    if(sunRays.visible)sunRays.quaternion.copy(front);
    const frontLon=Math.atan2(-direction.z,direction.x)*180/Math.PI;
    const center=new THREE.Vector3().project(camera),cx=(center.x+1)*width/2,cy=(1-center.y)*height/2,radius=height/(camera.top-camera.bottom);
    north.hidden=managedGuides||cy-radius-22<noteBox.bottom||cx>sideLimit;south.hidden=managedGuides||cy+radius+20>floor||cx>sideLimit;
    north.style.left=cx+'px';north.style.top=(cy-radius-22)+'px';south.style.left=cx+'px';south.style.top=(cy+radius+6)+'px';
    for(const label of labels.values())label.hidden=true;
    const candidates=mode==='landsea'?PLACES.map(place=>({...place})):mode==='rainforest'?[
      {id:'borneo',name:focus?.label||'婆罗洲',lon:focus?.lon??114,lat:focus?.lat??2,kind:'focus',priority:0},
      ...PLACES.filter(place=>place.kind==='land'&&place.id!=='antarctica').map(place=>({...place,priority:3})),
      {id:'southeast-asia',name:'东南亚',lon:102,lat:16,kind:'land',priority:2},
      {id:'indian',name:'印度洋',lon:76,lat:-23,kind:'ocean',priority:4},
      {id:'pacific',name:'太平洋',lon:158,lat:1,kind:'ocean',priority:4},
      {id:'equator',name:'赤道',lon:frontLon,lat:0,kind:'latitude',priority:1,dy:24,interactive:false}
    ]:[
      ...(mode==='sunlight'?[
        {id:'direct-sun',name:'近直照射',screenPoint:new THREE.Vector3(-.77,-.13,.04),kind:'sunlight',priority:0,interactive:false},
        {id:'slant-sun',name:'斜着照射',screenPoint:new THREE.Vector3(-.40,.72,.04),kind:'sunlight',priority:0,interactive:false}
      ]:[]),
      {id:'equator',name:'赤道',lon:frontLon,lat:0,kind:'latitude',priority:0,dy:13,interactive:false},
      {id:'north-hemisphere',name:'北半球',lon:frontLon,lat:52,kind:'hemisphere',priority:mode==='sunlight'?4:1,interactive:false},
      {id:'south-hemisphere',name:'南半球',lon:frontLon,lat:-52,kind:'hemisphere',priority:mode==='sunlight'?4:1,interactive:false},
      ...(mode==='sunlight'?[{id:'north-tropic',name:'热带北缘',lon:frontLon,lat:23.44,kind:'tropic',priority:2,dy:-10,interactive:false},{id:'south-tropic',name:'热带南缘',lon:frontLon,lat:-23.44,kind:'tropic',priority:2,dy:10,interactive:false}]:[{...PLACES[0],priority:2}]),
      {id:'north-pole',name:'北极',lon:frontLon,lat:89.9,kind:'pole',priority:3,interactive:false},
      {id:'south-pole',name:'南极',lon:frontLon,lat:-89.9,kind:'pole',priority:3,interactive:false}
    ];
    const placed=[],limit=mode==='landsea'?(narrow?5:7):mode==='rainforest'?(narrow?4:6):(narrow?5:7);visibleLabelIds=[];
    for(const place of candidates.filter(place=>!managedGuides||!['latitude','tropic','hemisphere','pole'].includes(place.kind)).sort((a,b)=>a.priority-b.priority)){
      const world=place.screenPoint?place.screenPoint.clone():vector(place.lon,place.lat,1.026).applyMatrix4(globe.matrixWorld),toward=camera.position.clone().sub(world).normalize();if(!place.screenPoint&&world.clone().normalize().dot(toward)<.17)continue;
      const projected=world.project(camera),x=(projected.x+1)*width/2,y=(1-projected.y)*height/2+(place.dy||0);
      const label=getLabel(place.id,place.interactive!==false);label.className='geo-orientation-label '+place.kind;label.textContent=place.name;label.hidden=false;
      if(place.interactive!==false){label.setAttribute('aria-label','把'+place.name+'转到面前');label.title='点一下，把'+place.name+'转到面前';label.onclick=()=>{moveTo?.(place.lon,place.lat);requestDraw();};}
      const box=label.getBoundingClientRect(),w=Math.max(35,box.width),h=Math.max(20,box.height);let accepted=false;
      for(const dy of [0,-19,19,-35,35]){
        const rect={left:x-w/2-3,right:x+w/2+3,top:y+dy-h/2-3,bottom:y+dy+h/2+3};
        if(rect.left<7||rect.right>sideLimit||rect.top<layout.headerBottom+4||rect.bottom>floor)continue;
        if(layout.blocked.some(other=>rect.left<other.right+4&&rect.right>other.left-4&&rect.top<other.bottom+4&&rect.bottom>other.top-4))continue;
        if(placed.some(other=>rect.left<other.right&&rect.right>other.left&&rect.top<other.bottom&&rect.bottom>other.top))continue;
        label.style.left=x+'px';label.style.top=(y+dy)+'px';placed.push(rect);visibleLabelIds.push(place.id);accepted=true;break;
      }
      label.hidden=!accepted;if(visibleLabelIds.length>=limit)break;
    }
  }
  return {setMode,beforeRender,hide,getState:()=>({enabled,mode,focus:focus?{...focus}:null,visibleLabelIds:[...visibleLabelIds],equatorVisible:enabled&&equator.visible,tropicsVisible:enabled&&tropics.visible,sunlightPrincipleVisible:enabled&&sunRays.visible})};
}
