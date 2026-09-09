const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const motion=document.querySelector('#motion-toggle');let paused=reduced.matches;
function setMotion(){document.body.classList.toggle('motion-paused',paused);document.documentElement.style.scrollBehavior=paused?'auto':'';motion?.setAttribute('aria-pressed',String(paused));if(motion)motion.innerHTML=paused?'Motion off <span aria-hidden="true">○</span>':'Motion on <span aria-hidden="true">◉</span>';if(paused){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));document.getAnimations().forEach(a=>a.finish())}}
motion?.addEventListener('click',()=>{paused=!paused;setMotion()});reduced.addEventListener('change',e=>{paused=e.matches;setMotion()});setMotion();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.09});document.querySelectorAll('[data-reveal],.quote-flow,.process-rail li').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',(i%4)*55+'ms');if(paused)el.classList.add('visible');else observer.observe(el)})}
let ticking=false;function scrollState(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';document.querySelector('header').classList.toggle('scrolled',scrollY>60);ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(scrollState);ticking=true}},{passive:true});scrollState();
if('IntersectionObserver' in window){const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('header nav a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main>section').forEach(s=>spy.observe(s))}
document.querySelectorAll('.faqs details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open&&!paused)el.querySelector('.answer').animate([{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing:'ease-out'})}));
const dialog = document.querySelector('#booking');
let returnFocus;
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
 returnFocus=button; dialog.showModal(); document.body.style.overflow='hidden';
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
document.querySelector('#success-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus();});
dialog.addEventListener('click',event=>{const b=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom))dialog.close();});
const form=document.querySelector('#booking-form');
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const button=form.querySelector('button'),status=document.querySelector('#form-status');
 button.disabled=true;button.textContent='Sending…';status.textContent='';
 try {
  const result=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
  if(!result.ok)throw new Error('Request failed');
  document.querySelector('#form-view').hidden=true;document.querySelector('#success-view').hidden=false;document.querySelector('#success-close').focus();form.reset();
 } catch {status.textContent='Your request couldn’t be sent. Your details are still here; please try again.';}
 finally {button.disabled=false;button.innerHTML='Request a session <span>↗</span>';}
});
