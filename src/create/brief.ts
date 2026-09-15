/* ── leitura do briefing: léxico determinístico, sem rede ── */
import { segValue } from '../data/range';
import { $v, norm } from '../core/dom';
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { CULT } from '../data/cultures';
import { MUS } from '../data/music';
import { LEX } from '../data/lexicon';

export interface Lexical { dpos: number; dc: number; words: string[]; emo?: string; mkt?: string; cult?: string; mus?: string; lens?: string }
export function readBriefText(text: string): Lexical {
  const t = norm(text || '');
  const hits: string[] = [], out: Lexical = { dpos: 0, dc: 0, words: [] };
  // casa no início de palavra: "ação" não dispara dentro de "contemplação"
  const hit = (w: string): boolean => { const n = norm(w); let i = t.indexOf(n); while (i >= 0) { if (i === 0 || !/[a-z0-9]/.test(t[i - 1])) return true; i = t.indexOf(n, i + 1) } return false };
  LEX.forEach(e => { const m = e.w.find(hit);
    if (!m) return; hits.push(m);
    (['emo', 'mkt', 'cult', 'mus', 'lens'] as const).forEach(k => { if (e[k] && !out[k]) out[k] = e[k] });
    out.dpos += e.dpos || 0; out.dc += e.dc || 0 });
  out.words = hits; return out;
}
export const readBrief = (): Lexical => readBriefText($v('cBrief'));

export const findIdx = (arr: { n: string }[], frag?: string | null): number => { if (!frag) return -1;
  const f = norm(frag); return arr.findIndex(x => norm(x.n).indexOf(f) === 0 || norm(x.n).includes(f)) };

export interface Brief { piece: string; sup: string; e: number; m: number; k: number; u: number; lensFrag?: string; n: number; nf: number; t: number; dc: number; words: string[]; range: string }
export function buildBrief(n: number): Brief {
  const lx = readBrief();
  const pick = (sel: string, arr: { n: string }[], frag?: string) => { const dom = +$v(sel); if (dom > 0) return dom;
    const i = findIdx(arr, frag); return i > 0 ? i : 0 };
  return {
    piece: $v('cPiece'), sup: $v('cSup'),
    e: pick('cEmo', EMO, lx.emo), m: pick('cMkt', MKT, lx.mkt),
    k: pick('cCult', CULT, lx.cult), u: pick('cMus', MUS, lx.mus),
    lensFrag: lx.lens, n: n || 5, nf: +$v('cFam'),
    t: Math.max(0, Math.min(1, +$v('cPos') / 100 + lx.dpos)),
    dc: Math.max(.45, Math.min(1.6, 1 + lx.dc)), words: lx.words, range: segValue('cRange')
  };
}
