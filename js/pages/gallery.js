import { $, $$, on } from '../core/dom.js';

export function init() {
  // Config
  const TOTAL = 40;
  const PER_PAGE = 8;
  const BASE = '/assets/images/gallery/';
  const NAME = 'gallery-';
  const EXT = '.webp';
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  // DOM
  const grid = $('#gallery-grid');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const nums = $('#nums');
  if (!grid || !prevBtn || !nextBtn || !nums) return;

  // State
  const PAGES = Math.max(1, Math.ceil(TOTAL / PER_PAGE));
  let page = 1;
  let currentIndexOnPage = -1;

  // Helpers
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const drawPager = () => {
    const html = Array.from({ length: PAGES }, (_, i) => {
      const n = i + 1;
      return `<button class="pg-num${n === page ? ' active' : ''}" data-page="${n}">${n}</button>`;
    }).join('');
    nums.innerHTML = html;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === PAGES;
  };

  const renderPage = (p) => {
    const start = (p - 1) * PER_PAGE + 1;
    const end = Math.min(p * PER_PAGE, TOTAL);
    const ids = range(start, end);

    grid.innerHTML = ids
      .map((i) => {
        const src = `${BASE}${NAME}${i}${EXT}`;
        return `
          <figure class="card" data-src="${src}" data-i="${i}">
            <img class="thumb" src="${src}" alt="Galeri ${i}" loading="lazy" decoding="async" referrerpolicy="no-referrer" fetchpriority="low">
          </figure>`;
      })
      .join('');
  };

  const go = (n) => {
    page = clamp(n, 1, PAGES);
    renderPage(page);
    drawPager();
  };

  on(prevBtn, 'click', () => {
    go(page - 1);
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  on(nextBtn, 'click', () => {
    go(page + 1);
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  on(nums, 'click', (e) => {
    const btn = e.target.closest('.pg-num');
    if (!btn) return;
    const n = Number(btn.dataset.page);
    if (Number.isFinite(n)) {
      go(n);
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Hatalı img sil
  grid.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (img.matches?.('img.thumb')) img.closest('figure')?.remove();
    },
    true,
  );

  // Lightbox
  const lb = $('#lb');
  const lbImg = $('#lbImg');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');

  const openLBAt = (idxOnPage) => {
    const cards = $$('.card', grid);
    if (!cards.length) return;

    currentIndexOnPage = clamp(idxOnPage, 0, cards.length - 1);
    const src = cards[currentIndexOnPage]?.dataset.src;
    if (!src) return;

    lbImg.src = src;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const prevIdx = (currentIndexOnPage - 1 + cards.length) % cards.length;
    const nextIdx = (currentIndexOnPage + 1) % cards.length;
    [prevIdx, nextIdx].forEach((i) => {
      const s = cards[i]?.dataset.src;
      if (!s) return;
      const pre = new Image();
      pre.src = s;
    });
  };

  const closeLB = () => {
    lb?.classList.remove('open');
    lb?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = BLANK;
    currentIndexOnPage = -1;
  };

  const step = (dir) => {
    const cards = $$('.card', grid);
    if (!cards.length || currentIndexOnPage < 0) return;
    currentIndexOnPage = (currentIndexOnPage + dir + cards.length) % cards.length;
    lbImg.src = cards[currentIndexOnPage].dataset.src;
  };

  on(grid, 'click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const cards = $$('.card', grid);
    const idx = cards.indexOf(card);
    if (idx >= 0) openLBAt(idx);
  });

  on(lbClose, 'click', closeLB);

  on(lb, 'click', (e) => {
    const isBackdrop = e.target === lb || e.target.classList.contains('lb-backdrop');
    const isInsideBox = !!e.target.closest('.lb-box');
    const isOnControls = !!e.target.closest('.lb-img, .lb-btn, lb-close');
    if (isBackdrop || (isInsideBox && !isOnControls)) closeLB();
  });

  on(lbPrev, 'click', () => step(-1));
  on(lbNext, 'click', () => step(1));
  window.addEventListener(
    'keydown',
    (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    },
    { passive: true },
  );

  go(1);
}
