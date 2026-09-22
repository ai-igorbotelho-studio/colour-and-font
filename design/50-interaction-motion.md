# 50 · Interação e movimento

*Fase Interação & Motion — experience director decide quais interações servem o
conteúdo; motion / micro-interaction / scroll-motion implementam; multistack
integra. Protótipo primeiro; o Head aprova. Gate: audit-design + qa-cross-browser
+ system-performance.*

## Princípio de admissão

Cada efeito responde a **uma** pergunta do usuário. Se não responde, sai.

| Pergunta | Efeito que a responde | Veredito |
|---|---|---|
| "Para onde fui?" | View Transitions na troca de página | **Manter** |
| "Isto é novo na tela?" | Reveal-on-scroll `.rv/.in` | **Manter, afinar** |
| "Isto é clicável / ampliável?" | Hover lift, `cursor:zoom-in`, tilt leve | **Manter, reduzir** |
| "O que aconteceu ao meu clique?" | `active scale(.97)`, thumb `scale(1.25)` | **Manter** |
| "Consigo inspecionar a amostra?" | Lupa `#zoom` (teclado + toque) | **Manter, é o mais valioso** |
| decorativo (paralaxe, ímã) | parallax de título, magnet nos `.act` | **Rebaixar** (ver abaixo) |

## Inventário e ação (medido em `motion.ts`/`motion.css`)

| Efeito | Gated por reduced-motion? | Equivalente teclado/SR? | Ação |
|---|---|---|---|
| View Transitions (`nav.ts:20`) | Sim | Troca instantânea de reserva | Tokenizar duração (`--dur-*`) |
| Reveal-on-scroll (`motion.ts:20`) | Sim + rede de segurança | Conteúdo sempre no DOM | Manter; garantir que nada nasce oculto acima da dobra |
| Parallax de título (`motion.ts:37`) | Sim | Decorativo | **Rebaixar**: manter só se não custar INP; medir no gate de performance |
| Tilt no ponteiro (`motion.ts:48`) | Sim + hover/fine | Decorativo | Reduzir amplitude; já hover-only |
| **Lupa `#zoom`** (`motion.ts:57`) | Fade gated; diálogo sempre | **Sim**: `role=dialog`, foco preso+restaurado, Esc/+/- | Manter; **adicionar Tab-trap explícito** dentro do diálogo |
| Magnet nos `.act` (`motion.ts:92`) | Sim + hover/fine | Decorativo | **Rebaixar**: escreve `style.transform` inline e briga com o hover CSS; medir custo, considerar remover |
| Hover lift em botões/cards | Sim | — | Tokenizar (`--dur-fast`, `--ease-out`) |
| Kill-switch `*{transition:none}` (`base.css:90`) | — | — | Manter |

## Requisitos novos desta fase (todos com equivalente de teclado/SR)

1. **Foco ao trocar de página.** `goto()` deve mover o foco ao `h1`/`<main>` da
   nova página (`tabindex="-1"`, sem rolar duas vezes). Sem isso, teclado e leitor
   de tela ficam presos na navegação. É correção de acessibilidade, não enfeite.
2. **Anúncio de mudança.** Ao gerar paleta/proposta, um `aria-live="polite"`
   discreto anuncia "paleta atualizada" para o leitor de tela (o `#toast` já
   existe visualmente; dar-lhe papel `status`).
3. **Tab-trap na lupa.** O diálogo já prende foco na abertura e restaura no
   fechamento; falta ciclar Tab/Shift+Tab **dentro** dele. Adicionar.
4. **Reduced-motion cobre tudo o que for novo.** Qualquer efeito adicionado
   entra sob `@media(prefers-reduced-motion:no-preference)` e é desligado pelo
   kill-switch. Sem exceção.

## Protótipo (o que entrego para aprovação antes de tocar `src/`)

Um HTML estático isolado em `design/proto/motion.html` (não entra no build) que
demonstra, lado a lado e alternável:
- troca de página com/sem View Transitions e com/sem reduced-motion;
- reveal afinado vs atual;
- lupa com o Tab-trap novo;
- foco-ao-trocar-página com leitor de tela.

O protótipo usa os tokens `--dur-*`/`--ease-*` propostos, para o Head ver os
tempos reais. **Nenhuma mudança em `src/` até aprovação do protótipo.**

## Gate desta fase

- **audit-design**: `audit:axe` 0 críticas/sérias nas 7 páginas × luz/treva.
- **qa-cross-browser**: `audit:smoke` 0 erros JS; nota declarada do que só se
  verifica em aparelho real (Safari iOS `100dvh`, `backdrop-filter`, INP no arraste).
- **system-performance**: `audit:lighthouse` mantém ≥98 móvel, LCP ≤2,5 s, CLS 0;
  medir **INP** do arraste da roda e do parallax — se o parallax/ímã custar INP,
  são removidos (o princípio de admissão manda).
