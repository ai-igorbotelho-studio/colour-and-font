/* ═══════════ DEMONSTRAÇÕES DA PÁGINA INICIAL ═══════════ */
import { oklch2hex } from './core/color';
import { ANCHORS, hexAt } from './core/goethe';
import { $, $all } from './core/dom';
import { t } from './i18n';
import { CLS, FONTS } from './data/fonts';
import { famAttr } from './type/pairing';
import { loadFont } from './type/loader';

export function wheelSvg(marks: number[], size: number, showLabels: boolean): string {
  const cx = 200, cy = 200, R = size || 160, seg: string[] = [];
  for (let i = 0; i < 120; i++) { const a0 = i * 3, a1 = a0 + 3.3;
    const p = (a: number, r: number) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)];
    seg.push(`<path d="M${cx},${cy} L${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)} Z" fill="${hexAt(a0 + 1.6)}"/>`) }
  let g = seg.join('');
  (marks || []).forEach(m => { const r = R * .72, x = cx + r * Math.cos((m - 90) * Math.PI / 180), y = cy + r * Math.sin((m - 90) * Math.PI / 180);
    g += `<circle cx="${x}" cy="${y}" r="${R * .13}" fill="${hexAt(m)}" stroke="#000" stroke-width="2.5"/>
        <circle cx="${x}" cy="${y}" r="${R * .13}" fill="none" stroke="#fff" stroke-width="1"/>` });
  if (showLabels) g += ANCHORS.map(an => { const r = R + 22, x = cx + r * Math.cos((an.a - 90) * Math.PI / 180), y = cy + r * Math.sin((an.a - 90) * Math.PI / 180);
    return `<text x="${x}" y="${y + 4}" text-anchor="${an.a === 0 || an.a === 180 ? 'middle' : an.a < 180 ? 'start' : 'end'}" fill="var(--soft)" font-family="Mulish,sans-serif" font-size="11">${an.nome}</text>` }).join('');
  return g;
}
export function drawHome(): void {
  $('homeWheel').innerHTML = wheelSvg([], 160, true)
   + `<circle cx="200" cy="200" r="160" fill="none" stroke="var(--rule)"/>
     <path d="M200 40 A160 160 0 0 1 200 360" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="2 6" opacity=".55"/>
     <text x="286" y="196" text-anchor="middle" font-family="DM Serif Display,serif" font-size="15" fill="#000">${t('lado')}</text>
     <text x="286" y="214" text-anchor="middle" font-family="DM Serif Display,serif" font-size="15" fill="#000">${t('positivo')}</text>
     <text x="114" y="196" text-anchor="middle" font-family="DM Serif Display,serif" font-size="15" fill="#fff">${t('lado')}</text>
     <text x="114" y="214" text-anchor="middle" font-family="DM Serif Display,serif" font-size="15" fill="#fff">${t('negativo')}</text>`;

  const demos: [string, number[]][] = [['Monocromático', [20]], ['Análogo', [20, 50, 350]], ['Complementar', [20, 200]],
   ['Complementar dividido', [20, 170, 230]], ['Tríade', [20, 140, 260]], ['Tetrádico', [20, 80, 200, 260]]];
  $('schemeDemos').innerHTML = demos.map(([n, m]) =>
    `<div><svg viewBox="0 0 400 400" style="width:100%;height:auto">${wheelSvg(m, 150, false)}</svg>
     <div class="sm" style="text-align:center;margin-top:4px">${t(n)}</div></div>`).join('');

  drawVenn('add'); drawVenn('sub');

  const reps: Record<string, string> = { 'serif-old': 'EB Garamond', 'serif-trans': 'Lora', 'serif-mod': 'Playfair Display', 'serif-slab': 'Roboto Slab',
    'sans-grot': 'Space Grotesk', 'sans-neo': 'Inter', 'sans-geo': 'Poppins', 'sans-hum': 'IBM Plex Sans', 'mono': 'JetBrains Mono', 'display': 'Syne' };
  $('classGrid').innerHTML = (Object.keys(CLS) as (keyof typeof CLS)[]).map(k => { const f = FONTS.find(x => x.n === reps[k]); if (f) loadFont(f);
    return `<div class="card"><div style="font-family:${f ? famAttr(f) : 'serif'};font-size:32px;line-height:1.1;margin-bottom:6px">Aa Gg</div>
      <h4>${CLS[k].n}</h4><p class="sm">${CLS[k].d}</p><p class="sm" style="margin-top:6px">${t('Exemplo: {n}', { n: reps[k] })}</p></div>` }).join('');
}

/* ── diagramas de mistura, arrastáveis ── */
interface VennPart { c: string; n: string; x: number; y: number }
interface Venn { el: string; bg: string; lb: string; parts: VennPart[] }
const VENN: Record<'add' | 'sub', Venn> = {
  add: { el: 'vennAdd', bg: '#000', lb: '#fff', parts: [
    { c: '#FF0000', n: 'R', x: 36, y: 34 }, { c: '#00FF00', n: 'G', x: 64, y: 34 }, { c: '#0000FF', n: 'B', x: 50, y: 64 }] },
  sub: { el: 'vennSub', bg: '#FFFFFF', lb: '#000', parts: [
    { c: '#00AEEF', n: 'C', x: 36, y: 34 }, { c: '#EC008C', n: 'M', x: 64, y: 34 }, { c: '#FFF200', n: 'Y', x: 50, y: 64 }] }
};
const VENN0 = JSON.parse(JSON.stringify(VENN)) as typeof VENN;
function drawVenn(k: 'add' | 'sub'): void {
  const V = VENN[k], el = $(V.el); if (!el) return;
  el.style.background = V.bg;
  el.innerHTML = V.parts.map((p, i) =>
     `<div class="c" data-i="${i}" style="background:${p.c};width:52%;aspect-ratio:1;left:${p.x}%;top:${p.y}%;transform:translate(-50%,-50%)"></div>`).join('')
   + `<div class="marks">${V.parts.map(p => `<span class="lb" style="left:${p.x}%;top:${p.y}%;color:${V.lb}">${p.n}</span>`).join('')}</div>`;
  $all<HTMLElement>(el, '.c').forEach(c => {
    c.addEventListener('pointerdown', e => {
      e.preventDefault(); const i = +c.dataset.i!; c.classList.add('drag');
      try { c.setPointerCapture(e.pointerId) } catch (_) {}
      const mv = (ev: PointerEvent) => { const r = el.getBoundingClientRect();
        VENN[k].parts[i].x = Math.max(2, Math.min(98, (ev.clientX - r.left) / r.width * 100));
        VENN[k].parts[i].y = Math.max(2, Math.min(98, (ev.clientY - r.top) / r.height * 100));
        c.style.left = VENN[k].parts[i].x + '%'; c.style.top = VENN[k].parts[i].y + '%';
        const lb = el.querySelectorAll<HTMLElement>('.lb')[i]; lb.style.left = c.style.left; lb.style.top = c.style.top };
      const up = () => { c.classList.remove('drag'); c.removeEventListener('pointermove', mv); c.removeEventListener('pointerup', up) };
      c.addEventListener('pointermove', mv); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up) }) });
}
export function initHome(): void {
  $all<HTMLButtonElement>(document, '[data-venn]').forEach(b => b.onclick = () => {
    const k = b.dataset.venn as 'add' | 'sub'; VENN[k].parts = JSON.parse(JSON.stringify(VENN0[k].parts)); drawVenn(k) });
  drawHome();
}
