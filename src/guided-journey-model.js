// This cursor records where someone browsed. It is not an assessment of learning.
export const GUIDED_STAGES=Object.freeze([
  Object.freeze({id:'foundation',title:'地球基础',goal:'先认方向、洲与海洋，再看纬度和冷热。',short:'看懂位置'}),
  Object.freeze({id:'environments',title:'生态案例',goal:'把光照、温度、水分和植物联系起来。',short:'理解环境'}),
  Object.freeze({id:'classes',title:'植物课程',goal:'认识农业类别与其他植物，联系形态、环境和地区证据。',short:'认识形态、类群与环境'}),
  Object.freeze({id:'map',title:'真实地图',goal:'到国家和区系记录中，读懂年份、范围与证据。',short:'读懂地区记录'}),
  Object.freeze({id:'review',title:'综合回顾',goal:'通过作答与解释，检查哪些联系已经说得清。',short:'尝试自己解释'})
]);

const stageIds=new Set(GUIDED_STAGES.map(row=>row.id));
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const clone=value=>JSON.parse(JSON.stringify(value));
const safeKey=key=>/^[A-Za-z][\w-]{0,39}$/.test(key)&&!['constructor','prototype','__proto__'].includes(key);

// "From zero" starts a new route cursor, not a new learner history. Keep
// assessment answers, course records and audio preferences outside this model.
const startLocations={
  foundation:{foundationIndex:0},
  environments:{index:0,view:'environment',selectedPlantId:'',bridge:false},
  classes:{courseScope:'agriculture',view:'home',pathId:null,classId:null,step:0,cropId:'rice'},
  map:{cropId:'rice',mode:'production',metric:'production',selected:null,fullMap:false,tourIndex:-1,caseRegionId:null},
  review:{}
};

// Keep only small, JSON-safe location coordinates. Answers and course data stay
// in their original modules, outside this navigation snapshot.
export function sanitizeGuidedLocation(value){
  const output={};
  if(!record(value))return output;
  for(const key of Object.keys(value).filter(safeKey).slice(0,32)){
    const entry=value[key];
    if(typeof entry==='string')output[key]=entry.slice(0,240);
    else if(typeof entry==='number'&&Number.isFinite(entry))output[key]=entry;
    else if(typeof entry==='boolean'||entry===null)output[key]=entry;
  }
  return output;
}

export function createGuidedJourneyState(saved={}){
  const source=record(saved)&&(saved.version===undefined||saved.version===1)?saved:{};
  const locations={};
  for(const id of stageIds){
    if(record(source.locations)&&Object.hasOwn(source.locations,id))locations[id]=sanitizeGuidedLocation(source.locations[id]);
  }
  let resume=record(source.resume)&&stageIds.has(source.resume.stage)?{
    stage:source.resume.stage,location:sanitizeGuidedLocation(source.resume.location??locations[source.resume.stage])
  }:null;
  if(resume)locations[resume.stage]=clone(resume.location);
  const visited=new Set((Array.isArray(source.visited)?source.visited:[]).filter(id=>stageIds.has(id)));
  if(resume)visited.add(resume.stage);
  let active=false,collapsed=source.collapsed===true;
  function snapshot(){return clone({version:1,resume,locations,visited:[...visited],collapsed});}
  function getState(){return {...snapshot(),active,hasResume:!!resume,stage:resume?.stage||'foundation',location:clone(resume?.location||{})};}
  function navigate(stage,location){
    if(!stageIds.has(stage))return null;
    const nextLocation=location===undefined?clone(locations[stage]||{}):sanitizeGuidedLocation(location);
    resume={stage,location:nextLocation};locations[stage]=clone(nextLocation);visited.add(stage);active=true;
    return clone(resume);
  }
  return {
    snapshot,getState,
    start(){
      for(const id of stageIds)locations[id]=clone(startLocations[id]);
      return navigate('foundation',locations.foundation);
    },
    resume(){return resume?navigate(resume.stage,resume.location):navigate('foundation',{foundationIndex:0});},
    navigate,
    move(delta){
      if(!Number.isInteger(delta)||!delta)return null;
      if(!resume)return delta>0?navigate('foundation',{foundationIndex:0}):null;
      const index=GUIDED_STAGES.findIndex(row=>row.id===resume.stage),next=index+delta;
      if(next<0||next>=GUIDED_STAGES.length)return null;
      return navigate(GUIDED_STAGES[next].id);
    },
    report(input){
      if(!active||!record(input)||!stageIds.has(input.stage))return false;
      navigate(input.stage,input.location===undefined?locations[input.stage]:input.location);
      return true;
    },
    pause(){active=false;return getState();},
    setCollapsed(value){collapsed=value===true;return collapsed;}
  };
}
