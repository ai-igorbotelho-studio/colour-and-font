/* Cobre a API headless (src/api.ts): a superfície que agentes e a CLI consomem.
   Verifica formato das saídas e, sobretudo, determinismo — a mesma entrada com a
   mesma semente devolve sempre a mesma saída. */
import { describe, it, expect } from 'vitest';
import * as A from '../src/api';

A.init('en');

const isHex = (h: unknown): boolean => typeof h === 'string' && /^#[0-9A-F]{6}$/.test(h);

describe('listOptions', () => {
  it('lists every brief dimension with indices and labels', () => {
    const o = A.listOptions() as Record<string, { index?: number; label?: string; key?: string }[]>;
    for (const key of ['intentions', 'fields', 'schemes', 'lenses', 'cultures', 'music']) {
      expect(Array.isArray(o[key])).toBe(true);
      expect(o[key].length).toBeGreaterThan(0);
      expect(typeof o[key][0].label).toBe('string');
    }
    expect((o.ranges as { key: string }[]).map(r => r.key)).toContain('disruptivo');
    expect((o.readings as unknown[]).length).toBe(3);
  });
});

describe('palette', () => {
  it('returns enriched colours in the requested count', () => {
    const p = A.palette({ intention: 'Joy and clarity', scheme: 'Analogous', n: 5, seed: 0.2 }) as Record<string, unknown>;
    const cols = p.colours as Record<string, unknown>[];
    expect(cols).toHaveLength(5);
    for (const c of cols) {
      expect(isHex(c.hex)).toBe(true);
      expect(typeof c.name).toBe('string');
      expect(Array.isArray(c.rgb)).toBe(true);
      expect(typeof c.goethe).toBe('string');
      expect((c.oklch as { L: number }).L).toBeGreaterThanOrEqual(0);
    }
  });
  it('is deterministic given a seed', () => {
    const a = A.palette({ intention: 'Grief and farewell', n: 4, seed: 0.7 });
    const b = A.palette({ intention: 'Grief and farewell', n: 4, seed: 0.7 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
  it('accepts index, slug or name interchangeably', () => {
    const byName = A.palette({ scheme: 'Complementary', seed: 0.3 }) as Record<string, unknown>;
    const byIndex = A.palette({ scheme: 6, seed: 0.3 }) as Record<string, unknown>;
    expect(byName.scheme).toBe(byIndex.scheme);
  });
  it('emits a markdown block on request', () => {
    const p = A.palette({ n: 3, seed: 0.1, markdown: true }) as Record<string, unknown>;
    expect(typeof p.markdown).toBe('string');
  });
});

describe('paletteFromColours', () => {
  it('maps supplied hex onto the wheel and names them', () => {
    const p = A.paletteFromColours(['#DE3D7D', '#00000E', '#D4E7FA']) as Record<string, unknown>;
    const cols = p.colours as Record<string, unknown>[];
    expect(cols).toHaveLength(3);
    expect(isHex(cols[0].hex)).toBe(true);
    expect((p.wheel as unknown[]).length).toBe(3);
  });
});

describe('pairing', () => {
  it('returns the requested number of families', () => {
    const r = A.pairing({ strategy: 'contraste', families: 2, seed: 0.3 }) as Record<string, unknown>;
    const fams = r.families as Record<string, unknown>[];
    expect(fams).toHaveLength(2);
    expect(typeof fams[0].name).toBe('string');
    expect(typeof fams[0].bank).toBe('string');
    expect(Array.isArray(fams[0].weights)).toBe(true);
  });
  it('is deterministic given a seed', () => {
    const a = A.pairing({ strategy: 'contraste', families: 3, seed: 0.42 });
    const b = A.pairing({ strategy: 'contraste', families: 3, seed: 0.42 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('proposals', () => {
  it('returns three complete proposals', () => {
    const r = A.proposals({ intention: 'Reverence and the sacred', culture: 'Japan', seed: 0.7 }) as Record<string, unknown>;
    const ps = r.proposals as Record<string, unknown>[];
    expect(ps).toHaveLength(3);
    for (const p of ps) {
      expect(typeof p.reading).toBe('string');
      expect((p.colours as unknown[]).length).toBeGreaterThan(0);
      expect((p.families as unknown[]).length).toBeGreaterThan(0);
      expect(typeof p.rationale).toBe('string');
    }
  });
  it('is deterministic given a seed', () => {
    const a = A.proposals({ intention: 'Joy and clarity', seed: 0.33 });
    const b = A.proposals({ intention: 'Joy and clarity', seed: 0.33 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
