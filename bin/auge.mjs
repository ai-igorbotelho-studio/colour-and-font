#!/usr/bin/env node
/* CLI de Auge: node bin/auge.mjs <comando> '<json>'  (ou JSON pelo stdin).
   Comandos: options | palette | colours | pairing | proposals. Saída em JSON. */
import * as A from '../agent/dist/auge.mjs';
const map = { options: 'listOptions', palette: 'palette', colours: 'paletteFromColours', colors: 'paletteFromColours', pairing: 'pairing', proposals: 'proposals' };
const cmd = process.argv[2], raw = process.argv[3];
async function main() {
  if (!cmd || !map[cmd]) { console.error('usage: auge <options|palette|colours|pairing|proposals> [json]'); process.exit(2); }
  let arg = raw; if (arg === undefined && !process.stdin.isTTY) { arg = await new Promise(r => { let s = ''; process.stdin.on('data', d => s += d).on('end', () => r(s.trim())); }); }
  let input = {}; try { if (arg) input = JSON.parse(arg); } catch { console.error('invalid JSON argument'); process.exit(2); }
  A.init(input.lang === 'pt' ? 'pt' : 'en');
  const out = cmd === 'colours' || cmd === 'colors' ? A.paletteFromColours(input.hexes || input, input) : A[map[cmd]](input);
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}
main();
