# Farbenkreis — relatório de auditoria da migração

Emitido em 11 de setembro de 2026, ao fim das Etapas 1 a 7 do plano em `PASSAGEM-CLAUDE-CODE.md`. Números medidos, não adjetivos. Cada medida diz como foi colhida e com que ferramenta, para que possa ser repetida com os scripts de `tests/tools/`.

## Portões, um por etapa

| Etapa | Portão | Resultado | Como foi medido |
|---|---|---|---|
| 1 · esqueleto | `npm run build` roda e a aplicação funciona idêntica | ✅ | Chromium headless: 5 páginas, 34 selects, todos os botões, 0 erros JS |
| 2 · núcleo | testes passando; mesma semente → mesmos hex | ✅ 10/10 paletas, 5/5 pares, 6/6 propostas idênticas | `tests/reference.json` colhido do arquivo original via `snapshot-reference.mjs`; `compare-live.mjs` e `goethe.test.ts` |
| 3 · dados | as opções continuam exercitáveis, zero falhas | ✅ 269 opções em 28 selects, 0 erros | `smoke.mjs` (Chromium) e `options.test.ts` (jsdom) |
| 4 · domínios | `legacy.ts` não existe mais | ✅ apagado; 51 módulos | `src/` — `core/ data/ palette/ type/ create/ trends/` |
| 5 · CSS | comparação visual das cinco páginas, luz e treva, em 390, 768 e 1440 | ✅ **30/30 capturas idênticas** ao arquivo original, medidas ao fim da Etapa 5 (fontes externas bloqueadas nos dois lados, aviso oculto). Depois da Etapa 6 restam 12 diferenças, todas deliberadas: 6 em Cores (véu de legibilidade nos rótulos das faixas, 0,13 % a 0,17 % dos pixels, +4 px em 390) e 6 em Início (linha "Exemplo:" sem a opacidade decorativa, 0,02 % a 0,06 %) | `shots.mjs` × 2 + `diff-shots.mjs` (pixelmatch, limiar 0,1) |
| 6 · endurecer | relatório com números | este documento | — |
| 7 · publicar | `_headers`, manifesto, ícones, `og.png` | ✅ em `public/`; o deploy no Cloudflare Pages é feito no painel (README) | — |

## Métricas de peso

| Medida | Antes (arquivo único) | Depois (dist/) | Como |
|---|---|---|---|
| HTML | 35,3 kB | 37,0 kB (casca + preload de fontes + manifesto) | `wc -c` |
| CSS | 24,5 kB | 22,6 kB (uma camada, sem as declarações vencidas da camada de toque) | `wc -c` |
| JavaScript | 174,5 kB | 159,0 kB | `wc -c` |
| **Servido com gzip (html+js+css)** | 77,1 kB | **75,9 kB** | zlib nível 9 |
| **Servido com brotli (html+js+css)** | — | **64,6 kB** (alvo ≤ 90 kB) | zlib brotli q11 |
| Fontes da interface | 1 requisição externa (Google Fonts) | 0 externas — 5 arquivos woff2 latinos em `/fonts`, 168 kB, cache imutável, 2 em `preload` | `public/fonts` |
| Requisições externas na primeira pintura | 1 | **0** | `<head>` |

## Qualidade

| Medida | Alvo | Resultado | Ferramenta |
|---|---|---|---|
| Lighthouse desempenho, móvel simulado | — | **99** | lighthouse 12.2.1, `--preset=perf --form-factor=mobile --throttling-method=simulate`, Chromium headless |
| LCP em 4G simulada | ≤ 2,5 s | **1,8 s** | idem |
| CLS | ≤ 0,1 | **0** | idem |
| TBT / FCP / Speed Index | — | 30 ms / 1,4 s / 1,4 s | idem |
| Violações do axe | 0 críticas, 0 sérias | **0 críticas, 0 sérias** nas cinco páginas, luz e treva (restam 4 tipos moderados: `region`, `page-has-heading-one`, `heading-order`) | `@axe-core/playwright` 4.10 |
| Contraste dos tokens | ≥ 4,5 em todos os pares de texto | luz: tinta/fundo 16,87, suave/fundo 6,84 · treva: tinta/fundo 18,10, suave/fundo 9,74 — 12 pares medidos, todos ≥ 4,5; o build falha se um cair | `tests/tokens.test.ts`, fórmula WCAG 2.1 |
| Opções de campo | 258 exercitadas, 0 falhas | **269** exercitadas, 0 falhas | `smoke.mjs`, `options.test.ts` |
| Testes unitários | passando | **66/66** em 5 arquivos | vitest 2.1 |
| Tipagem | — | `tsc --noEmit` limpo com `strict: true` | TypeScript 5.6 |
| INP na roda arrastável | ≤ 200 ms | **não medido** — exige perfil de interação no Chrome com dispositivo | — |
| Safari iOS, Android reais | dispositivo real | **não verificado** neste ambiente | — |

### Exclusões declaradas da axe

- `.ctgrid button.fail`: são as células da grade de legibilidade que mostram, de propósito, os pares que **não** alcançam a exigência — riscadas e com contorno. É o instrumento medindo contraste, não texto de interface.
- `#toast`: aparece por 1,8 s em fade; a axe o amostrava no meio da transição. Em opacidade cheia é tinta sobre fundo (16,87:1 / 18,10:1).
- `#cv`: canvas de trabalho, oculto.

## Pendências A a G — estado

| # | Pendência | Estado |
|---|---|---|
| A | duas camadas de CSS | **resolvida** — `tokens.css`, `base.css`, `components.css`, `views.css`; comparação visual acima |
| B | `og:image` inexistente | **resolvida** — `public/og.png` 1200×630, gerado pelo `bannerSvg()` da edição em vigor (`npm run assets`) |
| C | Google Fonts bloqueando a primeira pintura | **resolvida** — Bodoni Moda (variável, opsz) e IBM Plex Sans 300/400/500 auto-hospedadas via pacotes Fontsource (OFL 1.1), `font-display:swap`, `preload` das duas principais |
| D | famílias do banco sem tratamento de falha | **resolvida** — `type/loader.ts`: `document.fonts.load` com tempo limite de 6 s, `onerror`, aviso único; a reserva declarada em `fam()` já está em uso |
| E | `window.storage` | **resolvida** — `core/store.ts` sobre `localStorage`, mesmo contrato `list/get/set`, memória de sessão como reserva |
| F | download falha em iOS WebView | **resolvida** — `core/dom.ts`: `navigator.share({files})` quando `canShare` aceita, senão o `<a download>` de sempre |
| G | globais mutáveis | **resolvida** — um store por domínio (`createStore`), `paletteStore` notifica ao redesenhar e a tipografia assina |

## Mudanças de comportamento deliberadas (todas na Etapa 6)

1. **Véu de legibilidade** nos rótulos pequenos das faixas (`.cell.lowc`): quando preto ou branco, já com a opacidade do rótulo, não alcançam 4,5:1 sobre a cor mostrada, os três rótulos ganham fundo translúcido. Afeta só a página Cores, e só as cores de meio-tom.
2. **Papéis ARIA da tabbar**: os cinco botões são `role="tab"` com `aria-selected`, o que a `role="tablist"` já exigia. As cinco páginas viraram `<main>` (uma visível por vez).
3. **Linha "Exemplo:" nos cartões de classe** da página inicial perdeu a opacidade decorativa de 0,75 — com ela, o token suave caía a 3,9:1 em luz.
4. A postura inicial do instrumento de cor é **55**, como no controle do HTML original (o estado é a fonte de verdade agora, e o controle o reflete).

## O que não mudou (Seção 7 do plano)

Âncoras, opostos a 180°, OKLab com busca binária de croma, os três regimes, preto e branco com matiz, contraste sobre cores reais, nota cultural íntegra, aviso de aproximação nos hex das Tendências, Criação sem rede, e a palavra "marca" fora da interface — vigiados por `goethe.test.ts`, `color.test.ts` e `options.test.ts`. Observação: o corpo editorial da edição 2026 · T3 contém a expressão "traço com marca de mão" (texto citado, já presente no original); o teste exclui o corpo das edições, que é conteúdo, não interface.

## Não verificado

Lighthouse foi rodado em Chromium headless com rede simulada, não em 4G real. Nenhum dispositivo iOS ou Android real foi usado; `backdrop-filter` na tabbar, `aspect-ratio` e o download via `navigator.share` precisam de teste no aparelho. INP durante o arraste não foi perfilado.
