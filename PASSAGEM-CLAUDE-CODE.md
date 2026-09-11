# Farbenkreis — passagem para o Claude Code

Cole este arquivo inteiro no Claude Code, junto com `farbenkreis.html`, e siga as fases na ordem. Não pule fases em silêncio: se comprimir alguma, diga qual e por quê.

---

## 0 · O que existe hoje

`farbenkreis.html` é um arquivo único, sem dependências de build, sem rede em tempo de execução. Abre local ou servido. Cinco seções em abas:

| Seção | O que faz |
|---|---|
| **Início** | Base teórica: círculo de Goethe, os três regimes de combinação, os seis esquemas geométricos modernos, mistura aditiva e subtrativa em diagramas arrastáveis, por que OKLab, dez classes tipográficas |
| **Cores** | Roda com bolas arrastáveis (ângulo = matiz, raio = croma), 11 esquemas, 16 lentes de estúdio, 11 referências culturais, 13 dinâmicas musicais, 10 modos de visualização, histórico com voltar e refazer, 20 códigos por cor, grade de legibilidade WCAG com correção assistida, estúdio de gradientes, exportação em 20 formatos e em `.zip` |
| **Tipografia** | 93 famílias de Google Fonts e Fontshare classificadas, 5 estratégias de combinação, 1 a 5 famílias, 8 níveis de hierarquia editáveis, campo de texto livre com marcação, amostra ao vivo com a paleta aplicada, exportação de `@font-face` por formato de arquivo |
| **Criação** | Motor determinístico com léxico de 43 entradas que lê um briefing em texto e devolve três propostas por caminhos opostos, cada uma com paleta, tipografia, maquete e raciocínio |
| **Tendências** | Edições trimestrais com fonte e data, arquivo das anteriores, quatro banners gerados por edição |

### Métricas medidas (11 de setembro de 2026)

| Medida | Valor | Como foi medido |
|---|---|---|
| Peso do arquivo | 237,7 kB | `ls -l` |
| CSS | 24,5 kB | extração por regex do bloco `<style>` |
| JavaScript | 174,5 kB | soma dos 9 blocos `<script>` |
| HTML | 35,3 kB | total menos CSS e JS |
| **Peso servido com gzip** | **77,1 kB** | `gzip -9` |
| Opções de campo exercitadas | 258 em 25 `<select>` | harness jsdom, todas as opções de todas as páginas |
| Falhas funcionais | 0 | idem |
| Erros de execução | 0 | idem |
| Contraste dos tokens de interface | 6,84 a 16,87 | fórmula WCAG 2.1, seis pares, luz e treva |
| Requisições externas | 1 (Google Fonts) | inspeção do `<head>` |

**Não verificado:** Lighthouse, axe, Safari iOS real, Android real, teste em rede lenta. jsdom não faz layout nem renderiza — nenhuma medida de LCP, CLS ou INP foi colhida. Fazer na Fase 5.

---

## 1 · Relatório de auditoria — achados e estado

Achados já corrigidos neste arquivo, listados para que não sejam reintroduzidos:

| # | Onde | Achado | Correção aplicada |
|---|---|---|---|
| 1 | `:root` e `html[data-ground="treva"]` | Faltava `color-scheme`. Menus nativos de `<select>` abriam com fundo claro do sistema e texto branco herdado — ilegível no modo escuro | `color-scheme:light` e `dark` declarados, mais `option{background:var(--field);color:var(--ink)}` |
| 2 | token `--soft` | 4,4:1 no modo treva, abaixo de AA | `#A5A49F` → `#BCBBB6` (9,74:1) e `#4C4B47` → `#45443F` (6,84:1) |
| 3 | `#tText` | `<textarea>` sem rótulo associado | `<label for="tText">` acrescentado |
| 4 | `#tabbar` | `max-width:calc(100vw - 24px)` em elemento fixo — risco de estouro horizontal em janela com barra de rolagem visível | trocado por `left/right:12px` + `width:fit-content` + `margin:0 auto` |
| 5 | bloco `<style>` | 16 regras órfãs de versões anteriores: `.swatches`, `.poles`, `.pole`, `.spec .eyebrow/.h/.sub/.body/.cap/.chiprow/.chip`, `.chip`, `.caution`, `nav .tabs`, `.disp`, `.tag` | removidas |
| 6 | `<head>` | Sem `description`, `og:*`, `theme-color`, `canonical` nem favicon | acrescentados; `og:image` aponta para `/og.png`, que **ainda precisa ser gerado** |
| 7 | `pickPair()` | Gerador congruente linear operando sobre float colapsava numa faixa de 0,21 a 0,25 — "Gerar combinação" devolvia sempre o mesmo par | estado do gerador passou a inteiro |
| 8 | `build()` | Jitter de ±8° no matiz — "Gerar" mal alterava a paleta | gerador determinístico por semente, variando matiz, luminosidade e croma |

### Pendências abertas — resolver na migração

| # | Onde | Problema | Ação |
|---|---|---|---|
| A | `<style>` inteiro | Duas camadas de CSS: a base e a de interface de toque, que sobrescreve dezenas de propriedades. Cerca de 3 a 4 kB de declarações vencidas | Consolidar numa camada só ao migrar para arquivos separados. **Não fazer no arquivo único** — risco alto, benefício de 1,5% do peso servido |
| B | `og:image` | Referenciado e inexistente | Gerar 1200×630 com o gerador de banner que já existe em `bannerSvg()` |
| C | Google Fonts | Única requisição externa; bloqueia a primeira pintura | Auto-hospedar Bodoni Moda e IBM Plex Sans em woff2 subconjunto latino, com `font-display:swap` e `preload` |
| D | Famílias do banco | Carregadas sob demanda por injeção de `<link>`; sem tratamento de falha de rede | Envolver em `document.fonts.ready` com tempo limite e reserva declarada |
| E | `window.storage` | API do ambiente de artefato, inexistente na web aberta | Substituir por `localStorage` com o mesmo contrato (`store.list/get/set` já está isolado — trocar só a implementação) |
| F | Exportação | `URL.createObjectURL` + `<a download>` falha em iOS dentro de WebView | Acrescentar reserva com `navigator.share` quando disponível |
| G | Estado | Três objetos globais mutáveis: `S`, `T`, `CR`, `TD`, `G`, `HIST` | Ao modularizar, um store por domínio com assinantes, sem framework |

---

## 2 · Decisão de arquitetura

**Stack: Vite + TypeScript, sem framework de interface.** Justificativa, não preferência:

- A aplicação é imperativa por natureza — SVG desenhado à mão, canvas, eventos de ponteiro, matemática de cor. Um framework de reconciliação não resolve nenhum problema que existe aqui e acrescenta 40 a 130 kB.
- Não há roteamento real: cinco painéis alternados por classe. Um roteador é excesso.
- O núcleo de cor é matemática pura e determinística — é exatamente o tipo de código que se beneficia de tipos e de teste unitário, e que não se beneficia de JSX.
- TypeScript importa aqui porque as estruturas de dados (`FONTS`, `LENS`, `TREND`, `EMO`) são o coração da ferramenta e um campo errado num objeto é um bug silencioso.

**Deploy: Cloudflare Pages** conectado ao GitHub, build `vite build`, saída `dist`. Sem funções de servidor: tudo é estático.

**Caminho para aplicativo:** `vite-plugin-pwa` primeiro — manifesto, service worker, instalável, funciona sem rede. Só depois, se houver necessidade real de recurso nativo, empacotar com Capacitor. Não comece por Capacitor.

---

## 3 · Estrutura de pastas alvo

```
farbenkreis/
├─ index.html                 # casca: nav, tabbar, os cinco <main>, sem conteúdo
├─ public/
│  ├─ og.png                  # 1200×630, gerado pelo bannerSvg
│  ├─ icons/                  # 192, 512, maskable
│  └─ fonts/                  # Bodoni Moda + IBM Plex Sans, woff2 subconjunto
├─ src/
│  ├─ main.ts                 # inicialização e navegação
│  ├─ core/
│  │  ├─ color.ts             # sRGB ↔ OKLab, oklch2hex com ajuste de gamut, contraste, CVD
│  │  ├─ goethe.ts            # ANCHORS, atAngle, nameOf, angleFor
│  │  ├─ codes.ts             # allCodes: hex, rgb, hsl, hsv, cmyk, lab, lch, oklch…
│  │  └─ store.ts             # persistência (localStorage) com o contrato atual
│  ├─ data/
│  │  ├─ emotions.ts  markets.ts  schemes.ts  lenses.ts  cultures.ts  music.ts
│  │  ├─ fonts.ts             # FRAW + classes + superfamílias + bancos
│  │  ├─ lexicon.ts           # léxico da página Criação
│  │  └─ trends.ts            # TREND — uma entrada por trimestre
│  ├─ palette/
│  │  ├─ generate.ts  views.ts  contrast.ts  gradient.ts  export.ts  zip.ts
│  │  ├─ wheel.ts             # roda com bolas arrastáveis
│  │  └─ history.ts
│  ├─ type/
│  │  ├─ pairing.ts  hierarchy.ts  specimen.ts  export.ts  loader.ts
│  ├─ create/
│  │  ├─ brief.ts  proposals.ts  mocks.ts  markdown.ts
│  ├─ trends/
│  │  ├─ render.ts  banner.ts
│  └─ styles/
│     ├─ tokens.css  base.css  components.css  views.css
└─ tests/
   ├─ color.test.ts           # ida e volta sRGB↔OKLab, ajuste de gamut, contraste
   ├─ goethe.test.ts          # continuidade do círculo, nomes, opostos a 180°
   ├─ zip.test.ts             # CRC-32 e integridade do pacote
   └─ options.test.ts         # todas as opções de todos os campos, o harness que já existe
```

---

## 4 · Plano de migração, com portão em cada etapa

**Etapa 1 — esqueleto.** `npm create vite@latest farbenkreis -- --template vanilla-ts`. Mover o HTML para `index.html`, o CSS para `src/styles/`, o JS inteiro para um `src/legacy.ts` importado em `main.ts`. *Portão: `npm run build` roda e a aplicação funciona idêntica.* Não refatore nada nesta etapa.

**Etapa 2 — extrair o núcleo.** Tirar `core/color.ts`, `core/goethe.ts`, `core/codes.ts` de `legacy.ts`, com tipos. Escrever `tests/color.test.ts` e `tests/goethe.test.ts` antes de mexer em qualquer fórmula. *Portão: testes passando e a paleta gerada com a mesma semente produz os mesmos hex de antes.* Guarde um instantâneo de 10 paletas do arquivo atual como referência.

**Etapa 3 — extrair os dados.** `src/data/*.ts` com interfaces declaradas. *Portão: as 258 opções continuam exercitáveis pelo harness, zero falhas.*

**Etapa 4 — extrair os domínios.** `palette/`, `type/`, `create/`, `trends/`, um por vez, cada um com seu store. `legacy.ts` deve terminar vazio e ser apagado. *Portão: `legacy.ts` não existe mais.*

**Etapa 5 — consolidar o CSS.** Resolver a pendência A: uma camada só, tokens em `tokens.css`. *Portão: comparação visual das cinco páginas em luz e treva, antes e depois, em 390, 768 e 1440 de largura.*

**Etapa 6 — endurecer.** Pendências B a G. Lighthouse, axe, dispositivos reais. *Portão: relatório de auditoria emitido com números, não adjetivos.*

**Etapa 7 — publicar.** Abaixo.

---

## 5 · Publicação

```bash
# repositório
git init && git add -A
git commit -m "Farbenkreis: instrumentos de cor e tipografia"
gh repo create farbenkreis --public --source=. --push
```

Cloudflare Pages, painel → Workers & Pages → Create → Pages → conectar ao GitHub:

| Campo | Valor |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | variável `NODE_VERSION` = `20` |

`public/_headers`:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com; img-src 'self' data: blob:; script-src 'self'; connect-src 'self'
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

A CSP acima **quebra a página de tipografia se as famílias do banco forem bloqueadas** — `style-src` e `font-src` precisam mesmo liberar Google Fonts e Fontshare, já que o instrumento carrega famílias sob demanda. Se preferir CSP fechada, auto-hospede as 93 famílias, o que custa cerca de 4 MB e elimina a dependência.

Depois do primeiro deploy, verifique na URL real, não em local: `curl -I` para conferir os cabeçalhos, e o inspetor de pré-visualização de link do WhatsApp e do LinkedIn para conferir o `og:image`.

---

## 6 · Portões de qualidade

| Medida | Alvo | Ferramenta |
|---|---|---|
| Peso servido do HTML e JS inicial | ≤ 90 kB com brotli | `npx vite-bundle-visualizer`, cabeçalho da resposta |
| LCP em 4G simulada | ≤ 2,5 s | Lighthouse, modo móvel |
| CLS | ≤ 0,1 | idem |
| INP na roda arrastável | ≤ 200 ms | perfil do Chrome durante o arraste |
| Violações do axe | 0 críticas e 0 sérias | `@axe-core/cli` nas cinco páginas, luz e treva |
| Contraste dos tokens | ≥ 4,5 em todos os pares de texto | teste unitário com a fórmula WCAG, falha o build |
| Opções de campo | 258 exercitadas, 0 falhas | `tests/options.test.ts` |
| Safari iOS | roda arrastável, `backdrop-filter` na tabbar, `aspect-ratio`, download | dispositivo real, não simulador |

---

## 7 · O que não pode ser alterado na migração

Estas decisões são o conteúdo da ferramenta, não estilo de código. Preservar comportamento idêntico:

1. **Os seis matizes de ancoragem** do círculo reproduzem o círculo pintado por Goethe em posições de 0° a 300°, com o purpúreo no topo. Purpúreo/verde, vermelho-amarelo/azul e amarelo/vermelho-azul são opostos exatos a 180°. Qualquer mudança quebra a fidelidade histórica.
2. **Toda interpolação em OKLab**, com o croma reduzido por busca binária até caber no sRGB. Nunca cortar canais.
3. **Os três regimes** — harmônica a 180°, característica a 120°, sem caráter a 60° — são de Goethe, não do vocabulário moderno. Os seis esquemas geométricos coexistem com eles, não os substituem.
4. **Preto e branco são cores plenas** com matiz, papel e proporção. A treva de uma paleta carrega o matiz da primária levado ao extremo inferior de luminosidade.
5. **Contraste sempre calculado sobre as cores reais**, nunca sobre as simuladas para daltonismo.
6. **A nota sobre referência cultural** não é opcional e não deve ser encurtada. Pigmento e valor são o que a ferramenta empresta; grafismo — moko, kusiwa, padrões de tecelagem — é taonga e propriedade cultural. Quem remover essa nota transforma a ferramenta em extração.
7. **Os valores em hex da página de Tendências são aproximações declaradas**, não códigos oficiais. A declaração precisa continuar visível.
8. **A página Criação não faz chamada de rede.** É um motor determinístico com léxico. Se um dia virar chamada a um modelo, isso tem de ser dito na interface — não apresentar previsão de máquina como se fosse cálculo.
9. **A palavra "marca" não aparece em nenhum texto de interface.** A ferramenta serve a projetos que não são identidades corporativas.

---

## 8 · Atualização trimestral das Tendências

Acrescentar uma edição é inserir um objeto no começo de `src/data/trends.ts`:

```ts
{
  id: '2026 · T4',
  per: 'Outubro a dezembro de 2026',
  tese: 'Uma frase que resume o trimestre.',
  cor:  { tese, pal: [{ n, hex, obs }], corpo: string[], fontes: [{ n, u }] },
  tipo: { tese, fam: string[], corpo: string[], fontes: [{ n, u }] },
  comb: { tese, corpo: string[], fontes: [{ n, u }] },
  apl:  { tese, corpo: string[], fontes: [{ n, u }] }
}
```

Abas, banners, arquivo e os botões que levam aos instrumentos se montam sozinhos. `tipo.fam` precisa bater com o nome exato de uma família em `data/fonts.ts`. `pal[].hex` é aproximação em sRGB, e `obs` deve trazer o código oficial da fonte.

Fontes públicas que valem acompanhar, já usadas nas edições existentes: instituto de cor Pantone (anúncio anual em dezembro), WGSN com Coloro (cor do ano anunciada com dois anos de antecedência, em abril), relatório anual de tendências de tipo da Monotype, relatório de tendências de vida da Accenture, e cobertura editorial do It's Nice That e do The Branding Journal. Relatórios completos dessas casas são de assinatura — só o recorte público entra aqui, com link.

Se um dia isso for automatizado, o caminho é um Cloudflare Worker com cron trimestral escrevendo num KV, e a página lendo do KV com o array local como reserva. Não vale a pena antes de a ferramenta ter público.

---

## 9 · Primeira instrução ao Claude Code

> Leia `farbenkreis.html` inteiro antes de opinar. Execute a Etapa 1 do plano de migração e pare no portão: a aplicação precisa funcionar idêntica depois do `vite build`, sem refatoração nenhuma. Ao terminar, me mostre o `git diff --stat` e o peso do bundle, e espere aprovação antes da Etapa 2.
