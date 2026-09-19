/* ═══════════ TENDÊNCIAS — edições trimestrais ═══════════ */
import { readable } from '../core/color';
import { colorsFromHex, ANCHORS } from '../core/goethe';
import { $, $all, esc, slug, copy, download, toast, reduceMotion } from '../core/dom';
import { t, locale } from '../i18n';
import { createStore } from '../core/state';
import { FONTS } from '../data/fonts';
import { TREND, AXES, type Edition, type Axis, type AxisKey, type Source } from '../data/trends';
import { S, syncControls } from '../palette/state';
import { render, pushH } from '../palette/index';
import { animateHueFlip } from '../palette/wheel';
import { setFamilies, loadFont } from '../type/index';
import { goto } from '../nav';
import { bannerSvg } from './banner';

export const trendStore = createStore({ i: 0 });
const TD = trendStore.state;

/* ── seis arcos de 60°, um por âncora de Goethe; o(s) que a paleta da edição
   mais se aproxima por ângulo de matiz fica(m) em opacidade plena ── */
function ringSvg(e: Edition): string {
  const hexes = (e.cor.pal || []).map(p => p.hex);
  const angles = hexes.length ? colorsFromHex(hexes).map(c => c.a) : [];
  const matched = new Set(angles.map(a => Math.round(a / 60) % 6));
  const cx = 60, cy = 60, R = 54, r0 = 30;
  const pt = (a: number, r: number): [number, number] => [+(cx + r * Math.cos((a - 90) * Math.PI / 180)).toFixed(2), +(cy + r * Math.sin((a - 90) * Math.PI / 180)).toFixed(2)];
  const arcs = ANCHORS.map((an, i) => {
    const a0 = i * 60 - 30, a1 = i * 60 + 30, op = matched.has(i) ? 1 : .35;
    const p0o = pt(a0, R), p1o = pt(a1, R), p1i = pt(a1, r0), p0i = pt(a0, r0);
    return `<path class="ring-arc" d="M${p0o} A${R},${R} 0 0 1 ${p1o} L${p1i} A${r0},${r0} 0 0 0 ${p0i} Z" fill="${an.hex}" opacity="${op}"/>`;
  }).join('');
  return `<svg class="trend-ring" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${arcs}</svg>`;
}

/* ── fontes: chip com numeral mono, nome e ícone de link externo ── */
function citeChips(fontes: Source[]): string {
  return `<p class="sm trend-cites">${t('Fontes: ')}${fontes.map((f, i) => `<a class="trend-cite" href="${f.u}" target="_blank" rel="noopener">
    <span class="cn">${String(i + 1).padStart(2, '0')}</span><span>${esc(f.n)}</span><span aria-hidden="true">↗</span></a>`).join('')}</p>`;
}

function bodyHtml(a: Axis): string { return a.corpo.map(p => `<p class="lede" style="margin-top:10px">${esc(p)}</p>`).join('') }

/* ── eixo Cor: grade de amostras grandes, hex declarado como aproximação (≈) ── */
function renderColourAxis(a: Axis): string {
  const swatches = (a.pal || []).map(p => `<button class="trend-swatch" data-h="${p.hex}" style="background:${p.hex};color:${readable(p.hex)}">
    <span class="n">${esc(p.n)}</span><span class="hx">≈ ${p.hex}</span></button>`).join('');
  return `<div class="axis axis-cor">
    <div class="sm kicker">${t('Cor')}</div>
    <div class="trend-swatchgrid">${swatches}</div>
    <p class="sm" style="margin-top:8px">${(a.pal || []).map(p => esc(p.n) + ' — ' + esc(p.obs)).join(' · ')}</p>
    ${a.pal && a.pal.length ? `<div class="btnrow"><button class="mini" data-open="cor">${t('Abrir esta paleta em Cores')}</button></div>` : ''}
    <h3 style="margin:16px 0 10px">${esc(a.tese)}</h3>
    ${bodyHtml(a)}
    ${citeChips(a.fontes)}
  </div>`;
}

/* ── eixo Forma da letra: tira de espécime, cada família tipografada na própria face ── */
function renderLetterformAxis(a: Axis): string {
  const fams = a.fam || [];
  const shown = fams.slice(0, 3);
  const rest = fams.length - shown.length;
  const rows = shown.map(n => { const f = FONTS.find(x => x.n === n);
    if (!f) return `<div class="trend-specrow"><span class="trend-specfallback">${esc(n)}</span><span class="sm">${t('(fora do banco do instrumento)')}</span></div>`;
    return `<div class="trend-specrow" style="font-family:'${f.n.replace(/'/g, "\\'")}',var(--font-body)" data-fam="${esc(f.n)}">${esc(f.n)}</div>` }).join('');
  const more = rest > 0 ? `<p class="sm" style="margin-top:6px">${t('+{n} mais', { n: rest })}</p>` : '';
  return `<div class="axis axis-tipo">
    <div class="sm kicker">${t('Forma da letra')}</div>
    <div class="trend-specimen">${rows}</div>${more}
    ${fams.length ? `<div class="btnrow"><button class="mini" data-open="tipo">${t('Abrir estas famílias em Tipografia')}</button></div>` : ''}
    <h3 style="margin:16px 0 10px">${esc(a.tese)}</h3>
    ${bodyHtml(a)}
    ${citeChips(a.fontes)}
  </div>`;
}

/* ── eixo Combinações: pura declaração tipográfica, sem ativo visual ── */
function renderPairingAxis(a: Axis): string {
  return `<div class="axis axis-comb">
    <div class="sm kicker">${t('Combinações')}</div>
    <p class="trend-pull">${esc(a.tese)}</p>
    ${bodyHtml(a)}
    ${citeChips(a.fontes)}
  </div>`;
}

/* ── eixo Aplicações: encerra a sequência numa faixa de polaridade invertida ── */
function renderSurfaceAxis(a: Axis): string {
  return `<section class="axis axis-apl">
    <div class="sm kicker">${t('Aplicações')}</div>
    <h3 style="margin-bottom:10px">${esc(a.tese)}</h3>
    ${bodyHtml(a)}
    ${citeChips(a.fontes)}
  </section>`;
}

const AXIS_RENDER: Record<AxisKey, (a: Axis) => string> = { cor: renderColourAxis, tipo: renderLetterformAxis, comb: renderPairingAxis, apl: renderSurfaceAxis };

export function drawTrend(): void {
  const e = TREND[TD.i];
  drawRail();
  $('edHead').innerHTML = `<div class="edhead">
    <div class="edhead-ring">${ringSvg(e)}</div>
    <div class="edhead-copy">
      <h2 style="margin-top:20px">${esc(e.id)}</h2>
      <p class="sm" style="margin:0 0 10px">${esc(e.per)}${t(TD.i === 0 ? ' · edição em vigor' : ' · arquivada')}</p>
      <p class="lede">${esc(e.tese)}</p>
    </div>
  </div>`;
  $('edAxes').innerHTML = AXES.map(ax => { const a = e[ax.k]; return a ? AXIS_RENDER[ax.k](a) : '' }).join('');
  loadSpecimenFonts(e);
  $all<HTMLButtonElement>($('edAxes'), '[data-h]').forEach(b => b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' ' + t('Copiado').toLowerCase()));
  const co = $('edAxes').querySelector<HTMLButtonElement>('[data-open="cor"]');
  if (co) co.onclick = () => { const hs = e.cor.pal!.map(p => p.hex);
    const before = S.colors.map(c => c.a);
    S.colors = colorsFromHex(hs); S.n = hs.length; S.scheme = 0; S.baseOver = S.colors[0].a;
    syncControls(); render(); pushH(); goto('cores');
    S.colors.forEach((c, i) => { const from = before[i]; if (from === undefined) return;
      const delta = Math.abs(((c.a - from + 540) % 360) - 180);
      if (delta > 90) animateHueFlip(i, from, c.a) });
    toast(t('Paleta da edição carregada, em esquema livre')) };
  const to = $('edAxes').querySelector<HTMLButtonElement>('[data-open="tipo"]');
  if (to) to.onclick = () => { const fs = e.tipo.fam!.map(n => FONTS.find(f => f.n === n)).filter((f): f is NonNullable<typeof f> => !!f);
    if (!fs.length) return toast(t('Estas famílias não estão no banco do instrumento'));
    setFamilies(fs, t('{f} — famílias citadas na edição {e}.', { f: fs.slice(0, 5).map(f => f.n).join(' + '), e: e.id }));
    goto('tipo'); toast(t('Famílias da edição carregadas')) };
  drawBanners(); drawArquivo();
  trendStore.notify();
}

function loadSpecimenFonts(e: Edition): void {
  (e.tipo.fam || []).slice(0, 3).forEach(n => { const f = FONTS.find(x => x.n === n); if (f) loadFont(f) });
}

/* ── um único trilho de linha do tempo, substitui as duas fileiras antigas de edições ── */
function drawRail(): void {
  const ticks = TREND.map((x, i) => `<button class="tick${i === TD.i ? ' cur' : ''}" data-i="${i}" aria-pressed="${i === TD.i}">
      <span class="tickmark"></span><span class="ticklabel">${esc(x.id)}</span></button>`).join('');
  $('edTabs').innerHTML = `<div class="trend-rail">${ticks}</div>
    <p class="sm" style="margin-top:8px">${t('{n} edições no arquivo. A mais antiga é {e}.', { n: TREND.length, e: esc(TREND[TREND.length - 1].id) })}</p>`;
  $all<HTMLButtonElement>($('edTabs'), '.tick').forEach(b => b.onclick = () => { TD.i = +b.dataset.i!; drawTrend();
    try { $('edHead').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      b.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }) } catch (_) {} });
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
  /* o arquivo virou o trilho de linha do tempo, acima — este bloco não duplica mais a lista */
  $('edArquivo').innerHTML = '';
}
export function trendMd(e: Edition): string {
  let s = t('# Tendências — {e}', { e: e.id }) + `\n\n_${e.per}_\n\n${e.tese}\n`;
  AXES.forEach(ax => { const a = e[ax.k]; if (!a) return;
    s += `\n## ${t(ax.n)} — ${a.tese}\n\n`;
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
