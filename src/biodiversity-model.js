import {BIODIVERSITY_COURSES} from './biodiversity-content.js';

export const BIODIVERSITY_STORAGE='plant-earth-biodiversity-course-v1';
const courses=new Map(BIODIVERSITY_COURSES.map(c=>[c.id,c]));
const validAnswer=(id,index)=>courses.has(id)&&Number.isInteger(index)&&index>=0&&index<courses.get(id).question.options.length;
export function sanitizeBiodiversityProgress(input={}){
  const source=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const answers=Object.fromEntries(Object.entries(source.answers||{}).filter(([id,index])=>validAnswer(id,index)));
  const viewed=[...new Set((Array.isArray(source.viewed)?source.viewed:[]).filter(id=>courses.has(id)))];
  return {answers,viewed};
}
let fallback={answers:{},viewed:[]},unflushed=false;
export function readBiodiversityProgress(){try{const saved=sanitizeBiodiversityProgress(JSON.parse(localStorage.getItem(BIODIVERSITY_STORAGE)||'{}'));fallback=unflushed?{answers:{...saved.answers,...fallback.answers},viewed:[...new Set([...saved.viewed,...fallback.viewed])]}:saved;}catch{}return {answers:{...fallback.answers},viewed:[...fallback.viewed]};}
export function saveBiodiversityAnswer(id,index){const state=readBiodiversityProgress();if(validAnswer(id,index))state.answers[id]=index;return persist(state);}
export function markBiodiversityViewed(id){const state=readBiodiversityProgress();if(courses.has(id)&&!state.viewed.includes(id))state.viewed.push(id);return persist(state);}
function persist(state){fallback=sanitizeBiodiversityProgress(state);try{localStorage.setItem(BIODIVERSITY_STORAGE,JSON.stringify(fallback));unflushed=false;}catch{unflushed=true;}return {answers:{...fallback.answers},viewed:[...fallback.viewed]};}
export function biodiversityProgress(input=readBiodiversityProgress()){
  const state=sanitizeBiodiversityProgress(input),answered=Object.keys(state.answers),correct=answered.filter(id=>state.answers[id]===courses.get(id).question.correctIndex);
  return {total:BIODIVERSITY_COURSES.length,viewed:state.viewed.length,attempted:answered.length,correct:correct.length,
    needsReviewIds:answered.filter(id=>!correct.includes(id)),unansweredIds:BIODIVERSITY_COURSES.filter(c=>!answered.includes(c.id)).map(c=>c.id)};
}
