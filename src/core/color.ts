/* ═══════════ NÚCLEO DE COR ═══════════
   sRGB ↔ OKLab, OKLCH → hex com ajuste de gamut por busca binária
   (nunca cortar canais), contraste WCAG 2.1 e simulação de visão de cor. */

export type RGB = [number, number, number];
export interface OKLab { L: number; a: number; b: number }
export interface OKLCH { L: number; C: number; H: number }

export const lin = (c: number): number => { c /= 255; return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4) };
export const unlin = (v: number): number => { const x = v <= .0031308 ? v * 12.92 : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - .055; return Math.max(0, Math.min(1, x)) };

export const hex2rgb = (h: string): RGB => {
  h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
export const rgb2hex = (r: number, g: number, b: number): string =>
  '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();

export function rgb2oklab(r: number, g: number, b: number): OKLab {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(.4122214708 * R + .5363325363 * G + .0514459929 * B),
        m = Math.cbrt(.2119034982 * R + .6806995451 * G + .1073969566 * B),
        s = Math.cbrt(.0883024619 * R + .2817188376 * G + .6299787005 * B);
  return { L: .2104542553 * l + .7936177850 * m - .0040720468 * s, a: 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s, b: .0259040371 * l + .7827717662 * m - .8086757660 * s };
}
export function oklab2raw(L: number, A: number, B: number): RGB {
  const l = (L + .3963377774 * A + .2158037573 * B) ** 3, m = (L - .1055613458 * A - .0638541728 * B) ** 3, s = (L - .0894841775 * A - 1.2914855480 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.7076147010 * s];
}
const inG = (v: RGB) => v.every(c => c >= -.001 && c <= 1.001);

/** OKLCH → hex. O croma é reduzido por busca binária até caber no sRGB. */
export function oklch2hex(L: number, C: number, H: number): string {
  L = Math.max(0, Math.min(1, L)); const rad = H * Math.PI / 180; let lo = 0, hi = Math.max(C, 0);
  if (inG(oklab2raw(L, C * Math.cos(rad), C * Math.sin(rad)))) lo = C;
  else for (let i = 0; i < 20; i++) { const md = (lo + hi) / 2; if (inG(oklab2raw(L, md * Math.cos(rad), md * Math.sin(rad)))) lo = md; else hi = md }
  const v = oklab2raw(L, lo * Math.cos(rad), lo * Math.sin(rad));
  return rgb2hex(unlin(v[0]) * 255, unlin(v[1]) * 255, unlin(v[2]) * 255);
}
export function hex2lch(h: string): OKLCH {
  const [r, g, b] = hex2rgb(h), o = rgb2oklab(r, g, b);
  return { L: o.L, C: Math.hypot(o.a, o.b), H: (Math.atan2(o.b, o.a) * 180 / Math.PI + 360) % 360 };
}
export const lum = (h: string): number => { const [r, g, b] = hex2rgb(h); return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b) };
/** Razão de contraste WCAG 2.1 — sempre sobre as cores reais, nunca sobre as simuladas. */
export const ratio = (a: string, b: string): number => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05) };
export const readable = (bg: string): string => ratio(bg, '#FFFFFF') >= ratio(bg, '#000000') ? '#FFFFFF' : '#000000';
export const wrapDeg = (d: number): number => { d = ((d % 360) + 360) % 360; return d > 180 ? d - 360 : d };
export const mixLch = (A: string, B: string, t: number): string => {
  const a = hex2lch(A), b = hex2lch(B);
  return oklch2hex(a.L + (b.L - a.L) * t, a.C + (b.C - a.C) * t, a.H + wrapDeg(b.H - a.H) * t);
};

/* ── conversões para exibição ── */
export function rgb2hsl(r: number, g: number, b: number): RGB {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0; if (d) { h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h *= 60 }
  const l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0; return [h, s * 100, l * 100];
}
export function rgb2hsv(r: number, g: number, b: number): RGB {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0; if (d) { h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h *= 60 }
  return [h, mx ? d / mx * 100 : 0, mx * 100];
}
export function rgb2cmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255; const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k) * 100, (1 - g - k) / (1 - k) * 100, (1 - b - k) / (1 - k) * 100, k * 100];
}
export function rgb2xyz(r: number, g: number, b: number): RGB {
  const R = lin(r), G = lin(g), B = lin(b);
  return [R * .4124564 + G * .3575761 + B * .1804375, R * .2126729 + G * .7151522 + B * .0721750, R * .0193339 + G * .1191920 + B * .9503041];
}
export function rgb2lab(r: number, g: number, b: number): RGB {
  const [x, y, z] = rgb2xyz(r, g, b), wr = .95047, wg = 1, wb = 1.08883;
  const f = (t: number) => t > .008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
  const fx = f(x / wr), fy = f(y / wg), fz = f(z / wb);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
export function hslHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100; const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0; const k = Math.floor(h / 60) % 6;
  [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]].forEach((v, i) => { if (i === k) { r = v[0]; g = v[1]; b = v[2] } });
  return rgb2hex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/* ── simulação de visão de cor (Viénot, Brettel & Mollon) ── */
export type CvdKind = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'acromatopsia';
const CVD: Record<string, number[][] | null> = {
  none: null,
  protanopia: [[.1706, .8294, 0], [.1706, .8294, 0], [-.0046, .0046, 1]],
  deuteranopia: [[.3299, .6701, 0], [.3299, .6701, 0], [-.0284, .0284, 1]],
  tritanopia: [[1, .1273, -.1273], [0, .8739, .1261], [0, .8739, .1261]]
};
export function simulate(hex: string, kind: string): string {
  if (!kind || kind === 'none') return hex;
  if (kind === 'acromatopsia') { const [r, g, b] = hex2rgb(hex); const y = unlin(.2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b)) * 255; return rgb2hex(y, y, y) }
  const M = CVD[kind]; if (!M) return hex;
  const [r, g, b] = hex2rgb(hex), v = [lin(r), lin(g), lin(b)];
  const o = M.map(row => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
  return rgb2hex(unlin(o[0]) * 255, unlin(o[1]) * 255, unlin(o[2]) * 255);
}
