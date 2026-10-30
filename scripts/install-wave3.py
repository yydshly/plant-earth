"""Install the reviewed, recorded four-plant package without changing old clocks.

Usage: python scripts/install-wave3.py --audio-source PATH
The public package contains only reviewed content, public provenance and cues.
Provider receipts, credentials and temporary subtitle links are never inputs.
"""
from pathlib import Path
import argparse,copy,hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for block in iter(lambda:f.read(262144),b''):h.update(block)
 return h.hexdigest()
def add(rows,extra):
 by={r['id']:r for r in rows}
 for r in extra:
  if r['id'] in by:assert by[r['id']]==r,'Existing new-edition item differs: '+r['id']
  else:rows.append(copy.deepcopy(r));by[r['id']]=r
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--audio-source',type=Path,required=True);args=p.parse_args()
 package=read(ROOT/'sources/expansion-wave3.json');assert package['version']==1 and len(package['crops'])==4 and len(package['recordings'])==10
 d=json.loads((ROOT/'data.js').read_text(encoding='utf-8').removeprefix('window.ATLAS_DATA=').strip().removesuffix(';'))
 baseline=copy.deepcopy(d);oldIds={p['id'] for p in d['crops']};newIds={p['id'] for p in package['crops']}
 assert len(oldIds) in [140,144] and (len(oldIds)==140 or newIds<=oldIds)
 for rec in package['recordings']:
  file=rec['file'];target=(ROOT/file).resolve();source=(args.audio_source/Path(file).name).resolve()
  assert target.is_relative_to(ROOT/'audio') and source.is_relative_to(args.audio_source.resolve()) and target.suffix=='.mp3'
  assert digest(source)==package['recordingAudioSha256'][rec['id']]
  if target.exists():assert digest(target)==digest(source),'Never overwrite different audio'
  else:shutil.copy2(source,target)
 add(d['crops'],package['crops']);add(d['environment']['profiles'],package['profiles']);add(d['placements']['placements'],package['placements'])
 existingTaxa={p['cropId']:p for p in d['globalEvidence']['distribution']['plants']}
 for taxon in package['botanical']['plants']:
  if taxon['cropId'] in existingTaxa:assert existingTaxa[taxon['cropId']]==taxon
  else:d['globalEvidence']['distribution']['plants'].append(copy.deepcopy(taxon))
 add(d['regionalEnvironment']['regions'],package['regions'])
 regionPack=d['regionalEnvironment'];regionPack.setdefault('cropToRegions',{});regionPack.setdefault('cropToRegion',{})
 for r in package['regions']:
  for sid in r['cropIds']:regionPack['cropToRegions'][sid]=[r['id']];regionPack['cropToRegion'][sid]=r['id']
 packs={'main':(d['chapters'],d['audioManifest']),'global':(d['globalEvidence']['narration']['chapters'],d['globalEvidence']['narration']['manifest']),'bio':(d['biodiversityNarration']['chapters'],d['biodiversityNarration']['manifest']),'regional':(d['regionalNarration']['chapters'],d['regionalNarration']['manifest'])}
 for replacement in package['introReplacements']:
  chapters,manifest=packs[replacement['pack']];oldId=replacement['oldId'];c=replacement['chapter']
  for i,old in enumerate(chapters):
   if old['id']==oldId:
    assert hashlib.sha256(old['text'].encode()).hexdigest()==c['previousEdition']['textHash'];chapters[i]=copy.deepcopy(c);break
  else:assert any(x['id']==c['id'] for x in chapters)
  manifest['chapters']=[r for r in manifest['chapters'] if r['id']!=oldId]
 for key,field in [('main','mainChapters'),('global','globalChapters'),('bio','bioChapters'),('regional','regionalChapters')]:add(packs[key][0],package[field])
 recorded={r['id']:r for r in package['recordings']}
 for key,links in package['audioLinks'].items():
  chapters,manifest=packs[key];by={c['id']:c for c in chapters}
  for cid,audioId in links.items():
   rec=copy.deepcopy(recorded[audioId]);rec['id']=cid;rec['cropId']=by[cid].get('cropId',by[cid].get('crop'))
   if key=='regional':rec.update(classId=by[cid]['classId'],regionId=by[cid]['regionId'])
   assert ''.join(q['text'] for q in rec['cues'])==by[cid]['text'];add(manifest['chapters'],[rec])
  manifest['totalDuration']=round(sum(r['duration'] for r in manifest['chapters']),3)
 for photo in package['photos']:
  existing=next((r for r in d['plantPhotos']['photos'] if r['cropId']==photo['cropId']),None)
  if existing:
   assert {k:v for k,v in existing.items() if k not in ['credit','creditEvidenceUrl']}=={k:v for k,v in photo.items() if k not in ['credit','creditEvidenceUrl']}
   existing.update(photo)
  else:d['plantPhotos']['photos'].append(photo)
 d['plantPhotos']['metadata'].update(count=len(d['plantPhotos']['photos']),checkedAt=package['checkedAt'])
 cat=d['catalogue'];cat.update(version=5,checkedAt=package['checkedAt'],entryCount=len(d['crops']),biodiversityCount=sum(c['collection']=='biodiversity' for c in d['crops']),referenceOnlyCount=sum(c['mapModel']=='reference-only' for c in d['crops']),wave3Ids=sorted(newIds))
 d['environment']['metadata'].update(checkedAt=package['checkedAt'],scope=f"{len(d['crops'])}个代表植物条目的环境解释；包含有来源的定性机制，不是全部植物名录、现场地块资料或产量预测。")
 pm=d['placements']['metadata'];pm.update(checkedAt=package['checkedAt'],count=len(d['placements']['placements']),sourceBackedRepresentativeRegions=len(d['placements']['placements'])-pm['legacyTeachingRegions'],meaning='区域中心示意。教学锚点、文献地区与观测记录分别说明；不是植株坐标、连续分布或密度。')
 rm=regionPack['metadata'];rm.update(version=3,expandedAt=package['checkedAt'],regionCount=len(regionPack['regions']),cropCount=len(d['crops']),scope=f"{len(d['crops'])}个代表植物关联的{len(regionPack['regions'])}个地区教学案例，包含农业、森林、草原、荒漠、海岸、湿地、山地、苔原与城市；不是全球逐地普查。",newRegionCount=len(regionPack['regions'])-rm['legacyRegionCount'],soilPolicy='81处可用表土模型，4处海水/潮间带/附生案例明确不适用；新增4处接入地区根区文献并保留表土数值缺项。独立邻近取样格列出坐标，气候点不移动。')
 continents=[r['continent'] for r in regionPack['regions']];rm['coverageByContinent']={k:continents.count(k) for k in sorted(set(continents))}
 knownEvidence={r['id'] for r in d['evidence']['crops']}
 for c in package['crops']:
  if c['id'] not in knownEvidence:d['evidence']['crops'].append({'id':c['id'],'status':'qualitative-reference','sourceUrl':c['taxonomy']['sourceUrl'],'notes':'Evidence-led environment explanation; no new global suitability model or numeric optimal range.'})
 # Preserve every prior identity/value except the two explicitly rerecorded
 # introduction chapters and their matching manifest records.
 for field in ['crops']:
  old={p['id']:p for p in baseline[field] if p['id'] not in newIds};new={p['id']:p for p in d[field]};assert all(new[k]==v for k,v in old.items())
 for key in ['world','rivers','climate','classroomNarration']:assert d[key]==baseline[key]
 for key,(chapters,manifest) in packs.items():
  before={'main':(baseline['chapters'],baseline['audioManifest']),'global':(baseline['globalEvidence']['narration']['chapters'],baseline['globalEvidence']['narration']['manifest']),'bio':(baseline['biodiversityNarration']['chapters'],baseline['biodiversityNarration']['manifest']),'regional':(baseline['regionalNarration']['chapters'],baseline['regionalNarration']['manifest'])}[key]
  replaced={r['oldId'] for r in package['introReplacements'] if r['pack']==key}
  for rows,oldrows in [(chapters,before[0]),(manifest['chapters'],before[1]['chapters'])]:
   by={r['id']:r for r in rows};assert all(by[r['id']]==r for r in oldrows if r['id'] not in replaced)
 (ROOT/'data.js').write_text('window.ATLAS_DATA='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8',newline='\n')
 source="// Four reviewed ecosystem contrasts; public evidence is in sources/expansion-wave3.json.\nexport const WAVE3_PATH="+json.dumps(package['path'],ensure_ascii=False)+";\nexport const WAVE3_COURSES="+json.dumps(package['courses'],ensure_ascii=False,indent=2)+";\n"
 (ROOT/'src/biodiversity-wave3.js').write_text(source,encoding='utf-8')
 sourcePath=ROOT/'src/biodiversity-content.js';source=sourcePath.read_text(encoding='utf-8')
 if "from './biodiversity-wave3.js'" not in source:
  source="import {WAVE3_PATH,WAVE3_COURSES} from './biodiversity-wave3.js';\n"+source
  source=source.replace('export const BIODIVERSITY_PATHS=freeze([','export const BIODIVERSITY_PATHS=freeze([WAVE3_PATH,',1).replace('export const BIODIVERSITY_COURSES=freeze([','export const BIODIVERSITY_COURSES=freeze([...WAVE3_COURSES,',1)
  sourcePath.write_text(source,encoding='utf-8')
 spec=read(ROOT/'site-files.json');active={r['file'] for _,m in packs.values() for r in m['chapters']};active|={r['file'] for r in d['classroomNarration']['manifest']['chapters']}
 spec.update(audioCount=len(active),audioReferenceCount=sum(len(m['chapters']) for _,m in packs.values())+len(d['classroomNarration']['manifest']['chapters']),compatibilityAudio=package['compatibilityAudio'],plantCount=len(d['crops']),regionCount=len(regionPack['regions']),imageCount=len(d['plantPhotos']['photos'])+1)
 spec['files']=sorted(set(spec['files'])|active|{p['file'] for p in package['photos']}|{'sources/expansion-wave3.json'})
 save(ROOT/'site-files.json',spec)
 print(json.dumps({'installed':True,'plants':spec['plantCount'],'bioCourses':cat['biodiversityCount'],'regions':spec['regionCount'],'activeAudioFiles':spec['audioCount'],'narrationReferences':spec['audioReferenceCount'],'photos':len(d['plantPhotos']['photos']),'originalContentPreservedExceptTwoReviewedIntroEditions':True}))
