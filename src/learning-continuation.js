import {FOUNDATION_STEPS} from './foundation-content.js';
import {LEARNING_STOPS} from './learning-content.js';

// Decide only from the visible lesson and the source that actually finished.
// A loaded audio file, a hidden view or an interaction answer is not intent to
// continue. The host supplies allowContinue for its current playback session.
export function planLearningContinuation(state={},playback={}){
  if(!state.enabled||playback.natural!==true||playback.allowContinue!==true||playback.autoContinue!==true)return null;
  const {stage,chapterId}= {stage:state.stage,chapterId:playback.chapterId};
  if(stage==='foundation'){
    const index=state.foundationIndex,step=FOUNDATION_STEPS[index];
    if(!step||chapterId!=='foundation-'+step.id)return null;
    return index<FOUNDATION_STEPS.length-1?{type:'foundation',index:index+1}:{type:'stage',stage:'foundation'};
  }
  if(stage!=='environments')return null;
  const stop=LEARNING_STOPS[state.index];if(!stop)return null;
  if(state.view==='environment')return chapterId==='learn-'+stop.id?{type:'plants'}:null;
  if(state.view==='plants'&&chapterId!==playback.plantChapterId)return null;
  if(state.view==='question'&&chapterId!=='learn-'+stop.id)return null;
  if(!['plants','question'].includes(state.view))return null;
  return state.index<LEARNING_STOPS.length-1?{type:'environment',index:state.index+1}:{type:'stage',stage:'environments'};
}
