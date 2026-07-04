# ENG-1410 prototype — Ad Creative Library & Concept Generation

Runnable interactive slice. Vite + React + TypeScript + Tailwind, using **dara-front tokens and shadcn primitives** so it reads as a native product surface. The AI/backend layer is stubbed behind a typed seam that mirrors **echo-studio** contracts.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## In scope (this slice)

- **Library gallery** — proven creatives, facet rail (vertical / platform / angle), search, save/hide.
- **Concept Workspace** — auto-adaptation of a reference creative into a 7-section brief; plain-language **refine loop** (quick actions + free text) running surgical per-section edits; brief versioning.
- **Variant Review** — streamed variant generation with parent→variant lineage and per-variant status.
- **dara-front shell** — LOUDECHO sidebar with a new `Library` IA entry, real tokens.

## Out of scope (not built, not stubbed)

- Every other dara-front surface (Campaigns, Reports, Moderation, Conductor, Advertisers detail, etc.) — the sidebar shows them but they are inert.
- Real Firebase / auth / persistence.
- Real ForeplayProvider ingestion, real image generation, asset storage/CDN.
- Approval → publish pipeline downstream of Review (queueing only).

## Architecture

```
src/
  components/
    shell/        AppShell, Sidebar, TabMenu   ← dara-front chrome
    ui/           badge, button, card, checkbox, input, label,
                  select, sheet, table, tabs    ← shadcn primitives (dara-front cn registrations)
  features/library/
    types.ts      Creative, Brand, ConceptBrief, Variant, ChatMessage, ...  (echo-studio-shaped)
    data.ts       SEED_CREATIVES, BRANDS  (fixtures)
    api.ts        fetchCreatives / adaptConcept / refineConcept / generateVariants  ← BACKEND SEAM
    hooks.ts      useConceptAdaptation, useVariantGeneration  ← implementation loops
    CreativeCard / FacetSidebar / LibraryGallery / ChatRail /
    ConceptWorkspace / ReviewScreen
  App.tsx         view router: gallery → workspace → review
```

## Backend seam → echo-studio mapping

`api.ts` is the single integration point. Each stub corresponds to an echo-studio capability:

| Stub | echo-studio contract | Replace with |
|------|----------------------|--------------|
| `fetchCreatives()` | creative provider (`SeedProvider` / `ForeplayProvider`) | provider list endpoint |
| `adaptConcept(creative, brand)` | concept adaptation executor | brief-generation endpoint (returns 7 sections + rationale) |
| `refineConcept(brief, instruction)` | surgical brief edit executor | per-section refine endpoint |
| `generateVariants(brief)` | variant generation executor (streaming) | variant stream endpoint (SSE/websocket) |

Swap the fake latency + deterministic outputs for real calls; the hooks and UI stay unchanged.
