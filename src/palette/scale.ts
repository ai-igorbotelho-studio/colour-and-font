/* ── em escala: a paleta ocupando a tela inteira ── */
import { readable } from '../core/color';
import { $, $all, copy } from '../core/dom';
import { S, cur, hexOf, shown, proportions } from './state';

export function scaleFill(): void {
  const el = $('scale'); $all(el, '.band').forEach(b => b.remove());
  const pr = proportions();
  S.colors.forEach((c, i) => { const h = hexOf(c), v = shown(c), d = document.createElement('div');
    d.className = 'band'; d.style.flex = pr[i].toFixed(2); d.style.background = v; d.style.color = readable(v);
    d.innerHTML = `<span>${h} · ${Math.round(pr[i])}%</span>`; d.onclick = () => copy(h, h + ' copiado'); el.appendChild(d) });
  const { E, M, L } = cur();
  $('scaleBig').textContent = E.a !== null ? E.n : (M.a !== null ? M.n : 'Paleta');
  $('scaleSm').textContent = [M.a !== null ? M.n : null, L.n.split(' — ')[0], cur().SC.n].filter(Boolean).join(' · ');
}
export function initScale(): void {
  $('scaleBtn').onclick = () => { scaleFill(); $('scale').classList.add('on'); document.body.style.overflow = 'hidden' };
  $('scaleX').onclick = () => { $('scale').classList.remove('on'); document.body.style.overflow = '' };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('scale').classList.contains('on')) $('scaleX').click() });
}
