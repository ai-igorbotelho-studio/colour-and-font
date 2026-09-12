/* ═══════════ VISUALIZAÇÃO DE EXEMPLOS ═══════════
   Uma seção no fim de Cores, Tipografia e Criação. Cada página entrega uma fonte
   (paleta, famílias, texto); a seção escolhe o pacote, o cenário e as peças, e
   redesenha sempre que a página avisa. Tudo vetorial e local. */
import { $all, esc, slug, copy, download, toast } from '../core/dom';
import { t } from '../i18n';
import type { Font } from '../data/fonts';
import { fam } from '../type/pairing';
import { BUNDLES, SCENES, type SceneKey } from './data';
import { mockSvg, roles, W, H, type MockCtx } from './draw';

export interface MockSource { hs: string[]; fonts: Font[]; title: string; sub: string; name: string }
interface MockState { bundle: string; scene: SceneKey; off: Set<string> }
const DEF_D = '"DM Serif Display", Georgia, serif', DEF_B = 'Mulish, system-ui, sans-serif', DEF_M = '"Roboto Mono", ui-monospace, monospace';

function ctxOf(src: MockSource, scene: SceneKey): MockCtx {
  const hs = src.hs.length ? src.hs : ['#FFFDF9', '#00000E', '#DE3D7D', '#D4E7FA', '#700034'], r = roles(hs), fs = src.fonts;
  const fD = fs[0] ? fam(fs[0]) : DEF_D, fB = fs[1] ? fam(fs[1]) : (fs[0] ? fam(fs[0]) : DEF_B), fM = fs[2] ? fam(fs[2]) : DEF_M;
  return { hs, ...r, title: (src.title || 'Auge').slice(0, 24), sub: (src.sub || t('Cor e tipografia como instrumentos')).slice(0, 44), fD, fB, fM, scene };
}
/** Primeira linha útil de um texto marcado (### título, parágrafos…). */
export function firstLines(txt: string): { title: string; sub: string } {
  const ls = txt.split('\n').map(l => l.replace(/^[#>*\-\s]+/, '').trim()).filter(Boolean);
  return { title: ls[0] || '', sub: ls[1] || '' };
}

export function initMockups(host: HTMLElement, source: () => MockSource, extraCtl = ''): { redraw: () => void } {
  const M: MockState = { bundle: 'digital', scene: 'claro', off: new Set() };
  host.innerHTML = `<div class="mockctl">
      <label class="lbl"><span>${t('Aplicação')}</span><select data-m="bundle">${BUNDLES.map(b => `<option value="${b.k}">${esc(t(b.n))}</option>`).join('')}</select></label>
      <label class="lbl"><span>${t('Cenário')}</span><select data-m="scene">${SCENES.map(s => `<option value="${s.k}">${esc(t(s.n))}</option>`).join('')}</select></label>
      ${extraCtl}
    </div>
    <p class="sm mockd" data-m="desc"></p>
    <div class="pills mockitems" role="group" aria-label="${t('Peças')}" data-m="items"></div>
    <div class="mockgrid" data-m="grid"></div>
    <div class="btnrow"><button class="mini" data-m="all">${t('Baixar todas em SVG')}</button></div>`;
  const q = <T extends HTMLElement>(k: string): T => host.querySelector<T>(`[data-m="${k}"]`)!;
  q<HTMLSelectElement>('bundle').onchange = ev => { M.bundle = (ev.target as HTMLSelectElement).value; M.off.clear(); redraw() };
  q<HTMLSelectElement>('scene').onchange = ev => { M.scene = (ev.target as HTMLSelectElement).value as SceneKey; redraw() };
  q('all').onclick = () => { const src = source(), b = BUNDLES.find(x => x.k === M.bundle)!, c = ctxOf(src, M.scene);
    b.items.filter(it => !M.off.has(it.k)).forEach(it => download(t('mockup') + '-' + slug(src.name) + '-' + it.k + '.svg', mockSvg(it.k, c), 'image/svg+xml'));
    toast(t('Arquivos SVG gerados')) };
  function redraw(): void {
    const src = source(), b = BUNDLES.find(x => x.k === M.bundle)!, c = ctxOf(src, M.scene);
    q('desc').textContent = t(b.d);
    q('items').innerHTML = b.items.map(it => `<button class="pill" data-k="${it.k}" aria-pressed="${!M.off.has(it.k)}">${esc(t(it.n))}</button>`).join('');
    $all<HTMLButtonElement>(q('items'), 'button').forEach(p => p.onclick = () => { const k = p.dataset.k!; if (M.off.has(k)) M.off.delete(k); else if (M.off.size < b.items.length - 1) M.off.add(k); redraw() });
    q('grid').innerHTML = b.items.filter(it => !M.off.has(it.k)).map(it => `<figure class="mock" data-k="${it.k}">
        <div class="mockimg">${mockSvg(it.k, c)}</div>
        <figcaption><span>${esc(t(it.n))}</span>
          <span class="btnrow" style="margin:0"><button class="mini" data-f="svg">SVG</button><button class="mini" data-f="png">PNG</button><button class="mini" data-f="copy">${t('Copiar SVG')}</button></span>
        </figcaption></figure>`).join('');
    $all<HTMLButtonElement>(q('grid'), 'figcaption button').forEach(bt => bt.onclick = () => {
      const k = (bt.closest('.mock') as HTMLElement).dataset.k!, svg = mockSvg(k, c), nm = t('mockup') + '-' + slug(src.name) + '-' + k;
      if (bt.dataset.f === 'svg') return download(nm + '.svg', svg, 'image/svg+xml');
      if (bt.dataset.f === 'copy') return copy(svg, t('SVG copiado'));
      const cv = document.getElementById('cv') as HTMLCanvasElement, ctx = cv.getContext('2d'); if (!ctx) return toast(t('Não foi possível rasterizar aqui — baixe o SVG'));
      cv.width = W * 2; cv.height = H * 2; const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, W * 2, H * 2); cv.toBlob(bl => { if (bl) download(nm + '.png', bl) }, 'image/png') };
      img.onerror = () => toast(t('Não foi possível rasterizar aqui — baixe o SVG'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) });
  }
  redraw();
  return { redraw };
}
