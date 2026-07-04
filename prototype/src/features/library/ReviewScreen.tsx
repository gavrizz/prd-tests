import { ArrowLeft, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Variant } from "./types";

// D9 handoff — the existing /review surface. Generate Variants creates a
// campaign+session and enqueues surgical_edit; variants stream in here. Zero
// net-new variant UI in production — this is a faithful stand-in for /review.
export function ReviewScreen({
  variants,
  conceptId,
  onBack,
}: {
  variants: Variant[];
  conceptId: string;
  onBack: () => void;
}) {
  const ready = variants.filter((v) => v.status === "ready").length;
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAFAFA]">
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Workspace
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold text-foreground">Review — variant generation</span>
          <Badge variant="secondary" className="font-geist">parent · {conceptId}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">{ready} / {variants.length} ready</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="relative flex aspect-[4/5] items-end p-3" style={{ background: `linear-gradient(135deg, hsl(${v.hue} 70% 55%), hsl(${(v.hue + 40) % 360} 65% 42%))` }}>
                {v.status !== "ready" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm">
                    {v.status === "generating" ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Clock className="h-6 w-6 text-white/80" />
                    )}
                  </div>
                )}
                <span className="rounded-md bg-black/25 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">{v.headline}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-sm font-medium">{v.label}</span>
                {v.status === "ready" ? (
                  <Badge variant="live"><CheckCircle2 className="mr-1 h-3 w-3" /> Ready</Badge>
                ) : v.status === "generating" ? (
                  <Badge variant="low">Generating</Badge>
                ) : (
                  <Badge variant="secondary">Queued</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
