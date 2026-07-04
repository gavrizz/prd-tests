import type { Brand, Creative } from "./types";

// SeedProvider fixtures (D3): drive the demo with no live API on the hot path.
// ForeplayProvider would be coded-but-off in production.
export const SEED_CREATIVES: Creative[] = [
  { id: "cr-01", brand: "Notion", vertical: "SaaS", niche: "Productivity", platform: "Meta", format: "1:1", language: "EN", cta: "Try free", angle: "Problem/Solution", summary: "One workspace replacing five scattered tools.", headline: "Your whole team, one page.", bodyCopy: "Docs, wikis and projects finally in one place. Stop tab-hopping.", hue: 222 },
  { id: "cr-02", brand: "Deel", vertical: "SaaS", niche: "HR / Payroll", platform: "TikTok", format: "9:16", language: "EN", cta: "Book a demo", angle: "Social Proof", summary: "Hire anyone, anywhere, compliantly in minutes.", headline: "Global payroll in 1 click.", bodyCopy: "35,000 companies pay their global teams with Deel. Compliance handled.", hue: 265 },
  { id: "cr-03", brand: "Oura", vertical: "Wearables", niche: "Health", platform: "YouTube", format: "16:9", language: "EN", cta: "Shop now", angle: "Founder Story", summary: "The ring that reads your recovery overnight.", headline: "Sleep smarter.", bodyCopy: "Wake to a readiness score built from your real recovery data.", hue: 12 },
  { id: "cr-04", brand: "Ramp", vertical: "Fintech", niche: "Spend Mgmt", platform: "Meta", format: "4:5", language: "EN", cta: "Get started", angle: "Comparison", summary: "Corporate cards that actually cut your spend.", headline: "Finance that saves you money.", bodyCopy: "Ramp customers save 5% and close books 8x faster.", hue: 150 },
  { id: "cr-05", brand: "Duolingo", vertical: "EdTech", niche: "Language", platform: "TikTok", format: "9:16", language: "EN", cta: "Start learning", angle: "Offer", summary: "15 minutes a day to a new language.", headline: "The owl is watching.", bodyCopy: "Bite-sized lessons that actually stick. Streaks that keep you honest.", hue: 95 },
  { id: "cr-06", brand: "Figma", vertical: "SaaS", niche: "Design", platform: "YouTube", format: "16:9", language: "EN", cta: "Try free", angle: "Problem/Solution", summary: "Design and ship in one shared canvas.", headline: "Nothing great is made alone.", bodyCopy: "From first sketch to final handoff, your team stays in one file.", hue: 320 },
  { id: "cr-07", brand: "Whoop", vertical: "Wearables", niche: "Fitness", platform: "Meta", format: "1:1", language: "EN", cta: "Join now", angle: "Social Proof", summary: "Know exactly how hard to train today.", headline: "Unlock your body.", bodyCopy: "Strain, recovery and sleep coaching on your wrist 24/7.", hue: 200 },
  { id: "cr-08", brand: "Shopify", vertical: "eCommerce", niche: "Commerce", platform: "Google", format: "1:1", language: "EN", cta: "Start trial", angle: "Offer", summary: "Launch your store this weekend.", headline: "Sell here, there, everywhere.", bodyCopy: "One platform for online, in-person and social selling.", hue: 140 },
  { id: "cr-09", brand: "Linear", vertical: "SaaS", niche: "Dev Tools", platform: "Meta", format: "4:5", language: "EN", cta: "Get started", angle: "Comparison", summary: "The issue tracker built for speed.", headline: "Ship like the best.", bodyCopy: "Purpose-built for modern software teams. Fast by default.", hue: 245 },
  { id: "cr-10", brand: "Calm", vertical: "Wellness", niche: "Mindfulness", platform: "TikTok", format: "9:16", language: "EN", cta: "Try free", angle: "Founder Story", summary: "Sleep stories that quiet a racing mind.", headline: "Press pause on your day.", bodyCopy: "Guided meditations and sleep stories for calmer nights.", hue: 205 },
  { id: "cr-11", brand: "Webflow", vertical: "SaaS", niche: "No-code", platform: "YouTube", format: "16:9", language: "EN", cta: "Build free", angle: "Problem/Solution", summary: "Design custom sites without the dev queue.", headline: "Build without limits.", bodyCopy: "Visual development that ships production-grade sites.", hue: 265 },
  { id: "cr-12", brand: "Athletic Greens", vertical: "CPG", niche: "Supplements", platform: "Meta", format: "1:1", language: "EN", cta: "Subscribe", angle: "Offer", summary: "One scoop, 75 vitamins and minerals.", headline: "Foundational nutrition, sorted.", bodyCopy: "Replace the cabinet of pills with one daily scoop.", hue: 90 },
];

export const BRANDS: Brand[] = [
  {
    id: "brand-deel",
    name: "Deel",
    tone: "Confident, clear, globally-minded",
    audience: "Ops & People leaders scaling international teams",
    palette: ["#1B1C1E", "#0A89C5", "#F4F4F5"],
    positives: "Compliance, speed, global reach, trust",
    negatives: "Cheap, gimmicky, jargon-heavy",
  },
  {
    id: "brand-ramp",
    name: "Ramp",
    tone: "Sharp, numbers-first, no fluff",
    audience: "Finance leaders at high-growth startups",
    palette: ["#12261E", "#0A9C55", "#F1F1F2"],
    positives: "Savings, automation, control, speed",
    negatives: "Slow, manual, legacy",
  },
];
