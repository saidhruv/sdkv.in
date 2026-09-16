/**
 * PDF build + regression guard — plain Node script (not a Playwright test).
 * Runs tools/build-resume-pdf.mjs, then verifies every expected output:
 *   - exists, with a sane non-trivial file size
 *   - has extractable, non-trivial text (catches a blank/garbled raster render)
 *   - does NOT contain the edition-picker's own chrome text ("Format" heading,
 *     which only lives inside .edition-panel) — a direct, cheap guard for the
 *     exact bug fixed last session (the picker's timed auto-reveal getting
 *     captured mid-animation into the PDF, see NEUTRALIZE in
 *     tools/build-resume-pdf.mjs)
 *   - does not contain a *duplicated* "Also available:" masthead pointer
 *     (it's legitimate résumé content and should appear exactly once)
 *
 * Usage: node tests/pdf/verify-pdfs.mjs
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..', '..');
const RESUME_DIR = join(ROOT, 'resume');

// Mirrors VERSIONS in tools/build-resume-pdf.mjs / RESUME_VERSIONS in resume/index.html.
const VERSIONS = [
  { slug: 'ai', file: 'resume' },
  { slug: 'frontend', file: 'resume-frontend' },
  { slug: 'tpm', file: 'resume-tpm' },
];
const MODES = ['light', 'dark', 'ats'];

const MIN_BYTES = 20_000; // sane non-trivial floor across both poster (~MB) and ATS (~50-80KB) PDFs
const MIN_TEXT_LEN = 400; // catches a blank/garbled render

let ok = true;
function fail(msg) {
  console.error(`\u2717 ${msg}`);
  ok = false;
}

console.log('Running tools/build-resume-pdf.mjs ...\n');
const build = spawnSync(process.execPath, [join(ROOT, 'tools', 'build-resume-pdf.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
});
if (build.status !== 0) {
  console.error(`\ntools/build-resume-pdf.mjs exited with code ${build.status}`);
  process.exit(1);
}

async function extractText(path) {
  const data = new Uint8Array(fs.readFileSync(path));
  const doc = await getDocument({ data, isEvalSupported: false, useSystemFonts: true }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => ('str' in it ? it.str : '')).join(' ') + '\n';
  }
  await doc.destroy();
  return text.replace(/\s+/g, ' ').trim();
}

function count(haystack, re) {
  return (haystack.match(re) || []).length;
}

const files = [];
for (const v of VERSIONS) for (const mode of MODES) files.push(`${v.file}-${mode}.pdf`);

console.log(`\nVerifying ${files.length} PDFs ...`);
for (const name of files) {
  const path = join(RESUME_DIR, name);

  if (!fs.existsSync(path)) { fail(`${name}: missing`); continue; }

  const size = fs.statSync(path).size;
  if (size < MIN_BYTES) { fail(`${name}: suspiciously small (${size} bytes)`); continue; }

  let text;
  try {
    text = await extractText(path);
  } catch (e) {
    fail(`${name}: failed to extract text (${e.message})`);
    continue;
  }

  if (text.length < MIN_TEXT_LEN) {
    fail(`${name}: extracted text too short (${text.length} chars) — possible blank/garbled render`);
    continue;
  }

  const formatCount = count(text, /\bformat\b/gi);
  if (formatCount > 0) {
    fail(`${name}: contains the edition-picker's "Format" heading (${formatCount}x) — the picker chrome may have leaked into the PDF`);
    continue;
  }

  const editionCount = count(text, /\bedition\b/gi);
  if (editionCount > 0) {
    fail(`${name}: contains the edition-picker's "Edition" heading/kicker (${editionCount}x) — the picker chrome may have leaked into the PDF`);
    continue;
  }

  const alsoAvailableCount = count(text, /also available/gi);
  if (alsoAvailableCount > 1) {
    fail(`${name}: "Also available:" appears ${alsoAvailableCount}x (expected exactly 1) — possible duplicate/leaked render`);
    continue;
  }

  console.log(`\u2713 ${name}  ${(size / 1024).toFixed(0)}KB  text=${text.length} chars`);
}

if (!ok) {
  console.error('\nverify-pdfs: FAILED');
  process.exit(1);
}
console.log('\nverify-pdfs: all checks passed');
