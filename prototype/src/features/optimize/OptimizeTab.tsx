import { IsolationBanner } from "./IsolationBanner";
import { ConfigureSection } from "./ConfigureSection";
import { RunPanel } from "./RunPanel";
import { ResultsSection } from "./ResultsSection";
import { useOptimizationRun } from "./useOptimizationRun";

// Optimize tab — single-page sectioned flow (Configure → Run → Results). Additive,
// isolated frontend on top of Simulation Mode. Mounts from campaigns/[campaignId]
// gated on isSimulated, appended to campaignTabs after Bulk Test.
export function OptimizeTab() {
  const run = useOptimizationRun();
  return (
    <div className="space-y-4">
      <IsolationBanner runId={run.result?.runId} />
      {run.status === "idle" && <ConfigureSection onRun={run.run} />}
      {run.status === "running" && <RunPanel progress={run.progress} onCancel={run.cancel} />}
      {(run.status === "complete" || run.status === "saved") && run.result && (
        <ResultsSection
          result={run.result}
          selected={run.selected}
          approved={run.approved}
          reviewQueueCount={run.reviewQueueCount}
          saved={run.status === "saved"}
          onToggleSelect={run.toggleSelect}
          onSetAll={run.setAllSelected}
          onApprove={run.approveSelected}
          onSave={run.saveSnapshot}
        />
      )}
    </div>
  );
}
