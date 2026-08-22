const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reconstruct the supplied profile photo from small repository chunks.
// The split files keep the full image intact and avoid binary-upload truncation.
(async function loadProfilePhoto() {
  const portrait = document.querySelector('.profile-photo');
  if (!portrait) return;

  const parts = [
    'assets/profile-parts/part00.txt',
    'assets/profile-parts/part01.txt',
    'assets/profile-parts/part02.txt',
    'assets/profile-parts/part03a.txt',
    'assets/profile-parts/part03b.txt',
    'assets/profile-parts/part04.txt',
    'assets/profile-parts/part05.txt',
    'assets/profile-parts/part06.txt',
    'assets/profile-parts/part07.txt',
  ];

  try {
    const encodedParts = await Promise.all(
      parts.map(async (path) => {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        return (await response.text()).trim();
      })
    );

    portrait.src = `data:image/jpeg;base64,${encodedParts.join('')}`;
    portrait.loading = 'eager';
    portrait.decoding = 'async';
  } catch (error) {
    console.warn('Profile photo could not be reconstructed.', error);
  }
})();

// Keep the featured-project section aligned with the real deployed projects.
(function enhanceFeaturedProjects() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  const heading = projectsSection.querySelector('.section-heading');
  if (heading) {
    const title = heading.querySelector('h2');
    const description = heading.querySelector('p:last-child');
    if (title) title.textContent = 'Three projects that shaped how I build.';
    if (description) {
      description.textContent = 'AgroConnect 2.0 and Rangam Saree Silks show my full-stack product work, while the Tata 1mg collaboration reflects how I learn from feedback and build with a team.';
    }
  }

  const agroCard = projectsSection.querySelector('.project-card.agro');
  if (agroCard) {
    const actions = agroCard.querySelector('.project-actions');
    const oldLiveControl = actions
      ? Array.from(actions.children).find((element) => element.textContent.includes('Live URL'))
      : null;

    if (oldLiveControl) {
      const liveLink = document.createElement('a');
      liveLink.className = 'btn-3d primary compact';
      liveLink.href = 'https://agro-connect2-0-iiq5.vercel.app/';
      liveLink.target = '_blank';
      liveLink.rel = 'noreferrer';
      liveLink.innerHTML = '<span>Live Project</span><i>↗</i>';
      oldLiveControl.replaceWith(liveLink);
    }
  }

  const projectStack = projectsSection.querySelector('.project-stack');
  if (!projectStack || projectStack.querySelector('.project-card.rangam')) return;

  const rangamCard = document.createElement('article');
  rangamCard.className = 'project-card rangam tilt-card reveal';
  rangamCard.innerHTML = `
    <div class="project-label">FULL-STACK E-COMMERCE PROJECT • DEPLOYED</div>
    <div class="project-grid reverse">
      <div>
        <h3>Rangam Saree Silks</h3>
        <p class="project-problem"><strong>Problem:</strong> Create a complete online shopping experience for handloom and silk sarees, with the product, account, order and payment workflows needed for a usable e-commerce platform.</p>
        <p>I built and deployed Rangam Saree Silks as an AI-based online saree shopping platform, combining a React frontend with a Node.js/Express backend and MongoDB data layer.</p>
        <ul class="feature-list">
          <li>React + Vite storefront with routing, API integration and responsive UI.</li>
          <li>Node.js + Express backend structured with controllers, models, middleware and routes.</li>
          <li>Authentication using JWT and bcrypt-based password handling.</li>
          <li>Product and order APIs backed by MongoDB/Mongoose.</li>
          <li>Cloudinary and Multer-based media upload support.</li>
          <li>Razorpay payment integration and deployed frontend on Vercel.</li>
        </ul>
        <div class="tech-cloud">
          <span>React</span><span>Vite</span><span>Tailwind CSS</span><span>Node.js</span><span>Express</span><span>MongoDB</span><span>JWT</span><span>Cloudinary</span><span>Razorpay</span>
        </div>
        <div class="project-actions">
          <a class="btn-3d primary compact" href="https://rangam-saree-silks.vercel.app/" target="_blank" rel="noreferrer"><span>Live Project</span><i>↗</i></a>
          <a class="btn-3d ghost compact" href="https://github.com/charanteja7725/rangam-saree-silks" target="_blank" rel="noreferrer"><span>Repository</span><i>↗</i></a>
        </div>
      </div>
      <div class="project-object scene-3d" aria-hidden="true">
        <div class="rebuild-stack">
          <div class="layer layer-1">SILK</div>
          <div class="layer layer-2">CATALOG</div>
          <div class="layer layer-3">ORDER</div>
          <div class="layer layer-4">PAY</div>
        </div>
      </div>
    </div>
  `;

  if (agroCard) {
    agroCard.insertAdjacentElement('afterend', rangamCard);
  } else {
    projectStack.prepend(rangamCard);
  }
})();

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
