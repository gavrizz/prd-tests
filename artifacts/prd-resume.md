# PRD Resume: ENG-1410 — Ad Creative Library & Concept Generation

**Repo:** echo-studio · **Branch:** `gavri/ENG-1410-creative-library`
**Mock:** `case-study/screenshots/01-gallery.png`, `02-concept-workspace.png`, `03-key-states.png`
**Flows:** `case-study/02-flows-and-interactions.md` · **Grill:** `case-study/01-grill-log.md`

## What
A new **Creative Library** in echo-studio: browse/search proven ad creatives → select one → LoudEcho
**adapts it to a target brand's DNA** → refine it in chat → **Generate Variants** hands it to the
existing variant workflow. Net-new = the Library + the glue; concept-gen, chat, Brand DNA, and
variant generation already exist and are reused.

## Why
Concept ideation today is manual and disconnected from LoudEcho's variant generation. This turns
market-proven ads into a first-class, brand-adaptable input layer for the existing engine.

## Acceptance Criteria (locked)
1. **Library** nav → `/library` gallery from a provider-agnostic `CreativeProvider` (SeedProvider default).
2. Cards: thumbnail, brand, format+platform badges, one-line summary, metadata tags, **Save / Hide**.
3. Facet sidebar + keyword search (vertical/niche/brand/platform/format/language/CTA/angle); **filters in URL**.
4. Select → **Concept Workspace** `/library/[id]`: reference + adapted brief (left), existing chat rail (right), persistent **Generate Variants** CTA.
5. No active brand → inline **brand picker**; else adapt to the **active brand** (global switcher).
6. Workspace **auto-adapts once** (skeleton) → brief (name, hook, core message, visual direction, layout, CTA, copy, rationale); explicit **Re-adapt**.
7. Chat refines the brief (reuse existing ChatPane); quick-action chips for common edits.
8. **Generate Variants** → campaign/session → render concept (`parent_concept_id`) → existing `surgical_edit` → navigate to `/review`.
9. Empty / loading / error states handled (mock screen 3).
10. `ForeplayProvider` coded to docs but **flagged off**; `SeedProvider` fixtures drive the demo.

## Approach
- **New:** `library_creatives` table (additive migration) + ~20–40 seed fixtures; Python `CreativeProvider` adapter (Seed + Foreplay-off); `/api/library/*` routes; `/library` gallery + `/library/[id]` workspace (shadcn); add nav item.
- **Reuse:** `concept_from_brief`/`concept_executor` for adaptation, existing `ChatPane`/SSE for refinement, `surgical_edit` + `/review` for variants, `load_brand()` for Brand DNA.
- **Design gate:** load design skill stack before JSX; design-reviewer PASS before PR.

## Out of Scope
Live Foreplay on the demo path; **concept version history/compare/revert** (ticket req, deferred);
free-form tagging; LoudEcho-owned curated galleries; multi-brand fan-out; any new variant UI; any
dara-backend / analytics / adtech-contract change.

## Contract Changes
- **DB (echo-studio libSQL):** NEW `library_creatives` table + NEW nullable `concepts.parent_library_creative_id` — **additive only**.
- **API:** NEW `/api/library/*` handlers — additive.
- **None** to LoudEcho adtech contracts (impressions↔clicks join, CTR denominator, url_hash) — untouched.

## Risk
Low–Medium. Blast radius Level 2 (echo-studio only, additive schema, reuse of existing engines).
Main risk = additive migration on manual-migration libSQL; mitigate by testing against local
`echo-studio.db` first. Rollback = remove nav item + routes (minutes); migration safe to leave.

## Open questions (need a call before build)
1. OK to hand-author the ~20–40 seed fixtures (vs pulling real Foreplay)? _(Rec: yes)_
2. Adaptation via the `concept_from_brief` contextualize-spawn pattern? _(Rec: yes)_
3. Build all 10 ACs this pass, or **P1 gallery first** then P2–P4 glue on the same branch? _(Rec: P1 first)_
