// Gera public/og.png (1200×630, com o bannerSvg da edição em vigor) e os ícones
// 192, 512 e maskable a partir do favicon. Rasteriza no Chromium — nenhuma biblioteca de imagem.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const url = process.argv[2] || 'http://localhost:4173/?test';
mkdirSync(path.join(root, 'public/icons'), { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });

// og.png: o banner do eixo "cor" da edição atual, como a página o desenha
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(400);
await p.click('.tab[data-p="tend"]'); await p.waitForTimeout(300);
const svg = await p.$eval('#banners .bnr svg', el => el.outerHTML);
await p.setContent(`<!doctype html><html><body style="margin:0">${svg}</body></html>`);
await p.waitForTimeout(200);
writeFileSync(path.join(root, 'public/og.png'), await p.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } }));

// ícones: o favicon do <head>, em fundo do tom de terra da interface
const icon = (size, pad) => `<!doctype html><html><body style="margin:0;background:#D9D8D3;width:${size}px;height:${size}px;display:grid;place-items:center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size - pad * 2}" height="${size - pad * 2}"><circle cx="32" cy="32" r="30" fill="#C4003F"/><path d="M32 2a30 30 0 0 1 0 60z" fill="#22409B"/><circle cx="32" cy="32" r="11" fill="#F2CC00"/></svg></body></html>`;
for (const [name, size, pad] of [['icon-192.png', 192, 12], ['icon-512.png', 512, 32], ['icon-maskable-512.png', 512, 96]]) {
  const q = await b.newPage({ viewport: { width: size, height: size } });
  await q.setContent(icon(size, pad)); await q.waitForTimeout(100);
  writeFileSync(path.join(root, 'public/icons', name), await q.screenshot({ clip: { x: 0, y: 0, width: size, height: size } }));
  await q.close();
}
await b.close();
console.log('og.png e ícones gerados');
