# Auge — espec de Design & UX + Interação & Motion

*Consolidação para aprovação. Emitido em 22 de setembro de 2026. Espec primeiro;
o Head aprova antes de qualquer mudança em `src/` ou build.*

Esta rodada é uma **otimização**, não um redesenho. Base medida: Lighthouse
98–99, axe 0 críticas/sérias, 40/40 janelas 320–1920, tokens com contraste no
portão, movimento todo desligável por `prefers-reduced-motion`, lupa acessível
por teclado. Nada disso regride.

## Documentos de espec (em `/design`)

| Doc | Papel | Entrega |
|---|---|---|
| `00-vision-reference.md` | Direção de experiência e criativa; barra de referência; princípios | Visão |
| `10-ux-architecture.md` | Fluxo, hierarquia, foco ao navegar, um `h1` por página | UX |
| `20-visual-system.md` | Cor, **escala de tipo modular**, escala de espaço, estados | UI |
| `30-tokens-components.md` | **Tokens versionados (v1.0.0)** + contratos e donos de componente | Sistema |
| `40-responsive-grid.md` | Consolidar 11 breakpoints em 5 nomeados, sem mudar comportamento | Grade |
| `50-interaction-motion.md` | Quais interações servem o conteúdo; protótipo; reduced-motion + teclado | Motion |

## O maior ganho (por que vale)

1. **Escala de tipo única.** Hoje ~25 tamanhos px avulsos + ~20 `clamp()`
   únicos. → 9 tokens `--fs-*` modulares. Ritmo consistente, CSS menor.
2. **Escala de espaço única.** Hoje só `--sp/--sp2` + `clamp()` repetidos. →
   `--space-1..-8`, apelidos de compat para não quebrar nada.
3. **Deriva de fontes resolvida.** `tokens.css` hospeda DM Serif/Mulish/Roboto,
   mas o CSS usa Bodoni Moda e IBM Plex e o `package.json` traz as cinco. →
   Escolher uma trilha (A: assumir Bodoni+Plex; B: voltar ao trio) → **menos
   woff2 na primeira pintura**.
4. **Estados de componente numa fonte só.** Hover/foco hoje duplicados entre
   `flat.css` e `shell.css`. → um dono por componente.
5. **Movimento afinado por tokens** (`--dur-*`/`--ease-*`) e limpo do que não
   serve o conteúdo (parallax/ímã sob medição de INP).
6. **Acessibilidade de navegação:** foco move ao trocar de página; `aria-live`
   nas gerações; Tab-trap na lupa.

## Portões (gates) — critérios de aprovação do build, por fase

| Fase | Gate | Critério |
|---|---|---|
| Design & UX | audit-design | `audit:axe` 0 críticas/sérias · `audit:shots`/`diff` sem regressão de pixel não-declarada · `tokens.test.ts` verde |
| Grade | qa-cross-browser | `audit:viewports` **40/40** · `audit:smoke` 0 erros JS |
| Interação & Motion | audit-design + qa + system-performance | axe verde · Lighthouse ≥98 móvel, LCP ≤2,5 s, CLS 0 · **INP** medido no arraste; efeito decorativo que custa INP sai |
| Fidelidade (invariante) | — | `audit:ref`/`reference.json` 0 divergências · `i18n.test.ts` ("marca" fora) · `goethe`/`color` verdes |
| Peso | system-performance | brotli(html+js+css) ≤ 90 kB · 0 requisições externas na primeira pintura |

## Sequência proposta (após aprovação)

1. Tokens v1.0.0 aditivos (tipo, espaço, movimento) — sem tocar valores existentes.
2. Migrar `font-size`/espaço para tokens, página a página, com `audit:shots` a
   cada passo.
3. Resolver deriva de fontes (trilha escolhida em `DECISIONS.md`).
4. Consolidar estados de componente (uma fonte por estado).
5. Consolidar breakpoints nomeados.
6. Protótipo de motion (`design/proto/motion.html`) → aprovação → integrar em
   `src/`.
7. Rodar todos os gates; emitir adendo de auditoria em `docs/`.

## Decisões que dependem do Head

Ver `DECISIONS.md` (raiz). As abertas D-1..D-5 precisam da sua escolha **antes**
de eu começar o build.
