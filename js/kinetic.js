/* Kinetic — builds content from SITE_DATA and animates the headline.
   Headline lines parallax to cursor + shift letter-spacing on scroll.
   All motion gated by prefers-reduced-motion. */
const Kinetic = (() => {
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildContent() {
    const data = (typeof SITE_DATA !== 'undefined') ? SITE_DATA : null;
    if (!data) return;

    const entries = document.getElementById('entries');
    if (entries) {
      data.roles.forEach((r, i) => {
        const e = document.createElement('article');
        e.className = 'entry reveal';
        e.innerHTML =
          `<div class="num">0${data.roles.length - i}</div>` +
          `<div class="co">${r.it ? `<em>${r.co}</em>` : r.co}</div>` +
          `<div class="meta">${r.role}<br>${r.via ? r.via + '<br>' : ''}${r.yr}</div>` +
          `<div class="detail">${r.detail}<div class="tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>`;
        entries.appendChild(e);
      });
    }

    const lead = document.getElementById('lead-grid');
    if (lead && data.leadership) {
      data.leadership.forEach((m, i) => {
        const el = document.createElement('article');
        el.className = 'lead-card reveal';
        const n = String(i + 1).padStart(2, '0');
        el.innerHTML = `<span class="ln">${n}</span><h3>${m.t}</h3><p>${m.p}</p>`;
        lead.appendChild(el);
      });
    }

    const caps = document.getElementById('caps');
    if (caps) {
      data.caps.forEach((c, i) => {
        const el = document.createElement('div');
        el.className = 'cap reveal';
        const n = String(i + 1).padStart(2, '0');
        el.innerHTML = `<h3><span class="n">${n}</span>${c.t}</h3><ul>${c.items.map(x => `<li>${x}</li>`).join('')}</ul>`;
        caps.appendChild(el);
      });
    }

    const imp = document.getElementById('impact-grid');
    if (imp) {
      data.impact.forEach((m) => {
        const el = document.createElement('article');
        el.className = 'imp reveal';
        el.innerHTML = `<div class="n">${m.n}</div><h3>${m.t}</h3><p>${m.p}</p>`;
        imp.appendChild(el);
      });
    }
  }

  function initHeadline() {
    const lines = document.querySelectorAll('.display .line');
    if (!lines.length || reduce()) return;

    let tx = 0.5, ty = 0.5, mx = 0.5, my = 0.5, raf = null;

    function onMove(e) { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; }
    function tick() {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      lines.forEach((l, i) => {
        const depth = (i + 1) / lines.length;
        const dx = (mx - 0.5) * 60 * depth;
        const dy = (my - 0.5) * 16 * depth;
        l.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      raf = requestAnimationFrame(tick);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const spread = Math.min(window.scrollY / 4000, 0.06);
        lines.forEach((l, i) => { l.style.letterSpacing = `${-0.04 + spread * (i % 2 ? 1 : -1)}em`; });
        ticking = false;
      });
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(tick);
    });
    raf = requestAnimationFrame(tick);
  }

  function init() {
    buildContent();
    initHeadline();
  }

  return { init };
})();
