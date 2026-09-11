/* Ganchos de teste, expostos só com ?test na URL. Servem ao harness em tests/tools
   para comparar a aplicação modular com o instantâneo do arquivo original. */
import { $set } from './core/dom';
import { S, syncControls } from './palette/state';
import { build, render } from './palette/index';
import { proportions, palette } from './palette/state';
import { T } from './type/state';
import { pickPair } from './type/pairing';
import { buildBrief } from './create/brief';
import { makeProposal } from './create/proposals';
import { ANGLES } from './data/lexicon';

interface PalScen { seed: number; emo: number; mkt: number; scheme: number; lens: number; cult: number; mus: number; pos: number; n: number }
interface PairScen { seed: number; tEmo: number; tUse: string; tStrat: string; tClsD: string; tClsB: string; tBank: string; tWidth: string; tContr: string }
interface BriefScen { brief: string; piece: string; sup: string; fam: number; pos: number; n: number; seeds: number[] }

export function installTestHooks(): void {
  if (!new URLSearchParams(location.search).has('test')) return;
  (window as unknown as { __fk: unknown }).__fk = {
    palette(sc: PalScen) {
      S.emo = sc.emo; S.mkt = sc.mkt; S.scheme = sc.scheme; S.lens = sc.lens; S.cult = sc.cult; S.mus = sc.mus; S.pos = sc.pos;
      S.n = sc.n; S.seed = sc.seed; S.baseOver = null; S.colors = []; syncControls();
      build(false);
      return { hex: palette(), colors: S.colors.map(c => ({ a: c.a, L: c.L, C: c.C })), props: proportions() };
    },
    pair(sc: PairScen) {
      (['tEmo', 'tUse', 'tStrat', 'tClsD', 'tClsB', 'tBank', 'tWidth', 'tContr'] as const).forEach(k => $set(k, sc[k]));
      T.seed = sc.seed; const pr = pickPair();
      return pr ? { d: pr.d.n, b: pr.b.n } : null;
    },
    proposals(br: BriefScen) {
      $set('cBrief', br.brief); $set('cPiece', br.piece); $set('cSup', br.sup); $set('cFam', String(br.fam));
      $set('cPos', br.pos); ['cEmo', 'cMkt', 'cCult', 'cMus'].forEach(id => $set(id, 0));
      const b = buildBrief(br.n);
      return ANGLES.map((a, i) => { const pp = makeProposal(a, b, br.seeds[i]);
        return { hs: pp.hs, fonts: pp.fonts.map(f => f.n), li: pp.li, si: pp.si, u: pp.u, k: pp.k } });
    },
    render
  };
}
