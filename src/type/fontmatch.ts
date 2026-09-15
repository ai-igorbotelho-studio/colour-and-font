/* ── encontrar tipografia parecida a partir da textura de uma imagem ──
   Distância entre a estimativa (serifa, contraste, largura) e cada família do
   banco. Não é OCR de fonte: é semelhança de textura. */
import { FONTS, type Font } from '../data/fonts';
import { isSerif } from './pairing';
import type { TypeMetrics } from '../core/image';

function dist(f: Font, m: TypeMetrics): number {
  const sm = Math.abs(m.serif - (isSerif(f.cls) ? 1 : 0));
  return sm * 2.2 + Math.abs(m.ct - f.ct) * 1.7 + Math.abs(m.w - f.w) * 1.1;
}
/** As k famílias mais próximas da textura medida. */
export function similarFonts(m: TypeMetrics, k = 8): Font[] {
  return FONTS.filter(f => f.cls !== 'mono').map(f => ({ f, d: dist(f, m) })).sort((a, b) => a.d - b.d).slice(0, k).map(x => x.f);
}
/** Um par título + texto ancorado na textura: título mais próximo, texto que combine. */
export function pairingFromImage(m: TypeMetrics): Font[] {
  const ranked = FONTS.filter(f => f.cls !== 'mono').map(f => ({ f, d: dist(f, m) })).sort((a, b) => a.d - b.d);
  const disp = (ranked.find(x => x.f.role === 'display' || x.f.role === 'both') || ranked[0]).f;
  const body = (ranked.find(x => (x.f.role === 'body' || x.f.role === 'both') && x.f.n !== disp.n) || ranked.find(x => x.f.n !== disp.n) || ranked[0]).f;
  return [disp, body];
}
/** Bônus de afinidade para pontuar o título de uma proposta contra a imagem. */
export const imgAffinity = (f: Font, m: TypeMetrics): number => (1.1 - dist(f, m)) * 24;
