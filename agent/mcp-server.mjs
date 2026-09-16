#!/usr/bin/env node
/* Servidor MCP de Auge sobre stdio (JSON-RPC 2.0, mensagens por linha). Sem dependências.
   Registre em Claude Desktop/Code como um servidor de comando: node agent/mcp-server.mjs */
import * as A from './dist/auge.mjs';
import { TOOLS } from './tools.mjs';
A.init('en');
const send = (m) => process.stdout.write(JSON.stringify(m) + '\n');
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') return reply(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'auge', version: A.VERSION } });
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return;
  if (method === 'ping') return reply(id, {});
  if (method === 'tools/list') return reply(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
  if (method === 'tools/call') {
    const tool = TOOLS.find(t => t.name === params?.name);
    if (!tool) return fail(id, -32602, 'Unknown tool: ' + params?.name);
    try {
      const args = params.arguments || {};
      const out = tool.fn === 'paletteFromColours' ? A.paletteFromColours(args.hexes || [], args) : A[tool.fn](args);
      return reply(id, { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] });
    } catch (e) { return reply(id, { isError: true, content: [{ type: 'text', text: 'Error: ' + (e && e.message || e) }] }); }
  }
  if (id !== undefined) fail(id, -32601, 'Method not found: ' + method);
}
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (line) try { handle(JSON.parse(line)); } catch { /* ignore */ } } });
