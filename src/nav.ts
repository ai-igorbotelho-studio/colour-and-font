/* ═══════════ NAVEGAÇÃO E FUNDO ═══════════ */
import { $, $all } from './core/dom';
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

export function goto(p: Page | string): void {
  const swap = () => $all(document, '.page').forEach(el => el.classList.toggle('on', el.id === 'p-' + p));
  // troca de página com transição nativa quando o navegador oferece; senão, instantânea
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(swap); else swap();
  document.documentElement.setAttribute('data-section', ['cores', 'tipo', 'criacao'].includes(p as string) ? 'tool' : 'content');
  $all<HTMLButtonElement>(document, '.tab').forEach(b => { const on = b.dataset.p === p; b.setAttribute('aria-current', on ? 'page' : 'false'); b.setAttribute('aria-selected', String(on)) });
  $('hereLbl').textContent = p !== 'home' && LABEL[p as Page] ? label(p as Page) : '';
  document.documentElement.style.setProperty('--accent', ACCENT[p as Page] || 'transparent');
  try { window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) } catch (_) {}
  if (p === 'tipo' && !T.disp) newPair();
  if (p === 'tipo') renderSpec();
}
export const setGround = (g: 'luz' | 'treva'): void => {
  document.documentElement.setAttribute('data-ground', g);
  $('gLuz').setAttribute('aria-pressed', String(g === 'luz')); $('gTreva').setAttribute('aria-pressed', String(g === 'treva'));
  drawHome(); if (S.colors.length) render();
};
export function initNav(): void {
  $all<HTMLButtonElement>(document, '.tab').forEach(b => b.onclick = () => goto(b.dataset.p!));
  $all<HTMLButtonElement>(document, '[data-goto]').forEach(b => b.onclick = () => goto(b.dataset.goto!));
  $('gLuz').onclick = () => setGround('luz'); $('gTreva').onclick = () => setGround('treva');
  $('lEn').setAttribute('aria-pressed', String(getLang() === 'en')); $('lPt').setAttribute('aria-pressed', String(getLang() === 'pt'));
  $('lEn').onclick = () => { if (getLang() !== 'en') setLang('en') }; $('lPt').onclick = () => { if (getLang() !== 'pt') setLang('pt') };
}
