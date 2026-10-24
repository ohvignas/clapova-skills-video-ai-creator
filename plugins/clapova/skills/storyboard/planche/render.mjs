#!/usr/bin/env node
// Capture planche.html -> planche.png avec Playwright (facultatif, détecté).
// Usage direct : node render.mjs planche.html planche.png
// Recherche de Playwright : PLAYWRIGHT_MODULE (chemin du module), puis `playwright` / `playwright-core`
// résolus normalement, puis /opt/node-tools/node_modules/playwright. Chromium : celui de Playwright,
// sinon CHROMIUM_PATH / PUPPETEER_EXECUTABLE_PATH.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

async function loadPlaywright() {
  const cands = [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core', '/opt/node-tools/node_modules/playwright/index.mjs', '/usr/lib/node_modules/playwright/index.mjs', '/usr/local/lib/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const c of cands) {
    try {
      const spec = c.startsWith('/') ? (fs.existsSync(c) ? pathToFileURL(c).href : null) : c;
      if (!spec) continue;
      const m = await import(spec);
      const chromium = m.chromium || m.default?.chromium;
      if (chromium) return chromium;
    } catch { /* candidat suivant */ }
  }
  return null;
}

export async function capture(htmlPath, pngPath, { width = 1540, scale = 1.5 } = {}) {
  const chromium = await loadPlaywright();
  if (!chromium) return { ok: false, reason: 'Playwright introuvable' };
  let browser;
  try {
    const exe = process.env.CHROMIUM_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
    try { browser = await chromium.launch(); } catch (e) { if (!exe) throw e; browser = await chromium.launch({ executablePath: exe }); }
    const pg = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale });
    const errs = [];
    pg.on('pageerror', (e) => errs.push(e.message));
    await pg.goto(pathToFileURL(path.resolve(htmlPath)).href);
    await pg.waitForSelector('body[data-ready]', { timeout: 20000 });
    await (await pg.$('.sheet')).screenshot({ path: pngPath });
    if (errs.length) console.error('Erreurs JS de la page :', errs.join(' | '));
    return { ok: true, path: pngPath };
  } catch (e) {
    return { ok: false, reason: 'Chromium : ' + String(e.message || e).split('\n')[0] };
  } finally { if (browser) await browser.close(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , html, png] = process.argv;
  if (!html) { console.error('Usage : node render.mjs planche.html [planche.png]'); process.exit(1); }
  const r = await capture(html, png || html.replace(/\.html?$/, '.png'));
  console.log(r.ok ? r.path : 'PNG non produit : ' + r.reason);
  process.exit(r.ok ? 0 : 2);
}
