/**
 * Offline tool — renders resume/index.html to the three downloadable PDFs:
 *   resume-light.pdf / resume-dark.pdf  — Normal mode poster (native size, light/dark)
 *   resume-ats.pdf                      — ATS mode (one tall page, cream, Atkinson)
 * The page's Download button serves whichever matches the current mode + colour.
 * Not part of the deployed site; run manually when the résumé changes.
 *
 * Usage:
 *   npm i puppeteer            # if not already available
 *   node tools/build-resume-pdf.mjs
 *
 * A tiny static server is started in-process (no separate `serve` needed).
 * Optional: RESUME_URL env var to render an already-running URL instead.
 */
import http from 'node:http';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import puppeteer from 'puppeteer';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const OUTDIR = join(ROOT, 'resume');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon' };

// Start an in-process static server unless an external RESUME_URL was provided.
let server, base;
if (process.env.RESUME_URL) {
  base = process.env.RESUME_URL.replace(/\/resume\/?$/, '').replace(/\/$/, '');
} else {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    fs.readFile(join(ROOT, p), (err, buf) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
}
const URL = `${base}/resume/`;

// Render the sheet at native scale, top-left, without the scaler/stage chrome.
const NEUTRALIZE = `
  .stage { padding: 0 !important; display: block !important; }
  .scaler { width: auto !important; height: auto !important; margin: 0 !important; box-shadow: none !important; }
  .sheet { position: static !important; transform: none !important; }
  .dl-btn, .rz-bar, .doc, #bg-grid { display: none !important; }
`;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
for (const mode of ['light', 'dark']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2600, height: 1400, deviceScaleFactor: 1 });

  // Drive the résumé's OWN theme (explicit inline color-scheme via the shared
  // 'theme' key) so the light-dark() tokens resolve deterministically to `mode`.
  // This does NOT depend on the headless OS preference. Seed before page scripts.
  await page.evaluateOnNewDocument((m) => { try { localStorage.setItem('theme', m); localStorage.setItem('resumeMode', 'normal'); } catch (e) {} }, mode);

  // One CDP call sets BOTH the media type (screen → skip the @media print
  // anti-print swap) and the colour-scheme feature (for the grain blend). Doing
  // it in a single call avoids puppeteer's emulateMediaType()/emulateMediaFeatures()
  // reset gotcha — calling them separately wiped prefers-color-scheme and rendered
  // the "dark" PDF in light.
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-color-scheme', value: mode }],
  });

  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.addStyleTag({ content: NEUTRALIZE });
  await new Promise((r) => setTimeout(r, 500));

  const info = await page.evaluate(() => {
    const el = document.querySelector('.sheet');
    const s = el.getBoundingClientRect();
    return {
      w: Math.ceil(s.width),
      h: Math.ceil(s.height),
      bg: getComputedStyle(el).backgroundColor, // body is transparent (grid shows through); check the sheet
      scheme: getComputedStyle(document.documentElement).colorScheme,
    };
  });

  // Sanity check: the rendered sheet background must match the requested mode,
  // otherwise the PDF would be wrong (this is exactly the bug we're guarding).
  const expect = mode === 'dark' ? 'rgb(17, 17, 19)' : 'rgb(243, 239, 231)';
  const ok = info.bg === expect;

  await page.pdf({
    path: join(OUTDIR, `resume-${mode}.pdf`),
    width: `${info.w + 2}px`,
    height: `${info.h + 2}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: '1',
  });
  await page.close();
  console.log(`wrote resume-${mode}.pdf  ${info.w}x${info.h}  body-bg=${info.bg}  color-scheme=${info.scheme}  ${ok ? 'OK' : 'WRONG (expected ' + expect + ')'}`);
}

// ATS résumé PDF — /resume in ATS mode: ONE tall page (no page breaks), cream, Atkinson.
// Seed resumeMode=ats so the page shows the .doc; its @media print renders it full-bleed.
{
  const page = await browser.newPage();
  // Measure the print-layout height at A4 width, then override @page to 210mm × that
  // height. Use preferCSSPageSize (CSS @page) — puppeteer's width/height option exposes
  // Chromium's dark canvas in the margins, whereas @page lets the cream body fill it.
  const WIDTH = 794; // 210mm at 96dpi
  await page.setViewport({ width: WIDTH, height: 1123, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('resumeMode', 'ats'); } catch (e) {} });
  await page.goto(`${base}/resume/`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.emulateMediaType('print'); // so the measured height reflects the print layout
  // The résumé anti-prints in BOTH modes now; re-reveal the ATS document so this offline
  // build can still capture it full-bleed (a real user pressing Print gets the notice).
  await page.addStyleTag({ content: `@media print {
    .print-notice { display: none !important; }
    .scaler { display: none !important; }
    html, body { color-scheme: only light; background: #f3efe7 !important; }
    .stage { display: block !important; padding: 0 !important; }
    .doc { display: block !important; max-width: none !important; margin: 0 !important; border: none !important; box-shadow: none !important; padding: 16mm !important; background: #f3efe7 !important; color-scheme: only light; }
  }` });
  await new Promise((r) => setTimeout(r, 400));
  const info = await page.evaluate(() => {
    const d = document.querySelector('.doc').getBoundingClientRect();
    return {
      hpx: Math.ceil(d.height),
      atkinson: document.fonts.check('700 32px "Atkinson Hyperlegible"'),
      bg: getComputedStyle(document.querySelector('.doc')).backgroundColor,
    };
  });
  const H = ((info.hpx * 25.4) / 96 + 2).toFixed(1); // px -> mm (+2mm safety)
  // Size the page to the content AND stretch the cream doc to the full page height so the
  // dark colour-scheme canvas is never exposed in the trailing millimetres at the bottom.
  await page.addStyleTag({ content: `@media print { @page { size: 210mm ${H}mm !important; margin: 0 !important; } .doc { min-height: ${H}mm !important; } }` });
  await page.pdf({ path: join(OUTDIR, 'resume-ats.pdf'), printBackground: true, preferCSSPageSize: true });
  await page.close();
  console.log(`wrote resume-ats.pdf  single page 210x${H}mm  doc-bg=${info.bg}  atkinson=${info.atkinson}`);
}

await browser.close();
if (server) server.close();
