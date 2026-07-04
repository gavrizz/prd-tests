import { useState } from "react";
import { Building2, Megaphone, Image, LayoutGrid, BarChart2, ShieldCheck, Radio, Settings } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import type { NavItem } from "@/components/shell/Sidebar";
import { LibraryGallery } from "@/features/library/LibraryGallery";
import { ConceptWorkspace } from "@/features/library/ConceptWorkspace";
import { ReviewScreen } from "@/features/library/ReviewScreen";
import { useVariantGeneration } from "@/features/library/hooks";
import type { Brand, Creative } from "@/features/library/types";

// D4 — Library is a new primary nav item; select → Concept Workspace → /review.
// Routing is emulated with view state (no router dep needed for the slice).
const NAV: NavItem[] = [
  { id: "advertisers", label: "Advertisers", icon: Building2 },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "assets", label: "Assets", icon: Image },
  { id: "library", label: "Library", icon: LayoutGrid, badge: "New" },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "moderation", label: "Moderation", icon: ShieldCheck },
  { id: "conductor", label: "Conductor", icon: Radio },
  { id: "alerts", label: "Alert Settings", icon: Settings },
];

type View = { name: "gallery" } | { name: "workspace"; creative: Creative } | { name: "review"; conceptId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "gallery" });
  const { variants, start, reset } = useVariantGeneration();

  const openWorkspace = (creative: Creative) => setView({ name: "workspace", creative });
  const backToGallery = () => setView({ name: "gallery" });

  const handleGenerate = (conceptId: string, brand: Brand) => {
    reset();
    void start(conceptId, brand);
    setView({ name: "review", conceptId });
  };

  return (
    <AppShell nav={NAV} activeNavId="library">
      {view.name === "gallery" && <LibraryGallery onOpen={openWorkspace} />}
      {view.name === "workspace" && (
        <ConceptWorkspace creative={view.creative} onBack={backToGallery} onGenerate={handleGenerate} />
      )}
      {view.name === "review" && (
        <ReviewScreen variants={variants} conceptId={view.conceptId} onBack={() => setView({ name: "gallery" })} />
      )}
    </AppShell>
  );
}
