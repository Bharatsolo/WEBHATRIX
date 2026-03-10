/* ═══════════════════════════════════════════
   WEBHATRIX — SHARED COMPONENTS (Navbar + Footer + WhatsApp + Overlay + New Features)
   Injected on every page via JS
   ═══════════════════════════════════════════ */

(function () {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  function linkClass(page) {
    return currentPage === page ? 'class="active"' : '';
  }

  /* ── Page Transition Overlay (fade-based) ── */
  const overlay = document.createElement('div');
  overlay.id = 'pg-overlay';
  overlay.innerHTML = `
    <img src="images/Webhatrix Logo.jpg" alt="Webhatrix Logo" class="pg-logo" style="max-height: 100px; border-radius: 12px; margin-bottom: 24px;">
    <div class="pg-logo">WEBHATRIX</div>
  `;
  document.body.prepend(overlay);

  /* ── Scroll Progress Bar ── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  /* ── Grain Canvas ── */
  const grainCanvas = document.createElement('canvas');
  grainCanvas.id = 'grain';
  document.body.appendChild(grainCanvas);

  /* ── Navbar ── */
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';
  nav.innerHTML = `
    <a href="index.html" class="nav-logo glitch" data-text="WEBHATRIX">WEBHA<span>TRIX</span></a>
    <div class="nav-links">
      <a href="index.html" ${linkClass('index.html')}>Home</a>
      <a href="about.html" ${linkClass('about.html')}>About</a>
      <a href="process.html" ${linkClass('process.html')}>Process</a>
      <a href="work.html" ${linkClass('work.html')}>Work</a>
      <a href="blog.html" ${linkClass('blog.html')}>Blog</a>
      <a href="contact.html" ${linkClass('contact.html')}>Contact</a>
    </div>
    <div class="nav-actions">
      <button id="theme-toggle" class="theme-btn" title="Toggle theme">🌙</button>
      <a href="quote.html" class="nav-cta"><span>Start Project →</span></a>
      <div class="menu-toggle" id="menuToggle">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  document.body.prepend(nav);

  /* ── Mobile Menu ── */
  const mob = document.createElement('div');
  mob.className = 'mobile-menu';
  mob.id = 'mobileMenu';
  mob.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="process.html">Process</a>
    <a href="work.html">Work</a>
    <a href="blog.html">Blog</a>
    <a href="contact.html">Contact</a>
    <a href="quote.html" class="btn btn-primary" style="margin-top:1rem"><span>Start Project →</span></a>
  `;
  document.body.prepend(mob);

  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach((a, i) => {
    a.style.transitionDelay = `${i * 80}ms`;
  });

  /* ── Back to Top Button ── */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>`;
  document.body.appendChild(btt);

  /* ── Footer ── */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo" style="font-size:1.3rem">WEBHA<span>TRIX</span></a>
        <p>We Build. We Scale. We Deliver.</p>
        <div class="footer-socials">
          <a href="#" aria-label="LinkedIn" title="LinkedIn"><span>in</span></a>
          <a href="#" aria-label="GitHub" title="GitHub"><span>GH</span></a>
          <a href="#" aria-label="Twitter" title="Twitter"><span>𝕏</span></a>
          <a href="#" aria-label="Instagram" title="Instagram"><span>IG</span></a>
        </div>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="services.html"><span>Web Development</span></a></li>
          <li><a href="services.html"><span>Mobile Apps</span></a></li>
          <li><a href="services.html"><span>UI/UX Design</span></a></li>
          <li><a href="services.html"><span>SaaS & Cloud</span></a></li>
          <li><a href="services.html"><span>E-Commerce</span></a></li>
          <li><a href="services.html"><span>AI & Automation</span></a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="about.html"><span>About Us</span></a></li>
          <li><a href="process.html"><span>Our Process</span></a></li>
          <li><a href="work.html"><span>Portfolio</span></a></li>
          <li><a href="blog.html"><span>Blog</span></a></li>
          <li><a href="contact.html"><span>Contact</span></a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:hello@webhatrix.com"><span>hello@webhatrix.com</span></a></li>
          <li><a href="tel:+91XXXXXXXXXX"><span>+91 XXXXX XXXXX</span></a></li>
          <li><a href="quote.html"><span>Get a Quote</span></a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Webhatrix Technologies. All rights reserved.</span>
      <span>Built with Passion. Delivered with Precision.</span>
    </div>
  `;
  document.body.appendChild(footer);

  /* ── WhatsApp Floating Button ── */
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/91XXXXXXXXXX?text=Hi%20Webhatrix!%20I%20have%20a%20project%20to%20discuss.';
  wa.target = '_blank';
  wa.className = 'whatsapp-float';
  wa.title = 'Chat on WhatsApp';
  wa.innerHTML = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16.002c0 3.502 1.14 6.742 3.07 9.37L1.058 31.34l6.196-2.04A15.92 15.92 0 0 0 16.004 32C24.826 32 32 24.826 32 16.002S24.826 0 16.004 0zm9.318 22.614c-.39 1.1-1.932 2.012-3.172 2.278-.85.18-1.96.322-5.694-1.224-4.78-1.978-7.856-6.83-8.094-7.148-.228-.318-1.918-2.554-1.918-4.87 0-2.318 1.214-3.456 1.644-3.926.39-.428.914-.578 1.2-.578.15 0 .318 0 .468.01.43.018.644.042.928.718.356.844 1.218 2.978 1.328 3.196.108.218.218.508.068.808-.138.308-.258.498-.478.768-.218.268-.458.598-.648.798-.218.238-.448.498-.188.938.258.428 1.148 1.888 2.468 3.058 1.698 1.508 3.128 1.978 3.568 2.198.428.218.688.188.948-.108.268-.308 1.138-1.318 1.438-1.768.298-.448.608-.378.998-.228.398.148 2.508 1.188 2.938 1.398.428.218.718.318.828.508.108.188.108 1.088-.282 2.174z"/></svg><span class="wa-tooltip">Chat with us!</span>`;
  document.body.appendChild(wa);

  /* ── Navbar scroll — NO scroll listener here; handled by master loop in main.js ── */

  /* ── Theme Toggle ── */
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('webhatrix-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeBtn.textContent = '☀️';
  }
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('webhatrix-theme', isLight ? 'light' : 'dark');
  });

  /* ── Page Transitions (fade overlay) ── */
  // On page load: overlay starts opaque, fades to transparent
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('transparent');
      });
    });
  });

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me') || link.target === '_blank') return;
    if (!href.endsWith('.html')) return;
    e.preventDefault();
    // Close mobile menu if open
    if (menu.classList.contains('open')) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.classList.remove('transparent'); // fade to black
    overlay.classList.add('show-logo');      // show logo briefly
    setTimeout(() => {
      window.location.href = href;
    }, 380);
  });
})();
