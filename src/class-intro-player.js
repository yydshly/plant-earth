import {characterAtTime,timeAtCharacter,captionAtTime} from './narration-clock.js';
import {isAutoContinueEnabled,setAutoContinueEnabled,subscribeAutoContinue} from './playback-preferences.js';

const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)||0));
const stamp=value=>{const seconds=Math.max(0,Math.floor(Number(value)||0));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};

// Keep this container alive when the classroom replaces its surrounding DOM.
// Sentence timestamps are supplied by MiniMax; positions within a sentence are
// proportional estimates, using the same clock as the other guided lessons.
export function createClassIntroPlayer({container,pack,labels={},onStep=()=>{},onPlayingChange=()=>{},onEnded=()=>{},onPosition=()=>{}}){
  const words={listen:'听类别导学',pause:'暂停类别导学',resume:'继续类别导学',seek:'类别导学音频进度',rate:'类别导学播放速度',note:'MiniMax 配音 · 3 段导学，播放时同步切换。可暂停阅读，或点课堂步骤跳听。',autoLabel:'连续听讲，题目稍后回顾',autoAriaLabel:'植物课程连续听讲',autoOnNote:' 连续听讲已开启，理解题留待回顾。',autoOffNote:' 连续听讲已关闭，本课播完停在理解题。',sentenceCaptions:false,...labels};
  if(!container)throw new TypeError('A persistent class narration container is required');
  const chapters=new Map((pack?.chapters||[]).map(chapter=>[chapter.classId,chapter]));
  const recordings=new Map((pack?.manifest?.chapters||[]).map(recording=>[recording.id,recording]));
  let activeClass=null,chapter=null,recording=null,lastStep=null,reportedPlaying=false,pendingSeek=null,destroyed=false;
  let loadFailed=false,playFailed=false,continuationIntent=false,wantsPlayback=false,playToken=0,reportingPosition=false;
  const listeners=[];
  const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
  container.classList.add('class-intro-player');
  const style=make('style');
  style.textContent=`.class-intro-player{margin-top:12px;padding:12px;border:1px solid rgba(153,199,178,.3);border-radius:12px;background:rgba(8,28,31,.75);color:#edf8f0}.class-intro-player .class-intro-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.class-intro-player button,.class-intro-player select{font:inherit;color:inherit;border:1px solid rgba(153,199,178,.45);border-radius:7px;background:#173b3d;padding:6px 9px}.class-intro-player button:disabled,.class-intro-player input:disabled,.class-intro-player select:disabled{opacity:.5}.class-intro-player input[type=range]{flex:1;min-width:100px;accent-color:#8fd8b0}.class-intro-player .class-intro-time{font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.class-intro-player .class-intro-caption{font-size:13px;line-height:1.65;margin:10px 0 5px}.class-intro-player .class-intro-note{font-size:11px;line-height:1.5;color:#b3ccc2;margin:0}.class-intro-player .class-intro-rate{display:flex;align-items:center;gap:4px;font-size:12px}.class-intro-player .class-intro-auto{display:flex;align-items:center;gap:7px;font-size:11px;line-height:1.7;cursor:pointer;flex-basis:100%;padding-top:2px}.class-intro-player .class-intro-auto input{width:16px;height:16px;margin:0;flex:none;accent-color:#b6dba7}.class-intro-player :focus-visible{outline:2px solid #b6eccf;outline-offset:3px}`;
  const audio=make('audio');audio.preload='metadata';audio.hidden=true;
  const controls=make('div','class-intro-controls');
  const button=make('button','',words.listen);button.type='button';
  const seek=make('input');seek.type='range';seek.min='0';seek.max='0';seek.step='.05';seek.value='0';seek.setAttribute('aria-label',words.seek);
  const time=make('span','class-intro-time','0:00 / 0:00');time.setAttribute('aria-live','off');
  const rateLabel=make('label','class-intro-rate','语速');
  const rate=make('select');rate.setAttribute('aria-label',words.rate);
  for(const value of [.75,1,1.25,1.5]){const option=make('option','',`${value}×`);option.value=String(value);option.selected=value===1;rate.append(option);}
  rateLabel.append(rate);const autoLabel=make('label','class-intro-auto'),autoContinue=make('input');autoContinue.type='checkbox';autoContinue.checked=isAutoContinueEnabled();autoContinue.setAttribute('aria-label',words.autoAriaLabel);autoLabel.append(autoContinue,make('span','',words.autoLabel));controls.append(button,seek,time,rateLabel,autoLabel);
  const caption=make('p','class-intro-caption');caption.setAttribute('aria-live','polite');caption.setAttribute('aria-atomic','true');
  const note=make('p','class-intro-note','MiniMax 配音 · 3 段导学，播放时同步切换。可暂停阅读，或点课堂步骤跳听。');
  container.replaceChildren(style,audio,controls,caption,note);
  const listen=(element,event,handler)=>{element.addEventListener(event,handler);listeners.push(()=>element.removeEventListener(event,handler));};
  const available=()=>!!(chapter&&recording?.file&&recording?.cues?.length&&!loadFailed);
  const duration=()=>recording?.duration||0;
  const isPlaying=()=>!destroyed&&!audio.paused&&!audio.ended;
  const starts=()=>chapter?.beats.map((_,index)=>timeAtCharacter(chapter,recording,chapter.beats.slice(0,index).reduce((offset,beat)=>offset+beat.text.length,0)))||[];
  const stepNow=()=>{
    if(!chapter||!recording)return 0;
    const at=characterAtTime(chapter,recording,audio.currentTime);
    // Prefer cue-derived times at boundaries; characterAtTime also bounds the
    // estimate during gaps and is shared with the normal narration player.
    const offsets=chapter.beats.map((_,index)=>chapter.beats.slice(0,index).reduce((offset,beat)=>offset+beat.text.length,0));
    const times=starts();
    return Math.max(0,times.findLastIndex((start,index)=>audio.currentTime+.005>=start&&(index===0||at>=offsets[index]-1)));
  };
  const reportPlaying=()=>{const playing=isPlaying();if(playing!==reportedPlaying){reportedPlaying=playing;onPlayingChange(playing);}};
  const sync=(followStep=false)=>{
    if(destroyed)return;
    const valid=available(),current=clamp(audio.currentTime,0,duration()),index=stepNow();
    button.disabled=!valid;seek.disabled=!valid;rate.disabled=!valid;
    seek.max=String(duration());seek.value=String(current);seek.setAttribute('aria-valuetext',`${stamp(current)}，共 ${stamp(duration())}`);
    time.textContent=`${stamp(current)} / ${stamp(duration())}`;
    button.textContent=isPlaying()?words.pause:current>.1&&!audio.ended?words.resume:words.listen;
    button.setAttribute('aria-label',button.textContent);
    // Sentence cues use the provider's own timestamps. During a gap keep the
    // preceding sentence; before its first timestamp show the first cue.
    const beatStart=chapter?.beats.slice(0,index).reduce((n,b)=>n+b.text.length,0)||0;
    const sentence=words.sentenceCaptions===true&&valid?captionAtTime(chapter,recording,current,{startOffset:beatStart,endOffset:beatStart+(chapter.beats[index]?.text.length||0)}):null;
    const text=loadFailed?'音频暂时无法载入。你仍可按课堂步骤阅读。':!valid?'本类别暂无可用导学音频，请按课堂步骤阅读。':`导学 ${index+1}/3 · ${chapter.beats[index]?.title||''}：${sentence||chapter.beats[index]?.text||''}`;
    if(caption.textContent!==text)caption.textContent=text;
    note.textContent=playFailed?'播放未能开始，可再次点击播放，或继续阅读课堂内容。':words.note+(isAutoContinueEnabled()?words.autoOnNote:words.autoOffNote);
    if(followStep&&valid&&index!==lastStep){lastStep=index;onStep(index);}
    // Notify from the existing sentence/character clock. A listener may cause
    // synchronous UI work, but cannot recursively generate position reports.
    if(valid&&!reportingPosition){reportingPosition=true;try{onPosition?.({chapter,characterOffset:characterAtTime(chapter,recording,current),currentTime:current,playing:isPlaying(),step:index});}finally{reportingPosition=false;}}
  };
  const seekTo=(seconds,followStep)=>{
    pendingSeek=clamp(seconds,0,Math.max(0,duration()-.02));
    try{audio.currentTime=pendingSeek;pendingSeek=null;}catch{/* Apply once metadata is available. */}
    sync(followStep);
  };
  const cancelContinuation=()=>{continuationIntent=false;};
  const pause=()=>{cancelContinuation();wantsPlayback=false;playToken++;audio.pause();reportPlaying();sync(false);};
  const play=async({userInitiated=true}={})=>{
    if(destroyed||!available())return false;
    playFailed=false;wantsPlayback=true;continuationIntent=userInitiated===true;const token=++playToken;
    if(audio.ended)seekTo(0,false);
    const classWhenStarted=activeClass;
    try{await audio.play();if(token!==playToken||classWhenStarted!==activeClass||!wantsPlayback)return false;sync(true);return true;}
    catch{if(token===playToken&&classWhenStarted===activeClass){cancelContinuation();wantsPlayback=false;playFailed=true;sync(false);}return false;}
  };
  listen(button,'click',()=>isPlaying()?pause():play());
  // Seeking during active playback keeps the explicit continuous-listening
  // choice. Pausing or leaving the lesson still cancels continuation.
  listen(seek,'input',()=>{if(!isPlaying())cancelContinuation();seekTo(Number(seek.value),true);});
  listen(rate,'change',()=>{audio.playbackRate=Number(rate.value);});
  listen(autoContinue,'change',()=>setAutoContinueEnabled(autoContinue.checked));
  listen(audio,'loadedmetadata',()=>{if(pendingSeek!==null)seekTo(pendingSeek,false);sync(false);});
  listen(audio,'timeupdate',()=>sync(isPlaying()));
  listen(audio,'playing',()=>{if(!wantsPlayback){audio.pause();return;}reportPlaying();sync(true);});
  listen(audio,'pause',()=>{reportPlaying();sync(false);});
  listen(audio,'ended',()=>{
    if(destroyed||!audio.ended||!wantsPlayback)return;
    const result={classId:activeClass,chapterId:chapter?.id||null,userInitiated:continuationIntent,autoContinue:isAutoContinueEnabled()};
    cancelContinuation();wantsPlayback=false;reportPlaying();sync(false);onEnded(result);
  });
  listen(audio,'error',()=>{cancelContinuation();wantsPlayback=false;loadFailed=true;reportPlaying();sync(false);});
  listeners.push(subscribeAutoContinue(value=>{autoContinue.checked=value;if(!value)cancelContinuation();sync(false);}));
  const setClass=classId=>{
    if(destroyed||activeClass===classId)return;
    pause();activeClass=classId;chapter=chapters.get(classId)||null;recording=recordings.get(chapter?.id)||null;
    lastStep=null;pendingSeek=null;loadFailed=false;playFailed=false;
    audio.removeAttribute('src');
    if(recording?.file)audio.src=recording.file;
    audio.load();audio.playbackRate=Number(rate.value);sync(false);
  };
  const seekStep=index=>{
    if(!available())return false;
    if(!isPlaying())cancelContinuation();
    const step=clamp(Math.trunc(index),0,chapter.beats.length-1);
    // The caller already selected this classroom step. Avoid calling it back
    // recursively when it reattaches this persistent container.
    lastStep=step;seekTo(starts()[step],false);return true;
  };
  sync(false);
  return {element:container,setClass,pause,play,seekStep,isPlaying,cancelContinuation,
    getState:()=>({classId:activeClass,chapterId:chapter?.id||null,available:available(),playing:isPlaying(),step:stepNow(),currentTime:audio.currentTime,duration:duration(),continuationIntent}),
    destroy:()=>{if(destroyed)return;pause();destroyed=true;for(const remove of listeners)remove();audio.removeAttribute('src');audio.load();container.replaceChildren();}
  };
}
