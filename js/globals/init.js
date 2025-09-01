import { initAOS } from '../core/aos-init.js';
import { $, $$, on, cssvar } from '../core/dom.js';

// Header yükseklik ayarı
function setHeaderVars() {
  const header = $('.header');
  if (!header) return;
  const h = header.offsetHeight;
  cssvar('--header-h', h + 'px');
}

// Scroll'da header
function onScroll() {
  const header = $('.header');
  if (!header) return;

  if (window.scrollY > 4) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Hamburger - Nav - Dropdown
function navSetup() {
  const hamburger = $('.hamburger');
  const navMenu = $('.nav-menu');
  const closeIcon = $('.close-icon');
  const menuIcon = $('.menu-icon');
  const dropdownBtn = $('.dropdown-btn');
  const dropdownContent = $('#dropdown-menu');
  const mqDesktop = window.matchMedia('(min-width: 48em)');

  const openNav = () => {
    if (!navMenu || !hamburger) return;

    navMenu.classList.add('showMenu');
    hamburger.setAttribute('aria-expanded', 'true');
    if (closeIcon) closeIcon.style.display = 'block';
    if (menuIcon) menuIcon.style.display = 'none';
    document.body.classList.add('no-scroll');
  };

  const closeNav = () => {
    if (!navMenu || !hamburger) return;

    navMenu.classList.remove('showMenu');
    hamburger.setAttribute('aria-expanded', 'false');
    if (closeIcon) closeIcon.style.display = 'none';
    if (menuIcon) menuIcon.style.display = 'block';
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    if (!navMenu) return;

    if (navMenu.classList.contains('showMenu')) {
      closeNav();
    } else {
      openNav();
    }
  };

  on(hamburger, 'click', toggleMenu);

  // Menu dışına tıklanınca kapanıyor
  document.addEventListener('click', (e) => {
    if (!navMenu || !hamburger) return;

    const insideMenu = navMenu.contains(e.target);
    const onHamburger = hamburger.contains(e.target);

    if (!insideMenu && !onHamburger) {
      closeNav();
      closeDropdown();
    }
  });

  // Escape
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      closeDropdown();
    }
  });

  $$('.nav-menu li:not(.dropdown)').forEach((li) => on(li, 'click', closeNav));

  const openDropdown = () => {
    if (!dropdownContent || !dropdownBtn) return;
    dropdownContent.classList.add('open');
    dropdownBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDropdown = () => {
    if (!dropdownContent || !dropdownBtn) return;
    dropdownContent.classList.remove('open');
    dropdownBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleDropdown = (e) => {
    if (!dropdownContent || !dropdownBtn) return;
    const isDesktop = mqDesktop.matches;
    if (isDesktop) return;
    e.preventDefault();
    if (dropdownContent.classList.contains('open')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  on(dropdownBtn, 'click', toggleDropdown);

  on(mqDesktop, 'change', () => {
    closeNav();
    closeDropdown();
  });
}

// Animation - product cards
const revealSetup = () => {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('in-view', 'show'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view', 'show');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );

  els.forEach((el) => io.observe(el));
};

// Footer dinamik yıl
const footerYear = () => {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

// Yukarı butonu
const toTopSetup = () => {
  const btn = $('.to-top');
  if (!btn) return;

  // Ensure fixed positioning isn't broken by transformed ancestors
  if (btn.parentElement !== document.body) {
    document.body.appendChild(btn);
  }

  const toogle = () => {
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
  };

  on(window, 'scroll', toogle);
  toogle();
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

export function initGlobals() {
  on(document, 'DOMContentLoaded', setHeaderVars);
  on(window, 'load', setHeaderVars);
  on(window, 'resize', setHeaderVars);
  on(window, 'scroll', onScroll);

  initAOS();
  navSetup();
  revealSetup();
  footerYear();
  toTopSetup();
}
