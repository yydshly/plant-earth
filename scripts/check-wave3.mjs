import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {BIODIVERSITY_PATHS,BIODIVERSITY_COURSES} from '../src/biodiversity-content.js';
const root=new URL('../',import.meta.url),read=async p=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const d=JSON.parse((await readFile(new URL('data.js',root),'utf8')).replace(/^window\.ATLAS_DATA=/,'').replace(/;\s*$/,'')),p=await read('sources/expansion-wave3.json');
const names=new Map(d.crops.map(c=>[c.id,c])),courses=new Map(BIODIVERSITY_COURSES.map(c=>[c.id,c])),regions=new Map(d.regionalEnvironment.regions.map(r=>[r.id,r]));
assert.equal(names.size,d.catalogue.entryCount);assert.equal(courses.size,d.catalogue.biodiversityCount);
assert.equal(d.regionalEnvironment.metadata.regionCount,regions.size);assert.equal(d.regionalEnvironment.metadata.cropCount,names.size);
assert.deepEqual(new Set(BIODIVERSITY_PATHS.flatMap(path=>path.courseIds)),new Set(courses.keys()));
assert.equal(BIODIVERSITY_PATHS.flatMap(path=>path.courseIds).length,courses.size,'Each lesson appears in one teaching route');
for(const c of p.crops){
 assert.deepEqual(names.get(c.id),c);const lesson=courses.get(c.id),region=regions.get(lesson.regionId);
 assert(region&&region.climate.monthly.length===12&&region.climate.status==='available');
 const u=new URL(region.climate.sourceUrl);assert.equal(Number(u.searchParams.get('latitude')),region.lat);assert.equal(Number(u.searchParams.get('longitude')),region.lon);
 assert.equal(region.soil.status,'documented');assert.equal(region.soil.ph,null);assert.equal(region.soil.sandPct,null);assert.equal(region.soil.clayPct,null);assert(region.soil.summary&&region.soil.sourceUrl);
 assert(region.water.surfaceWaterSample&&Number.isFinite(region.water.surfaceWaterSample.occurrencePct));
 const points=d.placements.placements.filter(point=>point.cropId===c.id);assert.equal(points.length,1,'Only the recorded regional context may be a narrated marker');
 const chapter=d.chapters.find(x=>x.id===c.id);for(const point of points){const beat=chapter.beats[point.beatIndex];assert.equal(beat.lon,point.lon);assert.equal(beat.lat,point.lat);}
 const native=d.globalEvidence.distribution.plants.find(x=>x.cropId===c.id);assert.equal(native.nameMatch,'exact-accepted');assert(native.records.length>0);
 const photo=d.plantPhotos.photos.find(x=>x.cropId===c.id);assert(photo&&photo.credit&&photo.sourceUrl&&/^CC BY(?:-SA)? /.test(photo.license));
 for(const b of lesson.steps)assert.equal(b.action.regionId,region.id);
}
assert(courses.get('camphor').sourceDisagreement&&d.globalEvidence.distribution.plants.find(x=>x.cropId==='camphor').sourceDisagreement);
for(const r of p.recordings){
 const bytes=await readFile(new URL(r.file,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.recordingAudioSha256[r.id]);
 let offset=0,end=0;for(const cue of r.cues){assert.equal(cue.textStart,offset);offset+=cue.text.length;assert.equal(cue.textEnd,offset);assert(cue.start>=end-.01&&cue.end>cue.start&&cue.end<=r.duration+.1);end=cue.end;}
 assert(Math.abs(end-r.duration)<.5);
}
for(const replacement of p.introReplacements){const chapters=replacement.pack==='main'?d.chapters:d.globalEvidence.narration.chapters;assert(!chapters.some(c=>c.id===replacement.oldId));assert(chapters.some(c=>c.id===replacement.chapter.id));assert(!replacement.chapter.text.includes('一百四十个代表条目'));}
console.log(JSON.stringify({wave3Passed:true,plants:names.size,bioCourses:courses.size,regions:regions.size,uniqueNewRecordings:p.recordings.length,newLicensedPhotos:p.photos.length,narratedRegionsMatchCoordinates:true,soilMissingValuesPreserved:true,sourceDisagreementVisible:true}));
