import { useCallback, useEffect, useRef, useState } from "react";
import type { AdaptationStage, Brand, ConceptBrief, Creative, Variant } from "./types";
import { adaptConcept, generateVariants } from "./api";

// Auto-adaptation loop (D6): runs once on workspace open, streaming through the
// stages (analyzing → loading-brand → synthesizing → ready). Re-adapt re-runs it.
export function useConceptAdaptation(creative: Creative | null, brand: Brand | null) {
  const [stage, setStage] = useState<AdaptationStage>("idle");
  const [brief, setBrief] = useState<ConceptBrief | null>(null);
  const runId = useRef(0);

  const run = useCallback(async () => {
    if (!creative || !brand) return;
    const id = ++runId.current;
    setBrief(null);
    setStage("analyzing");
    await sleep(500);
    if (id !== runId.current) return;
    setStage("loading-brand");
    await sleep(500);
    if (id !== runId.current) return;
    setStage("synthesizing");
    try {
      const result = await adaptConcept(creative, brand);
      if (id !== runId.current) return;
      setBrief(result);
      setStage("ready");
    } catch {
      if (id === runId.current) setStage("error");
    }
  }, [creative, brand]);

  useEffect(() => {
    if (creative && brand) void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creative?.id, brand?.id]);

  const patchSection = useCallback((section: keyof ConceptBrief, value: string) => {
    setBrief((prev) => (prev ? { ...prev, [section]: value } : prev));
  }, []);

  return { stage, brief, readapt: run, patchSection };
}

// Variant generation loop: queued variants flip queued → generating → ready on a
// timer, mimicking the /review stream fed by concept_executor + surgical_edit.
export function useVariantGeneration() {
  const [variants, setVariants] = useState<Variant[]>([]);

  const start = useCallback(async (conceptId: string, brand: Brand) => {
    const queued = await generateVariants(conceptId, brand);
    setVariants(queued);
    queued.forEach((v, i) => {
      setTimeout(() => setVariants((p) => p.map((x) => (x.id === v.id ? { ...x, status: "generating" } : x))), 400 + i * 700);
      setTimeout(() => setVariants((p) => p.map((x) => (x.id === v.id ? { ...x, status: "ready" } : x))), 1400 + i * 900);
    });
  }, []);

  const reset = useCallback(() => setVariants([]), []);
  return { variants, start, reset };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
