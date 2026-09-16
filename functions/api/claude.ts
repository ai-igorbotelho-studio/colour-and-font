/* ═══════════ CLAUDE DENTRO DE AUGE ═══════════
   Pages Function do Cloudflare: a inteligência do Claude a serviço do motor.
   O navegador manda uma conversa em linguagem natural; aqui o Claude decide o que
   fazer — traduzir um pedido num breve, gerar, refinar ou explicar — chamando as
   MESMAS ferramentas determinísticas de agent/tools.mjs. O Claude interpreta; o
   motor decide. A chave (ANTHROPIC_API_KEY) fica só no servidor, nunca no cliente.

   Sem SDK e sem dependências: no runtime dos Workers usamos fetch nativo. Isto é
   uma superfície opcional e separada — a página Criação continua 100% offline. */
import * as A from '../../agent/dist/auge.mjs';
import { TOOLS } from '../../agent/tools.mjs';

const API = 'https://api.anthropic.com/v1/messages';
const MAX_STEPS = 6; // no máximo esta quantidade de rodadas de ferramentas por pedido

const SYSTEM = `You are the in-app assistant of Auge, a colour and typography instrument built on Goethe's wheel, OKLab interpolation and a pool of ~130 free type families.

You have tools that ARE the deterministic engine of Auge. You interpret the person's request; the engine decides the actual colours and fonts. Never invent hex values, font names or the maths yourself — always obtain them by calling a tool. Do what the request needs:
- vague intent in words ("a calming herbal-tea brand, Japanese and quiet") → call auge_list_options once if unsure of valid values, then auge_palette / auge_pairing / auge_proposals.
- "three proposals", "a full direction" → auge_proposals.
- already-sampled colours ("#2E4E9E #F2C14E …") → auge_palette_from_colours.
- "make it warmer / calmer / bolder" → adjust the brief and regenerate (change range/stance/scheme/seed) with the same tool.
- "explain / why does this work" → answer in prose from the tool output.
Every field of a brief accepts an index, a slug or a name; matching is by prefix. Use a fixed seed only when the person asks to reproduce a result; otherwise vary it.
Reply in the person's language (English or Portuguese). Be brief: name the colours (hex + name) and the families, and one or two sentences of reasoning. Do not dump raw JSON.`;

interface Env { ANTHROPIC_API_KEY?: string; AUGE_CLAUDE_MODEL?: string; AUGE_CLAUDE_EFFORT?: string }
type Block = { type: string; [k: string]: unknown };
type Msg = { role: string; content: unknown };

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

/* executa uma ferramenta pelo mesmo despacho do servidor MCP */
function runTool(name: string, args: Record<string, unknown>): unknown {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) throw new Error('Unknown tool: ' + name);
  const fn = tool.fn as keyof typeof A;
  return name === 'auge_palette_from_colours'
    ? (A.paletteFromColours as (h: string[], o: unknown) => unknown)((args.hexes as string[]) || [], args)
    : (A[fn] as (a: unknown) => unknown)(args);
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const key = env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'ANTHROPIC_API_KEY não está configurada. Adicione-a como secret no painel do Cloudflare Pages para ativar o assistente.' }, 501);

  let body: { messages?: Msg[]; lang?: string };
  try { body = await request.json(); } catch { return json({ error: 'Corpo inválido: envie { messages: [...] }' }, 400); }
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  if (!incoming.length) return json({ error: 'Nenhuma mensagem.' }, 400);

  A.init(body.lang === 'pt' ? 'pt' : 'en');
  const model = env.AUGE_CLAUDE_MODEL || 'claude-opus-5';
  const effort = env.AUGE_CLAUDE_EFFORT || 'medium'; // interativo: 'medium' equilibra qualidade e custo
  const tools = TOOLS.map(({ name, description, inputSchema }) => ({ name, description, input_schema: inputSchema }));
  const messages: Msg[] = incoming.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
  const used: { name: string; input: unknown; output: unknown }[] = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 4096, system: SYSTEM, tools,
        thinking: { type: 'adaptive' }, output_config: { effort }, messages }),
    });
    if (!res.ok) { const detail = await res.text(); return json({ error: 'Erro da API do Claude', status: res.status, detail }, 502); }
    const data = await res.json() as { content: Block[]; stop_reason: string };

    if (data.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: data.content }); // preserva blocos (inclui thinking)
      const results: Block[] = [];
      for (const block of data.content) {
        if (block.type !== 'tool_use') continue;
        const name = block.name as string, input = (block.input as Record<string, unknown>) || {};
        try { const out = runTool(name, input); used.push({ name, input, output: out });
          results.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(out) });
        } catch (e) {
          results.push({ type: 'tool_result', tool_use_id: block.id, is_error: true, content: 'Error: ' + ((e as Error)?.message || e) });
        }
      }
      messages.push({ role: 'user', content: results });
      continue; // deixa o Claude ler os resultados e responder
    }

    const reply = data.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('\n').trim();
    return json({ reply, tools: used });
  }
  return json({ reply: '', tools: used, note: 'Limite de passos atingido.' });
};
