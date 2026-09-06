const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  const countEl = document.getElementById('preCount');
  const barEl = document.getElementById('preBar');
  const counter = { val: 0 };

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: initPageAnimations,
  });

  tl.to('.preloader__mark path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' })
    .to('.preloader__word', { opacity: 1, duration: 0.5 }, '-=0.4')
    .to(counter, {
      val: 100,
      duration: 1.1,
      ease: 'power1.inOut',
      onUpdate: () => {
        countEl.textContent = Math.floor(counter.val);
      },
    }, '-=0.6')
    .to(barEl, { width: '100%', duration: 1.1, ease: 'power1.inOut' }, '<')
    .to(
      ['.preloader__mark', '.preloader__word', '.preloader__count', '.preloader__bar'],
      { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' },
      '+=0.15'
    )
    .to('#preloader', { opacity: 0, duration: 0.3 }, '-=0.1')
    .to('#curtain', { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.2')
    .set('#preloader', { display: 'none' })
    .set('#curtain', { display: 'none' })
    .add(() => {
      document.querySelector('.hero')?.classList.add('loaded');
    });
});

function initPageAnimations() {
  document.querySelectorAll('.section-head h2, .cta-box h2, .contact-copy h2').forEach((h) => {
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w) => `<span class="mask-line"><span>${w}</span></span>`).join(' ');
  });

  document.querySelectorAll('.section-head h2, .cta-box h2, .contact-copy h2').forEach((h) => {
    gsap.to(h.querySelectorAll('.mask-line span'), {
      y: '0%',
      duration: 0.9,
      stagger: 0.035,
      ease: 'power4.out',
      scrollTrigger: { trigger: h, start: 'top 88%' },
    });
  });

  gsap.to('.hero__headline .line span', {
    y: '0%',
    duration: 1,
    stagger: 0.12,
    ease: 'power4.out',
  });

  gsap.to('#heroSub', { opacity: 1, duration: 0.8, delay: 0.5, ease: 'power2.out' });
  gsap.to('#heroActions', { opacity: 1, duration: 0.8, delay: 0.65, ease: 'power2.out' });
  gsap.to('#heroMeta', { opacity: 1, duration: 0.8, delay: 0.8, ease: 'power2.out' });

  const buildTl = gsap.timeline({ delay: 0.35 });
  buildTl
    .fromTo(
      '#winBack',
      { opacity: 0, y: 26, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
    )
    .fromTo(
      '#winMid',
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
      '-=0.55'
    )
    .fromTo(
      '#winFront',
      { opacity: 0, y: 34, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' },
      '-=0.5'
    )
    .to(
      ['#buildLine1', '#buildLine2', '#buildLine3'],
      { strokeDashoffset: 0, duration: 0.9, stagger: 0.18, ease: 'power2.inOut' },
      '-=0.7'
    )
    .to(
      ['#buildNode1', '#buildNode2'],
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(2.4)' },
      '-=0.5'
    );

  gsap.fromTo(
    '.float-card--1',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, delay: 1.15, ease: 'power2.out' }
  );
  gsap.fromTo(
    '.float-card--2',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, delay: 1.35, ease: 'power2.out' }
  );

  if (!prefersReducedMotion) {
    gsap.to('#winFront', {
      y: -6,
      duration: 2.6,
      delay: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to('#winMid', {
      y: -4,
      duration: 3.1,
      delay: 2.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(['#buildNode1', '#buildNode2'], {
      scale: 1.3,
      opacity: 0.6,
      duration: 1.6,
      delay: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    const scene = document.getElementById('buildScene');
    if (scene && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const xTo = gsap.quickTo(scene, 'rotateY', { duration: 0.7, ease: 'power3.out' });
      const yTo = gsap.quickTo(scene, 'rotateX', { duration: 0.7, ease: 'power3.out' });
      scene.style.transformStyle = 'preserve-3d';

      scene.addEventListener('mousemove', (e) => {
        const r = scene.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xTo(px * 6);
        yTo(py * -6);
      });

      scene.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    }

    if (scene) {
      const hint = document.getElementById('buildHint');
      const nodes = Array.from(scene.querySelectorAll('.trail-node'));
      const cooldowns = new WeakMap();

      if (hint) {
        gsap.to(hint, { opacity: 1, duration: 0.8, delay: 2.4 });
        gsap.to(hint, { opacity: 0, duration: 0.8, delay: 6 });
      }

      const activateNode = (node) => {
        if (cooldowns.get(node)) return;
        cooldowns.set(node, true);
        if (hint) gsap.to(hint, { opacity: 0, duration: 0.4 });

        gsap.timeline()
          .to(node, {
            scale: 2.6,
            opacity: 1,
            backgroundColor: '#5B8DFF',
            boxShadow: '0 0 16px rgba(37,99,235,0.7), 0 0 0 5px rgba(91,141,255,0.14)',
            duration: 0.3,
            ease: 'back.out(3)',
          })
          .to(node, {
            scale: 1,
            opacity: 0.45,
            backgroundColor: 'rgba(255,255,255,0.16)',
            boxShadow: 'none',
            duration: 0.9,
            ease: 'power2.inOut',
            delay: 1.4,
          })
          .call(() => cooldowns.set(node, false));
      };

      const handlePointer = (clientX, clientY) => {
        const r = scene.getBoundingClientRect();
        nodes.forEach((node) => {
          const nx = r.left + (parseFloat(node.style.left) / 100) * r.width;
          const ny = r.top + (parseFloat(node.style.top) / 100) * r.height;
          const dist = Math.hypot(clientX - nx, clientY - ny);
          if (dist < 55) activateNode(node);
        });
      };

      scene.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
      scene.addEventListener(
        'touchmove',
        (e) => {
          if (e.touches && e.touches[0]) {
            handlePointer(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: true }
      );
    }
  }

  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  gsap.utils.toArray('.reveal-card').forEach((el) => {
    const groupSelector = '.services-grid, .why-grid, .pricing-grid, .testimonials-grid, .process-wrap, .faq-list, .portfolio-compact-grid';
    const items = el.matches(groupSelector) ? el.children : [el];
    gsap.fromTo(
      items,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  gsap.to('.about-grid', {
    opacity: 1,
    duration: 1.1,
    delay: 0.1,
    scrollTrigger: { trigger: '.about-visual', start: 'top 80%' },
  });

  gsap.fromTo(
    '.about-frame--main',
    { opacity: 0, x: 24 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-visual', start: 'top 80%' },
    }
  );

  gsap.to('.about-frame--accent', {
    opacity: 1,
    duration: 0.9,
    delay: 0.15,
    scrollTrigger: { trigger: '.about-visual', start: 'top 80%' },
  });

  gsap.fromTo(
    '.about-float',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: 0.3,
      scrollTrigger: { trigger: '.about-visual', start: 'top 80%' },
    }
  );

  ScrollTrigger.create({
    trigger: '#caseMedia',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.to('#caseCurtain', { scaleY: 0, duration: 1.1, ease: 'power4.inOut' });
      gsap.fromTo(
        '#caseMediaClip img',
        { scale: 1.15 },
        { scale: 1, duration: 1.4, ease: 'power3.out' }
      );
    },
  });

  gsap.to('#processFill', {
    height: '100%',
    ease: 'none',
    scrollTrigger: { trigger: '.process-wrap', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
  });

  if (!prefersReducedMotion) {
    gsap.to('.hero__visual', {
      y: 60,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    gsap.to('.hero__bg-glow', {
      y: 120,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
  }

  ScrollTrigger.refresh();
}

const navEl = document.getElementById('mainNav');
const progressFill = document.getElementById('progressFill');

lenis.on('scroll', ({ scroll, limit }) => {
  navEl.classList.toggle('is-scrolled', scroll > 40);
  const pct = limit > 0 ? (scroll / limit) * 100 : 0;
  progressFill.style.width = pct + '%';
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  document.body.classList.toggle('nav-open', isOpen);
  const icon = navToggle.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  })
);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    }
  });
});

document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-item__q');
  const answer = item.querySelector('.faq-item__a');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.faq-item__a').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('is-open');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('is-open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
    ScrollTrigger.refresh();
  });
});

if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !prefersReducedMotion && window.innerWidth > 1024) {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  const dotX = gsap.quickTo(cursorDot, 'x', { duration: 0.12, ease: 'power2.out' });
  const dotY = gsap.quickTo(cursorDot, 'y', { duration: 0.12, ease: 'power2.out' });
  const ringX = gsap.quickTo(cursorRing, 'x', { duration: 0.4, ease: 'power3.out' });
  const ringY = gsap.quickTo(cursorRing, 'y', { duration: 0.4, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  document.querySelectorAll('a, button, .btn').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-link'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-link'));
  });

  const caseMedia = document.getElementById('caseMedia');
  if (caseMedia) {
    caseMedia.addEventListener('mouseenter', () => cursorRing.classList.add('is-view'));
    caseMedia.addEventListener('mouseleave', () => cursorRing.classList.remove('is-view'));
  }

  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button').forEach((el) => (el.style.cursor = 'none'));
}

if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !prefersReducedMotion && window.innerWidth > 1024) {
  document.querySelectorAll('.btn').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });

    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * 0.28);
      yTo(relY * 0.45);
    });

    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  document.querySelectorAll('.why-card, .service-card').forEach((card) => {
    const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });
    const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
    card.style.transformPerspective = 800;

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
      rotY((px - 0.5) * 6);
      rotX((py - 0.5) * -6);
    });

    card.addEventListener('mouseleave', () => {
      rotY(0);
      rotX(0);
    });
  });

  document.querySelectorAll('.case-study, .testimonial-card, .pricing-card, .portfolio-card').forEach((card) => {
    const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.7, ease: 'power3.out' });
    const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.7, ease: 'power3.out' });
    card.style.transformPerspective = 1000;

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 2.4);
      rotX(py * -2.4);
    });

    card.addEventListener('mouseleave', () => {
      rotY(0);
      rotX(0);
    });
  });
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const business = document.getElementById('business').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const projectType = document.getElementById('projectType').value;
  const budget = document.getElementById('budget').value;
  const message = document.getElementById('message').value.trim();

  const lines = [
    'Hello Zenith Web 👋',
    '',
    "I'd like to discuss a project.",
    '',
    'Name:',
    fullName,
    '',
    'Email:',
    email,
    '',
    'Business:',
    business || '—',
    '',
    'Phone:',
    phone,
    '',
    'Project Type:',
    projectType,
    '',
    'Budget:',
    budget,
    '',
    'Project Details:',
    message || '—',
    '',
    'Looking forward to hearing from you.',
  ];

  const whatsappMessage = encodeURIComponent(lines.join('\n'));
  const whatsappURL = 'https://wa.me/2347084007921?text=' + whatsappMessage;

  window.open(whatsappURL, '_blank', 'noopener');

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = 'Send Project Details <i class="fa-brands fa-whatsapp"></i>';
  }, 2000);
});

document.getElementById('footerYear').textContent =
  '© ' + new Date().getFullYear() + ' Zenith Web. All Rights Reserved.';