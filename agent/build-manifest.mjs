/* Gera public/agent/manifest.json e public/llms.txt a partir do núcleo e dos schemas. */
import { writeFileSync, mkdirSync } from 'node:fs';
import * as A from './dist/auge.mjs';
import { TOOLS } from './tools.mjs';
A.init('en');
mkdirSync('public/agent', { recursive: true });
const manifest = {
  name: 'Auge', version: A.VERSION,
  description: 'Colour and typography instrument. Palettes from Goethe’s wheel, type pairing across ~130 free families, three-proposal briefs. Deterministic, offline, no network calls.',
  homepage: 'https://colour-and-font.pages.dev',
  invariants: A.INVARIANTS,
  routes: { mcp: 'node agent/mcp-server.mjs', cli: 'node bin/auge.mjs <command> [json]', esm: "import * as auge from 'auge/agent/dist/auge.mjs'" },
  tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
  options: A.listOptions(),
};
writeFileSync('public/agent/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
const llms = `# Auge\n\n> ${manifest.description}\n\nSite: ${manifest.homepage}\nAgent manifest: ${manifest.homepage}/agent/manifest.json\nGuide: AGENTS.md in the repository.\n\n## Using Auge from an agent\n\nThree equivalent routes, all offline and deterministic (same seed = same output):\n\n- MCP server (recommended in Claude): \`node agent/mcp-server.mjs\` exposes the tools ${TOOLS.map(t => t.name).join(', ')}.\n- CLI: \`node bin/auge.mjs <options|palette|colours|pairing|proposals> '<json>'\`.\n- ESM import of \`agent/dist/auge.mjs\`.\n\nCall auge_list_options first to get every valid intention, field, scheme, lens, cultural reference, musical style, boldness range, font bank and class.\n\nInvariants: ${A.INVARIANTS}\n`;
writeFileSync('public/llms.txt', llms);
console.log('manifest + llms.txt written');
