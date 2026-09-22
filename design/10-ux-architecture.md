# 10 · Arquitetura de UX — fluxo e hierarquia

*Fase Design & UX — UX architect. Espec primeiro; o Head aprova antes do build.*

## Mapa atual (medido)

Página única, sete destinos alternados por `.page.on` (`src/nav.ts`):

| Chave | Rótulo | Papel | `data-section` |
|---|---|---|---|
| `home` | Início | Vitrine: roda de Goethe, esquemas, misturadores, classes | content |
| `cores` | Palette | **Instrumento** de paleta | tool |
| `tipo` | Typography | **Instrumento** de pareamento | tool |
| `criacao` | Create | **Instrumento** de brief/propostas | tool |
| `tend` | Trends | Leitura de tendências | content |
| `cont` | Contents | Revista/editorial | content |
| `fund` | Teoria | Fundamentos | content |
| — | Visualização | Maquetes (módulo tardio, sem aba) | — |

O trilho lateral (≥1024 px) e a tabbar (<1024 px) já distinguem **ferramenta**
de **conteúdo** por `--section-bg`. Isso é bom e fica.

## Problemas de hierarquia a corrigir

1. **Densidade de nível 1 desigual.** As três ferramentas (Palette/Type/Create)
   têm cabeçalhos com escalas diferentes (`h1` fluido vs `.maghead h1` vs
   posteres com clamps próprios). Efeito: o topo de cada ferramenta "salta" de
   tamanho ao navegar. → Unificar o padrão de cabeçalho de ferramenta (§20).
2. **Maquetes sem porta de entrada clara.** "Visualização de exemplos" é um
   módulo tardio sem aba nem rota óbvia. → Decidir em `DECISIONS.md`: manter
   oculto (lazy) ou dar entrada explícita a partir de Palette/Type.
3. **Ordem de leitura em `<main>` por página.** Cada página é um `<main>`; o axe
   ainda aponta `page-has-heading-one`/`heading-order` moderados. → Garantir um
   único `h1` por página visível e ordem de headings sem saltos (§ gate a11y).
4. **Foco ao trocar de página.** `goto()` rola ao topo mas não move o foco para
   o novo `<main>`/`h1`. Para teclado e leitor de tela, a troca de página deve
   **mover o foco** ao cabeçalho da nova página (com `tabindex="-1"`), senão o
   foco fica preso na tabbar. → Requisito da fase de Interação.

## Fluxos principais (não mudam de forma, ganham consistência)

- **Palette:** semente → regime → roda arrastável → visualizações (cards/rings/
  prop) → grade de legibilidade → exportar. Manter; padronizar cabeçalho e o
  espaçamento entre blocos com o passo de espaço único (§20/§30).
- **Type:** filtros → pares → espécime → proposta. Idem.
- **Create:** brief → três propostas → caminho. Sem rede (invariante). Idem.

## Regras de hierarquia (a aplicar em todas as páginas)

- Um `h1` por página visível; subtítulo em `.lede` com a escala fluida única.
- Blocos de nível 2 separados por `--space-6`/`--space-7` (§30), não por
  `clamp()` avulso.
- Barras de ação (`.viewbar`, `.rolebar`, `.propstrip`) mantêm o mesmo gap e a
  mesma altura de alvo (≥44 px) em todas as ferramentas.
