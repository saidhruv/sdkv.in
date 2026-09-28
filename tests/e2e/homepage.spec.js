// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

/**
 * Homepage (index.html) — functional, accessibility, and visual-regression
 * coverage. Most tests run under default (real) motion; visual snapshots and
 * the counter test emulate `prefers-reduced-motion: reduce`, which the site
 * already uses to force a deterministic end-state (no custom animation-
 * disabling hacks needed).
 */

test.describe('Homepage — functional', () => {
  test('loads without unexpected console/page errors', async ({ page }) => {
    const errors = [];
    const failedRequests = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('requestfailed', (req) => failedRequests.push(req.url()));
    await page.goto('/');
    await expect(page.locator('h1.display')).toBeVisible();

    // The Cloudflare beacon's cross-origin request is expected to fail in this
    // localhost/CI environment. Confirm via the actual failed-request URL
    // (not just console text) that any failure really is the beacon, so a
    // genuinely broken resource elsewhere doesn't get silently swallowed.
    const unexpectedFailedRequests = failedRequests.filter((u) => !/cloudflareinsights\.com/i.test(u));
    expect(unexpectedFailedRequests, `Unexpected failed requests:\n${unexpectedFailedRequests.join('\n')}`).toEqual([]);

    const beaconFailed = failedRequests.some((u) => /cloudflareinsights\.com/i.test(u));
    const real = errors.filter((e) => {
      if (/cloudflareinsights|beacon\.min\.js/i.test(e)) return false;
      // Chromium logs a generic, URL-less "Failed to load resource: net::ERR_*"
      // for the beacon (the exact code varies by environment — ERR_FAILED,
      // ERR_NAME_NOT_RESOLVED, etc., depending on how DNS/network is set up
      // sandboxed/CI) — only excuse it once we've confirmed above that the
      // beacon request is the thing that actually failed.
      if (beaconFailed && /net::ERR_/i.test(e)) return false;
      return true;
    });
    expect(real, `Unexpected console errors:\n${real.join('\n')}`).toEqual([]);
  });

  test('Résumé nav link is highlighted in the accent red with an underline', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const resume = page.locator('#tb-links a[href="resume/"]');
    const work = page.locator('#tb-links a[href="#work"]');
    const style = (loc) => loc.evaluate((a) => {
      const s = getComputedStyle(a);
      const probe = document.createElement('span');
      probe.style.color = 'var(--red)';
      document.body.appendChild(probe);
      const red = getComputedStyle(probe).color;
      probe.remove();
      return { color: s.color, underline: s.borderBottomStyle !== 'none' && parseFloat(s.borderBottomWidth) > 0, red };
    });
    const r = await style(resume);
    const w = await style(work);
    expect(r.color).toBe(r.red);
    expect(r.underline).toBe(true);
    expect(w.color).not.toBe(w.red);
    expect(w.underline).toBe(false);
  });

  test('title and meta tags are present and correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sai Dhruva K V/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Sai Dhruva K V/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sdkv.in/');
  });

  test('primary nav has all 6 links with correct hrefs; Résumé opens a new tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#tb-links a');
    await expect(links).toHaveCount(6);
    const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['#leadership', '#work', '#capabilities', '#impact', 'resume/', '#contact']);
    const resumeLink = page.locator('#tb-links a[href="resume/"]');
    await expect(resumeLink).toHaveAttribute('target', '_blank');
    await expect(resumeLink).toHaveAttribute('rel', /noopener/);
    await expect(resumeLink).toHaveText('Résumé');
  });

  test('regression: mobile menu nav links are fully visible once the intro finishes (not stuck at opacity 0)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    // Wait for the one-time intro sequence to finish and clean up after itself
    // (main.js removes .intro/.tb-animate on the hero-foot's animationend).
    await expect(page.locator('body')).not.toHaveClass(/intro/, { timeout: 8000 });
    await expect(page.locator('#topbar')).not.toHaveClass(/tb-animate/, { timeout: 8000 });

    const burger = page.locator('#tb-burger');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');

    const links = page.locator('#tb-links a');
    await expect(links.first()).toBeVisible();
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveCSS('opacity', '1');
    }
  });

  test('theme toggle cycles system -> light -> dark and persists across reload', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('#theme-toggle');
    await expect(btn).toHaveAttribute('aria-label', 'Theme: follow system');

    await btn.click();
    await expect(btn).toHaveAttribute('aria-label', 'Theme: light');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

    await btn.click();
    await expect(btn).toHaveAttribute('aria-label', 'Theme: dark');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.reload();
    await expect(btn).toHaveAttribute('aria-label', 'Theme: dark');
  });

  test('work section renders all 5 role entries; hover/focus expands detail + tags', async ({ page }) => {
    await page.goto('/');
    const entries = page.locator('#entries .entry');
    await expect(entries).toHaveCount(5);

    const first = entries.first();
    await expect(first.locator('.detail')).toHaveCSS('opacity', '0');
    await first.hover();
    await expect(first.locator('.detail')).toHaveCSS('opacity', '1');
    await expect(first.locator('.tag').first()).toBeVisible();
    expect(await first.locator('.tag').count()).toBeGreaterThan(0);
  });

  test('capabilities grid renders all 8 cells', async ({ page }) => {
    await page.goto('/');
    const caps = page.locator('#caps .cap');
    await expect(caps).toHaveCount(8);
    await expect(page.locator('#caps')).toContainText('Technical Program Management');
    await expect(page.locator('#caps')).toContainText('Design & Tools');
  });

  test('impact metrics count up to final values under real motion', async ({ page }) => {
    await page.goto('/');
    const metrics = page.locator('.metrics .num');
    await metrics.first().scrollIntoViewIfNeeded();
    const expected = ['10', '8', '10', '20'];
    for (let i = 0; i < expected.length; i++) {
      // Auto-retries until the 1.5s count-up animation settles on the final value.
      await expect(metrics.nth(i).locator('.cv')).toHaveText(expected[i], { timeout: 5000 });
    }
  });

  test('impact metrics resolve instantly under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const metrics = page.locator('.metrics .num');
    await metrics.first().scrollIntoViewIfNeeded();
    const expected = ['10', '8', '10', '20'];
    for (let i = 0; i < expected.length; i++) {
      await expect(metrics.nth(i).locator('.cv')).toHaveText(expected[i], { timeout: 1000 });
    }
  });

  test('contact copy-email button updates the aria-live status region', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    const btn = page.locator('#copy-email');
    await btn.click();
    await expect(page.locator('#live-region')).toHaveText(/copied/i);
    await expect(btn.locator('[data-copy-label]')).toHaveText('Copied');
  });

  // Both themes: a dark-mode-only contrast regression (e.g. the --faint token
  // failing AA against the dark paper while passing on light) would otherwise
  // go undetected if only the default theme were scanned.
  for (const theme of ['light', 'dark']) {
    test(`accessibility: zero critical/serious axe violations (${theme} theme)`, async ({ page }) => {
      // The topbar/hero run a one-time ~2s intro fade-in (nav links, eyebrow,
      // display lines stagger from opacity:0 -> 1). Without forcing reduced
      // motion, axe's scan can race that animation and sample a transient,
      // partially-faded color mid-stagger — a phantom violation that doesn't
      // reflect the page's actual settled state (which the CSS itself already
      // forces to opacity:1/animation:none under reduced motion).
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) {} }, theme);
      await page.goto('/');
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
      expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
    });
  }
});

test.describe('Homepage — visual regression', () => {
  for (const theme of ['light', 'dark']) {
    test(`homepage @ ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) {} }, theme);
      await page.goto('/');
      await expect(page.locator('h1.display')).toBeVisible();
      // The impact/about counters are gated by their own IntersectionObserver
      // (independent of the .reveal/reduced-motion fast-path) — they only
      // resolve once scrolled into view. scrollIntoViewIfNeeded() performs a
      // real browser scroll (unlike a scripted scrollTo sweep), reliably
      // triggering the observer, before returning to the top for capture.
      await page.locator('.metrics').scrollIntoViewIfNeeded();
      await expect(page.locator('.metrics .cv').first()).toHaveText('10');
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page).toHaveScreenshot(`homepage-${theme}.png`, {
        fullPage: true,
        mask: [page.locator('#footer-year')],
      });
    });
  }
});
