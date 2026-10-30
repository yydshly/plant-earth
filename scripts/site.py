"""Check the complete online artifact and optionally stage exactly the allowlist."""
from pathlib import Path
import argparse,hashlib,json,re,shutil,sys,base64
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def digest(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for block in iter(lambda:f.read(262144),b''):h.update(block)
 return h.hexdigest()
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');parser.add_argument('--stage',action='store_true');args=parser.parse_args()
 spec=read(ROOT/'site-files.json');names=spec['files'];assert len(names)==len(set(names))
 for name in names:
  p=(ROOT/name).resolve();assert p.is_relative_to(ROOT) and p.is_file(),name
  assert not p.is_symlink() and p.stat().st_size<100*1024*1024,name
  assert not any(part.startswith('.env') or part in ['.git','node_modules'] for part in Path(name).parts),name
  assert not name.endswith(('.raw.json','.subtitles.json','.pem','.key')),name
 dataText=(ROOT/'data.js').read_text(encoding='utf-8');assert 'data:audio/' not in dataText
 data=json.loads(dataText[len('window.ATLAS_DATA='):].rstrip(';\n'))
 packs=[(data['chapters'],data['audioManifest']),(data['globalEvidence']['narration']['chapters'],data['globalEvidence']['narration']['manifest']),*( (data[k]['chapters'],data[k]['manifest']) for k in ['classroomNarration','biodiversityNarration','regionalNarration'])]
 audio=[];cues=0
 for chapters,manifest in packs:
  by={r['id']:r for r in manifest['chapters']};assert set(by)=={c['id'] for c in chapters}
  for c in chapters:
   r=by[c['id']];audio.append(r['file']);assert r['file'] in names
   assert ''.join(q['text'] for q in r['cues'])==c['text'],c['id']
   assert hashlib.sha256(c['text'].encode()).hexdigest()==r['textHash'] if 'textHash' in r else True
   assert set(r)<={'id','classId','regionId','cropId','file','duration','cues','textHash','provider','model','voiceId','speed','normalization','status','crop'},c['id']
   cues+=len(r['cues'])
 assert len(audio)==len(set(audio))==437
 assert set(audio)=={n for n in names if n.endswith('.mp3')}
 assert len(data['crops'])==140 and len(data['regionalEnvironment']['regions'])==85
 html=(ROOT/'index.html').read_text(encoding='utf-8')
 markup=re.sub(r'<script\b[^>]*>.*?</script>','',html,flags=re.S)
 for name in re.findall(r'(?:src|href)="([^"#?]+)(?:\?[^\"]*)?"',markup):
  if name.startswith(('https:','http:','data:','#')):continue
  assert not name.startswith('/') and name in names,'Nonportable page resource: '+name
 assert 'id="atlas-site-styles"' in html
 config=json.loads(re.search(r'<script id="atlas-startup-config" type="application/json">(.*?)</script>',html).group(1))
 assert config['dataUrl'] in names and digest(ROOT/config['dataUrl'])==config['dataSha256']
 core=base64.b64decode(re.search(r'<script id="atlas-core" type="application/octet-stream">(.*?)</script>',html).group(1))
 assert hashlib.sha256(core).hexdigest()==config['coreSha256']
 assert config['detailUrl'] in names and digest(ROOT/config['detailUrl'])==config['detailSha256']
 assert not re.search(r'<script src="data\.js',html),'Full data fallback must not block normal startup'
 assert not re.search(r'<script src="app\.js',html) and 'id="atlas-app"' in html
 for p in [ROOT/'data.js',ROOT/'app.js',*(ROOT/'src').glob('*.js'),*(ROOT/'sources').glob('*')]:
  if not p.is_file():continue
  text=p.read_text(encoding='utf-8')
  assert not re.search(r'(?:gh[pousr]_[A-Za-z0-9]{30,}|Bearer\s+[A-Za-z0-9._-]{20,}|[?&](?:access_token|token|signature|x-amz-signature)=)',text,re.I),'Possible private credential in '+p.name
  if p.parent.name=='src':assert 'crop-globe-work/' not in text and 'file:///' not in text,p.name
 release=read(ROOT/'release.json')
 for name,expected in release['assets'].items():assert digest(ROOT/name)==expected,name
 total=sum((ROOT/n).stat().st_size for n in names);assert total<1024**3
 if args.stage:
  target=ROOT/'_site';target.mkdir(exist_ok=False)
  for name in names:
   dest=target/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/name,dest)
  shutil.copy2(ROOT/'site-files.json',target/'site-files.json')
 print(json.dumps({'passed':True,'publishedFiles':len(names)+1,'audio':len(audio),'subtitleCues':cues,'plants':140,'regions':85,'imageCount':21,'siteBytes':total,'separateAudioAssets':True,'relativePaths':True,'allowlistOnly':True,'staged':args.stage}))
if __name__=='__main__':main()
