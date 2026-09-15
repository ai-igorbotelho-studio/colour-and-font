/* ── três propostas por caminhos opostos: paleta, famílias e raciocínio ── */
import { lum, ratio, mixLch } from '../core/color';
import { hexOfColor, colorsFromHex, type PaletteColor } from '../core/goethe';
import { lcg } from '../core/rng';
import { t } from '../i18n';
import { norm } from '../core/dom';
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { SCH } from '../data/schemes';
import { LENS } from '../data/lenses';
import { CULT } from '../data/cultures';
import { MUS } from '../data/music';
import { pool as fontPool, type Font } from '../data/fonts';
import { PIECES, type Angle } from '../data/lexicon';
import { generatePalette } from '../palette/generate';
import { proportionsFor } from '../palette/state';
import { isSerif, describe, rangeBias } from '../type/pairing';
import { imgAffinity } from '../type/fontmatch';
import { rangeOf } from '../data/range';
import { loadFont } from '../type/loader';
import { findIdx, type Brief } from './brief';

export interface Proposal { ang: Angle; br: Brief; li: number; si: number; t: number; u: number; k: number; cols: PaletteColor[]; fonts: Font[]; areas: number[]; seed: number; hs: string[]; faithful?: boolean }

/* ── famílias calculadas fora do DOM ── */
export function genFonts(o: { e: number; strat: string; use: string; nf: number; seed: number; range?: string; img?: import('../core/image').TypeMetrics | null }): Font[] {
  const editorial = o.use === 'relatorio' || o.use === 'ebook' || o.use === 'news';
  const FONTS = fontPool();
  const D = FONTS.filter(f => f.cls !== 'mono' && f.role !== 'body');
  const B = FONTS.filter(f => f.cls !== 'mono' && f.role !== 'display' && !(editorial && f.cls === 'sans-geo'));
  const rnd = lcg(o.seed, 7);
  const E = EMO[o.e], key = E.a === null ? null : E.key!;
  const mood = (f: Font) => key && f.moods.some(m => norm(m).startsWith(key)) ? 26 : 0;
  const pairs: { d: Font; b: Font; s: number }[] = [];
  D.forEach(d => B.forEach(b => {
    let s = mood(d) * 1.1 + mood(b);
    const sameSuper = d.sf && d.sf === b.sf, sameFam = d.n === b.n;
    const cd = isSerif(d.cls) !== isSerif(b.cls) ? 1 : d.cls !== b.cls ? .5 : 0;
    const ctd = Math.abs(d.ct - b.ct), xd = Math.abs(d.x - b.x), wd = Math.abs(d.w - b.w);
    if (o.strat === 'super') s += sameFam ? -35 : (sameSuper ? 60 : -45);
    else if (o.strat === 'uma') s += sameFam ? 70 : -60;
    else if (o.strat === 'oposto') s += cd * 40 + ctd * 60 + wd * 40 + (sameFam ? -80 : 0);
    else if (o.strat === 'metrica') s += (1 - xd * 4) * 40 + (1 - wd * 4) * 26 + cd * 12 + (sameFam ? -40 : 0);
    else s += cd * 34 + ctd * 40 - xd * 70 - wd * 40 + (sameFam ? -60 : 0);
    if (editorial && b.role === 'both') s += 8;
    s += rangeBias(d, b, o.range || 'normal');
    if (o.img) s += imgAffinity(d, o.img);
    pairs.push({ d, b, s: s + rnd() * 24 }) }));
  pairs.sort((x, y) => y.s - x.s);
  const pool = pairs.slice(0, 8), p = pool[Math.floor(rnd() * pool.length)];
  const out: Font[] = o.nf === 1 ? [p.b.role === 'both' ? p.b : p.d] : [p.d, p.b];
  if (o.nf >= 3) { const ms = FONTS.filter(f => f.cls === 'mono');
    out.push(ms.find(m => m.sf && (m.sf === p.d.sf || m.sf === p.b.sf)) || ms[Math.floor(rnd() * ms.length)]) }
  if (o.nf >= 4) { const qs = FONTS.filter(f => f.cls !== 'mono' && out.indexOf(f) < 0 && f.role !== 'body' && isSerif(f.cls) !== isSerif(p.b.cls));
    out.push(qs[Math.floor(rnd() * qs.length)]) }
  return out.filter(Boolean);
}

export function makeProposal(ang: Angle, br: Brief, seed: number): Proposal {
  const lensName = (br.lensFrag && ang.k === 'convencao') ? br.lensFrag : ang.lens[Math.floor(seed * ang.lens.length) % ang.lens.length];
  let li = findIdx(LENS, lensName); if (li < 0) li = findIdx(LENS, ang.lens[0]); if (li < 0) li = 1;
  let si = findIdx(SCH, ang.sch[Math.floor(seed * 97 * ang.sch.length) % ang.sch.length]); if (si < 0) si = 2;
  const R = rangeOf(br.range || 'normal');
  const t = Math.max(0, Math.min(1, br.t + ang.dpos + R.dpos));
  const nf = br.nf || (ang.k === 'lateral' ? 3 : 2);
  // a leitura lateral troca o eixo: se nada foi pedido, ela traz uma dinâmica musical própria
  let u = br.u; const k = br.k;
  if (ang.k === 'lateral' && u === 0) u = 1 + Math.floor(seed * 631) % (MUS.length - 1);
  if (ang.k === 'ruptura' && u === 0 && br.t > .6) u = 6;
  const cols = generatePalette({ seed, n: br.n, E: EMO[br.e], M: MKT[br.m], SC: SCH[si], L: LENS[li], K: CULT[k], U: MUS[u], t, jit: 40 * R.jit, dc: br.dc * R.dc, baseOver: br.imgBase ?? undefined });
  const fonts = genFonts({ e: br.e, strat: ang.strat, use: br.piece, nf, seed, range: br.range, img: br.imgType ?? null });
  const areas = proportionsFor(LENS[li].w, MUS[u].sy, br.n);
  fonts.forEach(loadFont);
  return { ang, br, li, si, t, u, k, cols, fonts, areas, seed, hs: cols.map(hexOfColor) };
}
/** Uma proposta com exatamente as cores extraídas da imagem, mantendo fontes e leitura. */
export function faithfulFromImage(base: Proposal, hs: string[]): Proposal {
  return { ...base, cols: colorsFromHex(hs), hs: hs.slice(), areas: proportionsFor(LENS[base.li].w, MUS[base.u].sy, hs.length), faithful: true };
}
export interface Roles { bg: string; ink: string; ac: string; mut: string }
export function roleOf(p: Proposal): Roles {
  const ls = p.hs.map(lum), bg = p.hs[ls.indexOf(Math.max(...ls))], ink = p.hs[ls.indexOf(Math.min(...ls))];
  const ac = p.hs.find(h => h !== bg && h !== ink && ratio(h, bg) >= 3) || ink;
  return { bg, ink, ac, mut: mixLch(ink, bg, .4) };
}
export function titleFor(br: Brief): string {
  const E = EMO[br.e], M = MKT[br.m], P = PIECES.find(x => x.v === br.piece);
  if (E.a !== null && M.a !== null) return t('{e} em {m}', { e: E.n, m: M.n.toLowerCase() });
  if (E.a !== null) return E.n;
  if (M.a !== null) return M.n;
  return P && P.v !== 'none' ? P.n : t('Proposta');
}

/* ── raciocínio ── */
export function why(p: Proposal): string {
  const E = EMO[p.br.e], L = LENS[p.li], SCx = SCH[p.si], K = CULT[p.k], U = MUS[p.u];
  const d = p.fonts[0], b = p.fonts[1] || p.fonts[0];
  let pares = 0; p.hs.forEach((bg, i) => p.hs.forEach((tx, j) => { if (i !== j && ratio(tx, bg) >= 4.5) pares++ }));
  let s = `<p class="lede">${p.ang.why}</p>`;
  s += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${t('Cor')}.</b> `
   + (E.a !== null ? `${E.g.split('.')[0]}. ` : '')
   + t('O esquema é {s} — {d} ', { s: SCx.n.toLowerCase(), d: SCx.d.toLowerCase() })
   + t('A área vem do método de {l}: {m}.', { l: L.n.split(' — ')[0], m: L.m.split('.')[0].toLowerCase() })
   + (K.anc ? t(' A referência {k} puxa o matiz para os pigmentos que aquela cultura tinha à mão.', { k: K.n.split(' — ')[0] }) : '')
   + (U.m ? t(' A dinâmica de {u} reescreve a proporção entre as cores.', { u: U.n.toLowerCase() }) : '') + `</p>`;
  s += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${t('Tipografia')}.</b> `
   + (p.fonts.length === 1 ? t('{d} sozinha: a hierarquia inteira terá de vir de peso, corpo e caixa.', { d: d.n })
     : isSerif(d.cls) !== isSerif(b.cls) ? t('{d} contra {b} — uma serifada e uma sem serifa, diferença de estrutura clara o bastante para que nenhuma pareça erro.', { d: d.n, b: b.n })
     : d.sf && d.sf === b.sf ? t('{d} e {b} são da mesma superfamília, desenhadas para conviver: harmonia garantida, contraste vindo do peso.', { d: d.n, b: b.n })
     : t('{d} e {b} compartilham a classificação, então o contraste terá de vir do peso e do corpo.', { d: d.n, b: b.n }))
   + t(' {d} Do lado do texto: {b}', { d: describe(d), b: describe(b).toLowerCase() }) + `</p>`;
  s += `<p class="lede" style="margin-top:10px"><b style="color:var(--ink)">${t('Riscos.')}</b> `
   + (pares ? t('{n} pares desta paleta passam em 4,5 para 1, então há por onde escrever.', { n: pares })
     : t('Nenhum par desta paleta chega a 4,5 para 1 — ela é de superfície, e o texto vai precisar de um preto ou branco de fora.'))
   + (p.br.sup === 'impresso' || p.br.sup === 'ambos' ? t(' Como vai para papel, confira o CMYK: matizes muito saturados não existem em tinta de escala.') : '')
   + (p.br.sup === 'ambiente' ? t(' Em grande formato, a distância de leitura perdoa menos o contraste baixo do que a tela.') : '') + `</p>`;
  return s;
}
