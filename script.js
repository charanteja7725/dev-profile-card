const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep the featured-project section aligned with the existing portfolio content.
(function enhanceFeaturedProjects() {
  const projectsSection = document.querySelector('#projects');
  if (!projectsSection) return;

  const heading = projectsSection.querySelector('.section-heading');
  if (heading) {
    const title = heading.querySelector('h2');
    const description = heading.querySelector('p:last-child');
    if (title) title.textContent = 'Three projects that shaped how I build.';
    if (description) description.textContent = 'AgroConnect 2.0 and Rangam Saree Silks show my full-stack product work, while the Tata 1mg collaboration reflects how I learn from feedback and build with a team.';
  }

  const agroCard = projectsSection.querySelector('.project-card.agro');
  if (agroCard) {
    const actions = agroCard.querySelector('.project-actions');
    const oldLiveControl = actions ? Array.from(actions.children).find((element) => element.textContent.includes('Live URL')) : null;
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
        <div class="tech-cloud"><span>React</span><span>Vite</span><span>Tailwind CSS</span><span>Node.js</span><span>Express</span><span>MongoDB</span><span>JWT</span><span>Cloudinary</span><span>Razorpay</span></div>
        <div class="project-actions"><a class="btn-3d primary compact" href="https://rangam-saree-silks.vercel.app/" target="_blank" rel="noreferrer"><span>Live Project</span><i>↗</i></a><a class="btn-3d ghost compact" href="https://github.com/charanteja7725/rangam-saree-silks" target="_blank" rel="noreferrer"><span>Repository</span><i>↗</i></a></div>
      </div>
      <div class="project-object scene-3d" aria-hidden="true"><div class="rebuild-stack"><div class="layer layer-1">SILK</div><div class="layer layer-2">CATALOG</div><div class="layer layer-3">ORDER</div><div class="layer layer-4">PAY</div></div></div>
    </div>`;

  if (agroCard) agroCard.insertAdjacentElement('afterend', rangamCard);
  else projectStack.prepend(rangamCard);
})();

// Reveal elements once. Unobserving after reveal avoids unnecessary scroll work.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Smooth, low-frequency 3D tilt. Work is batched into animation frames.
if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    card.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = card.getBoundingClientRect();
        const x = (pointerX - rect.left) / rect.width;
        const y = (pointerY - rect.top) / rect.height;
        card.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateZ(5px)`;
      });
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.transform = '';
    });
  });
}

// Small status toast for controls without public URLs.
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
