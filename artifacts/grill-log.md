# 01 — Grill Log · ENG-1409 Creative Optimization Simulation

**Repo:** dara-front (merges to `staging`)
**Branch:** `gavriel/ENG-1409-creative-optimization-simulation`
**Linear:** https://linear.app/teza/issue/ENG-1409/test-creative-optimization-simulation
**Mode:** Senior product designer · grill-before-build · one question at a time

---

## Starting context (from Linear ticket, NOT a locked PRD)

MVP that extends the existing **Simulation Mode** (campaign QA) into an operator-controlled
**creative optimization** closed loop:
- Operator picks campaign + targeting dims (topic, audience, geo, vertical, optional device/placement) + volume + guardrails
- System simulates synthetic traffic, decomposes broad topics → subtopics (topic tree)
- Per segment: assign existing variants OR generate new ones
- Evaluate on **simulated CTR** → rank best/worst, low-sample warnings
- Optimization loop: rewrite weak variants from strong-variant patterns, re-test next iteration
- Output: segment table, variant ranking, before/after CTR, underperformers + generated fixes, per-segment recommendations, insights summary, exportable snapshot
- Requirements: `simulation_run_id`, variants tagged simulation-only, CTR labeled simulated, explicit operator approval to promote a variant, hard isolation from prod reporting/billing/pacing, full iteration history preserved

## Existing code grounding (read before grilling)

- `src/components/SimulationMode/` — InputsPanel (impressions/24h, vertical, audience, budget+CPM), StatusPanel, SimulationHistory, SimulationModeCard, useSimulationConfig
- `src/lib/firestore/simulationConfig.ts`, `simulationRuns.ts` — config + run persistence (Firestore)
- `src/app/api/campaigns/[id]/simulate-now/route.ts`, `simulated-generations/route.ts` — fast fan-out + generations table
- `src/components/campaigns/SimulatedGenerationsTable.tsx` — existing per-generation results table
- Simulation already produces simulated CTR + isolated `simulated_*` data. **This feature layers segmentation + variant optimization + reporting on top.**

---

## Decisions Log

_(locked answers captured below as grilling proceeds)_

| # | Question | Decision | Status |
|---|----------|----------|--------|
| 1 | Scope of this case-study run | **ALL pieces** — full closed-loop operator UI (config → segmentation → generation → results → optimize/promote). Not a single slice. | LOCKED |
| 2 | Surface / entry point | **New "Optimize" campaign tab** — single-page sectioned flow (Configure → Segments → Results → Optimize). Shown on simulated campaigns. | LOCKED |

| 3 | Run / interaction model | **One-shot**: configure → Run → system auto decompose+generate+simulate+optimize; operator watches progress, then reviews results. | LOCKED |
| 4 | Optimization loop stop | **Auto-converge**: iterate until per-round CTR uplift < threshold. + hard safety cap on max rounds (default 5) to prevent runaway (agentic-discipline). | LOCKED |
| 5 | Topic decomposition control | **Auto during run, read-only tree** shown in results. No pre-flight editing. | LOCKED |
| 6 | Variant source per segment | **Assign existing eligible variants first; generate new only where coverage is thin.** | LOCKED |
| 7 | Backend for this build | **Typed mock/stub data layer + documented API contract.** Real LLM/sim backend wired later. Keeps build in dara-front, isolated. | LOCKED |
| 8 | Variant promotion/approval | **Per-variant "Approve for use"** in results; approved variants get a badge + enter a review queue. | LOCKED |
| 9 | Results presentation | *(skipped by operator)* DEFAULT ADOPTED: **segment-drill** — lead with segment performance table, click a segment to drill into its variants / ranking / before-after / recommendation; insights summary pinned on top. | DEFAULT |

## Defaults adopted for unanswered items (reasonable, reversible)

- **Config inputs:** campaign (from tab context) + targeting dims (topic, audience, geography, vertical, optional device/placement) + simulation volume + brand/compliance guardrails + convergence sensitivity. Reuse existing InputsPanel patterns (vertical/audience selectors already exist).
- **Export / snapshot:** "Save snapshot" persists the run to run history (Firestore, simulation-only) preserving full iteration history; "Export" downloads CSV/JSON of the results.
- **Low-sample handling:** confidence / low-sample warning badge when a segment's simulated impressions fall below a threshold (default 1,000).
- **Isolation (hard requirement):** every run has a `simulation_run_id`; all generated variants tagged simulation-only; simulated CTR always labeled "Simulated"; zero leakage into prod reporting/billing/pacing/live-optimization; full iteration history preserved for saved runs.
- **Progress UX:** one-shot run streams stage progress (Decompose → Generate/Assign → Simulate → Optimize round N) with a live status/stepper; results render on completion.

_(Grill format note: switched to inline multiple-choice questions per operator request. Operator skipped Q9 → adopted recommended default and proceeded.)_

---

## Blast-radius / discipline note (agentic-discipline)

- **Impacted layer:** Frontend / reporting only (new isolated campaign tab + stub data layer).
- **Blast radius:** Level 1 — Isolated. No contract change to existing schema/API/joins; stub data layer, no prod reads/writes.
- **Invariants preserved:** simulation data isolation; simulated CTR labeling; no prod leakage. CTR contract (pixel_impressions denominator) not touched — simulated CTR is its own labeled metric.
- **Rollback:** feature is a new tab gated on simulated campaigns; remove tab entry to revert. Backward compatible.
- **Risk level:** Low.

---

## Transcript

### Q1 — Scope boundary
**Asked:** Grill just the Results/Optimization report slice, or a different piece?
**Answer:** "all" — build the entire closed-loop workflow. Grilling proceeds depth-first, one piece at a time, but nothing is deferred by scope.

### Q2 — (pending answer) Surface & entry point / IA
