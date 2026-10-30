import {LEARNING_STOPS,LEARNING_INTRO} from './learning-content.js';
import {planLearningContinuation} from './learning-continuation.js';
import {isAutoContinueEnabled,setAutoContinueEnabled,subscribeAutoContinue} from './playback-preferences.js';
import {renderMiniaturePreview} from './plant-miniatures.js';
import {FOUNDATION_STEPS} from './foundation-content.js';
import {renderFoundationView} from './foundation-view.js';
import {renderApplicationView,getApplicationContext,getApplicationProgress,explainEnvironment} from './learning-application.js';

const STORAGE_KEY='plant-earth-learning-v2',ROUTE_KEY='plant-earth-route-v1';
const STAGES=[
  {id:'foundation',label:'1 地球基础',title:'认识地球与环境',question:'我在哪里？阳光和水怎样影响环境？'},
  {id:'environments',label:'2 环境植物',title:'六种环境与代表植物',question:'同一片环境里，植物怎样生活？'},
  {id:'crops',label:'3 主粮应用',title:'用三大主粮做比较',question:'用同一套问题比较水稻、小麦和玉米。'},
  {id:'transfer',label:'4 自己解释',title:'面对新地区，试着解释',question:'先预测、选依据，再写出自己的解释。'},
  {id:'complete',label:'5 回顾探索',title:'回顾与自由探索',question:'看过、作答和能独立解释，是不同的进步。'}
];
const VIEW_NAMES={environment:'看环境',plants:'认植物',question:'想一想'};
const VALID_STAGES=new Set(['foundation','bridge','environments','crops','transfer','complete']);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}};
const clamp=(value,max)=>Number.isInteger(value)?Math.max(0,Math.min(max,value)):0;

export function createLearningJourney(api){
  const {data,crops,distribution}=api,legacy=read(STORAGE_KEY),saved=read(ROUTE_KEY),oldFoundation=read('plant-earth-foundation-v1');
  const stopIds=new Set(LEARNING_STOPS.map(s=>s.id));
  let enabled=false,stage='home',resumeStage=VALID_STAGES.has(saved.stage)?saved.stage:null;
  let index=Number.isInteger(saved.index)?clamp(saved.index,LEARNING_STOPS.length-1):Math.max(0,LEARNING_STOPS.findIndex(s=>s.id===legacy.stopId));
  let foundationIndex=clamp(saved.foundationIndex??oldFoundation.index,FOUNDATION_STEPS.length-1);
  let view=Object.hasOwn(VIEW_NAMES,saved.view)?saved.view:'environment';
  let selectedPlantId=crops.has(saved.selectedPlantId)?saved.selectedPlantId:null,mediaMode='photo',chainIndex=0,lastFocus=null;
  const visited=new Set((Array.isArray(legacy.visited)?legacy.visited:[]).filter(id=>stopIds.has(id)));
  const foundationViewed=new Set((Array.isArray(saved.foundationViewed)?saved.foundationViewed:[]).filter(id=>FOUNDATION_STEPS.some(s=>s.id===id)));
  const viewed=saved.viewed&&typeof saved.viewed==='object'?saved.viewed:{};
  const answers={};
  for(const [id,value] of Object.entries(legacy.answers||{})){const s=LEARNING_STOPS.find(s=>s.id===id);if(s&&Number.isInteger(value)&&value>=0&&value<s.question.options.length)answers[id]=value;}
  const applicationState=saved.applicationState&&typeof saved.applicationState==='object'?saved.applicationState:{};
  const foundationState={};let narrationWatch=null;
  if(!resumeStage&&(visited.size||Object.keys(answers).length))resumeStage='environments';
  if(!resumeStage&&Number.isInteger(oldFoundation.index))resumeStage='foundation';
  const photos=new Map((data.plantPhotos?.photos||[]).map(p=>[p.cropId,p]));
  const profiles=new Map((data.environment?.profiles||[]).map(p=>[p.id,p]));
  const placements=data.placements?.placements||[];
  const entry=el('button',null,'learn-entry');entry.id='learn-start';
  entry.innerHTML='<strong>学习路线 · 看懂地球与植物</strong><span>继续上次，或从地球基础开始</span>';
  document.querySelector('#distribution-ui .dist-toolbar')?.append(entry);
  const host=el('section',null,'learning-journey');host.id='learning-journey';host.hidden=true;host.setAttribute('aria-label','看懂地球与植物学习路线');
  host.innerHTML='<header class="learn-header"><div><p class="learn-eyebrow" id="learn-route-position">学习路线 · 五个阶段</p><h1>看懂地球与植物</h1></div><div class="learn-header-actions"><button id="learn-route-home">学习路线</button><button id="learn-close">自由探索</button></div><nav id="learn-stops" aria-label="学习阶段"></nav><details id="learn-step-menu" class="learn-step-menu" hidden><summary id="learn-step-summary">本段目录</summary><div id="learn-step-links"></div></details></header><aside class="learn-panel" aria-label="当前学习内容"><div class="learn-panel-heading"><div><p id="learn-position" class="learn-eyebrow"></p><h2 id="learn-title" tabindex="-1"></h2></div><button id="learn-collapse" aria-expanded="true" aria-controls="learn-content">收起看地球</button></div><div id="learn-content"><p id="learn-summary" class="learn-summary"></p><div class="learn-tabs" role="tablist" aria-label="本站学习内容"><button id="learn-tab-environment" data-learn-view="environment" role="tab" aria-selected="true" aria-controls="learn-view">看环境</button><button id="learn-tab-plants" data-learn-view="plants" role="tab" aria-selected="false" aria-controls="learn-view">认植物</button><button id="learn-tab-question" data-learn-view="question" role="tab" aria-selected="false" aria-controls="learn-view">想一想</button></div><div id="learn-view" role="tabpanel" aria-labelledby="learn-title"></div></div><footer class="learn-footer"><p id="learn-progress"></p><div><button id="learn-prev">上一步</button><button id="learn-next" class="learn-primary">下一步</button></div><button id="learn-skip" class="learn-skip" hidden>暂跳本站 →</button></footer></aside>';
  document.body.append(host);const $=id=>document.getElementById(id),current=()=>LEARNING_STOPS[index];
  const globeActions=el('nav',null,'learning-globe-actions');globeActions.id='learning-globe-actions';globeActions.hidden=true;globeActions.setAttribute('aria-label','球面课程快捷控制');host.querySelector('.learn-panel-heading').insertBefore(globeActions,$('learn-collapse'));
  function renderGlobeActions(){globeActions.replaceChildren();globeActions.hidden=!['foundation','environments'].includes(stage);if(globeActions.hidden)return;const add=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=fn;globeActions.append(b);return b;};if(stage==='environments'){for(const [id,label] of [['environment','看环境'],['plants','认植物'],['question','想一想']]){const b=add(label,()=>{setView(id);setCollapsed(id!=='question');});b.setAttribute('aria-pressed',String(view===id));}}add(stage==='foundation'?'上一课':'上一站',()=>stage==='foundation'?back():goTo(Math.max(0,index-1)));add(stage==='foundation'?'下一课':'下一站',()=>stage==='foundation'?advance():index<LEARNING_STOPS.length-1?goTo(index+1):advance());}
  const continuousControl=el('label',null,'learn-auto-control'),continuousCheck=el('input');continuousCheck.type='checkbox';continuousCheck.id='learn-auto-continue';continuousCheck.checked=isAutoContinueEnabled();continuousControl.append(continuousCheck,document.createTextNode('连续听讲（判断题稍后回顾）'));
  const continuousStatus=el('p',null,'learn-auto-status');continuousStatus.id='learn-auto-status';continuousStatus.setAttribute('role','status');continuousStatus.setAttribute('aria-live','polite');
  host.querySelector('.learn-footer').append(continuousControl,continuousStatus);
  function updateContinuousStatus(message=''){continuousCheck.checked=isAutoContinueEnabled();continuousStatus.textContent=message||(continuousCheck.checked?'点击播放后，讲解会接着下一段；未答的题目保留到回顾。':'自动衔接已关闭，讲完本段会停下。');}
  continuousCheck.onchange=()=>setAutoContinueEnabled(continuousCheck.checked);
  subscribeAutoContinue(()=>updateContinuousStatus());updateContinuousStatus();

  const countCorrect=()=>LEARNING_STOPS.filter(s=>answers[s.id]===s.question.correctIndex).length;
  const countAnswered=()=>LEARNING_STOPS.filter(s=>Object.hasOwn(answers,s.id)).length;
  function save(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({stopId:current().id,visited:[...visited],answers}));}catch{}
    try{localStorage.setItem(ROUTE_KEY,JSON.stringify({version:1,stage:resumeStage,foundationIndex,index,view,selectedPlantId,foundationViewed:[...foundationViewed],viewed,applicationState}));}catch{}
  }
  function remember(){if(VALID_STAGES.has(stage))resumeStage=stage;save();api.onProgress?.({stage,index,view,foundationIndex,selectedPlantId});}
  function nextStageLabel(id,fallback){const text=api.getStageNextLabel?.(id);return typeof text==='string'&&text.trim()?text:fallback;}
  function resetScroll(){$('learn-view').scrollTop=0;host.querySelector('.learn-panel').scrollTop=0;}
  function setCollapsed(value){host.classList.toggle('learn-collapsed',value);$('learn-collapse').setAttribute('aria-expanded',String(!value));$('learn-collapse').textContent=value?'展开解释':'收起看地球';api.requestDraw?.();api.onLayout?.();}
  function beginNarrationWatch(){
    if(!enabled||narrationWatch)return;
    narrationWatch={collapsed:host.classList.contains('learn-collapsed'),changed:false};setCollapsed(true);
  }
  function endNarrationWatch(){
    if(!narrationWatch)return;const previous=narrationWatch;narrationWatch=null;if(!previous.changed)setCollapsed(previous.collapsed);
  }
  function routeNumber(){return stage==='foundation'?1:['bridge','environments'].includes(stage)?2:stage==='crops'?3:stage==='transfer'?4:stage==='complete'?5:0;}
  function renderNav(){
    const number=routeNumber();$('learn-route-position').textContent=number?'总路线 · 阶段 '+number+' / 5 · '+STAGES[number-1].title:'学习路线 · 五个阶段';
    const nav=$('learn-stops');nav.replaceChildren();for(const row of STAGES){const b=el('button',row.label);b.dataset.routeStage=row.id;b.setAttribute('aria-current',number===STAGES.indexOf(row)+1?'step':'false');b.onclick=()=>jumpStage(row.id);nav.append(b);}
    const menu=$('learn-step-menu'),links=$('learn-step-links');menu.open=false;links.replaceChildren();menu.hidden=!['foundation','environments'].includes(stage);
    if(stage==='foundation'){
      const names=['海陆','赤道','阳光','下雨','森林','雨林','对照'];$('learn-step-summary').textContent='基础 '+(foundationIndex+1)+' / 7 · 查看本段目录';
      FOUNDATION_STEPS.forEach((s,i)=>{const b=el('button',(i+1)+' '+names[i]);b.dataset.foundationStep=String(i);b.setAttribute('aria-current',i===foundationIndex?'step':'false');b.onclick=()=>goFoundation(i);links.append(b);});
    }else if(stage==='environments'){
      $('learn-step-summary').textContent='环境 '+(index+1)+' / 6 · 查看本段目录';
      LEARNING_STOPS.forEach((s,i)=>{const b=el('button',(i+1)+' '+s.title);b.dataset.stop=String(i);b.setAttribute('aria-current',i===index?'step':'false');b.onclick=()=>goTo(i);links.append(b);});
    }
  }
  function shell(next,title,position,summary){
    stage=next;host.dataset.stage=stage;host.dataset.view=stage;host.classList.remove('learn-foundation','learn-overview','learn-complete');
    if(stage==='foundation')host.classList.add('learn-foundation');if(['home','bridge'].includes(stage))host.classList.add('learn-overview');if(stage==='complete')host.classList.add('learn-complete');
    $('learn-title').textContent=title;$('learn-position').textContent=position;$('learn-summary').textContent=summary||'';
    $('learn-collapse').hidden=false;$('learn-content').hidden=false;$('learn-prev').hidden=false;$('learn-skip').hidden=true;$('learn-view').replaceChildren();$('learn-view').classList.remove('learn-application');$('learn-view').setAttribute('aria-labelledby','learn-title');
    setCollapsed(['foundation','environments'].includes(next));renderNav();renderGlobeActions();resetScroll();
  }
  function layout({focus=false}={}){api.onLayout?.();api.requestDraw?.();if(focus)$('learn-title').focus({preventScroll:true});}
  function pause(){updateContinuousStatus();api.onPause?.();}
  function readingContext(mode,title,summary,extra={}){api.onLessonContext?.({mode,title,summary,...extra});}
  function resumeDescription(){
    if(resumeStage==='foundation')return '地球基础 · '+(foundationIndex+1)+' / 7 · '+FOUNDATION_STEPS[foundationIndex].title;
    if(resumeStage==='environments')return '环境 '+(index+1)+' / 6 · '+current().title+' · '+VIEW_NAMES[view];
    return {bridge:'六站开始前的连接',crops:'三大主粮应用比较',transfer:'新地区预测与解释',complete:'学习回顾'}[resumeStage]||'尚未开始';
  }
  function renderHome(){
    pause();shell('home','先选一条清楚的学习起点','路线首页','先知道位置，再理解环境，最后用植物解释一个新地方。');
    const box=$('learn-view'),resume=el('button',resumeStage?'继续上次：'+resumeDescription():'还没有上次进度','learn-route-resume');resume.id='learn-resume';resume.disabled=!resumeStage;resume.onclick=()=>resumeRoute();
    const beginning=el('button','从头开始 · 保留已有记录','learn-primary');beginning.id='learn-start-from-beginning';beginning.onclick=()=>goFoundation(0);box.append(resume,beginning);
    const route=el('ol',null,'learn-route-map');for(const row of STAGES){const li=el('li'),b=el('button',row.title);b.dataset.routeCard=row.id;b.onclick=()=>jumpStage(row.id);li.append(b,el('p',row.question));route.append(li);}box.append(route,el('p','进入过页面、做过判断、能独立解释，是三件不同的事。可以跳过内容，也可以随时回来。','learn-route-note'));
    $('learn-prev').hidden=true;$('learn-next').textContent=resumeStage?'继续上次 →':'从地球基础开始 →';$('learn-progress').textContent=resumeStage?'上次停在：'+resumeDescription():'路线按基础、观察、应用和解释展开。';
    readingContext('route','学习路线','先选择继续上次，或从地球基础开始。',{lon:105,lat:28});layout();
  }
  function resumeRoute(){const target=resumeStage||'foundation';if(target==='foundation')goFoundation(foundationIndex);else if(target==='environments')goTo(index,{initialView:view,plantId:selectedPlantId});else if(target==='bridge')renderBridge();else if(target==='complete')finish();else goApplication(target);}
  function jumpStage(target){if(target==='foundation')goFoundation(foundationIndex);else if(target==='environments')renderBridge();else if(target==='complete')finish();else goApplication(target);}
  function renderFoundationBody(){const step=FOUNDATION_STEPS[foundationIndex],box=$('learn-view');box.replaceChildren();renderFoundationView(box,step,foundationState,{onChange:()=>{pause();renderFoundationBody();},onLocate:point=>{pause();api.onFoundationLocate?.(point,step);},onListen:()=>api.onListen?.({chapterId:'foundation-'+step.id,region:step.title,lon:step.lon,lat:step.lat,beatIndex:null})});}
  function goFoundation(i){
    pause();foundationIndex=clamp(i,FOUNDATION_STEPS.length-1);const step=FOUNDATION_STEPS[foundationIndex];foundationViewed.add(step.id);
    shell('foundation',step.title,'基础 '+(foundationIndex+1)+' / 7 · '+step.kicker.replace(/\s*·\s*\d+\s*\/\s*\d+$/,''),step.summary);renderFoundationBody();
    $('learn-prev').disabled=false;$('learn-prev').textContent=foundationIndex===0?'学习路线':'上一步';$('learn-next').textContent=foundationIndex===FOUNDATION_STEPS.length-1?nextStageLabel('foundation','接着看植物怎样生活 →'):'下一步 →';
    $('learn-skip').hidden=false;$('learn-skip').textContent='暂跳基础，进入六站准备 →';$('learn-progress').textContent='已浏览 '+foundationViewed.size+' / 7 步 · 浏览记录不代表掌握';
    remember();try{localStorage.setItem('plant-earth-foundation-v1',JSON.stringify({index:foundationIndex}));}catch{}api.onFoundation?.(step);layout({focus:true});
  }
  function prepareFoundationPlayback(){if(stage!=='foundation')return;const s=FOUNDATION_STEPS[foundationIndex];foundationState[s.id]=s.id==='water-cycle'?'vapour':s.id==='sunlight'?'direct':'wet';foundationState['forest-layer']='canopy';renderFoundationBody();}
  function onTime({chapterId,characterOffset,playing}={}){if(!enabled||stage!=='foundation'||!playing)return;const s=FOUNDATION_STEPS[foundationIndex];if(chapterId!=='foundation-'+s.id)return;const text=s.narration.join('');let key=s.id,value=null;if(s.id==='water-cycle')value=characterOffset>=text.indexOf('云里的水滴')?'rain':characterOffset>=text.indexOf('当含有水汽')?'cloud':'vapour';else if(s.id==='sunlight')value=characterOffset>=text.indexOf('斜着照')?'slant':'direct';else if(s.id==='forest'){key='forest-layer';value=characterOffset>=text.indexOf('下面的林下')?'understory':'canopy';}if(value&&foundationState[key]!==value){foundationState[key]=value;renderFoundationBody();}}
  function applyNarrationScene(scene,chapterId){
    if(!enabled)return;
    if(stage==='foundation'&&chapterId==='foundation-'+FOUNDATION_STEPS[foundationIndex].id&&scene.foundationState){
      const {key,value}=scene.foundationState;if(foundationState[key]!==value){foundationState[key]=value;renderFoundationBody();}
    }else if(stage==='environments'&&view==='environment'&&chapterId==='learn-'+current().id&&Number.isInteger(scene.chainIndex)&&scene.chainIndex!==chainIndex){
      chainIndex=Math.max(0,Math.min(2,scene.chainIndex));const box=$('learn-view'),position=box.scrollTop;renderView();box.scrollTop=position;
    }
  }
  function renderBridge(){
    pause();shell('bridge','从环境形成，走进植物生活','阶段连接 · 环境 → 植物','同样回到雨林，问题变了：前面问森林为什么出现，现在问森林里的植物怎样获得光、水和支撑。');
    const box=$('learn-view'),steps=el('div',null,'learn-bridge-steps');for(const [title,text] of [['已经看过的原因','阳光、水汽、降雨和长期水热条件，帮助解释景观的形成。'],['现在要观察的问题','同一片森林也有树冠、林下与树枝等小环境。巢蕨和蝴蝶兰会利用不同位置。'],['每站都走三步','先看环境，再认植物，最后自己判断。结束六站后，用水稻、小麦、玉米做一次应用。']]){const row=el('section');row.append(el('h3',title),el('p',text));steps.append(row);}box.append(steps);
    const start=el('button','从第1站：热带雨林开始','learn-primary');start.id='learn-env-start';start.onclick=()=>goTo(0);box.append(start);
    if(visited.size){const old=el('button','继续六站上次：'+current().title+' · '+VIEW_NAMES[view]);old.id='learn-env-resume';old.onclick=()=>goTo(index,{initialView:view,plantId:selectedPlantId});box.append(old);}
    const terms=el('details',null,'learn-sources');terms.append(el('summary','阅读分布前，分清这几个意思'));for(const term of LEARNING_INTRO.terms||[]){const p=el('p');p.append(el('strong',term.title+'：'),document.createTextNode(term.text));terms.append(p);}box.append(terms,el('p',LEARNING_INTRO.scope,'learn-route-note'));
    $('learn-prev').textContent='回基础最后一步';$('learn-next').textContent='从第1站开始 →';$('learn-progress').textContent='先说明承接关系，再选择从第一站或上次位置继续。';remember();readingContext('route','从环境形成走向植物生活','每站依次看环境、认植物、想一想。可以从第1站开始，也可明确选择继续六站上次。',{lon:114,lat:2});api.onOverview?.();layout({focus:true});
  }

  function sourceLinks(box,s){
    const details=el('details',null,'learn-sources');details.append(el('summary','分布含义与资料来源'));
    if(s.mapNote)details.append(el('p',s.mapNote));if(s.climateMapLabel)details.append(el('p',s.climateMapLabel));
    for(const row of s.sourceLinks||[]){const a=el('a',row.title);a.href=row.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);}box.append(details);
  }
  function renderEnvironment(box,s){
    if(s.id==='rainforest'){const b=el('button','想复习雨林怎样形成？回看基础第6步','foundation-shortcut');b.onclick=()=>goFoundation(5);box.append(b);}
    const listen=el('button','听本站环境讲解','learn-stop-listen');listen.onclick=()=>api.onListen?.({chapterId:'learn-'+s.id,lon:s.lon,lat:s.lat,region:s.title,beatIndex:null});box.append(listen);
    const steps=el('div',null,'learn-cause-steps');s.chain.forEach((row,i)=>{const b=el('button',(i+1)+' '+row.title);b.setAttribute('aria-pressed',String(i===chainIndex));b.onclick=()=>{pause();chainIndex=i;renderView();};steps.append(b);});
    const selected=s.chain[chainIndex]||s.chain[0],explanation=el('section',null,'learn-chain-current');explanation.append(el('h3',selected.title),el('p',selected.text));box.append(steps,explanation);
    const details=el('details',null,'learn-condition-details'),climate=el('div',null,'learn-climate');details.append(el('summary','展开看本站水、热与季节条件'));for(const row of s.climate){const cell=el('div');cell.append(el('span',row.label),el('strong',row.value));climate.append(cell);}details.append(climate);box.append(details);
    explainEnvironment(box,s.id);
    const contrast=el('div',null,'learn-contrast');contrast.append(el('h3',s.contrast.title),el('p',s.contrast.text));box.append(contrast,el('p','下一步把地球上的位置与植物连起来：观察它的器官，再区分识别特征和适应作用。','learn-route-note'));sourceLinks(box,s);
  }
  function placementFor(id,s){return api.getPlacement?.(id,s)||placements.find(p=>p.cropId===id)||null;}
  function renderPlants(box,s){
    if(!s.plants.some(p=>p.id===selectedPlantId))selectedPlantId=s.focusPlantId;
    const choice=el('div',null,'learn-plant-choices');for(const p of s.plants){const b=el('button',crops.get(p.id)?.name||p.id);b.dataset.learnPlant=p.id;b.setAttribute('aria-pressed',String(p.id===selectedPlantId));b.onclick=()=>{pause();selectedPlantId=p.id;mediaMode='photo';remember();renderView();api.onPlant?.(p.id,s);};choice.append(b);}box.append(choice);
    const crop=crops.get(selectedPlantId),chapter=data.chapters.find(c=>c.id===selectedPlantId),profile=profiles.get(selectedPlantId),row=s.plants.find(p=>p.id===selectedPlantId),place=placementFor(selectedPlantId,s),photo=photos.get(selectedPlantId);
    const heading=el('div',null,'learn-plant-heading');heading.append(el('h3',crop?.name||selectedPlantId),el('span',crop?.latin||''));box.append(heading);
    box.append(el('p',(place?.region||s.landscape)+' · '+(place?.evidenceType==='cultivation_region'?'栽培地区示例':'代表地区示例'),'learn-plant-location'));
    const media=el('div',null,'learn-plant-media');if(mediaMode==='photo'&&photo){const img=el('img');img.src=photo.file;img.alt=photo.caption||crop.name;img.onerror=()=>{media.replaceChildren(el('p','照片未能载入，可切换结构示意。'));};media.append(img);}else{try{media.append(renderMiniaturePreview(selectedPlantId,{width:360,height:210}));}catch{media.append(el('p','形态示意暂不可用，请阅读下方识别特征。'));}}box.append(media);
    if(photo){const modes=el('div',null,'learn-media-switch');for(const [mode,label] of [['photo','真实照片'],['model','结构示意']]){const b=el('button',label);b.setAttribute('aria-pressed',String(mediaMode===mode));b.onclick=()=>{mediaMode=mode;renderView();};modes.append(b);}box.append(modes);}
    const caption=el('p',mediaMode==='photo'&&photo?photo.caption+' 照片用于认形态，不是地图坐标的现场记录。':'模型是关键器官的简化教学示意，比例与生长阶段有所取舍。','learn-media-caption');if(mediaMode==='photo'&&photo){caption.append(document.createTextNode(' '));const credit=el('a',photo.credit+' · '+photo.license);credit.href=photo.sourceUrl;credit.target='_blank';credit.rel='noopener noreferrer';caption.append(credit);}box.append(caption);
    const identify=el('section',null,'learn-identify');identify.append(el('h4','认它看哪里？'));const organs=el('div',null,'learn-organs');for(const part of chapter?.morphology?.parts||[])organs.append(el('span',part));identify.append(organs);if(chapter?.morphology?.note)identify.append(el('p',chapter.morphology.note));box.append(identify);
    const adaptation=el('section',null,'learn-adaptation');adaptation.append(el('h4','它怎样应对环境？'),el('p',profile?.adaptation?.mechanism||row?.role||crop?.needs||''));if(profile?.adaptation?.tradeoff)adaptation.append(el('p',profile.adaptation.tradeoff,'learn-plant-needs'));box.append(adaptation,el('p','识别特征帮助认出植物；并非每种叶形、树皮或器官，都能直接归因于眼前的气候。判断适应作用还要看生理、生境与资料。','learn-route-note'));
    if(crop?.needs)box.append(el('p','生长线索：'+crop.needs+'。限制因素：'+(crop.limits||'请结合品种和当地条件核对'),'learn-plant-needs'));
    const actions=el('div',null,'learn-plant-actions'),listen=el('button','听这株植物的现有讲解');listen.onclick=()=>api.onListen?.({chapterId:place?.chapterId||selectedPlantId,beatIndex:place?.beatIndex??s.beatIndex,lon:place?.lon??s.lon,lat:place?.lat??s.lat,region:place?.region||s.title});actions.append(listen);box.append(actions);
    const sources=el('details',null,'learn-sources');sources.append(el('summary','查看这株植物的生境与形态来源'));for(const row of profile?.sources||[]){const a=el('a',row.title);a.href=row.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);}if(place?.sourceScope)sources.append(el('p',place.sourceScope));box.append(sources);
  }
  function renderQuestion(box,s){
    box.append(el('p','不用记术语，先用本站观察到的线索作判断。可以改选，也可以暂跳。','learn-question-note'),el('h3',s.question.prompt,'learn-question-title'));
    const options=el('div',null,'learn-answer-options');s.question.options.forEach((text,i)=>{const b=el('button',text);b.dataset.answer=String(i);b.setAttribute('aria-pressed',String(answers[s.id]===i));b.onclick=()=>{answers[s.id]=i;remember();renderView();$('learn-feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'});};options.append(b);});box.append(options);
    if(Object.hasOwn(answers,s.id)){const correct=answers[s.id]===s.question.correctIndex,feedback=el('div',null,'learn-feedback'+(correct?' is-correct':''));feedback.id='learn-feedback';feedback.setAttribute('role','status');feedback.append(el('strong',correct?'这个判断与资料相符':'再比较一下这些线索'),el('p',s.question.explanation),el('p','这里只记录本题当前答案，不代表已经掌握整类环境。'));box.append(feedback);}
  }
  function renderProgress(){$('learn-progress').textContent='已浏览环境 '+visited.size+' / 6 · 本站三页 '+(viewed[current().id]||[]).length+' / 3 · 已作答 '+countAnswered()+' / 6（当前答对 '+countCorrect()+'）';}
  function renderView(){
    const s=current(),box=$('learn-view');box.classList.remove('learn-application');box.replaceChildren();host.dataset.view=view;$('learn-position').textContent='环境 '+(index+1)+' / 6 · '+VIEW_NAMES[view];
    for(const b of host.querySelectorAll('[data-learn-view]')){const active=b.dataset.learnView===view;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;}box.setAttribute('aria-labelledby','learn-tab-'+view);
    const seen=new Set(Array.isArray(viewed[s.id])?viewed[s.id]:[]);seen.add(view);viewed[s.id]=[...seen];
    if(view==='plants')renderPlants(box,s);else if(view==='question')renderQuestion(box,s);else renderEnvironment(box,s);
    const lastStop=index===LEARNING_STOPS.length-1,followingLabel=lastStop?nextStageLabel('environments',''):'';
    $('learn-next').textContent=view==='environment'?'接着认植物 →':view==='plants'?'接着自己判断 →':lastStop?followingLabel||'应用到三大主粮 →':'下一站 →';
    $('learn-prev').textContent=view==='environment'?(index===0?'六站开始前':'上一站'):'上一步';$('learn-prev').disabled=false;$('learn-skip').hidden=false;$('learn-skip').textContent=lastStop?followingLabel?'暂跳本站 · '+followingLabel:'暂跳本站，进入三大主粮 →':'暂跳本站 →';renderProgress();remember();renderGlobeActions();if(view==='question')setCollapsed(false);layout();
  }
  function focusEnvironmentView(){const s=current();if(view==='plants')api.onPlant?.(selectedPlantId||s.focusPlantId,s);else if(view==='question')readingContext('question',s.question.prompt,'先根据环境与植物线索作判断，可以暂跳。',{stop:s,lon:s.lon,lat:s.lat});else api.onFocus?.(s);}
  function setView(next){if(stage!=='environments'||!Object.hasOwn(VIEW_NAMES,next))return;pause();view=next;renderView();resetScroll();focusEnvironmentView();}
  function goTo(next,{initialView='environment',plantId=null,focus=true}={}){
    pause();index=clamp(next,LEARNING_STOPS.length-1);view=Object.hasOwn(VIEW_NAMES,initialView)?initialView:'environment';chainIndex=0;const s=current();selectedPlantId=s.plants.some(p=>p.id===plantId)?plantId:s.focusPlantId;visited.add(s.id);
    shell('environments',s.title,'环境 '+(index+1)+' / 6 · '+VIEW_NAMES[view],s.summary);renderView();focusEnvironmentView();layout({focus});
  }
  function renderApplicationProgress(){const p=getApplicationProgress(applicationState);$('learn-progress').textContent=stage==='crops'?'已浏览主粮 '+p.cropViewed+' / 3 · 用同一组问题比较差异':'迁移练习：已尝试 '+p.transferAttempted+' / '+p.transferTotal+' · 已看参考对照 '+p.transferCompared+' / '+p.transferTotal+'；自己的解释另行保留';if(stage==='transfer'){$('learn-next').textContent=(applicationState.transferIndex||0)===0?'再试第二个地区 →':'回顾学习记录 →';$('learn-prev').textContent=(applicationState.transferIndex||0)===0?'回主粮比较':'回第一个地区';}}
  function renderApplicationBody(){if(stage==='crops'){const id=['rice','wheat','maize'].includes(applicationState.cropId)?applicationState.cropId:'rice';applicationState.cropViewed=[...new Set([...(Array.isArray(applicationState.cropViewed)?applicationState.cropViewed:[]),id])];}renderApplicationView($('learn-view'),{page:stage,state:applicationState,crops,data,onChange:refreshApplication,onFocus:context=>{save();api.onApplication?.(context);},onListen:record=>api.onListen?.(record)});renderApplicationProgress();}
  function refreshApplication(options){
    const box=$('learn-view'),active=document.activeElement,inside=box.contains(active),text=active?.textContent||'',label=active?.closest('label')?.textContent,scroll=box.scrollTop;
    save();if(options?.render===false){renderApplicationProgress();return;}
    renderApplicationBody();
    if(inside){
      const target=active.tagName==='INPUT'?[...box.querySelectorAll('.app-evidence label')].find(row=>row.textContent===label)?.querySelector('input'):[...box.querySelectorAll('button')].find(button=>button.textContent===text);
      if(target){box.scrollTop=scroll;target.focus({preventScroll:true});}
      else{const explanation=box.querySelector('.app-transfer-feedback')||box.querySelector('h3');if(explanation){explanation.tabIndex=-1;explanation.focus({preventScroll:true});explanation.scrollIntoView({block:'nearest'});}}
    }
    renderApplicationProgress();
  }
  function goApplication(page){
    if(!['crops','transfer'].includes(page))return;pause();const isCrops=page==='crops';shell(page,isCrops?'三大主粮需要怎样的环境？':'换个地区，试着解释','阶段 '+(isCrops?'3 / 5 · 主粮应用':'4 / 5 · 自己解释'),isCrops?'把刚才的水、热、季节与管理，用在最初的三个主粮问题上。':'无需猜一种唯一植物；先说明需要哪些环境证据，再与参考思路对照。');renderApplicationBody();$('learn-prev').textContent=isCrops?'回六站最后一题':'回主粮比较';$('learn-next').textContent=isCrops?'进入新地区练习 →':'回顾学习记录 →';$('learn-skip').hidden=false;$('learn-skip').textContent=isCrops?'暂跳比较，进入练习 →':'暂跳练习，进入回顾 →';renderApplicationProgress();remember();api.onApplication?.(getApplicationContext(page,applicationState));layout({focus:true});
  }
  function finish(){
    pause();shell('complete','回顾这次学习','阶段 5 / 5 · 回顾与自由探索','路线走到了回顾页。是否理解，需要看能否用证据解释新的地区，而不能只看点击进度。');const box=$('learn-view'),p=getApplicationProgress(applicationState);
    box.append(el('p','浏览记录：基础 '+foundationViewed.size+' / 7 步，环境 '+visited.size+' / 6 站，主粮 '+p.cropViewed+' / 3 种。','learn-result'),el('p','判断记录：六站已作答 '+countAnswered()+' / 6，当前答案与参考相符 '+countCorrect()+' 题。迁移练习已尝试 '+p.transferAttempted+' / '+p.transferTotal+'，已看对照 '+p.transferCompared+' / '+p.transferTotal+'。','learn-result'),el('p','浏览、选中参考答案与独立解释不同。记录保留是为了方便复习，不作为掌握程度评分。','learn-route-note'));
    const reflection=el('ol',null,'learn-goals');for(const text of ['看到一个地方，先指出大洲、纬度和海陆位置，再问当地的水与热怎样。','用一句话把“环境 → 植物应对方式 → 作用与代价”连起来，并说明哪里还需要证据。','看到作物在当地出现，继续问是原生、栽培还是潜在适生；灌溉、播期和品种是否改变了条件。'])reflection.append(el('li',text));box.append(reflection);
    const review=el('div',null,'learn-review');for(const [i,s] of LEARNING_STOPS.entries()){if(answers[s.id]===s.question.correctIndex)continue;const b=el('button',(Object.hasOwn(answers,s.id)?'再想一想：':'尚未作答：')+s.title);b.onclick=()=>goTo(i,{initialView:'question'});review.append(b);}if(review.children.length)box.append(el('h3','按需返回这些判断'),review);
    const back=el('button','回到新地区练习，继续写解释');back.onclick=()=>goApplication('transfer');const restart=el('button','从第一步重新学习 · 保留记录','learn-reset-progress');restart.onclick=()=>goFoundation(0);box.append(back,restart);$('learn-prev').textContent='回新地区练习';$('learn-next').textContent='进入自由探索 →';$('learn-progress').textContent='完整植物图鉴可按类群、生境、形态与用途继续探索。';remember();readingContext('complete','学习回顾','浏览记录、判断记录与迁移解释分别保留。下一步进入完整植物图鉴自由探索。');api.onComplete?.();layout({focus:true});
  }
  function advance(){
    if(stage==='home')resumeStage?resumeRoute():goFoundation(0);
    else if(stage==='foundation'){
      if(foundationIndex<FOUNDATION_STEPS.length-1)goFoundation(foundationIndex+1);
      else if(api.onStageNext?.('foundation')!==true)renderBridge();
    }else if(stage==='bridge')goTo(0);
    else if(stage==='environments'){
      if(view==='environment')setView('plants');else if(view==='plants')setView('question');
      else if(index<LEARNING_STOPS.length-1)goTo(index+1);
      else if(api.onStageNext?.('environments')!==true)goApplication('crops');
    }else if(stage==='crops')goApplication('transfer');
    else if(stage==='transfer'){if((applicationState.transferIndex||0)===0){applicationState.transferIndex=1;goApplication('transfer');}else finish();}
    else close();
  }
  function back(){if(stage==='foundation')foundationIndex?goFoundation(foundationIndex-1):(api.onRouteHome?.()===true||renderHome());else if(stage==='bridge')goFoundation(FOUNDATION_STEPS.length-1);else if(stage==='environments'){if(view==='question')setView('plants');else if(view==='plants')setView('environment');else index?goTo(index-1,{initialView:'question'}):renderBridge();}else if(stage==='crops')goTo(LEARNING_STOPS.length-1,{initialView:'question'});else if(stage==='transfer'){if((applicationState.transferIndex||0)>0){applicationState.transferIndex=0;goApplication('transfer');}else goApplication('crops');}else if(stage==='complete')goApplication('transfer');}
  function skip(){
    if(stage==='foundation')renderBridge();
    else if(stage==='environments'){
      if(index<LEARNING_STOPS.length-1)goTo(index+1);
      else if(api.onStageNext?.('environments')!==true)goApplication('crops');
    }else if(stage==='crops')goApplication('transfer');else if(stage==='transfer')finish();
  }
  function open(){if(enabled)return;lastFocus=document.activeElement;enabled=true;distribution.setEnabled(true);host.hidden=false;document.body.classList.add('is-learning');renderHome();layout({focus:true});}
  function openStage(target,location={}){
    if(!VALID_STAGES.has(target))return false;
    const point=location&&typeof location==='object'&&!Array.isArray(location)?location:{};
    if(!enabled)open();
    if(target==='foundation')goFoundation(point.foundationIndex??foundationIndex);
    else if(target==='bridge'||target==='environments'&&point.bridge)renderBridge();
    else if(target==='environments')goTo(point.index??index,{initialView:point.view??view,plantId:point.selectedPlantId??point.plantId??selectedPlantId});
    else if(target==='complete')finish();else goApplication(target);
    return true;
  }
  function visibleNarrationInput(){
    if(!enabled)return null;
    if(stage==='foundation'){const s=FOUNDATION_STEPS[foundationIndex];return {chapterId:'foundation-'+s.id,region:s.title,lon:s.lon,lat:s.lat,beatIndex:null};}
    if(stage!=='environments')return null;
    const s=current();
    if(view==='environment'||view==='question')return {chapterId:'learn-'+s.id,region:s.title,lon:s.lon,lat:s.lat,beatIndex:null};
    if(view!=='plants')return null;
    const id=selectedPlantId||s.focusPlantId,p=placementFor(id,s);
    if(!p)return data.chapters.some(c=>c.id===id)?{chapterId:id,region:s.title,lon:s.lon,lat:s.lat,beatIndex:null}:null;
    const item={...p,chapterId:p.chapterId||id,region:p.region||s.title};return [{...item,beatIndex:0},{...item,beatIndex:Number.isInteger(p.beatIndex)?p.beatIndex:s.beatIndex}];
  }
  function playVisibleNarration({automatic=false}={}){
    const input=visibleNarrationInput();if(!input||typeof api.onListen!=='function')return false;
    const items=Array.isArray(input)?input:[input],available=items.every(item=>data.chapters.some(c=>c.id===item.chapterId));if(!available)return false;
    if(automatic)updateContinuousStatus('正在自动接续：'+(stage==='foundation'?FOUNDATION_STEPS[foundationIndex].title:current().title+' · '+VIEW_NAMES[view])+'。判断题仍可稍后回看。');
    api.onListen(input);return true;
  }
  function onNarrationFinished({chapterId,natural=false,allowContinue=false}={}){
    const place=stage==='environments'?placementFor(selectedPlantId||current().focusPlantId,current()):null;
    const plan=planLearningContinuation({enabled,stage,foundationIndex,index,view},{chapterId,natural,allowContinue,autoContinue:isAutoContinueEnabled(),plantChapterId:place?.chapterId||selectedPlantId||current().focusPlantId});
    if(!plan)return false;
    if(plan.type==='foundation')goFoundation(plan.index);
    else if(plan.type==='plants')setView('plants');
    else if(plan.type==='environment')goTo(plan.index);
    else if(plan.stage==='foundation'){
      if(api.onStageNext?.('foundation',{autoplay:true,source:'narration'})!==true)goTo(0);
    }else{
      const handled=api.onStageNext?.('environments',{autoplay:true,source:'narration'})===true;
      if(!handled){goApplication('crops');updateContinuousStatus('生态讲解已结束。判断题保留到回顾，可继续主粮比较或植物课程。');}
      return true;
    }
    // Host stage hooks are synchronous. If they opened another module, this
    // controller is no longer enabled and therefore cannot start stale audio.
    if(!playVisibleNarration({automatic:true})&&enabled)updateContinuousStatus('本段讲解已结束。下一页是互动或阅读内容，可按“下一步”继续。');
    return true;
  }
  function close(){if(!enabled)return;pause();save();enabled=false;host.hidden=true;document.body.classList.remove('is-learning');api.onClose?.();api.onLayout?.();api.requestDraw?.();if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});}
  entry.onclick=open;$('learn-route-home').onclick=renderHome;$('learn-close').onclick=close;$('learn-collapse').onclick=()=>{if(narrationWatch)narrationWatch.changed=true;setCollapsed(!host.classList.contains('learn-collapsed'));};$('learn-next').onclick=advance;$('learn-prev').onclick=back;$('learn-skip').onclick=skip;
  const tabs=[...host.querySelectorAll('[data-learn-view]')];for(const button of tabs){button.onclick=()=>setView(button.dataset.learnView);button.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(button),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setView(tabs[next].dataset.learnView);tabs[next].focus();};}
  host.addEventListener('keydown',e=>{if(e.key!=='Escape')return;e.stopPropagation();e.preventDefault();if($('learn-step-menu').open)$('learn-step-menu').open=false;else close();});
  return {open,openStage,close,selectStop:i=>{if(!enabled)open();goTo(i);},isEnabled:()=>enabled,visibleNarrationInput,playVisibleNarration,onNarrationFinished,prepareFoundationPlayback,onTime,applyNarrationScene,beginNarrationWatch,endNarrationWatch,
    getInsets:()=>{if(!enabled)return null;const header=host.querySelector('.learn-header').getBoundingClientRect(),panel=host.querySelector('.learn-panel').getBoundingClientRect(),mobile=window.innerWidth<=760,player=document.querySelector('.imm-player')?.getBoundingClientRect();if(host.classList.contains('learn-collapsed')){const controls=document.querySelector('#learning-map-view-controls')?.getBoundingClientRect();return {left:mobile?14:26,right:mobile?14:26,top:Math.max(header.bottom+12,panel.bottom+10,controls?.bottom||0,mobile&&!globeActions.hidden?globeActions.getBoundingClientRect().bottom+8:0),bottom:player?window.innerHeight-player.top+18:180};}return mobile?{left:14,right:14,top:header.bottom+12,bottom:window.innerHeight-panel.top+12}:{left:26,right:window.innerWidth-panel.left+20,top:header.bottom+16,bottom:player?window.innerHeight-player.top+18:180};},
    getState:()=>({enabled,stage,resumeStage,index,stopId:current().id,view,overview:['home','bridge'].includes(stage),completed:stage==='complete',foundationMode:stage==='foundation',foundationIndex,foundationStep:FOUNDATION_STEPS[foundationIndex].id,selectedPlantId,visited:[...visited],answers:{...answers},correct:countCorrect(),answered:countAnswered(),foundationViewed:[...foundationViewed],applicationState:JSON.parse(JSON.stringify(applicationState))})};
}
