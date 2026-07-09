/* Backgrounds — parallaxes the drafting-grid layer: a small drift toward the
   cursor plus a continuous scroll parallax that wraps by the grid period so it
   scrolls seamlessly (the pattern repeats every 12 cells). One lerped RAF loop
   (mirrors kinetic.js): passive listeners, paused offscreen, reduced-motion bail. */
const Backgrounds = (() => {
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCROLL_FACTOR = 0.18;   // grid moves at ~18% of scroll = parallax
  const TIERS = 12;             // largest grid tier (must match CSS major = 12 x --cell)

  let raf = null;
  let tx = 0.5, ty = 0.5, mx = 0.5, my = 0.5;
  let grid = null, period = 480;

  function measure() {
    if (!grid) return;
    // --cell uses clamp()/vw, so resolve its real px via a probe element.
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--cell);height:0;';
    grid.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    grid.removeChild(probe);
    if (w) period = w * TIERS;
  }

  function onMove(e) {
    tx = e.clientX / window.innerWidth;
    ty = e.clientY / window.innerHeight;
  }

  function tick() {
    mx += (tx - mx) * 0.08;
    my += (ty - my) * 0.08;
    const sy = window.scrollY || 0;
    const gx = (mx - 0.5) * 16;
    // Seamless: wrap the scroll offset into (-period, 0] — the pattern is identical
    // every `period`, so the reset is invisible.
    const wrap = -((sy * SCROLL_FACTOR) % period);
    const gy = (my - 0.5) * 16 + wrap;
    /* Drive the ::before pattern via custom props — never transform #bg-grid itself
       (the fixed, overflow:hidden clip window), or its clip shifts and a blank strip
       shows while scrolling. */
    grid.style.setProperty('--bg-x', gx + 'px');
    grid.style.setProperty('--bg-y', gy + 'px');
    raf = requestAnimationFrame(tick);
  }

  function init() {
    grid = document.getElementById('bg-grid');
    if (!grid || reduce()) return;
    measure();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(tick);
    });
    raf = requestAnimationFrame(tick);
  }

  return { init };
})();
