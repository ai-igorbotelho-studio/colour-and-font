# 00 · Visão e barra de referência

*Fase Design & UX — direção de experiência e criativa. Espec primeiro; o Head aprova antes do build.*

## O que Auge é

Um **instrumento** de cor e tipografia numa página só: paletas derivadas da roda
de Goethe, pareamento tipográfico entre ~130 famílias livres, e briefes de três
propostas. Motor puro, determinístico, offline. Não é um site de marketing — é
uma ferramenta que se usa, então a régua não é "impressionar", é **precisão,
legibilidade e continuidade de mão**.

## Barra de referência

O estado atual já é forte (Lighthouse 98–99, axe limpo, 40/40 janelas, tokens
com contraste no portão). A referência para esta rodada **não é um redesenho** —
é elevar o acabamento ao nível de um instrumento de estúdio:

| Eixo | Referência | O que significa aqui |
|---|---|---|
| Ritmo tipográfico | Espécimes tipográficos impressos | Uma escala modular única, não ~25 tamanhos avulsos |
| Espaço | Editorial suíço | Um passo de espaço declarado, não `clamp()` repetido caso a caso |
| Cor | O próprio instrumento | A UI nunca compete com as amostras; cromia da interface fica sóbria |
| Movimento | Painel de instrumentos | Curto, funcional, sempre reversível, sempre com equivalente de teclado |
| Densidade | Mesa de trabalho | Informação legível em 320 px sem rolagem horizontal, respirando em 1920 px |

## Princípios (o que ganha o seu lugar)

1. **A amostra manda.** Toda decisão de UI cede o palco às cores e às fontes que
   o instrumento produz. Cromia, sombra e movimento da casca são discretos.
2. **Uma escala, não muitas exceções.** Tamanho de texto, espaço e raio vêm de
   um conjunto pequeno de tokens versionados. Exceção precisa de justificativa em
   `DECISIONS.md`.
3. **Legibilidade é invariante.** Todo par de texto ≥ 4,5:1, medido nas cores
   reais (já no portão em `tests/tokens.test.ts`). Nada nesta rodada afrouxa isso.
4. **Movimento serve o conteúdo ou não existe.** Cada efeito responde a uma
   pergunta ("o que mudou?", "para onde vou?"). Sem enfeite. Tudo desligável por
   `prefers-reduced-motion`, tudo com caminho de teclado/leitor de tela.
5. **Sem regressão de peso nem de fidelidade.** `tests/reference.json` e o peso
   servido (brotli ≤ 90 kB) são limites, não metas móveis.

## Não-objetivos

- Nenhum framework de UI, nenhuma dependência de runtime nova.
- Nenhuma mudança nos invariantes do §7 (âncoras de Goethe, OKLab, três regimes,
  preto e branco como cores, Criação sem rede, a palavra "marca" fora da interface).
- Nenhuma rede na primeira pintura.
