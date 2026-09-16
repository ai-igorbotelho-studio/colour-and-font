/* ── carregamento das famílias sob demanda ──
   Injeta o <link> do banco e espera a família ficar disponível, com tempo limite.
   Se a rede falhar, a reserva declarada em fam() já está em uso — avisa uma vez e segue. */
import { slug, toast } from '../core/dom';
import { t } from '../i18n';
import { fontsourceId, type Font } from '../data/fonts';

const loaded = new Set<string>();
const failed = new Set<string>();
let warned = false;
export const FONT_TIMEOUT = 6000;

export function cdnLink(f: Font): string {
  if (f.src === 'google') return `https://fonts.googleapis.com/css2?family=${f.n.replace(/ /g, '+')}:wght@${f.wts}&display=swap`;
  if (f.src === 'fontshare') return `https://api.fontshare.com/v2/css?f[]=${slug(f.n)}@${f.wts.replace(/;/g, ',')}&display=swap`;
  // Fontsource e Velvetyne: a folha "latin" traz todos os pesos e estilos do subconjunto latino
  return `https://cdn.jsdelivr.net/fontsource/css/${fontsourceId(f)}@latest/latin.css`;
}

export function loadFont(f: Font | null | undefined): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(true);
  if (!f || loaded.has(f.n)) return Promise.resolve(!failed.has(f?.n || ''));
  loaded.add(f.n);
  return new Promise(res => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = cdnLink(f);
    let done = false;
    const finish = (ok: boolean) => { if (done) return; done = true;
      if (!ok) { failed.add(f.n); if (!warned) { warned = true; toast(t('Uma família não carregou — a reserva declarada está em uso')) } }
      res(ok) };
    const timer = window.setTimeout(() => finish(false), FONT_TIMEOUT);
    l.onerror = () => { clearTimeout(timer); finish(false) };
    l.onload = () => {
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (!fonts || !fonts.load) { clearTimeout(timer); return finish(true) }
      fonts.load(`400 16px "${f.n}"`).then(faces => { clearTimeout(timer); finish(faces.length > 0) }, () => { clearTimeout(timer); finish(false) });
    };
    document.head.appendChild(l);
  });
}
export const fontFailed = (n: string): boolean => failed.has(n);
