/* ═══════════ NAVEGAÇÃO E FUNDO ═══════════ */
import { $, $all, reduceMotion } from './core/dom';
import { S, render } from './palette/index';
import { T, newPair, renderSpec } from './type/index';
import { drawHome } from './home';
import { t, getLang, setLang } from './i18n';
import { ANCHORS } from './core/goethe';

export type Page = 'home' | 'cores' | 'tipo' | 'criacao' | 'tend' | 'cont' | 'fund';
const LABEL: Record<Page, string> = { home: 'Início', cores: 'Cores', tipo: 'Tipografia', criacao: 'Criação', tend: 'Tendências', cont: 'Conteúdos', fund: 'Teoria' };
const label = (p: Page): string => t(LABEL[p]);
/* cada página de ferramenta/conteúdo recebe uma das seis âncoras de Goethe como
   assinatura de cor — a própria roda vira o sistema de orientação da navegação */
const ACCENT: Partial<Record<Page, string>> = { cores: ANCHORS[0].hex, tipo: ANCHORS[1].hex, criacao: ANCHORS[2].hex, tend: ANCHORS[3].hex, cont: ANCHORS[4].hex, fund: ANCHORS[5].hex };

/* cada página tem o seu próprio endereço, para recarregar ou partilhar sem
   cair de volta num artigo que já foi fechado — home fica sem hash, e
   Conteúdos gerencia o próprio endereço (#c, #c/<slug>) em contents/index.ts */
const PAGE_HASH: Record<Exclude<Page, 'cont'>, string> = { home: '', cores: 'cores', tipo: 'tipo', criacao: 'criacao', tend: 'tend', fund: 'fund' };
const HASH_PAGE: Record<string, Page> = { cores: 'cores', tipo: 'tipo', criacao: 'criacao', tend: 'tend', fund: 'fund' };

export function goto(p: Page | string): void {
  const swap = () => $all(document, '.page').forEach(el => el.classList.toggle('on', el.id === 'p-' + p));
  // troca de página com transição nativa quando o navegador oferece; senão, instantânea
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(swap); else swap();
  document.documentElement.setAttribute('data-section', ['cores', 'tipo', 'criacao'].includes(p as string) ? 'tool' : 'content');
  $all<HTMLButtonElement>(document, '.tab').forEach(b => { const on = b.dataset.p === p; b.setAttribute('aria-current', on ? 'page' : 'false'); b.setAttribute('aria-selected', String(on)) });
  $('hereLbl').textContent = p !== 'home' && LABEL[p as Page] ? label(p as Page) : '';
  const pageAccent = ACCENT[p as Page];
  if (pageAccent) document.documentElement.style.setProperty('--accent', pageAccent);
  else document.documentElement.style.removeProperty('--accent');
  try { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) } catch (_) {}
  if (p === 'tipo' && !T.disp) newPair();
  if (p === 'tipo') renderSpec();
  if (p !== 'cont') { const h = PAGE_HASH[p as Exclude<Page, 'cont'>]; if (h !== undefined) { const wanted = h ? '#' + h : ''; if (location.hash !== wanted) history.replaceState(null, '', location.pathname + wanted) } }
}
/* restaura a página certa ao carregar ou ao usar avançar/voltar do navegador —
   endereços de Conteúdos (#c, #c/<slug>) ficam por conta de openFromHash lá */
export function routeFromHash(): void {
  const h = location.hash.replace(/^#/, '');
  const p = h ? HASH_PAGE[h] : 'home';
  if (p) goto(p);
}
export function initHashRouting(): void {
  if (!location.hash.startsWith('#c')) routeFromHash();
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#c')) routeFromHash() });
}
/* troca de polaridade luz/treva: crossfade das superfícies, escopado a uma
   janela curta em torno da mudança do atributo (DESIGN-MOTION-SPEC.md §2a) —
   a classe .polarity-swap nunca fica permanentemente ativa, senão o crossfade
   universal também dispararia (e atrasaria) trocas de conteúdo dinâmicas
   (regenerar paleta, trocar par tipográfico), que precisam ficar instantâneas. */
export const setGround = (g: 'luz' | 'treva'): void => {
  const html = document.documentElement, reduce = reduceMotion();
  if (!reduce) html.classList.add('polarity-swap');
  html.setAttribute('data-ground', g);
  $('gLuz').setAttribute('aria-pressed', String(g === 'luz')); $('gTreva').setAttribute('aria-pressed', String(g === 'treva'));
  drawHome(); if (S.colors.length) render();
  if (!reduce) setTimeout(() => html.classList.remove('polarity-swap'), 650);
};
export function initNav(): void {
  $all<HTMLButtonElement>(document, '.tab').forEach(b => b.onclick = () => goto(b.dataset.p!));
  $all<HTMLButtonElement>(document, '[data-goto]').forEach(b => b.onclick = () => goto(b.dataset.goto!));
  $('gLuz').onclick = () => setGround('luz'); $('gTreva').onclick = () => setGround('treva');
  $('lEn').setAttribute('aria-pressed', String(getLang() === 'en')); $('lPt').setAttribute('aria-pressed', String(getLang() === 'pt'));
  $('lEn').onclick = () => { if (getLang() !== 'en') setLang('en') }; $('lPt').onclick = () => { if (getLang() !== 'pt') setLang('pt') };
}
