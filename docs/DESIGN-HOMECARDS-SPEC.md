# Home cards — high-fidelity spec (handoff to frontend/design-system engineering)

Author: UI Designer subagent. Scope note: this subagent writes design specs only
(`/design/**`, `/docs/**`), never production code (`index.html`, `src/**`).
The task that generated this file asked for direct CSS/HTML/TS edits; per this
subagent's role boundary that implementation must be done by
`web-dev-frontend-multistack` / `web-dev-design-system-engineer`. This document
is the complete, implementation-ready spec for that handoff — token names,
states, markup deltas and verification steps — so no design judgement is left
open when they pick it up.

Companion to `DESIGN-SYSTEM.md` and `BRAND-GUIDE.md`. Does not introduce new
colour hex values; consumes existing tokens in `src/styles/tokens.css` only.

## 1. Current state (baseline, for diffing)

- Markup: `index.html` lines 59–66, six `<button class="homecard" data-goto="…">` inside `.homegrid` (line 59).
- Style: `src/styles/shell.css` lines 74–84.
  - `.homegrid`: `auto-fit, minmax(220px,1fr)`, gap 12px.
  - `.homecard`: flat `--card` fill, 1px `--rule2` border, `--r` radius, min-height 170px, icon 26px, title `--font-display` 24px, body 13px `--soft`.
  - Hover: border → `--ink`, `translateY(-2px)`, `--sh` shadow. No `:focus-visible` rule of its own (falls back to UA outline or the general one, needs checking), no `:active` state, no disabled state.
  - Hero (first card, Colour): solid `--accent` fill overriding `--ink`/`--soft` via `:first-child`.
- Motion: `src/motion.ts` drives page-entrance and a tilt/parallax effect; confirm exact hook name/selector before wiring new states (out of this doc's scope — implementer to grep `homecard` in `motion.ts`).

## 2. Diagnosis against brand/DESIGN-SYSTEM

- Six cards read as generic dashboard tiles: identical geometry, one flat "coloured tile" trick to mark the hero, no elevation scale, no focus ring of its own, no active/pressed feedback — this is the "decorative, not precise" failure mode BRAND-GUIDE.md §2 warns against ("seeing is measurable... a designer's choice can be shown, not merely felt" — the card system currently shows nothing about the six sections' relationship to each other).
- DESIGN-SYSTEM.md §"Component states requiring full specification" does not name the home grid explicitly but the general nav/card pattern requires: default · hover · `:focus-visible` (own ring) · active · current/disabled-equivalent. Home cards currently have default + hover only.
- DESIGN-SYSTEM.md flags `--sh-2` (hover/active elevation distinct from resting shadow) and `--tw-fast`/`--tw-slow` as proposed structural tokens — this is the sanctioned place to add them.
- "One `--accent` on screen at a time" (layout principle, §Intensification) is already respected (only the Colour card carries `--accent`) — keep that; do not add a second accent card.

## 3. Design direction

### 3.1 Hero treatment — recommendation: keep singular hero, give the other five *quiet* presence instead of parity

Two options were weighed:
- (a) Give all six cards more presence (larger, bordered, icon treatment) so the hero reads only through fill colour, as today.
- (b) Keep exactly one hero (Colour) but make the five siblings noticeably more "instrument-like" — a thin rule-based structure, a coordinate/index mark, tabular numerals — so the hero stands out through *material* (accent fill) while the rest gain *precision* (measured grid marks), rather than everyone competing at the same visual weight.

**Recommendation: (b)**. Rationale: BRAND-GUIDE.md's positioning is "precise, not decorative" — inflating all six cards' color/scale to match the hero would read as decoration (more chrome), whereas giving the five siblings a measured index treatment (a card index number "01–06", a hairline top rule, monospace meta line) makes the whole grid read as an instrument panel, with Colour as the single active reading and the rest as inactive-but-precise dials. This also keeps "one accent on screen" honestly singular rather than diluting it.

Concretely:
- Add a leading two-digit index (`01…06`) above the icon on every card, `--font-mono`, `11px`, `--soft`/`--accent-ink` on the hero, tabular-nums, tracked `.04em`. This is the "instrument panel" signal (a plate number), reused nowhere else on the page so it doesn't compete with nav numbering (there is none).
- All five non-hero cards get a 1px top hairline in `--rule2` *inside* the card (a thin rule under the index row) rather than only the outer border — this is the "measured line," not a decorative flourish.
- Hero (Colour) card keeps its solid `--accent` fill but drops the redundant icon-stroke treatment shared with siblings: its icon renders in `--accent-ink` fill+stroke at a slightly larger 30px (vs 26px siblings) — the one place scale differs, matching "Intensification → scale, not added colour" (DESIGN-SYSTEM.md §Layout principle).

### 3.2 Grid rhythm and spacing

- `.homegrid`: increase gap from `12px` to `16px` at ≥768px (use existing fluid pattern in `fluid.css`/`flat.css` — implementer should follow whatever `clamp()`/breakpoint convention those files already use rather than introduce a new one). Keep `12px` below 480px to preserve the 1-column full-bleed density already correct per Responsive rules table.
- Card internal padding: increase from `22px 20px 20px` to `24px 22px 22px` at ≥768px; keep as-is below that (do not increase padding on small screens — DESIGN-SYSTEM.md 320–479px row already asks for tight ≥40px-tap padding, not more).
- Card min-height: raise from 170px to 184px at ≥768px only, to accommodate the new index row without cramping the description line-length; 320–767px keeps 170px.

### 3.3 Icon treatment

- Icons move from decorative-topper to a bounded "dial" mark: wrap each icon in a fixed 40×40px box with a 1px `--rule2` circular border (`border-radius:999px`/`--pill`) at rest; on hover the ring tightens to `--ink` (or `--accent-ink` on the hero) and the icon itself gains a 1.5px stroke-width bump (1.6 → 1.9) to read as "focused," echoing the wheel/dial vocabulary already established by the Colour icon (concentric circles) elsewhere in the product. This is a shared visual grammar with the tab bar icons (`index.html` lines 40–51 use the same icon set), reinforcing recognition between nav and home without duplicating nav's own state logic.
- Hero icon uses the same 40×40 dial box but filled `--accent-ink`-on-transparent ring so it doesn't visually merge into the solid accent background (avoid the icon disappearing against its own fill).

### 3.4 New/extended tokens (additive only — no hex changes)

Add to `src/styles/tokens.css`, under both `:root` and `html[data-ground="treva"]` blocks, following existing naming:

```
--sh-2: 0 14px 34px rgba(0,0,14,.16)      /* light — hover/active elevation, one step above --sh */
--sh-2: 0 14px 34px rgba(0,0,0,.68)       /* dark variant, same property under data-ground="treva" */
--tw-fast: .15s                            /* micro-interaction ceiling, per Motion principles §1 */
--tw-slow: .5s                             /* reserved for section-level transitions, not used by cards */
```

Cards use `--tw-fast` for hover/focus/active transitions (border, transform, ring) and reserve `--tw` (existing `.38s`) only for the entrance/tilt animation already driven by `motion.ts` — do not slow down the hover feedback to `.38s`, that reads as sluggish for a "precise" instrument per Motion principle §1 ("Generic card hover stays ≤150ms").

### 3.5 Full state table (home cards)

| State | Visual spec |
|---|---|
| Default | As §3.1–3.3: `--card` fill (siblings) / `--accent` fill (hero), 1px `--rule2` border, index row + hairline, dial-boxed icon, `--sh` resting shadow (siblings only — hero can stay flat/no shadow to read as "the surface," per figure-ground polarity logic; do not add shadow under an already-saturated fill). |
| Hover | `translateY(-3px)` (was `-2px` — slightly more lift now that elevation has two steps), `box-shadow:var(--sh-2)`, border → `--ink` (siblings) / ring around icon → `--accent-ink` (hero, border stays `--accent`), icon stroke-width 1.6→1.9, transition `var(--tw-fast)`. Description text (`span`) unchanged — do not animate reading text per Motion principle §5. |
| `:focus-visible` | Own ring, not the browser default: `outline:2px solid var(--accent); outline-offset:3px` on the card itself (siblings) — on the hero card, since `--accent` *is* the fill, use `outline:2px solid var(--ink)` (light) / `var(--ground)` (dark, i.e. paper-on-ink) instead so the ring is visible against its own fill — verify both against `--ground` and `--panel` per DESIGN-SYSTEM.md Accessibility §. No `outline:none` anywhere in this chain. |
| Active/pressed | `translateY(-1px)` (settles between rest and hover — a physical "press"), `box-shadow:var(--sh)` (drops back one elevation step from `--sh-2}` to sell the press), transition drops to `.08s` for this specific transform only (snappier than hover-in). |
| Current section (n/a here) | Home cards do not have a "current" state — they are always launch points, not a persistent nav; no equivalent needed. Note for implementer: do not copy the nav's `.here`/active-tab styling onto home cards, it would incorrectly imply "you are on this page" while still on Home. |
| Disabled-equivalent | None of the six cards are ever disabled today. If a future card ships gated (e.g. a feature flag), spec is: `opacity:.45`, `pointer-events:none`, `cursor:not-allowed` is moot since pointer-events is off, and an `aria-disabled="true"` + a one-line inline note under the title explaining why (not just dimming) — per DESIGN-SYSTEM.md's "true disabled, not just opacity" principle for Create buttons, extended here for consistency. Not required for current 6-card scope; documented so the pattern exists if needed. |

### 3.6 Reduced motion

`prefers-reduced-motion: reduce`: drop the `translateY` lift on hover/active entirely (opacity/shadow-only feedback: `box-shadow` step still changes, position does not move), consistent with Motion principle §4. The entrance/tilt effect from `motion.ts` is out of this spec's scope but must follow the same rule if it doesn't already — implementer to check.

### 3.7 Responsive notes (delta vs. existing rules only)

- 320–479px: unchanged from current behaviour (1 column, existing padding) except: index row (`01…06`) stays, hairline stays, dial icon box shrinks to 34×34px so overall card height doesn't grow at this density.
- 480–767px: current `auto-fit,minmax(220px,1fr)` naturally gives 2 columns at typical widths in this band — keep, no change other than the shared token/state updates.
- 768–1023px and up: apply the enlarged gap/padding/min-height from §3.2; grid still `auto-fit,minmax(220px,1fr)` (works fine at these widths, no hardcoded column count needed, consistent with the "no fixed px width" cross-cutting rule).
- ≥1920px: `.homegrid` should not stretch cards arbitrarily wide — recommend adding `minmax(220px, 320px)` as the fr upper bound at this breakpoint only (i.e. `grid-template-columns:repeat(auto-fit,minmax(220px,320px))` inside a `@media(min-width:1920px)` block) so six cards form a tight instrument cluster rather than each card ballooning to fill a huge row, matching the "centred container with fixed max-width... no stretched components" rule.

## 4. Markup delta (illustrative, for implementer — not applied to `index.html`)

Each `.homecard` gains: an index `<em class="hcx">01</em>` (or similar non-semantic wrapper — implementer's call on tag), and the icon wrapped in `<span class="hcicon">…svg…</span>`. Example for the first two cards:

```html
<button class="homecard" data-goto="cores">
  <em class="hcx">01</em>
  <span class="hcicon"><svg viewBox="0 0 24 24">…</svg></span>
  <b>Cores</b>
  <span>Roda de Goethe, esquemas, lentes de estúdio, legibilidade e vinte formatos de exportação.</span>
</button>
<button class="homecard" data-goto="tipo">
  <em class="hcx">02</em>
  <span class="hcicon"><svg viewBox="0 0 24 24">…</svg></span>
  <b>Tipografia</b>
  <span>Noventa e três famílias livres, cinco estratégias de combinação e oito níveis de hierarquia ao vivo.</span>
</button>
```

No copy changes — EN/PT strings untouched, `tests/i18n.test.ts` unaffected. The `<em class="hcx">` index numerals are decorative/structural (not translated content) but should carry `aria-hidden="true"` since the card's accessible name already comes from `<b>`+`<span>` text — implementer to confirm with an axe pass.

## 5. Verification checklist for the implementer

1. `npx tsc --noEmit`, `npx vitest run` (incl. `tests/tokens.test.ts` contrast, `tests/i18n.test.ts`), `npx vite build`.
2. `npm run audit:viewports` (320–1920px, no h-scroll, ≥40px effective tap — the 34px icon box at smallest width is decorative only, the full `<button>` remains the ≥40px hit target already satisfied by current min-height).
3. `npm run audit:axe` — new focus ring and `aria-hidden` index numerals should not regress accessible name/contrast.
4. Manual check of `prefers-reduced-motion: reduce` on card hover/active.
5. Visual check at 320 / 768 / 1920px in both `data-ground` states that the hero card's focus ring is visible against its own `--accent` fill and that no new hardcoded colour/font was introduced outside tokens (grep before merge, per DESIGN-SYSTEM.md pre-deploy gate item 7).

## 6. Open question for Head/Direção Criativa

This spec assumes the current live `--accent` (`#DE3D7D`) stays as-is on the hero card (per the "open reconciliation" note in DESIGN-SYSTEM.md, unresolved). If/when Purpur (`#7A2545`) migration happens, the hero-card contrast pairing (`--accent-ink`) must be re-verified against WCAG 2.1 on the new hex before this card spec ships with it — flagging so the two decisions aren't made independently.
