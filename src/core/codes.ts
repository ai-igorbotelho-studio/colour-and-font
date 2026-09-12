/* ═══════════ CÓDIGOS DE UMA COR ═══════════ */
import { hex2rgb, rgb2hsl, rgb2hsv, rgb2cmyk, rgb2lab, rgb2oklab, hex2lch, lum, ratio } from './color';
import { t } from '../i18n';

export const r1 = (n: number) => Math.round(n), r2 = (n: number) => Math.round(n * 10) / 10, r3 = (n: number) => Math.round(n * 1000) / 1000;

export type CodeRow = [string, string | number];

export function allCodes(hex: string): CodeRow[] {
  const [r, g, b] = hex2rgb(hex), hsl = rgb2hsl(r, g, b), hsv = rgb2hsv(r, g, b), cmyk = rgb2cmyk(r, g, b),
        lab = rgb2lab(r, g, b), o = rgb2oklab(r, g, b), lch = hex2lch(hex);
  const lchab = [lab[0], Math.hypot(lab[1], lab[2]), (Math.atan2(lab[2], lab[1]) * 180 / Math.PI + 360) % 360];
  const dec = (r << 16) + (g << 8) + b;
  return [
    ['HEX', hex],
    [t('HEX curto'), hex.length === 7 && hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6] ? '#' + hex[1] + hex[3] + hex[5] : '—'],
    ['RGB', `${r}, ${g}, ${b}`],
    ['RGB css', `rgb(${r} ${g} ${b})`],
    ['RGB 0–1', `${r3(r / 255)}, ${r3(g / 255)}, ${r3(b / 255)}`],
    ['HSL', `hsl(${r1(hsl[0])} ${r1(hsl[1])}% ${r1(hsl[2])}%)`],
    ['HSB / HSV', `${r1(hsv[0])}°, ${r1(hsv[1])}%, ${r1(hsv[2])}%`],
    ['CMYK', `${r1(cmyk[0])}, ${r1(cmyk[1])}, ${r1(cmyk[2])}, ${r1(cmyk[3])}`],
    ['LAB', `${r2(lab[0])}, ${r2(lab[1])}, ${r2(lab[2])}`],
    ['LCH', `${r2(lchab[0])}, ${r2(lchab[1])}, ${r1(lchab[2])}°`],
    ['OKLab', `${r3(o.L)}, ${r3(o.a)}, ${r3(o.b)}`],
    ['OKLCH css', `oklch(${r1(lch.L * 100)}% ${r3(lch.C)} ${r1(lch.H)})`],
    ['Decimal', String(dec)],
    [t('Luminância'), r3(lum(hex))],
    ['Android', `#FF${hex.slice(1)}`],
    ['SwiftUI', `Color(red: ${r3(r / 255)}, green: ${r3(g / 255)}, blue: ${r3(b / 255)})`],
    ['Flutter', `Color(0xFF${hex.slice(1)})`],
    [t('Contraste com branco'), ratio(hex, '#FFFFFF').toFixed(2) + ' : 1'],
    [t('Contraste com preto'), ratio(hex, '#000000').toFixed(2) + ' : 1']
  ];
}
