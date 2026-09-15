/* ═══════════ COMPOR UM CAMINHO ═══════════
   Das três propostas, a paleta de uma e a tipografia de outra viram um caminho
   só. Depois, refinar: trocar, clarear, escurecer, avivar ou acalmar uma cor;
   trocar uma família por outra do mesmo lugar; ou pedir a mudança por escrito. */
import { hex2lch, oklch2hex, readable, ratio, hex2rgb, rgb2cmyk } from '../core/color';
import { nameOf, atAngle } from '../core/goethe';
import { colourName } from '../core/names';
import { $, $v, $n, $all, esc, slug, copy, download, toast, norm } from '../core/dom';
import { t, isEn } from '../i18n';
import { FONTS, bankName, type Font } from '../data/fonts';
import { colorsFromHex } from '../core/goethe';
import { S, syncControls } from '../palette/state';
import { render, pushH } from '../palette/index';
import { viewHtml, VIEWS, type StripCtx } from '../palette/views';
import { specHtml } from '../type/specimen';
import { setFamilies } from '../type/index';
import { fam, pairScore, isSerif } from '../type/pairing';
import { loadFont } from '../type/loader';
import { goto } from '../nav';
import { mdBlock } from './markdown';
import { titleFor, type Proposal } from './proposals';
import type { ViewKey } from '../palette/state';

interface PathState { pi: number; fi: number; hs: string[]; areas: number[]; fonts: Font[]; view: ViewKey; log: string[]; swaps: number[] }
const P: PathState = { pi: 0, fi: 1, hs: [], areas: [], fonts: [], view: 'faixas', log: [], swaps: [] };
let props: Proposal[] = [];
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

/** Cor ajustada em OKLCH; o croma cai até caber no sRGB dentro de oklch2hex. */
function adjust(h: string, dL: number, kC: number, dH: number): string {
  const c = hex2lch(h); return oklch2hex(clamp(c.L + dL, .04, .98), clamp(c.C * kC, 0, .37), (c.H + dH + 360) % 360);
}
const ctx = (): StripCtx => { const cols = colorsFromHex(P.hs); return { H: P.hs, V: P.hs, pr: P.areas, names: P.hs.map((h, i) => colourName(h)[isEn() ? 1 : 0] + ' · ' + nameOf(cols[i].a)), locks: P.hs.map(() => false),
  lch: cols.map(c => ({ L: c.L, C: c.C, H: atAngle(c.a).H })), schemeName: t('Caminho composto'), title: t('Caminho'), cvd: 'none', tools: false } };

export function resetPath(ps: Proposal[]): void {
  props = ps; if (!ps.length) { $('cPath').hidden = true; return }
  P.pi = 0; P.fi = Math.min(1, ps.length - 1); P.log = []; P.swaps = []; take(); $('cPath').hidden = false; draw();
}
function take(): void { P.hs = props[P.pi].hs.slice(); P.areas = props[P.pi].areas.slice(); P.fonts = props[P.fi].fonts.slice(); P.fonts.forEach(loadFont) }

function draw(): void {
  const pick = (id: string, cur: number): string => props.map((p, i) => `<button data-i="${i}" aria-pressed="${i === cur}">${i + 1} · ${esc(p.ang.n)}</button>`).join('');
  $('cPathPal').innerHTML = pick('cPathPal', P.pi); $('cPathTyp').innerHTML = pick('cPathTyp', P.fi);
  $all<HTMLButtonElement>($('cPathPal'), 'button').forEach(b => b.onclick = () => { P.pi = +b.dataset.i!; P.log = []; take(); draw() });
  $all<HTMLButtonElement>($('cPathTyp'), 'button').forEach(b => b.onclick = () => { P.fi = +b.dataset.i!; P.log = []; take(); draw() });
  $('cPathBar').innerHTML = VIEWS.map(x => `<button data-v="${x.v}" aria-pressed="${x.v === P.view}">${x.n}</button>`).join('');
  $all<HTMLButtonElement>($('cPathBar'), 'button').forEach(b => b.onclick = () => { P.view = b.dataset.v as ViewKey; drawView() });
  drawView(); drawSpec(); drawRefine();
  $('cPathTitle').textContent = t('Paleta da proposta {a} com a tipografia da proposta {b}', { a: P.pi + 1, b: P.fi + 1 });
}
function drawView(): void { const out = viewHtml(P.view, ctx()); const w = $('cPathView'); w.className = out.className; w.innerHTML = out.html;
  $all<HTMLElement>(w, '.pick, .cell button[data-act="copy"]').forEach(el => { el.onclick = ev => { ev.stopPropagation(); const h = el.dataset.h || P.hs[+(el.dataset.i ?? (el.closest('.cell') as HTMLElement).dataset.i!)]; copy(h, h + ' ' + t('Copiado').toLowerCase()) } }) }
export function drawSpec(): void { if ($('cPath').hidden || !P.fonts.length) return;
  const sp = specHtml({ fams: P.fonts, ov: {}, off: {}, hs: P.hs, mode: $v('cPal'), base: $n('cBase'), rt: $n('cRatio'), lh: $n('cLh') / 100, tr: $n('cTrack') / 1000, meas: $n('cMeasure') }, $v('cText'));
  const el = $('cPathSpec'); el.setAttribute('style', sp.style); el.innerHTML = sp.html }

/* ── refinar ── */
const ROLE = [t('Título'), t('Texto'), t('Apoio'), t('Citação'), t('Acento')];
function drawRefine(): void {
  $('cRefCols').innerHTML = P.hs.map((h, i) => `<div class="refrow"><span class="refsw" style="background:${h};color:${readable(h)}">${i + 1}</span>
      <span class="refname"><b>${h}</b><span class="sm">${esc(colourName(h)[isEn() ? 1 : 0])} · ${Math.round(P.areas[i])}%</span></span>
      <span class="btnrow refacts">
        <button class="mini" data-c="${i}" data-op="swap">${t('Trocar')}</button><button class="mini" data-c="${i}" data-op="light">${t('Mais clara')}</button>
        <button class="mini" data-c="${i}" data-op="dark">${t('Mais escura')}</button><button class="mini" data-c="${i}" data-op="vivid">${t('Mais viva')}</button>
        <button class="mini" data-c="${i}" data-op="muted">${t('Mais sóbria')}</button><button class="mini" data-c="${i}" data-op="undo" ${P.log.some(l => l.startsWith(i + ':')) ? '' : 'disabled'}>${t('Original')}</button>
      </span></div>`).join('');
  $all<HTMLButtonElement>($('cRefCols'), 'button').forEach(b => b.onclick = () => colourOp(+b.dataset.c!, b.dataset.op!));
  const opts = FONTS.slice().sort((a, b) => a.n.localeCompare(b.n));
  $('cRefFonts').innerHTML = P.fonts.map((f, i) => `<div class="refrow"><span class="refsw reffont" style="font-family:${fam(f).replace(/"/g, "'")}">Aa</span>
      <span class="refname"><b>${esc(f.n)}</b><span class="sm">${ROLE[i] || t('Extra')} · ${bankName(f)}</span></span>
      <span class="btnrow refacts"><button class="mini" data-f="${i}" data-op="swap">${t('Trocar')}</button><button class="mini" data-f="${i}" data-op="serif">${t('Serifada')}</button><button class="mini" data-f="${i}" data-op="sans">${t('Sem serifa')}</button>
        <select data-f="${i}" aria-label="${t('Escolher família')}"><option value="">${t('Escolher…')}</option>${opts.map(o => `<option value="${esc(o.n)}">${esc(o.n)}</option>`).join('')}</select></span></div>`).join('');
  $all<HTMLButtonElement>($('cRefFonts'), 'button').forEach(b => b.onclick = () => fontOp(+b.dataset.f!, b.dataset.op!));
  $all<HTMLSelectElement>($('cRefFonts'), 'select').forEach(sl => sl.onchange = () => { const f = FONTS.find(x => x.n === sl.value); if (f) setFont(+sl.dataset.f!, f) });
  $('cRefLog').innerHTML = P.log.length ? `<p class="sm">${t('Mudanças: ')}${P.log.map(l => esc(l.split(':')[1])).join(' · ')}</p>` : '';
}
function colourOp(i: number, op: string): void {
  const orig = props[P.pi].hs[i];
  if (op === 'undo') { P.hs[i] = orig; P.log = P.log.filter(l => !l.startsWith(i + ':')) }
  else {
    P.swaps[i] = (P.swaps[i] || 0) + 1;
    const h = P.hs[i];
    P.hs[i] = op === 'light' ? adjust(h, .09, .96, 0) : op === 'dark' ? adjust(h, -.09, 1.02, 0) : op === 'vivid' ? adjust(h, 0, 1.3, 0) : op === 'muted' ? adjust(h, 0, .68, 0)
      : adjust(h, 0, 1, [38, -38, 76, -76, 150][P.swaps[i] % 5]);
    P.log.push(`${i}:${t('cor {n} {o}', { n: i + 1, o: t(op === 'light' ? 'mais clara' : op === 'dark' ? 'mais escura' : op === 'vivid' ? 'mais viva' : op === 'muted' ? 'mais sóbria' : 'trocada') })}`);
  }
  drawView(); drawSpec(); drawRefine();
}
function setFont(i: number, f: Font): void { loadFont(f); P.fonts[i] = f; P.log.push(`f${i}:${t('{r} agora em {f}', { r: (ROLE[i] || t('Extra')).toLowerCase(), f: f.n })}`); drawSpec(); drawRefine() }
function fontOp(i: number, op: string): void {
  const other = P.fonts[i === 0 ? 1 : 0] || P.fonts[i], cur = P.fonts[i];
  let pool = FONTS.filter(f => f.n !== cur.n && f.cls !== 'mono' && (i === 0 ? f.role !== 'body' : f.role !== 'display'));
  if (op === 'serif') pool = pool.filter(f => isSerif(f.cls)); if (op === 'sans') pool = pool.filter(f => !isSerif(f.cls));
  if (!pool.length) return toast(t('Nenhuma família cabe nesse pedido'));
  const F = { bank: 'none', wf: 'none', cf: 'none', clsD: 'none', clsB: 'none', use: 'none', strat: 'contraste', emo: props[P.fi].br.e, range: props[P.fi].br.range };
  pool.sort((a, b) => (i === 0 ? pairScore(b, other, F) - pairScore(a, other, F) : pairScore(other, b, F) - pairScore(other, a, F)));
  const k = (P.swaps[10 + i] = (P.swaps[10 + i] || 0) + 1);
  setFont(i, pool[(k - 1) % Math.min(6, pool.length)]);
}
/* pedido por escrito: "cor 2 mais escura", "título serifado", "texto em Inter", "todas mais sóbrias" */
function parseRequest(txt: string): number {
  const s = norm(txt); let done = 0;
  const nums = [...s.matchAll(/(?:cor|colour|color)\s*(\d)/g)].map(m => +m[1] - 1).filter(i => i >= 0 && i < P.hs.length);
  const ops: string[] = [];
  if (/mais clar|lighter|brighter|pale/.test(s)) ops.push('light'); if (/mais escur|darker|deeper/.test(s)) ops.push('dark');
  if (/mais viv|vivid|saturad|stronger|mais forte/.test(s)) ops.push('vivid'); if (/sobri|muted|softer|mais suave|calm|less saturated|dessaturad/.test(s)) ops.push('muted');
  if (/troc|swap|change|another|outra|diferente|different|replace/.test(s) && !ops.length) ops.push('swap');
  const targets = nums.length ? nums : (/todas|all colours|all colors|every colour|paleta|palette/.test(s) && ops.length ? P.hs.map((_, i) => i) : []);
  targets.forEach(i => ops.forEach(op => { colourOp(i, op); done++ }));
  const slot = /titulo|title|headline|display/.test(s) ? 0 : /texto|body|paragrafo|paragraph/.test(s) ? 1 : -1;
  if (slot >= 0 && P.fonts[slot]) {
    const named = FONTS.find(f => s.includes(norm(f.n)));
    if (named) { setFont(slot, named); done++ }
    else if (/serif/.test(s) && !/sem serifa|sans/.test(s)) { fontOp(slot, 'serif'); done++ }
    else if (/sem serifa|sans/.test(s)) { fontOp(slot, 'sans'); done++ }
    else if (/troc|swap|change|another|outra|different|replace|mono/.test(s)) { fontOp(slot, 'swap'); done++ }
  }
  return done;
}

export function initPath(): void {
  $('cPathAsk').onclick = () => { const n = parseRequest($v('cPathReq')); toast(n ? t('{n} mudança(s) aplicada(s)', { n }) : t('Não entendi o pedido — use os botões ou escreva como nos exemplos')); if (n) ($('cPathReq') as HTMLInputElement).value = '' };
  $('cPathReq').addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); $('cPathAsk').click() } });
  $('cPathReset').onclick = () => { P.log = []; P.swaps = []; take(); draw() };
  $('cPathMd').onclick = () => download(slug(t('caminho') + '-' + titleFor(props[P.pi].br)) + '.md', mdBlock(t('Caminho composto — {t}', { t: titleFor(props[P.pi].br) }), P.hs, P.areas, P.fonts,
    t('Paleta da proposta {a} ({x}); tipografia da proposta {b} ({y}).', { a: P.pi + 1, x: props[P.pi].ang.n, b: P.fi + 1, y: props[P.fi].ang.n }) + (P.log.length ? '\n\n' + t('Refinamentos: ') + P.log.map(l => l.split(':')[1]).join('; ') : '')), 'text/markdown');
  $('cPathCopy').onclick = () => copy(P.hs.join('\n'), t('Hex copiados'));
  $('cPathCores').onclick = () => { S.colors = colorsFromHex(P.hs); S.n = P.hs.length; S.scheme = 0; S.baseOver = S.colors[0].a; syncControls(); render(); pushH(); goto('cores'); toast(t('Paleta carregada no instrumento de cor')) };
  $('cPathTipo').onclick = () => { setFamilies(P.fonts.slice(), t('{f} — vindo do caminho composto.', { f: P.fonts.map(f => f.n).join(' + ') })); goto('tipo'); toast(t('Combinação carregada no instrumento de tipografia')) };
  ['cText', 'cBase', 'cMeasure', 'cLh', 'cTrack', 'cPal'].forEach(id => $(id).addEventListener('input', drawSpec));
}
export const pathTable = (): string => P.hs.map((h, j) => { const [r, g, b] = hex2rgb(h); return `${h} ${r} ${g} ${b} ${rgb2cmyk(r, g, b).map(x => Math.round(x)).join(' ')} ${ratio(h, P.hs[0]).toFixed(2)}` }).join('\n');
