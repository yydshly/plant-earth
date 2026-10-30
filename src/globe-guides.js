import * as THREE from 'three';

// These are geographic references on a sphere, not climate or vegetation ranges.
// 23.44° and 66.56° are rounded teaching references for Earth's present obliquity.
export const GUIDE_GROUPS=Object.freeze([
  {key:'equator',label:'赤道',color:'#f5cf76',description:'纬度0°，把地球分成北半球和南半球。这是定位用的想象线。'},
  {key:'tropics',label:'南北回归线',color:'#b8d58b',description:'约23.4°N和23.4°S，两线之间为热带。它们说明太阳照射的位置范围，不是雨林或冷热的实际边界。'},
  {key:'polar',label:'南北极圈',color:'#9bd4ed',description:'约66.6°N和66.6°S，帮助认识极昼、极夜可能出现的纬度区域，不表示这里终年冰雪覆盖。'},
  {key:'meridians',label:'0°与180°经线',color:'#d6b4e7',description:'本初经线为经度0°，向东、向西分别计东经和西经。180°经线在另一侧；现实中的国际日期变更线并不完全沿着它。'},
  {key:'graticule',label:'经纬网与刻度',color:'#9bb4bd',description:'纬线围绕地球横向成圈，经线连接南北极。N/S表示北纬/南纬，E/W表示东经/西经。网格用于定位，不是国家或植物边界。'},
  {key:'axis',label:'地轴与南北极',color:'#e5e8dd',description:'地轴连接南北极，地球绕它自转。这里只在两极外延长显示，不另外画一个没有公转面参照的倾斜角。'},
  {key:'zones',label:'五个日照纬度带',color:'#d7c292',description:'回归线和极圈划分出热带、南北温带、南北寒带。这是日照的纬度分带，不是实际气候区、植被界线或种植适宜范围。'},
  {key:'backside',label:'背面淡虚线',color:'#8c9e9a',description:'用很淡的虚线表示主要参考线在地球背面继续延伸；可以关闭，让正面更清楚。'}
]);
const ALL_KEYS=GUIDE_GROUPS.map(row=>row.key),FLAGS=keys=>Object.fromEntries(ALL_KEYS.map(key=>[key,keys.includes(key)]));
export const GUIDE_PRESETS=Object.freeze({
  orientation:{label:'认识位置',groups:FLAGS(['equator','tropics','meridians','graticule']),density:'normal'},
  basic:{label:'常用标线',groups:FLAGS(['equator','tropics','polar','meridians','graticule','axis']),density:'normal'},
  all:{label:'全部辅助',groups:FLAGS(ALL_KEYS),density:'fine'},
  off:{label:'关闭标线',groups:FLAGS([]),density:'normal'}
});
const GROUP_META=new Map(GUIDE_GROUPS.map(row=>[row.key,row]));
const LESSON_EMPHASIS={
  landsea:{groups:['graticule','meridians'],reason:'这一步先找陆地和海洋的位置。经纬网和经线帮助定位；洲名、国家边界并不能决定植物分布。'},
  equator:{groups:['equator','axis'],reason:'先沿赤道分清南北半球，再用地轴找到南北极。赤道是一条位置参照，不是雨林边界。'},
  sunlight:{groups:['equator','tropics','axis','zones'],reason:'赤道、回归线和地轴帮助比较阳光照射的位置。浅色纬度带只是日照分带，不表示真实气温、气候区或植物边界。'},
  'water-cycle':{groups:['equator'],reason:'用赤道看清婆罗洲的位置；水汽怎样上升、冷却和降雨，还需要另外观察，不能由一条纬线推出。'},
  forest:{groups:['equator','tropics'],reason:'先对照这片森林的大致纬度，再看水、光、土壤及生物关系。回归线不会把森林围在其中。'},
  rainforest:{groups:['equator','tropics'],reason:'用赤道和回归线看雨林案例的大致位置；长期水热配合才有助于解释森林，标线不是雨林的范围。'},
  'check-pattern':{groups:['equator','tropics','graticule'],reason:'利用纬线比较两地的位置，再追问水汽、雨季和地形。纬度带相近，植物景观仍可能不同。'},
  overview:{groups:['equator','tropics','polar'],reason:'先用赤道、回归线和极圈建立全球位置参照。日照纬度带不等于真实气候区或植被分布。'},
  savanna:{groups:['equator','tropics'],reason:'先看草原案例的纬度，再比较雨季、干季与土地利用；回归线并不是草原边界。'},
  desert:{groups:['tropics','graticule'],reason:'回归线和经纬网帮助比较荒漠案例的位置。荒漠也有冷暖差别，不能只凭纬度判断缺水程度。'},
  temperate:{groups:['tropics','polar'],reason:'回归线和极圈帮助认识中纬度位置。两线之间的日照分带不是温带森林的真实边界。'},
  boreal:{groups:['polar','axis'],reason:'极圈和南北极帮助定位高纬地区；针叶林并不只出现在极圈以内，分布仍受水热和地形影响。'},
  wetland:{groups:['graticule'],reason:'经纬网只帮助定位不同水域。湿地和海草生境横跨气候带，还要观察水深、盐度、光照等条件。'}
};
const LESSON_DIM_FACTOR=.45;
const normaliseLongitude=value=>((value+180)%360+360)%360-180;
const latitudeName=lat=>lat===0?'0°':Math.abs(lat)+'°'+(lat>0?'N':'S');
const longitudeName=lon=>lon===0?'0°':Math.abs(lon)+'°'+(lon>0?'E':'W');
const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(className)n.className=className;return n;};

export function createGlobeGuides({globe,camera,globeRoot,vector,requestDraw,onExplain,onLayout}){
  const root=new THREE.Group();root.name='globe-geographic-reference-guides';root.visible=false;globe.add(root);
  const layers=Object.fromEntries(ALL_KEYS.map(key=>{const group=new THREE.Group();group.name='guide-layer-'+key;group.userData.guideGroup=key;root.add(group);return [key,group];}));
  const labelsHost=node('div',null,'globe-guide-labels');labelsHost.id='globe-guide-labels';labelsHost.hidden=true;labelsHost.setAttribute('aria-label','地球辅助标线名称与刻度');globeRoot.append(labelsHost);
  const labelNodes=new Map(),mainLines=[],ghostLines=[];
  let enabled=false,preset='basic',groups={...GUIDE_PRESETS.basic.groups},density='normal',context={},visibleLabels=[],followLesson=true;

  function material(color,{dashed=false,opacity=1,depthTest=true}={}){
    const options={color,transparent:true,opacity,depthTest,depthWrite:false};
    return dashed?new THREE.LineDashedMaterial({...options,dashSize:.025,gapSize:.018}):new THREE.LineBasicMaterial(options);
  }
  function addCurve(key,kind,value,{color=GROUP_META.get(key).color,dashed=false,radius=1.016,opacity=.9,ghost=false}={}){
    const latitude=kind==='latitude',points=latitude?Array.from({length:360},(_,i)=>vector(i-180,value,radius)):Array.from({length:181},(_,i)=>vector(value,i-90,radius));
    const geometry=new THREE.BufferGeometry().setFromPoints(points),line=latitude?new THREE.LineLoop(geometry,material(color,{dashed,opacity,depthTest:!ghost})):new THREE.Line(geometry,material(color,{dashed,opacity,depthTest:!ghost}));
    line.name='guide-'+key+'-'+kind+'-'+value+(ghost?'-backside':'');line.userData={guideGroup:ghost?'backside':key,sourceGroup:key,kind,[latitude?'latitude':'longitude']:value,backside:ghost,radius};line.renderOrder=ghost?3:8;
    if(dashed)line.computeLineDistances();layers[ghost?'backside':key].add(line);(ghost?ghostLines:mainLines).push(line);return line;
  }
  for(const [key,lats] of [['equator',[0]],['tropics',[23.44,-23.44]],['polar',[66.56,-66.56]]])for(const lat of lats){
    addCurve(key,'latitude',lat,{dashed:key!=='equator'});
    addCurve(key,'latitude',lat,{dashed:true,radius:1.014,opacity:.13,ghost:true});
  }
  for(const lon of [0,180]){addCurve('meridians','longitude',lon,{dashed:lon===180});addCurve('meridians','longitude',lon,{dashed:true,radius:1.014,opacity:.13,ghost:true});}

  function rebuildGraticule(){
    for(const line of [...layers.graticule.children]){layers.graticule.remove(line);line.geometry.dispose();line.material.dispose();const i=mainLines.indexOf(line);if(i>=0)mainLines.splice(i,1);}
    const latStep=density==='fine'?10:15,lonStep=density==='fine'?15:30;
    for(let lat=-90+latStep;lat<90;lat+=latStep)if(lat!==0)addCurve('graticule','latitude',lat,{radius:1.0105,opacity:density==='fine'?.26:.34});
    for(let lon=-180+lonStep;lon<180;lon+=lonStep)if(lon!==0)addCurve('graticule','longitude',lon,{radius:1.0105,opacity:density==='fine'?.26:.34});
  }
  rebuildGraticule();
  const axis=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.20,0),new THREE.Vector3(0,1.20,0)]),material(GROUP_META.get('axis').color,{opacity:.88}));axis.name='guide-geographic-axis';axis.userData={guideGroup:'axis',kind:'axis',backside:false};layers.axis.add(axis);
  for(const sign of [-1,1]){const tip=new THREE.Mesh(new THREE.ConeGeometry(.014,.045,10),new THREE.MeshBasicMaterial({color:GROUP_META.get('axis').color,depthWrite:false}));tip.position.set(0,sign*1.225,0);if(sign<0)tip.rotation.z=Math.PI;tip.userData={guideGroup:'axis',kind:'axis-tip',pole:sign>0?'north':'south'};layers.axis.add(tip);}
  for(const [id,lower,upper,color] of [['south-cold',-90,-66.56,'#9ccbe0'],['south-temperate',-66.56,-23.44,'#99bfb1'],['tropical',-23.44,23.44,'#d9bd7d'],['north-temperate',23.44,66.56,'#99bfb1'],['north-cold',66.56,90,'#9ccbe0']]){
    const band=new THREE.Mesh(new THREE.SphereGeometry(1.004,96,24,0,Math.PI*2,(90-upper)*Math.PI/180,(upper-lower)*Math.PI/180),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.085,depthWrite:false}));band.name='guide-latitude-zone-'+id;band.userData={guideGroup:'zones',kind:'latitude-zone',lowerLatitude:lower,upperLatitude:upper};layers.zones.add(band);
  }

  function lessonEmphasis(){
    const explicit=Array.isArray(context.guideGroups)?context.guideGroups.filter(key=>ALL_KEYS.includes(key)):[];
    const config=explicit.length?{groups:explicit,reason:context.reason||'跟随当前讲解比较地球位置。'}:['foundation','learning'].includes(context.scope)?LESSON_EMPHASIS[context.lesson]:null;
    const relevant=config?.groups||[],selected=relevant.filter(key=>groups[key]);
    const active=enabled&&followLesson&&selected.length>0;
    return {followLesson,available:!!config,active,scope:context.scope||null,lesson:context.lesson||null,relevantGroups:[...relevant],focusedGroups:active?[...selected]:[],dimmedGroups:active?ALL_KEYS.filter(key=>key!=='backside'&&groups[key]&&!relevant.includes(key)):[],dimFactor:active?LESSON_DIM_FACTOR:1,reason:config?.reason||'',missingFocus:!!config&&selected.length===0};
  }
  function updateAppearance(){
    const emphasis=lessonEmphasis(),focused=new Set(emphasis.relevantGroups);
    for(const layer of Object.values(layers))layer.traverse(object=>{
      if(!object.material)return;const key=object.userData.sourceGroup||object.userData.guideGroup||layer.userData.guideGroup;
      const factor=emphasis.active&&!focused.has(key)?LESSON_DIM_FACTOR:1;
      for(const m of Array.isArray(object.material)?object.material:[object.material]){
        if(!Object.hasOwn(m.userData,'guideBaseOpacity'))m.userData.guideBaseOpacity=m.opacity;
        m.transparent=true;m.opacity=m.userData.guideBaseOpacity*factor;
      }
      object.userData.lessonOpacityFactor=factor;
    });
  }
  function updateVisibility(){root.visible=enabled;labelsHost.hidden=!enabled;for(const key of ALL_KEYS)layers[key].visible=groups[key];for(const line of ghostLines)line.visible=groups[line.userData.sourceGroup];updateAppearance();if(!enabled)for(const label of labelNodes.values())label.hidden=true;requestDraw?.();}
  function setEnabled(value){enabled=!!value;updateVisibility();return getState();}
  function setPreset(name){const config=GUIDE_PRESETS[name];if(!config)return getState();preset=name;groups={...config.groups};if(density!==config.density){density=config.density;rebuildGraticule();}updateVisibility();onLayout?.();return getState();}
  function setGroup(key,value){if(!ALL_KEYS.includes(key))return getState();groups[key]=!!value;preset='custom';updateVisibility();return getState();}
  function setDensity(value){if(!['normal','fine'].includes(value))return getState();if(value!==density){density=value;rebuildGraticule();preset='custom';updateAppearance();requestDraw?.();}return getState();}
  function setContext(value){context=typeof value==='string'?{scope:value}:{...(value||{})};updateAppearance();requestDraw?.();return getState();}
  function setFollowLesson(value){followLesson=!!value;updateAppearance();requestDraw?.();return getState();}
  function getLabel(id,interactive=true){if(labelNodes.has(id))return labelNodes.get(id);const e=node(interactive?'button':'span',null,'globe-guide-label');e.hidden=true;if(interactive)e.type='button';e.dataset.guideId=id;labelsHost.append(e);labelNodes.set(id,e);return e;}
  const projectLocal=position=>{const world=position.clone().applyMatrix4(globe.matrixWorld),screen=world.clone().project(camera),toward=camera.position.clone().sub(world).normalize();return {world,x:(screen.x+1)*globeRoot.clientWidth/2,y:(1-screen.y)*globeRoot.clientHeight/2,front:world.clone().normalize().dot(toward)};};
  function blockers(){const result=[];for(const element of document.querySelectorAll('.learn-header,.learn-panel,#narration-scene-card,#narration-point-label,#geo-orientation-note,#learning-map-key,#imm-player,#guide-toggle,#guide-controls-panel,#globe-appearance-controls,.dist-toolbar,.dist-side,.regional-map-label,.geo-orientation-label:not([hidden]),.learning-map-label:not([hidden]),.dist-model-label:not([hidden])')){
    if(element.hidden||element.id==='guide-controls-panel'&&!element.closest('details')?.open)continue;const style=typeof getComputedStyle==='function'?getComputedStyle(element):null;if(style&&(style.visibility==='hidden'||style.display==='none'))continue;const r=element.getBoundingClientRect();if(r.width>0&&r.height>0)result.push({left:r.left-3,right:r.right+3,top:r.top-3,bottom:r.bottom+3});
    const bounds=element.dataset||{},values=['Left','Top','Right','Bottom'].map(key=>Number(bounds['modelBounds'+key]));if(bounds.modelBoundsSpace==='globe-root'&&values.every(Number.isFinite)&&values[2]>values[0]&&values[3]>values[1]){const origin=globeRoot.getBoundingClientRect();result.push({left:origin.left+values[0]-4,top:origin.top+values[1]-4,right:origin.left+values[2]+4,bottom:origin.top+values[3]+4});}
  }return result;}
  function beforeRender(){
    if(!enabled)return;for(const label of labelNodes.values())label.hidden=true;visibleLabels=[];
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight,narrow=width<=760,origin=globeRoot.getBoundingClientRect(),occupied=blockers().map(r=>({left:r.left-origin.left,right:r.right-origin.left,top:r.top-origin.top,bottom:r.bottom-origin.top}));
    const inverse=globe.getWorldQuaternion(new THREE.Quaternion()).invert(),frontDirection=new THREE.Vector3(0,0,1).applyQuaternion(inverse),frontLon=Math.atan2(-frontDirection.z,frontDirection.x)*180/Math.PI,frontLat=Math.asin(Math.max(-1,Math.min(1,frontDirection.y)))*180/Math.PI;
    const originProjected=new THREE.Vector3().project(camera),center={x:(originProjected.x+1)*width/2,y:(1-originProjected.y)*height/2},radius=height/(camera.top-camera.bottom),candidates=[];
    const add=(id,label,key,anchors,priority,description,extra={})=>candidates.push({id,label,key,anchors,priority,description:description||GROUP_META.get(key).description,...extra});
    const latAnchors=(lat,side=1)=>[side*64,-side*64,side*43,-side*43,side*75,-side*75,0].map(delta=>({lon:frontLon+delta,lat,dy:lat===0?11:0}));
    const polarLesson=/boreal|polar/.test(context.lesson||'');
    if(groups.equator)add('equator','赤道 · 0°','equator',latAnchors(0,-1),0);
    if(groups.tropics){add('north-tropic',narrow?'北回归线 23.4°N':'北回归线 · 约23.4°N','tropics',latAnchors(23.44,1),context.lesson==='sunlight'?1:2);add('south-tropic',narrow?'南回归线 23.4°S':'南回归线 · 约23.4°S','tropics',latAnchors(-23.44,-1),context.lesson==='sunlight'?1:2);}
    if(groups.polar){add('arctic-circle',narrow?'北极圈 66.6°N':'北极圈 · 约66.6°N','polar',latAnchors(66.56,-1),polarLesson?1:4);add('antarctic-circle',narrow?'南极圈 66.6°S':'南极圈 · 约66.6°S','polar',latAnchors(-66.56,1),polarLesson?1:4);}
    if(groups.meridians)for(const [id,lon,label] of [['prime-meridian',0,'本初经线 · 0°'],['antimeridian',180,'180°经线']])add(id,label,'meridians',[-58,58,-35,35,0,73,-73].map(lat=>({lon,lat,dx:8})),5,id==='antimeridian'?'这条线是180°经线。国际日期变更线有绕开岛屿和国家的弯折，不能把两者完全画成同一条线。':undefined);
    if(groups.axis)for(const [sign,id,label] of [[1,'north-pole','北极 N'],[-1,'south-pole','南极 S']])add(id,label,'axis',[{position:new THREE.Vector3(0,sign*1.22,0),allowLimb:true,dy:sign>0?-8:8}],6);
    if(groups.zones)for(const [id,lat,label] of [['north-zone',45,'北温带 · 日照纬度带'],['tropical-zone',0,'热带 · 日照纬度带'],['south-zone',-45,'南温带 · 日照纬度带'],['north-cold-zone',76,'北寒带'],['south-cold-zone',-76,'南寒带']])add(id,label,'zones',[{lon:frontLon,lat}],7);
    if(groups.graticule){
      for(const lat of [-60,-30,30,60])add('lat-tick-'+lat,latitudeName(lat),'graticule',latAnchors(lat,lat>0?-1:1),9,null,{tick:true});
      for(const lon of [-150,-120,-90,-60,-30,30,60,90,120,150])if(Math.abs(normaliseLongitude(lon-frontLon))<78)add('lon-tick-'+lon,longitudeName(lon),'graticule',[-62,62,-42,42].map(lat=>({lon,lat})),10,null,{tick:true});
      // Derive east/west from nearby geographic points, rather than assuming a
      // fixed screen direction after the globe has rotated.
      const front=projectLocal(vector(frontLon,frontLat,1.026));
      for(const [sign,id,label] of [[1,'east-direction','向东 E'],[-1,'west-direction','向西 W']]){
        const near=projectLocal(vector(frontLon+sign*8,frontLat,1.026)),dx=near.x-front.x,dy=near.y-front.y,len=Math.hypot(dx,dy)||1;
        add(id,label,'graticule',[radius+18,radius-15,radius-38].map(distance=>({screen:{x:center.x+dx/len*distance,y:center.y+dy/len*distance}})),8,null,{tick:true});
      }
    }
    const maximum=narrow?5:8,emphasis=lessonEmphasis(),focused=new Set(emphasis.focusedGroups),rank=c=>c.priority+(emphasis.active&&!focused.has(c.key)?20:0);
    for(const c of candidates.sort((a,b)=>rank(a)-rank(b))){
      if(visibleLabels.length>=maximum)break;const isFocus=emphasis.active&&focused.has(c.key),muted=emphasis.active&&!isFocus,label=getLabel(c.id,!c.tick);label.className='globe-guide-label'+(c.tick?' globe-guide-tick':'')+(isFocus?' is-lesson-focus':muted?' is-lesson-muted':'');label.dataset.guideGroup=c.key;label.dataset.lessonFocus=String(isFocus);label.style.setProperty('--guide-color',GROUP_META.get(c.key).color);label.textContent=c.label;label.hidden=false;const description=c.description+(isFocus?' 本课为什么看这条线：'+emphasis.reason:'');label.title=description;
      if(!c.tick){label.setAttribute('aria-label',c.label+(isFocus?'，本课重点':'')+'，点选了解这条线');label.onclick=()=>onExplain?.({id:c.id,title:c.label,label:c.label,description,group:c.key,color:GROUP_META.get(c.key).color,lessonFocus:isFocus});}
      const actual=label.getBoundingClientRect(),w=Math.max(actual.width,(c.tick?5.5:6.5)*c.label.length+14),h=Math.max(actual.height,c.tick?18:25);let accepted=false;
      for(const anchor of c.anchors){
        let p;if(anchor.screen)p={...anchor.screen,front:1};else p=projectLocal(anchor.position||vector(anchor.lon,anchor.lat,1.027));
        if(!anchor.screen&&p.front<.10&&!(anchor.allowLimb&&Math.hypot(p.x-center.x,p.y-center.y)>radius*.99))continue;
        const x=p.x+(anchor.dx||0),y=p.y+(anchor.dy||0),r={left:x-w/2-3,right:x+w/2+3,top:y-h/2-3,bottom:y+h/2+3};
        if(r.left<6||r.right>width-6||r.top<6||r.bottom>height-6)continue;
        if(occupied.some(b=>r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top))continue;
        label.style.left=x+'px';label.style.top=y+'px';occupied.push(r);visibleLabels.push({id:c.id,label:c.label,group:c.key,lessonFocus:isFocus,muted});accepted=true;break;
      }
      label.hidden=!accepted;
    }
  }
  function getState(){return {enabled,preset,groups:{...groups},density,followLesson,lessonEmphasis:lessonEmphasis(),context:{...context},visibleLabels:enabled?visibleLabels.map(item=>({...item})):[],lineCounts:Object.fromEntries(ALL_KEYS.map(key=>[key,layers[key].children.filter(object=>object.isLine||object.isLineLoop).length])),geometrySummary:mainLines.map(line=>({...line.userData,points:line.geometry.attributes.position.count}))};}
  updateVisibility();
  return {setEnabled,setPreset,setGroup,setDensity,setContext,setFollowLesson,beforeRender,getState};
}
