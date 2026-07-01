# 03 — Mockup Notes · ENG-1409 Creative Optimization Simulation

**Tooling note:** Pencil was **unavailable** in this environment (no `pencil`/`pen` CLI, no Pencil MCP, no `.pen` support). Per the workflow this is the sanctioned trigger for the **wireframe fallback**. Mocks are low-fidelity HTML wireframes rendered headless (Playwright/Chromium) → PNG. Not brand-styled on purpose — this validates **layout & flow logic** before the PRD; brand tokens/components are applied in the build step under the design skill stack + design-review gate.

**Source:** `wireframe.html` (in this folder) · render script `shoot.js`
**Screens:** `screenshots/01-wireframe-configure.png`, `02-wireframe-running.png`, `03-wireframe-results.png`, `00-wireframe-all.png`

---

## Screen 1 — Configure (empty / first visit)
![Configure](screenshots/01-wireframe-configure.png)

- New **Optimize** tab in the campaign tab bar (after Bulk Test).
- Persistent isolation banner: "Simulation Mode — isolated from production… Simulated CTR only."
- Config grid: Topic, Audience, Geography, Vertical, Device/placement (optional), Simulation volume, Convergence sensitivity, Max rounds (safety cap), Brand/compliance guardrails.
- Primary **Run optimization** CTA + helper ("assign existing first, generate where thin").
- Empty results placeholder below.
- **Layout verdict:** clean, single-page top-to-bottom. Reuses existing selector patterns (vertical/audience already exist in `InputsPanel`).

## Screen 2 — Running (auto pipeline + rounds)
![Running](screenshots/02-wireframe-running.png)

- Run-id banner (`sim_run_…`).
- Horizontal **stepper**: Decompose → Assign/Generate → Simulate → Optimize (round N). Done steps checked, current step emphasized, round counter reflects the auto-converge model.
- Sub-line: volume, segment count, "round 2 of ≤5 · converges when uplift < +2%".
- Progress bar + read-only subtopic tree preview + Cancel run.
- **Layout verdict:** communicates the closed loop and iteration count at a glance. No broken layout.

## Screen 3 — Results (insights + segment table + drill sheet + approve)
![Results](screenshots/03-wireframe-results.png)

- Header: "Results" + **SIMULATED** label + run summary (rounds, converged) + Review-queue chip + Save snapshot / Export / Re-run.
- Summary stat cards (segments, variants tested, avg CTR uplift, best segment CTR).
- **Insights** callout (matches ticket's narrative summary).
- **Segment performance table** (Segment · Impr · Best variant · Sim CTR · Recommendation); **Low sample** amber badge on thin segments; row click opens drill.
- **Drill sheet** (right, shadcn Sheet): variant ranking (with Approved badge), before/after by iteration table, underperformer→generated-fix, recommendation, **Approve for use** (per-variant → review queue).
- **Layout verdict:** table-first with a drill sheet keeps context; all six ticket outputs are represented (insights, segment table, variant ranking, before/after, underperformers+fixes, recommendation). No broken layout.

---

## Loop-back check
Layout is **not broken** on any screen → proceed to PRD (no return to grill).

## Build-time deltas (apply during Step 5, not now)
- Replace grayscale wireframe boxes with shadcn/ui primitives + Tailwind tokens per `loudecho-brand` / component-library.
- Real Sheet, Table, Badge, Tabs, Card, Alert components (already in repo).
- Stub data layer shapes the six output structures; wire to typed mock per API contract (grill Q7).
