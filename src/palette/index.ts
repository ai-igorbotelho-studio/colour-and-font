/* ═══════════ INSTRUMENTO DE COR — montagem ═══════════ */
import { rangeOf, segValue, segHtml } from '../data/range';
import { $, $all, $n, fillSel, toast } from '../core/dom';
import { t } from '../i18n';
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { SCH } from '../data/schemes';
import { LENS } from '../data/lenses';
import { CULT } from '../data/cultures';
import { MUS, CVDLIST } from '../data/music';
import { S, cur, paletteStore, hooks, syncControls } from './state';
import { generatePalette } from './generate';
import { colorsFromHex, angleFor } from '../core/goethe';
import { hex2lch, parseColorCode } from '../core/color';
import { fileToCanvas, extractPalette, mountImgPicker } from '../core/image';
import { pushH, applyH, HIST } from './history';
import { drawWheel, initWheel } from './wheel';
import { drawStrip, initViews } from './views';
import { showDetail, initDetail } from './detail';
import { drawReads } from './reads';
import { drawContrast, initContrast } from './contrast';
import { drawOut, initExport } from './export';
import { initGradient, gradFromPalette } from './gradient';
import { scaleFill, initScale } from './scale';
import { listSaved, initSaved } from './saved';

export { S, paletteStore, syncControls } from './state';
export { pushH } from './history';

/** Gera a paleta a partir de S. keepLocks preserva as cores congeladas. */
export function build(keepLocks: boolean): void {
  const { E, M, SC, L, K, U } = cur();
  const R = rangeOf(S.range);
  S.colors = generatePalette({ seed: S.seed, n: S.n, E, M, SC, L, K, U, t: Math.max(0, Math.min(1, S.pos / 100 + R.dpos)), jit: 46 * R.jit, dc: R.dc,
    baseOver: S.baseOver, prev: S.colors.slice(), keepLocks });
  if (S.sel !== null && S.sel >= S.n) S.sel = null;
  render();
}

export function render(): void {
  drawWheel(); drawStrip(); drawReads(); drawContrast(); drawOut();
  if ($('detail').style.display === 'block' && S.sel !== null) showDetail(S.sel);
  if ($('scale').classList.contains('on')) scaleFill();
  paletteStore.notify();
}
hooks.render = render;

export function initPalette(): void {
  fillSel($('emo'), EMO); fillSel($('mkt'), MKT); fillSel($('scheme'), SCH);
  fillSel($('lens'), LENS); fillSel($('cult'), CULT); fillSel($('mus'), MUS); fillSel($('cvd'), CVDLIST, 'v');
  syncControls();

  initWheel(); initViews(); initDetail(); initContrast(); initExport(); initGradient(); initScale(); initSaved();

  /* ── histórico ── */
  $('undo').onclick = () => { if (HIST.i > 0) { applyH(HIST.i - 1); toast(t('Um passo atrás')) } };
  $('redo').onclick = () => { if (HIST.i < HIST.s.length - 1) { applyH(HIST.i + 1); toast(t('Um passo à frente')) } };
  document.addEventListener('keydown', e => {
    if (!$('p-cores').classList.contains('on')) return;
    const t = (e.target as Element).tagName; if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? $('redo').click() : $('undo').click() } });

  /* ── controles ── */
  const sels: (keyof typeof S)[] = ['emo', 'mkt', 'scheme', 'lens', 'cult', 'mus'];
  sels.forEach(id => $(id).onchange = () => { (S as unknown as Record<string, number>)[id] = $n(id); S.baseOver = null; build(true); pushH() });
  $('cvd').onchange = () => { S.cvd = ($('cvd') as HTMLSelectElement).value; render() };
  $('pos').oninput = () => { S.pos = $n('pos'); $('posval').textContent = String(S.pos); S.baseOver = null; build(true) };
  $('pos').onchange = pushH;
  $('range').innerHTML = segHtml();
  $all<HTMLButtonElement>($('range'), 'button').forEach(b => b.onclick = () => { S.range = b.dataset.r!;
    $all($('range'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); build(true); pushH() });
  $all<HTMLButtonElement>($('cnt'), 'button').forEach(b => b.onclick = () => {
    S.n = +b.dataset.n!; $('cntLbl').textContent = String(S.n);
    $all($('cnt'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); build(true); pushH() });
  $('gen').onclick = () => { S.seed = Math.random(); S.baseOver = null; build(true); pushH();
    toast(t('Nova combinação — use Voltar para recuperar a anterior')) };
  document.addEventListener('keydown', e => {
    if (e.code !== 'Space') return;
    const t = (e.target as Element).tagName;
    if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA' || t === 'BUTTON') return;
    if (!$('p-cores').classList.contains('on')) return;
    e.preventDefault(); $('gen').click() });

  const ih = document.getElementById('imgCol');
  if (ih) mountImgPicker(ih, async file => {
    if (!file) return;
    const note = ih.querySelector('.imgnote'); if (note) note.textContent = t('Lendo a imagem…');
    try {
      const cv = await fileToCanvas(file), hs = extractPalette(cv, S.n);
      if (!hs.length) throw new Error('empty');
      S.colors = colorsFromHex(hs); S.n = hs.length; S.scheme = 0; S.baseOver = S.colors[0].a;
      syncControls(); render(); pushH();
      if (note) note.textContent = t('{n} cores extraídas da imagem, em esquema livre. Arraste as bolas para refinar.', { n: hs.length });
    } catch (_) { if (note) note.textContent = t('Não consegui ler essa imagem — tente JPG, PNG, WEBP ou SVG.'); }
  });

  /* ── cores combinando: código digitado ou foto ── */
  const matchTo = (hex: string, note: HTMLElement | null): void => {
    S.baseOver = angleFor(hex2lch(hex).H);
    build(true);
    if (S.colors[0]) S.colors[0].lock = true;
    render(); syncControls(); pushH();
    if (note) note.textContent = t('Cor {h} travada e ancorada no círculo — gere de novo para ver outras combinações ao redor dela, ou trave mais cores conforme forem agradando.', { h: hex });
  };
  const mc = $('matchCode') as HTMLInputElement | null, mg = document.getElementById('matchGo'), msw = document.getElementById('matchSw'), mm = document.getElementById('matchMsg');
  const tryMatch = (): void => {
    if (!mc) return;
    const hex = parseColorCode(mc.value);
    if (msw) { if (hex) { msw.style.background = hex; msw.hidden = false } else msw.hidden = true }
    if (!hex) { if (mm) mm.textContent = mc.value.trim() ? t('Não entendi esse código — tente HEX (#RRGGBB), RGB (196,0,63) ou CMYK (0,100,68,23).') : ''; return }
    matchTo(hex, mm);
  };
  if (mg) mg.onclick = tryMatch;
  if (mc) mc.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); tryMatch() } };
  const mi = document.getElementById('matchImg');
  if (mi) mountImgPicker(mi, async file => {
    const note = mi.querySelector('.imgnote');
    if (!file) return;
    if (note) note.textContent = t('Lendo a imagem…');
    try {
      const cv = await fileToCanvas(file), hs = extractPalette(cv, 1);
      if (!hs.length) throw new Error('empty');
      matchTo(hs[0], note as HTMLElement | null);
    } catch (_) { if (note) note.textContent = t('Não consegui ler essa imagem — tente JPG, PNG, WEBP ou SVG.'); }
  }, { camera: false });

  build(false);
  pushH();
  gradFromPalette();
  listSaved();
}
