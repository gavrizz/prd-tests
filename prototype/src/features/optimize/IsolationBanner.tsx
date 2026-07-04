import { FlaskConical } from "lucide-react";

// Always-on isolation banner (AC 11). Amber register matching dara-front's
// simulation affordances. Copy lifted from SimulationModeCard's description.
export function IsolationBanner({ runId }: { runId?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-chocolate">
      <FlaskConical className="h-4 w-4 shrink-0" />
      <span className="font-medium">Simulation only —</span>
      <span>
        isolated from production. No writes to the live bidder, billing, pacing or reporting. Every CTR below is{" "}
        <span className="font-semibold">Simulated</span>.
      </span>
      {runId && (
        <span className="ml-auto rounded-md bg-white/70 px-2 py-0.5 font-geist text-[11px] text-foreground">{runId}</span>
      )}
    </div>
  );
}
