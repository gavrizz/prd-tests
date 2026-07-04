import { Bookmark, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Creative } from "./types";

// Interaction pick 4.1: responsive card — thumbnail, brand, format/platform badges,
// one-line summary, hover Save/Hide. Click → Concept Workspace.
export function CreativeCard({
  creative,
  onOpen,
  onToggleSave,
  onHide,
}: {
  creative: Creative;
  onOpen: (c: Creative) => void;
  onToggleSave: (c: Creative) => void;
  onHide: (c: Creative) => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <button onClick={() => onOpen(creative)} className="block text-left">
        <div
          className="relative flex aspect-[4/3] items-end p-3"
          style={{ background: `linear-gradient(135deg, hsl(${creative.hue} 70% 55%), hsl(${(creative.hue + 40) % 360} 65% 42%))` }}
        >
          <span className="rounded-md bg-black/25 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
            {creative.headline}
          </span>
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onToggleSave(creative); }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-foreground shadow hover:bg-white",
                creative.saved && "text-brand",
              )}
              title={creative.saved ? "Saved" : "Save"}
            >
              <Bookmark className="h-4 w-4" fill={creative.saved ? "currentColor" : "none"} />
            </span>
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onHide(creative); }}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-foreground shadow hover:bg-white"
              title="Hide"
            >
              <EyeOff className="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{creative.brand}</span>
          {creative.saved && <Badge variant="low">Saved</Badge>}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{creative.summary}</p>
        <div className="flex flex-wrap gap-1 pt-0.5">
          <Badge variant="secondary">{creative.platform}</Badge>
          <Badge variant="secondary">{creative.format}</Badge>
          <Badge variant="outline">{creative.angle}</Badge>
        </div>
      </div>
    </div>
  );
}
