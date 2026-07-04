// ENG-1409 — Creative Optimization Simulation ("Optimize" tab).
// Internal type module (OptimizeTab/types.ts in dara-front). No contract changes:
// simulated CTR is a separate, labeled metric — the real CTR contract
// (pixel_impressions denominator) is untouched.

export type ConvergenceSensitivity = "low" | "medium" | "high";
export type VolumeMode = "direct" | "budget_cpm";
export type VariantSource = "EXISTING" | "GENERATED";

export interface RunConfig {
  topic: string;
  audience: string;
  geo: string;
  vertical: string;
  device: string; // optional device/placement
  volumeMode: VolumeMode;
  impressions: number; // direct
  budget: number; // budget_cpm
  cpm: number; // budget_cpm
  convergence: ConvergenceSensitivity;
  maxRounds: number; // default 5, hard cap
}

export interface VariantRank {
  id: string;
  label: string;
  source: VariantSource;
  copy: string;
  simulatedCtr: number; // %
}

export interface Segment {
  id: string;
  subtopic: string;
  impressions: number;
  bestVariant: VariantRank;
  weakVariant: VariantRank;
  /** After the optimize loop rewrote the weak variant. */
  improvedVariant: VariantRank;
  baselineCtr: number; // blended, round 0
  simulatedCtr: number; // blended, terminal
  recommendation: string;
  lowSample: boolean; // < ~1,000 simulated impressions
  variants: VariantRank[];
  approved: boolean;
}

export type Stage = "decompose" | "source" | "simulate" | "optimize";

export interface RunInsights {
  blendedUpliftPct: number;
  segmentCount: number;
  variantsExisting: number;
  variantsGenerated: number;
  underperformersReplaced: number;
}

export type TerminalReason = "converged" | "capped" | "cancelled" | "error";

export interface OptimizeResult {
  runId: string;
  segments: Segment[];
  rounds: number;
  terminalReason: TerminalReason;
  insights: RunInsights;
}

export type RunStatus = "idle" | "running" | "complete" | "error" | "saved";

export interface RunProgress {
  stage: Stage;
  round: number; // 0 until optimize loop starts
  maxRounds: number;
}
