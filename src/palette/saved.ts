/* ── paletas salvas ── */
import { $, $all, esc, toast } from '../core/dom';
import { t } from '../i18n';
import { store } from '../core/store';
import type { PaletteColor } from '../core/goethe';
import { S, palette, syncControls, hooks, palName } from './state';
import { pushH } from './history';

interface SavedPalette { nome: string; hex: string[]; c: PaletteColor[]; e: number; m: number; s: number; l: number; k: number; u: number; pos: number }

export async function listSaved(): Promise<void> {
  try { const r = await store.list('pal:'), keys = (r && r.keys) || [];
    if (!keys.length) { $('savedEmpty').style.display = 'block'; $('saved').innerHTML = ''; $('savedInline').innerHTML = ''; return }
    $('savedEmpty').style.display = 'none'; const items: { k: string; v: SavedPalette }[] = [];
    for (const k of keys.slice(-16)) { try { const g = await store.get(k); if (g) items.push({ k, v: JSON.parse(g.value) }) } catch (_) {} }
    const mk = ({ k, v }: { k: string; v: SavedPalette }) => `<button class="mini" data-k="${k}" style="display:flex;align-items:center;gap:7px">
      <span style="display:flex">${v.hex.map(c => `<i style="display:block;width:9px;height:14px;background:${c}"></i>`).join('')}</span>${esc(v.nome)}</button>`;
    $('saved').innerHTML = items.map(mk).join('');
    $('savedInline').innerHTML = items.slice(-6).map(mk).join('');
    [...$all<HTMLButtonElement>($('saved'), 'button'), ...$all<HTMLButtonElement>($('savedInline'), 'button')].forEach(b => b.onclick = async () => {
      const g = await store.get(b.dataset.k!); if (!g) return; const v = JSON.parse(g.value) as SavedPalette;
      S.emo = +v.e; S.mkt = +v.m; S.scheme = +v.s; S.lens = +v.l; S.cult = +v.k; S.mus = +v.u; S.pos = +v.pos;
      S.n = v.c.length; S.colors = v.c; S.baseOver = v.c[0] ? v.c[0].a : null;
      syncControls(); hooks.render(); pushH(); toast(t('Paleta recarregada'));
      try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (_) {} });
  } catch (_) { $('savedEmpty').textContent = t('Não foi possível ler as paletas salvas neste ambiente.') }
}
export function initSaved(): void {
  $('save').onclick = async () => {
    const rec: SavedPalette = { nome: palName().slice(0, 48), hex: palette(), c: S.colors.map(c => ({ a: c.a, L: c.L, C: c.C, lock: false })),
      e: S.emo, m: S.mkt, s: S.scheme, l: S.lens, k: S.cult, u: S.mus, pos: S.pos };
    const ok = await store.set('pal:' + Date.now(), JSON.stringify(rec));
    await listSaved();
    toast(t(ok ? 'Paleta salva — aparece logo abaixo dos botões' : 'Salva só nesta sessão: este navegador não guardou'));
  };
}
