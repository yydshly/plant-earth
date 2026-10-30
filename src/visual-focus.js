import * as THREE from 'three';

const finite=value=>typeof value==='number'&&Number.isFinite(value);
const COLORS={climate:'#f4d58a',soil:'#e3b287',water:'#70d9e7',plant:'#c4e69b',geography:'#8fd7e8'};

// This is a screen-size attention symbol, never a geographic range or area.
export function normalizeVisualFocus(input){
  if(!input||!finite(input.lon)||!finite(input.lat)||Math.abs(input.lon)>180||Math.abs(input.lat)>90)return null;
  const kind=Object.hasOwn(COLORS,input.kind)?input.kind:'plant';
  return {id:String(input.id??`${kind}:${input.lon}:${input.lat}`),lon:input.lon,lat:input.lat,kind,
    playing:input.playing===true,following:input.following!==false,fullMap:input.fullMap===true};
}

export function createVisualFocus({globe,camera,globeRoot,vector,requestDraw}={}){
  const root=new THREE.Group();root.name='current-visual-focus';root.visible=false;
  root.userData.meaning='Screen-size current teaching focus; not a plant range or observation.';globe.add(root);
  const geometry=new THREE.PlaneGeometry(2.6,2.6),ringGeometry=new THREE.RingGeometry(.965,1,64),innerGeometry=new THREE.RingGeometry(.46,.49,48);
  const glowMaterial=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,
    uniforms:{uColor:{value:new THREE.Color(COLORS.plant)},uOpacity:{value:.22}},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying vec2 vUv; uniform vec3 uColor; uniform float uOpacity; void main(){float r=length(vUv-0.5)*2.0;float a=pow(max(0.0,1.0-r),2.0)*uOpacity;gl_FragColor=vec4(uColor,a);}'
  });
  const ringMaterial=new THREE.MeshBasicMaterial({color:COLORS.plant,transparent:true,opacity:.65,side:THREE.DoubleSide,depthTest:false,depthWrite:false,toneMapped:false});
  const innerMaterial=ringMaterial.clone();innerMaterial.opacity=.55;
  const glow=new THREE.Mesh(geometry,glowMaterial),ring=new THREE.Mesh(ringGeometry,ringMaterial),inner=new THREE.Mesh(innerGeometry,innerMaterial);
  for(const object of [glow,ring,inner]){object.renderOrder=24;object.frustumCulled=false;root.add(object);}
  glow.renderOrder=18;
  const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  const origin=new THREE.Vector3(),cameraPosition=new THREE.Vector3(),worldPosition=new THREE.Vector3(),normal=new THREE.Vector3(),inverse=new THREE.Quaternion(),cameraQuaternion=new THREE.Quaternion();
  let focus=null,destroyed=false,animation=0,lastFrame=0,lastDraw=0,elapsed=0,visible=false,screen=null,pixelRadius=0,arrivalCount=0;
  const canAnimate=()=>!!focus&&visible&&!focus.fullMap&&focus.playing&&focus.following&&!reduced.matches&&!document.hidden&&!destroyed;
  function accent(){
    const moving=canAnimate(),arrival=moving?Math.min(1,elapsed/.9):1,breath=moving?(Math.sin(elapsed*2.15)+1)/2:.45;
    ring.scale.setScalar(1+(1-arrival)*.18);ringMaterial.opacity=moving?.37+breath*.21+(1-arrival)*.24:.6;
    innerMaterial.opacity=moving?.36+breath*.22:.5;glowMaterial.uniforms.uOpacity.value=moving?.2+breath*.09:.23;
  }
  function tick(now){
    animation=0;if(!canAnimate()){lastFrame=0;return;}
    if(lastFrame)elapsed+=Math.min(.08,Math.max(0,(now-lastFrame)/1000));lastFrame=now;accent();
    // The host draw is event-driven. Keep this small RAF separate so a request
    // made while the host is already drawing cannot swallow the next update.
    // Thirty draws per second are enough for this gentle accent; do not make
    // every label layout and geographic layer redraw at display refresh rate.
    if(!lastDraw||now-lastDraw>=1000/30){lastDraw=now;requestDraw?.();}
    if(canAnimate())animation=requestAnimationFrame(tick);
  }
  function updateAnimation(){
    if(!canAnimate()){if(animation)cancelAnimationFrame(animation);animation=0;lastFrame=0;lastDraw=0;}
    else if(!animation)animation=requestAnimationFrame(tick);
    accent();
  }
  function setFocus(input){
    if(destroyed)return null;const next=normalizeVisualFocus(input);if(!next){clear();return null;}
    if(focus&&Object.keys(next).every(key=>next[key]===focus[key]))return {...focus};
    const changed=!focus||next.id!==focus.id||next.lon!==focus.lon||next.lat!==focus.lat||next.kind!==focus.kind;
    if(changed){elapsed=0;lastFrame=0;arrivalCount++;}
    focus=next;root.position.copy(vector(next.lon,next.lat,1.046));
    const color=COLORS[next.kind];ringMaterial.color.set(color);innerMaterial.color.set(color);glowMaterial.uniforms.uColor.value.set(color);
    if(next.fullMap){visible=false;root.visible=false;screen=null;}
    updateAnimation();requestDraw?.();return {...focus};
  }
  function beforeRender(){
    visible=false;root.visible=false;screen=null;
    if(!focus||focus.fullMap||destroyed){updateAnimation();return;}
    const width=globeRoot.clientWidth,height=globeRoot.clientHeight;
    if(!width||!height){updateAnimation();return;}
    globe.getWorldPosition(origin);camera.getWorldPosition(cameraPosition);
    worldPosition.copy(root.position).applyMatrix4(globe.matrixWorld);normal.copy(worldPosition).sub(origin).normalize();
    const front=normal.dot(cameraPosition.clone().sub(worldPosition).normalize()),projected=worldPosition.clone().project(camera);
    const x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;
    visible=front>.16&&x>=4&&x<=width-4&&y>=4&&y<=height-4&&projected.z>=-1&&projected.z<=1;
    root.visible=visible;screen={x,y,front};
    if(visible){
      globe.getWorldQuaternion(inverse).invert();camera.getWorldQuaternion(cameraQuaternion);root.quaternion.copy(inverse).multiply(cameraQuaternion);
      const worldPerPixel=camera.isOrthographicCamera?(camera.top-camera.bottom)/(camera.zoom||1)/height:2*cameraPosition.distanceTo(worldPosition)*Math.tan(THREE.MathUtils.degToRad(camera.fov||45)/2)/height;
      pixelRadius=width<=760?21:27;root.scale.setScalar(worldPerPixel*pixelRadius);
    }
    updateAnimation();
  }
  function clear(){const changed=!!focus||visible||!!animation;focus=null;visible=false;screen=null;root.visible=false;elapsed=0;lastFrame=0;updateAnimation();if(changed)requestDraw?.();}
  const preferenceChanged=()=>{updateAnimation();requestDraw?.();};
  reduced.addEventListener?.('change',preferenceChanged);document.addEventListener('visibilitychange',preferenceChanged);
  return {setFocus,clear,beforeRender,getState:()=>({enabled:!!focus,focus:focus?{...focus}:null,visible,screen:screen?{...screen}:null,pixelRadius,animated:canAnimate(),animationScheduled:!!animation,arrivalCount,elapsed,objectCount:root.children.length}),
    destroy(){if(destroyed)return;clear();destroyed=true;reduced.removeEventListener?.('change',preferenceChanged);document.removeEventListener('visibilitychange',preferenceChanged);root.removeFromParent();geometry.dispose();ringGeometry.dispose();innerGeometry.dispose();glowMaterial.dispose();ringMaterial.dispose();innerMaterial.dispose();}
  };
}
