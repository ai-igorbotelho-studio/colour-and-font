/* ═══════════ IDIOMA ═══════════
   Inglês britânico é a língua primária; português é a segunda. As chaves dos
   dicionários são o texto em português (a fonte), o valor é o inglês.
   - t(): strings geradas em JS, com {variáveis}
   - translateDom(): nós de texto, placeholders, títulos e rótulos ARIA do HTML estático
   - localizeData(): troca em memória os campos de texto dos dados (intenções, campos, lentes…)
   Trocar de idioma grava a escolha e recarrega — tudo se monta de novo no idioma certo. */
import { UI } from './ui-en';
import { localizeData } from './data-en';

export type Lang = 'en' | 'pt';
const KEY = 'fk-lang';
let lang: Lang = 'en';
try { const s = localStorage.getItem(KEY); if (s === 'pt' || s === 'en') lang = s } catch (_) {}

export const getLang = (): Lang => lang;
export function setLang(l: Lang): void { try { localStorage.setItem(KEY, l) } catch (_) {} location.reload() }
export const isEn = (): boolean => lang === 'en';

export function t(pt: string, vars?: Record<string, string | number>): string {
  let s = lang === 'en' ? (UI[pt] ?? pt) : pt;
  if (vars) for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}
/** Número com o separador decimal do idioma. */
export const dec = (n: number, digits: number): string => lang === 'en' ? n.toFixed(digits) : n.toFixed(digits).replace('.', ',');
/** Locale para datas e listas. */
export const locale = (): string => lang === 'en' ? 'en-GB' : 'pt-BR';

const ATTRS = ['placeholder', 'title', 'aria-label'];
export function translateDom(root: ParentNode = document): void {
  if (lang !== 'en') return;
  const walker = document.createTreeWalker(root as Node, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = []; let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  for (const tn of nodes) {
    const p = tn.parentElement; if (!p || p.tagName === 'SCRIPT' || p.tagName === 'STYLE') continue;
    const raw = tn.data, key = raw.replace(/\s+/g, ' ').trim(); if (!key) continue;
    const en = UI[key]; if (en === undefined) continue;
    const lead = raw.match(/^\s*/)![0], tail = raw.match(/\s*$/)![0];
    tn.data = lead + en + tail;
  }
  (root as ParentNode).querySelectorAll<HTMLElement>('[placeholder],[title],[aria-label]').forEach(el => {
    for (const a of ATTRS) { const v = el.getAttribute(a); if (v && UI[v.trim()] !== undefined) el.setAttribute(a, UI[v.trim()]) } });
  const title = document.querySelector('title'); if (title && UI[title.textContent!.trim()]) title.textContent = UI[title.textContent!.trim()];
  document.querySelectorAll<HTMLMetaElement>('meta[name="description"],meta[property="og:title"],meta[property="og:description"]').forEach(m => {
    const v = m.getAttribute('content'); if (v && UI[v.trim()]) m.setAttribute('content', UI[v.trim()]) });
}

/** Chamar antes de qualquer montagem de interface. */
export function initI18n(): void {
  document.documentElement.lang = lang === 'en' ? 'en-GB' : 'pt-BR';
  if (lang === 'en') { localizeData(); translateDom(document) }
}
