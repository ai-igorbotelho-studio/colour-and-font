/* ═══════════ ASSISTENTE (Claude dentro de Auge) ═══════════
   Liga a caixa de conversa da página Criação à Pages Function /api/claude, via
   askAuge(). O Claude decide o que fazer e chama as ferramentas determinísticas;
   aqui só renderizamos a prosa e as cores/fontes que ele obteve do motor.
   Superfície opcional e à parte — o gerador de três propostas continua offline. */
import { askAuge, type AskMsg, type ToolCall } from './ask';
import { readable } from '../core/color';
import { copy } from '../core/dom';
import { t } from '../i18n';

interface Turn { role: 'user' | 'assistant'; text: string; tools?: ToolCall[] }
const history: AskMsg[] = [];
const turns: Turn[] = [];
let busy = false;

/* saída de uma ferramenta pode trazer cores, famílias e/ou propostas */
interface Col { hex: string; name?: string }
interface Fam { name: string }
interface Out { colours?: Col[]; families?: Fam[]; proposals?: { reading: string; colours: Col[]; families: Fam[] }[] }

const chips = (cols: Col[] = []): string => `<div class="propstrip">${cols.map(c =>
  `<button data-h="${c.hex}" style="background:${c.hex};color:${readable(c.hex)}" title="${c.hex}">${escapeText(c.name || c.hex)}</button>`).join('')}</div>`;
const famLine = (fs: Fam[] = []): string => fs.length ? `<p class="sm" style="margin:8px 0 0">${fs.map(f => escapeText(f.name)).join(' · ')}</p>` : '';

function renderTool(tc: ToolCall): string {
  const o = tc.output as Out; if (!o || typeof o !== 'object') return '';
  if (o.proposals) return o.proposals.map(p => `<div class="askprop" style="margin-top:12px"><b>${escapeText(p.reading)}</b>${chips(p.colours)}${famLine(p.families)}</div>`).join('');
  let h = ''; if (o.colours) h += chips(o.colours); if (o.families) h += famLine(o.families); return h;
}
const escapeText = (s: string): string => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

function draw(out: HTMLElement, pending = false): void {
  out.innerHTML = turns.map(tn => `<div class="askturn ask-${tn.role}">
      <p class="sm askrole">${tn.role === 'user' ? t('Você') : t('Claude')}</p>
      <div>${escapeText(tn.text).replace(/\n/g, '<br>')}</div>
      ${(tn.tools || []).map(renderTool).join('')}
    </div>`).join('')
    + (pending ? `<p class="sm askrole" aria-live="polite">${t('Claude está pensando…')}</p>` : '');
  out.querySelectorAll<HTMLButtonElement>('.propstrip button').forEach(b =>
    b.onclick = () => copy(b.dataset.h!, b.dataset.h + ' ' + t('Copiado').toLowerCase()));
}

/** Monta a caixa de conversa se ela existir nesta página. */
export function initAssistant(): void {
  const go = document.getElementById('cAskGo'); if (!go) return;
  const input = document.getElementById('cAskInput') as HTMLTextAreaElement;
  const out = document.getElementById('cAskOut') as HTMLElement;
  const clear = document.getElementById('cAskClear');

  const send = async (): Promise<void> => {
    const text = input.value.trim(); if (!text || busy) return;
    busy = true; (go as HTMLButtonElement).disabled = true;
    turns.push({ role: 'user', text }); history.push({ role: 'user', content: text });
    input.value = ''; draw(out, true);
    try {
      const r = await askAuge(history);
      const reply = r.reply || t('(sem resposta)');
      turns.push({ role: 'assistant', text: reply, tools: r.tools });
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      turns.push({ role: 'assistant', text: t('Não consegui falar com o Claude: {m}', { m: (e as Error)?.message || String(e) }) });
    } finally { busy = false; (go as HTMLButtonElement).disabled = false; draw(out); }
  };

  go.onclick = send;
  input.addEventListener('keydown', ev => { if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') { ev.preventDefault(); send(); } });
  if (clear) clear.onclick = () => { history.length = 0; turns.length = 0; out.innerHTML = ''; input.focus(); };
}
