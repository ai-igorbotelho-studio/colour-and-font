# Farbenkreis — instrumentos de cor e tipografia

Paletas derivadas do círculo cromático de Goethe, combinação de famílias tipográficas com hierarquia, legibilidade medida em WCAG 2.1 e um compilado trimestral de tendências. Sem servidor, sem framework de interface, sem chamada de rede na página Criação.

## Desenvolver

```bash
npm install
npm run dev        # servidor local com recarga
npm test           # testes unitários e o harness de opções (vitest + jsdom)
npm run build      # tsc --noEmit → vitest → vite build → dist/
npm run preview    # serve dist/ em http://localhost:4173
```

`npm run build` falha se um teste falhar — inclusive o de contraste dos tokens (`tests/tokens.test.ts`), que mede os seis pares de texto da interface em luz e treva com a fórmula do WCAG.

### Auditorias no navegador (precisam do `preview` no ar)

```bash
npm run audit:smoke     # cinco páginas, todos os <select> em todas as opções, todos os botões — zero erros JS
npm run audit:ref       # compara paletas, pares e propostas com o instantâneo do arquivo original (tests/reference.json)
npm run audit:axe       # axe-core nas cinco páginas, luz e treva — 0 críticas e 0 sérias
npm run audit:shots -- <pasta>            # capturas em 390, 768 e 1440, luz e treva
npm run audit:diff  -- <antes> <depois>   # comparação pixel a pixel de duas pastas de capturas
npm run assets          # regenera public/og.png e os ícones a partir da edição em vigor
```

## Estrutura

```
index.html                 casca: nav, tabbar, os cinco <main>
public/                    og.png, icons/, fonts/ (Bodoni Moda e IBM Plex Sans, latino, woff2), _headers, manifest
src/
  core/    color.ts goethe.ts codes.ts rng.ts state.ts store.ts dom.ts
  data/    emotions markets schemes lenses cultures music fonts lexicon trends
  palette/ state generate history wheel views detail reads contrast scale saved gradient zip export index
  type/    state loader pairing hierarchy specimen export saved index
  create/  brief proposals mocks markdown index
  trends/  banner render
  home.ts nav.ts main.ts testing.ts
  styles/  tokens.css base.css components.css views.css
tests/     color goethe zip tokens options (.test.ts) · reference.json · tools/ (harness de navegador)
reference/ farbenkreis-original.html — o arquivo único de onde tudo saiu
```

Um store por domínio (`createStore` em `core/state.ts`): o instrumento de cor notifica ao redesenhar e a tipografia assina para acompanhar a paleta. Nenhum módulo importa "para cima" — `core → data → palette → type → nav → create/trends`.

## O que não muda

As decisões listadas na seção 7 de `PASSAGEM-CLAUDE-CODE.md` são o conteúdo da ferramenta: as seis âncoras de Goethe e seus opostos a 180°, a interpolação em OKLab com croma reduzido por busca binária, os três regimes, preto e branco como cores plenas, o contraste sobre as cores reais, a nota sobre referência cultural, a declaração de que os hex das Tendências são aproximações, a Criação sem rede e a ausência da palavra "marca" na interface. `tests/goethe.test.ts` e `tests/options.test.ts` vigiam as que dá para vigiar por código.

## Atualizar as Tendências

Insira um objeto no começo de `src/data/trends.ts` (a interface `Edition` diz o formato; o botão "Ver o formato" na página mostra o mesmo esquema). `tipo.fam` precisa bater com o nome exato de uma família em `src/data/fonts.ts`; `pal[].hex` é aproximação em sRGB e `obs` traz o código oficial. Depois, `npm run assets` regenera o `og.png` com a nova edição.

## Publicar — Cloudflare Pages

Conecte o repositório em Workers & Pages → Create → Pages:

| Campo | Valor |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variável de ambiente | `NODE_VERSION` = `20` |

`public/_headers` já traz `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, a CSP e o cache imutável de `/assets`, `/fonts` e `/icons`. A CSP libera Google Fonts e Fontshare em `style-src` e `font-src` porque o instrumento de tipografia carrega as 93 famílias sob demanda; as duas famílias da interface são servidas de `/fonts`, sem requisição externa na primeira pintura.

Depois do primeiro deploy, confira na URL real: `curl -I` para os cabeçalhos, e o inspetor de pré-visualização do WhatsApp e do LinkedIn para o `og:image` (`/og.png`, 1200×630).

## Caminho para aplicativo

`manifest.webmanifest` e os ícones (192, 512, maskable) já estão em `public/`. O próximo passo, quando houver público, é `vite-plugin-pwa` para o service worker e o funcionamento sem rede. Capacitor só depois, e só se houver necessidade real de recurso nativo.
