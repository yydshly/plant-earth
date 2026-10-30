import {resolveEnvironmentDemonstration} from './environment-demonstration-model.js';
import {geoEquirectangular,geoPath} from 'd3';
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};

// All four processes use the same stable cross-section. The active teaching
// layer changes with the audio clock; the mountain never jumps between scenes.
function diagram(kind,phase,world){
  if(kind==='ocean'&&phase==='basins'){
    const projection=geoEquirectangular().translate([320,122.5]).scale(490/(2*Math.PI)),path=geoPath(projection);
    const land=(world?.features||[]).map(f=>'<path d="'+path(f)+'" fill="#819d7b" stroke="#d0d9bf" stroke-width=".45"/>').join('');
    const names=[['太平洋',-142,1],['大西洋',-34,6],['印度洋',76,-26]].map(([name,lon,lat])=>{const [x,y]=projection([lon,lat]);return '<g><circle cx="'+x+'" cy="'+y+'" r="27" fill="#79c6e4" fill-opacity=".18" stroke="#9fdded" stroke-width="1.3"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle">'+name+'</text></g>';}).join('');
    return '<svg viewBox="0 0 640 245" role="img" aria-label="采用现有真实海岸线的海洋位置略图，太平洋、大西洋、印度洋彼此相连" class="environment-figure"><rect width="640" height="245" rx="12" fill="#244e66"/>'+land+names+'<text x="320" y="230" text-anchor="middle" class="env-small">蓝色是海洋；亮色是陆地。海域名称不是海水的边界。</text></svg>';
  }
  return `<svg viewBox="0 0 640 245" role="img" aria-label="${kind==='terrain'?'山地迎风抬升与背风对照':kind==='wind'?'水汽随空气从海洋向陆地输送':kind==='ocean'?'海洋与陆地之间的水分联系':'蒸发、凝结、降水与回流的水循环'}" class="environment-figure">
<defs><linearGradient id="env-sky" x2="0" y2="1"><stop stop-color="#183e54"/><stop offset="1" stop-color="#456b73"/></linearGradient><linearGradient id="env-water" x2="0" y2="1"><stop stop-color="#58b3cf"/><stop offset="1" stop-color="#235b79"/></linearGradient><linearGradient id="env-mountain" x2="1" y2="0"><stop stop-color="#729a70"/><stop offset=".5" stop-color="#9ca58a"/><stop offset="1" stop-color="#b79769"/></linearGradient><marker id="env-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="#f1dd9b"/></marker><marker id="env-blue-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10Z" fill="#a0d9ec"/></marker></defs>
<rect width="640" height="245" rx="12" fill="url(#env-sky)"/>
<g class="env-sun"><circle cx="67" cy="43" r="19" fill="#efd48b"/><path d="M67 12V4M67 75v8M36 43H28M99 43h9M45 21l-6-6M90 65l6 6M44 65l-6 6M90 21l6-6" stroke="#efd48b" stroke-width="3"/></g>
<path d="M0 186 Q75 178 150 187L217 190L244 180L268 178L327 134L380 61L436 134L465 167L510 177L640 183V245H0Z" fill="url(#env-mountain)"/>
<path d="M351 101L380 61L407 103L390 97L378 88L368 105Z" fill="#e4e6d6" opacity=".85"/>
<path d="M0 187Q70 180 130 188T230 188L215 245H0Z" fill="url(#env-water)"/>
<g class="env-sea"><path d="M14 205q18-8 36 0t36 0t36 0t36 0M3 225q21-8 42 0t42 0t42 0t42 0" stroke="#b2e0e7" stroke-width="2" fill="none"/><text x="85" y="235">海洋</text></g>
<g class="env-land"><path d="M244 188l10-30 10 30M268 181l11-34 11 34M288 168l11-31 11 31" fill="#285e4f"/><path d="M254 180v17M279 176v14M299 165v14" stroke="#243d33" stroke-width="4"/><text x="492" y="233">陆地与根区</text></g>
<g class="env-process env-vapour" data-process="vapour"><path d="M90 178C77 147 108 139 94 105M140 176C125 144 157 132 148 105" class="env-flow"/><circle cx="94" cy="156" r="4" fill="#b5e6ed" class="env-particle"/><text x="27" y="132">蒸发 ↑</text><text x="230" y="211" class="env-small">植物蒸腾 ↑</text></g>
<g class="env-process env-transport" data-process="transport"><path d="M150 118C200 105 231 100 275 91" class="env-flow"/><path d="M155 143C195 139 231 129 272 114" class="env-flow env-dashed"/><text x="153" y="76">风输送水汽 →</text></g>
<g class="env-process env-uplift" data-process="uplift"><path d="M266 135C289 102 315 69 347 53" class="env-flow"/><text x="246" y="38">迎风侧：抬升、冷却</text></g>
<g class="env-process env-cloud" data-process="cloud"><path d="M281 83C264 83 267 61 283 61C283 44 309 40 318 54C333 44 350 54 350 67C367 66 369 83 351 85Z" fill="#e0edf0"/><text x="283" y="103" class="env-small">满足条件可凝结</text></g>
<g class="env-process env-rain" data-process="rain"><path d="M285 109l-8 18M304 109l-8 18M324 109l-8 18M283 137l-8 18M303 137l-8 18" stroke="#9fdbf4" stroke-width="4" class="env-rainfall"/><text x="322" y="143" class="env-small">可能降雨</text></g>
<g class="env-process env-descent" data-process="contrast"><path d="M409 54C445 78 463 123 505 154" class="env-flow env-warm"/><path d="M531 169l8-18 8 18M558 179l8-17 8 17" fill="#c4aa75"/><text x="435" y="40">背风侧：下降、增温</text><text x="480" y="111">可能较干</text></g>
<g class="env-process env-return" data-process="return"><path d="M347 155C319 180 293 195 253 214L184 227" fill="none" stroke="#9fdbf4" stroke-width="4" marker-end="url(#env-blue-arrow)"/><path d="M488 224Q364 245 260 232" fill="none" stroke="#a0d9ec" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#env-blue-arrow)"/><text x="365" y="216" class="env-small">地表与地下回流</text></g>
<g class="env-process env-change" data-process="change"><path d="M467 78h101M564 91H467" class="env-flow"/><text x="461" y="145">风向随季节等变化</text></g>
</svg>`;}

export function createEnvironmentDemonstration({data,container=document.body,onSeek,onFollow,onLayout}={}){
  const root=el('section',null,'environment-demonstration');root.id='environment-demonstration';root.hidden=true;root.setAttribute('aria-label','随语音变化的环境过程图解');
  const header=el('header'),heading=el('strong'),count=el('span',null,'environment-count'),toggle=el('button','展开图解');toggle.type='button';toggle.setAttribute('aria-expanded','false');header.append(count,heading,toggle);
  const graphic=el('div',null,'environment-graphic'),steps=el('ol',null,'environment-steps'),summary=el('p',null,'environment-summary'),location=el('p',null,'environment-location'),scope=el('details',null,'environment-scope');scope.append(el('summary','原理示意与依据'));const scopeText=el('p');scope.append(scopeText);
  const controls=el('nav',null,'environment-controls');controls.setAttribute('aria-label','环境演示逐幕回看');
  const previous=el('button','上一幕'),follow=el('button','跟随中'),next=el('button','下一幕');for(const b of [previous,follow,next])b.type='button';controls.append(previous,follow,next);const body=el('div',null,'environment-body'),cue=el('p',null,'environment-current-note');body.append(graphic,steps,summary,location,scope);root.append(header,cue,body,controls);container.append(root);
  let current=null,model=null,sequence=[],index=0,playing=false,following=true,time=0,collapsed=true,frame=0,destroyed=false,figureKind=null,figureKey=null,lastLayout='';
  const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  function motion(){const animated=!!model&&playing&&following&&!reduced.matches&&!document.hidden;root.dataset.animated=String(animated);root.style.setProperty('--environment-motion-state',animated?'running':'paused');return animated;}
  function setScenes(value,selected=0){sequence=Array.isArray(value)?value:[];index=Math.max(0,selected||0);updateControls();}
  function updateControls(){previous.disabled=!onSeek||index<=0;next.disabled=!onSeek||index>=sequence.length-1;follow.setAttribute('aria-pressed',String(following));follow.textContent=following?'跟随中':'回到讲解';count.textContent='原理图解 · '+(index+1)+' / '+Math.max(sequence.length,1)+' 幕';}
  previous.onclick=()=>onSeek?.(index-1,sequence[index-1]);next.onclick=()=>onSeek?.(index+1,sequence[index+1]);follow.onclick=()=>onFollow?.(!following);
  function applyDetailChoice(){root.dataset.collapsed=String(collapsed);toggle.textContent=collapsed?'展开图解':'收起图解';toggle.setAttribute('aria-expanded',String(!collapsed));document.body.classList.toggle('is-environment-detail-open',!!model&&!collapsed);}
  toggle.onclick=()=>{collapsed=!collapsed;applyDetailChoice();relayout();};
  function setScene(scene,options={}){
    const resolved=resolveEnvironmentDemonstration(scene);if(!resolved){clear();return false;}
    const changed=current?.id!==scene.id;current=scene;model=resolved;playing=options.playing===true;following=options.following!==false;time=Number.isFinite(options.currentTime)?Math.max(0,options.currentTime):time;
    const key=model.kind+(model.kind==='ocean'&&model.phase==='basins'?'-basins':'');
    if(figureKey!==key){graphic.innerHTML=diagram(model.kind,model.phase,data?.world);figureKind=model.kind;figureKey=key;}
    root.hidden=false;root.dataset.kind=model.kind;root.dataset.phase=model.phase;root.dataset.step=String(model.activeStep);document.body.classList.add('has-environment-demonstration');applyDetailChoice();
    if(changed){heading.textContent=model.title;heading.title=model.title;cue.textContent=scene.lookAt||model.steps[model.activeStep]?.label||'跟着球上的标注观察；需要原理图时再展开。';summary.textContent=model.summary;location.textContent='地图定位：'+(model.focus?.label||'本章教学地区')+(model.kind==='ocean'&&model.phase==='basins'?' · 海洋略图采用同一份真实海岸线':' · 图内左右仅表示过程方向');scopeText.textContent=model.scopeNote;for(const a of [...scope.querySelectorAll('a')])a.remove();for(const source of model.sourceLinks){const a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';scope.append(a);}steps.replaceChildren();model.steps.forEach((s,i)=>{const item=el('li',s.label);item.dataset.active=String(i===model.activeStep);if(i===model.activeStep)item.setAttribute('aria-current','step');steps.append(item);});}
    // The lesson scene follows the recording clock. Particle flow is an
    // illustrative loop, not word alignment or weather/wind measurements.
    root.style.setProperty('--environment-audio-offset',(-time%3)+'s');updateControls();motion();relayout();return true;
  }
  function layout(){
    frame=0;if(!model||destroyed)return;const width=innerWidth,height=innerHeight,visible=selector=>{const e=document.querySelector(selector);if(!e||e.hidden||e.getClientRects().length===0)return null;return e.getBoundingClientRect();};
    // In a lesson, the current scene belongs beside its live caption. Moving
    // this view never replaces or seeks the persistent audio element.
    const playerHost=document.body.classList.contains('is-learning')&&collapsed?document.querySelector('#imm-player'):null;
    const docked=!!playerHost;root.dataset.docked=String(docked);
    if(root.parentElement!==(playerHost||container)){const active=document.activeElement,restoreFocus=root.contains(active);(playerHost||container).prepend(root);if(restoreFocus)active.focus?.({preventScroll:true});}
    if(docked){for(const property of ['top','right','width','maxHeight'])root.style[property]='';if(lastLayout!=='docked'){lastLayout='docked';onLayout?.();}return;}
    const headerRect=visible('.learn-header')||visible('.imm-header'),view=visible('#learning-map-view-controls'),panel=visible('.learn-panel'),player=visible('#imm-player'),learning=document.querySelector('.learning-journey'),closed=learning?.classList.contains('learn-collapsed');
    const floor=Math.min(height-12,player?.top||height-130)-10;let top=Math.max((headerRect?.bottom||80)+8,(view?.bottom||0)+8,closed?(panel?.bottom||0)+8:0);let right=26,panelWidth;
    const stacked=width<=1000;root.dataset.stacked=String(stacked);
    if(collapsed){
      right=stacked?12:26;if(panel&&!closed&&!stacked)right=Math.max(26,width-panel.left+14);
      panelWidth=Math.min(342,Math.max(240,width-right-24));top=Math.max(top,floor-132);root.style.maxHeight=Math.max(104,floor-top)+'px';
    }else if(stacked){right=12;panelWidth=width-24;const target=Math.min(300,Math.max(220,(floor-top)*.56));top=Math.max(top,floor-target);root.style.maxHeight=Math.max(130,floor-top)+'px';}
    else{if(panel&&!closed)right=Math.max(26,width-panel.left+14);panelWidth=Math.min(470,Math.max(320,(width-right-44)*.43));root.style.maxHeight=Math.max(175,floor-top)+'px';}
    root.style.right=right+'px';root.style.width=panelWidth+'px';root.style.top=top+'px';
    document.body.style.setProperty('--environment-demo-map-right',(right+panelWidth+14)+'px');document.body.style.setProperty('--environment-demo-top',top+'px');
    const signature=[top,right,panelWidth,collapsed,stacked].join(':');if(signature!==lastLayout){lastLayout=signature;onLayout?.();}
  }
  function relayout(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(layout);}
  function getInsets(base={}){if(!model||root.dataset.docked==='true')return base;if(collapsed){if(innerWidth<=1000)return {...base,bottom:Math.max(base.bottom||0,innerHeight-parseFloat(root.style.top||innerHeight-160)+12)};return {...base,right:Math.max(base.right||0,parseFloat(root.style.right||26)+parseFloat(root.style.width||342)+16)};}const collapsedLesson=document.querySelector('.learning-journey')?.classList.contains('learn-collapsed'),panel=document.querySelector('.learn-panel')?.getBoundingClientRect(),top=collapsedLesson?Math.max(base.top||0,(panel?.bottom||0)+10):base.top;if(innerWidth<=1000)return {...base,top,bottom:collapsedLesson?innerHeight-parseFloat(root.style.top||innerHeight-320)+12:Math.max(base.bottom||0,innerHeight-parseFloat(root.style.top||innerHeight-320)+12)};return {...base,top,right:Math.max(base.right||0,parseFloat(root.style.right||26)+parseFloat(root.style.width||430)+20)};}
  function clear(){model=null;current=null;playing=false;root.hidden=true;root.dataset.animated='false';root.style.setProperty('--environment-motion-state','paused');document.body.classList.remove('has-environment-demonstration','is-environment-detail-open');}
  const visibility=()=>motion();window.addEventListener('resize',relayout);document.addEventListener('visibilitychange',visibility);reduced.addEventListener?.('change',visibility);
  return {setScenes,setScene,clear,relayout,getInsets,getState:()=>({enabled:!!model,kind:model?.kind||null,phase:model?.phase||null,activeStep:model?.activeStep??null,playing,following,animated:motion(),currentTime:time,collapsed,stepIndex:index,figureKind}),destroy(){if(destroyed)return;destroyed=true;clear();if(frame)cancelAnimationFrame(frame);window.removeEventListener('resize',relayout);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener?.('change',visibility);root.remove();}};
}
