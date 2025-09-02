class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header" role="banner" data-aos="fade-down">
      <nav class="navbar container" aria-label="Ana menü">
        <a class="logo" href="/">Ayvalık Optik</a>

        <ul class="nav-menu" id="primary-nav">
          <li>
            <a href="/" class="nav-link" data-nav="home">Anasayfa</a>
          </li>
          <li>
            <a href="/hakkimizda" class="nav-link" data-nav="about">Hakkımızda</a>
          </li>
          <li class="dropdown">
            <a
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="dropdown-menu"
              href="#"
              class="dropdown-btn"
              data-nav="brands"
              >Markalar <i class="fa fa-caret-down" aria-hidden="true"></i
            ></a>
            <ul class="dropdown-content" id="dropdown-menu">
              <li>
                <a href="/gozluk_camlari">Gözlük Camları</a>
              </li>
              <li>
                <a href="/cerceveler">Güneş ve Optik Çerçeveler</a>
              </li>
              <li><a href="/lensler">Lensler</a></li>
            </ul>
          </li>
          <li>
            <a href="/galeri" class="nav-link" data-nav="gallery">Galeri</a>
          </li>
          <li>
            <a href="/iletisim" class="nav-link" data-nav="contact">İletişim</a>
          </li>
        </ul>

        <button
          class="hamburger"
          aria-controls="primary-nav"
          aria-expanded="false"
          aria-label="Menüyü aç/kapat"
        >
          <i class="menu-icon fa-solid fa-bars fa-xl" aria-hidden="true"></i>
          <i class="close-icon fa-solid fa-xmark fa-xl" aria-hidden="true"></i>
        </button>
      </nav>
    </header>
    `;

    // Aktif link (pathname tabanlı)
    const normalize = (p) => {
      if (!p) return '/';
      // remove trailing slash except root
      return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
    };

    const path = normalize(window.location.pathname);
    const routeKeyMap = {
      '/': 'home',
      '/hakkimizda': 'about',
      '/markalar': 'brands',
      '/galeri': 'gallery',
      '/iletisim': 'contact',
      '/gozluk_camlari': 'brands',
      '/cerceveler': 'brands',
      '/lensler': 'brands',
    };

    const key = routeKeyMap[path];
    if (key) {
      const el = this.querySelector(`[data-nav="${key}"]`);
      if (el) el.classList.add('active');
    }
  }
}

customElements.define('site-header', SiteHeader);
