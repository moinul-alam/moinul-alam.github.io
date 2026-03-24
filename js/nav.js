/* ============================================================
   nav.js — Navbar Injection & Behavior
   Handles: component injection, scroll state, mobile toggle,
            active link highlighting
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     INJECT NAVBAR COMPONENT
  ---------------------------------------------------------- */

  async function injectNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
      const response = await fetch('/components/navbar.html');
      if (!response.ok) throw new Error('Failed to load navbar');
      const html = await response.text();
      placeholder.outerHTML = html;

      // Init behaviors after injection
      initScrollBehavior();
      initMobileToggle();
      initActiveLinks();
    } catch (err) {
      console.warn('Navbar injection failed:', err);
    }
  }


  /* ----------------------------------------------------------
     SCROLL BEHAVIOR — adds .scrolled class to navbar
  ---------------------------------------------------------- */

  function initScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 60;

    function onScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }


  /* ----------------------------------------------------------
     MOBILE TOGGLE — hamburger open/close
  ---------------------------------------------------------- */

  function initMobileToggle() {
    const toggle = document.querySelector('.navbar__toggle');
    const links  = document.querySelector('.navbar__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      links.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when a nav link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }


  /* ----------------------------------------------------------
     ACTIVE LINK — highlights nav link based on scroll position
  ---------------------------------------------------------- */

  function initActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px', // trigger when section is in middle of viewport
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));
  }


  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', injectNavbar);

})();