import * as React from "react";
import { cn } from "@/lib/utils";

// Stand-in for dara-front's Radix `Tabs` (used by InputsPanel's Direct/Budget+CPM
// toggle). Same TabsList / TabsTrigger token classes.
type TabsCtx = { value: string; onValueChange: (v: string) => void };
const Ctx = React.createContext<TabsCtx | null>(null);

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  disabled,
  children,
}: {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(Ctx)!;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        active ? "bg-background text-foreground shadow" : "hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
