/* ═══════════ ESTÚDIO DE GRADIENTES ═══════════ */
import { hex2rgb, rgb2hex, rgb2hsl, rgb2oklab, oklch2hex, mixLch, wrapDeg, hslHex, simulate } from '../core/color';
import { $, $v, $all, copy, download, toast } from '../core/dom';
import { t } from '../i18n';
import { createStore } from '../core/state';
import { S, palette } from './state';

export interface Stop { t: number; hex: string }
export const gradientStore = createStore({ stops: [{ t: 0, hex: '#22409B' }, { t: 1, hex: '#F2CC00' }] as Stop[], sel: 0 });
const G = gradientStore.state;

export function easeT(t: number, m = $v('gEase')): number {
  if (m === 'ease') return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  if (m === 'in') return t * t; if (m === 'out') return 1 - (1 - t) * (1 - t); return t;
}
/** Amostra o gradiente em t ∈ [0,1] no espaço escolhido (srgb, hsl, oklch ou oklab). */
export function gradSample(t: number, stops: Stop[] = G.stops, sp = $v('gSpace')): string {
  const st = [...stops].sort((a, b) => a.t - b.t);
  if (t <= st[0].t) return st[0].hex;
  if (t >= st[st.length - 1].t) return st[st.length - 1].hex;
  for (let i = 0; i < st.length - 1; i++) {
    if (t >= st[i].t && t <= st[i + 1].t) {
      const f = (t - st[i].t) / ((st[i + 1].t - st[i].t) || 1);
      const A = st[i].hex, B = st[i + 1].hex;
      if (sp === 'srgb') { const a = hex2rgb(A), b = hex2rgb(B);
        return rgb2hex(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f) }
      if (sp === 'hsl') { const a = rgb2hsl(...hex2rgb(A)), b = rgb2hsl(...hex2rgb(B));
        const h = (a[0] + wrapDeg(b[0] - a[0]) * f + 360) % 360, s = a[1] + (b[1] - a[1]) * f, l = a[2] + (b[2] - a[2]) * f;
        return hslHex(h, s, l) }
      if (sp === 'oklch') return mixLch(A, B, f);
      const oa = rgb2oklab(...hex2rgb(A)), ob = rgb2oklab(...hex2rgb(B));
      const L = oa.L + (ob.L - oa.L) * f, aa = oa.a + (ob.a - oa.a) * f, bb = oa.b + (ob.b - oa.b) * f;
      return oklch2hex(L, Math.hypot(aa, bb), (Math.atan2(bb, aa) * 180 / Math.PI + 360) % 360);
    } }
  return st[0].hex;
}
export function gradCssString(): string {
  const N = 20, stops: string[] = [];
  for (let i = 0; i <= N; i++) { const t = i / N; stops.push(`${simulate(gradSample(easeT(t)), S.cvd)} ${Math.round(t * 100)}%`) }
  const ty = $v('gType'), ang = $v('gAngle');
  if (ty === 'radial') return `radial-gradient(circle at 50% 50%, ${stops.join(', ')})`;
  if (ty === 'conic') return `conic-gradient(from ${ang}deg at 50% 50%, ${stops.join(', ')})`;
  return `linear-gradient(${ang}deg, ${stops.join(', ')})`;
}
export function gradSvgString(): string {
  const N = 20, st = Array.from({ length: N + 1 }, (_, i) => `<stop offset="${(i / N * 100).toFixed(1)}%" stop-color="${gradSample(easeT(i / N))}"/>`).join('');
  const ang = +$v('gAngle'), rad = (ang - 90) * Math.PI / 180;
  const x2 = (.5 + Math.cos(rad) * .5).toFixed(3), y2 = (.5 + Math.sin(rad) * .5).toFixed(3),
        x1 = (.5 - Math.cos(rad) * .5).toFixed(3), y1 = (.5 - Math.sin(rad) * .5).toFixed(3);
  const def = $v('gType') === 'radial' ? `<radialGradient id="g">${st}</radialGradient>`
    : `<linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st}</linearGradient>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs>${def}</defs><rect width="1600" height="900" fill="url(#g)"/></svg>`;
}
export function drawGrad(): void {
  const css = gradCssString();
  $('gradPrev').style.background = css;
  $('gradBar').style.background = `linear-gradient(90deg, ${Array.from({ length: 21 }, (_, i) => `${simulate(gradSample(easeT(i / 20)), S.cvd)} ${i * 5}%`).join(', ')})`;
  $('gradBar').innerHTML = G.stops.map((s, i) =>
    `<div class="stop${G.sel === i ? ' sel' : ''}" data-i="${i}" style="left:${s.t * 100}%"><i style="background:${s.hex}"></i></div>`).join('');
  $all<HTMLElement>($('gradBar'), '.stop').forEach(el => {
    const i = +el.dataset.i!;
    el.addEventListener('pointerdown', e => { e.stopPropagation(); G.sel = i; el.setPointerCapture(e.pointerId);
      const mv = (ev: PointerEvent) => { const r = $('gradBar').getBoundingClientRect();
        G.stops[i].t = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); drawGrad() };
      const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up) };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); drawGrad() });
  });
  $('gAngleV').textContent = $v('gAngle') + '°';
  $('gradCss').textContent = 'background: ' + css + ';\n\n' + t('/* paradas */') + '\n'
    + [...G.stops].sort((a, b) => a.t - b.t).map(s => t('/* {h} em {p}% */', { h: s.hex, p: Math.round(s.t * 100) })).join('\n');
  gradientStore.notify();
}
/** Paradas do gradiente a partir da paleta atual. */
export function gradFromPalette(): void { const hs = palette();
  G.stops = hs.map((h, i) => ({ t: hs.length === 1 ? 0 : i / (hs.length - 1), hex: h })); G.sel = 0; drawGrad() }
export function initGradient(): void {
  $('gAdd').onclick = () => { const t = G.stops.length ? Math.min(1, Math.max(...G.stops.map(s => s.t)) - .25) : .5;
    G.stops.push({ t: Math.max(0, t), hex: gradSample(Math.max(0, t)) }); G.sel = G.stops.length - 1; drawGrad() };
  $('gDel').onclick = () => { if (G.stops.length <= 2) return toast(t('Um gradiente precisa de ao menos duas paradas'));
    G.stops.splice(G.sel, 1); G.sel = 0; drawGrad() };
  $('gRev').onclick = () => { G.stops.forEach(s => s.t = 1 - s.t); drawGrad() };
  $('gFromPal').onclick = () => { gradFromPalette(); toast(t('Paradas puxadas da paleta')) };
  ['gType', 'gSpace', 'gEase'].forEach(id => $(id).onchange = drawGrad);
  $('gAngle').oninput = drawGrad;
  $('gCopy').onclick = () => copy('background: ' + gradCssString() + ';', t('CSS do gradiente copiado'));
  $('gSvg').onclick = () => download('gradiente.svg', gradSvgString(), 'image/svg+xml');
  $('gPng').onclick = () => { const w = 1600, h = 900, cv = $('cv') as HTMLCanvasElement, ctx = cv.getContext('2d')!; cv.width = w; cv.height = h;
    const ang = (+$v('gAngle') - 90) * Math.PI / 180;
    const gr = $v('gType') === 'radial'
      ? ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2)
      : ctx.createLinearGradient(w / 2 - Math.cos(ang) * w / 2, h / 2 - Math.sin(ang) * h / 2, w / 2 + Math.cos(ang) * w / 2, h / 2 + Math.sin(ang) * h / 2);
    for (let i = 0; i <= 40; i++) gr.addColorStop(i / 40, gradSample(easeT(i / 40)));
    ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); cv.toBlob(b => { if (b) download('gradiente.png', b) }, 'image/png') };
}
