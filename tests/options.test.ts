/* O harness que já existia: monta a aplicação em jsdom e exercita todas as opções
   de todos os campos de todas as páginas. Zero exceções é o critério. */
// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const html = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
const errors: string[] = [];

beforeAll(async () => {
  const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>')).replace(/<script[^>]*><\/script>/g, '');
  document.body.innerHTML = body;
  // jsdom não faz layout nem canvas: o que a aplicação precisa está guardado atrás de try/catch
  window.scrollTo = () => {};
  (HTMLCanvasElement.prototype as unknown as { getContext: () => null }).getContext = () => null;
  window.addEventListener('error', e => errors.push(String(e.error || e.message)));
  await import('../src/main');
});

describe('todas as opções de todos os campos', () => {
  it('a aplicação monta sem exceções', () => { expect(errors).toEqual([]) });
  it('todos os <select> têm opções e aceitam cada uma sem exceção', () => {
    const sels = Array.from(document.querySelectorAll('select'));
    expect(sels.length).toBeGreaterThanOrEqual(25);
    let n = 0;
    for (const s of sels) {
      expect(s.options.length, s.id).toBeGreaterThan(0);
      for (let i = 0; i < s.options.length; i++) {
        s.selectedIndex = i;
        expect(() => { s.dispatchEvent(new Event('change', { bubbles: true })); s.dispatchEvent(new Event('input', { bubbles: true })) }, `${s.id}[${i}]`).not.toThrow();
        n++;
      }
    }
    expect(n).toBeGreaterThanOrEqual(258);
    expect(errors).toEqual([]);
  });
  it('as cinco páginas abrem e os botões de contagem, esquema e fundo respondem', () => {
    for (const p of ['home', 'cores', 'tipo', 'criacao', 'tend', 'cont', 'fund']) {
      (document.querySelector(`.tab[data-p="${p}"]`) as HTMLButtonElement).click();
      expect(document.getElementById('p-' + p)!.classList.contains('on')).toBe(true);
    }
    (document.getElementById('gTreva') as HTMLButtonElement).click();
    expect(document.documentElement.getAttribute('data-ground')).toBe('treva');
    for (const b of Array.from(document.querySelectorAll<HTMLButtonElement>('#cnt button, #ctMode button, #viewbar button, #cN button, #tFamN button'))) b.click();
    expect(errors).toEqual([]);
  });
  it('a palavra "marca" não aparece em nenhum texto de interface', () => {
    // o corpo editorial das edições de Tendências é conteúdo citado, não interface
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('#edAxes, #banners, script').forEach(el => el.remove());
    const text = clone.textContent || '';
    expect(/(?<![\p{L}])marcas?(?![\p{L}])/iu.test(text)).toBe(false);
  });
  it('a nota sobre referência cultural está presente e íntegra', () => {
    expect(document.getElementById('caution')!.textContent).toContain('taonga');
  });
});
