/* ── grade de legibilidade WCAG com correção assistida ──
   O contraste é sempre calculado sobre as cores reais, nunca sobre as simuladas. */
import { hex2lch, oklch2hex, ratio } from '../core/color';
import { $, $all, copy, toast } from '../core/dom';
import { t, dec } from '../i18n';
import { S, palette, hooks } from './state';
import { pushH } from './history';

export const LVL = (r: number): string => r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? t('AA grande') : t('baixo');

/** Menor deslocamento de luminosidade (matiz e croma fixos) que leva o par à exigência. */
export function fixFor(txt: string, bg: string, target: number): { h: string; L: number; d: number } | null {
  const t = hex2lch(txt), cands: { h: string; L: number; d: number }[] = [];
  [1, -1].forEach(dir => {
    for (let k = 1; k <= 110; k++) { const L = t.L + dir * k * .01;
      if (L < 0 || L > 1) break;
      const h = oklch2hex(L, t.C, t.H);
      if (ratio(h, bg) >= target) { cands.push({ h, L, d: Math.abs(L - t.L) }); break } } });
  if (!cands.length) return null;
  cands.sort((a, b) => a.d - b.d); return cands[0];
}

export function drawContrast(): void {
  const hs = palette(), n = hs.length, T = S.ctTarget;
  $('ctLegend').innerHTML = `${t('Exigência atual:')} <b style="color:var(--ink)">${t('{t} para 1', { t: dec(T, 1) })}</b>. `
    + t(T === 4.5 ? 'É o mínimo do WCAG 2.1 para texto de leitura, do tamanho de um parágrafo. Serve como régua padrão.'
     : T === 3 ? 'Basta para título grande, texto em negrito acima de 18 pontos, ícones, bordas de campo e outros elementos de interface.'
     : 'O nível mais alto do WCAG, pensado para quem tem baixa visão ou lê em condições ruins de luz. Exigir isso encolhe muito a paleta utilizável.')
    + ` <span style="opacity:.85">${t('Cada célula mostra o nível que o par alcança — AAA a partir de 7, AA a partir de 4,5, AA grande a partir de 3, e baixo abaixo disso. As que não chegam à exigência aparecem riscadas e com contorno.')}</span>`;
  const head = `<tr><th class="rh">${t('fundo ↓ &nbsp; texto →').replace('↓', '&#8595;').replace('→', '&#8594;')}</th>`
    + hs.map((_h, j) => `<th>${j + 1}</th>`).join('') + '</tr>';
  const body = hs.map((bg, i) => `<tr><th class="rh">${i + 1} · ${bg}</th>`
    + hs.map((tx, j) => {
      if (i === j) return `<td><button class="diag" disabled>—</button></td>`;
      const r = ratio(tx, bg), ok = r >= T;
      return `<td><button data-i="${i}" data-j="${j}" class="${ok ? '' : 'fail'}${S.ctPair && S.ctPair[0] === i && S.ctPair[1] === j ? ' sel' : ''}" style="background:${bg};color:${tx}">
        <span class="num">${dec(r, 1)}</span><span class="lvl">${LVL(r)}</span></button></td>` }).join('')
    + '</tr>').join('');
  $('ctGrid').innerHTML = head + body;
  $all<HTMLButtonElement>($('ctGrid'), 'button[data-i]').forEach(b => b.onclick = () => {
    S.ctPair = [+b.dataset.i!, +b.dataset.j!]; drawContrast() });

  // par escolhido, em tamanho real
  if (S.ctPair && S.ctPair[0] < n && S.ctPair[1] < n) {
    const [i, j] = S.ctPair, bg = hs[i], tx = hs[j], r = ratio(tx, bg), ok = r >= T;
    const fx = ok ? null : fixFor(tx, bg, T);
    $('ctPair').innerHTML = `<div class="ctpair">
      <div class="demo" style="background:${bg};color:${tx}">
        <p class="t">${t('Um título nesta combinação')}</p>
        <p class="p">${t('E um parágrafo do tamanho que você realmente vai usar, com linhas suficientes para perceber se o olho cansa antes do fim. É aqui que se descobre se a razão de contraste era só um número.')}</p>
        <p class="s">${t('Cor {j} {tx} sobre cor {i} {bg} · {r} para 1 · {l}', { j: j + 1, tx, i: i + 1, bg, r: dec(r, 2), l: LVL(r) })}</p>
      </div>
      <div class="foot">${ok
        ? t('Este par passa na exigência atual. Pode usar como texto sobre fundo.')
        : t('Este par fica abaixo de {t}.', { t: dec(T, 1) }) + ' ' + (fx
            ? t('Mantendo o mesmo matiz e croma e mexendo só na luminosidade, a cor {j} chegaria lá em', { j: j + 1 }) + ` <b style="color:var(--ink)">${fx.h}</b>.`
            : t('Não existe luminosidade que resolva sem mudar o matiz — troque uma das duas cores.'))}
        <div class="btnrow" style="margin-top:10px">
          ${!ok && fx ? `<button class="mini" id="ctApply">${t('Corrigir a cor {j} para {h}', { j: j + 1, h: fx.h })}</button>` : ''}
          <button class="mini" id="ctSwap">${t('Inverter fundo e texto')}</button>
          <button class="mini" id="ctCopy">${t('Copiar o par')}</button>
          <button class="mini" id="ctClear">${t('Fechar')}</button>
        </div>
      </div></div>`;
    if (!ok && fx) $('ctApply').onclick = () => { S.colors[j].L = fx.L; hooks.render(); pushH(); toast(t('Cor {j} ajustada para {h}', { j: j + 1, h: fx.h })) };
    $('ctSwap').onclick = () => { S.ctPair = [j, i]; drawContrast() };
    $('ctCopy').onclick = () => copy(t('fundo {bg} · texto {tx} · {r}:1 · {l}', { bg, tx, r: r.toFixed(2), l: LVL(r) }), t('Par copiado'));
    $('ctClear').onclick = () => { S.ctPair = null; drawContrast() };
  } else $('ctPair').innerHTML = '';

  // melhores pares
  const pairs: { i: number; j: number; bg: string; tx: string; r: number }[] = [];
  hs.forEach((bg, i) => hs.forEach((tx, j) => { if (i !== j) { const r = ratio(tx, bg); if (r >= T) pairs.push({ i, j, bg, tx, r }) } }));
  pairs.sort((a, b) => b.r - a.r);
  const seen = new Set<string>(), best: typeof pairs = [];
  pairs.forEach(x => { const k = [x.i, x.j].sort().join('-'); if (seen.has(k)) return; seen.add(k); if (best.length < 6) best.push(x) });
  if (!best.length) {
    $('ctBest').innerHTML = ''; $('ctNone').style.display = 'block';
    $('ctNone').textContent = t('Nenhum par desta paleta alcança {t} para 1.', { t: dec(T, 1) }) + ' '
      + t('Isso não invalida a paleta: quer dizer que ela é de superfície, não de texto — e que o texto vai precisar de um preto ou um branco vindo de fora dela.');
  } else {
    $('ctNone').style.display = 'none';
    $('ctBest').innerHTML = best.map(x => `<button class="b" data-i="${x.i}" data-j="${x.j}" style="background:${x.bg};color:${x.tx}">
      <span class="l">${t('Texto da cor {j} sobre a cor {i}', { j: x.j + 1, i: x.i + 1 })}</span>
      <span class="m">${t('{tx} sobre {bg} · {r} para 1 · {l}', { tx: x.tx, bg: x.bg, r: dec(x.r, 2), l: LVL(x.r) })}</span></button>`).join('');
    $all<HTMLButtonElement>($('ctBest'), 'button').forEach(b => b.onclick = () => {
      S.ctPair = [+b.dataset.i!, +b.dataset.j!]; drawContrast();
      try { $('ctPair').scrollIntoView({ behavior: 'smooth', block: 'center' }) } catch (_) {} });
  }
}
export function initContrast(): void {
  $all<HTMLButtonElement>($('ctMode'), 'button').forEach(b => b.onclick = () => {
    S.ctTarget = +b.dataset.t!;
    $all($('ctMode'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    drawContrast() });
}
