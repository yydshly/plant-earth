import {CROP_LEARNING_PATHS,CROP_CLASSES} from './crop-class-content.js';
import {createClassroomState,classForGroup,classesForCrop} from './crop-classroom-model.js';
import {filterCatalogue} from './global-catalog-model.js';
import {renderMiniaturePreview} from './plant-miniatures.js';
import {createClassIntroPlayer} from './class-intro-player.js';
import {mountClassQuiz} from './crop-class-quiz.js';
import {classCheckFor,getClassCheckProgress} from './crop-class-checks.js';
import {readClassCheckAnswers,saveClassCheckAnswer} from './class-check-store.js';

const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const STEPS=['认识用途','辨认器官','比较代表','想一想'];
const STORAGE='plant-earth-crop-classroom-v1';
const stepIndex=value=>Number.isInteger(value)?Math.max(0,Math.min(STEPS.length-1,value)):0;

// A spoken representative is selected only after its exact catalogue name has
// occurred in the current recorded beat. Nothing is inferred from an organ,
// an alias, another beat or the currently selected map plant.
export function spokenClassRepresentative({chapter,characterOffset,step,representativeIds,plants}={}){
  const beat=chapter?.beats?.[step];if(!beat||!Number.isFinite(characterOffset))return null;
  const start=chapter.beats.slice(0,step).reduce((offset,part)=>offset+part.text.length,0),prefix=beat.text.slice(0,Math.max(0,Math.min(beat.text.length,Math.floor(characterOffset-start))));
  let selected=null,lastEnd=-1;
  for(const id of representativeIds||[]){const name=plants?.get?.(id)?.name;if(typeof name!=='string'||!name.trim())continue;const at=prefix.lastIndexOf(name),end=at+name.length;if(at>=0&&end>lastEnd){selected=id;lastEnd=end;}}
  return selected;
}

// Classification lessons, representative visits and answers are separate
// records. Reading or listening never marks an answer as understood.
export function createCropClassroom({container,crops,narrationPack,getCurrentCropId=()=>null,onExplore,onBrowse,onChange,onProgress,onContinue,onPlayingChange,onScene,onLectureComplete}){
  const plants=Array.from(crops.values()),byId=new Map(plants.map(p=>[p.id,p]));
  let progress={};try{progress=JSON.parse(localStorage.getItem(STORAGE)||'{}');}catch{}
  const state=createClassroomState({progress});
  let view='home',pathId=null,classId=null,step=0,lastLessonClassId=null,quiz=null,answers=readClassCheckAnswers(),lectureStatus='';
  let spokenClassId=null,spokenStep=null,spokenPlantId=null,lastPositionKey=null,reportingSpoken=false,rendering=false;
  const lectureOrder=CROP_LEARNING_PATHS.flatMap(path=>path.classIds).filter(id=>CROP_CLASSES.some(c=>c.id===id));
  const classById=id=>CROP_CLASSES.find(c=>c.id===id);
  const pathById=id=>CROP_LEARNING_PATHS.find(p=>p.id===id);
  const currentClass=()=>classById(classId);
  // Only replace these siblings' content. The audio element stays attached
  // while the visible lesson follows a narration beat or a manual step.
  const header=el('div',null,'classroom-header'),audioHost=el('div',null,'classroom-audio-host'),content=el('div',null,'classroom-content');
  container.replaceChildren(header,audioHost,content);
  const getUIState=()=>({view,pathId,classId,step});
  const report=()=>onProgress?.(getUIState());
  const intro=createClassIntroPlayer({container:audioHost,pack:narrationPack,onPlayingChange:playing=>onPlayingChange?.(playing),onPosition:position=>{
    if(rendering||reportingSpoken||view!=='lesson'||step>=3)return;
    const c=currentClass();if(!c||position.chapter?.classId!==c.id||position.step!==step)return;
    // A paused scrub must still match the caption, but a pause or repaint at
    // the same character must not reclaim a plant the user selected manually.
    const positionKey=c.id+':'+step+':'+position.characterOffset,moved=positionKey!==lastPositionKey;lastPositionKey=positionKey;
    if(!position.playing&&!moved)return;
    const selected=spokenClassRepresentative({chapter:position.chapter,characterOffset:position.characterOffset,step,representativeIds:c.representativeIds,plants:byId});
    if(spokenClassId===c.id&&spokenStep===step&&spokenPlantId===selected)return;
    const hadSpoken=spokenClassId===c.id&&spokenStep===step&&!!spokenPlantId;
    spokenClassId=c.id;spokenStep=step;spokenPlantId=selected;
    if(!selected&&!hadSpoken)return;
    reportingSpoken=true;try{emitCurrentScene();}finally{reportingSpoken=false;}
  },onEnded:result=>{
    if(view!=='lesson'||result.classId!==classId)return;
    if(result.userInitiated&&result.autoContinue&&onLectureComplete?.({courseScope:'agriculture',classId,pathId,beforeNext:true})===true)return;
    if(result.userInitiated&&result.autoContinue&&continueLecture({automatic:true}))return;
    if(result.userInitiated&&result.autoContinue&&onLectureComplete?.({courseScope:'agriculture',classId,pathId})===true)return;
    lectureStatus=result.userInitiated&&result.autoContinue?'已到这套讲解的最后一课。未答题仍保留在回顾中，可继续查看真实地图。':'本课讲解已结束。可以做一道判断，也可以继续下一课；未答题保留到回顾。';
    step=3;render();report();container.querySelector('.classroom-topic')?.scrollIntoView({block:'nearest'});
  },onStep:index=>{
    if(view!=='lesson'||step===3||index<0||index>2||step===index)return;
    step=index;render();report();container.querySelector('.classroom-topic')?.scrollIntoView({block:'nearest'});
  }});
  const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(state.snapshot()));}catch{}onChange?.();};
  function button(text,action,cls){const b=el('button',text,cls);b.type='button';b.onclick=action;return b;}
  function focusStart(){container.scrollTop=0;container.closest('.global-catalog')?.scrollTo({top:0});container.querySelector('[data-classroom-title]')?.focus({preventScroll:true});}
  function normalizeLocation(location={}){
    const next=location&&typeof location==='object'?location:{};
    const c=classById(next.classId),p=pathById(next.pathId);
    if((next.view==='lesson'||(!next.view&&c))&&c)return {view:'lesson',pathId:c.pathId,classId:c.id,step:stepIndex(next.step)};
    if(next.view==='path'&&p)return {view:'path',pathId:p.id,classId:null,step:0};
    return {view:'home',pathId:null,classId:null,step:0};
  }
  function applyLocation(location,{notify=false,focus=false,status=''}={}){
    const next=normalizeLocation(location),changed=JSON.stringify(next)!==JSON.stringify(getUIState());
    intro.pause();lectureStatus=status;view=next.view;pathId=next.pathId;classId=next.classId;step=next.step;
    if(classId){lastLessonClassId=classId;intro.setClass(classId);if(step<3)intro.seekStep(step);}
    render();if(focus)focusStart();if(notify&&changed)report();return getUIState();
  }
  function go(next,{path,lesson,lessonStep=0}={}){return applyLocation({view:next,pathId:path,classId:lesson,step:lessonStep},{notify:true,focus:true});}
  function selectStep(index){
    const next=stepIndex(index),changed=next!==step;
    lectureStatus='';step=next;if(step===3)intro.pause();else intro.seekStep(step);
    render();container.querySelector('#crop-classroom-step-'+step)?.focus({preventScroll:true});
    container.querySelector('.classroom-topic')?.scrollIntoView({block:'nearest'});if(changed)report();return getUIState();
  }
  function heading(title,subtitle){const h=el('h3',title);h.tabIndex=-1;h.dataset.classroomTitle='';header.append(h);if(subtitle)header.append(el('p',subtitle,'classroom-lead'));}
  function nextLectureId(){const index=lectureOrder.indexOf(classId);return index>=0?lectureOrder[index+1]||null:null;}
  function continueLecture({automatic=false}={}){
    const id=nextLectureId();if(!id)return false;
    const from=currentClass()?.group||'上一课',c=classById(id);
    applyLocation({view:'lesson',pathId:c.pathId,classId:id,step:0},{notify:true,focus:!automatic,status:automatic?from+'讲解结束，理解题留待回顾；接着听'+c.group+'。':''});
    if(automatic)container.closest('.global-catalog')?.scrollTo({top:0});
    intro.play({userInitiated:true});return true;
  }
  function playCurrentCourse(){
    if(view!=='lesson'){const path=pathById(pathId),id=path?.classIds?.[0]||lectureOrder[0];if(!id)return Promise.resolve(false);const c=classById(id);applyLocation({view:'lesson',classId:id,pathId:c.pathId,step:0},{notify:true});}
    else if(step===3){lectureStatus='';step=0;intro.seekStep(0);render();report();}
    return intro.play({userInitiated:true});
  }
  function breadcrumb(label,action){header.append(button('← '+label,action,'classroom-back'));}
  function visit(c,id,{play=false}={}){if(!byId.has(id))return;intro.pause();state.start(c.id,id);save();onExplore?.(id,{play});}
  function browse(options){intro.pause();onBrowse?.(options);}
  function preview(id){const box=el('div',null,'classroom-plant-image');try{box.append(renderMiniaturePreview(id,{width:220,height:170}));}catch{box.append(el('span',byId.get(id)?.name||id));}return box;}
  function count(c){return filterCatalogue(plants,{collection:'agriculture',group:c.group}).length;}
  function classCards(path){
    const list=el('div',null,'classroom-class-list');
    for(const id of path.classIds){const c=classById(id);if(!c)continue;const b=button('',()=>go('lesson',{lesson:id}),'classroom-class-card');b.append(el('strong',c.group+' · '+count(c)+' 条目'),el('span',c.question),el('small',c.representativeIds.map(id=>byId.get(id)?.name).filter(Boolean).join(' · ')));list.append(b);}
    content.append(list);
  }
  function renderHome(){
    heading('从四条主线认识作物','选一条主线 → 认识类别 → 比较代表 → 想一想，再回到真实地图。');
    const rule=el('p','这里按人类用途组织农业条目。用途相近，不表示亲缘相近，也不表示生长环境相同。','classroom-rule');
    const context=state.getContext(getCurrentCropId()),plant=byId.get(getCurrentCropId());
    let continuation;
    if(context){const c=classById(context.classId);continuation=button('继续上次的类别：'+c.group,()=>go('lesson',{lesson:c.id,lessonStep:2}),'classroom-continue');}
    else{const c=plant&&classesForCrop(plant)[0];if(c)continuation=button('从当前的'+plant.name+'认识「'+c.group+'」',()=>go('lesson',{lesson:c.id}),'classroom-continue');}
    const list=el('div',null,'classroom-paths');
    for(const [index,path] of CROP_LEARNING_PATHS.entries()){
      const card=button('',()=>go('path',{path:path.id}),'classroom-path');
      card.title=path.question;card.append(el('span',String(index+1).padStart(2,'0'),'classroom-path-number'),el('strong',path.title),el('small',path.classIds.map(id=>classById(id)?.group).filter(Boolean).join(' · ')));list.append(card);
    }
    const checkProgress=getClassCheckProgress(readClassCheckAnswers());
    content.append(list);if(continuation)content.append(continuation);content.append(rule,el('p','类别理解题：已作答 '+checkProgress.classAttempted+' / '+checkProgress.classTotal+'，当前答对 '+checkProgress.classCorrect+'。读过、看过代表与答对题目分别记录，不表示已经掌握。','classroom-note'));
    content.append(button('查看森林、水域与其他代表植物',()=>browse({collection:'biodiversity',group:''}),'classroom-other'));
  }
  function renderPath(){const path=pathById(pathId);if(!path){view='home';pathId=null;renderHome();return;}
    breadcrumb('四条学习主线',()=>go('home'));heading(path.title,path.intro);classCards(path);
    content.append(el('p','每类都按“用途 → 器官 → 代表差异 → 想一想”认识，再回到地球查看有来源的地区记录。','classroom-note'));
  }
  function renderLesson(){const c=currentClass();if(!c){view='home';classId=null;pathId=null;step=0;renderHome();return;}
    const path=pathById(c.pathId);
    breadcrumb(path?.title||'类别列表',()=>go('path',{path:c.pathId}));
    heading(c.group,c.question);
    if(lectureStatus){const status=el('p',lectureStatus,'classroom-lecture-status');status.setAttribute('role','status');header.append(status);}
    const tabs=el('div',null,'classroom-steps');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',c.group+'学习步骤');
    STEPS.forEach((name,index)=>{const b=button((index+1)+' '+name,()=>selectStep(index),'classroom-step');b.setAttribute('role','tab');b.setAttribute('aria-selected',String(index===step));b.setAttribute('aria-controls','crop-classroom-topic');b.id='crop-classroom-step-'+index;tabs.append(b);});content.append(tabs);
    const body=el('section',null,'classroom-topic');body.id='crop-classroom-topic';body.setAttribute('role','tabpanel');body.setAttribute('aria-labelledby','crop-classroom-step-'+step);
    if(step===0){body.append(el('h4','为什么归为这一类？'),el('p',c.definition),el('h4','先避免一个误解'),el('p',c.misconception,'classroom-misconception'));}
    if(step===1){body.append(el('h4','我们主要利用什么器官？'),el('p',c.organ));const models=el('div',null,'classroom-organ-models');for(const id of c.representativeIds){const figure=el('figure');figure.append(preview(id),el('figcaption',byId.get(id)?.name));models.append(figure);}body.append(models,el('p','三维模型是器官放大的教学示意，可并置不同生长阶段。','classroom-note'),el('h4','同类内部怎样区分？'),el('p',c.distinguish));}
    if(step===2){
      body.append(el('h4','同一类也有不同的环境要求'),el('p',c.environment),el('p',c.compareQuestion,'classroom-question'));
      const reps=el('div',null,'classroom-representatives');
      for(const rep of c.representatives){const plant=byId.get(rep.id);if(!plant)continue;const card=el('article',null,'classroom-representative');card.append(preview(rep.id));const text=el('div');text.append(el('strong',plant.name),el('p',rep.note));const actions=el('div',null,'classroom-rep-actions');actions.append(button('到地球上看',()=>visit(c,rep.id)),button('听这个例子',()=>visit(c,rep.id,{play:true})));text.append(actions);card.append(text);reps.append(card);}body.append(reps,el('p','在地球上逐个观察这些例子，可随时返回本类比较；地图讲解的三步与本类代表顺序分别保留。','classroom-note'));
      body.append(button('按顺序观察 '+c.representativeIds.length+' 个代表',()=>visit(c,c.representativeIds[0]),'classroom-observe-representatives'));
    }
    if(step===3){
      answers=readClassCheckAnswers();const quizHost=el('div',null,'classroom-quiz-host'),status=el('p',null,'classroom-answer-summary');status.setAttribute('role','status');
      const updateStatus=()=>{const p=getClassCheckProgress(answers).byClass[c.id];status.textContent=!p.answered?'本类还未作答，可以先判断，也可以继续后再回来。':p.correct?'本题当前答对；可回到代表植物继续核对。':'本题已作答，建议结合反馈再比较一次；可以改选。';};updateStatus();body.append(quizHost,status);
      quiz=mountClassQuiz(quizHost,{classId:c.id,answers,onAnswer:(questionId,index)=>{answers=saveClassCheckAnswer(questionId,index);updateStatus();onChange?.();}});
    }
    content.append(body);
    const nav=el('div',null,'classroom-lesson-nav'),previous=button('上一步',()=>selectStep(step-1));previous.disabled=step===0;nav.append(previous);
    if(step<STEPS.length-1)nav.append(button('下一步：'+STEPS[step+1],()=>selectStep(step+1),'classroom-primary'));
    else nav.append(button('接着读真实地图',()=>{intro.pause();if(onContinue){const current=getCurrentCropId();state.start(c.id,c.representativeIds.includes(current)?current:c.representativeIds[0]);save();onContinue({classId:c.id,pathId:c.pathId,step});}else visit(c,c.representativeIds[0]);},'classroom-primary'));
    if(step===3&&nextLectureId())nav.append(button('下一课并播放：'+classById(nextLectureId()).group,()=>continueLecture(),'classroom-next-lecture'));
    content.append(nav);
    const details=el('details',null,'classroom-class-details');details.append(el('summary','本类全部 '+count(c)+' 个条目与资料来源'));
    details.append(button('查看本类全部条目',()=>browse({collection:'agriculture',group:c.group})));
    for(const source of c.sources){const a=el('a',source.title);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);}content.append(details);
  }
  function emitCurrentScene(){
    const c=view==='lesson'?currentClass():null;
    if(!c){onScene?.(null);return;}
    if(spokenClassId!==c.id||spokenStep!==step){spokenClassId=c.id;spokenStep=step;spokenPlantId=null;}
    const question=classCheckFor(c.id),text=[
      c.definition+' '+c.misconception,
      c.organ+' '+c.distinguish,
      c.environment+' '+c.compareQuestion,
      '先做一个判断，再结合反馈核对；可以改选。'+(question?question.prompt+' '+question.nextHint:'')
    ][step];
    onScene?.({classId:c.id,step,title:c.group+' · '+STEPS[step],text,representativeIds:[...c.representativeIds],...(step<3&&spokenPlantId?{spokenPlantId}:{})});
  }
  function render(){
    if(rendering)return;rendering=true;
    try{
      quiz?.destroy();quiz=null;header.replaceChildren();content.replaceChildren();container.dataset.view=view;container.dataset.classId=classId||'';container.dataset.lessonStep=String(step);audioHost.hidden=view!=='lesson'||step===3;
      if(view==='home')renderHome();else if(view==='path')renderPath();else renderLesson();emitCurrentScene();
    }finally{rendering=false;}
  }
  render();
  return {
    showHome:()=>go('home'),
    showClass:(groupOrId,options={})=>{const c=classById(groupOrId)||classForGroup(groupOrId);if(c)go('lesson',{lesson:c.id,lessonStep:typeof options==='number'?options:options?.step??options?.lessonStep??0});},
    returnToLesson:()=>{const ctx=state.getContext(getCurrentCropId()),c=currentClass()||classById(lastLessonClassId)||classById(ctx?.classId);if(c)go('lesson',{lesson:c.id,lessonStep:2});else go('home');},
    showActive:()=>{const ctx=state.getContext(getCurrentCropId());if(ctx)go('lesson',{lesson:ctx.classId,lessonStep:2});else go('home');},
    observe:id=>{state.observe(id);save();if(view==='home')render();},
    move:delta=>{intro.pause();const id=state.move(delta);save();if(id)onExplore?.(id,{play:false});},
    resume:()=>{intro.pause();const id=state.resume();if(id)onExplore?.(id,{play:false});},
    clear:()=>{intro.pause();state.clear();save();},
    getContext:()=>state.getContext(getCurrentCropId()),
    getClass:()=>classById(state.getContext(getCurrentCropId())?.classId),
    snapshot:()=>state.snapshot(),
    classesForCrop,
    pause:()=>intro.pause(),
    play:playCurrentCourse,playCurrentCourse,cancelContinuation:()=>intro.cancelContinuation(),
    getUIState,selectStep,
    restoreUI:location=>applyLocation(location),
  };
}

