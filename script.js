const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

// Progressive reveal. Elements are fully visible by default, so a script/CSS delay
// can never produce a white or empty page during navigation.
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

// Active section tracking without a continuous scroll/render loop.
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

// One passive scroll listener only for the compact header state.
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

// Small pointer-only tilt. It runs only while the pointer is over a card;
// there is no requestAnimationFrame loop and nothing runs while scrolling.
if(!reduceMotion && window.matchMedia('(pointer:fine)').matches){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.transform=`perspective(1100px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}

document.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu();});
