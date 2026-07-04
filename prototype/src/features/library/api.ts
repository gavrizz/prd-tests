import type { Brand, ConceptBrief, Creative, BriefSectionKey, Variant } from "./types";

// ---------------------------------------------------------------------------
// echo-studio backend SEAM (stubbed).
//
// In production these resolve against echo-studio's Creative Intelligence Engine:
//   fetchCreatives  → CreativeProvider.list()   (SeedProvider now, ForeplayProvider off)
//   adaptConcept    → concept_from_brief(reference, load_brand(brandId))
//   refineConcept   → surgical_edit(session, instruction)
//   generateVariants→ create campaign+session → concept_executor → surgical_edit
//
// Everything here is illustrative/deterministic so the slice runs with no network.
// Swap these four functions for the real endpoints when merging into echo-studio.
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCreatives(all: Creative[]): Promise<Creative[]> {
  await delay(350);
  return all;
}

/** concept_from_brief(reference, brandDNA) — synthesizes the v1 brief. */
export async function adaptConcept(creative: Creative, brand: Brand): Promise<ConceptBrief> {
  await delay(250);
  return {
    hook: `${brand.name}: ${creative.headline.replace(/\.$/, "")} — for teams that can't wait.`,
    coreMessage: `Reframe "${creative.summary}" in ${brand.name}'s voice (${brand.tone.toLowerCase()}), aimed at ${brand.audience.toLowerCase()}.`,
    visualDirection: `Adopt reference ${creative.format} ${creative.platform} composition; recolor to ${brand.name} palette (${brand.palette.join(", ")}). Keep the ${creative.angle} angle.`,
    layout: `Above-the-fold hook, single focal product moment, ${brand.name} logo lockup bottom-left, CTA pill bottom-right.`,
    cta: creative.cta,
    copy: `${creative.bodyCopy} Built for ${brand.audience.split(" ").slice(0, 3).join(" ")}.`,
    rationale: `Leans on the proven ${creative.angle} structure from ${creative.brand}; emphasizes ${brand.positives}; avoids ${brand.negatives}.`,
  };
}

/** surgical_edit — returns the rewritten section + a human note for the chat rail. */
export async function refineConcept(
  instruction: string,
  brief: ConceptBrief,
  brand: Brand,
): Promise<{ section: BriefSectionKey; value: string; note: string }> {
  await delay(650);
  const lower = instruction.toLowerCase();
  if (lower.includes("cta") || lower.includes("punch")) {
    return { section: "cta", value: "Start free — live in minutes", note: "Tightened the CTA to be punchier and action-first." };
  }
  if (lower.includes("hook") || lower.includes("bold") || lower.includes("attention")) {
    return { section: "hook", value: `Stop losing hours. ${brand.name} does it in one click.`, note: "Rewrote the hook to lead with the pain and the payoff." };
  }
  if (lower.includes("audience") || lower.includes("enterprise") || lower.includes("smb")) {
    return { section: "coreMessage", value: `${brief.coreMessage} Tuned for enterprise buyers evaluating on compliance and control.`, note: "Retargeted the core message toward an enterprise audience." };
  }
  if (lower.includes("short") || lower.includes("tighten") || lower.includes("concise")) {
    return { section: "copy", value: `${brand.name}: ${brief.cta.toLowerCase()}, no busywork.`, note: "Cut the body copy to one tight line." };
  }
  return { section: "visualDirection", value: `${brief.visualDirection} Add subtle motion on the focal moment to stop the scroll.`, note: "Nudged the visual direction to be more scroll-stopping." };
}

/** Kicks off variant generation; returns the queued variant set (lineage attached). */
export async function generateVariants(conceptId: string, brand: Brand): Promise<Variant[]> {
  await delay(300);
  const angles = ["Hook-forward", "Social proof", "Offer-led", "Founder voice"];
  return angles.map((label, i) => ({
    id: `${conceptId}-v${i + 1}`,
    label,
    status: "queued" as const,
    headline: `${brand.name} — ${label} cut`,
    hue: (i * 47 + 210) % 360,
    parentConceptId: conceptId,
  }));
}
