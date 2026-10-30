// NASA's historical, cloud-screened April 2004 surface composite. This is a
// colour basemap with baked relief shading, never a crop, weather or height map.
export const EARTH_SURFACE = Object.freeze({
  id:'nasa-bmng-2004-04-topo-bathy',
  file:'images/earth/blue-marble-2004-04-4096.jpg',
  width:4096,
  height:2048,
  observationMonth:'2004-04',
  period:'2004年4月',
  sourceUrl:'https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography-bathymetry/',
  credit:'NASA Earth Observatory',
  label:'自然地表 · NASA 2004年4月合成',
  note:'历史无云合成及地形阴影，不是实时影像、植物分布或高程测量。',
  projection:'Plate Carree / WGS84',
  extent:Object.freeze({west:-180,east:180,north:90,south:-90})
});

// Keep the flat data basemap available until decoding succeeds. The source
// image has the same north-up, -180..180 extent as the existing d3 canvas.
export function createEarthSurface({source=EARTH_SURFACE,onReady,onError,imageFactory=()=>new Image()}={}){
  const metadata={...EARTH_SURFACE,...source},image=imageFactory();let cancelled=false,ready=false,failed=false;
  image.decoding='async';
  image.onload=()=>{
    if(cancelled)return;
    if(!(image.naturalWidth>0&&image.naturalHeight>0&&image.naturalWidth===image.naturalHeight*2)){
      failed=true;onError?.(new Error('The natural surface basemap must be a north-up 2:1 global image.'));return;
    }
    ready=true;onReady?.(image,metadata);
  };
  image.onerror=()=>{if(!cancelled){failed=true;onError?.(new Error('The natural surface basemap could not be loaded.'));}};
  image.src=metadata.file;
  return {
    getImage:()=>ready&&!cancelled?image:null,
    getState:()=>({ready:ready&&!cancelled,failed,destroyed:cancelled,width:ready?image.naturalWidth:0,height:ready?image.naturalHeight:0,file:metadata.file,sourceUrl:metadata.sourceUrl,period:metadata.period,credit:metadata.credit}),
    destroy(){cancelled=true;image.onload=null;image.onerror=null;}
  };
}
