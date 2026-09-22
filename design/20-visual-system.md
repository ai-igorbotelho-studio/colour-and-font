# 20 · Sistema visual — cor, escala de tipo, espaço, estados

*Fase Design & UX — UI designer. Espec primeiro; o Head aprova antes do build.*

## 20.1 Cor

Os tokens de cor (`tokens.css`) já são sóbrios e passam no portão de contraste
(16 pares ≥ 4,5:1, `--ink/--ground` ≥ 7:1). **Não mudam de valor.** O que muda:

- Consolidar a **escala de régua** (`--rule`, `--rule2`) — hoje é a única escala
  de cinza; declarar um terceiro degrau opcional `--rule3` só se um separador
  mais tênue for necessário (evitar borda "quase invisível" ad-hoc).
- **Cromia da interface fica no lugar do acento.** `--accent` já é reatribuído
  por página à âncora de Goethe (`nav.ts:12-14`) — bom. Nenhum novo tom de UI.

## 20.2 Escala tipográfica (o maior ganho)

**Estado atual:** ~25 tamanhos px avulsos (11 → 34) + ~20 `clamp()` únicos, sem
razão modular. Famílias em uso divergem do declarado: `tokens.css` só hospeda
**DM Serif Display + Mulish + Roboto Mono**, mas o CSS referencia **Bodoni Moda**
e **IBM Plex Sans**, e o `package.json` traz as cinco. → **Deriva a resolver.**

### Proposta: uma escala modular única, versionada em tokens

Razão **1.20 (menor terça)** ancorada em 15 px (corpo atual), degraus fluidos com
`clamp()` derivado do degrau, não improvisado:

| Token | Papel | Alvo (min → max) |
|---|---|---|
| `--fs-xs` | micro-rótulo, mono | 11 → 12 px |
| `--fs-sm` | apoio, legenda | 12.5 → 13 px |
| `--fs-base` | corpo | 15 → 16 px |
| `--fs-md` | lede, subtítulo | `clamp(15px,1.6vw,17px)` |
| `--fs-lg` | h4 / cabeçalho de bloco | `clamp(18px,2.4vw,24px)` |
| `--fs-xl` | h3 | `clamp(20px,3.4vw,30px)` |
| `--fs-2xl` | h2 | `clamp(22px,4.2vw,32px)` |
| `--fs-3xl` | cabeçalho de ferramenta | `clamp(26px,4vw,40px)` |
| `--fs-4xl` | h1 / display | `clamp(34px,8.5vw,76px)` |

Regra: todo `font-size` em `src/styles/` passa a referenciar um token. Exceções
(drop-cap editorial `3.6em`, hex em Bodoni) ficam **declaradas** em `DECISIONS.md`
como escala editorial separada, não como valores soltos.

### Famílias — resolver a deriva

Decidir em `DECISIONS.md`, **uma** de duas trilhas:
- **(A) Assumir Bodoni + IBM Plex**: `@font-face` das duas em `tokens.css`,
  `preload` das principais, remover DM Serif/Mulish/Roboto se não usados. Ou
- **(B) Voltar ao trio declarado**: trocar as referências a Bodoni/IBM Plex por
  DM Serif/Mulish/Roboto, remover deps não usadas do `package.json`.

Ganho de qualquer trilha: **menos woff2 na primeira pintura**, stack coerente.

## 20.3 Espaço

**Estado:** só `--sp`/`--sp2` (fluid.css) + `clamp()` repetidos em ~15 lugares
(`clamp(18px,4vw,34px)` aparece várias vezes). → **Escala de espaço única** (§30):
`--space-1..-8` (4/8/12/16/24/32/48/64 base, os maiores fluidos). Todo `padding`/
`gap`/`margin` de layout passa a referenciar um degrau. `--sp`/`--sp2` viram
apelidos dos degraus certos para não quebrar o CSS existente.

## 20.4 Estados de componente (padronizar, não reinventar)

Contrato único por família (hoje espalhado por base/flat/shell/components):

| Componente | rest | hover | focus-visible | active | pressed/current | disabled |
|---|---|---|---|---|---|---|
| `.act` | preenchido acento + `--sh` | `translateY(-2px) scale(1.02)` + ímã | `outline 2px --ink` | `scale(.97)` | — | `opacity:.45` |
| `.mini`/`.ghost` | borda `--rule` | `bg --card` + `border --ink` | idem | `scale(.97)` | `[aria-pressed] bg --ink` | idem |
| `.tab` | ícone+rótulo | ícone `scale(1.12)` | idem | — | `--current` (ink/rail-on) | — |
| card (`.homecard/.mock/.card/.cell`) | borda+sombra | `translateY(-2px)` + `border --ink` | idem (foco no controle interno) | — | — | — |
| input/select/textarea | `--field`, ≥54 px | — | idem | — | — | `opacity:.45` |
| range | trilho 3 px + thumb 26 px | — | idem | thumb `scale(1.25)` | — | — |

Requisito: **um** lugar canônico por estado (evitar `hover` definido em flat.css
e shell.css ao mesmo tempo). O foco `2px solid --ink offset 2px` é o padrão único.
