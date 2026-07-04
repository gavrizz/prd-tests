import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Segment } from "./types";

// Segment drill-down (K3): right-side Sheet — variant ranking, Before/After CTR
// compare + delta chip, underperformer → generated fix, recommendation.
export function SegmentSheet({
  segment,
  open,
  selected,
  approved,
  onOpenChange,
  onToggleSelect,
}: {
  segment: Segment | null;
  open: boolean;
  selected: boolean;
  approved: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleSelect: () => void;
}) {
  if (!segment) return null;
  const before = segment.weakVariant.simulatedCtr;
  const after = segment.improvedVariant.simulatedCtr;
  const delta = before > 0 ? Math.round(((after - before) / before) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent onClose={() => onOpenChange(false)}>
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>{segment.subtopic}</SheetTitle>
            {segment.lowSample && <Badge variant="medium">Low sample</Badge>}
            {approved && <Badge variant="live">Approved</Badge>}
          </div>
          <SheetDescription>
            {segment.impressions.toLocaleString()} simulated impressions · blended {segment.simulatedCtr}% CTR
            <span className="ml-1 rounded bg-secondary px-1 text-[10px] font-semibold">SIM</span>
          </SheetDescription>
        </SheetHeader>

        {/* Variant ranking */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-theme-light-low-em">Variant ranking</div>
          <div className="space-y-1.5">
            {segment.variants.map((v, i) => (
              <div key={v.id} className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
                <span className="flex-1 truncate text-sm">{v.copy}</span>
                <Badge variant={v.source === "GENERATED" ? "low" : "secondary"}>{v.source}</Badge>
                <span className="w-14 text-right text-sm font-medium tabular-nums">{v.simulatedCtr}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Before / After */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-theme-light-low-em">
            Underperformer → generated fix
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <div className="text-[11px] font-medium uppercase text-muted-foreground">Before</div>
              <p className="mt-1 text-sm text-muted-foreground line-through">{segment.weakVariant.copy}</p>
              <div className="mt-2 text-lg font-semibold tabular-nums">{before.toFixed(1)}%</div>
            </div>
            <div className="rounded-lg border border-brand/40 bg-color-info-50 p-3">
              <div className="flex items-center gap-1 text-[11px] font-medium uppercase text-brand">
                <Sparkles className="h-3 w-3" /> After
              </div>
              <p className="mt-1 text-sm text-foreground">{segment.improvedVariant.copy}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-semibold tabular-nums">{after.toFixed(1)}%</span>
                <Badge variant="live">+{delta}%</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <ArrowRight className="h-3.5 w-3.5" /> Recommendation
          </div>
          <p className="mt-1 text-sm text-text-theme-light-med-em">{segment.recommendation}</p>
        </div>

        {/* Selection footer → bulk review queue */}
        <div className={cn("mt-auto flex items-center justify-between rounded-lg border border-border p-3", selected && "bg-color-info-50")}>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={selected} onCheckedChange={onToggleSelect} aria-label="Add segment to review" />
            Add to review selection
          </label>
          <Button size="sm" onClick={onToggleSelect} variant={selected ? "outline" : "default"}>
            {selected ? "Selected" : "Select segment"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
