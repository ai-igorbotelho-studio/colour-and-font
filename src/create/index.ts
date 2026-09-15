/* ═══════════ CRIAÇÃO — montagem ═══════════ */
import { hex2rgb, rgb2cmyk, readable, hex2lch } from '../core/color';
import { nameOf, atAngle } from '../core/goethe';
import { $, $v, $n, $all, $set, esc, slug, copy, download, toast, fillSel } from '../core/dom';
import { t, dec, isEn } from '../i18n';
import { colourName } from '../core/names';
import { colorsFromHex } from '../core/goethe';
import { fileToCanvas, extractPalette, analyzeType, mountImgPicker, type TypeMetrics } from '../core/image';
import { createStore } from '../core/state';
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { SCH } from '../data/schemes';
import { LENS } from '../data/lenses';
import { CULT } from '../data/cultures';
import { MUS } from '../data/music';
import { PIECES, SUPS, ANGLES } from '../data/lexicon';
import { S, syncControls } from '../palette/state';
import { render, pushH } from '../palette/index';
import { makeZip } from '../palette/zip';
import { VIEWS, viewHtml, type StripCtx } from '../palette/views';
import { type ViewKey } from '../palette/state';
import { specHtml, sampleText } from '../type/specimen';
import { type TypeEnv } from '../type/hierarchy';
import { setFamilies } from '../type/index';
import { fam } from '../type/pairing';
import { goto } from '../nav';
import { readBrief, buildBrief } from './brief';
import { makeProposal, faithfulFromImage, roleOf, titleFor, why, type Proposal } from './proposals';
import { mdProposal } from './markdown';
import { resetPath, initPath } from './path';
import { segHtml } from '../data/range';

export const createStoreCR = createStore({ props: [] as Proposal[], seed: .4, n: 5, views: [] as ViewKey[], imgBase: null as number | null, imgType: null as TypeMetrics | null, imgHs: [] as string[] });
const CR = createStoreCR.state;

/* ambiente da amostra de uma proposta: famílias e paleta dela, controles da página */
const envOf = (p: Proposal): TypeEnv => ({ fams: p.fonts, ov: {}, off: {}, hs: p.hs, mode: $v('cPal'), base: $n('cBase'), rt: $n('cRatio'), lh: $n('cLh') / 100, tr: $n('cTrack') / 1000, meas: $n('cMeasure') });
const ctxOf = (p: Proposal): StripCtx => ({ H: p.hs, V: p.hs, pr: p.areas, names: p.hs.map((h, i) => colourName(h)[isEn() ? 1 : 0] + ' · ' + nameOf(p.cols[i].a)), locks: p.cols.map(() => false),
  lch: p.cols.map(x => ({ L: x.L, C: x.C, H: atAngle(x.a).H })), schemeName: SCH[p.si].n, title: titleFor(p.br), cvd: 'none', tools: false });

/** Só a amostra de cada proposta — chamada a cada movimento dos controles. */
function drawSpecimens(): void {
  $('cBaseV').textContent = $n('cBase') + 'px'; $('cMeasureV').textContent = t('{n} caracteres', { n: $n('cMeasure') });
  $('cLhV').textContent = dec($n('cLh') / 100, 2);
  $('cTrackV').textContent = dec($n('cTrack') / 1000, 3) + 'em';
  CR.props.forEach((p, i) => { const el = $('cSpec' + i); if (!el) return; const sp = specHtml(envOf(p), $v('cText'));
    el.setAttribute('style', sp.style); el.innerHTML = sp.html });
}
/** Só a visualização da paleta de uma proposta. */
function drawView(i: number): void {
  const p = CR.props[i], v = CR.views[i] || 'faixas', out = viewHtml(v, ctxOf(p));
  const wrap = $('cView' + i); wrap.className = out.className; wrap.innerHTML = out.html;
  $all<HTMLElement>(wrap, '.pick, .cell button[data-act="copy"]').forEach(el => { el.onclick = ev => { ev.stopPropagation();
    const h = el.dataset.h || p.hs[+(el.dataset.i ?? (el.closest('.cell') as HTMLElement).dataset.i!)]; copy(h, h + ' ' + t('Copiado').toLowerCase()) } });
  $('cHint' + i).textContent = VIEWS.find(x => x.v === v)!.d;
  $all<HTMLButtonElement>($('cBar' + i), 'button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
}

function drawProposals(): void {
  $('cOut').innerHTML = CR.props.map((p, i) => `<section class="prop" data-p="${i}">
      <div class="prophead">
        <div><h2 style="margin:0">${esc(p.ang.n)}${p.faithful ? ` <span class=\"faithbadge\">${t('cores exatas da imagem')}</span>` : ''}</h2>
          <p class="sm" style="margin:4px 0 0">${esc(titleFor(p.br))} · ${esc(SCH[p.si].n)} · ${esc(LENS[p.li].n.split(' — ')[0])}${p.u !== p.br.u ? t(' · dinâmica de {u}', { u: esc(MUS[p.u].n.toLowerCase()) }) : ''} · ${p.fonts.map(f => esc(f.n)).join(' + ')}</p></div>
        <div class="propstrip">${p.hs.map((h, j) => `<button data-h="${h}" style="background:${h};color:${readable(h)}" title="${h}">${Math.round(p.areas[j])}%</button>`).join('')}</div>
      </div>
      <div class="viewbar" id="cBar${i}" role="group" aria-label="${t('Modo de visualização')}">${VIEWS.map(x => `<button data-v="${x.v}" aria-pressed="${x.v === (CR.views[i] || 'faixas')}">${x.n}</button>`).join('')}</div>
      <div class="vwrap" id="cView${i}"></div>
      <p class="sm" id="cHint${i}" style="margin-top:10px"></p>
      <h3 style="margin-top:22px">${t('Amostra — {f}', { f: p.fonts.map(f => esc(f.n)).join(' + ') })}</h3>
      <div class="spec" id="cSpec${i}"></div>
      <div class="grid2" style="margin-top:18px">
        <div>${why(p)}</div>
        <div>
          <div class="tblwrap"><table class="roletable"><thead><tr><th>${t('Cor')}</th><th>HEX</th><th>RGB</th><th>CMYK</th><th>${t('Área')}</th></tr></thead><tbody>
          ${p.hs.map((h, j) => { const [r, g, b] = hex2rgb(h);
            return `<tr><td><span style="display:inline-block;width:13px;height:13px;background:${h};vertical-align:-2px;margin-right:6px"></span>${j + 1}</td>
            <td>${h}</td><td>${r} ${g} ${b}</td><td>${rgb2cmyk(r, g, b).map(x => Math.round(x)).join(' ')}</td><td>${Math.round(p.areas[j])}%</td></tr>` }).join('')}
          </tbody></table></div>
          <div class="btnrow">
            <button class="act" data-act="md">${t('Baixar em Markdown')}</button>
            <button class="mini" data-act="zip">${t('Baixar .zip')}</button>
            <button class="mini" data-act="cores">${t('Levar para Cores')}</button>
            <button class="mini" data-act="tipo">${t('Levar para Tipografia')}</button>
            <button class="mini" data-act="copy">${t('Copiar os hex')}</button>
          </div>
        </div>
      </div>
    </section>`).join('');
  CR.props.forEach((_p, i) => { drawView(i);
    $all<HTMLButtonElement>($('cBar' + i), 'button').forEach(b => b.onclick = () => { CR.views[i] = b.dataset.v as ViewKey; drawView(i) }) });
  drawSpecimens();
  $all<HTMLElement>($('cOut'), '.prop').forEach(sec => {
    const p = CR.props[+sec.dataset.p!];
    $all<HTMLButtonElement>(sec, '.propstrip button').forEach(b => b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' ' + t('Copiado').toLowerCase()));
    $all<HTMLButtonElement>(sec, '[data-act]').forEach(b => b.onclick = () => {
      const a = b.dataset.act, nm = slug(titleFor(p.br) + '-' + p.ang.n);
      if (a === 'md') return download(nm + '.md', mdProposal(p), 'text/markdown');
      if (a === 'copy') return copy(p.hs.join('\n'), t('Hex copiados'));
      if (a === 'zip') return zipProposal(p, nm);
      if (a === 'cores') {
        S.emo = p.br.e; S.mkt = p.br.m; S.scheme = p.si; S.lens = p.li; S.cult = p.k; S.mus = p.u; S.pos = Math.round(p.t * 100);
        S.n = p.hs.length; S.range = p.br.range || 'normal';
        S.colors = p.cols.map(c => ({ a: c.a, L: c.L, C: c.C, lock: false })); S.baseOver = p.cols[0].a;
        syncControls(); render(); pushH(); goto('cores'); toast(t('Paleta carregada no instrumento de cor')) }
      if (a === 'tipo') {
        setFamilies(p.fonts.slice(), t('{f} — vindo da proposta {a}.', { f: p.fonts.map(f => f.n).join(' + '), a: p.ang.n.toLowerCase() }));
        goto('tipo'); toast(t('Combinação carregada no instrumento de tipografia')) }
    });
  });
  resetPath(CR.props); createStoreCR.notify();
}
function zipProposal(p: Proposal, nm: string): void {
  const te = new TextEncoder(), files = [
    { name: nm + '.md', data: te.encode(mdProposal(p)) },
    { name: nm + '.css', data: te.encode(`:root{\n` + p.hs.map((h, i) => `  --cor-${i + 1}: ${h};`).join('\n') + '\n'
      + p.fonts.map((f, i) => `  --fonte-${i + 1}: ${fam(f)};`).join('\n') + '\n}') },
    { name: nm + '.json', data: te.encode(JSON.stringify({ leitura: p.ang.n, cores: p.hs,
      areas: p.areas.map(x => +x.toFixed(1)), fontes: p.fonts.map(f => ({ nome: f.n, banco: f.src, pesos: f.wts })) }, null, 2)) },
    { name: nm + '.svg', data: te.encode(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300">`
      + p.hs.map((h, i) => { let x = 0; for (let k = 0; k < i; k++) x += 1200 * p.areas[k] / 100;
        return `<rect x="${x.toFixed(1)}" y="0" width="${(1200 * p.areas[i] / 100).toFixed(1)}" height="300" fill="${h}"/>` }).join('') + `</svg>`) }
  ];
  download(nm + '.zip', makeZip(files));
}

export function initCreate(): void {
  fillSel($('cPiece'), PIECES, 'v'); fillSel($('cSup'), SUPS, 'v');
  fillSel($('cEmo'), EMO); fillSel($('cMkt'), MKT); fillSel($('cCult'), CULT); fillSel($('cMus'), MUS);
  $all<HTMLButtonElement>($('cN'), 'button').forEach(b => b.onclick = () => { CR.n = +b.dataset.n!; $('cNLbl').textContent = String(CR.n);
    $all($('cN'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))) });
  $('cPos').oninput = () => $('cPosV').textContent = ($('cPos') as HTMLInputElement).value;
  $('cBrief').oninput = () => { const lx = readBrief();
    $('cWords').innerHTML = lx.words.length
      ? `${t('Reconheci na descrição:')} <b style="color:var(--ink)">${lx.words.join('</b>, <b style="color:var(--ink)">')}</b>${t('. Essas palavras deslocam intenção, campo, referência e postura — o que você escolher nos campos acima tem prioridade.')}`
      : t('Ainda não reconheci nenhuma palavra do léxico. Escreva à vontade: os campos acima já bastam para gerar.') };
  $('cGo').onclick = () => {
    CR.seed = Math.random(); const br = buildBrief(CR.n); br.imgBase = CR.imgBase; br.imgType = CR.imgType;
    // três propostas de verdade distintas: reamostra a semente enquanto a família de título
    // ou a paleta repetirem uma proposta anterior
    const tooClose = (a: Proposal, b: Proposal): boolean => a.fonts[0].n === b.fonts[0].n
      || (a.fonts[1] && b.fonts[1] && a.fonts[1].n === b.fonts[1].n && a.si === b.si)
      || a.hs.reduce((d, h, i) => d + Math.abs(hex2lch(h).H - hex2lch(b.hs[i] || h).H) % 360, 0) / a.hs.length < 14;
    CR.props = [];
    ANGLES.forEach((a, i) => { let p = makeProposal(a, br, (CR.seed * (i + 1) * 7.13) % 1), tries = 0;
      while (CR.props.some(q => tooClose(p, q)) && tries < 8) { tries++; p = makeProposal(a, br, (CR.seed * (i + 1) * 7.13 + tries * .173) % 1) }
      CR.props.push(p) });
    if (CR.imgHs.length && CR.props.length) CR.props[0] = faithfulFromImage(CR.props[0], CR.imgHs);
    CR.views = CR.props.map(() => 'faixas'); $('cOut').innerHTML = '';
    $('cRead').style.display = 'block';
    $('cRead').innerHTML = `<b>${t('O que eu li do seu pedido.')}</b> `
      + t('Peça: {p}.', { p: (PIECES.find(x => x.v === br.piece) || { n: t('não definida') }).n.toLowerCase() }) + ' '
      + t('Suporte: {s}.', { s: (SUPS.find(x => x.v === br.sup) || { n: t('não definido') }).n.toLowerCase() }) + ' '
      + t('Intenção: {e}. Campo: {m}.', { e: EMO[br.e].n.toLowerCase(), m: MKT[br.m].n.toLowerCase() }) + ' '
      + (CULT[br.k].anc ? t('Referência: {k}.', { k: CULT[br.k].n.split(' — ')[0] }) + ' ' : '')
      + (MUS[br.u].m ? t('Dinâmica: {u}.', { u: MUS[br.u].n.toLowerCase() }) + ' ' : '')
      + t('Postura de partida: {t} de 100.', { t: Math.round(br.t * 100) })
      + (br.words.length ? t(' Da descrição, pesaram: {w}.', { w: br.words.join(', ') }) : t(' A descrição não trouxe palavras do léxico — as três propostas vêm só dos campos.'));
    setTimeout(drawProposals, 60); drawProposals();
    setTimeout(() => { try { $('cOut').scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) {} }, 120);
  };
  $('cAgain').onclick = () => $('cGo').click();
  $('cRange').innerHTML = segHtml();
  $all<HTMLButtonElement>($('cRange'), 'button').forEach(b => b.onclick = () => $all($('cRange'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))));
  initPath();
  const ci = document.getElementById('cImg');
  if (ci) mountImgPicker(ci, async file => {
    const note = ci.querySelector('.imgnote');
    if (!file) { CR.imgBase = null; CR.imgType = null; CR.imgHs = []; if (note) note.innerHTML = ''; return; }
    if (note) note.textContent = t('Lendo a imagem…');
    try {
      const cv = await fileToCanvas(file), hs = extractPalette(cv, CR.n), m = analyzeType(cv);
      CR.imgHs = hs; CR.imgBase = hs.length ? colorsFromHex([hs[0]])[0].a : null; CR.imgType = m;
      if (note) note.innerHTML = t('A primeira proposta usa exatamente estas cores; as outras duas as interpretam.') + ' '
        + `<span class="imgsw">${hs.map(h => `<i style="background:${h}" title="${h}"></i>`).join('')}</span> `
        + t('Tipografia estimada: {s}, contraste {c}.', { s: t(m.serif >= .5 ? 'serifada' : 'sem serifa'), c: t(m.ct >= .6 ? 'alto' : m.ct <= .2 ? 'baixo' : 'médio') });
    } catch (_) { CR.imgBase = null; CR.imgType = null; if (note) note.textContent = t('Não consegui ler essa imagem — tente JPG, PNG, WEBP ou SVG.'); }
  });
  // texto e controles da amostra: valem para as três propostas e mudam ao vivo
  ($('cText') as HTMLTextAreaElement).value = sampleText();
  $('cText').oninput = drawSpecimens;
  $('cSample').onclick = () => { $set('cText', sampleText()); drawSpecimens() };
  $('cTextClear').onclick = () => { $set('cText', ''); $('cText').focus(); drawSpecimens() };
  ['cRatio', 'cPal'].forEach(id => $(id).onchange = drawSpecimens);
  ['cBase', 'cMeasure', 'cLh', 'cTrack'].forEach(id => $(id).oninput = drawSpecimens);
  $('cClear').onclick = () => { ['cPiece', 'cSup', 'cEmo', 'cMkt', 'cCult', 'cMus'].forEach(id => $set(id, 0));
    $set('cPiece', 'none'); $set('cSup', 'none'); $set('cFam', '2');
    $set('cPos', 50); $('cPosV').textContent = '50'; $set('cBrief', ''); $('cWords').textContent = '';
    $('cOut').innerHTML = ''; $('cRead').style.display = 'none'; CR.props = []; toast(t('Campos limpos')) };
}
