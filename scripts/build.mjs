import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {encodeAtlas,decodeAtlas} from './atlas-codec.mjs';
import {splitAtlas,hydrateAtlas} from '../src/atlas-hydration.js';
const root=resolve(import.meta.dirname,'..');
const dependencyRoot=process.env.PLANT_EARTH_BUILD_TOOLS;
const require=createRequire(dependencyRoot?join(resolve(dependencyRoot),'package.json'):import.meta.url);
const esbuild=require('esbuild');
const sha=s=>createHash('sha256').update(s).digest('hex');
const bundle=await esbuild.build({absWorkingDir:root,entryPoints:['src/app.js'],bundle:true,minify:true,format:'iife',target:'es2022',outfile:'app.js',metafile:true,logLevel:'warning',nodePaths:dependencyRoot?[join(resolve(dependencyRoot),'node_modules')]:[]});
// The complete canonical data and audio clock remain unchanged. Ship a smaller
// reversible representation, and verify the actual compressed bytes end to end.
const dataSource=await readFile(join(root,'data.js'),'utf8');
const data=JSON.parse(dataSource.replace(/^window\.ATLAS_DATA=/,'').replace(/;\s*$/,''));
const packed=gzipSync(JSON.stringify(encodeAtlas(data)),{level:9,mtime:0});
// Gzip's OS metadata differs between Windows and Linux. Normalize only that
// header byte so both build hosts generate the same content-addressed URL.
assert.equal(packed[3]&2,0);packed[9]=255;
assert.deepStrictEqual(decodeAtlas(JSON.parse(gunzipSync(packed).toString('utf8'))),data);
const dataHash=sha(packed),dataName='assets/atlas-data.'+dataHash.slice(0,16)+'.bin';
await mkdir(join(root,'assets'),{recursive:true});await writeFile(join(root,dataName),packed);
const {core,details}=splitAtlas(data);
const compress=value=>{const bytes=gzipSync(JSON.stringify(encodeAtlas(value)),{level:9});assert.equal(bytes[3]&2,0);bytes[9]=255;return bytes;};
const coreBytes=compress(core),detailBytes=compress(details),detailHash=sha(detailBytes),detailName='assets/atlas-details.'+detailHash.slice(0,16)+'.bin';
const decode=bytes=>decodeAtlas(JSON.parse(gunzipSync(bytes).toString('utf8')));
assert.deepStrictEqual(hydrateAtlas(decode(coreBytes),decode(detailBytes)),data);
await writeFile(join(root,detailName),detailBytes);
await esbuild.build({absWorkingDir:root,entryPoints:['src/startup.js'],bundle:true,minify:true,format:'iife',target:'es2022',outfile:'startup.js',logLevel:'warning'});
let html=await readFile(join(root,'src/index.template.html'),'utf8');
const links=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"?]+)(?:\?[^\"]*)?"[^>]*>/g)];
if(links.length!==29)throw Error('Expected the 29 reviewed stylesheet layers');
const styles=[];
for(const row of links){if(!/^[a-z-]+\.css$/.test(row[1]))throw Error('Unsafe stylesheet path');styles.push('/* '+row[1]+' */\n'+await readFile(join(root,row[1]),'utf8'));}
const css=styles.join('\n');await writeFile(join(root,'styles.css'),css);
let first=true;html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,()=>{if(!first)return '';first=false;return '<link rel="stylesheet" href="styles.css?v='+sha(css).slice(0,12)+'">';});
for(const name of ['app.js','data.js']){const digest=sha(await readFile(join(root,name)));html=html.replace(new RegExp('src="'+name.replace('.','\\.')+'(?:\\?[^\"]*)?"','g'),'src="'+name+'?v='+digest.slice(0,12)+'"');}
const appUrl='app.js?v='+sha(await readFile(join(root,'app.js'))).slice(0,12),fallbackUrl='data.js?v='+sha(await readFile(join(root,'data.js'))).slice(0,12);
const config={dataUrl:dataName,dataSha256:dataHash,coreSha256:sha(coreBytes),detailUrl:detailName,detailSha256:detailHash,appUrl,fallbackUrl};
html=html.replace(/<script src="data\.js(?:\?[^\"]*)?"><\/script>/,'');
const safeScript=s=>s.replace(/<\/script/gi,'<\\/script');
const inlineApp=safeScript(await readFile(join(root,'app.js'),'utf8')),inlineStartup=safeScript(await readFile(join(root,'startup.js'),'utf8'));
html=html.replace(/<script src="app\.js(?:\?[^\"]*)?"><\/script>/,()=>'<script id="atlas-startup-config" type="application/json">'+JSON.stringify(config)+'</script>\n<script id="atlas-core" type="application/octet-stream">'+coreBytes.toString('base64')+'</script>\n<script id="atlas-app" type="text/plain">'+inlineApp+'</script>\n<script>'+inlineStartup+'</script>');
html=html.replace('<link rel="stylesheet" href="styles.css?v='+sha(css).slice(0,12)+'">','<style id="atlas-site-styles">'+css+'</style>');
html=html.replace('</head>','<style>#atlas-startup{position:fixed;left:50%;top:46%;transform:translate(-50%,-50%);z-index:10000;max-width:calc(100vw - 40px);padding:22px 26px;border:1px solid #496663;border-radius:14px;background:#132a31;color:#e3eed8;font:16px/1.7 system-ui,sans-serif;box-shadow:0 12px 45px #0006}#atlas-startup[hidden]{display:none}#atlas-startup strong{font-size:22px}#atlas-startup p{margin:8px 0}#atlas-startup button{background:#d7e4b5;color:#17302b;padding:7px 14px;border:0;border-radius:6px;font:inherit}</style>\n</head>');
html=html.replace('<body>','<body aria-busy="true">\n<section id="atlas-startup" role="status" aria-live="polite"><strong>植物地球</strong><p>正在打开地球与课程…</p><button hidden>重新加载</button></section><noscript>请启用 JavaScript 以查看交互地球和课程。</noscript>');
html=html.replace('<header class="topbar">','<header class="topbar" inert data-startup-inert>');
html=html.replace('<div class="layout">','<div class="layout" inert data-startup-inert>');
html=html.replace('<div class="player-dock"','<div inert data-startup-inert class="player-dock"');
await writeFile(join(root,'index.html'),html);
// Include the licenses of every third-party package parsed by the bundler.
const seen=new Set(),notices=[];
for(const input of Object.keys(bundle.metafile.inputs)){
 let p=dirname(resolve(root,input));if(!p.includes('node_modules'))continue;
 while(p!==dirname(p)){
  try{const pkg=JSON.parse(await readFile(join(p,'package.json'),'utf8'));
   if(!seen.has(pkg.name)){seen.add(pkg.name);const license=[];for(const name of ['LICENSE','LICENSE.txt','LICENSE.md','LICENSE-MIT','COPYING']){try{license.push(await readFile(join(p,name),'utf8'));}catch{}}
    notices.push([pkg.name+' '+pkg.version,typeof pkg.license==='string'?pkg.license:JSON.stringify(pkg.license||''),...license].join('\n'));}
   break;
  }catch{p=dirname(p);}
 }
}
await writeFile(join(root,'THIRD_PARTY_NOTICES.txt'),notices.join('\n\n'+'='.repeat(72)+'\n\n'));
const files=JSON.parse(await readFile(join(root,'site-files.json'),'utf8'));
// Keep older hashed transports available for tabs holding a cached index.
files.files=[...new Set([...files.files,'startup.js',...(await readdir(join(root,'assets'))).filter(n=>/^atlas-(?:data|details)\.[a-f0-9]+\.bin$/.test(n)).map(n=>'assets/'+n)])].sort();
await writeFile(join(root,'site-files.json'),JSON.stringify(files,null,2)+'\n');
await writeFile(join(root,'release.json'),JSON.stringify({version:'2026-10-30',sourceCommit:process.env.GITHUB_SHA||null,plantCount:files.plantCount,regionCount:files.regionCount,audioCount:files.audioCount,imageCount:files.imageCount,assets:{'app.js':sha(await readFile(join(root,'app.js'))),'data.js':sha(await readFile(join(root,'data.js'))),'styles.css':sha(css),'startup.js':sha(await readFile(join(root,'startup.js'))),[dataName]:dataHash,[detailName]:detailHash},transport:{format:'gzip / lossless object dictionary v1',file:dataName,bytes:packed.length,coreBytes:coreBytes.length,detailBytes:detailBytes.length,canonicalBytes:Buffer.byteLength(dataSource),deepEqualityVerified:true,legacyFallback:fallbackUrl},delivery:'One-response critical globe/course assets; large global statistical rows and botanical polygons load after first paint with an explicit pending state.'},null,2)+'\n');
console.log(JSON.stringify({built:true,stylesheetsCombined:links.length,thirdPartyPackages:seen.size,appBytes:(await readFile(join(root,'app.js'))).length,dataBytes:(await readFile(join(root,'data.js'))).length,criticalHtmlBytes:Buffer.byteLength(html),criticalHtmlGzipBytes:gzipSync(html,{level:6}).length,coreBytes:coreBytes.length,detailBytes:detailBytes.length}));
