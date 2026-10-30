import {renderMiniaturePreview} from './plant-miniatures.js';

const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const AXES=[['water','水从哪里来'],['heat','需要怎样的热量'],['season','什么时候生长'],['management','人怎样改变条件']];

// Qualitative teaching comparisons, not numerical suitability or production maps.
export const CROP_COMPARISONS=[
  {id:'rice',name:'水稻',lon:120.25,lat:30.25,region:'中国长江下游 · 栽培地区示例',
    identify:'细长叶，分枝的圆锥花序上结稻谷；成熟稻穗常下垂。',
    adaptation:'稻作常利用稻田蓄水与灌排管理。品种、土壤和生长阶段会改变用水方式；水稻并非必须一直深水淹着，也有旱作体系。',
    water:'先看可靠水源和灌排。降雨与灌溉都可能供水，田里有水也需要管理水深和时机。',
    heat:'通常利用温暖的生长季。冷凉地区可利用夏季，仍要匹配品种、生育期与成熟所需热量。',
    season:'水、热要在同一段生长季配合；抽穗开花等关键阶段不能只靠全年平均数判断。',
    management:'整田、灌溉、排水、播期和品种共同影响稻作。节水灌溉也不等于可以忽略缺水风险。',
    takeaway:'理解水稻分布，要把“暖季够不够”和“根区水怎样管理”一起问。',
    sources:[{title:'IRRI · 不同稻作体系与水管理',url:'https://books.irri.org/9789712202193_content.pdf'},{title:'IRRI · 干湿交替灌溉',url:'https://waterice.irri.org/how-we-work'}]},
  {id:'wheat',name:'小麦',lon:115.25,lat:35.25,region:'中国华北平原 · 栽培地区示例',
    identify:'细长叶，籽粒集中在茎顶的穗上；一些品种有明显的芒，另一些较短或无芒。',
    adaptation:'小麦常利用较凉的生长时段。冬性品种需要经历一定低温过程才能正常转入生殖生长；这与“越冷越好”不同。',
    water:'靠生长季降雨、土壤储水或灌溉。较耐干不等于不用水，关键阶段缺水仍会减产。',
    heat:'常利用较凉的季节生长；后期高温可能缩短籽粒充实时间。不能把冬小麦和春小麦的需求混为一谈。',
    season:'冬小麦与春小麦把生育过程安排在不同季节。品种的低温需求、越冬与成熟条件要衔接。',
    management:'选择冬性或春性品种，调整播期并管理水分。能越冬、能抽穗与能稳定收获是不同条件。',
    takeaway:'理解小麦分布，要看它用的是哪一段凉季，以及品种能否完成低温和成熟过程。',
    sources:[{title:'FAO · 小麦生长与生理',url:'https://www.fao.org/4/y4011e/y4011e06.htm'},{title:'明尼苏达大学 · 冬小麦的低温需求',url:'https://blog-crop-news.extension.umn.edu/2025/05/did-my-winter-wheat-vernalize.html'}]},
  {id:'maize',name:'玉米',lon:-93.75,lat:41.75,region:'美国中部玉米带 · 栽培地区示例',
    identify:'较高的茎与宽长叶；顶端是雄花序，侧面的雌穗有花丝，籽粒在果穗上成行排列。',
    adaptation:'玉米是暖季作物，发育需要积累热量。抽雄吐丝、授粉前后的缺水与高温会影响结粒；高秆和宽叶本身不能证明一个地点适合种植。',
    water:'需要生长季有效供水，尤其要留意开花授粉前后。地里长期积水也不是越多越好。',
    heat:'需要温暖季节和足够成熟时间。霜冻、热量不足和极端高温都可能限制生产。',
    season:'选择成熟期与当地无霜生长季匹配的品种，让授粉与籽粒充实尽量避开不利条件。',
    management:'播期、成熟期品种、土壤排水和补充灌溉很重要。“玉米带”也不是每块土地都适合玉米。',
    takeaway:'理解玉米分布，要问暖季是否够长，以及开花和结粒时能否获得合适的水热条件。',
    sources:[{title:'明尼苏达大学 · 玉米发育与热量',url:'https://extension.umn.edu/agriculture/crop-production/corn/growth-and-development'},{title:'亚利桑那大学 · 玉米吐丝期的环境胁迫',url:'https://extension.arizona.edu/publication/corn-growth-and-development-stages'},{title:'FAO · 作物用水受气候影响',url:'https://www.fao.org/4/u3160e/u3160e04.htm'}]}
];

export const APPLICATION_CONTEXTS={
  crops:{plantId:'rice',lon:120.25,lat:30.25,title:'把环境知识用到三大主粮',summary:'用相同的水、热、生长季和管理问题，对比水稻、小麦与玉米。地球标记为栽培地区示例。'},
  transfer:{lon:36.8,lat:-0.2,title:'换一个没讲过的地点，试着解释',summary:'这是定位在地球上的假设练习。先预测，再挑选依据，最后说明原因；题目条件不是当地实测气候。'}
};

export const TRANSFER_TASKS=[
  {id:'highland',title:'任务一：赤道附近，高处也一样暖吗？',lon:36.8,lat:-0.2,label:'东非山地附近 · 假设练习定位',
    setup:'设想两块纬度相近的坡地：山脚温暖，另一块海拔高得多、天气更冷。尚不知道两地土壤与详细降雨。',
    prompt:'仅凭“都靠近赤道”，可以把山脚的暖季玉米品种直接搬到高处吗？',
    predictions:['可以，纬度相近就有相同生长条件','不能直接下结论，要核对高处的热量、生长季和品种','高处一定只能种小麦'],correctPrediction:1,
    evidence:[{text:'海拔升高时，气温通常会降低；成熟需要的热量可能不足。',useful:true},{text:'纬度接近，所以海拔、土壤和水分都不重要。',useful:false},{text:'还缺当地水分、霜冻风险、品种生育期等资料。',useful:true}],
    explanation:'纬度提供日照位置线索，海拔又改变温度。较冷可能使暖季作物发育变慢或难以成熟；先核对生长季、热量和品种，再看水分与土壤。这里并不能直接推出“只能种小麦”。',
    reasoning:['地点：纬度相近，海拔不同。','过程：高处通常更冷，生育过程可能改变。','结论：不能照搬品种，还需补充现场条件。'],
    change:'如果换成更早熟的品种，结论会不会改变？可能改变，但仍需核对当地试验与其他限制。',
    sources:[{title:'NPS · 山地海拔与植物带',url:'https://home.nps.gov/chir/learn/nature/sky-islands.htm'}]},
  {id:'irrigated',title:'任务二：少雨地方的绿色果园',lon:6,lat:27,label:'撒哈拉内陆附近 · 假设练习定位',
    setup:'设想一个暖热少雨的地区，有一片椰枣果园。已知果园通过渠道或水井供水，周围仍很干燥。',
    prompt:'怎样解释“当地少雨，却有果园”？',
    predictions:['果园证明周围气候已经变成湿润气候','椰枣完全不需要水','管理把水带到根区，使果园条件不同于周围荒漠'],correctPrediction:2,
    evidence:[{text:'渠道或地下水能补充当地降雨以外的供水。',useful:true},{text:'看到绿色，就能确定全部土地都适宜种果树。',useful:false},{text:'还要查水源能否持续、土壤盐分和排水条件。',useful:true}],
    explanation:'当地气候描述自然降水与热量，果园根区的供水还受人类管理影响。灌溉能解释局地栽培，却不能证明水源可持续、周围全部适宜，或天然荒漠已经变成湿润生态。',
    reasoning:['地点：自然降雨少，周围仍干燥。','过程：渠道或水井把额外水分送到根区。','结论：栽培出现受管理影响，还要查供水和盐分风险。'],
    change:'如果渠道断水，原来的判断还成立吗？不一定；气候没变，植物能获得的水已经变了。',
    sources:[{title:'FAO · 椰枣的灌溉与水质',url:'https://www.fao.org/4/y4360e/y4360e0b.htm'}]}
];

const ENVIRONMENT_PROCESSES={
  savanna:{title:'为什么雨季和干季会交替？',steps:['主要降雨带与风随季节移动。','某些地区只在一年中的一部分时间获得较多雨水。','植物既要利用雨季，也要度过连续少雨的干季。'],note:'这是部分热带地区的简化过程；不能只按纬度判定当地雨季，还要看海陆、地形和风。',source:{title:'英国气象局 · 全球环流与季节变化',url:'https://weather.metoffice.gov.uk/learn-about/weather/atmosphere/global-circulation-patterns'}},
  desert:{title:'为什么有些地方长期少雨？',steps:['降雨通常需要水汽和空气上升、冷却等合适条件。','部分副热带地区常有下沉空气，不利于形成持续降雨；山脉也可能让迎风侧先降雨。','内陆距水汽来源远、背风侧较干或沿岸冷海流等因素，都可能参与形成荒漠。'],note:'荒漠有多种成因，不是太阳强就一定少雨，也不是一条纬线内外整齐分开。',source:{title:'USGS · 荒漠的不同形成类型',url:'https://pubs.usgs.gov/gip/deserts/types/'}},
  temperate:{title:'为什么会有明显的冷暖季节？',steps:['地轴相对公转轨道倾斜，地球绕太阳公转。','一年中，同一地点的日照时长和阳光入射角随季节改变。','可获得的太阳能随之改变，植物的生长时段也会变化。'],note:'南北半球季节相反。四季主要来自地轴倾斜；不是夏天整颗地球离太阳更近。',source:{title:'NOAA / NWS · 季节为什么形成',url:'https://www.weather.gov/fgz/Seasons'}},
  boreal:{title:'为什么高纬地区冬长、夏季生长窗口短？',steps:['高纬地区的阳光入射角和白昼长度随季节变化很大。','冬季日短、太阳低；极圈以内还会有极夜，地面获得的太阳能少。','寒冷与短生长季限制生长；夏季即使白昼很长，也不能替代足够热量。'],note:'海洋、陆地和地形会改变具体气温。常绿是换叶方式，不等于冬天仍快速生长，也不直接等于耐寒。',source:{title:'NOAA · 地轴倾斜、日照与季节',url:'https://www.climate.gov/teaching/literacy/1-c-axial-tilt-earth-governs-incoming-sunlight-and-seasonality'}},
  mountain:{title:'靠近赤道，山上为什么也可能冷？',steps:['纬度相近的地点，海拔仍可能相差很大。','山地较高处的气温通常更低；坡向、风与水分也会改变局地条件。','从山脚向高处，植物面对的热量与生长时段改变，可能出现不同植物带。'],note:'山地不是把所有纬度带整齐叠起来。不同山系的水分、土壤、种源与土地利用会改变植物组成；短时逆温也会使局地温度关系不同。',source:{title:'NPS · 山地海拔与植物带',url:'https://home.nps.gov/chir/learn/nature/sky-islands.htm'}}
};

function sources(box,items,title='查看本段依据'){
  const details=el('details',null,'learn-sources');details.append(el('summary',title));for(const item of items){const a=el('a',item.title+' ↗');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);}box.append(details);
}
function group(label,cls='app-choices'){const n=el('div',null,cls);n.setAttribute('role','group');n.setAttribute('aria-label',label);return n;}
function choice(text,active,fn){const b=el('button',text);b.type='button';b.setAttribute('aria-pressed',String(!!active));b.onclick=fn;return b;}
function cropContext(crop){return {plantId:crop.id,lon:crop.lon,lat:crop.lat,title:crop.name+'：把水、热与季节连起来',summary:crop.takeaway,label:crop.region};}
function getResponse(state,id){state.transfer??={};return state.transfer[id]??={evidence:[],reason:'',revealed:false};}

export function getApplicationContext(page,state={}){
  if(page==='transfer'){const task=TRANSFER_TASKS[Number.isInteger(state.transferIndex)&&state.transferIndex>=0&&state.transferIndex<TRANSFER_TASKS.length?state.transferIndex:0];return {lon:task.lon,lat:task.lat,title:task.title,summary:'假设练习；不是当地实测资料。'+task.setup,label:task.label};}
  return cropContext(CROP_COMPARISONS.find(c=>c.id===state.cropId)||CROP_COMPARISONS[0]);
}

export function getApplicationProgress(state={}){
  const ids=new Set(CROP_COMPARISONS.map(c=>c.id));
  const cropViewed=new Set((Array.isArray(state.cropViewed)?state.cropViewed:[]).filter(id=>ids.has(id))).size;
  const responses=TRANSFER_TASKS.map(task=>state.transfer?.[task.id]);
  return {cropViewed,transferAttempted:responses.filter(r=>r&&(Number.isInteger(r.prediction)||(Array.isArray(r.evidence)&&r.evidence.length)||String(r.reason||'').trim())).length,transferCompared:responses.filter(r=>r?.revealed).length,transferTotal:TRANSFER_TASKS.length};
}

export function explainEnvironment(box,stopId){
  for(const key of stopId==='boreal'?['boreal','mountain']:[stopId]){const process=ENVIRONMENT_PROCESSES[key];if(!process)continue;
    const section=el('details',null,'app-process');section.append(el('summary',process.title));const chain=el('ol',null,'app-process-chain');for(const text of process.steps)chain.append(el('li',text));section.append(chain,el('p',process.note,'app-note'));sources(section,[process.source],'过程依据');box.append(section);}
}

function renderCrops(box,options){
  const {state,crops,data,onChange,onFocus,onListen}=options;
  const crop=CROP_COMPARISONS.find(c=>c.id===state.cropId)||CROP_COMPARISONS[0],axis=AXES.some(([id])=>id===state.comparisonAxis)?state.comparisonAxis:'water';
  box.append(el('p','同样是粮食，为什么不总种在同一片地方？先用同一组问题比较，再看一个代表地区。','app-intro'));
  const axes=group('选择三种主粮的共同对比问题');for(const [id,label] of AXES)axes.append(choice(label,axis===id,()=>{state.comparisonAxis=id;onChange?.();}));box.append(axes);
  const compare=el('div',null,'app-crop-comparison');for(const item of CROP_COMPARISONS){const card=el('section',null,'app-crop-row');card.dataset.crop=item.id;card.append(el('h3',item.name),el('p',item[axis]));compare.append(card);}box.append(compare);
  box.append(el('h3','在地球上观察一种主粮'));
  const selector=group('选择要观察的主粮');for(const item of CROP_COMPARISONS)selector.append(choice(item.name,crop.id===item.id,()=>{state.cropId=item.id;state.cropViewed=[...new Set([...(Array.isArray(state.cropViewed)?state.cropViewed:[]),item.id])];onFocus?.(cropContext(item));onChange?.();}));box.append(selector);
  const media=el('div',null,'app-crop-media');try{media.append(renderMiniaturePreview(crop.id,{width:300,height:170}));}catch{media.append(el('p',crop.name+' · 形态示意暂不可用'));}box.append(media,el('p','形态教学示意；器官和比例经过简化。','app-note'));
  box.append(el('p',crop.region+'；不代表完整种植范围或每块田的条件。','app-location'));
  const identity=el('section',null,'app-explanation');identity.append(el('strong','认它看哪里'),el('p',crop.identify),el('strong','它怎样利用环境'),el('p',crop.adaptation),el('p','识别特征帮助认植物；是否适合一个地点，还要单独核对生理需求与田间管理。','app-note'));box.append(identity);
  const actions=group('定位与播放当前主粮');const locate=el('button','在地球上定位'+crop.name);locate.onclick=()=>{state.cropViewed=[...new Set([...(Array.isArray(state.cropViewed)?state.cropViewed:[]),crop.id])];onFocus?.(cropContext(crop));onChange?.();};actions.append(locate);
  const chapter=data?.chapters?.find(c=>c.crop===crop.id),recorded=data?.audioManifest?.chapters?.some(c=>c.id===chapter?.id);
  if(chapter&&recorded){const listen=el('button','听'+crop.name+'现有讲解');listen.onclick=()=>{const p=data.placements?.placements?.find(p=>p.cropId===crop.id&&p.lon===crop.lon&&p.lat===crop.lat);onListen?.({chapterId:chapter.id,beatIndex:p?.beatIndex??1,lon:crop.lon,lat:crop.lat,region:crop.region});};actions.append(listen);}box.append(actions);
  box.append(el('p',crop.takeaway,'app-takeaway'));
  const pattern=el('details',null,'app-process');pattern.append(el('summary','同一地区能轮流种两种主粮吗？'),el('p','可以。例如一块田在较凉的季节种小麦，在暖季种玉米；合适地区也有稻麦轮作。但能否衔接取决于收获与播种时间、热量、水源、土壤和品种，不能只看年均温。'),el('p','先问“什么季节、怎样供水、什么品种”，再问“哪个国家适合”。','app-note'));box.append(pattern);
  const allSources=[...CROP_COMPARISONS.flatMap(c=>c.sources)];sources(box,allSources,'三种主粮的比较依据');
}

function renderTransfer(box,{state,onChange,onFocus}){
  const index=Number.isInteger(state.transferIndex)&&state.transferIndex>=0&&state.transferIndex<TRANSFER_TASKS.length?state.transferIndex:0,task=TRANSFER_TASKS[index],response=getResponse(state,task.id);
  const nav=group('选择推理任务');TRANSFER_TASKS.forEach((item,i)=>nav.append(choice('任务'+(i+1)+(state.transfer?.[item.id]?.revealed?' · 已对照':''),index===i,()=>{state.transferIndex=i;onFocus?.({lon:item.lon,lat:item.lat,title:item.title,summary:item.setup,label:item.label});onChange?.();})));box.append(nav);
  box.append(el('h3',task.title),el('p','假设练习：地球只帮助定位。以下条件由题目设定，不是这个坐标的实测资料。','app-note'),el('p',task.setup,'app-task-setup'));
  const locate=el('button','在地球上定位练习地区');locate.onclick=()=>onFocus?.({lon:task.lon,lat:task.lat,title:task.title,summary:task.setup,label:task.label});box.append(locate);
  const prediction=el('section',null,'app-task-step');prediction.append(el('h3','1 · 先预测'),el('p',task.prompt));const choices=group('选择你的预测','learn-answer-options');task.predictions.forEach((text,i)=>choices.append(choice(text,response.prediction===i,()=>{response.prediction=i;response.revealed=false;onChange?.();})));prediction.append(choices);box.append(prediction);
  const evidence=el('section',null,'app-task-step');evidence.append(el('h3','2 · 找依据'),el('p','哪些线索能支持判断？可以选多条。'));const checks=el('div',null,'app-evidence');task.evidence.forEach((item,i)=>{const label=el('label'),check=el('input');check.type='checkbox';check.checked=Array.isArray(response.evidence)&&response.evidence.includes(i);check.onchange=()=>{const chosen=new Set(Array.isArray(response.evidence)?response.evidence:[]);check.checked?chosen.add(i):chosen.delete(i);response.evidence=[...chosen];response.revealed=false;onChange?.();};label.append(check,el('span',item.text));checks.append(label);});evidence.append(checks);box.append(evidence);
  const reason=el('section',null,'app-task-step');const inputId='app-reason-'+task.id,label=el('label','3 · 用自己的话解释（可选）');label.htmlFor=inputId;const input=el('textarea');input.id=inputId;input.rows=3;input.maxLength=500;input.value=typeof response.reason==='string'?response.reason:'';input.placeholder='因为这里……，所以我推测……，还需要知道……';input.oninput=()=>{response.reason=input.value;onChange?.({render:false});};reason.append(label,input,el('p','这段话保存在本机，供你回看；系统不会把自由解释自动判成正确。','app-note'));box.append(reason);
  const reveal=el('button',response.revealed?'收起对照解释':'对照解释与推理过程','learn-primary');reveal.onclick=()=>{response.revealed=!response.revealed;onChange?.();};box.append(reveal);
  if(response.revealed){const feedback=el('section',null,'app-transfer-feedback');feedback.setAttribute('role','status');feedback.append(el('h3','把地点 → 过程 → 结论连起来'));
    if(Number.isInteger(response.prediction))feedback.append(el('p',response.prediction===task.correctPrediction?'你的预测与本题解释一致。':'你的预测还需要调整，看看中间漏了哪个过程。'));
    else feedback.append(el('p','你还没有选预测。可以先读推理过程，再回头自己判断。'));
    const selected=new Set(Array.isArray(response.evidence)?response.evidence:[]),good=task.evidence.filter(item=>item.useful).length,hits=task.evidence.filter((item,i)=>item.useful&&selected.has(i)).length,mislead=task.evidence.some((item,i)=>!item.useful&&selected.has(i));
    feedback.append(el('p','你选中了 '+hits+' / '+good+' 条有用依据。'+(mislead?'其中也包含不能支持判断的线索。':'')+'预测与依据要分别检查。'));
    const chain=el('ol',null,'app-process-chain');for(const text of task.reasoning)chain.append(el('li',text));feedback.append(chain,el('p',task.explanation),el('p',task.change,'app-takeaway'));box.append(feedback);
  }
  const next=el('button',index===0?'再试一个条件变化任务 →':'回看第一个任务');next.onclick=()=>{state.transferIndex=index===0?1:0;const item=TRANSFER_TASKS[state.transferIndex];onFocus?.({lon:item.lon,lat:item.lat,title:item.title,summary:item.setup,label:item.label});onChange?.();};box.append(next);sources(box,task.sources,'本题使用的原理依据');
}

export function renderApplicationView(box,options={}){
  box.replaceChildren();box.classList.add('learn-application');const opts={state:{},...options};if(opts.page==='transfer')renderTransfer(box,opts);else renderCrops(box,opts);
}
