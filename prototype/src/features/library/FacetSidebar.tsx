import { cn } from "@/lib/utils";

// Interaction pick 4.2: left facet sidebar (filters). In production these live in
// URL query params for shareable/back-button-safe views (matches /review?view=).
export type Facets = {
  curation: "all" | "saved" | "hidden";
  vertical: string | null;
  platform: string | null;
  angle: string | null;
};

function Group({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="px-2 pt-3 text-[11px] font-semibold uppercase tracking-wide text-text-theme-light-low-em">
        {label}
      </div>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? null : opt)}
            className={cn(
              "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              active ? "bg-secondary font-medium text-foreground" : "text-text-theme-light-med-em hover:bg-secondary/60",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function FacetSidebar({
  facets,
  onChange,
  verticals,
  platforms,
  angles,
}: {
  facets: Facets;
  onChange: (f: Facets) => void;
  verticals: string[];
  platforms: string[];
  angles: string[];
}) {
  return (
    <div className="flex w-52 shrink-0 flex-col gap-0.5 border-r border-border bg-white px-3 py-2">
      <div className="flex flex-col gap-1">
        <div className="px-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-text-theme-light-low-em">
          Library
        </div>
        {(["all", "saved", "hidden"] as const).map((c) => (
          <button
            key={c}
            onClick={() => onChange({ ...facets, curation: c })}
            className={cn(
              "rounded-md px-2 py-1.5 text-left text-sm capitalize transition-colors",
              facets.curation === c ? "bg-foreground text-background" : "text-text-theme-light-med-em hover:bg-secondary/60",
            )}
          >
            {c === "all" ? "All creatives" : c}
          </button>
        ))}
      </div>
      <Group label="Vertical" options={verticals} value={facets.vertical} onChange={(v) => onChange({ ...facets, vertical: v })} />
      <Group label="Platform" options={platforms} value={facets.platform} onChange={(v) => onChange({ ...facets, platform: v })} />
      <Group label="Creative angle" options={angles} value={facets.angle} onChange={(v) => onChange({ ...facets, angle: v })} />
    </div>
  );
}
