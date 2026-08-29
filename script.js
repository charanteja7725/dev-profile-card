const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation: click-driven, with no animation loop.
const menuButton = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu(){
  if(!menuButton || !mobileNav) return;
  menuButton.classList.remove('open');
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
}

if(menuButton && mobileNav){
  menuButton.addEventListener('click',()=>{
    const open = mobileNav.classList.toggle('open');
    menuButton.classList.toggle('open',open);
    menuButton.setAttribute('aria-expanded',String(open));
  });
  mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{
    if(mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
}

// Content is visible by default. The observer only adds a light entrance class;
// a failed script can never leave the page blank.
if(!reduceMotion && 'IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:.08});
  document.querySelectorAll('.section,.project,.glass-card,.contact-card').forEach(el=>observer.observe(el));
}

// Active navigation is observer-driven; there is no scroll calculation/render loop.
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const targets = navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window && navLinks.length){
  const navObserver = new IntersectionObserver(entries=>{
    const current = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!current) return;
    navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href') === `#${current.target.id}`));
  },{rootMargin:'-42% 0px -48% 0px',threshold:[0,.2,.5]});
  targets.forEach(target=>navObserver.observe(target));
}

// Compact header state uses one passive scroll listener only. No visual loop.
const header = document.querySelector('.nav');
if(header){
  let lastState = false;
  const update = ()=>{
    const state = window.scrollY > 18;
    if(state !== lastState){
      lastState = state;
      header.classList.toggle('scrolled',state);
    }
  };
  window.addEventListener('scroll',update,{passive:true});
}

// Subtle 3D tilt only while the pointer is over a card. No requestAnimationFrame loop.
if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.setProperty('--rx',`${(-y*2.2).toFixed(2)}deg`);
      card.style.setProperty('--ry',`${(x*2.2).toFixed(2)}deg`);
      card.style.setProperty('--mx',`${(x*100).toFixed(1)}%`);
      card.style.setProperty('--my',`${(y*100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave',()=>{
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','50%');
    });
  });
}

document.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu();});
