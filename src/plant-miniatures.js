import * as THREE from 'three';
import {createCropMiniature as legacyCreate, supportedCropIds as legacyIds, disposeMiniature as legacyDispose} from './crop-miniatures.js';

// Teaching miniatures: diagnostic organs are enlarged and may combine stages.
// These are deliberately not photogrammetry, cultivar IDs or vegetation density.
const Y=new THREE.Vector3(0,1,0), TAU=Math.PI*2;
const G={ball:new THREE.IcosahedronGeometry(1,1),smooth:new THREE.SphereGeometry(1,12,8),stem:new THREE.CylinderGeometry(1,1,1,7),cone:new THREE.ConeGeometry(1,1,9),ring:new THREE.TorusGeometry(1,.13,5,16),disc:new THREE.CircleGeometry(1,24)};
const M=Object.fromEntries(Object.entries({leaf:'#68aa70',light:'#a1c989',dark:'#37784f',blueleaf:'#7aa9a0',stem:'#9bb47a',bark:'#987157',root:'#d1b08a',soil:'#745d46',white:'#fff1dc',cream:'#e6d8ad',yellow:'#ecc65c',orange:'#eea35e',red:'#d75e51',purple:'#9562a1',pink:'#e9afbd',rose:'#cb7a9f',brown:'#735344',water:'#5a9ba7',moss:'#9ba95f'}).map(([k,color])=>[k,new THREE.MeshStandardMaterial({color,roughness:.92,flatShading:true,side:THREE.DoubleSide})]));
M.bluefruit=new THREE.MeshStandardMaterial({color:'#6478ae',roughness:.92,flatShading:true,side:THREE.DoubleSide});
function shape(points){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return new THREE.ShapeGeometry(s);}
function bladeGeometry(widthFn,tall=1,bend=.12){const pos=[],idx=[];for(let i=0;i<=12;i++){const t=i/12,w=widthFn(t),z=bend*Math.sin(t*Math.PI);pos.push(-w,t*tall,z,0,t*tall,z+.025,w,t*tall,z);}for(let i=0;i<12;i++)for(let j=0;j<2;j++){const k=i*3+j;idx.push(k,k+3,k+1,k+1,k+3,k+4);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
G.leaf=bladeGeometry(t=>.5*Math.sin(Math.PI*t));
G.strap=bladeGeometry(t=>.5*(1-.3*t),1,.18);
G.succulent=bladeGeometry(t=>.4*Math.sin(Math.PI*t)*Math.pow(1-t,.4),1,.21);
G.triangle=shape([[0,0],[-.48,.72],[0,1],[.48,.72]]);
G.maple=shape([[0,0],[-.08,.25],[-.46,.4],[-.3,.56],[-.47,.76],[-.16,.69],[0,1],[.16,.69],[.47,.76],[.3,.56],[.46,.4],[.08,.25]]);
G.oak=shape([[0,0],[-.14,.16],[-.3,.18],[-.35,.3],[-.16,.38],[-.4,.5],[-.38,.62],[-.18,.63],[-.28,.8],[-.18,.9],[0,1],[.18,.9],[.28,.8],[.18,.63],[.38,.62],[.4,.5],[.16,.38],[.35,.3],[.3,.18],[.14,.16]]);
G.fan=shape([[0,0],[-.17,.23],[-.51,.64],[-.5,.83],[-.32,.98],[-.09,1],[0,.86],[.09,1],[.32,.98],[.5,.83],[.51,.64],[.17,.23]]);
G.heart=shape([[0,0],[-.45,.48],[-.5,.74],[-.33,.92],[-.13,.9],[0,.74],[.13,.9],[.33,.92],[.5,.74],[.45,.48]]);
G.lily=(()=>{const s=new THREE.Shape();s.moveTo(0,0);for(let i=0;i<=30;i++){const a=.2+i*(TAU-.4)/30;s.lineTo(Math.sin(a),Math.cos(a));}s.lineTo(0,0);return new THREE.ShapeGeometry(s);})();
G.fern=(()=>{const p=[];for(let i=0;i<12;i++){const t=(i+1)/13,w=.33*Math.sin(Math.PI*t);for(const side of[-1,1]){p.push(0,t,0,side*w,t+.01,.025,side*w*.78,t+.065,0,0,t,0,side*w*.78,t+.065,0,0,t+.04,0);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();return g;})();
G.thallus=shape([[0,0],[-.18,.1],[-.31,.06],[-.43,.18],[-.36,.32],[-.5,.48],[-.38,.64],[-.22,.61],[-.16,.78],[0,.85],[.16,.78],[.22,.61],[.38,.64],[.5,.48],[.36,.32],[.43,.18],[.31,.06],[.18,.1]]);
G.serrate=shape([[0,0],[-.11,.12],[-.16,.13],[-.18,.25],[-.24,.26],[-.24,.39],[-.3,.4],[-.27,.53],[-.32,.54],[-.25,.67],[-.28,.68],[-.18,.8],[-.2,.81],[0,1],[.2,.81],[.18,.8],[.28,.68],[.25,.67],[.32,.54],[.27,.53],[.3,.4],[.24,.39],[.24,.26],[.18,.25],[.16,.13],[.11,.12]]);
function mesh(r,g,m,p=[0,0,0],s=[1,1,1]){const o=new THREE.Mesh(g,typeof m==='string'?M[m]:m);o.position.set(...p);o.scale.set(...s);r.add(o);return o;}
function ell(r,p,s,m='leaf',angle=0){const o=mesh(r,G.ball,m,p,s);o.rotation.z=angle;return o;}
function line(r,a,b,rad=.012,m='stem'){const start=new THREE.Vector3(...a),delta=new THREE.Vector3(...b).sub(start),len=delta.length();if(!len)return;const o=mesh(r,G.stem,m,start.addScaledVector(delta,.5).toArray(),[rad,len,rad]);o.quaternion.setFromUnitVectors(Y,delta.divideScalar(len));return o;}
function polyline(r,pts,rad=.009,m='stem'){for(let i=1;i<pts.length;i++)line(r,pts[i-1],pts[i],rad,m);}
function leaf(r,p,l=.3,w=.14,angle=0,yaw=0,m='leaf',geometry=G.leaf){const o=mesh(r,geometry,m,p,[w,l,w]);o.rotation.set(0,yaw,angle,'YXZ');return o;}
function flower(r,p,size=.06,color='white',n=5){const f=new THREE.Group();f.position.set(...p);r.add(f);for(let j=0;j<n;j++){const a=j*TAU/n;ell(f,[Math.sin(a)*size*.62,Math.cos(a)*size*.62,0],[size*.44,size*.64,size*.17],color,-a);}ell(f,[0,0,size*.12],[size*.28,size*.28,size*.2],'yellow');return f;}
function roots(r,p=[0,.12,0],count=4){for(let i=0;i<count;i++)line(r,p,[p[0]+(i-(count-1)/2)*.05,p[1]-.11,p[2]+(i%2)*.045],.006,'root');}
function rosette(r,y,count,l,w,m='leaf',geom=G.leaf){for(let i=0;i<count;i++)leaf(r,[0,y,0],l*(.8+(i%3)*.1),w,Math.PI*.28+(i%2)*.13,i*TAU/count,i%2?m:'light',geom);}
function stemLeaves(r,{h=.8,n=4,w=.18,geom=G.leaf,m='leaf'}={}){line(r,[0,0,0],[0,h,0],.017);for(let i=0;i<n;i++){const side=i%2?-1:1,y=.12+i*(h-.24)/n;line(r,[0,y,0],[side*.09,y+.045,0],.007);leaf(r,[side*.09,y+.045,0],.25,w,-side*.95,i*.5,m,geom);}}
function fruitVeg(id){const r=new THREE.Group();stemLeaves(r,{h:.86,n:5,w:id==='eggplant'?.28:.18,geom:id==='tomato'?G.oak:G.leaf});for(let i=0;i<3;i++){const side=i%2?-1:1,x=side*(.12+i*.025),y=.25+i*.18;line(r,[0,y+.05,0],[x,y,.03],.008);if(id==='tomato'){ell(r,[x,y-.07,.055],[.092,.085,.08],'red');for(let k=0;k<4;k++)leaf(r,[x,y,.055],.065,.028,k*TAU/4,0,'dark');}else if(id==='pepper'){const o=ell(r,[x,y-.11,.04],[.045,.15,.04],'red',side*.2);leaf(r,[x,y+.02,.04],.07,.04,1.6,0,'dark');}else{ell(r,[x,y-.1,.04],[.07,.14,.058],'purple',side*.12);ell(r,[x,y+.015,.04],[.066,.035,.05],'dark');}}flower(r,[.04,.88,0],.045,id==='eggplant'?'purple':'yellow');return r;}
function cucurbit(id){const r=new THREE.Group();polyline(r,[[-.28,.09,0],[-.1,.2,0],[.1,.4,.015],[.22,.75,0]],.014);for(let i=0;i<4;i++){const side=i%2?-1:1,x=-.2+i*.13,y=.15+i*.16;leaf(r,[x,y,0],.24,.3,side*.8,i*.45,'leaf',id==='watermelon'?G.maple:G.heart);}const x=.08,y=.15;let f;if(id==='cucumber')f=ell(r,[.1,.43,.07],[.067,.19,.06],'leaf',-.35);else f=ell(r,[x,y,.1],id==='watermelon'?[.22,.15,.16]:id==='melon'?[.18,.17,.16]:[.21,.16,.18],id==='pumpkin'?'orange':id==='melon'?'cream':'dark');if(id==='pumpkin'||id==='watermelon'){for(let j=0;j<5;j++){const a=(j-2)*.55,rad=id==='pumpkin'?.18:.19;line(r,[x+Math.sin(a)*rad,y-.1,.21],[x+Math.sin(a)*rad,y+.1,.21],.006,id==='pumpkin'?'yellow':'light');}}if(id==='cucumber')for(let k=0;k<6;k++)ell(r,[.09+(k%2)*.05,.28+k*.04,.11],[.008,.008,.008],'light');flower(r,[.22,.78,.01],.055,'yellow');polyline(r,[[.1,.4,.02],[-.06,.51,.03],[-.12,.48,.03],[-.1,.43,.03],[-.055,.455,.03]],.004);return r;}
function leafy(id){const r=new THREE.Group();if(id==='cabbage'){ell(r,[0,.26,0],[.26,.27,.24],'light');for(let i=0;i<7;i++){const a=i*TAU/7,o=leaf(r,[0,.06,0],.48,.41,.8,i*TAU/7,i%2?'leaf':'blueleaf');}for(let i=0;i<4;i++)leaf(r,[0,.22,.08],.29,.23,(i-1.5)*.3,i*.8,'light');}else if(id==='lettuce'){rosette(r,.05,9,.57,.32,'light');for(let i=0;i<4;i++)leaf(r,[0,.16,0],.4,.24,(i-1.5)*.22,i*1.5,'light');}else{for(let i=0;i<7;i++){const a=i*TAU/7,x=Math.sin(a)*.11,z=Math.cos(a)*.09,y=.19+(i%2)*.06;line(r,[0,0,0],[x,y,z],.01);leaf(r,[x,y,z],.4,.24,(i%2?1:-1)*.5,a,'dark',G.triangle);}}roots(r,[0,.08,0],3);return r;}
function bulbRoot(id){const r=new THREE.Group();if(id==='carrot'){const c=mesh(r,G.cone,'orange',[0,.25,0],[.1,.48,.1]);c.rotation.z=Math.PI;for(let i=0;i<4;i++){const a=(i-1.5)*.3;leaf(r,[0,.48,0],.47,.38,a,i*.8,'leaf',G.fern);}for(let i=1;i<4;i++)line(r,[-.055,.16+i*.07,.07],[.055,.16+i*.07,.07],.003,'root');}else{if(id==='onion'){ell(r,[0,.19,0],[.16,.18,.13],'cream');for(let i=0;i<5;i++)line(r,[(i-2)*.026,.3,0],[(i-2)*.055,.7+(i%2)*.17,0],.025,'leaf');}else{for(let i=0;i<6;i++){const a=i*TAU/6;ell(r,[Math.sin(a)*.065,.16,Math.cos(a)*.05],[.06,.13,.05],'white',-.12*Math.sin(a));}for(let i=0;i<5;i++)leaf(r,[0,.28,0],.6,.08,(i-2)*.24,i*.8,'leaf',G.strap);}roots(r,[0,.06,0],5);}return r;}
function pea(){const r=new THREE.Group();stemLeaves(r,{h:.86,n:4,w:.15});for(let i=0;i<3;i++){const y=.29+i*.18,side=i%2?-1:1;for(const s of[-1,1])leaf(r,[side*.1,y+.1,0],.17,.13,s*.8,0,'light');const pod=ell(r,[side*.16,y-.04,.04],[.035,.135,.028],'leaf',side*.3);for(let j=0;j<3;j++)ell(r,[side*.16+side*(j-1)*.015,y-.1+j*.055,.058],[.026,.025,.022],'light');}polyline(r,[[0,.8,0],[.11,.9,0],[.19,.87,0],[.18,.8,0],[.13,.81,0]],.004);flower(r,[-.06,.8,.03],.055,'white');return r;}
function seedCrop(id){const r=new THREE.Group();stemLeaves(r,{h:.81,n:4,w:id==='quinoa'?.18:id==='buckwheat'?.21:.08,geom:['buckwheat','quinoa'].includes(id)?G.triangle:G.leaf});if(id==='sesame'){for(let i=0;i<5;i++){const side=i%2?-1:1,y=.36+i*.1;ell(r,[side*.045,y,0],[.025,.075,.025],'cream',side*-.2);}flower(r,[.04,.88,0],.043,'pink');}else if(id==='flax'){for(let i=0;i<3;i++){const x=(i-1)*.13,y=.8+(i%2)*.08;line(r,[0,.63,0],[x,y,0],.006);flower(r,[x,y,0],.055,'blueleaf');if(i!==1)ell(r,[x*.8,y-.13,.02],[.035,.04,.033],'cream');}}else if(id==='buckwheat'){for(let i=0;i<5;i++){const x=(i%2?1:-1)*(.04+i*.022),y=.62+i*.05;line(r,[0,.56,0],[x,y,0],.006,'rose');flower(r,[x,y,0],.025,'white');}for(let i=0;i<3;i++){const a=mesh(r,G.cone,'brown',[(i-1)*.065,.6-(i%2)*.1,.05],[.025,.045,.025]);a.rotation.z=Math.PI;}}else{for(let i=0;i<12;i++){const t=i/12,a=i*2.4,y=.64+t*.38,rad=.09*(1-t*.65);ell(r,[Math.sin(a)*rad,y,Math.cos(a)*rad],[.045,.055,.04],i%2?'rose':'cream');}}return r;}
function fruitTree(id){const r=new THREE.Group();line(r,[0,0,0],[0,.85,0],.025,'bark');for(let i=0;i<5;i++){const side=i%2?-1:1,y=.3+i*.1,x=side*(.15+(i%2)*.06);line(r,[0,y,0],[x,y+.09,0],.012,'bark');if(id==='rubber'){for(let j=0;j<3;j++)leaf(r,[x,y+.09,0],.26,.12,(j-1)*.65,i*.5,'leaf');}else{leaf(r,[x,y+.09,0],id==='mango'?.34:.28,id==='mango'?.08:.17,side*-.8,i*.6,'leaf');}if(i<3&&['mango','avocado'].includes(id)){const m=id==='mango'?'orange':'dark';ell(r,[x,y-.035,.05],id==='mango'?[.065,.11,.055]:[.07,.1,.06],m,side*.2);if(id==='avocado')ell(r,[x,y+.03,.05],[.037,.06,.034],m);}}if(id==='rubber'){line(r,[-.02,.18,.025],[.023,.3,.025],.009,'cream');ell(r,[.045,.14,.04],[.05,.035,.035],'brown');}if(id==='cinnamon'){for(let i=0;i<2;i++){const o=mesh(r,G.stem,'bark',[.19+i*.07,.12,.05],[.025,.23,.025]);o.rotation.z=-.4;} }return r;}
function pineapple(){const r=new THREE.Group();rosette(r,0,9,.7,.13,'leaf',G.strap);line(r,[0,0,0],[0,.6,0],.035);ell(r,[0,.55,0],[.16,.22,.14],'orange');for(let i=0;i<15;i++){const a=i*2.4;ell(r,[Math.sin(a)*.145,.39+(i%5)*.075,Math.cos(a)*.125],[.035,.032,.022],'yellow');}rosette(r,.74,7,.31,.09,'leaf',G.strap);return r;}
function climber(id){const r=new THREE.Group();line(r,[-.03,0,-.03],[-.03,.95,-.03],.04,'bark');polyline(r,[[.03,0,.03],[.08,.23,.02],[-.07,.45,.035],[.07,.7,.015],[0,.95,0]],.012);for(let i=0;i<4;i++){const side=i%2?-1:1,x=side*.05,y=.17+i*.2;leaf(r,[x,y,.02],.24,id==='vanilla'?.13:.23,side*.9,i*.6,'leaf',id==='blackpepper'?G.heart:G.leaf);if(id==='blackpepper'){line(r,[x,y,0],[side*.15,y-.15,.06],.005);for(let j=0;j<5;j++)ell(r,[side*.15,y-.04-j*.033,.06],[.021,.021,.021],j<2?'red':'leaf');}}if(id==='vanilla'){flower(r,[.12,.78,.05],.09,'cream');for(let i=0;i<3;i++)polyline(r,[[-.1-i*.025,.64,.04],[-.12-i*.03,.45,.06],[-.1-i*.035,.26,.07]],.012,'dark');}return r;}
function ginger(){const r=new THREE.Group();for(let i=0;i<4;i++){const x=(i-1.5)*.11;ell(r,[x,.09,(i%2)*.05],[.1,.055,.055],'root',i%2?.3:-.2);if(i<3){line(r,[x,.13,0],[x,.83-(i%2)*.1,0],.018);for(let j=0;j<3;j++)leaf(r,[x,.3+j*.15,0],.26,.075,j%2?1:-1,i*.8,'leaf');}}roots(r,[0,.05,0],4);return r;}
function deciduous(id){const r=new THREE.Group();const birch=id==='silverbirch',baobab=id==='baobab',mangrove=id==='redmangrove',h=baobab?.72:.85;line(r,[0,mangrove?.25:0,0],[0,h,0],baobab?.14:birch?.027:.04,birch?'white':'bark');if(baobab)ell(r,[0,.27,0],[.17,.3,.14],'bark');if(birch)for(let i=0;i<4;i++)line(r,[-.025,.12+i*.14,.02],[.025,.13+i*.14,.02],.006,'brown');if(mangrove)for(let i=0;i<5;i++){const a=i*TAU/5;polyline(r,[[0,.42,0],[Math.sin(a)*.15,.23,Math.cos(a)*.15],[Math.sin(a)*.24,0,Math.cos(a)*.24]],.018,'bark');}for(let i=0;i<6;i++){const a=i*2.4,x=Math.sin(a)*(.17+(i%2)*.06),z=Math.cos(a)*.1,y=.56+(i%3)*.12;line(r,[0,y-.2,0],[x,y,z],.018,'bark');if(baobab){for(let j=0;j<5;j++)leaf(r,[x,y,z],.16,.065,(j-2)*.55,a,'leaf');}else if(id==='eucalyptus'){leaf(r,[x,y,z],.33,.065,(i%2?1:-1)*1.8,a,'blueleaf');leaf(r,[x,y,z],.28,.07,(i%2?-1:1)*.5,a,'blueleaf');}else{const geo=id==='englishoak'?G.oak:id==='sugarmaple'?G.maple:birch?G.triangle:G.leaf;leaf(r,[x,y,z],.25,birch?.17:.26,(i%2?1:-1)*.55,a,i%2?'light':'leaf',geo);leaf(r,[x,y-.03,z],.21,.19,(i%2?-1:1)*.8,a+1,'leaf',geo);}}if(id==='englishoak'){ell(r,[.18,.49,.1],[.035,.05,.034],'root');ell(r,[.18,.52,.1],[.041,.024,.038],'brown');}if(id==='sugarmaple'){for(const s of[-1,1])leaf(r,[.12,.48,.1],.12,.07,s*.7,0,'cream');}if(mangrove)line(r,[.15,.59,.1],[.18,.29,.1],.016,'light');if(baobab)ell(r,[-.18,.48,.06],[.043,.09,.04],'root');if(id==='eucalyptus')for(let i=0;i<3;i++)ell(r,[.11+i*.025,.49,.07],[.025,.025,.02],'brown');return r;}
function bamboo(){const r=new THREE.Group();for(let k=0;k<3;k++){const x=(k-1)*.13,h=.72+k*.11;line(r,[x,0,0],[x,h,0],.031,'leaf');for(let i=1;i<5;i++){const y=i*h/5;mesh(r,G.stem,'cream',[x,y,0],[.034,.018,.034]);if(i%2){line(r,[x,y,0],[x+(k%2?-.15:.15),y+.13,0],.007);for(let j=0;j<3;j++)leaf(r,[x+(k%2?-.1:.1),y+.08,0],.22,.05,(j-1)*.7,k*.8,'leaf');}}}return r;}
function cactus(id){const r=new THREE.Group();if(id==='saguaro'){line(r,[0,.08,0],[0,.85,0],.075,'leaf');ell(r,[0,.85,0],[.075,.075,.075],'leaf');for(const [s,h] of[[-1,.6],[1,.73]]){polyline(r,[[0,.3,0],[s*.2,.34,0],[s*.2,h,0]],.055,'leaf');ell(r,[s*.2,h,0],[.055,.055,.055],'leaf');}for(let k=0;k<3;k++){const x=(k-1)*.045;line(r,[x,.1,.068],[x,.85,.068],.005,'light');}for(let i=0;i<6;i++)for(const s of[-1,1])line(r,[s*.07,.16+i*.11,.015],[s*.105,.18+i*.11,.02],.003,'cream');}else{for(const [x,y,a] of[[0,.2,0],[-.16,.48,.5],[.15,.57,-.35],[-.2,.75,.3]]){ell(r,[x,y,0],[.12,.19,.04],'leaf',a);for(let j=0;j<3;j++)ell(r,[x+(j-1)*.04,y+(j%2)*.05,.04],[.006,.008,.006],'cream');}ell(r,[.18,.78,0],[.043,.06,.035],'red');flower(r,[-.24,.92,.01],.045,'yellow');}return r;}
function succulent(id){const r=new THREE.Group();if(id==='welwitschia'){ell(r,[0,.16,0],[.2,.12,.18],'bark');for(const s of[-1,1]){const g=new THREE.Group();g.position.set(s*.09,.21,0);g.rotation.z=s*-1.15;r.add(g);const main=leaf(g,[0,0,0],.65,.37,0,0,'blueleaf',G.strap);for(let j=0;j<2;j++){const o=leaf(g,[(j-.5)*.055,.42,.1],.34,.17,(j-.5)*.13,0,'blueleaf',G.strap);}}for(let i=0;i<3;i++){line(r,[(i-1)*.09,.19,.07],[(i-1)*.13,.47,.07],.011,'bark');ell(r,[(i-1)*.13,.5,.07],[.038,.068,.035],'rose');}}else{rosette(r,.02,11,.67,id==='agave'?.22:.19,id==='agave'?'blueleaf':'leaf',G.succulent);if(id==='aloe'){line(r,[.04,.1,0],[.06,.95,0],.012);for(let i=0;i<7;i++){const y=.67+i*.045,side=i%2?-1:1;ell(r,[.06+side*.045,y,0],[.017,.04,.017],'orange',side*.4);}}else{for(let i=0;i<4;i++)leaf(r,[0,.07,0],.72,.19,(i-1.5)*.13,i*1.5,'blueleaf',G.succulent);}}return r;}
function aquatic(id){const r=new THREE.Group();if(id==='eelgrass'){line(r,[-.23,.12,0],[.24,.12,0],.018,'root');for(let k=0;k<3;k++){const x=(k-1)*.18;roots(r,[x,.12,0],3);for(let i=0;i<3;i++)leaf(r,[x,.14,0],.69+(i%2)*.2,.11,(i-1)*.19,k*.4,'leaf',G.strap);}}else if(id==='duckweed'){for(let i=0;i<6;i++){const x=(i%3-1)*.16,z=(Math.floor(i/3)-.5)*.14;ell(r,[x,.5,z],[.13,.035,.09],i%2?'light':'leaf');line(r,[x,.48,z],[x+.02,.04+(i%2)*.1,z],.007,'root');} }else{for(let i=0;i<3;i++){const x=(i-1)*.24,y=id==='lotus'?.43+(i%2)*.08:.13;line(r,[x*.5,0,0],[x,y,0],.012);const o=mesh(r,id==='lotus'?G.disc:G.lily,'leaf',[x,y,0],[.19,.19,.19]);o.rotation.x=-Math.PI/2+.18*(i-1);}const h=id==='lotus'?.8:.43;line(r,[0,0,.08],[0,h,.08],.015);const f=flower(r,[0,h,.08],.13,id==='lotus'?'pink':'white',8);f.rotation.x=-.25;flower(f,[0,0,.018],.08,id==='lotus'?'rose':'white',6);if(id==='lotus'){line(r,[.22,.1,.05],[.22,.67,.05],.012);const top=mesh(r,G.cone,'light',[.22,.68,.05],[.07,.09,.06]);top.rotation.z=Math.PI;for(let j=0;j<3;j++)ell(r,[.19+j*.03,.725,.06],[.009,.006,.009],'brown');}}return r;}
function herbFlower(id){const r=new THREE.Group();if(id==='tulip'){line(r,[0,0,0],[0,.75,0],.018);leaf(r,[0,.06,0],.6,.16,-.5,0,'blueleaf');leaf(r,[0,.2,0],.49,.16,.55,2.7,'leaf');for(let i=0;i<6;i++){const a=i*TAU/6,o=ell(r,[Math.sin(a)*.065,.81,Math.cos(a)*.05],[.065,.16,.036],i%2?'rose':'pink');o.rotation.x=Math.cos(a)*-.25;o.rotation.z=Math.sin(a)*.25;}}else if(id==='orchid'){rosette(r,.04,5,.38,.25,'dark');polyline(r,[[0,.08,0],[.02,.49,0],[.18,.85,0],[.36,.86,0]],.014);for(let i=0;i<3;i++){const x=.1+i*.11,y=.68+(i%2)*.13;const f=flower(r,[x,y,.03],.088,'white');ell(f,[0,-.05,.025],[.034,.036,.024],'rose');}}else if(id==='dogrose'){stemLeaves(r,{h:.8,n:4,w:.11});for(let i=0;i<4;i++){const side=i%2?-1:1,y=.2+i*.15;for(let j=0;j<2;j++)leaf(r,[side*.06,y+j*.04,0],.14,.085,side*.8,j*2,'leaf');line(r,[0,y,0],[side*.03,y-.025,.02],.008,'bark');}flower(r,[0,.88,.02],.11,'pink');ell(r,[.15,.6,.03],[.035,.05,.034],'red');}else if(id==='edelweiss'){rosette(r,.03,7,.35,.1,'blueleaf');for(let i=0;i<3;i++){const x=(i-1)*.13,y=.57+(i%2)*.15;line(r,[0,.1,0],[x,y,0],.012);const f=flower(r,[x,y,.015],.095,'white',7);for(let k=0;k<3;k++)ell(f,[(k-1)*.024,(k%2)*.023,.03],[.022,.024,.018],'cream');}}else{for(let k=0;k<3;k++){const x=(k-1)*.13,h=.7+(k%2)*.16;line(r,[0,0,0],[x,h,0],.013,id==='rosemary'?'bark':'stem');for(let i=0;i<4;i++)for(const s of[-1,1])leaf(r,[x*i/5,.14+i*.1,0],id==='rosemary'?.14:.16,.04,s*.75,k*.7,'blueleaf');if(id==='lavender')for(let i=0;i<6;i++)ell(r,[x+(i%2?-.018:.018),h-.11+i*.045,0],[.032,.036,.027],'purple');else flower(r,[x,.63,.025],.03,'purple');}}return r;}
function carnivore(id){const r=new THREE.Group();for(let i=0;i<4;i++){const a=i*TAU/4,x=Math.sin(a)*.22,y=.2+(i%2)*.16,z=Math.cos(a)*.09;line(r,[0,0,0],[x,y,z],.01);if(id==='venusflytrap'){leaf(r,[0,0,0],.25,.12,i*.8,a,'leaf');const trap=new THREE.Group();trap.position.set(x,y,z);trap.rotation.z=-x;r.add(trap);for(const s of[-1,1]){const m=ell(trap,[s*.05,.03,0],[.067,.095,.026],'rose',s*-.35);for(let j=0;j<4;j++)line(trap,[s*(.072+(j%2)*.015),-.025+j*.03,.015],[s*.13,-.02+j*.03,.018],.003,'light');}}else{ell(r,[x,y,z],[.075,.075,.022],'rose');for(let j=0;j<5;j++){const b=j*TAU/5;line(r,[x+Math.sin(b)*.055,y+Math.cos(b)*.055,z],[x+Math.sin(b)*.1,y+Math.cos(b)*.1,z+.02],.003,'red');ell(r,[x+Math.sin(b)*.1,y+Math.cos(b)*.1,z+.025],[.008,.008,.008],'cream');}}}line(r,[0,0,-.02],[.01,.87,-.02],.008);flower(r,[.01,.87,-.01],.038,'white');return r;}
function ginkgo(){const r=new THREE.Group();line(r,[0,0,0],[0,.85,0],.025,'bark');for(let i=0;i<6;i++){const side=i%2?-1:1,y=.24+i*.1,x=side*.12;line(r,[0,y,0],[x,y+.07,0],.009,'bark');leaf(r,[x,y+.07,0],.24,.26,side*-.4,i*.7,i%2?'light':'leaf',G.fan);}for(let i=0;i<2;i++){line(r,[.1,.4,0],[.14+i*.045,.33,.04],.004);ell(r,[.14+i*.045,.3,.04],[.031,.042,.03],'yellow');}return r;}
function conifer(id){const r=new THREE.Group(),pine=id==='scotspine',cedar=id==='cedar',dawn=id==='dawnredwood',redwood=id==='coastredwood';line(r,[0,0,0],[0,1,0],redwood?.045:.028,'bark');if(pine){for(let i=0;i<5;i++){const y=.35+i*.12,side=i%2?-1:1,x=side*(.27-i*.035);line(r,[0,y-.1,0],[x,y,0],.012,'bark');for(let j=0;j<5;j++)leaf(r,[x,y,0],.22,.025,(j-2)*.35,i*.7,'leaf',G.strap);}for(let i=0;i<2;i++)ell(r,[(i?1:-1)*.17,.38+i*.22,.05],[.04,.066,.035],'brown');}else if(dawn){for(let i=0;i<6;i++){const y=.25+i*.12,w=.36-i*.04;for(const side of[-1,1]){const o=leaf(r,[0,y,0],w,.22,side*Math.PI/2,0,'leaf',G.fern);line(r,[0,y,0],[side*w,y,0],.006,'bark');}}ell(r,[.17,.3,.05],[.033,.036,.032],'brown');}else{for(let i=0;i<5;i++){const y=.26+i*.155,w=(redwood?.27:cedar?.37:.32)-i*.046;if(cedar){const a=ell(r,[i%2?.045:-.035,y,0],[w,.06,w*.45],i%2?'leaf':'dark');line(r,[0,y-.08,0],[w*.8,y,0],.009,'bark');}else{mesh(r,G.cone,i%2?'leaf':'dark',[0,y+.13,0],[w,.38,w*.66]);}}if(id==='norwayspruce')for(let i=0;i<2;i++)ell(r,[i?-.14:.18,.3+i*.14,.11],[.035,.095,.035],'brown');if(cedar)ell(r,[.12,.65,.07],[.04,.07,.04],'brown');if(redwood)ell(r,[.15,.4,.08],[.025,.029,.023],'brown');}return r;}
function fern(id){const r=new THREE.Group(),tree=id==='treefern',cycad=id==='cycad';if(tree||cycad){line(r,[0,0,0],[0,.55,0],tree?.055:.1,'bark');if(cycad)ell(r,[0,.26,0],[.12,.28,.1],'bark');for(let i=0;i<7;i++){const o=leaf(r,[0,.55,0],cycad?.62:.56,cycad?.38:.5,.7+(i%2)*.15,i*TAU/7,i%2?'light':'leaf',G.fern);line(o,[0,0,0],[0,1,0],.009,'stem');}if(cycad)ell(r,[0,.65,0],[.055,.15,.05],'cream');}else if(id==='birdsnestfern'){rosette(r,.04,10,.8,.23,'leaf',G.strap);for(let i=0;i<3;i++)leaf(r,[0,.12,0],.63,.25,(i-1)*.23,i*2.2,'light',G.strap);}else{for(let i=0;i<4;i++){const x=(i-1.5)*.14,h=.5+(i%2)*.25;line(r,[0,0,0],[x,h,0],.007,'brown');for(let j=0;j<3;j++){const side=j%2?-1:1,y=h*.4+j*.14;line(r,[x*y/h,y,0],[x*y/h+side*.13,y+.06,0],.004,'brown');leaf(r,[x*y/h+side*.13,y+.06,0],.14,.17,side*.2,i*.4,'light',G.fan);}}}return r;}
function horsetail(){const r=new THREE.Group();for(let k=0;k<2;k++){const x=(k?-.16:.06),h=k?.62:.95;line(r,[x,0,0],[x,h,0],k?.016:.025,k?'cream':'leaf');if(!k){for(let i=1;i<6;i++){const y=i*h/6;mesh(r,G.stem,'brown',[x,y,0],[.028,.018,.028]);for(let j=0;j<5;j++){const a=j*TAU/5;line(r,[x,y,0],[x+Math.sin(a)*(.2-i*.012),y+.14,Math.cos(a)*(.2-i*.012)],.006,'leaf');}}}else ell(r,[x,h+.06,0],[.04,.09,.04],'brown');}return r;}
function lycophyte(id){const r=new THREE.Group();if(id==='clubmoss'){line(r,[-.22,.06,0],[.25,.06,0],.012,'stem');for(let k=0;k<3;k++){const x=(k-1)*.17,h=.47+(k%2)*.18;line(r,[x,.06,0],[x,h,0],.017,'leaf');for(let i=0;i<5;i++)for(const s of[-1,1])leaf(r,[x,.13+i*.07,0],.11,.045,s*.7,k*1.5,'leaf');if(k!==1){line(r,[x,h,0],[x,h+.18,0],.007);ell(r,[x,h+.2,0],[.023,.07,.023],'cream');}}}else{for(let k=0;k<7;k++){const o=leaf(r,[0,.02,0],.56+(k%2)*.1,.4,.75,k*TAU/7,k%2?'leaf':'moss',G.fern);line(o,[0,0,0],[0,1,0],.014,'stem');for(let j=0;j<3;j++)leaf(o,[0,.3+j*.18,0],.2,.2,j%2?.7:-.7,0,'moss',G.fern);}}return r;}
function bryophyte(id){const r=new THREE.Group();if(id==='sphagnum'){for(let k=0;k<4;k++){const x=(k-1.5)*.12,z=(k%2)*.08,h=.48+(k%2)*.17;line(r,[x,0,z],[x,h,z],.013,'moss');for(let i=0;i<4;i++){const y=.13+i*.1;for(const s of[-1,1])leaf(r,[x,y,z],.17,.13,s*1.3,k,'moss',G.fern);}for(let j=0;j<5;j++){const a=j*TAU/5;leaf(r,[x,h,z],.19,.15,.9,a,'light',G.fern);}}}else{for(let i=0;i<5;i++){const o=mesh(r,G.thallus,i%2?'leaf':'light',[0,.05,0],[.24,.36,.2]);o.rotation.set(-Math.PI/2,0,i*TAU/5);}if(id==='liverwort'){for(let k=0;k<2;k++){const x=k?-.14:.1,h=k?.44:.65;line(r,[x,.06,0],[x,h,0],.014);const d=mesh(r,G.disc,'leaf',[x,h,0],[.12,.12,.12]);d.rotation.x=-Math.PI/2;for(let j=0;j<7;j++){const a=j*TAU/7;line(r,[x,h,0],[x+Math.sin(a)*.15,h-.04,Math.cos(a)*.15],.014,'light');}}for(let i=0;i<2;i++){const ring=mesh(r,G.ring,'leaf',[(i?-.13:.16),.065,.13],[.05,.05,.05]);ring.rotation.x=-Math.PI/2;}}else{for(let i=0;i<6;i++){const x=(i-2.5)*.055,h=.41+(i%3)*.13;line(r,[x,.06,(i%2)*.04],[x+(i%2?-.025:.025),h,(i%2)*.04],.011,'leaf');mesh(r,G.cone,'brown',[x+(i%2?-.025:.025),h+.035,(i%2)*.04],[.011,.09,.011]);}}}return r;}

// The second crop set shares primitive geometry, not species aliases. Fruit,
// flowers and underground organs may be enlarged together for recognition.
function newGrass(id){
  const r=new THREE.Group();
  if(id==='waterchestnut'){
    line(r,[-.2,.15,0],[.22,.15,0],.013,'root');
    for(let k=0;k<5;k++){const x=(k-2)*.085,h=.66+(k%3)*.13;line(r,[x,.15,0],[x,h,0],.013,'leaf');ell(r,[x,h+.025,0],[.019,.04,.019],'brown');}
    for(const x of[-.15,.11]){ell(r,[x,.11,.08],[.075,.055,.065],'brown');roots(r,[x,.08,.08],3);}
    return r;
  }
  for(let k=0;k<3;k++){
    const x=(k-1)*.09,h=.67+(k%2)*.14;line(r,[x,.03,0],[x,h,0],.009);
    for(let i=0;i<3;i++)leaf(r,[x,.11+i*.14,0],.34,.055,(i%2?1:-1)*.65,k*.9,'leaf',G.strap);
    if(id==='fonio'){
      for(let j=0;j<3;j++){const bx=x+(j-1)*.14,by=h+.14+(j===1?.06:0);line(r,[x,h,0],[bx,by,0],.004);for(let n=0;n<5;n++){const t=n/5;ell(r,[x+(bx-x)*t,h+(by-h)*t,.012],[.009,.017,.008],'cream',-(j-1)*.6);}}
    }else{
      line(r,[x,h,0],[x,h+.27,0],.005);for(let j=0;j<5;j++){const side=j%2?-1:1,y=h+j*.045,reach=(id==='teff'?.17:.12)*(1-j*.12),bx=x+side*reach;line(r,[x,y,0],[bx,y+.06,0],.004);for(let n=0;n<3;n++)ell(r,[bx-side*n*.025,y+.06+n*.014,.01],id==='teff'?[.009,.013,.008]:[.018,.019,.016],'cream');}
    }
  }
  return r;
}
function grainAmaranth(){
  const r=new THREE.Group();stemLeaves(r,{h:.73,n:5,w:.2});
  for(let i=0;i<17;i++){const t=i/17,a=i*2.4,rad=.085*(1-t*.65);ell(r,[Math.sin(a)*rad,.62+t*.4,Math.cos(a)*rad],[.043,.06,.035],i%3?'red':'rose');}
  return r;
}
function trifoliate(r,p,size=.2,yaw=0){
  for(let j=0;j<3;j++){const a=(j-1)*1.1;leaf(r,p,size,j===1?size*.57:size*.5,a,yaw,'leaf');}
}
function newLegume(id){
  const r=new THREE.Group(),pigeon=id==='pigeonpea',faba=id==='faba',lupin=id==='lupin',alfalfa=id==='alfalfa';
  for(let k=0;k<(alfalfa?3:1);k++){
    const x=(k-1)*(alfalfa?.11:0),h=alfalfa?.7+(k%2)*.1:.87;line(r,[x,.03,0],[x,h,0],pigeon?.019:.012,pigeon?'bark':'stem');
    for(let i=0;i<4;i++){
      const side=i%2?-1:1,y=.17+i*.145,px=x+side*.1;line(r,[x,y,0],[px,y+.055,0],.006);
      if(faba){for(let j=0;j<2;j++)for(const s of[-1,1])leaf(r,[px,y+j*.075,0],.18,.1,s*.8,0,'blueleaf');}
      else if(lupin){for(let j=0;j<7;j++)leaf(r,[px,y+.055,0],.22,.058,(j-3)*.42,0,'leaf');}
      else trifoliate(r,[px,y+.055,0],alfalfa?.14:pigeon?.24:.2,i*.6);
      if(!alfalfa&&i<3){const podX=x+side*.17,podY=y+.02;line(r,[px,y+.055,0],[podX,podY,.06],.005);const long=id==='mungbean'||id==='adzuki';ell(r,[podX,podY-.06,.06],[faba?.045:.023,long?.14:.095,.022],id==='mungbean'?'brown':'leaf',side*.22);if(faba)for(let j=0;j<3;j++)ell(r,[podX,podY-.12+j*.055,.08],[.037,.031,.022],'light');}
    }
    if(lupin){for(let j=0;j<7;j++){const y=.73+j*.04;for(let a=0;a<3;a++)ell(r,[x+Math.sin(a*TAU/3)*.036,y,Math.cos(a*TAU/3)*.03],[.027,.03,.021],'purple');}}
    else if(alfalfa){for(let j=0;j<5;j++)flower(r,[x+(j%2?-.025:.025),h-.07+j*.03,.02],.024,'purple');}
    else flower(r,[x,h,.02],.045,pigeon?'yellow':id==='adzuki'?'yellow':faba?'white':'cream');
  }
  // Enlarged seeds are detached examples, not fruit borne at soil level.
  if(id==='adzuki'||id==='mungbean')for(let i=0;i<3;i++)ell(r,[.23+i*.035,.04,.1],[.023,.029,.022],id==='adzuki'?'red':'dark');
  return r;
}
function undergroundCrop(id){
  const r=new THREE.Group();
  if(id==='taro'){
    ell(r,[0,.15,0],[.12,.16,.1],'root');for(let i=0;i<4;i++){const side=i%2?-1:1,x=side*(.12+(i%2)*.06),y=.46+(i%3)*.07;line(r,[0,.27,0],[x,y+.11,0],.012);const l=leaf(r,[x,y-.06,0],.4,.39,side*-.35,i*.7,'leaf',G.heart);line(l,[0,.4,.01],[0,.85,.01],.004,'light');}
    roots(r,[0,.07,0],5);
  }else if(id==='yam'){
    line(r,[.02,.23,-.03],[.02,1,-.03],.024,'bark');polyline(r,[[0,.21,0],[.07,.42,.03],[-.05,.62,.03],[.06,.84,.02],[0,.98,0]],.009);for(let i=0;i<4;i++)leaf(r,[i%2?.05:-.04,.32+i*.17,.03],.23,.22,i%2?.8:-.8,i*.4,'leaf',G.heart);for(let i=0;i<2;i++)ell(r,[(i-.5)*.14,.12,.06],[.07,.17,.055],'root',(i-.5)*.2);
  }else{
    const artichoke=id==='jerusalemartichoke';line(r,[0,.24,0],[0,.87,0],.018);for(let i=0;i<5;i++){const side=i%2?-1:1,y=.3+i*.105;leaf(r,[0,y,0],.29,artichoke?.16:.24,side*.95,i*.5,'leaf',artichoke?G.leaf:G.triangle);}
    for(let i=0;i<3;i++){const x=(i-1)*.12;line(r,[0,.77,0],[x,.91+(i%2)*.08,0],.007);const f=flower(r,[x,.91+(i%2)*.08,0],artichoke?.072:.04,'yellow',9);ell(f,[0,0,.02],[artichoke?.03:.018,.025,.02],'brown');}
    for(let i=0;i<3;i++){const x=(i-1)*.13;line(r,[0,.25,0],[x,.14,.04],.007,'root');ell(r,[x,.12,.04],artichoke?[.08,.055,.05]:[.055,.13,.045],'root',i%2?.35:-.3);if(artichoke)for(let j=0;j<2;j++)ell(r,[x+(j-.5)*.075,.13,.07],[.04,.035,.03],'root');}
  }
  return r;
}
function swollenRoots(id){
  const r=new THREE.Group(),beet=id==='beetroot';
  ell(r,[0,beet?.18:.23,0],beet?[.14,.15,.12]:[.09,.25,.08],beet?'red':'white');
  polyline(r,[[0,beet?.07:.08,0],[.01,.025,0],[.035,.005,0]],.008,'root');
  for(let i=0;i<5;i++){const side=i%2?-1:1,x=side*.08,y=beet?.31:.43;line(r,[0,y-.04,0],[x,y+.13,0],.009,beet?'rose':'stem');leaf(r,[x,y+.13,0],.35,.23,side*.5,i*.8,'leaf',beet?G.leaf:G.oak);}
  return r;
}
function floweringVegetable(id){
  const r=new THREE.Group();
  if(id==='okra'){
    stemLeaves(r,{h:.9,n:4,w:.29,geom:G.maple});for(let i=0;i<3;i++){const side=i%2?-1:1,y=.3+i*.18;line(r,[0,y,0],[side*.12,y+.02,.03],.008);const pod=mesh(r,G.cone,'leaf',[side*.14,y+.13,.05],[.045,.25,.045]);pod.rotation.z=-side*.13;for(let j=0;j<3;j++)line(r,[side*.14+(j-1)*.02,y+.025,.08],[side*.14+(j-1)*.006,y+.24,.06],.003,'light');}const f=flower(r,[.08,.91,.04],.085,'cream');ell(f,[0,0,.025],[.029,.031,.02],'purple');
  }else{
    const cauli=id==='cauliflower';line(r,[0,.04,0],[0,.43,0],.045,'stem');rosette(r,.1,7,.59,.27,'blueleaf');
    for(let i=0;i<7;i++){const a=i*2.4,x=Math.sin(a)*.15,z=Math.cos(a)*.12,y=.48+(i%3)*.04;line(r,[0,.3,0],[x,y,z],.022,'stem');ell(r,[x,y,z],[.1,.085,.08],cauli?'white':'dark');if(!cauli)for(let j=0;j<4;j++)ell(r,[x+Math.sin(j*2.4)*.06,y+.055,z+Math.cos(j*2.4)*.04],[.027,.028,.025],'leaf');}
    if(cauli)for(let i=0;i<3;i++)leaf(r,[0,.2,0],.44,.22,(i-1)*.4,i*2,'light');
  }
  return r;
}
function treeFrame(r,{narrow=false,compound=false,broad=false,opposite=false,leafGeometry=G.leaf}={}){
  line(r,[0,.02,0],[0,.89,0],.027,'bark');const ends=[];
  for(let i=0;i<5;i++){const side=i%2?-1:1,y=.34+i*.105,x=side*(.15+(i%2)*.04);line(r,[0,y-.08,0],[x,y+.06,0],.011,'bark');ends.push([x,y,.05]);if(compound){line(r,[x,y,0],[x,y+.25,0],.005);for(let j=0;j<3;j++)for(const s of[-1,1])leaf(r,[x,y+j*.08,0],.15,.07,s*.8,i*.4,'leaf');}else if(opposite){line(r,[x,y,0],[x,y+.24,0],.005,'bark');for(let j=0;j<2;j++)for(const s of[-1,1])leaf(r,[x,y+.035+j*.13,0],.23,broad?.18:.12,s*.9,i*.65,j%2?'light':'leaf');}else{leaf(r,[x,y+.04,0],.28,narrow?.065:broad?.22:.15,side*-.55,i*.65,'leaf',leafGeometry);leaf(r,[x,y+.12,-.01],.22,narrow?.055:.13,side*.75,i*.65+.7,'light',leafGeometry);}}
  return ends;
}
function nutTree(id){
  const r=new THREE.Group(),ends=treeFrame(r,{narrow:id==='almond'||id==='chestnut',compound:id==='walnut'||id==='pistachio',broad:id==='cashew'||id==='hazelnut',leafGeometry:id==='chestnut'?G.serrate:G.leaf});
  for(let i=0;i<3;i++){
    const [x,y,z]=ends[i];line(r,[x,y+.04,z],[x,y-.055,z],.005);
    if(id==='almond'){ell(r,[x,y-.075,z],[.044,.075,.035],'light',.2);}
    else if(id==='walnut'){ell(r,[x,y-.065,z],[.065,.064,.06],'leaf');}
    else if(id==='cashew'){ell(r,[x,y-.07,z],[.06,.09,.05],i%2?'red':'yellow');ell(r,[x+.012,y-.165,z],[.04,.025,.024],'cream',-.5);ell(r,[x+.04,y-.175,z],[.022,.027,.022],'cream');}
    else if(id==='pistachio'){for(let j=0;j<4;j++)ell(r,[x+(j%2?-.025:.025),y-.025-j*.032,z],[.025,.034,.022],j%2?'pink':'light');}
    else if(id==='hazelnut'){for(let j=0;j<3;j++){ell(r,[x+(j-1)*.04,y-.07,z],[.034,.043,.031],'root');leaf(r,[x+(j-1)*.04,y-.035,z],.07,.065,Math.PI,0,'leaf');}}
    else{ell(r,[x,y-.065,z],[.078,.075,.07],'light');for(let j=0;j<10;j++){const a=j*2.4;line(r,[x+Math.sin(a)*.068,y-.065+Math.cos(a)*.068,z+.025],[x+Math.sin(a)*.095,y-.065+Math.cos(a)*.095,z+.045],.003,'leaf');}}
  }
  // A separate shell/seed specimen distinguishes nuts from orchard fleshy fruit.
  if(id==='almond'){ell(r,[.26,.09,.1],[.062,.1,.038],'root',-.25);for(let j=0;j<5;j++)ell(r,[.24+(j%2)*.03,.04+j*.02,.132],[.005,.009,.003],'brown');}
  if(id==='walnut'){for(const side of[-1,1]){ell(r,[.25+side*.026,.09,.1],[.036,.068,.04],'brown');for(let j=0;j<3;j++)ell(r,[.25+side*.024,.045+j*.036,.137],[.021,.022,.013],'root');}}
  if(id==='pistachio'){for(const side of[-1,1])ell(r,[.25+side*.025,.085,.1],[.025,.058,.03],'cream',side*-.2);ell(r,[.25,.083,.133],[.019,.039,.016],'light');}
  if(id==='hazelnut')ell(r,[.25,.075,.1],[.057,.063,.055],'root');
  if(id==='chestnut'){ell(r,[.25,.074,.1],[.065,.061,.05],'brown');ell(r,[.25,.041,.136],[.044,.02,.012],'cream');}
  if(id==='chestnut')for(let i=0;i<2;i++){const x=i?-.16:.14,y=.76+i*.06;line(r,[x,y,0],[x+(i?-.11:.11),y+.18,.02],.004);for(let j=0;j<7;j++)ell(r,[x+(i?-1:1)*j*.017,y+j*.027,.02],[.014,.02,.013],'cream');}
  if(id==='pistachio'){
    // Female and male flowering examples belong to different plants. The
    // smaller, separate stem at left is the male example, not a second sex on
    // the fruiting main tree. Organs from different stages are shown together.
    for(let j=0;j<5;j++){line(r,[.15,.77,.06],[.15+(j%2?-.025:.025),.81+j*.026,.06],.003);ell(r,[.15+(j%2?-.025:.025),.81+j*.026,.06],[.013,.017,.011],'pink');}
    line(r,[-.34,.02,.06],[-.34,.35,.06],.01,'bark');for(let i=0;i<4;i++){const side=i%2?-1:1,y=.25+i*.04;line(r,[-.34,y,.06],[-.34+side*.045,y+.03,.06],.004);for(let j=0;j<3;j++)ell(r,[-.34+side*(.025+j*.015),y+.015+j*.017,.06],[.015,.018,.013],'cream');}
    r.userData.morphologyNote='开心果雌雄花序分属不同植株：左侧小株示意雄花，主株示意雌花与果实；不同生长阶段并置。';
  }
  return r;
}
function orchardTree(id){
  const r=new THREE.Group(),ends=treeFrame(r,{narrow:id==='peach'});
  for(let i=0;i<3;i++){const [x,y,z]=ends[i];line(r,[x,y+.03,z],[x,y-.055,z],.004);if(id==='pear'){ell(r,[x,y-.09,z],[.06,.075,.05],'yellow');ell(r,[x,y-.035,z],[.032,.052,.03],'yellow');}else if(id==='cherry'){for(const side of[-1,1]){line(r,[x,y+.015,z],[x+side*.04,y-.08,z],.003);ell(r,[x+side*.04,y-.105,z],[.038,.038,.036],'red');}}else{const color=id==='plum'?'purple':id==='peach'?'rose':'orange';ell(r,[x,y-.08,z],[.066,.066,.06],color);if(id==='peach'||id==='apricot')polyline(r,[[x,y-.02,z+.015],[x+.012,y-.07,z+.06],[x,y-.135,z+.02]],.003,id==='peach'?'pink':'yellow');}}
  // Blossom and mature fruit are juxtaposed teaching stages.
  for(let i=3;i<5;i++){const [x,y,z]=ends[i];for(let j=0;j<2;j++)flower(r,[x+(j-.5)*.055,y+.07+j*.045,z+.035],.04,id==='peach'?'pink':id==='apricot'?'pink':'white');}
  return r;
}
function berryCrop(id){
  const r=new THREE.Group();
  if(id==='strawberry'){
    polyline(r,[[0,.08,0],[.2,.04,.03],[.38,.05,.02]],.007);trifoliate(r,[.38,.07,.02],.15,.5);
    for(let i=0;i<4;i++){const side=i%2?-1:1,x=side*.13,y=.22+(i%2)*.08;line(r,[0,.06,0],[x,y,0],.008);trifoliate(r,[x,y,0],.22,i*.8);}
    line(r,[0,.1,0],[.12,.42,.04],.008);flower(r,[.12,.43,.04],.06,'white');line(r,[0,.12,0],[-.19,.28,.08],.007);const fruit=mesh(r,G.cone,'red',[-.19,.23,.08],[.095,.18,.085]);fruit.rotation.z=Math.PI;for(let j=0;j<4;j++)leaf(r,[-.19,.31,.08],.08,.04,j*TAU/4,0,'leaf');for(let j=0;j<8;j++){const a=j*2.4;ell(r,[-.19+Math.sin(a)*.06,.19+(j%3)*.035,.15],[.006,.008,.004],'yellow');}
  }else{
    for(let k=0;k<3;k++){const x=(k-1)*.15,h=.64+(k%2)*.18;line(r,[0,.02,0],[x,h,0],.012,id==='raspberry'?'bark':'stem');for(let i=0;i<3;i++){const y=.16+i*.16;id==='raspberry'?trifoliate(r,[x*y/h,y,0],.18,k*.7):leaf(r,[x*y/h,y,0],.19,.11,i%2?.8:-.8,k*.7,'leaf');}for(let j=0;j<3;j++){const fx=x+(j-1)*.055,y=h-.03+(j%2)*.07;line(r,[x,h,0],[fx,y,.04],.004);if(id==='blueberry'){ell(r,[fx,y-.04,.04],[.04,.04,.037],'bluefruit');for(let a=0;a<4;a++)line(r,[fx,y-.04,.076],[fx+Math.sin(a*TAU/4)*.018,y-.04+Math.cos(a*TAU/4)*.018,.078],.003,'dark');}else{for(let a=0;a<9;a++){const angle=a*2.4;ell(r,[fx+Math.sin(angle)*.024,y-.035+(a%3)*.021,.04+Math.cos(angle)*.019],[.019,.02,.018],'red');}}}}
  }
  if(id==='blueberry')for(let i=0;i<2;i++){const x=.2+i*.065,y=.7-(i%2)*.05;line(r,[.15,.68,0],[x,y+.07,.07],.004);mesh(r,G.cone,'white',[x,y+.025,.07],[.029,.065,.029]);const rim=mesh(r,G.ring,'cream',[x,y-.007,.07],[.024,.024,.024]);rim.rotation.x=Math.PI/2;for(let j=0;j<5;j++){const a=j*TAU/5;ell(r,[x+Math.sin(a)*.023,y-.011,.07+Math.cos(a)*.023],[.01,.012,.009],'white');}}
  return r;
}
function tropicalFruit(id){
  const r=new THREE.Group();
  if(id==='papaya'){
    line(r,[0,.02,0],[0,.88,0],.038,'stem');for(let i=0;i<7;i++){const a=i*TAU/7,x=Math.sin(a)*.22,z=Math.cos(a)*.12;line(r,[0,.82,0],[x,.86,z],.009);leaf(r,[x,.86,z],.32,.31,.4,a,'leaf',G.maple);}
    for(let i=0;i<4;i++){const a=i*TAU/4;ell(r,[Math.sin(a)*.07,.53+(i%2)*.12,Math.cos(a)*.06],[.065,.14,.06],i===0?'yellow':'leaf');}
  }else{
    const ends=treeFrame(r,{broad:true,opposite:true});for(let i=0;i<3;i++){const [x,y,z]=ends[i];ell(r,[x,y-.06,z],[.065,.075,.06],i%2?'yellow':'light');flower(r,[x,y-.12,z+.03],.018,'brown',4);}for(let i=3;i<5;i++){const [x,y,z]=ends[i];flower(r,[x,y+.035,z+.05],.055,'white');}
  }
  return r;
}
function fiberOrSpice(id){
  const r=new THREE.Group();
  if(id==='sisal'){
    // Sword-like leaves form a basal rosette; no aloe-type fleshy teeth.
    rosette(r,.03,13,.8,.13,'blueleaf',G.succulent);for(let i=0;i<3;i++)leaf(r,[0,.07,0],.78,.12,(i-1)*.13,i*2.1,'leaf',G.succulent);
  }else if(id==='jute'){
    for(let k=0;k<3;k++){const x=(k-1)*.06,h=.82+(k%2)*.15;line(r,[x,0,0],[x,h,0],.012);for(let i=0;i<5;i++)leaf(r,[x,.2+i*.12,0],.23,.07,i%2?.8:-.8,k*.7,'leaf');flower(r,[x,h,.02],.03,'yellow');ell(r,[x+.035,h-.13,.02],[.026,.028,.025],'leaf');}
    // Detached stems illustrate the harvested bast-fibre crop without bark cuts.
    for(let k=0;k<3;k++)line(r,[.19+k*.025,.05,.1],[.24+k*.025,.38,.1],.009,'cream');
  }else{
    const ends=treeFrame(r,{opposite:true});for(let i=0;i<3;i++){const [x,y,z]=ends[i];for(let j=0;j<3;j++){const bx=x+(j-1)*.035;line(r,[x,y,z],[bx,y+.05,z],.004);line(r,[bx,y+.05,z],[bx,y+.12,z],.009,'rose');ell(r,[bx,y+.13,z],[.019,.023,.018],'pink');}}
    // Enlarged detached dried flower buds, the familiar clove spice.
    for(let i=0;i<2;i++){line(r,[.21+i*.07,.04,.1],[.21+i*.07,.18,.1],.013,'brown');ell(r,[.21+i*.07,.195,.1],[.03,.032,.026],'brown');}
  }
  return r;
}

const waveTwoIds=['waterchestnut','teff','fonio','proso','amaranth','mungbean','adzuki','pigeonpea','faba','commonbean','lupin','taro','yam','yacon','jerusalemartichoke','okra','broccoli','cauliflower','beetroot','radish','almond','walnut','cashew','pistachio','hazelnut','chestnut','pear','peach','plum','cherry','apricot','strawberry','blueberry','raspberry','papaya','guava','sisal','jute','alfalfa','clove'];
const expandedIds=['tomato','pepper','eggplant','cucumber','pumpkin','watermelon','melon','cabbage','carrot','onion','garlic','lettuce','spinach','pea','sesame','buckwheat','quinoa','flax','rubber','mango','pineapple','avocado','blackpepper','ginger','cinnamon','vanilla','englishoak','silverbirch','sugarmaple','baobab','eucalyptus','redmangrove','bamboo','saguaro','pricklypear','agave','aloe','lotus','waterlily','eelgrass','duckweed','lavender','rosemary','dogrose','tulip','orchid','venusflytrap','sundew','edelweiss','ginkgo','scotspine','norwayspruce','coastredwood','dawnredwood','cedar','cycad','welwitschia','treefern','birdsnestfern','maidenhair','horsetail','clubmoss','resurrection','sphagnum','liverwort','hornwort',...waveTwoIds];
export const supportedCropIds=Object.freeze([...legacyIds,...expandedIds]);
function construct(id){
  if(['waterchestnut','teff','fonio','proso'].includes(id))return newGrass(id);
  if(id==='amaranth')return grainAmaranth();
  if(['mungbean','adzuki','pigeonpea','faba','commonbean','lupin','alfalfa'].includes(id))return newLegume(id);
  if(['taro','yam','yacon','jerusalemartichoke'].includes(id))return undergroundCrop(id);
  if(['beetroot','radish'].includes(id))return swollenRoots(id);
  if(['okra','broccoli','cauliflower'].includes(id))return floweringVegetable(id);
  if(['almond','walnut','cashew','pistachio','hazelnut','chestnut'].includes(id))return nutTree(id);
  if(['pear','peach','plum','cherry','apricot'].includes(id))return orchardTree(id);
  if(['strawberry','blueberry','raspberry'].includes(id))return berryCrop(id);
  if(['papaya','guava'].includes(id))return tropicalFruit(id);
  if(['sisal','jute','clove'].includes(id))return fiberOrSpice(id);
  if(['tomato','pepper','eggplant'].includes(id))return fruitVeg(id);
  if(['cucumber','pumpkin','watermelon','melon'].includes(id))return cucurbit(id);
  if(['cabbage','lettuce','spinach'].includes(id))return leafy(id);
  if(['carrot','onion','garlic'].includes(id))return bulbRoot(id);
  if(id==='pea')return pea();
  if(['sesame','buckwheat','quinoa','flax'].includes(id))return seedCrop(id);
  if(['rubber','mango','avocado','cinnamon'].includes(id))return fruitTree(id);
  if(id==='pineapple')return pineapple();
  if(['blackpepper','vanilla'].includes(id))return climber(id);
  if(id==='ginger')return ginger();
  if(['englishoak','silverbirch','sugarmaple','baobab','eucalyptus','redmangrove'].includes(id))return deciduous(id);
  if(id==='bamboo')return bamboo();
  if(['saguaro','pricklypear'].includes(id))return cactus(id);
  if(['agave','aloe','welwitschia'].includes(id))return succulent(id);
  if(['lotus','waterlily','eelgrass','duckweed'].includes(id))return aquatic(id);
  if(['lavender','rosemary','dogrose','tulip','orchid','edelweiss'].includes(id))return herbFlower(id);
  if(['venusflytrap','sundew'].includes(id))return carnivore(id);
  if(id==='ginkgo')return ginkgo();
  if(['scotspine','norwayspruce','coastredwood','dawnredwood','cedar'].includes(id))return conifer(id);
  if(['cycad','treefern','birdsnestfern','maidenhair'].includes(id))return fern(id);
  if(id==='horsetail')return horsetail();
  if(['clubmoss','resurrection'].includes(id))return lycophyte(id);
  if(['sphagnum','liverwort','hornwort'].includes(id))return bryophyte(id);
  throw new Error('Unknown plant miniature: '+id);
}
export function createCropMiniature(id,{scale=1}={}){
  if(legacyIds.includes(id))return legacyCreate(id,{scale});
  if(!expandedIds.includes(id))throw new Error('Unknown plant miniature: '+id);
  const model=construct(id);model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(model),h=box.max.y-box.min.y;
  if(!Number.isFinite(h)||h<=0)throw new Error('Invalid plant geometry: '+id);
  const outer=new THREE.Group();outer.name='crop-miniature-'+id;outer.userData={cropId:id,botanicalSchematic:true,sharedAssets:true,morphologyNote:model.userData.morphologyNote||null};model.scale.setScalar(1/h);model.position.y=-box.min.y/h;outer.add(model);outer.scale.setScalar(scale);return outer;
}
export const disposeMiniature=legacyDispose;

const previewCache=new Map();
// One static PNG per ID and size. The temporary renderer is independent from the
// globe, then disposed and its context released. Cached images need no WebGL.
export function renderMiniaturePreview(id,{width=480,height=360}={}){
  const key=id+':'+width+':'+height;let url=previewCache.get(key);
  if(!url){
    const scene=new THREE.Scene(),model=createCropMiniature(id),previewMaterials=new Map();
    model.traverse(o=>{if(!o.isMesh)return;const clone=m=>{if(!previewMaterials.has(m)){const copy=m.clone();copy.depthTest=true;copy.depthWrite=true;previewMaterials.set(m,copy);}return previewMaterials.get(m);};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);});
    scene.add(model);model.rotation.y=-.18;model.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
    const aspect=width/height,span=Math.max(size.y*1.22,size.x/aspect*1.28,size.z*1.25),camera=new THREE.OrthographicCamera(-span*aspect/2,span*aspect/2,span/2,-span/2,.1,30);
    camera.position.set(center.x,center.y+.45,4);camera.lookAt(center);scene.add(new THREE.HemisphereLight('#e1f0e5','#796247',2.6));const sun=new THREE.DirectionalLight('#fff1d3',2.2);sun.position.set(-3,5,6);scene.add(sun);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(width,height);renderer.setClearColor(0x000000,0);renderer.render(scene,camera);url=renderer.domElement.toDataURL('image/png');previewCache.set(key,url);disposeMiniature(model);for(const material of previewMaterials.values())material.dispose();renderer.dispose();renderer.forceContextLoss();
  }
  const img=document.createElement('img');img.src=url;img.width=width;img.height=height;img.alt='植物关键器官的三维结构示意；比例与生长阶段为教学呈现'+(waveTwoIds.includes(id)?'。花、果与地下器官可能跨生长阶段并置，不表示同株同时出现。':'')+(id==='pistachio'?'开心果左侧小株为雄花，主株为雌花与果实，雌雄分属不同植株。':'');if(waveTwoIds.includes(id))img.title=img.alt;img.className='plant-miniature-preview';img.style.cssText='display:block;width:100%;height:auto;max-height:360px;object-fit:contain';return img;
}
