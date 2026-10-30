// Catalog entries include cultivated groups and uses of the same species.
// Dataset coverage is counted separately from the number of catalog entries.
export function catalogueSummary(plants, production, botanical, profiles){
  const rows=Array.from(plants),productionRows=Array.from(production),botanicalRows=Array.from(botanical);
  return {entries:rows.length,agriculture:rows.filter(p=>p.collection==='agriculture').length,biodiversity:rows.filter(p=>p.collection!=='agriculture').length,productionEntries:productionRows.length,commodities:new Set(productionRows.map(p=>String(p.itemCode))).size,botanicalEntries:botanicalRows.filter(p=>p.status==='available').length,environmentEntries:Array.from(profiles).length};
}

// These are crop browsing categories, not a plant taxonomy or a change to the
// authored chapter groups. A crop may serve several explicitly recorded uses.
const AGRICULTURE_GROUPS=[
  ['谷物与杂粮','rice wheat maize barley oats rye sorghum foxtail pearl buckwheat quinoa teff fonio proso amaranth'],
  ['豆类','soybean peanut chickpea lentil cowpea pea mungbean adzuki pigeonpea faba commonbean lupin'],
  ['薯根作物','potato cassava sweetpotato waterchestnut taro yam yacon jerusalemartichoke'],
  ['蔬菜','tomato pepper eggplant cucumber pumpkin cabbage carrot onion garlic lettuce spinach pea commonbean okra broccoli cauliflower beetroot radish'],
  ['坚果','almond walnut cashew pistachio hazelnut chestnut'],
  ['水果','banana coconut grape olive citrus apple date watermelon melon mango pineapple avocado pear peach plum cherry apricot strawberry blueberry raspberry papaya guava'],
  ['油料','soybean peanut sunflower rapeseed oilpalm coconut olive sesame flax'],
  ['糖料','sugarcane sugarbeet'],
  ['饮料与可可','tea arabica robusta cocoa'],
  ['香辛料','blackpepper ginger cinnamon vanilla clove'],
  ['纤维','cotton flax sisal jute'],
  ['工业原料','rubber'],
  ['饲草','alfalfa']
].map(([name,ids])=>({name,ids:new Set(ids.split(' '))}));
const USE_GROUPS=new Map([['油料','油料'],['纤维','纤维'],['饲草','饲草'],['香辛料','香辛料'],['调味','香辛料'],['工业原料','工业原料'],['饮料','饮料与可可']]);
export function catalogueBrowseGroups(plant){
  if(plant.collection!=='agriculture')return [plant.group||'其他'];
  const groups=AGRICULTURE_GROUPS.filter(g=>g.ids.has(plant.id)).map(g=>g.name);
  for(const use of [...(plant.uses||[]),...(plant.useTags||[])]){const category=USE_GROUPS.get(use);if(category&&!groups.includes(category))groups.push(category);}
  if(!groups.length){const group=plant.group||'其他';groups.push(/谷物|杂粮/.test(group)?'谷物与杂粮':/薯/.test(group)?'薯根作物':/果树|水果|瓜果/.test(group)?'水果':group);}
  return groups;
}

export function catalogueGroups(plants, collection=''){
  const groups=new Map();
  for(const p of plants){if(collection&&p.collection!==collection)continue;for(const key of catalogueBrowseGroups(p))groups.set(key,(groups.get(key)||0)+1);}
  return [...groups].map(([name,count])=>({name,count}));
}

export function filterCatalogue(plants,{collection='',group='',query=''}={}){
  const term=query.trim().toLocaleLowerCase();
  return Array.from(plants).filter(p=>(!collection||p.collection===collection)&&(!group||catalogueBrowseGroups(p).includes(group))&&(!term||[p.name,p.latin,p.group,...catalogueBrowseGroups(p),...(p.synonyms||[]),...(p.uses||[]),...(p.useTags||[])].some(value=>String(value||'').toLocaleLowerCase().includes(term))));
}
