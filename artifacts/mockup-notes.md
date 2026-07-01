# 03 — Mockup Notes · ENG-1410

**Repo:** echo-studio · **Branch:** `gavri/ENG-1410-creative-library`
**Tool used:** HTML wireframes → headless Chromium PNGs (Pencil unavailable in this env — sanctioned wireframe fallback, chosen by operator).
**Fidelity:** Low-fi wireframe (grayscale, structure-only). Not production visuals — the goal is to validate **layout & flow** before the PRD, per grill-before-build.

## Source files
- `mocks/wf.css` — shared wireframe styles
- `mocks/01-gallery.html` → `screenshots/01-gallery.png`
- `mocks/02-workspace.html` → `screenshots/02-concept-workspace.png`
- `mocks/03-states.html` → `screenshots/03-key-states.png`

Re-render any screen: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --force-device-scale-factor=2 --window-size=1440,900 --screenshot=out.png file://<abs>/mocks/<file>.html`

---

## Screen 1 — Creative Library (Gallery)
![Gallery](screenshots/01-gallery.png)

**Validates:** D3 (SeedProvider data + "Foreplay adapter available, off" caption), D4 (new **Library** primary nav item), D8 (per-card ＋Save / ✕Hide), interaction 4.1/4.2 (card grid + left facet sidebar + keyword search, URL-param filters).

**Layout decisions locked by the mock:**
- Left facet sidebar (Quick views: All/Saved/Hidden; Vertical; Platform; Format; Creative angle) + top keyword search + Filters/Sort controls.
- 4-up responsive card grid. Card = thumbnail (with format/platform badges), brand, one-line concept summary, metadata tags (vertical/lang/CTA), hover ＋/✕ actions.
- Result count + provider provenance line under the H1.

## Screen 2 — Concept Workspace
![Concept Workspace](screenshots/02-concept-workspace.png)

**Validates:** D2/D4 (dedicated route, reuse existing ChatPane on the right), D5 (targeting active brand "Deel" shown in header + brief label), D6 (auto-adapted v1 brief), D9 (persistent **Generate Variants** CTA), interaction 4.3/4.4/4.5.

**Layout decisions locked by the mock:**
- Two-pane: **left** = reference creative (media + source metadata) stacked above the brand-adapted brief (Hook, Core message, Visual direction, Recommended layout, CTA, Copy blocks, Rationale); **right** = existing chat rail with quick-action chips (Tone, Audience, Visual style, Offer, CTA, Format, Compliance).
- Header: ← Library · title · ↻ Re-adapt · **Generate Variants →** (primary).
- Brief carries a "v1 · adapted from <source>" tag (lineage), but **no version rail** (D7 — version history deferred).

## Screen 3 — Key states
![Key states](screenshots/03-key-states.png)

**Validates:** D5 (no active brand → block workspace with inline brand picker), D6 (auto-run adaptation loading skeleton, chat disabled until ready), gallery empty-results + provider fetch-error (with offline saved-concepts fallback + Retry).

---

## Layout gate verdict
**PASS.** Both primary screens and all key states render coherently at 1440-wide. No broken layout → no loop back to grill. Proceed to PRD.

Nits (non-blocking, defer to build): faint watermark overlaps the chat Send row on the workspace shot; annotation labels are wireframe-only and won't ship.

---

## ASCII fallback sketch (quick reference)

Gallery:
```
+---------------------------------------------------------------+
| LOUDECHO  [Studio][Review][*Library*][Campaigns][BrandDNA] (Deel v) (gear) |
+----------+----------------------------------------------------+
| Filters  | Creative Library    SeedProvider·Foreplay(off)·34  |
| [x]All   | [ search........... ] [Filters(3)v] [Sort v]       |
| [ ]Saved | +------+ +------+ +------+ +------+                 |
| [ ]Hidden| |thumb | |thumb | |thumb | |thumb |  <- ＋Save ✕Hide|
| Vertical | |brand | |brand | |brand | |brand |                 |
| [x]SaaS  | |summ  | |summ  | |summ  | |summ  |                 |
| Platform | +------+ +------+ +------+ +------+                 |
| Format   | (4-up grid, paginates)                             |
+----------+----------------------------------------------------+
```

Concept Workspace:
```
+---------------------------------------------------------------+
| [<Library] Concept Workspace     [↻Re-adapt] [Generate Variants→] |
+-----------------------------------+---------------------------+
| REFERENCE (media + source meta)   | 💬 Refine concept          |
| [img] Ramp·Meta·9:16 Hook/Angle.. | ai: adapted to Deel...     |
|-----------------------------------| user: more premium tone    |
| ADAPTED CONCEPT → Deel      v1     | ai: updated brief...       |
|  Hook / Core msg / Visual dir /   | [Tone][CTA][Format]...     |
|  Layout / CTA / Copy / Rationale  | [ ask to tweak... ][Send]  |
+-----------------------------------+---------------------------+
```
