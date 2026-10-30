import {CROP_CLASSES} from './crop-class-content.js';
import {BIODIVERSITY_COURSES} from './biodiversity-content.js';
import {FOUNDATION_STEPS} from './foundation-content.js';
import {LEARNING_STOPS} from './learning-content.js';

// These summaries reuse the published course text. They are viewing aids,
// not new recordings, occurrence records or an assessment of understanding.
const STORAGE='plant-earth-opened-topics-v1';
const text=value=>Array.isArray(value)?value.join(' '):String(value||'');
const firstSentences=value=>text(value).match(/[^。！？]+[。！？]?/gu)?.slice(0,2).join('')||'';
const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value)n.textContent=value;if(cls)n.className=cls;return n;};
const sources=value=>(value||[]).filter(s=>s?.url&&/^https?:\/\//.test(s.url)).slice(0,3).map(s=>({title:s.title||'课程来源',url:s.url}));

export function courseTeachingFocus(scene){
  if(!scene||scene.step===3)return null;
  const bio=scene.scope==='biodiversity',c=(bio?BIODIVERSITY_COURSES:CROP_CLASSES).find(c=>c.id===(bio?scene.cropId:scene.classId));
  if(!c)return null;
  const step=Math.max(0,Math.min(2,scene.step||0)),representative=c.representatives?.find(p=>p.id===scene.spokenPlantId);
  return {key:(bio?'bio:':'class:')+c.id,title:bio?c.name:c.group,
    question:bio?['怎样辨认'+c.name+'，最容易误认什么？','这些环境条件怎样影响'+c.name+'？','这个地区的资料能解释什么？'][step]:['这些植物为什么归在同一用途类？','我们利用的究竟是什么器官？',c.compareQuestion||c.question][step],
    conclusion:bio?[firstSentences(c.organs),firstSentences(c.environment),firstSentences(c.caseText||c.regionExplanation||c.evidenceChecks?.climate)][step]:[c.definition,c.organ,c.environment][step],
    clue:bio?[c.misconception,'结合形态与环境资料；外形本身不能证明分布原因。','核对地区气候、根区与水源；教学采样点不是植株观测。'][step]:[c.misconception,c.distinguish,representative?'当前活动植物：'+representative.note+' 球面定位为它自己的地区示例。':c.misconception][step],
    sources:sources(c.sources),target:{stage:'classes',location:{courseScope:bio?'biodiversity':'agriculture',view:'lesson',cropId:bio?c.id:scene.spokenPlantId||c.representativeIds[0],classId:bio?undefined:c.id,pathId:c.pathId,step}}};
}

export function regionalTeachingFocus({scene,region,chapter,profile}={}){
  if(!scene||!region||scene.view==='home'||scene.view==='overview')return null;
  const key=scene.evidence||'climate';
  const comparison=scene.comparison&&profile;
  const conclusion=comparison?{climate:[profile.temperatureNote,profile.season?.explanation].filter(Boolean).join(' '),soil:[profile.soil?.texture,profile.soil?.drainage].filter(Boolean).join(' '),water:[profile.water?.summary,profile.water?.timing].filter(Boolean).join(' ')}[key]:chapter?.explanations?.[key]||region.mechanisms?.[key];
  if(!conclusion)return null;
  return {key:'region:'+region.id,title:region.name,
    question:(scene.teachingContext==='marine'?{climate:'海湾都有水，为什么海草不能到处生长？',soil:'海床怎样影响根和根茎扎稳？',water:'潮汐、水温和盐度还需要哪些证据？'}:{climate:'这里的冷暖与雨季怎样安排生长？',soil:'根区怎样同时获得水和空气？',water:'植物可用的水从哪里来？'})[key],
    conclusion:firstSentences(conclusion),clue:'当前只突出'+{climate:'月度气候与生长季',soil:'根区条件；表土模型不能代表全部根层',water:'实际水源线索；水面检出率不能代表灌溉量'}[key]+'。',sources:sources(chapter?.sources),
    target:{regionId:region.id,cropId:scene.cropId,step:scene.step||0,comparison:scene.comparison===true}};
}

export function mapTeachingFocus({plant,profile,mode,year,metric,selectedName,selected=null,fullMap=false,stage=-1,evidenceSources=[]}={}){
  if(!plant)return null;
  const production=mode==='production',environment=stage===2;
  return {key:'map:'+plant.id,title:plant.name+' · '+(production?'农业统计':'原生与引入'),
    question:environment?'这些分布线索怎样与环境要求联系？':selectedName?'“'+selectedName+'”的记录意味着什么？':'这张全球地图究竟比较什么？',
    conclusion:environment?firstSentences(profile?.summary||plant.needs):production?`${year}年国家／地区${metric==='area'?'收获面积（公顷）':'产量（吨）'}。颜色比较总量；不能据此定位农田或判断每块土地适宜性。`:'原生与引入野生记录按植物地理区显示；引入野生记录不包含所有园艺栽培。',
    clue:environment?'把温度、供水和季节与具体地区对照；分布原因还可能涉及传播与管理。':production?'先找国家，再核对年份、指标与单位。':'植物地理区可能跨越国界；国家名提供位置参照。',sources:sources(environment?profile?.sources:evidenceSources),
    target:{stage:'map',location:{cropId:plant.id,mode,metric,selected,tourIndex:stage,fullMap:fullMap===true}}};
}

export function narrationTeachingFocus(scene){
  if(!scene?.explain)return null;
  const chapter=scene.id.replace(/-scene-\d+$/,''),foundation=FOUNDATION_STEPS.findIndex(s=>'foundation-'+s.id===chapter),environment=LEARNING_STOPS.findIndex(s=>'learn-'+s.id===chapter);
  const target=foundation>=0?{stage:'foundation',location:{foundationIndex:foundation}}:environment>=0?{stage:'environments',location:{index:environment,view:'environment'}}:null;
  return {key:'narration:'+chapter,title:scene.title,question:scene.title,conclusion:scene.explain,clue:scene.lookAt,sources:[],target};
}

export function readOpenedTopics(){
  try{const list=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(list)?list.filter(v=>v&&typeof v.key==='string'&&typeof v.title==='string'&&typeof v.question==='string'&&typeof v.conclusion==='string').slice(0,8):[];}catch{return [];}
}
export function rememberTeachingFocus(focus){
  if(!focus?.key||!focus.conclusion)return;
  const previous=readOpenedTopics(),snapshot={...focus,sources:sources(focus.sources)};
  if(previous[0]&&JSON.stringify(previous[0])===JSON.stringify(snapshot))return;
  try{localStorage.setItem(STORAGE,JSON.stringify([snapshot,...previous.filter(v=>v.key!==focus.key)].slice(0,8)));}catch{}
}
let pendingFocus=null,focusScheduled=false;
export function queueTeachingFocus(focus){
  if(!focus)return;pendingFocus=focus;if(focusScheduled)return;focusScheduled=true;
  // A module switch can render the old plant before restoring the destination.
  // Commit only the final visible topic from this synchronous transition.
  queueMicrotask(()=>{focusScheduled=false;const latest=pendingFocus;pendingFocus=null;rememberTeachingFocus(latest);});
}
export function renderTeachingFocus(container,focus,{remember=true}={}){
  if(!focus)return null;
  const section=el('section',null,'teaching-focus');section.setAttribute('aria-label','本段问题与关键解释');
  section.append(el('small','本段问题'),el('strong',focus.question,'teaching-focus-question'),el('small','抓住这点'),el('p',focus.conclusion,'teaching-focus-conclusion'));
  const details=el('details',null,'teaching-focus-evidence');details.append(el('summary','展开解释与依据'),el('p',focus.conclusion),el('p',focus.clue));
  for(const source of sources(focus.sources)){const a=el('a',source.title+' ↗');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);}section.append(details);container.append(section);
  if(remember)queueTeachingFocus(focus);return section;
}
