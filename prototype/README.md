# ENG-1409 prototype — Creative Optimization Simulation

Runnable interactive slice. Vite + React + TypeScript + Tailwind, using **dara-front tokens and shadcn primitives** so it reads as a native campaign-detail surface. The optimization pipeline is a deterministic client-side **simulation engine** — no backend, and by design never a live-bidder path.

## Run

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # type-check + production build
```

## In scope (this slice)

- **Optimize tab** on the campaign detail shell (sidebar + campaign header + underline `TabMenu`).
- **Configure** — topic decomposition, audience/geo/vertical/device, simulation volume (`Direct` | `Budget + CPM`), convergence sensitivity, max-rounds hard cap.
- **Staged run loop** — Decompose → Source → Simulate → Optimize, `round N / M`, converge-or-cap, read-only subtopic tree, cancel.
- **Results** — pinned insights (blended CTR uplift), per-segment table with best variant / simulated CTR / recommendation, `Low sample` warnings, export, save snapshot.
- **Segment Sheet** — variant ranking, before/after CTR, recommendation.
- **Bulk approve** — select segments → approve into a review queue.
- **Simulation safety** — persistent amber isolation banner + `SIM` labels on every metric.

## Out of scope (not built, not stubbed)

- Every other campaign tab (Overview, Settings, Ads, Drafts, Safety, Insights, Bulk Test) — shown in the tab strip but inert.
- The rest of dara-front (Reports, Moderation, Conductor, Advertisers, …).
- Real Firebase / auth / persistence; real bidder, billing, pacing, reporting (explicitly never touched).
- Real variant generation (uses seeded segment/variant fixtures).

## Architecture

```
src/
  components/
    shell/        AppShell, Sidebar, TabMenu   ← dara-front chrome
    ui/           badge, button, card, checkbox, input, label,
                  select, sheet, table, tabs    ← shadcn primitives (dara-front cn registrations)
  features/optimize/
    types.ts             RunConfig, Segment, Variant, OptimizeResult, RunProgress, ...
    data.ts              SEGMENT_SEEDS, DEFAULT_CONFIG_OPTIONS  (fixtures)
    engine.ts            runOptimization()  ← BACKEND SEAM (staged, converge-or-cap)
    useOptimizationRun.ts  lifecycle state machine (idle → running → complete → saved)
    IsolationBanner / ConfigureSection / RunPanel /
    ResultsSection / SegmentSheet / OptimizeTab
  App.tsx         campaign shell + Optimize tab
```

## Backend seam → dara-front / bidder mapping

`engine.ts` is the single integration point. It simulates the pipeline entirely client-side and must remain isolated from live systems.

| Engine phase | Real system at integration | Note |
|--------------|----------------------------|------|
| Decompose | topic → segment decomposition service | returns subtopic tree |
| Source | eligible-ad / variant sourcing | existing + generated candidates |
| Simulate | offline CTR estimator / simulation service | **never** the live bidder |
| Optimize (rounds) | iterate weak segments, replace underperformers | convergence threshold from sensitivity; hard round cap |

At integration, `runOptimization` calls a backend simulation service; `useOptimizationRun` and all UI stay unchanged. The isolation banner + `SIM` labels are a hard requirement, not decoration.
