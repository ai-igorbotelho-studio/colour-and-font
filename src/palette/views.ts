/* ── a tira: dez modos de visualização ── */
import { hex2rgb, rgb2hex, rgb2cmyk, rgb2hsl, lum, ratio, readable, mixLch, simulate } from '../core/color';
import { nameOf, atAngle } from '../core/goethe';
import { $, $all, esc, copy } from '../core/dom';
import { t, dec, isEn } from '../i18n';
import { colourName } from '../core/names';
import { S, cur, hexOf, shown, proportions, hooks, type ViewKey } from './state';
import { pushH } from './history';
import { openDetail, rampLch, RAMP_STEPS } from './detail';

export interface View { v: ViewKey; n: string; d: string }
const VIEWS_PT: View[] = [
  { v: 'faixas', n: 'Faixas', d: 'Arraste as células para reordenar. O cadeado congela a cor na hora de gerar. Toque numa cor para abrir todos os códigos e a escala de tons.' },
  { v: 'proporcao', n: 'Proporção', d: 'A largura de cada cor é a área que ela deve ocupar segundo o método de estúdio escolhido.' },
  { v: 'cartoes', n: 'Cartões', d: 'Cada cor com hex, rgb, hsl e cmyk visíveis de uma vez — bom para conferir antes de mandar para gráfica.' },
  { v: 'circulos', n: 'Círculos', d: 'O diâmetro acompanha a área. Útil para enxergar a dominância sem a distração da forma retangular.' },
  { v: 'aneis', n: 'Anéis', d: 'Cores encaixadas uma dentro da outra: mostra como cada uma se comporta cercada pela seguinte.' },
  { v: 'escalas', n: 'Escalas de tom', d: 'A rampa completa de cada cor, de 50 a 950. Toque em qualquer degrau para copiar aquele tom.' },
  { v: 'mosaico', n: 'Mosaico', d: 'Blocos de tamanhos diferentes, como uma superfície real seria composta.' },
  { v: 'interface', n: 'Em interface', d: 'A paleta aplicada a uma tela de exemplo, com a razão de contraste do par principal calculada.' },
  { v: 'poster', n: 'Em pôster', d: 'A paleta em composição impressa, com o fundo mais claro e o texto mais escuro da própria paleta.' },
  { v: 'degrade', n: 'Degradê', d: 'As cores derretidas umas nas outras, na ordem da tira. Mostra se a sequência tem buracos ou saltos.' }
];
export const VIEWS: View[] = VIEWS_PT.map(x => ({ v: x.v, n: t(x.n), d: t(x.d) }));

export function initViews(): void {
  $('viewbar').innerHTML = VIEWS.map(x => `<button data-v="${x.v}" aria-pressed="${x.v === 'faixas'}">${x.n}</button>`).join('');
  $all<HTMLButtonElement>($('viewbar'), 'button').forEach(b => b.onclick = () => {
    S.view = b.dataset.v as ViewKey; $all($('viewbar'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); hooks.render() });
}

/* Contexto de uma visualização: só dados — a página Cores o monta a partir de S,
   a Criação monta um por proposta. tools liga os botões de cadeado/ordem das faixas. */
export interface StripCtx { H: string[]; V: string[]; pr: number[]; names: string[]; locks: boolean[]; lch: { L: number; C: number; H: number }[]; schemeName: string; title: string; cvd: string; tools: boolean }
export function ctxFromState(): StripCtx {
  const { E, M, SC } = cur();
  return { H: S.colors.map(hexOf), V: S.colors.map(shown), pr: proportions(), names: S.colors.map(c => colourName(hexOf(c))[isEn() ? 1 : 0] + ' · ' + nameOf(c.a)), locks: S.colors.map(c => c.lock),
    lch: S.colors.map(c => ({ L: c.L, C: c.C, H: atAngle(c.a).H })),
    schemeName: SC.n, title: E.a !== null ? E.n : (M.a !== null ? M.n : 'Paleta'), cvd: S.cvd, tools: true };
}

/** HTML de um modo de visualização, mais a classe do contêiner. */
export function viewHtml(v: ViewKey, x: StripCtx): { className: string; html: string } {
  const { H, V, pr } = x, n = H.length;
  const fg = (i: number) => readable(V[i]);
  const blend = (a: string, b: string, t: number) => { const p = hex2rgb(a), q = hex2rgb(b); return rgb2hex(p[0] * t + q[0] * (1 - t), p[1] * t + q[1] * (1 - t), p[2] * t + q[2] * (1 - t)) };
  const lowc = (i: number) => ratio(blend(fg(i), V[i], .8), V[i]) < 4.5;
  const ramp = (i: number) => rampLch(x.lch[i].L, x.lch[i].C, x.lch[i].H);

  if (v === 'faixas') return { className: 'strip', html: H.map((_h, i) => `<div class="cell${lowc(i) ? ' lowc' : ''}" ${x.tools ? 'draggable="true"' : ''} data-i="${i}" style="background:${V[i]};color:${fg(i)}">
      <div class="top"><span class="rl">${i + 1} · ${Math.round(pr[i])}%</span>
        ${x.tools ? `<span class="tools">
          <button data-act="lock" title="${t('Congelar')}">${x.locks[i] ? '●' : '○'}</button>
          <button data-act="left" title="${t('Mover para trás')}">‹</button>
          <button data-act="right" title="${t('Mover para frente')}">›</button>
          <button data-act="copy" title="${t('Copiar')}">⧉</button>
          <button data-act="info" title="${t('Abrir códigos')}">⋯</button>
        </span>` : `<span class="tools"><button data-act="copy" title="${t('Copiar')}">⧉</button></span>`}</div>
      <div class="hexbig">${H[i]}</div>
      <div class="nmx">${x.names[i]}</div>
      <div class="rgbx">rgb ${hex2rgb(H[i]).join(' · ')}</div>
    </div>`).join('') };
  if (v === 'proporcao') return { className: 'vwrap v-prop', html: H.map((_c, i) => `<button class="pick" data-i="${i}" style="flex:${pr[i].toFixed(2)};background:${V[i]};color:${fg(i)}">
      <span style="font-family:'DM Serif Display',serif;font-size:18px">${H[i]}</span>
      <span style="font-size:11px;opacity:.8">${Math.round(pr[i])}% · rgb ${hex2rgb(H[i]).join(' ')}</span></button>`).join('') };
  if (v === 'cartoes') return { className: 'vwrap v-cards', html: H.map((_c, i) => { const [r, g, b] = hex2rgb(H[i]), cm = rgb2cmyk(r, g, b), hs = rgb2hsl(r, g, b);
      return `<button class="pick" data-i="${i}"><span class="sw" style="background:${V[i]}"></span>
      <span class="meta"><b>${H[i]}</b>${x.names[i]}<br>rgb ${r} ${g} ${b}<br>hsl ${hs.map(y => Math.round(y)).join(' ')}<br>cmyk ${cm.map(y => Math.round(y)).join(' ')}<br>${Math.round(pr[i])}${t('% da área')}</span></button>` }).join('') };
  if (v === 'circulos') { const mx = Math.max(...pr);
    return { className: 'vwrap v-circles', html: H.map((_c, i) => { const d = Math.round(70 + Math.sqrt(pr[i] / mx) * 130);
      return `<button class="pick" data-i="${i}" style="width:${d}px;height:${d}px;background:${V[i]};color:${fg(i)}">${d > 96 ? H[i] : ''}</button>` }).join('') } }
  if (v === 'aneis') { const R = 170;
    return { className: 'vwrap v-rings', html: `<svg viewBox="0 0 380 380" style="width:100%;max-width:380px;height:auto">`
      + H.map((_c, i) => { const r = R - (i * (R - 26) / n);
        return `<circle class="pick" data-i="${i}" cx="190" cy="190" r="${r}" fill="${V[i]}" style="cursor:pointer"/>` }).join('')
      + H.map((_c, i) => { const r = R - (i * (R - 26) / n) - ((R - 26) / n) / 2;
        return `<text x="190" y="${(190 - r + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-family="Mulish,sans-serif" fill="${fg(i)}" style="pointer-events:none">${H[i]}</text>` }).join('')
      + `</svg><div class="ringlegend">` + H.map((_c, i) => `<button class="pick" data-i="${i}"><i style="background:${V[i]}"></i>${H[i]} <span>${Math.round(pr[i])}%</span></button>`).join('') + `</div>` } }
  if (v === 'escalas') return { className: 'vwrap v-ramps', html: H.map((_c, i) => { let row = `<div class="row"><span class="lab">${H[i]}</span>`;
      ramp(i).forEach((y, k) => { row += `<button class="pick" data-i="${i}" data-h="${y}" style="background:${simulate(y, x.cvd)};color:${readable(y)}">${RAMP_STEPS[k]}</button>` });
      return row + '</div>' }).join('') };
  if (v === 'mosaico') return { className: 'vwrap v-mosaic', html: H.map((_c, i) => { const big = pr[i] >= Math.max(...pr) * .7;
      return `<button class="pick" data-i="${i}" style="flex:${Math.max(6, pr[i]).toFixed(2)} 1 ${big ? '55%' : '26%'};background:${V[i]};color:${fg(i)}">${H[i]} · ${Math.round(pr[i])}%</button>` }).join('') };
  if (v === 'interface') {
    const ls = H.map(lum), bg = H[ls.indexOf(Math.max(...ls))], ink = H[ls.indexOf(Math.min(...ls))];
    const ac = H.find(y => y !== bg && y !== ink && ratio(y, bg) >= 3) || ink;
    const soft = mixLch(bg, ink, .12);
    return { className: 'vwrap', html: `<div class="v-ui" style="background:${bg};color:${ink}">
      <div class="side" style="background:${soft}">
        ${['Painel', 'Coleções', 'Histórico', 'Ajustes'].map((it, k) =>
          `<span class="it" style="${k === 0 ? `background:${ac};color:${readable(ac)}` : ''}">${t(it)}</span>`).join('')}
      </div>
      <div class="main">
        <div class="hero" style="background:${ink};color:${readable(ink)}"><h4>${t('Um título dentro de uma interface')}</h4>
          <span style="font-size:13px;opacity:.85">${t('O contraste aqui é {r} para 1.', { r: dec(ratio(ink, readable(ink)), 1) })}</span></div>
        <div class="tiles">${H.map((y, i) => `<button class="pick tile" data-i="${i}" style="background:${V[i]};color:${fg(i)}">
          <span>${x.names[i]}</span><span style="font-size:14px">${y}</span></button>`).join('')}</div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          <span style="background:${ac};color:${readable(ac)};padding:9px 16px;border-radius:2px;font-size:13px">${t('Ação principal')}</span>
          <span style="border:1px solid ${ink};padding:9px 16px;border-radius:2px;font-size:13px">${t('Secundária')}</span>
        </div>
      </div></div>` };
  }
  if (v === 'poster') {
    const ls = H.map(lum), bg = H[ls.indexOf(Math.max(...ls))], ink = H[ls.indexOf(Math.min(...ls))];
    return { className: 'vwrap v-poster', html: `<div class="inner" style="background:${bg};color:${ink}">
      <div style="font-size:12px;opacity:.7">${esc(x.schemeName)}</div>
      <div class="big">${esc(x.title)}</div>
      <div class="marks">${H.map((y, i) => `<button class="pick" data-i="${i}" style="background:${V[i]}" title="${y}"></button>`).join('')}</div>
      <div style="font-size:12px;opacity:.75;display:flex;gap:14px;flex-wrap:wrap">${H.map(y => `<span>${y}</span>`).join('')}</div>
    </div>` };
  }
  /* degradê */
  const stops = H.map((_y, i) => `${V[i]} ${Math.round(i / (n - 1 || 1) * 100)}%`);
  return { className: 'vwrap', html: `<div class="v-blend" style="background:linear-gradient(90deg,${stops.join(',')})">
      ${H.map((y, i) => `<button class="pick hit" data-i="${i}" title="${y}" style="left:${i / (n || 1) * 100}%;width:${100 / (n || 1)}%;background:transparent"></button>`).join('')}
    </div>` };
}

export function drawStrip(): void {
  const pr = proportions(), v = S.view;
  const wrap = $('strip');
  const V = S.colors.map(shown);
  const fg = (i: number) => readable(V[i]);
  const out = viewHtml(v, ctxFromState());
  wrap.className = out.className; const html = out.html;
  wrap.innerHTML = html;

  $all<HTMLElement>(wrap, '.pick').forEach(el => {
    el.onclick = () => { if (el.dataset.h) return copy(el.dataset.h, el.dataset.h + ' copiado'); openDetail(+el.dataset.i!) } });
  $all<HTMLElement>(wrap, '.cell').forEach(el => {
    const i = +el.dataset.i!;
    el.onclick = ev => { if ((ev.target as Element).closest('button')) return; openDetail(i) };
    $all<HTMLButtonElement>(el, 'button').forEach(b => b.onclick = ev => { ev.stopPropagation();
      const a = b.dataset.act;
      if (a === 'lock') S.colors[i].lock = !S.colors[i].lock;
      if (a === 'copy') return copy(hexOf(S.colors[i]), hexOf(S.colors[i]) + ' copiado');
      if (a === 'info') return openDetail(i);
      if (a === 'left' && i > 0) { const t = S.colors[i - 1]; S.colors[i - 1] = S.colors[i]; S.colors[i] = t }
      if (a === 'right' && i < S.colors.length - 1) { const t = S.colors[i + 1]; S.colors[i + 1] = S.colors[i]; S.colors[i] = t }
      hooks.render(); pushH() });
    el.ondragstart = ev => { ev.dataTransfer!.setData('text/plain', String(i)); el.classList.add('drag') };
    el.ondragend = () => el.classList.remove('drag');
    el.ondragover = ev => ev.preventDefault();
    el.ondrop = ev => { ev.preventDefault(); const from = +ev.dataTransfer!.getData('text/plain');
      if (isNaN(from) || from === i) return; const it = S.colors.splice(from, 1)[0]; S.colors.splice(i, 0, it); hooks.render(); pushH() };
  });

  $('viewhint').textContent = VIEWS.find(x => x.v === S.view)!.d;
  $('prop').innerHTML = S.colors.map((_c, i) =>
    `<div style="flex:${pr[i].toFixed(2)};background:${V[i]};color:${fg(i)}">${pr[i] >= 9 ? Math.round(pr[i]) + '%' : ''}</div>`).join('');
  const { L, U } = cur(), top = pr.indexOf(Math.max(...pr));
  $('propnote').textContent = t('Área segundo o método de {l}', { l: L.n.split(' — ')[0] })
    + (U.Cm !== 1 || U.sy !== .5 ? t(', reescrita pela dinâmica de {u}', { u: U.n.toLowerCase() }) : '')
    + t('. A cor {n} domina com {p}% — é a ordem, mais que os números, que decide se o conjunto é lido como contido ou como declarado.', { n: top + 1, p: Math.round(pr[top]) });
}
