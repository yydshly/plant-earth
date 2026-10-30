const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!=null)node.textContent=String(text);if(className)node.className=className;return node;};
const labelText=value=>Array.isArray(value)?value.map(labelText).join(' '):typeof value==='string'?value:typeof value==='number'?String(value):value?.label||value?.title||'';

// This is a navigation catalogue only. Lesson progress and playback stay in
// their existing modules; opening, searching or browsing the catalogue is silent.
export function createCourseDirectory({container=document.body,groups=[],photos=[],surface=null,onSelect,onPause,onClose}={}){
  const entries=(Array.isArray(groups)?groups:[]).filter(group=>group&&typeof group.id==='string').map(group=>({...group,lessons:Array.isArray(group.lessons)?group.lessons.filter(lesson=>lesson&&typeof lesson.id==='string'):[]}));
  const byId=new Map(entries.map(group=>[group.id,group])),allLessons=entries.flatMap(group=>group.lessons.map(lesson=>({group,lesson})));
  const photoById=new Map((Array.isArray(photos)?photos:[]).filter(photo=>photo&&typeof photo.cropId==='string'&&typeof photo.file==='string').map(photo=>[photo.cropId,photo]));
  const moduleImages={foundation:'treefern',environments:'saguaro',agriculture:'wheat',biodiversity:'lotus',regions:'rice',maps:'ginkgo',map:'ginkgo',review:'tea'};
  const photoNames={treefern:'软树蕨',saguaro:'巨人柱',wheat:'小麦',lotus:'莲',rice:'水稻',ginkgo:'银杏',tea:'茶'};
  let opened=false,selectedGroupId=null,query='',returnFocus=null,destroyed=false,ownInert=false;
  const isolated=new Map();
  const root=el('section',null,'course-directory');root.id='course-directory';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','course-directory-title');
  const panel=el('div',null,'directory-panel'),header=el('header',null,'directory-header'),heading=el('h1','课程目录','directory-title');heading.id='course-directory-title';heading.tabIndex=-1;
  const closeButton=button('关闭目录，返回原页面',()=>close(),'directory-close');closeButton.id='course-directory-close';
  const titleWrap=el('div');titleWrap.append(el('p','按模块进入 · 随时跳到具体一课','directory-eyebrow'),heading,el('p','不必从头开始。打开课程会保留已有学习记录；点“进入并播放”才开始声音。','directory-lead'));header.append(titleWrap,closeButton);
  const searchLabel=el('label',null,'directory-search');searchLabel.append(el('span','搜索全部课程'));const search=el('input');search.type='search';search.id='course-directory-search';search.placeholder='输入课程、植物、学名或地区';search.setAttribute('aria-label','搜索全部课程');searchLabel.append(search);
  const clear=button('清除搜索',()=>{query='';search.value='';renderContent();renderNavigation();search.focus();},'directory-clear');clear.hidden=true;
  const searchRow=el('div',null,'directory-search-row');searchRow.append(searchLabel,clear);
  const layout=el('div',null,'directory-layout'),navigation=el('nav',null,'directory-navigation');navigation.setAttribute('aria-label','课程模块');const content=el('section',null,'directory-content');content.id='course-directory-content';content.tabIndex=0;content.setAttribute('aria-label','当前模块内容，可独立滚动');
  const status=el('p',null,'directory-status');status.id='course-directory-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');layout.append(navigation,content);panel.append(header,searchRow,status,layout);root.append(panel);container.append(root);
  search.addEventListener('input',()=>{query=search.value;renderNavigation();renderContent();});

  function button(text,action,className){const node=el('button',text,className);node.type='button';node.addEventListener('click',action);return node;}
  function count(group){return Number.isFinite(group.count)&&group.count>=0?group.count:group.lessons.length;}
  function countText(group,amount=count(group)){return `${amount} ${typeof group.countLabel==='string'&&group.countLabel.trim()?group.countLabel.trim():'课'}`;}
  function serial(group){return String(Math.max(0,entries.indexOf(group))+1).padStart(2,'0');}
  function groupMedia(group){
    const isEarth=['foundation','maps','map'].includes(group.id)&&typeof surface?.file==='string';
    const photo=isEarth?surface:photoById.get(moduleImages[group.id]);if(!photo?.file)return null;
    const figure=el('figure',null,'directory-module-media'),image=el('img');image.src=photo.file;image.alt=isEarth?'NASA 2004年合成地表图，模块主题预览':(photoNames[photo.cropId]||photo.scientificName||'植物')+'实物照片，模块主题预览';image.loading='lazy';image.decoding='async';
    figure.append(image);const caption=el('figcaption',null,'directory-image-caption');
    const identity=isEarth?'NASA · 2004合成':(photoNames[photo.cropId]||'植物')+'实物';
    if(photo.sourceUrl){const link=el('a',identity);link.href=photo.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';link.title=[photo.credit,photo.license,isEarth?'历史合成地表影像，非实时景观':'裁切主题预览，不表示照片拍于课程地区'].filter(Boolean).join(' · ');link.setAttribute('aria-label','图片来源：'+identity+'，'+[photo.credit,photo.license].filter(Boolean).join('，'));caption.append(link);}else caption.append(el('span',identity));
    figure.append(caption);return figure;
  }
  function results(){
    const term=query.trim().toLocaleLowerCase();
    if(term)return allLessons.filter(({group,lesson})=>[group.title,group.description,lesson.groupTitle,lesson.title,lesson.description,labelText(lesson.tags)].filter(Boolean).join(' ').toLocaleLowerCase().includes(term));
    return selectedGroupId?(byId.get(selectedGroupId)?.lessons||[]).map(lesson=>({group:byId.get(selectedGroupId),lesson})):[];
  }
  function choose(action,play=false){
    if(!opened||action==null)return;
    close({restoreFocus:false});onSelect?.(action,{play:play===true});
  }
  function selectGroup(id){selectedGroupId=byId.has(id)?id:null;query='';search.value='';renderNavigation();renderContent();content.querySelector('h2')?.focus({preventScroll:true});content.scrollTop=0;root.scrollTop=0;}
  function renderNavigation(){
    navigation.replaceChildren();const all=button('全部模块',()=>selectGroup(null));all.dataset.directoryGroup='all';all.setAttribute('aria-current',!query.trim()&&!selectedGroupId?'page':'false');navigation.append(all);
    for(const group of entries){const item=button('',()=>selectGroup(group.id));item.dataset.directoryGroup=group.id;const number=el('span',serial(group),'directory-nav-number');number.setAttribute('aria-hidden','true');item.append(number,el('span',group.title,'directory-nav-name'),el('small',countText(group)));item.setAttribute('aria-current',!query.trim()&&selectedGroupId===group.id?'page':'false');navigation.append(item);}
  }
  function contentHeading(title,description){const node=el('h2',title);node.tabIndex=-1;content.append(node);if(description)content.append(el('p',description,'directory-section-lead'));}
  function renderContent(){
    content.replaceChildren();content.scrollTop=0;clear.hidden=!query.trim();
    if(!query.trim()&&!selectedGroupId){
      status.textContent=`${entries.length} 个模块 · ${allLessons.length} 项可直接进入的内容`;
      contentHeading('想看哪一部分？','直接进入模块，或先展开目录挑选具体一课。模块之间没有解锁限制。');
      const cards=el('div',null,'directory-module-grid');
      for(const group of entries){const card=el('article',null,'directory-module-card');card.dataset.moduleId=group.id;const media=groupMedia(group);if(media){card.append(media);card.dataset.hasMedia='true';}const number=el('span',serial(group),'directory-module-number');number.setAttribute('aria-hidden','true');card.append(number,el('span',countText(group),'directory-module-count'),el('h3',group.title),el('p',group.description||''));const actions=el('div',null,'directory-module-actions');if(group.action!=null){const enter=button('进入'+group.title,()=>choose(group.action,false),'directory-primary');enter.dataset.directoryModuleOpen=group.id;actions.append(enter);}const list=button('查看具体课程',()=>selectGroup(group.id));list.dataset.directoryModuleList=group.id;actions.append(list);card.append(actions);cards.append(card);}content.append(cards);return;
    }
    const rows=results(),group=byId.get(selectedGroupId),searching=!!query.trim();
    status.textContent=searching?`搜索“${query.trim()}”：${rows.length} 项结果，范围为全部模块`:`${group.title} · ${countText(group,rows.length)}，可直接点选`;
    contentHeading(searching?'全部模块中的搜索结果':group.title,searching?'点击课程打开；需要声音时，选择“进入并播放”。':group.description);
    if(!searching&&group.action!=null){const enter=button('打开本模块首页',()=>choose(group.action,false),'directory-primary directory-open-module');enter.dataset.directoryModuleOpen=group.id;content.append(enter);}
    const list=el('div',null,'directory-lesson-list');let previousSubgroup='';
    for(const {group:lessonGroup,lesson}of rows){if(!searching&&lesson.groupTitle&&lesson.groupTitle!==previousSubgroup){list.append(el('h3',lesson.groupTitle,'directory-subgroup'));previousSubgroup=lesson.groupTitle;}const card=el('article',null,'directory-lesson');card.dataset.directoryLesson=lesson.id;const openButton=button('',()=>choose(lesson.action,false),'directory-lesson-open');openButton.setAttribute('aria-label','打开课程：'+lesson.title);openButton.disabled=lesson.action==null;openButton.append(el('small',lessonGroup.title+(lesson.groupTitle?' · '+lesson.groupTitle:''),'directory-lesson-group'),el('strong',lesson.title));if(lesson.description)openButton.append(el('span',lesson.description));card.append(openButton);
      if(lesson.hasAudio!==false&&lesson.action!=null){const play=button('进入并播放',()=>choose(lesson.action,true),'directory-lesson-play');play.setAttribute('aria-label','进入并播放：'+lesson.title);card.append(play);}list.append(card);}
    if(!rows.length)list.append(el('p','没有找到相关课程。可以换一个植物名、地区名，或清除搜索返回模块目录。','directory-empty'));content.append(list);
  }
  function isolate(){for(const sibling of container.children){if(sibling===root)continue;if(!isolated.has(sibling))isolated.set(sibling,sibling.inert);sibling.inert=true;}}
  function restore(){for(const [sibling,previous]of isolated)sibling.inert=previous;isolated.clear();}
  function open(options={}){
    if(destroyed)return false;
    if(!opened){returnFocus=document.activeElement;ownInert=root.inert;onPause?.();}
    selectedGroupId=byId.has(options.groupId)?options.groupId:null;query=typeof options.query==='string'?options.query:'';search.value=query;
    opened=true;root.hidden=false;root.inert=false;isolate();renderNavigation();renderContent();root.scrollTop=0;content.scrollTop=0;
    (query?search:heading).focus({preventScroll:true});return true;
  }
  function close({restoreFocus=true}={}){
    if(!opened)return false;opened=false;root.hidden=true;restore();root.inert=ownInert;if(restoreFocus&&returnFocus?.isConnected)returnFocus.focus?.({preventScroll:true});onClose?.();return true;
  }
  function focusable(){return [...root.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(node=>!node.disabled&&!node.hidden&&node.tabIndex!==-1&&(!node.getClientRects||node.getClientRects().length>0));}
  function keydown(event){
    if(!opened)return;
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
    if(event.key!=='Tab')return;
    event.preventDefault();event.stopPropagation();const items=focusable();if(!items.length){heading.focus();return;}const index=items.indexOf(document.activeElement),next=event.shiftKey?(index<=0?items.length-1:index-1):(index<0||index===items.length-1?0:index+1);items[next].focus();
  }
  // Window capture precedes the application's global Escape handlers. The
  // root listener is also useful on embedded hosts without a Window surface.
  globalThis.window?.addEventListener?.('keydown',keydown,true);root.addEventListener('keydown',keydown);
  return {open,close,isOpen:()=>opened,getState:()=>({open:opened,groupId:selectedGroupId,query,groupCount:entries.length,lessonCount:allLessons.length,resultCount:results().length}),destroy(){if(destroyed)return;close();destroyed=true;globalThis.window?.removeEventListener?.('keydown',keydown,true);root.removeEventListener('keydown',keydown);root.remove();}};
}
