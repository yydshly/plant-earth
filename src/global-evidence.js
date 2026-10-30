import * as THREE from 'three';
import {geoEquirectangular,geoPath,geoContains,geoCentroid,geoArea,geoGraticule10} from 'd3';
import {createCropMiniature,renderMiniaturePreview,disposeMiniature} from './plant-miniatures.js';
import {GLOBAL_COLORS as C,isNumber,valueFor,rankedRows,productionScale,productionSummary,formatGlobalValue,botanicalStatus} from './global-evidence-model.js';
import {characterAtTime,timeAtCharacter} from './narration-clock.js';
import {normalizedFeatureCollection} from './global-evidence-map.js';
import {createGlobalGeographyLabels} from './global-geography-labels.js';
import {countryLabel,countryNameZh} from './country-label-data.js';
import {catalogueSummary,catalogueGroups,catalogueBrowseGroups,filterCatalogue} from './global-catalog-model.js';
import {createPlantCourseHub} from './plant-course-hub.js';
import {evidenceRegion,renderRegionalEvidence,renderClimateChart} from './regional-evidence-view.js';
import {createRegionalMapLayer} from './regional-map-layer.js';
import {createRegionalOverviewLayer,REGION_CONTINENT_COLORS,regionContinent} from './regional-overview-layer.js';
import {createRegionalClassroom} from './regional-classroom.js';
import {renderRegionalSceneCard} from './regional-scene-view.js';
import {createRegionalGlobeCues,resolveRegionalGlobeCuePosition} from './regional-globe-cues.js';
import {BIODIVERSITY_COURSES} from './biodiversity-content.js';
import {CROP_CLASSES} from './crop-class-content.js';
import {createClassGlobeAnchors} from './class-globe-anchors.js';
import {resolveClassGlobeAnchors} from './class-globe-anchor-model.js';
import {isAutoContinueEnabled,setAutoContinueEnabled,subscribeAutoContinue} from './playback-preferences.js';
import {courseTeachingFocus,mapTeachingFocus,regionalTeachingFocus,renderTeachingFocus,queueTeachingFocus} from './teaching-focus.js';

const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const svg=(tag,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e;};
const statusName={native:'原生记录',introduced:'引入野生记录',extinct:'已灭绝记录',doubtful:'存疑记录',unrecorded:'本快照未记录'};
const continentNames={'002':'非洲','019':'美洲','142':'亚洲','150':'欧洲','009':'大洋洲'};
const percent=v=>isNumber(v)?(v*100).toFixed(1)+'%':'缺失';
function largestCenter(f){if(!f)return [35,12];if(f.geometry.type!=='MultiPolygon')return geoCentroid(f);const g=f.geometry.coordinates.map(c=>({type:'Polygon',coordinates:c})).sort((a,b)=>geoArea(b)-geoArea(a))[0];return geoCentroid(g);}

export function createGlobalEvidence(api){
  const {data,crops,globe,camera,globeRoot,vector,requestDraw,moveTo}=api;
  const pack=data.globalEvidence||{},sourceBotanical=pack.distribution||{plants:[],regions:{features:[]}},botanical={...sourceBotanical,regions:normalizedFeatureCollection(sourceBotanical.regions)},production=pack.production||{plants:[]};
  const bp=new Map(botanical.plants.map(p=>[p.cropId,p])),pp=new Map(production.plants.map(p=>[p.cropId,p]));
  const regions=new Map(botanical.regions.features.map(f=>[f.properties.code,f])),countries=new Map(data.world.features.map(f=>[f.properties.id==='SDS'?'SSD':f.properties.id,f]));
  const profiles=new Map((data.environment?.profiles||[]).map(p=>[p.id,p])),photos=new Map((data.plantPhotos?.photos||[]).map(p=>[p.cropId,p]));
  let enabled=false,cropId='rice',mode='production',metric='production',selected=null,continent='',query='',fullMap=false,model=null,tourIndex=-1,playing=false,activeAudioChapter=null,audioCues=[],lastCue=-1,returnFocus=null,following=true;
  let introContext=null,catalogueCollection='agriculture',catalogueGroup='',catalogueQuery='',mapViewChoice=null;
  // A fresh module starts on the globe. Explicit view changes are kept for this visit.
  // Previous persisted map choices are not promoted into a new entry.
  let mapReferenceAnchors=null,mapReferenceKey='';
  let courseAnchors=null,courseDetailExpanded=false,courseAnchorKey='';
  let regionalDetailExpanded=false,mapDetailExpanded=false,regionalCues=null,dataPresentationKey='',reviewContext=false;
  let classroom,catalogueTab='learn',guidedStage=null,classScene=null,caseLayer=null,activeCase=null,lastBioSceneKey='',globalContinuationIntent=false,mapReady=false,regionalClassroom=null,regionalOverview=null,regionalFocus=false,regionalScene=null,coursePlaying=false;
  const mapState=()=>{const s=introContext||{cropId,mode,metric,selected,fullMap,tourIndex};return {cropId:s.cropId,cropName:crops.get(s.cropId)?.name,mode:s.mode,metric:s.metric,selected:s.selected,fullMap:s.fullMap,tourIndex:s.tourIndex,caseRegionId:activeCase?.region.id||null};};
  const reportMap=()=>api.onMapProgress?.(mapState());
  const scope=catalogueSummary(crops.values(),production.plants,botanical.plants,profiles.values());
  let paintedCountryId=null;
  let placeDensity='major';try{const saved=localStorage.getItem('plant-earth-place-density-v1');if(['major','more','off'].includes(saved))placeDensity=saved;}catch{}
  const root=new THREE.Group();root.visible=false;globe.add(root);
  const label=node('div',null,'global-plant-label');label.hidden=true;globeRoot.append(label);
  const host=node('section',null,'global-evidence');host.id='global-evidence';host.hidden=true;host.setAttribute('aria-label','真实数据全球植物地图');
  host.innerHTML=`<header class="global-header"><div><p class="global-eyebrow">图鉴 ${scope.entries} 条目 · 农业 ${scope.agriculture} · 其他 ${scope.biodiversity}</p><h1>植物的全球地图</h1></div><div class="global-head-actions"><button id="global-catalog-toggle" aria-expanded="false" aria-controls="global-catalog">分类学习</button><div class="global-view-switch" role="group" aria-label="切换三维地球或展开地图"><button id="global-globe-toggle" aria-pressed="true">3D地球</button><button id="global-map-toggle" aria-pressed="false">展开地图</button></div><button id="global-regional-start">全球地区课</button><button id="global-exit">返回学习路线</button></div><div class="global-selects"><label>认识哪种植物<select id="global-plant"></select></label><div class="global-mode" role="group" aria-label="数据含义"><button id="global-production" aria-pressed="true">实际农业统计</button><button id="global-botanical" aria-pressed="false">原生与引入</button></div><label id="global-metric-label">比较指标<select id="global-metric"><option value="production">产量 · 吨</option><option value="area">收获面积 · 公顷</option></select></label></div></header>
  <section id="global-catalog" class="global-catalog" hidden aria-label="植物课程与图鉴"><div class="global-catalog-heading"><strong>植物课程与图鉴</strong><button id="global-catalog-close" aria-label="关闭分类与图鉴">收起</button></div><div class="global-catalog-tabs" role="tablist" aria-label="分类学习或查找植物"><button id="global-catalog-learn-tab" role="tab" aria-selected="true" aria-controls="crop-classroom">系统认识植物</button><button id="global-catalog-browse-tab" role="tab" aria-selected="false" aria-controls="global-catalog-inventory">查找全部条目</button></div><div id="crop-classroom" role="tabpanel" aria-labelledby="global-catalog-learn-tab"></div><div id="global-catalog-inventory" role="tabpanel" aria-labelledby="global-catalog-browse-tab" hidden><button id="global-catalog-return" class="classroom-back">← 返回分类学习</button><p id="global-catalog-scope"></p><details class="global-catalog-coverage"><summary>这份目录覆盖了什么？</summary><p id="global-catalog-evidence"></p><p>同一条目可属多个用途，分类数量不可相加。条目包含栽培群、杂交作物及同种植物的不同用途，条目数不是独立物种数。全球农业、原生引入和环境知识是三种不同证据。</p></details><div class="global-catalog-filters"><label>范围<select id="global-catalog-collection" aria-label="目录范围"><option value="agriculture">农业与园艺</option><option value="">全部植物</option><option value="biodiversity">其他代表植物</option></select></label><label>类别<select id="global-catalog-group" aria-label="目录类别"></select></label><label class="global-catalog-query">搜索植物<input id="global-catalog-search" type="search" placeholder="中文、学名或用途" autocomplete="off"></label></div><p id="global-catalog-count" role="status"></p><div id="global-catalog-rows" class="global-catalog-rows"></div></div></section>
  <aside class="global-panel"><section id="global-guided-task" hidden></section><div class="global-panel-title"><span id="global-source-chip"></span><h2 id="global-title"></h2><p id="global-meaning"></p></div><div id="global-entry-evidence" class="global-entry-evidence"></div><div id="global-stats" class="global-stats"></div><div id="global-comparison" class="global-comparison"></div><div id="global-region-detail" aria-live="polite"></div><section id="global-regional-data" hidden></section><details id="global-environment" open><summary>为什么它能在这些环境生长？</summary><div id="global-environment-body"></div></details><details><summary>查看来源、口径与缺失情况</summary><div id="global-sources"></div></details><button id="global-old-narration">听形态与环境讲解 ↗</button></aside>
  <div id="global-map" class="global-world-map" hidden><div class="global-map-heading"><strong>世界展开图 · 所有方向一起看</strong><span>点击有颜色的地区，查看记录</span></div><p class="world-projection-note">上北下南，左右为东西；球面展开后极区被拉伸，不要直接比较图上面积。</p><svg id="global-svg" viewBox="0 0 960 480" role="group" aria-label="全球数据展开图"></svg></div>
  <section class="global-list"><div id="global-class-route" class="global-class-route" hidden></div><div class="global-list-heading"><h2 id="global-list-title">地区记录</h2><button id="global-list-toggle" aria-expanded="false">展开地区列表</button></div><div class="global-list-content" hidden><div class="global-list-filters"><label>大洲<select id="global-continent"><option value="">全球</option></select></label><label>查找地区<input id="global-search" type="search" placeholder="例如：中国、印度"></label></div><div id="global-rows"></div></div></section>
  <div class="global-key" id="global-key"></div>
  <footer class="global-tour"><div class="global-tour-top"><span id="global-tour-step"></span><button id="global-audio-intro">先听读图说明</button><button id="global-intro-return" hidden></button><button id="global-follow" aria-pressed="true">跟随中</button><button id="global-tour-start">按顺序看懂这张图</button><button id="global-tour-prev">上一步</button><button id="global-tour-next">下一步</button></div><p id="global-caption" aria-live="polite"></p><div class="global-audio"><button id="global-audio-play">播放 MiniMax 讲解</button><span id="global-audio-time">00:00</span><input id="global-audio-seek" type="range" min="0" max="1000" value="0" step="1" aria-label="全球导览音频进度"><label>倍速<select id="global-audio-rate"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option></select></label></div></footer>`;
  document.body.append(host);const $=id=>host.querySelector('#'+id);
  host.querySelector('.global-header>div').append($('global-regional-start'));
  const regionalHost=node('section');regionalHost.id='regional-classroom';regionalHost.hidden=true;host.append(regionalHost);const regionalCard=node('aside');regionalCard.id='regional-scene-card';regionalCard.className='regional-scene-card';regionalCard.hidden=true;regionalCard.setAttribute('aria-label','当前地区的证据与机制');host.append(regionalCard);
  const companion=node('aside',null,'class-globe-companion');companion.hidden=true;companion.setAttribute('aria-label','当前类别的形态与讲解');host.append(companion);
  const dataControls=node('aside',null,'globe-data-controls');dataControls.id='globe-data-controls';dataControls.hidden=true;dataControls.setAttribute('aria-label','球面讲解的对象与资料');host.append(dataControls);
  const dataToggle=node('button','展开数值与依据');dataToggle.id='global-data-detail-toggle';dataToggle.type='button';dataToggle.onclick=()=>regionalFocus?setRegionalDetailExpanded(!regionalDetailExpanded):setMapDetailExpanded(!mapDetailExpanded);host.querySelector('.global-head-actions').prepend(dataToggle);
  const dataClose=node('button','收起资料，回到地球');dataClose.id='global-data-detail-close';dataClose.type='button';dataClose.onclick=()=>setMapDetailExpanded(false);host.querySelector('.global-panel').prepend(dataClose);
  // The original country list remains reachable inside the explicit data drawer.
  host.querySelector('.global-panel').insertBefore(host.querySelector('.global-list'),$('global-panel-title')||host.querySelector('.global-panel').children[1]);

  function courseFocus(){return !regionalFocus&&!$('global-catalog').hidden&&catalogueTab==='learn';}
  const countryAtCache=new Map();
  function teachingGeography(){
    const activeAnchor=courseAnchors?.getState().anchors.find(a=>a.active);
    const point=!enabled?api.getLearningGeographyContext?.():regionalFocus||classScene?.scope==='biodiversity'&&courseFocus()?activeCase?.region:courseFocus()||reviewContext?activeAnchor:null;
    if(!point)return null;
    const key=point.lon+','+point.lat;let id=point.countryIso3;
    if(!id){if(!countryAtCache.has(key))countryAtCache.set(key,data.world.features.find(f=>geoContains(f,[point.lon,point.lat]))?.properties.id||null);id=countryAtCache.get(key);}
    if(id==='SDS')id='SSD';
    return {id,lon:point.lon,lat:point.lat,region:point.region||point.name||point.label,country:id?countryNameZh(id):null};
  }
  function setRegionalDetailExpanded(value){regionalDetailExpanded=value===true;renderDataPresentation();api.onLayout?.();requestDraw();}
  function setMapDetailExpanded(value){mapDetailExpanded=value===true;renderDataPresentation();api.onLayout?.();requestDraw();if(!mapDetailExpanded)dataToggle.focus({preventScroll:true});}
  function regionalInsets(){
    const header=host.querySelector('.global-header').getBoundingClientRect(),drawer=regionalHost.getBoundingClientRect(),mini=dataControls.getBoundingClientRect(),lesson=!!regionalScene&&regionalScene.view!=='home';
    if(regionalDetailExpanded)return {focusScale:1,top:header.bottom+12,left:innerWidth<=760?18:drawer.right+20,right:18,bottom:innerWidth<=760?Math.max(24,innerHeight-drawer.top+12):24};
    return {focusScale:1,top:innerWidth<=760?Math.max(header.bottom+12,mini.bottom+10):header.bottom+12,left:innerWidth>760&&mini.width?mini.right+20:18,right:18,bottom:lesson?Math.max(26,innerHeight-drawer.top+14):26};
  }
  function dataInsets(){
    const header=host.querySelector('.global-header').getBoundingClientRect(),dock=host.querySelector('.global-tour').getBoundingClientRect(),mini=dataControls.getBoundingClientRect(),key=$('global-key').getBoundingClientRect(),panel=host.querySelector('.global-panel').getBoundingClientRect();
    host.style.setProperty('--data-dock-height',dock.height+'px');
    return {focusScale:1,top:innerWidth<=760?Math.max(header.bottom+12,mini.bottom+10):header.bottom+12,left:18,right:mapDetailExpanded&&innerWidth>760?Math.max(330,innerWidth-panel.left+18):18,bottom:mapDetailExpanded&&innerWidth<=760?Math.max(26,innerHeight-panel.top+12):Math.max(26,innerHeight-dock.top+Math.min(68,key.height)+17)};
  }
  function makeDataButton(text,action){const b=node('button',text);b.type='button';b.onclick=action;return b;}
  function renderDataPresentation(){
    const mapFocus=enabled&&!regionalFocus&&!courseFocus(),regionActive=enabled&&regionalFocus;
    const sourceDock=host.querySelector('.global-tour').getBoundingClientRect();host.style.setProperty('--data-dock-height',sourceDock.height+'px');
    host.dataset.mapFocus=String(mapFocus);host.dataset.mapDetail=String(mapDetailExpanded);host.dataset.regionalDetail=String(regionalDetailExpanded);
    dataToggle.hidden=reviewContext||!mapFocus&&!regionActive;dataToggle.textContent=regionActive?(regionalDetailExpanded?'收起地区资料':'展开地区资料'):(mapDetailExpanded?'收起数值与依据':'展开数值与依据');dataToggle.setAttribute('aria-expanded',String(regionActive?regionalDetailExpanded:mapDetailExpanded));
    syncMapReference(mapFocus&&!reviewContext);
    dataControls.hidden=reviewContext||!mapFocus&&!regionActive;host.dataset.reviewContext=String(reviewContext);
    const regionState=regionalClassroom?.getState(),signature=JSON.stringify([mapFocus,regionActive,reviewContext,regionalDetailExpanded,mapDetailExpanded,fullMap,cropId,mode,metric,selected,tourIndex,guidedStage,regionState?.view,regionState?.regionId,regionState?.cropId,regionState?.comparisonCropId,regionState?.step,regionState?.following,regionState?.order]);if(signature===dataPresentationKey)return;dataPresentationKey=signature;dataControls.replaceChildren();if(reviewContext)return;
    if(regionActive){
      const state=regionalClassroom?.getState(),all=data.regionalEnvironment?.regions||[],region=all.find(r=>r.id===state?.regionId),home=state?.view==='home';
      dataControls.append(node('strong',home?'全球地区课堂':(region?.name||'全球地区导览'),'globe-data-title'));
      if(!home){const chapter=data.regionalNarration?.chapters?.find(c=>c.regionId===region?.id);renderTeachingFocus(dataControls,regionalTeachingFocus({scene:regionalScene,region,chapter,profile:profiles.get(state?.cropId)}),{remember:enabled});}
      const choice=node('select');choice.setAttribute('aria-label','选择球面地区课堂');choice.append(node('option','选择一个地区'));choice.firstChild.value='';const ids=state?.order||all.map(r=>r.id);
      for(const id of ids){const row=all.find(r=>r.id===id);if(!row)continue;const option=node('option',row.name);option.value=id;choice.append(option);}choice.value=state?.view==='lesson'?state.regionId:'';choice.onchange=()=>{if(choice.value)regionalClassroom.selectRegion(choice.value);};dataControls.append(choice);
      const actions=node('div',null,'globe-data-actions');
      if(home){actions.append(makeDataButton('先听全球导览',()=>regionalClassroom.startOverview()),makeDataButton('地区列表与筛选',()=>setRegionalDetailExpanded(true)));dataControls.append(actions,node('small','点球上地区，或在此选择。标记是环境案例；颜色区分大洲。'));const legend=node('div',null,'globe-data-legend');for(const [name,color]of Object.entries(REGION_CONTINENT_COLORS)){const item=node('span',name),swatch=node('i');swatch.style.background=color;item.prepend(swatch);legend.append(item);}dataControls.append(legend);}
      else{['气候','土壤','水源'].forEach((title,index)=>{const b=makeDataButton((index+1)+' '+title,()=>regionalClassroom.selectStep(index));b.setAttribute('aria-current',state?.step===index?'step':'false');actions.append(b);});dataControls.append(actions);
        const tools=node('div',null,'globe-data-actions');tools.append(makeDataButton(state?.following===false?'回到当前讲解':'跟随中',()=>regionalClassroom.setFollowing(true)),makeDataButton('地区资料',()=>setRegionalDetailExpanded(!regionalDetailExpanded)),makeDataButton('换地区',()=>{regionalClassroom.showHome();setRegionalDetailExpanded(true);}));dataControls.append(tools,node('small',crops.get(state?.cropId)?.name+' · 黄标是环境资料位置，并非植株观测。'));
      }
    }else if(mapFocus){
      dataControls.append(node('strong',current()?.name+' · '+(tourIndex>=0?['看全球','看地区','环境与限制'][tourIndex]:'全球分布'),'globe-data-title'));
      const selectedFeature=selected?(mode==='production'?countries:regions).get(selected):null;
      renderTeachingFocus(dataControls,mapTeachingFocus({plant:current(),profile:profiles.get(cropId),mode,year:prod()?.year,metric,selected,fullMap,selectedName:selectedFeature?nameFor(selectedFeature):null,stage:tourIndex,evidenceSources:mode==='production'?[{title:'FAOSTAT · 农业统计与口径',url:production.metadata.sourceUrl}]:[{title:'植物条目与分布依据',url:dist()?.sourceUrl},{title:'WCVP · 植物地理记录',url:botanical.metadata.sourceUrl}]}),{remember:enabled&&!introContext&&guidedStage!=='review'});
      const select=node('select');select.setAttribute('aria-label','选择地图植物');for(const crop of crops.values()){const option=node('option',crop.name);option.value=crop.id;select.append(option);}select.value=cropId;select.onchange=()=>changePlant(select.value);dataControls.append(select);
      const modes=node('div',null,'globe-data-actions');for(const [key,title]of [['production','农业统计'],['botanical','原生与引入']]){const b=makeDataButton(title,()=>setMode(key));b.disabled=key==='production'&&!pp.has(cropId);b.setAttribute('aria-pressed',String(mode===key));modes.append(b);}dataControls.append(modes);
      const note=mode==='production'?(prod()?.year+' 年 · '+(metric==='area'?'收获面积 / 公顷':'产量 / 吨')):'绿：原生 · 紫：引入野生 · 灰：本快照未记录';dataControls.append(node('small',note));
      if(mode==='production'){const metrics=node('div',null,'globe-data-actions');for(const [key,title]of [['production','看产量'],['area','看面积']]){const b=makeDataButton(title,()=>{restoreAudio();metric=key;selected=null;tourIndex=-1;render();api.onChange?.();reportMap();});b.setAttribute('aria-pressed',String(metric===key));metrics.append(b);}dataControls.append(metrics);}
      const tools=node('div',null,'globe-data-actions');tools.append(makeDataButton(mapDetailExpanded?'收起资料':'数值与依据',()=>setMapDetailExpanded(!mapDetailExpanded)),makeDataButton('地区列表',()=>{setMapDetailExpanded(true);setListOpen(true);}));if(guidedStage==='map')tools.append(makeDataButton('进入综合回顾',()=>api.onCourseNext?.()));dataControls.append(tools);
      if(selected){const f=(mode==='production'?countries:regions).get(selected);dataControls.append(node('small',(f?nameFor(f):selected)+' · '+(mode==='production'?fmt(valueFor(recordFor(selected),metric)):statusName[botanicalStatus(dist(),selected)]),'globe-data-selected'));}
    }
  }
  function closeRegionalCourse({restore=true}={}){
    if(!regionalFocus)return;regionalCues?.clear();regionalFocus=false;host.dataset.regionalFocus='false';regionalScene=null;regionalCard.hidden=true;
    regionalClassroom?.close({silent:true});regionalOverview?.clear();setRegionalCase(null);renderClassScene();
    if(restore&&enabled){render();host.querySelector('.global-header h1').textContent='植物的全球地图';}api.onChange?.();api.onLayout?.();
  }
  function openRegionalCourse(options={}){
    if(!enabled)open(options.cropId&&crops.has(options.cropId)?options.cropId:cropId);
    api.onRegionalOpen?.();globalContinuationIntent=false;audio.pause();showModel(null);classroom?.pause();setCatalogueOpen(false);
    regionalFocus=true;host.dataset.regionalFocus='true';host.querySelector('.global-header h1').textContent='全球地区与植物';renderClassScene();
    regionalDetailExpanded=false;mapViewChoice=null;regionalClassroom?.open(options);if(options.regionId&&Number.isInteger(options.step)&&options.step>=0&&options.step<3)regionalClassroom?.selectStep(options.step);if(options.comparison&&options.cropId)regionalClassroom?.comparePlant(options.cropId);setFullMap(false,{force:true});renderDataPresentation();api.onLayout?.();
  }
  function receiveRegionalScene(scene){
    if(!regionalFocus||!scene)return;regionalScene=scene;selected=null;
    const overview=scene.view==='home'||scene.view==='overview'||scene.overview===true;
    const all=data.regionalEnvironment?.regions||[],ids=scene.regionIds;
    regionalOverview?.set(overview?all.filter(r=>!Array.isArray(ids)||ids.includes(r.id)):[]);
    if(scene.regionId){
      if(scene.cropId&&crops.has(scene.cropId))cropId=scene.cropId;
      setRegionalCase(scene.regionId,{plantId:cropId,step:scene.step||0,move:false});
      const r=activeCase?.region,focus=resolveRegionalGlobeCuePosition(scene,r);
      const sampled=focus?{...r,lon:focus.lon,lat:focus.lat,name:focus.label}:r;
      caseLayer?.set(sampled||null,cropId,{lessonStep:scene.step||0,move:scene.following!==false});
    }else{setRegionalCase(null);if(overview)moveTo(15,12);}
    host.querySelector('.global-map-heading span').textContent='国家名作参照 · 标记是环境教学案例';
    const region=activeCase?.region,chapter=data.regionalNarration?.chapters?.find(c=>c.classId===(scene.view==='overview'?'regional-overview':scene.regionId));
    renderRegionalSceneCard(regionalCard,{scene:scene.view==='home'?null:scene,region,chapter,plant:crops.get(cropId),profile:profiles.get(cropId)});
    regionalCues?.setScene({scene,region,plant:crops.get(cropId),chapter,fullMap});
    host.dataset.regionalScene=scene.view==='home'?'home':'lesson';
    if(mapReady)renderSvg();renderDataPresentation();api.onChange?.();api.onLayout?.();
  }
  function renderRegionalMapMeaning(target){
    target.replaceChildren();const overview=regionalScene?.view==='home'||regionalScene?.view==='overview'||regionalScene?.overview===true;
    if(overview){
      const count=regionalOverview?.getState().count||0;target.append(node('span',`${count} 个地区教学案例 · 点选标记进入课程；颜色区分大洲，不表示密度或适生范围。`));
      const legend=node('span',null,'course-map-key');for(const [name,color]of Object.entries(REGION_CONTINENT_COLORS)){if(!(data.regionalEnvironment?.regions||[]).some(r=>regionContinent(r)===name))continue;const item=node('span'),swatch=node('i');swatch.style.background=color;item.append(swatch,document.createTextNode(name));legend.append(item);}target.append(legend);
    }else{
      const region=activeCase?.region,evidence={climate:'气候：冷热与雨季',soil:'土壤：根区条件',water:'水源：水从哪里来'}[regionalScene?.evidence]||'地区环境';
      const sampleNote=regionalScene?.evidence==='soil'&&region?.soil?.status==='available'?' 黄色标记为土壤模型取样位置，可能与气候教学点不同；不是根旁实测。':' 黄色标记是环境教学定位；不是植株观测或实测水位。';
      target.append(node('strong',(region?.name||'当前地区')+' · '+evidence),node('span',sampleNote+' 底图仅帮助定位，不是田块或植物分布填色。'));
    }
  }
  function renderRegionalPane(){const pane=$('global-regional-data');pane.hidden=!activeCase;pane.replaceChildren();if(activeCase){const course=BIODIVERSITY_COURSES.find(c=>c.id===activeCase.cropId);pane.append(renderRegionalEvidence(activeCase.region,{cropId:activeCase.cropId,substrateNote:course?.substrateNote,substrateKind:course?.substrateKind}));}}
  function setRegionalCase(id,{plantId=cropId,step=2,move=false}={}){
    const region=evidenceRegion(data.regionalEnvironment,id);activeCase=region?{region,cropId:plantId,step}:null;
    caseLayer?.set(region||null,plantId,{move,lessonStep:step});renderRegionalPane();requestDraw();
  }
  function receiveClassScene(scene){
    const previous=classScene,wasFocused=courseFocus();if(scene&&scene.classId!==previous?.classId){courseDetailExpanded=false;following=true;}classScene=scene;if(scene&&!previous)setFullMap(false,{force:true});
    if(scene?.scope==='biodiversity'){
      const key=scene.cropId+':'+scene.step+':'+scene.regionId,shouldMove=scene.following!==false&&(key!==lastBioSceneKey||previous?.following===false);lastBioSceneKey=key;
      if(cropId!==scene.cropId||previous?.scope!=='biodiversity'||!wasFocused){restoreAudio();cropId=scene.cropId;mode='botanical';selected=null;tourIndex=-1;setFullMap(false,{force:!previous});render();}
      setRegionalCase(scene.regionId,{plantId:scene.cropId,step:scene.step,move:shouldMove});
    }else if(scene?.scope==='agriculture'){
      if(previous?.scope==='biodiversity'){lastBioSceneKey='';setRegionalCase(null);}
      const id=(following&&scene.spokenPlantId)||(scene.representativeIds.includes(cropId)?cropId:scene.representativeIds[0]),nextMode=pp.has(id)?'production':'botanical';
      if(id&&(id!==cropId||mode!==nextMode)){restoreAudio();cropId=id;mode=nextMode;selected=null;tourIndex=-1;render();}
    }else if(previous?.scope==='biodiversity'){lastBioSceneKey='';setRegionalCase(null);}
    if(mapReady)renderSvg();
    renderClassScene();api.onChange?.();api.onLayout?.();
  }
  function courseDetailIsExpanded(){return !classScene||courseDetailExpanded||classScene.step===3;}
  function setCourseDetailExpanded(value){
    if(value!==true&&classScene?.step===3){courseDetailExpanded=false;classroom.selectStep(2);$('global-catalog-toggle').focus({preventScroll:true});return;}courseDetailExpanded=value===true;renderClassScene();if(mapReady)renderSvg();api.onLayout?.();requestDraw();
    if(courseDetailIsExpanded())$('global-catalog-close').focus({preventScroll:true});else $('global-catalog-toggle').focus({preventScroll:true});
  }
  function selectCoursePlant(id,anchor,{resumeFollow=false}={}){
    if(!crops.has(id))return;if(!resumeFollow)classroom.pause();
    if(id!==cropId)changePlant(id,pp.has(id)?'production':'botanical');following=resumeFollow;
    renderClassScene();const point=anchor||courseAnchors?.getState().anchors.find(a=>a.cropId===id);
    if(point&&Number.isFinite(point.lon)&&Number.isFinite(point.lat))moveTo(point.lon,point.lat);
  }
  function renderClassScene(scene=classScene){
    classScene=scene;const focus=courseFocus(),active=!!scene&&focus,detail=courseDetailIsExpanded();host.dataset.courseFocus=String(focus);host.dataset.bioCourse=String(scene?.scope==='biodiversity');host.dataset.courseDetail=String(detail);host.dataset.globeCourse=String(active);
    const toggle=$('global-catalog-toggle');if(active){toggle.textContent=detail?'回到地球看课':'展开课程详情';toggle.setAttribute('aria-expanded',String(detail));}
    companion.hidden=!active||detail;companion.replaceChildren();
    const notes=Object.fromEntries((CROP_CLASSES.find(c=>c.id===scene?.classId)?.representatives||[]).map(p=>[p.id,p.note]));
    if(reviewContext){renderDataPresentation();return;}if(active&&scene.scope==='agriculture'){courseAnchors?.setScene({...scene,representativeNotes:notes},{activeCropId:following?(scene.spokenPlantId||cropId):cropId,fullMap});const key=scene.classId+':'+(scene.spokenPlantId||cropId);if(following&&key!==courseAnchorKey){const anchor=courseAnchors?.getState().anchors.find(a=>a.cropId===(scene.spokenPlantId||cropId));if(anchor){courseAnchorKey=key;moveTo(anchor.lon,anchor.lat);}}}else{courseAnchors?.clear();courseAnchorKey='';}
    const teachingFocus=active?courseTeachingFocus(scene):null;if(enabled&&teachingFocus)queueTeachingFocus(teachingFocus);
    renderDataPresentation();if(!active||detail)return;
    companion.dataset.step=String(scene.step);companion.classList.toggle('is-bio-scene',scene.scope==='biodiversity');
    const heading=node('div',null,'course-globe-heading'),title=node('strong',scene.title),details=node('button','展开课程详情');details.onclick=()=>setCourseDetailExpanded(true);heading.append(title,details);companion.append(heading);
    const geography=teachingGeography();if(geography)companion.append(node('p','地理参照：'+[geography.country,geography.region].filter(Boolean).join(' → '),'course-geography-reference'));
    renderTeachingFocus(companion,teachingFocus,{remember:false});
    const steps=node('nav',null,'course-globe-steps');steps.setAttribute('aria-label','当前植物课步骤');const labels=scene.scope==='biodiversity'?['形态','环境','地区','想一想']:['用途','器官','代表','想一想'];
    labels.forEach((text,index)=>{const b=node('button',(index+1)+' '+text);b.type='button';b.setAttribute('aria-current',scene.step===index?'step':'false');b.onclick=()=>classroom.selectStep(index);steps.append(b);});companion.append(steps);
    const plants=node('div',null,'course-globe-plants');plants.setAttribute('aria-label','定位本课植物');
    for(const id of scene.representativeIds||[]){const b=node('button','定位'+(crops.get(id)?.name||id));b.type='button';b.setAttribute('aria-pressed',String(id===(following?(scene.spokenPlantId||cropId):cropId)));b.onclick=()=>{if(scene.scope==='biodiversity'){classroom.setFollowing(true);setRegionalCase(scene.regionId,{plantId:id,step:scene.step,move:true});}else selectCoursePlant(id);};plants.append(b);}const tools=node('details',null,'course-globe-tools');tools.append(node('summary','定位植物与地图说明'),plants);companion.append(tools);
    const hint=node('p',scene.scope==='biodiversity'?'植物随本课有来源的地区展示；黄标是环境采样位置。':'小植物对应各自的地区示例；点击定位会暂停讲解，可随时回到旁白。','course-globe-hint');tools.append(hint);if(scene.scope==='biodiversity'){const key=node('p',null,'course-globe-map-key');for(const [text,color] of [['原生记录','#a7dab7'],['引入野生','#d9b3ec'],['环境采样','#ffe2a1']]){const item=node('span',text);item.style.color=color;key.append(item);}tools.append(key);}
    if(!following){const back=node('button','回到讲解地区');back.onclick=()=>{if(scene.scope==='biodiversity'){following=true;classroom.setFollowing(true);}else selectCoursePlant(scene.spokenPlantId||cropId,null,{resumeFollow:true});};companion.append(back);}
  }
  function courseInsets(){
    const header=host.querySelector('.global-header').getBoundingClientRect(),catalogue=$('global-catalog').getBoundingClientRect(),compact=!!classScene&&!courseDetailIsExpanded();
    if(compact)return {focusScale:1,top:innerWidth<=760?Math.max(header.bottom+14,companion.getBoundingClientRect().bottom+9):header.bottom+14,bottom:Math.max(28,innerHeight-catalogue.top+14),left:18,right:18};
    return {focusScale:1,top:header.bottom+12,bottom:24,left:innerWidth<=760?18:catalogue.right+20,right:18};
  }
  const audio=document.createElement('audio');audio.preload='metadata';host.append(audio);
  const continuousLabel=node('label',null,'global-continuous-label'),continuousCheck=node('input');continuousCheck.type='checkbox';continuousCheck.checked=isAutoContinueEnabled();continuousCheck.setAttribute('aria-label','全球地图连续听讲');continuousLabel.append(continuousCheck,document.createTextNode('连续听讲'));host.querySelector('.global-audio').append(continuousLabel);
  const continuousStatus=node('p',null,'global-continuous-status');host.querySelector('.global-tour').append(continuousStatus);continuousCheck.onchange=()=>setAutoContinueEnabled(continuousCheck.checked);subscribeAutoContinue(value=>{continuousCheck.checked=value;if(!value)globalContinuationIntent=false;});
  const audioRecords=new Map((pack.narration?.manifest?.chapters||[]).map(c=>[c.id,c]));
  const audioChapters=new Map((pack.narration?.chapters||[]).map(c=>[c.cropId,c]));
  const optionGroups=new Map();for(const c of [...crops.values()].sort((a,b)=>(a.collection==='agriculture'?0:1)-(b.collection==='agriculture'?0:1))){const primary=catalogueBrowseGroups(c)[0],key=c.collection+'|'+primary;if(!optionGroups.has(key)){const o=node('optgroup');o.label=(c.collection==='agriculture'?'农业':'植物')+' · '+primary;optionGroups.set(key,o);$('global-plant').append(o);}const o=node('option',c.name);o.value=c.id;optionGroups.get(key).append(o);}
  $('global-catalog-scope').textContent='当前 '+scope.entries+' 条目：农业与园艺 '+scope.agriculture+'，其他代表植物 '+scope.biodiversity+'。先选类别，再把一个条目放回地球。';
  $('global-catalog-evidence').textContent='农业：'+scope.productionEntries+' 条目对应 '+scope.commodities+' 个 FAOSTAT 商品（2024年国家产量/收获面积）；植物：'+scope.botanicalEntries+' 条目接入 Kew 原生/引入记录；环境：'+scope.environmentEntries+' 条目有定性档案。相同商品不能按条目重复相加。';
  catalogueCollection='agriculture';
  function renderCatalogueGroups(){const select=$('global-catalog-group');select.replaceChildren(node('option','全部类别'));select.firstChild.value='';const groups=catalogueGroups(crops.values(),catalogueCollection);if(!groups.some(g=>g.name===catalogueGroup))catalogueGroup='';for(const g of groups){const option=node('option',g.name+' · '+g.count);option.value=g.name;select.append(option);}select.value=catalogueGroup;}
  function renderCatalogue(){const rows=filterCatalogue(crops.values(),{collection:catalogueCollection,group:catalogueGroup,query:catalogueQuery}),container=$('global-catalog-rows');container.replaceChildren();$('global-catalog-count').textContent='找到 '+rows.length+' 个条目 · 点击在地球上查看';for(const c of rows){const button=node('button',null,'global-catalog-row'),p=pp.get(c.id),b=bp.get(c.id);button.setAttribute('aria-pressed',String(c.id===cropId));const title=node('span');title.append(node('strong',c.name),node('small',c.latin));button.append(title,node('span',catalogueBrowseGroups(c).join(' · '),'global-catalog-category'),node('small',(p?(p.mappingType==='broader-commodity'?'农业：合并商品':'农业：已接入'):'农业：未接入')+' · '+(b?.status==='available'?'原生/引入：已接入':'原生/引入：未接入'),'global-catalog-records'));button.onclick=()=>{changePlant(c.id,p?'production':'botanical');setCatalogueOpen(false);$('global-plant').focus({preventScroll:true});};container.append(button);}if(!rows.length)container.append(node('p','没有匹配条目。试试清空搜索或切换类别。'));}
  function setCatalogueOpen(value){if(value&&regionalFocus)closeRegionalCourse({restore:false});if(value){globalContinuationIntent=false;audio.pause();}else classroom?.pause();host.style.setProperty('--global-header-bottom',(host.querySelector('.global-header').getBoundingClientRect().bottom-host.getBoundingClientRect().top+8)+'px');$('global-catalog').hidden=!value;$('global-catalog-toggle').setAttribute('aria-expanded',String(value));host.querySelector('.global-header h1').textContent=courseFocus()?'系统认识植物':'植物的全球地图';if(value){renderCatalogueGroups();renderCatalogue();if(catalogueTab==='browse')$('global-catalog-search').focus({preventScroll:true});else $('crop-classroom').querySelector('[data-classroom-title]')?.focus({preventScroll:true});}renderClassScene();if(mapReady)renderSvg();api.onChange?.();api.onLayout?.();}
  renderCatalogueGroups();
  function setCatalogueTab(value){if(value!=='learn')classroom?.pause();catalogueTab=value;$('crop-classroom').hidden=value!=='learn';$('global-catalog-inventory').hidden=value!=='browse';$('global-catalog-learn-tab').setAttribute('aria-selected',String(value==='learn'));$('global-catalog-browse-tab').setAttribute('aria-selected',String(value==='browse'));if(value==='browse'){renderCatalogueGroups();renderCatalogue();}renderClassScene();if(mapReady)renderSvg();}
  function renderClassRoute(){
    const target=$('global-class-route'),context=classroom?.getContext(),c=classroom?.getClass();
    $('global-catalog-toggle').textContent=context?(classroom?.getUIState()?.courseScope==='biodiversity'?'返回植物课':'返回分类课'):'植物课程';
    target.hidden=!context||!!introContext||fullMap;target.replaceChildren();
    if(!context||!c)return;
    target.dataset.classId=c.id;target.dataset.exampleIndex=String(context.index);
    const heading=node('div',null,'global-class-route-heading'),title=node('strong',c.group+' · 代表观察 '+(context.index+1)+' / '+context.total),exit=node('button','×');exit.setAttribute('aria-label','退出本类代表路线');exit.title='退出本类路线，保留看过记录';exit.onclick=()=>classroom.clear();heading.append(title,exit);target.append(heading);
    target.append(node('small',context.currentMatches?'已看过 '+context.viewedCount+' / '+context.total+' 个代表；不表示已掌握。':'正在自由观察，原类别路线已保留。'));
    const actions=node('div',null,'global-class-route-actions'),back=node('button','返回本类比较');back.onclick=()=>{classroom.showActive();setCatalogueTab('learn');setCatalogueOpen(true);};actions.append(back);
    if(context.currentMatches){const previous=node('button','前一个'),next=node('button','下一个');previous.disabled=context.index===0;next.disabled=context.index===context.total-1;previous.onclick=()=>classroom.move(-1);next.onclick=()=>classroom.move(1);actions.append(previous,next);}else{const resume=node('button','继续'+(crops.get(context.representativeId)?.name||'原例子'));resume.onclick=()=>classroom.resume();actions.append(resume);}target.append(actions);
  }
  classroom=createPlantCourseHub({container:$('crop-classroom'),data,crops,getCurrentCropId:()=>cropId,onChange:renderClassRoute,onScene:receiveClassScene,narrationPack:data.classroomNarration,onProgress:location=>api.onClassProgress?.(location),onContinue:input=>{setCatalogueOpen(false);api.onCourseNext?.(input);},onLectureComplete:input=>api.onLectureComplete?.(input)===true,onPlayingChange:value=>{coursePlaying=value===true;if(value)audio.pause();requestDraw();},
    onBrowse:({collection,group})=>{catalogueCollection=collection;catalogueGroup=group;catalogueQuery='';$('global-catalog-collection').value=collection;$('global-catalog-search').value='';setCatalogueTab('browse');setCatalogueOpen(true);},
    onExplore:(id,{play=false,caseRegionId}={})=>{changePlant(id,pp.has(id)?'production':'botanical');setCatalogueOpen(false);tourStep(1);if(caseRegionId)setRegionalCase(caseRegionId,{plantId:id,move:true});if(play)playAudio();}
  });
  $('global-catalog-learn-tab').onclick=()=>setCatalogueTab('learn');$('global-catalog-browse-tab').onclick=()=>setCatalogueTab('browse');$('global-catalog-return').onclick=()=>{classroom.returnToLesson();setCatalogueTab('learn');};
  const miniSvg=$('global-svg'),proj=geoEquirectangular().translate([480,240]).scale(960/(2*Math.PI)),path=geoPath(proj);
  miniSvg.append(svg('rect',{width:960,height:480,fill:'#203747'}));const landLayer=svg('g'),dataLayer=svg('g'),outlineLayer=svg('g');miniSvg.append(landLayer,dataLayer,outlineLayer);
  for(const f of data.world.features)landLayer.append(svg('path',{d:path(f),fill:'#344952',stroke:'#78909a','stroke-width':'.4'}));
  const worldGrid=svg('g',{'pointer-events':'none',class:'global-world-reference-lines'});
  worldGrid.append(svg('path',{d:path(geoGraticule10()),fill:'none',stroke:'#b6c9cc','stroke-width':.45,opacity:.25}));
  for(const [lat,title] of [[0,'赤道 0°'],[23.4,'北回归线 23.4°N'],[-23.4,'南回归线 23.4°S'],[66.6,'北极圈 66.6°N'],[-66.6,'南极圈 66.6°S']]){const y=proj([0,lat])[1];worldGrid.append(svg('line',{x1:0,y1:y,x2:960,y2:y,stroke:lat===0?'#e6d39a':'#c7d7b1','stroke-width':lat===0?1.2:.65,'stroke-dasharray':lat===0?'':'5 4',opacity:.75}));const text=svg('text',{x:7,y:y-4,fill:lat===0?'#e6d39a':'#c7d7b1','font-size':10,stroke:'#17303a','stroke-width':2,'paint-order':'stroke'});text.textContent=title;worldGrid.append(text);}
  miniSvg.append(worldGrid);
  const fmt=v=>formatGlobalValue(v,metric),current=()=>crops.get(cropId),dist=()=>bp.get(cropId),prod=()=>pp.get(cropId);
  const geographicLabels=createGlobalGeographyLabels({world:data.world,globe,camera,globeRoot,vector,svgRoot:miniSvg,projection:proj,path,requestDraw,getContext:()=>{const f=selected?(mode==='production'?countries:regions).get(selected):null,reference=teachingGeography(),lesson=!enabled&&api.getLearningGeographyContext?.();return {enabled:enabled||!!lesson,fullMap:lesson?lesson.fullMap===true:fullMap,mode:regionalFocus||lesson?'production':mode,selected:lesson?null:regionalFocus?activeCase?.region.countryIso3||null:selected,referenceCountryId:reference?.id||null,cropId:lesson?'learning':cropId,density:placeDensity,topCountryIds:reference?.id?[reference.id]:lesson?[]:rankedRows(prod(),metric).filter(r=>valueFor(r,metric)>0).slice(0,selected?8:3).map(r=>r.iso3),focus:reference?[reference.lon,reference.lat]:f?(mode==='botanical'?[f.properties.labelLon,f.properties.labelLat]:largestCenter(f)):null};}});
  courseAnchors=createClassGlobeAnchors({data,crops,globe,camera,globeRoot,vector,requestDraw,onSelect:selectCoursePlant});
  mapReferenceAnchors=createClassGlobeAnchors({data,crops,globe,camera,globeRoot,vector,requestDraw,onSelect:(id,anchor)=>{globalContinuationIntent=false;audio.pause();following=false;updateFollow();moveTo(anchor.lon,anchor.lat);}});
  regionalCues=createRegionalGlobeCues({globe,camera,globeRoot,vector,requestDraw,onDetails:()=>setRegionalDetailExpanded(true)});
  caseLayer=createRegionalMapLayer({globe,camera,globeRoot,vector,svgRoot:miniSvg,projection:proj,getContext:()=>({enabled,fullMap,glyphPixels:courseFocus()&&!regionalFocus?(innerWidth<=760?64:82):undefined}),moveTo,requestDraw,crops});
  const placeControl=node('label');placeControl.id='global-place-density-label';placeControl.append(document.createTextNode('地图地名'));const placeSelect=node('select');placeSelect.id='global-place-density';placeSelect.setAttribute('aria-label','地图地名密度');placeSelect.title='国名会自动避让；与标线文字重叠时优先显示国名，标线保留；指向小国也会显示名称';for(const [value,text] of [['major','主要国家'],['more','更多国家'],['off','关闭地名']]){const option=node('option',text);option.value=value;placeSelect.append(option);}placeSelect.value=placeDensity;placeControl.append(placeSelect);host.querySelector('.global-selects').append(placeControl);placeSelect.onchange=()=>{placeDensity=placeSelect.value;try{localStorage.setItem('plant-earth-place-density-v1',placeDensity);}catch{}geographicLabels.invalidate();geographicLabels.renderWorld();};
  mapReady=true;
  regionalOverview=createRegionalOverviewLayer({globe,camera,globeRoot,vector,svgRoot:miniSvg,projection:proj,requestDraw,getContext:()=>({enabled:enabled&&regionalFocus,fullMap,insets:regionalInsets()}),onPick:id=>regionalClassroom?.open({regionId:id})});
  regionalClassroom=createRegionalClassroom({container:regionalHost,data,crops,onScene:receiveRegionalScene,onChange:()=>api.onLayout?.(),onPlayingChange:value=>{if(value){globalContinuationIntent=false;audio.pause();classroom.pause();}},onClose:()=>closeRegionalCourse()});
  $('global-regional-start').textContent='全球地区课 · '+(data.regionalEnvironment?.regions?.length||0)+' 地区';
  $('global-regional-start').onclick=()=>openRegionalCourse();
  const featureList=()=>mode==='production'?data.world.features:botanical.regions.features;
  const codeFor=f=>mode==='production'?(f.properties.id==='SDS'?'SSD':f.properties.id):f.properties.code;
  const nameFor=f=>mode==='production'?(prod()?.records.find(r=>r.iso3===codeFor(f))?.nameZh||countryNameZh(f)):(f.properties.nameZh||f.properties.name);
  const recordFor=code=>mode==='production'?prod()?.records.find(r=>r.iso3===code):dist()?.records.find(r=>r.code===code);
  function colorFor(code){if(mode==='production')return productionScale(prod(),metric).color(valueFor(recordFor(code),metric));const s=botanicalStatus(dist(),code);return C[s]||C.missing;}
  function restoreAudio(){globalContinuationIntent=false;introContext=null;$('global-intro-return').hidden=true;audio.pause();activeAudioChapter=null;audioCues=[];lastCue=-1;playing=false;$('global-audio-play').textContent='播放 MiniMax 讲解';$('global-audio-time').textContent='00:00';$('global-audio-seek').value='0';}
  function overviewPoint(){const f=mode==='production'?countries.get(rankedRows(prod(),metric).find(r=>valueFor(r,metric)>0)?.iso3):regions.get(dist()?.nativeCodes?.[0]);return f?mode==='botanical'?[f.properties.labelLon,f.properties.labelLat]:largestCenter(f):mapReferencePoint()||[35,12];}
  function changePlant(id,preferred){if(!crops.has(id))return;closeRegionalCourse({restore:false});if(activeCase&&activeCase.cropId!==id)setRegionalCase(null);restoreAudio();setListOpen(false);cropId=id;classroom?.observe(id);if(preferred)mode=preferred;if(mode==='production'&&!pp.has(id))mode='botanical';selected=null;continent='';query='';tourIndex=-1;following=true;updateFollow();render();api.onChange?.();moveTo(...overviewPoint());reportMap();}
  function setMode(value){if(value==='production'&&!pp.has(cropId))return;closeRegionalCourse({restore:false});restoreAudio();mode=value;selected=null;tourIndex=-1;continent='';query='';render();api.onChange?.();moveTo(...overviewPoint());reportMap();}
  function mapReferenceScene(){return {scope:'agriculture',classId:'map-reference',referenceOnly:true,representativeIds:[cropId],representativeNotes:{[cropId]:'未接入统一分布范围；只定位已有文献支持的教学地区，非植株观测点。'}};}
  function mapReferencePoint(){const point=resolveClassGlobeAnchors(mapReferenceScene(),data,{activeCropId:cropId})[0];return point?[point.lon,point.lat]:null;}
  function syncMapReference(active){
    const reference=active&&!model&&mode==='botanical'&&dist()?.status!=='available',key=reference?cropId+':'+fullMap:'off';if(key===mapReferenceKey)return;mapReferenceKey=key;
    if(reference)mapReferenceAnchors?.setScene(mapReferenceScene(),{activeCropId:cropId,fullMap});else mapReferenceAnchors?.clear();
  }
  function showOverviewModel(){const feature=mode==='production'?countries.get(rankedRows(prod(),metric).find(row=>valueFor(row,metric)>0)?.iso3):regions.get(dist()?.nativeCodes?.[0]);showModel(feature,{move:false});}
  function showModel(feature,{move=true}={}){if(activeCase)feature=null;
    if(model){for(const material of model.userData.ownMaterials||[])material.dispose();disposeMiniature(model);model=null;}
    label.hidden=true;if(!enabled||!feature)return;const p=mode==='botanical'?[feature.properties.labelLon,feature.properties.labelLat]:largestCenter(feature);if(move)moveTo(p[0],p[1]);const recorded=mode==='production'?recordFor(codeFor(feature)):null;if(mode==='production'?!(recorded?.value>0||recorded?.areaHa>0):!['native','introduced'].includes(botanicalStatus(dist(),codeFor(feature))))return;
    model=createCropMiniature(cropId);model.scale.setScalar(.18);model.position.copy(vector(p[0],p[1],1.025));const ownMaterials=new Map();model.traverse(o=>{if(o.isMesh){o.renderOrder=12;const clone=m=>{if(!ownMaterials.has(m)){const copy=m.clone();copy.depthTest=false;copy.depthWrite=false;ownMaterials.set(m,copy);}return ownMaterials.get(m);};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);}});model.userData.ownMaterials=[...ownMaterials.values()];root.add(model);model.userData.lon=p[0];model.userData.lat=p[1];label.replaceChildren(node('strong',current().name+' · '+nameFor(feature)),node('small',(mode==='production'?'国家/地区定位':'植物地理记录区定位')+' · 非精确植物点'));
  }
  function choose(code,{move=true,manual=false}={}){
    if(manual){userExplore();if(move)setListOpen(false);}
    selected=code;const f=(mode==='production'?countries:regions).get(code);showModel(f,{move});
    renderDetail();renderKey();renderSvg();const panel=host.querySelector('.global-panel');panel.scrollTop=code?Math.max(0,$('global-region-detail').offsetTop-18):0;api.onChange?.();api.onLayout?.();requestDraw();reportMap();
  }
  function renderStats(){
    const wrap=$('global-stats');wrap.replaceChildren();const pairs=mode==='production'?(()=>{const s=productionSummary(prod(),metric);return [['全球总量',fmt(s.world)],['有正值地区',s.positive+' 个'],['缺失该项记录',s.missing+' 个']];})():[['原生记录区',dist()?.status==='available'?dist().nativeCodes.length+' 个':'未接入'],['引入野生记录区',dist()?.status==='available'?dist().introducedCodes.length+' 个':'未接入'],['统计分区','TDWG 三级']];
    for(const [name,value] of pairs){const d=node('div');d.append(node('span',name),node('strong',value));wrap.append(d);}
    const comparison=$('global-comparison');comparison.replaceChildren();if(mode==='production'){const summary=productionSummary(prod(),metric);comparison.append(node('strong','主要统计地区 · 占全球总量'));for(const r of summary.rows.filter(r=>valueFor(r,metric)>0).slice(0,3)){const share=summary.world>0?valueFor(r,metric)/summary.world:null,row=node('div',null,'global-bar-row'),track=node('span',null,'global-bar-track'),bar=node('i');bar.style.width=Math.min(100,Math.max(0,(share||0)*100))+'%';track.append(bar);row.append(node('span',r.nameZh),node('strong',percent(share)),track);comparison.append(row);}}
  }
  function renderDetail(){
    const host=$('global-region-detail');host.replaceChildren();if(!selected){host.append(node('p',mode==='production'?'先看全球颜色，再点击一个国家或地区，查看有年份、有单位的统计记录。':'绿色表示有原生记录，紫色表示有引入野生记录。点击区域看具体依据；深灰色表示本快照未记录。','global-hint'));return;}
    const f=(mode==='production'?countries:regions).get(selected),r=recordFor(selected),title=mode==='production'?(r?.nameZh||(f?countryNameZh(f):selected)):(f?.properties.nameZh||selected);host.append(node('h3',title));const geo=mode==='production'?countryLabel(selected):null;if(geo)host.append(node('p',geo.continentZh+' · '+geo.regionZh,'global-geographic-context'));else if(mode==='botanical')host.append(node('p','植物地理记录区 · 国家名另作定位参照','global-geographic-context'));
    if(mode==='production'){
      host.append(node('strong',fmt(valueFor(r,metric)),'global-value'));if(r){const flag=metric==='area'?r.areaFlag:r.flag;host.append(node('p',(production.metadata.flags[flag]||flag||'未提供数值标记')+' · '+prod().year+' 年'));host.append(node('p','产量 '+formatGlobalValue(r.value)+'；收获面积 '+formatGlobalValue(r.areaHa,'area')+'。'));const world=valueFor(prod()?.worldTotal,metric),value=valueFor(r,metric);if(isNumber(value)&&world>0)host.append(node('p','占来源全球总量 '+percent(value/world)+'。'));if(!f)host.append(node('p','此统计地区在当前简化底图中没有可见多边形，记录仍保留。'));}else host.append(node('p','本快照未提供该地区记录，不能当成零产量。'));
    }else{const status=botanicalStatus(dist(),selected);host.append(node('strong',statusName[status],'global-value'));host.append(node('p',status==='unrecorded'?'没有记录不等于没有这种植物。':'WCVP v16 · '+f?.properties.name+' · '+selected));if(dist()?.geographicDescriptionZh)host.append(node('p','来源更细范围：'+dist().geographicDescriptionZh.replace(/[。.]$/,'')+'。'));host.append(node('p',status==='extinct'?'该原生记录在来源中标为灭绝；不表示当地没有栽培个体。':'这是植物地理记录区。填色不表示整片地区都生长，也不表示适宜种植。'));}
  }
  function renderEnvironment(){
    const e=$('global-environment-body'),p=profiles.get(cropId),c=current(),b=dist();e.replaceChildren();
    const media=node('details');media.append(node('summary','展开植物形态对照'));const image=photos.get(cropId);if(image){const figure=node('figure');const img=node('img');img.src=image.file;img.alt=image.caption||c.name+'实物照片';figure.append(img,node('figcaption','实物形态对照；不代表当前地图位置。'));media.append(figure);}else{const miniature=node('div',null,'global-recognition');miniature.append(renderMiniaturePreview(cropId,{width:360,height:220}));media.append(miniature,node('small','教学形态示意，比例简化。'));}
    if(b?.climateDescriptionZh&&mode==='botanical')e.append(node('p','Kew 主要生物群系归类：'+b.climateDescriptionZh+'。这是来源的物种归类，不是全部栽培条件。'));
    for(const [title,text] of [['植物与环境概况',p?.summary],['环境要求',c.needs],['温度与季节',p?.temperatureNote],['水分',p?.water?.summary],['土壤与排水',p?.soil?.drainage],['限制条件',p?.misconception||c.limits]]){if(text){const line=node('p');line.append(node('strong',title+'：'),document.createTextNode(text));e.append(line);}}
    e.append(node('small','这些是物种层面的环境知识；国家统计和区域分布本身不能证明每一地块为何适合。'),media);
  }
  function renderSources(){
    const s=$('global-sources');s.replaceChildren();const add=(text,url)=>{const a=node('a',text+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';s.append(a);};
    if(mode==='production'){const p=prod(),summary=productionSummary(p,metric);s.append(node('p',p.mappingNote),node('p','FAOSTAT QCL · '+p.year+' 年；来源发布 '+production.metadata.sourceUpdatedAt+'；下载 '+production.metadata.retrievedAt+'。'),node('p','公开国家/地区数值合计占来源全球总量 '+percent(summary.coverage)+'；来源全球总量与公开地区合计可能不同，未用差额填造记录。'),node('p',production.metadata.areaMeaning),node('p',production.metadata.missingPolicy));add('FAO 数据与元数据',production.metadata.sourceUrl);s.append(node('small','FAO · '+production.metadata.license+'；保留官方、估计和插补标记。'));}
    else{const b=dist();s.append(node('p','Kew WCVP v16 · 2026-06-04 数据快照；2026-10-29 获取。植物地理区域并非现代政治边界。'));if(b?.acceptedScientificName&&b.acceptedScientificName!==b.scientificName)s.append(node('p','目录学名：'+b.scientificName+'；来源接受名：'+b.acceptedScientificName+'。'));if(b?.status!=='available')s.append(node('p','该条目不在本次维管植物分布数据的可用范围内，未补造全球色块。'));if(b?.cultivatedOriginContext)s.append(node('p','来源包含驯化起源语境。原生/来源记录区不能解释为当前野生种群或现代农田范围。'));if(['zostera','seagrass','eelgrass'].includes(cropId)||/Zostera/.test(current().latin))s.append(node('p','海草生长在沿海水域，区域填色只表示该植物地理区有记录，绝非陆地栖息地。'));add('植物条目与分布依据',b?.sourceUrl||current().sources?.[0]||'https://powo.science.kew.org/');add('WCVP 数据包',botanical.metadata.sourceUrl);add('TDWG 植物地理分区',botanical.metadata.geometry.url);s.append(node('small','Kew WCVP · '+botanical.metadata.license+'；分区中文名为展示翻译。'));}
    for(const source of (profiles.get(cropId)?.sources||[]).slice(0,3))add(source.title,source.url);
  }
  function availableRows(){
    let list=mode==='production'?(prod()?.records||[]).slice().sort((a,b)=>(valueFor(b,metric)??-1)-(valueFor(a,metric)??-1)):(dist()?.records||[]).map(r=>({...r,f:regions.get(r.code)})).sort((a,b)=>Number(b.native)-Number(a.native)||a.code.localeCompare(b.code));
    return list.filter(r=>(!continent||(mode==='production'?r.regionCode:r.f?.properties.continentCode)===continent)&&(!query||[r.nameZh,r.name,r.f?.properties.nameZh,r.iso3,r.code].some(v=>v?.toLowerCase().includes(query.toLowerCase()))));
  }
  function renderRows(){
    const rows=$('global-rows');rows.replaceChildren();const list=availableRows();$('global-list-title').textContent=(mode==='production'?'国家/地区统计':'植物地理记录')+' · '+list.length+' 条';
    for(const r of list){const key=mode==='production'?r.iso3:r.code,b=node('button');b.className='global-row';b.setAttribute('aria-label',(r.nameZh||r.f?.properties.nameZh||r.name)+'，'+(mode==='production'?fmt(valueFor(r,metric)):statusName[botanicalStatus(dist(),key)]));b.append(node('span',r.nameZh||r.f?.properties.nameZh||r.name),node('strong',mode==='production'?fmt(valueFor(r,metric)):statusName[botanicalStatus(dist(),key)]));b.onclick=()=>choose(key,{manual:true});rows.append(b);}
    if(!list.length)rows.append(node('p','此筛选下没有记录。请切换大洲或清空搜索。'));
  }
  function mapLegendItems(){return mode==='production'?(()=>{const {cuts}=productionScale(prod(),metric);return [[C.low,'较少 ≤'+fmt(cuts[0])],[C.medium,'中间 ≤'+fmt(cuts[1])],[C.high,'较多 >'+fmt(cuts[1])],[C.zero,'明确为零'],[C.missing,'缺失/未提供']];})():[[C.native,'原生记录'],[C.introduced,'引入野生记录'],[C.missing,'本快照未记录']];}
  function renderSvg(){dataLayer.replaceChildren();outlineLayer.replaceChildren();
    let meaning=$('global-course-map-meaning');if(!meaning){meaning=node('p',null,'course-map-meaning');meaning.id='global-course-map-meaning';host.querySelector('.global-map-heading').after(meaning);}
    meaning.hidden=!courseFocus()&&!regionalFocus;if(regionalFocus){renderRegionalMapMeaning(meaning);geographicLabels.invalidate();geographicLabels.renderWorld();return;}if(courseFocus()&&!classScene){meaning.textContent='基础地理底图 · 先选择课程，再看对应植物的分布和地区证据。';geographicLabels.renderWorld();return;}
    if(courseFocus()){meaning.replaceChildren(node('span',mode==='production'?'本类地图例子：'+current().name+' · '+prod()?.year+' 年'+(metric==='area'?'收获面积（公顷）':'产量（吨）')+'。颜色比较国家总量，不是农田覆盖。':'当前植物：'+current().name+' · 区域记录；黄色点为环境教学采样。'));const legend=node('span',null,'course-map-key');for(const [color,text] of mapLegendItems()){const item=node('span'),swatch=node('i');swatch.style.background=color;item.append(swatch,document.createTextNode(text));legend.append(item);}meaning.append(legend);}
    for(const f of featureList()){const code=codeFor(f),p=svg('path',{d:path(f),fill:colorFor(code),stroke:'#728e9b','stroke-width':'.45',tabindex:'0',role:'button','aria-label':nameFor(f)+'：'+(mode==='production'?fmt(valueFor(recordFor(code),metric)):statusName[botanicalStatus(dist(),code)])});const t=svg('title');t.textContent=p.getAttribute('aria-label');p.append(t);p.onclick=()=>choose(code,{manual:true});p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(code,{manual:true});}};dataLayer.append(p);if(code===selected)outlineLayer.append(svg('path',{d:path(f),fill:'none',stroke:C.selected,'stroke-width':2,'pointer-events':'none'}));}geographicLabels.renderWorld();}
  function renderKey(){const key=$('global-key');key.replaceChildren();for(const [color,text] of mapLegendItems()){const item=node('span'),i=node('i');i.style.background=color;item.append(i,document.createTextNode(text));key.append(item);}key.append(node('p',mode==='production'?'国家地名帮助定位；颜色比较统计总量，不是田块分布。':'细亮线为国界参照；色块为植物记录区，引入野生不等于栽培。'));}
  function renderEntryEvidence(){renderClassRoute();const e=$('global-entry-evidence'),p=prod(),b=dist();e.replaceChildren();const summary=node('p',current().collection==='agriculture'?'农业与园艺 · 按用途认识':'其他代表植物 · '+current().group);e.append(summary);if(current().collection==='biodiversity'){const lesson=node('button','进入'+current().name+'的完整课程');lesson.className='bio-open-course';lesson.onclick=()=>{if(api.onCourseOpen?.({courseScope:'biodiversity',view:'lesson',cropId,step:0}))return;classroom.openBiodiversity(cropId);setCatalogueTab('learn');setCatalogueOpen(true);};e.append(lesson);}const categories=node('div',null,'global-class-chips');for(const c of classroom?.classesForCrop(current())||[]){const button=node('button',c.group);button.title='认识'+c.group+'这一类';button.onclick=()=>{if(api.onCourseOpen?.({courseScope:'agriculture',view:'lesson',classId:c.id,step:0}))return;classroom.showClass(c.id);setCatalogueTab('learn');setCatalogueOpen(true);};categories.append(button);}if(categories.childNodes.length){e.append(categories,node('small','点击类别，先了解用途、器官和同类差异。'));}for(const [title,text] of [['农业统计',p?(p.mappingType==='broader-commodity'?'合并商品，不能单独代表本条目':'已接入 '+p.year+' 年商品记录'):'本条目未接入，不表示没有生产'],['原生与引入',b?.status==='available'?'已接入 Kew 区域记录':'本次统一数据未接入'],['环境知识',profiles.has(cropId)?'已接入定性档案':'尚未接入']]){const line=node('p');line.append(node('strong',title+'：'),document.createTextNode(text));e.append(line);}if(current().nameNote)e.append(node('small',current().nameNote));if(current().rangeScopeNote)e.append(node('p',current().rangeScopeNote,'global-mapping-note'));if(current().modelNote)e.append(node('small',current().modelNote));}
  function render(){
    const c=current(),p=prod(),b=dist();$('global-plant').value=cropId;$('global-production').disabled=!p;$('global-production').setAttribute('aria-pressed',String(mode==='production'));$('global-botanical').setAttribute('aria-pressed',String(mode==='botanical'));$('global-metric-label').hidden=mode!=='production';$('global-metric').value=metric;
    $('global-title').textContent=(introContext?'读图示范｜':'')+(mode==='production'?(p.itemNameZh+' · '+p.year+' 年'+(metric==='area'?'收获面积':'产量')):(c.name+' · 原生与引入'));
    $('global-source-chip').textContent=mode==='production'?'FAOSTAT · 国家/地区统计':'Kew WCVP · 植物地理区域';
    $('global-meaning').textContent=mode==='production'?p.mappingType==='broader-commodity'?p.mappingNote:'看全球哪里有农业生产，以及统计量的差别。'+p.mappingNote:b?.status==='available'?((b.geographicDescriptionZh||b.geographicDescription?'原生/来源文字范围：'+(b.geographicDescriptionZh||b.geographicDescription).replace(/[。.]$/,'')+'。':'')+(b.cultivatedOriginContext?'含驯化来源语境。':'')+(['eelgrass','redmangrove','lotus','waterlily','duckweed'].includes(cropId)?'实际生境在海岸或水体，填色不表示陆地生长。':'')+'区域填色是记录分区，非连续覆盖；引入野生不等于栽培。'):'该条目尚无接入的统一全球分布数据。环境说明仍可阅读。';
    const options=$('global-continent');options.replaceChildren(node('option','全球'));options.firstChild.value='';const defs=mode==='production'?Object.entries(continentNames):[...new Map(botanical.regions.features.map(f=>[f.properties.continentCode,f.properties.continentZh])).entries()];for(const [id,name] of defs){const o=node('option',name);o.value=id;options.append(o);}options.value=continent;$('global-search').value=query;placeSelect.value=placeDensity;host.querySelector('.global-map-heading span').textContent=mode==='production'?'中文国家名 · 点击地区查看统计':'中文国家名作参照 · 色块是植物记录区';
    renderEntryEvidence();renderStats();renderDetail();renderRegionalPane();renderEnvironment();renderSources();renderRows();renderSvg();renderKey();host.querySelector('.global-panel').scrollTop=0;if(tourIndex<0){$('global-tour-step').textContent='先全局，再地区，最后解释环境';$('global-caption').textContent='选择一种植物，先分清你看到的是农业统计，还是原生与引入记录。展开世界地图可以同时看到地球背面；点击地区可查数值与来源。';}updateTourButtons();const a=audioChapters.get(cropId),ready=a&&audioRecords.has(a.id);$('global-audio-play').disabled=!ready;$('global-audio-play').textContent=ready?'播放 MiniMax 讲解':'本条目暂无全球配音';
    root.visible=enabled;if(!selected&&!courseFocus()&&!regionalFocus)showOverviewModel();else showModel(selected?(mode==='production'?countries:regions).get(selected):null);renderDataPresentation();api.onLayout?.();
  }
  function tourSteps(){
    const p=prod(),b=dist(),profile=profiles.get(cropId),c=current();
    if(mode==='production'){const top=rankedRows(p,metric).filter(r=>valueFor(r,metric)>0),s=productionSummary(p,metric);return [{title:'1 / 3 · 看全球',text:p.year+' 年，'+p.itemNameZh+'的来源全球'+(metric==='area'?'收获面积':'产量')+'为 '+fmt(s.world)+'。现在颜色比较国家与地区总量，不能看出具体农田。',code:null},{title:'2 / 3 · 找到有记录的地区',text:top.length?(top[0].nameZh+'在有数值记录的地区中最高，为 '+fmt(valueFor(top[0],metric))+'。'+(top[1]?'也可以比较'+top[1].nameZh+'，为 '+fmt(valueFor(top[1],metric))+'。':'')+'统计量同时受到面积、品种、管理等因素影响，不能直接当成气候优劣。'):'本快照没有可比较数值。',code:top[0]?.iso3},{title:'3 / 3 · 理解环境与限制',text:(profile?.summary||c.needs)+' '+(profile?.misconception||c.limits)+' 这是环境知识解释，不能仅凭国家产量证明因果。',code:top[0]?.iso3}];}
    const first=b?.nativeCodes?.[0],f=regions.get(first);return [{title:'1 / 3 · 看全球记录',text:b?.status==='available'?c.name+'有 '+b.nativeCodes.length+' 个原生记录区、'+b.introducedCodes.length+' 个引入野生记录区。它们来自Kew二〇二六年六月快照；这是区域记录，不是处处覆盖。':'本条目没有接入可用的统一全球分布数据，地图不会补造范围。',code:null},{title:'2 / 3 · 看一个具体区域',text:f?(f.properties.nameZh+'是来源列出的原生记录区之一。'+(b.cultivatedOriginContext?'本植物存在驯化来源语境，应与今天的野生和栽培分布分开理解。':'引入野生记录则表示原生范围之外的野生出现，不能把它等同人工栽培。')):'当前缺少可用原生记录区；请阅读已有环境资料。',code:first},{title:'3 / 3 · 理解环境与限制',text:(b?.climateDescriptionZh?'Kew记录的主要生物群系是：'+b.climateDescriptionZh+'。':'')+(profile?.summary||c.needs)+' '+(profile?.misconception||c.limits),code:first}];
  }
  function updateTourButtons(){$('global-tour-prev').disabled=tourIndex<=0;$('global-tour-next').disabled=tourIndex>=2;$('global-tour-start').textContent=tourIndex<0?'按顺序看懂这张图':'重新看全球';}
  function tourStep(index,{fromAudio=false}={}){if(!fromAudio)globalContinuationIntent=false;tourIndex=Math.max(0,Math.min(2,index));if(!fromAudio){audio.pause();following=true;updateFollow();if(activeAudioChapter){const rec=audioRecords.get(activeAudioChapter.id),offset=activeAudioChapter.beats.slice(0,tourIndex).reduce((n,b)=>n+b.text.length,0);audio.currentTime=timeAtCharacter(activeAudioChapter,rec,offset);lastCue=-1;syncAudio();return;}}const step=tourSteps()[tourIndex];$('global-tour-step').textContent=step.title;$('global-caption').textContent=step.text;choose(step.code);if(!step.code){showOverviewModel();moveTo(...overviewPoint());}updateTourButtons();}
  function close({silent=false}={}){if(reviewContext)setReviewContext(false);regionalCues?.clear();closeRegionalCourse({restore:false});globalContinuationIntent=false;if(!enabled)return;setCatalogueOpen(false);audio.pause();enabled=false;host.hidden=true;root.visible=false;label.hidden=true;renderDataPresentation();document.body.classList.remove('is-global-evidence');api.onClose?.({silent});api.onChange?.();if(!silent)returnFocus?.focus?.({preventScroll:true});}
  function open(id='rice',preferred){if(reviewContext)setReviewContext(false);mapViewChoice=null;mapDetailExpanded=false;closeRegionalCourse({restore:false});setRegionalCase(null);setCatalogueOpen(false);if(!enabled){returnFocus=document.activeElement;api.onOpen?.();enabled=true;host.hidden=false;document.body.classList.add('is-global-evidence');}changePlant(id,preferred);setFullMap(false,{force:true});$('global-exit').focus({preventScroll:true});}
  function setListOpen(value){const e=host.querySelector('.global-list-content');e.hidden=!value;$('global-list-toggle').setAttribute('aria-expanded',String(value));$('global-list-toggle').textContent=value?'收起地区列表':'展开地区列表';api.onLayout?.();}
  function updateFollow(){$('global-follow').setAttribute('aria-pressed',String(following));$('global-follow').textContent=following?'跟随中':'回到当前讲解';}
  function userExplore(){if(!enabled)return;regionalClassroom?.setFollowing?.(false);following=false;if(courseFocus()&&classScene?.scope==='biodiversity')classroom.setFollowing(false);if(courseFocus()&&classScene)renderClassScene();updateFollow();}
  function onPoint(lon,lat){if(regionalFocus){const point=regionalScene?.view==='home'?regionalOverview?.pick(lon,lat):null;if(point){regionalClassroom.open({regionId:point.id});return;}userExplore();return;}userExplore();const f=featureList().find(f=>geoContains(f,[lon,lat]));if(f)choose(codeFor(f),{move:false});}
  function paint(ctx,path){if(enabled&&!regionalFocus&&(!courseFocus()||classScene?.scope==='biodiversity')){const scale=mode==='production'?productionScale(prod(),metric):null;for(const f of featureList()){const code=codeFor(f),color=mode==='production'?scale.color(valueFor(recordFor(code),metric)):colorFor(code);ctx.globalAlpha=1;ctx.fillStyle=color;ctx.beginPath();path(f);ctx.fill();ctx.strokeStyle='#82959b';ctx.lineWidth=.7;ctx.stroke();}if(selected){const f=(mode==='production'?countries:regions).get(selected);if(f){ctx.strokeStyle=C.selected;ctx.lineWidth=4;ctx.beginPath();path(f);ctx.stroke();}}}const reference=teachingGeography(),country=reference?.id&&countries.get(reference.id);paintedCountryId=reference?.id||null;if(country){ctx.globalAlpha=1;ctx.strokeStyle='#f4dda0';ctx.lineWidth=3;ctx.beginPath();path(country);ctx.stroke();}}
  function beforeRender(){if(!enabled||!model||regionalFocus||courseFocus()||reviewContext){if(model)model.visible=false;label.hidden=true;return;}const p=vector(model.userData.lon,model.userData.lat,1.04).applyMatrix4(globe.matrixWorld),front=p.clone().normalize().dot(camera.position.clone().sub(p).normalize())>.2;model.visible=front&&!fullMap;label.hidden=!front||fullMap;if(!front)return;model.scale.setScalar((camera.top-camera.bottom)/globeRoot.clientHeight*(innerWidth<761?44:64));model.quaternion.copy(globe.getWorldQuaternion(new THREE.Quaternion()).invert()).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(.18,-.35,0)));const screen=p.project(camera);label.style.left=(screen.x+1)*globeRoot.clientWidth/2+'px';label.style.top=((1-screen.y)*globeRoot.clientHeight/2+35)+'px';}
  function setFullMap(value,{manual=false,force=false}={}){
    if(manual){mapViewChoice=value?'map':'globe';try{localStorage.setItem('plant-earth-global-map-view-v1',mapViewChoice);}catch{}}
    fullMap=force?!!value:mapViewChoice?mapViewChoice==='map':!!value;$('global-map').hidden=!fullMap;
    $('global-map-toggle').setAttribute('aria-pressed',String(fullMap));$('global-map-toggle').textContent='展开地图';$('global-globe-toggle').setAttribute('aria-pressed',String(!fullMap));
    host.dataset.mapView=fullMap?'map':'globe';document.body.classList.toggle('global-show-world',fullMap);
    renderClassRoute();renderClassScene();if(regionalFocus&&regionalScene){const region=activeCase?.region,chapter=data.regionalNarration?.chapters?.find(c=>c.classId===(regionalScene.view==='overview'?'regional-overview':regionalScene.regionId));regionalCues?.setScene({scene:regionalScene,region,plant:crops.get(cropId),chapter,fullMap});}renderDataPresentation();geographicLabels.invalidate();geographicLabels.renderWorld();api.onLayout?.();requestDraw();reportMap();
  }
  function toggleMap(){setFullMap(true,{manual:true});}

  function syncAudio(){if(!enabled||!activeAudioChapter)return;const t=audio.currentTime,r=audioRecords.get(activeAudioChapter.id),duration=Number.isFinite(audio.duration)?audio.duration:r?.duration||0;$('global-audio-time').textContent=Math.floor(t/60).toString().padStart(2,'0')+':'+Math.floor(t%60).toString().padStart(2,'0');$('global-audio-seek').value=String(duration?t/duration*1000:0);const offset=characterAtTime(activeAudioChapter,r,t);let n=0,begin=0;activeAudioChapter.beats?.forEach((b,i)=>{if(offset>=begin)n=i;begin+=b.text.length;});if(n!==lastCue){lastCue=n;tourIndex=n;const beat=activeAudioChapter.beats[n];if(following){// Keep the user's view choice while the recording changes geographic focus.
        if(beat.mode&&beat.mode!==mode){mode=beat.mode;selected=null;render();api.onChange?.();}choose(beat.regionKey||null);if(!beat.regionKey){showOverviewModel();moveTo(...(beat.focus?[beat.focus.lon,beat.focus.lat]:overviewPoint()));}}$('global-tour-step').textContent=(introContext?'读图说明 · ':'')+(n+1)+' / 3 · '+(beat.title||['看全球','看地区','理解环境'][n]);if(beat.text)$('global-caption').textContent=beat.text;if(following&&mapDetailExpanded&&beat.action==='environment'){$('global-environment').open=true;host.querySelector('.global-panel').scrollTop=Math.max(0,$('global-environment').offsetTop-12);}updateTourButtons();}playing=!audio.paused;$('global-audio-play').textContent=playing?'暂停讲解':audio.ended?'重听全球讲解':'继续全球讲解';renderDataPresentation();}
  function returnFromIntro({completed=false}={}){
    if(!introContext)return;const context=introContext;restoreAudio();cropId=context.cropId;mode=context.mode;metric=context.metric;selected=context.selected;continent=context.continent;query=context.query;tourIndex=context.tourIndex;following=context.following;updateFollow();render();setFullMap(context.fullMap);if(selected)choose(selected);else moveTo(...overviewPoint());api.onChange?.();$('global-tour-step').textContent=completed?'读图说明已结束':'已返回原植物';$('global-caption').textContent='已回到'+current().name+'的'+(mode==='production'?'农业统计':'原生与引入')+'地图。接着播放本植物的讲解，或选择地区自行观察。';
  }
  function playAudio(chapterOverride){
    closeRegionalCourse({restore:false});classroom?.pause();
    if(!chapterOverride&&!audio.paused){globalContinuationIntent=false;audio.pause();return;}
    const chapter=chapterOverride||activeAudioChapter||audioChapters.get(cropId),rec=audioRecords.get(chapter?.id);if(!rec)return false;globalContinuationIntent=true;continuousStatus.textContent='';
    if(activeAudioChapter?.id!==chapter.id){
      const isIntro=chapter.cropId===null;
      if(isIntro){introContext={cropId,mode,metric,selected,continent,query,fullMap,tourIndex,following};const example=crops.has('rice')&&pp.has('rice')?'rice':production.plants.find(p=>crops.has(p.cropId))?.cropId;if(example)cropId=example;$('global-intro-return').hidden=false;$('global-intro-return').textContent='返回'+crops.get(introContext.cropId).name;}
      else{introContext=null;$('global-intro-return').hidden=true;}
      audio.pause();activeAudioChapter=chapter;audioCues=rec.cues||[];audio.src=rec.file;lastCue=-1;metric='production';mode=chapter.beats?.[0]?.mode||mode;selected=null;render();api.onChange?.();following=true;updateFollow();
    }
    if(audio.ended)audio.currentTime=0;return audio.play().then(()=>{syncAudio();return true;}).catch(()=>{globalContinuationIntent=false;$('global-caption').textContent='音频未能播放，可继续按步骤阅读全球讲解。';return false;});
  }
  $('global-catalog-toggle').onclick=()=>{if(courseFocus()&&classScene){setCourseDetailExpanded(!courseDetailIsExpanded());return;}if($('global-catalog').hidden&&catalogueTab==='learn'&&api.onCourseOpen?.(classroom.getUIState()))return;setCatalogueOpen($('global-catalog').hidden);};$('global-catalog-close').onclick=()=>{if(courseFocus()&&classScene){setCourseDetailExpanded(false);return;}setCatalogueOpen(false);$('global-catalog-toggle').focus({preventScroll:true});};$('global-catalog-collection').onchange=e=>{catalogueCollection=e.target.value;catalogueGroup='';renderCatalogueGroups();renderCatalogue();};$('global-catalog-group').onchange=e=>{catalogueGroup=e.target.value;renderCatalogue();};$('global-catalog-search').oninput=e=>{catalogueQuery=e.target.value;renderCatalogue();};$('global-intro-return').onclick=()=>returnFromIntro();$('global-exit').onclick=close;$('global-plant').onchange=e=>changePlant(e.target.value);$('global-production').onclick=()=>setMode('production');$('global-botanical').onclick=()=>setMode('botanical');$('global-metric').onchange=e=>{restoreAudio();metric=e.target.value;selected=null;tourIndex=-1;render();api.onChange?.();reportMap();};$('global-map-toggle').onclick=toggleMap;$('global-globe-toggle').onclick=()=>setFullMap(false,{manual:true});
  $('global-list-toggle').onclick=()=>setListOpen(host.querySelector('.global-list-content').hidden);$('global-search').oninput=e=>{query=e.target.value;renderRows();};$('global-continent').onchange=e=>{continent=e.target.value;renderRows();};
  $('global-tour-start').onclick=()=>tourStep(0);$('global-tour-prev').onclick=()=>tourStep(tourIndex-1);$('global-tour-next').onclick=()=>tourStep(tourIndex+1);$('global-follow').onclick=()=>{following=!following;updateFollow();if(following){if(activeAudioChapter){lastCue=-1;syncAudio();}else tourStep(Math.max(0,tourIndex));}};$('global-audio-intro').onclick=()=>playAudio(audioChapters.get(null));$('global-old-narration').onclick=()=>{const id=cropId;close({silent:true});api.onNarratePlant?.(id);};$('global-audio-play').onclick=()=>playAudio();$('global-audio-rate').onchange=e=>{audio.playbackRate=Number(e.target.value);};$('global-audio-seek').oninput=e=>{globalContinuationIntent=false;const r=audioRecords.get(activeAudioChapter?.id),duration=Number.isFinite(audio.duration)?audio.duration:r?.duration||0;if(duration){audio.currentTime=Number(e.target.value)/1000*duration;lastCue=-1;syncAudio();}};
  for(const event of ['timeupdate','play','pause','ended','seeked'])audio.addEventListener(event,syncAudio);
  audio.addEventListener('ended',()=>{
    if(!audio.ended||!enabled)return;const continueLecture=globalContinuationIntent&&isAutoContinueEnabled()&&enabled;globalContinuationIntent=false;
    if(introContext&&activeAudioChapter?.cropId===null){returnFromIntro({completed:true});if(continueLecture)playAudio();return;}
    if(!continueLecture)return;
    if(guidedStage==='map'){continuousStatus.textContent='本张地图讲解已结束，进入综合回顾。';api.onCourseNext?.();return;}
    const context=classroom.getContext(),group=classroom.getClass(),order=context?.currentMatches?group.representativeIds:[...crops.keys()],index=order.indexOf(cropId),next=order[index+1];
    if(!next){continuousStatus.textContent='这一组讲解已结束，可回顾或选择其他植物。';return;}
    changePlant(next,pp.has(next)?'production':'botanical');continuousStatus.textContent='正在接续：'+crops.get(next).name+'。';playAudio();
  });
  host.addEventListener('keydown',e=>{if(reviewContext||['SELECT','INPUT','TEXTAREA'].includes(e.target?.tagName))return;if(e.key==='Escape'&&!$('global-catalog').hidden){e.stopPropagation();e.preventDefault();if(courseFocus()&&classScene&&courseDetailIsExpanded()){setCourseDetailExpanded(false);return;}setCatalogueOpen(false);$('global-catalog-toggle').focus({preventScroll:true});return;}if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close();}});
  document.addEventListener('keydown',e=>{if(reviewContext||['SELECT','INPUT','TEXTAREA'].includes(e.target?.tagName))return;if(enabled&&e.key==='Escape'&&(regionalFocus&&regionalDetailExpanded||!regionalFocus&&!courseFocus()&&mapDetailExpanded)){e.preventDefault();e.stopImmediatePropagation();if(regionalFocus)setRegionalDetailExpanded(false);else setMapDetailExpanded(false);return;}if(enabled&&e.key==='Escape'&&$('global-catalog').hidden&&!document.getElementById('globe-guide-controls')?.open){e.preventDefault();e.stopImmediatePropagation();close();}},true);
  const ro=new ResizeObserver(()=>{if(enabled){host.style.setProperty('--global-header-bottom',(host.querySelector('.global-header').getBoundingClientRect().bottom-host.getBoundingClientRect().top+8)+'px');api.onLayout?.();}});ro.observe(host.querySelector('.global-header'));ro.observe(host.querySelector('.global-tour'));
  function setReviewContext(value,{cropId:referenceId}={}){
    reviewContext=value===true;host.dataset.reviewContext=String(reviewContext);
    if(reviewContext){showModel(null);mapDetailExpanded=false;regionalDetailExpanded=false;mapViewChoice=null;setFullMap(false,{force:true});const id=crops.has(referenceId)?referenceId:cropId;const descriptors=courseAnchors?.setScene({scope:'agriculture',classId:'review-reference',representativeIds:[id],representativeNotes:{[id]:'回顾参考植物；位置不是题目答案，也不表示本地一定适生。'}},{activeCropId:id,fullMap:false});const anchor=descriptors?.[0];if(anchor)moveTo(anchor.lon,anchor.lat);}else if(!courseFocus())courseAnchors?.clear();renderDataPresentation();api.onLayout?.();requestDraw();
  }
  function reviewInsets(){const panel=document.querySelector('.guided-review-panel')?.getBoundingClientRect(),header=host.querySelector('.global-header').getBoundingClientRect();return {focusScale:1,top:header.bottom+12,left:18,right:innerWidth>760&&panel?innerWidth-panel.left+18:18,bottom:innerWidth<=760&&panel?innerHeight-panel.top+12:24};}
  function getVisualFocus(){
    if(!enabled)return null;
    if(regionalFocus){const point=regionalCues?.getState().focus,state=regionalClassroom?.getState();return point?{...point,id:'region:'+state.regionId+':'+state.step,playing:state.playing,following:state.following,fullMap}:null;}
    const anchor=courseAnchors?.getState().anchors.find(a=>a.active)||mapReferenceAnchors?.getState().anchors.find(a=>a.active);
    if(anchor)return {id:anchor.id,lon:anchor.lon,lat:anchor.lat,kind:'plant',playing:reviewContext?false:courseFocus()?coursePlaying:playing,following,fullMap};
    if(activeCase)return {id:'case:'+activeCase.region.id+':'+cropId,lon:activeCase.region.lon,lat:activeCase.region.lat,kind:'plant',playing:courseFocus()?coursePlaying:playing,following,fullMap};
    if(!courseFocus()&&model&&Number.isFinite(model.userData.lon)&&Number.isFinite(model.userData.lat))return {id:'map:'+cropId+':'+selected,lon:model.userData.lon,lat:model.userData.lat,kind:'plant',playing,following,fullMap};
    return null;
  }
  function setGuidedStage(stage){
    if(stage!=='review'&&reviewContext)setReviewContext(false);if(stage)closeRegionalCourse({restore:false});guidedStage=stage;host.dataset.guidedStage=stage||'';const task=$('global-guided-task');task.hidden=stage!=='map';task.replaceChildren();
    if(stage==='map'){task.append(node('strong','这一站：读懂一张真实地图'),node('p','先选一个植物，找到一个地区；读出年份、单位和记录含义，再区分“有记录”与“为什么适合”。'));const next=node('button','观察后，前往综合回顾');next.onclick=()=>api.onCourseNext?.();task.append(next);}renderClassScene();
  }
  function restoreMap(location={}){mapViewChoice=null;mapDetailExpanded=false;if(crops.has(location.cropId))changePlant(location.cropId,location.mode);if(['production','area'].includes(location.metric))metric=location.metric;if(location.mode==='botanical'||(location.mode==='production'&&pp.has(cropId)))mode=location.mode;render();const source=mode==='production'?countries:regions;if(location.selected&&source.has(location.selected))choose(location.selected);if(Number.isInteger(location.tourIndex))tourIndex=Math.max(-1,Math.min(2,location.tourIndex));if(location.caseRegionId)setRegionalCase(location.caseRegionId,{move:true});else setRegionalCase(null);setFullMap(location.fullMap===true,{force:true});if(tourIndex>=0){const step=tourSteps()[tourIndex];$('global-tour-step').textContent=step.title;$('global-caption').textContent=step.text;}updateTourButtons();reportMap();}
  return {open,close,openRegionalCourse,playRegionalCourse:()=>regionalFocus?regionalClassroom?.play():false,getRegionalCount:()=>data.regionalEnvironment?.regions?.length||0,getRegionalState:()=>regionalClassroom?.getState(),setMapView:view=>setFullMap(view==='map',{manual:true}),setRegionalCase,openBiodiversity:(id,location)=>{closeRegionalCourse({restore:false});classroom.openBiodiversity(id,location);setCatalogueTab('learn');setCatalogueOpen(true);},playCurrentCourse:()=>classroom.playCurrentCourse(),playGlobalNarration:()=>playAudio(),pause:()=>{globalContinuationIntent=false;audio.pause();classroom.pause();regionalClassroom?.pause();},setGuidedStage,restoreMap,openCatalogue:()=>{setCatalogueTab('browse');setCatalogueOpen(true);},getClassUI:()=>classroom.getUIState(),openClassroom:(id,location)=>{closeRegionalCourse({restore:false});if(location)classroom.restoreUI(location);else if(id)classroom.showClass(id);else classroom.showHome();setCatalogueTab('learn');setCatalogueOpen(true);},isEnabled:()=>enabled,onPoint,userExplore,paint,beforeRender:()=>{if((teachingGeography()?.id||null)!==paintedCountryId)api.onChange?.();beforeRender();courseAnchors?.beforeRender();mapReferenceAnchors?.beforeRender();caseLayer?.beforeRender();regionalCues?.beforeRender();regionalOverview?.beforeRender();geographicLabels.beforeRender();},getVisualFocus,getCoursePresentation:()=>({focused:courseFocus(),detailExpanded:courseDetailIsExpanded(),requestedExpanded:courseDetailExpanded,classId:classScene?.classId,step:classScene?.step,fullMap,anchors:courseAnchors?.getState()}),setCourseDetailExpanded,setReviewContext,setRegionalDetailExpanded,setMapDetailExpanded,getDataPresentation:()=>({reviewContext,regionalFocus,regionalDetailExpanded,mapDetailExpanded,fullMap,manualMapView:mapViewChoice,regionalScene,cues:regionalCues?.getState(),referenceAnchors:mapReferenceAnchors?.getState()}),getInsets:()=>reviewContext?reviewInsets():regionalFocus?regionalInsets():courseFocus()?courseInsets():dataInsets(),getState:()=>({enabled,cropId,cropName:current()?.name,mode,metric,selected,fullMap,mapViewChoice,tourIndex,caseRegionId:activeCase?.region.id||null,regionalFocus,regionalCourse:regionalClassroom?.getState(),playing,following,placeDensity,geographicLabels:geographicLabels.getState()})};
}
