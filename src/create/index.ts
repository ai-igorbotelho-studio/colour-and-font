/* ═══════════ CRIAÇÃO — montagem ═══════════ */
import { hex2rgb, rgb2cmyk, readable } from '../core/color';
import { nameOf, atAngle } from '../core/goethe';
import { $, $v, $n, $all, $set, esc, slug, copy, download, toast, fillSel } from '../core/dom';
import { SAMPLE_TXT } from '../data/fonts';
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
import { specHtml } from '../type/specimen';
import { type TypeEnv } from '../type/hierarchy';
import { setFamilies } from '../type/index';
import { fam } from '../type/pairing';
import { goto } from '../nav';
import { readBrief, buildBrief } from './brief';
import { makeProposal, roleOf, titleFor, why, type Proposal } from './proposals';
import { mdProposal } from './markdown';

export const createStoreCR = createStore({ props: [] as Proposal[], seed: .4, n: 5, views: [] as ViewKey[] });
const CR = createStoreCR.state;

/* ambiente da amostra de uma proposta: famílias e paleta dela, controles da página */
const envOf = (p: Proposal): TypeEnv => ({ fams: p.fonts, ov: {}, off: {}, hs: p.hs, mode: $v('cPal'), base: $n('cBase'), rt: $n('cRatio'), lh: $n('cLh') / 100, tr: $n('cTrack') / 1000, meas: $n('cMeasure') });
const ctxOf = (p: Proposal): StripCtx => ({ H: p.hs, V: p.hs, pr: p.areas, names: p.cols.map(x => nameOf(x.a)), locks: p.cols.map(() => false),
  lch: p.cols.map(x => ({ L: x.L, C: x.C, H: atAngle(x.a).H })), schemeName: SCH[p.si].n, title: titleFor(p.br), cvd: 'none', tools: false });

/** Só a amostra de cada proposta — chamada a cada movimento dos controles. */
function drawSpecimens(): void {
  $('cBaseV').textContent = $n('cBase') + 'px'; $('cMeasureV').textContent = $n('cMeasure') + ' caracteres';
  $('cLhV').textContent = ($n('cLh') / 100).toFixed(2).replace('.', ',');
  $('cTrackV').textContent = ($n('cTrack') / 1000).toFixed(3).replace('.', ',') + 'em';
  CR.props.forEach((p, i) => { const el = $('cSpec' + i); if (!el) return; const sp = specHtml(envOf(p), $v('cText'));
    el.setAttribute('style', sp.style); el.innerHTML = sp.html });
}
/** Só a visualização da paleta de uma proposta. */
function drawView(i: number): void {
  const p = CR.props[i], v = CR.views[i] || 'faixas', out = viewHtml(v, ctxOf(p));
  const wrap = $('cView' + i); wrap.className = out.className; wrap.innerHTML = out.html;
  $all<HTMLElement>(wrap, '.pick, .cell button[data-act="copy"]').forEach(el => { el.onclick = ev => { ev.stopPropagation();
    const h = el.dataset.h || p.hs[+(el.dataset.i ?? (el.closest('.cell') as HTMLElement).dataset.i!)]; copy(h, h + ' copiado') } });
  $('cHint' + i).textContent = VIEWS.find(x => x.v === v)!.d;
  $all<HTMLButtonElement>($('cBar' + i), 'button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
}

function drawProposals(): void {
  $('cOut').innerHTML = CR.props.map((p, i) => `<section class="prop" data-p="${i}">
      <div class="prophead">
        <div><h2 style="margin:0">${esc(p.ang.n)}</h2>
          <p class="sm" style="margin:4px 0 0">${esc(titleFor(p.br))} · ${esc(SCH[p.si].n)} · ${esc(LENS[p.li].n.split(' — ')[0])}${p.u !== p.br.u ? ' · dinâmica de ' + esc(MUS[p.u].n.toLowerCase()) : ''} · ${p.fonts.map(f => esc(f.n)).join(' + ')}</p></div>
        <div class="propstrip">${p.hs.map((h, j) => `<button data-h="${h}" style="background:${h};color:${readable(h)}" title="${h}">${Math.round(p.areas[j])}%</button>`).join('')}</div>
      </div>
      <div class="viewbar" id="cBar${i}" role="group" aria-label="Modo de visualização">${VIEWS.map(x => `<button data-v="${x.v}" aria-pressed="${x.v === (CR.views[i] || 'faixas')}">${x.n}</button>`).join('')}</div>
      <div class="vwrap" id="cView${i}"></div>
      <p class="sm" id="cHint${i}" style="margin-top:10px"></p>
      <h3 style="margin-top:22px">Amostra — ${p.fonts.map(f => esc(f.n)).join(' + ')}</h3>
      <div class="spec" id="cSpec${i}"></div>
      <div class="grid2" style="margin-top:18px">
        <div>${why(p)}</div>
        <div>
          <div class="tblwrap"><table class="roletable"><thead><tr><th>Cor</th><th>HEX</th><th>RGB</th><th>CMYK</th><th>Área</th></tr></thead><tbody>
          ${p.hs.map((h, j) => { const [r, g, b] = hex2rgb(h);
            return `<tr><td><span style="display:inline-block;width:13px;height:13px;background:${h};vertical-align:-2px;margin-right:6px"></span>${j + 1}</td>
            <td>${h}</td><td>${r} ${g} ${b}</td><td>${rgb2cmyk(r, g, b).map(x => Math.round(x)).join(' ')}</td><td>${Math.round(p.areas[j])}%</td></tr>` }).join('')}
          </tbody></table></div>
          <div class="btnrow">
            <button class="act" data-act="md">Baixar em Markdown</button>
            <button class="mini" data-act="zip">Baixar .zip</button>
            <button class="mini" data-act="cores">Levar para Cores</button>
            <button class="mini" data-act="tipo">Levar para Tipografia</button>
            <button class="mini" data-act="copy">Copiar os hex</button>
          </div>
        </div>
      </div>
    </section>`).join('');
  CR.props.forEach((_p, i) => { drawView(i);
    $all<HTMLButtonElement>($('cBar' + i), 'button').forEach(b => b.onclick = () => { CR.views[i] = b.dataset.v as ViewKey; drawView(i) }) });
  drawSpecimens();
  $all<HTMLElement>($('cOut'), '.prop').forEach(sec => {
    const p = CR.props[+sec.dataset.p!];
    $all<HTMLButtonElement>(sec, '.propstrip button').forEach(b => b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' copiado'));
    $all<HTMLButtonElement>(sec, '[data-act]').forEach(b => b.onclick = () => {
      const a = b.dataset.act, nm = slug(titleFor(p.br) + '-' + p.ang.n);
      if (a === 'md') return download(nm + '.md', mdProposal(p), 'text/markdown');
      if (a === 'copy') return copy(p.hs.join('\n'), 'Hex copiados');
      if (a === 'zip') return zipProposal(p, nm);
      if (a === 'cores') {
        S.emo = p.br.e; S.mkt = p.br.m; S.scheme = p.si; S.lens = p.li; S.cult = p.k; S.mus = p.u; S.pos = Math.round(p.t * 100);
        S.n = p.hs.length;
        S.colors = p.cols.map(c => ({ a: c.a, L: c.L, C: c.C, lock: false })); S.baseOver = p.cols[0].a;
        syncControls(); render(); pushH(); goto('cores'); toast('Paleta carregada no instrumento de cor') }
      if (a === 'tipo') {
        setFamilies(p.fonts.slice(), `${p.fonts.map(f => f.n).join(' + ')} — vindo da proposta ${p.ang.n.toLowerCase()}.`);
        goto('tipo'); toast('Combinação carregada no instrumento de tipografia') }
    });
  });
  createStoreCR.notify();
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
      ? `Reconheci na descrição: <b style="color:var(--ink)">${lx.words.join('</b>, <b style="color:var(--ink)">')}</b>. Essas palavras deslocam intenção, campo, referência e postura — o que você escolher nos campos acima tem prioridade.`
      : 'Ainda não reconheci nenhuma palavra do léxico. Escreva à vontade: os campos acima já bastam para gerar.' };
  $('cGo').onclick = () => {
    CR.seed = Math.random(); const br = buildBrief(CR.n);
    CR.props = ANGLES.map((a, i) => makeProposal(a, br, (CR.seed * (i + 1) * 7.13) % 1)); CR.views = CR.props.map((_p, i) => CR.views[i] || 'faixas');
    $('cRead').style.display = 'block';
    $('cRead').innerHTML = `<b>O que eu li do seu pedido.</b> `
      + `Peça: ${(PIECES.find(x => x.v === br.piece) || { n: 'não definida' }).n.toLowerCase()}. `
      + `Suporte: ${(SUPS.find(x => x.v === br.sup) || { n: 'não definido' }).n.toLowerCase()}. `
      + `Intenção: ${EMO[br.e].n.toLowerCase()}. Campo: ${MKT[br.m].n.toLowerCase()}. `
      + (CULT[br.k].anc ? `Referência: ${CULT[br.k].n.split(' — ')[0]}. ` : '')
      + (MUS[br.u].m ? `Dinâmica: ${MUS[br.u].n.toLowerCase()}. ` : '')
      + `Postura de partida: ${Math.round(br.t * 100)} de 100.`
      + (br.words.length ? ` Da descrição, pesaram: ${br.words.join(', ')}.` : ' A descrição não trouxe palavras do léxico — as três propostas vêm só dos campos.');
    setTimeout(drawProposals, 60); drawProposals();
    setTimeout(() => { try { $('cOut').scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch (_) {} }, 120);
  };
  $('cAgain').onclick = () => $('cGo').click();
  // texto e controles da amostra: valem para as três propostas e mudam ao vivo
  ($('cText') as HTMLTextAreaElement).value = SAMPLE_TXT;
  $('cText').oninput = drawSpecimens;
  $('cSample').onclick = () => { $set('cText', SAMPLE_TXT); drawSpecimens() };
  $('cTextClear').onclick = () => { $set('cText', ''); $('cText').focus(); drawSpecimens() };
  ['cRatio', 'cPal'].forEach(id => $(id).onchange = drawSpecimens);
  ['cBase', 'cMeasure', 'cLh', 'cTrack'].forEach(id => $(id).oninput = drawSpecimens);
  $('cClear').onclick = () => { ['cPiece', 'cSup', 'cEmo', 'cMkt', 'cCult', 'cMus'].forEach(id => $set(id, 0));
    $set('cPiece', 'none'); $set('cSup', 'none'); $set('cFam', '2');
    $set('cPos', 50); $('cPosV').textContent = '50'; $set('cBrief', ''); $('cWords').textContent = '';
    $('cOut').innerHTML = ''; $('cRead').style.display = 'none'; CR.props = []; toast('Campos limpos') };
}
