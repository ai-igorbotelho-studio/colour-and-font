# 30 · Tokens versionados + contratos de componente

*Fase Design & UX — design-system engineer. Espec primeiro; o Head aprova antes do build.*

## Versionamento

Tokens ganham um número de versão declarado no topo de `tokens.css` e ecoado em
`DECISIONS.md`:

```
/* Auge design tokens — v1.0.0
   Compat: os nomes existentes (--ground..--deep, --r, --sh, --tw, --sp, --sp2)
   permanecem; novos degraus são aditivos. Mudança de valor de cor = minor;
   remoção/renome = major. */
```

Regra semver dos tokens: **aditivo = patch/minor; renome ou remoção = major.**
Nenhuma remoção nesta v1.0.0 — só adição de escalas de tipo e espaço, para não
quebrar o CSS que já referencia os nomes atuais.

## Novos grupos de tokens (aditivos, em `:root` e re-declarados só quando mudam)

### Escala tipográfica (não muda por tema)
```
--fs-xs, --fs-sm, --fs-base, --fs-md, --fs-lg, --fs-xl, --fs-2xl, --fs-3xl, --fs-4xl
```
Valores em §20.2. `line-height` correlato: `--lh-tight:1.02`, `--lh-snug:1.1`,
`--lh-body:1.55`.

### Escala de espaço (não muda por tema)
```
--space-1:4px --space-2:8px --space-3:12px --space-4:16px
--space-5:24px --space-6:clamp(20px,3.5vw,34px) --space-7:clamp(28px,5vw,48px)
--space-8:clamp(40px,7vw,72px)
/* apelidos de compat: */ --sp:var(--space-6); --sp2:var(--space-7)
```

### Movimento (tokeniza o que hoje é literal)
```
--dur-fast:.18s --dur-base:.25s --dur-slow:.5s   (--tw:var(--dur-… ) apelido)
--ease-out:cubic-bezier(.2,.7,.2,1)
```
Todos os `.55s`, `.34s`, `.22s`, `.18s`, `cubic-bezier(.2,.7,.2,1)` de
`motion.css`/`shell.css` passam a referenciar estes tokens. Assim a fase de
Interação afina o sistema inteiro num lugar só.

## Contratos de componente (a documentar junto ao CSS canônico)

Cada componente tem **um** arquivo dono e um contrato mínimo. Proposta de dono:

| Componente | Arquivo dono | Contrato |
|---|---|---|
| Botão `.act`/`.mini`/`.ghost` | `components.css` | tamanhos e estados da tabela §20.4; foco único |
| Tab/rail `.tab` | `shell.css` | `aria-current`/`aria-selected`; alvo ≥44 px; `--current` |
| Card `.homecard/.mock/.card/.cell/.fontcard` | `views.css` | borda `--rule`, raio `--r`, sombra `--sh`, hover único |
| Campo input/select/textarea/range | `base.css` | ≥54 px, foco único, caret custom |
| Diálogo lupa `#zoom` | `motion.css`/`motion.ts` | `role=dialog`, foco preso e restaurado, Esc/+/- |
| Grade de contraste `.ctgrid/.cell` | `views.css` | estados `.sel/.fail/.diag` (instrumento, não UI) |

Meta: eliminar as definições de estado duplicadas entre `flat.css` e `shell.css`
(hover de card e de botão hoje aparecem nos dois). Uma fonte por estado.

## Portão do sistema

- `tests/tokens.test.ts` continua medindo contraste dos pares — **estende** para
  cobrir qualquer novo par texto/fundo introduzido.
- Um teste leve novo (opcional, `tests/tokens-scale.test.ts`) pode assertar que
  `src/styles/` não contém `font-size:<número>px` fora de `var(--fs-*)` — trava a
  volta dos tamanhos avulsos. Decidir em `DECISIONS.md`.
