/* ═══════════ GERADOR DE PALETA ═══════════
   Função pura, sem DOM. Serve ao instrumento de cor (com cadeados e posição à mão)
   e à página Criação (com o fator de croma vindo do léxico). A ordem em que o
   gerador determinístico é consumido é a de sempre: mesma semente, mesmos hex. */
import { wrapDeg } from '../core/color';
import { atAngle, type PaletteColor } from '../core/goethe';
import { lcg } from '../core/rng';
import type { Emotion } from '../data/emotions';
import type { Market } from '../data/markets';
import type { Scheme } from '../data/schemes';
import type { Lens } from '../data/lenses';
import type { Culture } from '../data/cultures';
import type { Music } from '../data/music';

export interface GenOpts {
  seed: number; n: number;
  E: Emotion; M: Market; SC: Scheme; L: Lens; K: Culture; U: Music;
  /** postura entre convenção do campo (0) e intenção (1) */
  t: number;
  /** amplitude do sorteio inicial de matiz: 46 no instrumento, 40 na Criação */
  jit: number;
  /** fator de croma vindo do léxico da Criação */
  dc?: number;
  /** primeira cor posicionada à mão no anel */
  baseOver?: number | null;
  /** cores anteriores, para respeitar cadeados e posições livres */
  prev?: PaletteColor[]; keepLocks?: boolean;
}

export function generatePalette(o: GenOpts): PaletteColor[] {
  const rnd = lcg(o.seed, 1);
  const { E, M, SC, L, K, U } = o;
  let base: number;
  if (o.baseOver !== null && o.baseOver !== undefined) base = o.baseOver;
  else {
    const jit = (rnd() - .5) * o.jit;
    let b: number;
    if (E.a === null && M.a === null) b = o.seed * 360;
    else if (E.a === null) b = M.a as number;
    else if (M.a === null) b = E.a;
    else b = M.a + wrapDeg(E.a - M.a) * o.t;
    b = (b + jit + 360) % 360;
    if (K.anc) {
      let best = K.anc[0], bd = 999;
      K.anc.forEach(x => { const d = Math.abs(wrapDeg(x - b)); if (d < bd) { bd = d; best = x } });
      b = (b + wrapDeg(best - b) * K.pull + 360) % 360;
    }
    base = b;
  }
  const Cm = L.Cm * K.Cm * U.Cm * (o.dc || 1), ct = U.ct, n = o.n;
  const old = o.prev || [], out: PaletteColor[] = [];
  for (let i = 0; i < n; i++) {
    const prev = old[i];
    if (o.keepLocks && prev && prev.lock) { out.push(prev); continue }
    let a: number;
    if (SC.off === null) a = prev ? prev.a : (base + i * (360 / n)) % 360;
    else a = i === 0 ? base : (base + SC.off[(i - 1) % SC.off.length] + 360) % 360;
    // luminosidade vinda do método do estúdio, esticada pelo contraste do estilo musical
    const jL = (rnd() - .5) * .11, jC = .80 + rnd() * .46, jH = (rnd() - .5) * 13;
    if (SC.off !== null && i > 0) a = (a + jH + 360) % 360;
    let Lt = L.Lp[i % L.Lp.length] + jL;
    Lt = .5 + (Lt - .5) * (1 + ct * .42);
    if (i === 0 && L.dark) Lt = Math.max(.08, Lt + K.trevaD);
    if (Lt > .9) Lt = Math.min(.995, Lt + K.luzD);
    if (Lt < .25) Lt = Math.max(.05, Lt + K.trevaD);
    const nat = atAngle(a);
    let C = nat.C * Cm * jC * (SC.mono ? (1 - i * .14) : 1);
    if (Lt > .9) C *= .22; else if (Lt < .22) C *= .5;
    out.push({ a, L: Math.max(.04, Math.min(.995, Lt)), C: Math.max(0, C), lock: prev ? prev.lock : false });
  }
  return out;
}
