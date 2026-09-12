/* ── histórico com voltar e refazer ── */
import { $ } from '../core/dom';
import { t } from '../i18n';
import { S, hooks, syncControls } from './state';
import type { PaletteColor } from '../core/goethe';

interface Snap { c: PaletteColor[]; n: number; bo: number | null; e: number; m: number; sc: number; l: number; k: number; u: number; p: number }
export const HIST = { s: [] as string[], i: -1 };

const snapStr = (): string => JSON.stringify({ c: S.colors, n: S.n, bo: S.baseOver,
  e: S.emo, m: S.mkt, sc: S.scheme, l: S.lens, k: S.cult, u: S.mus, p: S.pos } satisfies Snap);

export function pushH(): void {
  const v = snapStr(); if (HIST.s[HIST.i] === v) return;
  HIST.s = HIST.s.slice(0, HIST.i + 1); HIST.s.push(v);
  if (HIST.s.length > 80) HIST.s.shift();
  HIST.i = HIST.s.length - 1; updH();
}
export function updH(): void {
  const undo = $('undo') as HTMLButtonElement, redo = $('redo') as HTMLButtonElement;
  undo.disabled = HIST.i <= 0; redo.disabled = HIST.i >= HIST.s.length - 1;
  undo.textContent = HIST.i > 0 ? t('← Voltar ({n})', { n: HIST.i }) : t('← Voltar');
}
export function applyH(k: number): void {
  const v = JSON.parse(HIST.s[k]) as Snap;
  S.colors = v.c; S.n = v.n; S.baseOver = v.bo;
  S.emo = v.e; S.mkt = v.m; S.scheme = v.sc; S.lens = v.l; S.cult = v.k; S.mus = v.u; S.pos = v.p;
  syncControls();
  HIST.i = k; hooks.render(); updH();
}
