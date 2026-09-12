/* ── combinações salvas ── */
import { $, $all, esc, toast } from '../core/dom';
import { t } from '../i18n';
import { store } from '../core/store';
import { FONTS } from '../data/fonts';
import { T, typeHooks } from './state';
import { loadFont } from './loader';

interface SavedPair { d: string; b: string; m: string | null }

export async function listTSaved(): Promise<void> {
  try { const r = await store.list('tipo:'), keys = (r && r.keys) || [];
    if (!keys.length) { $('tSavedEmpty').style.display = 'block'; $('tSaved').innerHTML = ''; return }
    $('tSavedEmpty').style.display = 'none'; const items: { k: string; v: SavedPair }[] = [];
    for (const k of keys.slice(-16)) { try { const g = await store.get(k); if (g) items.push({ k, v: JSON.parse(g.value) }) } catch (_) {} }
    $('tSaved').innerHTML = items.map(({ k, v }) => `<button class="mini" data-k="${k}">${esc(v.d)} + ${esc(v.b)}</button>`).join('');
    $all<HTMLButtonElement>($('tSaved'), 'button').forEach(b => b.onclick = async () => {
      const g = await store.get(b.dataset.k!); if (!g) return; const v = JSON.parse(g.value) as SavedPair;
      T.disp = FONTS.find(f => f.n === v.d) || T.disp; T.body = FONTS.find(f => f.n === v.b) || T.body;
      T.mono = v.m ? FONTS.find(f => f.n === v.m) || null : null;
      [T.disp, T.body, T.mono].forEach(loadFont);
      $('tWhy').textContent = t('{d} no título, {b} no texto — combinação recarregada.', { d: T.disp!.n, b: T.body!.n });
      setTimeout(typeHooks.renderSpec, 60); typeHooks.renderSpec(); toast(t('Combinação recarregada')) });
  } catch (_) { $('tSavedEmpty').textContent = t('Não foi possível ler as combinações salvas neste ambiente.') }
}
export function initTypeSaved(): void {
  $('tSave').onclick = async () => {
    if (!T.disp) return;
    const ok = await store.set('tipo:' + Date.now(), JSON.stringify({ d: T.disp.n, b: T.body!.n, m: T.mono ? T.mono.n : null } satisfies SavedPair));
    await listTSaved();
    toast(t(ok ? 'Combinação salva — aparece no fim da página' : 'Salva só nesta sessão: este navegador não guardou')); };
}
