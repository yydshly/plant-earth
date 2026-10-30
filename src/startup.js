import {decodeAtlas} from '../scripts/atlas-codec.mjs';
import {hydrateAtlas} from './atlas-hydration.js';
import {decompress} from './vendor/fzstd/esm/index.mjs';

async function start(){
const config=JSON.parse(document.getElementById('atlas-startup-config').textContent);
const panel=document.getElementById('atlas-startup'),message=panel.querySelector('p'),retry=panel.querySelector('button');
const mark=(name,value=performance.now().toFixed(1))=>{document.body.dataset[name]=String(value);};
const loadScript=url=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=url;script.async=false;
  script.onload=resolve;script.onerror=()=>reject(new Error('Script unavailable'));document.head.append(script);
});
retry.onclick=()=>location.reload();
const verify=async(bytes,expected)=>{
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
  if(hash!==expected)throw new Error('Atlas transport version mismatch');
};
const verifiedPack=async(bytes,expected)=>{
  await verify(bytes,expected);
  return decodeAtlas(await new Response(new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'))).json());
};
let detailsInFlight=null;
window.ATLAS_REQUEST_DETAILS=()=>{
  if(window.ATLAS_DETAIL_STATE?.status==='ready')return Promise.resolve(true);
  if(detailsInFlight)return detailsInFlight;
  window.ATLAS_DETAIL_STATE={status:'pending'};
  detailsInFlight=(async()=>{
    try{
      const response=await fetch(config.detailUrl,{credentials:'same-origin',priority:'low'});if(!response.ok)throw Error('Atlas details unavailable');
      const details=await verifiedPack(await response.arrayBuffer(),config.detailSha256);
      hydrateAtlas(window.ATLAS_DATA,details);window.ATLAS_DETAIL_STATE={status:'ready'};mark('startupDetailsReadyMs');window.dispatchEvent(new Event('atlas:details'));return true;
    }catch{window.ATLAS_DETAIL_STATE={status:'error'};window.dispatchEvent(new Event('atlas:details-error'));return false;}
    finally{detailsInFlight=null;}
  })();return detailsInFlight;
};
mark('startupBootMs');
window.addEventListener('atlas:ready',()=>{
  panel.hidden=true;document.body.setAttribute('aria-busy','false');mark('startupBootComplete','true');
  const tracked=new Set([config.dataUrl,config.appUrl].map(url=>new URL(url,location.href).href));
  mark('startupTransfers',JSON.stringify(performance.getEntriesByType('resource').filter(r=>tracked.has(r.name)).map(r=>({path:new URL(r.name).pathname.split('/').pop(),durationMs:Math.round(r.duration),encodedBytes:r.encodedBodySize,decodedBytes:r.decodedBodySize,transferBytes:r.transferSize}))));
  const nav=performance.getEntriesByType('navigation')[0];if(nav)mark('startupNavigation',JSON.stringify({responseStart:nav.responseStart,responseEnd:nav.responseEnd,encodedBytes:nav.encodedBodySize,transferBytes:nav.transferSize}));
  if(window.ATLAS_DETAIL_STATE?.status==='pending')setTimeout(()=>window.ATLAS_REQUEST_DETAILS(),Math.max(50,Math.min(30000,Number(config.detailDelayMs)||50)));
},{once:true});
try{
  let appSource=null;
  if('DecompressionStream' in window&&window.crypto?.subtle){
    try{
      const restoreStart=performance.now();
      const bytes=Uint8Array.from(atob(document.getElementById('atlas-core').textContent),c=>c.charCodeAt(0));
      await verify(bytes,config.coreSha256);
      if(config.bootFormat!=='zstd-v1')throw Error('Unsupported boot edition');
      const boot=JSON.parse(new TextDecoder().decode(decompress(bytes)));
      if(typeof boot.app!=='string')throw Error('Incomplete boot edition');
      window.ATLAS_DATA=decodeAtlas(boot.core);appSource=boot.app;window.ATLAS_DETAIL_STATE={status:'pending'};mark('startupTransport','inline-zstd');mark('startupDataBytes',bytes.byteLength);mark('startupRestoreMs',(performance.now()-restoreStart).toFixed(1));
    }catch{
      // Same frozen edition, with the original full script as a compatibility
      // and network fallback. Never synthesize or substitute narration data.
      message.textContent='正在重新载入课程资料…';await loadScript(config.fallbackUrl);window.ATLAS_DETAIL_STATE={status:'ready'};mark('startupTransport','legacy-fallback');
    }
  }else{await loadScript(config.fallbackUrl);window.ATLAS_DETAIL_STATE={status:'ready'};mark('startupTransport','legacy-browser');}
  mark('startupDataReadyMs');message.textContent='资料已就绪，正在打开地球…';
  mark('startupAppRequestedMs');if(appSource!==null){const app=document.createElement('script');app.textContent=appSource;document.head.append(app);}else{await loadScript(config.appUrl);}
}catch{
  panel.dataset.error='true';message.textContent='暂时没能打开课程，请检查网络后重试。';retry.hidden=false;
}
}
start();
