import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

// Interaction pick 4.4: existing global chat rail scoped to this concept's session,
// plus the noted quick-action chips enhancement (Tone / Audience / CTA / Format).
const QUICK_ACTIONS = ["Make the CTA punchier", "Bolder hook", "Target enterprise", "Tighten the copy", "More scroll-stopping visual"];

export function ChatRail({
  messages,
  busy,
  onSend,
}: {
  messages: ChatMessage[];
  busy: boolean;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const submit = (value: string) => {
    const v = value.trim();
    if (!v || busy) return;
    onSend(v);
    setText("");
  };

  return (
    <div className="flex w-[340px] shrink-0 flex-col border-l border-border bg-white">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles className="h-4 w-4 text-brand" />
        <span className="text-sm font-semibold text-foreground">Refine concept</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Refine the adapted brief in plain language. Each instruction runs a surgical edit on one brief section.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground",
              )}
            >
              {m.text}
              {m.editedSection && (
                <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-brand">
                  edited · {m.editedSection}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="text-xs text-muted-foreground">Applying surgical edit…</div>}
      </div>
      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa}
              disabled={busy}
              onClick={() => submit(qa)}
              className="rounded-full border border-input bg-background px-2.5 py-1 text-xs text-text-theme-light-med-em transition-colors hover:bg-secondary disabled:opacity-50"
            >
              {qa}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); submit(text); }}
        >
          <Input placeholder="e.g. make the CTA punchier" value={text} onChange={(e) => setText(e.target.value)} disabled={busy} />
          <Button type="submit" size="icon" disabled={busy || !text.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
