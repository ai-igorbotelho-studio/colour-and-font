/* Cobertura da camada bilíngue: com o idioma em inglês, todo texto estático do HTML
   tem tradução, os dados são localizados e a palavra "marca" não aparece na interface. */
// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const html = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
const errors: string[] = [];
let UI: Record<string, string>;

beforeAll(async () => {
  localStorage.setItem('fk-lang', 'en');
  const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>')).replace(/<script[^>]*><\/script>/g, '');
  document.body.innerHTML = body;
  window.scrollTo = () => {};
  (HTMLCanvasElement.prototype as unknown as { getContext: () => null }).getContext = () => null;
  window.addEventListener('error', e => errors.push(String(e.error || e.message)));
  UI = (await import('../src/i18n/ui-en')).UI;
  await import('../src/main');
});

const NAMES = new Set(['Auge','ENG','PORT','Zur Farbenlehre','HSL','SVG','PNG','JPG','CSS','SCSS','JSON','Tailwind','SwiftUI','Android XML','Flutter','woff','ttf','otf','@font-face','TREND','WOFF2','WOFF','OTF','TTF','EOT, SVG','font-display: swap','unicode-range']);
const PT_MARKERS = /\b(cores|paleta|tipografia|fam[ií]lia|esquema|gerar|salvar|copiar|baixar|texto|fundo|contraste)\b/i;

describe('inglês como língua primária', () => {
  it('monta sem exceções', () => { expect(errors).toEqual([]) });
  it('documento em inglês', () => { expect(document.documentElement.lang).toBe('en-GB') });
  it('todo texto estático do HTML tem tradução', () => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT); const miss: string[] = []; let n: Node | null;
    while ((n = w.nextNode())) { const p = n.parentElement; if (!p || /SCRIPT|STYLE/.test(p.tagName)) continue;
      const k = (n as Text).data.replace(/\s+/g, ' ').trim(); if (k && !NAMES.has(k) && UI[k] === undefined && /[a-zA-Z]{3,}/.test(k)) miss.push(k) }
    expect(miss).toEqual([]);
  });
  it('placeholders, títulos e rótulos ARIA têm tradução', () => {
    const doc = new DOMParser().parseFromString(html, 'text/html'); const miss: string[] = [];
    doc.body.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => ['placeholder', 'title', 'aria-label'].forEach(a => {
      const v = el.getAttribute(a); if (v && UI[v] === undefined) miss.push(a + '=' + v) }));
    expect(miss).toEqual([]);
  });
  it('dados localizados e opções dos selects em inglês', async () => {
    const { EMO } = await import('../src/data/emotions'); const { TREND } = await import('../src/data/trends');
    expect(EMO[0].n).not.toMatch(/ç|ã/); expect(TREND[0].tese).toMatch(/[a-z]/);
    const pt = Array.from(document.querySelectorAll('option')).map(o => o.textContent || '').filter(x => PT_MARKERS.test(x));
    expect(pt).toEqual([]);
  });
  it('o texto visível não usa a palavra "marca" nem "brand"', () => {
    const txt = (document.body.textContent || '').toLowerCase();
    expect(/\bmarcas?\b/.test(txt)).toBe(false); expect(/\bbrands?\b/.test(txt)).toBe(false);
  });
  it('nenhuma chave de UI é traduzida com "brand"', () => {
    expect(Object.values(UI).filter(v => /\bbrand/i.test(v))).toEqual([]);
  });
});
