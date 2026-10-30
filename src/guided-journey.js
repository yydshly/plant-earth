import {GUIDED_STAGES,createGuidedJourneyState} from './guided-journey-model.js';
import {isAutoContinueEnabled,setAutoContinueEnabled,subscribeAutoContinue} from './playback-preferences.js';

export {GUIDED_STAGES} from './guided-journey-model.js';
export const GUIDED_JOURNEY_STORAGE='plant-earth-guided-v1';

const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;if(className)node.className=className;return node;};
const stageFor=id=>GUIDED_STAGES.find(row=>row.id===id)||GUIDED_STAGES[0];

// The shell owns only the total route. Existing lessons own their audio, maps,
// answers and local cursor, which the host reports here without navigation.
export function createGuidedJourney({container=document.body,onNavigate,onExplore,onPause,onLayout,getReview,initialProgress,onStartVoice,onResumeVoice,onHomeDismiss,onRegionalExplore,regionalCount=25,onOpenDirectory}={}){
  let saved={};try{saved=JSON.parse(localStorage.getItem(GUIDED_JOURNEY_STORAGE)||'{}');}catch{}
  let model=createGuidedJourneyState(saved);
  if(!model.getState().hasResume&&initialProgress)model=createGuidedJourneyState(initialProgress);
  let mode='hidden',switching=false,pickerOpen=false,layoutFrame=0,lastLayout='',lastSaved='',homeOptions={};
  const isolated=new Map();
  const root=element('div',null,'guided-journey-shell');root.dataset.guidedJourney='';container.append(root);
  const bar=element('nav',null,'guided-route-bar');bar.setAttribute('aria-label','总学习路线');bar.hidden=true;
  const overlay=element('section',null,'guided-journey-overlay');overlay.hidden=true;
  root.append(bar,overlay);
  function button(label,action,className=''){const b=element('button',label,className);b.type='button';b.addEventListener('click',action);return b;}
  const current=element('div',null,'guided-route-current');
  const phase=element('strong'),position=element('span');current.append(phase,position);
  const stages=element('div',null,'guided-route-stages');
  const stageButtons=GUIDED_STAGES.map((stage,index)=>{const b=button(`${index+1} ${stage.title}`,()=>navigate(stage.id));b.dataset.stage=stage.id;stages.append(b);return b;});
  const controls=element('div',null,'guided-route-controls');
  const previousButton=button('上一阶段',()=>previous(),'guided-route-previous');
  const nextButton=button('下一阶段',()=>next(),'guided-route-next');
  const pickerButton=button('切换阶段',()=>{pickerOpen=!pickerOpen;updateBar();},'guided-route-picker');pickerButton.setAttribute('aria-expanded','false');
  const homeButton=button('学习起点',()=>showHome(),'guided-route-home');homeButton.setAttribute('aria-label','学习起点');
  const collapseButton=button('收起路线',()=>{model.setCollapsed(!model.getState().collapsed);pickerOpen=false;persist();updateBar();applyLayout();},'guided-route-collapse');
  controls.append(previousButton,nextButton,pickerButton,homeButton,collapseButton);
  const routeNote=element('span','浏览阶段不代表掌握','guided-route-note');bar.append(current,stages,controls,routeNote);

  function persist(){const json=JSON.stringify(model.snapshot());if(json===lastSaved)return;lastSaved=json;try{localStorage.setItem(GUIDED_JOURNEY_STORAGE,json);}catch{}}
  function applyLayout(){
    const active=mode==='active'||mode==='review',state=model.getState();
    // An overlay must also block keyboard focus into the covered map controls.
    // Preserve an existing inert state rather than changing the host's policy.
    if(mode==='home'){
      for(const sibling of container.children){if(sibling===root)continue;if(!isolated.has(sibling))isolated.set(sibling,sibling.inert);sibling.inert=true;}
    }else{for(const [sibling,wasInert] of isolated)sibling.inert=wasInert;isolated.clear();}
    document.body.classList.toggle('is-guided-journey',active);
    document.body.classList.toggle('is-guided-home',mode==='home');
    document.body.classList.toggle('is-guided-review',mode==='review');
    document.body.classList.toggle('is-guided-route-collapsed',active&&state.collapsed);
    const offset=active?(state.collapsed?36:56):0;
    document.body.style.setProperty('--journey-top-offset',`${offset}px`);
    const signature=`${mode}:${offset}`;
    if(signature!==lastLayout){lastLayout=signature;if(layoutFrame)cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;onLayout?.();});}
  }
  function updateBar(){
    const state=model.getState(),index=GUIDED_STAGES.findIndex(row=>row.id===state.stage),stage=stageFor(state.stage);
    bar.hidden=mode!=='active'&&mode!=='review';
    bar.classList.toggle('is-collapsed',state.collapsed);bar.classList.toggle('is-picker-open',pickerOpen);
    phase.textContent=`阶段 ${index+1} / ${GUIDED_STAGES.length} · ${stage.title}`;
    position.textContent=state.location.label||state.location.summary||stage.short;
    previousButton.disabled=index<=0;nextButton.disabled=index>=GUIDED_STAGES.length-1;
    collapseButton.textContent=state.collapsed?'展开路线':'收起路线';collapseButton.setAttribute('aria-label',collapseButton.textContent);collapseButton.setAttribute('aria-expanded',String(!state.collapsed));
    pickerButton.setAttribute('aria-expanded',String(pickerOpen));
    stageButtons.forEach((b,i)=>{if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');b.classList.toggle('was-visited',state.visited.includes(GUIDED_STAGES[i].id));});
  }
  function pause(){onPause?.();model.pause();}
  function focusTitle(){overlay.querySelector('h1,h2')?.focus({preventScroll:true});}
  function makePanel(eyebrow,title,lead){
    const panel=element('div',null,'guided-journey-panel');
    panel.append(element('p',eyebrow,'guided-journey-eyebrow'));
    const heading=element('h1',title);heading.tabIndex=-1;panel.append(heading,element('p',lead,'guided-journey-lead'));
    return panel;
  }
  function homeContent(){
    const state=model.getState(),stage=stageFor(state.stage);
    const panel=makePanel('植物地球 · 成人通识与自主查阅','植物为什么分布在这些地方？','从一个具体问题出发，在地球上找地区、认植物，再把环境证据与生长需要联系起来。看完应能解释差异，并知道哪些判断还需要资料。');
    const questions=element('div',null,'guided-question-paths');questions.setAttribute('aria-label','按问题开始观看');
    for(const item of [
      {title:'同样是主食，稻、麦、玉米为何不同？',note:'籽粒与生长季 → 水稻真实地图 → 回顾差异。',location:{courseScope:'agriculture',view:'lesson',classId:'grains',pathId:'staples',cropId:'rice',step:0,questionPath:'grains'}},
      {title:'银杏到处可见，地图为何还分原生与引入？',note:'种子与环境 → 银杏原生与引入地图 → 回顾记录含义。',location:{courseScope:'biodiversity',view:'lesson',cropId:'ginkgo',pathId:'seed-lineages',step:0,questionPath:'ginkgo'}}
    ]){const b=button('',()=>{navigate('classes',item.location);onStartVoice?.();},'guided-question-path');b.append(element('small','选一个问题，进入并播放'),element('strong',item.title),element('span',item.note));questions.append(b);}panel.append(questions);
    const how=element('ol',null,'guided-how-to');
    ['找位置：球上认国家和地区；展开地图比较全球布局。','看解释：跟随当前植物与标注，抓住每段的问题和结论。','做对照：比较季节、根区和水源；回顾时整理自己的解释。'].forEach(t=>how.append(element('li',t)));panel.append(how);
    const goals=element('ul',null,'guided-journey-goals');
    ['能指出讨论的是哪个地区','能解释一种植物的环境限制','能区分事实、解释与尚待核实的条件'].forEach(text=>goals.append(element('li',text)));panel.append(goals);
    const actions=element('div',null,'guided-home-actions');
    const startButton=button('',()=>{start();onStartVoice?.();},'guided-home-action');startButton.append(element('strong','需要地理基础'),element('span','从海陆、纬度和水循环听起；各阶段随时可跳转。'));
    const resumeButton=button('',()=>{resume();onResumeVoice?.();},'guided-home-action'+(state.hasResume?' is-primary':''));resumeButton.disabled=!state.hasResume;
    resumeButton.append(element('strong','继续学习'),element('span',state.hasResume?`${stage.title}${state.location.label?' · '+state.location.label:''} · ${state.stage==='review'?'整理解释':'继续讲解'}`:'首次进入，还没有保存的学习位置。'));
    const exploreButton=button('',()=>explore(),'guided-home-action');exploreButton.append(element('strong','自由查找'),element('span','直接浏览植物与地区，学习位置会保留。'));
    actions.append(resumeButton,exploreButton,startButton);panel.append(actions);
    if(onOpenDirectory){const entry=button('',()=>onOpenDirectory(),'guided-directory-entry');entry.append(element('strong','按模块查阅全部课程'),element('span','7 个模块 · 直接选课程、植物或地区，打开课程可静音进入。'));panel.append(entry);}
    if(onRegionalExplore){const entry=button('',()=>{pauseForExplore();onRegionalExplore();},'guided-region-entry');entry.append(element('strong',`全球地区课 · ${regionalCount} 个地区`),element('span','按大洲、环境或植物查找，听气候、土壤、水源怎样影响分布。'));panel.append(entry);}
    if(homeOptions.preserveView)panel.append(button('返回刚才的页面，先自己看看',()=>pauseForExplore(),'guided-return-current'));
    const listen=element('label',null,'guided-listen-option'),checkbox=element('input');checkbox.type='checkbox';checkbox.checked=isAutoContinueEnabled();checkbox.setAttribute('aria-label','连续听讲，题目稍后回顾');checkbox.onchange=()=>setAutoContinueEnabled(checkbox.checked);listen.append(checkbox,element('span','连续听讲：讲完自动下一课；判断题保留到回顾，可随时暂停作答。'));panel.append(listen);
    const route=element('ol',null,'guided-home-route');
    GUIDED_STAGES.forEach((row,index)=>{const li=element('li');const b=button('',()=>navigate(row.id));b.append(element('span',String(index+1),'guided-home-step'),element('strong',row.title),element('span',row.goal));li.append(b);route.append(li);});
    panel.append(route);
    const coverage=element('details',null,'guided-coverage');coverage.append(element('summary','现在支持什么？信息覆盖到哪里？'));
    coverage.append(element('p',`图鉴有${globalThis.ATLAS_DATA.catalogue.entryCount}个代表条目：${globalThis.ATLAS_DATA.catalogue.agricultureCount}个农业与园艺条目按13类学习，其他${globalThis.ATLAS_DATA.catalogue.biodiversityCount}个植物各有完整课程。真实环境证据连接${regionalCount}个地区案例，地区课堂按气候、土壤和水源逐步解释。`));
    coverage.append(element('p','农业统计覆盖92个条目，原生与引入资料覆盖137个条目；每个条目都有环境说明。地区气候和土壤包含网格模型，水源资料包含卫星与生境记录，来源和尺度分别标明。'));
    coverage.append(element('p','这些资料帮助理解分布与环境关系；全球逐地实测、所有物种与全部品种还未覆盖。'));
    panel.append(coverage,element('p','各阶段可以自由切换。“看过”、作答结果和独立解释分别记录；浏览路线不等于已经学会。','guided-journey-disclaimer'));
    return panel;
  }
  function renderReview(){
    overlay.replaceChildren();overlay.className='guided-journey-overlay guided-review-overlay';
    overlay.setAttribute('aria-label','综合回顾');overlay.hidden=false;
    const panel=makePanel('阶段 5 / 5 · 综合回顾','这次能解释什么？','先回到最近打开的主题，联系地区、植物与环境证据；再用自己的话整理解释。浏览和作答记录保留在后面。');panel.classList.add('guided-review-panel');
    const expand=button('扩大回顾阅读',()=>{const large=panel.classList.toggle('review-reading-expanded');expand.textContent=large?'收小，继续看球':'扩大回顾阅读';expand.setAttribute('aria-expanded',String(large));onLayout?.();},'guided-review-expand');expand.setAttribute('aria-expanded','false');panel.prepend(expand);
    const content=element('div',null,'guided-review-content'),review=getReview?.();
    if(review&&typeof review.nodeType==='number')content.append(review);
    else content.append(element('p','沿上方路线回到任何阶段，重新观察，再回到这里整理你的理解。'));
    panel.append(content);
    const actions=element('div',null,'guided-review-actions');actions.append(button('继续自由查找',()=>explore(),'guided-primary'),button('返回学习起点',()=>showHome()));panel.append(actions);
    overlay.append(panel);overlay.scrollTop=0;focusTitle();onLayout?.();
  }
  function performNavigation(action,{fresh=false}={}){
    if(switching)return null;
    switching=true;
    try{
      const target=action();if(!target)return null;
      if(mode==='home')onHomeDismiss?.();
      onPause?.();pickerOpen=false;mode=target.stage==='review'?'review':'active';persist();
      overlay.hidden=true;overlay.replaceChildren();updateBar();applyLayout();
      onNavigate?.(target.stage,{location:target.location,fresh});
      if(mode==='review')renderReview();
      return target;
    }finally{switching=false;}
  }
  function showHome(options={}){
    homeOptions={preserveView:options?.preserveView===true};
    switching=true;try{pause();}finally{switching=false;}
    mode='home';pickerOpen=false;overlay.className='guided-journey-overlay guided-home-overlay';overlay.setAttribute('aria-label','学习起点');overlay.replaceChildren(homeContent());overlay.hidden=false;overlay.scrollTop=0;updateBar();applyLayout();focusTitle();
  }
  function pauseForExplore(){
    if(mode==='home')onHomeDismiss?.();
    switching=true;try{pause();}finally{switching=false;}
    mode='hidden';pickerOpen=false;overlay.hidden=true;overlay.replaceChildren();updateBar();applyLayout();
  }
  function explore(){pauseForExplore();onExplore?.();}
  function start(){return performNavigation(()=>model.start(),{fresh:true});}
  function resume(){return performNavigation(()=>model.resume());}
  function navigate(stage,location){return performNavigation(()=>model.navigate(stage,location),{fresh:location===undefined});}
  function next(){return performNavigation(()=>model.move(1),{fresh:true});}
  function previous(){return performNavigation(()=>model.move(-1),{fresh:true});}
  function report(input){
    if(switching||!model.report(input))return false;
    persist();updateBar();return true;
  }
  // Creation is deliberately passive: the host decides whether this URL opens
  // the learning start screen or a requested map. Reload never starts audio.
  applyLayout();
  const unsubscribe=subscribeAutoContinue(()=>{const control=overlay.querySelector('input[aria-label="连续听讲，题目稍后回顾"]');if(control)control.checked=isAutoContinueEnabled();});
  return {showHome,start,resume,navigate,next,previous,report,pauseForExplore,
    showReview:()=>navigate('review'),isActive:()=>model.getState().active,getState:()=>model.getState(),
    destroy(){pauseForExplore();unsubscribe?.();if(layoutFrame)cancelAnimationFrame(layoutFrame);root.remove();}
  };
}
