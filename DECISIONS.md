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

### Invariantes reafirmados (não entram em trade-off)

Âncoras de Goethe e opostos 180°, OKLab com busca binária de croma, três regimes,
preto e branco como cores, contraste medido nas cores reais (WCAG 2.1), Criação
sem rede, hex de Tendências como aproximação declarada, a palavra "marca" fora da
interface. Guardados por `goethe/color/i18n/tokens.test.ts` e `reference.json`.
