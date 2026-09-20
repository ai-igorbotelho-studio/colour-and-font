/* ═══════════ ESTADO DO INSTRUMENTO DE TIPOGRAFIA ═══════════ */
import { createStore } from '../core/state';
import type { Font, CaseKind } from '../data/fonts';

export type TypeFmt = 'css' | 'face' | 'link' | 'tw' | 'html' | 'dl';
export interface RoleOverride { fam?: number; wt?: number; step?: number; lh?: number; tr?: number; it?: boolean; cs?: CaseKind; col?: string }
export interface TypeLock { disp: boolean; body: boolean; mono: boolean }
export interface TypeState {
  disp: Font | null; body: Font | null; mono: Font | null; seed: number; fmt: TypeFmt;
  fams: Font[]; nFam: number; role: string; ov: Record<string, RoleOverride>; off: Record<string, boolean>; pick: boolean;
  lock: TypeLock;
}
export const typeStore = createStore<TypeState>({ disp: null, body: null, mono: null, seed: .3, fmt: 'css',
  fams: [], nFam: 2, role: 'titulo', ov: {}, off: {}, pick: false, lock: { disp: false, body: false, mono: false } });
export const T = typeStore.state;

export const hasFams = (): boolean => !!(T.fams && T.fams.length);

/* Gancho preenchido por type/index.ts — evita import circular. */
export const typeHooks = { renderSpec: (): void => {} };
