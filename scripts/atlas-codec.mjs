// Lossless transport only. Objects, strings and every number are reconstructed
// before any atlas controller sees the data. Negative zero has its own tag.
export function encodeAtlas(value){
  const counts=new Map(),shapes=[],shapeIds=new Map(),strings=[],stringIds=new Map();
  function count(v){if(typeof v==='string')counts.set(v,(counts.get(v)||0)+1);else if(v&&typeof v==='object')for(const child of Object.values(v))count(child);}
  count(value);
  for(const [s,n]of counts){const bytes=new TextEncoder().encode(JSON.stringify(s)).length;if(n>1&&(n-1)*bytes>n*9+1){stringIds.set(s,strings.length);strings.push(s);}}
  function encode(v){
    if(typeof v==='string')return stringIds.has(v)?[1,stringIds.get(v)]:v;
    if(typeof v==='number'&&Object.is(v,-0))return [2];
    if(Array.isArray(v)){
      // Shared boundary points remain exact: choose a decimal scale only when
      // division reconstructs every original IEEE number, then store deltas.
      if(v.length>=4&&v.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>typeof n==='number'&&Number.isFinite(n)&&!Object.is(n,-0)))){
        const scale=[1,10,100,1000,10000,100000,1000000,10000000,100000000].find(s=>v.every(p=>p.every(n=>Number.isSafeInteger(Math.round(n*s))&&Object.is(Math.round(n*s)/s,n))));
        if(scale){let x=0,y=0;const out=[3,scale];for(const p of v){const nx=Math.round(p[0]*scale),ny=Math.round(p[1]*scale);out.push(nx-x,ny-y);x=nx;y=ny;}return out;}
      }
      return [0,...v.map(encode)];
    }
    if(v&&typeof v==='object'){
      const keys=Object.keys(v),key=JSON.stringify(keys);let id=shapeIds.get(key);
      if(id===undefined){id=shapes.length;shapes.push(keys);shapeIds.set(key,id);}
      return [-1-id,...keys.map(k=>encode(v[k]))];
    }
    return v;
  }
  const root=encode(value);return {version:1,shapes,strings,root};
}
export function decodeAtlas(pack){
  if(pack?.version!==1||!Array.isArray(pack.shapes)||!Array.isArray(pack.strings))throw Error('Unsupported atlas transport');
  function decode(v){
    if(!Array.isArray(v))return v;
    if(v[0]===0)return v.slice(1).map(decode);
    if(v[0]===1){if(v.length!==2||typeof pack.strings[v[1]]!=='string')throw Error('Invalid string reference');return pack.strings[v[1]];}
    if(v[0]===2){if(v.length!==1)throw Error('Invalid number reference');return -0;}
    if(v[0]===3){
      if(v.length<10||v.length%2||!Number.isSafeInteger(v[1])||v[1]<1)throw Error('Invalid coordinate sequence');
      let x=0,y=0;const out=[];for(let i=2;i<v.length;i+=2){if(!Number.isSafeInteger(v[i])||!Number.isSafeInteger(v[i+1]))throw Error('Invalid coordinate delta');x+=v[i];y+=v[i+1];out.push([x/v[1],y/v[1]]);}return out;
    }
    const keys=pack.shapes[-1-v[0]];
    if(!Array.isArray(keys)||keys.length!==v.length-1)throw Error('Invalid object shape');
    return Object.fromEntries(keys.map((key,i)=>[key,decode(v[i+1])]));
  }
  return decode(pack.root);
}
