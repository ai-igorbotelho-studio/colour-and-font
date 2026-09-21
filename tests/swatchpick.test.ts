import { describe, it, expect } from 'vitest';
import { applyPick } from '../src/core/imgpicker-grid';

describe('applyPick', () => {
  const hexes = ['#111111', '#222222', '#333333', '#444444'];

  it('preserva a ordem de dominância quando não invertido', () => {
    expect(applyPick(hexes, ['#333333', '#111111'], false)).toEqual(['#111111', '#333333']);
  });

  it('inverte a ordem do subconjunto escolhido quando invertido', () => {
    expect(applyPick(hexes, ['#333333', '#111111'], true)).toEqual(['#333333', '#111111']);
  });

  it('ignora hexes não escolhidos', () => {
    expect(applyPick(hexes, ['#222222'], false)).toEqual(['#222222']);
  });

  it('escolher tudo, sem inversão, reproduz a extração original (fidelidade da referência)', () => {
    expect(applyPick(hexes, hexes.slice(), false)).toEqual(hexes);
  });

  it('vazio quando nada escolhido', () => {
    expect(applyPick(hexes, [], false)).toEqual([]);
  });
});
