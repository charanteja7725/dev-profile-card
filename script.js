const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// 3D tilt interaction for cards and the profile portrait.
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

// Cursor glow follows the mouse and acts like a soft moving light source.
const glow = document.querySelector('.cursor-glow');
if (glow) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

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
  const knotMaterial = new THREE.MeshBasicMaterial({
    color: 0x5be7ff,
    wireframe: true,
    transparent: true,
    opacity: 0.16,
  });
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  knot.position.set(3.2, 1.8, -1.5);
  group.add(knot);

  const icoGeometry = new THREE.IcosahedronGeometry(1.1, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x8a72ff,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
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
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x8bdfff,
    size: 0.018,
    transparent: true,
    opacity: 0.42,
  });
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
