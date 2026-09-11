/* ── Markdown: paleta, proposta ── */
import { hex2rgb, rgb2hsl, rgb2cmyk, hex2lch, lum, ratio } from '../core/color';
import { $v } from '../core/dom';
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
  s += `## Paleta\n\n| # | HEX | RGB | HSL | CMYK | OKLCH | Área |\n|---|---|---|---|---|---|---|\n`;
  hs.forEach((h, i) => { const [r, g, b] = hex2rgb(h), hl = rgb2hsl(r, g, b), cm = rgb2cmyk(r, g, b), o = hex2lch(h);
    s += `| ${i + 1} | \`${h}\` | ${r}, ${g}, ${b} | ${hl.map(x => Math.round(x)).join(', ')} | ${cm.map(x => Math.round(x)).join(', ')} | ${Math.round(o.L * 100)}% ${o.C.toFixed(3)} ${Math.round(o.H)} | ${areas ? Math.round(areas[i]) + '%' : '—'} |\n` });
  const ls = hs.map(lum), bg = hs[ls.indexOf(Math.max(...ls))], ink = hs[ls.indexOf(Math.min(...ls))];
  s += `\nFundo sugerido \`${bg}\`, texto \`${ink}\`, contraste ${ratio(ink, bg).toFixed(2)} para 1.\n`;
  const ok: string[] = []; hs.forEach((b2, i) => hs.forEach((t, j) => { if (i !== j && ratio(t, b2) >= 4.5) ok.push(`\`${t}\` sobre \`${b2}\` (${ratio(t, b2).toFixed(2)})`) }));
  s += `\n### Pares legíveis a 4,5 para 1\n\n` + (ok.length ? ok.slice(0, 8).map(x => '- ' + x).join('\n') : '- Nenhum. Use preto ou branco de fora da paleta para texto.') + '\n';
  if (fonts && fonts.length) {
    s += `\n## Tipografia\n\n| Papel | Família | Banco | Pesos | Característica |\n|---|---|---|---|---|\n`;
    const papel = ['Título', 'Texto', 'Apoio', 'Citação', 'Acento'];
    fonts.forEach((f, i) => s += `| ${papel[i] || 'Extra'} | ${f.n} | ${f.src === 'google' ? 'Google Fonts' : 'Fontshare'} | ${f.wts.replace(/;/g, ', ')} | ${describe(f)} |\n`);
    s += `\n\`\`\`html\n` + fonts.map(f => `<link rel="stylesheet" href="${cdnLink(f)}">`).join('\n') + `\n\`\`\`\n`;
  }
  s += `\n## Variáveis CSS\n\n\`\`\`css\n:root{\n`
   + hs.map((h, i) => `  --cor-${i + 1}: ${h};`).join('\n') + '\n'
   + `  --fundo: ${bg};\n  --tinta: ${ink};\n`
   + (fonts && fonts.length ? fonts.map((f, i) => `  --fonte-${i + 1}: ${fam(f)};`).join('\n') + '\n' : '')
   + `}\n\`\`\`\n`;
  s += `\n---\n\nDerivada do círculo cromático de Goethe (*Zur Farbenlehre*, 1810). Conversões em OKLab, croma ajustado ao gamut sRGB. Razões de contraste segundo WCAG 2.1. Gerado em ${new Date().toLocaleString('pt-BR')}.\n`;
  return s;
}
export function mdPalette(): string {
  const { E, M, SC, L, K, U } = cur();
  const ctx = [`**Intenção:** ${E.n}`, `**Campo:** ${M.n}`, `**Esquema:** ${SC.n}`,
    `**Lente de estúdio:** ${L.n}`, `**Referência cultural:** ${K.n}`, `**Estilo musical:** ${U.n}`,
    `**Postura:** ${S.pos} de 100 entre pertencer e romper`].join('  \n');
  const fonts = hasFams() ? T.fams : null;
  return mdBlock(palName(), palette(), proportions(), fonts, ctx);
}
export function mdProposal(p: Proposal): string {
  const br = p.br, brief = $v('cBrief').trim(), ctx = [`**Leitura:** ${p.ang.n}`,
    `**Peça:** ${(PIECES.find(x => x.v === br.piece) || { n: '—' }).n}`,
    `**Suporte:** ${(SUPS.find(x => x.v === br.sup) || { n: '—' }).n}`,
    `**Intenção:** ${EMO[br.e].n}`, `**Campo:** ${MKT[br.m].n}`,
    `**Esquema:** ${SCH[p.si].n}`, `**Lente de estúdio:** ${LENS[p.li].n}`,
    `**Referência cultural:** ${CULT[p.k].n}`, `**Estilo musical:** ${MUS[p.u].n}`,
    `**Postura:** ${Math.round(p.t * 100)} de 100`,
    br.words.length ? `**Palavras reconhecidas na descrição:** ${br.words.join(', ')}` : null,
    brief ? `\n> ${brief}` : null,
    `\n${p.ang.why}`].filter(Boolean).join('  \n');
  return mdBlock(`${titleFor(br)} — ${p.ang.n}`, p.hs, p.areas, p.fonts, ctx);
}
