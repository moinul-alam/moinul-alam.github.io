/* ============================================================
   components.js — Footer Injection & Section Interactions
   Handles: footer injection, contact form behavior
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     INJECT FOOTER COMPONENT
  ---------------------------------------------------------- */

  async function injectFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    try {
      const response = await fetch('/components/footer.html');
      if (!response.ok) throw new Error('Failed to load footer');
      const html = await response.text();
      placeholder.outerHTML = html;

      initFooterYear();
    } catch (err) {
      console.warn('Footer injection failed:', err);
    }
  }


  /* ----------------------------------------------------------
     FOOTER — dynamic copyright year
  ---------------------------------------------------------- */

  function initFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }


  /* ----------------------------------------------------------
     CONTACT FORM
     Basic client-side validation + Formspree submission
     Replace FORMSPREE_ENDPOINT with your actual endpoint
  ---------------------------------------------------------- */

  function initContactForm() {
    const form     = document.getElementById('contact-form');
    const status   = document.getElementById('form-status');
    if (!form) return;

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // <-- replace this

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = form.querySelector('[name="name"]').value.trim();
      const email   = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Disable submit during request
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
          showStatus('Message sent. Thank you for reaching out.', 'success');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        showStatus('Something went wrong. Please try again or email directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });

    function showStatus(msg, type) {
      if (!status) return;
      status.textContent = msg;
      status.className = `form-status ${type}`;
      setTimeout(() => {
        status.className = 'form-status';
      }, 5000);
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }


  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', () => {
    injectFooter();
    initContactForm();
  });

})();