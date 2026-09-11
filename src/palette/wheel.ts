/* ── roda com bolas arrastáveis: ângulo = matiz, raio = croma ── */
import { simulate, readable, wrapDeg } from '../core/color';
import { ANCHORS, hexAt } from '../core/goethe';
import { $ } from '../core/dom';
import { S, cur, hexOf, shown, hooks } from './state';
import { pushH } from './history';
import { showDetail } from './detail';

const cx = 200, cy = 200, R = 168, maxC = .33;
const pos = (c: { a: number; C: number }): [number, number] => { const r = Math.min(1, c.C / maxC) * 150 + 14;
  return [cx + r * Math.cos((c.a - 90) * Math.PI / 180), cy + r * Math.sin((c.a - 90) * Math.PI / 180)] };

export function drawWheel(): void {
  const seg: string[] = [];
  for (let i = 0; i < 120; i++) { const a0 = i * 3, a1 = a0 + 3.3, h = hexAt(a0 + 1.6);
    const p = (a: number, r: number) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)];
    seg.push(`<path d="M${cx},${cy} L${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)} Z" fill="${simulate(h, S.cvd)}"/>`) }
  seg.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--rule)"/>`);
  seg.push(`<radialGradient id="fade"><stop offset="0%" stop-color="var(--ground)" stop-opacity=".95"/><stop offset="100%" stop-color="var(--ground)" stop-opacity="0"/></radialGradient>`);
  seg.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#fade)"/>`);
  $('disc').innerHTML = seg.join('');
  $('ticks').innerHTML = ANCHORS.map(an => { const r = 188, x = cx + r * Math.cos((an.a - 90) * Math.PI / 180), y = cy + r * Math.sin((an.a - 90) * Math.PI / 180);
    return `<text x="${x}" y="${y + 4}" text-anchor="${an.a === 0 || an.a === 180 ? 'middle' : an.a < 180 ? 'start' : 'end'}" fill="var(--soft)" font-family="IBM Plex Sans,sans-serif" font-size="11">${an.nome}</text>` }).join('');

  const pts = S.colors.map(pos);
  let g = '';
  if (cur().SC.off !== null && pts.length > 1) {
    g += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="var(--ink)" stroke-width="1" stroke-opacity=".45"/>`;
  }
  pts.forEach(p => { g += `<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="var(--ink)" stroke-width=".5" stroke-opacity=".3"/>` });
  $('geo').innerHTML = g;
  $('balls').innerHTML = S.colors.map((c, i) => { const p = pts[i], r = i === 0 ? 17 : 13;
    return `<g class="ball${c.lock ? ' lk' : ''}" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${shown(c)}" stroke="var(--ink)" stroke-width="${S.sel === i ? 2.6 : 1.4}"/>
      ${c.lock ? `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${readable(hexOf(c))}"/>` : ''}
      <text x="${p[0]}" y="${p[1] - r - 6}" text-anchor="middle" font-size="10" fill="var(--soft)" font-family="IBM Plex Sans,sans-serif">${i + 1}</text></g>` }).join('');
  const sc = cur().SC;
  $('wheelcap').textContent = sc.off === null
    ? 'Arraste cada bola livremente: o ângulo é o matiz, a distância do centro é o croma. Nenhuma geometria é imposta.'
    : `${sc.n}. ${sc.d} Arraste qualquer bola e o conjunto gira junto, mantendo as distâncias.`;
}

/* arraste das bolas */
export function initWheel(): void {
  const wv = $('wheel') as unknown as SVGSVGElement; let dragI: number | null = null;
  const polar = (ev: PointerEvent) => { const r = wv.getBoundingClientRect(), sx = (ev.clientX - r.left) / r.width * 400 - 200, sy = (ev.clientY - r.top) / r.height * 400 - 200;
    return { a: (Math.atan2(sy, sx) * 180 / Math.PI + 90 + 360) % 360, r: Math.hypot(sx, sy) } };
  function move(ev: PointerEvent): void {
    if (dragI === null) return;
    const c = S.colors[dragI]; if (c.lock) return;
    const p = polar(ev), C = Math.max(0, Math.min(maxC, (p.r - 14) / 150 * maxC));
    const d = wrapDeg(p.a - c.a);
    if (cur().SC.off !== null) S.colors.forEach(x => { if (!x.lock) x.a = (x.a + d + 360) % 360 });
    else c.a = p.a;
    c.C = C;
    if (dragI === 0) S.baseOver = S.colors[0].a;
    hooks.render();
  }
  wv.addEventListener('pointerdown', e => { const g = (e.target as Element).closest('.ball') as SVGGElement | null; if (!g) return;
    dragI = +g.dataset.i!; S.sel = dragI; try { wv.setPointerCapture(e.pointerId) } catch (_) {}
    showDetail(dragI); move(e) });
  wv.addEventListener('pointermove', move);
  ['pointerup', 'pointercancel'].forEach(t => wv.addEventListener(t, () => { if (dragI !== null) { dragI = null; pushH() } }));
  wv.addEventListener('keydown', e => {
    const i = S.sel === null ? 0 : S.sel, c = S.colors[i]; if (!c) return; const st = e.shiftKey ? 12 : 3;
    if (e.key === 'ArrowRight') { e.preventDefault(); c.a = (c.a + st) % 360; if (i === 0) S.baseOver = c.a; hooks.render() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); c.a = (c.a - st + 360) % 360; if (i === 0) S.baseOver = c.a; hooks.render() }
    if (e.key === 'ArrowUp') { e.preventDefault(); c.C = Math.min(.33, c.C + .015); hooks.render() }
    if (e.key === 'ArrowDown') { e.preventDefault(); c.C = Math.max(0, c.C - .015); hooks.render() }
  });
}
