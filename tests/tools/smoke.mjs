// Fumaça: cinco páginas, todos os <select> em todas as opções, alternância de fundo,
// todos os botões visíveis. Zero erros de execução é o critério.
import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const ctx = await b.newContext({ acceptDownloads: true });
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::/.test(m.text())) errors.push('CONSOLE: ' + m.text()) });
p.on('download', async d => { try { await d.cancel() } catch (_) {} });
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(600);

let opts = 0, sels = 0;
for (const t of ['home', 'cores', 'tipo', 'criacao', 'tend']) {
  await p.click(`.tab[data-p="${t}"]`); await p.waitForTimeout(250);
  // todas as opções de todos os selects visíveis desta página
  const r = await p.evaluate(() => {
    let o = 0, s = 0;
    for (const sel of document.querySelectorAll('select')) {
      if (sel.offsetParent === null) continue; s++;
      const start = sel.selectedIndex;
      for (let i = 0; i < sel.options.length; i++) { sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); sel.dispatchEvent(new Event('input', { bubbles: true })); o++ }
      sel.selectedIndex = start; sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return { o, s };
  });
  opts += r.o; sels += r.s;
  await p.waitForTimeout(150);
  const n = await p.$$eval('button', bs => bs.filter(x => x.offsetParent !== null).length);
  for (let i = 0; i < n; i++) {
    const handles = (await p.$$('button'));
    const vis = []; for (const h of handles) if (await h.isVisible()) vis.push(h);
    const el = vis[i]; if (!el) continue;
    try { await el.click({ timeout: 400, force: true }) } catch (_) {}
  }
  await p.waitForTimeout(150);
}
await p.click('#gTreva'); await p.waitForTimeout(150); await p.click('#gLuz');
console.log(`fumaça: ${sels} selects, ${opts} opções exercitadas, ${errors.length} erros JS`);
errors.slice(0, 30).forEach(e => console.log('  ' + e));
await b.close();
process.exit(errors.length ? 1 : 0);
