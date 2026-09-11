/* ── amostra ao vivo com a paleta aplicada, e a amostra em PNG ── */
import { readable } from '../core/color';
import { $, $v, $n, esc, slug, download } from '../core/dom';
import { ROLES, SAMPLE_TXT, type Font } from '../data/fonts';
import { palette } from '../palette/state';
import { T } from './state';
import { fam, isSerif, describe } from './pairing';
import { roleColors, roleCss, roleCfg, parseText, drawRoleBar, drawRoleCtl, drawRoleRows } from './hierarchy';
import { drawTOut } from './export';

export function renderSpec(): void {
  if (!T.fams.length) return;
  const C = roleColors(), base = $n('tBase'), meas = $n('tMeasure');
  $('tBaseV').textContent = base + 'px'; $('tMeasureV').textContent = meas + ' caracteres';
  $('tLhV').textContent = ($n('tLh') / 100).toFixed(2).replace('.', ',');
  $('tTrackV').textContent = ($n('tTrack') / 1000).toFixed(3).replace('.', ',') + 'em';
  drawRoleBar(); drawRoleCtl(); drawRoleRows();
  const blocks = parseText($v('tText') || SAMPLE_TXT);
  $('spec').setAttribute('style', `background:${C.bg};color:${C.fg}`);
  $('spec').innerHTML = blocks.map(b => {
    const s = roleCss(b.r), mw = ['titulo', 'subtitulo'].includes(b.r) ? '20ch' : meas + 'ch';
    if (b.r === 'botao') return `<p style="margin:0 0 16px"><span style="${s.style}background:${C.ac};color:${readable(C.ac)};display:inline-block;padding:.7em 1.3em;border-radius:2px">${esc(b.t)}</span></p>`;
    if (b.r === 'citacao') return `<blockquote style="${s.style}margin:0 0 18px;padding-left:18px;border-left:2px solid ${s.col};max-width:${meas}ch">${esc(b.t)}</blockquote>`;
    if (b.r === 'titulo') return `<h1 style="${s.style}margin:0 0 14px;max-width:${mw}">${esc(b.t)}</h1>`;
    if (b.r === 'subtitulo') return `<h2 style="${s.style}margin:0 0 16px;max-width:${meas}ch">${esc(b.t)}</h2>`;
    if (b.r === 'rotulo') return `<p style="${s.style}margin:0 0 10px">${esc(b.t)}</p>`;
    if (b.r === 'destaque') return `<p style="${s.style}margin:0 0 16px;max-width:${meas}ch">${esc(b.t)}</p>`;
    if (b.r === 'referencia') return `<p style="${s.style}margin:14px 0 0;max-width:${meas}ch">${esc(b.t)}</p>`;
    return `<p style="${s.style}margin:0 0 13px;max-width:${meas}ch">${esc(b.t)}</p>` }).join('');
  const labels: [string, string][] = [['Referência', 'referencia'], ['Parágrafo', 'paragrafo'], ['Destaque', 'destaque'], ['Citação', 'citacao'], ['Subtítulo', 'subtitulo'], ['Título', 'titulo']];
  $('ratioList').innerHTML = labels.map(([lb, k]) => { const s = roleCss(k), c = roleCfg(k);
    return `<div><span>${s.size}px</span><span style="font-family:${fam(c.f)};font-weight:${c.wt};font-size:${Math.min(s.size, 54)}px;line-height:1.1;font-style:${c.it ? 'italic' : 'normal'}">${lb}</span></div>` }).join('');
  drawCards(); drawTOut();
}
export function drawCards(): void {
  const roleOf = (f: Font) => ROLES.filter(r => !T.off[r.k] && roleCfg(r.k).f === f).map(r => r.n).join(', ') || 'sem nível atribuído';
  $('tCards').innerHTML = T.fams.map(f => `<div class="fontcard">
    <div class="big" style="font-family:${fam(f)}">${esc(f.n)}</div>
    <div class="meta">${roleOf(f)}</div>
    <div class="meta">${f.src === 'google' ? 'Google Fonts' : 'Fontshare'} · pesos ${f.wts.replace(/;/g, ', ')}</div>
    <div class="meta">${describe(f)}</div>
    <div class="pills">${f.moods.map(m => `<span class="pill">${m}</span>`).join('')}</div>
  </div>`).join('');
  const d = T.fams[0], b = T.fams[1] || T.fams[0];
  const xd = Math.abs(d.x - b.x), ctd = Math.abs(d.ct - b.ct);
  const met = xd <= .03 ? 'muito próximas' : xd <= .07 ? 'compatíveis' : 'distantes';
  $('tScore').innerHTML = `<b>Por que este conjunto funciona.</b> `
    + (T.fams.length === 1 ? 'Uma família só: toda a hierarquia terá de vir de peso, corpo, largura e caixa. É a saída mais difícil de errar e a que mais depende de disciplina de espaçamento. ' :
      isSerif(d.cls) !== isSerif(b.cls) ? 'Uma serifada contra uma sem serifa: a diferença de estrutura é clara o bastante para que nenhuma pareça erro. ' :
      d.sf && d.sf === b.sf ? 'São parentes da mesma superfamília, desenhadas para conviver — a harmonia é garantida e o contraste vem do peso e do tamanho. ' :
      'Mesma classificação em papéis diferentes: o contraste terá de vir do peso e do corpo, não da forma. ')
    + (T.fams.length === 1 ? '' : `As alturas de x das duas primeiras são ${met} (${(d.x * 100).toFixed(0)} contra ${(b.x * 100).toFixed(0)} da altura de maiúscula), e a diferença de contraste de traço é ${ctd >= .4 ? 'grande, o que separa bem título de texto' : ctd >= .2 ? 'moderada' : 'pequena, então use peso e corpo para separar'}.`)
    + (T.fams.length >= 3 ? ` A terceira entra em rótulo e referência, onde a diferença de forma vira sinal de função.` : '')
    + (T.fams.length >= 4 ? ` A quarta carrega a citação, que é o único lugar onde uma voz diferente não atrapalha a leitura.` : '')
    + (T.fams.length >= 5 ? ` A quinta fica em destaque e botão — cinco vozes é o limite antes de o sistema virar ruído.` : '');
}

interface Line { t?: string; ff?: string; col?: string; lh?: number; r?: string; size?: number; gap?: number }
export function specDraw(): void {
  const C = roleColors(), blocks = parseText($v('tText') || SAMPLE_TXT);
  const W = 1600, PAD = 110, cv = $('cv') as HTMLCanvasElement, ctx = cv.getContext('2d')!;
  const lines: Line[] = []; let y = 0; const wrapAt = W - PAD * 2;
  blocks.forEach(bk => { const st = roleCss(bk.r), c = st.c;
    const ff = `${c.it ? 'italic ' : ''}${c.wt} ${st.size}px "${c.f.n}", ${isSerif(c.f.cls) ? 'Georgia, serif' : 'Helvetica, Arial, sans-serif'}`;
    ctx.font = ff;
    const raw = c.cs === 'upper' ? bk.t.toUpperCase() : c.cs === 'lower' ? bk.t.toLowerCase() : bk.t;
    const maxW = bk.r === 'titulo' ? wrapAt * .84 : wrapAt;
    let line = '';
    const push = (t: string) => { lines.push({ t, ff, col: st.col, lh: st.size * st.lh, r: bk.r, size: st.size }); y += st.size * st.lh };
    raw.split(' ').forEach(wd => { const test = line ? line + ' ' + wd : wd;
      if (ctx.measureText(test).width > maxW && line) { push(line); line = wd } else line = test });
    if (line) push(line);
    lines.push({ gap: st.size * .62 }); y += st.size * .62 });
  const H = Math.ceil(y + PAD * 2 + 60);
  cv.width = W; cv.height = H;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  let cy = PAD;
  lines.forEach(l => { if (l.gap) { cy += l.gap; return }
    ctx.font = l.ff!;
    if (l.r === 'botao') { const wd = ctx.measureText(l.t!).width;
      ctx.fillStyle = C.ac; ctx.fillRect(PAD, cy - l.size! * .85, wd + l.size! * 2.4, l.size! * 1.95);
      ctx.fillStyle = readable(C.ac); ctx.fillText(l.t!, PAD + l.size! * 1.2, cy + l.size! * .38); cy += l.lh! + l.size! * .7; return }
    if (l.r === 'citacao') { ctx.fillStyle = l.col!; ctx.fillRect(PAD, cy - l.size! * .82, 3, l.lh!) }
    ctx.fillStyle = l.col!; ctx.fillText(l.t!, l.r === 'citacao' ? PAD + 26 : PAD, cy + l.size! * .32); cy += l.lh! });
  ctx.fillStyle = C.mut; ctx.font = '24px Helvetica, Arial, sans-serif';
  ctx.fillText(T.fams.map(f => f.n).join('  ·  ') + '   |   ' + palette().join('  '), PAD, H - 46);
}
export function specBlob(): Promise<Blob> { return new Promise(res => { specDraw(); ($('cv') as HTMLCanvasElement).toBlob(b => res(b as Blob), 'image/png') }) }
export function specPng(): void { specBlob().then(b => download('amostra-' + slug(T.fams[0].n) + '.png', b)) }
