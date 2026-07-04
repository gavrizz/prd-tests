# ENG-1409 — PRD resume + merge notes

## Problem
Operators can't see which creative angle wins for each slice of an audience before spending, and have no safe way to let the system auto-iterate weak segments. Live experimentation risks real budget.

## Appetite
One slice: a new **Optimize** tab on campaign detail that runs a **simulation** (never the live bidder) — configure → staged optimize loop → results → approve winners.

## Solution (what the slice proves)
1. **Configure** a run: decompose a topic into segments; set audience/geo/vertical/device, simulation volume, convergence sensitivity, max-round hard cap.
2. **Staged run loop:** Decompose → Source → Simulate → Optimize, round-by-round, replacing underperformers, **stopping on convergence or the round cap**.
3. **Results:** pinned insight (blended CTR uplift) + per-segment table (best variant, simulated CTR, recommendation) with low-sample warnings.
4. **Drill-in + approve:** segment `Sheet` (variant ranking, before/after CTR) and bulk-approve winners into a review queue.
5. **Safety:** persistent isolation banner + `SIM` labels — visibly never live data.

## Merge notes — pulling this slice into dara-front
- **IA:** add an `Optimize` entry to the campaign-detail `TabMenu`; render `OptimizeTab` for it.
- **Components to reuse from dara-front:** `Table`, `Sheet`, `Select`, `Card`, `Badge`, `TabMenu`, and the existing Simulation Mode banner treatment (this feature is adjacent to `SimulationMode/`).
- **Backend wiring:** replace `engine.ts` `runOptimization` with the real **offline simulation service** — decomposition, sourcing, CTR estimation, round iteration. **Hard constraint:** no writes to bidder/billing/pacing/reporting; keep it off the live path.
- **State:** `useOptimizationRun` is transport-agnostic; only `engine.ts` changes at integration.
- **Auth:** production uses existing `withAuth`; the dev bypass (`AUTH-BYPASS.md`) is local-only and must not ship enabled.

## Non-goals (now)
- Any live-bidder / real-spend path.
- Cross-campaign optimization; automatic application of winners without approval.
- Real variant generation (uses fixtures for the slice).

## Success metric
Operator can run a simulated optimization on a campaign, see per-segment winners with uplift, and queue winners for approval — with zero risk to live systems.

## Open question
Convergence-threshold mapping per sensitivity level — tune against real simulated data in dev integration.
