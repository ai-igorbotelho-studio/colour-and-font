/* ── combinação de famílias: cinco estratégias, um a cinco lugares ── */
import { $v, norm } from '../core/dom';
import { t } from '../i18n';
import { lcg } from '../core/rng';
import { EMO } from '../data/emotions';
import { pool, CLS, type Font, type FontClass } from '../data/fonts';
import { T } from './state';

export const isSerif = (c: FontClass | string): boolean => c.startsWith('serif');
/** Pilha CSS da família, com a reserva declarada. */
export const fam = (f: Font): string => `"${f.n}", ${f.cls === 'mono' ? 'ui-monospace, monospace' : isSerif(f.cls) ? 'Georgia, serif' : 'system-ui, sans-serif'}`;
/** A mesma pilha para atributos style="…" em HTML: aspas simples, senão a aspa dupla encerra o atributo
    e todo o estilo inline se perde — era o que acontecia com a amostra do arquivo original. */
export const famAttr = (f: Font): string => fam(f).replace(/"/g, "'");
export function describe(f: Font): string {
  const p = [CLS[f.cls].n.toLowerCase()];
  p.push(t(f.x >= .54 ? 'altura de x alta' : f.x <= .45 ? 'altura de x baixa' : 'altura de x média'));
  p.push(t(f.ct >= .7 ? 'contraste de traço alto' : f.ct <= .15 ? 'contraste quase nulo' : 'contraste moderado'));
  if (f.w <= .36) p.push(t('condensada')); else if (f.w >= .56) p.push(t('larga'));
  p.push(t(f.role === 'display' ? 'feita para corpo grande' : f.role === 'body' ? 'feita para texto corrido' : f.role === 'mono' ? 'monoespaçada' : 'serve a título e a texto'));
  return p.join(', ') + '.';
}
export const widthBand = (w: number): string => w <= .36 ? 'cond' : w >= .56 ? 'ext' : 'norm';
export const contrBand = (c: number): string => c <= .2 ? 'low' : c >= .65 ? 'high' : 'med';

export type Slot = 'disp' | 'body' | 'mono';
export interface Filters { bank: string; wf: string; cf: string; clsD: string; clsB: string; use: string; strat: string; emo: number }
export const filtersFromUI = (): Filters => ({ bank: $v('tBank'), wf: $v('tWidth'), cf: $v('tContr'), clsD: $v('tClsD'), clsB: $v('tClsB'), use: $v('tUse'), strat: $v('tStrat'), emo: +$v('tEmo') });

export function candidates(slot: Slot, F: Filters = filtersFromUI()): Font[] {
  const cls = slot === 'disp' ? F.clsD : F.clsB, use = F.use;
  return pool().filter(f => {
    if (f.cls === 'mono' && slot !== 'mono') return false;
    if (slot === 'mono' && f.cls !== 'mono') return false;
    if (F.bank !== 'none' && f.src !== F.bank) return false;
    if (cls !== 'none' && f.cls !== cls) return false;
    if (F.wf !== 'none' && widthBand(f.w) !== F.wf) return false;
    if (F.cf !== 'none' && contrBand(f.ct) !== F.cf) return false;
    if (slot === 'disp' && f.role === 'body' && use === 'display') return false;
    if (slot === 'body' && f.role === 'display') return false;
    if (slot === 'body' && use === 'editorial' && f.cls === 'sans-geo') return false;
    if (slot === 'body' && use === 'ui' && f.ct >= .7) return false;
    return true });
}
export function moodScore(f: Font, emo: number): number { const e = EMO[emo]; if (e.a === null) return 0;
  const key = e.key!;
  return f.moods.some(m => norm(m).startsWith(key)) ? 26 : 0 }
export function pairScore(d: Font, b: Font, F: Filters): number {
  const st = F.strat; let s = moodScore(d, F.emo) * 1.1 + moodScore(b, F.emo);
  const sameSuper = d.sf && d.sf === b.sf, sameFam = d.n === b.n;
  const classDiff = isSerif(d.cls) !== isSerif(b.cls) ? 1 : d.cls !== b.cls ? .5 : 0;
  const ctDiff = Math.abs(d.ct - b.ct), xDiff = Math.abs(d.x - b.x), wDiff = Math.abs(d.w - b.w);
  if (st === 'super') s += sameFam ? -35 : (sameSuper ? 60 : -45);
  else if (st === 'uma') s += sameFam ? 70 : -60;
  else if (st === 'contraste') { s += classDiff * 34 + ctDiff * 40 - xDiff * 70 - wDiff * 40; if (sameFam) s -= 60 }
  else if (st === 'metrica') { s += (1 - xDiff * 4) * 40 + (1 - wDiff * 4) * 26 + classDiff * 12; if (sameFam) s -= 40 }
  else if (st === 'oposto') { s += classDiff * 40 + ctDiff * 60 + wDiff * 40; if (sameFam) s -= 80 }
  else { s += classDiff * 10 - xDiff * 20; if (sameFam) s -= 25 }
  if (b.role === 'display') s -= 25;
  if (d.role === 'body') s -= 10;
  return s;
}
export interface Pair { d: Font; b: Font; s: number }
export function pickPair(seed: number = T.seed, F: Filters = filtersFromUI()): Pair | null {
  const D = candidates('disp', F), B = candidates('body', F);
  if (!D.length || !B.length) return null;
  const rnd = lcg(seed, 1);
  const pairs: Pair[] = [];
  D.forEach(d => B.forEach(b => pairs.push({ d, b, s: pairScore(d, b, F) + rnd() * 24 })));
  pairs.sort((x, y) => y.s - x.s);
  const pool = pairs.slice(0, Math.max(1, Math.min(8, pairs.length)));
  return pool[Math.floor(rnd() * pool.length)];
}
export function pickSet(n: number): Font[] | null {
  const p = pickPair(); if (!p) return null;
  const out: Font[] = [];
  if (n === 1) out.push(p.b.role === 'both' ? p.b : (p.d.role === 'both' ? p.d : p.b));
  else out.push(p.d, p.b);
  if (n >= 3) { const ms = candidates('mono');
    out.push(ms.find(m => m.sf && (m.sf === p.d.sf || m.sf === p.b.sf)) || ms[Math.floor(Math.random() * ms.length)] || p.b) }
  const FONTS = pool();
  if (n >= 4) { const qs = FONTS.filter(f => f.cls !== 'mono' && out.indexOf(f) < 0 && f.role !== 'body' && isSerif(f.cls) !== isSerif(p.b.cls));
    out.push(qs[Math.floor(Math.random() * qs.length)] || FONTS.find(f => out.indexOf(f) < 0)!) }
  if (n >= 5) { const as = FONTS.filter(f => f.cls !== 'mono' && out.indexOf(f) < 0 && Math.abs(f.x - p.b.x) <= .06);
    out.push(as[Math.floor(Math.random() * as.length)] || FONTS.find(f => out.indexOf(f) < 0)!) }
  return out.filter(Boolean).slice(0, n);
}
