# Case Study · ENG-1410 — Ad Creative Library & Concept Generation

| Field | Value |
|-------|-------|
| **Linear ticket** | [ENG-1410](https://linear.app/teza/issue/ENG-1410) — Ad Creative Library & Concept Generation |
| **Target repo** | echo-studio (Creative Intelligence Engine) |
| **Source branch** | `gavri/ENG-1410-creative-library` |
| **Experiment branch** | `ENG1410-Control` |
| **Workflow** | Grill-before-build (control arm) |
| **Date** | 2026-07-01 |
| **Status** | **PLANNING** — grill → flows → mock → PRD complete; build not started |

---

## Executive summary

We ran the grill-before-build workflow against ENG-1410 to see whether an agent could turn a large, multi-surface Linear ticket into a build-ready PRD **before** any code was written. The session produced nine locked product decisions (D1–D9), two Mermaid flow diagrams, three wireframe screens, and a ten-criterion PRD resume — all traceable back to a single grill log. The agent's strongest move was reading echo-studio first and reframing the ticket as "Library + glue" atop existing concept, chat, and variant machinery. The weakest move was locking "grill all four stacked features" (D1), which inflated scope despite MVP stop rules. **Verdict:** the workflow added genuine clarity and is build-ready **if** we chop P1 (gallery) first and accept honest deferrals on version history.

---

## The bet we were testing

ENG-1410 asks for an **Ad Creative Library**: ingest proven ads, browse them, adapt a selected concept to a brand's DNA, refine it in chat, and hand it to variant generation. That sounds like four features in one ticket. The experiment tested whether grill-before-build could:

1. **Decompose** the ticket without losing the end-to-end story
2. **Ground decisions** in what echo-studio already has (concept_executor, ChatPane, surgical_edit, load_brand)
3. **Produce wireframes** that extend echo-studio's IA rather than inventing a parallel product
4. **Write a PRD** whose acceptance criteria map 1:1 to locked grill decisions

We did **not** test whether a Creative Library is good business — only whether the agent workflow produces artifacts a senior PM would trust before green-lighting build.

---

## Session narrative — pivotal Q&A moments

The grill log ([`artifacts/grill-log.md`](artifacts/grill-log.md)) records one question at a time, each with a recommended answer the operator could accept with "yes." Three exchanges mattered most because they **reframed the entire build**.

### Moment 1 — Scope chop before scope lock (Q1 + codebase read)

The agent opened by splitting ENG-1410 into four pieces:

| Piece | What | Depends on |
|-------|------|------------|
| P1 | Creative Library (ingest, gallery, curation) | — |
| P2 | Concept generation from reference | P1 |
| P3 | Refinement chat + version history | P2 |
| P4 | Variant handoff | P2/P3 |

**Recommended:** grill P1 only. **Operator answer:** "all" — grill the full flow end to end. → **D1 locked.**

This was a fork in the road. Locking "all" meant the PRD would cover P1–P4 even though build might still chop. The agent compensated by reading the codebase **before** grilling P2–P4 and discovering that P2–P4 largely **already exist**.

### Moment 2 — The reframe that saved the session (Q2)

After mapping `concept_from_brief`, `ChatPane`, `surgical_edit`, and `load_brand()`, the agent asked:

> **Recommended:** Treat P2–P4 as **reuse/wire-up** of existing machinery. Net-new = Library + glue.

**Operator:** Yes. → **D2 locked.**

This is the session's pivotal decision. Without D2, the PRD would have specified rebuilding concept generation, chat, and variant UI — weeks of redundant work. With D2, net-new scope collapsed to: (1) Foreplay/Seed ingest + normalized model, (2) gallery UI, (3) wiring library selections into existing engines. Every subsequent decision (D4 workspace layout, D6 auto-adapt, D9 handoff to `/review`) follows from D2.

### Moment 3 — Honest deferral under pressure (Q7)

The Linear ticket explicitly asks to "maintain version history so users can compare and revert." The agent recommended a `concept_versions` table with a version rail. **Operator answer:** **None** — latest brief only in MVP. → **D7 locked**, with an explicit ⚠️ flag that the ticket requirement is **DEFERRED** to PRD non-goals.

A weaker agent would have silently dropped the requirement or over-built. Here the deferral is logged, traceable, and visible in the PRD resume — exactly what a skeptical PM wants to see.

### Other locked decisions (summary)

| ID | Decision | Why it mattered |
|----|----------|-----------------|
| D3 | `CreativeProvider` adapter; SeedProvider fixtures drive demo; ForeplayProvider coded but **off** | De-risks build — no live API on hot path |
| D4 | New **Library** nav → `/library` gallery; select → **Concept Workspace** `/library/[id]` | Distinct surfaces; avoids cramming gallery into global chat |
| D5 | Adapt to **active brand** from TopBar switcher; block-with-picker if none; gallery brand-agnostic | Reuses global brand context |
| D6 | **Auto-run adaptation once** on workspace open; explicit Re-adapt | Avoids dead-end empty workspace |
| D8 | Curation MVP = **Save + Hide** only; tagging deferred | Matches gallery-first chop |
| D9 | Generate Variants → campaign/session → concept_executor → surgical_edit → navigate **`/review`** | Zero net-new variant UI; lineage via `parent_concept_id` |

Full Q&A transcript: [`artifacts/grill-log.md`](artifacts/grill-log.md).

---

## Flow walkthrough (plain English)

The Mermaid diagrams in [`artifacts/flows.md`](artifacts/flows.md) describe two journeys.

### Happy path (8 steps)

1. Operator opens **Library** (new nav item) and sees a grid of proven ad creatives from SeedProvider fixtures.
2. They search and filter by vertical, niche, platform, format, language, CTA, and creative angle — filters live in **URL query params** so views are shareable.
3. They click a card and land on the **Concept Workspace** at `/library/[creativeId]`.
4. If no brand is active, an inline **brand picker** blocks the workspace until one is chosen.
5. Adaptation **auto-runs once**: reference metadata + Brand DNA → synthesized brief via `concept_from_brief` + `load_brand()`. A skeleton shows during loading.
6. The operator refines the brief through the **existing chat rail** on the right ("make the CTA punchier," etc.).
7. Satisfied, they click **Generate Variants**.
8. The system creates a campaign+session, renders the concept, enqueues `surgical_edit`, and navigates to the existing **`/review`** surface where variants stream in.

### Error and empty branches

The flow diagram also covers paths a lay reader cares about:

- **Empty gallery** or provider fetch failure → retry / offline saved-concepts fallback
- **No filter results** → clear-filters CTA back to grid
- **No active brand** → inline picker (not a dead end)
- **Adaptation error** → error state in brief pane with Retry
- **Variant enqueue failure** → toast; operator stays in workspace

A separate curation sub-flow covers **Save** (badge + Saved filter) and **Hide** (removed from default grid; undo via Hidden filter).

---

## Interaction design — options considered and why the pick wins

For each key step, the flows doc records 2–3 options and a recommendation. These aren't decorative — they document **IA and app-logic reasoning**.

### Gallery browse (4.1)

- **A (pick):** Responsive card grid — thumbnail, brand, format/platform badges, one-line summary, hover Save/Hide. Click → workspace.
- B: Dense table with side preview.
- C: Masonry with inline video autoplay.

**Why A wins:** Matches existing shadcn card patterns in `studio/components/gallery/`. Scannable, cheap to build, appropriate density for ~20–40 seed creatives.

### Search + filter (4.2)

- **A (pick):** Left facet sidebar + top keyword search; filters as URL params.
- B: Top filter bar with dropdown popovers.
- C: Command-palette search only.

**Why A wins:** URL-param facets fit App Router patterns already used by `/review?view=`. Supports deep links and back-button safety — important when operators share "SaaS + Meta + 9:16" filtered views.

### Workspace layout (4.3)

- **A (pick):** Two-pane — left: reference creative stacked above adapted brief; right: chat rail. Brief as labeled sections (Hook, Core message, Visual direction, Layout, CTA, Copy, Rationale).
- B: Tabs (Reference | Brief | Chat).
- C: Collapsible reference header.

**Why A wins:** Keeps the **source ad visible** while refining — core to the "adapt from proven creative" mental model. Reuses existing `ChatRail` without net-new chat UI.

### Refinement (4.4)

- **A (pick):** Existing global chat rail scoped to this concept's session.
- B: Structured form fields per brief section.
- C: Hybrid chat + quick-action chips.

**Why A wins:** Leverages production SSE chat stack. Option C's chips (Tone, CTA, Format) were noted as a cheap enhancement — the wireframe includes them.

### Generate Variants handoff (4.5)

- **A (pick):** Primary CTA in workspace header → create campaign+session → render → enqueue → toast + auto-navigate to `/review`.
- B: Embed variant results strip in workspace (net-new UI).
- C: Open `/review` in new tab.

**Why A wins:** Reuses `/review` entirely. Clear "you've left concept work, go watch variants cook" transition. Preserves lineage via `parent_concept_id`.

---

## Wireframe review — screenshots and echo-studio fidelity

Pencil MCP was **unavailable** in this run. The agent used the sanctioned fallback: HTML wireframes → headless Chromium PNGs. Fidelity is **structural**, not brand-polished — appropriate for a layout gate before PRD.

### Screen 1 — Creative Library gallery

![Creative Library gallery](artifacts/screenshots/01-gallery.png)

*Facet sidebar (All/Saved/Hidden, Vertical, Platform, Format, Creative angle), 4-up card grid, Save/Hide affordances, provider provenance line ("SeedProvider · Foreplay off · 34").*

**What this proves:** D3 (seed-driven demo), D4 (Library as primary nav), D8 (Save/Hide curation), interaction picks 4.1 and 4.2.

**Fidelity vs echo-studio:**

| Element | Wireframe | Real product | Match? |
|---------|-----------|--------------|--------|
| Primary nav | Studio · Review · **Library** · Campaigns · Brand DNA | `TopBar.tsx`: Studio, Review, Campaigns, Brand DNA (no Library yet) | **Extension** — correct insertion point in pill nav |
| Brand switcher | "(Deel ▾)" in header | `BrandSwitcher` Button with label + caret | ✅ Pattern match |
| Card grid | 4-up with badges | `studio/components/gallery/` card patterns | ✅ Density reasonable |
| Filter sidebar | Left facets | No existing library filters (net-new) | N/A — new surface |
| Design tokens | Grayscale boxes | `globals.css` LoudEcho V2 (neutral + brand-blue accent) | ⚠️ Build must apply tokens |

### Screen 2 — Concept Workspace

![Concept Workspace](artifacts/screenshots/02-concept-workspace.png)

*Two-pane: reference creative + source metadata above adapted brief (Hook, Core message, Visual direction, Layout, CTA, Copy, Rationale); chat rail with quick-action chips; header with ← Library, Re-adapt, Generate Variants →.*

**What this proves:** D2/D4 (dedicated route, reuse ChatPane), D5 (target brand "Deel" in header), D6 (auto-adapted v1 brief), D9 (persistent Generate Variants CTA).

**Fidelity vs echo-studio:**

| Element | Wireframe | Real product | Match? |
|---------|-----------|--------------|--------|
| Two-pane + chat rail | Left content, right chat | `AppShell` + `ChatPane` pattern | ✅ Core layout matches |
| Chat quick-action chips | Tone, Audience, Visual style… | ChatPane exists; chips are enhancement | ⚠️ Chips not in prod yet — cheap add |
| Generate Variants CTA | Header primary button | No equivalent today (new action) | N/A — new glue |
| Version rail | Absent (v1 tag only) | N/A — D7 deferred | ✅ Intentionally omitted |

### Screen 3 — Key states

![Key states](artifacts/screenshots/03-key-states.png)

*No active brand → inline brand picker; adaptation loading skeleton; gallery empty-results; provider fetch error with Retry.*

**What this proves:** D5 (brand block), D6 (loading skeleton), error/empty coverage from flows §5.

**Layout gate verdict:** **PASS** — all screens render coherently at 1440px. Proceed to PRD without re-grill. Nits: faint watermark overlaps chat Send row; annotation labels are wireframe-only.

Mock notes: [`artifacts/mockup-notes.md`](artifacts/mockup-notes.md).

---

## PRD resume (key sections)

From [`artifacts/prd-resume.md`](artifacts/prd-resume.md):

### What

A new **Creative Library** in echo-studio: browse/search proven ad creatives → select one → LoudEcho **adapts it to a target brand's DNA** → refine in chat → **Generate Variants** hands it to the existing variant workflow. Net-new = Library + glue; concept-gen, chat, Brand DNA, and variant generation are reused.

### Why

Concept ideation today is manual and disconnected from variant generation. This turns market-proven ads into a first-class, brand-adaptable input layer for the existing engine.

### Acceptance criteria (locked)

1. Library nav → `/library` gallery from `CreativeProvider` (SeedProvider default).
2. Cards: thumbnail, brand, format+platform badges, summary, metadata tags, **Save / Hide**.
3. Facet sidebar + keyword search; **filters in URL**.
4. Select → Concept Workspace `/library/[id]`: reference + brief (left), chat rail (right), **Generate Variants** CTA.
5. No active brand → inline **brand picker**; else adapt to **active brand**.
6. **Auto-adapt once** (skeleton) → brief sections; explicit **Re-adapt**.
7. Chat refines brief (reuse ChatPane); quick-action chips for common edits.
8. **Generate Variants** → campaign/session → render concept → surgical_edit → navigate to `/review`.
9. Empty / loading / error states handled.
10. `ForeplayProvider` coded but **flagged off**; SeedProvider fixtures drive demo.

### Out of scope (honest deferrals)

- Live Foreplay on demo path
- **Concept version history / compare / revert** (ticket req — explicitly deferred)
- Free-form tagging; LoudEcho-owned curated galleries
- Multi-brand fan-out; any new variant UI
- Any dara-backend / adtech contract change

### Open questions (pre-build)

1. OK to hand-author ~20–40 seed fixtures? _(Rec: yes)_
2. Adaptation via `concept_from_brief` contextualize-spawn pattern? _(Rec: yes)_
3. Build all 10 ACs or **P1 gallery first** then glue? _(Rec: P1 first)_

---

## What the agent got right — and wrong

### Right

- **Codebase-first grilling.** Reading TopBar, ChatPane, concept_executor, and surgical_edit before Q2 prevented a spec that rebuilds existing systems.
- **Decision traceability.** Every AC in the PRD resume cites D1–D9. A builder can grep the grill log and know *why* each requirement exists.
- **Honest scope deferrals.** D7 (version history) and D8 (tagging) are logged as ticket gaps, not silently dropped.
- **SeedProvider de-risk.** D3 makes the demo deterministic without blocking on Foreplay API keys.
- **Layout gate discipline.** Mock notes declare PASS/FAIL explicitly; no pixel debate leaked into the grill.

### Wrong / weak

- **D1 scope inflation.** Grilling "all" produced a medium-large PRD for a ticket that should build P1-first. MVP stop rules helped, but the operator had to later re-chop in the open questions.
- **No sequence diagram for variant handoff.** D9 is text-only in flows — minor gap for engineers wiring campaign/session creation.
- **Wireframes not token-styled.** Acceptable for layout gate, but the updated agent prompt now requires reading `globals.css` and component patterns **before** wireframing to reduce build-time visual delta.
- **Steps 5–7 not run.** No build, no design-review gate, no Linear proof-of-work — this case study evaluates **planning artifacts only**.

---

## Critique verdict — is grill-before-build superb or subpar?

**Grade: B+ / strong with conditions.**

**Evidence for "strong":**

- The grill log alone would save a builder days of "wait, do we rebuild chat?" confusion.
- Flows + interaction matrices document *reasoning*, not just screens.
- PRD acceptance criteria are testable and mapped to decisions.
- Wireframes validated IA extension (Library nav, two-pane workspace) against real TopBar/AppShell patterns.

**Evidence for "not superb yet":**

- Pencil unavailable forced grayscale HTML fallback — layout-valid but not design-system-faithful.
- Full-ticket grill (D1) created unnecessary PRD bulk; workflow prompt should default to P1-only unless operator opts in.
- No built UI to compare wireframe → shipped fidelity (planning-phase only).

**Would I approve this PRD and start build?** **Yes — P1 first**, after resolving the three open questions in prd-resume. I would not attempt all 10 ACs in one pass.

---

## Ratings

| Dimension | Score (1–5) | Evidence |
|-----------|:-----------:|----------|
| **Clarity added before build** | **4** | D2 reframe + 9 locked decisions eliminate major ambiguity; open questions are explicit |
| **Grounding in design skill stack / IA / app logic** | **4** | TopBar nav extension, ChatPane reuse, `/review` handoff all match real echo-studio; wireframes structural not token-polished |
| **UX best practices / approach quality** | **4** | 2–3 options + pick pattern on 5 interactions; error/empty branches in Mermaid; Save/Hide curation sub-flow |
| **Build readiness** | **3** | PRD is buildable but scope is large; P1-first chop recommended; Foreplay/seed/content questions open |
| **Overall workflow grade** | **4** | Strong planning pipeline; Pencil gap and D1 scope inflation prevent a 5 |

---

## Appendix — artifact index

| Artifact | Path | Purpose |
|----------|------|---------|
| Grill log | [`artifacts/grill-log.md`](artifacts/grill-log.md) | D1–D9 Q&A transcript + locked decisions |
| Flows & interactions | [`artifacts/flows.md`](artifacts/flows.md) | Mermaid journeys + interaction option matrices |
| Mockup notes | [`artifacts/mockup-notes.md`](artifacts/mockup-notes.md) | Wireframe validation + layout gate verdict |
| PRD resume | [`artifacts/prd-resume.md`](artifacts/prd-resume.md) | Shape Up summary + 10 ACs |
| Screenshots | [`artifacts/screenshots/`](artifacts/screenshots/) | 01-gallery, 02-concept-workspace, 03-key-states |
| Full PRD | LoudEcho monorepo: `echo-studio/docs/tasks/gavri/ENG-1410-creative-library/prd.md` | Not duplicated on this branch |

---

*This case study critiques **agent output quality**, not whether a Creative Library is the right product bet. Planning-phase audit only — no implementation on this branch.*
