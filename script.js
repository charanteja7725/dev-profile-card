const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation: event-driven only; no continuous animation loop.
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.classList.toggle('open', !open);
    mobileMenu.classList.toggle('open', !open);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

// Reveal sections once. IntersectionObserver avoids a scroll handler/render loop.
const revealItems = document.querySelectorAll('.reveal:not(.hero .reveal)');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Section-aware navigation using IntersectionObserver instead of continuous scroll calculations.
const desktopLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const sections = desktopLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && desktopLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    const current = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;
    desktopLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .5] });
  sections.forEach((section) => navObserver.observe(section));
}

// Add the compact header state after the first meaningful scroll event.
const header = document.querySelector('.site-header');
let headerTick = false;
if (header) {
  const updateHeader = () => {
    headerTick = false;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', () => {
    if (headerTick) return;
    headerTick = true;
    requestAnimationFrame(updateHeader);
  }, { passive: true });
}

// Make keyboard users able to close the mobile menu with Escape.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
