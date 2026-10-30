import {FOUNDATION_STEPS} from './foundation-content.js';
import {LEARNING_STOPS} from './learning-content.js';
import {CROP_CLASSES,CROP_LEARNING_PATHS} from './crop-class-content.js';
import {BIODIVERSITY_COURSES,BIODIVERSITY_PATHS} from './biodiversity-content.js';

const stage=(id,location)=>({kind:'stage',stage:id,...(location?{location}:{} )});
const list=value=>Array.isArray(value)?value:[];

// Build navigation coordinates from the same lesson and data catalogues as the
// players. No copied teaching text, additional media or assessment storage.
export function createCourseDirectoryGroups(data={}){
  const plants=list(data.crops),byId=new Map(plants.map(p=>[p.id,p])),production=new Set(list(data.globalEvidence?.production?.plants).map(p=>p.cropId));
  const classPaths=new Map(CROP_LEARNING_PATHS.map(p=>[p.id,p.title])),bioPaths=new Map(BIODIVERSITY_PATHS.map(p=>[p.id,p.title]));
  const regions=list(data.regionalEnvironment?.regions),mapLocation=p=>({cropId:p.id,mode:production.has(p.id)?'production':'botanical',metric:'production',selected:null,tourIndex:-1,caseRegionId:null,fullMap:false});
  const groups=[
    {id:'foundation',title:'地球与地理基础',description:'从海陆、方向、纬度到水循环和雨林。可直接选任一课。',action:stage('foundation'),lessons:FOUNDATION_STEPS.map((s,i)=>({id:'foundation-'+s.id,title:s.title,description:s.summary,tags:['地理基础',s.kicker,...(s.keyTerms||[]).map(t=>t.term)],action:stage('foundation',{foundationIndex:i})}))},
    {id:'environments',title:'生态环境',description:'六种典型环境，理解水、热、季节与植物器官的联系。',action:stage('environments',{index:0,view:'environment',selectedPlantId:'',bridge:false}),lessons:LEARNING_STOPS.map((s,i)=>({id:'environment-'+s.id,title:s.title,description:s.landscape,tags:[s.summary,...s.plants.map(p=>byId.get(p.id)?.name||p.id)],action:stage('environments',{index:i,view:'environment',selectedPlantId:'',bridge:false})}))},
    {id:'agriculture',title:'农业与园艺分类',description:'四条主线、13类作物。直接进入类别，比较用途、器官和环境。',action:stage('classes',{courseScope:'agriculture',view:'home',step:0}),lessons:CROP_CLASSES.map(c=>({id:'class-'+c.id,title:c.group,description:c.question,groupTitle:classPaths.get(c.pathId),tags:[c.title,...c.representativeIds.flatMap(id=>[byId.get(id)?.name||id,byId.get(id)?.latin||''])],action:stage('classes',{courseScope:'agriculture',view:'lesson',classId:c.id,pathId:c.pathId,step:0,cropId:c.representativeIds[0]})}))},
    {id:'biodiversity',title:'其他代表植物',description:`${BIODIVERSITY_COURSES.length}个独立课程，按草原、雨林、苔原、城市及植物观察主题组织。`,action:stage('classes',{courseScope:'biodiversity',view:'home',step:0}),lessons:BIODIVERSITY_COURSES.map(c=>({id:'plant-course-'+c.id,title:c.name,description:c.definition,groupTitle:bioPaths.get(c.pathId),tags:[c.latin,c.group,c.region?.name||''],action:stage('classes',{courseScope:'biodiversity',view:'lesson',cropId:c.id,pathId:c.pathId,step:0,following:true})}))},
    {id:'regions',title:'全球地区课堂',description:'按地区比较气候、土壤与水源。可以直接从任何一个地区开始。',action:{kind:'regional'},lessons:regions.map(r=>({id:'region-'+r.id,title:r.name,description:[r.biomeLabel||r.environmentLabel,...list(r.cropIds).map(id=>byId.get(id)?.name||id)].filter(Boolean).join(' · '),groupTitle:r.continentZh||r.continent||'地区',tags:[...list(r.cropIds).flatMap(id=>[byId.get(id)?.name||id,byId.get(id)?.latin||'']),r.summary||''],action:{kind:'regional',regionId:r.id}}))},
    {id:'maps',title:'真实分布地图',description:'直接选择植物，查看国家生产统计或原生与引入资料。',action:stage('map'),lessons:plants.map(p=>({id:'plant-map-'+p.id,title:p.name,description:p.latin+' · '+(production.has(p.id)?'国家生产统计':'原生与引入资料'),groupTitle:p.collection==='agriculture'?'农业与园艺':'其他代表植物',tags:[p.latin,p.group,p.needs],action:stage('map',mapLocation(p))}))},
    {id:'review',title:'综合回顾',description:'查看已有学习与作答记录，直接进入回顾、补答和自己的解释。',action:stage('review',{}),hasAudio:false,lessons:[{id:'course-review',title:'查看我的学习记录与综合回顾',description:'保留已有作答，可回看问题、补充自己的植物解释。',hasAudio:false,tags:['复习','练习','作答','学习记录'],action:stage('review',{})}]}
  ];
  const countLabels={regions:'个案例',maps:'个条目',review:'项'};
  return groups.map(g=>({...g,count:g.lessons.length,countLabel:countLabels[g.id]||'课',lessons:g.lessons.map(l=>({...l,hasAudio:l.hasAudio!==false}))}));
}

export function createCourseDirectoryNavigator({guidedCourse,globalEvidence}){
  return (action,{play=false}={})=>{
    if(action?.kind==='stage')return guidedCourse.openModule(action.stage,action.location,{play:play===true});
    if(action?.kind==='regional'){
      guidedCourse.pauseForExplore();globalEvidence.openRegionalCourse({regionId:action.regionId,cropId:action.cropId});
      if(play===true)globalEvidence.playRegionalCourse?.();return true;
    }
    return false;
  };
}
