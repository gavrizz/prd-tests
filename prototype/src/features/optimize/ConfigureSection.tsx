import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DEFAULT_CONFIG_OPTIONS } from "./data";
import type { ConvergenceSensitivity, RunConfig } from "./types";

// Configure section (K1 inline sectioned). Fields map to shadcn Select/Input/Tabs,
// same register as InputsPanel. Invalid targeting / no eligible ads disable Run.
export function ConfigureSection({ onRun }: { onRun: (config: RunConfig) => void }) {
  const [config, setConfig] = useState<RunConfig>({
    topic: DEFAULT_CONFIG_OPTIONS.topics[0],
    audience: DEFAULT_CONFIG_OPTIONS.audiences[0],
    geo: DEFAULT_CONFIG_OPTIONS.geos[0],
    vertical: DEFAULT_CONFIG_OPTIONS.verticals[0],
    device: DEFAULT_CONFIG_OPTIONS.devices[0],
    volumeMode: "direct",
    impressions: 20000,
    budget: 1000,
    cpm: 3.5,
    convergence: "medium",
    maxRounds: 5,
  });
  // Edge state 3 demo toggle: flip to 0 eligible ads to show the disabled Run reason.
  const [eligibleAds, setEligibleAds] = useState(128);
  const set = <K extends keyof RunConfig>(k: K, v: RunConfig[K]) => setConfig((c) => ({ ...c, [k]: v }));

  const totalTarget = config.volumeMode === "budget_cpm" ? Math.round((config.budget / config.cpm) * 1000) : config.impressions;
  const noEligible = eligibleAds === 0;
  const canRun = !noEligible && !!config.topic && !!config.audience;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Configure optimization</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Decompose a topic into segments, source variants, and auto-iterate the weak ones until convergence.
            </p>
          </div>
          <button
            onClick={() => setEligibleAds((n) => (n === 0 ? 128 : 0))}
            className="text-[11px] text-brand underline underline-offset-2"
          >
            demo: toggle eligible ads
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Topic">
            <SelectField value={config.topic} onChange={(v) => set("topic", v)} options={DEFAULT_CONFIG_OPTIONS.topics} placeholder="Select topic" />
          </Field>
          <Field label="Audience">
            <SelectField value={config.audience} onChange={(v) => set("audience", v)} options={DEFAULT_CONFIG_OPTIONS.audiences} placeholder="Select audience" />
          </Field>
          <Field label="Geography">
            <SelectField value={config.geo} onChange={(v) => set("geo", v)} options={DEFAULT_CONFIG_OPTIONS.geos} placeholder="Select geo" />
          </Field>
          <Field label="Vertical">
            <SelectField value={config.vertical} onChange={(v) => set("vertical", v)} options={DEFAULT_CONFIG_OPTIONS.verticals} placeholder="Select vertical" />
          </Field>
          <Field label="Device / placement (optional)">
            <SelectField value={config.device} onChange={(v) => set("device", v)} options={DEFAULT_CONFIG_OPTIONS.devices} placeholder="All devices" />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Simulation volume</Label>
            <Tabs value={config.volumeMode} onValueChange={(v) => set("volumeMode", v as RunConfig["volumeMode"])}>
              <TabsList>
                <TabsTrigger value="direct">Direct</TabsTrigger>
                <TabsTrigger value="budget_cpm">Budget + CPM</TabsTrigger>
              </TabsList>
            </Tabs>
            {config.volumeMode === "direct" ? (
              <Input type="number" className="max-w-[200px]" value={config.impressions} onChange={(e) => set("impressions", Number(e.target.value))} />
            ) : (
              <div className="flex items-center gap-2">
                <Input type="number" className="max-w-[140px]" value={config.budget} onChange={(e) => set("budget", Number(e.target.value))} placeholder="Budget $" />
                <Input type="number" className="max-w-[120px]" value={config.cpm} onChange={(e) => set("cpm", Number(e.target.value))} placeholder="CPM $" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">≈ {totalTarget.toLocaleString()} simulated impressions across segments.</p>
          </div>

          <div className="space-y-2">
            <Label>Convergence sensitivity</Label>
            <div className="flex w-fit rounded-lg border border-input p-0.5">
              {(["low", "medium", "high"] as ConvergenceSensitivity[]).map((c) => (
                <button
                  key={c}
                  onClick={() => set("convergence", c)}
                  className={cn(
                    "rounded-md px-3 py-1 text-sm capitalize transition-colors",
                    config.convergence === c ? "bg-foreground text-background" : "text-text-theme-light-med-em hover:bg-secondary",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Label className="text-xs text-muted-foreground">Max rounds (hard cap)</Label>
              <Stepper value={config.maxRounds} min={1} max={5} onChange={(v) => set("maxRounds", v)} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button onClick={() => onRun(config)} disabled={!canRun}>
            <Play className="h-4 w-4" /> Run optimization
          </Button>
          <span className={cn("text-xs", noEligible ? "text-destructive" : "text-muted-foreground")}>
            {noEligible ? "No eligible ads for this targeting" : `${eligibleAds} eligible ads for this targeting`}
          </span>
        </div>
      </Card>

      {/* Empty results placeholder (edge state 2) */}
      <Card className="flex h-40 items-center justify-center border-dashed">
        <p className="text-sm text-muted-foreground">Run an optimization to see segment performance here.</p>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center rounded-md border border-input">
      <button className="px-2 py-1 text-sm hover:bg-secondary disabled:opacity-40" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button className="px-2 py-1 text-sm hover:bg-secondary disabled:opacity-40" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
