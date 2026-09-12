/* ── desenhos vetoriais dos mockups (600 × 450) ──
   Funções puras: recebem o contexto (cores, famílias, texto, cenário) e devolvem SVG.
   As formas são simples de propósito: a peça é a paleta e a tipografia, não o objeto. */
import { esc } from '../core/dom';
import { readable, ratio, hex2lch, mixLch } from '../core/color';
import type { SceneKey } from './data';

export interface MockCtx { hs: string[]; bg: string; ink: string; ac: string; ac2: string; title: string; sub: string; fD: string; fB: string; fM: string; scene: SceneKey }
export const W = 600, H = 450;

/** Papéis a partir da paleta: fundo mais claro, tinta mais escura, acentos mais cromáticos. */
export function roles(hs: string[]): { bg: string; ink: string; ac: string; ac2: string } {
  const L = hs.map(h => hex2lch(h)), bi = L.reduce((b, x, i) => x.L > L[b].L ? i : b, 0), di = L.reduce((b, x, i) => x.L < L[b].L ? i : b, 0);
  const rest = hs.map((h, i) => i).filter(i => i !== bi && i !== di).sort((a, b) => L[b].C - L[a].C);
  const ac = rest.length ? hs[rest[0]] : hs[di], ac2 = rest.length > 1 ? hs[rest[1]] : (rest.length ? hs[di] : hs[bi]);
  return { bg: hs[bi], ink: hs[di], ac, ac2 };
}
const e = esc;
export const rr = (x: number, y: number, w: number, h: number, r: number, fill: string, extra = ''): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
/** Texto que cabe: estima a largura e, se passar do limite, comprime com textLength.
    O limite padrão é a distância até a borda do quadro, conforme a âncora. */
export const tx = (x: number, y: number, s: string, size: number, fill: string, font: string, extra = '', maxW?: number): string => {
  const anchor = /text-anchor="middle"/.test(extra) ? 'm' : /text-anchor="end"/.test(extra) ? 'e' : 's';
  const lim = maxW ?? (anchor === 'm' ? Math.min(x, W - x) * 2 - 24 : anchor === 'e' ? x - 16 : W - x - 16);
  const est = s.length * size * .56, fit = est > lim ? ` textLength="${Math.round(lim)}" lengthAdjust="spacingAndGlyphs"` : '';
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="${e(font)}" ${extra}${fit}>${e(s)}</text>`;
};
/** linhas de texto fingido */
export const lines = (x: number, y: number, w: number, n: number, fill: string, gap = 9, h = 3): string => Array.from({ length: n }, (_, i) => rr(x, y + i * gap, i === n - 1 ? w * .55 : w, h, 1.5, fill, 'opacity=".45"')).join('');
/** a marca: círculo com as cores da paleta e a inicial do título */
export function mark(c: MockCtx, x: number, y: number, r: number, on?: string): string {
  const n = Math.min(c.hs.length, 6), segs = c.hs.slice(0, n).map((h, i) => { const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return `<path d="M${x},${y} L${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A${r},${r} 0 0 1 ${x + r * Math.cos(a1)},${y + r * Math.sin(a1)} Z" fill="${h}"/>` }).join('');
  const inner = on || c.bg;
  return `${segs}<circle cx="${x}" cy="${y}" r="${r * .55}" fill="${inner}"/>` + tx(x, y + r * .22, c.title.slice(0, 1).toUpperCase(), r * .62, readable(inner), c.fD, 'text-anchor="middle" font-weight="400"');
}
/** o lockup: marca + título + subtítulo, tamanho s */
export function lockup(c: MockCtx, x: number, y: number, s: number, ink: string, sub = true): string {
  return mark(c, x + s * .5, y, s * .5) + tx(x + s * .75, y + s * .18, c.title, s * .5, ink, c.fD, '', s * 4) + (sub ? tx(x + s * .75, y + s * .5, c.sub, s * .2, ink, c.fB, 'opacity=".7"') : '');
}
/** fundo do cenário e sombra */
export function ground(c: MockCtx): { g: string; floor: string; sh: string; on: string } {
  const g = c.scene === 'claro' ? '#E9E7E2' : c.scene === 'escuro' ? '#17171A' : c.bg;
  const floor = c.scene === 'escuro' ? '#0F0F11' : mixLch(g, '#000000', .06);
  return { g, floor, sh: c.scene === 'escuro' ? 'rgba(0,0,0,.6)' : 'rgba(0,0,20,.18)', on: readable(g) };
}
export const shadow = (x: number, y: number, w: number, h: number, sh: string): string => `<ellipse cx="${x + w / 2}" cy="${y + h}" rx="${w * .55}" ry="${h * .06 + 6}" fill="${sh}" filter="url(#blur)"/>`;
const stripe = (c: MockCtx, x: number, y: number, w: number, h: number, vertical = false): string => {
  const n = c.hs.length; return c.hs.map((hh, i) => vertical ? rr(x, y + h * i / n, w, h / n + .5, 0, hh) : rr(x + w * i / n, y, w / n + .5, h, 0, hh)).join('');
};
/** tela de interface genérica dentro de um retângulo */
function screen(c: MockCtx, x: number, y: number, w: number, h: number, r: number, compact = false): string {
  const p = w * .06, s = Math.max(6, w * .045), inkOnBg = ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg);
  return rr(x, y, w, h, r, c.bg)
   + mark(c, x + p + s * .55, y + p + s * .55, s * .55) + tx(x + p + s * 1.4, y + p + s * .75, c.title, s * .9, inkOnBg, c.fD, '', w * .5)
   + (compact ? '' : [0, 1, 2].map(i => rr(x + w - p - (3 - i) * s * 1.8, y + p + s * .2, s * 1.4, s * .7, s * .35, i === 2 ? c.ac : 'transparent', i === 2 ? '' : `stroke="${inkOnBg}" stroke-opacity=".3" stroke-width="1"`)).join(''))
   + tx(x + p, y + p + s * 3.2, c.sub, s * 1.6, inkOnBg, c.fD, '', (compact ? w : w * .5) - p * 2)
   + lines(x + p, y + p + s * 4.2, w * .5, 3, inkOnBg, s * .6, s * .18)
   + rr(x + p, y + p + s * 6.4, s * 4.6, s * 1.3, s * .65, c.ac) + tx(x + p + s * 2.3, y + p + s * 7.28, c.title.split(' ')[0], s * .62, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"')
   + (compact ? '' : rr(x + w * .56, y + p + s * 3, w * .38, h - p * 2 - s * 3, r * .5, c.ac2) + mark(c, x + w * .75, y + (h + p + s * 3) / 2, Math.min(w * .1, (h - p * 2 - s * 3) * .3), c.ac2));
}

type Draw = (c: MockCtx) => string;
export const DRAW: Record<string, Draw> = {
  /* ─ digital ─ */
  phone: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(200, 40, 200, 380, G.sh)
    + rr(200, 30, 200, 390, 34, '#111') + screen(c, 210, 40, 180, 370, 26, true) + rr(270, 48, 60, 8, 4, '#111'); },
  tablet: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(130, 40, 340, 380, G.sh)
    + rr(130, 30, 340, 390, 26, '#111') + screen(c, 144, 44, 312, 362, 12); },
  laptop: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(60, 60, 480, 330, G.sh)
    + rr(80, 50, 440, 300, 16, '#1B1B1E') + screen(c, 94, 64, 412, 268, 6) + rr(40, 350, 520, 20, 6, '#C9CACF') + rr(250, 350, 100, 8, 4, '#A9AAB0'); },
  desktop: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(80, 30, 440, 380, G.sh)
    + rr(80, 30, 440, 300, 10, '#1B1B1E') + screen(c, 88, 38, 424, 268, 4) + rr(88, 306, 424, 24, 0, '#D3D4D8')
    + rr(270, 330, 60, 70, 4, '#B8B9BE') + rr(190, 398, 220, 12, 6, '#C9CACF'); },
  appicon: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(190, 40, 220, 220, G.sh)
    + rr(190, 40, 220, 220, 52, c.ac) + mark(c, 300, 150, 74, c.ac) + tx(300, 305, c.title, 22, G.on, c.fB, 'text-anchor="middle" font-weight="600"')
    + [0, 1, 2, 3].map(i => rr(120 + i * 100, 340, 60, 60, 16, c.hs[i % c.hs.length])).join(''); },
  social: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(115, 30, 370, 400, G.sh)
    + rr(115, 20, 370, 410, 10, '#FFFFFF') + mark(c, 145, 50, 14) + tx(168, 55, c.title, 14, '#111', c.fB, 'font-weight="700"')
    + rr(115, 74, 370, 300, 0, c.bg) + stripe(c, 115, 74, 370, 14) + tx(140, 190, c.sub, 30, ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg), c.fD, '', 320)
    + rr(140, 300, 120, 34, 17, c.ac) + tx(200, 322, c.title.split(' ')[0], 14, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"')
    + lines(140, 392, 300, 2, '#111', 12, 4); },
  /* ─ produtos ─ */
  box: c => { const G = ground(c); const f = c.bg, s = mixLch(c.bg, '#000000', .18), top = mixLch(c.bg, '#FFFFFF', .2);
    return rr(0, 0, W, H, 0, G.g) + shadow(120, 100, 360, 300, G.sh)
    + `<polygon points="150,140 300,90 450,140 300,190" fill="${top}"/><polygon points="150,140 300,190 300,400 150,350" fill="${f}"/><polygon points="300,190 450,140 450,350 300,400" fill="${s}"/>`
    + `<polygon points="150,300 300,350 300,400 150,350" fill="${c.ac}"/><polygon points="300,350 450,300 450,350 300,400" fill="${mixLch(c.ac, '#000000', .18)}"/>`
    + `<g transform="translate(180,230) skewY(18.4)">${mark(c, 24, 8, 20)}${tx(52, 14, c.title, 20, c.ink, c.fD, '', 110)}${tx(52, 34, c.sub, 9, c.ink, c.fB, 'opacity=".7"')}</g>`; },
  bottle: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(220, 60, 160, 370, G.sh)
    + rr(262, 40, 76, 60, 8, c.ink) + rr(226, 100, 148, 330, 30, mixLch(c.ac2, '#FFFFFF', .15)) + rr(236, 190, 128, 150, 4, c.bg)
    + mark(c, 300, 230, 22) + tx(300, 285, c.title, 20, c.ink, c.fD, 'text-anchor="middle"', 116) + tx(300, 305, c.sub, 9, c.ink, c.fM, 'text-anchor="middle" opacity=".7"')
    + rr(236, 322, 128, 18, 0, c.ac) + rr(236, 100, 20, 330, 10, '#FFFFFF', 'opacity=".25"'); },
  jar: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(160, 90, 280, 330, G.sh)
    + rr(170, 80, 260, 70, 22, c.ink) + rr(160, 150, 280, 270, 40, c.bg) + rr(160, 150, 280, 24, 0, c.ac)
    + mark(c, 300, 230, 26) + tx(300, 300, c.title, 26, c.ink, c.fD, 'text-anchor="middle"', 250) + tx(300, 324, c.sub, 10, c.ink, c.fM, 'text-anchor="middle" opacity=".7"')
    + lines(240, 360, 120, 2, c.ink, 10, 3); },
  tube: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(230, 60, 140, 370, G.sh)
    + rr(250, 40, 100, 40, 8, c.ac) + `<path d="M240,80 L360,80 L370,400 Q300,440 230,400 Z" fill="${c.bg}"/>`
    + `<path d="M240,80 L360,80 L362,130 L238,130 Z" fill="${c.ac2}"/>`
    + mark(c, 300, 190, 24) + tx(300, 250, c.title, 22, c.ink, c.fD, 'text-anchor="middle"', 104) + tx(300, 272, c.sub, 9, c.ink, c.fM, 'text-anchor="middle" opacity=".7"')
    + lines(262, 320, 76, 3, c.ink, 9, 2.5) + rr(232, 395, 136, 14, 3, c.ink); },
  pouch: c => { const G = ground(c); const kraft = c.scene === 'cor' ? c.bg : '#C9B79C'; return rr(0, 0, W, H, 0, G.g) + shadow(190, 90, 220, 340, G.sh)
    + `<path d="M200,90 L400,90 L410,430 L190,430 Z" fill="${kraft}"/><path d="M200,90 L400,90 L400,120 L200,120 Z" fill="${mixLch(kraft, '#000000', .18)}"/>`
    + `<circle cx="300" cy="230" r="70" fill="${c.ac}"/><circle cx="340" cy="270" r="34" fill="${c.ac2}"/>`
    + tx(300, 345, c.title, 24, readable(kraft), c.fD, 'text-anchor="middle"', 180) + tx(300, 368, c.sub, 10, readable(kraft), c.fM, 'text-anchor="middle" opacity=".7" letter-spacing="2"'); },
  cup: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(200, 70, 200, 360, G.sh)
    + rr(196, 60, 208, 26, 6, c.ink) + `<path d="M204,86 L396,86 L370,430 L230,430 Z" fill="${c.bg}"/>`
    + `<path d="M210,170 L390,170 L378,330 L222,330 Z" fill="${c.ac}"/>` + mark(c, 300, 230, 26, c.ac) + tx(300, 292, c.title, 20, readable(c.ac), c.fD, 'text-anchor="middle"', 150)
    + tx(300, 400, c.sub, 9, c.ink, c.fM, 'text-anchor="middle" opacity=".7"'); },
  /* ─ papel ─ */
  letterhead: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(160, 30, 280, 400, G.sh)
    + rr(160, 20, 280, 410, 2, '#FFFFFF') + rr(160, 20, 280, 8, 0, c.ac) + mark(c, 190, 60, 14) + tx(212, 65, c.title, 14, c.ink, c.fD, '', 90)
    + lines(310, 50, 100, 3, c.ink, 8, 2) + tx(184, 120, c.sub, 12, c.ink, c.fD, '', 232) + lines(184, 140, 232, 12, '#222', 11, 3)
    + tx(184, 400, c.title, 8, c.ink, c.fM, 'opacity=".6"') + rr(160, 424, 280, 6, 0, c.ac2); },
  card: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(60, 100, 260, 160, G.sh) + shadow(280, 190, 260, 160, G.sh)
    + rr(60, 90, 260, 160, 6, c.ink) + mark(c, 190, 170, 34, c.ink)
    + rr(280, 180, 260, 160, 6, c.bg) + rr(280, 180, 8, 160, 0, c.ac) + tx(306, 220, c.title, 20, c.ink, c.fD, '', 216) + tx(306, 240, c.sub, 9, c.ink, c.fB, 'opacity=".7"')
    + lines(306, 290, 120, 3, c.ink, 9, 2.5) + tx(306, 330, 'auge.pages.dev', 8, c.ink, c.fM, 'opacity=".6"'); },
  envelope: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(90, 110, 420, 240, G.sh)
    + rr(90, 100, 420, 250, 6, c.bg) + `<polygon points="90,100 300,240 510,100" fill="${c.ac}"/><polygon points="90,100 300,240 510,100 510,116 300,256 90,116" fill="${mixLch(c.ac, '#000000', .18)}"/>`
    + mark(c, 300, 170, 26, c.ac) + tx(120, 320, c.title, 14, c.ink, c.fD, '', 230) + tx(120, 336, c.sub, 8, c.ink, c.fM, 'opacity=".7"') + lines(380, 300, 100, 3, c.ink, 9, 2.5); },
  notebook: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(170, 40, 260, 380, G.sh)
    + rr(170, 30, 260, 390, 10, c.ac2) + `<path d="M170,260 Q300,200 430,300 L430,420 L170,420 Z" fill="${c.ac}"/>`
    + Array.from({ length: 14 }, (_, i) => rr(160, 48 + i * 27, 22, 8, 4, '#2A2A2E')).join('')
    + mark(c, 300, 130, 30, c.ac2) + tx(300, 195, c.title, 24, readable(c.ac2), c.fD, 'text-anchor="middle"', 220); },
  poster: c => { const G = ground(c); const on = ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg); return rr(0, 0, W, H, 0, G.g) + shadow(160, 20, 280, 420, G.sh)
    + rr(160, 10, 280, 430, 0, c.bg) + stripe(c, 160, 10, 280, 160)
    + tx(184, 250, c.title, 42, on, c.fD, '', 232) + tx(184, 290, c.sub, 16, on, c.fD, 'opacity=".8"', 232) + lines(184, 330, 180, 4, on, 11, 3)
    + mark(c, 400, 400, 20) + tx(184, 412, '2026', 10, on, c.fM, 'opacity=".6"'); },
  book: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(180, 40, 240, 380, G.sh)
    + rr(172, 30, 22, 390, 3, mixLch(c.ink, '#000000', .3)) + rr(190, 30, 230, 390, 3, c.ink)
    + rr(190, 130, 230, 150, 0, c.ac) + tx(214, 190, c.title, 34, readable(c.ac), c.fD, '', 190) + tx(214, 220, c.sub, 12, readable(c.ac), c.fB, 'opacity=".85"', 190)
    + mark(c, 380, 370, 22, c.ink) + tx(214, 380, 'Auge', 10, readable(c.ink), c.fM, 'opacity=".6"'); },
  /* ─ rua ─ */
  billboard: c => { const G = ground(c); const on = ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg); return rr(0, 0, W, H, 0, G.g) + rr(0, 380, W, 70, 0, G.floor)
    + rr(280, 260, 40, 130, 0, '#3A3A3E') + rr(40, 40, 520, 230, 4, '#2A2A2E') + rr(50, 50, 500, 210, 0, c.bg)
    + rr(50, 50, 200, 210, 0, c.ac) + mark(c, 150, 130, 44, c.ac) + tx(150, 220, c.title, 22, readable(c.ac), c.fD, 'text-anchor="middle"', 180)
    + tx(276, 130, c.sub, 30, on, c.fD, '', 260) + lines(276, 160, 220, 3, on, 12, 4) + rr(276, 210, 120, 30, 15, c.ink) + tx(336, 230, c.title.split(' ')[0], 12, readable(c.ink), c.fB, 'text-anchor="middle" font-weight="600"'); },
  bladesign: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(0, 0, 120, H, 0, G.floor) + rr(120, 130, 60, 14, 0, '#3A3A3E')
    + shadow(180, 80, 240, 240, G.sh) + rr(180, 70, 240, 240, 28, c.ink) + mark(c, 300, 170, 60, c.ink) + tx(300, 275, c.title, 22, readable(c.ink), c.fD, 'text-anchor="middle"', 210); },
  busstop: c => { const G = ground(c); const on = ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg); return rr(0, 0, W, H, 0, G.g) + rr(0, 400, W, 50, 0, G.floor)
    + rr(150, 20, 300, 20, 0, '#2A2A2E') + rr(160, 40, 14, 360, 0, '#3A3A3E') + rr(426, 40, 14, 360, 0, '#3A3A3E')
    + rr(180, 50, 240, 340, 0, c.bg) + stripe(c, 180, 50, 240, 30) + tx(204, 160, c.sub, 26, on, c.fD, '', 200) + lines(204, 190, 190, 4, on, 12, 4)
    + rr(204, 270, 130, 36, 18, c.ac) + tx(269, 293, c.title, 13, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"', 114) + mark(c, 380, 360, 22); },
  flag: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(0, 420, W, 30, 0, G.floor) + rr(120, 20, 10, 420, 3, '#3A3A3E')
    + `<path d="M130,30 L480,60 Q500,180 470,300 L130,330 Z" fill="${c.ac}"/><path d="M130,30 L480,60 L478,110 L130,90 Z" fill="${c.ac2}"/>`
    + `<g transform="translate(200,170) rotate(4)">${mark(c, 30, 20, 30, c.ac)}${tx(72, 30, c.title, 30, readable(c.ac), c.fD, '', 190)}${tx(72, 54, c.sub, 12, readable(c.ac), c.fB, 'opacity=".85"', 190)}</g>`; },
  mural: c => { const G = ground(c); return rr(0, 0, W, H, 0, '#2E2E33') + rr(0, 400, W, 50, 0, G.floor)
    + stripe(c, 0, 0, W, 400, true) + `<g transform="translate(120,110)">${mark(c, 90, 90, 90, c.hs[0])}</g>`
    + tx(330, 210, c.title, 46, '#FFFFFF', c.fD, 'stroke="#000" stroke-width="6" paint-order="stroke" stroke-linejoin="round"', 250) + tx(330, 250, c.sub, 18, '#FFFFFF', c.fB, 'stroke="#000" stroke-width="4" paint-order="stroke"', 250); },
  storefront: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(0, 400, W, 50, 0, G.floor)
    + rr(60, 40, 480, 70, 0, c.ink) + tx(300, 88, c.title, 34, readable(c.ink), c.fD, 'text-anchor="middle"', 440)
    + rr(60, 110, 480, 290, 0, '#3A3A3E') + rr(70, 120, 200, 270, 0, mixLch(c.bg, '#FFFFFF', .1)) + rr(280, 120, 250, 270, 0, mixLch(c.bg, '#FFFFFF', .1))
    + rr(300, 160, 210, 120, 0, c.ac) + tx(405, 230, c.sub, 20, readable(c.ac), c.fD, 'text-anchor="middle"', 190) + mark(c, 170, 250, 50)
    + rr(70, 120, 200, 270, 0, '#FFFFFF', 'opacity=".12"') + rr(280, 120, 250, 270, 0, '#FFFFFF', 'opacity=".12"'); },
  /* ─ vestuário ─ */
  tshirt: c => { const G = ground(c); const sh = c.scene === 'escuro' ? c.ink : c.bg; return rr(0, 0, W, H, 0, G.g) + shadow(140, 60, 320, 380, G.sh)
    + `<path d="M210,60 L260,45 Q300,80 340,45 L390,60 L460,110 L420,160 L390,140 L390,430 L210,430 L210,140 L180,160 L140,110 Z" fill="${sh}"/>`
    + `<path d="M260,45 Q300,80 340,45 Q300,100 260,45 Z" fill="${mixLch(sh, '#000000', .2)}"/>`
    + mark(c, 300, 230, 56, sh) + tx(300, 320, c.title, 22, readable(sh), c.fD, 'text-anchor="middle"', 160); },
  tote: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(170, 120, 260, 310, G.sh)
    + `<path d="M230,120 Q230,40 300,40 Q370,40 370,120" fill="none" stroke="${c.ink}" stroke-width="14"/>`
    + rr(170, 110, 260, 320, 6, c.bg) + rr(170, 110, 260, 16, 0, c.ac2)
    + mark(c, 300, 240, 60) + tx(300, 340, c.title, 26, c.ink, c.fD, 'text-anchor="middle"', 230) + tx(300, 364, c.sub, 10, c.ink, c.fM, 'text-anchor="middle" opacity=".7"'); },
  cap: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(120, 170, 380, 200, G.sh)
    + `<path d="M150,270 Q150,110 300,110 Q450,110 450,270 Z" fill="${c.ac}"/><path d="M300,110 L300,270" stroke="${mixLch(c.ac, '#000000', .2)}" stroke-width="3"/>`
    + `<path d="M130,270 L470,270 Q520,290 480,320 Q300,300 120,320 Q80,290 130,270 Z" fill="${c.ink}"/>`
    + mark(c, 300, 205, 34, c.ac) + tx(300, 262, c.title, 14, readable(c.ac), c.fD, 'text-anchor="middle"', 200); },
  hoodie: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(130, 70, 340, 370, G.sh)
    + `<path d="M230,90 Q300,20 370,90 L440,120 L470,200 L420,220 L410,430 L190,430 L180,220 L130,200 L160,120 Z" fill="${c.ink}"/>`
    + `<path d="M250,100 Q300,60 350,100 Q300,150 250,100 Z" fill="${mixLch(c.ink, '#000000', .3)}"/>` + rr(230, 330, 140, 60, 8, mixLch(c.ink, '#FFFFFF', .08))
    + tx(300, 240, c.title, 30, readable(c.ink), c.fD, 'text-anchor="middle"', 200) + tx(300, 266, c.sub, 12, readable(c.ink), c.fM, 'text-anchor="middle" opacity=".8" letter-spacing="2"'); },
  badge: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(290, 0, 20, 90, 0, c.ac) + shadow(190, 100, 220, 320, G.sh)
    + rr(190, 90, 220, 330, 14, c.bg) + rr(190, 90, 220, 110, 0, c.ink) + mark(c, 300, 145, 34, c.ink)
    + `<circle cx="300" cy="100" r="8" fill="${G.g}"/>` + tx(300, 250, c.title, 26, c.ink, c.fD, 'text-anchor="middle"', 190) + tx(300, 276, c.sub, 11, c.ink, c.fB, 'text-anchor="middle" opacity=".7"')
    + lines(240, 320, 120, 3, c.ink, 10, 3) + rr(240, 370, 120, 28, 14, c.ac) + tx(300, 388, '2026', 11, readable(c.ac), c.fM, 'text-anchor="middle"'); },
  keytag: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(150, 150, 320, 150, G.sh)
    + `<circle cx="130" cy="220" r="34" fill="none" stroke="#9A9AA0" stroke-width="10"/>` + `<g transform="rotate(-12 320 225)">${rr(160, 160, 320, 130, 40, c.ac)}<circle cx="200" cy="225" r="12" fill="${G.g}"/>`
    + tx(240, 218, c.title, 26, readable(c.ac), c.fD, '', 220) + tx(240, 246, c.sub, 11, readable(c.ac), c.fM, 'opacity=".8"') + '</g>'; },
  /* ─ telas em ambiente ─ */
  airport: c => { const G = ground(c); const on = ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg); return rr(0, 0, W, H, 0, '#2B2B30') + rr(0, 330, W, 120, 0, '#1C1C20')
    + Array.from({ length: 6 }, (_, i) => rr(0, 340 + i * 18, W, 2, 0, '#3A3A40')).join('')
    + rr(30, 40, 540, 200, 6, '#0B0B0E') + rr(40, 50, 520, 180, 0, c.bg) + rr(40, 50, 520, 12, 0, c.ac)
    + tx(70, 130, c.sub, 36, on, c.fD, '', 300) + lines(70, 160, 260, 2, on, 14, 4) + lockup(c, 380, 190, 40, on, false); },
  desk: c => { const G = ground(c); return rr(0, 0, W, H, 0, '#2B2B30') + rr(0, 300, W, 150, 0, '#3E3A34')
    + Array.from({ length: 8 }, (_, i) => rr(0, 300 + i * 18, W, 8, 0, i % 2 ? '#463F37' : '#3E3A34')).join('')
    + rr(150, 60, 300, 170, 6, '#0B0B0E') + screen(c, 158, 68, 284, 154, 2) + rr(290, 230, 20, 70, 0, '#1C1C20') + rr(80, 296, 440, 10, 0, c.ac); },
  wall: c => { const G = ground(c); return rr(0, 0, W, H, 0, '#26262B') + rr(0, 380, W, 70, 0, '#1C1C20')
    + [0, 1, 2].map(i => { const x = 40 + i * 180, on = i === 1 ? c.ac : c.bg; return rr(x, 60, 160, 290, 4, '#0B0B0E') + rr(x + 6, 66, 148, 278, 0, on)
      + mark(c, x + 80, 170, 40, on) + tx(x + 80, 250, i === 1 ? c.title : c.sub, i === 1 ? 20 : 14, readable(on), c.fD, 'text-anchor="middle"', 136) + (i === 1 ? '' : lines(x + 30, 280, 100, 3, readable(on), 10, 3)) }).join('')
    + rr(0, 350, W, 30, 0, mixLch(c.ac2, '#000000', .4)); },
  kiosk: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(0, 400, W, 50, 0, G.floor) + shadow(200, 20, 200, 400, G.sh)
    + rr(200, 20, 200, 400, 14, '#1B1B1E') + screen(c, 212, 40, 176, 300, 6, true) + rr(212, 350, 176, 50, 6, c.ac) + tx(300, 381, c.title, 16, readable(c.ac), c.fD, 'text-anchor="middle"', 160); },
  tv: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + rr(0, 360, W, 90, 0, G.floor) + rr(60, 300, 480, 60, 4, mixLch(G.floor, '#FFFFFF', .12))
    + rr(70, 40, 460, 260, 8, '#0B0B0E') + rr(78, 48, 444, 244, 2, c.ink) + stripe(c, 78, 48, 444, 244, true) + rr(78, 48, 444, 244, 2, '#000', 'opacity=".35"')
    + tx(300, 170, c.title, 44, '#FFFFFF', c.fD, 'text-anchor="middle"', 400) + tx(300, 205, c.sub, 16, '#FFFFFF', c.fB, 'text-anchor="middle" opacity=".85"', 400); },
  watch: c => { const G = ground(c); return rr(0, 0, W, H, 0, G.g) + shadow(210, 60, 180, 340, G.sh)
    + rr(250, 20, 100, 60, 20, c.ink) + rr(250, 370, 100, 60, 20, c.ink) + rr(210, 70, 180, 310, 50, '#111') + rr(222, 82, 156, 286, 40, c.bg)
    + tx(300, 150, '10:08', 34, ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg), c.fM, 'text-anchor="middle"') + mark(c, 300, 225, 40)
    + rr(246, 290, 108, 34, 17, c.ac) + tx(300, 312, c.title.split(' ')[0], 13, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"'); }
};
export function mockSvg(k: string, c: MockCtx): string {
  const body = (DRAW[k] || DRAW.poster)(c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${e(c.title)}"><defs><filter id="blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>${body}</svg>`;
}
