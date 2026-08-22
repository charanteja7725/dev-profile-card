const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Add the supplied portrait as the main 3D hero visual while keeping the skill orbit behind it.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  heroVisual.style.position = 'relative';
  heroVisual.style.isolation = 'isolate';

  const orbit = heroVisual.querySelector('.skill-orbit');
  if (orbit) {
    orbit.style.position = 'absolute';
    orbit.style.zIndex = '0';
    orbit.style.opacity = '0.5';
    orbit.style.transform = 'scale(0.84) rotateX(58deg) rotateZ(-8deg) translate(72px, -10px)';
    orbit.style.filter = 'saturate(1.15)';
  }

  const portraitStage = document.createElement('div');
  portraitStage.setAttribute('aria-label', 'Portrait of Ravuri Charan Teja');
  portraitStage.style.cssText = `
    position:relative;
    z-index:2;
    width:min(360px,78vw);
    aspect-ratio:9/14;
    border-radius:30px;
    padding:10px;
    background:linear-gradient(145deg,rgba(98,230,255,.7),rgba(107,140,255,.2) 38%,rgba(10,21,38,.92) 72%);
    border:1px solid rgba(176,239,255,.35);
    box-shadow:0 18px 0 rgba(2,7,17,.96),0 36px 70px rgba(0,0,0,.48),0 0 55px rgba(98,230,255,.12);
    transform-style:preserve-3d;
    transform:perspective(1100px) rotateY(-10deg) rotateX(3deg) translateZ(34px);
    transition:transform .25s ease,box-shadow .25s ease;
  `;

  const portrait = document.createElement('img');
  portrait.src = 'assets/profile.jpg';
  portrait.alt = 'Ravuri Charan Teja';
  portrait.loading = 'eager';
  portrait.decoding = 'async';
  portrait.style.cssText = `
    display:block;
    width:100%;
    height:100%;
    object-fit:cover;
    object-position:center center;
    border-radius:23px;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
    transform:translateZ(30px);
  `;

  const namePlate = document.createElement('div');
  namePlate.innerHTML = '<strong>RAVURI CHARAN TEJA</strong><span>JAVA • DSA • FULL STACK</span>';
  namePlate.style.cssText = `
    position:absolute;
    left:24px;
    right:24px;
    bottom:26px;
    display:grid;
    gap:4px;
    padding:14px 16px;
    border:1px solid rgba(255,255,255,.18);
    border-radius:15px;
    background:rgba(5,13,25,.72);
    backdrop-filter:blur(12px);
    box-shadow:0 9px 0 rgba(1,5,12,.78),0 18px 28px rgba(0,0,0,.25);
    transform:translateZ(58px);
    font-family:Space Grotesk,Inter,sans-serif;
  `;
  namePlate.querySelector('strong').style.cssText = 'font-size:.9rem;letter-spacing:.08em;color:#fff;';
  namePlate.querySelector('span').style.cssText = 'font-size:.67rem;letter-spacing:.13em;color:#7ee9ff;font-weight:700;';

  const javaBadge = document.createElement('div');
  javaBadge.textContent = '6 / 7 JAVA BELTS';
  javaBadge.style.cssText = `
    position:absolute;
    top:28px;
    right:-32px;
    padding:10px 13px;
    border-radius:12px;
    color:#07111f;
    background:linear-gradient(145deg,#c8f8ff,#62e6ff);
    font:800 .72rem Space Grotesk,Inter,sans-serif;
    letter-spacing:.08em;
    box-shadow:0 8px 0 #236c79,0 17px 28px rgba(0,0,0,.32);
    transform:translateZ(65px) rotateY(-8deg) rotateZ(3deg);
  `;

  portraitStage.append(portrait, namePlate, javaBadge);
  heroVisual.prepend(portraitStage);

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    portraitStage.addEventListener('mousemove', (event) => {
      const rect = portraitStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portraitStage.style.transform = `perspective(1100px) rotateY(${x * 14 - 6}deg) rotateX(${-y * 10 + 2}deg) translateZ(48px)`;
    });
    portraitStage.addEventListener('mouseleave', () => {
      portraitStage.style.transform = 'perspective(1100px) rotateY(-10deg) rotateX(3deg) translateZ(34px)';
    });
  }
}

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// 3D tilt interaction for cards and panels.
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 8;
      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Cursor glow follows the mouse and gives the depth surfaces a light source.
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

// Truthful tooltip for links that are not publicly verifiable.
const toast = document.getElementById('toast');
let toastTimer;
document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    clearTimeout(toastTimer);
    toast.textContent = button.dataset.toast;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4300);
  });
});

// Lightweight Three.js background. The portfolio still works if the CDN is unavailable.
if (window.THREE && !reduceMotion) {
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const group = new THREE.Group();
  scene.add(group);

  const knotGeometry = new THREE.TorusKnotGeometry(1.25, 0.25, 160, 20);
  const knotMaterial = new THREE.MeshBasicMaterial({ color: 0x5be7ff, wireframe: true, transparent: true, opacity: 0.16 });
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  knot.position.set(3.2, 1.8, -1.5);
  group.add(knot);

  const icoGeometry = new THREE.IcosahedronGeometry(1.1, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({ color: 0x8a72ff, wireframe: true, transparent: true, opacity: 0.12 });
  const ico = new THREE.Mesh(icoGeometry, icoMaterial);
  ico.position.set(-3.5, -1.6, -2);
  group.add(ico);

  const particleCount = 850;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 18;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: 0x8bdfff, size: 0.018, transparent: true, opacity: 0.42 });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('pointermove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    knot.rotation.x = t * 0.14;
    knot.rotation.y = t * 0.2;
    ico.rotation.x = -t * 0.12;
    ico.rotation.z = t * 0.16;
    particles.rotation.y = t * 0.01;
    group.rotation.y += (mouseX - group.rotation.y) * 0.025;
    group.rotation.x += (-mouseY - group.rotation.x) * 0.025;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
