/* ═══════════ ESTADO DO INSTRUMENTO DE COR ═══════════
   Fonte única de verdade: os <select> e o controle de postura refletem S,
   não o contrário. syncControls() leva S para a interface. */
import { createStore } from '../core/state';
import { simulate } from '../core/color';
import { hexOfColor, type PaletteColor } from '../core/goethe';
import { $, $all, $set } from '../core/dom';
import { t } from '../i18n';
import { EMO, type Emotion } from '../data/emotions';
import { MKT, type Market } from '../data/markets';
import { SCH, type Scheme } from '../data/schemes';
import { LENS, type Lens } from '../data/lenses';
import { CULT, type Culture } from '../data/cultures';
import { MUS, type Music } from '../data/music';

export type ViewKey = 'faixas' | 'proporcao' | 'cartoes' | 'circulos' | 'aneis' | 'escalas' | 'mosaico' | 'interface' | 'poster' | 'degrade';
export type CodeFmt = 'css' | 'scss' | 'json' | 'tw' | 'swift' | 'android' | 'flutter' | 'hex';

export interface PaletteState {
  n: number; colors: PaletteColor[]; seed: number; fmt: CodeFmt; sel: number | null; baseOver: number | null; cvd: string;
  view: ViewKey; ctTarget: number; ctPair: [number, number] | null;
  emo: number; mkt: number; scheme: number; lens: number; cult: number; mus: number; pos: number;
}
export const paletteStore = createStore<PaletteState>({
  n: 5, colors: [], seed: .5, fmt: 'css', sel: null, baseOver: null, cvd: 'none',
  view: 'faixas', ctTarget: 4.5, ctPair: null,
  emo: 1, mkt: 3, scheme: 2, lens: 1, cult: 0, mus: 0, pos: 55
});
export const S = paletteStore.state;

/* Ganchos preenchidos por palette/index.ts — evitam import circular entre os módulos de desenho. */
export const hooks = { render: (): void => {} };

export interface Current { E: Emotion; M: Market; SC: Scheme; L: Lens; K: Culture; U: Music }
export const cur = (): Current => ({ E: EMO[S.emo], M: MKT[S.mkt], SC: SCH[S.scheme], L: LENS[S.lens], K: CULT[S.cult], U: MUS[S.mus] });

export const hexOf = hexOfColor;
export const shown = (c: PaletteColor): string => simulate(hexOf(c), S.cvd);
export const palette = (): string[] => S.colors.map(hexOf);

/* ── proporção ── */
export function proportionsFor(w0: number[], sy: number, n: number): number[] {
  const w = Array.from({ length: n }, (_, i) => w0[i % w0.length]);
  const ex = .6 + sy * .9, tot = w.reduce((s, x) => s + Math.pow(x, ex), 0);
  return w.map(x => Math.pow(x, ex) / tot * 100);
}
/** Nome da paleta, a partir da intenção, do campo e da lente. */
export function palName(): string { const { E, M, L } = cur();
  return [E.a !== null ? E.n : null, M.a !== null ? M.n : null, S.lens !== 0 ? L.n.split(' — ')[0] : null].filter(Boolean).join(' · ') || t('Paleta') }

export function proportions(): number[] { const { L, U } = cur(); return proportionsFor(L.w, U.sy, S.colors.length) }

/* ── S → interface ── */
export function syncControls(): void {
  $set('emo', S.emo); $set('mkt', S.mkt); $set('scheme', S.scheme); $set('lens', S.lens); $set('cult', S.cult); $set('mus', S.mus);
  $set('pos', S.pos); $('posval').textContent = String(S.pos);
  $('cntLbl').textContent = String(S.n);
  $all<HTMLButtonElement>($('cnt'), 'button').forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.n! === S.n)));
}
