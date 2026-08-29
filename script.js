const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation. All interactions are event-driven; there is no animation loop.
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

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

// Reveal each section once. IntersectionObserver works independently of scroll events.
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

// Highlight the current navigation section without running calculations on every scroll frame.
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

// Keyboard accessibility for the mobile menu.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
