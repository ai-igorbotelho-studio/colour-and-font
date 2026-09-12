/* Contraste dos tokens de interface — mede com a fórmula do WCAG 2.1 e derruba o build
   se algum par de texto cair abaixo de 4,5:1, em luz ou em treva. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ratio } from '../src/core/color';

const css = readFileSync(path.resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
function block(sel: string): Record<string, string> {
  const m = css.match(new RegExp(sel.replace(/[[\]"]/g, '\\$&') + '\\{([^}]*)\\}'))!;
  const out: Record<string, string> = {};
  m[1].split(';').forEach(d => { const [k, v] = d.split(':').map(s => s && s.trim()); if (k && k.startsWith('--')) out[k] = v });
  return out;
}
const luz = block(':root'), treva = block('html[data-ground="treva"]');
const pairs: [string, string][] = [['--ink', '--ground'], ['--ink', '--panel'], ['--ink', '--field'], ['--ink', '--card'], ['--soft', '--ground'], ['--soft', '--panel'], ['--soft', '--field'], ['--soft', '--card'], ['--rail-ink', '--rail'], ['--rail-soft', '--rail'], ['--rail-on-ink', '--rail-on']];

describe.each([['luz', luz], ['treva', treva]] as const)('tokens em %s', (_g, t) => {
  it.each(pairs)('%s sobre %s alcança 4,5:1', (fg, bg) => {
    expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
  it('os pares principais alcançam AAA (7:1)', () => {
    expect(ratio(t['--ink'], t['--ground'])).toBeGreaterThanOrEqual(7);
    expect(ratio(t['--soft'], t['--ground'])).toBeGreaterThanOrEqual(4.5);
  });
});
