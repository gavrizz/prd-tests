# ENG-1409 — Design review (step 6)

Reviewed against `dara-front` design language (tokens, shadcn primitives, campaign-detail IA) and the VP design skill stack (`loudecho-brand` → `loudecho-component-library` → `impeccable` → `frontend-design`).

## Design fidelity checklist

| Chrome element | Verdict | Note |
|----------------|---------|------|
| LOUDECHO sidebar (`Campaigns` active) | ✅ Match | Same order/labels/active pill as dara-front |
| Campaign header (title, flight dates, budget, sim badge) | ✅ Match | Mirrors `AdvertiserDetailHeader`/campaign header pattern |
| Underline `TabMenu` (Overview…Bulk Test, Optimize) | ✅ Match | Same underline/active token as dara-front `TabMenu`/`LineTabs` |
| `Optimize` tab entry | 🟦 Extension | Net-new tab; slots into existing tab strip |
| Amber isolation banner | ✅ Match | Same pattern as existing Simulation Mode banners |
| Configure card + fields | ✅ Match | shadcn `Card`, `Select`, `Input`, segmented controls |
| Convergence sensitivity segmented control | 🟦 Extension | Built from existing button/toggle tokens |
| Staged stepper + read-only subtopic tree | 🟦 Extension | New surface, existing Card + typography tokens |
| Results table | ✅ Match | shadcn `Table`, `Badge`, checkbox column |
| `SIM` / `GENERATED` / `Low sample` labels | 🟦 Extension | Badge tokens; safety-critical framing |
| Segment drill-down `Sheet` | ✅ Match | shadcn `Sheet` (right-anchored), same as dara-front |
| Bulk-approve toolbar | 🟦 Extension | Checkbox + button tokens |

Legend: ✅ Match (existing pattern) · 🟦 Extension (new surface built from existing tokens/components) · 🟥 Gap.

## Token compliance

- All colors resolve to dara-front CSS variables (no ad-hoc hex in chrome; amber banner uses the existing warning treatment).
- Radii, spacing, shadow, font-family inherited from copied `tailwind.config.js` + `globals.css`.
- shadcn primitives use the exact `cn` class registrations from dara-front.

## Ratings (1–5)

| Dimension | Score |
|-----------|:-----:|
| Token fidelity | 5 |
| Component reuse (`Table`, `Sheet`, `TabMenu`) | 5 |
| IA fit (extends campaign detail) | 5 |
| Interaction fidelity (converge-or-cap loop) | 5 |
| Simulation safety framing | 5 |

## Gaps / follow-ups for dev integration

- Wire `runOptimization` to the real offline simulation service (must stay off the live-bidder path).
- Persist snapshots (`Save snapshot`) and export server-side.
- Real eligible-ad counts + variant sourcing (prototype uses seeded fixtures).
