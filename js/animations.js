/* Reveal — scroll entrance + count-up metrics. Reduced-motion safe. */
const Reveal = (() => {
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduce()) { els.forEach((el) => el.classList.add('in')); return; }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function runCount(el) {
    const target = parseFloat(el.dataset.count);
    const out = el.querySelector('.cv') || el;
    if (reduce()) { out.textContent = target; return; }

    const duration = 1500;
    let start = null;
    function frame(ts) {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      out.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(frame); else out.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  }

  function init() { initReveal(); initCounters(); }
  return { init };
})();
