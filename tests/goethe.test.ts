import { describe, it, expect } from 'vitest';
import { ANCHORS, atAngle, hexAt, nameOf, angleFor, colorsFromHex } from '../src/core/goethe';
import { hex2lch, wrapDeg } from '../src/core/color';
import { generatePalette } from '../src/palette/generate';
import { proportionsFor } from '../src/palette/state';
import { EMO } from '../src/data/emotions';
import { MKT } from '../src/data/markets';
import { SCH } from '../src/data/schemes';
import { LENS } from '../src/data/lenses';
import { CULT } from '../src/data/cultures';
import { MUS } from '../src/data/music';
import ref from './reference.json';

describe('as seis âncoras do círculo de Goethe', () => {
  it('ficam de 0° a 300°, de 60 em 60, com o purpúreo no topo', () => {
    expect(ANCHORS.map(a => a.a)).toEqual([0, 60, 120, 180, 240, 300]);
    expect(ANCHORS[0].nome).toBe('Purpúreo');
  });
  it('os pares históricos são opostos exatos a 180°', () => {
    const at = (n: string) => ANCHORS.find(a => a.nome === n)!.a;
    expect(Math.abs(at('Purpúreo') - at('Verde'))).toBe(180);
    expect(Math.abs(at('Vermelho-amarelo') - at('Azul'))).toBe(180);
    expect(Math.abs(at('Amarelo') - at('Vermelho-azul'))).toBe(180);
  });
  it('não mudaram em relação ao arquivo original', () => {
    expect(ANCHORS.map(a => ({ a: a.a, nome: a.nome, hex: a.hex, L: a.L, C: a.C, H: a.H }))).toEqual(ref.core.anchors);
  });
});

describe('continuidade do círculo', () => {
  it('a cor em cada âncora é a própria âncora', () => {
    for (const an of ANCHORS) expect(hexAt(an.a)).toBe(an.hex);
  });
  it('não há salto: passos de 1° mudam o matiz OKLCH em menos de 3°', () => {
    for (let a = 0; a < 360; a++) {
      const d = Math.abs(wrapDeg(atAngle(a + 1).H - atAngle(a).H));
      expect(d).toBeLessThan(3);
    }
  });
  it('360° é 0°', () => { expect(hexAt(360)).toBe(hexAt(0)); expect(hexAt(-60)).toBe(hexAt(300)) });
  it('bate com os hex colhidos do original', () => {
    for (const [a, hex] of ref.core.hexAt as [number, string][]) expect(hexAt(a)).toBe(hex);
  });
});

describe('nomes', () => {
  it('batem com o original', () => { for (const [a, n] of ref.core.nameOf as [number, string][]) expect(nameOf(a)).toBe(n) });
  it('perto da âncora é o nome puro; no meio, "puxado ao"', () => {
    expect(nameOf(3)).toBe('Purpúreo'); expect(nameOf(20)).toContain('puxado ao');
  });
});

describe('hex → posição no círculo', () => {
  it('bate com o original', () => { for (const [h, a] of ref.core.angleFor as [string, number][]) expect(angleFor(hex2lch(h).H)).toBe(a) });
  it('as âncoras voltam à própria posição', () => { for (const an of ANCHORS) expect(angleFor(an.H)).toBe(an.a) });
  it('colorsFromHex preserva luminosidade e croma', () => {
    const c = colorsFromHex(['#2340C8'])[0], l = hex2lch('#2340C8');
    expect(c.L).toBe(l.L); expect(c.C).toBe(l.C); expect(c.lock).toBe(false);
  });
});

describe('gerador de paleta — mesma semente, mesmos hex do arquivo original', () => {
  for (const p of ref.palettes) {
    const s = p.scen;
    it(`semente ${s.seed}, ${s.n} cores, esquema ${SCH[s.scheme].n}`, () => {
      const cols = generatePalette({ seed: s.seed, n: s.n, E: EMO[s.emo], M: MKT[s.mkt], SC: SCH[s.scheme], L: LENS[s.lens], K: CULT[s.cult], U: MUS[s.mus], t: s.pos / 100, jit: 46 });
      expect(cols.map(c => ({ a: c.a, L: c.L, C: c.C }))).toEqual(p.colors);
      proportionsFor(LENS[s.lens].w, MUS[s.mus].sy, s.n).forEach((v, i) => expect(v).toBeCloseTo(p.props[i], 10));
    });
  }
  it('respeita cadeados: a cor congelada não muda', () => {
    const base = { n: 3, E: EMO[1], M: MKT[3], SC: SCH[2], L: LENS[1], K: CULT[0], U: MUS[0], t: .55, jit: 46 };
    const a = generatePalette({ ...base, seed: .5 });
    a[1].lock = true;
    const b = generatePalette({ ...base, seed: .9, prev: a, keepLocks: true });
    expect(b[1]).toBe(a[1]); expect(b[0]).not.toEqual(a[0]);
  });
  it('a treva de uma paleta carrega matiz: o preto tem ângulo e croma', () => {
    const cols = generatePalette({ seed: .2, n: 5, E: EMO[5], M: MKT[8], SC: SCH[1], L: LENS[7], K: CULT[0], U: MUS[0], t: .5, jit: 46 });
    const dark = cols.reduce((p, c) => c.L < p.L ? c : p);
    expect(dark.L).toBeLessThan(.3); expect(dark.C).toBeGreaterThan(0); expect(dark.a).toBeGreaterThanOrEqual(0);
  });
});
