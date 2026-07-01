# 01 — Grill Log · ENG-1410 Ad Creative Library & Concept Generation

**Repo:** echo-studio · **Branch:** `gavri/ENG-1410-creative-library`
**Mode:** Senior product designer grill (grill-before-build). One question at a time, each with a recommended answer.
**Started:** 2026-07-01

---

## Framing — chopping the feature

ENG-1410 as written is ~4 features stacked into one ticket:

| # | Piece | What it is | Depends on |
|---|-------|-----------|-----------|
| P1 | **Creative Library** | Ingest (Foreplay adapter) → normalize schema → gallery browse/search/filter + curation | — (foundation) |
| P2 | **Concept Generation** | Select a reference concept → generate a brand-adapted concept brief via Brand DNA | P1 |
| P3 | **Concept Refinement** | Chat-like editing of the generated concept + version history | P2 |
| P4 | **Variant Handoff** | Push approved concept into echo-studio's existing variant-generation workflow | P2/P3 |

We grill **one piece at a time**. The rest are noted as out-of-session scope so the PRD stays honest.

---

## Locked decisions

- **D1 — Session scope:** Grill + mock + PRD the **full end-to-end feature (P1–P4)** this session. Build scope TBD from grill. (User: "all")

---

## Q&A log

### Q1 — Session scope / chop
**Recommended:** Start with P1 only (foundation, self-contained).
**User answer:** **All** — grill the full flow (P1–P4) end to end.
**Locked:** D1.

### Codebase grounding (read before grilling P2–P4)

Map produced by explore agent. Key facts:

- **Studio UI:** Next.js 16 App Router, React 19, Tailwind v4, **shadcn/ui (new-york)** + Radix + lucide + sonner. Nav shell = `TopBar` (primary: Studio `/`, Review `/review`; secondary: Campaigns, Brand DNA) + gear menu. Tokens in `studio/app/globals.css` (LoudEcho V2). Global brand switcher in TopBar.
- **Brand DNA:** `assets/brands/<id>/` → `config.json` (colors/fonts/wordmark/ad_sizes/cta) + `brand.md` (positioning/voice/do/don't/audience). Loaded by `tools/studio_db.py:load_brand()`. Read-only canvas at `/brand/[brand_id]`.
- **Concept generation EXISTS:** `harness/skills/concept_generation/concept_from_brief.md`, `tools/concept_executor.py`, `/concept <brand> "<angle>"`, DB table `concepts`. Concept dict → `visual_direction` (req), `tagline_direction`, `tone`, `preserve/avoid_anchors`, `downstream_routes`.
- **Refinement chat EXISTS:** production chat rail (`studio/components/chat/ChatPane.tsx`), SSE via `POST /api/chat/[sessionId]`, Claude Agent SDK. Persists across nav.
- **Variant handoff EXISTS:** `tools/surgical_edit_executor.execute(brand_id, reference_image, operator_intent, campaign_id, session_id, …)`. Concepts feed it via `parent_concept_id`.
- **Data layer:** libSQL/Turso (prod) + local `echo-studio.db`. Manual migrations in `assets/db/migrations/` (0001–0039). TS reads via `studio/lib/db.ts`; Python owns generation writes via `tools/studio_db.py`.
- **Ingestion patterns exist** (`tools/onboarder_client.py` with ScrapeCreators fallback, `ingest_served_creatives.py`, `firebase.py`) but **NO Foreplay adapter and NO provider-agnostic external creative-library abstraction.**
- **Gaps for ENG-1410:** no Foreplay adapter, no normalized "library creative" model, no dedicated Creative Library gallery route.

**Implication:** Net-new work ≈ (1) Foreplay ingest + library data model, (2) the gallery UI, (3) wiring library selections into the *existing* concept → refinement → variant machinery.

### Q2 — Reframe scope around what already exists
**Recommended:** Yes — treat P2 (concept gen), P3 (refinement chat), P4 (variant handoff) as **reuse/wire-up** of existing echo-studio machinery, and focus net-new build on **P1 Creative Library (Foreplay ingest + normalized model + gallery)** plus the **glue** that turns a selected library creative into a `concept_from_brief` call and routes the refined concept into `surgical_edit`. Don't rebuild concept/chat/variant systems.
**User answer:** **Yes — reuse** existing concept/chat/variant machinery; net-new = Library + glue. → **D2**

### Q3 — Foreplay ingestion reality for MVP
**Context:** No Foreplay adapter exists; Foreplay is a paid external API. For a buildable+demoable case study in one pass, hitting a live Foreplay key on the hot path is a risk (auth, rate limits, cost, schema drift).
**Recommended:** Build a **provider-agnostic adapter interface** (`CreativeProvider` with `fetch_creatives()` → normalized records) and ship **two implementations**: (a) a `ForeplayProvider` coded against the documented Foreplay API but **feature-flagged/off by default**, and (b) a `SeedProvider` that loads a curated **normalized fixture set** (~20–40 creatives) committed to the repo. The gallery + all downstream flows run on the SeedProvider for the demo; Foreplay can be switched on later with a key. This de-risks build and keeps the demo deterministic.
**User answer:** **adapter + seed** (provider-agnostic interface, ForeplayProvider flagged off, SeedProvider fixtures drive the demo). → **D3**

### Q4 — Information architecture: where the Library lives + the browse→adapt journey
**Recommended:** Add a **new primary nav item "Library" (`/library`)** for the gallery. Selecting a creative opens a **dedicated Concept Workspace** at `/library/[creativeId]` (or `/concept/new?ref=<id>`) — a focused 2-pane layout: left = the reference creative + the brand-adapted concept brief; right = the **existing chat rail** for refinement. A persistent **"Generate Variants"** CTA hands the approved concept to `surgical_edit`. This keeps the gallery and the concept work as distinct surfaces rather than cramming everything into the global chat.
**User answer:** **gallery + dedicated Concept Workspace** (reference + brief left, chat rail right, Generate Variants CTA). → **D4**

### Q5 — Which brand does "adapt to Brand DNA" target, and when is it chosen?
**Context:** TopBar already has a global brand switcher backed by `useChatSession().setActiveBrand()` and `GET /api/brands`. Brand DNA = `assets/brands/<id>/`.
**Recommended:** Adaptation targets the **active brand from the global TopBar switcher**. Entering the Concept Workspace with **no active brand → block with an inline brand picker** ("Pick a brand to adapt to"). The workspace header shows the target brand (logo/name) with a switch affordance; switching the brand re-runs adaptation. Browsing the gallery itself is brand-agnostic (you can explore proven ads before committing to a brand).
**User answer:** **active brand from global switcher**; block-with-picker if none; gallery brand-agnostic. → **D5**

### Q6 — Adaptation trigger + how the brief is produced
**Context:** Existing `concept_from_brief` takes a text angle/brief. Here the input is a **reference creative** (metadata: copy, transcript, CTA, detected angle, emotional drivers). So we derive a brief from the reference + Brand DNA, then feed the existing concept engine.
**Recommended:** On entering the Concept Workspace, **auto-run adaptation once** (reference metadata → synthesized brief → `concept_from_brief` with `load_brand()` context) and show a skeleton/loading state, landing on a generated concept brief (name, hook, core message, visual direction, layout, CTA, copy blocks, rationale). Re-adapt is explicit (on brand switch or a "Re-adapt" button). Avoids a dead-end empty workspace while keeping re-runs intentional.
**User answer:** **auto-run once on open**, skeleton loading, explicit re-adapt. → **D6**

### Q7 — Version history depth for refinement
**Context:** Ticket asks to "maintain version history so users can compare and revert." `concepts` table exists; `variant_iterations` exists for the variant layer.
**Recommended:** Every refinement turn that **mutates the concept brief** snapshots a new version (brief JSON) in a lightweight `concept_versions` table keyed by concept. Workspace shows a **version rail/dropdown** and **one-click non-destructive revert**. Side-by-side compare = stretch.
**User answer:** **None** — latest brief only in MVP. ⚠️ **Ticket requirement "maintain version history…compare/revert" is explicitly DEFERRED** to a follow-up (logged as PRD non-goal). → **D7**

### Q8 — Curation scope in MVP (hide / tag / save / LoudEcho-owned galleries)
**Context:** Ticket lists "manual curation, hiding, tagging, and saving concepts for LoudEcho-owned galleries."
**Recommended:** MVP = **Save/bookmark** (revisit later via a "Saved" filter) **+ Hide** (remove noise from the gallery). **Defer** free-form tagging and LoudEcho-owned curated galleries to a follow-up.
**User answer:** **Save/bookmark + Hide** only; tagging + curated galleries deferred. → **D8**

### Q9 — What "Generate Variants" actually does (handoff to existing workflow)
**Context:** `surgical_edit_executor.execute` needs `brand_id`, `reference_image`, `operator_intent`, `campaign_id`, `session_id`. Concept brief provides `visual_direction`. `concept_executor` can render a concept to a base image. Existing `/review` surface displays streaming variants.
**Recommended:** "Generate Variants" **creates/reuses a campaign + session for the active brand**, renders the approved concept to a base creative via `concept_executor` (carrying `parent_concept_id`), enqueues the **existing variant_generation (`surgical_edit`)** for N variants, and **navigates the user to the existing `/review` surface** where variants stream in. No net-new variant UI — reuse `/review`. The library→concept lineage is preserved via `parent_concept_id`.
**User answer:** **render → enqueue surgical_edit → navigate to /review**. → **D9**

---

## Locked decisions (summary)

| ID | Decision |
|----|----------|
| D1 | Grill/mock/PRD the full flow (P1–P4) this session. |
| D2 | Reuse existing concept-gen, chat-refinement, and variant machinery. Net-new = Creative Library + glue. |
| D3 | Provider-agnostic `CreativeProvider` interface; `ForeplayProvider` (coded to docs, flagged OFF) + `SeedProvider` fixtures (~20–40) that drive the demo. |
| D4 | New primary nav **Library** → gallery `/library`; selecting a creative opens a **Concept Workspace** `/library/[creativeId]` (reference + adapted brief left, existing chat rail right, "Generate Variants" CTA). |
| D5 | Adaptation targets the **active brand** (global TopBar switcher); no active brand → block-with-picker; gallery browsing is brand-agnostic. |
| D6 | **Auto-run adaptation once** on workspace open (skeleton loading); re-adapt is explicit (brand switch / button). Brief synthesized from reference metadata → `concept_from_brief` + `load_brand()`. |
| D7 | **No version history in MVP** (latest brief only). Ticket's version-history requirement **DEFERRED** → PRD non-goal. |
| D8 | Curation MVP = **Save/bookmark + Hide** only. Tagging + LoudEcho-owned galleries deferred. |
| D9 | "Generate Variants" → create/reuse campaign+session → `concept_executor` render (parent_concept_id) → existing `surgical_edit` → navigate to existing `/review`. |

**Deferred / non-goals (documented, not built this pass):** live Foreplay API on hot path; concept version history + compare/revert; free-form tagging; LoudEcho-owned curated galleries; multi-brand fan-out adaptation.

**Open items to resolve in flows/mock (layout-level, not chat debate):** gallery card content, filter facet set, search behavior, workspace brief layout, empty/error/loading states.

**Grill status:** sufficient shared understanding to map flows + mock. ✅
