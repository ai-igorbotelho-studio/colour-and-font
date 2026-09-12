/* ── códigos da tipografia: CSS, @font-face por formato, link da CDN, Tailwind, HTML, download ── */
import { readable } from '../core/color';
import { $, $v, $n, $all, esc, slug, copy, download } from '../core/dom';
import { t } from '../i18n';
import { sampleText } from './specimen';
import { ROLES, SAMPLE_TXT, type Font } from '../data/fonts';
import { T, hasFams, type TypeFmt } from './state';
import { fam } from './pairing';
import { roleColors, roleCss, roleCfg, parseText } from './hierarchy';
export { cdnLink } from './loader';
import { cdnLink } from './loader';

export function dlLink(f: Font): string {
  return f.src === 'google' ? `https://fonts.google.com/specimen/${f.n.replace(/ /g, '+')}`
    : `https://www.fontshare.com/fonts/${slug(f.n)}`;
}
export function fontsourceUrl(f: Font, fmt: string): string {
  const s = slug(f.n);
  if (fmt === 'var') return `https://cdn.jsdelivr.net/fontsource/fonts/${s}:vf@latest/latin-wght-normal.woff2`;
  return `https://cdn.jsdelivr.net/fontsource/fonts/${s}@latest/latin-400-normal.${fmt === 'woff' ? 'woff' : 'woff2'}`;
}
export function drawTOut(): void {
  const f = T.fmt, list = [T.disp, T.body, T.mono].filter((x): x is Font => !!x), fmt = $v('tFmt'),
        base = $n('tBase'), rt = $n('tRatio'), lh = $n('tLh') / 100, meas = $n('tMeasure');
  let s = '';
  if (f === 'css') {
    const C = roleColors(), sel: Record<string, string> = { rotulo: '.rotulo', titulo: 'h1, .titulo', subtitulo: 'h2, .subtitulo',
      paragrafo: 'p, .paragrafo', destaque: '.destaque', citacao: 'blockquote, .citacao',
      referencia: 'figcaption, .referencia', botao: '.botao' };
    s = `/* ${list.map(x => x.n).join(' · ')} */\n:root{\n`
     + T.fams.map((x, i) => `  --fonte-${i + 1}: ${fam(x)};`).join('\n') + '\n'
     + `  --corpo: ${base}px;\n  --escala: ${rt};\n  --medida: ${meas}ch;\n`
     + `  --fundo: ${C.bg};\n  --tinta: ${C.fg};\n  --acento: ${C.ac};\n  --apagado: ${C.mut};\n}\n\n`
     + `body{background:var(--fundo);color:var(--tinta);font-family:${fam(roleCfg('paragrafo').f)};font-size:var(--corpo);line-height:${lh}}\n`
     + `p{max-width:var(--medida)}\n\n` + t('/* níveis da hierarquia */') + `\n`
     + ROLES.filter(r => !T.off[r.k]).map(r => { const st = roleCss(r.k), c = st.c;
        return `${sel[r.k]}{\n  font-family:${fam(c.f)};\n  font-weight:${c.wt};\n  font-size:${st.size}px;\n`
         + `  line-height:${st.lh};\n  letter-spacing:${st.tr}em;\n  color:${st.col};\n`
         + (c.it ? '  font-style:italic;\n' : '')
         + (c.cs !== 'none' ? `  text-transform:${c.cs === 'upper' ? 'uppercase' : c.cs === 'lower' ? 'lowercase' : 'capitalize'};\n` : '')
         + (r.k === 'botao' ? `  background:${C.ac};\n  color:${readable(C.ac)};\n  display:inline-block;\n  padding:.7em 1.3em;\n` : '')
         + (r.k === 'citacao' ? `  border-left:2px solid ${st.col};\n  padding-left:18px;\n` : '')
         + '}' }).join('\n');
  } else if (f === 'face') {
    if (fmt === 'none') s = t('Nenhum arquivo escolhido — use a aba do link da CDN.');
    else s = list.map(x => {
      const ff = fmt === 'ttf' ? 'truetype' : fmt === 'otf' ? 'opentype' : fmt === 'woff' ? 'woff' : 'woff2';
      const ex = fmt === 'var' ? 'woff2' : fmt;
      return t('/* {n} — baixe em {u} */', { n: x.n, u: dlLink(x) }) + `\n@font-face{\n  font-family:"${x.n}";\n  src:url("/fonts/${slug(x.n)}-400.${ex}") format("${ff}"${fmt === 'var' ? ' supports variations' : ''});\n  font-weight:${fmt === 'var' ? '300 900' : '400'};\n  font-style:normal;\n  font-display:swap;\n}` }).join('\n\n')
      + '\n\n' + t('/* mesma família pela CDN do Fontsource, sem hospedar nada */') + '\n'
      + list.filter(x => x.src === 'google').map(x => `/* ${x.n}: ${fontsourceUrl(x, fmt)} */`).join('\n');
  } else if (f === 'link') {
    s = list.map(x => `<link rel="stylesheet" href="${cdnLink(x)}">`).join('\n')
     + '\n\n' + t('<!-- pré-conexão, acelera a primeira renderização -->') + '\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
  } else if (f === 'tw') {
    const stack = (x: Font) => fam(x).split(', ').map(y => `'${y.replace(/"/g, '')}'`).join(',');
    s = `// tailwind.config.js\nmodule.exports={theme:{extend:{fontFamily:{\n`
     + `  titulo:[${stack(T.disp!)}],\n`
     + `  texto:[${stack(T.body!)}],\n`
     + (T.mono ? `  mono:[${stack(T.mono)}],\n` : '')
     + `},fontSize:{\n` + [0, 1, 2, 3, 4].map(k => `  't${k}':'${Math.round(base * Math.pow(rt, k) * 10) / 10}px',`).join('\n') + `\n}}}}`;
  } else if (f === 'html') {
    const c = roleColors();
    s = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n`
     + list.map(x => `<link rel="stylesheet" href="${cdnLink(x)}">`).join('\n')
     + `\n<style>\nbody{background:${c.bg};color:${c.fg};font-family:${fam(T.body!)};font-size:${base}px;line-height:${lh};margin:0;padding:6vw}\n`
     + ROLES.filter(r => !T.off[r.k]).map(r => { const st = roleCss(r.k), cc = st.c,
        sel = ({ rotulo: '.rotulo', titulo: 'h1', subtitulo: 'h2', paragrafo: 'p', destaque: '.destaque', citacao: 'blockquote', referencia: '.referencia', botao: '.botao' } as Record<string, string>)[r.k];
        return `${sel}{font-family:${fam(cc.f)};font-weight:${cc.wt};font-size:${st.size}px;line-height:${st.lh};letter-spacing:${st.tr}em;color:${st.col}`
         + (cc.it ? ';font-style:italic' : '')
         + (r.k === 'paragrafo' ? `;max-width:${meas}ch` : '')
         + (r.k === 'botao' ? `;background:${c.ac};color:${readable(c.ac)};display:inline-block;padding:.7em 1.3em;text-decoration:none` : '')
         + (r.k === 'citacao' ? `;border-left:2px solid ${st.col};padding-left:18px;margin:0 0 18px` : '') + '}' }).join('\n')
     + `\n</style>\n</head>\n<body>\n`
     + parseText($v('tText') || sampleText()).map(bk => {
        const tg = ({ rotulo: 'p class="rotulo"', titulo: 'h1', subtitulo: 'h2', paragrafo: 'p', destaque: 'p class="destaque"',
          citacao: 'blockquote', referencia: 'p class="referencia"', botao: 'a class="botao" href="#"' } as Record<string, string>)[bk.r];
        return `<${tg}>${esc(bk.t)}</${tg.split(' ')[0]}>` }).join('\n')
     + `\n</body>\n</html>`;
  } else {
    s = list.map(x => `${x.n}\n` + t('  Banco: {b}', { b: x.src === 'google' ? 'Google Fonts' : 'Fontshare' }) + `\n` + t('  Página: {u}', { u: dlLink(x) }) + `\n`
      + (x.src === 'google' ? t('  Arquivo {f} pela CDN do Fontsource: {u}', { f: fmt === 'none' ? 'woff2' : fmt, u: fontsourceUrl(x, fmt === 'none' ? 'woff2' : fmt) }) + `\n` : t('  Baixe otf e ttf direto na página do Fontshare') + `\n`)
      + t('  Licença: confira na própria página antes de redistribuir')).join('\n\n')
      + `\n\n` + t('Espelho sem rastreamento das famílias do Google:') + `\n  https://fonts.bunny.net`;
  }
  $('tOut').textContent = s;
}
/** Gera o código de um formato sem mexer na aba escolhida. Vazio se não há famílias. */
export function tipoOut(fmt: TypeFmt): string {
  if (!hasFams()) return '';
  const o = T.fmt; T.fmt = fmt; drawTOut(); const t = $('tOut').textContent || ''; T.fmt = o; drawTOut(); return t;
}
export function initTypeExport(): void {
  $all<HTMLButtonElement>($('tTabs'), 'button').forEach(b => b.onclick = () => {
    T.fmt = b.dataset.f as TypeFmt; $all($('tTabs'), 'button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); drawTOut() });
  $('tCopy').onclick = () => copy($('tOut').textContent || '', t('Copiado'));
  $('tDl').onclick = () => { const ext = ({ css: 'css', face: 'css', link: 'html', tw: 'js', html: 'html', dl: 'txt' } as Record<string, string>)[T.fmt];
    download(t('tipografia') + '-' + slug(T.disp!.n) + '-' + slug(T.body!.n) + '.' + ext, $('tOut').textContent || '', 'text/plain') };
}
