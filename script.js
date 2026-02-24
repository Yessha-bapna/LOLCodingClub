/**
 * ============================================================
 * LOL CODING CLUB — script.js
 *
 * Footer is loaded dynamically from footer.html via fetch().
 * Requires a local server (VS Code Live Server, or
 * python -m http.server 8080 in the project folder).
 *
 * Features:
 *  1. Navbar scroll glass + shadow effect
 *  2. Hamburger / Mobile drawer toggle
 *  3. Mobile drawer closes on nav link click
 *  4. Smooth scrolling for anchor links
 *  5. Active nav link highlighting on scroll
 *  6. Scroll-to-top floating button
 *  7. Explore button toast notifications
 *  8. Newsletter form with email validation
 *  9. Scroll-reveal fade-in animations
 * 10. Quotes carousel (hero panel)
 * 11. Dynamic footer loading from footer.html
 * ============================================================
 */

"use strict";

/* ──────────────────────────────────────────────
   1. NAVBAR — SCROLL GLASS EFFECT
─────────────────────────────────────────────── */
function initNavbarScroll() {
  var navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ──────────────────────────────────────────────
   2. HAMBURGER / MOBILE DRAWER TOGGLE
─────────────────────────────────────────────── */
function initHamburger() {
  var hamburger = document.getElementById('hamburger-btn');
  var drawer    = document.getElementById('mobile-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

/* ──────────────────────────────────────────────
   3. MOBILE DRAWER — CLOSE ON LINK CLICK
─────────────────────────────────────────────── */
function initMobileDrawerClose() {
  var drawer    = document.getElementById('mobile-drawer');
  var hamburger = document.getElementById('hamburger-btn');
  if (!drawer) return;

  var links = drawer.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      drawer.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ──────────────────────────────────────────────
   4. SMOOTH SCROLLING (anchor links)
─────────────────────────────────────────────── */
function initSmoothScrolling() {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    var navHeight = 72;
    var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────
   5. ACTIVE NAV LINK HIGHLIGHTING
─────────────────────────────────────────────── */
function initActiveNavLink() {
  var sections = document.querySelectorAll('section[id]');

  // Sub-pages have no scroll sections — their active link is already
  // hardcoded in the HTML, so bail out and leave it untouched.
  if (sections.length === 0) return;

  var navLinks = document.querySelectorAll('.nav-link');
  var navHeight = 80;

  function update() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - navHeight - 40;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href') || '';
      if (href === '#' + current) {
        link.classList.add('active');
      }
      if ((href === 'index.html' || href === './') && (current === 'home' || current === '')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ──────────────────────────────────────────────
   6. SCROLL TO TOP BUTTON
─────────────────────────────────────────────── */
function initScrollTopButton() {
  var btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────
   7. EXPLORE BUTTON — TOAST INTERACTIONS
─────────────────────────────────────────────── */
function initExploreButtons() {
  var actions = {
    'xbtn-newsletter': '📧 Newsletter subscription coming soon!',
    'xbtn-blog':       '✍️ Blog submission portal opening soon!',
    'xbtn-suggestion': '💡 Suggestion box coming soon!',
    'xbtn-app':        '📱 LOL App download coming soon!'
  };

  Object.keys(actions).forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', function () {
        showToast(actions[id]);
      });
    }
  });
}

/* ──────────────────────────────────────────────
   8. NEWSLETTER FORM HANDLER
─────────────────────────────────────────────── */
function initNewsletterForm() {
  var form  = document.getElementById('footer-newsletter-form');
  var input = document.getElementById('footer-email-input');
  if (!form || !input) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = input.value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showToast('⚠️ Please enter a valid email address.', 'error');
      input.focus();
      return;
    }

    showToast('🎉 Subscribed! Welcome to LOL Club updates.');
    input.value = '';
  });
}

/* ──────────────────────────────────────────────
   9. SCROLL REVEAL ANIMATIONS
─────────────────────────────────────────────── */
function initScrollReveal() {
  var targets = document.querySelectorAll(
    '.hero-content, .hero-gallery, .cooking-left, .cooking-right, .feature-item, .gallery-card, .stat-item'
  );

  // Set initial hidden state
  targets.forEach(function (el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(30px)';
    el.style.transition = 'opacity 0.65s ease ' + (i * 0.04) + 's, transform 0.65s ease ' + (i * 0.04) + 's';
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback for old browsers
    targets.forEach(function (el) {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
}

/* ──────────────────────────────────────────────
   TOAST NOTIFICATION UTILITY
─────────────────────────────────────────────── */
function showToast(message, type) {
  var existing = document.getElementById('lol-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.id = 'lol-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '88px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(16px)',
    background:   type === 'error' ? '#1a0808' : '#141100',
    border:       '1px solid ' + (type === 'error' ? 'rgba(255,80,80,0.4)' : 'rgba(255,214,0,0.4)'),
    color:        type === 'error' ? '#ff8080' : '#FFD600',
    padding:      '13px 28px',
    borderRadius: '40px',
    fontSize:     '0.875rem',
    fontWeight:   '600',
    fontFamily:   '"Inter", sans-serif',
    zIndex:       '99999',
    opacity:      '0',
    transition:   'opacity 0.3s ease, transform 0.3s ease',
    whiteSpace:   'nowrap',
    boxShadow:    '0 8px 40px rgba(0,0,0,0.6)',
    pointerEvents:'none',
    letterSpacing:'0.2px'
  });

  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(function () {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function () { if (toast.parentNode) toast.remove(); }, 400);
  }, 3000);
}

/* ──────────────────────────────────────────────
   10. QUOTES SLIDER — hero panel
─────────────────────────────────────────────── */
function initQuotesSlider() {
  var slides    = document.querySelectorAll('.quote-slide');
  var dots      = document.querySelectorAll('.qdot');
  if (!slides.length || !dots.length) return;

  var current   = 0;
  var total     = slides.length;
  var autoTimer = null;

  function goTo(index) {
    // Exit current
    slides[current].classList.remove('active');
    slides[current].classList.add('exit');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    var exitEl = slides[current];
    setTimeout(function () { exitEl.classList.remove('exit'); }, 600);

    current = (index + total) % total;

    // Enter new
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // Dot click handlers
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-index'), 10);
      if (idx === current) return;
      stopAuto();
      goTo(idx);
      // Resume auto after 8s pause
      setTimeout(startAuto, 8000);
    });
  });

  startAuto();
}

/* ──────────────────────────────────────────────
   11. LOAD FOOTER FROM footer.html
─────────────────────────────────────────────── */
function loadFooter() {
  var container = document.getElementById('footer-container');
  if (!container) return;

  fetch('footer.html')
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load footer.html (' + res.status + ')');
      return res.text();
    })
    .then(function (html) {
      container.innerHTML = html;
      // Re-wire newsletter form inside the freshly injected footer
      initNewsletterForm();
      // Re-run scroll-reveal so footer elements animate in
      initScrollReveal();
    })
    .catch(function (err) {
      console.warn('Footer load failed:', err.message);
      console.warn('Open the page via Live Server or python -m http.server, not as file://');
    });
}

/* ──────────────────────────────────────────────
   INIT — Wire up everything on DOM ready
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  loadFooter();          // fetch & inject footer.html first
  initNavbarScroll();
  initHamburger();
  initMobileDrawerClose();
  initSmoothScrolling();
  initActiveNavLink();
  initScrollTopButton();
  initExploreButtons();
  initNewsletterForm();
  initScrollReveal();
  initQuotesSlider();

  console.log('%c LOL Coding Club 🚀 ', 'background:#FFD600;color:#080808;font-weight:900;padding:4px 8px;border-radius:4px;');
  console.log('%c Together, let\'s Learn Out Loud! ', 'color:#FFD600;font-style:italic;');
});
