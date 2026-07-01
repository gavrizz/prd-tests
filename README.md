# Case Study · ENG-1409 — Creative Optimization Simulation (Pencil arm)

| Field | Value |
|-------|-------|
| **Linear ticket** | [ENG-1409](https://linear.app/teza/issue/ENG-1409) — Creative Optimization Simulation |
| **Target repo** | dara-front (admin dashboard; merges to `staging`) |
| **Source branch** | `gavriel/ENG-1409-creative-optimization-simulation-pencil` |
| **Experiment branch** | `ENG1409-Pencil` |
| **Workflow** | Grill-before-build (Pencil arm — **fresh, independent grill**) |
| **Mockup tool** | **Paper** (Paper MCP / Desktop) — operator override of the arm's original Pencil scope |
| **Date** | 2026-07-01 |
| **Status** | **PLANNING** — grill → flows → Paper mocks → PRD complete; build not started |

---

## Executive summary

We re-ran grill-before-build on ENG-1409 as an independent **Pencil arm**, deliberately separate from `ENG1409-Control`, to test whether a fresh grill would still converge on the isolated-frontend answer and produce **higher-fidelity mockups**. It did both. The session locked eight grill decisions (Q6 deferred), two Mermaid diagrams, a **thirteen-row** edge-state table, three **Paper** mockups rendered with recreated LoudEcho tokens, and a twelve-criterion PRD with an explicit deferred backend seam.

Three material differences from control: **(1) Paper mockups** — token-driven color and real component register instead of the control's HTML→Chromium wireframes; **(2) bulk-approve** promotion (multi-select + toolbar) instead of per-variant approve; **(3) a fresh grill** that reached the same core scope by an independent path. **Verdict:** the strongest ENG-1409 planning run — same clean Level-1 blast radius as control, with visually faithful mocks and a defensible promotion-UX divergence.

---

## The bet we were testing

ENG-1409 extends Simulation Mode from campaign QA into an operator-controlled **creative optimization loop**: configure targeting → decompose topics into segments → assign/generate variants → simulate CTR → auto-iterate weak variants until convergence → review, approve, export. This arm asked:

1. Does a **fresh, independent grill** land on the same isolated-frontend shape as control — or drift?
2. Can grilling produce a **one-shot auto pipeline** spec without over-scoping the backend?
3. Do **Paper mockups** raise fidelity above the control's HTML wireframes while still matching dara-front?
4. Is the **bulk-approve** divergence a real improvement or just a difference?
5. Is isolation (`simulation_run_id`, simulated-CTR labeling, zero prod leakage) designed in, not bolted on?

We evaluate **workflow output quality**, not whether simulation-based optimization is the right product.

---

## Locked decisions (Q1–Q8; Q6 deferred)

Full transcript: [`artifacts/grill-log.md`](artifacts/grill-log.md). Fresh session — answers re-derived, not copied from control.

| # | Decision | Rationale |
|---|----------|-----------|
| Q1 | Full closed-loop UI | Feature *is* the loop — a partial spec would be incoherent |
| Q2 | New **Optimize** tab (simulated only, after Bulk Test) | Third sim surface; doesn't pollute Overview or Bulk Test |
| Q3 | **One-shot** auto pipeline, streamed staged progress | "Run it, then inspect" mental model |
| Q4 | **Auto-converge** (uplift < threshold) + **max-5-rounds** cap | Prevents runaway loops (agentic-discipline) |
| Q5 | **Assign existing first**, generate to fill gaps; tag source | Respects the campaign's current ad set |
| Q6 | Backend real-vs-stub **DEFERRED to build** | Build decision, not a mock-shape decision; prototype uses illustrative data behind a `runOptimization()` seam |
| Q7 | **Segment-first** results + Sheet drill-down | Table as map; dense detail in context |
| Q8 | **Bulk approve** (multi-select + toolbar) | Low-friction at scale; **diverges from control's per-variant approve** |

**Pivotal moments:** Q1 "all" was justified (the feature *is* the loop; safety comes from the deferred backend, not from cutting the loop). Q6 was deferred as a build decision — more honest sequencing than control's up-front "typed stub", same destination. Q8 bulk-approve is a deliberate divergence: operators approve many segments per run, so per-row approval is high-friction at 5+ segments; the toolbar mirrors the Drafts tab's multi-select + Publish (N) and keeps an explicit human gate (no auto-promote; staging stays inside Simulation Mode).

---

## Flow walkthrough

Diagrams: [`artifacts/flows.md`](artifacts/flows.md).

**Happy path:** open a simulated campaign → **Optimize** tab (visible only when `isSimulated`) → **Configure** targeting/volume/guardrails/convergence/max-rounds → **Run** (disabled with a reason if no eligible ads) → mints `simulation_run_id`, streams **Decompose → Source → Simulate → Optimize (round n/5)** until converge-or-cap → **Results** (pinned insights + segment table) → click a segment → **Sheet** (ranking, before/after CTR, underperformer→fix, recommendation) → multi-select + **Approve selected** → **Save snapshot** / **Export** → reopen later read-only.

**Run lifecycle:** Idle → Configuring → Running → (Decomposing → Sourcing → Simulating ⇄ Optimizing) → Complete → Reviewing → Saved. Engine-stage failure → EngineError → Retry/Discard; Cancel discards the in-flight run. The **Simulating ⇄ Optimizing** self-loop is the closed loop, terminating on auto-converge OR the hard max-5 cap.

**Edge states (13):** tab hidden on non-sim campaigns; empty first visit; no eligible ads (Run disabled); low-sample amber badge (<~1,000 impressions); thin-coverage generated fill; auto-converged early; max-rounds cap hit; engine/stage error; cancel run; nothing selected on bulk approve; already-approved rows; reopen read-only; isolation always-on. Three richer than control's ten, concentrated on this arm's bulk-approve and convergence states.

---

## Interaction picks

- **K1 — Configure → inline sectioned config** (collapses to a summary after a run). Whole loop on one surface; matches `InputsPanel`-in-`SimulationModeCard`. A modal would hide the results being iterated against.
- **K2 — Progress → horizontal 4-stage stepper** (Decompose · Source · Simulate · Optimize ×N) with a `round n/5` chip + Cancel run. Makes the loop and the cap legible without a noisy log; reuses the `StatusPanel` running register.
- **K3 — Segment drill-down → right-side shadcn `Sheet`.** Keeps the table (the map) in context; accordion rows would break the scannable table; a page loses comparison context.
- **K4 — Approve → multi-select + toolbar bulk action** *(divergence from control)*. Low-friction at 5+ segments; mirrors Drafts' Publish (N); preserves an explicit human gate.
- **K5 — Before/after CTR → two-column Original vs Improved + delta chip**, both labeled Simulated. Legible improvement with the caveat attached; a per-round chart is over-built for an MVP whose sole metric is simulated CTR.

---

## Paper mockups

Rendered in **Paper** with recreated LoudEcho tokens (Inter; near-black `--primary`; `#0090FF` accent; amber isolation set; `Geist Mono` for the run-id chip). Mock notes: [`artifacts/mockup-notes.md`](artifacts/mockup-notes.md). Layout gate: **PASS**.

### 01 · Configure (first visit)
![Configure](artifacts/screenshots/01-configure.png)
*Campaign shell + tab bar reproducing `campaigns/[campaignId]/page.tsx`; **Optimize** tab after Bulk Test; amber isolation banner; config `Card` (Select grid + numeric Input + convergence control + max-rounds stepper); near-black **Run optimization** CTA + eligible-ads note; dashed empty-results placeholder. Proves Q2, Q3, isolation-up-front.*

### 02 · Running (auto pipeline)
![Running](artifacts/screenshots/02-running.png)
*Isolation banner + `simulation_run_id` mono chip + "Running" badge; "Optimizing — round 3/5" + Cancel run; stepper with completed checks, active accent node, `round 3/5` chip; read-only subtopic tree ("Auto · read-only"). Proves Q4, K2, Q5/Q7.*

### 03 · Results + drill Sheet (bulk approve)
![Results](artifacts/screenshots/03-results.png)
*Complete banner + Export / Save snapshot; pinned insights (blended sim CTR +23%, counts, underperformers replaced); segment `Table` (SIM labels, GENERATED/EXISTING tags, amber **Low sample**, **Approved** badges); **bulk-approve toolbar** ("· 3 selected" + Approve selected + Review queue: 5); right-anchored **Sheet** (scrim) with ranking, Before/After (2.9% → 3.8%, `+31%`), underperformer→fix, recommendation. Proves Q7, Q8, K5 and all six ticket outputs.*

---

## UX fidelity vs dara-front (honest)

**Matches well:** Optimize tab appended after Bulk Test in the real `campaignTabs` with existing `isSimulated` gating; amber isolation banner matching `border-amber-500/40 bg-amber-500/10`; `SIM` label on every CTR; config selectors reusing the `InputsPanel` register; Run-disabled + reason mirroring `SimulationTab`; shadcn `Sheet` drill-down; segment table + Low-sample badge fitting `SimulatedGenerationsTable` density; and — uniquely — the bulk-approve toolbar reusing the **Drafts tab's multi-select + Publish (N)** pattern.

**Gaps / call-outs for build:**
- **Illustrative data only (Q6 deferred)** — CTRs/segments/copy/round counts hand-authored; build decides real-vs-stub and wires `simulation_run_id`, per-segment/variant simulated CTR, iteration history. *Expected.*
- **Not real component instances** — Paper frames *approximate* Card/Table/Select/Badge/Sheet; build uses actual shadcn primitives + real `globals.css` tokens. Design-reviewer pass required before PR. *Medium.*
- **Static single-state mocks** — transitions/hover/focus/disabled, Cancel-run confirm, engine-error banner, reopen-read-only are described in flows but not drawn. *Medium.*
- **Fields are display mocks; thresholds illustrative** (Medium sensitivity, ~1,000-impression line — tunable). *Low.*
- **Approval staging-only** — build must keep approval inside Simulation Mode, never promoting to a live campaign. *Low but critical.*

**Scores:** IA/logic **5/5**; Visual/component fidelity **3.5/5** — **materially above the control arm's 2/5** because Paper mocks are token-driven and reproduce the header/tab/banner register, but frames still approximate rather than instantiate shadcn, so a design pass is still needed. **Recommendation:** approve as a layout + visual-register gate; require a design-reviewer pass against real `InputsPanel`, campaign chrome, and shadcn composition before merge.

---

## PRD resume — key sections

From [`artifacts/prd-resume.md`](artifacts/prd-resume.md):

- **What:** a new Optimize tab on simulated campaigns — a one-shot creative-optimization closed loop with **bulk approve**; additive, isolated frontend.
- **Why:** segment-level creative confidence before launch, with no production risk.
- **Acceptance criteria (12 locked):** gating (after Bulk Test, `isSimulated` only); Configure + Run guard; run-id + staged stream; converge-or-cap; read-only tree; assign-then-generate + source tags; insights + segment table + Low-sample badge; Sheet drill-down; bulk approve + review queue; simulated labeling + isolation banner; save snapshot (full history) + export; read-only reopen + all edge states.
- **Contract changes:** **None to existing systems.** Internal `OptimizeTab/types.ts` + `runOptimization()` seam only; CTR contract (`pixel_impressions` denominator) untouched — simulated CTR is a separate labeled metric; no Firebase/Postgres schema change. Blast radius: **Level 1 (isolated frontend).**

---

## What the agent got right — and wrong

**Right:** grounded in Simulation Mode before grilling (`InputsPanel`, `SimulationModeCard`, `simulate-now`, `SimulatedGenerationsTable`); backend deferred honestly behind one seam; safety caps (max-5 + convergence); isolation by design (`simulation_run_id`, SIM labels, amber banner) with the CTR contract untouched; 13-row edge table; and higher-fidelity Paper mocks than control's grayscale wireframes.

**Wrong / weak:** Paper frames approximate shadcn (token-faithful, not instance-faithful) so a design pass is mandatory; static single-state mocks (transitions/confirms/errors undrawn); the bulk-approve divergence is sound but unvalidated against a full live segment set; a Paper MCP quirk routed artboards into an already-open ENG-1410 file (flagged in mock notes; screenshots unaffected); and this is a planning audit only — no build / design-review / Linear proof.

---

## Verdict

**Grade: A / strong, build-first.** A fresh grill reached the same clean isolated-frontend answer as control — evidence the shape is robust, not a one-session artifact — then improved on the two things that matter for a planning artifact: **mock fidelity** (Paper tokens vs HTML grayscale) and a **defensible promotion-UX** (bulk approve reusing an existing pattern). Level-1 blast radius, contracts untouched, backend deferred behind one seam. **Would I approve this PRD? Yes** — after a design-reviewer pass on component fidelity and a quick confirm of bulk-approve against a full segment set. No structural blockers.

## Ratings

| Dimension | Score (1–5) | Evidence |
|-----------|:-----------:|----------|
| Clarity added before build | **5** | Q1–Q8 locked; 12 ACs; 13 edge states; deferred backend removes ambiguity |
| Grounding in IA / app logic | **5** | Optimize tab + `isSimulated` gating + Sheet + bulk toolbar map to real dara-front |
| UX best practices / approach | **5** | 5 interaction picks with rationale; isolation designed in; bulk-approve reuses Drafts |
| Mockup fidelity | **4** | Paper token-driven mocks beat control wireframes; still approximate shadcn |
| Build readiness | **4** | Additive tab + typed seam; no prod contract work; design pass required |
| Overall workflow grade | **5** | Strongest ENG-1409 run; only mock instance-fidelity + live bulk-approve validation hold back a perfect build-ready score |

---

## Artifact index

| Artifact | Path |
|----------|------|
| Grill log | [`artifacts/grill-log.md`](artifacts/grill-log.md) |
| Flows & interactions | [`artifacts/flows.md`](artifacts/flows.md) |
| Mockup notes | [`artifacts/mockup-notes.md`](artifacts/mockup-notes.md) |
| PRD resume | [`artifacts/prd-resume.md`](artifacts/prd-resume.md) |
| Screenshots | [`artifacts/screenshots/`](artifacts/screenshots/) — configure, running, results |
| Full PRD | LoudEcho monorepo: `dara-front/docs/tasks/gavriel/ENG-1409-creative-optimization-simulation-pencil/prd.md` |

---

*Critiques **agent output quality**, not whether simulation-based optimization is good product. Planning-phase audit only. Pencil arm = fresh independent grill; mockups produced in Paper per operator override.*
