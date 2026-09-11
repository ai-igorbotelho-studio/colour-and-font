import { describe, it, expect } from 'vitest';
import { hex2rgb, rgb2hex, rgb2oklab, oklab2raw, oklch2hex, hex2lch, lum, ratio, readable, mixLch, rgb2hsl, rgb2hsv, rgb2cmyk, rgb2lab, hslHex, simulate, unlin, wrapDeg } from '../src/core/color';
import { allCodes } from '../src/core/codes';
import ref from './reference.json';

describe('ida e volta sRGB ↔ OKLab', () => {
  it('reconverte cada canal sem perda além do arredondamento', () => {
    const samples = ['#000000', '#FFFFFF', '#C4003F', '#E96A00', '#F2CC00', '#3E8F45', '#22409B', '#6E2B8C', '#808080', '#123456', '#FEDCBA'];
    for (const h of samples) {
      const [r, g, b] = hex2rgb(h), o = rgb2oklab(r, g, b), v = oklab2raw(o.L, o.a, o.b);
      expect(rgb2hex(unlin(v[0]) * 255, unlin(v[1]) * 255, unlin(v[2]) * 255)).toBe(h);
    }
  });
  it('hex2lch → oklch2hex devolve o mesmo hex quando a cor está no gamut', () => {
    for (const h of ['#C4003F', '#3E8F45', '#22409B', '#F2CC00', '#7F7F7F']) {
      const l = hex2lch(h); expect(oklch2hex(l.L, l.C, l.H)).toBe(h);
    }
  });
});

describe('ajuste de gamut', () => {
  it('reduz o croma por busca binária em vez de cortar canais: o matiz se mantém', () => {
    const H = 30, h = oklch2hex(.6, .5, H), l = hex2lch(h);
    expect(Math.abs(wrapDeg(l.H - H))).toBeLessThan(1.5);
    expect(l.C).toBeLessThan(.5);
  });
  it('luminosidade é limitada a [0,1]', () => {
    expect(oklch2hex(1.4, .1, 100)).toBe(oklch2hex(1, .1, 100));
    expect(oklch2hex(-.2, .1, 100)).toBe(oklch2hex(0, .1, 100));
    expect(oklch2hex(1, 0, 0)).toBe('#FFFFFF'); expect(oklch2hex(0, 0, 0)).toBe('#000000');
  });
  it('bate com os valores colhidos do arquivo original', () => {
    for (const [v, hex] of ref.core.oklch as [number[], string][]) expect(oklch2hex(v[0], v[1], v[2])).toBe(hex);
  });
});

describe('contraste WCAG 2.1', () => {
  it('preto sobre branco é 21:1', () => { expect(ratio('#000000', '#FFFFFF')).toBeCloseTo(21, 5) });
  it('é simétrico', () => { expect(ratio('#C4003F', '#F2CC00')).toBeCloseTo(ratio('#F2CC00', '#C4003F'), 12) });
  it('bate com o original', () => { expect(ratio('#C4003F', '#FFFFFF')).toBeCloseTo(ref.core.ratio, 12) });
  it('readable escolhe o polo de maior contraste', () => {
    expect(readable('#000000')).toBe('#FFFFFF'); expect(readable('#FFFFFF')).toBe('#000000'); expect(readable('#F2CC00')).toBe('#000000');
  });
  it('luminância relativa dos polos', () => { expect(lum('#000000')).toBe(0); expect(lum('#FFFFFF')).toBeCloseTo(1, 10) });
});

describe('conversões de exibição', () => {
  it('hsl, hsv, cmyk e lab batem com o original', () => {
    expect(rgb2hsl(196, 0, 63)).toEqual(ref.core.hsl);
    expect(rgb2hsv(196, 0, 63)).toEqual(ref.core.hsv);
    expect(rgb2cmyk(196, 0, 63)).toEqual(ref.core.cmyk);
    expect(rgb2lab(196, 0, 63)).toEqual(ref.core.lab);
    expect(hslHex(210, 70, 55)).toBe(ref.core.hslHex);
  });
  it('preto puro em cmyk é 0 0 0 100', () => { expect(rgb2cmyk(0, 0, 0)).toEqual([0, 0, 0, 100]) });
  it('hex curto expande', () => { expect(hex2rgb('#abc')).toEqual([170, 187, 204]) });
  it('todos os códigos de uma cor batem com o original', () => {
    expect(allCodes('#C4003F')).toEqual(ref.core.codes);
    expect(allCodes('#3E8F45')).toEqual(ref.core.codes2);
  });
});

describe('mistura em OKLab', () => {
  it('bate com o original', () => { for (const [v, hex] of ref.core.mix as [[string, string, number], string][]) expect(mixLch(v[0], v[1], v[2])).toBe(hex) });
  it('t=0 e t=1 devolvem os extremos', () => { expect(mixLch('#C4003F', '#22409B', 0)).toBe('#C4003F'); expect(mixLch('#C4003F', '#22409B', 1)).toBe('#22409B') });
});

describe('simulação de visão de cor', () => {
  it('bate com o original', () => { for (const [k, hex] of ref.core.sim as [string, string][]) expect(simulate('#E96A00', k)).toBe(hex) });
  it('none devolve a própria cor e acromatopsia devolve cinza', () => {
    expect(simulate('#E96A00', 'none')).toBe('#E96A00');
    const [r, g, b] = hex2rgb(simulate('#E96A00', 'acromatopsia')); expect(r).toBe(g); expect(g).toBe(b);
  });
});
