/* ═══════════ OUSADIA ═══════════
   Quatro posições, de conservadora a disruptiva. A mesma escolha vale para cor
   e para tipografia: na cor mexe no croma, no desvio do matiz e na postura;
   na tipografia inclina a pontuação dos pares. "Normal" é identidade. */
import { t } from '../i18n';

export type RangeKey = 'conservador' | 'normal' | 'inovador' | 'disruptivo';
export interface Range { k: RangeKey; n: string; d: string; dc: number; jit: number; dpos: number; ct: number }
export const RANGES: Range[] = [
 { k: 'conservador', n: 'Conservador', d: 'Croma contido, matiz perto da convenção, famílias de texto seguras.', dc: .82, jit: .45, dpos: -.18, ct: -.06 },
 { k: 'normal', n: 'Normal', d: 'O comportamento de referência do instrumento.', dc: 1, jit: 1, dpos: 0, ct: 0 },
 { k: 'inovador', n: 'Inovador', d: 'Croma um pouco acima, mais liberdade no matiz, famílias com voz própria.', dc: 1.14, jit: 1.5, dpos: .15, ct: .05 },
 { k: 'disruptivo', n: 'Disruptivo', d: 'Croma alto, matiz solto, oposição de estrutura e fundições independentes.', dc: 1.32, jit: 2.4, dpos: .32, ct: .12 }
];
export const rangeOf = (k: string): Range => RANGES.find(r => r.k === k) || RANGES[1];
/** Lê o valor de um grupo segmentado (.seg) pelo botão pressionado. */
export function segValue(id: string, fallback = 'normal'): string {
  const el = document.getElementById(id); if (!el) return fallback;
  const on = el.querySelector<HTMLButtonElement>('button[aria-pressed="true"]'); return on?.dataset.r || fallback;
}
export function segHtml(cur = 'normal'): string {
  return RANGES.map(r => `<button data-r="${r.k}" aria-pressed="${r.k === cur}" title="${t(r.d)}">${t(r.n)}</button>`).join('');
}
export function segSet(id: string, v: string): void { const el = document.getElementById(id); if (!el) return; el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === v))) }
