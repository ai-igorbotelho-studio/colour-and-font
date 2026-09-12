/* ── maquetes por tipo de peça ── */
import { readable } from '../core/color';
import { esc } from '../core/dom';
import { MKT } from '../data/markets';
import { PIECES } from '../data/lexicon';
import { fam } from '../type/pairing';
import { roleOf, titleFor, type Proposal } from './proposals';

export function mock(p: Proposal): string {
  const c = roleOf(p), f = p.fonts, d = f[0], b = f[1] || f[0], aux = f[2] || b;
  const kind = (PIECES.find(x => x.v === p.br.piece) || PIECES[0]).mock;
  const T = titleFor(p.br);
  const F = fam, ac = c.ac, ackr = readable(ac);
  if (kind === 'ui') return `<div class="mock" style="background:${c.bg};color:${c.ink}">
    <div class="mk-top" style="border-bottom:1px solid ${c.mut}">
      <span style="font-family:${F(d)};font-size:19px">${esc(T)}</span>
      <span style="font-family:${F(aux)};font-size:12px;color:${c.mut}">painel · coleções · ajustes</span></div>
    <div class="mk-hero" style="background:${c.ink};color:${readable(c.ink)}">
      <div style="font-family:${F(d)};font-size:clamp(22px,4vw,34px);line-height:1.02">${esc(T)}</div>
      <div style="font-family:${F(b)};font-size:14px;opacity:.85;margin-top:8px">Uma linha de apoio que explica o que está acontecendo nesta tela.</div></div>
    <div class="mk-tiles">${p.hs.slice(0, 4).map(h => `<div style="background:${h};color:${readable(h)};font-family:${F(aux)};font-size:11px">${h}</div>`).join('')}</div>
    <div style="margin-top:12px"><span style="background:${ac};color:${ackr};font-family:${F(b)};font-size:14px;padding:9px 16px;display:inline-block">Ação principal</span></div></div>`;
  if (kind === 'poster') return `<div class="mock mk-poster" style="background:${c.bg};color:${c.ink}">
    <div style="font-family:${F(aux)};font-size:12px;color:${c.mut}">${esc(MKT[p.br.m].n)}</div>
    <div style="font-family:${F(d)};font-size:clamp(30px,7vw,58px);line-height:.95;margin:auto 0">${esc(T)}</div>
    <div style="display:flex;gap:6px">${p.hs.map(h => `<span style="flex:1;height:30px;background:${h}"></span>`).join('')}</div>
    <div style="font-family:${F(b)};font-size:13px;color:${c.mut}">${p.fonts.map(x => x.n).join(' · ')}</div></div>`;
  if (kind === 'slide') return `<div class="mock mk-slide" style="background:${c.bg};color:${c.ink}">
    <div style="width:46px;height:6px;background:${ac}"></div>
    <div style="font-family:${F(d)};font-size:clamp(22px,4.4vw,38px);line-height:1.04;margin:14px 0 10px">${esc(T)}</div>
    <div style="font-family:${F(b)};font-size:15px;max-width:46ch;color:${c.mut}">Três linhas de argumento, na ordem em que o público consegue segui-las.</div>
    <div class="mk-tiles" style="margin-top:auto">${p.hs.slice(0, 3).map((h, i) => `<div style="background:${h};color:${readable(h)};font-family:${F(b)};font-size:12px">Ponto ${i + 1}</div>`).join('')}</div></div>`;
  if (kind === 'ident') return `<div class="mock" style="background:${c.bg};color:${c.ink}">
    <div style="font-family:${F(d)};font-size:clamp(26px,6vw,50px);line-height:1;letter-spacing:-.02em">${esc(T)}</div>
    <div style="display:flex;gap:8px;margin:18px 0;flex-wrap:wrap">
      ${p.hs.map(h => `<span style="width:58px;height:58px;border-radius:50%;background:${h};display:block"></span>`).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">
      ${['Aa Bb Cc', '0123', '— · —'].map((x, i) => `<div style="border:1px solid ${c.mut};padding:14px;font-family:${F(p.fonts[i] || b)};font-size:22px">${x}</div>`).join('')}</div></div>`;
  if (kind === 'pack') return `<div class="mock" style="background:${c.mut}22">
    <div style="max-width:300px;margin:0 auto;background:${c.bg};color:${c.ink};padding:26px 20px;border:1px solid ${c.mut}">
      <div style="font-family:${F(aux)};font-size:11px;color:${c.mut}">${esc(MKT[p.br.m].n)}</div>
      <div style="font-family:${F(d)};font-size:30px;line-height:1;margin:10px 0 6px">${esc(T)}</div>
      <div style="height:5px;background:${ac};margin:12px 0"></div>
      <div style="font-family:${F(b)};font-size:13px;color:${c.mut}">Descrição curta do conteúdo, peso líquido e o resto do que a norma exige.</div>
      <div style="display:flex;gap:4px;margin-top:16px">${p.hs.map(h => `<span style="flex:1;height:16px;background:${h}"></span>`).join('')}</div>
    </div></div>`;
  return `<div class="mock" style="background:${c.bg};color:${c.ink}">
    <div style="font-family:${F(aux)};font-size:12px;color:${c.mut};margin-bottom:10px">${esc(MKT[p.br.m].n)}</div>
    <div style="font-family:${F(d)};font-size:clamp(24px,5vw,40px);line-height:1.02;max-width:18ch">${esc(T)}</div>
    <div style="font-family:${F(b)};font-size:16px;line-height:1.6;max-width:60ch;margin-top:14px">
      Um parágrafo do tamanho que você vai usar de verdade, com linhas suficientes para perceber se o olho cansa antes do fim. É aqui que a paleta deixa de ser amostra e vira leitura.</div>
    <blockquote style="font-family:${F(d)};font-size:20px;font-style:italic;border-left:2px solid ${ac};padding-left:16px;margin:18px 0 0;color:${c.mut}">Uma citação destacada do próprio texto.</blockquote>
    <div style="display:flex;gap:5px;margin-top:20px">${p.hs.map((h, i) => `<span style="flex:${p.areas[i].toFixed(1)};height:22px;background:${h}"></span>`).join('')}</div></div>`;
}
