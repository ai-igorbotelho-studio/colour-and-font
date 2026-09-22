# 40 · Grade responsiva 320–1920

*Fase Design & UX — frontend multistack. Espec primeiro; o Head aprova antes do build.*

## Estado medido

Já responsivo e auditado: `tests/tools/viewports.mjs` cobre 320→1920 (incl.
deitado), 40/40 combinações limpas (sem rolagem horizontal, tabbar na janela,
alvos ≥40 px). As grades usam `container queries` sobre `.wrap` +
`auto-fit/minmax(min(100%,…),1fr)` — arquitetura correta. **Não refazer.**

## Problema: breakpoints dispersos

Onze pontos de `@media` diferentes (400/520/560/640/700/720/760/800/900/1023/1024)
+ três `@container` (560/720/880). Vários fazem quase a mesma coisa em larguras
próximas. → **Consolidar numa escala nomeada**, sem mudar o comportamento visível.

### Escala de breakpoint proposta (documental + apelidos)

| Nome | Valor | Uso canônico |
|---|---|---|
| `xs` | 400 px | telefone estreito: ações em coluna |
| `sm` | 560 px | telefone: barras em 33%/50% |
| `md` | 720 px | tablet retrato: tabelas `display:table`, faixas horizontais |
| `lg` | 900 px | tablet paisagem: roda em duas colunas |
| `xl` | 1024 px | desktop: trilho lateral fixo |

Os `520/640/700/760/800` viram esses cinco pontos onde o efeito é equivalente;
onde um ponto intermediário é mesmo necessário, fica **comentado com o porquê**.
Container queries (560/720/880) permanecem — reagem à largura de conteúdo, que
muda com o trilho, e são superiores a media queries para as grades internas.

## Regras da grade (a manter e tornar explícitas)

1. **Uma coluna que respira no telefone**, `auto-fit` a partir de ~220 px de item.
2. **`min-width:0`** em itens de grade e flex (impede que select/tabela largos
   estourem a coluna) — já presente, tornar padrão documentado.
3. **Contêiner** `max-width:1180 → 1240 px` com `padding` fluido `--space` — o
   conteúdo nunca cola nas bordas nem estica demais em 1920 px.
4. **Trilho 88 px** (≥xl) via `padding-left` no corpo; tabbar com safe-areas do
   iOS (<xl). Sem mudança.
5. **Tabelas** rolam na própria caixa < md; viram `display:table` ≥ md.

## Gate desta fase

`npm run audit:viewports` deve continuar **40/40** após a consolidação. Como a
consolidação é de nomeação/agrupamento (não de comportamento), a expectativa é
zero diferença de pixel em `audit:shots`/`audit:diff` nos três tamanhos padrão.
Qualquer diferença é regressão e volta.
