// @ts-check
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

/**
 * Résumé (resume/index.html) — functional, accessibility, and visual-
 * regression coverage. VERSIONS mirrors window.RESUME_VERSIONS in
 * resume/index.html and the VERSIONS registry in tools/build-resume-pdf.mjs
 * — keep all three in sync when a version is added.
 */
const VERSIONS = [
  { slug: 'ai', file: 'resume', label: 'AI & Technology Leader', title: 'AI & Technology Leader — Architecting Intelligent Platforms at Scale', download: 'Sai Dhruva K V - Resume.pdf' },
  { slug: 'frontend', file: 'resume-frontend', label: 'Frontend Architect', title: 'Frontend Architect — Design Systems, Component Architecture & Performance at Scale', download: 'Sai Dhruva K V - Frontend Resume.pdf' },
  { slug: 'tpm', file: 'resume-tpm', label: 'Senior Technical Program Manager', title: 'Senior Technical Program Manager — Driving AI & Platform Programs at Enterprise Scale', download: 'Sai Dhruva K V - TPM Resume.pdf' },
];

/** Seed the shared localStorage keys before the page's bootstrap script runs,
 *  mirroring tools/build-resume-pdf.mjs's evaluateOnNewDocument pattern. */
async function seed(page, { theme, mode, variant } = {}) {
  await page.addInitScript(({ theme, mode, variant }) => {
    try {
      if (theme) localStorage.setItem('theme', theme);
      if (mode) localStorage.setItem('resumeMode', mode);
      if (variant) localStorage.setItem('resumeVariant', variant);
    } catch (e) {}
  }, { theme, mode, variant });
}

/** The picker has its own timed "auto-reveal" (opens itself ~600ms after load,
 *  silently, to advertise editions — see resume/index.html) that races any
 *  test which clicks the trigger around the same time: a blind click can
 *  toggle an already-(silently)-open panel CLOSED instead of opening it.
 *  Neutralize it deterministically (rather than out-waiting it) by no-op'ing
 *  the one `setTimeout(fn, 600)` call the feature uses — verified unique in
 *  resume/index.html, so this can't suppress any other timer. */
async function disableAutoReveal(page) {
  await page.addInitScript(() => {
    const realSetTimeout = window.setTimeout;
    window.setTimeout = (fn, delay, ...args) => {
      if (delay === 600) return 0;
      return realSetTimeout(fn, delay, ...args);
    };
  });
}

async function openEditionPanel(page) {
  const trigger = page.locator('#edition-trigger');
  await trigger.click();
  await expect(page.locator('#edition-panel')).toBeVisible();
}

test.describe('Résumé — functional', () => {
  test('loads without unexpected console/page errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', (err) => errors.push(String(err)));
    await page.goto('/resume/');
    await expect(page.locator('#sheet')).toHaveCount(1);
    expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toEqual([]);
  });

  test('edition picker switches through all 3 editions; headline + download href update', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await disableAutoReveal(page);
    await seed(page, { mode: 'normal', theme: 'light' });
    await page.goto('/resume/');

    // Selecting an edition keeps the panel open (so both axes stay adjustable) —
    // open it once, then click through editions without re-toggling the trigger.
    await openEditionPanel(page);
    for (const v of VERSIONS) {
      await page.locator(`.ep-item[data-variant="${v.slug}"]`).click();

      await expect(page.locator('html')).toHaveAttribute('data-resume-variant', v.slug);
      await expect(page.locator('#edition-trigger-label')).toHaveText(v.label);
      await expect(page.locator(`.title.rv-${v.slug}`)).toBeVisible();
      await expect(page.locator(`.title.rv-${v.slug}`)).toHaveText(v.title);
      await expect(page.locator('#dl-btn')).toHaveAttribute('href', new RegExp(`${v.file}-(light|dark)\\.pdf$`));
    }
  });

  test('Normal <-> ATS mode toggle switches the visible layout', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await disableAutoReveal(page);
    await seed(page, { mode: 'normal', theme: 'light' });
    await page.goto('/resume/');

    await expect(page.locator('.scaler')).toBeVisible();
    await expect(page.locator('.doc')).toBeHidden();

    // Toggling mode keeps the panel open — open it once, then click both buttons.
    await openEditionPanel(page);
    await page.locator('[data-mode-btn="ats"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-resume-mode', 'ats');
    await expect(page.locator('.doc')).toBeVisible();
    await expect(page.locator('.scaler')).toBeHidden();
    await expect(page.locator('#dl-btn')).toHaveAttribute('href', /-ats\.pdf$/);

    await page.locator('[data-mode-btn="normal"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-resume-mode', 'normal');
    await expect(page.locator('.scaler')).toBeVisible();
    await expect(page.locator('.doc')).toBeHidden();
  });

  test('theme toggle works and persists across reload', async ({ page }) => {
    await page.goto('/resume/');
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

  test('print anti-swap: printing shows the notice instead of the résumé', async ({ page }) => {
    await seed(page, { mode: 'normal', theme: 'light' });
    await page.goto('/resume/');
    await expect(page.locator('.stage')).toBeVisible();
    await expect(page.locator('.print-notice')).toBeHidden();

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.print-notice')).toBeVisible();
    await expect(page.locator('.stage')).toBeHidden();
  });

  for (const v of VERSIONS) {
    test(`download flow: "${v.label}" downloads a PDF with the expected filename`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await seed(page, { mode: 'ats', theme: 'light', variant: v.slug });
      await page.goto('/resume/');
      await expect(page.locator('html')).toHaveAttribute('data-resume-variant', v.slug);

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#dl-btn').click(),
      ]);
      expect(download.suggestedFilename()).toBe(v.download);
    });
  }

  // Both modes AND both themes: a dark-mode-only contrast regression (e.g. the
  // --faint token failing AA against the dark paper while passing on light)
  // would otherwise go undetected if only 'light' were scanned.
  for (const mode of ['normal', 'ats']) {
    for (const theme of ['light', 'dark']) {
      test(`accessibility: zero critical/serious axe violations (${mode} mode, ${theme} theme)`, async ({ page }) => {
        // Neutralize the picker's silent 600ms auto-reveal (see disableAutoReveal
        // above): without this, axe's scan can race the panel's open transition
        // and sample computed colors mid-fade (partial opacity blended against
        // paper), producing phantom "contrast violations" that don't match any
        // real, settled state of the page.
        await disableAutoReveal(page);
        await seed(page, { mode, theme });
        await page.goto('/resume/');
        const results = await new AxeBuilder({ page }).analyze();
        const bad = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
        expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
      });
    }
  }
});

test.describe('Résumé — visual regression (full edition x mode x theme matrix)', () => {
  for (const v of VERSIONS) {
    for (const mode of ['normal', 'ats']) {
      for (const theme of ['light', 'dark']) {
        test(`resume ${v.slug} / ${mode} / ${theme}`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await seed(page, { theme, mode, variant: v.slug });
          await page.goto('/resume/');
          // Suppress the edition-picker's timed auto-reveal (a JS setTimeout that
          // pops the panel open ~600ms after load to advertise editions) so the
          // snapshot is timing-independent — the exact class of bug that leaked
          // the picker into the PDF build (see tools/build-resume-pdf.mjs).
          await page.addStyleTag({ content: '.edition-panel, .edition-backdrop { display: none !important; }' });
          await page.evaluate(() => document.fonts && document.fonts.ready);

          if (mode === 'normal') {
            await expect(page.locator('.scaler')).toBeVisible();
          } else {
            await expect(page.locator('.doc')).toBeVisible();
          }

          await expect(page).toHaveScreenshot(`resume-${v.slug}-${mode}-${theme}.png`, {
            fullPage: true,
          });
        });
      }
    }
  }
});
