import {CROP_CLASSES,CROP_LEARNING_PATHS} from './crop-class-content.js';
import {catalogueBrowseGroups} from './global-catalog-model.js';

// These classes describe uses of crops. They do not partition botanical taxa:
// flax can be studied as a fibre crop while also belonging to oil crops.
export function classForGroup(group){
  return CROP_CLASSES.find(row=>row.group===group)||null;
}

export function classesForCrop(plant){
  if(!plant||plant.collection!=='agriculture')return [];
  const groups=new Set(catalogueBrowseGroups(plant));
  return CROP_CLASSES.filter(row=>groups.has(row.group));
}

const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);

export function createClassroomState({classes=CROP_CLASSES,progress={}}={}){
  const byId=new Map();
  for(const row of Array.isArray(classes)?classes:[]){
    if(!row||typeof row.id!=='string'||!row.id||byId.has(row.id))continue;
    const representatives=[...new Set((Array.isArray(row.representativeIds)?row.representativeIds:[])
      .filter(id=>typeof id==='string'&&id))];
    if(representatives.length)byId.set(row.id,{id:row.id,representatives});
  }
  const saved=isRecord(progress)?progress:{},viewed=new Map();
  for(const row of byId.values()){
    const candidates=isRecord(saved.viewed)&&Object.hasOwn(saved.viewed,row.id)&&Array.isArray(saved.viewed[row.id])?saved.viewed[row.id]:[];
    viewed.set(row.id,new Set(candidates.filter(id=>row.representatives.includes(id))));
  }
  let active=null;
  if(isRecord(saved.active)&&byId.has(saved.active.classId)){
    const row=byId.get(saved.active.classId),index=Number.isInteger(saved.active.index)?saved.active.index:0;
    active={classId:row.id,index:Math.max(0,Math.min(row.representatives.length-1,index))};
  }
  const currentRow=()=>active?byId.get(active.classId):null;
  const currentId=()=>currentRow()?.representatives[active.index]||null;
  const mark=id=>{if(active)viewed.get(active.classId).add(id);};

  function getContext(currentCropId){
    const row=currentRow();
    if(!row)return null;
    const representativeId=currentId();
    return {classId:row.id,index:active.index,total:row.representatives.length,
      representativeId,viewedCount:viewed.get(row.id).size,
      isRepresentative:row.representatives.includes(currentCropId),
      currentMatches:currentCropId===representativeId};
  }

  return {
    // A non-representative crop opens the route at its first actual example;
    // it is never added to the viewed representatives to inflate progress.
    start(classId,cropId){
      const row=byId.get(classId);
      if(!row)return null;
      const found=row.representatives.indexOf(cropId);
      active={classId:row.id,index:found<0?0:found};
      const id=currentId();mark(id);return id;
    },
    observe(cropId){
      const row=currentRow();
      if(!row)return null;
      const index=row.representatives.indexOf(cropId);
      if(index>=0){active.index=index;mark(cropId);}
      return getContext(cropId);
    },
    move(delta){
      const row=currentRow();
      if(!row||!Number.isInteger(delta))return null;
      active.index=Math.max(0,Math.min(row.representatives.length-1,active.index+delta));
      const id=currentId();mark(id);return id;
    },
    resume:currentId,
    clear(){active=null;},
    getContext,
    snapshot(){
      return {active:active?{...active}:null,viewed:Object.fromEntries([...byId.values()]
        .map(row=>[row.id,row.representatives.filter(id=>viewed.get(row.id).has(id))])
        .filter(([,ids])=>ids.length))};
    }
  };
}

// Referencing both exports here keeps their relationship explicit without
// storing or mutating presentation content inside the route state.
export const classroomPathIds=Object.freeze(CROP_LEARNING_PATHS.map(path=>path.id));
