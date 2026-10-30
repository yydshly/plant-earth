const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const svg=(tag,attrs={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
const number=v=>typeof v==='number'&&Number.isFinite(v);
export const evidenceRegion=(pack,id)=>Array.isArray(pack?.regions)?pack.regions.find(r=>r.id===id):pack?.regions?.[id];
export function normalizedClimate(climate={}){
  const rows=climate.monthly||climate.months||[];
  return Array.from({length:12},(_,i)=>{const row=Array.isArray(rows)?rows.find(r=>Number(r.month)===i+1)||rows[i]||{}:rows[String(i+1)]||{};
    return {month:i+1,t:row.tMeanC??row.temperatureC??row.t2mC??row.T2M??row.temperature??null,p:row.precipMmDay??row.precipitationMmDay??row.precipitation??row.PRECTOTCORR??null};});
}
export function renderClimateChart(climate,{compact=false}={}){
  const figure=el('figure',null,'regional-climate-chart'),rows=normalizedClimate(climate),good=rows.filter(r=>number(r.t)&&number(r.p));
  if(!good.length){figure.append(el('p','此处暂缺可用的逐月气候序列；不以相似地区代填。'));return figure;}
  const width=480,height=compact?150:205,left=40,right=438,top=19,bottom=height-31;
  const chart=svg('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':'地区十二个月的月平均气温与平均日降水：红线为摄氏度，蓝柱为毫米每天'});
  const lo=Math.min(-5,Math.floor(Math.min(...good.map(r=>r.t))/10)*10),hi=Math.max(30,Math.ceil(Math.max(...good.map(r=>r.t))/10)*10),maxRain=Math.max(1,Math.ceil(Math.max(...good.map(r=>r.p))));
  const x=i=>left+(right-left)*(i+.5)/12,yt=t=>bottom-(t-lo)/(hi-lo)*(bottom-top),yp=p=>bottom-p/maxRain*(bottom-top);
  for(let i=0;i<=4;i++){const y=top+(bottom-top)*i/4;chart.append(svg('line',{x1:left,x2:right,y1:y,y2:y,stroke:'#65817e','stroke-opacity':'.4'}));const a=svg('text',{x:34,y:y+4,'text-anchor':'end',fill:'#efb5a2','font-size':11});a.textContent=String(Math.round(hi-(hi-lo)*i/4));const b=svg('text',{x:443,y:y+4,fill:'#9cd4ec','font-size':11});b.textContent=(maxRain*(1-i/4)).toFixed(1);chart.append(a,b);}
  let line='';rows.forEach((r,i)=>{if(number(r.p))chart.append(svg('rect',{x:x(i)-8,y:yp(r.p),width:16,height:bottom-yp(r.p),fill:'#73b9d7','fill-opacity':'.75'}));if(number(r.t)){line+=(i&&number(rows[i-1].t)?'L':'M')+x(i)+','+yt(r.t)+' ';chart.append(svg('circle',{cx:x(i),cy:yt(r.t),r:2.6,fill:'#f5a88a'}));}const text=svg('text',{x:x(i),y:height-11,'text-anchor':'middle',fill:'#d3e0d6','font-size':11});text.textContent=String(i+1);chart.append(text);});chart.append(svg('path',{d:line,fill:'none',stroke:'#f5a88a','stroke-width':2.3}));figure.append(chart,el('figcaption','红线：月平均气温 °C　蓝柱：月平均日降水 mm/天（不是月总量）'));
  if(!compact){const table=el('table',null,'regional-months');const caption=el('caption','逐月原始指标');table.append(caption);const tr=el('tr');['月份','气温 °C','降水 mm/天'].forEach(t=>tr.append(el('th',t)));const head=el('thead');head.append(tr);table.append(head);const body=el('tbody');for(const r of rows){const row=el('tr');[r.month,number(r.t)?r.t.toFixed(1):'缺失',number(r.p)?r.p.toFixed(2):'缺失'].forEach(v=>row.append(el('td',String(v))));body.append(row);}table.append(body);const details=el('details');details.append(el('summary','查看 12 个月数值'),table);figure.append(details);}
  return figure;
}
function sourceLink(target,title,url){if(!url)return;const a=el('a',title||'查看来源');a.href=url;a.target='_blank';a.rel='noopener noreferrer';target.append(a);}
function textNotes(value){return Array.isArray(value)?value.join(' '):typeof value==='string'?value:'';}
export function renderRegionalEvidence(region,{compact=false,active='climate',substrateNote='',substrateKind='terrestrial'}={}){
  const root=el('section',null,'regional-evidence');if(!region){root.append(el('p','还没有对应的地区数据；不生成虚构的数值。'));return root;}
  root.dataset.regionId=region.id;root.dataset.activeEvidence=active;
  root.append(el('h4',region.name),el('p',`${Number(region.lat).toFixed(2)}°，${Number(region.lon).toFixed(2)}° · 地区教学采样位置`,'regional-location'));
  const climate=region.climate||{},climateBox=el('section',null,'regional-evidence-block regional-climate');climateBox.append(el('h5','气候：冷热和降水怎样随月份变化？'),renderClimateChart(climate,{compact}));
  const period=typeof climate.period==='object'?JSON.stringify(climate.period):climate.period||'';climateBox.append(el('p',[period,climate.resolution,textNotes(climate.notes)].filter(Boolean).join(' · '),'regional-source-note'));sourceLink(climateBox,climate.sourceName||'NASA POWER · 气候资料',climate.sourceUrl);root.append(climateBox);
  const soil=region.soil||{},soilBox=el('section',null,'regional-evidence-block regional-soil');soilBox.append(el('h5','土壤：根区的条件是什么？'));
  const metrics=[];for(const [key,label,unit]of [['ph','pH（水）',''],['sandPct','砂粒','%'],['clayPct','黏粒','%'],['socGkg','有机碳','g/kg']])if(number(soil[key]))metrics.push(`${label} ${soil[key].toFixed(1)}${unit}`);
  if(substrateNote)soilBox.append(el('p',substrateNote,'regional-boundary'));
  soilBox.append(el('p',metrics.length?(substrateKind==='terrestrial'?'陆地表层网格：':'附近陆地背景，不能替代本植物基质：')+metrics.join('　'):soil.summary||soil.reason||(soil.status==='not-applicable'?'此处不使用陆地表土模型，应依据实际底质、水化学或附生基质资料理解。':'本采样位置暂无可用陆地土壤估计；底泥、树皮与水体条件不能由地表土壤模型替代。')));
  if(Number.isFinite(soil.sampleLat)&&Number.isFinite(soil.sampleLon))soilBox.append(el('p',`土壤取样网格：${soil.sampleLat.toFixed(4)}°，${soil.sampleLon.toFixed(4)}°`,'regional-source-note'));
  if(soil.depthCm||soil.depth)soilBox.append(el('p','深度：'+(Array.isArray(soil.depthCm)?soil.depthCm.join('–')+' cm':soil.depthCm||soil.depth),'regional-source-note'));soilBox.append(el('p',[soil.resolution,textNotes(soil.notes)].filter(Boolean).join(' · '),'regional-source-note'));sourceLink(soilBox,soil.sourceName||'ISRIC SoilGrids · 土壤模型',soil.sourceUrl);root.append(soilBox);
  const water=region.water||{},waterBox=el('section',null,'regional-evidence-block regional-water');waterBox.append(el('h5','水源：植物实际从哪里得到水？'),el('p',water.summary||water.description||'需要进一步核实当地水源；降雨数据不能代替根区可用水。'));
  if(water.type)waterBox.append(el('p','水源类型：'+water.type));for(const metric of water.metrics||[])waterBox.append(el('p',`${metric.name}：${metric.value} ${metric.unit||''}${metric.period?'（'+metric.period+'）':''}`));waterBox.append(el('p',textNotes(water.notes),'regional-source-note'));sourceLink(waterBox,water.sourceName||'水文与生境资料',water.sourceUrl);for(const s of water.sources||[])sourceLink(waterBox,s.title,s.url);root.append(waterBox);
  if(!compact){root.append(el('p',region.pointMeaning||'这些网格值只代表教学采样附近，不能说明整个地区都相同，也不是植物观测点。','regional-boundary'));root.append(el('p','这里把地区环境资料与植物生理知识对照，提出有依据的解释；气候相关性不能单独证明分布原因，还要看地形、微环境、传播、历史和人类活动。','regional-boundary'));}
  return root;
}
