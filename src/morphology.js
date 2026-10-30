/* Scientific teaching diagrams. Deliberately simplified; all sizes are illustrative. */
const C={ink:'var(--ink)',muted:'var(--muted)',leaf:'var(--leaf)',grain:'var(--grain)',root:'var(--rootcolor)',line:'var(--line)'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path=(d,color=C.leaf,width=2,fill='none',extra='')=>`<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill=C.grain,angle=0)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${angle} ${x} ${y})"/>`;
const circle=(x,y,r,fill=C.grain)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
function leaf(x,y,angle=-40,length=42,width=12){return `<g transform="translate(${x} ${y}) rotate(${angle})">${path(`M0 0 Q${-width} ${-length*.5} 0 ${-length} Q${width} ${-length*.5} 0 0`,C.leaf,1,C.leaf)}${path(`M0 0 L0 ${-length+5}`,C.line,.7)}</g>`;}
function heart(x,y,angle=-40,size=25){return `<g transform="translate(${x} ${y}) rotate(${angle})">${path(`M0 0 C-${size} -8 -${size} -${size+16} 0 -${size} C${size} -${size+16} ${size} -8 0 0`,C.leaf,1,C.leaf)}</g>`;}
function stem(){return path('M137 278 Q139 195 140 132',C.leaf,3)+leaf(139,221,-58,57,10)+leaf(139,187,54,58,10);}
function soil(y=220){return path(`M52 ${y} H193`,C.line,1.2)+`<text x="52" y="${y-6}" fill="${C.muted}" font-size="12">土面</text>`;}
function label(lines,target,y){const a=Array.isArray(lines)?lines:[lines];return path(`M${target[0]} ${target[1]} L196 ${y-4} H205`,C.line,1)+a.map((s,i)=>`<text x="211" y="${y+i*15}" font-size="13" fill="${C.ink}">${escape(s)}</text>`).join('');}
function annotation(labels){return labels.map((l,i)=>label(l.text,l.target,l.y||[72,154,242][i])).join('');}
function flower(x,y,size=11){let s='';for(let i=0;i<5;i++){const a=i*Math.PI*2/5;s+=ellipse(x+Math.sin(a)*size*.8,y-Math.cos(a)*size*.8,size*.68,size,C.grain,i*72);}return s+circle(x,y,size*.45,C.root);}
function insetTitle(text,x=30,y=209){return `<text x="${x}" y="${y}" font-size="12" fill="${C.muted}">${escape(text)}</text>`;}
function grainDiagram(type){
 let s=stem();
 if(type==='rice'||type==='oats'){
   s+=path(type==='rice'?'M140 147 Q139 86 167 74 Q179 73 184 89':'M140 147 L140 67',C.leaf,2);
   for(let i=0;i<6;i++){
     const y=83+i*9,side=i%2?1:-1,ex=type==='rice'?153+side*(20+i*2):140+side*(25+i*2),ey=y+21;
     s+=path(`M${type==='rice'?153:140} ${y} Q${ex} ${y+2} ${ex} ${ey}`,C.leaf,1.2);
     for(let j=0;j<3;j++)s+=ellipse(ex+(j-1)*5,ey+j*6,type==='oats'?3.3:2.8,type==='oats'?7:5.2,C.grain,side*24);
   }
 }else if(['wheat','barley','rye'].includes(type)){
   s+=path('M140 145 L140 54',C.grain,2);
   for(let i=0;i<8;i++){let y=66+i*9;for(const side of [-1,1]){s+=ellipse(140+side*7,y,5,8,C.grain,side*35);if(type!=='wheat'||i%2===0)s+=path(`M${140+side*9} ${y-4} L${140+side*(type==='barley'?28:21)} ${y-(type==='barley'?35:23)}`,C.grain,.9);}}
 }else{
   const fox=type==='foxtail';s+=path(fox?'M140 145 Q139 83 163 71':'M140 145 L140 69',C.leaf,2);
   if(type==='sorghum'){
     for(let row=0;row<8;row++){const n=row===0||row===7?3:row===1||row===6?4:5;for(let col=0;col<n;col++){let x=140-(n-1)*3.5+col*7,y=75+row*8;s+=circle(x,y,3.4);}}
   }else if(fox){
     for(let i=0;i<11;i++){const x=150+i*1.8,y=67+i*5.8;s+=ellipse(x,y,8,4.5);s+=path(`M${x-7} ${y} l-5 -4 M${x+7} ${y} l5 -3`,C.grain,.8);}
   }else{ s+=path('M129 135 L129 68 Q140 48 151 68 L151 135 Q140 144 129 135',C.grain,1,C.grain);for(let y=68;y<134;y+=7)for(let x=133;x<150;x+=6)s+=circle(x,y,1.2,C.line); }
 }
 return s;
}
function maize(){
 let s=path('M136 278 L136 105',C.leaf,5);
 for(let i=0;i<4;i++){const y=145+i*30,side=i%2?1:-1;s+=path(`M136 ${y} Q${136+side*47} ${y-40} ${136+side*60} ${y-28} Q${136+side*33} ${y-8} 136 ${y+8}`,C.leaf,1,C.leaf);}
 s+=path('M136 107 L136 47 M136 73 L114 52 M136 83 L103 62 M136 93 L161 62 M136 76 L155 51',C.grain,2);
 for(let i=0;i<9;i++)s+=ellipse(137+(i%2?5:-5),51+i*5,2,4,C.grain);
 s+=`<g transform="rotate(22 155 185)">${ellipse(155,185,12,34,C.grain)}${path('M145 213 Q134 183 145 159 Q143 196 155 218 Q164 196 165 159 Q178 191 155 218',C.leaf,1,C.leaf)}`;
 for(let i=0;i<5;i++)s+=path(`M${148+i*3} 157 Q${146+i*4} 143 ${153+i*3} 138`,C.grain,1);
 return s+'</g>';
}
function underground(type){
 let s=soil();
 if(type==='sweetpotato'){
   s+=path('M72 214 Q117 181 178 210',C.leaf,3);for(let i=0;i<4;i++)s+=heart(85+i*26,204,-30+i*15,15);
 }else if(type==='cassava'){
   s+=path('M140 219 L140 85',C.root,4);
   for(let i=0;i<3;i++){const x=105+i*33,y=134+(i%2)*32;s+=path(`M140 183 L${x} ${y}`,C.leaf,2);for(let a=-60;a<=60;a+=30)s+=leaf(x,y,a,32,5);}
 }else if(type==='sugarbeet'){
   for(let a=-55;a<=55;a+=22)s+=leaf(140,219,a,85,17);
 }else{
   s+=path('M140 218 L140 122 M140 162 L107 134 M140 182 L172 155',C.leaf,3);
   for(const [x,y,a]of [[108,135,-45],[109,140,25],[171,155,50],[165,162,-25],[140,124,0]])s+=leaf(x,y,a,31,12);
 }
 if(type==='potato'){
   s+=path('M140 220 L140 267 M140 235 Q117 231 92 248 M140 246 Q160 236 176 255',C.root,2);
   for(const [x,y] of [[89,254],[176,261],[131,276]]){s+=ellipse(x,y,17,12,C.root);s+=circle(x-6,y-3,1.3,C.ink)+circle(x+6,y+4,1.3,C.ink);}
 }else if(type==='sugarbeet'){
   s+=path('M121 219 Q109 249 139 279 Q165 252 159 219 Z',C.root,1,C.root)+path('M139 277 L137 293',C.root,1.5);
 }else{
   s+=path('M140 219 L140 233',C.root,2);
   for(const [x,a]of [[103,-30],[137,5],[169,28]]){s+=path(`M140 229 L${x} 251`,C.root,1.5);s+=ellipse(x,260,type==='cassava'?9:14,26,C.root,a);}
 }
 return s;
}
function pod(x,y,size=1,type='soybean'){
 let d=type==='cowpea'?'M0 0 Q-13 36 -4 70 Q6 42 3 0 Z':type==='chickpea'?'M0 0 C-22 4 -22 31 -6 34 C11 32 18 14 0 0 Z':type==='lentil'?'M0 0 Q-21 12 -2 23 Q20 10 0 0 Z':'M0 0 Q-17 7 -13 22 Q-17 33 -4 41 Q11 42 11 27 Q17 13 0 0 Z';
 return `<g transform="translate(${x} ${y}) scale(${size})">${path(d,C.grain,1.2,C.grain)}${type==='soybean'?[10,22,33].map(a=>ellipse(-2,a,4,5,C.leaf)).join(''):''}</g>`;
}
function legumes(type){
 let s=path('M138 278 Q138 193 142 115 M140 183 L102 151 M140 212 L170 177',C.leaf,2.5);
 if(type==='chickpea'||type==='lentil'){
   for(let i=0;i<6;i++){s+=leaf(108+i*4,154+i*5,-60,16,4)+leaf(113+i*4,154+i*5,55,16,4);}
 }else{
   for(const [x,y]of[[102,153],[169,179],[142,116]])for(const a of [-48,0,48])s+=leaf(x,y,a,26,10);
 }
 s+=pod(146,147,type==='cowpea'?1.25:1.3,type)+pod(109,190,type==='cowpea'?.8:1,type);
 if(type==='chickpea')s+=insetTitle('种子放大',32,225)+path('M57 236 C37 235 39 268 61 270 C80 272 84 251 72 242 L77 232 L65 236 Z',C.root,1.2,C.grain);
 if(type==='lentil')s+=insetTitle('种子放大',32,228)+ellipse(63,252,22,9,C.grain)+path('M41 252 Q63 263 85 252',C.root,1);
 return s;
}
function peanut(){
 let s=soil(210)+path('M137 211 L137 151 M137 185 L100 168 M137 190 L169 165',C.leaf,2.5);
 for(const [x,y]of[[101,168],[169,167],[138,153]])for(const a of[-50,-17,17,50])s+=leaf(x,y,a,22,7);
 s+=circle(112,184,5,C.grain)+path('M112 188 Q107 209 98 232 M160 188 Q175 211 173 241',C.root,1.6);
 const shell=(x,y)=>`<g transform="translate(${x} ${y}) rotate(22)">${path('M0 0 C-18 -4 -18 14 -9 18 C-19 35 5 44 10 30 C18 19 10 15 9 13 C19 0 8 -7 0 0',C.root,1.3,C.root)}${path('M-5 2 L3 32 M-8 9 L8 9 M-8 23 L9 23',C.line,.7)}</g>`;
 return s+shell(94,233)+shell(170,242)+path('M137 211 L137 271 M137 238 L118 264 M137 248 L154 270',C.root,1);
}
function sunflower(){
 let s=path('M140 278 L140 131',C.leaf,4)+heart(140,208,50,29)+heart(140,244,-50,28);
 for(let i=0;i<14;i++){let a=i*Math.PI/7;s+=ellipse(140+31*Math.cos(a),99+31*Math.sin(a),8,21,C.grain,i*180/7+90);}
 s+=circle(140,99,28,C.root);for(let y=-18;y<=18;y+=8)for(let x=-18;x<=18;x+=8)if(x*x+y*y<420)s+=circle(140+x,99+y,2.2,C.grain);
 return s;
}
function rapeseed(){
 let s=path('M139 278 L139 65',C.leaf,3)+leaf(140,237,-60,46,15)+leaf(140,211,55,42,13);
 for(let i=0;i<7;i++){let y=102+i*15,side=i%2?1:-1;s+=path(`M139 ${y+16} L${139+side*29} ${y}`,C.leaf,1.4);s+=ellipse(139+side*37,y-12,4,22,C.grain,side*31);}
 for(const [x,y]of[[139,63],[122,78],[157,84]])for(const [dx,dy]of[[-5,0],[5,0],[0,-5],[0,5]])s+=circle(x+dx,y+dy,4,C.grain);
 return s;
}
function cotton(){
 let s=path('M132 279 L132 97 M132 178 L159 168 M132 249 L142 244',C.root,3);
 s+=heart(132,191,-55,23)+heart(132,134,48,21)+flower(132,81,14);
 s+=ellipse(159,150,16,22,C.leaf)+path('M159 130 Q148 149 159 171 M159 130 Q170 150 159 171',C.line,1)+path('M143 164 L147 178 L159 171 L170 178 L175 163',C.leaf,2);
 s+=path('M120 239 L141 254 L162 239',C.root,4);
 for(const [dx,dy]of[[0,-9],[-12,1],[12,1],[0,12]])s+=circle(141+dx,229+dy,13,C.grain);
 return s;
}
function sugarcane(){
 let s='';for(const [x,y]of[[123,87],[148,122]]){s+=path(`M${x-7} 278 L${x-7} ${y} H${x+7} V278 Z`,C.leaf,1,C.leaf);for(let k=y+22;k<278;k+=30)s+=path(`M${x-9} ${k} H${x+9}`,C.root,2);for(let a=0;a<3;a++)s+=leaf(x,y+a*31,a%2?55:-58,65,7);}
 return s;
}
function twig(type){
 let s=path('M104 277 Q145 181 157 76',C.root,3);
 const paired=['arabica','robusta','olive'].includes(type);
 for(let i=0;i<(paired?4:5);i++){const y=113+i*(paired?34:27),x=153-i*(paired?10:8);if(paired)s+=leaf(x,y,-55,type==='olive'?34:43,type==='olive'?5:12)+leaf(x,y,52,type==='olive'?33:44,type==='olive'?5:13);else s+=leaf(x,y,i%2?52:-55,44,13);}
 if(type==='tea'){s+=path('M156 77 Q148 56 158 43 Q170 58 158 78',C.leaf,1,C.leaf);}
 else if(type==='arabica'||type==='robusta'){
   for(let i=0;i<3;i++)for(let j=0;j<4;j++)s+=ellipse(134+i*4+(j%2)*8,137+i*35+Math.floor(j/2)*9,5,6,C.grain);
   s+=insetTitle('果实剖示',32,211)+ellipse(63,250,28,32,C.grain)+ellipse(53,250,9,22,C.root)+ellipse(73,250,9,22,C.root)+path('M55 232 Q49 248 55 268 M71 232 Q77 249 71 268',C.grain,1);
 }else if(type==='olive'){
   for(const[x,y]of[[130,143],[169,162],[113,209]])s+=ellipse(x,y,8,12,C.grain,20);
   s+=insetTitle('果实剖示',32,211)+ellipse(64,251,25,34,C.grain)+ellipse(64,251,10,21,C.root);
 }else if(type==='citrus'){
   for(const[x,y]of[[119,142],[172,183]])s+=circle(x,y,21,C.grain);
 }else if(type==='apple'){
   s+=path('M138 169 L110 143',C.root,1.5)+flower(108,140,11);
   for(const[x,y]of[[171,192]]){s+=path(`M${x} ${y-17} C${x-28} ${y-35} ${x-29} ${y+19} ${x-3} ${y+24} C${x+25} ${y+25} ${x+31} ${y-29} ${x} ${y-17}`,C.grain,1,C.grain)+path(`M${x} ${y-17} l3 -10`,C.root,2);}
 }
 return s;
}
function cocoa(){
 let s=path('M132 280 L146 97 M143 148 L102 111 M142 128 L175 88',C.root,10);
 for(const[x,y,a]of[[102,112,-45],[145,98,-20],[174,88,30],[106,120,45]])s+=leaf(x,y,a,54,16);
 for(const[x,y,a]of[[133,194,-10],[156,239,12]]){s+=ellipse(x,y,15,31,C.grain,a);s+=path(`M${x} ${y-28} Q${x-9} ${y} ${x} ${y+28} M${x+5} ${y-26} Q${x+14} ${y} ${x+5} ${y+26}`,C.root,1);}
 s+=insetTitle('果实剖示',32,207)+ellipse(64,252,27,38,C.grain);
 for(let i=0;i<5;i++)for(const x of[55,72])s+=ellipse(x,229+i*11,5,7,C.root,x===55?-15:15);
 return s;
}
function palm(type){
 let s=path(type==='coconut'?'M132 280 Q159 194 145 105':'M132 280 L145 108',C.root,type==='oilpalm'?19:12);
 for(let y=142;y<275;y+=17)s+=path(`M${type==='coconut'?145:136} ${y} l11 3`,C.line,1.2);
 for(let i=-3;i<=3;i++){
   let ex=143+i*25,ey=83+Math.abs(i)*15;s+=path(`M145 111 Q${143+i*19} 57 ${ex} ${ey}`,C.leaf,2);
   for(let k=1;k<5;k++){const t=k/5,x=145+(ex-145)*t,y=111+(ey-111)*t-22*Math.sin(t*Math.PI);s+=path(`M${x} ${y} l${i<0?-13:13} 13 M${x} ${y} l${i<0?8:-8} 12`,C.leaf,2);}
 }
 if(type==='coconut'){
   for(const[x,y]of[[137,124],[153,134],[168,122]])s+=ellipse(x,y,11,14,C.grain,-20);
   s+=insetTitle('果实剖示',30,202)+ellipse(63,249,34,41,C.grain)+ellipse(63,249,26,33,C.root)+ellipse(63,249,22,29,C.grain)+ellipse(63,249,15,22,C.line);
 }else if(type==='oilpalm'){
   for(let y=131;y<166;y+=8)for(let x=125;x<163;x+=9)s+=ellipse(x+(y%3),y,5,6,C.grain);
   s+=insetTitle('单果剖示',32,209)+ellipse(63,250,25,33,C.grain)+ellipse(63,250,13,22,C.root)+ellipse(63,250,8,14,C.grain);
 }else{
   for(const side of[-1,1]){s+=path(`M145 118 Q${145+side*24} 130 ${145+side*27} 160`,C.root,1.5);for(let i=0;i<13;i++)s+=ellipse(145+side*26+(i%3-1)*8,146+Math.floor(i/3)*11,4.5,7,C.grain,side*12);}
   s+=insetTitle('单果放大',32,216)+ellipse(64,252,16,28,C.grain)+path('M60 228 Q54 253 60 276',C.root,.8);
 }
 return s;
}
function banana(){
 let s=path('M127 279 L129 115 Q140 99 149 115 L153 279 Z',C.leaf,1,C.leaf);
 for(const[x,y,a,l,w]of[[140,120,-65,93,23],[140,117,-32,78,23],[140,116,30,88,23],[141,127,67,69,21]])s+=leaf(x,y,a,l,w);
 s+=path('M143 120 Q184 133 171 160 L169 215',C.root,3);
 for(let row=0;row<3;row++)for(let col=0;col<4;col++){let x=148+col*11,y=151+row*18;s+=path(`M${x} ${y} Q${x-2} ${y+17} ${x+10} ${y+20} Q${x+4} ${y+10} ${x+5} ${y-1}`,C.grain,1,C.grain);}
 return s;
}
function grape(){
 let s=path('M103 278 Q119 202 128 135 Q145 96 181 87',C.root,4)+heart(129,142,-65,25)+heart(161,110,30,25);
 s+=path('M131 133 Q104 117 111 102 Q124 94 122 110',C.leaf,1.5)+path('M152 121 L152 155',C.root,2);
 for(let row=0;row<5;row++)for(let col=0;col<5-row;col++)s+=circle(128+row*6+col*12,165+row*13,7,C.grain);
 return s;
}
const make=(name,type,labels,caption)=>({name,type,labels,caption});
const D={
 rice:make('水稻','rice',[{text:['分枝稻穗','圆锥花序'],target:[166,90]},{text:'枝梗与小穗',target:[181,126]},{text:'叶与茎',target:[143,204]}],'稻穗疏密、直立或下垂程度因品种而异。'),
 wheat:make('小麦','wheat',[{text:'穗轴与小穗',target:[145,87]},{text:['芒','依品种而异'],target:[161,93]},{text:'茎与叶',target:[141,211]}],'小穗直接沿穗轴排列；有芒和无芒品种均存在。'),
 barley:make('大麦','barley',[{text:'麦穗',target:[142,94]},{text:'芒',target:[163,63]},{text:'茎与叶',target:[141,211]}],'以有芒类型示意；穗部排列随类型而异。'),
 oats:make('燕麦','oats',[{text:'疏散圆锥花序',target:[151,78]},{text:'下垂小穗',target:[174,126]},{text:'茎与叶',target:[140,211]}],'小穗通过分枝梗着生，区别于紧密麦穗。'),
 rye:make('黑麦','rye',[{text:'穗轴与小穗',target:[143,88]},{text:'芒',target:[161,83]},{text:'茎与叶',target:[141,211]}],'以常见穗形示意，比例和疏密因品种而异。'),
 sorghum:make('高粱','sorghum',[{text:'圆锥花序',target:[149,85]},{text:'密集小穗',target:[153,123]},{text:'茎与叶',target:[141,211]}],'以紧密穗型示意；高粱也有疏散穗型。'),
 foxtail:make('谷子（小米）','foxtail',[{text:'穗状圆锥花序',target:[160,91]},{text:'小穗与刚毛',target:[169,119]},{text:'茎与叶',target:[141,211]}],'成熟谷粒去壳得到小米；穗形随品种变化。'),
 pearl:make('珍珠粟','pearl',[{text:'柱状密穗',target:[144,75]},{text:'密集小穗',target:[149,125]},{text:'茎与叶',target:[141,211]}],'柱状穗状圆锥花序是常见识别特征。'),
 maize:make('玉米','maize',[{text:['顶端雄穗','产生花粉'],target:[149,70]},{text:['穗丝','接收花粉'],target:[169,144]},{text:['叶腋雌穗','发育成玉米棒'],target:[164,195]}],'同一植株上，雄穗在顶端，雌穗位于叶腋。'),
 potato:make('马铃薯','potato',[{text:'地上茎叶',target:[141,130]},{text:'地下匍匐茎',target:[118,239]},{text:['块茎与芽眼','膨大的茎'],target:[177,259],y:264}],'马铃薯是地下匍匐茎末端膨大的块茎，不是块根。'),
 cassava:make('木薯','cassava',[{text:'掌状裂叶',target:[137,127]},{text:'茎',target:[141,192]},{text:['储藏根','膨大的根'],target:[168,261],y:264}],'收获部位是储藏根；地上茎常用作繁殖材料。'),
 sweetpotato:make('甘薯','sweetpotato',[{text:'蔓与叶',target:[126,196]},{text:'土面',target:[182,220]},{text:['储藏根','膨大的根'],target:[168,261],y:264}],'甘薯食用部分是储藏根，与马铃薯块茎的来源不同。'),
 soybean:make('大豆','soybean',[{text:'三出复叶',target:[141,111]},{text:'豆荚',target:[151,174]},{text:'荚内种子',target:[110,215]}],'豆荚内的种子是主要收获部位。'),
 chickpea:make('鹰嘴豆','chickpea',[{text:'羽状复叶',target:[120,164]},{text:'膨大的短荚',target:[149,171]},{text:['种子','一端有小喙'],target:[69,244],y:253}],'以短荚和复叶示意；左下放大种子的小喙，大小不按比例。'),
 lentil:make('小扁豆','lentil',[{text:'羽状复叶',target:[120,164]},{text:'扁平短荚',target:[145,163]},{text:'透镜状种子',target:[64,252],y:253}],'左下单独放大扁圆、透镜状种子；植株与种子不按同一比例。'),
 cowpea:make('豇豆','cowpea',[{text:'三出复叶',target:[141,111]},{text:'荚果',target:[148,190]},{text:'长荚示意',target:[107,239]}],'长荚为示意；粮用品种和菜用品种的荚长差异很大。'),
 peanut:make('花生','peanut',[{text:'地上花与叶',target:[112,182]},{text:'入土果针',target:[174,220]},{text:['地下荚果','荚内含种子'],target:[173,262],y:264}],'开花后果针向下入土，荚果在地下发育。'),
 sunflower:make('向日葵','sunflower',[{text:['头状花序','花盘'],target:[159,88]},{text:['盘内小花','后形成果实'],target:[151,112]},{text:'茎与叶',target:[146,213]}],'“一朵向日葵”实际由许多小花组成。'),
 rapeseed:make('油菜','rapeseed',[{text:'花序',target:[153,82]},{text:['长角果','内含种子'],target:[176,150]},{text:'茎与叶',target:[141,231]}],'细长的角果内含油菜籽。'),
 cotton:make('棉花','cotton',[{text:'花',target:[141,81]},{text:'未开裂棉铃',target:[170,149]},{text:['吐絮棉铃','纤维附着种子'],target:[153,230]}],'并置花、未开裂棉铃和吐絮状态，说明不同阶段；棉纤维附着于种子表面。'),
 sugarcane:make('甘蔗','sugarcane',[{text:'长叶',target:[128,98]},{text:'茎节',target:[157,173]},{text:['节间','储糖的茎'],target:[147,233]}],'甘蔗主要收获含糖的茎；横线标示茎节。'),
 sugarbeet:make('甜菜','sugarbeet',[{text:'叶丛',target:[145,161]},{text:'根颈附近',target:[146,220]},{text:['肉质根体','储糖部位'],target:[146,254],y:264}],'储糖根体包含膨大的根与胚轴相关部分，图中简化表示。'),
 tea:make('茶','tea',[{text:'顶端芽',target:[159,61]},{text:'嫩叶',target:[156,110]},{text:'枝条与成熟叶',target:[140,199]}],'茶叶通常采摘适宜嫩度的芽叶，采摘标准因茶类而异。'),
 arabica:make('阿拉比卡咖啡','arabica',[{text:['对生叶','与咖啡果'],target:[149,139]},{text:'果皮与果肉',target:[85,239],y:212},{text:['内部种子','即咖啡豆'],target:[72,253],y:267}],'左下是果实横向剖示，常见两粒种子；仅凭此示意不能鉴定咖啡种。'),
 robusta:make('罗布斯塔咖啡','robusta',[{text:['对生叶','与咖啡果'],target:[149,139]},{text:'果皮与果肉',target:[85,239],y:212},{text:['内部种子','即咖啡豆'],target:[72,253],y:267}],'左下是常见两粒种子的果实剖示；两种咖啡共享这些结构，不能据此鉴定种类。'),
 cocoa:make('可可','cocoa',[{text:'树体与枝叶',target:[151,90]},{text:['树干上的果实','老枝也可结果'],target:[134,190]},{text:['剖开果实内部','多粒可可种子'],target:[72,252],y:254}],'可可果直接着生于树干和较老枝条；左下剖示果实内部的多粒种子。'),
 oilpalm:make('油棕','oilpalm',[{text:'羽状复叶',target:[157,94]},{text:'密集果串',target:[153,148]},{text:['单果剖示','果肉·核·种仁'],target:[72,250],y:250}],'左下单果由外向内简化示意果肉、硬核与种仁；果肉和种仁均可提供油脂。'),
 banana:make('香蕉','banana',[{text:'宽大叶片',target:[151,82]},{text:'成串果实',target:[177,178]},{text:['假茎','叶鞘包叠形成'],target:[141,242]}],'香蕉为大型草本；可见“树干”主要是叶鞘形成的假茎。'),
 coconut:make('椰子','coconut',[{text:['羽状叶','与椰果'],target:[166,124]},{text:['外层纤维','与硬椰壳'],target:[85,232],y:191},{text:['种子剖面','椰肉与内腔'],target:[63,251],y:264}],'左下剖示由外向内的纤维层、硬壳、种子椰肉和内腔；椰肉与液体状态随成熟度变化。'),
 grape:make('葡萄','grape',[{text:'卷须',target:[113,104]},{text:'果穗',target:[158,178]},{text:'木质藤蔓',target:[113,240]}],'葡萄依靠卷须攀附，果实聚集形成果穗。'),
 olive:make('油橄榄','olive',[{text:'狭长叶',target:[154,112]},{text:'果肉',target:[83,241],y:213},{text:'坚硬果核',target:[64,251],y:267}],'完整果实着生在枝上，左下放大剖示果肉与包围种子的坚硬果核。'),
 citrus:make('甜橙','citrus',[{text:'叶片',target:[156,110]},{text:'橙果',target:[174,184]},{text:'木质枝条',target:[123,228]}],'甜橙果实属于柑果；果皮和果肉在此未剖开。'),
 apple:make('苹果','apple',[{text:'叶片',target:[158,110]},{text:'花',target:[113,141]},{text:'苹果果实',target:[178,194]}],'花、叶与果实并置用于认识结构，不代表总在同一季节阶段同时出现。'),
 date:make('椰枣','date',[{text:'羽状复叶',target:[156,91]},{text:'下垂果串',target:[178,170]},{text:'单个椰枣',target:[65,252],y:253}],'左下单独放大一枚椰枣；雄株与雌株分开，植株示意为结果雌株。')
};
const dispatch={maize, potato:()=>underground('potato'),cassava:()=>underground('cassava'),sweetpotato:()=>underground('sweetpotato'),sugarbeet:()=>underground('sugarbeet'),peanut,sunflower,rapeseed,cotton,sugarcane,cocoa,banana,grape};
export const supportedMorphologyCropIds=Object.freeze(Object.keys(D));
export function renderMorphology(cropId){
 const d=D[cropId];
 if(!d)return {svg:'',caption:'选择一种作物查看形态示意。',labels:[]};
 let drawing;
 if(dispatch[d.type])drawing=dispatch[d.type]();
 else if(['rice','wheat','barley','oats','rye','sorghum','foxtail','pearl'].includes(d.type))drawing=grainDiagram(d.type);
 else if(['soybean','chickpea','lentil','cowpea'].includes(d.type))drawing=legumes(d.type);
 else if(['oilpalm','coconut','date'].includes(d.type))drawing=palm(d.type);
 else drawing=twig(d.type);
 const labels=d.labels.map(l=>Array.isArray(l.text)?l.text.join(' · '):l.text);
 const svg=`<svg class="crop-morphology" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="${escape(d.name+'形态示意：'+labels.join('；'))}" style="width:100%;height:auto;display:block"><title>${escape(d.name)}形态示意</title><desc>${escape(d.caption)}</desc><text x="16" y="24" font-size="14" font-weight="500" fill="${C.ink}">${escape(d.name)}</text>${drawing}${annotation(d.labels)}<text x="160" y="309" text-anchor="middle" font-size="12" fill="${C.muted}">植株形态示意 · 不按比例</text></svg>`;
 return {svg,caption:d.caption,labels};
}
