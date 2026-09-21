/* ═══════════ GRADE DE SELEÇÃO DE CORES EXTRAÍDAS ═══════════
   Camada de seleção/confirmação entre extractPalette e a escrita na paleta.
   Não recalcula nada de cor: só decide quais hexes seguem, em que ordem. */
import { $all } from './dom';
import { t } from '../i18n';

export type PickMode = 'replace' | 'anchor';

/** Aplica a ordem de seleção (dominância, ou invertida) sobre o conjunto escolhido. Pura, testável. */
export function applyPick(hexes: string[], picked: string[], reversed: boolean): string[] {
  const set = new Set(picked);
  const ordered = hexes.filter(h => set.has(h));
  return reversed ? ordered.slice().reverse() : ordered;
}

export interface SwatchGridOpts {
  /** Mínimo de escolhas exigido no modo 'replace' (padrão 2). */
  minReplace?: number;
}

/** Monta a grade de swatches selecionáveis + modo + confirmação dentro de host.
    onConfirm recebe os hexes já na ordem final (pós-inversão) e o modo escolhido. */
export function mountSwatchGrid(host: HTMLElement, hexes: string[], onConfirm: (picked: string[], mode: PickMode) => void, opts: SwatchGridOpts = {}): void {
  const minReplace = opts.minReplace ?? 2;
  if (!hexes.length) { host.innerHTML = ''; return; }
  let picked: string[] = [];
  let reversed = false;
  let mode: PickMode = 'replace';

  host.innerHTML = `
    <div class="seg" id="swMode" role="group" aria-label="${t('O que fazer com as cores escolhidas')}">
      <button type="button" data-m="replace" aria-pressed="true">${t('Substituir a paleta inteira')}</button>
      <button type="button" data-m="anchor" aria-pressed="false">${t('Ancorar uma cor e continuar explorando')}</button>
    </div>
    <div class="swgrid" role="group" aria-label="${t('Cores extraídas — escolha quais usar')}">
      ${hexes.map(h => `<button type="button" class="swpick" data-hex="${h}" aria-pressed="false" style="--sw:${h}">
        <span class="swpick-check" aria-hidden="true"></span><span class="swpick-order" aria-hidden="true"></span>
      </button>`).join('')}
    </div>
    <p class="sm swcount" aria-live="polite">${t('{n} selecionadas — escolha ao menos 1.', { n: 0 })}</p>
    <p class="sm swnote" aria-live="polite"></p>
    <div class="swactions">
      <button type="button" class="mini" data-act="all">${t('Selecionar todas')}</button>
      <button type="button" class="mini" data-act="none">${t('Limpar escolhas')}</button>
      <button type="button" class="mini" data-act="rev" disabled>${t('Inverter ordem')}</button>
      <button type="button" class="act" id="swConfirm" disabled>${t('Usar {n} cor(es) selecionada(s)', { n: 0 })}</button>
    </div>`;

  const modeBtns = $all<HTMLButtonElement>(host, '#swMode button');
  const swatches = $all<HTMLButtonElement>(host, '.swpick');
  const countEl = host.querySelector<HTMLElement>('.swcount')!;
  const noteEl = host.querySelector<HTMLElement>('.swnote')!;
  const revBtn = host.querySelector<HTMLButtonElement>('[data-act="rev"]')!;
  const confirmBtn = host.querySelector<HTMLButtonElement>('#swConfirm')!;

  function refresh(): void {
    swatches.forEach(b => {
      const h = b.dataset.hex!; const i = picked.indexOf(h); const on = i >= 0;
      b.setAttribute('aria-pressed', String(on));
      const ord = b.querySelector('.swpick-order') as HTMLElement;
      ord.textContent = on ? String(i + 1) : '';
    });
    const n = picked.length;
    countEl.textContent = t('{n} selecionadas — escolha ao menos 1.', { n });
    revBtn.disabled = n < 2;
    const minOk = mode === 'anchor' ? n >= 1 : n >= minReplace;
    confirmBtn.disabled = !minOk;
    if (mode === 'anchor' && n >= 2) {
      confirmBtn.textContent = t('Ancorar cor ① — usar só a primeira escolha');
      noteEl.textContent = t('No modo âncora, só a primeira escolha vira a cor-semente. Troque para "Substituir a paleta inteira" para usar as {n} escolhidas.', { n });
    } else if (mode === 'anchor') {
      confirmBtn.textContent = t('Ancorar cor ① — usar só a primeira escolha');
      noteEl.textContent = '';
    } else {
      confirmBtn.textContent = t('Usar {n} cor(es) selecionada(s)', { n });
      noteEl.textContent = n > 0 && n < minReplace ? t('Escolha ao menos {n} cores para substituir a paleta.', { n: minReplace }) : '';
    }
  }

  swatches.forEach(b => b.onclick = () => {
    const h = b.dataset.hex!; const i = picked.indexOf(h);
    if (i >= 0) picked.splice(i, 1); else picked.push(h);
    refresh();
  });
  modeBtns.forEach(b => b.onclick = () => {
    mode = b.dataset.m as PickMode;
    modeBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    refresh();
  });
  host.querySelector<HTMLButtonElement>('[data-act="all"]')!.onclick = () => { picked = swatches.map(b => b.dataset.hex!); reversed = false; refresh(); };
  host.querySelector<HTMLButtonElement>('[data-act="none"]')!.onclick = () => { picked = []; reversed = false; refresh(); };
  revBtn.onclick = () => { reversed = !reversed; picked = picked.slice().reverse(); refresh(); };
  confirmBtn.onclick = () => {
    if (confirmBtn.disabled) return;
    let final = picked.slice();
    if (mode === 'replace' && final.length > 6) final = final.slice(0, 6);
    onConfirm(final, mode);
  };

  refresh();
}
