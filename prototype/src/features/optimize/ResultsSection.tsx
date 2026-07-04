import { useState } from "react";
import { Download, Save, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SegmentSheet } from "./SegmentSheet";
import type { OptimizeResult, Segment } from "./types";

// Results (Q7): pinned insights summary + segment performance table + bulk-approve
// toolbar (mirrors the Drafts tab's multi-select + Publish (N) pattern).
export function ResultsSection({
  result,
  selected,
  approved,
  reviewQueueCount,
  saved,
  onToggleSelect,
  onSetAll,
  onApprove,
  onSave,
}: {
  result: OptimizeResult;
  selected: Set<string>;
  approved: Set<string>;
  reviewQueueCount: number;
  saved: boolean;
  onToggleSelect: (id: string) => void;
  onSetAll: (ids: string[], on: boolean) => void;
  onApprove: () => void;
  onSave: () => void;
}) {
  const [openSegment, setOpenSegment] = useState<Segment | null>(null);
  const ids = result.segments.map((s) => s.id);
  const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
  const { insights } = result;

  return (
    <div className="space-y-4">
      {/* Complete banner actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {result.terminalReason === "converged" ? `Converged in ${result.rounds} rounds` : `Stopped at ${result.rounds}-round cap`}
          </Badge>
          {saved && <Badge variant="live">Saved snapshot (read-only)</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={saved}><Download className="h-4 w-4" /> Export CSV / JSON</Button>
          <Button size="sm" onClick={onSave} disabled={saved}><Save className="h-4 w-4" /> Save snapshot</Button>
        </div>
      </div>

      {/* Pinned insights summary */}
      <Card className="border-brand/30 bg-color-info-50 p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-5 w-5 text-brand" />
          <div>
            <div className="text-sm font-semibold text-foreground">
              Blended simulated CTR up {insights.blendedUpliftPct}% after optimization
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip>{insights.segmentCount} segments</Chip>
              <Chip>{insights.variantsExisting} existing · {insights.variantsGenerated} generated</Chip>
              <Chip>{insights.underperformersReplaced} underperformers replaced</Chip>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk-approve toolbar */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2">
        <div className="flex items-center gap-3 text-sm">
          <Checkbox checked={allSelected} onCheckedChange={(on) => onSetAll(ids, on)} aria-label="Select all segments" />
          <span className="text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selected` : "Select segments to approve"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Review queue: <span className="font-semibold text-foreground">{reviewQueueCount}</span></span>
          <Button size="sm" onClick={onApprove} disabled={selected.size === 0 || saved}>
            Approve selected{selected.size > 0 ? ` (${selected.size})` : ""}
          </Button>
        </div>
      </div>

      {/* Segment performance table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Best variant</TableHead>
              <TableHead>Simulated CTR</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.segments.map((s) => {
              const isSelected = selected.has(s.id);
              const isApproved = approved.has(s.id);
              return (
                <TableRow
                  key={s.id}
                  className={cn("cursor-pointer", isSelected && "bg-color-info-50")}
                  onClick={() => setOpenSegment(s)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(s.id)} aria-label={`Select ${s.subtopic}`} />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {s.subtopic}
                      {s.lowSample && <Badge variant="medium">Low sample</Badge>}
                      {isApproved && <Badge variant="live">Approved</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{s.impressions.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="max-w-[180px] truncate text-sm">{s.bestVariant.copy}</span>
                      <Badge variant={s.bestVariant.source === "GENERATED" ? "low" : "secondary"}>{s.bestVariant.source}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold tabular-nums">{s.simulatedCtr}%</span>
                    <span className="ml-1 rounded bg-secondary px-1 text-[10px] font-semibold text-muted-foreground">SIM</span>
                  </TableCell>
                  <TableCell className="max-w-[240px] text-sm text-muted-foreground">
                    <span className="line-clamp-1">{s.recommendation}</span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-brand">View</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <SegmentSheet
        segment={openSegment}
        open={!!openSegment}
        selected={openSegment ? selected.has(openSegment.id) : false}
        approved={openSegment ? approved.has(openSegment.id) : false}
        onOpenChange={(o) => !o && setOpenSegment(null)}
        onToggleSelect={() => openSegment && onToggleSelect(openSegment.id)}
      />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-foreground">{children}</span>;
}
