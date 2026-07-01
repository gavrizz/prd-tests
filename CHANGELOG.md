# Changelog

All notable changes to this experiment repo.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [ENG1410-Paper] — 2026-07-01

### Added

- **ENG1410-Paper** — PM/PD critique of the grill-before-build **Paper arm** for ENG-1410 (Ad Creative Library & Concept Generation, echo-studio). Independent grill; planning phase only, no build.
  - Distilled case-study `README.md` (~1.8k words; a tightened version of the `ENG1410-Control` README, all core arguments/insights/ratings/artifact index retained).
  - Artifacts: grill log, flows & interactions, mockup notes, PRD resume, and 3 **Paper** mockup screenshots (gallery, concept workspace, key states).

### Notable differences vs `ENG1410-Control`

- **Mockups in Paper** with the **real echo-studio V2 palette** (`#0090FF` brand blue, Geist, neutral surfaces) instead of the control's grayscale HTML → Chromium fallback.
- **"Library + glue" reframe locked up front** (D2 from question two) rather than after grilling "all four" stacked features — a more disciplined MVP grill.
- Surfaces the **chat-rail dock-side delta** (mock docks right for reference-visible reading vs the real left-docked `AppShell`) as a deferred build decision.
- Verdict **A− / strong** (overall workflow 4.5/5) vs the control's B+.

### Notes

- Same Level 1–2 (isolated new surfaces + additive glue) blast radius; no dara-backend/adtech contract change; version history (D7) explicitly deferred.
- Build, design review, and Linear proof-of-work steps executed separately from this branch (planning artifacts only here).

---

## [ENG1409-Pencil] — 2026-07-01

### Added

- **ENG1409-Pencil** — PM/PD critique of the grill-before-build **Pencil arm** for ENG-1409 (Creative Optimization Simulation, dara-front). Fresh, independent grill; planning phase only, no build.
  - Distilled case-study `README.md` (~161 lines; a tightened ~51% version of the `ENG1409-Control` README, all core arguments retained).
  - Artifacts: grill log, flows & interactions, mockup notes, PRD resume, and 3 **Paper** mockup screenshots (configure, running, results).

### Notable differences vs `ENG1409-Control`

- **Mockups in Paper** (token-driven, real component register) instead of the control's HTML→Chromium wireframes — visual/component fidelity ~3.5/5 vs control's 2/5.
- **Bulk approve** (multi-select + "Approve selected" toolbar + Review-queue count) instead of the control's per-variant approve (Q8 divergence).
- **Fresh independent grill** that converged on the same isolated-frontend scope by a separate path; Q6 (backend) explicitly deferred to build.
- **13-row** edge-state table (vs control's 10), concentrated on the bulk-approve and convergence states.

### Notes

- Same Level-1 (isolated frontend) blast radius as control; no contract changes; CTR contract (`pixel_impressions` denominator) untouched — simulated CTR is its own labeled metric.
- Build, design review, and Linear proof-of-work steps not yet executed.
- Paper MCP quirk (flagged in mockup notes): Optimize artboards landed in an already-open ENG-1410 Paper file; screenshots are unaffected.
