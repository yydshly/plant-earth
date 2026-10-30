// Scope comes from the published catalogue, never from copied marketing counts.
export function createProjectSummary(data={}){
  const plants=data.crops||[],ids=new Set(plants.map(p=>p.id)),regions=data.regionalEnvironment?.regions||[];
  const production=data.globalEvidence?.production?.plants||[],botanical=data.globalEvidence?.distribution?.plants||[];
  const packs=[data.audioManifest,data.globalEvidence?.narration?.manifest,data.classroomNarration?.manifest,data.biodiversityNarration?.manifest,data.regionalNarration?.manifest];
  const soil=status=>regions.filter(r=>r.soil?.status===status);
  return {
    entries:plants.length,agriculture:plants.filter(p=>p.collection==='agriculture').length,
    biodiversity:data.biodiversityNarration?.chapters?.length||0,regions:regions.length,
    recordings:new Set(packs.flatMap(p=>(p?.chapters||[]).map(r=>r.file))).size,
    photos:new Set((data.plantPhotos?.photos||[]).filter(p=>ids.has(p.cropId)).map(p=>p.cropId)).size,
    production:production.length,botanical:botanical.filter(p=>p.status==='available').length,
    botanicalUnavailable:botanical.filter(p=>p.status!=='available').map(p=>plants.find(c=>c.id===p.cropId)?.name||p.cropId),
    soilNumeric:soil('available').length,soilNotApplicable:soil('not-applicable').length,
    soilDocumented:soil('documented').length,soilDocumentedNames:soil('documented').map(r=>r.name),
    climatePeriods:[...new Set(regions.map(r=>r.climate?.period).filter(Boolean))]
  };
}
