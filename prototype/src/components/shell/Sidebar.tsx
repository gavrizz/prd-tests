import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";

// Replicates dara-front's left rail (see the real /campaigns shell): black wordmark,
// icon nav with a dark active pill, Alert Settings + user row pinned to the bottom.
export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: string };

export function Sidebar({
  items,
  activeId,
  onNavigate,
  footerLabel = "dev@loudecho.ai",
}: {
  items: NavItem[];
  activeId: string;
  onNavigate?: (id: string) => void;
  footerLabel?: string;
}) {
  return (
    <aside className="flex h-full w-[216px] shrink-0 flex-col border-r border-border bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-xl font-extrabold tracking-tight text-foreground" style={{ fontStretch: "condensed" }}>
          LOUDECHO
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-text-theme-light-low-em hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col gap-1 border-t border-border px-3 py-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
            D
          </div>
          <span className="truncate text-xs text-text-theme-light-low-em">{footerLabel}</span>
          <LogOut className="ml-auto h-3.5 w-3.5 text-text-theme-light-low-em" />
        </div>
      </div>
    </aside>
  );
}
