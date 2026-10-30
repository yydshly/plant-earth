const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const arrow=(ctx,x1,y1,x2,y2,color='#eed589')=>{ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-.45),y2-9*Math.sin(a-.45));ctx.lineTo(x2-9*Math.cos(a+.45),y2-9*Math.sin(a+.45));ctx.fill();};
function canvas(parent,label,draw){const c=el('canvas');c.width=1040;c.height=380;c.setAttribute('role','img');c.setAttribute('aria-label',label);c.className='foundation-diagram';const ctx=c.getContext('2d');ctx.scale(2,2);ctx.fillStyle='#19333e';ctx.fillRect(0,0,520,190);ctx.font='20px sans-serif';ctx.textAlign='center';draw(ctx);parent.append(c);const expand=el('button','放大看过程','foundation-expand');expand.onclick=()=>{const dialog=el('dialog',null,'foundation-diagram-dialog');dialog.id='foundation-diagram-dialog';dialog.setAttribute('aria-label','放大过程示意');const close=el('button','关闭大图');close.onclick=()=>dialog.close();const copy=el('canvas');copy.width=c.width;copy.height=c.height;copy.getContext('2d').drawImage(c,0,0);copy.setAttribute('role','img');copy.setAttribute('aria-label',label);dialog.append(close,copy,el('p',label),el('small','简化原理示意，不是实测天气，也不按真实比例。'));dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();event.preventDefault();dialog.close();}});dialog.addEventListener('close',()=>{dialog.remove();if(expand.isConnected)expand.focus({preventScroll:true});});document.body.append(dialog);dialog.showModal();close.focus();};parent.append(expand);return c;}
function choices(parent,items,selected,onSelect){const group=el('div',null,'foundation-options');group.setAttribute('role','group');group.setAttribute('aria-label','改变示意条件');for(const [value,title] of items){const b=el('button',title);b.type='button';b.dataset.foundationChoice=value;b.setAttribute('aria-pressed',String(selected===value));b.onclick=()=>onSelect(value);group.append(b);}parent.append(group);}

// Diagrams are deliberately qualitative: no weather, rainfall or biological
// productivity quantities are simulated from these teaching controls.
export function renderFoundationView(box,step,state,{onChange,onLocate,onListen}){
  const update=value=>{state[step.id]=value;onChange?.();};
  const selected=state[step.id];
  const why=el('p',step.why,'foundation-why');
  if(step.id==='landsea'){
    box.append(el('p','先找一个熟悉的地方，再慢慢认其他地方。','foundation-instruction'));
    const buttons=el('div',null,'foundation-options');for(const [label,lon,lat] of [['找中国',105,34],['找非洲',20,4],['找南美洲',-60,-15]]){const b=el('button',label);b.onclick=()=>onLocate?.({lon,lat,label});buttons.append(b);}box.append(buttons);
    const guide=el('div',null,'foundation-land-key');guide.append(el('span','蓝色：海洋，大片相连的水'),el('span','绿色：陆地，我们生活的地面'));box.append(guide);
  }else if(step.id==='equator'){
    box.append(el('p','看地球上亮起来的那条环线：这就是赤道的位置。','foundation-instruction'));
    const chain=el('div',null,'foundation-word-chain');chain.append(el('strong','北极'),el('span','北半球'),el('strong','赤道 · 地球的“腰线”'),el('span','南半球'),el('strong','南极'));box.append(chain);
  }else if(step.id==='sunlight'){
    const active=selected||'direct';choices(box,[['direct','看照得直'],['slant','看照得斜']],active,update);
    canvas(box,'同样宽的一束阳光，直照时落在较小面积，斜照时铺开到较大面积。',ctx=>{
      for(const [cx,angle,title,key] of [[130,0,'照得直','direct'],[390,Math.PI/3,'照得斜','slant']]){
        if(active===key){ctx.fillStyle='#294b43';ctx.fillRect(cx-118,6,236,174);}ctx.fillStyle='#e6eddc';ctx.fillText(title,cx,26);
        const half=23/Math.cos(angle);ctx.fillStyle='#bdac68';ctx.fillRect(cx-half,138,half*2,10);ctx.strokeStyle='#91b18b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-112,150);ctx.lineTo(cx+112,150);ctx.stroke();
        for(const k of [-1,0,1]){const x=cx+k*21/Math.cos(angle);arrow(ctx,x-82*Math.sin(angle),137-82*Math.cos(angle),x,137);}
        ctx.fillStyle='#c9dbc5';ctx.fillText(angle===0?'同一束光，较集中':'同一束光，铺得更开',cx,175);
      }
    });
    const result=el('p',active==='direct'?'照得比较直时，同样的能量集中在较小地面上，每一小块地面分到的能量较多。':'照得比较斜时，同样的能量铺到更大地面上，每一小块地面分到的能量较少。','foundation-result');result.setAttribute('role','status');box.append(result,el('p','播放时过程随讲解切换；手动切换会暂停声音。示意图不表示某一天的气温或四季。','foundation-caption'));
  }else if(step.id==='water-cycle'){
    const active=selected||'vapour';choices(box,[['vapour','1 水从哪里来'],['cloud','2 怎样成云'],['rain','3 怎样落雨']],active,update);
    canvas(box,'水从海面和植物进入空气；湿空气上升时冷却，水汽凝结成云滴，云滴长大后可能降雨。',ctx=>{
      ctx.fillStyle='#295f76';ctx.fillRect(10,146,225,35);ctx.fillStyle='#507959';ctx.fillRect(235,146,275,35);ctx.fillStyle='#f0e9ce';ctx.fillText('海洋 / 湖面',110,174);ctx.fillText('陆地 / 植物',380,174);
      arrow(ctx,115,140,155,70,'#85cbd1');arrow(ctx,335,140,295,70,'#85cbd1');ctx.fillStyle='#c7e6e3';ctx.fillText('水进入空气',110,120);
      if(active!=='vapour'){arrow(ctx,235,126,235,35);ctx.fillStyle='#dbe5e4';for(const [x,y,r] of [[235,54,22],[264,48,26],[292,57,21]]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#f3e8ba';ctx.fillText('上升 → 变冷 → 成云',355,27);}
      if(active==='rain'){ctx.strokeStyle='#84c3e5';ctx.lineWidth=3;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(227+i*15,88);ctx.lineTo(220+i*15,116);ctx.stroke();}ctx.fillStyle='#d0e3eb';ctx.fillText('云滴长大，可能落雨',370,124);}
    });
    const text={vapour:'太阳供能，水从海面、湖面蒸发；植物也通过叶片向空气释放水汽。水汽本身看不见。',cloud:'空气上升会膨胀、变冷；冷却到合适条件后，部分水汽才凝结成小水滴。',rain:'云里的小水滴或冰晶还要继续长大，才可能落下来形成降水。有云不一定下雨。'};
    const result=el('p',text[active],'foundation-result');result.setAttribute('role','status');box.append(result,el('p','播放时过程随讲解切换；手动切换会暂停声音。这是水循环示意，不是降雨预报。','foundation-caption'));
  }else if(step.id==='forest'||step.id==='rainforest'){
    const active=selected||'wet';choices(box,[['wet','温暖，也有持续水分'],['dry','温暖，但长期缺水']],active,update);
    const line=el('ol',null,'foundation-cause-chain');const stages=step.id==='rainforest'?['赤道附近常年获得较多太阳能',active==='wet'?'周围海洋蒸发，风把水汽带来':'如果风带来的水汽不足',active==='wet'?'湿空气上升、冷却，较频繁形成降雨':'即使暖热，也不一定有足够降雨',active==='wet'?'长期有可用水，有利于森林持续生长':'小树苗更难存活、长大']:['太阳提供生长所需能量',active==='wet'?'有可用水，且生长季能持续补给':'水分不足，植物需要度过缺水期',active==='wet'?'许多植物能持续生长，也会争光和空间':'树木生长和小树苗存活受到限制'];for(const text of stages)line.append(el('li',text));box.append(line);
    const result=el('p',active==='wet'?'水和适合的温度长期配合，有利于森林形成；还要看土壤、地形，以及火灾等影响和植物之间的关系。':'只有热不够。缺水会让叶片难以制造生长所需的物质，也会限制生长，温暖的地方也可能形成草原或荒漠。','foundation-result');result.setAttribute('role','status');box.append(result);
    if(step.id==='forest'){const layer=state['forest-layer']||'canopy';choices(box,[['canopy','看树冠'],['understory','看林下']],layer,value=>{state['forest-layer']=value;onChange?.();});box.append(el('p',layer==='canopy'?'树木上方枝叶形成的树冠先接触阳光，遮住一部分照向下方的光。':'树冠下方的林下收到的光更少。不同植物会利用不同高度和缝隙中的光。','foundation-result'));}
    if(step.id==='rainforest'){const b=el('button','在地球上找到婆罗洲','foundation-locate');b.onclick=()=>onLocate?.({lon:114,lat:2,label:'婆罗洲 · 东南亚'});box.append(b);}
  }else{
    const buttons=el('div',null,'foundation-options');for(const [label,lon,lat] of [['看婆罗洲',114,2],['看撒哈拉中部',15,23]]){const b=el('button',label);b.onclick=()=>onLocate?.({lon,lat,label});buttons.append(b);}box.append(buttons);
  }
  if(step.question){const details=el('details',null,'foundation-question');details.append(el('summary','试着解释一次'));const q=step.question;details.append(el('p',q.prompt));const options=el('div',null,'foundation-options');q.options.forEach((text,i)=>{const b=el('button',text);b.onclick=()=>{feedback.replaceChildren(el('strong',i===q.correctIndex?'解释对了':'换个角度想一想'),el('p',q.explanation));feedback.tabIndex=-1;feedback.focus({preventScroll:true});feedback.scrollIntoView({block:'nearest',behavior:'instant'});};options.append(b);});const feedback=el('div',null,'foundation-result');feedback.setAttribute('role','status');details.append(options,feedback);box.append(details);}
  box.append(why);
  const listen=el('button','听这一步的解释','foundation-listen');listen.onclick=onListen;box.append(listen);
  const terms=el('details',null,'learn-sources');terms.append(el('summary','这一步出现的新词'));for(const item of step.keyTerms||[]){const p=el('p');p.append(el('strong',item.term+'：'),document.createTextNode(item.meaning));terms.append(p);}box.append(terms);
  const sources=el('details',null,'learn-sources');sources.append(el('summary','查看解释依据'));for(const source of step.sourceLinks||[]){const a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);}box.append(sources);
}
