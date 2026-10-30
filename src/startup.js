import {decodeAtlas} from '../scripts/atlas-codec.mjs';

async function start(){
const config=JSON.parse(document.getElementById('atlas-startup-config').textContent);
const panel=document.getElementById('atlas-startup'),message=panel.querySelector('p'),retry=panel.querySelector('button');
const mark=(name,value=performance.now().toFixed(1))=>{document.body.dataset[name]=String(value);};
const loadScript=url=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=url;script.async=false;
  script.onload=resolve;script.onerror=()=>reject(new Error('Script unavailable'));document.head.append(script);
});
retry.onclick=()=>location.reload();
mark('startupBootMs');
window.addEventListener('atlas:ready',()=>{
  panel.hidden=true;document.body.setAttribute('aria-busy','false');mark('startupBootComplete','true');
  const tracked=new Set([config.dataUrl,config.appUrl].map(url=>new URL(url,location.href).href));
  mark('startupTransfers',JSON.stringify(performance.getEntriesByType('resource').filter(r=>tracked.has(r.name)).map(r=>({path:new URL(r.name).pathname.split('/').pop(),durationMs:Math.round(r.duration),encodedBytes:r.encodedBodySize,decodedBytes:r.decodedBodySize,transferBytes:r.transferSize}))));
},{once:true});
try{
  if('DecompressionStream' in window&&window.crypto?.subtle){
    try{
      const response=await fetch(config.dataUrl,{credentials:'same-origin'});
      if(!response.ok)throw new Error('Atlas transport unavailable');
      const bytes=await response.arrayBuffer();
      const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
      if(hash!==config.dataSha256)throw new Error('Atlas transport version mismatch');
      const packed=await new Response(new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'))).json();
      window.ATLAS_DATA=decodeAtlas(packed);mark('startupTransport','gzip-packed');mark('startupDataBytes',bytes.byteLength);
    }catch{
      // Same frozen edition, with the original full script as a compatibility
      // and network fallback. Never synthesize or substitute narration data.
      message.textContent='正在重新载入课程资料…';await loadScript(config.fallbackUrl);mark('startupTransport','legacy-fallback');
    }
  }else{await loadScript(config.fallbackUrl);mark('startupTransport','legacy-browser');}
  mark('startupDataReadyMs');message.textContent='资料已就绪，正在打开地球…';
  mark('startupAppRequestedMs');await loadScript(config.appUrl);
}catch{
  panel.dataset.error='true';message.textContent='暂时没能打开课程，请检查网络后重试。';retry.hidden=false;
}
}
start();
