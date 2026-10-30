/**
 * Place labels in screen pixels. x/y are geographic anchor points; optional
 * offsets are preferred [dx,dy] offsets of the label centre from that anchor.
 * Required labels precede all optional ones. Higher priority numbers win.
 * Ordinary labels are omitted when crowded; an impossible required placement
 * stays inside bounds and is marked crowded for the caller to handle.
 */
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

function rectangle(value){
  if(!value)return null;
  const left=value.left??value.x??0,top=value.top??value.y??0;
  const right=value.right??(left+(value.width??0)),bottom=value.bottom??(top+(value.height??0));
  return [left,top,right,bottom].every(finite)&&right>left&&bottom>top?{left,top,right,bottom,width:right-left,height:bottom-top}:null;
}

function overlaps(a,b,gap){
  return a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;
}

function overlapArea(a,b,gap){
  return Math.max(0,Math.min(a.right,b.right+gap)-Math.max(a.left,b.left-gap))*Math.max(0,Math.min(a.bottom,b.bottom+gap)-Math.max(a.top,b.top-gap));
}

const DEFAULT_OFFSETS=[[0,0]];
for(const distance of [18,30,48])DEFAULT_OFFSETS.push([0,-distance],[0,distance],[-distance,0],[distance,0],[-distance,-distance],[distance,-distance],[-distance,distance],[distance,distance]);

export function layoutGeographyLabels(candidates,{bounds,obstacles=[],maxLabels=24,gap=3}={}){
  const area=rectangle(bounds);if(!area)return [];
  const padding=finite(gap)?Math.max(0,gap):3;
  const blocked=obstacles.map(rectangle).filter(Boolean),placed=[],boxes=[];
  const ordered=(candidates||[]).map((candidate,index)=>({...candidate,_index:index})).filter(c=>finite(c.x)&&finite(c.y)&&finite(c.width)&&finite(c.height)&&c.width>0&&c.height>0)
    .sort((a,b)=>Number(!!b.required)-Number(!!a.required)||(b.priority||0)-(a.priority||0)||a._index-b._index);
  const limit=Math.max(ordered.filter(c=>c.required).length,finite(maxLabels)?Math.max(0,Math.floor(maxLabels)):24);

  for(const candidate of ordered){
    if(placed.length>=limit&&!candidate.required)break;
    const width=Math.min(candidate.width,area.width),height=Math.min(candidate.height,area.height),allBlocks=[...blocked,...boxes],seen=new Set();
    const boxAt=(left,top)=>{
      left=clamp(left,area.left,area.right-width);top=clamp(top,area.top,area.bottom-height);
      const key=left.toFixed(2)+','+top.toFixed(2);if(seen.has(key))return null;seen.add(key);
      return {left,top,right:left+width,bottom:top+height,width,height};
    };
    let chosen=null,best=null,bestScore=Infinity;
    const consider=(left,top)=>{
      const box=boxAt(left,top);if(!box)return false;
      const distance=(box.left+width/2-candidate.x)**2+(box.top+height/2-candidate.y)**2;
      if(!candidate.required&&finite(candidate.maxOffset)&&distance>candidate.maxOffset**2)return false;
      const collision=allBlocks.reduce((n,r)=>n+overlapArea(box,r,padding),0),score=collision*1e6+distance;
      if(score<bestScore){bestScore=score;best=box;}
      if(!allBlocks.some(r=>overlaps(box,r,padding))){chosen=box;return true;}return false;
    };
    const offsets=[...(Array.isArray(candidate.offsets)?candidate.offsets:[]),...DEFAULT_OFFSETS];
    for(const offset of offsets){if(!Array.isArray(offset)||!finite(offset[0])||!finite(offset[1]))continue;if(consider(candidate.x+offset[0]-width/2,candidate.y+offset[1]-height/2))break;}

    if(!chosen&&candidate.required){
      // Search obstacle edges before a bounded grid. This gives a selected small
      // country a readable label even when neighbours or UI cards occupy it.
      const spots=[];
      const add=(left,top)=>spots.push([left,top]);
      for(const r of allBlocks){
        for(const left of [r.left-width-padding,r.right+padding])for(const top of [candidate.y-height/2,r.top,r.bottom-height])add(left,top);
        for(const top of [r.top-height-padding,r.bottom+padding])for(const left of [candidate.x-width/2,r.left,r.right-width])add(left,top);
      }
      for(const left of [area.left,area.right-width])for(const top of [area.top,clamp(candidate.y-height/2,area.top,area.bottom-height),area.bottom-height])add(left,top);
      for(const top of [area.top,area.bottom-height])add(clamp(candidate.x-width/2,area.left,area.right-width),top);
      const step=Math.max(8,Math.min(18,height/2));
      for(let top=area.top;top<=area.bottom-height;top+=step)for(let left=area.left;left<=area.right-width;left+=step)add(left,top);
      spots.sort((a,b)=>(a[0]+width/2-candidate.x)**2+(a[1]+height/2-candidate.y)**2-((b[0]+width/2-candidate.x)**2+(b[1]+height/2-candidate.y)**2));
      for(const [left,top] of spots)if(consider(left,top))break;
      if(!chosen)chosen=best; // Only infeasible bounds/obstacles can reach this.
    }
    if(!chosen)continue;
    const {_index,...original}=candidate;
    const endX=clamp(candidate.x,chosen.left,chosen.right),endY=clamp(candidate.y,chosen.top,chosen.bottom);
    placed.push({...original,left:chosen.left,top:chosen.top,width,height,anchorX:candidate.x,anchorY:candidate.y,
      leader:Math.hypot(endX-candidate.x,endY-candidate.y)>5,leaderEndX:endX,leaderEndY:endY,
      ...(allBlocks.some(r=>overlaps(chosen,r,padding))?{crowded:true}:{}),
      ...(width!==candidate.width||height!==candidate.height?{constrained:true}:{})});
    boxes.push(chosen);
  }
  return placed;
}
