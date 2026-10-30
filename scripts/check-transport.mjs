import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
import {encodeAtlas,decodeAtlas} from './atlas-codec.mjs';
import {timeAtCharacter,captionAtTime} from '../src/narration-clock.js';
import {splitAtlas,hydrateAtlas} from '../src/atlas-hydration.js';
import {decompress} from '../src/vendor/fzstd/esm/index.mjs';
const source=await readFile(new URL('../data.js',import.meta.url),'utf8');
const data=JSON.parse(source.replace(/^window\.ATLAS_DATA=/,'').replace(/;\s*$/,''));
const encoded=JSON.stringify(encodeAtlas(data)),compressed=gzipSync(encoded,{level:9});
assert.equal(compressed[3]&2,0);compressed[9]=255;
const restored=decodeAtlas(JSON.parse(gunzipSync(compressed).toString('utf8')));
assert.deepStrictEqual(restored,data,'Every original field and value must survive the network representation');
const {core,details}=splitAtlas(data),roundTrip=v=>decodeAtlas(JSON.parse(gunzipSync(gzipSync(JSON.stringify(encodeAtlas(v)))).toString('utf8')));
const initial=roundTrip(core);
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const bootBytes=Buffer.from(html.match(/<script id="atlas-core" type="application\/octet-stream">(.*?)<\/script>/s)[1],'base64');
const boot=JSON.parse(new TextDecoder().decode(decompress(bootBytes)));
assert.deepStrictEqual(decodeAtlas(boot.core),initial,'The browser boot decoder must preserve all initial globe, lesson and clock data');
assert.equal(boot.app,await readFile(new URL('../app.js',import.meta.url),'utf8'),'Boot code must equal the tested compatibility bundle');
assert.deepStrictEqual(hydrateAtlas(structuredClone(initial),roundTrip(details)),data,'Deferred rows and polygons must restore the complete canonical edition');
assert.throws(()=>hydrateAtlas(structuredClone(initial),{version:9}),/Invalid/);
let clockChecks=0,recordings=0;
const packs=d=>[[d.chapters,d.audioManifest],[d.globalEvidence.narration.chapters,d.globalEvidence.narration.manifest],...[d.classroomNarration,d.biodiversityNarration,d.regionalNarration].map(p=>[p.chapters,p.manifest])];
for(const [packIndex,[chapters,manifest]]of packs(data).entries()){
 const [nextChapters,nextManifest]=packs(initial)[packIndex];
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
