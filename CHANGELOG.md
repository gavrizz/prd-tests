# Changelog

All notable changes to this experiment repo.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] — 2026-07-01

### Added

- Initial repo setup with experiment framing (`README.md`)
- **ENG1410-Control** — PM critique of grill-before-build run for ENG-1410 (Ad Creative Library & Concept Generation, echo-studio). Planning phase only; no build.
  - Artifacts: grill log, flows, mockup notes, PRD resume, 3 wireframe screenshots
- **ENG1409-Control** — PM critique of grill-before-build run for ENG-1409 (Creative Optimization Simulation, dara-front). Planning phase only; no build.
  - Artifacts: grill log, flows, mockup notes, PRD resume, 4 wireframe screenshots
- **ENG1410-Skill-Test** — placeholder branch reserved for future skill-variant experiment against ENG1410-Control baseline

### Notes

- Both control-arm runs completed the full planning pipeline (grill → flows → mock → PRD)
- Pencil MCP was unavailable in both runs; HTML wireframe fallback used
- Build, design review, and Linear proof-of-work steps not yet executed

## [0.2.1] — 2026-07-01

### Removed

- **ENG1410-Skill-Test** — placeholder branch removed (no experiment run was executed on this arm)

## [0.2.0] — 2026-07-01

### Changed

- **ENG1410-Control** — Rewrote `README.md` as senior PM/PD narrative case study with evidence (~3,000 words): session narrative, flow walkthrough, interaction picks, wireframe fidelity vs echo-studio, embedded PRD resume, ratings table
- **ENG1409-Control** — Same case study format plus **UX fidelity vs dara-front** section with honest codebase comparison (InputsPanel, campaign tabs, Sheet, isolation banners)
- **main** — Expanded README with case study reading guide, 1–5 rating rubric, branch naming convention
- **prompts/grill-before-build-agent-prompt.md** — Added mandatory mock/wireframe phase: read target repo UX before wireframes, design skill stack, extend existing IA, real component names, token-faithful HTML fallback

### Notes

- Monorepo copy of agent prompt updated at `docs/case-studies/grill-before-build-agent-prompt.md`
- Both control-arm runs still planning-phase only (no build)
