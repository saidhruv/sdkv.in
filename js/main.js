/* Main — topbar, theme toggle, mobile nav, copy-email, orchestration. */
const Main = (() => {
  const THEMES = ['system', 'light', 'dark'];
  const LABELS = { system: 'Theme: follow system', light: 'Theme: light', dark: 'Theme: dark' };

  function announce(msg) {
    const live = document.getElementById('live-region');
    if (live) live.textContent = msg;
  }

  function currentMode() { return document.documentElement.dataset.themeMode || 'system'; }

  // The actually-rendered scheme: explicit override, else the OS preference.
  function resolvedScheme() {
    const mode = currentMode();
    if (mode === 'light' || mode === 'dark') return mode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // "SD" in Italiana, outlined to vector paths (a data-URI favicon can't load a webfont).
  // Split into the two letters so each can be animated independently.
  const S_PATH = 'M12.99 7.87L12.89 8.12Q10.57 7.23 8.52 7.23Q6.46 7.23 5.32 8.10Q4.17 8.96 4.17 10.49L4.17 10.49Q4.17 12.35 6.11 13.37L6.11 13.37Q6.97 13.81 8.01 14.18Q9.04 14.55 10.08 15.01Q11.13 15.46 12.00 16.05Q12.86 16.64 13.40 17.67Q13.93 18.70 13.93 20.30Q13.93 21.89 13.04 23.01Q12.15 24.13 10.89 24.53Q9.63 24.92 7.94 24.92L7.94 24.92Q4.81 24.92 2.59 23.37L2.59 23.37L2.72 23.16Q3.56 23.83 4.90 24.25Q6.24 24.67 7.64 24.67L7.64 24.67Q9.70 24.67 11.17 23.71Q12.63 22.76 12.63 20.90L12.63 20.90Q12.63 18.86 10.70 17.71L10.70 17.71Q9.83 17.20 8.80 16.76Q7.76 16.33 6.72 15.86Q5.67 15.39 4.81 14.80L4.81 14.80Q2.87 13.53 2.87 11.18L2.87 11.18Q2.87 9.32 4.12 8.16Q5.37 7 7.88 7Q10.39 7 12.99 7.87L12.99 7.87Z';
  const D_PATH = 'M16.61 7.08L18.65 7.08Q19.77 7.03 20.86 7.03Q21.94 7.03 23.15 7.25Q24.36 7.48 25.55 8.11Q26.73 8.73 27.56 9.72Q28.39 10.70 28.90 12.30Q29.41 13.91 29.41 16.20Q29.41 18.50 28.66 20.32Q27.91 22.14 26.61 23.11L26.61 23.11Q24.08 25.00 20.51 25.00L20.51 25.00Q19.26 25.00 17.89 24.90L17.89 24.90L16.61 24.90L16.61 7.08ZM18.73 7.36L18.73 24.69Q19.26 24.75 20.08 24.75Q20.90 24.75 21.30 24.72Q21.71 24.69 22.42 24.50Q23.14 24.31 23.75 23.98Q24.36 23.65 25.04 23.00Q25.71 22.35 26.20 21.46L26.20 21.46Q27.29 19.37 27.29 16L27.29 16Q27.29 13.60 26.71 11.86Q26.12 10.11 25.37 9.27Q24.62 8.43 23.55 7.93Q22.48 7.43 21.84 7.36Q21.20 7.28 20.36 7.28Q19.52 7.28 18.73 7.36L18.73 7.36Z';

  // Sequenced loop: S fades in, then D, both hold 10s, then both fade out over 5s — repeat.
  // Driven by setInterval (not rAF) so it keeps animating in a backgrounded tab; phase is
  // computed from wall-clock time, so background throttling just lowers the frame rate.
  const FAV_FRAME_MS = 70;                       // ~14fps when foreground; ~1fps when throttled
  const FAV_S_IN = 1200;                         // S fade-in (ms)
  const FAV_D_IN = 1200;                         // D fade-in, after S
  const FAV_HOLD = 10000;                        // both fully visible
  const FAV_OUT = 5000;                          // both fade out
  const FAV_CYCLE = FAV_S_IN + FAV_D_IN + FAV_HOLD + FAV_OUT;
  let faviconSOp = 0, faviconDOp = 0;
  let faviconTimer = null, faviconStart = 0;

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Smoothstep — gentle ease in and out.
  function favEase(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function setFavicon() {
    const link = document.getElementById('favicon');
    if (!link) return;
    const dark = resolvedScheme() === 'dark';
    const bg = dark ? '#111113' : '#f3efe7';     // charcoal / paper
    const fg = dark ? '#f4f4f5' : '#16140f';     // SD on each bg
    const sOp = reducedMotion() ? 1 : faviconSOp;
    const dOp = reducedMotion() ? 1 : faviconDOp;
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" fill="' + bg + '"/>' +
      '<path fill="' + fg + '" fill-opacity="' + sOp.toFixed(3) + '" d="' + S_PATH + '"/>' +
      '<path fill="' + fg + '" fill-opacity="' + dOp.toFixed(3) + '" d="' + D_PATH + '"/>' +
      '</svg>';
    link.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(svg));
  }

  function faviconTick() {
    const now = Date.now();
    if (!faviconStart) faviconStart = now;
    const e = (now - faviconStart) % FAV_CYCLE;   // ms into the current cycle
    if (e < FAV_S_IN) {                            // S fades in
      faviconSOp = favEase(e / FAV_S_IN);
      faviconDOp = 0;
    } else if (e < FAV_S_IN + FAV_D_IN) {          // D fades in, S full
      faviconSOp = 1;
      faviconDOp = favEase((e - FAV_S_IN) / FAV_D_IN);
    } else if (e < FAV_S_IN + FAV_D_IN + FAV_HOLD) { // both hold
      faviconSOp = 1;
      faviconDOp = 1;
    } else {                                       // both fade out
      const op = 1 - favEase((e - FAV_S_IN - FAV_D_IN - FAV_HOLD) / FAV_OUT);
      faviconSOp = op;
      faviconDOp = op;
    }
    setFavicon();
  }

  function initFaviconLoop() {
    if (reducedMotion()) return;                 // keep the static monogram
    faviconStart = Date.now();
    faviconTick();
    faviconTimer = setInterval(faviconTick, FAV_FRAME_MS);
  }

  function applyTheme(mode) {
    const root = document.documentElement;
    root.dataset.themeMode = mode;
    root.style.colorScheme = (mode === 'light' || mode === 'dark') ? mode : '';
    try { localStorage.setItem('theme', mode); } catch (e) {}
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', LABELS[mode]);
    setFavicon();
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    applyTheme(currentMode());
    btn.addEventListener('click', () => {
      const next = THEMES[(THEMES.indexOf(currentMode()) + 1) % THEMES.length];
      applyTheme(next);
      announce(LABELS[next]);
    });
    // Repaint the favicon when the OS theme flips while in System mode.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentMode() === 'system') setFavicon();
    });
  }

  function initBurger() {
    const burger = document.getElementById('tb-burger');
    const links = document.getElementById('tb-links');
    if (!burger || !links) return;
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      })
    );
  }

  function initTopbar() {
    const bar = document.getElementById('topbar');
    if (!bar) return;
    // One-time intro sequence: logo letters → nav links → hero content, in order.
    // Only arm it once the tab is actually visible, so a page that loads in a
    // background tab doesn't leave content frozen at opacity 0 (CSS base = visible).
    function armIntro() {
      if (document.hidden) return;
      bar.classList.add('tb-animate');
      document.body.classList.add('intro');
      document.removeEventListener('visibilitychange', armIntro);
    }
    armIntro();
    if (document.hidden) document.addEventListener('visibilitychange', armIntro);
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { bar.classList.toggle('scrolled', window.scrollY > 8); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initCopyEmail() {
    const btn = document.getElementById('copy-email');
    if (!btn) return;
    const label = btn.querySelector('[data-copy-label]');
    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }
    function confirmCopied() {
      if (label) label.textContent = 'Copied';
      announce('Email address copied to clipboard');
      setTimeout(() => { if (label) label.textContent = 'Copy'; }, 2000);
    }
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try { await navigator.clipboard.writeText(email); confirmCopied(); return; } catch (e) { /* fall through */ }
      }
      if (fallbackCopy(email)) confirmCopied();
      else announce('Could not copy. Email: ' + email);
    });
  }

  function init() {
    if (typeof Kinetic !== 'undefined' && Kinetic.init) Kinetic.init();
    if (typeof Reveal !== 'undefined' && Reveal.init) Reveal.init();
    initThemeToggle();
    initFaviconLoop();
    initBurger();
    initTopbar();
    initCopyEmail();
    const yr = document.getElementById('footer-year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { init };
})();
