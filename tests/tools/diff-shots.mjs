// Compara duas pastas de capturas pixel a pixel. uso: node tests/tools/diff-shots.mjs <antes> <depois> [pasta-diff]
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [A, B, OUT] = process.argv.slice(2);
if (OUT) mkdirSync(OUT, { recursive: true });
let bad = 0, total = 0;
for (const f of readdirSync(A).filter(x => x.endsWith('.png')).sort()) {
  const a = PNG.sync.read(readFileSync(`${A}/${f}`));
  let b; try { b = PNG.sync.read(readFileSync(`${B}/${f}`)) } catch (_) { console.log(`${f}: ausente em ${B}`); bad++; continue }
  total++;
  if (a.width !== b.width || a.height !== b.height) { console.log(`${f}: tamanho ${a.width}×${a.height} → ${b.width}×${b.height}`); bad++; continue }
  const diff = new PNG({ width: a.width, height: a.height });
  const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: .1 });
  const pct = n / (a.width * a.height) * 100;
  if (n > 0) { bad++; console.log(`${f}: ${n} px diferentes (${pct.toFixed(3)}%)`); if (OUT) writeFileSync(`${OUT}/${f}`, PNG.sync.write(diff)) }
}
console.log(`${total} capturas comparadas, ${bad} com diferença`);
process.exit(bad ? 1 : 0);
