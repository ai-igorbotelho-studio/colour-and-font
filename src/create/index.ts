/* ═══════════ CRIAÇÃO — montagem ═══════════ */
import { hex2rgb, rgb2cmyk, readable } from '../core/color';
import { $, $all, $set, esc, slug, copy, download, toast, fillSel } from '../core/dom';
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
import { setFamilies } from '../type/index';
import { fam } from '../type/pairing';
import { goto } from '../nav';
import { readBrief, buildBrief } from './brief';
import { makeProposal, roleOf, titleFor, why, type Proposal } from './proposals';
import { mock } from './mocks';
import { mdProposal } from './markdown';

export const createStoreCR = createStore({ props: [] as Proposal[], seed: .4, n: 5 });
const CR = createStoreCR.state;

function drawProposals(): void {
  $('cOut').innerHTML = CR.props.map((p, i) => {
    return `<section class="prop" data-p="${i}">
      <div class="prophead">
        <div><h2 style="margin:0">${esc(p.ang.n)}</h2>
          <p class="sm" style="margin:4px 0 0">${esc(titleFor(p.br))} · ${esc(SCH[p.si].n)} · ${esc(LENS[p.li].n.split(' — ')[0])}${p.u !== p.br.u ? ' · dinâmica de ' + esc(MUS[p.u].n.toLowerCase()) : ''} · ${p.fonts.map(f => esc(f.n)).join(' + ')}</p></div>
        <div class="propstrip">${p.hs.map((h, j) => `<button data-h="${h}" style="background:${h};color:${readable(h)}" title="${h}">${Math.round(p.areas[j])}%</button>`).join('')}</div>
      </div>
      ${mock(p)}
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
    </section>` }).join('');
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
    CR.props = ANGLES.map((a, i) => makeProposal(a, br, (CR.seed * (i + 1) * 7.13) % 1));
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
  $('cClear').onclick = () => { ['cPiece', 'cSup', 'cEmo', 'cMkt', 'cCult', 'cMus'].forEach(id => $set(id, 0));
    $set('cPiece', 'none'); $set('cSup', 'none'); $set('cFam', '2');
    $set('cPos', 50); $('cPosV').textContent = '50'; $set('cBrief', ''); $('cWords').textContent = '';
    $('cOut').innerHTML = ''; $('cRead').style.display = 'none'; CR.props = []; toast('Campos limpos') };
}
