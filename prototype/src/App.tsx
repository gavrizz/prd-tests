import { useState } from "react";
import { Building2, Megaphone, Image, BarChart2, ShieldCheck, Radio, Settings, ChevronDown, Clock, FlaskConical } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import type { NavItem } from "@/components/shell/Sidebar";
import { TabMenu, type Tab } from "@/components/shell/TabMenu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OptimizeTab } from "@/features/optimize/OptimizeTab";

const NAV: NavItem[] = [
  { id: "advertisers", label: "Advertisers", icon: Building2 },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "assets", label: "Assets", icon: Image },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "moderation", label: "Moderation", icon: ShieldCheck },
  { id: "conductor", label: "Conductor", icon: Radio },
  { id: "alerts", label: "Alert Settings", icon: Settings },
];

// Optimize appended after Bulk Test, gated on isSimulated (AC 1). Only Optimize is
// in scope for this slice; other tabs are inert placeholders.
const TABS: Tab[] = [
  { id: "overview", label: "Overview" },
  { id: "settings", label: "Settings" },
  { id: "ads", label: "Ads" },
  { id: "drafts", label: "Drafts" },
  { id: "brandSafety", label: "Safety" },
  { id: "insights", label: "Insights" },
  { id: "bulk-test", label: "Bulk Test" },
  { id: "optimize", label: "Optimize" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("optimize");

  return (
    <AppShell nav={NAV} activeNavId="campaigns">
      <div className="flex-1 p-5">
        <Card className="rounded-xl">
          {/* Campaign detail header — replicates campaigns/[campaignId]/page.tsx */}
          <div className="border-b border-border px-5 pt-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Q3 SaaS — Simulated</h2>
                <button className="rounded-md p-1 hover:bg-secondary"><ChevronDown className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Flight Dates</span>
                  <span className="font-semibold">Jul 1, 2026 – Ongoing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Budget</span>
                  <span className="font-semibold">$25,000</span>
                </div>
                <Badge variant="low" className="gap-1 px-2.5 py-1">
                  <FlaskConical className="h-3 w-3" /> Simulation mode
                </Badge>
                <span className="flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-700">
                  <Clock className="h-3.5 w-3.5" /> Paused
                </span>
              </div>
            </div>
            <TabMenu tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab panel */}
          <div className="p-5">
            {activeTab === "optimize" ? (
              <OptimizeTab />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                “{TABS.find((t) => t.id === activeTab)?.label}” is out of scope for this prototype slice — see prototype/README.md.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
