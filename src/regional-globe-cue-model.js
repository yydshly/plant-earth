const finite=value=>typeof value==='number'&&Number.isFinite(value);
const list=value=>Array.isArray(value)?value:[];
const point=value=>value&&finite(value.lon)&&finite(value.lat)&&value.lon>=-180&&value.lon<=180&&value.lat>=-90&&value.lat<=90;
const number=value=>Number(value.toFixed(1)).toString();
const stepKind=scene=>['climate','soil','water'].includes(scene?.evidence)?scene.evidence:['climate','soil','water'][scene?.step||0];

/** A location is always copied from an existing evidence record. It is not a
 * newly geocoded plant observation or a model of its full distribution. */
export function resolveRegionalGlobeCuePosition(scene,region){
  if(!scene||!region||!point(region)||scene.view==='home')return null;
  const kind=stepKind(scene);let source=region,label=region.name+' · 气候教学位置',positionSource='climate-region';
  if(kind==='soil'){
    const soil=region.soil||{};
    if(soil.status==='available'&&finite(soil.sampleLon)&&finite(soil.sampleLat)){source={lon:soil.sampleLon,lat:soil.sampleLat};positionSource='soil-sample';}
    else positionSource='soil-region';
    label=region.name+(positionSource==='soil-sample'?' · 表土模型取样':soil.status==='available'?' · 土壤地区背景':' · 实际基质需另查');
  }else if(kind==='water'){
    const sample=region.water?.surfaceWaterSample;
    if(point(sample)){source=sample;positionSource='water-sample';}else positionSource='water-region';
    label=region.name+(positionSource==='water-sample'?' · 水面像元取样':' · 水源教学位置');
  }
  return point(source)?{lon:source.lon,lat:source.lat,label,kind,positionSource}:null;
}

/** Short readouts use published values, periods and units. The attached 3D
 * symbols explain the topic; they do not measure root depth, weather or water
 * volume. Values are never filled from neighbouring or unrelated datasets. */
export function resolveRegionalGlobeCues({scene,region,plant,chapter}={}){
  const focus=resolveRegionalGlobeCuePosition(scene,region);if(!focus)return null;
  const kind=focus.kind,values=[],lines=[],references=[];let sourceUrl=null,period='',dataNote='',scopeNote='';
  if(kind==='climate'){
    const climate=region.climate||{},months=list(climate.monthly).filter(m=>finite(m.tMeanC)&&finite(m.month));
    const facts=list(chapter?.spokenFacts).find(f=>f.kind==='temperature-seasonality');
    const factualMonths=list(facts?.months).map(month=>months.find(m=>m.month===month)).filter(Boolean);
    const sorted=[...months].sort((a,b)=>a.tMeanC-b.tMeanC);
    const selected=(factualMonths.length?factualMonths:[sorted[0],sorted.at(-1)]).filter(Boolean).slice(0,2);
    for(const m of selected)values.push({name:m.month+'月均温',value:m.tMeanC,unit:'°C',month:m.month,field:'tMeanC'});
    if(values.length)lines.push(values.map(v=>`${v.month}月 ${number(v.value)}°C`).join(' · '));
    else lines.push('本例暂无可用逐月气温');
    const rain=list(climate.monthly).filter(m=>finite(m.precipMmDay)).map(m=>m.precipMmDay);
    if(rain.length){const low=Math.min(...rain),high=Math.max(...rain);values.push({name:'月均日降水下限',value:low,unit:'mm/天',field:'precipMmDay'},{name:'月均日降水上限',value:high,unit:'mm/天',field:'precipMmDay'});lines.push(`月均日降水 ${number(low)}–${number(high)} mm/天`);}
    period=climate.period||'';sourceUrl=climate.sourceUrl||null;dataNote=[period,'NASA POWER 气象网格'].filter(Boolean).join(' · ');
    scopeNote='长期气候背景，不是今日天气。太阳、云雨符号为原理示意。';
  }else if(kind==='soil'){
    const soil=region.soil||{};period=soil.period||'';sourceUrl=soil.sourceUrl||null;
    if(soil.status==='available'){
      for(const [field,name,unit]of [['ph','表土 pH',''],['sandPct','砂粒质量比','%'],['clayPct','黏粒质量比','%']])if(finite(soil[field]))values.push({name,value:soil[field],unit,field});
      if(finite(soil.ph))lines.push('表土 pH '+number(soil.ph));
      const texture=values.filter(v=>v.field!=='ph');if(texture.length)lines.push(texture.map(v=>`${v.field==='sandPct'?'砂':'黏粒'} ${number(v.value)}%`).join(' · '));
      if(!values.length)lines.push('该模型位置暂无有效土壤属性');
      const depth=list(soil.depthCm).every(finite)&&soil.depthCm?.length===2?soil.depthCm.join('–')+' cm':'已记录深度';dataNote=`${depth} · SoilGrids 模型`;
      scopeNote='土柱与根系为示意，不能据表土值推定全部根层、排水或盐分。';
    }else{
      lines.push(soil.status==='not-applicable'?'陆地表土模型不适用于本例实际基质':'该位置暂无可用陆地土壤模型');
      dataNote='请区分陆地、底泥、岩缝与附生根区';scopeNote='保留缺失或不适用，不用邻点数值补造，也不把示意土柱当现场剖面。';
    }
  }else{
    const water=region.water||{},sample=water.surfaceWaterSample,valid=point(sample)&&finite(sample.occurrencePct)&&sample.occurrencePct>=0&&sample.occurrencePct<=100;
    period=sample?.period||'';sourceUrl=sample?.sourceUrl||water.sourceUrl||null;
    if(valid){values.push({name:'开阔水面出现频率',value:sample.occurrencePct,unit:'%',field:'occurrencePct'});lines.push('开阔水面出现频率 '+number(sample.occurrencePct)+'%');lines.push(sample.occurrencePct===0?'此像元未检出开阔水面 ≠ 根区无水':'检出水面不等于可用灌溉水');}
    else lines.push('此水面像元暂无有效数值');
    dataNote=[period,'约30 m · JRC GSW 像元'].filter(Boolean).join(' · ');scopeNote='水滴是证据类型符号；出现频率不是水深、地下水、流量或灌溉量。';
    const reference=water.referenceWaterSample;
    if(point(reference)&&finite(reference.occurrencePct)&&reference.occurrencePct>=0&&reference.occurrencePct<=100)references.push({lon:reference.lon,lat:reference.lat,label:water.referenceWaterName||'独立参照水面',value:reference.occurrencePct,unit:'%',period:reference.period||'',sourceUrl:reference.sourceUrl||null,note:'独立水面参照，不证明它给本区所有植物供水。'});
  }
  const claim=scene?.teachingClaim||chapter?.beats?.[scene?.step||0]?.action?.teachingClaim;
  const marine=scene?.teachingContext==='marine'||chapter?.beats?.[scene?.step||0]?.action?.teachingContext==='marine';
  if(claim){
    // Put the cause ahead of the optional numerical detail. Existing values
    // retain their units and provenance; a mechanism is never a new measurement.
    if(marine){lines.splice(0,lines.length,claim);scopeNote=kind==='climate'?'周边空气气候只作背景；本点无水温、透明度实测。':kind==='soil'?'本点无海床底质实测，陆地表土不适用。':'水面频率不是水深、盐度或潮汐监测。';dataNote=kind==='climate'?`${period} · 周边空气背景，非水下监测`:'海洋生境机制 · 当地监测缺项见地区资料';}
    else lines.unshift(claim);
  }
  const coordinateMeaning=focus.positionSource==='climate-region'?'地区气候教学位置':focus.positionSource==='soil-sample'?'表土模型取样位置，非植株或根旁实测':focus.positionSource==='soil-region'?'地区背景位置，土壤数据不适用或未另定位采样':focus.positionSource==='water-sample'?'卫星开阔水面像元取样位置，非植株观测':'地区水源背景位置，未定位卫星像元';
  return {kind,teachingContext:marine?'marine':'terrestrial',focus,title:`${plant?.name?plant.name+' · ':''}${marine?({climate:'水下光',soil:'海床与扎根',water:'潮汐与水体'})[kind]:kind==='climate'?'冷热与雨季':kind==='soil'?'根区背景':'水源证据'}`,regionName:region.name,lines,values,dataNote,period,sourceUrl,scopeNote,references,missing:values.length===0,coordinateMeaning};
}
