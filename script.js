const menuButton = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu() {
  if (!menuButton || !mobileNav) return;
  mobileNav.classList.remove('open');
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Lightweight 3D interaction: only runs while the pointer is over a project card.
// There is no scroll loop, canvas, WebGL, or continuous requestAnimationFrame work.
const canHover = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canHover && !reduceMotion) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -2.8;
      const rotateY = x * 3.2;
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
