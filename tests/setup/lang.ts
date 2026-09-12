/* Os testes de referência comparam com o original em português: fixam o idioma em PT
   antes de qualquer módulo da aplicação ser importado. Um teste pode escolher EN
   gravando 'fk-lang' antes do import (ver tests/i18n.test.ts). */
const g = globalThis as unknown as { localStorage?: Storage };
if (!g.localStorage) {
  const m = new Map<string, string>();
  g.localStorage = {
    getItem: (k: string) => m.has(k) ? m.get(k)! : null, setItem: (k: string, v: string) => { m.set(k, String(v)) },
    removeItem: (k: string) => { m.delete(k) }, clear: () => m.clear(), key: (i: number) => Array.from(m.keys())[i] ?? null,
    get length() { return m.size },
  } as Storage;
}
if (!g.localStorage.getItem('fk-lang')) g.localStorage.setItem('fk-lang', 'pt');
