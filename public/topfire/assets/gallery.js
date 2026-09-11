const $=id=>document.getElementById(id);
const order=[6,4,1,2,3,5,7,8,9],labels=['戈壁实景效果','左后侧视角','左侧视角','右侧视角','车尾视角','右后侧视角','随车装备 · 物料延展','户外周边 · 物料延展','脱困装备 · 物料延展'];
const viewport=$('carousel'),track=$('carousel-track'),dialog=$('lightbox'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let hover=false,focused=false,manualPause=reduced.matches,groupWidth=1,phase=0,last=null,returnFocus=null;
const AUTO_SPEED=70;
let drag=null,velocity=0,suppressClick=false;
const wrap=value=>((value%groupWidth)+groupWidth)%groupWidth;
function card(i,copy){const button=document.createElement('button');button.className='photo';button.dataset.index=i;button.setAttribute('aria-label','查看'+labels[i]+'完整大图');if(copy)button.tabIndex=-1;const image=new Image();image.src=previews[order[i]];image.loading="lazy";image.decoding="async";image.alt=labels[i];image.draggable=false;const caption=document.createElement('span');caption.className='photo-caption';const title=document.createElement('span');title.textContent=labels[i];const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0')+' / '+String(order.length).padStart(2,'0')+' ↗';caption.append(title,number);button.append(image,caption);button.onclick=()=>{returnFocus=button;$('large').src=pictures[order[i]];$('large').alt=labels[i]+'完整大图';$('large-title').textContent=labels[i];dialog.showModal()};return button;}
for(let copy=0;copy<3;copy++){const group=document.createElement('div');group.className='carousel-group';if(copy!==1)group.setAttribute('aria-hidden','true');for(let i=0;i<order.length;i++)group.append(card(i,copy!==1));track.append(group);}
function measure(){const w=track.firstElementChild.getBoundingClientRect().width;if(w>0){phase=phase/groupWidth*w;groupWidth=w;}}
new ResizeObserver(measure).observe(track.firstElementChild);measure();
viewport.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')hover=true});viewport.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hover=false});viewport.addEventListener('focusin',e=>focused=e.target.matches(':focus-visible'));viewport.addEventListener('focusout',e=>{focused=viewport.contains(e.relatedTarget)});
function pauseUI(){$('gallery-toggle').textContent=manualPause?'继续轮播':'暂停轮播';$('gallery-toggle').setAttribute('aria-pressed',String(manualPause));}
$('gallery-toggle').onclick=()=>{manualPause=!manualPause;velocity=0;pauseUI()};reduced.addEventListener('change',e=>{manualPause=e.matches;velocity=0;pauseUI()});pauseUI();
viewport.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();phase=(phase+(e.key==='ArrowRight'?1:-1)*280+groupWidth)%groupWidth;}});
viewport.addEventListener('dragstart',e=>e.preventDefault());
viewport.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0)return;
 velocity=0;suppressClick=false;focused=false;
 drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,moved:false,samples:[{x:e.clientX,t:performance.now()}]};
});
viewport.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
 if(!drag.moved){
  if(Math.abs(dx)<6)return;
  if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
  drag.moved=true;suppressClick=true;viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');
 }
 e.preventDefault();const now=performance.now();phase=wrap(phase+e.clientX-drag.x);drag.x=e.clientX;
 drag.samples.push({x:e.clientX,t:now});while(drag.samples.length>2&&now-drag.samples[0].t>100)drag.samples.shift();
});
function endDrag(e,cancelled=false){
 if(!drag||(e&&e.pointerId!==drag.id))return;
 const state=drag;drag=null;viewport.classList.remove('dragging');
 if(state.moved&&!cancelled&&!reduced.matches){
  const samples=state.samples,first=samples[0],end=samples[samples.length-1];
  if(performance.now()-end.t<110&&end.t>first.t)velocity=Math.max(-2600,Math.min(2600,(end.x-first.x)/(end.t-first.t)*1000));
 }
 if(viewport.hasPointerCapture(state.id))viewport.releasePointerCapture(state.id);
 if(e?.pointerType==='touch')hover=false;
}
viewport.addEventListener('pointerup',e=>endDrag(e));viewport.addEventListener('pointercancel',e=>endDrag(e,true));
// Touch starts with implicit capture on the image. Moving capture to the
// viewport emits a bubbling lost event from that image, not an ended drag.
viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport)endDrag(e,true)});
window.addEventListener('pointerup',e=>endDrag(e));window.addEventListener('blur',()=>{velocity=0;endDrag(null,true)});
viewport.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;}},true);
$('close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(returnFocus)returnFocus.focus({preventScroll:true})});
function carouselFrame(now){
 const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;
 const blocked=dialog.open||document.hidden;
 if(!drag&&!blocked&&Math.abs(velocity)>0){phase=wrap(phase+velocity*dt);velocity*=Math.exp(-3.2*dt);if(Math.abs(velocity)<18)velocity=0;}
 const stopped=hover||focused||manualPause||blocked||!!drag;
 if(!stopped&&velocity===0)phase=wrap(phase+dt*AUTO_SPEED);
 track.style.transform=`translate3d(${-groupWidth+phase}px,0,0)`;
 window.__galleryState={phase,stopped,groupWidth,count:order.length,velocity,dragging:!!drag?.moved,autoSpeed:AUTO_SPEED};requestAnimationFrame(carouselFrame);
}requestAnimationFrame(carouselFrame);
