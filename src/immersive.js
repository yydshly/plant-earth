import * as THREE from 'three';
import {createCropMiniature} from './plant-miniatures.js';

const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};

export function createImmersiveGlobe(api){
  const {data,crops,globe,camera,renderer,globeRoot,vector,requestDraw,resize,getCurrent,selectChapter,seekBeat,setLayer,moveTo,focusBeat,setFollowing,formatTime,audio}=api;
  const host=el('section',null,'immersive-ui');host.id='immersive-ui';host.hidden=true;host.setAttribute('aria-label','沉浸地球：作物与环境导览');
  host.innerHTML=`
    <header class="imm-header"><div class="imm-brand"><span class="imm-brand-mark">◉</span><div>植物地球<small>在世界上，看见生长</small></div></div><div class="imm-selects"><label>讲解植物<select id="imm-crop" aria-label="沉浸模式章节"></select></label><label>展示范围<select id="imm-scope"><option value="current">当前植物</option><option value="all">植物总览</option><option value="distribution">全球分布</option></select></label><label>地球图层<select id="imm-layer"><option value="crop">气候候选</option><option value="climate">气候分区</option><option value="geography">地理底图</option></select></label></div><div class="imm-header-actions"><button id="imm-distribution">全球分布</button><button id="imm-catalog">植物图鉴</button><button id="imm-details">环境与来源</button><button id="imm-exit">返回图谱</button></div></header>
    <aside class="imm-overview"><span id="imm-kicker" class="eyebrow">语音导览</span><h1 id="imm-title">植物地球</h1><p id="imm-stage"></p><div id="imm-stops" class="imm-stops"></div><button id="imm-follow" aria-pressed="true">跟随讲解</button><button id="imm-filter" class="imm-filter-chip">全部代表植物 · 筛选</button></aside>
    <section id="imm-info" class="imm-info" aria-label="当前植物与地区说明"><div class="imm-info-heading"><span id="imm-region" class="eyebrow"></span><button id="imm-info-toggle" aria-expanded="true" aria-label="收起地区说明">−</button></div><div id="imm-info-body"><h2 id="imm-info-title"></h2><span id="imm-evidence-type" class="evidence-chip"></span><p id="imm-summary"></p><div id="imm-factors" class="imm-factors"></div><p id="imm-limitation"></p><div id="imm-evidence-source" class="imm-evidence-source"></div><button id="imm-read-environment">查看完整环境档案 →</button></div></section>
    <div class="imm-map-tools"><button id="imm-zoom-in" aria-label="放大地球">＋</button><button id="imm-zoom-out" aria-label="缩小地球">−</button><button id="imm-reset-view">回到讲解位置</button></div>
    <div class="imm-map-key"><div id="imm-legend"></div><p id="imm-marker-status"></p><span>地区身份见提示卡 · 所有坐标均为区域示意<br>模型不表示密度、面积或比例 · 拖动旋转，点击了解</span></div>
    <footer id="imm-player" class="imm-player" aria-label="沉浸模式语音与字幕"><p id="imm-caption"></p><div class="imm-timeline"><span id="imm-elapsed">00:00</span><input id="imm-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="沉浸模式本章进度"><span id="imm-duration">00:00</span></div><div class="imm-transport"><div class="imm-play-buttons"><button id="imm-prev" aria-label="上一章">上一章</button><button id="imm-play" class="primary">播放讲解</button><button id="imm-next" aria-label="下一章">下一章</button></div><div class="imm-play-options"><span id="imm-chapter-count"></span><label>倍速<select id="imm-speed"><option value="0.8">0.8×</option><option value="1">1×</option><option value="1.15">1.15×</option><option value="1.3">1.3×</option></select></label><label><input type="checkbox" id="imm-continuous" checked> 连播</label></div></div><span id="imm-audio-status">MiniMax 合成旁白</span></footer>
    <aside id="imm-drawer" class="imm-drawer" hidden role="dialog" aria-label="植物环境与资料"><div class="imm-drawer-header"><strong>深入了解当前植物</strong><button id="imm-close-details" aria-label="关闭环境资料">关闭 ✕</button></div><div id="imm-drawer-body"></div></aside>
    <section id="imm-cluster-menu" class="imm-cluster-menu" hidden aria-label="同一区域的植物"><div><strong id="imm-cluster-title">同一区域的植物</strong><button id="imm-close-cluster" aria-label="关闭作物列表">✕</button></div><p>代表点在屏幕上接近，选择一种继续观察。</p><div id="imm-cluster-items"></div></section>`;
  document.body.append(host);
  const chapterReading=el('details',null,'imm-chapter-reading');chapterReading.append(el('summary','本章形态与完整讲稿'));const chapterContent=el('div',null,'imm-chapter-content'),shapeReading=el('div',null,'imm-shape-expanded'),textReading=el('div',null,'imm-script-expanded');chapterContent.append(shapeReading,textReading);chapterReading.append(chapterContent);$('imm-drawer-body').append(chapterReading);
  const profiles=new Map((data.environment?.profiles||[]).map(p=>[p.id,p]));
  const evidence=new Map((data.evidence?.crops||[]).map(p=>[p.id,p]));
  const placements=data.placements?.placements||[];
  const root=new THREE.Group();root.name='geographic-crop-miniatures';root.visible=false;globe.add(root);
  const labelHost=el('div');labelHost.id='imm-model-labels';labelHost.hidden=true;globeRoot.append(labelHost);
  const records=placements.map(p=>({...p,model:null,button:null,visible:false,front:false,x:0,y:0}));
  let enabled=false,scope='current',drawerOpen=false,savedScroll=0,savedLayer='crop',animation=0,infoCollapsed=innerWidth<761,manualPoint=null,groups=[],pendingFocus=null,narrow=innerWidth<761,filterIds=null,filterLabel='全部代表植物',distributionMode=false,narrationMode=false;
  const evidenceLabel=r=>({native_region:'原生地区示意',cultivation_region:'栽培地区示意',introduced_region:'引入地区示意',documented_region:'文献分布地区'}[r?.evidenceType]||'讲解代表地区');
  const learning=document.querySelector('.learning-space'),learningParent=learning.parentNode,learningNext=learning.nextSibling;
  const modelOrientation=new THREE.Quaternion().setFromEuler(new THREE.Euler(.18,-.35,0));
  const activeRecord=()=>{const {chapter,beatIndex}=getCurrent(),beat=chapter.beats?.[Math.max(0,beatIndex)]||chapter;return records.find(r=>r.cropId===chapter.crop&&Math.abs(r.lon-beat.lon)<.02&&Math.abs(r.lat-beat.lat)<.02)||records.find(r=>r.cropId===chapter.crop);};
  const effectiveScope=()=>crops.has(getCurrent().chapter.crop)?scope:'all';
  const sourceLink=(title,url)=>{const a=el('a',title);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
  let group='';for(const chapter of data.chapters){if(chapter.group!==group){group=chapter.group;const opt=el('optgroup');opt.label=group;$('imm-crop').append(opt);}const option=el('option',chapter.title);option.value=chapter.id;$('imm-crop').lastElementChild.append(option);}

  function getModel(record){
    if(record.model)return record.model;
    const model=createCropMiniature(record.cropId);model.name=record.id;model.position.copy(vector(record.lon,record.lat,1.018));
    // These are cartographic miniatures, not a vegetation simulation. The geographic
    // root is exact; a camera-facing orientation keeps the plant silhouette readable.
    model.traverse(o=>{o.userData.placementId=record.id;if(o.isMesh){o.renderOrder=12;for(const m of Array.isArray(o.material)?o.material:[o.material]){m.depthTest=false;m.depthWrite=false;}}});
    root.add(model);record.model=model;return model;
  }
  function frameLoop(){animation=0;if(!enabled||audio.paused||document.hidden)return;requestDraw();animation=requestAnimationFrame(frameLoop);}
  function startAnimation(){if(!animation&&!audio.paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches)animation=requestAnimationFrame(frameLoop);}
  function setInfoCollapsed(value){infoCollapsed=value;$('imm-info-body').hidden=value;$('imm-info-toggle').setAttribute('aria-expanded',String(!value));$('imm-info-toggle').textContent=value?'＋':'−';$('imm-info-toggle').setAttribute('aria-label',value?'展开地区说明':'收起地区说明');}
  function onBeat(){
    if(!enabled)return;const state=getCurrent(),chapter=state.chapter,beat=chapter.beats?.[Math.max(0,state.beatIndex)]||chapter,r=activeRecord(),crop=crops.get(chapter.crop),profile=profiles.get(chapter.crop);
    $('imm-title').textContent=crop?.name||'从地球，看见生长';$('imm-kicker').textContent=crop?(crop.taxonomy?.clade||chapter.group)+' / '+crop.latin:data.crops.length+' 个代表植物 · 全球环境导览';
    $('imm-stage').textContent=(beat.shapeMode==='morphology'?'形态识别 · ':'正在观察 · ')+(r?.region||beat.label||chapter.title);
    const stops=$('imm-stops');stops.replaceChildren();(chapter.beats||[]).forEach((b,i)=>{const button=el('button',(i+1)+' '+(b.shapeMode==='morphology'?'形态观察':b.label),i===state.beatIndex?'active':'');button.onclick=()=>{manualPoint=null;seekBeat(i,!audio.paused);};stops.append(button);});
    $('imm-follow').textContent=state.follow?'跟随讲解':'自由观察 · 点击跟随';$('imm-follow').setAttribute('aria-pressed',String(state.follow));
    if(!manualPoint||state.follow){manualPoint=null;renderInfo(r,crop,profile);}
    requestDraw();
  }
  function renderInfo(record,crop,profile){
    const state=getCurrent(),beat=state.chapter.beats?.[Math.max(0,state.beatIndex)],morphology=beat?.shapeMode==='morphology',regionalText=record?data.chapters.find(c=>c.id===record.chapterId)?.beats[record.beatIndex]?.text:null;
    $('imm-region').textContent=record?.region||'先看形态，再理解环境';$('imm-info-title').textContent=crop?(morphology?crop.name+' · 形态识别':crop.name+' · 地区与环境'):'同一片地，为什么有不同作物';
    $('imm-summary').textContent=(morphology?beat.text:regionalText)||profile?.summary||'点击地球上的小植物，认识它的形态与代表地区。也可以从上方选择章节，让地球跟随MiniMax旁白展开。';
    const factors=$('imm-factors');factors.replaceChildren();if(crop){const e=evidence.get(crop.id);for(const [label,text] of [[e?.temperatureOptimalC?'生长季温度参考':'环境要求',e?.temperatureOptimalC?e.temperatureOptimalC.join('–')+'°C':crop.needs],['水分与生境',profile?.water.timing||crop.needs]]){const row=el('div');row.append(el('span',label),el('strong',text));factors.append(row);}}
    $('imm-limitation').textContent=crop?(profile?.misconception||crop.limits):'小模型是代表点的形态示意，数量和大小不表示实际种植面积。';
    $('imm-evidence-type').textContent=record?evidenceLabel(record):'代表植物导览';const proof=$('imm-evidence-source');proof.replaceChildren();if(record?.sourceUrl)proof.append(sourceLink('地区依据 ↗',record.sourceUrl));if(crop?.mapModel==='reference-only')proof.append(el('p','代表地区示意；未计算全球适生范围。'));
  }
  function onChapter(){
    const state=getCurrent();if(filterIds&&!filterIds.has(state.chapter.crop)){clearFilter();scope='current';}$('imm-crop').value=state.chapter.id;$('imm-scope').value=distributionMode?'distribution':effectiveScope();$('imm-scope').options[0].disabled=!crops.has(state.chapter.crop);$('imm-layer').value=state.layer;manualPoint=null;
    $('imm-prev').disabled=state.index===0;$('imm-next').disabled=state.index===data.chapters.length-1;$('imm-chapter-count').textContent=(state.index+1)+' / '+data.chapters.length+' 章';
    shapeReading.innerHTML=$('plant-diagram').innerHTML;shapeReading.append(el('p',$('morph-caption').textContent));textReading.replaceChildren(el('h3',state.chapter.title),...(state.chapter.beats||[]).map(b=>el('p',b.text)));const references=el('div',null,'imm-reading-sources');for(const a of $('sources').children)references.append(a.cloneNode(true));textReading.append(references);
    onBeat();onTime();
  }
  function onTime(){
    if(!enabled)return;
    // The region/learning player owns its context even when an old audio event
    // arrives after a lesson change. Never overwrite it with the chapter player.
    if(distributionMode){$('imm-speed').value=String(audio.playbackRate);$('imm-continuous').checked=$('continuous').checked;api.onDistributionTime?.();startAnimation();return;}
    const state=getCurrent(),duration=Number.isFinite(audio.duration)?audio.duration:state.recording?.duration||0;
    $('imm-caption').textContent=$('caption').textContent;$('imm-elapsed').textContent=formatTime(audio.currentTime);$('imm-duration').textContent=formatTime(duration);$('imm-seek').value=String(duration?Math.round(audio.currentTime/duration*1000):0);
    $('imm-play').textContent=audio.paused?(audio.ended?'重播本章':'播放讲解'):'暂停讲解';$('imm-play').disabled=!state.recording;$('imm-speed').value=String(audio.playbackRate);$('imm-continuous').checked=$('continuous').checked;
    const status=$('audio-status').textContent;$('imm-audio-status').textContent=/失败|未开始/.test(status)?status:'MiniMax 合成旁白 · 句段字幕与地区讲解';
    $('imm-follow').textContent=state.follow?'跟随讲解':'自由观察 · 点击跟随';$('imm-follow').setAttribute('aria-pressed',String(state.follow));startAnimation();
  }
  function updateLegend(){
    const legend=$('imm-legend');legend.replaceChildren();if(getCurrent().layer==='crop'&&crops.has(getCurrent().chapter.crop))legend.append(el('strong',crops.get(getCurrent().chapter.crop).name+'：'));
    for(const item of $('legend').children)legend.append(item.cloneNode(true));$('imm-layer').value=getCurrent().layer;$('imm-layer').options[0].textContent=crops.get(getCurrent().chapter.crop)?.mapModel==='reference-only'?'代表地区':'气候候选';
  }
  function selectPlacement(record){
    $('imm-cluster-menu').hidden=true;manualPoint=null;scope='current';const playing=!audio.paused;
    if(getCurrent().chapter.id!==record.chapterId)selectChapter(record.chapterId,playing);
    $('imm-scope').value='current';seekBeat(record.beatIndex,playing);setInfoCollapsed(innerWidth<761);onBeat();
  }
  function openCluster(members,x,y){
    if(members.length===1){selectPlacement(members[0]);return;}
    const menu=$('imm-cluster-menu');menu.hidden=false;$('imm-cluster-title').textContent='这一带的 '+members.length+' 个代表点';const list=$('imm-cluster-items');list.replaceChildren();
    for(const r of members){const b=el('button',crops.get(r.cropId).name+' · '+r.region+' · '+evidenceLabel(r));b.onclick=()=>selectPlacement(r);list.append(b);}
    menu.style.left='50%';menu.style.top='45%';list.querySelector('button')?.focus();
  }
  function beforeRender(){
    if(!enabled)return;if(distributionMode||narrationMode){for(const r of records){r.visible=false;if(r.model)r.model.visible=false;if(r.button)r.button.hidden=true;}groups=[];return;}const w=globeRoot.clientWidth,h=globeRoot.clientHeight,state=getCurrent(),active=activeRecord(),all=effectiveScope()==='all',inverse=globe.getWorldQuaternion(new THREE.Quaternion()).invert();
    const candidates=[];for(const r of records){r.visible=false;r.model&&(r.model.visible=false);r.button&&(r.button.hidden=true);const p=vector(r.lon,r.lat,1.025).applyMatrix4(globe.matrixWorld),toward=camera.position.clone().sub(p).normalize();r.front=p.clone().normalize().dot(toward)>.16;if(!r.front||(!all&&r.cropId!==state.chapter.crop)||(all&&filterIds&&!filterIds.has(r.cropId)))continue;const screen=p.project(camera);r.x=(screen.x+1)*w/2;r.y=(1-screen.y)*h/2;if(r.x<45||r.x>w-45||r.y<70||r.y>h-60)continue;candidates.push(r);}
    candidates.sort((a,b)=>(b.id===active?.id)-(a.id===active?.id)||Math.abs(a.x-w/2)+Math.abs(a.y-h*.45)-Math.abs(b.x-w/2)-Math.abs(b.y-h*.45));
    groups=[];const threshold=all?(w<700?63:78):42;for(const r of candidates){const existing=groups.find(g=>Math.hypot(g.leader.x-r.x,g.leader.y-r.y)<threshold);if(existing)existing.members.push(r);else groups.push({leader:r,members:[r]});}
    const max=all?(w<700?9:15):4;groups=groups.slice(0,max);
    for(const group of groups){const r=group.leader,model=getModel(r),isActive=r.id===active?.id;model.visible=true;r.visible=true;model.quaternion.copy(inverse).multiply(modelOrientation);const pixels=(all?39:54)*(isActive?1.15:1),worldPerPixel=(camera.top-camera.bottom)/h,breath=(!audio.paused&&isActive&&!matchMedia('(prefers-reduced-motion: reduce)').matches)?1+Math.sin(performance.now()/600)*.018:1;model.scale.setScalar(pixels*worldPerPixel*breath);model.updateMatrixWorld(true);
      if(!r.button){r.button=el('button',null,'imm-marker');r.button.type='button';r.button.dataset.placement=r.id;labelHost.append(r.button);}const button=r.button;button.hidden=false;button.className='imm-marker'+(isActive?' active':'')+(group.members.length>1?' cluster':'');button.setAttribute('aria-label',crops.get(r.cropId).name+' · '+r.region+(group.members.length>1?'，另有'+(group.members.length-1)+'个代表点':''));button.textContent=all?crops.get(r.cropId).name+(group.members.length>1?' ＋'+(group.members.length-1):''):r.region;button.style.left=r.x+'px';button.style.top=(r.y+8)+'px';button.onclick=()=>openCluster(group.members,r.x,r.y);
    }
    $('imm-marker-status').textContent=all?`${filterIds?.size||crops.size} 个条目 · 视野内 ${groups.length} 组标记 · 近点合并`:`${crops.get(state.chapter.crop)?.name||'植物'} · ${records.filter(r=>r.cropId===state.chapter.crop).length} 个代表地区`;
  }
  function pick(event){
    if(!enabled||distributionMode||narrationMode)return false;const box=renderer.domElement.getBoundingClientRect(),p=new THREE.Vector2((event.clientX-box.left)/box.width*2-1,-(event.clientY-box.top)/box.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(p,camera);const hit=ray.intersectObjects(records.filter(r=>r.visible).map(r=>r.model),true)[0];if(!hit)return false;const record=records.find(r=>r.id===hit.object.userData.placementId),group=groups.find(g=>g.leader===record);if(record)openCluster(group?.members||[record],record.x,record.y);return !!record;
  }
  function onPoint(point){
    $('imm-evidence-type').textContent='历史气候网格';$('imm-evidence-source').replaceChildren();
    if(!enabled)return;manualPoint=point;setInfoCollapsed(false);$('imm-region').textContent='选中网格 · '+Math.abs(point.lat).toFixed(1)+(point.lat>=0?'°N':'°S')+' / '+Math.abs(point.lon).toFixed(1)+(point.lon>=0?'°E':'°W');$('imm-info-title').textContent=point.code?'历史气候 '+point.code:'此处没有可用气候网格';
    $('imm-summary').textContent=point.code?'该网格的候选由历史气候类型归纳，不能代替本地土壤、水源或品种核查。':'可能是海洋、小岛或资料空缺。没有资料不代表作物不适合。';const factors=$('imm-factors');factors.replaceChildren();if(point.code){const candidates=[...crops.values()].filter(c=>c.typical.includes(point.code)||c.conditional.includes(point.code));for(const crop of candidates){const b=el('button',crop.name);b.onclick=()=>{scope='current';selectChapter(data.chapters.find(c=>c.crop===crop.id).id,false);};factors.append(b);}if(!candidates.length)factors.append(el('span','已有气候映射的作物中未列入候选。'));}$('imm-limitation').textContent='点击小植物会进入对应代表地区；候选列表不代表这里已种植。';
  }
  function openDetails(){
    if(drawerOpen)return;drawerOpen=true;pendingFocus=document.activeElement;$('imm-drawer').hidden=false;$('imm-drawer-body').append(learning);learning.hidden=false;$('imm-close-details').focus();
  }
  function closeDetails(){
    if(!drawerOpen)return;drawerOpen=false;$('imm-drawer').hidden=true;learningParent.insertBefore(learning,learningNext);if(pendingFocus?.isConnected)pendingFocus.focus();pendingFocus=null;
  }
  function setEnabled(value){
    if(value===enabled)return;if(value){savedScroll=scrollY;savedLayer=getCurrent().layer;enabled=true;host.hidden=false;document.body.classList.add('is-immersive');root.visible=true;labelHost.hidden=false;setLayer('geography');window.scrollTo(0,0);setInfoCollapsed(innerWidth<761);onChapter();updateLegend();requestAnimationFrame(()=>{resize();requestDraw();$('imm-play').focus({preventScroll:true});});}
    else{api.onDistributionExit?.();closeDetails();enabled=false;host.hidden=true;root.visible=false;labelHost.hidden=true;document.body.classList.remove('is-immersive');$('imm-cluster-menu').hidden=true;cancelAnimationFrame(animation);animation=0;setLayer(savedLayer);resize();requestAnimationFrame(()=>{window.scrollTo(0,savedScroll);$('enter-immersive').focus({preventScroll:true});});}
    api.onEnabledChange?.(enabled);
  }
  function clearFilter(){filterIds=null;filterLabel='全部代表植物';$('imm-filter').textContent=`全部 ${crops.size} 个条目 · 筛选`;requestDraw();}
  function setFilter(ids,label){filterIds=new Set(ids);filterLabel=label;scope='all';manualPoint=null;if(ids.length&&!filterIds.has(getCurrent().chapter.crop))selectChapter(data.chapters.find(c=>c.crop===ids[0]).id,false);$('imm-scope').value='all';$('imm-filter').textContent=label+' · '+ids.length+' 个条目';setLayer('geography');$('imm-cluster-menu').hidden=true;requestDraw();}
  $('imm-crop').onchange=()=>{api.onDistributionExit?.();manualPoint=null;clearFilter();selectChapter($('imm-crop').value,!audio.paused);};$('imm-scope').onchange=()=>{const value=$('imm-scope').value;if(value==='distribution'){api.onDistributionRequest?.();return;}api.onDistributionExit?.();scope=value;if(scope==='all')setLayer('geography');$('imm-cluster-menu').hidden=true;requestDraw();};$('imm-layer').onchange=()=>setLayer($('imm-layer').value);
  $('imm-play').onclick=()=>{$('play').click();onTime();};$('imm-prev').onclick=()=>{$('previous').click();};$('imm-next').onclick=()=>{$('next').click();};$('imm-follow').onclick=()=>{manualPoint=null;$('follow').click();onBeat();};$('imm-reset-view').onclick=()=>{manualPoint=null;$('focus').click();onBeat();};
  $('imm-speed').onchange=()=>{$('speed').value=$('imm-speed').value;$('speed').dispatchEvent(new Event('change'));};$('imm-continuous').onchange=()=>{$('continuous').checked=$('imm-continuous').checked;};$('imm-seek').oninput=()=>{$('seek').value=$('imm-seek').value;$('seek').dispatchEvent(new Event('input'));};
  $('imm-zoom-in').onclick=()=>{$('zoom-in').click();};$('imm-zoom-out').onclick=()=>{$('zoom-out').click();};$('imm-info-toggle').onclick=()=>setInfoCollapsed(!infoCollapsed);$('imm-details').onclick=openDetails;$('imm-read-environment').onclick=()=>{openDetails();$('tab-profile').click();};$('imm-close-details').onclick=closeDetails;$('imm-exit').onclick=()=>setEnabled(false);$('imm-close-cluster').onclick=()=>{$('imm-cluster-menu').hidden=true;};
  $('enter-immersive').onclick=()=>setEnabled(true);
  document.addEventListener('keydown',e=>{if(!enabled||document.getElementById('plant-catalog')?.open)return;if(e.key==='Escape'){if(document.body.classList.contains('is-learning')){api.onLearningExit?.();return;}if(drawerOpen)closeDetails();else if(!$('imm-cluster-menu').hidden)$('imm-cluster-menu').hidden=true;else setEnabled(false);}});
  for(const event of ['play','pause','ended','error','ratechange'])audio.addEventListener(event,onTime);
  const observer=new ResizeObserver(()=>{if(enabled){const nowNarrow=innerWidth<761;if(nowNarrow!==narrow){narrow=nowNarrow;setInfoCollapsed(narrow);}const playerHeight=$('imm-player').getBoundingClientRect().height+'px';host.style.setProperty('--imm-player-height',playerHeight);document.body.style.setProperty('--imm-player-height',playerHeight);resize();}});observer.observe($('imm-player'));observer.observe(host.querySelector('.imm-header'));
  function getInsets(){return {top:Math.max(host.querySelector('.imm-header').getBoundingClientRect().bottom+16,innerWidth<761?220:0),bottom:$('imm-player').getBoundingClientRect().height+34};}
  function setDistributionMode(value){distributionMode=value;if(value){closeDetails();$('imm-cluster-menu').hidden=true;labelHost.hidden=true;}else labelHost.hidden=!enabled;$('imm-scope').value=value?'distribution':effectiveScope();requestDraw();}
  return {setEnabled,setNarrationMode(value){narrationMode=!!value;requestDraw();},setFilter,clearFilter,setDistributionMode,openDetails,closeDetails,isEnabled:()=>enabled,onChapter,onBeat,onTime,onPoint,beforeRender,pick,updateLegend,getInsets,getState:()=>({enabled,distributionMode,scope:effectiveScope(),filterIds:filterIds?[...filterIds]:null,filterLabel,modelCount:records.filter(r=>r.model).length,visibleModelCount:records.filter(r=>r.visible).length,currentCrop:getCurrent().chapter.crop,drawerOpen,placementCount:records.length,visiblePlacements:records.filter(r=>r.visible).map(({id,cropId,region,lon,lat,x,y,front})=>({id,cropId,region,lon,lat,x,y,front})),allPlacements:placements,groups:groups.map(g=>({leader:g.leader.id,members:g.members.map(r=>r.id)}))})};
}
