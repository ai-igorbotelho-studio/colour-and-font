# Contents — article-card system redesign (monotony + hover-reveal fix)

Author: UX Architect subagent. Scope: this document only proposes structure and
interaction contract; it writes no production code. Implementation belongs to
`web-dev-ui-designer` (visual polish within these constraints) and
`web-dev-frontend-multistack` (build). Every decision below is the one to
build, not a menu.

Companion to `docs/DESIGN-CONTENTS-SPEC.md` (information architecture — tabs,
by-theme/by-date toggle, featured card, plate numbers — all kept as-is) and
`docs/DESIGN-MOTION-SPEC.md` (timing/easing vocabulary reused verbatim below).
This spec only redesigns the **card system and its hover language** described
in DESIGN-CONTENTS-SPEC.md §1.2, §3.1 and §6 ("Featured/entry card", "Article
list card"). It does not touch tabs, sort/group logic, search, the reading
pane, or the plate-number scheme.

## 0. Diagnosis of the reported hover bug

**Confirmed, not refuted — root cause is exactly as suspected, verified by
reading the CSS directly (`src/styles/shell.css` lines 183–186):**

```css
.magquote{font-style:italic;display:none}
#magList:not(.dysoff) .magopen:hover .magdek,
#magList:not(.dysoff) .magopen:focus-visible .magdek{display:none}
#magList:not(.dysoff) .magopen:hover .magquote,
#magList:not(.dysoff) .magopen:focus-visible .magquote{display:block}
@media(hover:none){.magquote{display:none!important}.magdek{display:block!important}}
```

`display` is not an animatable property — there is no `transition` declared
on `.magdek`/`.magquote` at all, and CSS cannot tween `display:none↔block`
even if one were added (it is a discrete layout property, not an interpolable
one). The swap is a hard cut between two spans of near-identical typographic
weight, size and colour (`.magdek{color:var(--soft);font-size:15px}` vs.
`.magquote{font-style:italic}` — same size, same colour, only the italic and
quote marks differ). Combined with `line-height:1.5` reflow as the dek's line
count changes to the quote's, the visible delta is small enough to read as
noise, not a state change. This matches Playwright's finding (`display` does
flip) and the user's report (nothing visibly happened) simultaneously — both
are correct descriptions of the same underlying defect: **a real state change
with no perceptible transition and insufficient typographic contrast between
its two states.** §3 below replaces the mechanism, not just adds a fade.

## 1. Breaking the monotony — from uniform grid to a measured, asymmetric module system

### 1.1 Why the current system reads as boring

`.maglist{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}`
gives every non-featured card an equal-width, equal-height (`height:100%`
inside an implicit equal row) cell, styled identically apart from a
background-colour rotation (`data-tone` cycling `card/deep/ink/card/accent`
per index). The five tones are the *only* variation, and because they cycle
by array index rather than by anything about the article, a reader correctly
perceives it as decoration, not information — the "square blocks with rounded
corners" complaint is really "every card carries the same information in the
same shape, differentiated only by a colour I can't attach meaning to."

### 1.2 The fix: role- and length-driven module sizes, not a uniform grid

Replace `auto-fit`/`minmax` equal-sizing with an explicit **CSS Grid
template using named row/column tracks and `grid-auto-flow: dense`**, where
each card's footprint is a function of two things already present in the data
— **reading time (`a.min`)** and **role (first topic / whether it carries a
pull-quote)** — not a decorative random assignment. This is the Goethean
"intensification through scale" principle from BRAND-GUIDE §9/DESIGN-SYSTEM
("Intensification → scale, not added colour") applied literally to the grid:
**a longer, more demanding read is given more visual weight in the index**,
the way Steigerung gives the most active point of the circle the most
presence — not an arbitrary size, a measured one.

Concrete grid mechanism (`.maglist`, replacing the current rule):

```css
.maglist{
  display:grid;
  grid-template-columns:repeat(6, minmax(0,1fr));
  grid-auto-rows:minmax(96px, auto);
  grid-auto-flow:dense;
  gap:14px;
}
```

Each card is assigned a **module class** at render time (`cardHtml`), derived
deterministically from `a.min` and whether `pullQuote(a)` found a real `>`
blockquote (vs. falling back to `dek`) — both values already computed today,
no new data fields:

| Module class | Condition (in priority order) | Grid footprint | Typographic treatment |
|---|---|---|---|
| `.mod-quote` | Article has a real body blockquote (`pullQuote` did not fall back to `dek`) **and** `a.min >= 5` | `grid-column:span 3;grid-row:span 2` (desktop ≥1024px; see §1.4 for smaller widths) | Led by the pull-quote as primary display type (large, serif, quote-marks-as-rule — see §1.3), title demoted to a small kicker-line above it. This is the "typographic variation" case: some cards are quote-led, not title-led. |
| `.mod-long` | `a.min >= 7` and not already `.mod-quote` | `grid-column:span 3;grid-row:span 2` | Standard title+dek, but title set at the `.lead`-adjacent size step (`clamp(26px,3.4vw,40px)`) — visibly larger than a short read, legible size hierarchy by commitment. |
| `.mod-standard` | `4 <= a.min < 7` | `grid-column:span 3;grid-row:span 1` | Current title+dek treatment, unchanged size. |
| `.mod-brief` | `a.min < 4` | `grid-column:span 2;grid-row:span 1` | Kicker+title only, dek/quote suppressed entirely (a brief piece does not need a taste-of-voice preview — it's already short enough to just open). Three `.mod-brief` cards sit side by side in the space two `.mod-standard` cards would take, giving the grid its asymmetric rhythm. |

`grid-auto-flow:dense` is required (not optional) so that when a `.mod-brief`
(span 2) is placed after a `.mod-long`/`.mod-quote` (span 3) and leaves a
2-column gap, the algorithm backfills it with the next card that fits rather
than leaving a hole — this is what produces the masonry-like asymmetric
rhythm from a strict 6-column track, with no JS layout calculation and no
`grid-template-areas` hand-authoring per article count (article count is
open-ended, `grid-auto-flow:dense` is the only mechanism that scales to an
arbitrary, changing list length, which `grid-template-areas` cannot).

The featured card keeps `grid-column:1/-1` (full width, span 6), unchanged
from today — it remains the one card exempt from the module system, per its
existing distinct treatment (DESIGN-CONTENTS-SPEC §2.2).

### 1.3 Pull-quote-led card typography (`.mod-quote`)

This is the single biggest visual change proposed in this spec (see closing
summary). For `.mod-quote` cards, invert the current title-primary hierarchy:

```
[kicker, unchanged 11.5px mono caps]
[plate number, unchanged]
“Pull-quote text, set large.”      ← primary display element
— Title, small, regular weight     ← demoted, acts as a caption/attribution line
[meta strip, unchanged: dial + date + min + topics]
```

- Pull-quote: `font-family:var(--font-display)` (the editorial serif, DM
  Serif Display currently / Fraunces per the identity direction), *not*
  italic Mulish as today's `.magquote` is — italicising a serif reads as a
  genuine quotation register; italicising the body sans (as now) just looks
  like "the same text, slightly different." Size `clamp(20px,2.4vw,28px)`,
  `line-height:1.25`. Opening/closing curly quotes remain literal characters
  in the markup (as now), not a `::before`/`::after` glyph, so they remain
  selectable/copyable text.
- A **1px rule in `--rule2`** sits above the demoted title line, functioning
  as the visual pivot between "voice" (the quote) and "catalogue fact" (the
  title/meta) — this is the one place a hairline rule does representational
  work rather than pure division, consistent with the product's ruled
  vocabulary elsewhere.
- No colour is added — this is pure type-scale/weight intensification per
  DESIGN-SYSTEM's layout principle, keeping Contents' "zero accent in list
  chrome except the one featured-card rule" invariant from
  DESIGN-CONTENTS-SPEC §1.1 fully intact.

### 1.4 Retiring the `data-tone` colour rotation

The five-tone background cycle (`card/deep/ink/card/accent` by `i % 5`) is
removed from non-featured cards entirely. It was the old system's only
variation mechanism and is no longer needed once size/typography carry that
job — and its removal also resolves a latent inconsistency with
DESIGN-CONTENTS-SPEC §1.1's "no accent colour in the list chrome" rule, which
the current `accent`/`deep` tones on ordinary list cards already violate
(only the featured card's Purpur rule is meant to be the exception). All
non-featured cards now share one background (`var(--card)`), one text colour
(`var(--ink)`), differentiated only by the module system above — this is a
deliberate, brand-correct restriction, not a loss of visual interest, since
size/type now do that work. The featured card keeps its distinct accent
treatment unchanged (still the sole accent exception).

### 1.5 Responsive grid collapse (320–1920px)

The 6-column track and span values above are the **desktop (≥1024px)**
specification. Below that, the module system degrades by reducing the column
count while keeping each module's *relative* proportion, never by keeping 6
columns and shrinking cards illegibly:

| Range | `.maglist` columns | Span mapping |
|---|---|---|
| 320–479px | `grid-template-columns:1fr` (single column) | All modules collapse to `grid-column:1/-1;grid-row:auto` — module *size* differentiation is suspended (a 1-column list cannot show relative width), but **module typography is kept** (`.mod-quote` still leads with the large pull-quote, `.mod-brief` still suppresses dek/quote) — this is the one place height/width variation drops out but the "not every card looks the same" goal is still met through type. |
| 480–767px | `grid-template-columns:repeat(2, minmax(0,1fr))` | `.mod-quote`/`.mod-long`: span 2 (full row); `.mod-standard`: span 2; `.mod-brief`: span 1 (two per row) |
| 768–1023px | `grid-template-columns:repeat(4, minmax(0,1fr))` | `.mod-quote`/`.mod-long`: span 4 (full row, single-column feel preserved since a 2×2 split at this width would only serve 2 cards abreast — acceptable, see below) — `.mod-standard`: span 2; `.mod-brief`: span 1 (four per row max, `dense` backfills) |
| 1024–1439px | 6 columns as specified in §1.2 | as specified |
| 1440–1919px | 6 columns, gap increases `14px → 20px`, column count unchanged (padding not columns, per DESIGN-SYSTEM §Responsive) | as specified |
| ≥1920px | 6 columns inside the existing capped-width container (no reading-measure implication here since these are cards, not prose — the container cap is the product's existing centred-container rule, not a new one) | as specified |

At 768–1023px, `.mod-quote`/`.mod-long` taking a full row rather than
half is deliberate: a 2-column split for a quote-led card would force the
large serif pull-quote to wrap awkwardly at a narrow half-width column, which
would look broken rather than intentional — full-width at this range avoids
that failure mode without adding a new breakpoint-specific class.

`gap:14px` (`20px` at ≥1440px) satisfies the ≥40px tap-target rule
independently of grid gap: every `.magopen` button retains its existing
`padding:26px 24px` (or the brief-card's reduced but still ≥40px effective
padding — verify `.mod-brief`'s reduced content doesn't shrink the button
below 40px min-height; if the brief card's content (kicker+title only) makes
the button shorter than 40px at any width, add `min-height:40px` to
`.mod-brief .magopen` explicitly).

No horizontal scroll is introduced by this grid at any width — all tracks
use `minmax(0,1fr)`, per DESIGN-SYSTEM's cross-cutting responsive rule.

## 2. Hover-reveal redesign

### 2.1 Decision: keep the dek→voice-sample swap, change the mechanism and re-scope it

The underlying idea (give a taste of the writing's actual voice on hover) is
sound and worth keeping — the problem is purely the transition and the visual
similarity of the two states, as diagnosed in §0. However, two structural
changes to the *scope* of the mechanism follow from §1's module redesign:

- **`.mod-quote` cards already show the pull-quote at rest** (§1.3) — they
  have no dek at all to swap from. The hover-reveal mechanism therefore only
  applies to `.mod-standard` and `.mod-long` cards (which still lead with
  title+dek). `.mod-brief` cards have no dek/quote shown at all (§1.2), so
  the mechanism doesn't apply there either — this alone removes roughly a
  third to half of the cards from needing a hover-reveal mechanism at all,
  which is itself a meaningful de-risking of the "did anything happen"
  problem, since it's no longer the *only* way a reader ever sees a quote.
- For the remaining `.mod-standard`/`.mod-long` cards, the reveal becomes a
  **stacked reveal, not a swap**: the dek stays visible at all times (it is
  the card's catalogue-accurate one-line summary and must not disappear —
  removing information on hover is also poor UX independent of the animation
  bug); the pull-quote is a **second element that slides in underneath it**,
  pushing the meta strip down. This sidesteps the "two similar-looking states
  swapping in place" problem entirely by making the reveal additive and
  spatial rather than substitutive and typographic.

### 2.2 Mechanism: height/opacity reveal via `grid-template-rows`, motion-spec compliant

Markup addition (new element, no removal of existing ones — `magdek` stays
permanently visible, `magquote` becomes an always-rendered but collapsed
block rather than `display:none`):

```html
<span class="magdek">…</span>
<span class="magquoterow"><span class="magquote">"…"</span></span>
<span class="magmeta">…</span>
```

CSS mechanism — animate `grid-template-rows: 0fr → 1fr` on the wrapper
(the modern, jank-free way to transition an intrinsic-height reveal; degrades
safely to instant if `grid-template-rows` transitions are unsupported, since
the un-animated end state is still correct):

```css
.magquoterow{
  display:grid;
  grid-template-rows:0fr;
  overflow:hidden;
  transition:grid-template-rows var(--tw-slow) var(--ease-out);
}
.magquoterow > .magquote{
  min-height:0;
  opacity:0;
  transform:translateY(-4px);
  transition:opacity var(--tw-fast) var(--ease-out),
             transform var(--tw-fast) var(--ease-out);
}
#magList:not(.dysoff) .magopen:hover .magquoterow,
#magList:not(.dysoff) .magopen:focus-visible .magquoterow{
  grid-template-rows:1fr;
}
#magList:not(.dysoff) .magopen:hover .magquoterow > .magquote,
#magList:not(.dysoff) .magopen:focus-visible .magquoterow > .magquote{
  opacity:1;
  transform:none;
  transition-delay:.08s; /* let the row start opening before the text fades in, avoids a squashed-text flash */
}
```

Timing: row expansion uses `--tw-slow` (.5s) — deliberately the *slower* of
the two tokens, because per DESIGN-MOTION-SPEC §1 a spatial reveal (height
change) reads as a "settle," not a micro-interaction, and needs enough
duration for a fast/imprecise mouse pass to actually register a moving
element rather than a flicker (the failure mode reported). The text's own
opacity/transform fade layers `--tw-fast` on top with a short delay, matching
the button hover language's own precedent of composing multiple properties
at different speeds (DESIGN-MOTION-SPEC §1's "hover" row already composes
translateY + shadow-step similarly).

This is unmistakable even to a fast/imprecise pointer because: (a) it is a
**spatial** change (the card visibly grows/pushes its meta line down), which
the eye registers via layout shift far more reliably than a same-position
opacity/display cross-fade of similar text; (b) at .5s it is long enough to
be seen mid-motion even if the pointer only grazes the card briefly, unlike
the current instant cut which can complete within a single frame.

`focus-visible` keeps the existing "permanent reveal, not only on hover"
behaviour (DESIGN-CONTENTS-SPEC §3.1) — same rule, `grid-template-rows:1fr`
stays applied for as long as focus remains, no change to that contract.

### 2.3 Reduced motion

Per DESIGN-MOTION-SPEC §5's table ("Hover-enlarge preview… Disabled — no
scale transform under reduced motion; a static `:hover` state with no motion…
still communicates hoverability"), apply the same principle here: under
`prefers-reduced-motion: reduce`, drop the transition entirely and let the
quote row snap directly to its open/closed state —

```css
@media(prefers-reduced-motion:reduce){
  .magquoterow{transition:none}
  .magquoterow > .magquote{transition:none}
}
```

State feedback is preserved (the quote still appears/disappears on
hover/focus, per Motion Principle 4 — "removes only the tween, never the
feedback"), only the animated growth/fade is removed.

### 2.4 Touch (`hover:none`)

Reconsidered per the task's prompt, and the answer is: **keep hiding the
quote row entirely on touch, but for a different reason than before.** The
current code hides `.magquote` on touch presumably because there is no hover
to trigger it; with the new stacked mechanism the same logic still applies
(no hover event exists to open `.magquoterow`), but additionally: a touch
user already gets the dek as the card's own summary and can simply tap to
open the article to read the real quote in context — there is no
touch-equivalent gesture worth inventing here (a tap-to-preview would
conflict with tap-to-open on the same element, which DESIGN-SYSTEM's "no
focus traps / no gesture ambiguity" spirit argues against). Concretely:

```css
@media(hover:none){
  .magquoterow{display:none}
}
```

This differs from today's `.magquote{display:none!important}` only in
targeting the new wrapper element; behaviourally identical (quote never
shown on touch, dek always shown), which is correct to keep.

### 2.5 Dyslexia-friendly gate

Unchanged gating mechanism, same selector pattern (`#magList:not(.dysoff)`)
already used today — carried over verbatim onto the new `.magquoterow`
selectors in §2.2, so `.dysoff` continues to fully suppress the reveal
(row stays permanently collapsed, `grid-template-rows:0fr`, regardless of
hover/focus) when "Leitura facilitada" is active, per
DESIGN-CONTENTS-SPEC §5's explicit requirement that this mode disable the
hover-reveal entirely.

## 3. Full component/state table

| Component | Default | Hover (`hover:hover`) | `:focus-visible` | Active/press | Touch (`hover:none`) | `.dysoff` (dyslexia mode) | `prefers-reduced-motion:reduce` |
|---|---|---|---|---|---|---|---|
| **Featured card** (unchanged from DESIGN-CONTENTS-SPEC §2.2) | Full-width, accent rule, no plate number, no module class applied | `translateY(-2px)`, `--sh` shadow, border→`--ink` (existing `.magopen:hover` rule, unchanged) | Same as hover, permanent while focused | `.08s` press per DESIGN-MOTION-SPEC §1 (add if not already present — verify) | No hover-lift, tap opens directly | No change (featured card has no quote-reveal to suppress) | Lift/scale disabled, shadow-step-only feedback retained (`--sh`→`--sh-2`, `--tw-fast`), per Motion table row 1 |
| **`.mod-quote` card** | Pull-quote visible at rest (§1.3), no reveal mechanism (nothing to hover-reveal) | `translateY(-2px)` + `--sh` lift only (existing card-hover language, no content change since quote already shown) | Same as hover | `.08s` press | Same as default, tap opens | N/A (no reveal to suppress) | Lift disabled, shadow-step only |
| **`.mod-long`/`.mod-standard` card** | Kicker, title, dek visible; `.magquoterow` collapsed (`grid-template-rows:0fr`) | Card lift (existing) **+** `.magquoterow` expands to `1fr` over `--tw-slow`, quote fades/slides in over `--tw-fast` with `.08s` delay (§2.2) | Identical reveal to hover, but persists for the duration of focus (not just a hover pulse) | `.08s` press on the card itself; no separate press state for the reveal (reveal is not a discrete click target) | `.magquoterow{display:none}` — dek only, no reveal attempted (§2.4) | `.magquoterow` stays permanently collapsed regardless of hover/focus (§2.5) | Row/opacity transitions removed (`transition:none`), end-state (open or closed) still applied instantly on hover/focus (§2.3) |
| **`.mod-brief` card** | Kicker + title only, no dek, no quote row rendered at all | Card lift only (existing) | Card lift only, permanent while focused | `.08s` press | Same as default | N/A (nothing to suppress) | Lift disabled, shadow-step only |
| **Plate reference number** (`E·NN`) | Unchanged from existing spec — `--font-mono`, `--soft`, 11px, top-left, `aria-hidden="true"` | No change | No change | No change | No change | No change | No change |
| **Reading-time dial** | Unchanged — static filled ring, informational furniture | No change | No change | No change | No change | No change | No change (already static, never animates per existing spec) |
| **Topic grouping / by-theme-by-date toggle** | Unchanged from DESIGN-CONTENTS-SPEC §2.3/§2.4 | Unchanged | Unchanged | Unchanged | Unchanged | Unchanged | Unchanged |
| **`.maglist` grid** | 6-column dense grid, module spans per §1.2 (≥1024px) | N/A (grid itself has no interactive state) | N/A | N/A | Column count collapses per §1.5 breakpoints; module *typography* differentiation kept even where width differentiation is suspended at 320–479px | N/A | N/A (grid layout is not a motion concern) |

## 4. Data/markup contract (for the implementer, no new fields)

- Module classification (`mod-quote`/`mod-long`/`mod-standard`/`mod-brief`)
  is computed once per card at render time in `cardHtml()`, from `a.min` and
  whether `pullQuote(a)` matched a real `>` blockquote vs. falling back to
  `dek` (both already computed today — reuse `pullQuote`'s existing
  fallback signal by having it optionally return whether it matched, e.g.
  change its return to `{text, isReal}` or check `x.body` for the regex
  again at classification time; either is a same-file, no-schema-change
  edit).
- No new fields on `Article` are required. No change to `src/data/*.ts` or
  `src/i18n/*.ts`.
- `.magquote`'s content and fallback-to-dek behaviour is unchanged from
  today (§3.1 of the parent spec) — only its *container* (`.magquoterow`)
  and *transition mechanism* are new.

## 5. Summary of what changes vs. today

1. **Biggest visual change:** the uniform equal-size card grid
   (`auto-fit`/`minmax`, five decorative background tones) is replaced by a
   6-column `grid-auto-flow:dense` layout where card footprint and
   typographic register (title-led vs. pull-quote-led) are driven by the
   article's own reading time and content shape — producing genuine,
   information-grounded asymmetry instead of a uniform grid of rounded
   rectangles differentiated only by an arbitrary colour cycle.
2. The five-tone background rotation on non-featured cards is retired
   entirely (and its accent/deep tones' latent violation of the "no accent
   in list chrome" rule is resolved as a side effect).
3. The hover dek→quote swap is confirmed broken (untransitionable
   `display` property, near-identical typographic states) and replaced with
   an additive, spatial `grid-template-rows` reveal using existing
   `--tw-fast`/`--tw-slow`/`--ease-out` tokens, scoped only to the card
   types that still lead with a dek (`.mod-quote` shows its quote at rest
   instead; `.mod-brief` has no dek/quote at all).
4. All existing invariants — featured card, plate numbers, reading-time
   dial, topic grouping, by-theme/by-date toggle, `.dysoff` dyslexia gate,
   `hover:none` touch fallback, `prefers-reduced-motion` state-feedback
   preservation — are kept, re-scoped only where §1–§2 required it, and
   itemised in the state table in §3.
