// Course text, every recording/cue, world geography and regional lessons are
// complete in the core. Only the large statistical rows and botanical polygons
// are deferred; pending rows must never be presented as missing observations.
export function splitAtlas(data){
  const core=structuredClone(data),g=core.globalEvidence;
  const details={version:1,production:g.production.plants.map(p=>({cropId:p.cropId,records:p.records})),botanical:g.distribution.plants.map(p=>({cropId:p.cropId,records:p.records})),regions:g.distribution.regions};
  for(const p of g.production.plants)p.records=[];
  for(const p of g.distribution.plants)p.records=[];
  g.distribution.regions={...g.distribution.regions,features:[]};
  return {core,details};
}
export function hydrateAtlas(core,details){
  if(details?.version!==1||!Array.isArray(details.regions?.features))throw Error('Invalid atlas detail edition');
  const stages=[];
  for(const [rows,targets]of [[details.production,core.globalEvidence.production.plants],[details.botanical,core.globalEvidence.distribution.plants]]){
    if(!Array.isArray(rows)||rows.length!==targets.length)throw Error('Incomplete atlas detail rows');
    const by=new Map(targets.map(p=>[p.cropId,p])),seen=new Set();
    for(const row of rows){if(!by.has(row.cropId)||seen.has(row.cropId)||!Array.isArray(row.records))throw Error('Invalid atlas detail identity');seen.add(row.cropId);stages.push([by.get(row.cropId),row.records]);}
  }
  for(const [target,records]of stages)target.records=records;
  core.globalEvidence.distribution.regions=details.regions;
  return core;
}
