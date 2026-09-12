/* ── liga a Visualização de exemplos às três páginas ── */
import { $, $v, esc } from '../core/dom';
import { t } from '../i18n';
import { cur, palette, palName, paletteStore } from '../palette/state';
import { T, typeStore } from '../type/state';
import { roleColors } from '../type/hierarchy';
import { createStoreCR } from '../create/index';
import { titleFor } from '../create/proposals';
import { initMockups, firstLines, type MockSource } from './index';

const debounce = (fn: () => void, ms = 120): (() => void) => { let h = 0; return () => { clearTimeout(h); h = window.setTimeout(fn, ms) } };
const listen = (id: string, fn: () => void): void => { const el = document.getElementById(id); if (el) el.addEventListener('input', fn) };

export function initMockupPages(): void {
  /* Cores: a paleta da página, as famílias da Tipografia se houver */
  const cores = initMockups($('mkCores'), (): MockSource => {
    const { E, M, SC } = cur(); return { hs: palette(), fonts: T.fams || [], title: E.a !== null ? E.n : (M.a !== null ? M.n : 'Auge'), sub: SC.n, name: palName() } });
  const rc = debounce(cores.redraw); paletteStore.subscribe(rc); typeStore.subscribe(rc);

  /* Tipografia: as cores da hierarquia (modo de cor da própria página), o texto da amostra */
  const tipo = initMockups($('mkTipo'), (): MockSource => {
    const C = roleColors(), hs = Array.from(new Set([C.bg, C.fg, C.ac, C.mut])), fl = firstLines($v('tText'));
    return { hs, fonts: T.fams || [], title: fl.title, sub: fl.sub, name: T.fams && T.fams[0] ? T.fams[0].n : 'tipografia' } });
  const rt = debounce(tipo.redraw); typeStore.subscribe(rt); paletteStore.subscribe(rt); listen('tText', rt); listen('tPal', rt);

  /* Criação: a proposta escolhida; sem propostas, a paleta de Cores */
  let pi = 0;
  const cria = initMockups($('mkCriacao'), (): MockSource => {
    const P = createStoreCR.state.props, p = P[Math.min(pi, P.length - 1)], fl = firstLines($v('cText'));
    if (!p) return { hs: palette(), fonts: T.fams || [], title: fl.title, sub: fl.sub, name: 'criacao' };
    return { hs: p.hs, fonts: p.fonts, title: fl.title || titleFor(p.br), sub: fl.sub || p.ang.n, name: titleFor(p.br) } },
    `<label class="lbl"><span>${t('Proposta')}</span><select data-m="prop">${[0, 1, 2].map(i => `<option value="${i}">${esc(t('Proposta {n}', { n: i + 1 }))}</option>`).join('')}</select></label>`);
  const sel = $('mkCriacao').querySelector<HTMLSelectElement>('[data-m="prop"]')!;
  sel.onchange = () => { pi = +sel.value; cria.redraw() };
  const rk = debounce(cria.redraw); createStoreCR.subscribe(rk); paletteStore.subscribe(rk); typeStore.subscribe(rk); listen('cText', rk);
}
