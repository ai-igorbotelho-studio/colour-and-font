/* Um store por domínio, sem framework: estado mutável + assinantes.
   Quem altera o estado chama notify(); quem depende dele assina. */
export interface Store<T extends object> {
  state: T;
  subscribe(fn: (s: T) => void): () => void;
  notify(): void;
}
export function createStore<T extends object>(state: T): Store<T> {
  const subs = new Set<(s: T) => void>();
  return {
    state,
    subscribe(fn) { subs.add(fn); return () => { subs.delete(fn) } },
    notify() { subs.forEach(f => f(state)) }
  };
}
