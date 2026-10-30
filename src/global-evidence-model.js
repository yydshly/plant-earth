/** Data presentation rules: never infer a plant range from climate or missing data. */
export const GLOBAL_COLORS={native:'#86c99e',introduced:'#b89add',low:'#a7c5df',medium:'#589cbd',high:'#e6b66a',zero:'#697782',missing:'#344952',selected:'#fff0a9'};
export const isNumber=value=>typeof value==='number'&&Number.isFinite(value);
export function valueFor(row,metric='production'){return metric==='area'?row?.areaHa:row?.value;}
export function rankedRows(plant,metric='production'){
  return (plant?.records||[]).filter(r=>isNumber(valueFor(r,metric))).slice().sort((a,b)=>valueFor(b,metric)-valueFor(a,metric)||a.iso3.localeCompare(b.iso3));
}
export function productionScale(plant,metric='production'){
  const positive=rankedRows(plant,metric).map(r=>valueFor(r,metric)).filter(v=>v>0).sort((a,b)=>a-b);
  const cuts=positive.length?[positive[Math.floor((positive.length-1)/3)],positive[Math.floor(2*(positive.length-1)/3)]]:[];
  return {cuts,positiveCount:positive.length,color(value){if(!isNumber(value))return GLOBAL_COLORS.missing;if(value===0)return GLOBAL_COLORS.zero;return value<=cuts[0]?GLOBAL_COLORS.low:value<=cuts[1]?GLOBAL_COLORS.medium:GLOBAL_COLORS.high;}};
}
export function botanicalStatus(plant,code){
  if(plant?.nativeCodes?.includes(code))return 'native';
  if(plant?.introducedCodes?.includes(code))return 'introduced';
  if(plant?.extinctCodes?.includes(code))return 'extinct';
  if(plant?.doubtfulCodes?.includes(code))return 'doubtful';
  return 'unrecorded';
}
export function productionSummary(plant,metric='production'){
  const rows=rankedRows(plant,metric),sum=rows.reduce((n,r)=>n+valueFor(r,metric),0),world=valueFor(plant?.worldTotal,metric);
  return {rows,sum,world:isNumber(world)?world:null,coverage:isNumber(world)&&world>0?sum/world:null,positive:rows.filter(r=>valueFor(r,metric)>0).length,missing:(plant?.records||[]).filter(r=>!isNumber(valueFor(r,metric))).length};
}
export function formatGlobalValue(value,metric='production'){
  if(!isNumber(value))return '缺失';const unit=metric==='area'?'公顷':'吨';
  if(value>=1e8)return (value/1e8).toLocaleString('zh-CN',{maximumFractionDigits:2})+' 亿'+unit;
  if(value>=1e4)return (value/1e4).toLocaleString('zh-CN',{maximumFractionDigits:2})+' 万'+unit;
  return value.toLocaleString('zh-CN',{maximumFractionDigits:2})+' '+unit;
}
