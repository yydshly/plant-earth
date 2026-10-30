import {createClassIntroPlayer} from './class-intro-player.js';
import {renderClimateChart,renderRegionalEvidence,normalizedClimate} from './regional-evidence-view.js';

const text=value=>typeof value==='string'?value:typeof value?.label==='string'?value.label:typeof value?.name==='string'?value.name:'';
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const cleanIds=value=>Array.isArray(value)?value.filter(id=>typeof id==='string'):[];
const distinct=values=>[...new Set(values)];
const el=(tag,value,cls)=>{const node=document.createElement(tag);if(value!=null)node.textContent=String(value);if(cls)node.className=cls;return node;};
const STEPS=Object.freeze([
  {id:'climate',title:'气候',question:'冷热、雨季与生长季怎样对应？',read:'先找冷暖和少雨月份，再结合植物的生长季理解水热条件。'},
  {id:'soil',title:'土壤与根区',question:'土壤数据说明了什么，还漏了什么？',read:'表土模型提供背景；根层、排水和实际生长基质还需分别核对。'},
  {id:'water',title:'水源与限制',question:'植物能用的水，究竟从哪里来？',read:'把降雨、河湖、灌溉、地下水和雾水分开，找出已知证据和仍缺的条件。'}
]);

// Normalize labels and associations only. This adapter never infers a plant's
// range or generates environmental values from geography.
export function regionalCourseCatalogue(pack={}){
  const source=Array.isArray(pack.regions)?pack.regions:Object.values(pack.regions||{}),associations=new Map();
  const associate=(cropId,id)=>{if(typeof cropId!=='string'||typeof id!=='string')return;if(!associations.has(id))associations.set(id,[]);associations.get(id).push(cropId);};
  for(const [cropId,ids]of Object.entries(pack.cropToRegions||{}))for(const id of cleanIds(ids))associate(cropId,id);
  for(const [cropId,id]of Object.entries(pack.cropToRegion||{}))associate(cropId,id);
  return source.filter(region=>region&&typeof region.id==='string').map(region=>({...region,
    name:text(region.name)||region.id,
    continentLabel:text(region.continentZh)||text(region.continent)||text(region.geography?.continent)||'未分洲',
    environmentLabel:text(region.environmentLabel)||text(region.biomeLabel)||text(region.biome)||text(region.environment)||text(region.climateZone)||'地区环境',
    cropIds:distinct([...cleanIds(region.cropIds),...cleanIds(region.plantIds),...(associations.get(region.id)||[])])
  }));
}

export function filterRegionalCourses(regions,filters={}){
  const query=text(filters.query).trim().toLocaleLowerCase();
  return (regions||[]).filter(region=>(!filters.continent||region.continentLabel===filters.continent)&&(!filters.environment||region.environmentLabel===filters.environment)&&(!filters.cropId||region.cropIds.includes(filters.cropId))&&(!query||[region.name,region.continentLabel,region.environmentLabel,region.searchText||'',...region.cropIds].join(' ').toLocaleLowerCase().includes(query)));
}

export function summarizeRegionalCourses(regions=[]){
  return {regions:regions.length,plants:distinct(regions.flatMap(r=>r.cropIds)).length,
    continents:distinct(regions.map(r=>r.continentLabel).filter(s=>s!=='未分洲')).length,
    climate:regions.filter(r=>normalizedClimate(r.climate).filter(m=>finite(m.t)&&finite(m.p)).length===12).length,
    soil:regions.filter(r=>finite(r.soil?.ph)||finite(r.soil?.sandPct)||finite(r.soil?.clayPct)).length,
    water:regions.filter(r=>finite(r.water?.surfaceWaterSample?.occurrencePct)).length};
}

export function createRegionalClassroom({container,playerContainer,data={},crops,onScene,onChange,onProgress,onClose,onPlayingChange}={}){
  if(!container)throw new TypeError('A regional classroom container is required');
  const cropMap=crops instanceof Map?crops:new Map((crops||data.crops||[]).map(crop=>[crop.id,crop]));
  const regions=regionalCourseCatalogue(data.regionalEnvironment).map(region=>({...region,searchText:region.cropIds.map(id=>cropMap.get(id)?.name||id).join(' ')})),byId=new Map(regions.map(region=>[region.id,region]));
  const pack=data.regionalNarration||{},chapters=new Map((pack.chapters||[]).map(chapter=>[chapter.classId||chapter.regionId,chapter])),profiles=new Map((data.environment?.profiles||[]).map(profile=>[profile.id,profile]));
  const overviewId=chapters.has('regional-overview')?'regional-overview':null;
  let enabled=false,view='home',regionId=null,step=0,following=true,status='',comparisonCropId=null,filters={continent:'',environment:'',cropId:'',query:''};
  let destroyed=false,readingFollow=true,automaticPlayback=false,followFrame=0,followEpoch=0;
  const header=el('header',null,'regional-course-header'),toolbar=el('div',null,'regional-course-toolbar'),audioHost=el('div',null,'regional-course-audio'),content=el('div',null,'regional-course-content');
  container.classList.add('regional-classroom');container.setAttribute('aria-label','全球真实地区课程');container.hidden=true;container.replaceChildren(header,toolbar,audioHost,content);audioHost.hidden=true;
  // Keep the existing media/player mounted while the reading drawer folds.
  if(playerContainer&&playerContainer!==container)playerContainer.append(audioHost);
  const chapterFor=()=>chapters.get(view==='overview'?overviewId:regionId);
  const visibleRegions=()=>filterRegionalCourses(regions,filters);
  const name=id=>cropMap.get(id)?.name||id;
  const selectedRegion=()=>byId.get(view==='overview'?chapterFor()?.beats?.[step]?.action?.regionId:regionId);
  const intro=createClassIntroPlayer({container:audioHost,pack:{...pack,chapters:[...(pack.chapters||[])].map(chapter=>({...chapter,classId:chapter.classId||chapter.regionId}))},
    labels:{listen:'听地区讲解',pause:'暂停地区讲解',resume:'继续地区讲解',seek:'地区课程音频进度',rate:'地区课程语速',note:'MiniMax 配音 · 字幕使用配音句段时间，地图按气候、土壤、水源三幕跟随。',autoLabel:'连续听讲，接着比较下一地区',autoAriaLabel:'地区课程连续听讲',autoOnNote:' 连续听讲已开启，本地区结束后接下一地区。',autoOffNote:' 连续听讲已关闭，本地区播完停下。',sentenceCaptions:true},
    onPlayingChange:value=>{if(value){if(!automaticPlayback)readingFollow=true;automaticPlayback=false;if(comparisonCropId){comparisonCropId=null;status='';renderLesson();scene();report();}queueFollowScroll();}else cancelFollowScroll();onPlayingChange?.(value);},
    onStep:index=>{if(!enabled||view==='home'||step===index)return;step=index;status='';renderLesson();report();scene();queueFollowScroll();},
    onEnded:result=>{
      const expected=view==='overview'?overviewId:regionId;if(!enabled||view==='home'||result.classId!==expected)return;
      if(result.userInitiated&&result.autoContinue){const next=view==='overview'?visibleRegions()[0]?.id:nextId();if(next){selectRegion(next,{play:true,automatic:true});return;}}
      step=2;status=result.userInitiated&&result.autoContinue?'这一组地区讲解已结束。试着用自己的话说明植物、水热与根区的联系，再选择其他地区。':'本地区讲解已结束。可以回看证据、比较下一地区，或打开连续听讲。';renderLesson();report();
    }
  });
  function cancelFollowScroll(){followEpoch++;if(followFrame&&typeof globalThis.cancelAnimationFrame==='function')globalThis.cancelAnimationFrame(followFrame);followFrame=0;}
  function queueFollowScroll(){
    cancelFollowScroll();if(!enabled||view==='home'||!following||!readingFollow||!intro.isPlaying())return;
    const epoch=followEpoch,run=()=>{followFrame=0;if(epoch!==followEpoch||!enabled||view==='home'||!following||!readingFollow||!intro.isPlaying())return;
      const topic=content.querySelector('#regional-course-topic'),outer=container.getBoundingClientRect?.(),target=topic?.getBoundingClientRect?.(),player=audioHost.getBoundingClientRect?.();
      if(!outer||!target||!player||!outer.height||!target.height||![outer.top,target.top,player.height].every(finite))return;
      const stickyHeight=container.contains(audioHost)?player.height:0;
      const current=container.scrollTop||0,wanted=Math.max(0,current+target.top-outer.top-stickyHeight-12),limit=Number.isFinite(container.scrollHeight)&&Number.isFinite(container.clientHeight)?Math.max(0,container.scrollHeight-container.clientHeight):wanted,top=Math.min(wanted,limit);
      if(Math.abs(top-current)>1)container.scrollTo?.({top,behavior:'auto'});
    };
    if(typeof globalThis.requestAnimationFrame==='function')followFrame=globalThis.requestAnimationFrame(run);else queueMicrotask(run);
  }
  const interruptReading=()=>{readingFollow=false;cancelFollowScroll();const control=content.querySelector('.regional-course-follow');if(control)control.textContent=following?'回到本段内容，继续跟随':'回到本段位置';};
  const readingKey=event=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(event.key)&&!['INPUT','SELECT','BUTTON','TEXTAREA'].includes(event.target?.tagName))interruptReading();};
  const readingPointer=event=>{if(event.target===container)interruptReading();};
  container.addEventListener('wheel',interruptReading,{passive:true});container.addEventListener('touchmove',interruptReading,{passive:true});container.addEventListener('keydown',readingKey);container.addEventListener('pointerdown',readingPointer);
  function startPlayback({automatic=false}={}){automaticPlayback=automatic;return intro.play({userInitiated:true}).finally(()=>{if(!intro.isPlaying())automaticPlayback=false;});}
  function button(label,action,cls){const node=el('button',label,cls);node.type='button';node.onclick=action;return node;}
  function report(){const state=getState();onProgress?.(state);onChange?.(state);}
  function scene(){
    if(!enabled)return;
    if(view==='home'){onScene?.({scope:'regional',view,overview:true,regionIds:visibleRegions().map(region=>region.id),regionId:null,cropId:null,title:'全球地区案例',text:'先选大洲、环境或植物，再用一个真实地区连接数据与解释。',following});return;}
    const chapter=chapterFor(),beat=chapter?.beats?.[step],region=selectedRegion();if(!region)return;
    const action=beat?.action||{},cropId=comparisonCropId||action.cropId||chapter?.cropId||region.cropIds[0]||null;
    onScene?.({scope:'regional',view,overview:view==='overview',regionId:region.id,cropId,cropIds:region.cropIds,step,evidence:action.evidence||STEPS[step].id,
      lon:finite(action.lon)?action.lon:region.lon,lat:finite(action.lat)?action.lat:region.lat,teachingContext:action.teachingContext,teachingClaim:comparisonCropId?null:action.teachingClaim,
      title:region.name+' · '+(comparisonCropId?'对照'+name(comparisonCropId)+' · ':'')+STEPS[step].title,text:comparisonCropId?plantRequirements(comparisonCropId,STEPS[step].id):beat?.text||explanation(region,chapter,STEPS[step].id),comparison:!!comparisonCropId,following});
  }
  function explanation(region,chapter,key){return text(chapter?.explanations?.[key])||text(region.mechanisms?.[key])||text(region[key+'Mechanism'])||text(region.teaching?.[key])||text(chapter?.beats?.[STEPS.findIndex(s=>s.id===key)]?.text)||STEPS.find(s=>s.id===key).read;}
  function relationMeaning(region){const kinds=new Set((region.relations||[]).map(row=>row.kind));return [kinds.has('country-production-context')?'国家商品生产背景，不是采样点种植记录':'',kinds.has('mechanism-comparison')?'机制比较，不宣称该植物在本点出现':''].filter(Boolean).join('；');}
  function plantRequirements(id,key){const profile=profiles.get(id)||{},crop=cropMap.get(id)||{};const values=key==='climate'?[profile.temperatureNote,profile.season?.type,profile.season?.timing,profile.season?.explanation]:key==='soil'?[profile.soil?.texture,profile.soil?.drainage,profile.soil?.phNote]:[profile.water?.summary,profile.water?.timing,profile.water?.caution];return values.map(text).filter(Boolean).join(' ')||crop.needs||'本条目尚缺相应物种资料，不根据地区均值推定。';}
  function heading(title,lead){const h=el('h2',title);h.id='regional-course-title';h.tabIndex=-1;header.append(h);if(lead)header.append(el('p',lead,'regional-course-lead'));}
  function nextId(){const order=visibleRegions(),index=order.findIndex(region=>region.id===regionId);return index>=0?order[index+1]?.id||null:null;}
  function renderHeader(){
    header.replaceChildren();toolbar.replaceChildren();header.append(button(view==='home'?'关闭地区课程':'← 返回地区列表',()=>view==='home'?close():showHome(),'regional-course-back'));
    if(view==='home')heading('从真实地区，看懂植物为什么在这里','先看全球布局，再选地区；每一课都按气候 → 土壤与根区 → 水源与限制来解释。');
    else{const region=selectedRegion();heading(view==='overview'?'先学会读懂地区证据':region?.name||'地区课程',view==='overview'?'跟随三个真实位置，先把“哪里、为什么、证据是什么”分开。':`${region?.continentLabel||''} · ${region?.environmentLabel||''}`);}
  }
  function selectControl(label,id,values,value,change){const wrapper=el('label',null,'regional-course-filter');wrapper.append(el('span',label));const select=el('select');select.id=id;select.setAttribute('aria-label',label);for(const [key,title]of values){const option=el('option',title);option.value=key;select.append(option);}select.value=value;select.onchange=()=>change(select.value);wrapper.append(select);return wrapper;}
  function updateFilter(key,value){intro.pause();filters={...filters,[key]:value};status='';renderHome();report();scene();}
  function renderHome(){
    view='home';container.dataset.view=view;audioHost.hidden=true;renderHeader();content.replaceChildren();const summary=summarizeRegionalCourses(regions);
    const counts=el('div',null,'regional-course-counts');for(const [value,label]of [[summary.regions,'真实地区案例'],[summary.plants,'关联植物条目'],[summary.continents,'大洲']]){const card=el('div');card.append(el('strong',value),el('span',label));counts.append(card);}content.append(counts);
    const actions=el('div',null,'regional-course-start');if(overviewId)actions.append(button('先听全球地区导览',startOverview,'regional-course-primary'));
    const firstButton=button('从当前列表第一个地区开始听',()=>{const first=visibleRegions()[0];if(first)selectRegion(first.id,{play:true});},overviewId?'':'regional-course-primary');firstButton.id='regional-course-start-first';actions.append(firstButton);content.append(actions);
    content.append(el('p',`已接入逐月气候 ${summary.climate} 处、陆地土壤模型 ${summary.soil} 处、地表水像元 ${summary.water} 处。采样位置是教学案例，不是植株观测或全球适生范围。`,'regional-course-boundary'));
    const allCropIds=distinct(regions.flatMap(region=>region.cropIds)).sort((a,b)=>name(a).localeCompare(name(b),'zh-CN'));
    toolbar.append(selectControl('按大洲','regional-continent-filter',[['','全部大洲'],...distinct(regions.map(region=>region.continentLabel)).map(value=>[value,value])],filters.continent,value=>updateFilter('continent',value)),selectControl('按环境','regional-environment-filter',[['','全部环境'],...distinct(regions.map(region=>region.environmentLabel)).map(value=>[value,value])],filters.environment,value=>updateFilter('environment',value)),selectControl('按植物','regional-plant-filter',[['','全部植物'],...allCropIds.map(id=>[id,name(id)])],filters.cropId,value=>updateFilter('cropId',value)));
    const label=el('label',null,'regional-course-query');label.append(el('span','找地区或植物'));const query=el('input');query.type='search';query.value=filters.query;query.placeholder='地区名、洲名或植物';query.setAttribute('aria-label','搜索真实地区课程');query.oninput=()=>{filters={...filters,query:query.value};renderCards();scene();report();};label.append(query);toolbar.append(label);const clear=button('清除筛选，查看全球',()=>{intro.pause();filters={continent:'',environment:'',cropId:'',query:''};renderHome();scene();report();},'regional-course-clear');clear.id='regional-course-clear';toolbar.append(clear);
    const listStatus=el('p',null,'regional-course-list-count');listStatus.id='regional-course-list-count';listStatus.setAttribute('role','status');const cards=el('div',null,'regional-course-cards');cards.id='regional-course-cards';content.append(listStatus,cards);renderCards();
  }
  function renderCards(){
    const cards=content.querySelector('#regional-course-cards'),count=content.querySelector('#regional-course-list-count');if(!cards||!count)return;cards.replaceChildren();const rows=visibleRegions();count.textContent=`当前 ${rows.length} / ${regions.length} 个地区 · 点击地区，先看位置与解释，再选择播放。`;const first=content.querySelector('#regional-course-start-first');if(first)first.disabled=!rows.length;const clear=toolbar.querySelector('#regional-course-clear');if(clear)clear.disabled=!Object.values(filters).some(Boolean);
    for(const region of rows){const chapter=chapters.get(region.id),card=button('',()=>selectRegion(region.id),'regional-course-card');card.dataset.regionId=region.id;card.append(el('span',region.continentLabel+' · '+region.environmentLabel,'regional-course-card-kicker'),el('strong',region.name),el('span',region.cropIds.map(name).join('、'),'regional-course-card-plants'));
      const description=text(region.summary)||text(region.intro)||text(region.teachingSummary)||text(chapter?.summary);if(description)card.append(el('span',description,'regional-course-card-summary'));const meaning=relationMeaning(region);if(meaning)card.append(el('small',meaning,'regional-course-relation'));card.append(el('small',chapter?'气候 → 土壤 → 水源 · 可听讲解':'气候 → 土壤 → 水源 · 阅读数据'));cards.append(card);}
    if(!rows.length)cards.append(el('p','当前条件没有地区。试着切回全部大洲、环境或植物；没有记录不表示该植物无法在那里生长。'));
  }
  function renderFact(region,key){
    const fact=el('section',null,'regional-course-fact');fact.append(el('h4','先看这项真实资料'));
    if(key==='climate'){fact.append(renderClimateChart(region.climate,{compact:true}));fact.append(el('p',[text(region.climate?.period),text(region.climate?.resolution)].filter(Boolean).join(' · '),'regional-course-source-line'));}
    else if(key==='soil'){const soil=region.soil||{},metrics=el('dl',null,'regional-course-metrics');for(const [field,label,unit]of [['ph','表层 pH（水）',''],['sandPct','砂粒质量占比','%'],['clayPct','黏粒质量占比','%']])if(finite(soil[field])){metrics.append(el('dt',label),el('dd',soil[field].toFixed(1)+unit));}if(metrics.children.length)fact.append(metrics);else fact.append(el('p',soil.summary||soil.reason||(soil.status==='not-applicable'?'陆地土壤模型不适用于本例的实际生长基质，请看当地底质、水体或附生根区资料。':'本采样位置尚无可用土壤模型，不用邻近气候数据补造。')));
      const depth=Array.isArray(soil.depthCm)?soil.depthCm.join('–')+' cm':soil.depthCm||soil.depth||'';fact.append(el('p',[text(soil.resolution),depth,'模型值不能替代根旁土样与排水调查'].filter(Boolean).join(' · '),'regional-course-source-line'));}
    else{const water=region.water||{};fact.append(el('p',water.type||'分别查看实际水源'));for(const metric of water.metrics||[]){if(metric.value!==null&&metric.value!==undefined)fact.append(el('p',`${metric.name}：${metric.value} ${metric.unit||''}${metric.period?'（'+metric.period+'）':''}`,'regional-course-water-metric'));}if(!(water.metrics||[]).length)fact.append(el('p','没有接入可用数值时，保留生境资料与缺失说明。'));fact.append(el('p','地表水出现频率不是水深，也不能代替地下水、根区水或灌溉量。','regional-course-source-line'));}
    return fact;
  }
  function comparePlant(id){
    const region=selectedRegion(),chapter=chapterFor();if(!enabled||view!=='lesson'||!region||!distinct([...region.cropIds,...cleanIds(chapter?.cropIds)]).includes(id))return false;
    intro.pause();comparisonCropId=id;following=true;status='正在对照'+name(id)+'的物种需求；语音已暂停。';renderLesson();scene();report();return true;
  }
  function renderPlantComparison(region,chapter){
    if(view!=='lesson')return null;const ids=distinct([...region.cropIds,...cleanIds(chapter?.cropIds)]);if(ids.length<2)return null;const active=comparisonCropId||chapter?.beats?.[step]?.action?.cropId||chapter?.cropId||ids[0],section=el('section',null,'regional-course-plant-comparison');
    section.append(el('h4','同一地区背景，换一种植物会有什么不同？'),el('p','点植物会暂停语音，比较该植物对当前环境条件的需要。重新播放时，地图和正文会回到旁白对应的植物。','regional-course-source-line'));
    const choices=el('div',null,'regional-course-compare-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','比较地区关联植物的环境需要');for(const id of ids){const choice=button(name(id),()=>comparePlant(id));choice.setAttribute('data-compare-crop',id);choice.setAttribute('aria-pressed',String(id===active));choices.append(choice);}section.append(choices,el('h5',name(active)+' · '+STEPS[step].title+'需求'),el('p',plantRequirements(active,STEPS[step].id)));
    const relation=(region.relations||[]).find(row=>row.cropId===active);if(relation?.note)section.append(el('p','关联依据：'+relation.note,'regional-course-source-line'));
    section.append(el('p','这里把物种资料与同一个地区背景对照，不证明它们在采样点共同出现，也不证明这块土地适合种植。','regional-course-source-line'));
    const sourceRows=profiles.get(active)?.sources||[];if(sourceRows.length){const sources=el('details');sources.append(el('summary','查看'+name(active)+'的物种环境资料来源'));for(const row of sourceRows){if(!row.url)continue;const link=el('a',row.title||'物种资料');link.href=row.url;link.target='_blank';link.rel='noopener noreferrer';sources.append(link);}section.append(sources);}return section;
  }
  function renderLesson(){
    container.dataset.view=view;container.dataset.activeEvidence=STEPS[step].id;audioHost.hidden=false;renderHeader();content.replaceChildren();const region=selectedRegion(),chapter=chapterFor();if(!region){content.append(el('p','此课程没有有效地区关联，请返回列表。'));return;}
    if(status){const notice=el('p',status,'regional-course-status');notice.setAttribute('role','status');content.append(notice);}
    const location=el('p',`${region.name} · ${Number(region.lat).toFixed(2)}°，${Number(region.lon).toFixed(2)}°`,'regional-course-location');content.append(location);
    if(view==='overview'){
      const across=distinct([...cleanIds(chapter?.cropIds),...(chapter?.beats||[]).map(beat=>beat.action?.cropId).filter(Boolean)]),current=chapter?.beats?.[step]?.action?.cropId||chapter?.cropId||region.cropIds[0];
      content.append(el('p','总览跨地区比较：'+across.map(name).join('、')+'；这些例子来自不同地区。','regional-course-plants'),el('p','当前地区只看：'+name(current)+'。这里只定位本段环境教学案例，不证明采样点存在此植物。','regional-course-plants'));
    }else{const associated=distinct([...region.cropIds,...cleanIds(chapter?.cropIds)]);content.append(el('p','关联植物：'+associated.map(name).join('、')+'。这些是地区教学关联，不表示同株、同田或同一点共同出现。','regional-course-plants'));}
    const meaning=relationMeaning(region);if(meaning)content.append(el('p','关联依据：'+meaning+'。','regional-course-relation'));
    const tabs=el('nav',null,'regional-course-steps');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','地区课程的三项证据');STEPS.forEach((item,index)=>{const tab=button(`${index+1} ${item.title}`,()=>selectStep(index));tab.id='regional-course-step-'+index;tab.setAttribute('role','tab');tab.setAttribute('aria-selected',String(step===index));tab.setAttribute('aria-controls','regional-course-topic');tabs.append(tab);});content.append(tabs);
    const topic=el('section',null,'regional-course-topic');topic.id='regional-course-topic';topic.setAttribute('role','tabpanel');topic.setAttribute('aria-labelledby','regional-course-step-'+step);topic.append(el('h3',STEPS[step].question),renderFact(region,STEPS[step].id));
    const mechanism=el('section',null,'regional-course-mechanism');mechanism.append(el('h4','这些资料怎样帮助解释植物分布？'),el('p',explanation(region,chapter,STEPS[step].id)));topic.append(mechanism);
    topic.append(el('p',STEPS[step].read,'regional-course-read-prompt'));const comparison=renderPlantComparison(region,chapter);if(comparison)topic.append(comparison);content.append(topic);
    const follow=button(following?(readingFollow?'地图与内容正在跟随本段':'回到本段内容，继续跟随'):'回到本段位置',()=>{following=true;readingFollow=true;scene();renderLesson();report();queueFollowScroll();},'regional-course-follow');follow.setAttribute('aria-pressed',String(following));content.append(follow);
    const details=el('details',null,'regional-course-data-details');details.append(el('summary','核对全部气候、土壤、水源数值与来源'),renderRegionalEvidence(region));if((region.relations||[]).length){const relations=el('section',null,'regional-course-relations');relations.append(el('h4','植物与本地区的关联依据'));for(const row of region.relations){const p=el('p',name(row.cropId)+'：'+(row.note||'参见来源说明。'));if(row.sourceUrl){const a=el('a','查看关联来源');a.href=row.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';p.append(a);}relations.append(p);}details.append(relations);}content.append(details);
    const next=view==='overview'?visibleRegions()[0]?.id:nextId(),actions=el('div',null,'regional-course-bottom-actions');actions.append(button('← 地区列表',showHome));if(next)actions.append(button((view==='overview'?'开始第一个地区：':'下一地区并播放：')+byId.get(next).name,()=>selectRegion(next,{play:true}),'regional-course-next'));content.append(actions);
  }
  function selectStep(index){if(!enabled||view==='home')return;readingFollow=false;cancelFollowScroll();step=Math.max(0,Math.min(2,Math.trunc(index)));intro.seekStep(step);status='';renderLesson();report();scene();}
  function selectRegion(id,{play=false,automatic=false}={}){
    const region=byId.get(id);if(!region)return false;const previous=selectedRegion()?.name;intro.pause();comparisonCropId=null;regionId=id;view='lesson';step=0;following=true;status=automatic&&previous?previous+'讲解结束，接着比较'+region.name+'。':'';
    if(!visibleRegions().some(region=>region.id===id))filters={continent:'',environment:'',cropId:'',query:''};
    intro.setClass(id);intro.seekStep(0);renderLesson();report();scene();if(!automatic)container.scrollTo?.({top:0});if(play)startPlayback({automatic});return true;
  }
  function startOverview(){if(!enabled||!overviewId)return false;intro.pause();comparisonCropId=null;view='overview';regionId=null;step=0;following=true;status='';intro.setClass(overviewId);intro.seekStep(0);renderLesson();report();scene();container.scrollTo?.({top:0});startPlayback();return true;}
  function showHome(){intro.pause();comparisonCropId=null;view='home';status='';renderHome();report();scene();container.scrollTo?.({top:0});}
  function open(options={}){
    if(destroyed)return false;enabled=true;container.hidden=false;container.dataset.enabled='true';intro.pause();following=true;status='';
    if(options.cropId)filters={continent:'',environment:'',cropId:options.cropId,query:''};
    if(options.regionId&&byId.has(options.regionId))selectRegion(options.regionId);else showHome();return true;
  }
  function close(){cancelFollowScroll();intro.pause();audioHost.hidden=true;if(!enabled)return;comparisonCropId=null;enabled=false;container.hidden=true;container.dataset.enabled='false';onScene?.(null);onClose?.();onChange?.(getState());}
  function pause(){cancelFollowScroll();intro.pause();}
  function play(){if(!enabled||destroyed)return Promise.resolve(false);if(view==='home'){const first=visibleRegions()[0];if(!first)return Promise.resolve(false);selectRegion(first.id);}return startPlayback();}
  function getState(){const region=selectedRegion(),chapter=chapterFor(),action=chapter?.beats?.[step]?.action,narrationCropId=action?.cropId||chapter?.cropId||region?.cropIds?.[0]||null;return {enabled,view,regionId:view==='overview'?action?.regionId||null:regionId,cropId:comparisonCropId||narrationCropId,narrationCropId,comparisonCropId,step,evidence:STEPS[step].id,following,readingFollow,playing:intro.isPlaying(),filters:{...filters},order:visibleRegions().map(region=>region.id),totalRegions:regions.length};}
  return {open,close,pause,play,isEnabled:()=>enabled,getState,setFollowing(value){following=value!==false;if(following)readingFollow=true;else cancelFollowScroll();if(enabled&&view!=='home'){scene();renderLesson();report();queueFollowScroll();}},
    showHome,selectRegion,selectStep,startOverview,comparePlant,destroy(){if(destroyed)return;close();destroyed=true;intro.destroy();audioHost.remove();container.removeEventListener('wheel',interruptReading);container.removeEventListener('touchmove',interruptReading);container.removeEventListener('keydown',readingKey);container.removeEventListener('pointerdown',readingPointer);container.replaceChildren();}};
}
