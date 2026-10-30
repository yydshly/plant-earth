const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
export function createPlantCatalog({data,selectPlant,showOnGlobe}){
  const plants=data.crops,dialog=el('dialog',null,'plant-catalog');dialog.id='plant-catalog';dialog.setAttribute('aria-labelledby','catalog-title');
  dialog.innerHTML=`<div class="catalog-heading"><div><span class="eyebrow">从农作物，走进植物世界</span><h2 id="catalog-title">植物图鉴</h2></div><button id="catalog-close" aria-label="关闭植物图鉴">关闭 ✕</button></div><p class="catalog-intro">用途不等于分类。沿着类群、形态和环境寻找植物，听它为何生长在这里。</p><div class="catalog-controls"><label class="catalog-query">查找植物<input id="catalog-search" type="search" placeholder="中文名、学名或异名" autocomplete="off"></label><label>内容分区<select id="catalog-collection"><option value="">全部代表植物</option><option value="agriculture">农业与园艺</option><option value="biodiversity">植物多样性</option></select></label><label>植物类群<select id="catalog-clade"><option value="">全部类群</option></select></label><label>生长形态<select id="catalog-form"><option value="">全部形态</option></select></label><label>生境<select id="catalog-habitat"><option value="">全部生境</option></select></label><label>用途<select id="catalog-use"><option value="">全部用途</option></select></label></div><div class="catalog-result-heading"><span id="catalog-result-count" aria-live="polite"></span><button id="catalog-reset">重置筛选</button></div><div id="catalog-results" class="catalog-results"></div><footer class="catalog-footer"><p>这里是代表条目，不是全部植物名录。原生地区、栽培地区与气候候选分开表达；模型位置是区域示意。</p><button id="catalog-show" class="primary">在地球上看这些植物</button></footer>`;
  document.body.append(dialog);const $=id=>document.getElementById(id),fields={collection:'catalog-collection',clade:'catalog-clade',form:'catalog-form',habitat:'catalog-habitat',use:'catalog-use'};let matches=[...plants],restoreFocus=null;
  const unique=get=>[...new Set(plants.flatMap(get).filter(Boolean))];
  for(const [id,values] of [['catalog-clade',unique(p=>p.taxonomy?.clade)],['catalog-form',unique(p=>p.lifeForm)],['catalog-habitat',unique(p=>p.habitats||[])],['catalog-use',unique(p=>p.uses||[])]])for(const value of values){const o=el('option',value);o.value=value;$(id).append(o);}
  const selected=()=>Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,$(id).value]));
  function close(){dialog.close();restoreFocus?.focus({preventScroll:true});}
  function render(){
    const query=$('catalog-search').value.trim().toLocaleLowerCase(),f=selected();
    matches=plants.filter(p=>(!query||[p.name,p.latin,...(p.synonyms||[])].join(' ').toLocaleLowerCase().includes(query))&&(!f.collection||p.collection===f.collection)&&(!f.clade||p.taxonomy?.clade===f.clade)&&(!f.form||p.lifeForm===f.form)&&(!f.habitat||p.habitats?.includes(f.habitat))&&(!f.use||p.uses?.includes(f.use)));
    $('catalog-result-count').textContent=`${matches.length} / ${plants.length} 个代表条目`;$('catalog-show').textContent=`在地球上看这 ${matches.length} 个条目`;$('catalog-show').disabled=!matches.length;
    const list=$('catalog-results');list.replaceChildren();if(!matches.length){list.append(el('p','没有匹配的植物。试着减少筛选条件，或搜索另一学名。','catalog-empty'));return;}
    for(const p of matches){const b=el('button',null,'catalog-card');b.dataset.plant=p.id;const heading=el('div',null,'catalog-card-heading');heading.append(el('strong',p.name),el('span',p.taxonomy?.clade||p.group));b.append(heading,el('i',p.latin),el('p',p.needs),el('span',[p.lifeForm,...(p.habitats||[]).slice(0,2)].filter(Boolean).join(' · '),'catalog-tags'));b.onclick=()=>{close();selectPlant(p.id);};list.append(b);}
  }
  for(const id of Object.values(fields))$(id).onchange=render;$('catalog-search').oninput=render;
  $('catalog-close').onclick=close;$('catalog-reset').onclick=()=>{for(const id of Object.values(fields))$(id).value='';$('catalog-search').value='';render();};
  $('catalog-show').onclick=()=>{const ids=matches.map(p=>p.id),f=selected(),label=Object.values(f).filter(Boolean).map(v=>({agriculture:'农业与园艺',biodiversity:'植物多样性'}[v]||v)).join(' · ')||'全部代表植物';close();showOnGlobe(ids,label);};
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)close();}});
  render();return {open(){restoreFocus=document.activeElement;dialog.showModal();$('catalog-search').focus();},getState:()=>({open:dialog.open,filters:selected(),matches:matches.map(p=>p.id)})};
}
