# Changelog

All notable changes to this experiment repo.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
