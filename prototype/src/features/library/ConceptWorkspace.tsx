import { useState } from "react";
import { ArrowLeft, ChevronDown, RefreshCw, Wand2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatRail } from "./ChatRail";
import { useConceptAdaptation } from "./hooks";
import { refineConcept } from "./api";
import { BRANDS } from "./data";
import type { Brand, BriefSectionKey, ChatMessage, ConceptBrief, Creative } from "./types";

// P2/P3 — Concept Workspace (interaction pick 4.3): two-pane (reference + adapted
// brief) with the chat rail on the right. Auto-adapts once on open (D6).
const BRIEF_SECTIONS: { key: BriefSectionKey; label: string }[] = [
  { key: "hook", label: "Hook" },
  { key: "coreMessage", label: "Core message" },
  { key: "visualDirection", label: "Visual direction" },
  { key: "layout", label: "Layout" },
  { key: "cta", label: "CTA" },
  { key: "copy", label: "Copy" },
  { key: "rationale", label: "Rationale" },
];

const STAGE_LABEL: Record<string, string> = {
  analyzing: "Analyzing reference creative…",
  "loading-brand": "Loading Brand DNA…",
  synthesizing: "Synthesizing adapted brief…",
};

export function ConceptWorkspace({
  creative,
  onBack,
  onGenerate,
}: {
  creative: Creative;
  onBack: () => void;
  onGenerate: (conceptId: string, brand: Brand) => void;
}) {
  // D5: adapt to the active brand from the TopBar switcher; block-with-picker if none.
  const [brandId, setBrandId] = useState<string | null>("brand-deel");
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const brand = BRANDS.find((b) => b.id === brandId) ?? null;

  const { stage, brief, readapt, patchSection } = useConceptAdaptation(creative, brand);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [refining, setRefining] = useState(false);
  const [flashSection, setFlashSection] = useState<BriefSectionKey | null>(null);

  const handleSend = async (text: string) => {
    if (!brief || !brand) return;
    const userMsg: ChatMessage = { id: `m-${Date.now()}`, role: "user", text };
    setMessages((p) => [...p, userMsg]);
    setRefining(true);
    const edit = await refineConcept(text, brief, brand);
    patchSection(edit.section, edit.value);
    setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", text: edit.note, editedSection: edit.section }]);
    setFlashSection(edit.section);
    setTimeout(() => setFlashSection(null), 1200);
    setRefining(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Workspace header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Library
          </Button>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold text-foreground">Concept Workspace</span>
          <Badge variant="secondary">v1 · latest brief</Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Brand switcher (D5) */}
          <div className="relative">
            <button
              onClick={() => setBrandMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm hover:bg-secondary"
            >
              {brand ? brand.name : "Select brand"}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            {brandMenuOpen && (
              <div className="absolute right-0 z-50 mt-1 w-44 rounded-md border bg-popover p-1 shadow-md animate-fade-in">
                {BRANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBrandId(b.id); setBrandMenuOpen(false); }}
                    className="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={readapt} disabled={!brand || stage !== "ready"}>
            <RefreshCw className="h-4 w-4" /> Re-adapt
          </Button>
          <Button size="sm" onClick={() => brand && onGenerate(creative.id, brand)} disabled={!brand || stage !== "ready"}>
            <Wand2 className="h-4 w-4" /> Generate Variants
          </Button>
        </div>
      </div>

      {/* No-brand block-with-picker (D5) */}
      {!brand ? (
        <div className="flex flex-1 items-center justify-center bg-[#FAFAFA]">
          <Card className="max-w-md p-6 text-center">
            <h3 className="text-base font-semibold">Pick a brand to adapt into</h3>
            <p className="mt-1 text-sm text-muted-foreground">Adaptation uses the active brand's DNA. Choose one to continue.</p>
            <div className="mt-4 flex justify-center gap-2">
              {BRANDS.map((b) => (
                <Button key={b.id} variant="outline" size="sm" onClick={() => setBrandId(b.id)}>{b.name}</Button>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: reference + adapted brief */}
          <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {/* Reference creative */}
              <Card className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div
                    className="h-28 w-40 shrink-0 rounded-lg"
                    style={{ background: `linear-gradient(135deg, hsl(${creative.hue} 70% 55%), hsl(${(creative.hue + 40) % 360} 65% 42%))` }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-text-theme-light-low-em">Reference creative</div>
                    <div className="mt-0.5 text-base font-semibold">{creative.brand} — {creative.headline}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{creative.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="secondary">{creative.platform}</Badge>
                      <Badge variant="secondary">{creative.format}</Badge>
                      <Badge variant="outline">{creative.angle}</Badge>
                      <Badge variant="outline">{creative.vertical}</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Adapted brief */}
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Adapted brief</h2>
                <Badge variant="low">{brand.name} DNA</Badge>
              </div>

              {stage !== "ready" && stage !== "error" ? (
                <Card className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {STAGE_LABEL[stage] ?? "Adapting…"}
                  </div>
                  <div className="mt-4 space-y-3">
                    {BRIEF_SECTIONS.slice(0, 5).map((s) => (
                      <div key={s.key} className="animate-shimmer rounded-md bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] p-3">
                        <div className="h-3 w-24 rounded bg-border/60" />
                        <div className="mt-2 h-3 w-full rounded bg-border/40" />
                      </div>
                    ))}
                  </div>
                </Card>
              ) : stage === "error" ? (
                <Card className="p-6">
                  <p className="text-sm text-destructive">Adaptation failed.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={readapt}>Retry</Button>
                </Card>
              ) : brief ? (
                <BriefView brief={brief} flashSection={flashSection} />
              ) : null}
            </div>
          </div>

          {/* Right: chat rail */}
          <ChatRail messages={messages} busy={refining} onSend={handleSend} />
        </div>
      )}
    </div>
  );
}

function BriefView({ brief, flashSection }: { brief: ConceptBrief; flashSection: BriefSectionKey | null }) {
  return (
    <Card className="divide-y">
      {BRIEF_SECTIONS.map((s) => (
        <div
          key={s.key}
          className={cnFlash(flashSection === s.key)}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-text-theme-light-low-em">{s.label}</div>
          <p className="mt-1 text-sm text-foreground">{brief[s.key]}</p>
        </div>
      ))}
    </Card>
  );
}

function cnFlash(active: boolean) {
  return `p-4 transition-colors ${active ? "bg-color-info-50" : ""}`;
}
