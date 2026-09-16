# Auge — working notes for Claude

Single-page colour and typography instrument. Vite 5 + TypeScript (strict), no UI framework, ESM. Deployed to Cloudflare Pages from `claude/new-session-bailo2`; `dist/` is committed because the dashboard has no build command.

## Default working mode (to save credits)

- **Typecheck and build only** for a normal change: `npx tsc --noEmit` then `npx vite build`. Also run `npx vitest run` (fast, jsdom).
- **Do NOT run the browser audits or take screenshots by default.** The Playwright audits (`audit:smoke`, `audit:ref`, `audit:axe`, `audit:viewports`) and Lighthouse are slow and token-heavy. Run them only when the user asks, or once before a milestone that touches the wheel, palette generation, the pairing engine, or layout.
- Keep verification lean: trust `vitest` and the typecheck. Screenshot only when something is visual and likely wrong.
- When pointed at a file, edit it directly; skip broad exploration.

## Commands

```bash
npx tsc --noEmit          # typecheck (strict)
npx vitest run            # unit tests + options harness (jsdom)
npx vite build            # build to dist/ (committed)
npm run audit:smoke       # browser: all selects/options, 0 JS errors  (on request)
npm run audit:ref         # browser: compare vs reference.json snapshot (on request)
npm run audit:axe         # browser: a11y, 0 critical/serious          (on request)
npm run audit:viewports   # browser: 320–1920, no h-scroll, ≥40px tap  (on request)
```

Preview must be running for the audits: `npx vite preview --port 4173 --strictPort` (background), pages open at `/?test`.

## Invariants (never break — see PASSAGEM-CLAUDE-CODE.md §7)

- Six Goethe anchors with 180° opposites; OKLab interpolation with binary-search chroma reduction (never clip); three regimes.
- Black and white are full colours; contrast measured on the real colours (WCAG 2.1).
- Trends hex are declared approximations; the Criação/Create page makes no network calls.
- `tests/reference.json` snapshots the original's palette/pairing/proposal output. The reference harness runs against the original two-bank font pool via `setLegacyPool(true)` — keep that gate so adding families never breaks fidelity.
- The word "marca"/"brand" must not appear in the interface (`tests/i18n.test.ts` guards this).
- English (UK) is the primary language, Portuguese second. New UI/data strings need a PT source and an EN entry in `src/i18n/ui-en.ts` (and `data-en.ts` for data arrays).

## Layout

- `src/core/` colour, goethe, names, rng, state, store, dom, codes
- `src/data/` emotions, markets, schemes, lenses, cultures, music, fonts, lexicon, trends, articles, range
- `src/palette/` `src/type/` `src/create/` (brief, proposals, path), `src/trends/`, `src/mockups/`, `src/contents/`
- `src/i18n/` index, ui-en, data-en · `src/styles/` tokens, base, components, views, shell, flat, fluid, motion
- `src/theory.ts`, `src/editorial.ts`, `src/motion.ts`, `home.ts`, `nav.ts`, `main.ts`, `testing.ts`

Store per domain (`createStore` in `core/state.ts`); imports flow one way: `core → data → palette → type → nav → create/trends`.

## Agents

Headless engine for agents/subagents: `src/api.ts` (pure, deterministic, DOM-free) bundled to `agent/dist/auge.mjs`. Three routes — MCP stdio server (`agent/mcp-server.mjs`), CLI (`bin/auge.mjs`), ESM import. Catalogue published at `public/agent/manifest.json` + `public/llms.txt`. See `AGENTS.md`. Rebuild the bundle and manifest with `npm run build:agent` after touching `src/api.ts` or the data catalogue; `tests/api.test.ts` guards shapes and determinism.

## Git

Develop and push to `claude/new-session-bailo2`. Commit/push only when asked. `dist/` stays committed until the user sets `npm run build` in Cloudflare.
