document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ============ HEADER: solid on scroll ============ */
  const header = document.getElementById('siteHeader');
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { targets: header, className: 'scrolled' }
  });

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ============ SCROLL PROGRESS BAR ============ */
  const bar = document.getElementById('scrollBar');
  if (bar) {
    gsap.to(bar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  if (prefersReduced) {
    gsap.set('.reveal-up, .reveal-line span', { opacity: 1, y: 0 });
    return;
  }

  /* ============ HERO: title lines + fade-in ============ */
  gsap.set('.reveal-line span', { yPercent: 110 });
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('.reveal-line span', {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.09
    })
    .to('.hero-inner .reveal-up', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12
    }, '-=0.5');

  /* ============ HERO GRAPHIC: parallax expand on scroll ============ */
  gsap.to('#heroGraphic', {
    scale: 1.35,
    y: 60,
    rotation: 4,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.to('.hero-bg-grid', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  /* ============ GENERIC REVEAL-UP (fade + rise on enter) ============ */
  document.querySelectorAll('.reveal-up').forEach((el) => {
    if (el.closest('.hero-inner')) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  /* ============ ABOUT: image expands smoothly as it enters ============ */
  gsap.fromTo('#aboutFrame',
    { scale: 0.82, opacity: 0.6 },
    {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 85%',
        end: 'top 25%',
        scrub: 1
      }
    }
  );

  /* ============ STAT COUNTERS ============ */
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val) + suffix; }
        });
      }
    });
  });

  /* ============ HOW IT WORKS: pinned horizontal scroll ============ */
  const howTrack = document.getElementById('howTrack');
  const howPin = document.getElementById('howPin');
  if (howTrack && howPin) {
    const setDistance = () => Math.max(0, howTrack.scrollWidth - window.innerWidth + 48);

    let scrollTween = gsap.to(howTrack, {
      x: () => -setDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: howPin,
        start: 'top top',
        end: () => `+=${setDistance() * 1.15}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.utils.toArray('.how-step').forEach((step) => {
      gsap.fromTo(step.querySelector('.how-step-visual'),
        { scale: 0.6, opacity: 0.3 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: step,
            containerAnimation: scrollTween,
            start: 'left 75%',
            end: 'left 35%',
            scrub: true
          }
        }
      );
    });
  }

  /* ============ PRODUCT CARDS: staggered expand-in ============ */
  gsap.utils.toArray('.product-card').forEach((card, i) => {
    gsap.fromTo(card,
      { scale: 0.85, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 4) * 0.06,
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  /* ============ SECTOR CARDS: scale up smoothly on scroll ============ */
  gsap.utils.toArray('.sector-card').forEach((card) => {
    gsap.to(card, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top 95%',
        end: 'top 55%',
        scrub: 1
      }
    });
  });
  gsap.set('.sector-card', { opacity: 0.4 });

  /* ============ COMPLIANCE BADGES ============ */
  gsap.utils.toArray('.badge-card').forEach((badge, i) => {
    gsap.fromTo(badge,
      { scale: 0.7, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        delay: (i % 2) * 0.08,
        scrollTrigger: {
          trigger: badge,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  /* ============ FINAL CTA: background expands (classic parallax zoom) ============ */
  gsap.fromTo('#finalCtaBg',
    { scale: 0.9 },
    {
      scale: 1.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.final-cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    }
  );

  /* ============ CONTACT FORM (placeholder handler) ============ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Formulario de ejemplo: conecta este envío a un backend, servicio de email o CRM antes de publicar la web.');
    });
  }
});
