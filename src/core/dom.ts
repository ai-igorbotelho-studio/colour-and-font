/* ═══════════ UTILITÁRIOS DE INTERFACE ═══════════ */
import { t } from '../i18n';
export const $ = (id: string): HTMLElement => document.getElementById(id) as HTMLElement;
export const $v = (id: string): string => (document.getElementById(id) as HTMLInputElement).value;
export const $n = (id: string): number => +(document.getElementById(id) as HTMLInputElement).value;
export const $set = (id: string, v: string | number): void => { (document.getElementById(id) as HTMLInputElement).value = String(v) };
export const $all = <E extends Element = HTMLElement>(el: ParentNode, sel: string): E[] => Array.from(el.querySelectorAll<E>(sel));

export const esc = (s: unknown): string => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]);
export const slug = (s: string): string => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const norm = (t: string): string => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

let toastTimer = 0;
export function toast(t: string): void {
  const el = $('toast'); if (!el) return; el.textContent = t; el.classList.add('on');
  clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el.classList.remove('on'), 1800);
}
export function copy(txt: string, msg?: string): void {
  if (!navigator.clipboard) return toast(t('O navegador bloqueou a cópia'));
  navigator.clipboard.writeText(txt).then(() => toast(msg || t('Copiado'))).catch(() => toast(t('O navegador bloqueou a cópia')));
}

/* iOS dentro de WebView não honra <a download>. Quando o navegador oferece
   compartilhar arquivos, esse é o caminho; senão, o link de sempre. */
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export function download(name: string, content: Blob | string | ArrayBuffer | Uint8Array, mime?: string): void {
  try {
    const blob = content instanceof Blob ? content : new Blob([content as BlobPart], { type: mime || 'text/plain' });
    if (isIOS() && typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
      const file = new File([blob], name, { type: blob.type || mime || 'application/octet-stream' });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: name }).then(() => toast(name + t(' compartilhado'))).catch(() => anchor(blob, name));
        return;
      }
    }
    anchor(blob, name);
  } catch (e) { toast(t('O navegador bloqueou o download — use copiar')) }
}
function anchor(blob: Blob, name: string): void {
  const u = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = u; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(u); a.remove() }, 800); toast(name + t(' gerado'));
}

/** Preenche um <select> a partir de uma lista de {n} — valor = índice, ou a chave pedida. */
export function fillSel<T extends { n: string }>(el: HTMLElement, arr: T[], key?: keyof T & string): void {
  el.innerHTML = arr.map((o, i) => `<option value="${key ? String(o[key]) : i}">${esc(o.n)}</option>`).join('');
}
