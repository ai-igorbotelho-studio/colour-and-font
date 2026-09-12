/* ═══════════ TEORIA — demonstrações interativas ═══════════
   OKLab: luminosidade declarada e mistura entre duas cores, em RGB e em OKLab.
   Contraste: laboratório com duas cores, razão WCAG e vereditos ao vivo.
   Pares: um exemplo real de cada estratégia de combinação. */
import { hslHex, oklch2hex, hex2rgb, rgb2hex, ratio, mixLch, readable } from './core/color';
import { $, $all, esc, toast } from './core/dom';
import { t, dec } from './i18n';
import { FONTS } from './data/fonts';
import { palette, paletteStore } from './palette/state';
import { famAttr } from './type/pairing';
import { loadFont } from './type/loader';

const HUES = [30, 60, 90, 150, 210, 260, 300, 340];
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const mixRgb = (A: string, B: string, k: number): string => { const a = hex2rgb(A), b = hex2rgb(B); return rgb2hex(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k) };

/* ── OKLab ── */
let okA = '#2E4E9E', okB = '#F2C14E';
function drawOk(): void {
  const L = +($('okL') as HTMLInputElement).value; $('okLv').textContent = String(L);
  const row = (f: (h: number) => string, lbl: string) => `<div class="okrow"><span class="lab">${lbl}</span><span class="sw">${HUES.map(h => `<i style="background:${f(h)}"></i>`).join('')}</span></div>`;
  $('okDemo').innerHTML = row(h => hslHex(h, 70, L), 'HSL') + row(h => oklch2hex(.2 + (L / 100) * .75, .12, h), 'OKLab');
  const k = +($('okT') as HTMLInputElement).value / 100; $('okTv').textContent = String(Math.round(k * 100));
  const band = (f: (x: number) => string, lbl: string) => { const stops = Array.from({ length: 21 }, (_, i) => f(i / 20)); const c = f(k);
    return `<div class="okband" style="background:linear-gradient(90deg,${stops.join(',')})"><span class="lab">${lbl}</span><span class="mk" style="left:${(k * 100).toFixed(1)}%;background:${c}" title="${c}"></span></div>` };
  $('okMix').innerHTML = band(x => mixRgb(okA, okB, x), 'RGB') + band(x => mixLch(okA, okB, x), 'OKLab');
  ($('okA') as HTMLElement).style.background = okA; ($('okB') as HTMLElement).style.background = okB;
}
function initOk(): void {
  if (!document.getElementById('okDemo')) return;
  $('okL').addEventListener('input', drawOk); $('okT').addEventListener('input', drawOk);
  let ia = 0, ib = 1;
  $('okA').onclick = () => { const P = palette(); if (P.length < 2) return; ia = (ia + 1) % P.length; okA = P[ia]; if (okA === okB) { ia = (ia + 1) % P.length; okA = P[ia] } drawOk() };
  $('okB').onclick = () => { const P = palette(); if (P.length < 2) return; ib = (ib + 1) % P.length; okB = P[ib]; if (okB === okA) { ib = (ib + 1) % P.length; okB = P[ib] } drawOk() };
  drawOk();
}

/* ── contraste ── */
const HEX = /^#?[0-9a-f]{6}$/i;
function drawCt(): void {
  const fg = ($('ctFg') as HTMLInputElement).value.toUpperCase(), bg = ($('ctBg') as HTMLInputElement).value.toUpperCase(), r = ratio(fg, bg);
  ($('ctFgHex') as HTMLInputElement).value = fg; ($('ctBgHex') as HTMLInputElement).value = bg;
  $('ctRatio').textContent = dec(Math.round(r * 100) / 100, 2);
  const V: [string, number][] = [[t('Texto corrido AA'), 4.5], [t('Texto corrido AAA'), 7], [t('Texto grande AA'), 3], [t('Texto grande AAA'), 4.5], [t('Interface e ícones'), 3]];
  $('ctVerdicts').innerHTML = V.map(([n, m]) => `<span class="${r >= m ? 'ok' : ''}"><i></i>${esc(n)} <b>${r >= m ? t('passa') : t('falha')}</b></span>`).join('');
  const el = $('ctSample'); el.style.background = bg; el.style.color = fg;
  el.setAttribute('aria-label', t('Razão de contraste {r} para 1', { r: dec(Math.round(r * 100) / 100, 2) }));
}
function initCt(): void {
  if (!document.getElementById('ctFg')) return;
  const bind = (c: string, h: string): void => { $(c).addEventListener('input', drawCt);
    $(h).addEventListener('input', () => { const v = ($(h) as HTMLInputElement).value.trim(); if (HEX.test(v)) { ($(c) as HTMLInputElement).value = (v.startsWith('#') ? v : '#' + v).toUpperCase(); drawCt() } }) };
  bind('ctFg', 'ctFgHex'); bind('ctBg', 'ctBgHex');
  $('ctSwap').onclick = () => { const a = ($('ctFg') as HTMLInputElement).value; ($('ctFg') as HTMLInputElement).value = ($('ctBg') as HTMLInputElement).value; ($('ctBg') as HTMLInputElement).value = a; drawCt() };
  $('ctPal').onclick = () => { const P = palette(); if (P.length < 2) return toast(t('Gere uma paleta em Cores primeiro'));
    let best: [string, string] = [P[0], P[1]], br = 0; P.forEach(a => P.forEach(b => { if (a !== b && ratio(a, b) > br) { br = ratio(a, b); best = [a, b] } }));
    const [x, y] = best; const bg = ratio(x, '#FFFFFF') < ratio(y, '#FFFFFF') ? x : y, fg = bg === x ? y : x;
    ($('ctFg') as HTMLInputElement).value = fg; ($('ctBg') as HTMLInputElement).value = bg; drawCt() };
  drawCt();
}

/* ── um exemplo de cada estratégia ── */
const PAIRS: Record<string, [string, string]> = { estrutura: ['Playfair Display', 'Source Sans 3'], superfamilia: ['IBM Plex Serif', 'IBM Plex Sans'], uma: ['Inter', 'Inter'], metrica: ['Source Serif 4', 'Work Sans'] };
function initPairs(): void {
  $all<HTMLElement>(document, '.pairposter').forEach(p => { const k = p.dataset.pair!, [dn, bn] = PAIRS[k], d = FONTS.find(f => f.n === dn), b = FONTS.find(f => f.n === bn); if (!d || !b) return;
    loadFont(d); loadFont(b); const ex = p.querySelector<HTMLElement>('.pairex')!;
    ex.innerHTML = `<p class="d" style="font-family:${famAttr(d)};${k === 'uma' ? 'font-weight:800' : ''}">${t('A cor nasce na fronteira')}</p>
      <p class="b" style="font-family:${famAttr(b)}">${t('Entre a luz e a treva, atravessada por um meio turvo, diz Goethe. O texto corrido pede calma; o título pede presença.')}</p>
      <p class="n">${esc(dn)}${k === 'uma' ? ' 800' : ''} + ${esc(bn)}${k === 'uma' ? ' 400' : ''}</p>` });
}
export function initTheory(): void {
  initOk(); initCt(); initPairs();
  paletteStore.subscribe(() => { if (document.getElementById('okDemo')) drawOk() });
}
