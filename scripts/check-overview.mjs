import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createProjectSummary} from '../src/project-overview-model.js';
import {createCourseDirectoryGroups} from '../src/course-directory-model.js';
import {splitAtlas} from '../src/atlas-hydration.js';
const root=new URL('../',import.meta.url);
const text=await readFile(new URL('data.js',root),'utf8'),data=JSON.parse(text.replace(/^window\.ATLAS_DATA=/,'').replace(/;\s*$/,''));
const summary=createProjectSummary(data),groups=createCourseDirectoryGroups(data),html=await readFile(new URL('about.html',root),'utf8');
assert.deepEqual(createProjectSummary(splitAtlas(data).core),summary,'Pending map details must not change published scope counts');
assert.equal(summary.entries,data.catalogue.entryCount);assert.equal(summary.agriculture,data.catalogue.agricultureCount);assert.equal(summary.biodiversity,data.catalogue.biodiversityCount);
assert.equal(summary.soilNumeric+summary.soilNotApplicable+summary.soilDocumented,summary.regions);
const spec=JSON.parse(await readFile(new URL('site-files.json',root),'utf8'));
assert.equal(summary.recordings,spec.audioCount);assert.equal(summary.photos,spec.imageCount-1);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Section anchors must be unique');
const links=[...html.matchAll(/\bhref="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
for(const link of links){
  if(link.startsWith('#')){assert(ids.includes(link.slice(1)),link);continue;}
  if(link.startsWith('https:'))continue;
  const url=new URL(link,'https://example.test/plant-earth/about.html');assert(url.pathname.startsWith('/plant-earth/'));
  const path=url.pathname.slice('/plant-earth/'.length);assert(spec.files.includes(path),'Local link must be part of the deployed artifact: '+path);
  await readFile(new URL(path,root));
  if(url.searchParams.get('mode')==='directory'){const id=url.searchParams.get('module');if(id)assert(groups.some(g=>g.id===id),id);}
}
for(const group of groups)assert(links.includes('index.html?mode=directory&module='+group.id));
for(const file of ['learning-feedback.yml','data-correction.yml']){assert(links.includes('https://github.com/yydshly/plant-earth/issues/new?template='+file));await readFile(new URL('.github/ISSUE_TEMPLATE/'+file,root));}
assert(!/<script\b|<audio\b|<video\b/i.test(html),'The overview must work without initializing players or the globe');
assert(html.includes('尚未达成验收')&&html.includes('仅有文献根区解释'),'Planned acceptance and missing numeric data must remain explicit');
console.log(JSON.stringify({overviewPassed:true,summary,moduleLinks:groups.length,anchors:ids.length,staticBytes:Buffer.byteLength(html),worksWithoutJavaScript:true,projectSubpathLinks:true}));
