/* ═══════════ O CÍRCULO DE GOETHE ═══════════
   Seis matizes de ancoragem nas posições do círculo pintado em Zur Farbenlehre,
   de 0° a 300°, com o purpúreo no topo. Purpúreo/verde, vermelho-amarelo/azul e
   amarelo/vermelho-azul são opostos exatos a 180°. Toda interpolação em OKLab. */
import { hex2lch, oklch2hex, wrapDeg, type OKLCH } from './color';

export interface Anchor extends OKLCH { a: number; nome: string; hex: string }

export const ANCHORS: Anchor[] = [
  { a: 0, nome: 'Purpúreo', hex: '#C4003F' }, { a: 60, nome: 'Vermelho-amarelo', hex: '#E96A00' },
  { a: 120, nome: 'Amarelo', hex: '#F2CC00' }, { a: 180, nome: 'Verde', hex: '#3E8F45' },
  { a: 240, nome: 'Azul', hex: '#22409B' }, { a: 300, nome: 'Vermelho-azul', hex: '#6E2B8C' }
].map(x => Object.assign(x, hex2lch(x.hex)));

/** Posição angular no círculo → OKLCH interpolado entre as âncoras vizinhas. */
export function atAngle(a: number): OKLCH {
  a = ((a % 360) + 360) % 360;
  const i = Math.floor(a / 60), p = ANCHORS[i], n = ANCHORS[(i + 1) % 6], t = (a - i * 60) / 60, dh = wrapDeg(n.H - p.H);
  return { L: p.L + (n.L - p.L) * t, C: p.C + (n.C - p.C) * t, H: p.H + dh * t };
}
export const hexAt = (a: number): string => { const c = atAngle(a); return oklch2hex(c.L, c.C, c.H) };

export function nameOf(a: number): string {
  a = ((a % 360) + 360) % 360;
  const i = Math.floor(a / 60), p = ANCHORS[i], n = ANCHORS[(i + 1) % 6], t = (a - i * 60) / 60;
  if (t < .14) return p.nome; if (t > .86) return n.nome;
  return t < .5 ? p.nome + ' puxado ao ' + n.nome.toLowerCase() : n.nome + ' puxado ao ' + p.nome.toLowerCase();
}

/** Matiz OKLCH (H) → posição no círculo de Goethe, por busca em passos de meio grau. */
export function angleFor(H: number): number {
  let best = 0, bd = 999;
  for (let a = 0; a < 360; a += .5) { const d = Math.abs(wrapDeg(atAngle(a).H - H)); if (d < bd) { bd = d; best = a } }
  return best;
}

export interface PaletteColor { a: number; L: number; C: number; lock: boolean }
export function colorsFromHex(hs: string[]): PaletteColor[] {
  return hs.map(h => { const l = hex2lch(h); return { a: angleFor(l.H), L: l.L, C: l.C, lock: false } });
}
/** Hex real de uma cor da paleta: luminosidade e croma próprios, matiz vindo do círculo. */
export const hexOfColor = (c: { a: number; L: number; C: number }): string => oklch2hex(c.L, c.C, atAngle(c.a).H);
