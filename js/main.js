import { initGlobals } from './globals/init.js';
import './components/site-header.js';
import './components/site-footer.js';

initGlobals();

const page = document.body.dataset.page;

(async () => {
  switch (page) {
    case 'home':
      (await import('./pages/home.js')).init?.();
      break;
    case 'gallery':
      (await import('./pages/gallery.js')).init?.();
      break;
    case 'brands':
      (await import('./pages/brands.js')).init?.();
      break;
    case 'contact':
      (await import('./pages/contact.js')).init?.();
      break;
    case 'about':
      (await import('./pages/about.js')).init?.();
      break;
    default:
      break;
  }
})();
