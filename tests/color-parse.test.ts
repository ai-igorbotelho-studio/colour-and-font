import { describe, it, expect } from 'vitest';
import { parseColorCode, cmyk2rgb } from '../src/core/color';

describe('cmyk2rgb', () => {
  it('preto puro (0,0,0,100) vira preto', () => { expect(cmyk2rgb(0, 0, 0, 100)).toEqual([0, 0, 0]) });
  it('sem tinta (0,0,0,0) vira branco', () => { expect(cmyk2rgb(0, 0, 0, 0)).toEqual([255, 255, 255]) });
});

describe('parseColorCode', () => {
  it('hex de 6 dígitos, com e sem #', () => {
    expect(parseColorCode('#C4003F')).toBe('#C4003F');
    expect(parseColorCode('c4003f')).toBe('#C4003F');
  });
  it('hex de 3 dígitos, com e sem #', () => {
    expect(parseColorCode('#abc')).toBe('#AABBCC');
    expect(parseColorCode('abc')).toBe('#AABBCC');
  });
  it('hex tolera espaço ao redor', () => { expect(parseColorCode('  #C4003F  ')).toBe('#C4003F') });
  it('rgb() e rgb bare, com vírgula ou espaço', () => {
    expect(parseColorCode('rgb(196, 0, 63)')).toBe('#C4003F');
    expect(parseColorCode('196,0,63')).toBe('#C4003F');
    expect(parseColorCode('196 0 63')).toBe('#C4003F');
  });
  it('cmyk() e cmyk bare, com vírgula ou espaço', () => {
    expect(parseColorCode('cmyk(0,100,68,23)')).toBe(parseColorCode('rgb(196,0,63)'));
    expect(parseColorCode('0,100,68,23')).toBe(parseColorCode('cmyk(0,100,68,23)'));
    expect(parseColorCode('0 100 68 23')).toBe(parseColorCode('cmyk(0,100,68,23)'));
  });
  it('rejeita canal RGB fora de alcance', () => { expect(parseColorCode('rgb(300,0,0)')).toBeNull() });
  it('rejeita componente CMYK fora de alcance', () => { expect(parseColorCode('cmyk(0,0,0,150)')).toBeNull() });
  it('rejeita texto sem forma reconhecível', () => { expect(parseColorCode('não é uma cor')).toBeNull() });
  it('rejeita número de componentes errado', () => { expect(parseColorCode('196,0')).toBeNull() });
  it('string vazia devolve null', () => { expect(parseColorCode('   ')).toBeNull() });
});
