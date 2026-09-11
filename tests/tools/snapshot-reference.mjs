// Colhe do farbenkreis.html ORIGINAL (scripts clássicos, globais acessíveis)
// os valores de referência que as etapas seguintes precisam reproduzir.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.goto('file://' + path.join(root, 'reference/farbenkreis-original.html'), { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(500);

// 10 cenários: semente + campos. pos = postura, n = quantidade.
const SCEN = [
  { seed: .5,  emo: 1,  mkt: 3,  scheme: 2, lens: 1,  cult: 0, mus: 0,  pos: 50, n: 5 },
  { seed: .1,  emo: 0,  mkt: 0,  scheme: 0, lens: 0,  cult: 0, mus: 0,  pos: 50, n: 5 },
  { seed: .25, emo: 5,  mkt: 8,  scheme: 1, lens: 2,  cult: 1, mus: 1,  pos: 20, n: 3 },
  { seed: .33, emo: 9,  mkt: 1,  scheme: 4, lens: 7,  cult: 3, mus: 4,  pos: 80, n: 6 },
  { seed: .42, emo: 12, mkt: 3,  scheme: 6, lens: 11, cult: 0, mus: 6,  pos: 0,  n: 4 },
  { seed: .61, emo: 3,  mkt: 7,  scheme: 8, lens: 6,  cult: 9, mus: 2,  pos: 100,n: 5 },
  { seed: .77, emo: 15, mkt: 12, scheme: 9, lens: 13, cult: 5, mus: 10, pos: 35, n: 7 },
  { seed: .88, emo: 7,  mkt: 19, scheme: 10,lens: 15, cult: 8, mus: 12, pos: 65, n: 2 },
  { seed: .93, emo: 16, mkt: 10, scheme: 3, lens: 9,  cult: 2, mus: 8,  pos: 50, n: 8 },
  { seed: .07, emo: 2,  mkt: 14, scheme: 7, lens: 4,  cult: 7, mus: 5,  pos: 90, n: 5 },
];

const palettes = [];
for (const sc of SCEN) {
  const r = await p.evaluate((sc) => {
    $('emo').value = sc.emo; $('mkt').value = sc.mkt; $('scheme').value = sc.scheme; $('lens').value = sc.lens;
    $('cult').value = sc.cult; $('mus').value = sc.mus; $('pos').value = sc.pos;
    S.n = sc.n; S.seed = sc.seed; S.baseOver = null; S.colors = [];
    build(false);
    return { hex: palette(), colors: S.colors.map(c => ({ a: c.a, L: c.L, C: c.C })), props: proportions() };
  }, sc);
  palettes.push({ scen: sc, ...r });
}

// pares tipográficos: semente fixa, 2 famílias (determinístico)
const TSCEN = [
  { seed: .3, tEmo: 0, tUse: 'none', tStrat: 'contraste', tClsD: 'none', tClsB: 'none', tBank: 'none', tWidth: 'none', tContr: 'none' },
  { seed: .5, tEmo: 1, tUse: 'editorial', tStrat: 'super', tClsD: 'none', tClsB: 'none', tBank: 'google', tWidth: 'none', tContr: 'none' },
  { seed: .8, tEmo: 5, tUse: 'ui', tStrat: 'oposto', tClsD: 'serif-mod', tClsB: 'none', tBank: 'none', tWidth: 'none', tContr: 'none' },
  { seed: .2, tEmo: 9, tUse: 'display', tStrat: 'metrica', tClsD: 'none', tClsB: 'sans-hum', tBank: 'none', tWidth: 'norm', tContr: 'none' },
  { seed: .65, tEmo: 12, tUse: 'doc', tStrat: 'uma', tClsD: 'none', tClsB: 'none', tBank: 'fontshare', tWidth: 'none', tContr: 'low' },
];
const pairs = [];
for (const sc of TSCEN) {
  const r = await p.evaluate((sc) => {
    for (const k of ['tEmo','tUse','tStrat','tClsD','tClsB','tBank','tWidth','tContr']) $(k).value = sc[k];
    T.seed = sc.seed; const pr = pickPair();
    return pr ? { d: pr.d.n, b: pr.b.n } : null;
  }, sc);
  pairs.push({ scen: sc, pair: r });
}

// propostas da Criação com semente fixa
const briefs = [
  { brief: 'Retiro de silêncio na Amazônia, sério e acolhedor', piece: 'site', sup: 'tela', fam: 2, pos: 50, n: 5, seeds: [.31, .62, .93] },
  { brief: 'promoção urgente de supermercado, colorido', piece: 'embalagem', sup: 'impresso', fam: 3, pos: 70, n: 4, seeds: [.12, .24, .36] },
];
const proposals = [];
for (const br of briefs) {
  const r = await p.evaluate((br) => {
    $('cBrief').value = br.brief; $('cPiece').value = br.piece; $('cSup').value = br.sup; $('cFam').value = String(br.fam);
    $('cPos').value = br.pos; CR.n = br.n; ['cEmo','cMkt','cCult','cMus'].forEach(id => $(id).value = 0);
    const b = buildBrief();
    return ANGLES.map((a, i) => { const pp = makeProposal(a, b, br.seeds[i]);
      return { ang: a.k, hs: pp.hs, fonts: pp.fonts.map(f => f.n), li: pp.li, si: pp.si, u: pp.u, k: pp.k, t: pp.t, areas: pp.areas }; });
  }, br);
  proposals.push({ brief: br, props: r });
}

// alguns valores de núcleo
const core = await p.evaluate(() => ({
  anchors: ANCHORS.map(a => ({ a: a.a, nome: a.nome, hex: a.hex, L: a.L, C: a.C, H: a.H })),
  hexAt: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 345.5].map(a => [a, hexAt(a)]),
  nameOf: [0, 5, 10, 20, 40, 55, 59, 100, 180, 250, 299, 359].map(a => [a, nameOf(a)]),
  oklch: [[.5,.1,30],[.9,.3,120],[.2,.4,270],[.7,.2,0],[1,.5,200],[0,.1,10]].map(v => [v, oklch2hex(...v)]),
  codes: allCodes('#C4003F'),
  codes2: allCodes('#3E8F45'),
  mix: [['#C4003F','#22409B',.5],['#F2CC00','#3E8F45',.25]].map(v => [v, mixLch(...v)]),
  sim: ['protanopia','deuteranopia','tritanopia','acromatopsia'].map(k => [k, simulate('#E96A00', k)]),
  ratio: ratio('#C4003F', '#FFFFFF'),
  angleFor: [['#2340C8'], ['#F2600C'], ['#6F8F4A']].map(([h]) => [h, angleFor(hex2lch(h).H)]),
  hsl: rgb2hsl(196, 0, 63), hsv: rgb2hsv(196, 0, 63), cmyk: rgb2cmyk(196, 0, 63), lab: rgb2lab(196, 0, 63),
  hslHex: hslHex(210, 70, 55),
  crc: crc32(new TextEncoder().encode('Farbenkreis')),
}));

writeFileSync(path.join(root, 'tests/reference.json'), JSON.stringify({ palettes, pairs, proposals, core }, null, 1));
console.log('palettes', palettes.length, 'pairs', pairs.length, 'proposals', proposals.length);
await b.close();
