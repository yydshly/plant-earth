import {createGuidedJourney} from './guided-journey.js';
import {CROP_CLASSES} from './crop-class-content.js';
import {BIODIVERSITY_COURSES,BIODIVERSITY_PATHS} from './biodiversity-content.js';
import {biodiversityProgress} from './biodiversity-model.js';
import {mountClassQuiz} from './crop-class-quiz.js';
import {readClassCheckAnswers,saveClassCheckAnswer,getStoredClassCheckProgress} from './class-check-store.js';
import {readOpenedTopics,renderTeachingFocus} from './teaching-focus.js';

const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const button=(text,action)=>{const b=el('button',text);b.type='button';b.onclick=action;return b;};

// Navigation coordinates are separate from original lesson answers and audio.
export function connectGuidedLearning({learning,globalEvidence,audio,onLayout,onOpenDirectory}){
  let navigating=false,journey,navigationEpoch=0;
  const rememberWelcome=()=>{try{localStorage.setItem('plant-earth-welcome-v2','seen');}catch{}};
  const mapLocation=location=>({...location,label:(location.cropName||location.cropId||'植物')+' · '+(location.tourIndex>=0?'读图 '+(location.tourIndex+1)+' / 3':'看全球与地区')});
  const classLocation=loc=>{const c=loc.courseScope==='biodiversity'?BIODIVERSITY_COURSES.find(c=>c.id===loc.cropId):CROP_CLASSES.find(c=>c.id===loc.classId),q=loc.questionPath??journey?.getState().locations?.classes?.questionPath,questionPath=q==='grains'&&loc.classId==='grains'||q==='ginkgo'&&loc.courseScope==='biodiversity'&&loc.cropId==='ginkgo'?q:null;return {...loc,questionPath,label:c?(c.name||c.group)+' · '+(loc.step+1)+' / 4':loc.courseScope==='biodiversity'?'其他代表植物 · '+BIODIVERSITY_COURSES.length+'课':'农业与园艺 · 四条主线'};};
  const pause=()=>{audio.pause();globalEvidence.pause();};
  function playCurrentGuidedNarration(){
    if(!journey?.isActive())return false;const stage=journey.getState().stage;
    if(stage==='foundation'||stage==='environments')return learning.playVisibleNarration?.()||false;
    if(stage==='classes')return globalEvidence.playCurrentCourse?.()||false;
    if(stage==='map')return globalEvidence.playGlobalNarration?.()||false;
    return false;
  }
  function continueVoice(stage){queueMicrotask(()=>{if(journey?.isActive()&&journey.getState().stage===stage)playCurrentGuidedNarration();});}
  function freelyExplore(){navigating=true;try{learning.close();globalEvidence.setGuidedStage(null);globalEvidence.open(globalEvidence.getState().cropId);globalEvidence.openCatalogue();}finally{navigating=false;}}
  function navigate(stage,{location={},fresh=false}={}){
    const epoch=++navigationEpoch;
    navigating=true;
    try{
      globalEvidence.setGuidedStage(stage);
      if(stage==='foundation'||stage==='environments'){
        globalEvidence.close({silent:true});learning.openStage(stage,stage==='foundation'?{foundationIndex:0,...location}:{index:0,view:'environment',...location});
      }else if(stage==='classes'){
        learning.close();globalEvidence.open(location.cropId||globalEvidence.getState().cropId);
        globalEvidence.openClassroom(location.classId,Object.keys(location).length?location:undefined);
      }else if(stage==='map'){
        learning.close();globalEvidence.open(location.cropId||globalEvidence.getState().cropId,location.mode);
        globalEvidence.restoreMap(fresh?{...location,fullMap:false}:location);
      }else if(stage==='review'){const reference=globalEvidence.getState().cropId;learning.close();globalEvidence.open(reference);globalEvidence.setGuidedStage('review');globalEvidence.setReviewContext?.(true,{cropId:reference});}else{globalEvidence.close({silent:true});learning.close();}
    }finally{navigating=false;onLayout?.();}
    // The shell ignores synchronous reports while it is navigating. Capture
    // the resulting position once that transition is complete, before a later
    // free exploration can change the selected plant.
    queueMicrotask(()=>{
      if(epoch!==navigationEpoch||!journey.isActive()||journey.getState().stage!==stage)return;
      if(stage==='classes')journey.report({stage,location:classLocation({...globalEvidence.getClassUI(),cropId:globalEvidence.getClassUI().cropId||globalEvidence.getState().cropId})});
      else if(stage==='map')journey.report({stage,location:mapLocation(globalEvidence.getState())});
      else if(stage==='foundation'||stage==='environments'){
        const state=learning.getState();journey.report({stage,location:{foundationIndex:state.foundationIndex,index:state.index,view:state.view,selectedPlantId:state.selectedPlantId,bridge:state.stage==='bridge',label:stage==='foundation'?`基础 ${state.foundationIndex+1} / 7`:`案例 ${state.index+1} / 6`}});
      }
    });
  }
  function legacyExercise(stage){journey.pauseForExplore();navigating=true;try{globalEvidence.close({silent:true});learning.openStage(stage);}finally{navigating=false;}}
  function review(){
    const root=el('div',null,'course-review'),state=learning.getState(),progress=getStoredClassCheckProgress(),bioProgress=biodiversityProgress();
    const topics=readOpenedTopics(),takeaways=el('section',null,'course-review-takeaways');takeaways.append(el('h2','把最近的观察连成解释'));
    takeaways.append(el('p','以下是最近打开主题的关键解释，可回到原课核对。它们是回顾线索；能否独立解释，由你结合证据判断。','course-review-note'));
    if(!topics.length){takeaways.append(el('p','还没有主题记录。可以先比较三大主粮，或选择银杏核对原生与引入的含义。'));const choices=el('div',null,'course-review-links');choices.append(button('观察三大主粮',()=>journey.navigate('classes',{courseScope:'agriculture',view:'lesson',classId:'grains',pathId:'staples',cropId:'rice',step:0})),button('认识银杏与地区记录',()=>journey.navigate('classes',{courseScope:'biodiversity',view:'lesson',cropId:'ginkgo',pathId:'seed-lineages',step:0})));takeaways.append(choices);}
    for(const topic of topics.slice(0,3)){const card=el('article',null,'course-review-topic');card.append(el('h3',topic.title));renderTeachingFocus(card,topic,{remember:false});const t=topic.target;if(t?.stage&&['foundation','environments','classes','map'].includes(t.stage))card.append(button('回到这个主题核对',()=>journey.navigate(t.stage,t.location)));else if(t?.regionId)card.append(button('回到地区证据',()=>{journey.pauseForExplore();globalEvidence.openRegionalCourse?.({regionId:t.regionId,cropId:t.cropId,step:t.step,comparison:t.comparison});}));takeaways.append(card);}root.append(takeaways);
    const extra=el('section');extra.append(el('h2','换一个角度，试着解释'));const actions=el('div',null,'course-review-links');actions.append(button('比较水稻、小麦和玉米',()=>legacyExercise('crops')),button('面对新地区，选依据并解释',()=>legacyExercise('transfer')));extra.append(actions,el('p','练习会保留综合回顾的位置，可从“学习起点 → 继续学习”返回。','course-review-note'));root.append(extra);
    const counts=el('div',null,'course-review-counts');
    for(const [title,value,note] of [
      ['地球基础',`${state.foundationViewed.length} / 7`,'浏览过的基础章节'],
      ['生态案例',`${state.answered} / 6`,'已作答；当前相符 '+state.correct+' 题'],
      ['农业分类',`${progress.classAttempted} / 13`,'已作答；当前相符 '+progress.classCorrect+' 题'],
      ['其他植物',`${bioProgress.attempted} / ${bioProgress.total}`,'已作答；当前相符 '+bioProgress.correct+' 题']
    ]){const card=el('div');card.append(el('span',title),el('strong',value),el('small',note));counts.append(card);}
    const records=el('details',null,'course-review-records');records.append(el('summary','查看浏览、作答记录与待回看课程'),counts,el('p','这些记录帮助找到下一步；播放完成和答案相符不等于已经能独立解释。','course-review-note'));
    const revisit=el('section');revisit.append(el('h2','下一步补看哪里？'));
    const links=el('div',null,'course-review-links');
    const needs=[...progress.needsReviewClassIds,...progress.unansweredClassIds];
    for(const id of needs){const c=CROP_CLASSES.find(c=>c.id===id);if(c)links.append(button(c.group+(progress.needsReviewClassIds.includes(id)?' · 回看解释':' · 还未作答'),()=>journey.navigate('classes',{view:'lesson',classId:id,pathId:c.pathId,step:3})));}
    if(!needs.length)links.append(el('p','13 类题的当前选择都相符。试着换一种代表植物，检验自己能否解释。'));
    revisit.append(links);records.append(revisit);
    const bioReview=el('section');bioReview.append(el('h2','其他植物：从未答与需要重看的课继续'));
    for(const path of BIODIVERSITY_PATHS){const details=el('details'),ids=path.courseIds||[],pending=ids.filter(id=>bioProgress.needsReviewIds.includes(id)||bioProgress.unansweredIds.includes(id));details.append(el('summary',path.title+' · 待回看或作答 '+pending.length+' / '+ids.length));const actions=el('div',null,'course-review-links');for(const id of pending){const c=BIODIVERSITY_COURSES.find(c=>c.id===id);actions.append(button(c.name+(bioProgress.needsReviewIds.includes(id)?' · 回看理由':' · 还未作答'),()=>journey.navigate('classes',{courseScope:'biodiversity',view:'lesson',cropId:id,pathId:c.pathId,step:3})));}if(!pending.length)actions.append(el('p','本组当前答案相符；可回到真实地区证据，尝试独立解释。'));details.append(actions);bioReview.append(details);}records.append(bioReview);
    const quiz=el('section');records.append(quiz);
    mountClassQuiz(quiz,{classId:'review',answers:readClassCheckAnswers(),onAnswer:(id,index)=>saveClassCheckAnswer(id,index)});
    const explanation=el('section',null,'course-self-explanation');explanation.append(el('h2','用自己的话解释一种植物'));
    const label=el('label','选一种植物，写出：利用什么器官、一个有来源的地区事实，以及至少一个还需要核实的环境条件。');
    const textarea=el('textarea');textarea.rows=5;textarea.placeholder='例如：先写地图中的年份、单位和地区，再说明还需要当地哪种环境证据。';textarea.setAttribute('aria-label','我的植物解释');
    const status=el('p','内容只保存在当前浏览器，不会自动判断对错。','course-review-note');
    try{textarea.value=localStorage.getItem('plant-earth-self-explanation-v1')||'';}catch{}
    textarea.oninput=()=>{try{localStorage.setItem('plant-earth-self-explanation-v1',textarea.value);status.textContent='解释已保存到当前浏览器；请用下方三项自查。';}catch{status.textContent='浏览器未能保存，请保留你的文字。';}};
    label.append(textarea);const rubric=el('ul');['事实：说明记录来自哪里、哪一年、用什么单位。','解释：把温度、水分、季节或土壤与植物需要联系起来。','边界：不把国家总产量当作当地适生性，不把引入野生记录当作种植范围。'].forEach(t=>rubric.append(el('li',t)));explanation.append(label,status,rubric);root.append(explanation);
    root.append(records,el('p','球面保留当前参考植物，方便核对地理位置；它不是理解题的答案。可返回主题重新观察或重听。','course-review-note'));
    root.append(el('p',`当前图鉴有 ${globalThis.ATLAS_DATA.catalogue.entryCount} 条目，植物课程包含 13 类农业与园艺学习单元和 ${globalThis.ATLAS_DATA.catalogue.biodiversityCount} 个其他代表植物的独立课程，并连接真实地区气候、土壤与水源资料。区域统计和植物地理记录并不等于全球每块土地的种植建议。`,'course-review-note'));
    return root;
  }
  const old=learning.getState(),oldStage=old.resumeStage==='bridge'?'environments':['foundation','environments'].includes(old.resumeStage)?old.resumeStage:null;
  journey=createGuidedJourney({onOpenDirectory,onRegionalExplore:()=>globalEvidence.openRegionalCourse?.(),regionalCount:globalEvidence.getRegionalCount?.()||25,onNavigate:navigate,onExplore:freelyExplore,onPause:pause,onLayout,getReview:review,onHomeDismiss:rememberWelcome,onStartVoice:playCurrentGuidedNarration,onResumeVoice:playCurrentGuidedNarration,
    initialProgress:oldStage?{resume:{stage:oldStage,location:{foundationIndex:old.foundationIndex,index:old.index,view:old.view,selectedPlantId:old.selectedPlantId,bridge:old.resumeStage==='bridge'}},visited:[]}:undefined});
  for(const selector of ['.topbar','.imm-header-actions','.learn-header-actions','.global-head-actions']){
    const parent=document.querySelector(selector);if(!parent)continue;const b=button('学习导航',()=>journey.showHome({preserveView:true}));b.className='course-home-button';b.title='选择观看问题、继续学习或按模块查阅';parent.prepend(b);
  }
  const globalGuide=document.getElementById('global-exit');if(globalGuide){globalGuide.textContent='学习导航 · 从这里开始';globalGuide.classList.add('site-guide-primary');globalGuide.onclick=()=>journey.showHome({preserveView:true});}
  // The old module's route button now returns to the shared entry.
  const routeHome=document.getElementById('learn-route-home');if(routeHome)routeHome.onclick=()=>journey.showHome();
  return {
    showHome:()=>journey.showHome(),
    offerOrientation(){let seen=false;try{seen=localStorage.getItem('plant-earth-welcome-v2')==='seen';}catch{}if(!seen){journey.showHome({preserveView:true});return true;}return false;},
    playCurrentNarration:playCurrentGuidedNarration,
    openModule(stage,location,{play=false}={}){const target=journey.navigate(stage,location);if(!target)return false;if(play===true)playCurrentGuidedNarration();return true;},
    isNavigating:()=>navigating,
    isActive:()=>journey.isActive(),
    onLearningProgress(location){if(navigating||!journey.isActive())return;const stage=location.stage==='bridge'?'environments':location.stage;if(!['foundation','environments'].includes(stage))return;journey.report({stage,location:{...location,bridge:location.stage==='bridge',label:stage==='foundation'?`基础 ${location.foundationIndex+1} / 7`:`案例 ${location.index+1} / 6`}});},
    onStageNext(stage,options={}){if(!navigating&&journey.isActive()&&journey.getState().stage===stage){journey.next();if(options.autoplay&&stage==='environments')continueVoice('classes');return true;}return false;},
    onRouteHome(){if(journey.isActive()){journey.showHome();return true;}return false;},
    getStageNextLabel:stage=>journey.isActive()?(stage==='environments'?'接着认识作物类别':'接着看生态案例'):null,
    onClassProgress(location){if(navigating||!journey.isActive()||journey.getState().stage!=='classes')return;journey.report({stage:'classes',location:classLocation({...location,cropId:location.cropId||globalEvidence.getState().cropId})});},
    onMapProgress(location){if(navigating||!journey.isActive()||journey.getState().stage!=='map')return;journey.report({stage:'map',location:mapLocation(location)});},
    onOpenCourse(location){if(!navigating&&journey.isActive()&&journey.getState().stage!=='classes'){journey.navigate('classes',location);return true;}return false;},
    onCourseNext(input={}){if(input.courseScope==='biodiversity'){if(journey.isActive())journey.navigate('map',{cropId:input.cropId,caseRegionId:input.regionId,mode:'botanical',fullMap:false});else{globalEvidence.open(input.cropId,'botanical');globalEvidence.restoreMap({cropId:input.cropId,caseRegionId:input.regionId,mode:'botanical',fullMap:false});}if(input.autoplay)continueVoice('map');return;}if(journey.isActive()){const stage=journey.getState().stage,c=CROP_CLASSES.find(c=>c.id===input.classId);if(stage==='classes'&&c){const current=globalEvidence.getState().cropId;journey.navigate('map',{cropId:journey.getState().location.questionPath==='grains'?'rice':c.representativeIds.includes(current)?current:c.representativeIds[0],mode:'production',fullMap:false});}else if(stage==='classes'||stage==='map')journey.next();if(input.autoplay)continueVoice('map');}else{globalEvidence.open(globalEvidence.getState().cropId);globalEvidence.restoreMap({fullMap:false});}},
    onLectureComplete(input){if(!journey.isActive()||journey.getState().stage!=='classes')return false;const q=journey.getState().location.questionPath;if(input.beforeNext&&!(q==='grains'&&input.classId==='grains'||q==='ginkgo'&&input.cropId==='ginkgo'))return false;this.onCourseNext({...input,autoplay:true});return true;},
    onGlobalClose({silent=false}={}){if(silent||navigating)return true;journey.showHome();return true;},
    onLearningClose(){if(!navigating&&journey.isActive())journey.pauseForExplore();},
    pauseForExplore:()=>{globalEvidence.setGuidedStage(null);journey.pauseForExplore();},getState:()=>journey.getState()
  };
}
