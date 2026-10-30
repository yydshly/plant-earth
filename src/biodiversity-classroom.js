import {BIODIVERSITY_PATHS,BIODIVERSITY_COURSES} from './biodiversity-content.js';
import {createClassIntroPlayer} from './class-intro-player.js';
import {renderMiniaturePreview} from './plant-miniatures.js';
import {readBiodiversityProgress,markBiodiversityViewed,saveBiodiversityAnswer,biodiversityProgress} from './biodiversity-model.js';
import {evidenceRegion,renderRegionalEvidence} from './regional-evidence-view.js';

const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const STEPS=['认识形态','环境机制','地区证据','想一想'];
const text=value=>Array.isArray(value)?value.map(text).join(' '):typeof value==='string'?value:'';
export function createBiodiversityClassroom({container,crops,narrationPack,regionalData,getCurrentCropId,onExplore,onProgress,onContinue,onPlayingChange,onScene,onLectureComplete}){
  const byId=new Map(BIODIVERSITY_COURSES.map(c=>[c.id,c])),pathFor=id=>BIODIVERSITY_PATHS.find(p=>p.id===id),idsFor=p=>p?.courseIds||p?.cropIds||[];
  let view='home',cropId=null,pathId=null,step=0,following=true,lectureStatus='';
  const lectureOrder=BIODIVERSITY_PATHS.flatMap(p=>idsFor(p)).filter(id=>byId.has(id));
  const header=el('div',null,'bio-header'),audioHost=el('div',null,'bio-audio-host'),content=el('div',null,'bio-content');container.replaceChildren(header,audioHost,content);
  const pack={...narrationPack,chapters:(narrationPack?.chapters||[]).map(c=>({...c,classId:c.cropId}))};
  const intro=createClassIntroPlayer({container:audioHost,pack,labels:{listen:'听植物课程',pause:'暂停植物课程',resume:'继续植物课程',seek:'植物课程音频进度',rate:'植物课程语速',note:'MiniMax 配音 · 形态、机制、地区证据与地球同步。可暂停阅读或切步骤跳听。'},onPlayingChange,onEnded:result=>{
    if(view!=='lesson'||result.classId!==cropId)return;
    if(result.userInitiated&&result.autoContinue&&onLectureComplete?.({courseScope:'biodiversity',cropId,regionId:byId.get(cropId)?.regionId,beforeNext:true})===true)return;
    if(result.userInitiated&&result.autoContinue&&continueLecture({automatic:true}))return;
    if(result.userInitiated&&result.autoContinue&&onLectureComplete?.({courseScope:'biodiversity',cropId,regionId:byId.get(cropId)?.regionId})===true)return;
    lectureStatus=result.userInitiated&&result.autoContinue?'已到这套讲解的最后一课。未答题仍保留在回顾中，可继续查看真实地图。':'本课讲解已结束。可以做一道判断，也可以继续下一课；未答题保留到回顾。';
    step=3;render();report();content.querySelector('.bio-topic')?.scrollIntoView({block:'nearest'});
  },onStep:index=>{
    if(view!=='lesson'||step===3||step===index)return;step=index;render();report();content.querySelector('.bio-topic')?.scrollIntoView({block:'nearest'});
  }});
  const location=()=>({courseScope:'biodiversity',view,pathId,cropId,step,following});
  function report(){try{if(view==='lesson')localStorage.setItem('plant-earth-biodiversity-location-v1',JSON.stringify(location()));}catch{}onProgress?.(location());}
  function button(label,action,cls){const b=el('button',label,cls);b.type='button';b.onclick=action;return b;}
  function go(next={},{notify=true,focus=true,status=''}={}){
    intro.pause();lectureStatus=status;const c=byId.get(next.cropId),p=pathFor(next.pathId);
    cropId=c?.id||null;pathId=c?.pathId||p?.id||null;view=next.view==='lesson'&&c?'lesson':next.view==='path'&&pathId?'path':'home';step=Number.isInteger(next.step)?Math.max(0,Math.min(3,next.step)):0;following=next.following!==false;
    if(view==='lesson'){intro.setClass(cropId);if(step<3)intro.seekStep(step);markBiodiversityViewed(cropId);}
    render();if(notify)report();if(focus){container.closest('.global-catalog')?.scrollTo({top:0});header.querySelector('h3')?.focus({preventScroll:true});}return location();
  }
  function selectStep(index){lectureStatus='';step=Number.isInteger(index)?Math.max(0,Math.min(3,index)):0;if(step===3)intro.pause();else intro.seekStep(step);render();report();content.querySelector('#bio-step-'+step)?.focus({preventScroll:true});content.querySelector('.bio-topic')?.scrollIntoView({block:'nearest'});return location();}
  function nextLectureId(){const index=lectureOrder.indexOf(cropId);return index>=0?lectureOrder[index+1]||null:null;}
  function continueLecture({automatic=false}={}){
    const id=nextLectureId();if(!id)return false;const from=byId.get(cropId)?.name||'上一课',c=byId.get(id);
    go({view:'lesson',cropId:id,pathId:c.pathId,step:0,following:automatic?following:true},{notify:true,focus:!automatic,status:automatic?from+'讲解结束，理解题留待回顾；接着听'+c.name+'。':''});
    if(automatic)container.closest('.global-catalog')?.scrollTo({top:0});intro.play({userInitiated:true});return true;
  }
  function playCurrentCourse(){
    if(view!=='lesson'){const id=idsFor(pathFor(pathId))[0]||lectureOrder[0];if(!id)return Promise.resolve(false);go({view:'lesson',cropId:id,step:0},{notify:true,focus:false});}
    else if(step===3){lectureStatus='';step=0;intro.seekStep(0);render();report();}
    return intro.play({userInitiated:true});
  }
  function heading(title,lead){const h=el('h3',title);h.tabIndex=-1;h.dataset.classroomTitle='';header.append(h);if(lead)header.append(el('p',lead,'classroom-lead'));}
  function sources(target,rows){const d=el('details',null,'bio-sources');d.append(el('summary','查看植物知识与地区资料来源'));for(const s of rows||[]){const a=el('a',s.title);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';d.append(a);}target.append(d);}
  function image(id){const figure=el('figure',null,'bio-organ-preview');figure.append(renderMiniaturePreview(id,{width:360,height:220}),el('figcaption',(crops.get(id)?.name||id)+' · 器官放大的形态示意'));return figure;}
  function renderHome(){
    heading('认识其他 '+BIODIVERSITY_COURSES.length+' 个代表植物','从草原、雨林、苔原与城市，到森林、旱地、水域、蕨类与苔藓：先分清类群与生活方式，再用真实地区资料找环境线索。');
    const progress=biodiversityProgress();content.append(el('p',`已浏览 ${progress.viewed} / ${progress.total} · 已作答 ${progress.attempted} / ${progress.total} · 当前相符 ${progress.correct} 题。浏览与答题分别记录。`,'bio-progress'));
    const grid=el('div',null,'bio-paths');for(const path of BIODIVERSITY_PATHS){const ids=idsFor(path),card=button('',()=>go({view:'path',pathId:path.id}),'bio-path-card');card.append(el('strong',path.title),el('span',path.intro||path.description),el('small',`${ids.length} 个课程 · `+ids.slice(0,5).map(id=>byId.get(id)?.name).filter(Boolean).join(' · ')));grid.append(card);}content.append(grid);
    let last;try{last=JSON.parse(localStorage.getItem('plant-earth-biodiversity-location-v1')||'null');}catch{}if(last?.cropId&&byId.has(last.cropId))content.append(button('继续：'+byId.get(last.cropId).name,()=>go(last),'classroom-continue'));
    content.append(el('p','这些主线分别使用生境、生活型或植物类群作入口，并不是同一层级的分类树。原生与引入图、地区环境采样和形态模型分别回答不同问题。','classroom-note'));
  }
  function renderPath(){const p=pathFor(pathId);if(!p){renderHome();return;}header.append(button('← 全部植物课程',()=>go({view:'home'}),'classroom-back'));heading(p.title,p.intro||p.description);const list=el('div',null,'bio-course-list');for(const id of idsFor(p)){const c=byId.get(id);if(!c)continue;const card=button('',()=>go({view:'lesson',cropId:id}),'bio-course-card');const state=readBiodiversityProgress(),answer=state.answers[id];card.append(el('strong',c.name),el('span',c.definition),el('small',Number.isInteger(answer)?answer===c.question.correctIndex?'本题当前相符，可继续解释':'已作答，建议再比较':state.viewed.includes(id)?'浏览过，尚未作答':'形态 → 机制 → 地区 → 判断'));list.append(card);}content.append(list);}
  function renderQuestion(target,c){
    const q=c.question,answers=readBiodiversityProgress().answers,selected=answers[c.id];target.replaceChildren();target.append(el('h4',q.prompt));if(q.scenario)target.append(el('p',q.scenario));const options=el('div');options.setAttribute('role','group');options.setAttribute('aria-label',c.name+'理解题');
    q.options.forEach((value,index)=>{const b=button(String.fromCharCode(65+index)+' · '+value,()=>{saveBiodiversityAnswer(c.id,index);renderQuestion(target,c);target.querySelector(`[data-bio-answer="${index}"]`)?.focus({preventScroll:true});target.querySelector('.classroom-check-feedback')?.scrollIntoView({block:'nearest'});},'classroom-check-option'+(selected===index?' is-selected':''));b.dataset.bioAnswer=String(index);b.setAttribute('aria-pressed',String(selected===index));options.append(b);});target.append(options);
    if(Number.isInteger(selected)){const correct=selected===q.correctIndex,feedback=el('div',null,'classroom-check-feedback '+(correct?'is-correct':'needs-review'));feedback.setAttribute('role','status');feedback.append(el('strong',correct?'这个判断与资料相符':'再比较一下这些线索'),el('p',text(q.feedback[selected])),el('p',q.explanation));if(q.nextHint)feedback.append(el('p',q.nextHint));target.append(feedback,el('p','这里记录本题当前答案，不能代替对整个物种的理解。','classroom-note'));}else target.append(el('p','先选一个判断，再核对理由；可以改选，也可以稍后回来。','classroom-note'));
    sources(target,q.sources||c.sources);
  }
  function renderLesson(){const c=byId.get(cropId);if(!c)return;header.append(button('← '+(pathFor(c.pathId)?.title||'植物课程'),()=>go({view:'path',pathId:c.pathId}),'classroom-back'));heading(c.name,c.group||c.definition);
    if(lectureStatus){const status=el('p',lectureStatus,'classroom-lecture-status');status.setAttribute('role','status');header.append(status);}
    const tabs=el('div',null,'classroom-steps');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',c.name+'课程步骤');STEPS.forEach((title,index)=>{const b=button(`${index+1} ${title}`,()=>selectStep(index),'classroom-step');b.id='bio-step-'+index;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(step===index));b.setAttribute('aria-controls','bio-topic');tabs.append(b);});content.append(tabs);
    const body=el('section',null,'bio-topic');body.id='bio-topic';body.setAttribute('role','tabpanel');body.setAttribute('aria-labelledby','bio-step-'+step);
    if(step===0){body.append(el('h4','它属于什么类群，怎样辨认？'),el('p',c.definition),image(c.id),el('h4','观察这些器官'),el('p',text(c.organs)),el('p',c.misconception,'classroom-misconception'));}
    if(step===1){body.append(el('h4','环境线索怎样影响生长？'),el('p',text(c.environment)),el('h4','结构、作用与代价'),el('p',text(c.adaptations)),el('p','适应性是解释线索；不能由某种外形，直接推断它在所有地方都能生长。','classroom-note'));const region=evidenceRegion(regionalData,c.regionId);if(region)body.append(renderRegionalEvidence(region,{cropId:c.id,substrateNote:c.substrateNote,substrateKind:c.substrateKind,active:'climate'}));}
    if(step===2){const region=evidenceRegion(regionalData,c.regionId);body.append(el('h4','把解释放回真实地区'),renderRegionalEvidence(region,{cropId:c.id,substrateNote:c.substrateNote,substrateKind:c.substrateKind,active:'region'}));if(c.caseText||c.regionExplanation)body.append(el('p',c.caseText||c.regionExplanation));body.append(button('到真实地图核对原生与引入',()=>{intro.pause();onExplore?.(c.id,{play:false,caseRegionId:c.regionId});},'classroom-primary'));}
    if(step===3)renderQuestion(body,c);content.append(body);
    const nav=el('div',null,'classroom-lesson-nav'),back=button('上一步',()=>selectStep(step-1));back.disabled=step===0;nav.append(back);if(step<3)nav.append(button('下一步：'+STEPS[step+1],()=>selectStep(step+1),'classroom-primary'));else nav.append(button('接着看这个植物的真实地图',()=>{intro.pause();onContinue?.({courseScope:'biodiversity',cropId:c.id,regionId:c.regionId});},'classroom-primary'));if(step===3&&nextLectureId())nav.append(button('下一课并播放：'+byId.get(nextLectureId()).name,()=>continueLecture(),'classroom-next-lecture'));content.append(nav);sources(content,c.sources);
  }
  function render(){header.replaceChildren();content.replaceChildren();container.dataset.view=view;container.dataset.cropId=cropId||'';container.dataset.lessonStep=String(step);audioHost.hidden=view!=='lesson'||step===3;if(view==='home')renderHome();else if(view==='path')renderPath();else renderLesson();
    const c=view==='lesson'?byId.get(cropId):null;if(!c){onScene?.(null);return;}const beat=narrationPack?.chapters?.find(ch=>ch.cropId===c.id)?.beats?.[Math.min(step,2)];onScene?.({scope:'biodiversity',classId:'bio-'+c.id,cropId:c.id,step,title:c.name+' · '+STEPS[step],text:step===3?c.question.prompt:beat?.text||[c.definition+' '+text(c.organs),text(c.environment)+' '+text(c.adaptations),c.caseText||c.regionExplanation||'查看地区的逐月气候、土壤与水源资料。'][step],representativeIds:[c.id],regionId:c.regionId,action:step<3?beat?.action||{kind:['morphology','environment','region'][step],regionId:c.regionId}:{kind:'question',regionId:c.regionId},following});
  }
  render();
  return {showHome:()=>go({view:'home'}),showClass:id=>go({view:'lesson',cropId:id}),restoreUI:loc=>go(loc,{notify:false,focus:false}),getUIState:location,selectStep,pause:()=>intro.pause(),play:playCurrentCourse,playCurrentCourse,cancelContinuation:()=>intro.cancelContinuation(),
    showActive:()=>go({view:'lesson',cropId:byId.has(getCurrentCropId?.())?getCurrentCropId():cropId,step:2}),returnToLesson:()=>go({view:'lesson',cropId,step:2}),
    observe:id=>{if(byId.has(id))markBiodiversityViewed(id);},
    getContext:()=>{const c=byId.get(cropId),ids=idsFor(pathFor(c?.pathId));if(!c)return null;const current=getCurrentCropId?.(),index=ids.indexOf(current);return {classId:'bio-'+c.pathId,index:Math.max(0,index),total:ids.length,viewedCount:ids.filter(id=>readBiodiversityProgress().viewed.includes(id)).length,currentMatches:index>=0,representativeId:c.id};},
    getClass:()=>{const p=pathFor(pathId);return p?{id:'bio-'+p.id,group:p.title,representativeIds:idsFor(p)}:null;},
    move:delta=>{const ids=idsFor(pathFor(pathId)),index=ids.indexOf(getCurrentCropId?.()),id=ids[Math.max(0,Math.min(ids.length-1,index+delta))];if(id){cropId=id;onExplore?.(id,{play:false,caseRegionId:byId.get(id).regionId});}},
    resume:()=>{if(cropId)onExplore?.(cropId,{play:false,caseRegionId:byId.get(cropId).regionId});},clear:()=>{intro.pause();cropId=null;onScene?.(null);},snapshot:()=>readBiodiversityProgress(),
    setFollowing:value=>{following=!!value;render();report();}
  };
}
