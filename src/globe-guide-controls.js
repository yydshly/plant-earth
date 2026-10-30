import {GUIDE_GROUPS,GUIDE_PRESETS} from './globe-guides.js';

const STORAGE_KEY='plant-earth-globe-guides-v1';
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
const rectIfVisible=element=>{if(!element||element.hidden||getComputedStyle(element).visibility==='hidden'||getComputedStyle(element).display==='none')return null;const rect=element.getBoundingClientRect();return rect.width&&rect.height?rect:null;};

/** View preferences are kept apart from the user's learning and answer history. */
export function createGlobeGuideControls({guides,getContext,onChange}={}){
  if(!guides)throw new Error('Globe reference guides are required');
  const groups=new Map(GUIDE_GROUPS.map(group=>[group.key,group]));
  let enabled=false,explanation=null,positionFrame=0;
  const host=node('details',null,'globe-guide-controls');host.id='globe-guide-controls';host.hidden=true;
  const summary=node('summary');summary.id='guide-toggle';summary.setAttribute('aria-controls','guide-controls-panel');summary.append(node('span','辅助标线'),node('small','推荐','guide-toggle-state'));
  const panel=node('section',null,'guide-controls-panel');panel.id='guide-controls-panel';panel.setAttribute('aria-label','选择地球辅助标线');
  const heading=node('div',null,'guide-controls-heading'),title=node('div');title.append(node('strong','一层一层读懂地球'),node('p','线可以单独开关，数字只作位置参考。'));
  const close=node('button','收起');close.type='button';close.id='guide-controls-close';close.setAttribute('aria-label','收起辅助标线设置');heading.append(title,close);panel.append(heading);
  const presets=node('div',null,'guide-preset-options');presets.setAttribute('role','group');presets.setAttribute('aria-label','标线预设');
  for(const [key,title] of [['basic','推荐'],['all','全部'],['off','关闭标线']]){const button=node('button',title);button.type='button';button.dataset.guidePreset=key;button.onclick=()=>{guides.setPreset(key);explanation=null;renderExplanation();changed();};presets.append(button);}panel.append(presets);
  const followLabel=node('label',null,'guide-follow-lesson'),followCheck=node('input');followCheck.type='checkbox';followCheck.id='guide-follow-lesson';followCheck.checked=true;
  const followText=node('span');followText.append(node('strong','跟随本课突出重点'),node('small','只调整明暗，保留所选标线和预设'));followLabel.append(followCheck,followText);panel.append(followLabel);
  const lessonInfo=node('div',null,'guide-lesson-context');lessonInfo.id='guide-lesson-context';lessonInfo.setAttribute('role','status');lessonInfo.setAttribute('aria-live','polite');panel.append(lessonInfo);
  followCheck.onchange=()=>{guides.setFollowLesson(followCheck.checked);changed();};
  const info=node('div',null,'guide-explanation');info.id='guide-explanation';info.setAttribute('role','status');info.setAttribute('aria-live','polite');info.tabIndex=-1;panel.append(info);
  const list=node('div',null,'guide-group-options');
  for(const group of GUIDE_GROUPS){
    const row=node('div',null,'guide-group-row'),label=node('label'),check=node('input');check.type='checkbox';check.dataset.guideGroup=group.key;check.id='guide-group-'+group.key;check.setAttribute('aria-label',group.label);
    const swatch=node('i',null,'guide-line-swatch');swatch.style.setProperty('--guide-line-color',group.color||'#b8cdb5');swatch.setAttribute('aria-hidden','true');swatch.dataset.lineKind=group.key;
    label.append(check,swatch,node('span',group.label));check.onchange=()=>{guides.setGroup(group.key,check.checked);explanation={id:group.key,title:group.label,label:group.label,description:group.description,group:group.key,color:group.color};renderExplanation();changed();};
    const explain=node('button','说明','guide-group-explain');explain.type='button';explain.dataset.guideInfo=group.key;explain.setAttribute('aria-label','了解'+group.label+'的含义');explain.onclick=()=>showExplanation({id:group.key,title:group.label,label:group.label,description:group.description,group:group.key,color:group.color});
    row.append(label,explain);list.append(row);
  }
  panel.append(list);
  const densityLabel=node('label','经纬网密度','guide-density'),density=node('select');density.id='guide-density';density.setAttribute('aria-label','经纬网密度');
  for(const [value,title] of [['normal','普通 · 纬15° / 经30°'],['fine','细网 · 纬10° / 经15°']]){const option=node('option',title);option.value=value;density.append(option);}density.onchange=()=>{guides.setDensity(density.value);changed();};densityLabel.append(density);panel.append(densityLabel);
  const help=node('details',null,'guide-reading-help');help.append(node('summary','第一次看经纬线？'));
  help.append(node('p','纬线像一圈圈腰带，平行于赤道，帮助比较南北位置；经线连接南北极，帮助比较东西位置。'),node('p','N、S表示赤道以北、以南；E、W表示本初经线以东、以西。这里不用先背经纬度。'),node('p','回归线约在南北纬23.4°，极圈约在南北纬66.6°。这些是定位与日照参照，不是植物分布边界。'),node('p','浅色日照纬度带不等于气候区或植被区；180°经线也不等于实际弯折的国际日期变更线。'));
  panel.append(help,node('p','拖动地球可查看背面与两极；点线名查看含义。关闭标线会保留植物与地名。','guide-controls-footnote'));
  host.append(summary,panel);document.body.append(host);

  function renderExplanation(){
    info.replaceChildren();if(!explanation){info.append(node('p','点“说明”或球上的线名，可以了解这条线有什么用。'));return;}
    const swatch=node('i',null,'guide-line-swatch');swatch.style.setProperty('--guide-line-color',explanation.color||groups.get(explanation.group)?.color||'#c9d8b8');swatch.setAttribute('aria-hidden','true');const name=node('strong');name.append(swatch,document.createTextNode(explanation.title||explanation.label||'辅助标线'));
    info.append(name,node('p',explanation.description||groups.get(explanation.group)?.description||'这条标线帮助我们比较地球上的位置。'));
  }
  function persist(){try{const state=guides.getState();localStorage.setItem(STORAGE_KEY,JSON.stringify({preset:state.preset,groups:{...state.groups},density:state.density,followLesson:state.followLesson}));}catch{}}
  function changed(){sync();persist();onChange?.(guides.getState());}
  function showExplanation(meta){
    explanation={...meta};renderExplanation();host.open=true;panel.scrollTop=0;schedulePosition();info.focus({preventScroll:true});
  }
  function renderLessonContext(state=guides.getState()){
    const focus=state.lessonEmphasis||{};followCheck.checked=state.followLesson!==false;
    const key=JSON.stringify([state.followLesson,focus.available,focus.active,focus.lesson,focus.focusedGroups,focus.missingFocus,state.groups]);
    if(lessonInfo.dataset.contentKey===key)return;lessonInfo.dataset.contentKey=key;lessonInfo.replaceChildren();
    if(!focus.available){lessonInfo.append(node('p','进入课程后，可突出与当前内容有关的标线。自由探索时保持各线原有亮度。'));return;}
    const names=(focus.focusedGroups?.length?focus.focusedGroups:focus.relevantGroups||[]).map(key=>groups.get(key)?.label).filter(Boolean);
    lessonInfo.append(node('strong',(focus.active?'本课重点：':'本课可对照：')+names.join('、')),node('p',focus.reason||'用标线比较位置，再结合环境理解植物。'));
    if(state.followLesson===false)lessonInfo.append(node('small','已关闭跟随：所有已选标线恢复原有亮度。'));
    else if(focus.missingFocus)lessonInfo.append(node('small','你尚未打开这些重点线；保留当前选择，其他线不淡化。'));
    else if(focus.active)lessonInfo.append(node('small','其他已选标线仍然显示，只降低亮度；“全部”或自定义选择不会被替换。'));
  }
  function sync(){
    const state=guides.getState(),active=Object.values(state.groups||{}).filter(Boolean).length;
    const presetLabel=active===0?'已关闭':state.preset==='basic'?'推荐':state.preset==='all'?'全部':active+'组';summary.querySelector('small').textContent=presetLabel+(state.lessonEmphasis?.active?'·重点':'');
    for(const check of list.querySelectorAll('[data-guide-group]'))check.checked=!!state.groups?.[check.dataset.guideGroup];
    for(const button of presets.querySelectorAll('[data-guide-preset]'))button.setAttribute('aria-pressed',String(state.preset===button.dataset.guidePreset));
    density.value=state.density==='fine'?'fine':'normal';renderLessonContext(state);schedulePosition();
  }
  function position(){
    positionFrame=0;if(!enabled)return;const state=guides.getState();renderLessonContext(state);const active=Object.values(state.groups||{}).filter(Boolean).length,presetLabel=active===0?'已关闭':state.preset==='basic'?'推荐':state.preset==='all'?'全部':active+'组';summary.querySelector('small').textContent=presetLabel+(state.lessonEmphasis?.active?'·重点':'');
    const narrow=innerWidth<=760,margin=narrow?13:20,context=getContext?.()||{},learning=context.learning??document.body.classList.contains('is-learning');
    const learningHeader=learning?rectIfVisible(document.querySelector('.learn-header')):null;
    const distributionHeader=!learning&&document.body.classList.contains('is-distribution')?rectIfVisible(document.querySelector('#distribution-ui .dist-toolbar')):null;
    const header=learningHeader||distributionHeader||rectIfVisible(document.querySelector('.imm-header'));
    const lessonPanel=learning?rectIfVisible(document.querySelector('.learn-panel')):(rectIfVisible(document.querySelector('.dist-analysis-side'))||rectIfVisible(document.querySelector('.imm-info')));
    const collapsedLearning=learning&&document.querySelector('.learning-journey')?.classList.contains('learn-collapsed');
    const rightEdge=!narrow&&lessonPanel?lessonPanel.left-14:innerWidth-margin;
    const summaryWidth=Math.min(142,Math.max(110,summary.getBoundingClientRect().width||130));
    const left=collapsedLearning?margin:Math.max(margin,rightEdge-summaryWidth);
    let top=Math.max(header?.bottom||60,collapsedLearning?(lessonPanel?.bottom||0):0)+8;
    for(const selector of ['#geo-orientation-note','#learning-map-key']){const note=rectIfVisible(document.querySelector(selector));if(note&&left<note.right+6&&rightEdge>note.left-6&&top<note.bottom+6)top=note.bottom+7;}
    const player=rectIfVisible(document.getElementById('imm-player')),floor=(player?.top||innerHeight)-12;
    top=Math.max(margin,Math.min(top,floor-42));
    host.style.left=left+'px';host.style.top=top+'px';host.style.right='auto';
    const panelWidth=Math.min(narrow?338:344,innerWidth-margin*2);
    panel.style.width=panelWidth+'px';panel.style.left=Math.max(margin-left,summaryWidth-panelWidth)+'px';panel.style.right='auto';
    panel.style.maxHeight=Math.max(125,floor-top-summary.getBoundingClientRect().height-8)+'px';
    onChange?.(guides.getState());
  }
  function schedulePosition(){if(!positionFrame)positionFrame=requestAnimationFrame(position);}
  close.onclick=()=>{host.open=false;summary.focus({preventScroll:true});};
  host.addEventListener('toggle',()=>{summary.setAttribute('aria-expanded',String(host.open));schedulePosition();onChange?.(guides.getState());});
  host.addEventListener('keydown',event=>{if(event.key==='Escape'&&host.open){event.preventDefault();event.stopPropagation();host.open=false;summary.focus({preventScroll:true});}});
  const observer=new ResizeObserver(schedulePosition);for(const selector of ['.learn-header','.imm-header','#imm-player','#distribution-ui .dist-toolbar','.learn-panel','#geo-orientation-note','#learning-map-key']){const target=document.querySelector(selector);if(target)observer.observe(target);}
  const classObserver=new MutationObserver(schedulePosition);classObserver.observe(document.body,{attributes:true,attributeFilter:['class']});window.addEventListener('resize',schedulePosition);
  try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(saved&&typeof saved==='object'){guides.setPreset(Object.hasOwn(GUIDE_PRESETS,saved.preset)?saved.preset:'basic');if(saved.preset==='custom'&&saved.groups)for(const [key,value] of Object.entries(saved.groups))if(groups.has(key)&&typeof value==='boolean')guides.setGroup(key,value);if(['normal','fine'].includes(saved.density))guides.setDensity(saved.density);guides.setFollowLesson(typeof saved.followLesson==='boolean'?saved.followLesson:true);}else{guides.setPreset('basic');guides.setFollowLesson(true);}}catch{guides.setPreset('basic');guides.setFollowLesson(true);}
  renderExplanation();sync();
  return {setEnabled(value){enabled=!!value;host.hidden=!enabled;if(!enabled)host.open=false;else sync();},sync,explain:showExplanation,relayout:schedulePosition,getState:()=>({enabled,open:host.open,preset:guides.getState().preset,groups:{...guides.getState().groups},density:guides.getState().density,followLesson:guides.getState().followLesson,lessonEmphasis:guides.getState().lessonEmphasis,explained:explanation?.id||null})};
}
