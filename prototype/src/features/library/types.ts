// ENG-1410 — Ad Creative Library & Concept Generation.
// Types mirror the echo-studio contracts named in the case study (CreativeProvider,
// concept_from_brief, load_brand, surgical_edit, parent_concept_id). This is the
// net-new "Library + glue" surface; P2–P4 reuse existing echo-studio machinery.

export type Platform = "Meta" | "TikTok" | "YouTube" | "Google";
export type Format = "9:16" | "1:1" | "4:5" | "16:9";
export type CreativeAngle = "Problem/Solution" | "Social Proof" | "Founder Story" | "Offer" | "Comparison";

/** Normalized reference creative from a CreativeProvider (SeedProvider fixtures). */
export interface Creative {
  id: string;
  brand: string;
  vertical: string;
  niche: string;
  platform: Platform;
  format: Format;
  language: string;
  cta: string;
  angle: CreativeAngle;
  summary: string;
  headline: string;
  bodyCopy: string;
  /** Deterministic gradient seed for the fixture thumbnail. */
  hue: number;
  saved?: boolean;
  hidden?: boolean;
}

/** Brand DNA loaded via load_brand() — drives adaptation. */
export interface Brand {
  id: string;
  name: string;
  tone: string;
  audience: string;
  palette: string[];
  positives: string;
  negatives: string;
}

/** Adapted concept brief — output of concept_from_brief. Latest-only in MVP (D7). */
export interface ConceptBrief {
  hook: string;
  coreMessage: string;
  visualDirection: string;
  layout: string;
  cta: string;
  copy: string;
  rationale: string;
}

export type BriefSectionKey = keyof ConceptBrief;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Which brief section this refinement surgically edited (surgical_edit). */
  editedSection?: BriefSectionKey;
}

export type AdaptationStage = "idle" | "analyzing" | "loading-brand" | "synthesizing" | "ready" | "error";

export type VariantStatus = "queued" | "generating" | "ready";
export interface Variant {
  id: string;
  label: string;
  status: VariantStatus;
  headline: string;
  hue: number;
  /** Lineage back to the source concept (parent_concept_id). */
  parentConceptId: string;
}
