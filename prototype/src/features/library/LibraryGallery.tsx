import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreativeCard } from "./CreativeCard";
import { FacetSidebar, type Facets } from "./FacetSidebar";
import { fetchCreatives } from "./api";
import { SEED_CREATIVES } from "./data";
import type { Creative } from "./types";

// P1 — Creative Library gallery. Facet sidebar + keyword search + 4-up grid.
export function LibraryGallery({ onOpen }: { onOpen: (c: Creative) => void }) {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState<Facets>({ curation: "all", vertical: null, platform: null, angle: null });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchCreatives(SEED_CREATIVES).then((c) => {
      if (alive) { setCreatives(c); setLoading(false); }
    });
    return () => { alive = false; };
  }, []);

  const verticals = useMemo(() => [...new Set(SEED_CREATIVES.map((c) => c.vertical))].sort(), []);
  const platforms = useMemo(() => [...new Set(SEED_CREATIVES.map((c) => c.platform))].sort(), []);
  const angles = useMemo(() => [...new Set(SEED_CREATIVES.map((c) => c.angle))].sort(), []);

  const filtered = useMemo(() => {
    return creatives.filter((c) => {
      if (facets.curation === "saved" && !c.saved) return false;
      if (facets.curation === "hidden" && !c.hidden) return false;
      if (facets.curation === "all" && c.hidden) return false;
      if (facets.vertical && c.vertical !== facets.vertical) return false;
      if (facets.platform && c.platform !== facets.platform) return false;
      if (facets.angle && c.angle !== facets.angle) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!(`${c.brand} ${c.summary} ${c.headline} ${c.niche}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [creatives, facets, query]);

  const toggleSave = (c: Creative) => setCreatives((p) => p.map((x) => (x.id === c.id ? { ...x, saved: !x.saved } : x)));
  const hide = (c: Creative) => setCreatives((p) => p.map((x) => (x.id === c.id ? { ...x, hidden: true, saved: false } : x)));
  const clearFilters = () => { setFacets({ curation: "all", vertical: null, platform: null, angle: null }); setQuery(""); };
  const visibleCount = creatives.filter((c) => !c.hidden).length;

  return (
    <div className="flex flex-1 overflow-hidden">
      <FacetSidebar facets={facets} onChange={setFacets} verticals={verticals} platforms={platforms} angles={angles} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-3 border-b border-border bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Creative Library</h1>
              <p className="text-xs text-text-theme-light-low-em">
                SeedProvider · ForeplayProvider off · {visibleCount} proven creatives
              </p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search brand, niche, angle…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Loading creatives from SeedProvider…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-muted-foreground">
              <ImageOff className="h-7 w-7" />
              <p className="text-sm">No creatives match these filters.</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c) => (
                <CreativeCard key={c.id} creative={c} onOpen={onOpen} onToggleSave={toggleSave} onHide={hide} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
