import type { Segment, VariantRank } from "./types";

// Illustrative data only (Q6 deferred). Hand-authored subtopics/variants/CTRs —
// no real decomposition/generation/simulation engine. Build decides real-vs-stub.

const v = (
  id: string,
  label: string,
  source: VariantRank["source"],
  copy: string,
  ctr: number,
): VariantRank => ({ id, label, source, copy, simulatedCtr: ctr });

// Base segment blueprints for the demo topic. `engine.ts` derives round-by-round
// CTRs from these; the "improvedVariant" copy is the generated fix for the weak one.
export interface SegmentSeed {
  id: string;
  subtopic: string;
  impressions: number;
  existing: VariantRank[];
  weakCopy: string;
  fixCopy: string;
  recommendation: string;
}

export const SEGMENT_SEEDS: SegmentSeed[] = [
  {
    id: "seg-onboarding",
    subtopic: "Onboarding & setup",
    impressions: 8400,
    existing: [
      v("va", "Time-to-value", "EXISTING", "Live in 5 minutes — no IT ticket required.", 3.1),
      v("vb", "Guided setup", "EXISTING", "A setup wizard that does the work for you.", 2.6),
    ],
    weakCopy: "Get started with our onboarding.",
    fixCopy: "From signup to first win in under 10 minutes.",
    recommendation: "Promote the time-to-value variant; retire the generic onboarding line.",
  },
  {
    id: "seg-integrations",
    subtopic: "Integrations",
    impressions: 6100,
    existing: [v("vc", "Connect stack", "EXISTING", "Plugs into the 40 tools you already use.", 2.9)],
    weakCopy: "We integrate with many apps.",
    fixCopy: "Two-way sync with Slack, HubSpot and 40+ tools.",
    recommendation: "Generated a specific-integrations variant — outperformed the vague line.",
  },
  {
    id: "seg-pricing",
    subtopic: "Pricing & ROI",
    impressions: 5200,
    existing: [v("vd", "Savings-led", "EXISTING", "Teams cut spend 22% in the first quarter.", 3.4)],
    weakCopy: "Affordable plans for every team.",
    fixCopy: "Pays for itself in week one — see the math.",
    recommendation: "ROI framing beat the price framing; keep the savings hook.",
  },
  {
    id: "seg-security",
    subtopic: "Security & compliance",
    impressions: 4300,
    existing: [v("ve", "Trust badges", "EXISTING", "SOC 2 Type II. GDPR. Your data stays yours.", 2.7)],
    weakCopy: "Enterprise-grade security.",
    fixCopy: "SOC 2 + SSO on every plan — not just enterprise.",
    recommendation: "Concrete compliance beats the abstract claim for this segment.",
  },
  {
    id: "seg-collab",
    subtopic: "Team collaboration",
    impressions: 720, // < ~1,000 → Low sample
    existing: [v("vf", "One workspace", "EXISTING", "Your whole team on one page, in real time.", 3.0)],
    weakCopy: "Collaborate better together.",
    fixCopy: "Comments, mentions and live cursors — no more email threads.",
    recommendation: "Directional only — low sample; re-run with more volume before acting.",
  },
];

export const DEFAULT_CONFIG_OPTIONS = {
  topics: ["Project management software", "Payroll & HR platform", "Cybersecurity suite"],
  audiences: ["Ops leaders", "Finance leaders", "IT admins", "Founders"],
  geos: ["United States", "United Kingdom", "DACH", "Global"],
  verticals: ["SaaS", "Fintech", "Security", "Productivity"],
  devices: ["All devices", "Mobile", "Desktop", "In-app"],
};
