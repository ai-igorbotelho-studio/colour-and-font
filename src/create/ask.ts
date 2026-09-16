/* ── Cliente do assistente (Claude dentro de Auge) ──
   Fala com a Pages Function /api/claude. Puro: sem DOM, sem estado global. A chave
   da API vive no servidor; aqui só trafega a conversa. Framework-agnóstico — qualquer
   superfície de UI pode importar askAuge() e renderizar o resultado como preferir. */
import { isEn } from '../i18n';

export interface AskMsg { role: 'user' | 'assistant'; content: string }
/** Uma chamada de ferramenta que o Claude fez ao motor, com a saída determinística. */
export interface ToolCall { name: string; input: unknown; output: unknown }
export interface AskResult { reply: string; tools: ToolCall[]; note?: string }

/**
 * Envia a conversa ao assistente e devolve a resposta em prosa + as chamadas de
 * ferramenta (paletas/pareamentos/propostas já geradas pelo motor).
 * @param messages histórico da conversa (o primeiro item deve ser do usuário)
 * @param opts.endpoint sobrescreve a rota (padrão /api/claude)
 * @param opts.signal AbortSignal para cancelar
 */
export async function askAuge(messages: AskMsg[], opts: { endpoint?: string; signal?: AbortSignal } = {}): Promise<AskResult> {
  const res = await fetch(opts.endpoint || '/api/claude', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, lang: isEn() ? 'en' : 'pt' }),
    signal: opts.signal,
  });
  const data = await res.json().catch(() => ({})) as Partial<AskResult> & { error?: string };
  if (!res.ok) throw new Error(data.error || `Assistant error ${res.status}`);
  return { reply: data.reply || '', tools: data.tools || [], note: data.note };
}
