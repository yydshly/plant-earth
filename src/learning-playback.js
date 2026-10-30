/** Playback must be derived from the visible lesson, never the last loaded MP3. */
export function learningPlaybackInput(context,teachingPlacement){
  if(!context)return null;
  if(context.playback)return context.playback;
  const stop=context.stop||context;
  const point={region:stop.title,lon:stop.lon,lat:stop.lat};
  if(context.mode==='overview')return {...point,chapterId:'learn-global'};
  if(context.mode==='foundation')return {...point,chapterId:'foundation-'+stop.id};
  if(context.mode==='environment'||context.mode==='question')return {...point,chapterId:'learn-'+stop.id};
  if(context.plantId){const p=teachingPlacement(context.plantId,stop);return p?[{...p,beatIndex:0},p]:null;}
  return null;
}

export function learningPlayerPreview(context,crops,canPlay){
  const plant=context?.plantId?crops.get(context.plantId):null,stop=context?.stop||context;
  const summary=context?.summary||stop?.summary||'跟着地球，理解植物与环境。';
  const caption=context?.mode==='plant'&&plant?`${plant.name}：${(plant.needs||'').replace(/[。.!！]+$/,'')}。点击播放，先看形态，再听代表地区的生长原因。`:summary;
  const label=!canPlay?'阅读当前线索':plant?'听'+plant.name+'讲解':context?.mode==='foundation'?'听这一步解释':context?.mode==='overview'?'听全局介绍':'听本站讲解';
  return {caption,label,status:canPlay?'MiniMax 入门导览 · 可暂停与调节倍速':'本页为互动阅读 · 可按主线继续',stages:context?.mode==='foundation'?'地球 → 阳光 → 水 → 森林':'环境 → 植物 → 对比 → 自己判断'};
}
