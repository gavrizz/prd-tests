import { SEGMENT_SEEDS } from "./data";
import type {
  ConvergenceSensitivity,
  OptimizeResult,
  RunConfig,
  Segment,
  Stage,
  TerminalReason,
  VariantRank,
} from "./types";

// ---------------------------------------------------------------------------
// runOptimization() — the deferred backend SEAM (Q6). One-shot closed loop:
//   Decompose → Source → Simulate → Optimize ×N (converge-or-cap).
//
// In production this calls the real decomposition/generation/simulation engine
// and mints a server-side simulation_run_id. Here it produces illustrative,
// deterministic data with realistic timing + a runaway guard (hard max-rounds).
//
// The Simulating⇄Optimizing self-loop terminates on sub-threshold uplift OR the
// hard max-rounds cap (agentic-discipline runaway guard) — never open-ended.
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Convergence sensitivity → the uplift floor that ends the loop. Higher
// sensitivity keeps iterating for smaller gains.
const UPLIFT_THRESHOLD: Record<ConvergenceSensitivity, number> = {
  low: 0.06,
  medium: 0.03,
  high: 0.015,
};

export interface RunHooks {
  onStage: (stage: Stage) => void;
  onRound: (round: number) => void;
  isCancelled: () => boolean;
}

export async function runOptimization(config: RunConfig, hooks: RunHooks): Promise<OptimizeResult> {
  const runId = `sim_run_${Math.random().toString(36).slice(2, 8)}`;
  const cancelled = (): OptimizeResult | null =>
    hooks.isCancelled()
      ? { runId, segments: [], rounds: 0, terminalReason: "cancelled" as TerminalReason, insights: emptyInsights() }
      : null;

  // 1. Decompose: topic → subtopics (read-only tree).
  hooks.onStage("decompose");
  await delay(900);
  if (cancelled()) return cancelled()!;

  // 2. Source: assign existing variants first; generate only where coverage is thin.
  hooks.onStage("source");
  await delay(1000);
  if (cancelled()) return cancelled()!;

  // Build working segments: each seed gets its existing variants + one GENERATED
  // fix for the weak line (coverage was thin on that angle).
  const working = SEGMENT_SEEDS.map((seed) => {
    const weak: VariantRank = {
      id: `${seed.id}-weak`,
      label: "Weak line",
      source: "EXISTING",
      copy: seed.weakCopy,
      simulatedCtr: 1.6 + Math.random() * 0.4,
    };
    const generated: VariantRank = {
      id: `${seed.id}-gen`,
      label: "Generated fix",
      source: "GENERATED",
      copy: seed.fixCopy,
      simulatedCtr: 0, // scored during simulate/optimize
    };
    const best = [...seed.existing].sort((a, b) => b.simulatedCtr - a.simulatedCtr)[0];
    return { seed, weak, generated, best, variants: [...seed.existing, weak] };
  });

  // 3. Simulate: baseline per-segment blended simulated CTR.
  hooks.onStage("simulate");
  await delay(900);
  if (cancelled()) return cancelled()!;
  const baselines = working.map((w) => blended(w.variants));

  // 4. Optimize ×N: rewrite weak variants, re-simulate. Round counter n/maxRounds.
  hooks.onStage("optimize");
  const threshold = UPLIFT_THRESHOLD[config.convergence];
  let round = 0;
  let terminal: TerminalReason = "capped";
  let prevBlended = mean(baselines);

  // Generated fix starts a bit above the weak line and improves with diminishing returns.
  working.forEach((w) => (w.generated.simulatedCtr = w.weak.simulatedCtr + 0.6));

  while (round < config.maxRounds) {
    round += 1;
    hooks.onRound(round);
    await delay(1100);
    if (cancelled()) return cancelled()!;

    // Each round nudges the generated fix up with diminishing returns.
    working.forEach((w) => {
      const gain = (w.best.simulatedCtr + 0.8 - w.generated.simulatedCtr) * 0.45;
      w.generated.simulatedCtr = roundTo(2, w.generated.simulatedCtr + Math.max(0, gain));
    });

    const nowBlended = mean(working.map((w) => blended([...w.seed.existing, w.generated])));
    const uplift = (nowBlended - prevBlended) / prevBlended;
    prevBlended = nowBlended;

    if (uplift < threshold) {
      terminal = "converged";
      break;
    }
  }

  // Assemble terminal segments.
  const segments: Segment[] = working.map((w, i) => {
    const finalVariants = [...w.seed.existing, w.generated].sort((a, b) => b.simulatedCtr - a.simulatedCtr);
    const bestVariant = finalVariants[0];
    return {
      id: w.seed.id,
      subtopic: w.seed.subtopic,
      impressions: w.seed.impressions,
      bestVariant,
      weakVariant: w.weak,
      improvedVariant: w.generated,
      baselineCtr: roundTo(2, baselines[i]),
      simulatedCtr: roundTo(2, blended([...w.seed.existing, w.generated])),
      recommendation: w.seed.recommendation,
      lowSample: w.seed.impressions < 1000,
      variants: [...finalVariants, w.weak],
      approved: false,
    };
  });

  const insights = {
    blendedUpliftPct: roundTo(1, ((mean(segments.map((s) => s.simulatedCtr)) - mean(baselines)) / mean(baselines)) * 100),
    segmentCount: segments.length,
    variantsExisting: working.reduce((n, w) => n + w.seed.existing.length + 1, 0),
    variantsGenerated: working.length,
    underperformersReplaced: working.length,
  };

  return { runId, segments, rounds: round, terminalReason: terminal, insights };
}

function blended(variants: VariantRank[]): number {
  const scored = variants.filter((v) => v.simulatedCtr > 0);
  if (scored.length === 0) return 0;
  return scored.reduce((s, v) => s + v.simulatedCtr, 0) / scored.length;
}
function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function roundTo(dp: number, n: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
function emptyInsights() {
  return { blendedUpliftPct: 0, segmentCount: 0, variantsExisting: 0, variantsGenerated: 0, underperformersReplaced: 0 };
}
