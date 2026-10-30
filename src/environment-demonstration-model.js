const SOURCES={ocean:{title:'NOAA · 相连的全球海洋',url:'https://oceanservice.noaa.gov/facts/howmanyoceans.html'},water:{title:'NOAA · 水循环',url:'https://www.noaa.gov/education/resource-collections/freshwater/water-cycle'},terrain:{title:'NOAA · 迎风与背风',url:'https://oceanservice.noaa.gov/facts/windward-leeward.html'},wind:{title:'新加坡气象局 · 风与季风',url:'https://www.weather.gov.sg/learn_winds/'}};
const DEFINITIONS={
  ocean:{title:'先看海洋：它与陆地有什么联系？',steps:[['sea','海洋储水'],['vapour','水分蒸发'],['land','水汽可到陆地']],source:'ocean'},
  'water-cycle':{title:'水怎样从海洋来到陆地，再回去？',steps:[['vapour','蒸发与蒸腾'],['cloud','上升冷却'],['rain','云滴长大降雨'],['return','径流返回']],source:'water'},
  wind:{title:'风怎样把水汽带向陆地？',steps:[['sea','水汽来源'],['transport','随空气输送'],['change','方向随条件变化']],source:'wind'},
  terrain:{title:'同一座山，为什么两侧可能不同？',steps:[['approach','湿空气遇山'],['uplift','迎风抬升冷却'],['contrast','背风可能较干']],source:'terrain'}
};
export function resolveEnvironmentDemonstration(scene){
  if(!scene)return null;
  const effect=scene.effect,descriptor=scene.demonstration;
  const kind=descriptor?.kind||(['ocean','wind','terrain'].includes(effect)?effect:['evaporation','cloud','rain'].includes(effect)?'water-cycle':null);
  const definition=DEFINITIONS[kind];if(!definition)return null;
  const phase=descriptor?.phase||({evaporation:'evaporation',cloud:'cloud',rain:'rain'}[effect])||scene.phase||'default';
  let activeStep=0;
  if(kind==='ocean')activeStep=phase==='coast'?2:0;
  if(kind==='water-cycle')activeStep=phase==='cloud'?1:phase==='rain'?2:phase==='cycle'?3:0;
  if(kind==='wind')activeStep=phase==='seasonal'?2:1;
  if(kind==='terrain')activeStep=['contrast','leeward'].includes(phase)?2:phase==='limits'?0:1;
  const summaries={
    ocean:phase==='basins'?'太平洋、大西洋、印度洋是海洋区域的名称；海水彼此相连。先在地图上找海，再看海与陆地的联系。':'海洋能提供水汽。海水蒸发后，水汽才可能随空气流动到达陆地；不是海水直接变成山上的雨。',
    'water-cycle':[
      '海水、地表水蒸发，植物也会蒸腾。小粒子表示水汽输送；水汽本身看不见。',
      '含水汽的空气上升、膨胀、冷却；满足条件时，一部分水汽凝结成小水滴。',
      '云里的水滴或冰粒还要长大，才可能落成降水。有云不一定下雨。',
      '落到地面的水，一部分沿地表或地下流动，返回河流、湖泊和海洋；水也会再次蒸发。'
    ][activeStep],
    wind:phase==='seasonal'?'风向会随季节、地形与天气变化。季风是随季节显著改变的风；这里不显示今天的真实风向。':'风是空气的流动，能输送水汽。顺着箭头，看水汽从来源区域到达陆地；有水汽仍需合适条件才能降雨。',
    terrain:activeStep===2?'空气越过山后下降时，可能增温、相对湿度降低，背风侧可能较干；不是每座山两侧都会出现雨林与荒漠。':activeStep===1?'湿空气遇山，被迫沿迎风侧上升。上升会冷却；水汽充足且条件合适时，可能形成云雨。':'山地、海洋与风共同改变水汽供应和降雨。比较时还要看海拔、季节与土地利用，不能只看纬度。'
  };
  const sourceLinks=[SOURCES[definition.source]];if(kind==='wind'||kind==='ocean'&&phase==='coast')sourceLinks.push(SOURCES.water);
  const steps=kind==='ocean'&&phase==='basins'?[['sea','蓝色是海洋'],['coast','海岸区分海陆'],['connected','海域彼此相连']]:definition.steps;
  return {kind,phase,title:scene.title||definition.title,diagramTitle:definition.title,steps:steps.map(([id,label])=>({id,label})),activeStep,summary:summaries[kind],scopeNote:kind==='ocean'&&phase==='basins'?'海洋定位示意采用 Natural Earth 底图；圈和波纹不表示海流、海况或统计面积。':'原理示意 · 山形、距离与粒子已简化；箭头不代表当地实测风向，画面不是天气预报。',sourceLinks,focus:scene.focus?{...scene.focus}:null};
}
