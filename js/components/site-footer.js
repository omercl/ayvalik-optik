class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer" aria-labelledby="footer-title" >
      <div class="container footer-grid">
        <!-- Brand / About -->
        <div class="footer-brand">
          <a class="logo footer-logo" href="/">Ayvalık Optik</a>
          <p class="footer-desc">
            En doğru cam ve çerçeve seçimleriyle, güvenilir danışmanlık
            eşliğinde net görüşü hayatınıza katıyoruz.
          </p>
          <ul class="social">
            <li>
              <a aria-label="Instagram" href="https://www.instagram.com/ayvalikoptik"
                  target="_blank" rel="noopener noreferrer"
                ><i class="fa-brands fa-instagram"></i
              ></a>
            </li>
            <li>
              <a aria-label="Facebook" href="https://www.facebook.com/ayvalikoptik"
                  target="_blank" rel="noopener noreferrer"
                ><i class="fa-brands fa-facebook"></i
              ></a>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <nav class="footer-links" aria-label="Hızlı Erişim">
          <h3 class="footer-col-title">Hızlı Erişim</h3>
          <ul>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/gozluk_camlari">Gözlük Camları</a></li>
            <li><a href="/cerceveler">Güneş ve Optik Çerçeveler</a></li>
            <li><a href="/lensler">Lensler</a></li>
            <li><a href="/galeri">Galeri</a></li>
            <li><a href="/iletisim">İletişim</a></li>
          </ul>
        </nav>

        <!-- Contact -->
        <div class="footer-contact">
          <h3 class="footer-col-title">Bize Ulaşın</h3>
          <ul class="contact-list">
            <li>
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              <span>FevziPaşa Mah. Muradiye Çarşısı No:10 Ayvalık / BALIKESİR</span>
            </li>
            <li>
              <i class="fa-solid fa-envelope" aria-hidden="true"></i>
              <a href="mailto:info@ayvalikoptik.com">info@ayvalikoptik.com</a>
            </li>
            <li>
              <i class="fa-solid fa-phone" aria-hidden="true"></i>
              <a href="tel:+902663126616">0 (266) 312 66 16</a>
            </li>
            <li>
              <i class="fa-solid fa-phone" aria-hidden="true"></i>
              <a href="tel:+905386677669">0 (538) 667 76 69</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-row">
          <p>© <span id="year"></span> Ayvalık Optik. Tüm hakları saklıdır.</p>
          <a class="designer" href="" rel="noopener">Designed by Ömer Çolak</a>
        </div>
        <button class="to-top" aria-label="Yukarı çık">
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </footer>
    `;
    const y = this.querySelector('#year');
    if (y) y.textContent = new Date().getFullYear();
  }
}
customElements.define('site-footer', SiteFooter);
