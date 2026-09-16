/**
 * Minimal zero-dep static file server for the test suite — mirrors the
 * in-process server already used by tools/build-resume-pdf.mjs. Used only by
 * Playwright's `webServer` option (and can be run standalone for local
 * poking around); never shipped with the site.
 *
 * Usage:
 *   node tests/dev-server.mjs          # serves repo root on PORT (default 4173)
 *   PORT=5050 node tests/dev-server.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  // Guard against path traversal outside ROOT.
  const full = normalize(join(ROOT, p));
  if (!full.startsWith(normalize(ROOT))) {
    res.writeHead(403);
    return res.end('forbidden');
  }
  fs.readFile(full, (err, buf) => {
    if (err) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, { 'content-type': TYPES[extname(full)] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log(`dev-server listening on http://localhost:${PORT}`);
});
