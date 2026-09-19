# Auge — Motion Spec

Companion to `DESIGN-SYSTEM.md` §Motion principles and `BRAND-GUIDE.md` §9. Extends the
home-card work (`docs/DESIGN-HOMECARDS-SPEC.md`, `src/styles/shell.css` `.homecard`) to the
rest of the interface. Implementation-ready: every rule below names the exact property,
token, and easing curve to use. No new timing token is introduced — `--tw-fast` (.15s),
`--tw` (.38s), `--tw-slow` (.5s) already exist in `src/styles/tokens.css` and are reused
throughout.

## 0. Two easing curves, reused everywhere

Define once in `src/styles/tokens.css` (or `motion.css` if kept out of the colour-token
file) and never diverge per-component:

```css
--ease-out: cubic-bezier(.2,.7,.2,1);   /* settle: hover, entrance, press-release */
--ease-in:  cubic-bezier(.4,0,1,1);     /* commit: press-down, exit, polarity swap start */
```

`--ease-out` is already used ad hoc in `motion.css` (`.rv`, `.tab svg`, `vt-in`) and in
`.tilt`. Replace every hardcoded `cubic-bezier(.2,.7,.2,1)` with `var(--ease-out)`, and
`vt-out`'s `ease-in` with `var(--ease-in)`. This is a find-replace, not a new design
decision — it makes the curve a single source of truth so a future tuning pass touches one
line.

No third curve. If a component seems to need a bounce/spring, it is over-designed for this
product — reject it at the storyboard stage, per the Motion Designer's own remit.

## 1. Buttons — press/hover/focus language

One state machine for every clickable chrome element: nav rail items, `.homecard`,
`button.act`/`button.mini`, Create's proposal buttons, the Light/Dark and ENG/PORT toggles,
`.tab`.

| State | Timing | Curve | What moves |
|---|---|---|---|
| Hover (mouse/pen, `hover:hover` only) | `--tw-fast` | `--ease-out` | `translateY(-2px)` (buttons) or `-3px` (cards, already shipped on `.homecard`) + shadow step `--sh` → `--sh-2`. Never scale text, never scale the whole button beyond `1.02`. |
| Focus-visible | instant (no transition on the ring itself; `outline` change is not animated — a delayed focus ring reads as broken, not smooth) | — | `outline: 2px solid var(--accent)` (or `var(--ink)`/`var(--ground)` on the accent-coloured `:first-child` homecard, already correct), `outline-offset: 3px`. Focus and hover compose: if both are true, both effects apply, they do not fight. |
| Active/press | `.08s` linear-ish, i.e. **hardcode `.08s`** as already done on `.homecard:active` — a press must feel instant, faster than even `--tw-fast`; do not introduce a token for this one-off, it is a physical constant (human perception of "instant") not a design timing choice. | `--ease-out` | `translateY(-1px)` (roughly halfway back from hover, never all the way to 0 — keeps continuity), shadow drops one step (`--sh-2` → `--sh`). |
| Disabled | none | — | No transition at all: opacity/cursor change happens with the state, not animated into. A disabled button that eases into disabled reads as still-interactive mid-transition. |

Rationale in one line each:
- Press must feel faster than hover because it is confirming a causal action already taken, not inviting one.
- Hover translateY communicates "this is liftable," which is why it is the one thing that must not appear on disabled or `aria-current` "already active" nav items (see below) — those are not liftable, they're settled.

### Nav rail / `.tab` specifics
- Icon scale on hover (`.tab:hover svg{transform:scale(1.12)}`) stays — already correct, keep timing `--tw-fast` not the current unspecified inherited `.25s` (tighten `motion.css` line `.tab svg{transition:transform .25s ...}` to `var(--tw-fast)`).
- `aria-current="page"` icon sits at a fixed `scale(1.06)` **with no transition on state entry from route change** — it should already be there when the page painted (it's a state, not an event a user watched happen). Only animate it if the user is on the page and something else changes the current tab (rare); otherwise instant.
- Current+hover (distinct from current alone, per DESIGN-SYSTEM.md's required-states table): `scale(1.06)` (current) composes additively to `scale(1.12)` cap only via a single combined rule `.tab[aria-current="page"]:hover svg{transform:scale(1.16)}` — a visibly larger step than either state alone, so the two are legibly distinct.

### Magnetic button effect (`initMagnet`, `button.act`)
Keep, but cap displacement at the already-coded 8px/6px — do not extend to more buttons.
This is a decorative micro-interaction (not causal), so per Motion Principle 1 it should
only apply to the single "primary" call-to-action per view (the button `.act` class already
implies this — verify in code that `.act` is not applied to more than one button per
screen; if it is, that's a Design (not Motion) violation to flag back, not something to fix
here by animating more buttons).

## 2. Section transitions — figure-ground polarity swap

Two distinct choreographies, chosen by *what* changed, not by which route:

### 2a. `data-ground` toggle (Light/Dark, "Luz"/"Treva")
This is the purest figure-ground inversion in the product — animate it as a **crossfade of
the custom-property values already driving every surface**, not a clip-path or wipe (a wipe
implies spatial movement across a boundary, which is wrong for a colour-space inversion that
happens everywhere at once).

Implementation: add a single rule transitioning the properties that already read from
tokens:
```css
:root, html[data-ground="treva"] {
  transition: background-color var(--tw-slow) var(--ease-out);
}
html, html * {
  transition: background-color var(--tw-slow) var(--ease-out),
              color var(--tw-slow) var(--ease-out),
              border-color var(--tw-slow) var(--ease-out),
              box-shadow var(--tw-slow) var(--ease-out);
}
```
Scope this to a `.polarity-swap` class toggled onto `<html>` for ~600ms around the moment
`nav.ts` sets `data-ground` (add the class, set the attribute, remove the class after
`--tw-slow` + a small buffer via `transitionend` or a timeout) rather than a permanent
universal-selector transition — a permanent `html *` transition rule would also fire (and
feel laggy) on every dynamic content swap (palette regenerate, pairing swap), which must
stay instant per the wheel's own causality rule. This scoping is the one precise engineering
instruction here: **do not leave the transition globally active**.

### 2b. Route change (Colour ↔ Type ↔ Create ↔ Trends ↔ Contents ↔ Theory)
Keep the existing View Transitions API hook in `motion.css` (`vt-out`/`vt-in`) but change it
from a slide (`translateY`) to match the figure-ground principle: a **cross-dissolve with a
directional lightness cue**, not a slide, because DESIGN-SYSTEM.md §3 explicitly forbids a
page-slide. Concretely:

```css
::view-transition-old(root){animation:vt-out var(--tw-fast) var(--ease-in) both}
::view-transition-new(root){animation:vt-in var(--tw) var(--ease-out) both}
@keyframes vt-out{to{opacity:0}}
@keyframes vt-in{from{opacity:0}}
```
Remove the `translateY(-6px)`/`translateY(10px)` — those are the residual "slide" the brand
guide asks to avoid. A pure opacity cross-dissolve is the "simpler swap" asked for in the
task for non-colour-specific transitions.

### 2c. Colour-specific transition: the 180° hue flip "crosses the wheel"
This applies specifically where a colour value itself changes by ~180° (e.g. swapping to
the harmonious opposite, or the base hue's binary-search regime flip) — not to route
navigation. Distinguish it from 2a/2b: this is a **data event inside the Colour page**, not
a page transition.

Implementation (in `src/palette/wheel.ts`, alongside `hooks.render()`): when a hue changes
by a value whose absolute delta (mod 360, taking the short way) exceeds a threshold (e.g.
>90°), do not let `hooks.render()` just snap the swatch/background colour via CSS custom
property update. Instead, tween the underlying hue angle itself across N intermediate OKLab
samples over `--tw` (.38s), so the swatch visibly sweeps through the wheel's actual
intermediate hues (through the neighbouring anchors) rather than cross-fading directly
between the two end colours in RGB/OKLab blend space. Concretely:
```ts
function animateHueFlip(colorIndex: number, fromA: number, toA: number): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { S.colors[colorIndex].a = toA; hooks.render(); return; }
  const dur = 380, start = performance.now();
  const short = wrapDeg(toA - fromA); // signed shortest arc — still animate the long way if the causal event IS a 180° flip, i.e. do not shortest-path a deliberate opposite-swap
  const arc = Math.abs(short) >= 175 ? 180 * Math.sign(short || 1) : short;
  function tick(now: number): void {
    const p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3); // ease-out cubic, matches --ease-out's settle character
    S.colors[colorIndex].a = (fromA + arc * e + 360) % 360;
    hooks.render();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
```
This is the one animation in the product allowed to run longer than a generic card hover
(Motion Principle 1 caps decoration at 150ms — this is explicitly *not* decoration, it is
narrating the causal 180° relationship Goethe's geometry asserts).

## 3. Colour wheel and type-pairing interactions

### Wheel dragging (`src/palette/wheel.ts` `initWheel`)
- **Drag (pointermove):** stays exactly as now — zero added transition, 1:1 with the
  pointer. Any eased lag here would break the "arrow-key = angle increment, causality not
  decoration" contract: a dragged ball must feel like it *is* the pointer, not chasing it.
- **Pointer-up (drop/snap):** if snapping to a discrete angle is ever introduced (not
  currently — code lets `c.a = p.a` freely), the snap itself gets a `--tw-fast`
  `--ease-out` tween, because a snap is a discrete causal correction the user should see
  happen, distinct from the continuous drag before it. Not required by current code; flag
  for whoever adds snapping.
- **Keyboard (arrow keys):** currently `hooks.render()` is called with no tween — correct
  per Motion Principle 4 (state feedback jumps directly, no tween on keyboard). Do not add
  any transition to the ball's position driven by keyboard input. Only the *hover/focus ring
  on the ball itself* may transition (`--tw-fast`, `--ease-out`, matching the button
  language in §1) — the ball's centre coordinate must not ease.
- **`aria-live` colour-name announcement** (per DESIGN-SYSTEM.md accessibility section, on
  release not per-pixel): purely textual, no motion — but the visible colour name label in
  the UI (if rendered) may cross-fade its text content over `--tw-fast` when it changes, so
  a fast successive drag doesn't flash-swap text illegibly. Opacity only, no transform.
- **Ball hover/press:** apply the same button language as §1 (translateY-style lift is wrong
  for a circular drag handle; instead scale the ball `1.15` on hover, `1.25` on active-drag —
  already partially present via `input[type=range]::-webkit-slider-thumb` pattern in
  `motion.css`; mirror that ratio onto `.ball`).

### Type pairing (`src/type/pairing.ts`, `hierarchy.ts`, `specimen.ts`)
No pairing/swap-specific transition classes exist yet in the read files — pairing swaps are
presumably instant DOM replacement. Per Motion Principle 1 ("animate the state change in the
data... pairing swap"), add:
- **Pairing swap (new sample replaces old):** cross-dissolve the two specimen blocks,
  `--tw` `--ease-out`, opacity only (0→1 in, no fade-out of the old — the old is simply
  replaced once the new reaches opacity 1, avoiding a double-exposure that would make body
  text briefly overlap and become unreadable, which is also why this must never touch the
  actual reading-sample glyphs' layout, only a wrapping container's opacity).
- **Hover-enlarge preview** (required state per DESIGN-SYSTEM.md's table): `transform:
  scale(1.04)` on the sample's preview element only (not the label/metadata), `--tw-fast`,
  `--ease-out` — same family as `.mockimg` zoom already in `motion.css`.
- **Selected state:** instant (border/outline appears with the click), no transition — a
  selection is a discrete fact, not a settle.
- **Comparing (side-by-side):** the layout reflow from single to side-by-side may use a
  `--tw` `--ease-out` `grid-template-columns` transition if both states share a grid parent;
  if implemented via full remount, skip animating and rely on the entrance reveal in §4
  instead — do not force a reflow animation onto a re-layout that doesn't share a stable DOM
  parent, that produces jank rather than clarity.
- **Font-loading FOIT/FOUT:** no motion — `font-display:swap` already governs this
  correctly; do not add an opacity fade on swap-in, since that reintroduces exactly the kind
  of "decorative" text motion Principle 5 forbids for reading content, and pairing samples
  are reading content once selected.

## 4. Page-load entrance (`src/motion.ts` `initReveal`, `motion.css` `.rv`)

Keep the IntersectionObserver approach; refine:

- **Stagger:** current `data-d` 0–4 steps at 0/.06/.12/.18/.24s are fine up to 5 siblings;
  cap it there (`i % 5`, already coded) so a long list (e.g. Trends' 93-family grid, or a
  long card list) doesn't produce a multi-second cascade — a cascade beyond ~250ms of total
  stagger reads as slow load, not polish. No change needed to the modulo, just confirm no
  view exceeds ~10–12 revealed siblings in the same viewport without falling back to the
  modulo wrap (it already wraps, so this is a confirmation, not a code change).
- **Exempt from `.rv`/reveal entirely:** long-form reading text — Theory's body paragraphs,
  Trends' editorial paragraphs/essay body, article body in Contents. The current `REVEAL`
  selector (`.stage > div, .homecard, .magcard, .mock, .card, .prop, .fontcard, .magmusic,
  .magrefs, .mocksec > *, .hero > *`) already does not target paragraph-level text directly,
  but `.hero > *` will catch a `.hero .lede` intro paragraph if one exists — **exclude
  `.lede` explicitly**: change the selector to `.hero > :not(.lede)` or add `.lede{opacity:1
  !important;transform:none !important}` inside the reveal rule, so a dek/standfirst never
  slides in. Same for any `.theory` or `.essay` body copy — never add those to `REVEAL`, and
  add an explicit guard comment in `motion.ts` next to `REVEAL` stating this exclusion is
  deliberate (so it isn't "fixed" by a future contributor who assumes all content should
  reveal).
- **Chrome that legitimately reveals:** headings, card grids, mockups, the hero's own
  headline `h1` (a single short heading revealing is a chrome flourish, not reading text) —
  current scope is correct here, no change.
- **Timing:** `.55s` with the existing `--ease-out`-equivalent curve is longer than
  `--tw-slow` (.5s) by a hair — round it down to reuse `--tw-slow` exactly:
  `transition:opacity var(--tw-slow) var(--ease-out),transform var(--tw-slow)
  var(--ease-out)`. This is the one numeric tightening in this section: 0.55s → 0.5s so the
  token table has no orphan value.
- **Parallax (`initParallax`) and tilt (`initTilt`):** both stay opt-in/decorative and
  already correctly gated to `(prefers-reduced-motion: no-preference)` and, for tilt, `(hover:
  hover) and (pointer: fine)`. No change; both qualify as "generic card hover ≤150ms"-class
  decoration in spirit even though parallax itself is continuous rather than durationed —
  flag that parallax has no explicit off-switch beyond the reduced-motion media query, which
  is correct and sufficient, do not add a duration to something that tracks scroll position.

## 5. `prefers-reduced-motion: reduce` — the full contract

One rule per animation family in this document. "State-only feedback" means the end state
still changes and is still perceivable; only the *tween* is removed (typically becomes an
instant flip, or where a duration is unavoidable for legibility, capped at `--tw-fast`
opacity-only).

| Family | Reduced-motion behaviour |
|---|---|
| Button/card hover lift (`translateY`, scale) | **Disabled entirely.** Shadow-only feedback remains (`--sh` → `--sh-2` on hover) with `var(--tw-fast)` transition on `box-shadow` alone — already the pattern coded at `motion.css`'s existing `@media(prefers-reduced-motion:reduce)` block for `.homecard` (extend the same block to cover `button.act`/`.mini`/`.tab`, not just `.homecard`). |
| Press/active | Kept as-is: press feedback is core state feedback, not choreography — the `.08s` shadow-step stays under reduced motion too. |
| Focus ring | Always instant already — unaffected by the media query either way. |
| `data-ground` polarity crossfade (§2a) | **Instant.** Remove the `.polarity-swap` transition class application entirely; the attribute flip and resulting `var()` cascade happens in a single paint. This is a "swap" not "choreography" once you strip the crossfade, so nothing is lost functionally. |
| Route cross-dissolve (§2b, View Transitions) | **Disabled.** Wrap the `::view-transition-*` keyframe rules in the existing `@media(prefers-reduced-motion:no-preference)` guard already present in `motion.css` (they already are — confirm no regression) so the browser's default (instant swap) applies. |
| 180° hue-flip tween (§2c) | **Kept as instant state-feedback, not removed as choreography** — but per Motion Principle 4 this is the one case where "state feedback" itself *is* the animation's entire purpose (narrating causality), so the correct reduced-motion behaviour is: skip the `requestAnimationFrame` tween, set `S.colors[colorIndex].a = toA` directly and call `hooks.render()` once (already exactly what the `animateHueFlip` code sample in §2c does via its early `matchMedia` check). This is intentionally different from "shorten duration" — it's a full skip to end-state, per the explicit instruction in this task's brief. |
| Wheel drag / keyboard angle | **Unaffected either way** — already untweaned in both motion states (drag is 1:1, keyboard jumps). No change needed; this is the existing correct baseline the rest of the system should be judged against. |
| Pairing swap cross-dissolve (§3) | **Disabled**, replace with instant DOM swap (opacity jumps straight to 1, no transition property applied). |
| Hover-enlarge preview (pairing, wheel ball, `.mockimg` zoom) | **Disabled** — no scale transform under reduced motion; a static `:hover` state with no motion (optionally a static outline) still communicates hoverability without the animated scale. |
| Page-load reveal (`.rv`) | **Disabled outright**, not shortened — content must be visible immediately at `opacity:1;transform:none` with no observer-driven delay, since a staggered reveal is pure choreography with no causal content, and `initMotion()` in `motion.ts` already `return`s before calling `initReveal()` when `reduce` is true. Confirm `.rv` base CSS (`opacity:0`) is only ever applied inside the `@media(prefers-reduced-motion:no-preference)` block in `motion.css` — it already is. No JS or CSS change required, this row documents the existing (correct) behaviour so it isn't accidentally "fixed" later. |
| Parallax / tilt / magnet | **Disabled outright** — already gated by `initMotion()`'s early return before `initParallax()`/`initTilt()`/`initMagnet()` calls. No change. |
| Zoom lightbox open/close (`#zoom` fade, `zin` pan/zoom transform) | Pan/zoom drag interaction itself (`initZoom`) is **kept** — it's a direct manipulation the user is actively driving (pinch/drag/wheel), not decorative choreography, and disabling it would remove functionality, not just polish. Only the ambient open/close `zfade` keyframe (`motion.css` line 44) is dropped — it's already correctly scoped inside `@media(prefers-reduced-motion:no-preference)`. |

## 6. Token/timing/easing map (complete)

| Animation | Token | Curve | Notes |
|---|---|---|---|
| Nav/`.tab` icon hover scale | `--tw-fast` | `--ease-out` | tighten from current unscoped `.25s` |
| `.tab` current+hover combined scale | `--tw-fast` | `--ease-out` | new combined selector, §1 |
| `button.act`/`.mini` hover lift + shadow | `--tw-fast` | `--ease-out` | matches `.homecard` pattern already shipped |
| Any element's press/active | `.08s` (hardcoded constant, not a token) | `--ease-out` | matches `.homecard:active` already shipped |
| `.homecard` hover (existing) | `--tw-fast` | `--ease-out` | unchanged, reference pattern |
| Icon stroke-width hover (existing `.homecard svg`) | `--tw-fast` | (property-only, no easing needed for stroke-width) | unchanged |
| `data-ground` polarity crossfade | `--tw-slow` | `--ease-out` | scoped `.polarity-swap` class only, §2a |
| Route view-transition out | `--tw-fast` | `--ease-in` | opacity only, no translateY |
| Route view-transition in | `--tw` | `--ease-out` | opacity only, no translateY |
| 180° hue-flip tween | `.38s` (== `--tw`, hardcoded in `wheel.ts` since it's JS not CSS — mirror the `--tw` value as a literal `380`) | ease-out cubic (`1-(1-p)^3`, JS equivalent of `--ease-out`'s settle character) | the one animation exempted from the ≤150ms decoration cap, justified in §2c |
| Page-load reveal (`.rv`) | `--tw-slow` | `--ease-out` | tightened from `.55s` to exactly `--tw-slow` |
| Reveal stagger delays | `.06s` steps × `data-d` 0–4 | n/a (delay, not duration) | unchanged |
| Pairing swap cross-dissolve | `--tw` | `--ease-out` | new, §3 |
| Pairing/wheel-ball/zoom hover-enlarge | `--tw-fast` | `--ease-out` | new/extended, §1 §3 |
| Tilt (`.tilt`) transform | `.18s` (existing, close to `--tw-fast`; leave as-is, do not force onto token since it is tuned for pointer responsiveness, not a settle) | `ease-out` (CSS keyword, existing) | unchanged, documented exception |
| Zoom pan/zoom transform | `.08s linear` (existing) | linear (existing) | unchanged — direct manipulation, not a settle, so `--ease-out` would be wrong here |

## 7. Summary of the single biggest behavioural change

The route-transition slide (`translateY` in `vt-out`/`vt-in`) is removed in favour of a pure
opacity cross-dissolve, and the `data-ground` toggle gains an explicit, scoped
background/colour crossfade (currently instant with no transition at all). Together these
make every section change in the product legible as one of exactly two things: a **polarity
swap** (dark↔light, crossfades surface colours) or a **content swap** (route change,
crossfades opacity only) — with no spatial slide anywhere, closing the gap between the
already-agreed principle in `DESIGN-SYSTEM.md` §3/`BRAND-GUIDE.md` §9 and the code that
still slides pages today.
