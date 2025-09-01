// Sıfırdan: bağımsız küçük yardımcılar
const $ = (sel, root = document) => root.querySelector(sel);
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

import { BRANDS } from '../data/brands-data.js';

function textLogo(name = '?') {
  const original = String(name || '?');
  const safe = original.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // özel uppercase: tüm i/ı → I
  const upper = original.replace(/[iı]/g, 'I').toUpperCase('en-US');

  const cls =
    upper.length > 12 ? 'brand-name xlong' : upper.length > 9 ? 'brand-name long' : 'brand-name';

  return `<span class="${cls}" aria-label="${safe}">${upper}</span>`;
}

function cardTemplate(item) {
  const safeName = String(item.name || '?')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;');
  return `
    <article class="brand-card reveal" role="listitem" aria-label="${safeName}">
      <div class="brand-media">
        ${textLogo(item.name)}
      </div>
    </article>
  `;
}

function render(list) {
  const grid = $('#brandsGrid');
  if (!grid) return;
  grid.innerHTML = list.map(cardTemplate).join('');
  setupReveal(grid);
}

function setupReveal(root) {
  const items = root.querySelectorAll('.brand-card.reveal');
  if (!items.length) return;

  items.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 80}ms`));

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    items.forEach((el) => {
      el.style.removeProperty('--reveal-delay');
      el.classList.add('reveal-in');
    });
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in');
          const t = getComputedStyle(e.target).transitionDuration || '0s';
          const d = getComputedStyle(e.target).transitionDelay || '0s';
          const dur = (parseFloat(t) || 0) * (t.includes('ms') ? 1 : 1000);
          const del = (parseFloat(d) || 0) * (d.includes('ms') ? 1 : 1000);
          setTimeout(() => e.target.style.removeProperty('--reveal-delay'), dur + del + 50);
          io.unobserve(e.target);
        }
      }
    },
    { root: null, rootMargin: '0px 0px 25% 0px', threshold: 0.01 },
  );
  items.forEach((el) => io.observe(el));
}

function filterByQuery(all, q) {
  const s = (q || '').trim().toLowerCase();
  if (!s) return all;
  return all.filter((b) => (b.name || '').toLowerCase().includes(s));
}

export function init() {
  const cat = document.body.dataset.category || 'glasses';
  const all = (BRANDS[cat] || []).slice();

  const input = $('#brandSearch');
  render(all);
  if (input) on(input, 'input', () => render(filterByQuery(all, input.value)));
}
