import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Lightweight, dependency-free stand-in for dara-front's Radix `Select`. Same
// compound API (Select / SelectTrigger / SelectValue / SelectContent / SelectItem)
// and the same trigger/popover token classes, so feature code ports 1:1 to the
// real shadcn primitive on merge.
type SelectCtx = {
  value?: string;
  onValueChange?: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  disabled?: boolean;
  labels: React.MutableRefObject<Record<string, string>>;
};
const Ctx = React.createContext<SelectCtx | null>(null);
const useSelect = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("Select.* must be used within <Select>");
  return c;
};

export function Select({
  value,
  onValueChange,
  disabled,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const labels = React.useRef<Record<string, string>>({});
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return (
    <Ctx.Provider value={{ value, onValueChange, open, setOpen, disabled, labels }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function SelectTrigger({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen, disabled } = useSelect();
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, labels } = useSelect();
  const label = value ? labels.current[value] ?? value : undefined;
  return <span className={cn(!label && "text-muted-foreground")}>{label ?? placeholder}</span>;
}

export function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useSelect();
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-72 w-full min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-fade-in",
        !open && "hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: selected, onValueChange, setOpen, labels } = useSelect();
  React.useEffect(() => {
    if (typeof children === "string") labels.current[value] = children;
  }, [value, children, labels]);
  const isSelected = selected === value;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        isSelected && "font-medium",
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}
