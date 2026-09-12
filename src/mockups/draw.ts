/* ── desenhos vetoriais dos mockups (600 × 450) ──
   Funções puras: recebem o contexto (cores, famílias, texto, cenário) e devolvem SVG.
   Vocabulário de materiais: gradientes, sombras suaves, reflexos de vidro, faces
   isométricas e um chão de estúdio com luz. Sem imagem externa, sem rede. */
import { esc } from '../core/dom';
import { readable, ratio, hex2lch, mixLch } from '../core/color';
import type { SceneKey } from './data';

export interface MockCtx { hs: string[]; bg: string; ink: string; ac: string; ac2: string; title: string; sub: string; fD: string; fB: string; fM: string; scene: SceneKey }
export const W = 600, H = 450;
let seq = 0; let P = 'm';

/** Papéis a partir da paleta: fundo mais claro, tinta mais escura, acentos mais cromáticos. */
export function roles(hs: string[]): { bg: string; ink: string; ac: string; ac2: string } {
  const L = hs.map(h => hex2lch(h)), bi = L.reduce((b, x, i) => x.L > L[b].L ? i : b, 0), di = L.reduce((b, x, i) => x.L < L[b].L ? i : b, 0);
  const rest = hs.map((_, i) => i).filter(i => i !== bi && i !== di).sort((a, b) => L[b].C - L[a].C);
  const ac = rest.length ? hs[rest[0]] : hs[di], ac2 = rest.length > 1 ? hs[rest[1]] : (rest.length ? hs[di] : hs[bi]);
  return { bg: hs[bi], ink: hs[di], ac, ac2 };
}
const e = esc;
const dk = (h: string, a: number): string => mixLch(h, '#000000', a), lt = (h: string, a: number): string => mixLch(h, '#FFFFFF', a);
const onBg = (c: MockCtx): string => ratio(c.ink, c.bg) >= 4.5 ? c.ink : readable(c.bg);
export const rr = (x: number, y: number, w: number, h: number, r: number, fill: string, extra = ''): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
/** Texto que cabe sem deformar: reduz o corpo até 78% e, se ainda não couber,
    corta com reticências. Nunca usa textLength, que espreme os glifos. */
export const tx = (x: number, y: number, s: string, size: number, fill: string, font: string, extra = '', maxW?: number): string => {
  const anchor = /text-anchor="middle"/.test(extra) ? 'm' : /text-anchor="end"/.test(extra) ? 'e' : 's';
  const lim = maxW ?? (anchor === 'm' ? Math.min(x, W - x) * 2 - 24 : anchor === 'e' ? x - 16 : W - x - 16);
  const cw = /serif|Serif|Display|Playfair|Bodoni|Garamond|Lora/.test(font) ? .5 : .55;
  let sz = size, txt = s;
  if (txt.length * sz * cw > lim) sz = Math.max(size * .65, lim / (txt.length * cw));
  if (txt.length * sz * cw > lim) { const n = Math.max(3, Math.floor(lim / (sz * cw)) - 1); txt = txt.slice(0, n).replace(/\s+\S*$/, '') + '…' }
  return `<text x="${x}" y="${y}" font-size="${sz.toFixed(1)}" fill="${fill}" font-family="${e(font)}" ${extra}>${e(txt)}</text>`;
};
/** Texto em até n linhas (tspans), quebrando nas palavras; reduz o corpo se preciso. */
export const txw = (x: number, y: number, s: string, size: number, fill: string, font: string, extra = '', maxW: number, maxLines = 2, lh = 1.08): string => {
  const cw = /serif|Serif|Display|Playfair|Bodoni|Garamond|Lora/.test(font) ? .5 : .55;
  const fit = (sz: number): string[] => { const out: string[] = []; let cur = '';
    for (const w of s.split(/\s+/)) { const t = cur ? cur + ' ' + w : w; if (t.length * sz * cw <= maxW || !cur) cur = t; else { out.push(cur); cur = w } }
    if (cur) out.push(cur); return out };
  let sz = size, ls = fit(sz);
  while ((ls.length > maxLines || ls.some(l => l.length * sz * cw > maxW)) && sz > size * .6) { sz -= size * .05; ls = fit(sz) }
  if (ls.length > maxLines) { ls = ls.slice(0, maxLines); ls[maxLines - 1] = ls[maxLines - 1].replace(/\s+\S*$/, '') + '…' }
  ls = ls.map(l => l.length * sz * cw > maxW ? l.slice(0, Math.max(3, Math.floor(maxW / (sz * cw)) - 1)) + '…' : l);
  return `<text x="${x}" y="${y}" font-size="${sz.toFixed(1)}" fill="${fill}" font-family="${e(font)}" ${extra}>${ls.map((l, i) => `<tspan x="${x}" dy="${i ? sz * lh : 0}">${e(l)}</tspan>`).join('')}</text>`;
};
export const lines = (x: number, y: number, w: number, n: number, fill: string, gap = 9, h = 3): string => Array.from({ length: n }, (_, i) => rr(x, y + i * gap, i === n - 1 ? w * .55 : w, h, 1.5, fill, 'opacity=".38"')).join('');

/* ── materiais ── */
const lin = (id: string, stops: [number, string, number?][], x1 = 0, y1 = 0, x2 = 0, y2 = 1): string => `<linearGradient id="${P}${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
const rad = (id: string, stops: [number, string, number?][], cx = .5, cy = .5, r = .7): string => `<radialGradient id="${P}${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;
const u = (id: string): string => `url(#${P}${id})`;
/** gradiente vertical de material: claro em cima, escuro embaixo */
const mat = (id: string, h: string, k = .16): string => lin(id, [[0, lt(h, k)], [.5, h], [1, dk(h, k)]]);
/** gradiente horizontal de cilindro: sombra nas bordas, brilho a 30% */
const cyl = (id: string, h: string, k = .3): string => lin(id, [[0, dk(h, k)], [.28, lt(h, .12)], [.5, h], [.8, dk(h, k * .6)], [1, dk(h, k)]], 0, 0, 1, 0);
const gloss = (x: number, y: number, w: number, h: number, r: number, a = .22): string => rr(x, y, w, h, r, u('gl'), `opacity="${a}"`);
/** cenário: fundo com luz, chão e vinheta */
export function ground(c: MockCtx): { g: string; floor: string; sh: string; on: string; defs: string; scene: string } {
  const g = c.scene === 'claro' ? '#ECEAE4' : c.scene === 'escuro' ? '#1B1B1F' : c.bg;
  const floor = c.scene === 'escuro' ? '#111114' : dk(g, .08), on = readable(g);
  const defs = rad('sky', [[0, lt(g, .1)], [1, dk(g, .1)]], .5, .3, .9) + lin('floor', [[0, dk(g, .04)], [1, dk(g, .16)]]) + rad('vig', [[.55, '#000', 0], [1, '#000', c.scene === 'escuro' ? .5 : .16]], .5, .5, .75)
    + lin('gl', [[0, '#FFFFFF', .9], [.45, '#FFFFFF', .12], [.5, '#FFFFFF', 0]], 0, 0, 1, 1)
    + `<filter id="${P}sh" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity="${c.scene === 'escuro' ? .6 : .22}"/></filter>`
    + `<filter id="${P}sh2" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="${c.scene === 'escuro' ? .5 : .18}"/></filter>`
    + `<filter id="${P}blur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="10"/></filter>`
    + `<filter id="${P}glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>`;
  const scene = rr(0, 0, W, H, 0, u('sky')) + rr(0, 0, W, H, 0, u('vig'));
  return { g, floor, sh: c.scene === 'escuro' ? 'rgba(0,0,0,.65)' : 'rgba(0,0,20,.22)', on, defs, scene };
}
const floorAt = (y: number): string => rr(0, y, W, H - y, 0, u('floor'));
const contact = (x: number, y: number, w: number, sh: string, ry = 10): string => `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w * .52}" ry="${ry}" fill="${sh}" filter="${u('blur')}"/>`;
const SH = (): string => `filter="${u('sh')}"`, SH2 = (): string => `filter="${u('sh2')}"`;
/** a marca: círculo com as cores da paleta e a inicial */
export function mark(c: MockCtx, x: number, y: number, r: number, on?: string): string {
  const n = Math.min(c.hs.length, 6), segs = c.hs.slice(0, n).map((h, i) => { const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return `<path d="M${x},${y} L${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} A${r},${r} 0 0 1 ${x + r * Math.cos(a1)},${y + r * Math.sin(a1)} Z" fill="${h}"/>` }).join('');
  const inner = on || c.bg;
  return segs + `<circle cx="${x}" cy="${y}" r="${r * .55}" fill="${inner}"/>` + tx(x, y + r * .22, c.title.slice(0, 1).toUpperCase(), r * .62, readable(inner), c.fD, 'text-anchor="middle"');
}
export function lockup(c: MockCtx, x: number, y: number, s: number, ink: string, sub = true): string {
  return mark(c, x + s * .5, y, s * .5) + tx(x + s * .75, y + s * .18, c.title, s * .5, ink, c.fD, '', s * 4) + (sub ? tx(x + s * .75, y + s * .5, c.sub, s * .2, ink, c.fB, 'opacity=".7"', s * 4) : '');
}
const stripe = (c: MockCtx, x: number, y: number, w: number, h: number, vertical = false): string => { const n = c.hs.length;
  return c.hs.map((hh, i) => vertical ? rr(x, y + h * i / n, w, h / n + .5, 0, hh) : rr(x + w * i / n, y, w / n + .5, h, 0, hh)).join('') };
/** tela de interface: barra, título, texto, botão, painel */
function screen(c: MockCtx, x: number, y: number, w: number, h: number, r: number, compact = false): string {
  const p = w * .06, s = Math.max(6, w * .045), on = onBg(c);
  return rr(x, y, w, h, r, c.bg)
   + rr(x, y, w, s * 2.2, r, dk(c.bg, .04)) + mark(c, x + p + s * .55, y + s * 1.1, s * .5) + tx(x + p + s * 1.35, y + s * 1.35, c.title, s * .8, on, c.fD, '', w * .5)
   + (compact ? '' : [0, 1, 2].map(i => rr(x + w - p - (3 - i) * s * 1.8, y + s * .75, s * 1.4, s * .7, s * .35, i === 2 ? c.ac : 'transparent', i === 2 ? '' : `stroke="${on}" stroke-opacity=".3" stroke-width="1"`)).join(''))
   + txw(x + p, y + s * 4.6, c.sub, s * 1.45, on, c.fD, '', (compact ? w : w * .52) - p * 2, 2)
   + lines(x + p, y + s * 7.2, w * .46, 3, on, s * .6, s * .18)
   + rr(x + p, y + s * 9.4, s * 4.6, s * 1.3, s * .65, c.ac) + tx(x + p + s * 2.3, y + s * 10.28, c.title.split(' ')[0], s * .62, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"', s * 4)
   + (compact ? rr(x + p, y + s * 11.6, w - p * 2, h - s * 11.6 - p, r * .5, u('ac')) + mark(c, x + w / 2, y + (s * 11.6 + h - p) / 2, Math.min(w * .14, (h - s * 11.6 - p) * .3), c.ac)
      : rr(x + w * .56, y + s * 3.4, w * .38, h - p - s * 3.4, r * .5, u('ac')) + mark(c, x + w * .75, y + (h + s * 3.4 - p) / 2 , Math.min(w * .1, (h - p - s * 3.4) * .3), c.ac));
}
/** reflexo de vidro diagonal sobre uma tela */
const glass = (x: number, y: number, w: number, h: number, r: number): string => `<clipPath id="${P}c${Math.round(x)}${Math.round(y)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath><polygon points="${x},${y} ${x + w * .55},${y} ${x},${y + h * .8}" fill="#FFFFFF" opacity=".07" clip-path="url(#${P}c${Math.round(x)}${Math.round(y)})"/>`;
/** faces isométricas: topo, esquerda, direita */
const iso = (x: number, y: number, w: number, d: number, h: number, col: string, k = .18): string =>
  `<polygon points="${x},${y} ${x + w},${y - d * .5} ${x + w + w * .0},${y - d * .5 + h * 0} ${x + w},${y - d * .5}" fill="none"/>` +
  `<polygon points="${x},${y} ${x + w},${y - w * .5} ${x + w + d},${y - w * .5 + d * .5} ${x + d},${y + d * .5}" fill="${lt(col, .22)}"/>` +
  `<polygon points="${x},${y} ${x + d},${y + d * .5} ${x + d},${y + d * .5 + h} ${x},${y + h}" fill="${col}"/>` +
  `<polygon points="${x + d},${y + d * .5} ${x + w + d},${y - w * .5 + d * .5} ${x + w + d},${y - w * .5 + d * .5 + h} ${x + d},${y + d * .5 + h}" fill="${dk(col, k)}"/>`;
const label = (c: MockCtx, x: number, y: number, w: number, h: number, bg: string, size = 1): string => rr(x, y, w, h, 3, bg)
  + mark(c, x + w / 2, y + h * .3, Math.min(w, h) * .2 * size) + txw(x + w / 2, y + h * .58, c.title, Math.min(w, h) * .15 * size, ratio(c.ink, bg) >= 4.5 ? c.ink : readable(bg), c.fD, 'text-anchor="middle"', w * .86, 2)
  + tx(x + w / 2, y + h * .84, c.sub, Math.min(w, h) * .075 * size, ratio(c.ink, bg) >= 4.5 ? c.ink : readable(bg), c.fM, 'text-anchor="middle" opacity=".7"', w * .86);

type Draw = (c: MockCtx, G: ReturnType<typeof ground>) => string;
export const DRAW: Record<string, Draw> = {
  /* ─ digital ─ */
  phone: (c, G) => G.scene + floorAt(390) + contact(210, 418, 180, G.sh, 12)
    + `<g ${SH()}>` + rr(200, 28, 200, 392, 36, u('frame')) + rr(205, 33, 190, 382, 32, '#0B0B0E') + `</g>` + screen(c, 212, 40, 176, 368, 26, true) + rr(268, 46, 64, 9, 4.5, '#0B0B0E') + glass(212, 40, 176, 368, 26)
    + rr(400, 120, 3, 40, 1.5, '#2A2A2E') + rr(197, 100, 3, 24, 1.5, '#2A2A2E') + rr(197, 132, 3, 40, 1.5, '#2A2A2E'),
  tablet: (c, G) => G.scene + floorAt(400) + contact(130, 424, 340, G.sh, 14)
    + `<g transform="rotate(-2 300 225)" ${SH()}>` + rr(126, 26, 348, 398, 28, u('frame')) + rr(131, 31, 338, 388, 24, '#0B0B0E') + screen(c, 146, 46, 308, 358, 10) + glass(146, 46, 308, 358, 10) + `</g>`,
  laptop: (c, G) => G.scene + floorAt(362) + contact(60, 390, 480, G.sh, 14)
    + `<g ${SH()}>` + rr(78, 44, 444, 310, 18, u('frame')) + rr(86, 52, 428, 294, 12, '#0B0B0E') + `</g>` + screen(c, 96, 62, 408, 268, 6) + glass(96, 62, 408, 268, 6)
    + rr(30, 352, 540, 18, 6, u('alu')) + rr(255, 352, 90, 6, 3, '#9A9BA2') + rr(30, 368, 540, 4, 2, dk('#C9CACF', .3)),
  desktop: (c, G) => G.scene + floorAt(392) + contact(150, 412, 300, G.sh, 12)
    + `<g ${SH()}>` + rr(76, 28, 448, 314, 12, u('frame')) + rr(82, 34, 436, 288, 6, '#0B0B0E') + `</g>` + screen(c, 88, 40, 424, 276, 4) + glass(88, 40, 424, 276, 4)
    + rr(82, 322, 436, 20, 0, u('alu')) + `<path d="M270,342 L330,342 L340,402 L260,402 Z" fill="${u('alu')}"/>` + rr(200, 400, 200, 10, 5, '#B8B9BE'),
  appicon: (c, G) => G.scene + floorAt(400) + contact(190, 270, 220, G.sh, 14)
    + `<g ${SH()}>` + rr(190, 40, 220, 220, 54, u('ac')) + `</g>` + gloss(190, 40, 220, 110, 54, .18) + mark(c, 300, 150, 74, c.ac)
    + tx(300, 305, c.title, 20, G.on, c.fB, 'text-anchor="middle" font-weight="600"', 300)
    + [0, 1, 2, 3].map(i => `<g ${SH2()}>` + rr(126 + i * 96, 340, 60, 60, 16, c.hs[i % c.hs.length]) + `</g>` + gloss(126 + i * 96, 340, 60, 30, 16, .16)).join(''),
  social: (c, G) => G.scene + floorAt(420)
    + `<g ${SH()}>` + rr(115, 20, 370, 410, 14, '#FFFFFF') + `</g>` + mark(c, 145, 50, 14) + tx(168, 55, c.title, 14, '#111', c.fB, 'font-weight="700"', 200)
    + rr(115, 74, 370, 300, 0, c.bg) + rr(115, 74, 370, 300, 0, u('acsoft')) + stripe(c, 115, 74, 370, 12) + txw(140, 180, c.sub, 28, onBg(c), c.fD, '', 320, 3)
    + rr(140, 300, 120, 34, 17, c.ac) + tx(200, 322, c.title.split(' ')[0], 14, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"', 100)
    + [0, 1, 2].map(i => `<circle cx="${140 + i * 30}" cy="398" r="8" fill="none" stroke="#333" stroke-width="1.6"/>`).join('') + lines(240, 392, 200, 2, '#111', 12, 4),
  /* ─ produtos ─ */
  box: (c, G) => G.scene + floorAt(360) + contact(150, 402, 300, G.sh, 18)
    + `<g ${SH()}><polygon points="160,250 350,155 440,200 250,295 250,445 160,400" fill="${c.bg}"/></g>`
    + `<polygon points="160,250 350,155 440,200 250,295" fill="${lt(c.bg, .3)}"/><polygon points="160,250 250,295 250,445 160,400" fill="${dk(c.bg, .06)}"/><polygon points="250,295 440,200 440,350 250,445" fill="${dk(c.bg, .16)}"/>`
    + `<polygon points="160,350 250,395 250,445 160,400" fill="${dk(c.ac, .1)}"/><polygon points="250,395 440,300 440,350 250,445" fill="${dk(c.ac, .22)}"/>`
    + `<polygon points="160,250 350,155 440,200 250,295" fill="${u('gl')}" opacity=".18"/>`
    + `<g transform="matrix(1,-0.5,0,1,262,340)">${mark(c, 22, 8, 20)}${txw(52, 10, c.title, 17, c.ink, c.fD, '', 120, 2)}${tx(52, 30, c.sub, 8, c.ink, c.fB, 'opacity=".7"', 120)}${lines(0, 54, 130, 3, c.ink, 9, 2.5)}</g>`
    + `<g transform="matrix(1,0.5,0,1,172,270)">${tx(0, 0, c.title.split(' ')[0], 11, c.ink, c.fM, 'opacity=".55" letter-spacing="1"', 70)}</g>`,
  bottle: (c, G) => G.scene + floorAt(390) + contact(226, 428, 148, G.sh, 10)
    + `<g ${SH()}>` + rr(262, 36, 76, 64, 10, u('cap')) + rr(226, 96, 148, 334, 34, u('body')) + `</g>` + rr(262, 36, 76, 8, 4, dk(c.ink, .2))
    + label(c, 238, 186, 124, 158, c.bg) + rr(238, 326, 124, 18, 0, c.ac)
    + rr(236, 100, 16, 326, 8, '#FFFFFF', 'opacity=".28"') + rr(354, 110, 6, 300, 3, '#000000', 'opacity=".12"'),
  jar: (c, G) => G.scene + floorAt(380) + contact(160, 420, 280, G.sh, 14)
    + `<g ${SH()}>` + rr(170, 74, 260, 76, 24, u('cap')) + rr(160, 150, 280, 272, 44, u('body')) + `</g>` + rr(180, 82, 240, 6, 3, lt(c.ink, .25), 'opacity=".5"')
    + rr(160, 150, 280, 24, 0, c.ac) + label(c, 186, 200, 228, 190, c.bg, 1.1)
    + rr(172, 160, 22, 250, 11, '#FFFFFF', 'opacity=".26"') + rr(406, 170, 8, 230, 4, '#000000', 'opacity=".12"'),
  tube: (c, G) => G.scene + floorAt(400) + contact(232, 424, 136, G.sh, 10)
    + `<g ${SH()}>` + rr(250, 34, 100, 42, 10, u('cap2')) + `<path d="M240,76 L360,76 L372,396 Q300,438 228,396 Z" fill="${u('body')}"/>` + `</g>`
    + `<path d="M240,76 L360,76 L361,128 L239,128 Z" fill="${c.ac2}"/>` + label(c, 250, 150, 100, 170, c.bg, .95)
    + `<path d="M228,396 Q300,438 372,396 L372,404 Q300,446 228,404 Z" fill="${c.ink}"/>` + rr(246, 82, 12, 300, 6, '#FFFFFF', 'opacity=".26"'),
  pouch: (c, G) => { const kraft = c.scene === 'cor' ? c.bg : '#C8B49A'; return G.scene + floorAt(400) + contact(196, 428, 208, G.sh, 12)
    + `<g ${SH()}>` + `<path d="M200,92 L400,92 L412,430 L188,430 Z" fill="${u('kraft')}"/>` + `</g>`
    + `<path d="M200,92 L400,92 L400,122 L200,122 Z" fill="${dk(kraft, .2)}"/><path d="M200,122 L400,122 L400,128 L200,128 Z" fill="${dk(kraft, .35)}" opacity=".5"/>`
    + `<path d="M204,140 L396,140" stroke="${dk(kraft, .12)}" stroke-width="1" stroke-dasharray="3 5"/>`
    + `<circle cx="300" cy="236" r="72" fill="${c.ac}"/><circle cx="342" cy="278" r="36" fill="${c.ac2}"/><circle cx="300" cy="236" r="72" fill="${u('gl')}" opacity=".16"/>`
    + txw(300, 340, c.title, 22, readable(kraft), c.fD, 'text-anchor="middle"', 180, 2) + tx(300, 376, c.sub, 9, readable(kraft), c.fM, 'text-anchor="middle" opacity=".7" letter-spacing="2"', 180)
    + rr(200, 92, 14, 338, 0, '#000000', 'opacity=".08"') + rr(386, 92, 14, 338, 0, '#FFFFFF', 'opacity=".10"') },
  cup: (c, G) => G.scene + floorAt(400) + contact(214, 432, 172, G.sh, 10)
    + `<g ${SH()}>` + rr(194, 52, 212, 30, 8, u('cap')) + `<path d="M204,82 L396,82 L372,432 L228,432 Z" fill="${u('body')}"/>` + `</g>` + rr(206, 44, 188, 12, 6, dk(c.ink, .15))
    + `<path d="M210,166 L390,166 L378,334 L222,334 Z" fill="${u('acv')}"/>` + mark(c, 300, 222, 26, c.ac) + txw(300, 276, c.title, 19, readable(c.ac), c.fD, 'text-anchor="middle"', 150, 2)
    + tx(300, 404, c.sub, 9, c.ink, c.fM, 'text-anchor="middle" opacity=".7"', 130) + rr(214, 90, 14, 330, 7, '#FFFFFF', 'opacity=".26"'),
  /* ─ papel ─ */
  letterhead: (c, G) => G.scene + floorAt(440)
    + `<g transform="rotate(-1.5 300 225)" ${SH2()}>` + rr(168, 26, 280, 410, 2, '#F6F5F1') + `</g>`
    + `<g ${SH()}>` + rr(160, 20, 280, 410, 2, '#FFFFFF') + `</g>` + rr(160, 20, 280, 8, 0, c.ac) + mark(c, 190, 60, 14) + tx(212, 65, c.title, 14, c.ink, c.fD, '', 90)
    + lines(310, 50, 100, 3, c.ink, 8, 2) + tx(184, 120, c.sub, 12, c.ink, c.fD, '', 232) + lines(184, 140, 232, 12, '#222', 11, 3)
    + tx(184, 400, c.title, 8, c.ink, c.fM, 'opacity=".6"', 200) + rr(160, 424, 280, 6, 0, c.ac2),
  card: (c, G) => G.scene + floorAt(440)
    + `<g transform="rotate(-8 190 170)" ${SH()}>` + rr(60, 90, 260, 160, 8, u('ink')) + gloss(60, 90, 260, 80, 8, .08) + mark(c, 190, 170, 34, c.ink) + `</g>`
    + `<g transform="rotate(4 410 260)" ${SH()}>` + rr(280, 180, 260, 160, 8, c.bg) + rr(280, 180, 8, 160, 0, c.ac) + tx(306, 220, c.title, 20, c.ink, c.fD, '', 216) + tx(306, 240, c.sub, 9, c.ink, c.fB, 'opacity=".7"', 216)
    + lines(306, 290, 120, 3, c.ink, 9, 2.5) + tx(306, 330, 'auge.pages.dev', 8, c.ink, c.fM, 'opacity=".6"') + `</g>`,
  envelope: (c, G) => G.scene + floorAt(440)
    + `<g ${SH()}>` + rr(90, 100, 420, 250, 8, u('paper')) + `</g>` + `<polygon points="90,100 300,240 510,100" fill="${u('acv')}"/><polygon points="90,100 300,240 510,100 510,116 300,256 90,116" fill="${dk(c.ac, .2)}"/>`
    + `<polygon points="90,100 300,240 510,100" fill="${u('gl')}" opacity=".12"/>` + mark(c, 300, 168, 26, c.ac)
    + tx(120, 320, c.title, 14, c.ink, c.fD, '', 230) + tx(120, 336, c.sub, 8, c.ink, c.fM, 'opacity=".7"', 230) + lines(380, 300, 100, 3, c.ink, 9, 2.5),
  notebook: (c, G) => G.scene + floorAt(430) + contact(170, 428, 260, G.sh, 10)
    + `<g ${SH()}>` + rr(170, 30, 260, 390, 12, u('ac2v')) + `</g>` + `<path d="M170,260 Q300,200 430,300 L430,408 Q430,420 418,420 L182,420 Q170,420 170,408 Z" fill="${c.ac}"/>`
    + rr(382, 30, 14, 390, 0, dk(c.ac2, .35)) + gloss(170, 30, 260, 120, 12, .1)
    + Array.from({ length: 14 }, (_, i) => `<path d="M160,${52 + i * 27} q0,-8 8,-8 l14,0 q8,0 8,8" fill="none" stroke="#9A9AA0" stroke-width="3"/>`).join('')
    + mark(c, 300, 130, 30, c.ac2) + txw(300, 185, c.title, 24, readable(c.ac2), c.fD, 'text-anchor="middle"', 220, 2),
  poster: (c, G) => { const on = onBg(c); return rr(0, 0, W, H, 0, c.scene === 'escuro' ? '#26262B' : '#DCD9D1') + rr(0, 0, W, H, 0, u('vig'))
    + `<g ${SH()}>` + rr(150, 10, 300, 430, 0, c.bg) + `</g>` + stripe(c, 150, 10, 300, 160) + rr(150, 10, 300, 160, 0, u('gl'), 'opacity=".12"')
    + txw(176, 230, c.title, 40, on, c.fD, '', 250, 2) + txw(176, 320, c.sub, 15, on, c.fD, 'opacity=".8"', 250, 2) + lines(176, 330, 180, 4, on, 11, 3)
    + mark(c, 410, 400, 20) + tx(176, 412, '2026', 10, on, c.fM, 'opacity=".6"')
    + rr(140, 0, 8, 16, 0, '#EFEFEF', 'opacity=".7"') + rr(452, 0, 8, 16, 0, '#EFEFEF', 'opacity=".7"') },
  book: (c, G) => G.scene + floorAt(420) + contact(180, 424, 240, G.sh, 10)
    + `<g ${SH()}>` + rr(174, 30, 22, 390, 3, u('spine')) + rr(192, 30, 230, 390, 3, u('ink')) + `</g>` + rr(192, 30, 230, 390, 3, u('gl'), 'opacity=".06"')
    + rr(192, 130, 230, 150, 0, c.ac) + txw(216, 175, c.title, 32, readable(c.ac), c.fD, '', 190, 2) + tx(216, 220, c.sub, 12, readable(c.ac), c.fB, 'opacity=".85"', 190)
    + mark(c, 380, 370, 22, c.ink) + tx(216, 380, 'Auge', 10, readable(c.ink), c.fM, 'opacity=".6"') + rr(196, 34, 3, 382, 1.5, '#FFFFFF', 'opacity=".18"'),
  /* ─ rua ─ */
  billboard: (c, G) => { const on = onBg(c); return rr(0, 0, W, H, 0, u('dusk')) + rr(0, 350, W, 100, 0, u('floor'))
    + [0, 1, 2, 3, 4].map(i => rr(20 + i * 130, 250 + (i % 2) * 30, 80, 120, 2, dk(G.g, .45), 'opacity=".55"')).join('')
    + rr(286, 250, 28, 120, 0, u('post')) + `<g ${SH()}>` + rr(40, 34, 520, 232, 6, '#2A2A2E') + rr(50, 44, 500, 212, 2, c.bg) + `</g>`
    + rr(50, 44, 200, 212, 0, u('acv')) + mark(c, 150, 128, 44, c.ac) + tx(150, 222, c.title, 22, readable(c.ac), c.fD, 'text-anchor="middle"', 180)
    + txw(276, 110, c.sub, 28, on, c.fD, '', 260, 2) + lines(276, 160, 220, 3, on, 12, 4) + rr(276, 210, 120, 30, 15, c.ink) + tx(336, 230, c.title.split(' ')[0], 12, readable(c.ink), c.fB, 'text-anchor="middle" font-weight="600"', 100)
    + rr(50, 44, 500, 212, 0, u('gl'), 'opacity=".08"') + rr(40, 24, 520, 10, 3, '#3A3A3E') + [80, 300, 520].map(x => `<ellipse cx="${x}" cy="60" rx="60" ry="30" fill="#FFF3D0" opacity=".14" filter="${u('glow')}"/>`).join('') },
  bladesign: (c, G) => rr(0, 0, W, H, 0, u('sky')) + rr(0, 0, 130, H, 0, u('wall')) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => rr(0, i * 60, 130, 2, 0, '#000', 'opacity=".12"')).join('')
    + rr(120, 126, 70, 16, 2, u('post')) + rr(120, 118, 24, 8, 2, '#3A3A3E')
    + `<ellipse cx="300" cy="190" rx="130" ry="130" fill="${c.ac}" opacity=".16" filter="${u('glow')}"/>`
    + `<g ${SH()}>` + rr(180, 68, 240, 244, 30, u('ink')) + `</g>` + gloss(180, 68, 240, 120, 30, .1) + mark(c, 300, 170, 60, c.ink) + txw(300, 268, c.title, 22, readable(c.ink), c.fD, 'text-anchor="middle"', 210, 2)
    + rr(0, 0, W, H, 0, u('vig')),
  busstop: (c, G) => { const on = onBg(c); return rr(0, 0, W, H, 0, u('sky')) + rr(0, 400, W, 50, 0, u('floor'))
    + rr(150, 18, 300, 22, 2, u('post')) + rr(160, 40, 14, 360, 0, u('post')) + rr(426, 40, 14, 360, 0, u('post'))
    + `<g ${SH2()}>` + rr(180, 50, 240, 340, 0, c.bg) + `</g>` + stripe(c, 180, 50, 240, 30) + txw(204, 140, c.sub, 24, on, c.fD, '', 200, 3) + lines(204, 190, 190, 4, on, 12, 4)
    + rr(204, 270, 130, 36, 18, c.ac) + tx(269, 293, c.title, 13, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"', 114) + mark(c, 380, 360, 22)
    + `<polygon points="180,50 420,50 420,120 180,390" fill="#FFFFFF" opacity=".10"/>` + rr(180, 50, 240, 340, 0, 'none', `stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2"`) + rr(0, 0, W, H, 0, u('vig')) },
  flag: (c, G) => G.scene + floorAt(420) + rr(118, 18, 12, 422, 4, u('post')) + `<circle cx="124" cy="16" r="8" fill="#B8B9BE"/>`
    + `<g ${SH()}>` + `<path d="M130,30 Q300,10 480,60 Q500,180 470,300 Q300,270 130,330 Z" fill="${u('acv')}"/>` + `</g>`
    + `<path d="M130,30 Q300,10 480,60 L478,110 Q300,60 130,90 Z" fill="${c.ac2}"/>` + `<path d="M250,40 Q300,180 260,320" stroke="#000" stroke-opacity=".08" stroke-width="30" fill="none" filter="${u('blur')}"/>`
    + `<g transform="translate(200,170) rotate(4)">${mark(c, 30, 20, 30, c.ac)}${txw(72, 22, c.title, 28, readable(c.ac), c.fD, '', 190, 2)}${tx(72, 54, c.sub, 12, readable(c.ac), c.fB, 'opacity=".85"', 190)}</g>`,
  mural: (c) => rr(0, 0, W, H, 0, '#8A6A55') + Array.from({ length: 16 }, (_, r) => Array.from({ length: 7 }, (_, i) => rr((i * 90) + (r % 2 ? 45 : 0) - 45, r * 26, 86, 22, 2, dk('#8A6A55', (i + r) % 3 * .06), 'opacity=".9"')).join('')).join('')
    + rr(0, 0, W, 400, 0, '#000', 'opacity=".28"') + stripe(c, 0, 0, W, 400, true) + `<rect width="${W}" height="400" fill="#888" filter="${u('noise')}" opacity=".18"/>`
    + `<g transform="translate(120,110)">${mark(c, 90, 90, 90, c.hs[0])}</g>`
    + txw(330, 190, c.title, 42, '#FFFFFF', c.fD, 'stroke="#000" stroke-width="6" paint-order="stroke" stroke-linejoin="round"', 250, 2) + tx(330, 290, c.sub, 16, '#FFFFFF', c.fB, 'stroke="#000" stroke-width="4" paint-order="stroke"', 250)
    + rr(0, 400, W, 50, 0, u('floor')) + rr(0, 0, W, H, 0, u('vig')),
  storefront: (c, G) => G.scene + floorAt(400)
    + `<g ${SH()}>` + rr(60, 40, 480, 72, 0, u('ink')) + `</g>` + tx(300, 88, c.title, 34, readable(c.ink), c.fD, 'text-anchor="middle"', 440)
    + `<path d="M60,112 L540,112 L520,150 L80,150 Z" fill="${c.ac}"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${60 + i * 40},112 L${100 + i * 40},112 L${98 + i * 40},150 L${82 + i * 40},150 Z" fill="${i % 2 ? dk(c.ac, .18) : c.ac}"/>`).join('')
    + rr(60, 150, 480, 250, 0, '#2E2E33') + rr(70, 160, 200, 230, 0, u('win')) + rr(280, 160, 250, 230, 0, u('win'))
    + rr(300, 200, 210, 120, 0, c.ac2) + tx(405, 270, c.sub, 20, readable(c.ac2), c.fD, 'text-anchor="middle"', 190) + mark(c, 170, 275, 50)
    + `<polygon points="70,160 270,160 270,220 70,390" fill="#FFFFFF" opacity=".10"/><polygon points="280,160 530,160 530,240 280,390" fill="#FFFFFF" opacity=".10"/>`
    + [140, 400].map(x => `<ellipse cx="${x}" cy="150" rx="70" ry="30" fill="#FFF3D0" opacity=".16" filter="${u('glow')}"/>`).join(''),
  /* ─ vestuário ─ */
  tshirt: (c, G) => { const sh = c.scene === 'escuro' ? c.ink : c.bg; return G.scene + floorAt(430)
    + `<g ${SH()}>` + `<path d="M210,60 L260,45 Q300,80 340,45 L390,60 L460,110 L420,160 L390,140 L390,430 L210,430 L210,140 L180,160 L140,110 Z" fill="${u('fab')}"/>` + `</g>`
    + `<path d="M260,45 Q300,80 340,45 Q300,100 260,45 Z" fill="${dk(sh, .22)}"/>` + `<path d="M225,150 Q240,300 222,425" stroke="#000" stroke-opacity=".08" stroke-width="18" fill="none" filter="${u('blur')}"/><path d="M375,150 Q360,300 378,425" stroke="#000" stroke-opacity=".08" stroke-width="18" fill="none" filter="${u('blur')}"/>`
    + mark(c, 300, 230, 56, sh) + txw(300, 316, c.title, 22, readable(sh), c.fD, 'text-anchor="middle"', 170, 2) },
  tote: (c, G) => G.scene + floorAt(430) + contact(170, 430, 260, G.sh, 10)
    + `<path d="M230,120 Q230,40 300,40 Q370,40 370,120" fill="none" stroke="${u('ink')}" stroke-width="14"/>`
    + `<g ${SH()}>` + rr(170, 110, 260, 320, 8, u('fab')) + `</g>` + rr(170, 110, 260, 16, 0, c.ac2)
    + `<path d="M190,130 Q200,300 186,420" stroke="#000" stroke-opacity=".07" stroke-width="22" fill="none" filter="${u('blur')}"/><path d="M410,130 Q400,300 414,420" stroke="#000" stroke-opacity=".07" stroke-width="22" fill="none" filter="${u('blur')}"/>`
    + mark(c, 300, 230, 56) + txw(300, 322, c.title, 25, c.ink, c.fD, 'text-anchor="middle"', 230, 2) + tx(300, 364, c.sub, 10, c.ink, c.fM, 'text-anchor="middle" opacity=".7"', 230),
  cap: (c, G) => G.scene + floorAt(400) + contact(120, 330, 380, G.sh, 14)
    + `<g ${SH()}>` + `<path d="M150,270 Q150,110 300,110 Q450,110 450,270 Z" fill="${u('acv')}"/>` + `</g>`
    + `<path d="M300,110 L300,270" stroke="${dk(c.ac, .25)}" stroke-width="3"/><path d="M225,120 Q210,200 205,270" stroke="${dk(c.ac, .25)}" stroke-width="2" fill="none"/><path d="M375,120 Q390,200 395,270" stroke="${dk(c.ac, .25)}" stroke-width="2" fill="none"/>`
    + `<path d="M150,270 Q150,110 300,110 Q450,110 450,270 Z" fill="${u('gl')}" opacity=".12"/>`
    + `<g ${SH2()}>` + `<path d="M130,270 L470,270 Q520,290 480,320 Q300,300 120,320 Q80,290 130,270 Z" fill="${u('ink')}"/>` + `</g>`
    + `<circle cx="300" cy="112" r="7" fill="${dk(c.ac, .25)}"/>` + mark(c, 300, 205, 34, c.ac) + tx(300, 262, c.title, 14, readable(c.ac), c.fD, 'text-anchor="middle"', 200),
  hoodie: (c, G) => G.scene + floorAt(440)
    + `<g ${SH()}>` + `<path d="M230,90 Q300,20 370,90 L440,120 L470,200 L420,220 L410,430 L190,430 L180,220 L130,200 L160,120 Z" fill="${u('ink')}"/>` + `</g>`
    + `<path d="M250,100 Q300,60 350,100 Q300,150 250,100 Z" fill="${dk(c.ink, .35)}"/>` + rr(230, 330, 140, 60, 10, lt(c.ink, .06)) + `<path d="M290,110 L286,200 M310,110 L314,200" stroke="${lt(c.ink, .2)}" stroke-width="4" stroke-linecap="round"/>`
    + `<path d="M205,230 Q215,330 200,425" stroke="#000" stroke-opacity=".18" stroke-width="20" fill="none" filter="${u('blur')}"/>`
    + txw(300, 240, c.title, 28, readable(c.ink), c.fD, 'text-anchor="middle"', 210, 2) + tx(300, 276, c.sub, 12, readable(c.ink), c.fM, 'text-anchor="middle" opacity=".8" letter-spacing="2"', 200),
  badge: (c, G) => G.scene + floorAt(440) + rr(290, 0, 20, 96, 0, u('acv')) + rr(284, 86, 32, 14, 3, '#B8B9BE') + `<circle cx="300" cy="104" r="5" fill="#9A9BA2"/>`
    + `<g ${SH()}>` + rr(190, 96, 220, 330, 14, u('paper')) + `</g>` + rr(190, 96, 220, 110, 0, u('ink')) + `<path d="M190,96 h220 v14 a14,14 0 0 1 0,0 h-220 z" fill="${u('ink')}"/>` + mark(c, 300, 152, 34, c.ink)
    + `<circle cx="300" cy="108" r="9" fill="${G.g}"/>` + txw(300, 248, c.title, 24, c.ink, c.fD, 'text-anchor="middle"', 190, 2) + tx(300, 282, c.sub, 11, c.ink, c.fB, 'text-anchor="middle" opacity=".7"', 190)
    + lines(240, 326, 120, 3, c.ink, 10, 3) + rr(240, 376, 120, 28, 14, c.ac) + tx(300, 394, '2026', 11, readable(c.ac), c.fM, 'text-anchor="middle"') + gloss(190, 96, 220, 160, 14, .07),
  keytag: (c, G) => G.scene + floorAt(440) + contact(150, 320, 320, G.sh, 14)
    + `<circle cx="130" cy="220" r="34" fill="none" stroke="${u('alu')}" stroke-width="10"/><circle cx="130" cy="220" r="34" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="3" stroke-dasharray="40 200"/>`
    + `<g transform="rotate(-12 320 225)" ${SH()}>${rr(160, 160, 320, 130, 44, u('acv'))}<circle cx="200" cy="225" r="12" fill="${G.g}"/>${gloss(160, 160, 320, 60, 44, .14)}`
    + txw(240, 210, c.title, 24, readable(c.ac), c.fD, '', 220, 2) + tx(240, 246, c.sub, 11, readable(c.ac), c.fM, 'opacity=".8"', 220) + '</g>',
  /* ─ telas em ambiente ─ */
  airport: (c) => { const on = onBg(c); return rr(0, 0, W, H, 0, u('hall')) + rr(0, 320, W, 130, 0, '#141418')
    + Array.from({ length: 9 }, (_, i) => `<line x1="${300 + (i - 4) * 40}" y1="320" x2="${300 + (i - 4) * 170}" y2="450" stroke="#2A2A30" stroke-width="1.5"/>`).join('') + [340, 370, 410].map(y => rr(0, y, W, 1.5, 0, '#2A2A30')).join('')
    + `<ellipse cx="300" cy="150" rx="300" ry="120" fill="${c.ac}" opacity=".12" filter="${u('glow')}"/>`
    + `<g ${SH()}>` + rr(28, 36, 544, 208, 6, '#0B0B0E') + `</g>` + rr(40, 48, 520, 184, 0, c.bg) + rr(40, 48, 520, 12, 0, c.ac)
    + txw(70, 110, c.sub, 32, on, c.fD, '', 300, 2) + lines(70, 160, 260, 2, on, 14, 4) + lockup(c, 380, 190, 40, on, false) + glass(40, 48, 520, 184, 0)
    + `<path d="M40,232 L560,232 L600,320 L0,320 Z" fill="${c.bg}" opacity=".08"/>` + rr(0, 0, W, H, 0, u('vig')) },
  desk: (c, G) => rr(0, 0, W, H, 0, u('hall')) + rr(0, 296, W, 154, 0, u('wood')) + Array.from({ length: 8 }, (_, i) => rr(0, 300 + i * 19, W, 6, 0, '#000', 'opacity=".12"')).join('')
    + `<ellipse cx="300" cy="120" rx="240" ry="90" fill="${c.ac2}" opacity=".16" filter="${u('glow')}"/>`
    + `<g ${SH()}>` + rr(148, 56, 304, 176, 8, u('frame')) + rr(154, 62, 292, 164, 4, '#0B0B0E') + `</g>` + screen(c, 160, 68, 280, 152, 2) + glass(160, 68, 280, 152, 2)
    + `<path d="M288,232 L312,232 L318,296 L282,296 Z" fill="${u('alu')}"/>` + rr(80, 292, 440, 10, 3, c.ac) + rr(80, 302, 440, 4, 0, dk(c.ac, .4)) + rr(0, 0, W, H, 0, u('vig')),
  wall: (c) => rr(0, 0, W, H, 0, u('hall')) + rr(0, 380, W, 70, 0, '#141418') + [340, 380].map(y => rr(0, y, W, 1, 0, '#2A2A30')).join('')
    + [0, 1, 2].map(i => { const x = 40 + i * 180, on = i === 1 ? c.ac : c.bg; return `<g ${SH()}>` + rr(x - 2, 58, 164, 294, 6, '#0B0B0E') + `</g>` + rr(x + 6, 66, 148, 278, 0, on)
      + mark(c, x + 80, 170, 40, on) + tx(x + 80, 250, i === 1 ? c.title : c.sub, i === 1 ? 20 : 14, readable(on), c.fD, 'text-anchor="middle"', 136) + (i === 1 ? '' : lines(x + 30, 280, 100, 3, readable(on), 10, 3))
      + glass(x + 6, 66, 148, 278, 0) + `<rect x="${x + 6}" y="352" width="148" height="60" fill="${on}" opacity=".12"/>` }).join('')
    + rr(0, 350, W, 30, 0, dk(c.ac2, .45)) + rr(0, 0, W, H, 0, u('vig')),
  kiosk: (c, G) => G.scene + floorAt(400) + contact(200, 424, 200, G.sh, 12)
    + `<g ${SH()}>` + rr(198, 18, 204, 404, 16, u('frame')) + rr(204, 24, 192, 392, 12, '#0B0B0E') + `</g>` + screen(c, 212, 40, 176, 300, 6, true) + glass(212, 40, 176, 300, 6)
    + rr(212, 350, 176, 50, 6, u('acv')) + tx(300, 381, c.title, 16, readable(c.ac), c.fD, 'text-anchor="middle"', 160) + rr(230, 408, 140, 4, 2, '#3A3A40'),
  tv: (c, G) => G.scene + floorAt(360) + rr(60, 300, 480, 60, 6, u('wood')) + rr(60, 300, 480, 4, 0, '#FFFFFF', 'opacity=".2"')
    + `<g ${SH()}>` + rr(66, 36, 468, 268, 10, u('frame')) + rr(72, 42, 456, 256, 4, '#0B0B0E') + `</g>` + rr(78, 48, 444, 244, 2, c.ink) + stripe(c, 78, 48, 444, 244, true) + rr(78, 48, 444, 244, 2, '#000', 'opacity=".38"')
    + txw(300, 150, c.title, 40, '#FFFFFF', c.fD, 'text-anchor="middle"', 400, 2) + tx(300, 240, c.sub, 15, '#FFFFFF', c.fB, 'text-anchor="middle" opacity=".85"', 400) + glass(78, 48, 444, 244, 2)
    + rr(270, 304, 60, 8, 3, '#9A9BA2') + rr(90, 318, 30, 30, 4, '#3A3A40') + rr(130, 318, 90, 30, 4, '#3A3A40') + rr(230, 330, 200, 12, 4, c.ac2, 'opacity=".8"'),
  watch: (c, G) => G.scene + floorAt(420) + contact(210, 428, 180, G.sh, 10)
    + `<g ${SH()}>` + rr(250, 16, 100, 70, 22, u('strap')) + rr(250, 364, 100, 70, 22, u('strap')) + rr(206, 66, 188, 318, 54, u('frame')) + `</g>`
    + rr(214, 74, 172, 302, 48, '#0B0B0E') + rr(222, 82, 156, 286, 42, c.bg)
    + tx(300, 150, '10:08', 34, onBg(c), c.fM, 'text-anchor="middle"') + mark(c, 300, 225, 40)
    + rr(246, 290, 108, 34, 17, c.ac) + tx(300, 312, c.title.split(' ')[0], 13, readable(c.ac), c.fB, 'text-anchor="middle" font-weight="600"', 100) + glass(222, 82, 156, 286, 42)
    + rr(394, 150, 6, 40, 3, '#3A3A40') + [280, 320].map(y => rr(262, y, 76, 3, 1.5, '#000', 'opacity=".12"')).join('')
};
export function mockSvg(k: string, c: MockCtx): string {
  P = 'g' + (++seq).toString(36) + '_';
  const G = ground(c);
  const defs = G.defs
    + lin('frame', [[0, '#3A3A40'], [.5, '#1C1C21'], [1, '#2B2B31']], 0, 0, 1, 1)
    + lin('alu', [[0, '#DCDDE1'], [.5, '#B9BAC0'], [1, '#E4E5E9']], 0, 0, 1, 0)
    + mat('ink', c.ink, .14) + mat('paper', '#FFFFFF', .06) + cyl('body', lt(c.ac2, .12), .32) + cyl('cap', c.ink, .35) + cyl('cap2', c.ac, .35) + cyl('kraft', c.scene === 'cor' ? c.bg : '#C8B49A', .2)
    + mat('acv', c.ac, .14) + mat('ac2v', c.ac2, .14) + mat('fab', c.scene === 'escuro' ? c.ink : c.bg, .1) + mat('spine', dk(c.ink, .3), .2) + mat('strap', dk(c.ink, .2), .2)
    + lin('ac', [[0, lt(c.ac, .1)], [1, dk(c.ac, .12)]], 0, 0, 1, 1) + lin('acsoft', [[0, c.ac, 0], [1, c.ac, .18]])
    + lin('dusk', [[0, '#1E2233'], [.6, '#3D3A55'], [1, '#6B4A55']]) + lin('hall', [[0, '#1E1E24'], [1, '#2C2C33']]) + lin('wall', [[0, '#3E3B37'], [1, '#2E2C29']], 0, 0, 1, 0)
    + lin('post', [[0, '#26262B'], [.5, '#4A4A52'], [1, '#26262B']], 0, 0, 1, 0) + lin('win', [[0, lt(c.bg, .12)], [1, dk(c.bg, .08)]]) + lin('wood', [[0, '#4A423A'], [1, '#2E2924']])
    + `<filter id="${P}noise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter>`;
  const body = (DRAW[k] || DRAW.poster)(c, G);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${e(c.title)}"><defs>${defs}</defs>${body}</svg>`;
}
