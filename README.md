# PM Critique · ENG-1410-Control

**Ticket:** [ENG-1410](https://linear.app/teza/issue/ENG-1410) — Ad Creative Library & Concept Generation  
**Repo:** echo-studio · **Source branch:** `gavri/ENG-1410-creative-library`  
**Workflow variant:** Control arm — standard grill-before-build  
**Audit date:** 2026-07-01  
**Phase:** Planning only (grill → flows → mock → PRD). **No build.**

> This document critiques **agent output quality**, not whether a Creative Library is a good product bet.

---

## Executive verdict

**Approve PRD with conditions.** The agent produced a buildable, scope-honest PRD with strong traceability from grill decisions to acceptance criteria. I would green-light build **after** resolving three open questions — and I'd insist on **P1 (gallery) first**, then glue to existing concept/chat/variant machinery.

| Dimension | Rating | One-liner |
|-----------|--------|-----------|
| Problem clarity | ✅ Strong | Grounded in codebase exploration before grilling |
| Scope discipline | ✅ Good | Honest deferrals; ticket gap on version history called out |
| Buildability | ✅ High | Reuse-heavy; SeedProvider de-risks demo path |
| UX clarity | ✅ Strong | Flows + mocks align; layout gate passed |
| Process friction | ⚠️ Medium | Pencil unavailable; grilled "all" scope still yields a large PRD |

**Build readiness:** Yes, with P1-first chop and PRD approval on open questions.

---

## Workflow under test

| Step | Tool / skill | Outcome |
|------|--------------|---------|
| Context | Linear + codebase explore | Mapped existing concept/chat/variant machinery |
| Grill | `grill-me-product` style, 9 Q&A | Decisions D1–D9 locked |
| Flows | Mermaid + interaction matrix | Happy path + curation sub-flow + 5 layout decisions |
| Mock | HTML → Chromium PNG (Pencil N/A) | 3 screens + key states |
| PRD | Shape Up + `prd-resume.md` | 10 ACs mapped to D1–D9 |

**What was NOT run:** build, design-review gate, Linear proof-of-work post.

---

## Output inventory

| Artifact | Path on this branch |
|----------|---------------------|
| Grill log | [`artifacts/grill-log.md`](artifacts/grill-log.md) |
| Flows & interactions | [`artifacts/flows.md`](artifacts/flows.md) |
| Mockup notes | [`artifacts/mockup-notes.md`](artifacts/mockup-notes.md) |
| PRD resume | [`artifacts/prd-resume.md`](artifacts/prd-resume.md) |
| Screenshots | [`artifacts/screenshots/`](artifacts/screenshots/) |

Full PRD (`prd.md`, ~long form) remains in the LoudEcho monorepo task dir — not duplicated here.

---

## Critique by artifact type

### Grill Q&A (D1–D9)

The grill log is the strongest artifact in this run. The agent:

- **Chopped the ticket** into P1–P4 before asking scope questions — good discipline
- **Read the codebase first** (concept_executor, ChatPane, surgical_edit, load_brand) and reframed net-new work as "Library + glue"
- **Locked 9 decisions** with recommended answers the PM could accept with "yes"

**Standout decisions:**

| ID | Decision | PM take |
|----|----------|---------|
| D2 | Reuse existing machinery | Correct — avoids rebuilding concept/chat/variant |
| D3 | CreativeProvider + SeedProvider | Smart de-risk; Foreplay flagged off |
| D7 | Defer version history | Honest, but **explicit ticket gap** — must stay in PRD non-goals |
| D9 | Handoff → `/review` via surgical_edit | Preserves lineage via parent_concept_id |

**Weakness:** D1 locked "grill all P1–P4" which inflated grill load. MVP stop rules helped, but the resulting PRD is still medium–large. Next run: grill P1 only unless PM explicitly wants full-stack spec.

### Flows & diagrams

The flows doc (`artifacts/flows.md`) is logic-only — no pixel debate. Strengths:

- End-to-end Mermaid with error/empty branches (no brand, adaptation error, empty results)
- Curation sub-flow for Save/Hide (D8)
- **5 interaction decisions** with 2–3 options each and explicit recommendations (gallery cards, filters, workspace layout, refinement, handoff)

**Gap:** No sequence diagram for the Generate Variants handoff (campaign/session creation). Minor — D9 text covers it.

### Wireframes & mocks

Pencil MCP was **unavailable**. Agent fell back to HTML wireframes → headless Chromium PNGs. Acceptable for layout gate; not ideal for design-system fidelity.

**Layout gate: PASS** — proceed to PRD without re-grill.

#### Gallery

![Creative Library gallery](artifacts/screenshots/01-gallery.png)

*Facet sidebar, 4-up card grid, Save/Hide, provider provenance line. Validates D3, D4, D8.*

**Critique:** Card density and filter facet set are reasonable. "Foreplay adapter available, off" caption correctly signals demo path. I'd want real thumbnail aspect ratios in build, but wireframe fidelity is appropriate here.

#### Concept Workspace

![Concept Workspace](artifacts/screenshots/02-concept-workspace.png)

*Reference + adapted brief (left), chat rail (right), Generate Variants CTA.*

**Critique:** Two-pane layout matches D4/D6. Version rail correctly absent (D7 deferred). Quick-action chips reuse ChatPane patterns — good. Minor nit: watermark overlaps Send row (noted in mockup notes, non-blocking).

#### Key states

![Key states](artifacts/screenshots/03-key-states.png)

*No-brand picker, adaptation skeleton, empty/error gallery.*

**Critique:** Covers the states that would otherwise become mid-build Slack threads. Error state with "offline saved concepts" fallback is thoughtful.

### PRD

See [`artifacts/prd-resume.md`](artifacts/prd-resume.md) for the condensed spec.

**Strengths:**

- 10 acceptance criteria, each traceable to a grill decision
- Explicit **out of scope** (Foreplay on hot path, version history, tagging, multi-brand fan-out)
- **Contract honesty:** additive echo-studio schema only; no LoudEcho adtech contract touch
- Implementation plan phases: migration → providers → API → UI → glue

**Concerns:**

1. **Scope vs ticket:** Version history explicitly deferred (D7) — correct process, but PM must acknowledge ticket mismatch
2. **Open questions block build sequencing:**
   - Hand-author ~20–40 seed fixtures? (Rec: yes)
   - Adaptation via concept_from_brief pattern? (Rec: yes)
   - All 10 ACs vs P1 gallery first? (Rec: **P1 first**)
3. **Risk:** Additive libSQL migration on manual-migration discipline — PRD calls this out; eng must test locally first

---

## Gaps & risks

| Gap | Severity | Notes |
|-----|----------|-------|
| Pencil unavailable | Low | HTML fallback worked; install Pencil MCP for next runs |
| Version history deferred | Medium (product) | Ticket asked for it; logged as non-goal — PM sign-off needed |
| Large grilled scope | Medium (process) | 9 decisions + 10 ACs + multi-phase impl — recommend P1-first build |
| Linear proof-of-work | Low | Case study artifacts not posted back to Linear yet |
| No build metrics | N/A yet | Can't measure rework reduction until ship |

---

## Build readiness

| Question | Answer |
|----------|--------|
| Ready to build? | **Yes**, after PRD approval + open-question call |
| Recommended build order | P1 gallery (AC 1–3) → workspace glue (AC 4–8) → states (AC 9) → Foreplay stub (AC 10) |
| Design gate | Required before PR — load design skill stack + design-reviewer PASS |
| Contract risk | Low–Medium — additive only |

---

## Lessons for next run

1. **Grill P1 only** unless PM explicitly wants full-stack spec in one session
2. **Install Pencil MCP** before mock step — wireframe fallback is acceptable but slower and less design-system-aligned
3. **Post proof-of-work to Linear** after each pipeline step (workflow step 7)
4. **Keep reuse discovery in grill** — D2 saved significant scope
5. Compare against [`ENG1410-Skill-Test`](../tree/ENG1410-Skill-Test) when skill-variant experiment runs

---

## What worked / what failed

| ✅ Worked | ❌ Failed / friction |
|-----------|---------------------|
| Codebase grounding before Q&A | Pencil MCP unavailable |
| Provider adapter + seed fixtures pattern | Grilling "all" produced large PRD |
| Traceable AC ↔ grill decision mapping | Linear sync not completed |
| HTML wireframe layout gate | No build yet — can't validate rework savings |
| Honest deferrals in grill + PRD | |

---

*Control arm baseline for ENG-1410. Skill-variant comparison: see `ENG1410-Skill-Test` branch (placeholder).*
