/* ── banners 1200×630 por eixo, gerados da edição ── */
import { lum, ratio } from '../core/color';
import { AXES, type Edition, type AxisKey } from '../data/trends';

export function bannerSvg(e: Edition, axk: AxisKey): string {
  const ax = AXES.find(a => a.k === axk)!, a = e[axk];
  const hs = (e.cor.pal || []).map(p => p.hex), ls = hs.map(lum);
  const bg = hs[ls.indexOf(Math.max(...ls))] || '#F2F1EE', ink = hs[ls.indexOf(Math.min(...ls))] || '#111';
  const ac = hs.find(h => h !== bg && h !== ink && ratio(h, bg) >= 3) || ink;
  const W = 1200, H = 630, esc2 = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const wrapT = (t: string, max: number) => { const w = t.split(' '), out: string[] = []; let l = '';
    w.forEach(x => { if ((l + ' ' + x).trim().length > max) { out.push(l); l = x } else l = (l ? l + ' ' : '') + x }); if (l) out.push(l); return out };
  const lines = wrapT(a.tese, 26).slice(0, 4);
  const bars = hs.map((h, i) => `<rect x="${72 + i * ((W - 144) / hs.length)}" y="${H - 118}" width="${((W - 144) / hs.length) - 8}" height="46" fill="${h}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="72" y="66" width="54" height="6" fill="${ac}"/>
  <text x="72" y="112" font-family="Helvetica,Arial,sans-serif" font-size="21" fill="${ink}" opacity=".7">${esc2(e.id)} · ${esc2(ax.n)}</text>
  ${lines.map((l, i) => `<text x="72" y="${208 + i * 74}" font-family="Georgia,serif" font-size="64" fill="${ink}">${esc2(l)}</text>`).join('')}
  ${bars}
  <text x="72" y="${H - 40}" font-family="Helvetica,Arial,sans-serif" font-size="19" fill="${ink}" opacity=".65">${esc2(a.fontes.map(f => f.n.split(',')[0]).join(' · ').slice(0, 88))}</text>
  <text x="${W - 72}" y="112" text-anchor="end" font-family="Helvetica,Arial,sans-serif" font-size="19" fill="${ink}" opacity=".55">Farbenkreis</text>
</svg>`;
}
