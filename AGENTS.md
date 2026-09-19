# Using Auge from an agent

Auge is a colour and typography instrument: palettes derived from Goethe's
wheel, type pairing across ~130 free families, and three-proposal briefs.
The engine is a set of **pure, deterministic, offline** functions — no DOM, no
network. The same input with the same `seed` always returns the same output.

This makes it directly usable by Claude agents and subagents. There are three
equivalent routes into the same engine.

## 1. MCP server (recommended in Claude)

A dependency-free MCP server over stdio exposes the engine as tools.

Claude Code:

```bash
claude mcp add auge -- node /absolute/path/to/auge/agent/mcp-server.mjs
```

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "auge": { "command": "node", "args": ["/absolute/path/to/auge/agent/mcp-server.mjs"] }
  }
}
```

Then Claude can call the tools by prompt. Tools:

| Tool | Purpose |
|---|---|
| `auge_list_options` | Every valid value for a brief (call first). |
| `auge_palette` | A palette from a brief. |
| `auge_palette_from_colours` | Map extracted hex colours onto the wheel. |
| `auge_pairing` | A type pairing / set, with full filters. |
| `auge_proposals` | Three complete proposals (palette + type + reasoning). |

## 2. CLI

```bash
node bin/auge.mjs options
node bin/auge.mjs palette '{"intention":"Grief and farewell","scheme":"Analogous","n":5,"seed":0.2}'
node bin/auge.mjs pairing '{"strategy":"contraste","families":2,"seed":0.3}'
node bin/auge.mjs proposals '{"intention":"Joy and clarity","culture":"Japan","seed":0.7}'
echo '{"hexes":["#DE3D7D","#00000E","#D4E7FA"]}' | node bin/auge.mjs colours
```

Every command prints JSON. Add `"lang":"pt"` for Portuguese labels.

## 3. ESM import

```js
import * as auge from './agent/dist/auge.mjs';
auge.init('en');
const p = auge.palette({ intention: 'Reverence and the sacred', range: 'disruptivo', seed: 0.4 });
```

## Building a valid brief

Call `auge_list_options` (or `node bin/auge.mjs options`) once. It returns, with
indices and labels, every: **intention** (what the piece must evoke), **field**,
geometric **scheme**, studio **lens**, **culture** (reference), **music**
(dynamic), **range** (`conservador` · `normal` · `inovador` · `disruptivo`),
font **bank**, font **class**, pairing **strategy**, and the three **readings**.

Any field accepts an index (number), a slug, or a name — matching is
case-insensitive and by prefix, so `"scheme":"Complementary"` and
`"scheme":2` both work. Every field is optional; omit to leave it neutral.

The catalogue is also published as a static file for discovery:
`https://colour-and-font.pages.dev/agent/manifest.json` (and `/llms.txt`).

## Output

Each colour comes as `{ hex, name, rgb, hsl, cmyk, oklch, areaPct, goethe }`.
Each family as `{ name, bank, class, page, weights, note }`. Pass
`"markdown": true` to `auge_palette` to also get a ready Markdown block.

## Invariants (never violated)

Six Goethe anchors with 180° opposites; OKLab interpolation with binary-search
chroma reduction (never clipped); black and white are full colours; contrast on
the real colours (WCAG 2.1); no network calls; deterministic given a seed.

## Ready prompts for Claude

- "Using the auge tools, list the options, then generate a 5-colour palette for
  a bereavement service — intention grief and farewell, conservative range — and
  a matching serif/sans pairing. Return the hex values and font names."
- "With auge, give me three proposals for a Japanese tea house (culture Japan,
  intention silence and contemplation) and explain each reading."
- "I sampled these colours from a photo: #2E4E9E #F2C14E #7A1E2B. Use
  auge_palette_from_colours to place them on the wheel and name them."
