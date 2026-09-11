/* ── a tira: dez modos de visualização ── */
import { hex2rgb, rgb2hex, rgb2cmyk, rgb2hsl, lum, ratio, readable, mixLch, simulate } from '../core/color';
import { nameOf } from '../core/goethe';
import { $, $all, esc, copy } from '../core/dom';
import { S, cur, hexOf, shown, proportions, hooks, type ViewKey } from './state';
import { pushH } from './history';
import { openDetail, rampOf, RAMP_STEPS } from './detail';

export interface View { v: ViewKey; n: string; d: string }
export const VIEWS: View[] = [
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

export function initViews(): void {
  $('viewbar').innerHTML = VIEWS.map(x => `<button data-v="${x.v}" aria-pressed="${x.v === 'faixas'}">${x.n}</button>`).join('');
  $all<HTMLButtonElement>($('viewbar'), 'button').forEach(b => b.onclick = () => {
    S.view = b.dataset.v as ViewKey; $all($('viewbar'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); hooks.render() });
}

export function drawStrip(): void {
  const pr = proportions(), v = S.view;
  const wrap = $('strip'); wrap.className = 'vwrap';
  const H = S.colors.map(hexOf), V = S.colors.map(shown);
  const fg = (i: number) => readable(V[i]);
  let html = '';

  if (v === 'faixas') {
    wrap.className = 'strip';
    // rótulos pequenos ganham um véu quando, já com a opacidade do rótulo (.8), o preto ou o
    // branco não chega a 4,5:1 sobre a cor mostrada
    const blend = (a: string, b: string, t: number) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x[0] * t + y[0] * (1 - t), x[1] * t + y[1] * (1 - t), x[2] * t + y[2] * (1 - t)) };
    const lowc = (i: number) => ratio(blend(fg(i), V[i], .8), V[i]) < 4.5;
    html = S.colors.map((c, i) => `<div class="cell${lowc(i) ? ' lowc' : ''}" draggable="true" data-i="${i}" style="background:${V[i]};color:${fg(i)}">
      <div class="top"><span class="rl">${i + 1} · ${Math.round(pr[i])}%</span>
        <span class="tools">
          <button data-act="lock" title="Congelar">${c.lock ? '●' : '○'}</button>
          <button data-act="left" title="Mover para trás">‹</button>
          <button data-act="right" title="Mover para frente">›</button>
          <button data-act="copy" title="Copiar">⧉</button>
          <button data-act="info" title="Abrir códigos">⋯</button>
        </span></div>
      <div class="hexbig">${H[i]}</div>
      <div class="nmx">${nameOf(c.a)}</div>
      <div class="rgbx">rgb ${hex2rgb(H[i]).join(' · ')}</div>
    </div>`).join('');
  }
  else if (v === 'proporcao') {
    wrap.className = 'vwrap v-prop';
    html = S.colors.map((_c, i) => `<button class="pick" data-i="${i}" style="flex:${pr[i].toFixed(2)};background:${V[i]};color:${fg(i)}">
      <span style="font-family:'Bodoni Moda',serif;font-size:18px">${H[i]}</span>
      <span style="font-size:11px;opacity:.8">${Math.round(pr[i])}% · rgb ${hex2rgb(H[i]).join(' ')}</span></button>`).join('');
  }
  else if (v === 'cartoes') {
    wrap.className = 'vwrap v-cards';
    html = S.colors.map((c, i) => { const [r, g, b] = hex2rgb(H[i]), cm = rgb2cmyk(r, g, b), hs = rgb2hsl(r, g, b);
      return `<button class="pick" data-i="${i}"><span class="sw" style="background:${V[i]}"></span>
      <span class="meta"><b>${H[i]}</b>${nameOf(c.a)}<br>rgb ${r} ${g} ${b}<br>hsl ${hs.map(x => Math.round(x)).join(' ')}<br>cmyk ${cm.map(x => Math.round(x)).join(' ')}<br>${Math.round(pr[i])}% da área</span></button>` }).join('');
  }
  else if (v === 'circulos') {
    wrap.className = 'vwrap v-circles';
    const mx = Math.max(...pr);
    html = S.colors.map((_c, i) => { const d = Math.round(70 + Math.sqrt(pr[i] / mx) * 130);
      return `<button class="pick" data-i="${i}" style="width:${d}px;height:${d}px;background:${V[i]};color:${fg(i)}">${d > 96 ? H[i] : ''}</button>` }).join('');
  }
  else if (v === 'aneis') {
    wrap.className = 'vwrap v-rings';
    const n = S.colors.length, R = 170;
    html = `<svg viewBox="0 0 380 380" style="width:100%;max-width:380px;height:auto">`
      + S.colors.map((_c, i) => { const r = R - (i * (R - 26) / n);
        return `<circle class="pick" data-i="${i}" cx="190" cy="190" r="${r}" fill="${V[i]}" style="cursor:pointer"/>` }).join('')
      + S.colors.map((_c, i) => { const r = R - (i * (R - 26) / n) - ((R - 26) / n) / 2;
        return `<text x="190" y="${190 - r + 18}" text-anchor="middle" font-size="12" font-family="IBM Plex Sans,sans-serif" fill="${fg(i)}" style="pointer-events:none">${H[i]}</text>` }).join('')
      + `</svg>`;
  }
  else if (v === 'escalas') {
    wrap.className = 'vwrap v-ramps';
    html = S.colors.map((c, i) => { let row = `<div class="row"><span class="lab">${H[i]}</span>`;
      rampOf(c).forEach((x, k) => { row += `<button class="pick" data-i="${i}" data-h="${x}" style="background:${simulate(x, S.cvd)};color:${readable(x)}">${RAMP_STEPS[k]}</button>` });
      return row + '</div>' }).join('');
  }
  else if (v === 'mosaico') {
    wrap.className = 'vwrap v-mosaic';
    html = S.colors.map((_c, i) => { const big = pr[i] >= Math.max(...pr) * .7;
      return `<button class="pick" data-i="${i}" style="flex:${Math.max(6, pr[i]).toFixed(2)} 1 ${big ? '55%' : '26%'};background:${V[i]};color:${fg(i)}">${H[i]} · ${Math.round(pr[i])}%</button>` }).join('');
  }
  else if (v === 'interface') {
    wrap.className = 'vwrap';
    const ls = H.map(lum), bg = H[ls.indexOf(Math.max(...ls))], ink = H[ls.indexOf(Math.min(...ls))];
    const ac = H.find(x => x !== bg && x !== ink && ratio(x, bg) >= 3) || ink;
    const soft = mixLch(bg, ink, .12);
    html = `<div class="v-ui" style="background:${bg};color:${ink}">
      <div class="side" style="background:${soft}">
        ${['Painel', 'Coleções', 'Histórico', 'Ajustes'].map((t, k) =>
          `<span class="it" style="${k === 0 ? `background:${ac};color:${readable(ac)}` : ''}">${t}</span>`).join('')}
      </div>
      <div class="main">
        <div class="hero" style="background:${ink};color:${readable(ink)}"><h4>Um título dentro de uma interface</h4>
          <span style="font-size:13px;opacity:.85">O contraste aqui é ${ratio(ink, readable(ink)).toFixed(1)} para 1.</span></div>
        <div class="tiles">${H.map((x, i) => `<button class="pick tile" data-i="${i}" style="background:${V[i]};color:${fg(i)}">
          <span>${nameOf(S.colors[i].a)}</span><span style="font-size:14px">${x}</span></button>`).join('')}</div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          <span style="background:${ac};color:${readable(ac)};padding:9px 16px;border-radius:2px;font-size:13px">Ação principal</span>
          <span style="border:1px solid ${ink};padding:9px 16px;border-radius:2px;font-size:13px">Secundária</span>
        </div>
      </div></div>`;
  }
  else if (v === 'poster') {
    wrap.className = 'vwrap v-poster';
    const ls = H.map(lum), bg = H[ls.indexOf(Math.max(...ls))], ink = H[ls.indexOf(Math.min(...ls))];
    const { E, M } = cur();
    html = `<div class="inner" style="background:${bg};color:${ink}">
      <div style="font-size:12px;opacity:.7">${esc(cur().SC.n)}</div>
      <div class="big">${esc(E.a !== null ? E.n : (M.a !== null ? M.n : 'Paleta'))}</div>
      <div class="marks">${H.map((x, i) => `<button class="pick" data-i="${i}" style="background:${V[i]}" title="${x}"></button>`).join('')}</div>
      <div style="font-size:12px;opacity:.75;display:flex;gap:14px;flex-wrap:wrap">${H.map(x => `<span>${x}</span>`).join('')}</div>
    </div>`;
  }
  else { /* degradê */
    wrap.className = 'vwrap';
    const stops = H.map((_x, i) => `${V[i]} ${Math.round(i / (H.length - 1 || 1) * 100)}%`);
    html = `<div class="v-blend" style="background:linear-gradient(90deg,${stops.join(',')})">
      ${H.map((x, i) => `<button class="pick hit" data-i="${i}" title="${x}" style="left:${i / (H.length || 1) * 100}%;width:${100 / (H.length || 1)}%;background:transparent"></button>`).join('')}
    </div>`;
  }
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
  $('propnote').textContent = `Área segundo o método de ${L.n.split(' — ')[0]}`
    + (U.Cm !== 1 || U.sy !== .5 ? `, reescrita pela dinâmica de ${U.n.toLowerCase()}` : '')
    + `. A cor ${top + 1} domina com ${Math.round(pr[top])}% — é a ordem, mais que os números, que decide se o conjunto é lido como contido ou como declarado.`;
}
