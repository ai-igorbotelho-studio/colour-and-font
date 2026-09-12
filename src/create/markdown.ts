/* ── Markdown: paleta, proposta ── */
import { hex2rgb, rgb2hsl, rgb2cmyk, hex2lch, lum, ratio } from '../core/color';
import { $v } from '../core/dom';
import { t, locale } from '../i18n';
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { SCH } from '../data/schemes';
import { LENS } from '../data/lenses';
import { CULT } from '../data/cultures';
import { MUS } from '../data/music';
import { PIECES, SUPS } from '../data/lexicon';
import type { Font } from '../data/fonts';
import { S, cur, palette, proportions, palName } from '../palette/state';
import { T, hasFams } from '../type/state';
import { fam, describe } from '../type/pairing';
import { cdnLink } from '../type/loader';
import { titleFor, type Proposal } from './proposals';

export function mdBlock(name: string, hs: string[], areas: number[] | null, fonts: Font[] | null, extra?: string): string {
  let s = `# ${name}\n\n`;
  if (extra) s += extra + '\n\n';
  s += t('## Paleta') + `\n\n` + t('| # | HEX | RGB | HSL | CMYK | OKLCH | Área |') + `\n|---|---|---|---|---|---|---|\n`;
  hs.forEach((h, i) => { const [r, g, b] = hex2rgb(h), hl = rgb2hsl(r, g, b), cm = rgb2cmyk(r, g, b), o = hex2lch(h);
    s += `| ${i + 1} | \`${h}\` | ${r}, ${g}, ${b} | ${hl.map(x => Math.round(x)).join(', ')} | ${cm.map(x => Math.round(x)).join(', ')} | ${Math.round(o.L * 100)}% ${o.C.toFixed(3)} ${Math.round(o.H)} | ${areas ? Math.round(areas[i]) + '%' : '—'} |\n` });
  const ls = hs.map(lum), bg = hs[ls.indexOf(Math.max(...ls))], ink = hs[ls.indexOf(Math.min(...ls))];
  s += `\n` + t('Fundo sugerido `{bg}`, texto `{ink}`, contraste {r} para 1.', { bg, ink, r: ratio(ink, bg).toFixed(2) }) + `\n`;
  const ok: string[] = []; hs.forEach((b2, i) => hs.forEach((t, j) => { if (i !== j && ratio(t, b2) >= 4.5) ok.push(`\`${t}\` sobre \`${b2}\` (${ratio(t, b2).toFixed(2)})`) }));
  s += `\n` + t('### Pares legíveis a 4,5 para 1') + `\n\n` + (ok.length ? ok.slice(0, 8).map(x => '- ' + x).join('\n') : t('- Nenhum. Use preto ou branco de fora da paleta para texto.')) + '\n';
  if (fonts && fonts.length) {
    s += `\n` + t('## Tipografia') + `\n\n` + t('| Papel | Família | Banco | Pesos | Característica |') + `\n|---|---|---|---|---|\n`;
    const papel = [t('Título'), t('Texto'), t('Apoio'), t('Citação'), t('Acento')];
    fonts.forEach((f, i) => s += `| ${papel[i] || t('Extra')} | ${f.n} | ${f.src === 'google' ? 'Google Fonts' : 'Fontshare'} | ${f.wts.replace(/;/g, ', ')} | ${describe(f)} |\n`);
    s += `\n\`\`\`html\n` + fonts.map(f => `<link rel="stylesheet" href="${cdnLink(f)}">`).join('\n') + `\n\`\`\`\n`;
  }
  s += `\n` + t('## Variáveis CSS') + `\n\n\`\`\`css\n:root{\n`
   + hs.map((h, i) => `  --cor-${i + 1}: ${h};`).join('\n') + '\n'
   + `  --fundo: ${bg};\n  --tinta: ${ink};\n`
   + (fonts && fonts.length ? fonts.map((f, i) => `  --fonte-${i + 1}: ${fam(f)};`).join('\n') + '\n' : '')
   + `}\n\`\`\`\n`;
  s += `\n---\n\n` + t('Derivada do círculo cromático de Goethe (*Zur Farbenlehre*, 1810). Conversões em OKLab, croma ajustado ao gamut sRGB. Razões de contraste segundo WCAG 2.1. Gerado em {d}.', { d: new Date().toLocaleString(locale()) }) + `\n`;
  return s;
}
export function mdPalette(): string {
  const { E, M, SC, L, K, U } = cur();
  const ctx = [t('**Intenção:** {e}', { e: E.n }), t('**Campo:** {m}', { m: M.n }), t('**Esquema:** {s}', { s: SC.n }),
    t('**Lente de estúdio:** {l}', { l: L.n }), t('**Referência cultural:** {k}', { k: K.n }), t('**Estilo musical:** {u}', { u: U.n }),
    t('**Postura:** {p} de 100 entre pertencer e romper', { p: S.pos })].join('  \n');
  const fonts = hasFams() ? T.fams : null;
  return mdBlock(palName(), palette(), proportions(), fonts, ctx);
}
export function mdProposal(p: Proposal): string {
  const br = p.br, brief = $v('cBrief').trim(), ctx = [t('**Leitura:** {a}', { a: p.ang.n }),
    t('**Peça:** {p}', { p: (PIECES.find(x => x.v === br.piece) || { n: '—' }).n }),
    t('**Suporte:** {s}', { s: (SUPS.find(x => x.v === br.sup) || { n: '—' }).n }),
    t('**Intenção:** {e}', { e: EMO[br.e].n }), t('**Campo:** {m}', { m: MKT[br.m].n }),
    t('**Esquema:** {s}', { s: SCH[p.si].n }), t('**Lente de estúdio:** {l}', { l: LENS[p.li].n }),
    t('**Referência cultural:** {k}', { k: CULT[p.k].n }), t('**Estilo musical:** {u}', { u: MUS[p.u].n }),
    t('**Postura:** {p} de 100', { p: Math.round(p.t * 100) }),
    br.words.length ? t('**Palavras reconhecidas na descrição:** {w}', { w: br.words.join(', ') }) : null,
    brief ? `\n> ${brief}` : null,
    `\n${p.ang.why}`].filter(Boolean).join('  \n');
  return mdBlock(`${titleFor(br)} — ${p.ang.n}`, p.hs, p.areas, p.fonts, ctx);
}
