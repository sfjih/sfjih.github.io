const bodyClipPath="M566 203Q583 199 630 201H1388Q1406 199 1400 211L1384 220L1382 237Q1418 236 1425 263L1436 357L1434 605L1441 636L1441 738Q1446 760 1423 762L1310 772L1303 798L1289 800L1288 773C1275 613 1035 614 1017 776L1007 799L466 799L449 781C438 615 189 615 175 786L141 772L95 752Q68 743 69 713L72 659L87 623L91 585Q98 546 125 517L166 483L218 466L287 451L318 441L320 404Q324 390 343 393L352 408L405 352Q484 251 552 242L581 236L576 219Q558 218 566 203Z";
(() => {
const T=THREE,stage=document.getElementById('three-stage');let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch(e){document.getElementById('loading').textContent='此浏览器暂不支持 WebGL，请使用开启硬件加速的 Edge 或 Chrome。';return;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0x000000,0);stage.appendChild(renderer.domElement);
const scene=new T.Scene();
const camera=new T.PerspectiveCamera(29,1,.1,100);const aim=new T.Vector3(0,2.75,0);camera.position.set(0,4.4,19);
scene.add(new T.HemisphereLight('#fff7e3','#939678',2.5));const sunLight=new T.DirectionalLight('#ffe0a4',2);sunLight.position.set(-6,9,5);scene.add(sunLight);
function material(color){return new T.MeshStandardMaterial({color,roughness:1});}
function mesh(g,m,parent=scene){const o=new T.Mesh(g,m);parent.add(o);return o;}
function polygon(points,color,z){const shape=new T.Shape(points.map(p=>new T.Vector2(...p)));const o=mesh(new T.ShapeGeometry(shape),new T.MeshBasicMaterial({color,side:T.DoubleSide}));o.position.z=z;return o;}
let seed=142;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
// The scenery is a full-page 2D SVG, while the vehicle remains on a transparent canvas.
function radialTexture(){const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(48,48,0,48,48,48);g.addColorStop(0,'rgba(255,255,255,.8)');g.addColorStop(.5,'rgba(255,255,255,.3)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,96,96);return new T.CanvasTexture(c);}
const soft=radialTexture();const shadow=mesh(new T.PlaneGeometry(12.1,2.7),new T.MeshBasicMaterial({map:soft,color:'#705338',transparent:true,opacity:.45,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-.049,.12);
const dustCount=45,dustValues=new Float32Array(dustCount*3),dustPhases=Array.from({length:dustCount},()=>random()),dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.BufferAttribute(dustValues,3));const dustMat=new T.PointsMaterial({map:soft,color:'#e6d7b4',transparent:true,opacity:.27,size:.7,depthWrite:false});const dust=new T.Points(dustGeo,dustMat);scene.add(dust);
const vehicle=new T.Group();scene.add(vehicle);vehicle.scale.setScalar(1.32);const body=new T.Group();vehicle.add(body);const wheels=[];
// Browser-rendered SVG clipping preserves the supplied raster and its paintwork.
function imageTexture(viewBox){return new Promise((resolve,reject)=>{const name=viewBox[0]===0?'body':viewBox[0]===183?'front':'rear';new T.TextureLoader().load('assets/'+name+'.webp',tex=>{tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();resolve(tex)},undefined,reject);});}
const scale=.0062,originX=748.5,floorY=909;
const spriteMaterial=map=>new T.MeshBasicMaterial({map,transparent:true,alphaTest:.035,side:T.DoubleSide,depthWrite:true,fog:false});
const preference=matchMedia('(prefers-reduced-motion: reduce)');let paused=preference.matches,speed=1,time=0,last=null,targetX=0,targetY=0,parallaxX=0,parallaxY=0,ready=false;
function ui(){document.getElementById('pause').textContent=paused?'▶ 继续行驶':'Ⅱ 暂停行驶';document.getElementById('pause').setAttribute('aria-pressed',String(paused));document.getElementById('live').textContent=paused?'TAKING A BREAK':'ON THE MOVE';}
document.getElementById('pause').onclick=()=>{paused=!paused;ui()};document.getElementById('speed').oninput=e=>{speed=+e.target.value;document.getElementById('speed-value').value=speed.toFixed(1)+'×'};preference.addEventListener('change',e=>{paused=e.matches;targetX=targetY=0;ui()});ui();
stage.addEventListener('pointermove',e=>{if(preference.matches)return;const r=stage.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;});stage.addEventListener('pointerleave',()=>{targetX=targetY=0});
function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(stage);resize();
function frame(now){requestAnimationFrame(frame);const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;const step=paused?0:dt*speed;time+=step;
 body.position.y=Math.sin(time*9)*.014+Math.sin(time*15)*.009;body.rotation.z=Math.sin(time*6)*.002;
 wheels.forEach(w=>w.rotation.z=time*4.1);
 document.getElementById('desert-far').setAttribute('transform', 'translate('+Math.sin(time*.07)*12+' 0)');
 document.getElementById('desert-mid').setAttribute('transform', 'translate('+Math.sin(time*.09)*20+' 0)');
 document.getElementById('desert-sand').setAttribute('transform', 'translate('+(time*45%400)+' 0)');
 for(let i=0;i<dustCount;i++){dustPhases[i]=(dustPhases[i]+step*.38)%1;const t=dustPhases[i];dustValues[i*3]=4.4+t*4;dustValues[i*3+1]=.13+t*.65+Math.sin(i*3)*t*.15;dustValues[i*3+2]=-.5+Math.sin(i*15)*.5*t;}dustGeo.attributes.position.needsUpdate=true;
 const ease=1-Math.exp(-dt*5);parallaxX+=(targetX-parallaxX)*ease;parallaxY+=(targetY-parallaxY)*ease;
 camera.position.set(parallaxX*.35,4.4-parallaxY*.12,stage.clientWidth<650?17:14.8);camera.lookAt(aim);camera.updateMatrixWorld();
 const contact=new T.Vector3(0,0,.06).project(camera);const hero=stage.closest('.hero');const roadTop=stage.getBoundingClientRect().top-hero.getBoundingClientRect().top+(1-contact.y)*stage.clientHeight/2-2;hero.style.setProperty('--road-top',roadTop+'px');
 document.getElementById('gravel-pattern').setAttribute('patternTransform','translate('+(time*150%1000)+' 0)');renderer.render(scene,camera);
 window.__topfire={ready,paused,time,speed,parallaxX,parallaxY,drawCalls:renderer.info.render.calls};
}
Promise.all([imageTexture([0,0,1497,1051],`<path d="${bodyClipPath}"/>`),imageTexture([183,661,244,244],'<circle cx="305" cy="783" r="122"/>'),imageTexture([1025,660,246,246],'<circle cx="1148" cy="783" r="123"/>')]).then(([bodyTex,frontTex,rearTex])=>{
 const b=mesh(new T.PlaneGeometry(1497*scale,1051*scale),spriteMaterial(bodyTex),body);b.position.set(0,(floorY-525.5)*scale,.08);
 for(const [cx,tex,r] of [[305,frontTex,122],[1148,rearTex,123]]){const wheel=mesh(new T.PlaneGeometry(r*2*scale,r*2*scale),spriteMaterial(tex),vehicle);wheel.position.set((cx-originX)*scale,(floorY-783)*scale,.06);wheels.push(wheel);const backing=mesh(new T.CircleGeometry(127*scale,64),new T.MeshBasicMaterial({color:'#171c19'}),vehicle);backing.position.copy(wheel.position);backing.position.z=.02;}
 document.getElementById('loading').remove();ready=true;requestAnimationFrame(frame);
}).catch(error=>{document.getElementById('loading').textContent='车辆素材载入失败，请刷新页面重试。';console.error(error);});
})();
