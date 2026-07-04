# ENG-1410 — PRD resume + merge notes

## Problem
Operators have access to proven ad creatives (winning references) but no in-dashboard path to turn them into on-brand concepts and platform-ready variants. Today this is manual brief-writing outside the product.

## Appetite
One slice: Library → Concept Workspace (adapt + refine) → Variant Review. Ships as a new `Library` surface in dara-front backed by echo-studio.

## Solution (what the slice proves)
1. **Library gallery** of proven creatives with facet filtering (vertical / platform / angle) and provider transparency.
2. **Concept adaptation** — one click maps a reference into a structured 7-section brief tagged with target-brand DNA.
3. **Plain-language refine loop** — surgical per-section edits via chat (quick actions + free text), versioned.
4. **Variant generation** — fan-out to platform-ready variants, streamed, with parent→variant lineage for review/approval.

## Merge notes — pulling this slice into dara-front
- **Route / IA:** add `Library` sidebar entry (see `Sidebar.tsx`) → `/library` route group: gallery, `/library/concept/:creativeId` workspace, `/library/review/:conceptId`.
- **Components to reuse from dara-front:** `Card`, `Badge`, `Button`, `Input`, `Select`, `Sheet` (already the primitives used here). Net-new: `FacetSidebar`, `ConceptWorkspace`, `ChatRail`, `ReviewScreen` — port as-is.
- **Backend wiring (echo-studio):** replace the four `api.ts` stubs with echo-studio executors — creative provider list, concept adaptation, surgical refine, streaming variant generation. Contracts already shaped in `types.ts`.
- **State:** `useConceptAdaptation` + `useVariantGeneration` are transport-agnostic; only `api.ts` changes at integration.
- **Auth:** production uses existing `withAuth`; the dev bypass (`AUTH-BYPASS.md`) is local-only and must not ship enabled.

## Non-goals (now)
- ForeplayProvider ingestion pipeline, real image generation/asset storage.
- Approval → publish downstream of Review.
- Multi-brand bulk adaptation.

## Success metric
Operator can go from a proven creative to a queued set of on-brand variants without leaving the dashboard or hand-writing a brief.

## Open question
Streaming transport choice (SSE vs websocket) for variant generation — decide in dev integration.
