import {renderClimateChart} from './regional-evidence-view.js';
import {regionalTeachingFocus,renderTeachingFocus} from './teaching-focus.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const finite=value=>typeof value==='number'&&Number.isFinite(value);

export function renderRegionalSceneCard(container,{scene,region,chapter,plant,profile}={}){
  container.replaceChildren();container.hidden=!scene||!region;if(container.hidden)return;
  const key=scene.evidence||'climate',titles={climate:'气候怎样影响生长季',soil:'根区要同时得到水和空气',water:'降雨不等于植物能用的全部水'};
  container.dataset.evidence=key;
  const header=el('div',null,'regional-scene-heading');header.append(el('strong',region.name),el('span',`${(scene.step||0)+1} / 3 · ${scene.comparison?'植物对照':{climate:'气候',soil:'土壤与根区',water:'水源与限制'}[key]}`));container.append(header);
  if(plant)container.append(el('p',(scene.comparison?'正在对照：':'本段代表：')+plant.name+' · 地区背景不证明采样点存在此植物','regional-scene-plant'));
  const focus=regionalTeachingFocus({scene,region,chapter,profile});if(focus)renderTeachingFocus(container,focus);else container.append(el('h3',titles[key]));
  if(key==='climate')container.append(renderClimateChart(region.climate,{compact:true}));
  else if(key==='soil'){
    const metrics=el('div',null,'regional-scene-values');for(const [field,name,unit]of [['ph','表土 pH',''],['sandPct','砂粒','%'],['clayPct','黏粒','%']])if(finite(region.soil?.[field])){const value=el('span');value.append(el('small',name),el('strong',region.soil[field].toFixed(1)+unit));metrics.append(value);}container.append(metrics);
    const soil=region.soil;if(finite(soil?.sampleLat)&&finite(soil?.sampleLon))container.append(el('small',`土壤模型取样：${soil.sampleLat.toFixed(4)}°，${soil.sampleLon.toFixed(4)}°；气候教学点：${region.lat.toFixed(4)}°，${region.lon.toFixed(4)}°。`));
    const process=el('div',null,'regional-mechanism-flow');['根区水','孔隙与空气','根系吸收'].forEach((text,index)=>{if(index)process.append(el('span','↔','regional-flow-arrow'));process.append(el('span',text));});container.append(process,el('small','机制示意，非现场剖面。表土质地不能单独测出排水或全部根层。'));
  }else{
    container.append(el('p','实际水源线索：'+(region.water?.type||'查看地区水源资料'),'regional-water-type'));
    const water=region.water?.surfaceWaterSample,box=el('div',null,'regional-water-reading');box.append(el('span','开阔水面检出频率'),el('strong',finite(water?.occurrencePct)?water.occurrencePct+'%':'无有效值'),el('small',(water?.period||'')+' · 30m像元；不代表水深、地下水或灌溉量'));container.append(box);
  }
  let explanation=chapter?.explanations?.[key]||region.mechanisms?.[key]||'';
  if(scene.comparison&&profile)explanation=key==='climate'?[profile.temperatureNote,profile.season?.explanation].filter(Boolean).join(' '):key==='soil'?[profile.soil?.texture,profile.soil?.drainage,profile.soil?.phNote].filter(Boolean).join(' '):[profile.water?.summary,profile.water?.timing,profile.water?.caution].filter(Boolean).join(' ');
  if(explanation&&!focus)container.append(el('p',explanation,'regional-scene-explanation'));
}
