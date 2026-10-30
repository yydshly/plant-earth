import {createCropClassroom} from './crop-classroom.js';
import {createBiodiversityClassroom} from './biodiversity-classroom.js';
import {BIODIVERSITY_COURSES} from './biodiversity-content.js';

export function createPlantCourseHub(api){
  const {container,data}=api;let scope='agriculture',agriculture,biodiversity;
  const tabs=document.createElement('div');tabs.className='plant-course-scopes';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','选择植物课程范围');
  const buttons=['农业与园艺 · '+data.crops.filter(c=>c.collection==='agriculture').length+' 条目','其他代表植物 · '+BIODIVERSITY_COURSES.length+' 课'].map((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>showScope(i?'biodiversity':'agriculture',true);tabs.append(b);return b;});
  const cropHost=document.createElement('div'),bioHost=document.createElement('div');cropHost.id='agriculture-classroom';bioHost.id='biodiversity-classroom';container.replaceChildren(tabs,cropHost,bioHost);
  const current=()=>scope==='biodiversity'?biodiversity:agriculture;
  function showScope(next,home=false){agriculture?.pause();biodiversity?.pause();scope=next==='biodiversity'?'biodiversity':'agriculture';container.dataset.courseScope=scope;cropHost.hidden=scope!=='agriculture';bioHost.hidden=scope!=='biodiversity';agriculture?.setActive(scope==='agriculture');biodiversity?.setActive(scope==='biodiversity');buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===(scope==='biodiversity'?1:0))));if(home)current()?.showHome();else api.onScene?.(null);api.onChange?.();}
  const report=kind=>loc=>api.onProgress?.({...loc,courseScope:kind});
  const scene=kind=>value=>{if(scope===kind)api.onScene?.(value?{...value,scope:kind}:null);};
  agriculture=createCropClassroom({...api,container:cropHost,narrationPack:data.classroomNarration,onLectureComplete:input=>api.onLectureComplete?.(input),onProgress:report('agriculture'),onScene:scene('agriculture'),onBrowse:options=>{if(options.collection==='biodiversity')showScope('biodiversity',true);else api.onBrowse?.(options);}});
  biodiversity=createBiodiversityClassroom({...api,container:bioHost,narrationPack:data.biodiversityNarration,regionalData:data.regionalEnvironment,onLectureComplete:input=>api.onLectureComplete?.(input),onProgress:report('biodiversity'),onScene:scene('biodiversity')});
  showScope('agriculture');
  const invoke=key=>(...args)=>current()?.[key]?.(...args);
  return {showHome:()=>{showScope('agriculture');agriculture.showHome();},showClass:id=>{if(BIODIVERSITY_COURSES.some(c=>c.id===id)){showScope('biodiversity');biodiversity.showClass(id);}else{showScope('agriculture');agriculture.showClass(id);}},
    openBiodiversity:(id,location)=>{showScope('biodiversity');if(location)biodiversity.restoreUI(location);else if(id)biodiversity.showClass(id);else biodiversity.showHome();},
    restoreUI:location=>{showScope(location.courseScope);current().restoreUI(location);},
    getUIState:()=>({...current().getUIState(),courseScope:scope}),selectStep:invoke('selectStep'),pause:()=>{agriculture.pause();biodiversity.pause();},play:invoke('playCurrentCourse'),playCurrentCourse:invoke('playCurrentCourse'),cancelContinuation:invoke('cancelContinuation'),
    observe:id=>{agriculture.observe(id);biodiversity.observe(id);},classesForCrop:agriculture.classesForCrop,
    getContext:invoke('getContext'),getClass:invoke('getClass'),returnToLesson:invoke('returnToLesson'),showActive:invoke('showActive'),move:invoke('move'),resume:invoke('resume'),clear:invoke('clear'),snapshot:invoke('snapshot'),setFollowing:invoke('setFollowing'),
    destroy:()=>{agriculture?.destroy();biodiversity?.destroy();container.replaceChildren();}};
}
