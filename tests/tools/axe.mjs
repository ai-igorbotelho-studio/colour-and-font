// Auditoria axe-core nas cinco páginas, em luz e treva. Critério: 0 críticas e 0 sérias.
// Exclusões declaradas: #cv (canvas de trabalho, oculto) e as células reprovadas da grade de
// legibilidade (.ctgrid button.fail) — elas mostram de propósito o par que NÃO alcança a exigência,
// riscado e com contorno; é o instrumento medindo contraste, não texto de interface.
// #toast é transitório (aparece por 1,8 s em fade): a axe o amostra no meio da transição; em opacidade
// cheia é tinta sobre fundo, medido em tests/tokens.test.ts.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const url = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800);
let critical = 0, serious = 0; const rows = [];
for (const g of ['luz', 'treva']) {
  await p.click(g === 'luz' ? '#gLuz' : '#gTreva'); await p.waitForTimeout(150);
  for (const t of ['home', 'cores', 'tipo', 'criacao', 'tend']) {
    await p.click(`.tab[data-p="${t}"]`); await p.waitForTimeout(300);
    const r = await new AxeBuilder({ page: p }).exclude('#cv').exclude('.ctgrid button.fail').exclude('#toast').analyze();
    for (const v of r.violations) {
      if (v.impact === 'critical') critical += v.nodes.length; if (v.impact === 'serious') serious += v.nodes.length;
      rows.push(`${t}/${g}  ${v.impact}  ${v.id}  ×${v.nodes.length}  ${v.nodes[0]?.target?.[0] || ''}`);
    }
  }
}
console.log(rows.join('\n') || 'nenhuma violação');
console.log(`axe: ${critical} críticas, ${serious} sérias`);
await b.close();
process.exit(critical + serious ? 1 : 0);
