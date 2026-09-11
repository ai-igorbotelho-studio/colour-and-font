/* ═══════════ NAVEGAÇÃO E FUNDO ═══════════ */
import { $, $all } from './core/dom';
import { S, render } from './palette/index';
import { T, newPair, renderSpec } from './type/index';
import { drawHome } from './home';

export type Page = 'home' | 'cores' | 'tipo' | 'criacao' | 'tend';
const LABEL: Record<Page, string> = { home: 'Início', cores: 'Cores', tipo: 'Tipografia', criacao: 'Criação', tend: 'Tendências' };

export function goto(p: Page | string): void {
  $all(document, '.page').forEach(el => el.classList.toggle('on', el.id === 'p-' + p));
  $all<HTMLButtonElement>(document, '.tab').forEach(b => { const on = b.dataset.p === p; b.setAttribute('aria-current', on ? 'page' : 'false'); b.setAttribute('aria-selected', String(on)) });
  $('hereLbl').textContent = LABEL[p as Page] || '';
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
}
