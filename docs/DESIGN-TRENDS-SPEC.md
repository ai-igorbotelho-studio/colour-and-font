# Trends — redesign of edition presentation (structure, effects, animation)

Author: UX Architect subagent. Scope: this document only proposes structure,
layout mechanism and interaction contract — it writes no production code.
Implementation belongs to `web-dev-ui-designer` (visual polish within these
constraints) and `web-dev-frontend-multistack` (build). Every decision below
is the one to build, not a menu.

Companion to `BRAND-GUIDE.md` §8 (editorial direction for Trends),
`DESIGN-SYSTEM.md` (tokens, motion, responsive, component-state discipline),
`docs/DESIGN-MOTION-SPEC.md` (timing/easing vocabulary reused verbatim — no
new token is introduced here) and the two shipped Contents specs
(`docs/DESIGN-CONTENTS-SPEC.md`, `docs/DESIGN-CONTENTS-CARDS-SPEC.md`), whose
diagnostic method (name the exact CSS/markup cause of monotony, then replace
the mechanism, not just re-skin it) this spec follows for consistency.

Current implementation read directly: `src/trends/render.ts`, `src/data/trends.ts`,
`src/i18n/ui-en.ts`, and the selectors it emits in `src/styles/shell.css`
(`.trendpal`, `.card`, `.pills`/`.pill`, `.mini`, `.lede`, `.btnrow`, `.bnr`) —
none of the Trends-specific selectors (`.trendpal`, `.bnr`) have dedicated
rules beyond one `:active` line; they inherit generic `.card`/`.pill` styling
wholesale. This absence of any Trends-specific visual grammar is itself part
of the diagnosis in §1.

## 0. Note on scope vs. BRAND-GUIDE §8 / DESIGN-SYSTEM's editorial data model

BRAND-GUIDE §8 and DESIGN-SYSTEM's "Editorial data-model notes" propose new
fields (`horizon`, `whyNow`, `ref`, `contra`, `revisions`) not yet implemented
in `src/data/trends.ts` (still `cor`/`tipo`/`comb`/`apl`, no horizon, no
counter-reading axis, no revisions note). This spec is written to work in two
layers so it does not block on that data-model decision:

- **Layer A (ships against today's data shape):** everything in §2–§5 below
  works with the current `Axis { tese, corpo, fontes, pal?, fam? }` — no new
  field required. This is what an implementer builds first.
- **Layer B (activates once `horizon`/`whyNow`/`contra`/`revisions` land):**
  called out explicitly wherever it applies (the horizon chip, the "why now"
  strapline, the Counter-reading fifth axis, the Revisions note) — designed
  in now, so the container does not need a second redesign when the content
  agent's fields ship, but degrading gracefully (hidden, not broken) if they
  are absent, exactly as DESIGN-CONTENTS-SPEC treats not-yet-populated
  modules (coming-soon pattern, never silently invented placeholder content).

Axis EN labels per DESIGN-SYSTEM.md: **Colour · Letterform · Pairing ·
Surface** (keys stay `cor`/`tipo`/`comb`/`apl`). `ui-en.ts` today only maps
`'Tipografia': 'Type'` generically and has no per-axis Trends label yet
(`AXES` array in `src/data/trends.ts` hardcodes Portuguese `n` values `'Cor'`,
`'Tipografia'`, `'Combinações'`, `'Aplicações'` with no i18n lookup at all —
this is a latent i18n gap independent of this spec, flagged here since the
redesign touches the same render call; implementer should route `ax.n`
through `t()` with the new EN labels while making the changes below, it is a
one-line fix in `src/data/trends.ts`/`ui-en.ts` alongside the layout work).

## 1. Diagnosis — what is actually repetitive today

Read `render.ts` lines 26–38 directly. Four separate, independently
verifiable causes, all in one function:

1. **One `.map()` over `AXES` producing one identical block shape.** Every
   axis — Colour, Letterform, Pairing, Surface — renders the exact same DOM
   skeleton: `.card` → kicker (`ax.n`) → `<h3>` thesis → optional palette row
   → optional font pills → body paragraphs → sources line → optional button.
   Colour and Letterform are structurally different kinds of claim (one is
   swatch-led, one is type-specimen-led) but get the *same* template with
   only the optional blocks toggling — a reader scrolling through sees four
   copies of one card, not four different kinds of evidence.
2. **No visual differentiation between axis types.** `pal` renders as small
   colour buttons (`.trendpal`) with no dedicated CSS beyond one `:active`
   rule — it inherits no swatch scale, no name/hex hierarchy of its own.
   `fam` renders as generic `.pill` chips — the exact same pill used for topic
   filters in Contents, with no actual type specimen (no family set in its
   own face) anywhere on the page, despite the whole page being about type as
   much as colour. A reader cannot tell "this is the colour axis" from "this
   is the letterform axis" by silhouette alone; only by reading the label.
3. **No sense of "this is a reading, not a fact."** The declared-approximation
   principle (BRAND-GUIDE, DESIGN-SYSTEM) exists in copy only (the hex
   disclosure sentence at the bottom of the Markdown export, `trendMd()`) —
   nowhere in the live page does a hex swatch visually signal "approximation"
   versus a definitive brand colour. Every card looks equally authoritative,
   which contradicts the "declared approximation, not the official code"
   invariant the product is supposed to visibly honour.
4. **No wheel, no Goethean framing, anywhere on the one page where the brand's
   foresight identity is exercised in public.** Colour has a literal
   interactive wheel. Trends — the page explicitly named in BRAND-GUIDE §7 as
   where the "declared approximation" honesty invariant is reinforced by the
   yellow counter-accent — has zero visual reference to the six-hue geometry
   that is the product's entire premise. It reads as a generic quarterly blog
   digest with a card-per-topic template, not as an instrument's foresight
   output.
5. **Editions are functionally invisible as a sequence.** `edTabs` renders
   plain text buttons (`x.id` + `· atual` suffix on the current one) with
   `aria-pressed` as the only state signal, and `edArquivo` at the bottom of
   the page duplicates the same edition list as a second, near-identical row
   of `.mini` buttons. There are two separate "pick an edition" controls
   using two different visual vocabularies (tab strip vs. loose button row)
   for the same action, and neither conveys the archive as a timeline —
   editions could be six or sixty, they'd render identically, just longer.

None of this is a copy problem (BRAND-GUIDE §8's content pass already
sharpened the prose) — it is entirely a "one template, repeated" structure
problem, at the exact same root cause DESIGN-CONTENTS-CARDS-SPEC diagnosed
for Contents' card grid (§1.1 there: "every card carries the same information
in the same shape, differentiated only by a colour I can't attach meaning
to"). Trends' case is a stricter version — there isn't even the tone-cycling
of Contents' old cards; the four axis blocks are pixel-identical apart from
which optional fields fire.

## 2. Redesigned structure for a single edition

### 2.1 Edition header — the wheel becomes literal furniture, not decoration

Replace the current plain `<h2>` + `<p class="sm">` + `<p class="lede">`
header (`$('edHead')`) with a two-column header at ≥768px (stacks at
<768px, wheel-fragment first):

- **Right/top: a static SVG fragment of the six-hue wheel**, reusing the
  existing wordmark arc-mark geometry (BRAND-GUIDE §6: "one 60°-arc segment
  of Goethe's six-hue wheel") but here rendered as the **full six-hue ring**,
  not a fragment — this is the one place in the product besides the wordmark
  and the actual Colour-page wheel where the ring appears, and it is
  functionally justified, not decorative: each of the ring's six 60° arcs is
  rendered in its Goethe anchor hue at low opacity (`~0.35`) *except* the arc
  (or arcs) that the edition's own `cor.pal` hexes fall nearest to by hue
  angle (computed via the existing `colorsFromHex`/hue-angle utilities
  already imported in `render.ts` — no new colour math, reuse
  `colorsFromHex(e.cor.pal.map(p=>p.hex))` and read `.a` off each result),
  which render at full opacity. This turns the ring into a genuine reading:
  "where does this quarter's colour signal sit on the instrument's own
  geometry" — answering BRAND-GUIDE's "why now" instinct visually before a
  word of copy is read. Size: 120px at ≥1024px, 84px at 768–1023px, 64px
  stacked above the title at <768px. Static (no animation) at rest — see §4
  for its one animated moment.
- **Left/bottom: edition id, period, horizon-of-the-quarter strapline (Layer
  B: `e.contra` summary line if present, else nothing — no invented text),
  and the edition thesis** (`e.tese`, kept as `.lede`, unchanged size/no
  animation per "never animate long-form reading text").
- A single hairline rule (`--rule2`) sits under the whole header block,
  echoing Contents' ruled vocabulary (DESIGN-CONTENTS-SPEC §1.2) rather than
  the current `.card` box treatment — the edition header should read as a
  masthead, not a card, since it is the one non-repeating element per
  edition.

### 2.2 Four axes, four distinct visual identities — not one card template

Retire the single `.map(ax => ...)` producing identical `.card` blocks.
Replace with **four axis-specific render functions**, one per axis key,
each with its own layout mechanism and its own CSS class namespace
(`.axis-cor`, `.axis-tipo`, `.axis-comb`, `.axis-apl`), sharing only a
`.axis` base class for spacing/hairline-rule rhythm — analogous to how
Contents' card system now varies footprint/typography by role rather than
by decorative cycling (DESIGN-CONTENTS-CARDS-SPEC §1.2), applied here to
*axis type* instead of *reading time*.

**Colour axis (`.axis-cor`) — swatch-led, large-format:**
- Layout: swatches lead, full-bleed within the axis block, at a
  **materially larger size than today's small `.trendpal` buttons** —
  `grid-template-columns:repeat(auto-fit,minmax(120px,1fr))`, each swatch a
  square tile `aspect-ratio:1` (not the current small pill-shaped button),
  filling with `background:${hex}`, name and hex printed inside in
  `readable(hex)` at the bottom edge of the tile (as now), but the **hex
  string is prefixed with `≈` (already-established approximation glyph
  convention — verify against BRAND-GUIDE's "declared approximation"
  phrasing; if no glyph convention exists yet, adopt `≈` here and note it for
  reuse anywhere else a declared-approximation hex appears) and set in
  `--font-mono` at `.85` opacity of `readable(hex)` — visually distinct from
  a definitive colour code, this is the concrete "reading, not a fact"
  treatment requested in the brief**.
- Thesis (`a.tese`) sits *above* the swatch grid as a short kicker-style
  line (`--font-mono`, uppercase-tracked, per the Contents plate-number
  precedent) rather than an `<h3>`, since the swatches themselves are the
  primary display element here, not the sentence describing them.
- Layer B: a small horizon chip (`Faint`/`Emerging`/`Established`/
  `Receding`) sits top-right of each individual swatch tile if
  `TrendColor.horizon` exists — per-colour, not per-axis, since BRAND-GUIDE
  §8 specifies horizon per named colour as well as per axis.
- Body paragraphs (`a.corpo`) run below the grid at the standard `.lede`
  measure-capped column, unchanged (never animate reading text).
- "Open this palette in Colour" button sits directly under the swatch grid,
  not at the foot of the whole block — proximity to the thing it acts on.

**Letterform axis (`.axis-tipo`) — type-specimen-led, not pill-led:**
- Layout: replace the generic `.pill` chip row entirely with a **type
  specimen strip** — for each family in `a.fam` (capped at the first 3 for
  layout sanity, "+N more" text for the rest), render the family's own name
  **set in that family's own font** (load via the existing `FONTS`/font-face
  mechanism already used by `src/type/index.ts` — reuse `setFamilies`'
  loading path, do not duplicate font-loading logic) at `clamp(28px,4vw,44px)`,
  stacked vertically, each row separated by a `--rule2` hairline. This is the
  single most direct fix for "every axis looks the same" — Letterform is the
  one axis where the content *is* typography, so it should visibly typeset
  itself rather than list names as inert chips.
- If a family in `a.fam` is not in the local font bank (same fallback logic
  `render.ts` already has for the "open in Type" button — `FONTS.find(...)`
  returning nothing), that row renders the name in the surrounding UI face
  with a small `--soft` "(not in the instrument's bank)" caption instead of
  silently rendering it in Mulish and looking like a hit — honesty invariant
  applied to the specimen itself, not just the button.
- Thesis and body paragraphs sit *after* the specimen strip (reverse order
  from Colour, which is deliberate — see §2.4 alternation).

**Pairing axis (`.axis-comb`) — argument-led, no visual asset of its own:**
- This axis has no `pal`/`fam` in the current data model — it is pure
  argument. Rather than rendering an empty visual slot (today's code already
  correctly renders nothing extra here, since both `if` guards fail), give it
  a **distinct typographic treatment instead of a visual asset**: the thesis
  (`a.tese`) sets at the larger `.lede`-adjacent size step used for
  `.mod-long` cards in Contents (`clamp(26px,3.4vw,40px)`, reusing that
  already-specified size step rather than inventing a new one), functioning
  as a pull-statement — this axis is the one that reads like a claim you
  pause on, not evidence you scan, and its typography should say so.
- Body paragraphs unchanged, standard measure.

**Surface axis (`.axis-apl`) — closing axis, distinct rhythm via reversed
polarity band:**
- Per DESIGN-SYSTEM's figure-ground principle ("Positive/negative → figure-
  ground polarity between sections, not a gradient"), render this axis's
  block on the **inverted local polarity** relative to the rest of the page
  (dark band inside a light-mode page, light band inside dark-mode) — a
  contained `<section>` with its own `--ink`/`--ground` swap, not a full
  page-level toggle. This is the fourth axis and the one BRAND-GUIDE
  describes as most exposed to production/delivery reality (grain, codec,
  surface) — closing the edition on an inverted band gives the page one
  moment of the polarity-swap vocabulary already used product-wide for
  section boundaries (DESIGN-SYSTEM §Layout), and gives the sequence of four
  axes a closing beat instead of ending on the same visual note it started on.
- Thesis + body run inside this inverted band at standard measure; sources
  line inverts its link colour accordingly (verify contrast both ways per
  the existing token contract, `tests/tokens.test.ts`'s 4.5:1 floor already
  covers both `data-ground` states, confirm the same holds for this
  page-local inversion band specifically, since it is not a full
  `data-ground` toggle — treat it as a third contrast pairing to verify
  manually alongside the automated test, similar to Contents' documented
  "verify perceived glare" manual check).

**Layer B — fifth axis, Counter-reading (`.axis-contra`):**
- If `Edition.contra` exists, render a fifth block after Surface, visually
  marked as *argument against the edition's own thesis* — set as a full-width
  block (not part of the four-column axis rhythm), bordered top and bottom
  by a **double hairline rule** (two `--rule2` lines, 4px apart — a
  typographic convention borrowed from print errata/dissent marks, distinct
  enough to signal "this is the edition disagreeing with itself" without
  adding a new accent colour) and prefixed with a small kicker
  ("Counter-reading" / "Leitura contrária"). If `contra` is absent (today's
  data), this block does not render at all — no placeholder invented, exact
  same "coming-soon only where structurally promised" discipline as
  Contents' tab strip (DESIGN-CONTENTS-SPEC §2.1), except here there is no
  tab to keep visible since it's per-edition content, not a permanent nav
  affordance — so simply absent is correct, not disabled-state.

### 2.3 Sources — one shared, upgraded treatment across all four axes

Today's sources line (`a.fontes.map(...)`) is a flat inline list of plain
links with no distinct visual or interaction treatment. Replace with:
- Each source renders as `<a>` text plus a small superscript-style numeral
  badge (`¹`, `²`…) inline within the body paragraph text is out of scope
  (never touch reading-paragraph markup/animation) — instead, keep sources
  listed at the foot of each axis as today, but style each as a small
  **citation chip**: `--font-mono` numeral prefix (`01`, `02`…, matching the
  plate-number mono convention already established for Contents/home cards
  — same family, new semantic, per that precedent), name, and an external-
  link glyph, all inside a `--rule` bordered inline-flex chip with
  `min-height:40px` (tap-target compliance) and `padding:6px 12px`.
- Hover/focus: `--tw-fast`/`--ease-out` border colour step from `--rule` to
  `--ink` (or `--ground` on the inverted Surface band) — same button-hover
  language as §1 of DESIGN-MOTION-SPEC, nothing new invented, applied
  consistently to a component (citations) that currently has zero hover
  treatment at all.

### 2.4 Shared but non-repeating rhythm — alternation, not uniformity

Across the four (or five, Layer B) axis blocks in sequence:
1. Colour — swatch grid leads, thesis/body follow, standard polarity.
2. Letterform — specimen strip leads, thesis/body follow, standard polarity.
3. Pairing — large pull-statement thesis leads directly (no visual asset),
   standard polarity.
4. Surface — thesis/body only, but on an **inverted polarity band**.
5. *(Layer B)* Counter-reading — full-width, double-rule-bordered, standard
   polarity.

This gives the sequence a genuine beat (asset → asset → statement →
polarity-flip → dissent) rather than four identical cards — every transition
between axes is now visually distinguishable by silhouette alone, satisfying
the brief's "each axis its own visual identity" requirement without adding
any decorative element that isn't already grounded in either the data
(swatches, family names) or an existing product-wide pattern (polarity swap,
mono plate numerals, citation chips).

## 3. Editions and the archive — a single timeline, not two duplicate controls

### 3.1 Collapse `edTabs` + `edArquivo` into one control

Today's two separate edition pickers (`edTabs` — small tab strip; `edArquivo`
— a second loose row of `.mini` buttons at the page foot, both wired to the
same `TD.i = i; drawTrend()` handler) are functionally redundant and visually
inconsistent. Replace both with **one horizontal timeline rail**, rendered
once near the top of the page (where `edTabs` sits today) and **removed
entirely from the foot** (`edArquivo`'s DOM id can stay for now if other code
references it, but it renders nothing new — do not keep a second picker).

Concrete mechanism:
- A horizontal scroll-snap rail (same scroll affordance already specified
  for Contents' module tab strip, DESIGN-CONTENTS-SPEC §2.1 — reuse that
  exact interaction pattern for consistency of the two "browse a sequence"
  controls in the product) — `overflow-x:auto`, `scroll-snap-type:x
  proximity`, no wrap.
- Each edition renders as a **timeline tick**: a small vertical mark plus
  the edition id (`2026 · T3`) below it, current edition's tick filled
  (`--ink`/`--accent` per the single-accent-on-screen rule — pick `--ink`
  fill with an `--accent` underline for current, since Trends' page-level
  accent budget is already spent on the Purpur-family ring-highlight in
  §2.1; do not add a second accent use here) and archived editions'
  ticks unfilled outline only.
- Between ticks, a continuous horizontal `--rule2` line runs the full rail
  width, visually reading as an actual timeline axis (a literal small nod to
  "instrument," consistent with the wheel motif's literalism in §2.1) rather
  than a row of button chips.
- Clicking/tapping a tick behaves exactly as today's handler (`TD.i = i;
  drawTrend()`, scroll to `edHead`) — no behavioural change, only the single
  merged visual control.
- At 320–479px: the rail still scrolls horizontally (same reasoning as
  Contents' tab strip — this is a primary way of navigating the page, not a
  settings menu, so it must never collapse into a dropdown), each tick a
  minimum 64px hit width (tighter than Contents' 96px module-tab minimum
  since ticks carry less label text, but still comfortably ≥40px).
- Add a small `{n} editions in the archive, oldest is {e}` caption
  (`t('{n} edições no arquivo...')`, already exists in `trendMd`-adjacent
  code as a string — reuse literally, just relocate it under the rail
  instead of under the now-removed `edArquivo` block) directly beneath the
  rail, preserving the one piece of information `edArquivo` usefully added
  (a total count) without needing a second control to carry it.

### 3.2 Layer B — Revisions note

If `Edition.revisions` exists, render it as a short block directly under the
timeline rail, above the edition header (§2.1) — visually a `--font-mono`
kicker ("Revisiting the last four editions" / equivalent PT) plus the note
text at standard `.lede` size, bordered left by a single `--rule` vertical
line (a marginal-note treatment, distinct from the header's own hairline-
under treatment) so it reads as commentary *about* the timeline immediately
above it, not as part of the current edition's own thesis.

## 4. Effects and animations (motion vocabulary reused verbatim — no new tokens)

1. **Axis reveal on scroll.** Each `.axis` block (all four/five) gets the
   existing `IntersectionObserver`-driven `.rv` reveal class already defined
   in `motion.ts`/`motion.css` (`opacity` + small `translateY`, `--tw-slow`,
   `--ease-out`, per DESIGN-MOTION-SPEC §4) — this already exists product-
   wide and simply needs the new axis-block elements added to the `REVEAL`
   selector list in `motion.ts` (e.g. append `.axis` to the existing
   selector string). Explicitly **exclude** the body paragraphs inside each
   axis (`.lede`, matching the same exclusion already specified for
   Theory/Contents/Trends prose in DESIGN-MOTION-SPEC §4) — only the axis
   block's chrome (kicker, swatch grid, specimen strip container) reveals;
   reading text is exempt per Motion Principle 5, unchanged.
2. **Opening a palette (`pal`) into Colour.** Currently an instant `goto`
   call. Per the route-transition rule already specified in DESIGN-MOTION-
   SPEC §2b (opacity cross-dissolve, `--tw-fast` out / `--tw` in, no slide),
   no Trends-specific change is needed here — the existing View Transitions
   hook already covers this route change generically. The one addition
   specific to this action: because loading a trend palette also changes
   `S.colors`/`S.scheme` (a data event, not just a navigation), the arriving
   Colour page's wheel should render the newly-loaded hues using the
   **existing 180°-hue-flip tween mechanism** (`animateHueFlip`, §2c of
   DESIGN-MOTION-SPEC) *if* the delta between the wheel's previous state and
   the incoming trend hues exceeds the same >90° threshold already defined
   there — reuse that function as-is, called once per loaded colour after
   the route transition completes, rather than a silent snap. This is not a
   new animation, it is correctly routing an existing one to a
   previously-unconsidered call site (`render.ts`'s `co.onclick` handler).
3. **Opening families (`fam`) into Type.** Same principle: the route
   cross-dissolve is already generic. No pairing-swap animation is
   triggered here since `setFamilies` populates a fresh proposal rather than
   swapping an existing displayed pair — no additional motion needed beyond
   the existing route transition; do not invent a specimen "type-in" effect,
   since Motion Principle 5 forbids animating reading/specimen text and a
   family name specimen at this point is exactly that.
4. **Source citation hover/focus.** As specified in §2.3: `--tw-fast`
   `--ease-out` border-colour step only, matching the button-hover language
   in DESIGN-MOTION-SPEC §1 (composability of hover + focus already
   documented there — reuse verbatim, no new state machine).
5. **The wheel motif's one animated moment.** The header ring (§2.1) is
   static at rest, but on the edition-switch action (§3.1's tick click), the
   ring's highlighted-arc segment **re-highlights via the same short
   `--tw`/`--ease-out` opacity step already used for generic content swaps**
   (not the long hue-flip tween — that is reserved for genuine hue-angle
   changes on the Colour wheel itself, per DESIGN-MOTION-SPEC §2c's explicit
   scoping to "a data event inside the Colour page," which this is not).
   Concretely: the six arc paths transition `opacity` over `--tw`
   (`.38s`)/`--ease-out` when `drawTrend()` re-renders the header for a newly
   selected edition, so the ring visibly "points to" wherever the new
   edition's colour reading sits — the wheel becomes a literal, minimally
   animated indicator rather than a static logo fragment. Reduced motion:
   opacity change applies instantly (no transition), per the same reasoning
   as every other reduced-motion row in DESIGN-MOTION-SPEC §5 (state
   feedback stays, tween drops).
6. **Timeline rail tick selection.** Instant fill-state change on the
   selected tick (no transition on the fill itself — matching DESIGN-MOTION-
   SPEC's "Selected state: instant... a selection is a discrete fact, not a
   settle" principle already established for Type pairing samples, applied
   here identically), but the rail's own horizontal scroll-into-view (if the
   newly selected tick is off-screen) uses native smooth scrolling exactly
   as `render.ts` already does for `edHead.scrollIntoView({behavior:
   'smooth'})` — no change to that mechanism, just confirm the same call
   also centres the rail's own scroll position on the selected tick
   (`tick.scrollIntoView({behavior:'smooth', inline:'center', block:
   'nearest'})`), which today's code does not do since there was no rail.
7. **Counter-reading block entrance (Layer B).** Same `.rv` reveal as other
   axis chrome (§1 of this section) — no special treatment; its visual
   distinction comes from the double-rule border (§2.2), not from motion.
8. **`prefers-reduced-motion: reduce` — full contract for this page,** using
   the exact rows already defined in DESIGN-MOTION-SPEC §5, applied to the
   new elements introduced here (no new reduced-motion category is invented):
   - Axis reveal (#1 above) → disabled outright, content visible immediately
     (`.rv` row in the existing table).
   - Route cross-dissolve into Colour/Type (#2/#3) → disabled per the
     existing route-transition row.
   - Hue-flip tween on arrival in Colour after loading a trend palette (#2)
     → skip to end-state directly, per the existing hue-flip row (this is
     the *same* function, so it already inherits this behaviour with zero
     extra code).
   - Citation hover border step (#4) → kept as instant state-only feedback
     (this is a colour-only micro-interaction, not a translateY/scale
     effect, so it falls under "generic ≤150ms chrome" rather than any row
     requiring full disablement — DESIGN-MOTION-SPEC does not disable colour-
     only `:hover` feedback anywhere, only transform/opacity choreography).
   - Wheel arc re-highlight (#5) → instant opacity flip, no tween, as stated
     above.
   - Timeline tick smooth-scroll (#6) → this is scroll behaviour, not a
     transition property; respect `prefers-reduced-motion` by using
     `behavior:'auto'` (instant jump) instead of `'smooth'` when the media
     query matches, mirroring how `edHead`'s existing `scrollIntoView`
     call should arguably already do this (flag as a pre-existing gap worth
     fixing in the same pass, since it uses `'smooth'` unconditionally today).

## 5. Responsive behaviour (320–1920px+)

| Range | Behaviour |
|---|---|
| 320–479px | Single column throughout. Header (§2.1): wheel fragment (64px) stacks above title/thesis, no side-by-side. Colour axis swatch grid: 2 columns min (`repeat(auto-fit,minmax(96px,1fr))`), never 1 column (a single huge swatch loses the "reading, not fact" hex-label legibility). Letterform specimen strip: font-size clamp still shows meaningful size difference between families, capped at `clamp(22px,7vw,30px)` to avoid horizontal overflow of a long family name — verify no family name causes horizontal scroll (test with the longest name in `FONTS`, e.g. multi-word families) via `audit:viewports`. Timeline rail: horizontal scroll-snap, 64px min tick width (§3.1). Surface axis inverted band: full-bleed, same as other axes, no special narrowing. |
| 480–767px | Colour swatch grid: 3 columns. Letterform specimen strip unchanged (already vertical). Timeline rail gains slightly more visible tick spacing but stays horizontal-scroll (same reasoning as Contents' tab strip — a structural nav element, never collapses to a menu). |
| 768–1023px | Header goes two-column (wheel right, title/thesis left) per §2.1. Colour swatch grid: 4 columns. Pairing axis pull-statement drops to the smaller end of its clamp range naturally via `vw`-based sizing, no separate rule needed. |
| 1024–1439px | Reference desktop layout as specified throughout §2. Colour swatch grid: up to 6 columns depending on `pal` length (grid stays `auto-fit`, so this is automatic, not a fixed breakpoint rule). |
| 1440–1919px | Increase padding/gap only, not column count, per DESIGN-SYSTEM's cross-cutting rule — swatch tile size grows slightly (`minmax(120px,1fr)` → effectively larger cells as the container widens within the auto-fit grid) rather than adding columns beyond what content naturally fills. Reading measure (`.lede`, body paragraphs) stays capped ~70ch regardless of container width — already a system-wide rule, applies unchanged to axis body copy. |
| ≥1920px | Centred container at the product's existing max-width; the header wheel may grow modestly (up to 150px) since it is chrome, not reading measure, but the swatch grid and body columns do not exceed their capped measures — freed lateral space goes to page margin, not to stretching any axis block, per DESIGN-SYSTEM's "full-bleed background uses a named identity colour, never stretched components" rule. |

Cross-cutting: every grid here uses `minmax(0,1fr)`/`auto-fit`, matching the
product's existing no-horizontal-scroll contract; verify with
`npm run audit:viewports` before merge, per CLAUDE.md's guidance to run that
audit once before a milestone touching layout (this redesign qualifies).
Every interactive element introduced (swatch tile as a copy-button, family
specimen row if it becomes clickable, citation chip, timeline tick) keeps or
gains an explicit `min-height:40px` effective hit area, consistent with the
`.pill`/`.mini` precedent already in `shell.css`.

## 6. Full component/state table

| Component | States | Notes |
|---|---|---|
| **Edition header (`edHead`, redesigned)** | default (per current edition) · re-render on edition switch (chrome-only opacity step on the wheel arcs, §4.5) | No hover/focus states — not interactive itself. Thesis (`.lede`) never animates per Motion Principle 5. |
| **Header wheel ring (new)** | default (six arcs, current edition's matched arc(s) at full opacity, rest at ~0.35) · re-highlighted (opacity transition, `--tw`/`--ease-out`, on edition switch) · reduced-motion (instant flip) | `aria-hidden="true"` — decorative-but-informational, accessible content is carried by the text header, not the ring; consider a visually-hidden caption describing which hue the ring highlights if design review wants it exposed to AT, not required by this spec. |
| **Colour axis block (`.axis-cor`, new)** | default · swatch hover (existing `copy()` click behaviour, retains the click-to-copy interaction — add a hover affordance: `--tw-fast` `--ease-out` scale `1.02` on the tile per the wheel-ball/hover-enlarge precedent in DESIGN-MOTION-SPEC §3) · swatch `:focus-visible` (own ring) · swatch pressed (`.08s`, existing `:active{transform:scale(.97)}` rule in `shell.css` line 17 — extend that selector list to include the new swatch tile class) · horizon chip present/absent (Layer B) | Copy-hex-on-click behaviour (`copy(b.dataset.h!, ...)`) unchanged from today, only the visual container changes. |
| **Letterform axis block (`.axis-tipo`, new)** | default (specimen strip rendered in real family faces) · font-loading (FOIT/FOUT — `font-display:swap` already governs this per DESIGN-SYSTEM, no new state) · family-not-in-bank (caption fallback, §2.2) | No hover/click target on individual specimen rows in this spec (the existing "Open these families in Type" button remains the single action for the whole axis) — do not make individual rows clickable without a stated destination, that would need its own spec decision. |
| **Pairing axis block (`.axis-comb`, new)** | default only — pure typographic treatment, no interactive elements beyond inherited citation chips | |
| **Surface axis block (`.axis-apl`, new, inverted-polarity band)** | default (inverted local `--ink`/`--ground`) · contrast-verified both directions (manual check, §2.2) | No `data-ground`-toggle interaction of its own — this is a fixed local inversion, not user-controlled. |
| **Counter-reading block (`.axis-contra`, new, Layer B)** | present (double-rule bordered, full-width) · absent (Edition.contra undefined — renders nothing) | No loading/skeleton state — either the field exists in static data or it doesn't; this is not an async fetch. |
| **Citation chip (new, replaces plain inline link list)** | default · hover (`hover:hover`, border colour step) · `:focus-visible` (own ring) · active/press (`.08s`) | Applies uniformly across all axis blocks including the inverted Surface band (verify border colour choice works in both local polarities). |
| **Timeline rail (new, replaces `edTabs` + `edArquivo`)** | default · current-edition tick (filled + accent underline) · archived tick (outline only) · hover per tick · `:focus-visible` per tick · pressed (`.08s`) | Single control per DESIGN-SYSTEM's "own state, not two competing controls" discipline; horizontal scroll-snap, 64px min tick width at 320px. |
| **Revisions note (new, Layer B)** | present (left-bordered marginal note) · absent (no field — renders nothing) | Same "structurally promised, honestly absent" discipline as Counter-reading. |

## 7. Files/selectors an implementer needs to touch

- `src/trends/render.ts` — split the single `AXES.map()` block (lines 26–38)
  into four axis-specific render functions (`renderColourAxis`,
  `renderLetterformAxis`, `renderPairingAxis`, `renderSurfaceAxis`); merge
  `drawBanners`'s sibling `edTabs`/`edArquivo` logic into one
  `renderTimelineRail` function; add the wheel-ring header render (new
  function, e.g. `renderEditionRing(e)` using `colorsFromHex` already
  imported); route `ax.n` through `t()` once EN labels are added.
- `src/data/trends.ts` — no required change for Layer A. `AXES` array's
  hardcoded PT `n` strings should be replaced with i18n keys alongside the
  render changes (see §0).
- `src/i18n/ui-en.ts` / corresponding PT source — add `Colour`/`Letterform`/
  `Pairing`/`Surface` axis-label entries; add any new copy introduced by
  this spec (citation chip's accessible label pattern, "editions in the
  archive" caption relocation — string itself likely already exists, just
  confirm key reuse).
- `src/styles/shell.css` — remove/replace the bare `.trendpal` styling
  (currently only line 17's `:active` rule); add `.axis`, `.axis-cor`,
  `.axis-tipo`, `.axis-comb`, `.axis-apl`, `.axis-contra`, `.trend-swatch`,
  `.trend-specimen`, `.trend-cite`, `.trend-rail`, `.trend-ring` rules per
  the mechanisms above; extend the existing `:active{transform:scale(.97)}`
  selector list (line 17) to include the new swatch-tile class.
- `src/motion.ts` — append `.axis` (or the specific axis block class) to the
  `REVEAL` selector string for the IntersectionObserver reveal, with the
  same `.lede`/body-copy exclusion already documented there for other pages.
- `src/palette/wheel.ts` — no change required; §4.2 reuses `animateHueFlip`
  as-is from a new call site in `render.ts`'s trend-palette-load handler,
  contingent on that function already being exported for reuse (verify
  current export visibility, extend if it's module-private).
- `tests/i18n.test.ts` — will need the new axis-label/citation strings
  covered by existing generic tests, no new test file expected unless the
  team wants explicit coverage of the new labels.
- `tests/reference.json` / `tests/api.test.ts` — unaffected, since none of
  this touches `src/api.ts` or palette/pairing calculation output, only
  Trends' own rendering.

## 8. Summary of the single biggest change

Retiring the one `AXES.map()` loop that stamps out four identical `.card`
blocks (`render.ts` lines 26–38) in favour of **four axis-specific layouts —
a swatch grid, a real type specimen, a pull-statement, and a polarity-
inverted closing band** — is the single biggest structural change. Every
other change (the wheel-ring header, the merged timeline rail, citation
chips, Layer B fields) supports that core fix but does not, on its own,
solve the reported "repetitive and boring" complaint the way ending the
one-template-four-times pattern does.
