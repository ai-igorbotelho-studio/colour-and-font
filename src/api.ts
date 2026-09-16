/* ═══════════ API HEADLESS ═══════════
   O motor de Auge sem interface: as mesmas funções puras que a página usa,
   expostas para agentes e scripts. Nada de DOM, nada de rede. Determinístico:
   a mesma entrada (com a mesma semente) devolve sempre a mesma saída.
   Consumido por bin/auge.mjs (CLI) e agent/mcp-server.mjs (MCP). */
import { hex2rgb, rgb2hsl, rgb2cmyk, hex2lch, ratio } from './core/color';
import { colorsFromHex, hexOfColor, nameOf, atAngle, angleFor } from './core/goethe';
import { colourName } from './core/names';
import { lcg } from './core/rng';
import { useLang, isEn, type Lang } from './i18n';
import { localizeData } from './i18n/data-en';
import { EMO } from './data/emotions';
import { MKT } from './data/markets';
import { SCH } from './data/schemes';
import { LENS } from './data/lenses';
import { CULT } from './data/cultures';
import { MUS } from './data/music';
import { RANGES, rangeOf } from './data/range';
import { ANGLES } from './data/lexicon';
import { FONTS, BANK_NAME, CLS, bankPage, type Font } from './data/fonts';
import { generatePalette } from './palette/generate';
import { proportionsFor } from './palette/state';
import { candidates, pairScore, isSerif, describe, type Filters, type Slot } from './type/pairing';
import { makeProposal } from './create/proposals';
import { mdBlock } from './create/markdown';
import type { Brief } from './create/brief';

export const VERSION = '1.0.0';
export const INVARIANTS = 'Six Goethe anchors with 180° opposites; OKLab interpolation with binary-search chroma reduction (never clipped); black and white are full colours; contrast measured on the real colours (WCAG 2.1). No network calls. Deterministic given a seed.';

let inited = false;
/** Fixa o idioma do processo (inglês por padrão). Chamar antes do resto. */
export function init(lang: Lang = 'en'): void {
  useLang(lang); if (lang === 'en') localizeData(); inited = true;
}
const ensure = (): void => { if (!inited) init('en'); };
const L = <T extends { n: string }>(a: T[]): { index: number; label: string }[] => a.map((x, i) => ({ index: i, label: x.n }));

/* ── resolução de valores: aceita índice numérico, chave/slug ou nome ── */
const resolve = (arr: { n: string }[], v: unknown, dflt = 0): number => {
  if (v === undefined || v === null || v === '') return dflt;
  if (typeof v === 'number') return v >= 0 && v < arr.length ? v : dflt;
  const s = String(v).toLowerCase();
  const exact = arr.findIndex(x => x.n.toLowerCase() === s);
  if (exact >= 0) return exact;
  const part = arr.findIndex(x => x.n.toLowerCase().includes(s) || x.n.toLowerCase().split(/[ —–-]+/)[0] === s);
  return part >= 0 ? part : dflt;
};
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

export interface ColourOut { hex: string; name: string; rgb: number[]; hsl: number[]; cmyk: number[]; oklch: { L: number; C: number; H: number }; areaPct: number; goethe: string }
function enrich(hex: string, areaPct: number): ColourOut {
  const [r, g, b] = hex2rgb(hex), o = hex2lch(hex);
  return { hex, name: colourName(hex)[isEn() ? 1 : 0], rgb: [r, g, b], hsl: rgb2hsl(r, g, b).map(x => Math.round(x)),
    cmyk: rgb2cmyk(r, g, b).map(x => Math.round(x)), oklch: { L: +(o.L).toFixed(3), C: +(o.C).toFixed(3), H: Math.round(o.H) },
    areaPct: Math.round(areaPct), goethe: nameOf(angleFor(o.H)) };
}
const fontOut = (f: Font) => ({ name: f.n, bank: BANK_NAME[f.src], class: CLS[f.cls].n, page: bankPage(f), weights: f.wts.split(';'), note: describe(f) });

/* ── catálogo de opções, para o agente montar pedidos válidos ── */
export function listOptions(): Record<string, unknown> {
  ensure();
  return {
    version: VERSION,
    intentions: L(EMO), fields: L(MKT), schemes: L(SCH), lenses: L(LENS),
    cultures: L(CULT), music: L(MUS),
    ranges: RANGES.map(r => ({ key: r.k, label: r.n, note: r.d })),
    fontBanks: Object.entries(BANK_NAME).map(([k, v]) => ({ key: k, label: v })),
    fontClasses: Object.entries(CLS).map(([k, v]) => ({ key: k, label: v.n })),
    strategies: [['contraste', 'Structural contrast'], ['super', 'Superfamily'], ['uma', 'Single family'], ['metrica', 'Metric compatibility'], ['oposto', 'Maximum opposition']].map(([key, label]) => ({ key, label })),
    readings: ANGLES.map((a, i) => ({ index: i, key: a.k, label: a.n })),
    counts: { colours: [2, 6], families: [1, 5] },
  };
}

/* ── paleta a partir de um breve ── */
export interface PaletteSpec { intention?: unknown; field?: unknown; scheme?: unknown; lens?: unknown; culture?: unknown; music?: unknown; range?: string; stance?: number; n?: number; seed?: number; markdown?: boolean }
export function palette(spec: PaletteSpec = {}): Record<string, unknown> {
  ensure();
  const e = resolve(EMO, spec.intention), m = resolve(MKT, spec.field), sc = resolve(SCH, spec.scheme, 0),
    l = resolve(LENS, spec.lens, 1), k = resolve(CULT, spec.culture), u = resolve(MUS, spec.music);
  const R = rangeOf(spec.range || 'normal'), n = clamp(Math.round(spec.n ?? 5), 2, 6), seed = spec.seed ?? 0.5;
  const t = clamp((spec.stance ?? 55) / 100 + R.dpos, 0, 1);
  const cols = generatePalette({ seed, n, E: EMO[e], M: MKT[m], SC: SCH[sc], L: LENS[l], K: CULT[k], U: MUS[u], t, jit: 46 * R.jit, dc: R.dc });
  const hs = cols.map(hexOfColor), areas = proportionsFor(LENS[l].w, MUS[u].sy, n);
  const colours = hs.map((h, i) => enrich(h, areas[i]));
  const out: Record<string, unknown> = { scheme: SCH[sc].n, intention: EMO[e].n, field: MKT[m].n, range: R.n, stance: Math.round(t * 100), colours };
  if (spec.markdown) out.markdown = mdBlock(EMO[e].a !== null ? EMO[e].n : SCH[sc].n, hs, areas, null);
  return out;
}

/* ── paleta a partir de cores já extraídas (ex.: de uma imagem) ── */
export function paletteFromColours(hexes: string[], opts: { markdown?: boolean } = {}): Record<string, unknown> {
  ensure();
  const hs = hexes.map(h => h.trim()).filter(h => /^#?[0-9a-f]{6}$/i.test(h)).map(h => h.startsWith('#') ? h.toUpperCase() : '#' + h.toUpperCase());
  const cols = colorsFromHex(hs), areas = proportionsFor(LENS[1].w, MUS[0].sy, hs.length);
  const colours = hs.map((h, i) => enrich(h, areas[i]));
  const out: Record<string, unknown> = { colours, wheel: cols.map(c => ({ angle: Math.round(atAngle(c.a).H), L: +c.L.toFixed(3), C: +c.C.toFixed(3) })) };
  if (opts.markdown) out.markdown = mdBlock('Image palette', hs, areas, null);
  return out;
}

/* ── par ou conjunto tipográfico, com filtros completos ── */
export interface PairingSpec { intention?: unknown; strategy?: string; families?: number; bank?: string; classDisplay?: string; classBody?: string; width?: string; contrast?: string; use?: string; range?: string; seed?: number }
export function pairing(spec: PairingSpec = {}): Record<string, unknown> {
  ensure();
  const F: Filters = { bank: spec.bank || 'none', wf: spec.width || 'none', cf: spec.contrast || 'none',
    clsD: spec.classDisplay || 'none', clsB: spec.classBody || 'none', use: spec.use || 'none',
    strat: spec.strategy || 'contraste', emo: resolve(EMO, spec.intention), range: spec.range || 'normal' };
  const nf = clamp(Math.round(spec.families ?? 2), 1, 5), seed = spec.seed ?? 0.5, rnd = lcg(seed, 1);
  const D = candidates('disp', F), B = candidates('body', F);
  if (!D.length || !B.length) return { error: 'No families match those filters' };
  const scored: { d: Font; b: Font; s: number }[] = [];
  D.forEach(d => B.forEach(b => scored.push({ d, b, s: pairScore(d, b, F) + rnd() * 24 })));
  scored.sort((x, y) => y.s - x.s);
  const pool = scored.slice(0, Math.max(1, Math.min(8, scored.length))), p = pool[Math.floor(rnd() * pool.length)];
  const out: Font[] = nf === 1 ? [p.b.role === 'both' ? p.b : p.d] : [p.d, p.b];
  const extra = (slot: Slot, test: (f: Font) => boolean): void => { const c = candidates(slot, F).filter(f => out.indexOf(f) < 0 && test(f)); if (c.length) out.push(c[Math.floor(rnd() * c.length)]) };
  if (nf >= 3) extra('mono', () => true);
  if (nf >= 4) extra('disp', f => isSerif(f.cls) !== isSerif(p.b.cls));
  if (nf >= 5) extra('body', () => true);
  return { strategy: F.strat, families: out.slice(0, nf).map(fontOut) };
}

/* ── três propostas completas (paleta + tipografia + leitura), como a página Criação ── */
export interface BriefSpec { intention?: unknown; field?: unknown; culture?: unknown; music?: unknown; stance?: number; range?: string; colours?: number; families?: number; piece?: string; seed?: number; imageColours?: string[] }
export function proposals(spec: BriefSpec = {}): Record<string, unknown> {
  ensure();
  const seed = spec.seed ?? 0.5;
  const br: Brief = {
    piece: spec.piece || 'none', sup: 'none',
    e: resolve(EMO, spec.intention), m: resolve(MKT, spec.field),
    k: resolve(CULT, spec.culture), u: resolve(MUS, spec.music),
    n: clamp(Math.round(spec.colours ?? 5), 2, 6), nf: clamp(Math.round(spec.families ?? 2), 1, 5),
    t: clamp((spec.stance ?? 50) / 100, 0, 1), dc: 1, words: [], range: spec.range || 'normal',
    imgBase: spec.imageColours && spec.imageColours.length ? colorsFromHex([spec.imageColours[0]])[0].a : null, imgType: null,
  };
  const out = ANGLES.map((a, i) => {
    const p = makeProposal(a, br, (seed * (i + 1) * 7.13) % 1);
    return { reading: p.ang.n, scheme: SCH[p.si].n, lens: LENS[p.li].n.split(' — ')[0],
      colours: p.hs.map((h, j) => enrich(h, p.areas[j])), families: p.fonts.map(fontOut),
      rationale: p.ang.why };
  });
  return { seed, proposals: out };
}
