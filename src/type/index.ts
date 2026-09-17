/* ═══════════ INSTRUMENTO DE TIPOGRAFIA — montagem ═══════════ */
import { segHtml } from '../data/range';
import { fileToCanvas, analyzeType, mountImgPicker } from '../core/image';
import { pairingFromImage, similarFonts } from './fontmatch';
import { $, $v, $all, esc, fillSel, toast } from '../core/dom';
import { t } from '../i18n';
import { EMO } from '../data/emotions';
import { CLS, USES, STRATS, WIDTHS, CONTRS, BANKS, type Font } from '../data/fonts';
import { paletteStore } from '../palette/state';
import { T, typeStore, typeHooks } from './state';
import { loadFont } from './loader';
import { candidates, pickSet } from './pairing';
import { renderSpec, swapSpec, specPng, sampleText } from './specimen';
import { initTypeExport } from './export';
import { listTSaved, initTypeSaved } from './saved';

export { T, typeStore } from './state';
export { renderSpec } from './specimen';
export { loadFont } from './loader';

typeHooks.renderSpec = renderSpec;

/** Carrega um conjunto de famílias no instrumento (vindo da Criação ou das Tendências). */
export function setFamilies(fs: Font[], why: string): void {
  T.fams = fs.slice(0, 5); T.nFam = T.fams.length; $('tFamLbl').textContent = String(T.nFam);
  $all($('tFamN'), 'button').forEach(x => x.setAttribute('aria-pressed', String(+(x as HTMLElement).dataset.n! === T.nFam)));
  T.disp = T.fams[0]; T.body = T.fams[1] || T.fams[0]; T.mono = T.fams.find(f => f.cls === 'mono') || null; T.ov = {};
  T.fams.forEach(loadFont);
  $('tWhy').textContent = why;
  swapSpec(); typeStore.notify();
}

export function newPair(): void {
  const set = pickSet(T.nFam);
  if (!set || !set.length) { $('tWhy').textContent = t('Nenhuma família atende a todos os filtros ao mesmo tempo. Solte um deles — ou volte algum para Nenhuma.');
    $('tCards').innerHTML = ''; $('tScore').innerHTML = ''; return }
  T.fams = set; set.forEach(loadFont);
  T.disp = set[0]; T.body = set[1] || set[0]; T.mono = set.find(f => f.cls === 'mono') || null;
  const E = EMO[+$v('tEmo')], st = STRATS.find(x => x.v === $v('tStrat'))!;
  $('tWhy').textContent = (set.length === 1 ? t('{d} sozinha, carregando a hierarquia inteira', { d: set[0].n })
    : t('{d} no título, {b} no texto', { d: set[0].n, b: set[1].n }) + (set.length > 2 ? t(', mais {x}', { x: set.slice(2).map(f => f.n).join(' + ') }) : ''))
    + (E.a !== null ? t(', para provocar {e}', { e: E.n.toLowerCase() }) : '')
    + (st.v !== 'none' && set.length > 1 ? t(', pela estratégia de {s}', { s: st.n.toLowerCase() }) : '') + '.';
  setTimeout(renderSpec, 80); swapSpec(); typeStore.notify();
}
function setFamN(n: number): void { T.nFam = n; $('tFamLbl').textContent = String(n);
  $all($('tFamN'), 'button').forEach(x => x.setAttribute('aria-pressed', String(+(x as HTMLElement).dataset.n! === n)));
  T.ov = {}; newPair() }

export function initType(): void {
  const clsOpts = [{ v: 'none', n: t('Nenhuma') }].concat(Object.keys(CLS).map(k => ({ v: k, n: CLS[k as keyof typeof CLS].n })));
  const bankOpts = [{ v: 'none', n: t('Nenhum — todos') }, { v: 'google', n: 'Google Fonts' }, { v: 'fontshare', n: 'Fontshare' }, { v: 'fontsource', n: 'Fontsource' }, { v: 'velvetyne', n: 'Velvetyne' }];
  fillSel($('tEmo'), EMO); fillSel($('tUse'), USES, 'v'); fillSel($('tStrat'), STRATS, 'v');
  fillSel($('tClsD'), clsOpts, 'v'); fillSel($('tClsB'), clsOpts, 'v'); fillSel($('tBank'), bankOpts, 'v');
  fillSel($('tWidth'), WIDTHS, 'v'); fillSel($('tContr'), CONTRS, 'v');
  ($('tStrat') as HTMLSelectElement).value = 'contraste';
  $('banks').innerHTML = BANKS.map(b => `<tr><td>${esc(b[0])}</td><td class="sm" style="color:var(--soft)">${esc(b[1])}</td><td class="sm" style="color:var(--soft)">${esc(b[2])}</td></tr>`).join('');

  initTypeExport(); initTypeSaved();

  $('tGen').onclick = () => { T.seed = Math.random(); newPair() };
  const ti = document.getElementById('tImg');
  if (ti) mountImgPicker(ti, async file => {
    if (!file) return; const note = ti.querySelector('.imgnote'); if (note) note.textContent = t('Lendo a imagem…');
    try {
      const cv = await fileToCanvas(file), m = analyzeType(cv), pair = pairingFromImage(m), sims = similarFonts(m, 6);
      setFamilies(pair, t('{d} no título, {b} no texto — estimadas a partir da textura da imagem.', { d: pair[0].n, b: pair[1].n }));
      if (note) note.innerHTML = (m.ok ? '' : t('Textura pouco nítida — a estimativa é fraca. ') as string)
        + t('Estimativa: {s}, contraste {c}. Famílias parecidas: {l}.', { s: t(m.serif >= .5 ? 'serifada' : 'sem serifa'), c: t(m.ct >= .6 ? 'alto' : m.ct <= .2 ? 'baixo' : 'médio'), l: sims.map(f => f.n).join(', ') });
    } catch (_) { if (note) note.textContent = t('Não consegui ler essa imagem — tente JPG, PNG, WEBP ou SVG.'); }
  });
  $('tSwap').onclick = () => { if (T.fams.length < 2) return toast(t('Com uma família só não há o que trocar'));
    const tmp = T.fams[0]; T.fams[0] = T.fams[1]; T.fams[1] = tmp; T.disp = T.fams[0]; T.body = T.fams[1];
    $('tWhy').textContent = t('{d} no título, {b} no texto — invertido à mão.', { d: T.fams[0].n, b: T.fams[1].n }); swapSpec() };
  $('tMono').onclick = () => {
    if (T.nFam < 3) { setFamN(3); return toast(t('Terceira família acrescentada, em rótulo e referência')) }
    const ms = candidates('mono'); if (!ms.length) return toast(t('Nenhuma monoespaçada passa nos filtros'));
    const other = ms.filter(m => T.fams.indexOf(m) < 0);
    const pick = other.length ? other[Math.floor(Math.random() * other.length)] : ms[0];
    const at = T.fams.findIndex(f => f.cls === 'mono');
    if (at >= 0) T.fams[at] = pick; else T.fams[2] = pick;
    T.mono = pick; loadFont(pick); setTimeout(renderSpec, 80); swapSpec() };
  $all<HTMLButtonElement>($('tFamN'), 'button').forEach(b => b.onclick = () => setFamN(+b.dataset.n!));
  $('tRoleReset').onclick = () => { delete T.ov[T.role]; renderSpec(); toast(t('Nível devolvido ao padrão')) };
  $('tRoleResetAll').onclick = () => { T.ov = {}; T.off = {}; renderSpec(); toast(t('Hierarquia inteira devolvida ao padrão')) };
  ($('tText') as HTMLTextAreaElement).value = sampleText();
  $('tText').oninput = renderSpec;
  $('tSample').onclick = () => { ($('tText') as HTMLTextAreaElement).value = sampleText(); renderSpec() };
  $('tClear').onclick = () => { ($('tText') as HTMLTextAreaElement).value = ''; $('tText').focus(); renderSpec() };
  $('tSpecPng').onclick = () => specPng();
  ['tEmo', 'tUse', 'tStrat', 'tClsD', 'tClsB', 'tBank', 'tWidth', 'tContr'].forEach(id => $(id).onchange = newPair);
  $('tRange').innerHTML = segHtml();
  $all<HTMLButtonElement>($('tRange'), 'button').forEach(b => b.onclick = () => { $all($('tRange'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); newPair() });
  ['tFmt', 'tRatio', 'tPal'].forEach(id => $(id).onchange = renderSpec);
  ['tBase', 'tMeasure', 'tLh', 'tTrack'].forEach(id => $(id).oninput = renderSpec);

  // a amostra segue a paleta: quando o instrumento de cor redesenha, a tipografia acompanha
  paletteStore.subscribe(() => renderSpec());
  listTSaved();
}
