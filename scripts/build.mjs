import {createRequire} from 'node:module';
import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const dependencyRoot=process.env.PLANT_EARTH_BUILD_TOOLS;
const require=createRequire(dependencyRoot?join(resolve(dependencyRoot),'package.json'):import.meta.url);
const esbuild=require('esbuild');
const sha=s=>createHash('sha256').update(s).digest('hex');
const bundle=await esbuild.build({absWorkingDir:root,entryPoints:['src/app.js'],bundle:true,minify:true,format:'iife',target:'es2022',outfile:'app.js',metafile:true,logLevel:'warning',nodePaths:dependencyRoot?[join(resolve(dependencyRoot),'node_modules')]:[]});
let html=await readFile(join(root,'src/index.template.html'),'utf8');
const links=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"?]+)(?:\?[^\"]*)?"[^>]*>/g)];
if(links.length!==29)throw Error('Expected the 29 reviewed stylesheet layers');
const styles=[];
for(const row of links){if(!/^[a-z-]+\.css$/.test(row[1]))throw Error('Unsafe stylesheet path');styles.push('/* '+row[1]+' */\n'+await readFile(join(root,row[1]),'utf8'));}
const css=styles.join('\n');await writeFile(join(root,'styles.css'),css);
let first=true;html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,()=>{if(!first)return '';first=false;return '<link rel="stylesheet" href="styles.css?v='+sha(css).slice(0,12)+'">';});
for(const name of ['app.js','data.js']){const digest=sha(await readFile(join(root,name)));html=html.replace(new RegExp('src="'+name.replace('.','\\.')+'(?:\\?[^\"]*)?"','g'),'src="'+name+'?v='+digest.slice(0,12)+'"');}
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
await writeFile(join(root,'release.json'),JSON.stringify({version:'2026-10-30',sourceCommit:process.env.GITHUB_SHA||null,plantCount:files.plantCount,regionCount:files.regionCount,audioCount:files.audioCount,imageCount:files.imageCount,assets:{'app.js':sha(await readFile(join(root,'app.js'))),'data.js':sha(await readFile(join(root,'data.js'))),'styles.css':sha(css)},delivery:'Static relative-path website; pre-generated narration files loaded separately from page data.'},null,2)+'\n');
console.log(JSON.stringify({built:true,stylesheetsCombined:links.length,thirdPartyPackages:seen.size,appBytes:(await readFile(join(root,'app.js'))).length,dataBytes:(await readFile(join(root,'data.js'))).length}));
