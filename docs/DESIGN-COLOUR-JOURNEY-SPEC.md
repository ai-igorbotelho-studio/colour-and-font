# Colour Journey Spec — Entry chooser + selectable image extraction

Author: UX Architect subagent (Digital Product Team). Scope: `Colour` (`src/palette/*`, `#p-cores` in `index.html`) and `Create` (`src/create/*`, `#p-criar`/create page in `index.html`). This is an information-architecture and interaction spec — no production code is edited here; it is the handoff `web-dev-frontend-multistack` and `web-dev-ui-designer` implement against.

Reference: `DESIGN-SYSTEM.md` (responsive rules, component-state table, motion principles, `--tw`/proposed `--tw-fast`/`--tw-slow`). No `DESIGN-MOTION-SPEC.md` file exists in the repo yet — this spec uses the token names already proposed in `DESIGN-SYSTEM.md` §"Structural tokens" and §"Motion principles"; if `--tw-fast`/`--tw-slow` are not yet defined in `src/styles/tokens.css` when this is implemented, add them there first (values: `--tw-fast: .15s`, `--tw: .38s` existing, `--tw-slow: .6s`), `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-in: cubic-bezier(.4,0,1,1)`.

---

## 0. Confirmed reading of "talvez tenha que inverter a ordem"

Confirmed. The user is naming exactly the defect present in the current markup: on both pages the instrument commits to a path before the user chooses one — Colour renders a random palette immediately (`build(false)` at the end of `initPalette()`, `src/palette/index.ts:127`) and only exposes "Inspirar em imagem" (`#imgCol`) and "Cores combinando" (`#matchCode`/`#matchImg`) as two `.ctl` blocks buried near the bottom of the right-hand control column, after nine other controls (`index.html:301-338`). Create is worse: the entire brief form (piece/support/emotion/market/culture/music/posture/count/typography-count/free-text) sits above the image and code blocks (`index.html:592-634`), so "explore via brief" is the unlabelled default and image/code are afterthoughts discovered only by scrolling. Inverting the order means: **the three-way choice becomes the first thing rendered in the control column / above the brief**, not a reordering of the existing blocks' internal fields. Sections 3 and 6 give the exact new top-to-bottom sequence.

---

## 1. The three-way entry chooser

### 1.1 Placement and markup

**Colour** (`index.html`, inside the second `<div>` of `.stage`, replacing the position currently held by the first `.ctl` at line 302): insert a new block **before** `#emo`:

```html
<div class="entrychoice" id="entryCol" role="group" aria-label="Start your colour journey">
  <p class="entrylabel">Start your colour journey</p>
  <div class="entrytabs" role="tablist" aria-label="Starting path">
    <button class="entrytab" role="tab" data-path="image" aria-selected="false">
      <span class="entryicon" aria-hidden="true"><!-- image glyph --></span>
      <span>With an image</span>
    </button>
    <button class="entrytab" role="tab" data-path="code" aria-selected="false">
      <span class="entryicon" aria-hidden="true"><!-- swatch/hash glyph --></span>
      <span>With a colour code</span>
    </button>
    <button class="entrytab" role="tab" data-path="explore" aria-selected="true">
      <span class="entryicon" aria-hidden="true"><!-- dice/wheel glyph --></span>
      <span>With an exploration</span>
    </button>
  </div>
  <div class="entrypanel" id="entryPanelCol"></div>
</div>
```

**Create**: identical block, `id="entryCreate"` / `id="entryPanelCreate"`, inserted immediately above the first `.grid3` at `index.html:592` (before `#cPiece`). Label text stays "Start your colour journey" (not "brief journey") — the chooser is about the *palette* seed for both pages; Create's brief fields belong to the "exploration" path specifically (see 1.4).

### 1.2 Visual pattern

Three equal-width segmented buttons (`.entrytabs`, `role="tablist"`), each a `role="tab"`, laid out as a row ≥768px, wrapping to 3 stacked full-width rows <480px (see §5 responsive table). This is a **tri-state segmented control**, not three independent toggle buttons — exactly one path is active at a time (matches the existing `.seg`/`role="group"` pattern already used for `#range`/`#cnt`/`#cN`/`#cRange`, but tabs carry `aria-selected` + `role="tab"` because switching swaps panel content, which `.seg` buttons don't do).

States (full table in §5): `default` · `hover` · `:focus-visible` (own ring, `--accent` per `DESIGN-SYSTEM.md`) · `active/selected` (`aria-selected="true"`, underline in `--accent`, matching the nav's "active section underlined" convention from `BRAND-GUIDE.md` §7) · `disabled` (never used here — all three paths are always available).

### 1.3 Default state on load

`explore` is pre-selected (`aria-selected="true"`) on first paint of both pages, because that preserves current behaviour for existing users/bookmarks/automated audits (`build(false)` still fires on Colour load; Create's brief form still renders empty, ready to fill) — the chooser makes the already-active default *visible and named* rather than changing what loads first. This is a deliberate, minimal-risk choice: nothing that currently works changes for a user who does nothing.

### 1.4 What each tab reveals in `#entryPanelCol` / `#entryPanelCreate`

- **`image`**: reveals the image picker + extraction/selection grid (§2). On Colour this **replaces** what used to be the standalone "Inspirar em imagem" `.ctl` block; the "Matching colours" photo sub-path is folded into the same grid via a per-swatch action (§2.4) rather than living as a second separate upload widget. On Create it replaces the "Imagem de referência" `.ctl` block.
- **`code`**: reveals the existing typed-code input + swatch preview + "Combinar cor" button (`#matchCode`/`#matchGo`/`#matchSw`/`#matchMsg` on Colour, `#cMatchCode`/`#cMatchGo`/`#cMatchSw`/`#cMatchMsg` on Create) — markup and `parseColorCode` logic unchanged, only relocated into the panel and stripped of the "or send a photo" half of its label (photo moves to the `image` tab).
- **`explore`**: Colour reveals nothing extra (the existing control column below continues as today — emotion, market, posture, boldness, scheme, count, lens, culture, music, CVD, `#gen`). Create reveals the full brief form (`#cPiece` through `#cBrief`/`#cWords`) that currently always shows. In other words, `explore` is not a new UI — it is the existing default UI, now nested under a tab instead of being the only thing on screen.

### 1.5 Switching paths after the fact (no dead end)

The chooser is **never hidden** — it stays pinned above the rest of the controls at all times, on both pages, at every viewport. Switching tabs does not destroy previously-produced state from another path:

- Switching `image → code` or `code → image`: whatever the previous path already committed (an anchored/locked colour, a full extracted palette) **stays applied** to `S.colors`/`CR.imgHs` until the newly-selected path's own action fires (user clicks "Combinar cor" or picks a new photo and confirms a selection). The panel swap alone never mutates the palette — only clicking a real commit action does. This directly answers the user's "choosing resets/replaces" question: **selecting a tab never resets anything by itself; only completing that tab's commit action (confirm selection / combine colour / press Gerar) writes to the palette.**
- Switching to `explore` after having anchored a colour via `image`/`code`: the anchor is not discarded. `S.baseOver` (Colour) / `CR.imgBase` (Create) remains set, so `#gen`/"Gerar três propostas" keeps exploring *around* that anchor rather than throwing it away — this matches the existing "Matching colours" behaviour today (anchored + locked colour, then `#gen` explores around it) and generalises it: the anchor persists regardless of which tab is currently visible. A small persistent note appears under the tab row whenever an anchor is active regardless of active tab: `"Anchored on {hex} — switch to Exploration to browse combinations around it, or clear the anchor."` with a `Clear anchor` ghost-button that sets `S.baseOver = null` / `CR.imgBase = null` and unlocks `S.colors[0]`.
- Re-visiting `image` after having picked a subset once: the previously extracted candidate grid and the user's prior checkbox selection are kept in memory for the session (component state, not global store — see §5 state table) so switching away and back does not force a re-upload or lose picks. A new upload always replaces the candidate set and clears prior picks.

---

## 2. Selectable image colour extraction

### 2.1 Extraction step

Both pages' `image` panel call `extractPalette(cv, 10)` (was `S.n`/`CR.n` on Colour/Create's full-replace path, `1` on the "Matching colours" photo path) — always extract **10 candidates** regardless of which of the three downstream mechanisms the user ultimately wants, so the picker never has to re-derive the k-means run when the user changes their mind about how many colours to keep. `extractPalette`'s own dominance-sort order (already returned most-to-least dominant, see `src/core/image.ts:59`) is preserved as the candidates' default left-to-right order.

### 2.2 The candidate grid — markup

Rendered inside `#entryPanelCol .imgpick` (or Create's equivalent), directly below the existing `mountImgPicker` thumbnail/buttons, once extraction resolves:

```html
<div class="swgrid" role="group" aria-label="Extracted colours — pick which to use">
  <button type="button" class="swpick" data-hex="#RRGGBB" aria-pressed="false" style="--sw:#RRGGBB">
    <span class="swpick-check" aria-hidden="true"></span>
  </button>
  <!-- × up to 10 -->
</div>
<p class="sm swcount" aria-live="polite">0 selected — pick at least 1.</p>
<div class="swactions">
  <button class="mini" data-act="all">Select all</button>
  <button class="mini" data-act="none">Clear picks</button>
  <button class="act" id="swConfirm" disabled>Use 0 selected colours</button>
</div>
```

Each `.swpick` is a real `<button>` (native focus/keyboard/Enter-Space activation, no custom ARIA widget needed) with `aria-pressed` toggling on click — a checkbox-semantics toggle, not a radio: the user can pick 1–10 in any combination, matching the requirement "pick any subset (1 to N)." Order of appearance in the grid == extraction dominance order == the order colours are written into the palette if all are picked (this is the "maybe I'll have to invert the order" case fully addressed: §2.5 gives the explicit reorder control).

`#swConfirm`'s label live-updates with the count (`Use {n} selected colour(s)`) and stays `disabled` at `n===0` — this is the "confirm selection" action named in the task; nothing downstream fires until it is pressed, so accidental single-swatch taps while browsing candidates never commit early.

### 2.3 Reordering picks — resolving "maybe I'll have to invert the order"

Default pick order equals dominance order, but once at least one swatch is selected, selected swatches gain a small numbered badge (`①②③…`) in top-left corner showing their position in the eventual palette. Two affordances to change that order, both reusing existing interaction vocabulary rather than inventing drag-and-drop (which fails the ≥40px-tap/no-h-scroll bar at 320px):

1. **Tap-to-cycle order**: tapping an already-selected swatch a second time (a `long-press`-free simple second-tap, distinguished from the toggle-off tap by a small inline "Reorder" mode toggle — see below) is over-engineered for this use case; instead:
2. **Explicit "Reverse order" toggle**: next to `#swConfirm`, a `mini` ghost button `Reverse order` flips the currently-selected subset's order before commit (dominance-order ↔ reverse-dominance-order). This directly implements the user's own words ("maybe I'll have to invert the order") as a one-click, zero-ambiguity action rather than a drag interaction. State: `swReversed: boolean` (component-local), applied only at confirm time, purely to the array of *selected* hexes — deselected candidates are never part of the order calculation.

This is deliberately the minimum viable reorder control: full manual drag-reordering of extracted swatches is out of scope for this pass (flag as a fast-follow in §6 if the Head wants full manual ordering later — locks already let the user reorder post-hoc anyway by dragging wheel balls once the palette is built).

### 2.4 What each of the three mechanisms does with the confirmed selection

All three read the same `pickedHexes: string[]` (post-reverse-order-if-toggled) produced by `#swConfirm`. The `image` tab shows a small **mode switch** above the grid so the user declares *which* mechanism the picks feed, before or after picking (mode can be changed until confirm is pressed):

```html
<div class="seg" id="swMode" role="group" aria-label="What to do with picked colours">
  <button data-m="replace" aria-pressed="true">Replace the whole palette</button>
  <button data-m="anchor" aria-pressed="false">Anchor one colour, keep exploring</button>
</div>
```

Two modes, not three — "verbatim full-palette replacement" and "single-seed anchor" are the two real end-states; "add to palette" (appending rather than replacing) is deliberately **not** offered as a third mode because Auge's palette size is fixed by `S.n`/`CR.n` (2–6 colours) and there is no "palette + extras" concept anywhere else in the app — introducing it here would break that invariant. Instead:

- **`replace` mode** (default, matches today's "Inspirar em imagem" behaviour): `#swConfirm` click →
  - Colour: `S.colors = colorsFromHex(pickedHexes); S.n = pickedHexes.length; S.scheme = 0; S.baseOver = S.colors[0].a;` then `syncControls(); render(); pushH();` — identical to the existing code at `src/palette/index.ts:91-93`, just fed `pickedHexes` instead of the unfiltered `hs`. If the user picked more than 6 or fewer than 2, clamp with a toast: *"Palettes hold 2–6 colours — using the first 6 of your picks"* / *"Pick at least 2 colours to replace the palette."* (`#swConfirm` itself stays disabled below 2 picks in `replace` mode specifically — see §5 state table, this is a mode-dependent minimum, `anchor` mode only needs 1).
  - Create: `CR.imgHs = pickedHexes; CR.imgBase = colorsFromHex([pickedHexes[0]])[0].a;` then re-render the note exactly as `src/create/index.ts:172-175` does today, and the eventual `#cGo` click still runs `faithfulFromImage(CR.props[0], CR.imgHs)` unchanged — the only change is `CR.imgHs` is user-curated instead of the raw top-N extraction.
- **`anchor` mode** (folds in what "Matching colours"'s photo path did): regardless of how many swatches are picked, **the first pick in final order (post-reverse-toggle) is the one used as the anchor** — this is the precise, unambiguous rule the task asked for. Rationale: this mode is explicitly single-seed by definition (mirrors the typed-code path, which only ever produces one hex), so if the user picks 3, only pick #1 becomes the locked/anchored colour; picks #2 and #3 are silently not otherwise used in this mode (no second hidden mechanism). To avoid confusion, once ≥2 swatches are picked in `anchor` mode, `#swConfirm`'s label reads `Anchor colour ① — use only the first pick`, and a `sm` note under the grid clarifies: *"Anchor mode uses only your first pick as the seed colour. Switch to 'Replace the whole palette' to use all {n} picks."* On confirm:
  - Colour: calls the existing `matchTo(pickedHexes[0], note)` (`src/palette/index.ts:98-104`) unchanged.
  - Create: sets `CR.imgBase = angleFor(hex2lch(pickedHexes[0]).H)` exactly as the code path does at `src/create/index.ts:185`, then triggers `$('cGo').click()` exactly as `tryCMatch` does today (`src/create/index.ts:187`) — anchor-from-image now behaves identically to anchor-from-code on Create, closing the gap where only the code path auto-generated propos­als.

### 2.5 Minimum/maximum and empty states

- 0 candidates extracted (`extractPalette` returns empty — fully transparent image, decode failure): grid area shows the existing failure copy (`"Não consegui ler essa imagem…"` / EN "Could not read that image — try JPG, PNG, WEBP or SVG.") and no grid renders.
- Fewer than 10 valid candidates (small/low-variety image): render however many `extractPalette` returned (it already internally clamps `k = Math.min(n, lab.length)`); grid layout in §5 handles down to 1 swatch gracefully (no forced empty slots).

---

## 3. New top-to-bottom order

### Colour (`#p-cores`, right-hand control column)

1. **Entry chooser** (`#entryCol`) — tabs + active panel (image picker+grid, or code input, or nothing extra for explore)
2. Anchor status note + "Clear anchor" (only rendered when an anchor is active, any tab)
3. `#emo` "O que a peça precisa provocar" (What the piece needs to provoke)
4. `#mkt` Campo de atuação
5. `#pos` Postura diante da convenção
6. `#range` Ousadia
7. `#scheme` Esquema geométrico
8. `#cnt` Quantas cores
9. `#lens` Lente de estúdio
10. `#cult` Referência cultural
11. `#mus` Estilo musical
12. `#cvd` Simular visão de cor
13. `.btnrow` (`#gen`/`#undo`/`#redo`/`#expBtn`/`#scaleBtn`)

Net change from today: the `#imgCol` and `#matchCode`/`#matchImg` blocks (currently items 11–12 near the bottom, `index.html:325-338`) are removed from that position and merged into item 1's panel content; everything else keeps its existing relative order.

### Create (`#p-criar`)

1. **Entry chooser** (`#entryCreate`)
2. Anchor status note + "Clear anchor" (when active)
3. The three `.grid3` rows (`#cPiece`/`#cSup`/`#cEmo`/`#cMkt`/`#cCult`/`#cMus`/`#cPos`/`#cN`/`#cRange`/`#cFam`) — **only rendered/visible while the `explore` tab is active** (see §1.4); collapsed/hidden under `image` or `code` tabs, since those paths anchor a hue and then still need the brief fields for piece/market/emotion context — so more precisely: **the brief fields always render, but are visually de-emphasised (reduced to a single-column collapsed `<details>` labelled "Refine with a brief (optional)") whenever `image` or `code` is the active tab**, because Create's proposals still need `br.piece`/`br.e`/`br.m` even when a hue is anchored (`faithfulFromImage`/anchor-driven `makeProposal` both read `br`). This avoids a dead end where anchoring a colour makes the rest of Create unreachable.
4. `#cBrief` free-text + `#cWords` — same collapse behaviour as item 3, bundled into the same `<details>`.
5. `#cGo` "Gerar três propostas" primary action — **always visible regardless of tab**, since every path (including `anchor` mode, which already auto-fires it) ends at generation.

This resolves the ordering concern precisely as raised: the image/code options move from *after* the entire brief (`index.html:623-634`, currently below `cBrief`) to *before* it, and the brief itself becomes secondary/collapsible once a non-explore path is chosen, rather than a wall the user must fill in regardless of intent.

---

## 4. Consistency with existing mechanics (explicit mapping)

| Existing mechanism | Reused as-is | What's new around it |
|---|---|---|
| `S.colors[i].lock` | `anchor` mode still sets `S.colors[0].lock = true` via `matchTo` | none — lock semantics unchanged |
| `mountImgPicker` (`src/core/image.ts:104`) | Upload/camera/clear widget unchanged, still mounted into the `image` panel | Its `onFile` callback now calls `extractPalette(cv, 10)` and renders `.swgrid` instead of either committing immediately or seeding one colour |
| `extractPalette` (`src/core/image.ts:34`) | Algorithm untouched; only the `n` argument (`10`, was `S.n`/`CR.n`/`1`) and how the return value is *presented* change | New: a selection/confirm layer between extraction output and palette write |
| `parseColorCode` (`src/core/color.ts`) | Unchanged, still drives the `code` tab's swatch preview + "Combinar cor" | Relocated into `#entryPanelCol`/`#entryPanelCreate`; label copy trimmed (photo half moved to `image` tab) |
| `--tw`/proposed `--tw-fast`/`--tw-slow`, `--ease-out`/`--ease-in` | Used for every new transition (§ next) | n/a |

**Motion for new elements** (per `DESIGN-SYSTEM.md` §Motion principles — "animate state change in the data... generic card hover ≤150ms", reduced-motion keeps feedback, drops choreography):
- Tab switch (`entrytabs` → panel swap): panel content cross-fades opacity over `--tw-fast` (150ms) with `--ease-out`; the underline indicator slides beneath the active tab over `--tw` (380ms) `--ease-out` — this is chrome/control motion, not reading content, so it's allowed to move per principle 5. `prefers-reduced-motion`: underline jumps directly, panel swap becomes an instant opacity swap (no cross-fade tween).
- Candidate grid reveal (after extraction resolves): swatches fade+scale in from `.94` over `--tw-fast`, staggered 20ms each, capped at 10 × 20ms = 200ms total so it never reads as sluggish; reduced-motion: grid simply appears, no stagger.
- Swatch pick toggle (`aria-pressed` flips): the checkmark badge and numbered order-badge scale in over `--tw-fast` with `--ease-out`; reduced-motion: badge appears with opacity only, no scale.
- `#swConfirm` label count update: no animation (text content change only — animating a counter is decorative, not state-narrating, per principle 1).
- Anchor status note appear/disappear (§1.5): height+opacity transition over `--tw` (380ms) `--ease-out` in, `--ease-in` out; reduced-motion: opacity-only, no height tween (avoids layout jank being the only signal).

---

## 5. Component/state table + responsive behaviour

| Component | States | 320–479px | 480–767px | 768–1023px | 1024–1439px | 1440–1919px | ≥1920px |
|---|---|---|---|---|---|---|---|
| `.entrytabs` (3-way chooser) | default · hover · `:focus-visible` · selected · selected+hover | 3 full-width stacked rows, each ≥48px tall (icon+label horizontally within the row) | same, still stacked (label width doesn't yet allow 3-across ≥40px comfortably) | 3-across single row, each ≈33% width, min 44px height | 3-across, fixed max-width row (doesn't stretch full container) | same, capped width, extra horizontal padding | same, centred within the capped page container |
| `.entrypanel` | empty (explore, Colour) · showing image sub-panel · showing code sub-panel · collapsed `<details>` (Create brief under non-explore tabs) | single column, full width | single column | single column within the control column (already narrower than page) | unchanged | unchanged | unchanged |
| Anchor status note + Clear-anchor button | hidden · visible | full width, button wraps to its own line if needed, ≥40px tap | full width, button inline if it fits else wraps | inline note+button on one line | same | same | same |
| `.swgrid` (candidate swatches) | per-swatch: unselected · selected (numbered badge) · hover · `:focus-visible` · (grid-level) loading (skeleton pulses while `extractPalette` runs — reuses `DESIGN-SYSTEM.md`'s "loading = skeleton, not spinner" rule) | 5 columns × 2 rows, each swatch ≥40×40px incl. spacing (`gap: 8px` minimum between adjacent small targets per WCAG 2.2 spacing rule in `DESIGN-SYSTEM.md` Accessibility section) | 5×2, swatches grow slightly with extra width | up to 10 across single row if width allows, else 5×2 | 10 across single row | 10 across, larger swatches (up to ~56px) since extra width exists | same, extra row padding |
| `#swMode` seg (replace/anchor) | default · selected · hover · `:focus-visible` | 2 stacked full-width rows (label text is long — stacking avoids truncation) | 2-across if both fit ≥40px tall, else stacked | 2-across | 2-across | 2-across | 2-across |
| `Reverse order` mini button | default · hover · `:focus-visible` · disabled (0 or 1 picks — reversing 1 item is a no-op) | full width row alongside Select-all/Clear-picks, wraps to 2 lines of buttons if needed | same | inline row with other `.swactions` buttons | same | same | same |
| `#swConfirm` | disabled (0 picks; or 1 pick while `replace` mode selected) · enabled · pressed/loading (brief flash while palette rebuilds — reuses `--tw-fast` opacity pulse, no spinner) | full-width primary button, ≥48px tall | full-width | inline with `.swactions` row | same | same | same |
| Create's collapsed brief `<details>` | closed (default when `image`/`code` active) · open (user expands, or automatically open when `explore` active — implemented as: `explore` renders it as a plain non-`<details>` block, not collapsed at all) | full width, native `<details>`/`<summary>` disclosure triangle, ≥44px tap on summary row | same | same | same | same | same |

Cross-cutting: no new component introduces a fixed px width — `.swgrid` uses `grid-template-columns: repeat(auto-fill, minmax(40px, 1fr))` capped by the panel's existing max-width (inherits the control column's width, which already respects the page's overall `max-width`/70ch discipline). No horizontal scroll at any breakpoint — grid wraps, never scrolls sideways. Verify with `npm run audit:viewports` before merge, per project default gate.

---

## 6. Files and selectors to touch (implementation checklist)

**HTML** (`index.html`):
- Remove `#imgCol` block (`index.html:325-328`) and `#matchCode`/`#matchImg` block (`index.html:329-338`) from their current position; both get rebuilt inside `#entryPanelCol`.
- Insert `#entryCol` (tabs + `#entryPanelCol`) immediately before the `#emo` `.ctl` (before `index.html:302`).
- Remove `#cImg` block (`index.html:623-626`) and `#cMatchCode` block (`index.html:627-634`ish — check closing tags) from their current position; rebuilt inside `#entryPanelCreate`.
- Insert `#entryCreate` (tabs + `#entryPanelCreate`) immediately before the first `.grid3` (before `index.html:592`).
- Wrap `index.html:592-622` (the three `.grid3` rows + `#cBrief`/`#cWords`) in a `<details id="cBriefDetails">` that JS toggles open/closed per active tab (see §3 Create item 3).

**TypeScript**:
- `src/palette/index.ts`: replace the `imgCol`/`matchCode`/`matchImg` wiring block (lines 84–125) with: (a) tab-switch controller for `#entryCol` managing `aria-selected` + panel visibility + persisted per-session picks; (b) new `mountSwatchGrid` helper (new file, `src/core/imgpicker-grid.ts`, since `src/core/image.ts` should stay algorithm-only per the task's "don't redesign the extraction algorithm" boundary) taking `(hexes: string[], onConfirm: (picked: string[], mode: 'replace'|'anchor') => void)` and rendering `.swgrid`/`.swactions`/`#swMode`/`#swConfirm`; (c) the two `onConfirm` branches from §2.4 replacing the old inline `mountImgPicker` callbacks for both `#imgCol`'s and `#matchImg`'s old logic (now unified into one image entry point).
- `src/create/index.ts`: same restructuring for `#cImg`/`#cMatchCode` (lines 165–190) using the same `mountSwatchGrid` helper; add the `#cBriefDetails` open/close toggle keyed to active tab.
- `src/i18n/ui-en.ts` + PT source strings: new copy — "Start your colour journey", "With an image", "With a colour code", "With an exploration", "Anchored on {h} — switch to Exploration to browse combinations around it, or clear the anchor.", "Clear anchor", "Select all", "Clear picks", "Reverse order", "Use {n} selected colour(s)", "Pick at least 2 colours to replace the palette.", "Palettes hold 2–6 colours — using the first 6 of your picks", "Anchor colour ① — use only the first pick", "Anchor mode uses only your first pick as the seed colour. Switch to 'Replace the whole palette' to use all {n} picks.", "Replace the whole palette", "Anchor one colour, keep exploring", "Refine with a brief (optional)", "{n} selected — pick at least 1.". Run `tests/i18n.test.ts` afterwards (guards no "marca"/"brand").
- `src/styles/components.css` (or a new `src/styles/entry.css` imported alongside, matching the existing per-concern split in `src/styles/`): `.entrychoice`, `.entrytabs`, `.entrytab`, `.entrypanel`, `.swgrid`, `.swpick`, `.swpick-check`, `.swactions`, `.swcount`, `#swMode` (reuse existing `.seg`/`.mini`/`.act` classes where visually identical — only the tab/grid/swatch classes are genuinely new).
- `src/styles/tokens.css`: add `--tw-fast: .15s`, `--tw-slow: .6s`, `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-in: cubic-bezier(.4,0,1,1)` if not already present (currently only `--tw: .38s` exists per `DESIGN-SYSTEM.md`'s own audit).

**Tests**:
- `tests/reference.json`/`audit:ref`: unaffected — `replace` mode's Colour/Create output for an all-picked, dominance-order selection must exactly equal today's un-selective extraction, so the reference harness stays green with no snapshot changes as long as no candidates are deselected and order isn't reversed in a fresh run. Add a note to `tests/api.test.ts`/manual QA: verify a full-select, no-reverse run reproduces the old verbatim-replace output bit for bit.
- `tests/i18n.test.ts`: extend fixture list with all new strings above; confirm none contain "marca"/"brand".
- New unit test (suggest `tests/swatchpick.test.ts` if a pure-logic helper is extracted, e.g. an `applyPick(hexes, picked, reversed, mode)` function testable outside the DOM) — keep the picking/reordering logic in a small pure function so it's covered by `vitest` rather than only by the (on-request) Playwright audits.

---

## Summary of the single biggest structural change

Promoting the three-way choice (image / code / exploration) from two buried, always-coexisting secondary blocks into one pinned, mutually-exclusive chooser rendered **first** on both pages, with Create's entire brief form demoted to a collapsible secondary step whenever a non-explore path is active. Everything else (the algorithm, the lock mechanic, the code parser, the proposal engine) is reused unchanged — the change is entirely about sequencing and about inserting one missing interaction (the confirm-selection swatch grid) between "extract" and "commit to the palette."
