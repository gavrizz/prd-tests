# ENG-1409 — Build notes (step 5)

How the prototype slice was built and where the "implementation loops" live.

## Stack

Vite + React 18 + TypeScript + Tailwind 3.4. Tokens and shadcn primitives copied verbatim from `dara-front` (`globals.css` HSL variables, `tailwind.config.js`, `cn` util), plus the campaign shell (`AppShell`, `Sidebar`, underline `TabMenu`) so the Optimize tab slots into real chrome.

## Implementation loop (not a static mockup)

The run is a real state machine over a staged engine:

### `runOptimization(config, hooks)` — `engine.ts`
1. **Decompose** the topic into segments (emits the read-only subtopic tree).
2. **Source** existing + generated variant candidates per segment.
3. **Simulate** CTR per candidate (deterministic, seeded).
4. **Optimize rounds** — each round replaces underperformers and re-simulates; emits `round N / M` progress. Stops on **convergence** (blended-CTR delta below a sensitivity-derived threshold) **or** the **max-round hard cap** — whichever comes first (the captured run *Converged in 3 rounds* under Medium sensitivity).

### `useOptimizationRun()` — lifecycle
Drives `idle → running → complete → saved`, exposes progress, results, per-segment selection, and approve-into-queue. Configure is disabled during a run; Cancel aborts.

## Simulation safety (hard requirement)

- Persistent amber **IsolationBanner**: *"Simulation only — isolated from production. No writes to the live bidder, billing, pacing or reporting."*
- Every metric carries a `SIM` label; generated variants carry a `GENERATED` tag.
- The engine has no network path — it cannot touch live systems by construction.

## File map

| Area | Files |
|------|-------|
| Shell | `components/shell/{AppShell,Sidebar,TabMenu}.tsx` |
| Primitives | `components/ui/*` |
| Contracts | `features/optimize/types.ts` |
| Fixtures | `features/optimize/data.ts` |
| Engine (seam) | `features/optimize/engine.ts` |
| Lifecycle | `features/optimize/useOptimizationRun.ts` |
| Screens | `features/optimize/{IsolationBanner,ConfigureSection,RunPanel,ResultsSection,SegmentSheet,OptimizeTab}.tsx` |
| Shell wiring | `App.tsx` |

## Verification

`npm run build` passes (tsc + vite). All four states (configure, running, results, sheet + approved) captured live via browser — see `screenshots/`.
