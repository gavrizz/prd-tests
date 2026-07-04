import { useCallback, useRef, useState } from "react";
import { runOptimization } from "./engine";
import type { OptimizeResult, RunConfig, RunProgress, RunStatus } from "./types";

// Run-lifecycle state machine (matches flows §run-lifecycle): idle → running →
// complete → reviewing (selection/approval) → saved. Cancel → idle (no snapshot).
// The one-shot pipeline + converge-or-cap live behind runOptimization().
export function useOptimizationRun() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState<RunProgress>({ stage: "decompose", round: 0, maxRounds: 5 });
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const cancelRef = useRef(false);

  const run = useCallback(async (config: RunConfig) => {
    cancelRef.current = false;
    setResult(null);
    setSelected(new Set());
    setApproved(new Set());
    setStatus("running");
    setProgress({ stage: "decompose", round: 0, maxRounds: config.maxRounds });
    const res = await runOptimization(config, {
      onStage: (stage) => setProgress((p) => ({ ...p, stage })),
      onRound: (round) => setProgress((p) => ({ ...p, round })),
      isCancelled: () => cancelRef.current,
    });
    if (res.terminalReason === "cancelled") {
      setStatus("idle");
      return;
    }
    setResult(res);
    setStatus("complete");
  }, []);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setSelected(new Set());
    setApproved(new Set());
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const setAllSelected = useCallback((ids: string[], on: boolean) => {
    setSelected(on ? new Set(ids) : new Set());
  }, []);

  // Bulk approve (Q8): staging within Simulation Mode only — never live. Re-approve
  // is a no-op (set union); selection clears after approving.
  const approveSelected = useCallback(() => {
    setApproved((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
  }, [selected]);

  const saveSnapshot = useCallback(() => setStatus("saved"), []);

  return {
    status,
    progress,
    result,
    selected,
    approved,
    reviewQueueCount: approved.size,
    run,
    cancel,
    reset,
    toggleSelect,
    setAllSelected,
    approveSelected,
    saveSnapshot,
  };
}
