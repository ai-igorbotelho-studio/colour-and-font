/* ── detalhe de uma cor: todos os códigos e a escala de tons ── */
import { oklch2hex, readable, simulate } from '../core/color';
import { atAngle, nameOf } from '../core/goethe';
import { allCodes } from '../core/codes';
import { $, $all, esc, copy, reduceMotion } from '../core/dom';
import { t } from '../i18n';
import { S, hexOf, shown, proportions, hooks } from './state';

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/** Rampa de 11 degraus de uma cor, com o croma cedendo longe da luminosidade própria. */
export function rampOf(c: { a: number; L: number; C: number }): string[] { return rampLch(c.L, c.C, atAngle(c.a).H) }
export function rampLch(Lc: number, Cc: number, Hc: number): string[] {
  const ramp: string[] = [];
  for (let k = 0; k < 11; k++) { const L = .97 - k * .088; ramp.push(oklch2hex(L, Cc * (1 - Math.abs(L - Lc) * .5), Hc)) }
  return ramp;
}

export function openDetail(i: number): void {
  showDetail(i); hooks.render();
  const el = $('detail');
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) {}
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}
export function showDetail(i: number): void {
  const c = S.colors[i]; if (!c) return; S.sel = i;
  const h = hexOf(c);
  $('detail').style.display = 'block';
  const dHead = $('dHead'), bg = shown(c), fg = readable(bg), label = t('{h} · {name} · {p}% da área', { h, name: nameOf(c.a), p: Math.round(proportions()[i]) });
  dHead.setAttribute('style', `background:${bg};color:${fg}`);
  /* nome da cor: cross-fade só de opacidade quando o texto muda de fato, para
     que um arrasto rápido não pisque o texto ilegível (DESIGN-MOTION-SPEC.md §3) */
  const changed = dHead.textContent !== label;
  if (!changed || reduceMotion()) dHead.textContent = label;
  else { dHead.style.opacity = '0'; requestAnimationFrame(() => { dHead.textContent = label; requestAnimationFrame(() => { dHead.style.opacity = '1' }) }) }
  $('dTitle').textContent = t('Cor {n} — {name}', { n: i + 1, name: nameOf(c.a) });
  $('dCodes').innerHTML = allCodes(h).map(([k, v]) =>
    `<button class="code" data-v="${esc(v)}"><b>${k}</b><span>${esc(v)}</span></button>`).join('')
    + `<div class="code"><b>${t('Matiz no círculo')}</b><span>${Math.round(c.a)}°</span></div>`;
  $all<HTMLButtonElement>($('dCodes'), 'button').forEach(b => b.onclick = () => copy(b.dataset.v!, t('Copiado')));
  const ramp = rampOf(c);
  $('dRamp').innerHTML = ramp.map((x, k) => `<button class="cell" style="background:${simulate(x, S.cvd)};color:${readable(x)};flex:1;min-width:62px;min-height:74px;border:0;cursor:pointer;font:inherit" data-h="${x}">
     <div class="rgbx" style="opacity:.85">${RAMP_STEPS[k]}</div><div style="font-size:11px">${x}</div></button>`).join('');
  $all<HTMLButtonElement>($('dRamp'), 'button').forEach(b => b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' ' + t('Copiado').toLowerCase()));
}
export function initDetail(): void {
  $('dClose').onclick = () => { $('detail').style.display = 'none'; S.sel = null; hooks.render() };
}
