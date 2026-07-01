# 01 — Grill Log · ENG-1409 Creative Optimization Simulation (Pencil arm)

**Repo:** dara-front (merges to `staging`)
**Branch:** `gavriel/ENG-1409-creative-optimization-simulation-pencil`
**Linear:** https://linear.app/teza/issue/ENG-1409/test-creative-optimization-simulation
**Mode:** Senior product designer · grill-before-build · one question at a time
**Arm:** Pencil-MCP variant — **fresh grill session**, independent of `ENG1409-Control`. Mockups produced in Pencil (not HTML wireframes).

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

- `src/components/SimulationMode/` — InputsPanel, StatusPanel, SimulationHistory, SimulationModeCard, useSimulationConfig
- `src/lib/firestore/simulationConfig.ts`, `simulationRuns.ts` — config + run persistence (Firestore)
- `src/app/api/campaigns/[id]/simulate-now/route.ts`, `simulated-generations/route.ts` — fast fan-out + generations table
- `src/components/campaigns/SimulatedGenerationsTable.tsx` — existing per-generation results table
- Campaign tab shell: `src/app/campaigns/[campaignId]/page.tsx` (`campaignTabs`, `isSimulated` gating)

---

## Decisions Log

_(locked answers captured below as grilling proceeds — this is a fresh session; answers may differ from the control arm)_

| # | Question | Decision | Status |
|---|----------|----------|--------|
| 1 | Scope of this MVP grill | **Full closed loop** — whole operator UI from Configure → segments/variants → simulate → optimize/converge → review/approve/export. | LOCKED |
| 2 | Surface / entry point | **New "Optimize" campaign tab** — simulated campaigns only, after "Bulk Test"; single-page sectioned flow (Configure → Segments → Results → Optimize). Slots into real `campaignTabs` + `isSimulated` gating. | LOCKED |
| 3 | Run / interaction model | **One-shot auto pipeline** — configure → Run → system auto-runs decompose+assign/generate+simulate+optimize, streaming staged progress; operator watches, then reviews. | LOCKED |
| 4 | Optimization loop stop | **Auto-converge** (stop when per-round CTR uplift < threshold) **+ hard max-rounds cap (default 5)** — prevents runaway loops (agentic-discipline). | LOCKED |
| 5 | Variant source per segment | **Assign existing eligible variants first; generate new only where coverage is thin; tag each variant's source (Existing/Generated) + target segment.** | LOCKED |
| 6 | Backend (real vs stub) | **DEFERRED — decide at build.** This is a build-implementation decision, not an MVP-shape or mockup decision. The Pencil mock uses illustrative data; whether to wire a real engine is decided after mock + PRD review. | DEFERRED |
| 7 | Results layout | **Segment-first with drill-down** — insights summary pinned on top + segment performance table; click a segment row → side panel (Sheet) with variant ranking, before/after CTR, underperformer + generated fix, recommendation. | LOCKED |
| 8 | Promotion / approval | **Bulk approve** — multi-select variants + toolbar "Approve selected" → Approved badge + Review-queue count. *(Divergence from control arm's per-variant approve.)* | LOCKED |

---

## Adopted defaults (predictable from ticket; reversible — decide in build)

- **Problem:** operators can't predict how creative variants perform across traffic segments *before* launch → weak segments waste spend.
- **Target user (sharp):** internal **campaign operator** prepping a simulated campaign who wants segment-level creative confidence before going live.
- **Success metric (MVP, measurable):** operator completes a full optimization run **unassisted** and approves ≥1 improved variant; every major segment receives ≥1 relevant variant. Zero simulated data leaks to prod.
- **Edge/empty states for MVP mock:** (1) tab hidden on non-simulated campaigns; (2) empty first-visit (no run yet) → Configure + Run CTA; (3) **low-sample amber badge** on segments < ~1,000 simulated impressions; (4) Run disabled with reason when no eligible ads.
- **Isolation (hard requirement):** every run has a `simulation_run_id`; variants tagged simulation-only; simulated CTR always labeled "Simulated"; isolation banner; zero prod reporting/billing/pacing leakage; full iteration history preserved for saved runs.
- **Topic decomposition:** auto during run, shown **read-only** in results (no pre-flight tree editing in MVP).
- **Save/export:** "Save snapshot" persists full iteration history (simulation-only); "Export" downloads CSV/JSON.

## Non-goals (explicitly NOT building now)

1. Real topic-decomposition / variant-generation / traffic-simulation **engine** (illustrative data for the prototype; wire real engine later).
2. Promoting approved variants to **live** campaigns (approval stages them within Simulation Mode only).
3. **Editable / pre-flight** topic tree (tree is auto + read-only).
4. **Cross-campaign** optimization.
5. Non-CTR metrics (CVR, ROAS, viewability) — simulated CTR is the sole MVP metric.

---

## Blast-radius / discipline note (agentic-discipline)

- **Impacted layer:** Frontend / reporting only (new isolated campaign tab; illustrative data for prototype).
- **Blast radius:** Level 1 — Isolated. No contract change to existing schema/API/joins.
- **Invariants preserved:** simulation isolation; simulated-CTR labeling; no prod leakage. CTR contract (`pixel_impressions` denominator) untouched — simulated CTR is its own labeled metric.
- **Rollback:** new tab gated on `isSimulated`; remove tab entry to revert. Backward compatible.
- **Risk level:** Low.

---

## Grill Session Summary

**Decisions locked (Q1–Q8, Q6 deferred):** full closed-loop scope · new Optimize tab (simulated only, after Bulk Test) · one-shot auto pipeline · auto-converge + max-5-rounds cap · assign-existing-first then generate · segment-first results with Sheet drill-down · bulk approve.

**Deferred to build:** real vs stub backend (Q6); exact convergence + low-sample thresholds (tunable).

**Open questions (≤1 blocking):** none blocking. Soft: confirm bulk-approve vs per-variant once mocked (visible in Pencil).

**Re-grill trigger (what would invalidate this):** if the backend can't return per-segment/per-variant simulated CTR, or if operators need to *edit* the topic tree pre-run, or if approval must push to live campaigns — any of these changes the surface and requires re-grilling scope + results.

---

## Transcript

### Q1 — Scope boundary
**Asked:** Full closed loop, a single Results slice, or Configure+run only?
**Answer (A):** Full closed loop. The feature *is* the loop; a partial spec would be incoherent. Build safety comes from a stubbed backend, not from cutting the loop.

### Q2 — Surface / entry point
**Asked:** New Optimize tab, extend Bulk Test, or dedicated route?
**Answer (A):** New "Optimize" tab, simulated campaigns only, after Bulk Test; single-page sectioned flow.

### Q3 — Run / interaction model
**Asked:** One-shot auto, step-by-step wizard, or hybrid pause-before-optimize?
**Answer (A):** One-shot auto pipeline with streamed staged progress.

### Q4 — Optimization loop stop
**Asked:** Auto-converge+cap, fixed N rounds, or single pass?
**Answer (A):** Auto-converge (CTR uplift < threshold) + hard max-5-rounds cap.

### Q5 — Variant source per segment
**Asked:** Assign-existing-first, always-generate, or operator-choice?
**Answer (A):** Assign existing first; generate to fill gaps; tag each variant's source + segment.

### Q6 — Backend (real vs stub)
**Asked (mis-timed):** stub vs real vs reuse-simulate.
**Outcome:** Operator flagged this as a build decision, not a grill/mock decision. **Deferred** — prototype uses illustrative data; decide after mock + PRD.

### Q7 — Results layout
**Asked:** Segment-first drill-down, flat stacked tables, or variant-first?
**Answer (A):** Segment-first — insights + segment table; row click → Sheet with variant detail/before-after/fix/recommendation.

### Q8 — Promotion / approval
**Asked:** Per-variant approve, bulk approve, or auto-promote+veto?
**Answer (B):** **Bulk approve** — multi-select + toolbar "Approve selected" → Approved badge + Review-queue count. *(Diverges from control arm.)*
