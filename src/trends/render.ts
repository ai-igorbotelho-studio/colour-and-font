/* ═══════════ TENDÊNCIAS — edições trimestrais ═══════════ */
import { readable } from '../core/color';
import { colorsFromHex } from '../core/goethe';
import { $, $all, esc, slug, copy, download, toast } from '../core/dom';
import { t, locale } from '../i18n';
import { createStore } from '../core/state';
import { FONTS } from '../data/fonts';
import { TREND, AXES, type Edition, type AxisKey } from '../data/trends';
import { S, syncControls } from '../palette/state';
import { render, pushH } from '../palette/index';
import { setFamilies } from '../type/index';
import { goto } from '../nav';
import { bannerSvg } from './banner';

export const trendStore = createStore({ i: 0 });
const TD = trendStore.state;

export function drawTrend(): void {
  const e = TREND[TD.i];
  $('edTabs').innerHTML = TREND.map((x, i) => `<button data-i="${i}" aria-pressed="${i === TD.i}">${esc(x.id)}${i === 0 ? t(' · atual') : ''}</button>`).join('');
  $all<HTMLButtonElement>($('edTabs'), 'button').forEach(b => b.onclick = () => { TD.i = +b.dataset.i!; drawTrend();
    try { $('edHead').scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) {} });
  $('edHead').innerHTML = `<h2 style="margin-top:20px">${esc(e.id)}</h2>
    <p class="sm" style="margin:0 0 10px">${esc(e.per)}${t(TD.i === 0 ? ' · edição em vigor' : ' · arquivada')}</p>
    <p class="lede">${esc(e.tese)}</p>`;
  $('edAxes').innerHTML = AXES.map(ax => { const a = e[ax.k]; if (!a) return '';
    return `<div class="card" style="margin-top:16px">
      <div class="sm" style="margin-bottom:4px">${ax.n}</div>
      <h3 style="margin-bottom:10px">${esc(a.tese)}</h3>
      ${a.pal ? `<div class="trendpal">${a.pal.map(p => `<button data-h="${p.hex}" style="background:${p.hex};color:${readable(p.hex)}">
          <span>${esc(p.n)}</span><span class="hx">${p.hex}</span></button>`).join('')}</div>
        <p class="sm" style="margin-top:8px">${a.pal.map(p => esc(p.n) + ' — ' + esc(p.obs)).join(' · ')}</p>` : ''}
      ${a.fam ? `<div class="pills" style="margin:6px 0 12px">${a.fam.map(f => `<span class="pill">${esc(f)}</span>`).join('')}</div>` : ''}
      ${a.corpo.map(t => `<p class="lede" style="margin-top:10px">${esc(t)}</p>`).join('')}
      <p class="sm" style="margin-top:12px">${t('Fontes: ')}${a.fontes.map(f => `<a href="${f.u}" target="_blank" rel="noopener">${esc(f.n)}</a>`).join(' · ')}</p>
      ${ax.k === 'cor' && a.pal ? `<div class="btnrow"><button class="mini" data-open="cor">${t('Abrir esta paleta em Cores')}</button></div>` : ''}
      ${ax.k === 'tipo' && a.fam ? `<div class="btnrow"><button class="mini" data-open="tipo">${t('Abrir estas famílias em Tipografia')}</button></div>` : ''}
    </div>` }).join('');
  $all<HTMLButtonElement>($('edAxes'), '[data-h]').forEach(b => b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' ' + t('Copiado').toLowerCase()));
  const co = $('edAxes').querySelector<HTMLButtonElement>('[data-open="cor"]');
  if (co) co.onclick = () => { const hs = e.cor.pal!.map(p => p.hex);
    S.colors = colorsFromHex(hs); S.n = hs.length; S.scheme = 0; S.baseOver = S.colors[0].a;
    syncControls(); render(); pushH(); goto('cores');
    toast(t('Paleta da edição carregada, em esquema livre')) };
  const to = $('edAxes').querySelector<HTMLButtonElement>('[data-open="tipo"]');
  if (to) to.onclick = () => { const fs = e.tipo.fam!.map(n => FONTS.find(f => f.n === n)).filter((f): f is NonNullable<typeof f> => !!f);
    if (!fs.length) return toast(t('Estas famílias não estão no banco do instrumento'));
    setFamilies(fs, t('{f} — famílias citadas na edição {e}.', { f: fs.slice(0, 5).map(f => f.n).join(' + '), e: e.id }));
    goto('tipo'); toast(t('Famílias da edição carregadas')) };
  drawBanners(); drawArquivo();
  trendStore.notify();
}

function drawBanners(): void {
  const e = TREND[TD.i];
  $('banners').innerHTML = AXES.map(ax => `<div class="card">
    <div class="bnr">${bannerSvg(e, ax.k)}</div>
    <div class="btnrow" style="margin-top:12px">
      <button class="mini" data-b="${ax.k}" data-f="svg">${t('Baixar SVG')}</button>
      <button class="mini" data-b="${ax.k}" data-f="png">${t('Baixar PNG')}</button>
      <button class="mini" data-b="${ax.k}" data-f="copy">${t('Copiar o código SVG')}</button>
    </div></div>`).join('');
  $all<HTMLButtonElement>($('banners'), '[data-b]').forEach(b => b.onclick = () => {
    const svg = bannerSvg(e, b.dataset.b as AxisKey), nm = t('tendencias') + '-' + slug(e.id) + '-' + b.dataset.b;
    if (b.dataset.f === 'svg') return download(nm + '.svg', svg, 'image/svg+xml');
    if (b.dataset.f === 'copy') return copy(svg, t('SVG copiado'));
    const cv = $('cv') as HTMLCanvasElement, ctx = cv.getContext('2d')!; cv.width = 1200; cv.height = 630;
    const img = new Image();
    img.onload = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 1200, 630); ctx.drawImage(img, 0, 0);
      cv.toBlob(bl => { if (bl) download(nm + '.png', bl) }, 'image/png') };
    img.onerror = () => toast(t('Não foi possível rasterizar aqui — baixe o SVG'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) });
}
function drawArquivo(): void {
  $('edArquivo').innerHTML = TREND.map((x, i) => `<button class="mini" data-i="${i}" style="margin:0 8px 8px 0">${esc(x.id)} — ${esc(x.per)}</button>`).join('')
   + `<p class="sm" style="margin-top:10px">${t('{n} edições no arquivo. A mais antiga é {e}.', { n: TREND.length, e: esc(TREND[TREND.length - 1].id) })}</p>`;
  $all<HTMLButtonElement>($('edArquivo'), 'button').forEach(b => b.onclick = () => { TD.i = +b.dataset.i!; drawTrend();
    try { $('edHead').scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) {} });
}
export function trendMd(e: Edition): string {
  let s = t('# Tendências — {e}', { e: e.id }) + `\n\n_${e.per}_\n\n${e.tese}\n`;
  AXES.forEach(ax => { const a = e[ax.k]; if (!a) return;
    s += `\n## ${ax.n} — ${a.tese}\n\n`;
    if (a.pal) { s += t('| Cor | HEX aproximado | Observação |') + `\n|---|---|---|\n`
      + a.pal.map(p => `| ${p.n} | \`${p.hex}\` | ${p.obs} |\n`).join('') + '\n' }
    if (a.fam) s += t('Famílias citadas: {f}', { f: a.fam.join(', ') }) + `\n\n`;
    s += a.corpo.map(t => t + '\n').join('\n');
    s += `\n` + t('Fontes:') + `\n` + a.fontes.map(f => `- [${f.n}](${f.u})\n`).join('') });
  s += `\n---\n\n` + t('Os valores em hex são aproximações em sRGB feitas a partir da descrição e da imagem divulgadas, não os códigos oficiais. Compilado em {d}.', { d: new Date().toLocaleString(locale()) }) + `\n`;
  return s;
}
export function initTrends(): void {
  $('edSchema').onclick = () => { const el = $('edSchemaOut');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
    el.textContent = `{\n  id: '2026 · T4',              ${t('// rótulo da aba')}\n  per: 'Outubro a dezembro de 2026',\n  tese: '${t('Uma frase que resume o trimestre.')}',\n  cor:  { tese, pal: [{n, hex, obs}], corpo: [ ... ], fontes: [{n, u}] },\n  tipo: { tese, fam: ['Nome da família'], corpo: [ ... ], fontes: [{n, u}] },\n  comb: { tese, corpo: [ ... ], fontes: [{n, u}] },\n  apl:  { tese, corpo: [ ... ], fontes: [{n, u}] }\n}\n\n${t('// pal.hex alimenta o botão que abre a paleta no instrumento de cor')}\n${t('// tipo.fam precisa bater com o nome exato de uma família em src/data/fonts.ts')}` };
  $('edJson').onclick = () => download(t('tendencias') + '.json', JSON.stringify(TREND, null, 2), 'application/json');
  $('edMd').onclick = () => download(t('tendencias') + '-' + slug(TREND[TD.i].id) + '.md', trendMd(TREND[TD.i]), 'text/markdown');
  drawTrend();
}
