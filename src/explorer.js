const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;};
const link=(title,url)=>{const a=node('a',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
const value=(range,unit='')=>Array.isArray(range)&&range.length===2?`${range[0]}–${range[1]}${unit}`:'见下方环境说明';

export function initExplorer({data,crops,selectCrop}){
  const profiles=new Map((data.environment?.profiles||[]).map(p=>[p.id,p]));
  const evidence=new Map((data.evidence?.crops||[]).map(p=>[p.id,p]));
  const selected=['rice','wheat','maize'];let activeCrop=null,tab='profile';
  const audited=id=>{const e=evidence.get(id);return ['verified','corrected'].includes(e?.status)?e:null;};
  const section=(title,text)=>{const e=node('article',null,'environment-card');e.append(node('h4',title),node('p',text));return e;};
  const addLine=(parent,label,text)=>{const p=node('p');p.append(node('strong',label+' '),document.createTextNode(text||'暂无独立资料'));parent.append(p);};
  function rangeCard(title,range,max,unit,note,kind){
    const card=node('div',null,'range-card '+kind);card.append(node('span',title,'range-label'),node('strong',value(range,unit),'range-value'));
    if(Array.isArray(range)){
      const track=node('div',null,'range-track');track.setAttribute('aria-hidden','true');const band=node('i');band.style.left=(range[0]/max*100)+'%';band.style.width=((range[1]-range[0])/max*100)+'%';track.append(band);card.append(track);
      const scale=node('div',null,'range-scale');scale.append(node('span','0'),node('span',max+unit));card.append(scale);
    }
    card.append(node('p',note));return card;
  }
  function renderProfile(id){
    activeCrop=id;const host=$('panel-profile');host.replaceChildren();const crop=crops.get(id),p=profiles.get(id),e=audited(id);
    if(!crop){
      const intro=node('div',null,'profile-intro');intro.append(node('h3','先选一种植物，再追问“为什么”'),node('p','气候地图给出线索，温度、水分、基质、光照和季节共同影响植物的生长与繁殖。选择左侧植物，查看专属环境档案；也可以从三大主粮开始。'));
      const buttons=node('div',null,'quick-crops');for(const key of ['rice','wheat','maize']){const b=node('button',crops.get(key).name);b.onclick=()=>selectCrop(key);buttons.append(b);}intro.append(buttons);host.append(intro);
      const grid=node('div',null,'environment-grid');for(const [title,text] of [['看热量的时间','同一地点可以夏种玉米、秋播冬小麦。年平均温度会掩盖霜冻、花期高温和可用生长季。'],['看水落在什么时候','相同年降雨量，如果一处全年均匀、一处集中在短雨季，对多年生植物的意义就很不一样。'],['看地下与田间条件','排水、酸碱度、土层深度及可用灌溉，会让同一气候网格中的地块出现很大差异。']])grid.append(section(title,text));host.append(grid);return;
    }
    const heading=node('div',null,'profile-heading');const title=node('div');title.append(node('span','环境档案 / '+crop.group,'eyebrow'),node('h3',crop.name),node('p',p?.summary||crop.needs));const compare=node('button','加入比较','quiet');compare.onclick=()=>{if(!selected.includes(id))selected[0]=id;renderCompare();setTab('compare');};heading.append(title,compare);host.append(heading);
    const taxonomy=node('div',null,'plant-taxonomy');for(const label of [crop.taxonomy?.clade,crop.lifeForm,...(crop.habitats||[]),...(crop.uses||[])].filter(Boolean))taxonomy.append(node('span',label));host.append(taxonomy);
    const names=node('p',crop.latin+(crop.taxonomy?.family?' · '+crop.taxonomy.family:'')+(crop.synonyms?.length?' · 相关异名：'+crop.synonyms.join('；'):''),'plant-names');if(crop.taxonomy?.sourceUrl)names.append(document.createTextNode(' · '),link('分类资料',crop.taxonomy.sourceUrl));host.append(names);
    if(crop.nameNote)host.append(node('p',crop.nameNote,'plant-names'));
    if(e){
    const ranges=node('div',null,'ranges');ranges.append(
      rangeCard('生长季温度参考范围',e?.temperatureOptimalC,50,'°C','EcoCrop 的 Optimal 字段；字段帮助关注生长季平均最低与最高温，不是年均温、极端温或播种阈值。','temperature'),
      rangeCard('年降雨量资料范围',e?.rainAnnualOptimalMm,4000,' mm/年','原表年尺度水分参考，查询可计入补充水源；不是耗水量或灌溉定额，不能仅按雨量判断雨养可行性。','rainfall'),
      rangeCard('土壤 pH 参考范围',e?.soilPhOptimal,14,'','物种级历史资料。品种、砧木、土壤质地和管理会改变具体要求。','soil-ph')
    );host.append(ranges);
    const source=node('p',null,'range-source');source.append(document.createTextNode('数值依据：'),link('FAO EcoCrop · '+crop.latin,e?.sourceUrl||crop.sources[0]),document.createTextNode('。范围不用于给地图网格打分。字段说明：'),link('温度','https://ecocrop.apps.fao.org/ecocrop/srv/en/helpShow?id=2000'),document.createTextNode(' / '),link('降雨','https://ecocrop.apps.fao.org/ecocrop/srv/en/helpShow?id=2001'),document.createTextNode(' / '),link('土壤 pH','https://ecocrop.apps.fao.org/ecocrop/srv/en/helpShow?id=2005'));host.append(source);
    }
    const mapEvidence=node('div',null,'geographic-evidence');mapEvidence.append(node('h4','地图上的地点代表什么'),node('p',crop.mapModel==='reference-only'?'本植物展示来源支持的代表地区，坐标用于定位区域；未建立全球适生模型，也不表示精确观测、完整分布范围或当地数量。':'本植物的气候颜色是教学候选；小模型标记讲解代表地区，不表示实际农田范围或产量。'));
    for(const point of data.placements?.placements.filter(v=>v.cropId===id)||[]){const type={native_region:'原生地区',cultivation_region:'栽培地区',introduced_region:'引入地区',documented_region:'文献分布地区'}[point.evidenceType]||'讲解代表地区';const line=node('p',point.region+' · '+type);if(point.sourceUrl)line.append(document.createTextNode(' · '),link('地区依据',point.sourceUrl));mapEvidence.append(line);if(point.sourceScope)mapEvidence.append(node('p',point.sourceScope));}host.append(mapEvidence);
    if(!p){host.append(section('环境说明',crop.limits));return;}
    const grid=node('div',null,'environment-grid');
    grid.append(section('01 · 温度与热量',p.temperatureNote));
    const water=section('02 · 水分与关键时期',p.water.summary);addLine(water,'关键时期',p.water.timing);addLine(water,'要辨清',p.water.caution);grid.append(water);
    const soil=section('03 · 土壤与根区',p.soil.texture);addLine(soil,'排水',p.soil.drainage);addLine(soil,'酸碱度',p.soil.phNote);grid.append(soil);
    const season=section('04 · 季节与物候',p.season.type);addLine(season,'种植时机',p.season.timing);addLine(season,'原因',p.season.explanation);grid.append(season);
    const stress=section('05 · 哪些环境会限制它','');for(const [key,label] of [['cold','冷与霜'],['heat','高温'],['drought','缺水'],['waterlogging','积水']])addLine(stress,label,p.stress[key]);grid.append(stress);
    const adaptation=section('06 · 适应机制与管理',p.adaptation.mechanism);addLine(adaptation,'可做什么',p.adaptation.practice);addLine(adaptation,'代价与边界',p.adaptation.tradeoff);grid.append(adaptation);host.append(grid);
    const regions=node('div',null,'region-explanations');regions.append(node('h3','把条件放回地图'));const list=node('div',null,'region-grid');for(const r of p.regions){const item=section(r.name,r.why);addLine(item,'当地仍需核对',r.caution);list.append(item);}regions.append(list);host.append(regions);
    const misconception=node('aside',null,'misconception');misconception.append(node('strong','一个常见误解'),node('p',p.misconception));host.append(misconception);
    const sources=node('details',null,'profile-sources');sources.append(node('summary','本植物的资料来源与支持范围'));const sourceList=node('ol');for(const s of p.sources){const li=node('li');li.append(link(s.title,s.url),node('p',s.supports));sourceList.append(li);}sources.append(sourceList);host.append(sources);
  }
  function renderCompare(){
    const host=$('panel-compare');host.replaceChildren();host.append(node('h3','并排看，环境差异更清楚'),node('p','选择任意三种植物，比较水热、土壤与季节要求。以下是物种资料与解释性概括，不是同一地块的产量排名。','panel-intro'));
    const selectors=node('div',null,'compare-selectors');selected.forEach((id,i)=>{const label=node('label','植物 '+(i+1));const select=node('select');select.id='compare-'+i;for(const c of crops.values()){const option=node('option',c.name);option.value=c.id;select.append(option);}select.value=id;select.onchange=()=>{selected[i]=select.value;renderCompare();$('compare-'+i).focus();};label.append(select);selectors.append(label);});host.append(selectors);
    const wrap=node('div',null,'compare-scroll');wrap.tabIndex=0;wrap.setAttribute('aria-label','植物环境比较表，可横向滚动');const table=node('table',null,'compare-table');const caption=node('caption','相同条件，对不同植物意味着什么');table.append(caption);const head=node('thead'),tr=node('tr');tr.append(node('th','比较维度'));for(const id of selected){const th=node('th',crops.get(id).name);th.scope='col';tr.append(th);}head.append(tr);table.append(head);
    const rows=[
      ['温度参考范围',id=>value(audited(id)?.temperatureOptimalC,'°C')],['年降雨资料范围',id=>value(audited(id)?.rainAnnualOptimalMm,' mm/年')],['土壤 pH 参考',id=>value(audited(id)?.soilPhOptimal)],
      ['热量与季节',id=>profiles.get(id)?.temperatureNote],['关键供水时期',id=>profiles.get(id)?.water.timing],['土壤与排水',id=>{const p=profiles.get(id);return p?p.soil.texture+' '+p.soil.drainage:null;}],['季节安排',id=>profiles.get(id)?.season.timing],['霜冻与寒冷',id=>profiles.get(id)?.stress.cold],['耐旱的边界',id=>profiles.get(id)?.stress.drought],['积水限制',id=>profiles.get(id)?.stress.waterlogging],['容易误解的地方',id=>profiles.get(id)?.misconception]
    ];const body=node('tbody');for(const [label,get] of rows){const row=node('tr'),th=node('th',label);th.scope='row';row.append(th);for(const id of selected)row.append(node('td',get(id)||crops.get(id).needs));body.append(row);}table.append(body);wrap.append(table);host.append(wrap);
    host.append(node('p','温度、年降雨和 pH 来自 EcoCrop 的 Optimal 历史资料字段。温度帮助关注生长季平均最低与最高温；年雨量查询可计入补充水源。它们不是年均温阈值或灌溉定额，不能直接判断某地今天是否适种。','comparison-note'));
    const sourceRow=node('div',null,'compare-sources');for(const id of [...new Set(selected)])sourceRow.append(link(crops.get(id).name+' · 数据来源',audited(id)?.sourceUrl||crops.get(id).sources[0]));host.append(sourceRow);
  }
  function renderMethod(){
    const host=$('panel-method');host.append(node('h3','这颗地球能说明什么'),node('p','把数据、解释和示意分开看，才能正确理解颜色与图形。','panel-intro'));
    const grid=node('div',null,'environment-grid');
    grid.append(section('气候底图 · 历史观测归类','Köppen–Geiger 1951–2000 年气候分类，0.5° 网格。每个网格在赤道附近约宽56公里，并不反映一块田的微气候，也不是当前天气。'));
    grid.append(section('植物颜色 · 教学归纳','原有34个作物条目将生态需求与气候类型建立定性对应：典型气候候选、需额外条件、未纳入候选。映射由本图谱归纳，不是 FAO 发布的植物适宜性等级，也不表示种植面积或产量。'));
    grid.append(section('环境数值 · 资料参考','EcoCrop 提供物种级温度、年降雨与土壤 pH 范围。数据库约2015年停止更新，现仍可访问。这些参考范围不能替代具体品种、地点、季节和管理试验。'));
    grid.append(section('国家与河流 · 真实几何','国家轮廓与主要河流采用 Natural Earth。它们经过地图综合，适合全球展示；小岛、支流和边界细节不能据此精确定位。'));
    grid.append(section('形态图与光圈 · 结构示意','植物图突出关键器官，阶段与剖面可并置，比例和颜色不表示实测。地球光圈标记讲解区域，不是农田边界，也不代表产区覆盖半径。'));
    grid.append(section('代表植物 · 分类与用途',`${data.crops.length} 个条目覆盖农业与植物多样性。类群、生活型、生境和用途独立筛选；同一植物可以有多个用途。栽培型、杂交类群及历史植物名称保留必要说明，不能把条目数当作全部植物物种数。`));
    grid.append(section('代表地区 · 有边界的证据','原生地区依据物种分布资料，栽培地区依据农业、园艺或植物园资料。仅有地区记录而不能判断原生身份时，标为文献分布地区。锚点是区域中心示意，来源只支持所述区域；它不是带时间、精度和凭证的观测记录。新增植物仅展示代表点，未将出现地区外推为全球适生范围。'));
    grid.append(section('语音与扩展阅读 · 两种深度',`${data.chapters.length} 章 MiniMax 旁白负责形态和代表地区导览；环境档案与比较表供进一步阅读。字幕使用服务商句段时间，句内镜头切换按文字位置估算。`));host.append(grid);
    const box=node('div',null,'method-next');box.append(node('h3','如果要判断某一块地'),node('p','还需要当地逐月或逐日温度、降雨与蒸散、无霜期、土层与盐分、坡度、灌溉水量、适用品种和土地用途。气候候选只是第一步；沙漠有灌溉也不代表水资源可持续，森林气候匹配也不代表允许开垦。'));host.append(box);
    const sources=node('div',null,'method-links');for(const [title,url] of [['气候网格与 Kottek 等（2006）','https://koeppen-geiger.vu-wien.ac.at/present.htm'],['FAO EcoCrop 数据库说明','https://www.fao.org/geospatial/data-and-tools/data-portals/ecocrop/en'],['FAO GAEZ：完整适宜性评估框架','https://www.fao.org/gaez/en'],['Natural Earth 地图资料','https://www.naturalearthdata.com/about/']])sources.append(link(title,url));host.append(sources);
    host.append(node('p','本图谱没有接入 GAEZ 的适宜性栅格或实时天气；不会把历史气候候选冒充现状产区。资料核对：2026-10-28。','comparison-note'));
  }
  function setTab(name){tab=name;for(const t of ['profile','compare','method']){$('tab-'+t).setAttribute('aria-selected',String(t===name));$('tab-'+t).tabIndex=t===name?0:-1;$('panel-'+t).hidden=t!==name;}}
  const names=['profile','compare','method'];for(const name of names){const button=$('tab-'+name);button.onclick=()=>setTab(name);button.onkeydown=e=>{let i=names.indexOf(name);if(e.key==='ArrowRight')i=(i+1)%3;else if(e.key==='ArrowLeft')i=(i+2)%3;else if(e.key==='Home')i=0;else if(e.key==='End')i=2;else return;e.preventDefault();setTab(names[i]);$('tab-'+names[i]).focus();};}
  renderCompare();renderMethod();
  return {render:renderProfile,compare(ids){const unique=[...new Set(ids)].filter(id=>crops.has(id));for(const id of crops.keys()){if(unique.length>=3)break;if(!unique.includes(id))unique.push(id);}selected.splice(0,3,...unique.slice(0,3));renderCompare();setTab('compare');},getState:()=>({activeCrop,tab,selected:[...selected],profiles:profiles.size,evidence:evidence.size})};
}
