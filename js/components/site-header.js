class SiteHeader extends HTMLElement {
  connectedCallback() {
    // Light DOM: mevcut CSS sınıfların aynen çalışır
    this.innerHTML = `
      <header class="header" role="banner" data-aos="fade-down">
      <nav class="navbar container" aria-label="Ana menü">
        <a class="logo" href="./">Ayvalık Optik</a>

        <ul class="nav-menu" id="primary-nav">
          <li>
            <a href="./" class="nav-link">Anasayfa</a>
          </li>
          <li>
            <a href="about.html" class="nav-link">Hakkımızda</a>
          </li>
          <li class="dropdown">
            <a
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="dropdown-menu"
              href="#"
              class="dropdown-btn"
              >Markalar <i class="fa fa-caret-down" aria-hidden="true"></i
            ></a>
            <ul class="dropdown-content" id="dropdown-menu">
              <li>
                <a href="glasses.html">Gözlük Camları</a>
              </li>
              <li>
                <a href="frames.html">Güneş ve Optik Çerçeveler</a>
              </li>
              <li><a href="lens.html">Lensler</a></li>
            </ul>
          </li>
          <li>
            <a href="gallery.html" class="nav-link">Galeri</a>
          </li>
          <li>
            <a href="contact.html" class="nav-link">İletişim</a>
          </li>
        </ul>

        <button
          class="hamburger"
          aria-controls="primary-nav"
          aria-expanded="false"
          aria-label="Menüyü aç/kapat"
        >
          <i class="menu-icon material-icons" aria-hidden="true">menu</i>
          <i class="close-icon material-icons" aria-hidden="true">close</i>
        </button>
      </nav>
    </header>
    `;
    // Aktif link
    const page = document.body.dataset.page || '';
    this.querySelectorAll('[data-nav]').forEach((a) => {
      if (a.dataset.nav === page) a.classList.add('active');
    });
  }
}

customElements.define('site-header', SiteHeader);
