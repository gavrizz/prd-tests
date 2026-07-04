import { Check, Lock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SEGMENT_SEEDS } from "./data";
import type { RunProgress, Stage } from "./types";

// Running state (K2): horizontal 4-stage stepper + live round counter + Cancel run.
// Register borrowed from StatusPanel's running state.
const STAGES: { key: Stage; label: string }[] = [
  { key: "decompose", label: "Decompose" },
  { key: "source", label: "Source" },
  { key: "simulate", label: "Simulate" },
  { key: "optimize", label: "Optimize" },
];

export function RunPanel({ progress, onCancel }: { progress: RunProgress; onCancel: () => void }) {
  const activeIndex = STAGES.findIndex((s) => s.key === progress.stage);
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="live">Running</Badge>
            <span className="text-base font-semibold text-foreground">
              {progress.stage === "optimize"
                ? `Optimizing — round ${progress.round} / ${progress.maxRounds}`
                : "Preparing optimization…"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" /> Cancel run
          </Button>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center">
          {STAGES.map((s, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <div key={s.key} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-brand bg-color-info-50 text-brand",
                      !done && !active && "border-border text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={cn("text-xs", active ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {s.label}
                    {s.key === "optimize" && active ? ` ${progress.round}/${progress.maxRounds}` : ""}
                  </span>
                </div>
                {i < STAGES.length - 1 && <div className={cn("mx-2 h-0.5 flex-1", i < activeIndex ? "bg-primary" : "bg-border")} />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Read-only subtopic tree (AC 6) */}
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Topic decomposition</span>
          <Badge variant="secondary">Auto · read-only</Badge>
        </div>
        <ul className="space-y-1">
          {SEGMENT_SEEDS.map((s) => (
            <li key={s.id} className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-text-theme-light-med-em">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {s.subtopic}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
