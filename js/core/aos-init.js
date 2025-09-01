/* global AOS */
export function initAOS() {
  if (!window.AOS) {
    console.error('AOS yok (CDN sırası yanlış)');
    return;
  }

  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });

  window.addEventListener('load', () => AOS.refresh());
}
