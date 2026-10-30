import * as THREE from 'three';

// Display lighting only. It does not encode local time, weather or atmosphere
// measurements, and it never changes a source value or the map's colour key.
export function createGlobeAppearance({scene,globe}={}){
  const fill=new THREE.AmbientLight(0xc8dce8,.72);
  const sky=new THREE.HemisphereLight(0xd9f1f4,0x17263b,.58);
  const key=new THREE.DirectionalLight(0xfff3de,2.25);key.position.set(-3,4,5);
  const soft=new THREE.DirectionalLight(0x729ebd,.42);soft.position.set(3,-1,2);
  scene.add(fill,sky,key,soft);
  const geometry=new THREE.SphereGeometry(1.035,80,56);
  const material=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending,
    uniforms:{glowColor:{value:new THREE.Color('#79d4ed')},strength:{value:.36}},
    vertexShader:`varying vec3 eyeNormal;
      void main(){eyeNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform vec3 glowColor;uniform float strength;varying vec3 eyeNormal;
      void main(){float edge=pow(1.0-abs(normalize(eyeNormal).z),3.2);
        gl_FragColor=vec4(glowColor,edge*strength);}`
  });
  const atmosphere=new THREE.Mesh(geometry,material);atmosphere.name='display-atmosphere-rim';atmosphere.renderOrder=2;globe.add(atmosphere);
  return {getState:()=>({displayOnly:true,atmosphereRadius:1.035,ambient:fill.intensity,key:key.intensity}),destroy(){for(const light of [fill,sky,key,soft])light.removeFromParent();atmosphere.removeFromParent();geometry.dispose();material.dispose();}};
}
