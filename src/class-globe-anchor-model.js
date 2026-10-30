const finite=value=>typeof value==='number'&&Number.isFinite(value);
const validPoint=p=>p&&finite(p.lon)&&finite(p.lat)&&p.lon>=-180&&p.lon<=180&&p.lat>=-90&&p.lat<=90;
const list=value=>Array.isArray(value)?value:[];
const radians=value=>value*Math.PI/180;
function distance(a,b){const lon=radians(a.lon-b.lon),latA=radians(a.lat),latB=radians(b.lat);return Math.acos(Math.max(-1,Math.min(1,Math.sin(latA)*Math.sin(latB)+Math.cos(latA)*Math.cos(latB)*Math.cos(lon))));}
const coordinateMeaning='已有来源地区内的教学定位，不是农田、标本或植株观测坐标。';
const cropNote=(crop,scene)=>String(scene?.representativeNotes?.[crop?.id]||crop?.needs||crop?.limits||'查看该植物的环境资料。').slice(0,72);

function placementLabel(point,crop){
  if(point.evidenceType==='cultivation_region')return '有据栽培地区示例';
  if(point.evidenceType==='native_region')return crop?.cultivarGroup?'物种级原生资料，非栽培群范围':'物种原生区域示例';
  if(point.evidenceType==='introduced_region')return crop?.cultivarGroup?'物种级引入资料，非栽培群范围':'引入野生区域示例';
  return '环境教学地区示例';
}

/**
 * Use only existing, sourced catalogue anchors. A miniature names the lesson's
 * regional example; it never upgrades an editorial coordinate to a field
 * observation or treats three comparison plants as a local community.
 */
export function resolveClassGlobeAnchors(scene,data={},options={}){
  if(!scene||!['agriculture','biodiversity'].includes(scene.scope))return [];
  const crops=new Map(list(data.crops).map(c=>[c.id,c])),placements=list(data.placements?.placements),regions=list(data.regionalEnvironment?.regions);
  const ids=[...new Set(scene.scope==='biodiversity'?[scene.cropId]:list(scene.representativeIds))].filter(id=>crops.has(id)).slice(0,3);
  const active=ids.includes(options.activeCropId)?options.activeCropId:ids[0];
  if(scene.scope==='biodiversity'){
    const crop=crops.get(ids[0]);if(!crop)return [];
    const region=regions.find(r=>r.id===scene.regionId&&validPoint(r)&&list(r.cropIds).includes(crop.id));
    if(region){
      return [{id:'course-region-'+region.id+'-'+crop.id,cropId:crop.id,name:crop.name,lon:region.lon,lat:region.lat,region:region.name,regionId:region.id,placementId:null,evidenceType:'environment_sample',evidenceLabel:'环境教学采样，非植株观测',sourceUrl:region.climate?.sourceUrl||region.soil?.sourceUrl||crop.sources?.[0]||null,sourceScope:region.pointMeaning||'地区气候、土壤和水源教学背景；不证明采样点有这一植物。',note:cropNote(crop,scene),coordinateMeaning:'环境教学采样位置，不是植物观测点；模型不表示该点实际存在植株。',active:true}];
    }
  }
  // Keep comparison locations stable when active plant or spoken step changes.
  // Prefer a nearby *existing* alternative where it makes two examples easier
  // to compare, without changing either coordinate or evidence identity.
  let reference=null;const chosen=[];
  for(const id of ids){
    const crop=crops.get(id),candidates=placements.filter(p=>p.cropId===id&&validPoint(p)&&typeof p.sourceUrl==='string'&&p.sourceUrl.length>0);
    if(!candidates.length)continue;
    const origin=reference||candidates[0];
    candidates.sort((a,b)=>{
      const duplicate=p=>chosen.some(c=>distance(p,c)<radians(1))?Math.PI*2:0;
      return distance(a,origin)+duplicate(a)-distance(b,origin)-duplicate(b);
    });
    const point=candidates[0];if(!reference)reference=point;
    chosen.push({id:'course-anchor-'+point.id,cropId:id,name:crop.name,lon:point.lon,lat:point.lat,region:point.region||point.label||crop.name,placementId:point.id,regionId:null,evidenceType:point.evidenceType||'teaching_region',evidenceLabel:scene.referenceOnly?'教学地区示例 · 非完整分布':placementLabel(point,crop),referenceOnly:scene.referenceOnly===true,sourceUrl:point.sourceUrl,sourceScope:point.sourceScope||coordinateMeaning,note:cropNote(crop,scene),coordinateMeaning,active:id===active});
  }
  return chosen;
}

/** A suggested view centre only; positions remain at their source anchors. */
export function classGlobeAnchorFocus(anchors=[]){
  const points=anchors.filter(validPoint);if(!points.length)return null;
  let x=0,y=0,z=0;for(const p of points){const lon=radians(p.lon),lat=radians(p.lat);x+=Math.cos(lat)*Math.cos(lon);y+=Math.cos(lat)*Math.sin(lon);z+=Math.sin(lat);}
  if(Math.hypot(x,y,z)<1e-5)return {lon:points[0].lon,lat:points[0].lat};
  return {lon:Math.atan2(y,x)*180/Math.PI,lat:Math.atan2(z,Math.hypot(x,y))*180/Math.PI};
}
