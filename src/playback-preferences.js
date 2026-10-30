// Playback preference and playback intent are different. This module persists
// only the learner's setting; opening a page never creates a request to play.
export const PLAYBACK_PREFERENCES_KEY='plant-earth-playback-v1';
let initialized=false,enabled=true,saved={};
const listeners=new Set();
function initialize(){
  if(initialized)return;initialized=true;
  try{const value=JSON.parse(globalThis.localStorage?.getItem(PLAYBACK_PREFERENCES_KEY)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value)){saved=value;if(typeof value.autoContinue==='boolean')enabled=value.autoContinue;}}catch{}
}
function publish(){
  for(const listener of [...listeners]){try{listener(enabled);}catch{}}
  try{globalThis.window?.dispatchEvent(new CustomEvent('plant-earth-autoplay-change',{detail:{enabled}}));}catch{}
}
export function isAutoContinueEnabled(){initialize();return enabled;}
export function setAutoContinueEnabled(value){
  initialize();const next=value===true;if(next===enabled)return enabled;enabled=next;
  saved={...saved,autoContinue:enabled};try{globalThis.localStorage?.setItem(PLAYBACK_PREFERENCES_KEY,JSON.stringify(saved));}catch{}
  publish();return enabled;
}
export function subscribeAutoContinue(listener){initialize();if(typeof listener!=='function')return ()=>{};listeners.add(listener);return ()=>listeners.delete(listener);}
try{globalThis.window?.addEventListener('storage',event=>{
  if(event.key!==PLAYBACK_PREFERENCES_KEY)return;
  let next=true;try{const value=JSON.parse(event.newValue||'{}');if(value&&typeof value.autoContinue==='boolean')next=value.autoContinue;}catch{return;}
  initialize();if(next!==enabled){enabled=next;publish();}
});}catch{}
