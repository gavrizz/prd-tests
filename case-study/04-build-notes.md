# ENG-1410 — Build notes (step 5)

How the prototype slice was built and where the "implementation loops" live.

## Stack

Vite + React 18 + TypeScript + Tailwind 3.4. Tokens and shadcn primitives copied verbatim from `dara-front` (`globals.css` HSL variables, `tailwind.config.js`, `cn` util) so the slice inherits the real design system rather than approximating it.

## Implementation loops (not static mockups)

The slice is stateful and driven by two hooks over a typed backend seam:

### Loop A — concept adaptation + refine (`useConceptAdaptation`)
1. Selecting a creative triggers `adaptConcept(creative, brand)` → structured 7-section `ConceptBrief` tagged with brand DNA.
2. A quick-action chip or free-text instruction calls `refineConcept(brief, instruction)` → **surgical edit** on the single targeted section (hook/cta/copy/visual), returning a new brief version + a chat turn.
3. Chips disable while a turn is in flight; the brief re-renders per version.

### Loop B — variant generation (`useVariantGeneration`)
1. `Generate Variants` calls `generateVariants(conceptId, brand)`.
2. Variants **stream** into the review grid (each flips to `Ready`), each carrying a lineage chip to the parent brief.

## Backend seam

`src/features/library/api.ts` is the only integration surface. Every function is async with realistic latency and deterministic, echo-studio-shaped outputs. See `prototype/README.md` → *Backend seam → echo-studio mapping*.

## File map

| Area | Files |
|------|-------|
| Shell | `components/shell/{AppShell,Sidebar,TabMenu}.tsx` |
| Primitives | `components/ui/*` (badge, button, card, checkbox, input, label, select, sheet, table, tabs) |
| Contracts | `features/library/types.ts` |
| Fixtures | `features/library/data.ts` |
| Seam | `features/library/api.ts` |
| Loops | `features/library/hooks.ts` |
| Screens | `features/library/{LibraryGallery,CreativeCard,FacetSidebar,ConceptWorkspace,ChatRail,ReviewScreen}.tsx` |
| Router | `App.tsx` (gallery → workspace → review) |

## Verification

`npm run build` passes (tsc + vite). All three screens captured live via browser — see `screenshots/`.
