# Auge — Design & UX + Interaction & Motion spec (EN mirror)

*English mirror of `docs/DESIGN-UX-SPEC.md`. Issued 22 September 2026. Spec first;
the Head approves before any change to `src/` or a build.*

This round is an **optimisation**, not a redesign. Measured baseline: Lighthouse
98–99, axe 0 critical/serious, 40/40 viewports 320–1920, contrast-gated tokens,
all motion disabled by `prefers-reduced-motion`, keyboard-accessible zoom. None
of that regresses.

## Spec documents (in `/design`)

| Doc | Role | Delivers |
|---|---|---|
| `00-vision-reference.md` | Experience + creative direction; reference bar; principles | Vision |
| `10-ux-architecture.md` | Flow, hierarchy, focus-on-navigate, one `h1` per page | UX |
| `20-visual-system.md` | Colour, **modular type scale**, spacing scale, states | UI |
| `30-tokens-components.md` | **Versioned tokens (v1.0.0)** + component contracts and owners | System |
| `40-responsive-grid.md` | Consolidate 11 breakpoints into 5 named, behaviour-preserving | Grid |
| `50-interaction-motion.md` | Which interactions serve content; prototype; reduced-motion + keyboard | Motion |

## The biggest wins

1. **Single type scale.** Today ~25 ad-hoc px sizes + ~20 unique `clamp()`s → 9
   modular `--fs-*` tokens. Consistent rhythm, less CSS.
2. **Single spacing scale.** Today only `--sp/--sp2` + repeated `clamp()` →
   `--space-1..-8`, with compat aliases so nothing breaks.
3. **Font drift resolved — decision (A):** adopt Bodoni Moda + IBM Plex Sans
   (`@font-face` + `preload`), drop the unused DM Serif/Mulish/Roboto trio and
   deps. Preserves today's look, fewer woff2 on first paint.
4. **Component states in one source.** Hover/focus currently duplicated across
   `flat.css` and `shell.css` → one owner per component.
5. **Motion tuned via tokens** (`--dur-*`/`--ease-*`); decorative effects
   (parallax/magnet) removed only if they cost INP (decision D-4).
6. **Navigation accessibility:** focus moves on page change; `aria-live` on
   generation; Tab-trap in the zoom dialog.
7. **Mockups get an explicit entry** from the Palette/Type tools (decision D-3).

## Gates — build approval criteria, per phase

| Phase | Gate | Criterion |
|---|---|---|
| Design & UX | audit-design | `audit:axe` 0 critical/serious · `audit:shots`/`diff` no undeclared pixel drift · `tokens.test.ts` green |
| Grid | qa-cross-browser | `audit:viewports` **40/40** · `audit:smoke` 0 JS errors |
| Interaction & Motion | audit-design + qa + system-performance | axe green · Lighthouse ≥98 mobile, LCP ≤2.5 s, CLS 0 · **INP** measured on drag; decorative effect that costs INP is cut |
| Fidelity (invariant) | — | `audit:ref`/`reference.json` 0 diffs · `i18n.test.ts` ("marca" absent) · `goethe`/`color` green |
| Weight | system-performance | brotli(html+js+css) ≤ 90 kB · 0 external requests on first paint |

## Proposed sequence (after approval)

1. Additive tokens v1.0.0 (type, space, motion) — no change to existing values.
2. Migrate `font-size`/spacing to tokens, page by page, `audit:shots` each step.
3. Resolve font drift — adopt Bodoni + IBM Plex (D-1/A).
4. Consolidate component states (one source per state).
5. Consolidate named breakpoints.
6. Motion prototype (`design/proto/motion.html`) → approval → integrate into `src/`.
7. Run all gates; issue an audit addendum in `docs/`.

Open decision D-2 (anti-regression test for the type scale) is confirmed at build
start; default is **Yes, with an allowlist**. See `DECISIONS.md`.
