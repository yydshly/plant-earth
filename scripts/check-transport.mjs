import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
import {encodeAtlas,decodeAtlas} from './atlas-codec.mjs';
import {timeAtCharacter,captionAtTime} from '../src/narration-clock.js';
const source=await readFile(new URL('../data.js',import.meta.url),'utf8');
const data=JSON.parse(source.replace(/^window\.ATLAS_DATA=/,'').replace(/;\s*$/,''));
const encoded=JSON.stringify(encodeAtlas(data)),compressed=gzipSync(encoded,{level:9});
const restored=decodeAtlas(JSON.parse(gunzipSync(compressed).toString('utf8')));
assert.deepStrictEqual(restored,data,'Every original field and value must survive the network representation');
let clockChecks=0,recordings=0;
const packs=d=>[[d.chapters,d.audioManifest],[d.globalEvidence.narration.chapters,d.globalEvidence.narration.manifest],...[d.classroomNarration,d.biodiversityNarration,d.regionalNarration].map(p=>[p.chapters,p.manifest])];
for(const [packIndex,[chapters,manifest]]of packs(data).entries()){
 const [nextChapters,nextManifest]=packs(restored)[packIndex];
 for(const [index,chapter]of chapters.entries()){
  const record=manifest.chapters.find(r=>r.id===chapter.id),next=nextChapters[index],nextRecord=nextManifest.chapters.find(r=>r.id===next.id);recordings++;
  let offset=0;
  for(const beat of chapter.beats){
   const endOffset=offset+beat.text.length,t=timeAtCharacter(chapter,record,offset);
   assert.equal(timeAtCharacter(next,nextRecord,offset),t);
   assert.equal(captionAtTime(next,nextRecord,t,{startOffset:offset,endOffset}),captionAtTime(chapter,record,t,{startOffset:offset,endOffset}));
   offset=endOffset;clockChecks++;
  }
 }
}
const cases=[null,true,false,0,-0,3.141592653589793,'银杏\n水下光',[0,1,2,-1],{a:[2],b:[1,0],c:JSON.parse('{"__proto__":{"safe":true},"k":0}'),d:['é','é']}];
for(const test of cases){const ordinary=Array.isArray(test)||test===null||typeof test!=='object'?test:Object.fromEntries(Object.entries(test));assert.deepStrictEqual(decodeAtlas(JSON.parse(JSON.stringify(encodeAtlas(ordinary)))),ordinary);}
assert.throws(()=>decodeAtlas({version:9}),/Unsupported/);
assert.throws(()=>decodeAtlas({version:1,strings:[],shapes:[],root:[1,9]}),/Invalid/);
console.log(JSON.stringify({passed:true,sourceBytes:Buffer.byteLength(source),packedJsonBytes:Buffer.byteLength(encoded),gzipBytes:compressed.length,sourceGzipBytes:gzipSync(source,{level:6}).length,allFieldsDeepEqual:true,recordings,clockChecks}));
