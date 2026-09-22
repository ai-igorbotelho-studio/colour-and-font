# DECISIONS — registro de trade-offs

Decisões de projeto e seus custos, mais recentes no topo. Cada uma diz o que se
ganha, o que se perde, e por quê. As **abertas** precisam da escolha do Head
antes do build.

---

## 2026-09-22 · Rodada de otimização Design & UX + Interação & Motion

Espec em `/design/*` e `docs/DESIGN-UX-SPEC.md`. Rodada de **otimização** sobre
uma base já forte (Lighthouse 98–99, axe limpo, 40/40 janelas). Nenhuma mudança
em `src/` ou build antes da aprovação do Head.

### Decisões tomadas (direção proposta, sujeita a veto)

- **T-1 · Otimizar, não redesenhar.** Ganho: sem risco à fidelidade
  (`reference.json`) nem ao peso. Custo: nenhuma reinvenção visual ambiciosa.
  Coerente com o princípio "a amostra manda".
- **T-2 · Tokens aditivos v1.0.0.** Ganho: escala de tipo/espaço/movimento sem
  renomear nem remover nomes existentes; `--sp/--sp2/--tw` viram apelidos. Custo:
  convivência temporária de token novo + literal até a migração terminar.
- **T-3 · Razão modular 1.20 ancorada em 15 px.** Ganho: ritmo previsível, perto
  dos tamanhos atuais (pouca diferença de pixel). Custo: alguns tamanhos avulsos
  mudam 0,5–1 px; medido por `audit:shots`.
- **T-4 · Container queries permanecem** para as grades internas. Ganho: reagem à
  largura real (que muda com o trilho). Custo: nenhum; superiores a media queries aqui.

### Decisões resolvidas pelo Head (2026-09-22)

- **D-1 · Deriva de fontes → (A) Assumir Bodoni + IBM Plex.** `@font-face` +
  `preload` de Bodoni Moda e IBM Plex Sans em `tokens.css`; remover DM Serif/
  Mulish/Roboto e as deps não usadas. Ganho: preserva o visual atual e reduz
  woff2 na primeira pintura. Custo: perde-se o trio de origem.
- **D-3 · Maquetes → entrada explícita a partir das ferramentas.** Adicionar
  link claro de Palette/Type para a Visualização. Ganho: descoberta. Custo:
  um ponto de navegação a mais (fora da tabbar de topo, para não inchá-la).
- **D-4 · Efeitos decorativos → remover se custarem INP.** Parallax e ímã são
  medidos no gate de performance; saem só se custarem latência. Ganho: sem
  regressão de INP. Custo: podem permanecer se forem gratuitos.
- **D-5 · Idioma → espelhar em EN.** Docs mantêm o PT e ganham espelho em inglês
  (UK primário na interface). Canônico para aprovação: `docs/DESIGN-UX-SPEC.en.md`.
  Custo: manutenção dupla; os espelhos de `/design` acompanham o build.

### Decisão ainda ABERTA

- **D-2 · Trava anti-regressão de escala.** Adicionar teste que proíbe
  `font-size:<n>px` fora de `var(--fs-*)`, com allowlist para as exceções
  editoriais (drop-cap `3.6em`, hex Bodoni)? Padrão proposto: **Sim, com
  allowlist**. Confirmar no início do build.

### Build — rodada 1 (fundação, verificada)

Entregue e verificado nos portões determinísticos:
- **Tokens v1.0.0 aditivos** (tipo, espaço, movimento) em `tokens.css`, com apelidos
  de compat (`--sp/--sp2/--tw`). Valores = os já usados → refator sem drift.
- **Tipo primário migrado** para tokens em `base.css`/`fluid.css` (corpo, h1–h4,
  `.lede`, `.sm`, rodapé) — valores idênticos.
- **Curva de movimento tokenizada** (`--ease-out`) em `motion/shell/components.css`.
- **Bodoni Moda auto-hospedada** (D-1/A): woff2 em `public/fonts`, `@font-face`.
  Sem `preload` — é display-only e `font-display:swap` cobre; poupa ~28 kB no
  caminho crítico. Realiza a intenção: os 6 pontos display saem do serif genérico
  para Bodoni real (diferença deliberada em `audit:shots`).
- **Acessibilidade**: foco vai ao cabeçalho ao trocar de página (`nav.ts`);
  `#toast` vira `role=status`/`aria-live` (anúncio das gerações); Tab preso no
  diálogo da lupa (`motion.ts`).
- **Portão de build consertado**: `matchMedia`/observers/timers de `motion.ts`
  agora tolerantes a ambiente sem navegador; `npm run build` (que roda `vitest`)
  passa de forma determinística (5/5). Antes falhava aqui de forma intermitente.

Portões medidos nesta rodada: `tsc` limpo · `vitest` 103/103, 5/5 sem erro ·
`tokens.test.ts` 34/34 (contraste dos pares ≥ 4,5:1) · `vite build` ok ·
`audit:viewports` **10 janelas × 7 páginas limpas** (320–1920).

### Achado ABERTO — contraste (pré-existente, não desta rodada)

`audit:axe` acusa **0 críticas, 28 sérias** de `color-contrast`. Diff desta
rodada é **neutro em cor** (provado: nenhuma cor nem tamanho dos elementos
marcados mudou), logo as 28 já existiam na base — o "0 sérias" da AUDITORIA
estava velho (o cabeçalho do `axe.mjs` ainda diz "cinco páginas", mas o código
percorre 7, incluindo `cont` e `fund`, adicionadas depois).

Causa-raiz: `nav.ts` reatribui `--accent` a uma âncora de Goethe por página, mas
`--accent-ink` fica fixo em quase-preto — então `.act` (ex.: `#gen`) e `.kicker`
em `var(--accent)` reprovam 4,5:1 nas âncoras mais escuras (pior em treva); e as
`.kicker`/`.magcard` de `cont` têm pares próprios que reprovam.

Proposta (próximo passo com portão): **tinta ciente de luminância por âncora** —
escolher tinta clara ou escura conforme a luminância da âncora, e revisar os
tons de `.magcard`. Toca o sistema de acento e precisa de verificação no
navegador; fica para um commit próprio, revisado, não escondido neste.

### Nota de ambiente

As auditorias de navegador (`axe`/`viewports`/`shots`) exigem servidor + Chromium
headless e são instáveis neste ambiente remoto (processos de fundo recebem
SIGTERM entre chamadas; `pkill` derruba o próprio grupo). Rodar servidor e
auditoria numa só chamada, sem `pkill`, funciona.

### Invariantes reafirmados (não entram em trade-off)

Âncoras de Goethe e opostos 180°, OKLab com busca binária de croma, três regimes,
preto e branco como cores, contraste medido nas cores reais (WCAG 2.1), Criação
sem rede, hex de Tendências como aproximação declarada, a palavra "marca" fora da
interface. Guardados por `goethe/color/i18n/tokens.test.ts` e `reference.json`.
