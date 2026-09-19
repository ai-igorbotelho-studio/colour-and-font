# Contents — reading & browsing experience, creative direction

Author: Direção Criativa subagent. Scope: this document only proposes; it writes
no production code. Implementation belongs to `web-dev-ux-architect` /
`web-dev-ui-designer` / `web-dev-frontend-multistack`. Do not treat any option
below as a menu — every decision here is the one to build.

Companion to `BRAND-GUIDE.md` (§8, editorial direction for Trends/Contents),
`DESIGN-SYSTEM.md` (tokens, motion, responsive rules) and
`docs/DESIGN-HOMECARDS-SPEC.md` (the interaction vocabulary this spec extends —
dial-boxed icons, index plates, `--sh-2`, `--tw-fast`/`--tw-slow`). This spec
does not touch `src/data/*.ts` or `src/i18n/*.ts` — the foresight-content agent
owns the article/topic content itself; everything here is the container around
that content: list, filter, entry transition, reading page, chrome.

## 0. The one sentence

Contents does not look like a magazine that happens to be inside a colour
tool. It looks like the instrument's **reading room**: the same measured,
plate-numbered, hairline-ruled vocabulary as Colour/Type/Create, applied to
prose instead of controls — so opening an essay feels like switching the same
device into a slower mode, not leaving the product for a blog.

## 1. Art direction / visual concept

### 1.1 What makes Contents distinct from Trends and the tool pages

Trends is the **dated layer**: it earns motion, colour-as-signal (the
Faint/Emerging/Established/Receding horizon labels), and a magazine's
appetite for now. Contents is the **enduring layer**: it must look calmer and
more permanent than Trends on the same page furniture, or the two pages just
look like different skins of the same list.

Three concrete differentiators, all reversible with existing tokens (no new
hex):

1. **Figure-ground polarity is inverted and held, not toggled.** Trends and
   the tool pages use the product's default light-ground polarity. Contents'
   list view runs the *opposite* polarity from whatever the current
   `data-ground` state is — i.e. if the user is in light mode, the Contents
   list view still renders on `--ink`/`--rail` dark ground with `--rail-ink`
   text; if the user is in dark mode, Contents renders on `--ground`/`--panel`
   light paper. This is not a random inversion — it is Goethe's positive/negative
   logic doing real work: Contents is where the *product* explains itself
   (why a reading is legible at all, per BRAND-GUIDE §8), so it is
   deliberately figured as the fixed page against a ground that flips with
   the user's own preference, i.e. Contents becomes the page that is least
   affected by mode-switching, reinforcing "enduring" literally. Opening an
   article inverts back to the *user's* chosen polarity for the reading pane
   itself (§5) — endurance in the index, comfort in the read.
2. **No accent colour in the list chrome.** Trends leans on `--rail-on`/
   `--accent` and the Schwefelgelb-style horizon flags; tool pages carry one
   live `--accent`. Contents' list, filters and cards run ink/paper + `--rule`/
   `--rule2` only — zero `--accent` anywhere in the browsing UI. The single
   exception: the Purpur-family accent appears once, as a 2px rule under the
   *featured* entry piece (§2.2) and nowhere else. This scarcity is the
   point — Contents earns its "enduring, reference layer" identity by being
   the one section that visibly does not compete for the day's attention.
3. **Typographic register, not imagery.** No hero photography, no
   illustration system, no stock-magazine tropes. The page's visual interest
   comes entirely from type: kicker in `--font-mono` tabular caps (echoing the
   home-card index plates), title in the editorial serif at a materially
   larger optical size than anywhere else in the product bar Theory, and a
   hairline-ruled meta line. Contents is allowed to be the most typographically
   ambitious page in the product, because typography demonstrating itself is
   the entire premise (BRAND-GUIDE §4).

### 1.2 The "instrument plate" motif, extended from home cards

Home cards introduced index numerals (`01…06`) and dial-boxed icons as an
"instrument panel" grammar. Contents extends this into a **card-catalogue**
metaphor appropriate to an archive rather than a launcher:

- Every article card carries a plate-style reference number, but instead of
  a launch index it is the article's **position in its module's chronological
  run**, formatted as a fraction: `E·07` for the seventh Essay, `L·23` for a
  Lexicon term, `A·2026·Q3` for an Archive edition, `R·12` for a Readings
  entry. This is not decorative — it is genuinely how a reference archive
  numbers its holdings, and it gives every piece a stable, citable identity
  (useful since these are also individually linkable via `#c/<slug>`).
- The plate number sits top-left of the card in `--font-mono`, `--soft`,
  `11px`, tracked `.04em`, exactly matching the home-card `.hcx` treatment —
  same family, different number semantics, so the eye recognises "this is
  the same measuring instrument" without the two systems being identical.

## 2. Navigation & information architecture

### 2.1 Four modules as tabs, not four separate pages

Essays / Lexicon / Archive / Readings become a **secondary tab strip** inside
the Contents section (not four items in the primary nav — the primary nav
still just says "Contents"/"Conteúdos"). This keeps the six-section top-level
nav untouched while giving the enduring layer its promised internal structure.

Tab strip placement and behaviour:
- Sits directly under the Contents page header, full-width at ≥768px,
  horizontally scrollable (no wrap, scroll-snap) below that — never stacks
  vertically, never truncates a label.
- Four tabs: **Essays** (existing `articles.ts` content — what the current
  list renders), **Lexicon**, **Archive**, **Readings**. If Lexicon/Archive/
  Readings have no populated content yet (data model not yet built by the
  foresight-content agent), the tab still renders but in a **coming-soon
  state**: label present, `aria-disabled="true"`, one-line caption underneath
  ("Terms shared across Theory and Trends — in progress" / equivalent PT),
  never hidden entirely — the four-module promise stays visible even before
  all four are populated, which is itself the honesty invariant applied to
  information architecture, not just editorial copy.
- Active tab: 2px underline in the single Purpur-family accent (the one
  exception to the no-accent rule, §1.1) — reuses the nav's existing
  "active section underlined in accent only" pattern from BRAND-GUIDE §7, so
  a reader already understands this convention from the top nav.
- Tab switch is instant (no fade/slide) below the URL change; the list
  region below re-renders with a `--tw-fast` opacity crossfade only (150ms) —
  per Motion principle, chrome may animate, and a full re-list is a state
  change worth a light crossfade, not a slide.

### 2.2 One featured/entry piece per module, always

Each module's list opens with exactly one **featured card**, visually
distinct (larger title, the one Purpur rule from §1.1, no plate-number
fraction shown — it is presented as "start here," not catalogued), chosen as:
- Essays: the most recent piece flagged `featured: true` if such a field
  exists, falling back to most recent by date — implementer's data contract,
  not this spec's to invent, but the display treatment is specified here.
- Lexicon/Archive/Readings: most recent addition to that module.

Below the featured card, the rest of the module's items render in the
existing dense list style (current `.magcard` treatment, restyled per §1),
sorted **by theme by default, not chronologically** — this is the single
biggest structural change from the current implementation (see §2.3).

### 2.3 Browse-by-theme as the default, chronology as an explicit toggle

Today's `drawList()` always sorts by `date` descending. For an enduring
layer, recency is the wrong default axis — a reader arriving at "why is a
reading legible at all" should be organised by **Topic** first. Concretely:

- Default view groups the list into **topic sections** (using the existing
  `Topic`/`TOPICS` data — `cor`, `tipografia`, `percepcao`, `educacao`,
  `cultura`, `espirito`), each with its own `<h2>`-level topic heading, the
  hairline-ruled meta strip, and its items sorted by date within the group.
  A piece tagged with multiple topics appears once, filed under its **first**
  listed topic only (avoid duplicate listings breaking the "archive" feel).
- A single toggle control, top-right of the list region, switches between
  **"By theme"** (default) and **"By date"** (flat reverse-chronological list,
  i.e. today's current behaviour, kept intact as the alternate mode). Toggle
  is a two-segment control (`role="radiogroup"`, two `role="radio"` buttons),
  not a dropdown — it's a primary way of reading, not a settings menu.
- The existing topic filter pills (`magTopics`) stay, but change meaning
  slightly: in "By theme" mode, selecting a pill **scrolls to and highlights**
  that topic's section rather than filtering it out of view (nothing
  disappears — endurance/completeness signal); in "By date" mode pills filter
  as they do today (nothing changes there, keep current logic).
- Search (`magSearch`) behaves identically in both modes — it already
  filters `matches()` before either sort/group is applied; no change needed
  to `matches()`, only to how the filtered set is laid out.

### 2.4 320px behaviour

- Tab strip: horizontal scroll-snap, each tab a minimum 96px hit width so
  four tabs are swipeable without mis-taps; coming-soon tabs still occupy
  their slot (not shrunk) so the four-module structure stays legible even on
  the smallest screens.
- Theme/date toggle collapses to icon+label pair, no text truncation —
  reduce to short labels ("Theme"/"Date" — "Tema"/"Data") rather than hiding
  the toggle; this control is too structurally important to hide behind a
  menu.
- Topic section headings and pills both remain visible; pills wrap to a
  second line rather than horizontal-scrolling (distinguish from the tab
  strip, which does scroll — two different scroll affordances on one screen
  would be confusing, so only the module tabs get horizontal scroll).

## 3. Interactive/creative effects that serve reading

Per DESIGN-SYSTEM.md's motion rule, nothing in `.magbody` (the running text)
ever animates. Every effect below lives in navigation, entry, or chrome.

1. **Card hover preview, not just lift.** On pointer devices (`hover: hover`
   media query — never fake this on touch), hovering a list card fades in a
   single **pull-quote fragment** from the article's own `> ` blockquote
   markup (already present in the body markdown, `mdHtml()` already parses
   it) in place of the dek, over 150ms (`--tw-fast`). This gives a genuine
   taste of the writing's register — voice, not just topic — without adding
   new data fields; extraction is a simple regex on the existing body string
   at render time (`/^>\s+(.+)$/m` first match), computed once per article
   card, not on every hover. Falls back to the existing `dek` text if the
   article has no blockquote. On focus-visible (keyboard), show the same
   preview permanently rather than only on hover, so keyboard users get equal
   information, not less.
2. **Reading-time indicator becomes a filled dial, not just a number.** The
   existing "{n} min de leitura" text gains a small (16px) circular progress
   ring next to it — filled proportionally against a fixed ceiling (e.g. 12
   minutes = full ring), rendered once, static, no animation on the list
   (a static data visualisation, not a motion effect) — echoing the wheel/dial
   vocabulary used elsewhere (Colour wheel, home-card icon rings) without
   implying a live process. This is the one new visual "furniture" element on
   the card and it earns its place by being informational (a reader can judge
   commitment at a glance) rather than decorative.
3. **Entry transition into an article is a polarity crossfade, not a route
   change.** Opening an article (`open(slug)`) currently swaps `hidden`
   attributes instantly. Change to: the list region fades out over
   `--tw-fast` while the reading pane fades in, with the ground polarity
   flip from §1.1/§5 committed in the same frame the pane appears (not
   tweened separately) — this is "motion narrates causality" applied to
   navigation: the reader is shown, in one clean beat, that they have moved
   from the instrument's index into its reading mode. `prefers-reduced-motion`
   drops the crossfade duration to near-zero but keeps the polarity swap
   (state feedback stays, per Motion principle 4).
4. **Reading progress rail, chrome only.** A 2px fixed-position progress
   line at the very top of the viewport (outside `.mag`, part of `.arttools`)
   fills left-to-right with scroll position through the article body only
   (0% at `.maghead`, 100% at the end of `.magrefs`) — a wayfinding device
   common enough not to be a gimmick, justified here because Contents pieces
   run long (7+ minute reads per existing `min` field) and the product has no
   other persistent scroll cue. Colour: `--rule` (not `--accent`) at rest,
   because this is positional chrome, not a call to action.
5. **Topic pill selection in "By theme" mode scroll-highlights**, per §2.3 —
   the target section briefly (600ms, `--tw-slow`) gets a `--rule2` background
   wash that fades to transparent, marking "you asked to see this" without a
   scroll-jack or a permanent colour change.

Everything else — card entry on initial list paint, topic pill toggling, tab
switching — stays governed by the existing `--tw-fast` ceiling (≤150ms) per
DESIGN-SYSTEM Motion principle 1 ("generic card hover stays ≤150ms").

## 4. Responsiveness as an innovation

Beyond column collapse, the reading experience itself reshapes:

- **320–767px — single column, "one thing at a time."** List and reading
  pane are two states of one screen (as today), but the theme/date toggle and
  topic pills are the whole navigation surface; no table of contents rail is
  offered at this width (§6, ToC rail is desktop-only) — instead, the article
  header (`.maghead`) itself gains a collapsed **"On this page"** disclosure
  (`<details>`, native, no JS animation) listing the piece's `## ` headings as
  jump links, immediately above `.magbody`. This replaces the desktop rail
  with a reading-order-appropriate equivalent rather than hiding navigation
  entirely.
- **768–1023px — the reading pane gains a persistent right-hand margin
  column**, 20–25% of container width, that is *not* a ToC yet but carries
  the reading-time dial, the referenced music card, and (once scrolled past
  the lead paragraph) a condensed "jump to references" link — i.e. the
  margins become useful exactly at the width where they exist but are too
  narrow for a full ToC rail.
- **1024–1439px — full ToC rail appears** (§6), sticky, left of the reading
  measure, replacing the "On this page" `<details>` (same data, different
  chrome — implementer should share the heading-extraction logic between
  both).
- **1440–1919px — the innovation point: the ToC rail's job changes.** Instead
  of only jump-links, at this width the rail becomes a **live reading-position
  ruler**: the same list of `## ` headings, but the current section is marked
  by a filled tick and the rail shows the reader's remaining-time estimate
  recalculated from scroll position (using the existing `min` field's per-
  paragraph proportion) rather than the fixed original estimate — i.e. "6 min
  left" ticking down as they scroll, not just "7 min" fixed forever. This is
  the genuinely adaptive element the brief asks for: the *page itself*
  reports on the act of reading it, extending the "measurement is a form of
  seeing" thesis (BRAND-GUIDE §2) into the reading UI, not just the colour
  tool. Purely computed client-side from scroll fraction × `a.min`; no new
  data field.
- **≥1920px — reading measure stays capped at ~70ch (per existing rule) but
  the freed lateral space is given to the ToC rail growing wider (more
  breathing room per heading, larger tick targets) rather than to the text
  block** — matching DESIGN-SYSTEM's "increase padding, not column count"
  principle, applied specifically to the rail instead of the body.

## 5. Accessibility and reading ergonomics

- **Measure:** cap `.magbody` at 66–70ch (already a system-wide rule); do not
  let the "By theme" grouped-list headings or card titles inherit this cap —
  they may run full available width, only the running prose is measure-capped.
- **Font-size scaling:** the existing `artscale`/`A−`/`A+` control (0.8×–1.6×,
  persisted in `localStorage`) is correct and should be kept exactly as is —
  extend it with keyboard shortcuts (`Ctrl/Cmd + Plus/Minus` intercepted only
  while the reading pane is open, never globally) as a low-cost ergonomic
  add. Do not add a third increment control; two buttons plus browser zoom is
  sufficient.
- **Dark/light mode for long-form specifically:** reading-length exposure
  needs a softer contrast ceiling than a UI label — verify the `.magbody`
  text colour against its ground at the **body text size actually used**
  (not the token-test's generic pairing check) meets the *higher* WCAG 2.1
  threshold appropriate to sustained reading: prefer ≥7:1 (AAA-equivalent)
  for `.magbody` paragraph text specifically, not just the ≥4.5:1 floor
  `tests/tokens.test.ts` already enforces product-wide. This is a stricter
  bar for this one component, documented here so it doesn't get silently
  merged into the generic 4.5:1 gate. In dark ground, avoid pure `--ground`
  black behind large text blocks if it produces harsh edge-contrast at
  sustained reading — implementer should visually check for halation at
  1.4–1.6× scale before shipping (not just run the automated contrast test,
  which only checks the ratio, not perceived glare at large filled areas).
- **"Leitura facilitada" (dyslexia-friendly) mode:** keep the existing toggle
  and extend its effect to widen line-height (already likely does something —
  verify) and to **disable the pull-quote hover preview from §3.1** while
  active (an appearing/disappearing text fragment near the reading margin is
  exactly the kind of visual noise this mode exists to remove).
- **Voice reading (Web Speech):** already present and good — add one thing:
  visually indicate the currently-spoken paragraph is out of scope (Web
  Speech API gives no reliable boundary events across browsers) — instead,
  keep the existing simple play/pause/rate controls; do not attempt karaoke-
  style highlighting, it would violate the "never animate reading text" rule
  even if technically feasible.
- **Table of contents rail keyboard/AT behaviour** (§6): implemented as a
  `nav[aria-label="Table of contents"]` with a list of anchor links; current
  section indicated visually (filled tick, §4) must also be exposed via
  `aria-current="location"` on the corresponding link, updated on scroll via
  `IntersectionObserver` (not scroll-position math re-run on every scroll
  event) to avoid jank.

## 6. Concrete component list

New or materially changed components, with required states. Follows the
"full state specification" discipline from DESIGN-SYSTEM.md.

| Component | States |
|---|---|
| **Module tab strip** (Essays/Lexicon/Archive/Readings) | default · hover · `:focus-visible` (own ring) · active/current module · active+hover (distinct) · disabled/coming-soon (with caption) |
| **Theme/date toggle** (2-segment radiogroup) | default · hover per segment · `:focus-visible` · checked (theme) · checked (date) · disabled (n/a — always available) |
| **Topic section heading** (theme-mode grouping) | default · scroll-highlighted (transient wash, §3.5) |
| **Topic filter pill** (existing, behaviour changes by mode) | default · pressed/selected (`aria-pressed`) · hover · `:focus-visible` — no new visual state, but document the dual meaning (filter vs. scroll-to) so an engineer doesn't conflate them |
| **Featured/entry card** (one per module) | default · hover (pull-quote reveal, §3.1) · `:focus-visible` (permanent pull-quote reveal) · loading/empty (module not yet populated — see coming-soon tab, same caption pattern) |
| **Article list card** (restyled `.magcard`) | default · hover (pull-quote reveal + `--sh-2` lift, reuse home-card elevation token) · `:focus-visible` · active/pressed (reuse home-card `.08s` press pattern) |
| **Plate reference number** (`E·07` etc., replaces/extends nothing existing — new) | static, `aria-hidden="true"` (accessible name still comes from title text) |
| **Reading-time dial** (new, small SVG ring) | static on list cards · dynamic/ticking on the desktop ToC rail at ≥1440px (§4) — must not literally animate the fill on every scroll tick beyond a throttled recompute (~250ms), to respect "chrome may animate, but not distractingly" |
| **Table of contents rail** (new, desktop ≥1024px) | default · current-section tick filled · hover per link · `:focus-visible` per link · collapsed/absent below 1024px (replaced by "On this page" `<details>`, not just hidden) |
| **"On this page" disclosure** (new, mobile/tablet <1024px) | closed (default) · open · `:focus-visible` on summary |
| **Reading progress rail** (new, fixed top-of-viewport line) | 0–100% fill, no interactive states (not focusable, `aria-hidden="true"`) |
| **Ground-polarity module wrapper** (new — governs §1.1's inversion) | list-view polarity (inverted from ambient `data-ground`) · reading-pane polarity (matches ambient `data-ground`) — document as a single CSS custom-property flip at the Contents section root, not per-component overrides |
| **Right-margin utility column** (new, 768–1023px only) | populated (reading-time dial + music card + jump-to-refs link) · empty/collapsed below 768px |
| **Voice/read-aloud control** (existing, unchanged) | idle · playing · paused — no new states, keep as-is |
| **Font-size control (A−/A+)** (existing, unchanged) | at-minimum (0.8×, disable A− beyond) · at-maximum (1.6×, disable A+ beyond) — verify these disabled-at-bounds states exist; if not, add them (true `disabled`, not silent no-op, per DESIGN-SYSTEM's disabled principle) |
| **Dyslexia-friendly toggle** (existing, extend) | off · on (widened line-height, pull-quote preview suppressed, §5) |

## 7. Summary of what changes vs. today

- Default sort flips from chronological to by-theme (explicit toggle keeps
  chronological available) — the single biggest structural change.
- Four-module tab strip introduced above the list, with honest coming-soon
  states for modules not yet populated by the content agent.
- List chrome goes accent-free except one Purpur rule on the single featured
  card per module and the active tab underline.
- Ground polarity inverts between list view and reading pane, tying
  "enduring vs. dated" and "index vs. read" to the product's own Goethean
  figure-ground logic rather than an arbitrary skin choice.
- New reading-ergonomics surface: ToC rail (desktop) / on-this-page disclosure
  (mobile), reading progress rail, ticking remaining-time at ultra-wide,
  hover/focus pull-quote previews on cards — all chrome-only, per the
  "never animate long-form reading text" rule.
