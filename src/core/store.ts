/* ═══════════ PERSISTÊNCIA ═══════════
   Mesmo contrato de antes (list/get/set), agora sobre localStorage.
   Se o navegador bloquear o armazenamento, cai para memória de sessão. */
export interface Stored { key: string; value: string }

const MEM: Record<string, string> = {};
const ls = (): Storage | null => { try { const l = window.localStorage; l.getItem('__fk'); return l } catch (_) { return null } };

export const store = {
  async list(pre: string): Promise<{ keys: string[] }> {
    const l = ls(); const keys: string[] = [];
    if (l) { for (let i = 0; i < l.length; i++) { const k = l.key(i); if (k && k.startsWith(pre)) keys.push(k) } }
    Object.keys(MEM).forEach(k => { if (k.startsWith(pre) && !keys.includes(k)) keys.push(k) });
    return { keys: keys.sort() };
  },
  async get(k: string): Promise<Stored | null> {
    const l = ls(); const v = l ? l.getItem(k) : null;
    if (v !== null) return { key: k, value: v };
    return MEM[k] !== undefined ? { key: k, value: MEM[k] } : null;
  },
  async set(k: string, v: string): Promise<boolean> {
    let ok = false; const l = ls();
    if (l) try { l.setItem(k, v); ok = true } catch (_) { ok = false }
    MEM[k] = v; return ok;
  }
};
