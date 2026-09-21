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
import { mountSwatchGrid } from '../core/imgpicker-grid';
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

  /* ── ancorar cor: usado pelo código digitado e pelo modo âncora da grade de imagem ── */
  let lastAnchorHex: string | null = null;
  const anchorNote = document.getElementById('anchorNoteCol');
  const updateAnchorNote = (): void => {
    if (!anchorNote) return;
    if (S.baseOver !== null && lastAnchorHex) {
      anchorNote.hidden = false;
      anchorNote.innerHTML = `<span>${t('Ancorado em {h} — troque para Exploração para navegar combinações ao redor dela, ou limpe a âncora.', { h: lastAnchorHex })}</span>
        <button type="button" class="mini" id="clearAnchorCol">${t('Limpar âncora')}</button>`;
      const cl = document.getElementById('clearAnchorCol');
      if (cl) cl.onclick = () => { S.baseOver = null; lastAnchorHex = null; if (S.colors[0]) S.colors[0].lock = false;
        build(true); render(); syncControls(); pushH(); updateAnchorNote() };
    } else { anchorNote.hidden = true; anchorNote.innerHTML = ''; }
  };
  const matchTo = (hex: string, note: HTMLElement | null): void => {
    S.baseOver = angleFor(hex2lch(hex).H);
    lastAnchorHex = hex;
    build(true);
    if (S.colors[0]) S.colors[0].lock = true;
    render(); syncControls(); pushH();
    if (note) note.textContent = t('Cor {h} travada e ancorada no círculo — gere de novo para ver outras combinações ao redor dela, ou trave mais cores conforme forem agradando.', { h: hex });
    updateAnchorNote();
  };

  const ih = document.getElementById('imgCol'), igrid = document.getElementById('imgColGrid');
  if (ih) mountImgPicker(ih, async file => {
    if (!file) { if (igrid) igrid.innerHTML = ''; return; }
    const note = ih.querySelector('.imgnote'); if (note) note.textContent = t('Lendo a imagem…');
    try {
      const cv = await fileToCanvas(file), hs = extractPalette(cv, 10);
      if (!hs.length) throw new Error('empty');
      if (note) note.textContent = t('{n} cores extraídas — escolha quais usar abaixo.', { n: hs.length });
      if (igrid) mountSwatchGrid(igrid, hs, (picked, mode) => {
        if (mode === 'replace') {
          S.colors = colorsFromHex(picked); S.n = picked.length; S.scheme = 0; S.baseOver = S.colors[0].a;
          syncControls(); render(); pushH();
          if (note) note.textContent = t('{n} cores extraídas da imagem, em esquema livre. Arraste as bolas para refinar.', { n: picked.length });
        } else { matchTo(picked[0], note as HTMLElement | null); }
      });
    } catch (_) { if (note) note.textContent = t('Não consegui ler essa imagem — tente JPG, PNG, WEBP ou SVG.'); if (igrid) igrid.innerHTML = ''; }
  });

  /* ── cores combinando: código digitado ── */
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

  /* ── seletor de caminho de entrada: imagem / código / exploração ── */
  const entryCol = document.getElementById('entryCol');
  if (entryCol) {
    const tabs = $all<HTMLButtonElement>(entryCol, '.entrytab');
    const panels: Record<string, HTMLElement | null> = { image: document.getElementById('entryImageCol'), code: document.getElementById('entryCodeCol') };
    const setPath = (path: string): void => {
      tabs.forEach(b => b.setAttribute('aria-selected', String(b.dataset.path === path)));
      Object.entries(panels).forEach(([k, el]) => { if (el) el.hidden = k !== path });
    };
    tabs.forEach(b => b.onclick = () => setPath(b.dataset.path!));
  }
  updateAnchorNote();

  build(false);
  pushH();
  gradFromPalette();
  listSaved();
}
