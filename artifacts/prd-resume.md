# PRD Resume: ENG-1409 — Creative Optimization Simulation (Pencil arm)

## What

A new **Optimize** tab on simulated campaigns: a one-shot creative-optimization closed loop — decompose topic → segment → assign/generate variants → simulate CTR → auto-iterate weak variants until convergence → review, **bulk-approve**, and export. Additive, isolated frontend on top of the existing Simulation Mode.

## Why

Extends Simulation Mode from campaign QA into operator-controlled, segment-level creative confidence **before** launch — no production risk, no engineering support needed to run it.

## Acceptance Criteria

1. Optimize tab visible only on `isSimulated` campaigns, positioned after Bulk Test.
2. Configure captures topic/audience/geo/vertical/optional device·placement, volume, guardrails, convergence sensitivity, and max rounds (default 5); invalid targeting disables Run with a reason.
3. No eligible ads → Run disabled with "No eligible ads for this targeting"; no run minted.
4. Run mints a `simulation_run_id` and streams staged progress (Decompose · Source · Simulate · Optimize ×N) with a live round counter and Cancel run.
5. Loop stops on sub-threshold CTR uplift OR the hard max-5-rounds cap; terminal state records which.
6. Topic/subtopic tree is auto-generated and shown read-only; each subtopic is a segment.
7. Assign existing variants first; generate only where coverage is thin; show each variant's source (Existing/Generated) + target segment.
8. Results: pinned insights summary + segment performance table; segments <~1,000 simulated impressions carry an amber Low-sample badge.
9. Segment row click → right-side Sheet: variant ranking, two-column Before/After simulated CTR + delta chip, underperformer→generated-fix, recommendation.
10. **Bulk approve**: multi-select + "Approve selected" toolbar → Approved badge + Review-queue count; disabled at 0 selected; re-approve is a no-op; staging is within Simulation Mode only (never live).
11. Every CTR labeled "Simulated"; always-on isolation banner; `simulation_run_id` chip; no writes to production reporting/billing/pacing/optimization.
12. Save snapshot persists full iteration history (simulation-only) + Export CSV/JSON; reopened saved runs are read-only; all edge states from flows §4 handled.

## Approach

- New `OptimizeTab/` component tree mounted from `campaigns/[campaignId]/page.tsx`, appended to `campaignTabs` after `bulk-test`, gated on `isSimulated`.
- Single-page sectioned flow (Configure → Segments → Results → Optimize) reusing shadcn primitives (`Select`, `Input`, `Table`, `Badge`, `Sheet`, `Button`) and the `InputsPanel`/`StatusPanel`/`SimulatedGenerationsTable` register with LoudEcho tokens.
- One-shot pipeline + converge-or-cap logic and selection/approval state live in a `useOptimizationRun` hook; a single `runOptimization()` seam isolates the deferred (Q6) backend.
- Bulk-approve toolbar mirrors the Drafts tab's multi-select + Publish (N) pattern; segment-first results with a Sheet drill-down.
- Isolation baked in: `simulation_run_id`, SIM labels, amber banner, simulation-only snapshot persistence.

## Out of Scope

Real decomposition/generation/simulation engine (illustrative data; Q6 deferred to build); promoting variants to live campaigns; editable/pre-flight topic tree; cross-campaign optimization; non-CTR metrics; per-round metric charts.

## Contract Changes

**None to existing systems.** New **internal** TypeScript type module (`OptimizeTab/types.ts`) + `runOptimization()` seam only. CTR contract (`pixel_impressions` denominator) untouched — simulated CTR is a separate, labeled metric. No Firebase/Postgres schema changes; saved snapshots use the existing simulation-only run store. Blast radius: Level 1 (isolated frontend).
