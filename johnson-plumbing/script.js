/* ============================================================
   Johnson's Plumbing & Drain Services — Main Script
   ============================================================ */

(function () {
  'use strict';

  // ─── Navbar scroll shadow ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Mobile hamburger ──────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ─── Active nav link ───────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── Scroll-in animations ──────────────────────────────────
  const animateEls = document.querySelectorAll(
    '.feature-card, .service-card, .testimonial-card, .service-item, ' +
    '.trust-card, .stat-block, .info-item'
  );

  if ('IntersectionObserver' in window && animateEls.length) {
    // Set initial state
    animateEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.08}s, transform 0.45s ease ${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animateEls.forEach(el => observer.observe(el));
  }

  // ─── Counter animation ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();

          const tick = now => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => countObserver.observe(el));
  }

  // ─── Contact form ──────────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const btn = form.querySelector('.form-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate submission (no real backend)
      setTimeout(() => {
        const successEl = document.querySelector('.form-success');
        if (successEl) {
          form.style.display = 'none';
          successEl.style.display = 'block';
        } else {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#22c55e';
          btn.style.borderColor = '#22c55e';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            form.reset();
          }, 3500);
        }
      }, 1200);
    });
  }

  // ─── Smooth scroll for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Google Reviews Carousel ───────────────────────────────
  (function () {
    const track    = document.getElementById('reviewsTrack');
    const prevBtn  = document.getElementById('reviewsPrev');
    const nextBtn  = document.getElementById('reviewsNext');
    const dotsWrap = document.getElementById('reviewsDots');
    if (!track) return;

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.rdot')) : [];

    function stepWidth() {
      const card = track.querySelector('.google-review-card');
      if (!card) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    }

    function updateState() {
      const step = stepWidth();
      if (!step) return;
      const idx = Math.round(track.scrollLeft / step);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.offsetWidth - 2;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: stepWidth(), behavior: 'smooth' });
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        track.scrollTo({ left: stepWidth() * i, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    updateState();
  })();

})();
