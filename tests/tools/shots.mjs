// Capturas das cinco páginas em luz e treva, em 390, 768 e 1440 de largura.
// uso: node tests/tools/shots.mjs <pasta-saida> [url]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const out = process.argv[2] || 'shots';
const url = process.argv[3] || 'http://localhost:4173/';
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const ctx = await b.newContext({ reducedMotion: 'reduce' });
// bloqueia fontes externas: a comparação é do CSS, não da rede
await ctx.route(/fonts\.(googleapis|gstatic)\.com|fontshare|jsdelivr|\/fonts\//, r => r.abort());
const p = await ctx.newPage();
// o aviso (toast) depende de tempo de rede; fora da comparação
await ctx.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = '#toast{display:none!important}'; document.head.appendChild(s) }) });
for (const w of [390, 768, 1440]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2200); // deixa passar o aviso de fonte não carregada
  for (const g of ['luz', 'treva']) {
    await p.click(g === 'luz' ? '#gLuz' : '#gTreva');
    await p.waitForTimeout(150);
    for (const t of ['home', 'cores', 'tipo', 'criacao', 'tend']) {
      await p.click(`.tab[data-p="${t}"]`);
      await p.waitForTimeout(250);
      await p.screenshot({ path: `${out}/${t}-${g}-${w}.png`, fullPage: true });
    }
  }
}
await b.close();
console.log('ok', out);
