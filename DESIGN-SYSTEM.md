# Auge — Design System

Reference file for Claude Design. Companion to `BRAND-GUIDE.md`. Reflects the current implementation (`src/styles/tokens.css`) plus the identity and UI direction from the ECD, Head of Foresight and digital product team creative direction. Where the new identity has not yet been implemented in code, that is marked **(proposed)**.

## Colour tokens

### Identity palette (proposed — brand-level, not yet in code)

| Token | Value | Use |
|---|---|---|
| `--brand-anchor` | `#7A2545` (Purpur) | Wordmark, sparse single accent |
| `--brand-counter` | `#F2C230` (Schwefelgelb) | Rare counter-accent; 180° from anchor |
| `--brand-ink` | `#0E0E10` | Full black, primary surface/text |
| `--brand-paper` | `#FAFAF7` | Full white (warm), primary surface/text |

Rule: never more than anchor + counter + ink + paper on screen together. No invented brand grey.

### Live UI tokens (current implementation — `src/styles/tokens.css`)

Light (`:root`):
```
--ground:#FFFDF9   --panel:#F3F7FC   --ink:#00000E   --soft:#4A3F47
--rule:rgba(0,0,14,.30)   --rule2:rgba(0,0,14,.14)   --field:#F3F1EC
--rail:#00000E   --rail-ink:#FFFDF9   --rail-soft:#B9B4BC
--rail-on:#DE3D7D   --rail-on-ink:#00000E
--card:#D4E7FA   --frame:#D4E7FA
--accent:#DE3D7D   --accent-ink:#00000E   --deep:#700034
```

Dark (`html[data-ground="treva"]`):
```
--ground:#00000E   --panel:#0F1121   --ink:#FFFDF9   --soft:#C6C1CB
--rule:rgba(255,253,249,.34)   --rule2:rgba(255,253,249,.17)   --field:#171A2E
--rail:#000008   --rail-ink:#FFFDF9   --rail-soft:#AAA5AE
--rail-on:#DE3D7D   --rail-on-ink:#00000E
--card:#141729   --frame:#000008
--accent:#DE3D7D   --accent-ink:#00000E   --deep:#F7A3C4
```

Contrast contract: every text/surface pair stays ≥4.5:1 under the real WCAG 2.1 formula, enforced by `tests/tokens.test.ts` — never soften this test to ship a colour.

**Open reconciliation (blocking full identity rollout):** `--accent`/`--rail-on` currently sit at `#DE3D7D`, distinct from the proposed `--brand-anchor` (`#7A2545`). Decide one of: (a) migrate `--accent`/`--rail-on`/`--deep` to the Purpur/Schwefelgelb family, or (b) keep the live UI accent as a separate "interaction colour" from the "identity colour" and document the split explicitly. Do not ship both unreconciled.

## Typography tokens

Current implementation:
```
Display:  "DM Serif Display"  (400, normal + italic)
Body:     "Mulish"            (variable 200–1000, normal + italic)
Mono:     "Roboto Mono"       (variable 100–700)
```

Proposed identity typefaces (not yet implemented — requires licensing/loading decision, see Brand Guide §10.2):
```
Display/wordmark:  Suisse Int'l Bold, tight tracking, lowercase
Editorial/long-form (Theory, Trends): Fraunces, variable optical size
Interface labels:  Suisse Int'l, regular weights
```

**Token extraction task (structural, independent of typeface decision):** pull family/weight/tracking out of hardcoded declarations in `base.css`/`components.css` into named custom properties — `--font-display`, `--font-body`, `--font-mono`, `--track-display` — so either typeface set can be swapped without hunting `font-family` across files.

## Structural tokens (not brand — do not touch when reskinning)

```
--r:22px      --r2:15px      --pill:999px     (radius)
--sh:0 8px 26px rgba(0,0,14,.12)               (shadow, light)
--sh:0 8px 26px rgba(0,0,0,.6)                 (shadow, dark)
--tw:.38s                                      (motion timing — current, single value)
```

Proposed additions: `--sh-2` (hover/active elevation, distinct from resting shadow), `--tw-fast` (micro-interaction, ≤150ms) and `--tw-slow` (section transition) to replace the single `--tw` value.

## Layout principle: Goethe logic → layout rules

- **Black/white as full colours, not neutral filler:** any large surface (section background, full card) must draw from the named Goethe/identity palette — never a generic UI grey (e.g. `#F5F5F5`) with no name in the system.
- **Positive/negative → figure-ground polarity between sections**, not a gradient. Nav and Colour may invert polarity (light-on-dark ↔ dark-on-light) at a section boundary; Type/Create/Trends/Theory inherit the active polarity rather than inventing their own.
- **Intensification → scale, not added colour.** Hierarchy rises through size, weight and surrounding whitespace. One `--accent` on screen at a time — if the brand palette offers two accents, the ECD picks which one is "the" accent per context; the system never sums them.
- **Contrast is a feature.** Where interaction is critical (colour wheel, active Type selection), use contrast at the upper end the palette allows, not the AA minimum.

## Component states requiring full specification

| Component | Required states |
|---|---|
| Nav / rail | default · hover · `:focus-visible` (own ring, not browser default) · active/current section · current+hover (distinct from current alone) · disabled |
| Colour wheel / scheme selector | default · dragging · snapped · keyboard-focus · out-of-gamut (soft error, never silent clip) |
| Trend card | default · hover · focus · loading (skeleton, not spinner) · image error · saved-as-reference |
| Type pairing sample | default · hover (enlarged preview) · selected · comparing (side-by-side) · font-loading (controlled FOIT/FOUT, `font-display:swap` already present) |
| Create buttons/fields | disabled (true disabled, not just opacity) · inline error (validation message, not just red border) |

## Responsive rules (320px → 1920px+)

| Range | Behaviour |
|---|---|
| 320–479px | Nav → fixed compact bar (icons, no text label); 1 column; colour wheel full-width minus 16px padding; real ≥40px tap targets (padding included in hit area) |
| 480–767px | Nav gains short labels; Trends/Type → 1 column, full-bleed cards; Create → single vertical flow (brief → proposal), no side-by-side |
| 768–1023px | 2 columns in Trends/Type; nav may become a thin side rail; wheel + reading panel side-by-side starts here |
| 1024–1439px | Reference desktop layout; 3-column card grids |
| 1440–1919px | Increase padding/margin, not column count; cap reading blocks at ~70ch even as container widens |
| ≥1920px | Centred container with fixed `max-width`; full-bleed background uses a named Goethe/identity colour, never stretched components |

Cross-cutting: grids use `minmax(0, 1fr)`; no fixed px width above 320px container width; verify with `npm run audit:viewports` before any layout-touching merge.

## Motion principles

1. Animate state change in the data (scheme swap, pairing swap, proposal advance) — not decoration. Generic card hover stays ≤150ms.
2. Motion narrates Goethe's causality: a 180° hue flip crosses the wheel, it does not linear-crossfade.
3. Section transitions are the figure-ground polarity swap (background inversion), not a page slide.
4. `prefers-reduced-motion: reduce` shortens duration and swaps spatial movement for opacity crossfade — it never removes state feedback (e.g. the wheel's point still jumps directly to its new position, without a tween).
5. Never animate long-form reading text (Theory, Trends paragraphs) — only chrome and controls.

## Accessibility (WCAG 2.2 AA, beyond contrast)

- Colour wheel: full keyboard equivalent to drag (arrow keys = angle/hue increment, Shift+arrow = larger step), custom-slider `role`/`aria-valuenow`, and `aria-live="polite"` announcing the resulting Goethe colour name on release (not on every pixel of drag).
- Visible focus ring using `--brand-anchor`/`--accent`, verified against both `--ground` and `--panel`; never `outline:none` without a tested replacement.
- Type pairing samples: accessible label naming the typeface (not visual-only), Tab order follows the visual side-by-side order.
- Touch targets: 2.2 requires spacing between adjacent small targets (e.g. colour swatches in a grid), not just ≥40px size.
- No focus traps in Create's proposal flow or any drag interaction — Esc always exits drag mode without losing the current value.

## Pre-deploy gate (must pass before this identity ships)

1. `npx tsc --noEmit` and `npx vitest run` green, including `tests/tokens.test.ts` (real 4.5:1 contrast) and `tests/i18n.test.ts` (no "marca"/"brand").
2. `npm run audit:viewports` — zero horizontal scroll 320→1920px, every interactive target ≥40px effective.
3. `npm run audit:axe` — zero critical/serious, extra attention to focus visibility and accessible names on the wheel and type samples.
4. `npm run audit:ref` — palette/pairing/proposal outputs still match `reference.json` (new identity changes the skin, never the calculation).
5. Manual check of `prefers-reduced-motion: reduce` on at least: section transition, wheel rotation, pairing swap.
6. Visual inspection at 320 / 768 / 1920px across all 5 sections in both `data-ground` states — confirm no new brand token introduced a generic grey.
7. No new hardcoded `font-family` or colour outside `src/styles/tokens.css` (grep before merge).

## Editorial data-model notes (Trends/Contents — for engineering handoff)

Proposed additions to `src/data/trends.ts`:
- `Axis.horizon: 'faint' | 'emerging' | 'established' | 'receding'`
- `Axis.whyNow: string` (≤30 words)
- `TrendColor.horizon` (same enum, per named colour)
- `TrendColor.ref: string` (named cultural/design anchor)
- `Edition.contra: string` (Counter-reading axis)
- `Edition.revisions: string` (Revisions note vs. prior 4 editions)

Axis rename (EN labels only, keep existing `cor`/`tipo`/`comb`/`apl` keys): Colour · Letterform · Pairing · Surface. New i18n entries required in `src/i18n/ui-en.ts` and `data-en.ts`; PT labels: Tênue · Emergente · Assentado · Em recuo for horizon values.

## Open items

See `BRAND-GUIDE.md` §10 for the full list (palette reconciliation, typeface migration decision, trademark screening, data-model implementation). This file will need a second pass once those decisions are made.
