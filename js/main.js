/* ============================================================
   main.js — General Interactions & Scroll Animations
   Handles: scroll reveal, smooth anchor scrolling, misc init
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     SCROLL REVEAL
     Observes elements with .reveal class and toggles .visible
  ---------------------------------------------------------- */

  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once only
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(el => observer.observe(el));
  }


  /* ----------------------------------------------------------
     STAGGERED REVEAL
     Elements with .reveal-group get children animated in
     sequence via CSS animation-delay
  ---------------------------------------------------------- */

  function initStaggeredReveal() {
    const groups = document.querySelectorAll('.reveal-group');
    if (!groups.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.reveal-item');
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, i * 100); // 100ms stagger between each item
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    groups.forEach(group => observer.observe(group));
  }


  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL
     Offset accounts for fixed navbar height
  ---------------------------------------------------------- */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 72;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      });
    });
  }


  /* ----------------------------------------------------------
     HERO TEXT FADE-IN
     Staggers hero elements on page load
  ---------------------------------------------------------- */

  function initHeroAnimation() {
    const heroEls = document.querySelectorAll('.hero__eyebrow, .hero__name, .hero__tagline, .hero__cta');
    heroEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;

      // Slight delay before triggering so browser registers initial state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }


  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStaggeredReveal();
    initSmoothScroll();
    initHeroAnimation();
  });

})();