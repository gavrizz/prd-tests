# Changelog

All notable changes to this experiment repo.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.5.0] — 2026-07-04

### Added

- **ENG1409-Claude** — first **build-arm** run: agent-built runnable interactive prototype slice for ENG-1409 (Creative Optimization Simulation), not planning-only.
  - `prototype/` — Vite + React + TS + Tailwind mini-app using dara-front tokens + shadcn primitives; new `Optimize` tab on the campaign shell; full loop (Configure → staged converge-or-cap run → results → segment Sheet → bulk approve) over a client-side simulation engine (`engine.ts`).
  - Simulation-safety framing: persistent isolation banner + `SIM` labels on every metric.
  - `case-study/` — build notes, design review, 3 live screenshots (+ dara-front shell reference).
  - `prd-resume.md` — PRD + merge notes for dara-front integration.
  - `AUTH-BYPASS.md` — documents the env-gated local dev auth bypass added to dara-front `withAuth`.

### Notes

- Prototype verified: `npm run build` passes; all states captured live in-browser.
- Engine is a deterministic client-side simulation with no network path — never touches the live bidder by construction.

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

## [0.4.0] — 2026-07-01

### Added

- **Standalone prototype model** — each feature is a sliced interactive prototype (Claude-first), not full dara-front; `prototype/` folder on branches; explicit in/out of scope
- Agent prompt: prd-tests mode, slice rules, dev merge notes in PRD

## [0.3.2] — 2026-07-01

### Changed

- **UI reference = `dara-front` only** — `echo-studio` documented as API/backend for the creative engine, not a mock or design-system source
- Agent prompt synced: mocks must use dara-front design language even when ticket integrates echo-studio APIs

## [0.3.1] — 2026-07-01

### Added

- README §7 — **Pull latest target repo first**: explicit `dara-front` `staging` pull before Claude Code grill/mock/build; PRD-only is insufficient for LoudEcho-faithful UI

## [0.3.0] — 2026-07-01

### Added

- **main README** — `Setup & installation` section: clone repos, Cursor skills/MCP, Storybook, Paper design VP, copy-paste launch, Claude Code + Claude Design path, second-machine checklist
- **prompts/grill-before-build-agent-prompt.md** — Paper-first mock phase; mandatory design skill stack; Storybook/`components.md` references; hard gate against gray wireframes

### Changed

- Branch table on main README includes `ENG1410-Paper` and `ENG1409-Pencil` arms

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
