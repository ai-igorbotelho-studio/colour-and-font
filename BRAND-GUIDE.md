# Auge — Brand Guide (Short Form)

Produced by transition-brands-executive-creative-director, coordinated with transition-futures-head-of-foresight (editorial direction for Trends/Contents) and the digital product team's creative direction (UI/UX/responsive execution). Advisory document — no code was changed to write this guide.

## 1. Name

**Keep Auge.** German for "eye" (root of *Augenblick*, the instant of seeing) — it names the organ of perception, not the output, and resists the leaf/gradient clichés of colour-tool branding. The product's whole premise, Goethe's physiological colour theory, begins with the eye, not the pigment.

> Trademark screening (transition-brands-general-counsel / transition-brands-ip-counsel) is required before any filing — not yet done.

## 2. Positioning

Colour and type are usually chosen by taste and defended by neither theory nor evidence. Goethe argued colour is a phenomenon of the eye first, physics second — light meeting a seeing organism, not a wavelength on a chart. Auge rebuilds that argument as an instrument: six-hue geometry, OKLab math, measured contrast, ninety-three type families, so a designer's choice can be shown, not merely felt.

**Central idea: seeing is measurable, and measurement is a form of seeing.**

## 3. Colour system

Black and white are full colours in this product, never a neutral backdrop — the identity honours that invariant.

| Role | Name | Hex | Note |
|---|---|---|---|
| Anchor accent | Purpur | `#7A2545` | Goethe's *Steigerung* — the point where the warm and cold sides of the circle meet at their most active. Used sparingly: wordmark, one live UI accent. Never as a wash. |
| Counter-accent | Schwefelgelb | `#F2C230` | The positive pole's purest note. A full 180° from Purpur on the circle (harmonious pair) — never blended adjacent to it. |
| Full black | — | `#0E0E10` | Primary surface/type colour, not filler. |
| Full white | — | `#FAFAF7` | Warm, not clinical. Primary surface/type colour. |

Rule: the identity never uses more than Purpur + Schwefelgelb + Black + White together. Green (Goethe's union/rest hue) is deliberately withheld from the identity palette, kept meaningful inside the tool's own harmonious-pair demonstrations.

This identity palette is distinct from the app's existing UI tokens (`--rail-on`/`--accent` `#DE3D7D` etc. in `src/styles/tokens.css`) — reconciling the two is an open decision for the next design pass (see Design System file, §Open questions).

## 4. Typography

The product is a typography instrument — its own identity is a credibility test.

- **Display/wordmark:** Suisse Int'l, Bold, tight tracking, set lowercase ("auge"). Rigorously drawn, non-trendy grotesk — signals the same precision as the product's OKLab math. Avoid geometric-round faces (Futura-likes read as generic startup).
- **Text/editorial (Theory, long-form Trends):** Fraunces, variable optical-size axis. Carries a serif's argument-making authority without reading academic-dead; its optical-size behaviour is itself a small demonstration of "measured" type, echoing the product's own pairing engine.
- **Interface labels/UI:** Suisse Int'l, regular weights.

Both are open/licensable, not exclusive to one brand tool — deliberate, since the app champions ninety-three open families; the identity should not contradict that ethos with a closed proprietary face.

> The app's current UI faces (DM Serif Display / Mulish / Roboto Mono) stay as implementation typefaces unless/until the design system migration below is executed — see Design System file.

## 5. Voice principles

1. State the mechanism, not the feeling ("binary-search chroma reduction," not "beautifully balanced").
2. No brand-talk, ever — "marca"/"brand" is already banned in-product; extend the discipline to "brand experience," "brand story," "identity system" as marketing nouns.
3. Cite the theory before the tool ("Goethe treated black and white as full colours; Auge measures contrast on that basis").
4. British spelling, short sentences, no exclamation marks.
5. Portuguese is a full second voice, written natively — not a translation afterthought.
6. Claim a measured outcome, never an aesthetic one ("meets WCAG 2.1 on the real colours," not "a stunning palette").
7. Every editorial claim carries its distance — name the source and how far the signal has travelled (see §7).

## 6. Wordmark

Lowercase "auge" in Suisse Int'l Bold, tracked tight. A single small circular mark sits above the gap between "u" and "g": one 60°-arc segment of Goethe's six-hue wheel, rendered in Purpur, rotated to read as an iris-glint rather than a decorative dot. Appears only at ≥24px; below that, run type-only.

- **Clearspace:** the wordmark's cap-height on all sides.
- **Minimum size:** 72px wide (digital), 20mm (print).
- **Colour variants:** full black on white/cream · full white on black · Purpur-only on white for restrained applications.
- **Never:** the arc-mark in yellow alone (reserve yellow for interior UI accents only).

## 7. Applications across the product

- **Nav (Colour · Type · Create · Trends · Theory):** wordmark fixed left, arc-mark omitted at nav scale; active section underlined in Purpur only.
- **Colour / Type / Create:** identity stays invisible — user-generated palettes and pairings are the content; brand colour never competes with tool output.
- **Trends:** yellow counter-accent flags "declared approximation" labels and the new **horizon** labels (Faint · Emerging · Established · Receding — see editorial direction below), reinforcing the honesty invariant rather than decorating it.
- **Theory:** Fraunces at larger optical size for long-form Goethe exposition — the one place the serif shows its full character.
- **Favicon / social preview:** the arc-mark alone, Purpur on cream — a fragment of the wheel, not the full mark.

## 8. Editorial direction — Trends & Contents (Head of Foresight)

**Thesis:** Auge does not publish trends, it publishes *readings* — dated interpretations measured against a fixed instrument, in the register of weak-signal analysis, not colour-of-the-year forecasting.

**Trends** — keep quarterly cadence; each edition opens with a **Revisions** note revisiting the prior four editions. Rename axes for precision: **Colour** · **Letterform** · **Pairing** · **Surface**, and add a fifth, short **Counter-reading** axis (the case against the edition's own thesis). Add a **horizon** label per axis and per named colour:

- **Faint** (Tênue) — isolated, may not propagate
- **Emerging** (Emergente) — independently visible in ≥2 unrelated contexts
- **Established** (Assentado) — settled; the question is what replaces it
- **Receding** (Em recuo) — still widespread, losing conviction

Pair with the existing "declared approximation" hex disclosure. Require ≥2 independent sources for any axis labelled Emerging or above; add a one-sentence, ≤30-word "why now" line per axis, and a named cultural reference per trend colour.

**Contents** is the enduring layer (Contents explains why a reading is legible at all); **Trends** is the dated layer (what is currently observable). Four modules, no overlap: **Essays** (existing `articles.ts`), **Lexicon** (shared terms across Theory/Trends), **Archive** (full edition run, browsable by axis/horizon), **Readings** (annotated bibliography, candid about forecasting houses being market actors themselves).

Voice guardrails: no brand vocabulary, no superlatives/urgency ("game-changing," "everywhere in 2027" — banned), every claim carries its source and distance in-sentence, UK English throughout, PT a full equal-register translation.

Full data-model implications (new fields on `Axis`/`TrendColor`/`Edition`) are in the coordination notes handed to engineering; naming, pricing or any client-facing claim beyond editorial structure was explicitly left to escalate further.

## 9. UI/UX & responsive direction (digital product team creative direction)

Full detail in the Design System file. Headline decisions:

- Goethe's positive/negative logic becomes **figure-ground polarity** between sections (light-on-dark / dark-on-light swaps at section boundaries), not a gradient.
- Intensification becomes **type-scale and whitespace**, never a second decorative accent colour — one `--accent` on screen at a time.
- Motion narrates causality (a 180° hue flip crosses the wheel, it does not crossfade); `prefers-reduced-motion` keeps the state feedback, drops only the choreography.
- Responsive rules run 320px→1920px+ with a hard anti-horizontal-scroll rule and a capped reading measure (~70ch) even on ultra-wide.
- A seven-point pre-deploy gate (typecheck, vitest incl. contrast/i18n tests, `audit:viewports`, `audit:axe`, `audit:ref`, manual reduced-motion check, no hardcoded brand colour/font outside tokens) must pass before this identity ships.

## 10. Open items before implementation

1. Reconcile the identity's Purpur/Schwefelgelb palette against the app's current live `--accent` (`#DE3D7D`) and `--rail-on` tokens — one must yield, or the two need an explicit relationship.
2. Confirm typeface migration plan (Suisse Int'l / Fraunces) vs. keeping DM Serif Display / Mulish / Roboto Mono, given font-loading and licensing cost.
3. Trademark screening on "Auge" in the design-tools category.
4. Engineering follow-through on the Trends/Contents data-model changes (`horizon`, `whyNow`, `ref`, `contra`, `revisions` fields) — not yet implemented.

See `DESIGN-SYSTEM.md` for the token-level specification intended for Claude Design.
