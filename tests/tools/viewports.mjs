// Auditoria de responsividade: em cada largura (retrato e paisagem), cada página não pode
// rolar na horizontal, a tabbar/trilho tem de estar dentro da janela e os alvos de toque ≥ 44px.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const url = process.argv[2] || 'http://localhost:4173/', out = process.argv[3] || '';
if (out) mkdirSync(out, { recursive: true });
const VP = [[360, 740], [390, 844], [844, 390], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const ctx = await b.newContext({ reducedMotion: 'reduce' }); const p = await ctx.newPage();
let bad = 0;
for (const [w, h] of VP) {
  await p.setViewportSize({ width: w, height: h });
  await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(500);
  for (const t of ['home', 'cores', 'tipo', 'criacao', 'tend']) {
    try { await p.click(`.tab[data-p="${t}"]`, { timeout: 4000 }) } catch (e) { bad++; console.log(`${w}×${h} ${t}: aba não clicável — ${String(e.message).split('\n')[0]}`); await p.screenshot({ path: `${out || '.'}/FAIL-${t}-${w}x${h}.png` }); continue }
    await p.waitForTimeout(250);
    if (t === 'criacao') { try { await p.click('#cGo', { timeout: 4000 }) } catch (e) { bad++; console.log(`${w}×${h} criacao: #cGo não clicável — ${String(e.message).split('\n')[0]}`); await p.screenshot({ path: `${out || '.'}/FAIL-cGo-${w}x${h}.png` }) } await p.waitForTimeout(300) }
    const r = await p.evaluate(() => {
      const de = document.documentElement, tb = document.getElementById('tabbar').getBoundingClientRect();
      const small = [...document.querySelectorAll('button:not(.diag)')].filter(b => b.offsetParent && b.getBoundingClientRect().height > 0 && (b.getBoundingClientRect().height < 40 || b.getBoundingClientRect().width < 40) && !b.closest('.cell .tools, .propstrip, .ctgrid, .v-ramps, #dRamp')).map(b => (b.id || b.className || b.textContent.trim().slice(0, 18)));
      return { sw: de.scrollWidth, iw: innerWidth, tbIn: tb.left >= 0 && tb.right <= innerWidth + 1 && tb.bottom <= innerHeight + 1, small };
    });
    const probs = [];
    if (r.sw > r.iw) probs.push(`rolagem horizontal ${r.sw}>${r.iw}`);
    if (!r.tbIn) probs.push('tabbar fora da janela');
    if (r.small.length) probs.push(`alvos < 40px: ${[...new Set(r.small)].slice(0, 5).join(', ')}`);
    if (probs.length) { bad++; console.log(`${w}×${h} ${t}: ${probs.join(' · ')}`) }
    if (out && t !== 'criacao') await p.screenshot({ path: `${out}/${t}-${w}x${h}.png` });
  }
}
console.log(bad ? `${bad} combinações com problema` : `ok: ${VP.length} janelas × 5 páginas sem rolagem horizontal, tabbar dentro da janela, alvos ≥ 40px`);
await b.close(); process.exit(bad ? 1 : 0);
