import {getNarrationScenes} from './narration-scenes.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number.isFinite(value)?value:min));

// Provider cue boundaries are exact. Positions inside a cue are proportional
// estimates; they must not be described as word-level forced alignment.
export function characterAtTime(chapter,recording,time){
  const cues=recording?.cues||[],t=Math.max(0,Number(time)||0);
  const cue=cues.find(c=>t>=c.start&&t<c.end)||cues.findLast(c=>c.start<=t);
  if(!cue)return 0;
  const start=Number.isFinite(cue.textStart)?cue.textStart:0;
  const end=Number.isFinite(cue.textEnd)?cue.textEnd:start+(cue.text?.length||0);
  return Math.round(clamp(start+clamp((t-cue.start)/Math.max(.001,cue.end-cue.start),0,1)*(end-start),0,chapter.text.length));
}

export function timeAtCharacter(chapter,recording,offset){
  const cues=recording?.cues||[],at=clamp(offset,0,chapter.text.length);
  const cue=cues.find(c=>Number.isFinite(c.textStart)&&Number.isFinite(c.textEnd)&&at>=c.textStart&&at<c.textEnd)
    ||cues.find(c=>Number.isFinite(c.textStart)&&c.textStart>=at)||cues.at(-1);
  if(!cue)return 0;
  const fraction=clamp((at-(cue.textStart||0))/Math.max(1,(cue.textEnd??chapter.text.length)-(cue.textStart||0)),0,1);
  return clamp(cue.start+fraction*(cue.end-cue.start),0,Math.max(0,(recording?.duration||cue.end)-.02));
}

// Keep the displayed sentence inside its provider cue and optional lesson
// bounds. Splits within a long cue use the same character estimate as scenes;
// this does not create or claim new word-level audio alignment.
export function captionAtTime(chapter,recording,time,{startOffset=0,endOffset=chapter?.text?.length||0}={}){
  const source=chapter?.text||'',cues=recording?.cues||[],t=Math.max(0,Number(time)||0);
  const cue=cues.find(c=>t>=c.start&&t<c.end)||cues.findLast(c=>c.start<=t)||cues[0];
  let begin=Math.max(0,startOffset,Number.isFinite(cue?.textStart)?cue.textStart:0),end=Math.min(source.length,endOffset,Number.isFinite(cue?.textEnd)?cue.textEnd:source.length);
  if(end<=begin){begin=Math.max(0,startOffset);end=Math.min(source.length,endOffset);}
  if(end<=begin)return '';
  const at=clamp(characterAtTime(chapter,recording,t),begin,Math.max(begin,end-1)),span=source.slice(begin,end);
  for(const sentence of span.matchAll(/[^。！？\n]+[。！？\n]?/gu)){
    if(at<begin+sentence.index+sentence[0].length)return sentence[0].trim();
  }
  return span.trim();
}

export function sceneAtCharacter(scenes,offset){
  if(!scenes?.length)return null;
  return scenes.findLast(scene=>scene.anchorOffset<=offset)||scenes[0];
}

export function scenesForPlayback(chapter,recording,range,crops){
  const scenes=getNarrationScenes(chapter,crops);
  if(!scenes.length)return [];
  if(!range)return scenes;
  const start=characterAtTime(chapter,recording,range.start),end=characterAtTime(chapter,recording,range.end);
  const first=sceneAtCharacter(scenes,start);
  const selected=[{...first,anchorOffset:start,id:first.id+'-clip'},...scenes.filter(scene=>scene.anchorOffset>start&&scene.anchorOffset<end)];
  return selected.map((scene,index)=>({...scene,stepIndex:index,stepCount:selected.length}));
}
