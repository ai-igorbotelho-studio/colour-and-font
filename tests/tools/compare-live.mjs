// Compara a aplicação servida (dist) com tests/reference.json: paletas, pares, propostas.
// A aplicação modular não expõe globais, então tudo passa pela interface.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REF = JSON.parse(readFileSync(path.join(root, 'tests/reference.json'), 'utf8'));
const url = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const p = await b.newPage();
const errors = [];
p.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::/.test(m.text())) errors.push('CONSOLE: ' + m.text()) });
await p.goto(url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(500);

// expõe os módulos para o teste através de um import dinâmico do bundle? Não: usamos a UI + hooks de teste.
// A aplicação publica window.__fk em modo de teste (ver src/main.ts).
const has = await p.evaluate(() => !!window.__fk);
if (!has) { console.log('window.__fk ausente'); process.exit(1) }

let fail = 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

for (const ref of REF.palettes) {
  const got = await p.evaluate((sc) => window.__fk.palette(sc), ref.scen);
  const ok = same(got.hex, ref.hex);
  if (!ok) { fail++; console.log('PALETA DIFERE', ref.scen, '\n  esperado', ref.hex, '\n  obtido  ', got.hex) }
}
for (const ref of REF.pairs) {
  const got = await p.evaluate((sc) => window.__fk.pair(sc), ref.scen);
  if (!same(got, ref.pair)) { fail++; console.log('PAR DIFERE', ref.scen, ref.pair, got) }
}
for (const ref of REF.proposals) {
  const got = await p.evaluate((br) => window.__fk.proposals(br), ref.brief);
  const exp = ref.props.map(x => ({ hs: x.hs, fonts: x.fonts, li: x.li, si: x.si, u: x.u, k: x.k }));
  if (!same(got, exp)) { fail++; console.log('PROPOSTA DIFERE', ref.brief.brief, '\n  esperado', JSON.stringify(exp), '\n  obtido  ', JSON.stringify(got)) }
}
console.log(`referência: ${REF.palettes.length} paletas, ${REF.pairs.length} pares, ${REF.proposals.length} briefings → ${fail} divergências; erros JS: ${errors.length}`);
errors.forEach(e => console.log('  ' + e));
await b.close();
process.exit(fail || errors.length ? 1 : 0);
