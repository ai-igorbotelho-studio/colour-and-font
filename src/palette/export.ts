/* ═══════════ EXPORTAÇÃO — 20 formatos e o pacote .zip ═══════════ */
import { hex2rgb, rgb2cmyk, rgb2hsl, hex2lch, lum, readable } from '../core/color';
import { nameOf } from '../core/goethe';
import { r3 } from '../core/codes';
import { $, $all, esc, slug, copy, download, toast } from '../core/dom';
import { t, locale } from '../i18n';
import { S, cur, palette, proportions, palName, type CodeFmt } from './state';
import { makeZip, type ZipEntry } from './zip';
import { gradSvgString } from './gradient';
import { hasFams } from '../type/state';
import { tipoOut } from '../type/export';
import { specBlob } from '../type/specimen';
import { mdPalette } from '../create/markdown';

export function svgPalette(w = 1200, h = 600): string {
  const hs = palette(), pr = proportions(), n = hs.length;
  const barH = h - 150; let x = 0, out = '';
  hs.forEach((c, i) => { const cw = w * pr[i] / 100;
    out += `<rect x="${x.toFixed(2)}" y="0" width="${cw.toFixed(2)}" height="${barH}" fill="${c}"/>`; x += cw });
  const cw = w / n;
  hs.forEach((c, i) => { const cx = i * cw;
    out += `<rect x="${cx.toFixed(2)}" y="${barH}" width="${cw.toFixed(2)}" height="150" fill="${c}"/>`
      + `<text x="${(cx + 16).toFixed(2)}" y="${barH + 52}" font-family="Helvetica,Arial,sans-serif" font-size="22" fill="${readable(c)}">${c}</text>`
      + `<text x="${(cx + 16).toFixed(2)}" y="${barH + 82}" font-family="Helvetica,Arial,sans-serif" font-size="14" fill="${readable(c)}" opacity=".78">rgb ${hex2rgb(c).join(' ')}</text>`
      + `<text x="${(cx + 16).toFixed(2)}" y="${barH + 104}" font-family="Helvetica,Arial,sans-serif" font-size="14" fill="${readable(c)}" opacity=".78">cmyk ${rgb2cmyk(...hex2rgb(c)).map(v => Math.round(v)).join(' ')}</text>`
      + `<text x="${(cx + 16).toFixed(2)}" y="${barH + 128}" font-family="Helvetica,Arial,sans-serif" font-size="13" fill="${readable(c)}" opacity=".6">${Math.round(pr[i])}${t('% da área')}</text>` });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>${esc(palName())}</title>${out}</svg>`;
}
export function rasterBlob(kind: 'png' | 'jpg'): Promise<Blob> {
  return new Promise((res, rej) => {
    const w = 1600, h = 800, cv = $('cv') as HTMLCanvasElement, ctx = cv.getContext('2d')!; cv.width = w; cv.height = h;
    const img = new Image(), svg = svgPalette(w, h);
    img.onload = () => { if (kind === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h) }
      ctx.drawImage(img, 0, 0, w, h);
      cv.toBlob(b => b ? res(b) : rej(0), kind === 'jpg' ? 'image/jpeg' : 'image/png', .92) };
    img.onerror = () => rej(0);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) });
}
function rasterize(kind: 'png' | 'jpg'): void {
  rasterBlob(kind).then(b => download(slug(palName()) + '.' + (kind === 'jpg' ? 'jpg' : 'png'), b))
    .catch(() => toast(t('Não foi possível rasterizar aqui — baixe o SVG')));
}
export function aseFile(): Blob {
  const hs = palette(), names = hs.map((_h, i) => `${slug(palName())}-${i + 1}`);
  let size = 12; names.forEach(nm => { size += 6 + (2 + (nm.length + 1) * 2 + 4 + 12 + 2) });
  const buf = new ArrayBuffer(size), dv = new DataView(buf); let o = 0;
  'ASEF'.split('').forEach(c => dv.setUint8(o++, c.charCodeAt(0)));
  dv.setUint16(o, 1); o += 2; dv.setUint16(o, 0); o += 2; dv.setUint32(o, hs.length); o += 4;
  hs.forEach((hex, i) => {
    const nm = names[i], bodyLen = 2 + (nm.length + 1) * 2 + 4 + 12 + 2;
    dv.setUint16(o, 0x0001); o += 2; dv.setUint32(o, bodyLen); o += 4;
    dv.setUint16(o, nm.length + 1); o += 2;
    for (let k = 0; k < nm.length; k++) { dv.setUint16(o, nm.charCodeAt(k)); o += 2 }
    dv.setUint16(o, 0); o += 2;
    'RGB '.split('').forEach(c => dv.setUint8(o++, c.charCodeAt(0)));
    const [r, g, b] = hex2rgb(hex);
    dv.setFloat32(o, r / 255); o += 4; dv.setFloat32(o, g / 255); o += 4; dv.setFloat32(o, b / 255); o += 4;
    dv.setUint16(o, 2); o += 2;
  });
  return new Blob([buf], { type: 'application/octet-stream' });
}
export function gplFile(): string {
  const hs = palette();
  return `GIMP Palette\nName: ${palName()}\nColumns: ${hs.length}\n#\n`
    + hs.map((h, i) => { const [r, g, b] = hex2rgb(h);
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${slug(palName())}-${i + 1} ${h}` }).join('\n') + '\n';
}
export function txtFile(): string {
  return palette().map((h, i) => { const [r, g, b] = hex2rgb(h), c = rgb2cmyk(r, g, b), l = hex2lch(h);
    return t('Cor {n} — {name}\n  HEX {h}\n  RGB {rgb}\n  HSL {hsl}\n  CMYK {cmyk}\n  OKLCH {ok}\n  Área {p}%', { n: i + 1, name: nameOf(S.colors[i].a), h, rgb: `${r}, ${g}, ${b}`, hsl: rgb2hsl(r, g, b).map(v => Math.round(v)).join(', '), cmyk: c.map(v => Math.round(v)).join(', '), ok: `${Math.round(l.L * 100)}% ${r3(l.C)} ${Math.round(l.H)}`, p: Math.round(proportions()[i]) }) }).join('\n\n');
}
export function csvFile(): string {
  const hs = palette(), pr = proportions();
  return t('indice,nome,hex') + ',r,g,b,h,s,l,c,m,y,k,oklch_l,oklch_c,oklch_h,area_pct\n'
    + hs.map((h, i) => { const [r, g, b] = hex2rgb(h), hl = rgb2hsl(r, g, b), cm = rgb2cmyk(r, g, b), o = hex2lch(h);
      return [i + 1, '"' + nameOf(S.colors[i].a) + '"', h, r, g, b, ...hl.map(x => x.toFixed(1)), ...cm.map(x => x.toFixed(1)),
        (o.L * 100).toFixed(1), o.C.toFixed(4), o.H.toFixed(1), pr[i].toFixed(1)].join(',') }).join('\n');
}
export function posterBlob(): Promise<Blob> { return new Promise(res => { posterDraw(); ($('cv') as HTMLCanvasElement).toBlob(b => res(b as Blob), 'image/png') }) }
function posterPng(): void { posterBlob().then(b => download(slug(palName()) + '-poster.png', b)) }
function posterDraw(): void {
  const w = 2000, h = 2500, cv = $('cv') as HTMLCanvasElement, ctx = cv.getContext('2d')!; cv.width = w; cv.height = h;
  const hs = palette(), ls = hs.map(lum), bg = hs[ls.indexOf(Math.max(...ls))], ink = hs[ls.indexOf(Math.min(...ls))], pr = proportions();
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  let x = 0; hs.forEach((c, i) => { const cw = w * pr[i] / 100; ctx.fillStyle = c; ctx.fillRect(x, 760, cw, 900); x += cw });
  ctx.fillStyle = ink; ctx.font = '500 130px Georgia, serif';
  const { E, M } = cur(); ctx.fillText(String(E.a !== null ? E.n : (M.a !== null ? M.n : 'Paleta')).slice(0, 26), 120, 320);
  ctx.font = '40px Helvetica, Arial, sans-serif'; ctx.globalAlpha = .75;
  ctx.fillText(cur().SC.n + ' · ' + cur().L.n.split(' — ')[0], 120, 400); ctx.globalAlpha = 1;
  const cw = w / hs.length;
  hs.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(i * cw, 1760, cw, 420);
    ctx.fillStyle = readable(c); ctx.font = '44px Helvetica, Arial, sans-serif';
    ctx.fillText(c, i * cw + 34, 1860);
    ctx.font = '30px Helvetica, Arial, sans-serif'; ctx.globalAlpha = .8;
    ctx.fillText('rgb ' + hex2rgb(c).join(' '), i * cw + 34, 1912);
    ctx.fillText('cmyk ' + rgb2cmyk(...hex2rgb(c)).map(v => Math.round(v)).join(' '), i * cw + 34, 1958);
    ctx.fillText(Math.round(pr[i]) + t('% da área'), i * cw + 34, 2004); ctx.globalAlpha = 1 });
  ctx.fillStyle = ink; ctx.globalAlpha = .6; ctx.font = '34px Helvetica, Arial, sans-serif';
  ctx.fillText(t('Derivada do círculo cromático de Goethe'), 120, 2350); ctx.globalAlpha = 1;
}

/* ── código ── */
export const EXT: Record<CodeFmt, string> = { css: 'css', scss: 'scss', json: 'json', tw: 'js', swift: 'swift', android: 'xml', flutter: 'dart', hex: 'txt' };
export function codeOut(f: CodeFmt): string {
  const hs = palette(), pr = proportions(), nm = palName(),
        names = hs.map((_h, i) => `cor-${i + 1}`);
  const head = `${nm} — ${t('esquema {s}', { s: cur().SC.n.toLowerCase() })}`;
  if (f === 'css') return `/* ${head} */\n:root{\n` + hs.map((h, i) => `  --${names[i]}: ${h};`).join('\n')
    + '\n}\n\n' + t('/* área sugerida */') + '\n' + pr.map((p, i) => `/* ${names[i]}: ${Math.round(p)}% */`).join('\n');
  if (f === 'scss') return `// ${head}\n` + hs.map((h, i) => `$${names[i]}: ${h};`).join('\n')
    + `\n$paleta: (${hs.map((h, i) => `"${names[i]}": ${h}`).join(', ')});`;
  if (f === 'json') return JSON.stringify({ nome: nm, esquema: cur().SC.n,
    cores: hs.map((h, i) => { const [r, g, b] = hex2rgb(h), l = hex2lch(h);
      return { nome: names[i], hex: h, rgb: [r, g, b], hsl: rgb2hsl(r, g, b).map(v => +v.toFixed(1)),
        cmyk: rgb2cmyk(r, g, b).map(v => +v.toFixed(1)), oklch: [+(l.L * 100).toFixed(1), +l.C.toFixed(4), +l.H.toFixed(1)],
        area: +pr[i].toFixed(1) } }) }, null, 2);
  if (f === 'tw') return `// tailwind.config.js — ${head}\nmodule.exports={theme:{extend:{colors:{\n`
    + hs.map((h, i) => `  "${names[i]}": "${h}",`).join('\n') + '\n}}}}';
  if (f === 'swift') return `// ${head}\nimport SwiftUI\nextension Color{\n`
    + hs.map((h, i) => { const [r, g, b] = hex2rgb(h);
      return `  static let ${names[i].replace(/-/g, '')} = Color(red: ${r3(r / 255)}, green: ${r3(g / 255)}, blue: ${r3(b / 255)})` }).join('\n') + '\n}';
  if (f === 'android') return `<!-- ${head} -->\n<resources>\n`
    + hs.map((h, i) => `  <color name="${names[i].replace(/-/g, '_')}">#FF${h.slice(1)}</color>`).join('\n') + '\n</resources>';
  if (f === 'flutter') return `// ${head}\nclass Paleta{\n`
    + hs.map((h, i) => `  static const ${names[i].replace(/-/g, '')} = Color(0xFF${h.slice(1)});`).join('\n') + '\n}';
  return hs.join('\n');
}
export function drawOut(): void { $('out').textContent = codeOut(S.fmt) }

function allText(): string {
  return (['css', 'scss', 'json', 'tw', 'swift', 'android', 'flutter', 'hex'] as CodeFmt[])
    .map(f => `/* ══ ${f.toUpperCase()} ══ */\n` + codeOut(f)).join('\n\n')
    + '\n\n/* ══ CSV ══ */\n' + csvFile() + '\n\n' + t('/* ══ TODOS OS CÓDIGOS ══ */') + '\n' + txtFile();
}
function doExport(k: string): void {
  const base = slug(palName());
  if (k === 'svg') download(base + '.svg', svgPalette(), 'image/svg+xml');
  else if (k === 'png' || k === 'jpg') rasterize(k);
  else if (k === 'poster') posterPng();
  else if (k === 'ase') download(base + '.ase', aseFile());
  else if (k === 'gpl') download(base + '.gpl', gplFile(), 'text/plain');
  else if (k === 'csv') download(base + '.csv', csvFile(), 'text/csv');
  else if (k === 'md') download(base + '.md', mdPalette(), 'text/markdown');
  else if (k === 'all') download(base + t('-tudo') + '.txt', allText(), 'text/plain');
  else download(base + '.txt', txtFile(), 'text/plain');
}

/* ── pacote .zip ── */
const ZIPFMTS_PT = [
  { k: 'svg', n: 'SVG da paleta' }, { k: 'png', n: 'PNG da paleta' }, { k: 'jpg', n: 'JPG da paleta' },
  { k: 'poster', n: 'Pôster PNG' }, { k: 'ase', n: 'ASE da Adobe' }, { k: 'gpl', n: 'GPL do GIMP' },
  { k: 'csv', n: 'CSV' }, { k: 'txt', n: 'Todos os códigos em txt' }, { k: 'grad', n: 'SVG do gradiente' },
  { k: 'md', n: 'Markdown para o Claude' },
  { k: 'css', n: 'CSS' }, { k: 'scss', n: 'SCSS' }, { k: 'json', n: 'JSON' }, { k: 'tw', n: 'Tailwind' },
  { k: 'swift', n: 'SwiftUI' }, { k: 'android', n: 'Android XML' }, { k: 'flutter', n: 'Flutter' }, { k: 'hex', n: 'Hex puro' },
  { k: 'tipocss', n: 'CSS da tipografia' }, { k: 'tipohtml', n: 'HTML com o texto' }, { k: 'amostra', n: 'PNG da amostra' }
];
const ZIPFMTS = ZIPFMTS_PT.map(f => ({ k: f.k, n: t(f.n) }));
const ZIPON = new Set(['svg', 'png', 'ase', 'css', 'json', 'md']);
async function bytesOf(b: Blob): Promise<Uint8Array> { return new Uint8Array(await b.arrayBuffer()) }
async function fileFor(k: string): Promise<ZipEntry | null> {
  const te = new TextEncoder(), base = slug(palName());
  if (k === 'svg') return { name: base + '.svg', data: te.encode(svgPalette()) };
  if (k === 'png') return { name: base + '.png', data: await bytesOf(await rasterBlob('png')) };
  if (k === 'jpg') return { name: base + '.jpg', data: await bytesOf(await rasterBlob('jpg')) };
  if (k === 'poster') return { name: base + '-poster.png', data: await bytesOf(await posterBlob()) };
  if (k === 'ase') return { name: base + '.ase', data: await bytesOf(aseFile()) };
  if (k === 'gpl') return { name: base + '.gpl', data: te.encode(gplFile()) };
  if (k === 'csv') return { name: base + '.csv', data: te.encode(csvFile()) };
  if (k === 'txt') return { name: base + t('-codigos') + '.txt', data: te.encode(txtFile()) };
  if (k === 'grad') return { name: 'gradient.svg', data: te.encode(gradSvgString()) };
  if (k === 'md') return { name: base + '.md', data: te.encode(mdPalette()) };
  if (k === 'tipocss') { const t = tipoOut('css'); return t ? { name: 'tipografia.css', data: te.encode(t) } : null }
  if (k === 'tipohtml') { const t = tipoOut('html'); return t ? { name: 'amostra.html', data: te.encode(t) } : null }
  if (k === 'amostra') { if (!hasFams()) return null; return { name: 'amostra.png', data: await bytesOf(await specBlob()) } }
  return { name: base + '.' + EXT[k as CodeFmt], data: te.encode(codeOut(k as CodeFmt)) };
}

export function initExport(): void {
  $all<HTMLButtonElement>(document, '[data-ex]').forEach(b => b.onclick = () => doExport(b.dataset.ex!));
  $('expZip').innerHTML = ZIPFMTS.map(f =>
    `<label><input type="checkbox" data-z="${f.k}" ${ZIPON.has(f.k) ? 'checked' : ''}>${f.n}</label>`).join('');
  $('zipAll').onclick = () => $all<HTMLInputElement>($('expZip'), 'input').forEach(i => i.checked = true);
  $('zipNone').onclick = () => $all<HTMLInputElement>($('expZip'), 'input').forEach(i => i.checked = false);
  $('zipGo').onclick = async () => {
    const ks = $all<HTMLInputElement>($('expZip'), 'input').filter(i => i.checked).map(i => i.dataset.z!);
    if (!ks.length) return toast(t('Marque ao menos um formato'));
    const btn = $('zipGo') as HTMLButtonElement, lbl = btn.textContent; btn.textContent = t('Montando…'); btn.disabled = true;
    const files: ZipEntry[] = [];
    for (const k of ks) { try { const f = await fileFor(k); if (f) files.push(f) } catch (_) {} }
    btn.textContent = lbl; btn.disabled = false;
    if (!files.length) return toast(t('Nenhum formato pôde ser gerado'));
    files.push({ name: t('leiame') + '.txt', data: new TextEncoder().encode(
      `${palName()}\n\n${t('Esquema: {s}', { s: cur().SC.n })}\n${t('Cores: {c}', { c: palette().join('  ') })}\n`
      + t('Área: {a}', { a: proportions().map((v, i) => t('cor {n} {p}%', { n: i + 1, p: Math.round(v) })).join(' · ') }) + '\n\n'
      + t('Derivada do círculo cromático de Goethe. Conversões em OKLab, croma ajustado ao gamut sRGB.') + '\n'
      + t('Gerado em {d}.', { d: new Date().toLocaleString(locale()) }) + '\n') });
    download(slug(palName()) + '.zip', makeZip(files));
    toast(t('{n} arquivos no pacote', { n: files.length }));
  };
  $('expCode').innerHTML = (Object.keys(EXT) as CodeFmt[]).map(f => `<button class="mini" data-cf="${f}">${f === 'tw' ? 'Tailwind' : f === 'hex' ? t('Hex puro') : f.toUpperCase()}</button>`).join('');
  $all<HTMLButtonElement>($('expCode'), 'button').forEach(b => b.onclick = () => {
    const f = b.dataset.cf as CodeFmt; download(slug(palName()) + '.' + EXT[f], codeOut(f), 'text/plain') });
  $('expBtn').onclick = () => { $('expName').textContent = palName() + ' — ' + palette().join('  ');
    $('exp').classList.add('on'); document.body.style.overflow = 'hidden' };
  $('expClose').onclick = () => { $('exp').classList.remove('on'); document.body.style.overflow = '' };
  $('exp').onclick = e => { if ((e.target as Element).id === 'exp') $('expClose').click() };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('exp').classList.contains('on')) $('expClose').click() });

  $all<HTMLButtonElement>($('codeTabs'), 'button').forEach(b => b.onclick = () => {
    S.fmt = b.dataset.f as CodeFmt; $all($('codeTabs'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); drawOut() });
  $('copy').onclick = () => copy($('out').textContent || '', t('Código copiado'));
  $('dlTxt').onclick = () => download(slug(palName()) + '.' + EXT[S.fmt], $('out').textContent || '', 'text/plain');
}
