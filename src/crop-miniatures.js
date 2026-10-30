import * as THREE from 'three';

// Low-poly botanical teaching symbols. Organs and developmental stages may be
// enlarged or shown together; the models do not identify a cultivar or scale.
// Shared geometries/materials stay alive for the lifetime of this module.
const Y = new THREE.Vector3(0, 1, 0);
const G = {
  sphere: new THREE.IcosahedronGeometry(1, 1),
  smooth: new THREE.SphereGeometry(1, 10, 7),
  stem: new THREE.CylinderGeometry(1, 1, 1, 6),
  cone: new THREE.ConeGeometry(1, 1, 8),
  soil: new THREE.CylinderGeometry(.28, .26, .23, 14, 1, false, Math.PI / 2, Math.PI),
};
const M = Object.fromEntries(Object.entries({
  leaf: '#5eaa70', leafLight: '#91c985', leafDark: '#387c50', stem: '#91b571',
  grain: '#e6bd62', grainLight: '#f3d88e', bark: '#947154', root: '#cfa478',
  soil: '#745941', soilEdge: '#9c7957', white: '#f6eedb', cotton: '#fff9e8',
  yellow: '#f5cf61', brown: '#795237', red: '#cf5c49', redDark: '#934b3c',
  orange: '#eea452', purple: '#8d71a9', olive: '#a7a55d', pink: '#eabbb5',
}).map(([key, color]) => [key, new THREE.MeshStandardMaterial({color, roughness: .93, metalness: 0, flatShading: true, side: THREE.DoubleSide})]));

function leafGeometry() {
  const pos = [], idx = [], n = 8;
  for (let i = 0; i <= n; i++) {
    const t = i / n, w = .5 * Math.sin(Math.PI * t), bend = .16 * Math.sin(Math.PI * t);
    pos.push(-w,t,bend, 0,t,bend+.055*Math.sin(Math.PI*t), w,t,bend);
  }
  for (let i=0;i<n;i++) for(let j=0;j<2;j++) {const k=i*3+j;idx.push(k,k+3,k+1,k+1,k+3,k+4);}
  const geo = new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();return geo;
}
G.leaf=leafGeometry();
const heartShape=new THREE.Shape();heartShape.moveTo(0,0);heartShape.bezierCurveTo(-.52,.28,-.58,.84,-.18,.9);heartShape.bezierCurveTo(-.04,.92,0,.83,0,.79);heartShape.bezierCurveTo(.04,.94,.25,1.02,.43,.78);heartShape.bezierCurveTo(.65,.48,.22,.14,0,0);G.heart=new THREE.ShapeGeometry(heartShape,5);
const bananaPath=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,0),new THREE.Vector3(.035,.025,0),new THREE.Vector3(.028,.09,0));G.banana=new THREE.TubeGeometry(bananaPath,5,.012,5,false);

function mesh(parent, geometry, material, position=[0,0,0], scale=[1,1,1]) {
  const m=new THREE.Mesh(geometry,typeof material==='string'?M[material]:material);m.position.set(...position);m.scale.set(...scale);parent.add(m);return m;
}
function ellipsoid(parent,position,scale,material='grain',rotation=0) {const m=mesh(parent,G.sphere,material,position,scale);m.rotation.z=rotation;return m;}
function line(parent,a,b,r=.012,material='stem') {
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),length=delta.length();
  if(length<1e-7)return null;
  const m=mesh(parent,G.stem,material,start.clone().add(end).multiplyScalar(.5).toArray(),[r,length,r]);m.quaternion.setFromUnitVectors(Y,delta.normalize());return m;
}
function polyline(parent,points,r=.008,material='stem'){for(let i=1;i<points.length;i++)line(parent,points[i-1],points[i],r,material);}
function leaf(parent,position,length=.35,width=.1,angle=0,yaw=0,material='leaf',heart=false){const m=mesh(parent,heart?G.heart:G.leaf,material,position,[width,length,width]);m.rotation.set(0,yaw,angle,'ZYX');return m;}
function grassBase(parent,{height=.72,width=.09,broad=false}={}) {
  line(parent,[0,0,0],[0,height,0],broad?.018:.011);
  leaf(parent,[0,.22,0],.42,broad?.18:width,-1.05,.1);
  leaf(parent,[0,.4,0],.37,broad?.18:width,1.0,2.4,'leafLight');
  leaf(parent,[0,.11,0],.3,width,.75,4.4,'leafDark');
}
function cereal(id) {
  const root=new THREE.Group();grassBase(root,{height:.72,width:id==='pearl'?.12:.07,broad:id==='sorghum'});
  if(['wheat','barley','rye'].includes(id)){
    const slim=id==='rye';line(root,[0,.68,0],[0,1.02,0],.009,'grain');
    for(let i=0;i<7;i++)for(const side of[-1,1]){
      const y=.73+i*.041,x=side*(slim?.021:.027);
      ellipsoid(root,[x,y,0],[slim?.021:.029,.039,.022],'grain',side*-.5);
      if(id!=='wheat'||i%2===0)line(root,[x,y+.018,0],[x+side*(id==='barley'?.075:.04),y+(id==='barley'?.18:.09),.006],.0024,'grainLight');
    }
  } else if(id==='rice'||id==='oats') {
    polyline(root,id==='rice'?[[0,.67,0],[.025,.85,0],[.11,.95,0],[.18,.89,0]]:[[0,.67,0],[0,1,0]],.008);
    for(let i=0;i<6;i++){
      const side=i%2?-1:1,baseY=.76+i*.033,baseX=id==='rice'?.035+i*.018:0;
      const endX=baseX+side*(.11+i*.009),endY=baseY-(id==='rice'?.075:.08),z=(i%3-1)*.035;
      polyline(root,[[baseX,baseY,0],[endX,baseY+.02,z],[endX,endY,z]],.004);
      for(let j=0;j<2;j++)ellipsoid(root,[endX+(j?side*.025:0),endY-j*.026,z],[id==='rice'?.014:.018,.034,.014],'grain',side*.35);
    }
  } else if(id==='sorghum') {
    ellipsoid(root,[0,.87,0],[.115,.19,.08],'grain');
    for(let i=0;i<17;i++){const a=i*2.399,y=.71+(i%6)*.057,r=.078*(1-Math.abs(y-.87)*2.2);ellipsoid(root,[Math.cos(a)*r,y,Math.sin(a)*r],[.026,.032,.026],i%3?'grain':'grainLight');}
  } else if(id==='foxtail') {
    polyline(root,[[0,.66,0],[.02,.87,0],[.1,.94,0],[.16,.88,0]],.009);
    for(let i=0;i<9;i++){
      const t=i/8,x=.09+t*.09,y=.96-t*.15;
      ellipsoid(root,[x,y,0],[.042,.037,.04],i%3?'grain':'grainLight',-.45);
      if(i%2===0)line(root,[x-.035,y,0],[x-.072,y+.035,.004],.0025,'grainLight');
    }
  } else {
    mesh(root,G.stem,'grain',[0,.89,0],[.068,.31,.068]);ellipsoid(root,[0,1.045,0],[.068,.035,.068]);ellipsoid(root,[0,.735,0],[.068,.035,.068]);
    for(let i=0;i<16;i++){const a=i*2.399;ellipsoid(root,[Math.cos(a)*.063,.76+(i%6)*.049,Math.sin(a)*.063],[.017,.019,.017],i%2?'grain':'grainLight');}
  }
  return root;
}
function maize(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.85,0],.024);
  for(let i=0;i<5;i++)leaf(r,[0,.14+i*.11,0],.4-i*.018,.13,i%2?1.06:-1.05,i*.8,i%2?'leafLight':'leaf');
  line(r,[0,.79,0],[0,1.08,0],.008,'grain');
  for(let i=0;i<6;i++){const side=i%2?-1:1,y=.84+i*.033;line(r,[0,y,0],[side*(.1-i*.007),y+.11,(i%3-1)*.035],.005,'grain');}
  const ear=new THREE.Group();ear.position.set(.07,.44,.025);ear.rotation.z=-.38;r.add(ear);
  ellipsoid(ear,[0,.075,0],[.045,.135,.045],'grain');
  leaf(ear,[-.018,-.045,.01],.2,.073,.35,.2,'leafLight');leaf(ear,[.018,-.045,-.025],.23,.073,-.18,2.7,'leaf');
  for(let i=0;i<4;i++)polyline(ear,[[i*.006-.009,.19,0],[i*.011-.015,.23,.008],[i*.017-.01,.23,.013]],.0025,'grainLight');
  return r;
}
function soilCutaway(r){mesh(r,G.soil,'soil',[0,.115,-.015]);}
function roots(id){
  const r=new THREE.Group();soilCutaway(r);const base=.23;
  if(id==='sweetpotato'){
    polyline(r,[[-.22,base+.03,0],[-.08,.36,0],[.07,.32,.03],[.22,.36,0]],.012);
    for(let i=0;i<5;i++)leaf(r,[-.18+i*.09,.29+(i%2)*.06,0],.23,.2,(i%2?1:-1)*.5,i*.8,'leaf',true);
  }else if(id==='sugarbeet'){
    for(let i=0;i<7;i++)leaf(r,[0,base,0],.55,.23,-.65+(i%3)*.34,i*Math.PI*2/7,i%2?'leafLight':'leaf');
  }else if(id==='cassava'){
    line(r,[0,base,0],[0,.84,0],.017,'bark');
    for(let i=0;i<3;i++){
      const x=(i-1)*.15,y=.58+(i%2)*.15;line(r,[0,.4+i*.08,0],[x,y,0],.008);
      for(let j=0;j<5;j++)leaf(r,[x,y,0],.23,.045,(j-2)*.55,i*.8,'leafLight');
    }
  }else{
    line(r,[0,base,0],[0,.81,0],.016);
    for(let i=0;i<4;i++){
      const side=i%2?-1:1,y=.41+i*.09;line(r,[0,y,0],[side*.12,y+.05,0],.008);
      leaf(r,[side*.12,y+.05,0],.2,.115,side*-.55,i*.6);
      leaf(r,[side*.07,y+.04,0],.15,.09,side*.7,Math.PI/2,'leafLight');
    }
    ellipsoid(r,[.05,.83,.015],[.04,.025,.04],'white');
  }
  if(id==='sugarbeet'){
    ellipsoid(r,[0,.13,.04],[.1,.13,.085],'white');line(r,[0,.1,.04],[.015,0,.04],.014,'root');
  }else{
    for(let i=0;i<3;i++){
      const x=(i-1)*.14,y=.08+(i%2)*.025,z=.075+(i%2)*.025;
      line(r,[0,base,.01],[x,y+.05,z],.009,'root');
      const s=id==='potato'?[.082,.054,.056]:id==='cassava'?[.045,.118,.045]:[.067,.095,.055];
      ellipsoid(r,[x,y,z],s,id==='sweetpotato'?'orange':'root',(i-1)*-.42);
      if(id==='potato')for(let j=0;j<2;j++)ellipsoid(r,[x+(j?-.03:.035),y+.016,z+.047],[.008,.005,.005],'brown');
    }
  }
  return r;
}
function compound(r,x,y,z,id,side){
  if(id==='chickpea'||id==='lentil'){
    line(r,[x,y,z],[x+side*.17,y+.12,z],.005);
    for(let j=0;j<3;j++)for(const s of[-1,1])leaf(r,[x+side*j*.05,y+j*.035,z],.095,.045,s*.9,side>.1?0:1,'leafLight');
  }else if(id==='peanut'){
    for(let j=0;j<2;j++)for(const s of[-1,1])leaf(r,[x+side*.035*j,y+.03*j,z],.14,.083,s*.7,side>.1?0:1,'leaf');
  }else{
    leaf(r,[x,y,z],.2,.13,0,0,'leafLight');leaf(r,[x,y,z],.18,.12,-.95,.3);leaf(r,[x,y,z],.18,.12,.95,2.8);
  }
}
function legumes(id){
  const r=new THREE.Group(),peanut=id==='peanut',base=peanut?.23:0;if(peanut)soilCutaway(r);
  line(r,[0,base,0],[0,peanut?.65:.8,0],.014);
  const count=(id==='chickpea'||id==='lentil')?3:4;
  for(let i=0;i<count;i++){
    const side=i%2?-1:1,y=base+.12+i*.115,x=side*.12;
    line(r,[0,y,0],[x,y+.07,0],.008);compound(r,x,y+.07,0,id,side);
    if(peanut){if(i<2){line(r,[x,y+.02,0],[x*.95,.12,.05],.005,'root');ellipsoid(r,[x,.09,.07],[.045,.075,.034],'root',side*.3);ellipsoid(r,[x,.135,.07],[.043,.04,.033],'root');ellipsoid(r,[x+.018,y+.03,.03],[.03,.02,.025],'yellow');}}
    else if(id==='cowpea')line(r,[x,y,.025],[x+side*.04,y-.2,.045],.014,'leafLight');
    else ellipsoid(r,[x+side*.045,y-.065,.025],id==='chickpea'?[.045,.052,.035]:id==='lentil'?[.046,.032,.014]:[.028,.1,.024],id==='soybean'?'grain':'leafLight',side*.22);
  }
  return r;
}
function sunflower(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.79,0],.025);
  leaf(r,[0,.21,0],.33,.25,-1.1,.2,'leaf',true);leaf(r,[0,.4,0],.3,.23,.95,2.6,'leafLight',true);
  const face=new THREE.Group();face.position.set(0,.83,0);face.rotation.x=.12;r.add(face);
  ellipsoid(face,[0,0,0],[.15,.15,.044],'brown');
  for(let i=0;i<12;i++){const a=i*Math.PI*2/12;const p=ellipsoid(face,[Math.sin(a)*.18,Math.cos(a)*.18,0],[.052,.105,.018],'yellow',-a);}
  for(let i=0;i<10;i++){const a=i*2.399,rad=.03+((i%3)/3)*.09;ellipsoid(face,[Math.sin(a)*rad,Math.cos(a)*rad,.043],[.012,.012,.012],'grain');}
  return r;
}
function rapeseed(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.9,0],.013);
  leaf(r,[0,.15,0],.33,.13,-.9,.6);leaf(r,[0,.32,0],.29,.12,.8,2.6);
  for(let i=0;i<5;i++){
    const side=i%2?-1:1,y=.35+i*.1,x=side*(.15-i*.015);line(r,[0,y,0],[x,y+.13,0],.006);
    if(i<3){line(r,[x,y+.08,0],[x+side*.03,y+.23,0],.011,'grain');}
    else for(let j=0;j<4;j++){const a=j*Math.PI/2;ellipsoid(r,[x+Math.sin(a)*.025,y+.15+Math.cos(a)*.025,.01],[.025,.024,.012],'yellow');}
  }
  for(let j=0;j<4;j++){const a=j*Math.PI/2;ellipsoid(r,[Math.sin(a)*.03,.93+Math.cos(a)*.03,0],[.026,.026,.013],'yellow');}
  return r;
}
function cotton(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.86,0],.02,'bark');
  for(let i=0;i<3;i++){
    const side=i%2?-1:1,y=.28+i*.18,x=side*.15;line(r,[0,y,0],[x,y+.05,0],.014,'bark');
    leaf(r,[x,y+.05,0],.23,.2,side*-.6,side*1.6,'leaf',true);
    const px=x+side*.04,py=y-.01;
    if(i===1)ellipsoid(r,[px,py,.055],[.065,.085,.065],'leafLight');
    else for(let j=0;j<4;j++){const a=j*Math.PI/2;ellipsoid(r,[px+Math.sin(a)*.042,py+Math.cos(a)*.042,.055],[.048,.052,.047],'cotton');}
  }
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ellipsoid(r,[Math.sin(a)*.04,.88+Math.cos(a)*.04,.01],[.035,.038,.02],'pink',-a);}ellipsoid(r,[0,.88,.025],[.02,.02,.02],'yellow');
  return r;
}
function sugarcane(){
  const r=new THREE.Group();for(let stalk=0;stalk<3;stalk++){
    const x=(stalk-1)*.11,z=(stalk%2)*.04,h=.73+stalk*.07;line(r,[x,0,z],[x,h,z],.035,'stem');
    for(let i=1;i<6;i++){const ring=mesh(r,G.stem,'leafDark',[x,h*i/6,z],[.039,.013,.039]);}
    for(let j=0;j<2;j++)leaf(r,[x,h,z],.37,.06,j?1.04:-.96,stalk*1.1,'leafLight');
  }return r;
}
function twig(id){
  const r=new THREE.Group(),isCoffee=id==='arabica'||id==='robusta';line(r,[0,0,0],[0,.84,0],.022,'bark');
  if(isCoffee){
    for(let i=0;i<4;i++){
      const y=.22+i*.15;for(const side of[-1,1]){
        line(r,[0,y,0],[side*.09,y+.025,0],.006,'bark');
        leaf(r,[side*.065,y+.025,0],id==='robusta'?.29:.25,id==='robusta'?.15:.12,side*-.95,side===1?.3:2.8,i%2?'leaf':'leafLight');
        if(i<3)ellipsoid(r,[side*.043,y-.012,.045],[.035,.041,.033],id==='robusta'?'redDark':'red');
      }
    }
  }else if(id==='tea'){
    for(let branch=0;branch<3;branch++){
      const x=(branch-1)*.14,h=.7+(branch%2)*.13;line(r,[0,.1,0],[x,h,0],.012,'bark');
      for(let i=0;i<3;i++)leaf(r,[x,.32+i*.14,0],.2,.095,(i%2?1:-1)*.9,branch*.9,i===2?'leafLight':'leaf');
      leaf(r,[x,h,0],.12,.04,.1,0,'leafLight');
    }
  }else{
    for(let i=0;i<5;i++){
      const side=i%2?-1:1,y=.25+i*.105,x=side*(.12+(i%2)*.04),z=(i%3-1)*.035;line(r,[0,y-.04,0],[x,y+.06,z],.009,'bark');
      leaf(r,[x,y+.06,z],id==='olive'?.23:.22,id==='olive'?.05:.12,side*-.8,i*.9,i%2?'leafLight':'leaf');
      if(i<3)ellipsoid(r,[x,y-.045,z+.04],id==='olive'?[.032,.055,.03]:[.075,.079,.07],id==='olive'?'olive':id==='citrus'?'orange':'red');
    }
    if(id==='apple')for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ellipsoid(r,[.06+Math.sin(a)*.024,.83+Math.cos(a)*.024,.03],[.02,.025,.01],'pink',-a);}
  }
  return r;
}
function cocoa(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.76,0],.045,'bark');
  for(let i=0;i<4;i++){
    const side=i%2?-1:1,x=side*(.11+i*.025),y=.62+i*.06,z=(i%3-1)*.08;line(r,[0,.45+i*.05,0],[x,y,z],.02,'bark');
    leaf(r,[x,y,z],.28,.16,side*-.9,i*.8,i%2?'leafLight':'leaf');
  }
  for(const [x,y,z,a] of [[.075,.23,.025,-.2],[-.065,.41,.025,.2],[.09,.58,.02,-.5]]){
    ellipsoid(r,[x,y,z],[.065,.13,.055],'orange',a);
    for(let j=0;j<3;j++)line(r,[x+(j-1)*.022,y-.09,z+.05],[x+(j-1)*.026,y+.09,z+.05],.003,'grain');
  }
  return r;
}
function frondGeometry(){
  const pos=[];
  const tri=(a,b,c)=>pos.push(...a,...b,...c);
  for(let i=1;i<8;i++){
    const t=i/8,y=.2*Math.sin(Math.PI*t)-.13*t,w=.19*Math.sin(Math.PI*t)+.045;
    for(const side of[-1,1]){
      const a=[0,y,t-.025],b=[side*w,y-.055,t+.07],c=[0,y+.012,t+.035],d=[side*w*.7,y-.02,t+.11];tri(a,b,c);tri(c,b,d);
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();return g;
}
G.frond=frondGeometry();
function palm(id){
  const r=new THREE.Group(),coconut=id==='coconut',oil=id==='oilpalm',height=oil?.62:.8;
  const bend=coconut?.13:0;
  for(let i=0;i<4;i++){const y=i*height/4,y2=(i+1)*height/4;line(r,[bend*Math.sin(i/4*Math.PI*.6),y,0],[bend*Math.sin((i+1)/4*Math.PI*.6),y2,0],oil?.058:.036,'bark');}
  const cx=bend*Math.sin(Math.PI*.6);
  for(let i=1;i<6;i++)mesh(r,G.stem,'root',[bend*Math.sin(i/6*Math.PI*.6),height*i/6,0],[oil?.061:.038,.012,oil?.061:.038]);
  for(let i=0;i<7;i++){
    const frond=new THREE.Group();frond.position.set(cx,height,0);frond.rotation.y=i*Math.PI*2/7;const size=oil?.47:.44;frond.scale.setScalar(size);r.add(frond);
    mesh(frond,G.frond,i%2?'leaf':'leafLight');polyline(frond,[[0,0,0],[0,.11,.33],[0,.08,.66],[0,-.13,1]],.009,'stem');
  }
  if(coconut)for(let i=0;i<3;i++)ellipsoid(r,[cx+(i-1)*.066,height-.055,(i%2)*.05+.025],[.055,.073,.055],'grain');
  else if(oil)for(let i=0;i<12;i++){const a=i*2.399;ellipsoid(r,[cx+Math.cos(a)*.076,height-.08-(i%3)*.034,Math.sin(a)*.065],[.034,.04,.032],i%3?'orange':'redDark');}
  else for(const side of[-1,1]){
    line(r,[cx,height-.015,0],[cx+side*.11,height-.19,.02],.009,'grain');
    for(let i=0;i<8;i++)ellipsoid(r,[cx+side*.11+(i%3-1)*.036,height-.15-Math.floor(i/3)*.052,.025+(i%2)*.02],[.022,.04,.021],'grain');
  }
  return r;
}
function banana(){
  const r=new THREE.Group();line(r,[0,0,0],[0,.65,0],.048,'leafLight');line(r,[-.022,0,.01],[-.022,.6,.01],.018,'leaf');
  for(let i=0;i<5;i++)leaf(r,[0,.64,0],.5,.25,(i%2?1:-1)*(.6+(i%3)*.22),i*1.25,i%2?'leafLight':'leaf');
  polyline(r,[[0,.64,0],[.15,.63,.04],[.2,.5,.055],[.18,.28,.06]],.011,'bark');
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){
    const m=mesh(r,G.banana,'yellow',[.13+col*.034,.48-row*.065,.08]);m.rotation.z=-.6+col*.12;
  }
  ellipsoid(r,[.18,.24,.06],[.035,.065,.035],'purple');return r;
}
function grape(){
  const r=new THREE.Group();polyline(r,[[-.07,0,0],[-.04,.32,0],[.03,.64,0],[.19,.83,0]],.02,'bark');
  for(const [x,y,z,a] of [[-.03,.36,0,.9],[.02,.63,0,-.8],[.16,.8,0,.7]])leaf(r,[x,y,z],.27,.23,a,y*4,'leaf',true);
  line(r,[.03,.64,0],[.08,.56,.02],.008,'bark');
  for(let row=0;row<4;row++)for(let col=0;col<4-row;col++)ellipsoid(r,[.018+row*.025+col*.05,.54-row*.057,.04+(col%2)*.025],[.034,.038,.033],'purple');
  polyline(r,[[.04,.65,.02],[-.1,.75,.02],[-.16,.71,.02],[-.13,.66,.02],[-.09,.68,.02]],.004,'stem');return r;
}

export const supportedCropIds=Object.freeze(['rice','wheat','maize','barley','oats','rye','sorghum','foxtail','pearl','potato','cassava','sweetpotato','soybean','peanut','sunflower','rapeseed','chickpea','lentil','cowpea','cotton','sugarcane','sugarbeet','tea','arabica','robusta','cocoa','oilpalm','banana','coconut','grape','olive','citrus','apple','date']);

export function createCropMiniature(cropId,{scale=1}={}){
  if(!supportedCropIds.includes(cropId))throw new Error('Unknown crop miniature: '+cropId);
  let model;
  if(['rice','wheat','barley','oats','rye','sorghum','foxtail','pearl'].includes(cropId))model=cereal(cropId);
  else if(cropId==='maize')model=maize();
  else if(['potato','cassava','sweetpotato','sugarbeet'].includes(cropId))model=roots(cropId);
  else if(['soybean','chickpea','lentil','cowpea','peanut'].includes(cropId))model=legumes(cropId);
  else if(cropId==='sunflower')model=sunflower();
  else if(cropId==='rapeseed')model=rapeseed();
  else if(cropId==='cotton')model=cotton();
  else if(cropId==='sugarcane')model=sugarcane();
  else if(cropId==='cocoa')model=cocoa();
  else if(['oilpalm','coconut','date'].includes(cropId))model=palm(cropId);
  else if(cropId==='banana')model=banana();
  else if(cropId==='grape')model=grape();
  else model=twig(cropId);
  model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(model),height=box.max.y-box.min.y;
  if(!Number.isFinite(height)||height<=0)throw new Error('Invalid crop geometry: '+cropId);
  const outer=new THREE.Group();outer.name='crop-miniature-'+cropId;outer.userData={cropId,botanicalSchematic:true,sharedAssets:true};
  model.scale.setScalar(1/height);model.position.y=-box.min.y/height;outer.add(model);outer.scale.setScalar(scale);
  // Capture the pristine local transforms so a caller can sway/scale the outer
  // group without accumulating transforms inside the scientific symbol.
  return outer;
}

export function disposeMiniature(group){
  // Assets are shared by many globe markers. Disposing one symbol must never
  // dispose buffers or materials that another active symbol still uses.
  group.removeFromParent();group.clear();
}
