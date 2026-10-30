import {getClassCheckProgress,sanitizeClassCheckAnswers} from './crop-class-checks.js';

// Separate from existing classroom routes and app reading history.
export const CLASS_CHECK_STORAGE_KEY='plant-earth-class-checks-v1';
let volatileAnswers={};
const failedWrites=new WeakMap();
const storageFor=value=>{if(value!==undefined)return value;try{return globalThis.localStorage;}catch{return null;}};
const canCache=target=>target!==null&&(typeof target==='object'||typeof target==='function');

export function readClassCheckAnswers(storage){
  const target=storageFor(storage);
  if(!target?.getItem)return {...volatileAnswers};
  try{const raw=target.getItem(CLASS_CHECK_STORAGE_KEY);const answers={...sanitizeClassCheckAnswers(raw?JSON.parse(raw):{}),...(canCache(target)?failedWrites.get(target):{})};volatileAnswers=answers;return {...answers};}
  catch{return {...(canCache(target)?failedWrites.get(target):null),...volatileAnswers};}
}

// Merge valid answers, rather than replacing the rest of a learner's history.
// Storage denial leaves this session usable and never clears older app keys.
export function saveClassCheckAnswers(input,storage){
  const answers={...readClassCheckAnswers(storage),...sanitizeClassCheckAnswers(input)};
  volatileAnswers=answers;const target=storageFor(storage);
  try{if(target?.setItem){target.setItem(CLASS_CHECK_STORAGE_KEY,JSON.stringify(answers));if(canCache(target))failedWrites.delete(target);}}
  catch{if(canCache(target))failedWrites.set(target,answers);}
  return {...answers};
}

export function saveClassCheckAnswer(questionId,index,storage){return saveClassCheckAnswers({[questionId]:index},storage);}
export function getStoredClassCheckProgress(storage){return getClassCheckProgress(readClassCheckAnswers(storage));}
