# PRD Resume: ENG-1409 — Creative Optimization Simulation

## What

A new **"Optimize"** tab on simulated campaigns that runs a one-shot creative-optimization closed loop: decompose topic → segment → assign/generate variants → simulate CTR → auto-iterate weak variants until CTR converges → review, approve, and export.

## Why

Extends Simulation Mode from campaign QA into an operator-controlled workflow that finds and improves the best creative per traffic segment **before** launch — no engineering support needed, no production risk.

## Acceptance Criteria

1. Optimize tab visible only on `isSimulated` campaigns.
2. Configure captures targeting dims, volume, guardrails, convergence sensitivity, max-rounds cap; invalid config disables Run with a reason.
3. Run streams staged progress (Decompose → Assign/Generate → Simulate → Optimize round N) and mints a `simulation_run_id`.
4. Loop stops on CTR-uplift convergence OR max-rounds cap.
5. Read-only subtopic tree; each subtopic = a segment.
6. Variants: assign existing first, generate where coverage is thin; source shown per variant.
7. Results: pinned insights + segment table (segment · impressions · best variant · sim CTR · recommendation) + Low-sample badge.
8. Segment click → drill sheet: variant ranking, before/after CTR by iteration, underperformer→fix, recommended variant.
9. Per-variant "Approve for use" → Approved badge + Review-queue count.
10. Save snapshot (with full iteration history) + Export CSV/JSON.
11. Every metric labeled "Simulated"; isolation banner; no writes to production reporting/billing/pacing.
12. Empty / running / low-sample / no-improvement / error / read-only / no-ads / no-permission states handled.

## Approach

- New `OptimizeTab` component set in `dara-front` (Configure → Progress → Results → drill Sheet), wired into the campaign tab bar behind `isSimulated`.
- All pipeline data from a **typed mock/stub layer** behind a documented `runOptimization()` contract; real LLM/sim backend is a later ticket.
- Snapshots persist to a **simulation-only** store (new Firestore collection) — zero production leakage.
- Reuses existing shadcn/ui primitives + Simulation Mode patterns; auto-converge with a hard max-rounds safety cap.

## Out of Scope

- Real decomposition/generation/simulation backend, promoting variants to live campaigns, non-CTR metrics, editable subtopic tree, cross-campaign optimization.

## Contract Changes

**None to existing systems.** Only a new internal, additive TypeScript contract in `OptimizeTab/types.ts` + a `runOptimization()` seam for the future backend. CTR contract (pixel_impressions) untouched — simulated CTR is its own labeled metric.
