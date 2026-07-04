import { cn } from "@/lib/utils";
import { Sidebar, type NavItem } from "./Sidebar";

// Sidebar + scrollable content column on the #FAFAFA canvas — matches the real
// dara-front shell captured from /campaigns.
export function AppShell({
  nav,
  activeNavId,
  onNavigate,
  children,
  contentClassName,
}: {
  nav: NavItem[];
  activeNavId: string;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAFAFA] text-foreground">
      <Sidebar items={nav} activeId={activeNavId} onNavigate={onNavigate} />
      <main className={cn("flex flex-1 flex-col overflow-y-auto", contentClassName)}>{children}</main>
    </div>
  );
}
