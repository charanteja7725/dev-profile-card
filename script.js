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
    if (mobileNav.classList.contains('open') && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

/* Additive portfolio enhancements: no scroll loop, canvas, WebGL or requestAnimationFrame. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('link[data-journey-styles]')) {
    const journeyStyles = document.createElement('link');
    journeyStyles.rel = 'stylesheet';
    journeyStyles.href = 'journey.css';
    journeyStyles.dataset.journeyStyles = 'true';
    document.head.appendChild(journeyStyles);
  }

  // Recruiter-first hero update while preserving the existing hero layout and 3D visual.
  const heroRole = document.querySelector('.hero-role');
  if (heroRole) heroRole.textContent = 'Software Engineering Student | Java & DSA | Full-Stack Developer';

  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy && !heroCopy.querySelector('.hero-support')) {
    const support = document.createElement('p');
    support.className = 'hero-support';
    support.textContent = 'I am a second-year B.Tech Computer Science and Engineering student specializing in Software Product Engineering through Kalvium. I enjoy identifying real-world problems and building practical software solutions using Java, DSA, backend development and full-stack technologies.';
    heroCopy.insertBefore(support, heroCopy.querySelector('.actions'));
  }

  const heroMeta = document.querySelector('.hero-meta');
  if (heroMeta) {
    heroMeta.innerHTML = '<div class="hero-indicators"><span>Java + DSA</span><span>Full-Stack Projects</span><span>Problem → Product</span></div><a href="https://github.com/charanteja7725" target="_blank" rel="noreferrer">github.com/charanteja7725 ↗</a>';
  }

  const heroStat = document.querySelector('.glass-bottom span:last-child');
  if (heroStat) heroStat.textContent = 'Problem → Product';

  // Add Journey to the existing navigation without removing any current link.
  document.querySelectorAll('.nav-links, .mobile-nav').forEach((nav) => {
    if (!nav.querySelector('a[href="#journey"]')) {
      const link = document.createElement('a');
      link.href = '#journey';
      link.textContent = 'Journey';
      const contact = nav.querySelector('a[href="#contact"]');
      nav.insertBefore(link, contact || null);
      if (nav.classList.contains('mobile-nav')) link.addEventListener('click', closeMenu);
    }
  });

  // Build the Journey section from the supplied facts only.
  if (document.getElementById('journey')) return;
  const experience = document.getElementById('experience');
  if (!experience) return;

  const section = document.createElement('section');
  section.className = 'section journey';
  section.id = 'journey';
  section.setAttribute('aria-labelledby', 'journey-title');
  section.innerHTML = `
    <div class="section-kicker">05 / MY KALVIUM JOURNEY</div>
    <div class="journey-intro">
      <h2 id="journey-title">Learning software engineering by <em>building, solving and improving.</em></h2>
      <p>My journey through Software Product Engineering is centred on continuous coding practice, real projects, collaboration, feedback and professional readiness.</p>
    </div>

    <div class="journey-grid">
      <article class="journey-card journey-profile">
        <span class="journey-label">ABOUT ME IN KALVIUM</span>
        <h3>From academic learning to practical software engineering.</h3>
        <p>Through Kalvium, I am developing my software engineering abilities through continuous coding practice, data structures and algorithms, full-stack development, real-world projects, collaborative development and professional communication. Instead of learning programming only through theory, I regularly apply concepts through problem solving and complete software projects.</p>
        <div class="profile-lines">
          <div class="profile-line"><small>Name</small><strong>Ravuri Charan Teja</strong></div>
          <div class="profile-line"><small>Degree</small><strong>B.Tech Computer Science and Engineering</strong></div>
          <div class="profile-line"><small>Track</small><strong>Software Product Engineering through Kalvium</strong></div>
          <div class="profile-line"><small>Current Year</small><strong>Second Year</strong></div>
          <div class="profile-line"><small>University</small><strong>Kalasalingam Academy of Research and Education (KARE)</strong></div>
          <div class="profile-line"><small>CGPA</small><strong>8.98 / 10</strong></div>
          <div class="profile-line"><small>Expected Graduation</small><strong>July 2029</strong></div>
        </div>
      </article>

      <article class="journey-card">
        <span class="journey-label">ABOUT KALVIUM</span>
        <h3>An industry-oriented learning model.</h3>
        <p>Kalvium is an industry-oriented Computer Science learning program delivered in partnership with recognized universities. Its learning model focuses on practical software engineering, coding practice, projects, problem solving, collaboration, communication and professional readiness alongside the academic B.Tech degree.</p>
        <p class="journey-second-p">The university provides the degree and academic environment, while Kalvium contributes an industry-focused software engineering curriculum, coding practice, technical mentorship, project development, assessments and career preparation.</p>
      </article>

      <article class="journey-card">
        <span class="journey-label">LEARNING CYCLE</span>
        <h3>Learn → Practice → Build → Collaborate → Feedback → Improve → Industry Ready</h3>
        <div class="journey-model">
          <div class="journey-model-step"><b>01</b><div><strong>Learn</strong><span>Understand programming, computer science and software engineering concepts.</span></div></div>
          <div class="journey-model-step"><b>02</b><div><strong>Practice</strong><span>Strengthen coding through structured challenges, assessments and continuous problem solving.</span></div></div>
          <div class="journey-model-step"><b>03</b><div><strong>Build</strong><span>Apply concepts by developing actual software applications.</span></div></div>
          <div class="journey-model-step"><b>04</b><div><strong>Collaborate</strong><span>Work with teammates using shared codebases, Git, GitHub, APIs and development workflows.</span></div></div>
          <div class="journey-model-step"><b>05</b><div><strong>Feedback</strong><span>Receive project reviews, technical feedback and mentor suggestions.</span></div></div>
          <div class="journey-model-step"><b>06</b><div><strong>Improve</strong><span>Debug, redesign and rebuild when an implementation is not strong enough.</span></div></div>
          <div class="journey-model-step"><b>07</b><div><strong>Industry Ready</strong><span>Develop technical, communication, collaboration and problem-solving abilities for software engineering internships.</span></div></div>
        </div>
      </article>
    </div>

    <div class="journey-progress-grid">
      <article class="journey-card progress-card">
        <span class="journey-label">CODING PROGRESS · PRIMARY</span>
        <h3>Java & Data Structures / Algorithms</h3>
        <div class="progress-number"><strong>6 / 7</strong><span>Java Dojo Belts Completed</span></div>
        <div class="progress-track" role="progressbar" aria-label="Java Dojo belts completed" aria-valuemin="0" aria-valuemax="7" aria-valuenow="6"><div class="progress-fill"></div></div>
        <p class="progress-copy">Java is my strongest programming language. My progress includes continuous coding practice, problem solving and Data Structures & Algorithms.</p>
        <div class="progress-skills"><span>Arrays</span><span>Hashing</span><span>Sorting</span><span>Two Pointers</span><span>Sliding Window</span><span>Recursion</span><span>Backtracking</span><span>Dynamic Programming</span><span>Time Complexity</span><span>Space Complexity</span><span>Algorithmic Problem Solving</span></div>
      </article>

      <article class="journey-card progress-card">
        <span class="journey-label">CODING PROGRESS · SECONDARY</span>
        <h3>Python</h3>
        <div class="progress-number"><strong>4</strong><span>Python Dojo Belts Completed</span></div>
        <p>Python is my secondary programming language, which I continue to strengthen for general programming and data-oriented problem solving.</p>
        <div class="progress-skills"><span>Python</span><span>General Programming</span><span>Problem Solving</span></div>
      </article>
    </div>

    <div class="readiness-grid">
      <article class="journey-card readiness-card"><span class="journey-label">PROFESSIONAL COMMUNICATION</span><h3>Communication Score: 8</h3><p>Software engineering requires more than writing code. Through project discussions, presentations, collaborative development, feedback sessions and teamwork, I am developing the ability to explain technical ideas clearly and work effectively with others.</p></article>
      <article class="journey-card readiness-card"><span class="journey-label">PROJECT-BASED LEARNING</span><h3>Build → Fail → Learn → Rebuild</h3><p>My projects give me opportunities to connect product thinking with frontend experiences, backend workflows, data, APIs, authentication, deployment and collaboration.</p></article>
      <article class="journey-card readiness-card"><span class="journey-label">INTERNSHIP / PLACEMENT READINESS</span><h3>Preparing for professional software engineering.</h3><p>The work-integrated learning model is part of my preparation. I am strengthening coding, projects, full-stack development, backend engineering, Git collaboration, communication and professional mindset.</p></article>
    </div>

    <article class="journey-card project-learning">
      <span class="journey-label">PROJECTS IN THE LEARNING LOOP</span>
      <h3>How my projects connect to the journey.</h3>
      <div class="learning-projects">
        <div class="learning-project"><span class="project-index">01</span><h4>AgroConnect 2.0</h4><strong>Individual Ownership · Full-Stack Development · Product Thinking · Real-World Problem Solving</strong><p>I independently worked on a multi-role agricultural marketplace designed around farmer verification, customer purchasing, fertilizer selling, delivery and administration workflows.</p></div>
        <div class="learning-project"><span class="project-index">02</span><h4>Rangam Saree Silks</h4><strong>Full-Stack E-Commerce · Authentication · APIs · Orders · Payments · Deployment</strong><p>This project helped me work on the complete relationship between a customer-facing frontend and backend application logic.</p></div>
        <div class="learning-project"><span class="project-index">03</span><h4>Tata 1mg Collaborative Project</h4><strong>Teamwork · Backend Contribution · Feedback · Rebuilding · Collaboration</strong><p>The first project version was rejected during review. The team analysed feedback, improved the implementation and rebuilt the project.</p></div>
      </div>
    </article>

    <div class="readiness-grid">
      <article class="journey-card readiness-card"><span class="journey-label">CODING & DSA</span><h3>Continuous problem solving</h3><p>Java coding practice and algorithmic problem solving remain a core part of my preparation.</p></article>
      <article class="journey-card readiness-card"><span class="journey-label">SOFTWARE PROJECTS</span><h3>Complete applications</h3><p>AgroConnect 2.0, Rangam Saree Silks and the Tata 1mg collaborative project are the current project foundation.</p></article>
      <article class="journey-card readiness-card"><span class="journey-label">FULL-STACK DEVELOPMENT</span><h3>Frontend + backend</h3><p>React, Next.js, Node.js, Express.js, MongoDB and REST APIs are represented in my project work.</p></article>
    </div>

    <div class="readiness-list">
      <div class="readiness-item"><strong>Backend Engineering</strong><span>API development · Authentication · Authorization · Orders · Payments · Notifications · Application Logic</span></div>
      <div class="readiness-item"><strong>Git & Collaboration</strong><span>Git · GitHub · Branches · Commits · Integration · Debugging · Collaborative Development</span></div>
      <div class="readiness-item"><strong>Communication</strong><span>Communication score 8 and experience discussing projects and responding to technical feedback.</span></div>
      <div class="readiness-item"><strong>Professional Mindset</strong><span>Build → Fail → Debug → Learn → Rebuild → Improve</span></div>
    </div>

    <article class="journey-card journey-goal">
      <div><span class="journey-label">CURRENT GOAL</span><h3>Secure a paid software engineering internship where I can <em>contribute and learn.</em></h3><p>I want to contribute to real production work, strengthen my Java, backend and full-stack engineering skills, and learn professional software development practices from an experienced engineering team.</p></div>
      <div class="focus"><strong>PRIMARY FOCUS</strong><span>Java · DSA · Backend Development · Full-Stack Development · Software Product Engineering</span><div class="journey-disclaimer">Placement-cycle eligibility is determined according to Kalvium's current academic, coding and professional-readiness requirements.</div></div>
    </article>

    <article class="journey-card mindset">
      <span class="journey-label">ENGINEERING MINDSET</span>
      <h3>I am not only learning how to code. I am learning how to <em>identify problems, build products, collaborate and improve.</em></h3>
      <p>My goal is to become capable of identifying a real problem, understanding the people and workflow involved, designing a practical solution, building it, testing it, receiving feedback and improving the product.</p>
      <div class="mindset-flow"><span>Problem</span><i>→</i><span>Understand</span><i>→</i><span>Design</span><i>→</i><span>Build</span><i>→</i><span>Test</span><i>→</i><span>Feedback</span><i>→</i><span>Improve</span></div>
    </article>
  `;

  experience.parentNode.insertBefore(section, experience);
});

// Existing 3D project interaction: pointer-only, never a scroll/render loop.
const canHover = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canHover && !reduceMotion) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${y * -2.8}deg) rotateY(${x * 3.2}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
