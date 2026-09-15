/* ═══════════ IMAGEM ═══════════
   Rasteriza qualquer imagem (raster ou vetor SVG) num canvas e lê dela duas
   coisas: uma paleta de cores dominantes (k-means em OKLab) e uma estimativa da
   textura tipográfica (serifa, contraste de traço, largura, peso). Tudo local:
   nenhum byte da imagem sai do navegador. Câmera do celular entra pelo mesmo
   caminho, com capture="environment". */
import { rgb2oklab, rgb2hex } from './color';
import { t } from '../i18n';

export const IMG_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif,image/svg+xml,image/heic,image/heif,image/*';

/** Carrega o arquivo, reduz para caber em max px e devolve um canvas já pintado. */
export function fileToCanvas(file: File, max = 320): Promise<HTMLCanvasElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const iw = img.naturalWidth || img.width || max, ih = img.naturalHeight || img.height || max;
      const scale = Math.min(1, max / Math.max(iw, ih));
      const w = Math.max(1, Math.round(iw * scale)), h = Math.max(1, Math.round(ih * scale));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      if (!ctx) { URL.revokeObjectURL(url); return rej(new Error('ctx')); }
      ctx.drawImage(img, 0, 0, w, h); URL.revokeObjectURL(url); res(cv);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('decode')); };
    img.src = url;
  });
}

const sq = (a: number[], b: number[]): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

/** Cores dominantes por k-means em OKLab; hex de cada grupo é a média em sRGB. */
export function extractPalette(cv: HTMLCanvasElement, n: number): string[] {
  const ctx = cv.getContext('2d', { willReadFrequently: true }); if (!ctx) return [];
  const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
  const rgb: number[][] = [], lab: number[][] = [], step = Math.max(1, Math.floor((cv.width * cv.height) / 4000));
  for (let i = 0; i < d.length; i += 4 * step) { if (d[i + 3] < 128) continue;
    const r = d[i], g = d[i + 1], b = d[i + 2]; rgb.push([r, g, b]); const o = rgb2oklab(r, g, b); lab.push([o.L, o.a, o.b]); }
  if (!rgb.length) return [];
  const k = Math.min(Math.max(1, n), lab.length);
  const cents: number[][] = [lab[Math.floor(Math.random() * lab.length)].slice()];
  while (cents.length < k) {
    const ds = lab.map(p => Math.min(...cents.map(c => sq(p, c))));
    let acc = ds.reduce((a, b) => a + b, 0) * Math.random(), idx = 0;
    for (; idx < ds.length - 1; idx++) { acc -= ds[idx]; if (acc <= 0) break; }
    cents.push(lab[idx].slice());
  }
  const asg = new Array(lab.length).fill(0);
  for (let it = 0; it < 7; it++) {
    for (let i = 0; i < lab.length; i++) { let bd = Infinity, bj = 0;
      for (let j = 0; j < k; j++) { const dd = sq(lab[i], cents[j]); if (dd < bd) { bd = dd; bj = j } } asg[i] = bj; }
    const sums = cents.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < lab.length; i++) { const s = sums[asg[i]]; s[0] += lab[i][0]; s[1] += lab[i][1]; s[2] += lab[i][2]; s[3]++; }
    for (let j = 0; j < k; j++) if (sums[j][3]) cents[j] = [sums[j][0] / sums[j][3], sums[j][1] / sums[j][3], sums[j][2] / sums[j][3]];
  }
  const rgbSum = cents.map(() => [0, 0, 0, 0]);
  for (let i = 0; i < rgb.length; i++) { const s = rgbSum[asg[i]]; s[0] += rgb[i][0]; s[1] += rgb[i][1]; s[2] += rgb[i][2]; s[3]++; }
  const order = cents.map((_, j) => j).filter(j => rgbSum[j][3]).sort((a, b) => rgbSum[b][3] - rgbSum[a][3]);
  return order.map(j => { const s = rgbSum[j]; return rgb2hex(s[0] / s[3], s[1] / s[3], s[2] / s[3]) });
}

/* ── textura tipográfica: estimativa, não reconhecimento exato ── */
export interface TypeMetrics { serif: number; ct: number; w: number; weight: number; ok: boolean }
function otsu(hist: number[], total: number): number {
  let sum = 0; for (let i = 0; i < hist.length; i++) sum += i * hist[i];
  let sumB = 0, wB = 0, best = 0, thr = hist.length / 2;
  for (let i = 0; i < hist.length; i++) { wB += hist[i]; if (!wB) continue; const wF = total - wB; if (!wF) break;
    sumB += i * hist[i]; const mB = sumB / wB, mF = (sum - sumB) / wF, v = wB * wF * (mB - mF) ** 2;
    if (v > best) { best = v; thr = i } }
  return thr;
}
const pct = (a: number[], q: number): number => a.length ? a[Math.min(a.length - 1, Math.floor(q * a.length))] : 0;

export function analyzeType(cv: HTMLCanvasElement): TypeMetrics {
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { serif: .5, ct: .3, w: .5, weight: .5, ok: false };
  const W = cv.width, H = cv.height, d = ctx.getImageData(0, 0, W, H).data, g = new Float32Array(W * H);
  let mean = 0; for (let i = 0, p = 0; i < d.length; i += 4, p++) { const y = (.2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]) / 255; g[p] = y; mean += y; }
  mean /= (W * H);
  const bins = 64, hist = new Array(bins).fill(0);
  for (let p = 0; p < g.length; p++) hist[Math.min(bins - 1, Math.floor(g[p] * bins))]++;
  const thr = otsu(hist, g.length) / bins, darkInk = mean > .5, ink = new Uint8Array(W * H);
  for (let p = 0; p < g.length; p++) ink[p] = (darkInk ? g[p] < thr : g[p] > thr) ? 1 : 0;
  let x0 = W, y0 = H, x1 = 0, y1 = 0, cnt = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ink[y * W + x]) { cnt++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const ok = cnt > W * H * .004 && cnt < W * H * .6 && x1 > x0 && y1 > y0;
  const bw = Math.max(1, x1 - x0 + 1), bh = Math.max(1, y1 - y0 + 1);
  const weight = clamp(cnt / (bw * bh) * 2.2, 0, 1);
  const runs: number[] = [];
  for (let y = y0; y <= y1; y++) { let r = 0; for (let x = x0; x <= x1; x++) { if (ink[y * W + x]) r++; else { if (r > 0) runs.push(r); r = 0; } } if (r > 0) runs.push(r); }
  runs.sort((a, b) => a - b);
  const p10 = pct(runs, .1), p50 = pct(runs, .5) || 1, p90 = pct(runs, .9) || 1;
  const ct = clamp((p90 - p10) / (p90 + 1), 0, 1);
  const w = clamp(.3 + (p50 / bh) * 2.4, .3, .62);
  const band = Math.max(1, Math.round(bh * .18)); let edge = 0, mid = 0, ea = 0, ma = 0;
  for (let y = y0; y <= y1; y++) { const near = (y - y0 < band) || (y1 - y < band);
    for (let x = x0; x <= x1; x++) { if (ink[y * W + x]) { if (near) edge++; else mid++; } if (near) ea++; else ma++; } }
  const serif = clamp(((edge / (ea || 1)) / ((mid / (ma || 1)) || 1) - .85) * 2.2, 0, 1);
  return { serif, ct, w, weight, ok };
}

/** Monta o seletor: enviar arquivo, usar câmera, remover; miniatura e nota de estado. */
export function mountImgPicker(host: HTMLElement, onFile: (f: File | null) => void, opts: { camera?: boolean } = {}): void {
  const cam = opts.camera !== false;
  host.classList.add('imgpick');
  host.innerHTML = `<div class="imgbtns">
      <button type="button" class="mini" data-k="file">${t('Enviar imagem')}</button>
      ${cam ? `<button type="button" class="mini" data-k="cam">${t('Usar câmera')}</button>` : ''}
      <button type="button" class="mini" data-k="clear" hidden>${t('Remover')}</button>
    </div>
    <input type="file" accept="${IMG_ACCEPT}" hidden data-i="file">
    <input type="file" accept="image/*" capture="environment" hidden data-i="cam">
    <div class="imgthumb" hidden aria-hidden="true"></div>
    <p class="sm imgnote" aria-live="polite"></p>`;
  const q = <T extends HTMLElement>(s: string): T => host.querySelector<T>(s)!;
  const fi = q<HTMLInputElement>('[data-i="file"]'), ci = q<HTMLInputElement>('[data-i="cam"]');
  const thumb = q<HTMLElement>('.imgthumb'), clr = q<HTMLButtonElement>('[data-k="clear"]');
  const handle = (inp: HTMLInputElement): void => { const f = inp.files && inp.files[0]; if (!f) return;
    const u = URL.createObjectURL(f); thumb.style.backgroundImage = `url("${u}")`; thumb.hidden = false; clr.hidden = false; onFile(f); inp.value = ''; };
  q<HTMLButtonElement>('[data-k="file"]').onclick = () => fi.click();
  const camBtn = host.querySelector<HTMLButtonElement>('[data-k="cam"]'); if (camBtn) camBtn.onclick = () => ci.click();
  fi.onchange = () => handle(fi); ci.onchange = () => handle(ci);
  clr.onclick = () => { thumb.hidden = true; thumb.style.backgroundImage = ''; clr.hidden = true; q('.imgnote').textContent = ''; onFile(null); };
}
