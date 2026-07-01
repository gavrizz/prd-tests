# Grill-before-build — Agent Prompt (Case Study)

**Usage:** Start a new Cursor agent, paste the block below, change **only the header line**, send.

Example header: `TICKET: ENG-1410` or `TICKET: ENG-1410 · repo: dara-front`

---

```
# Grill-before-build case study

TICKET: ENG-___
<!-- Optional overrides (agent can infer from Linear if omitted):
     repo: dara-front | loud-echo-site | echo-studio
     author: gavriel
-->

You are running the LoudEcho grill-before-build workflow for the ticket above.

## On start — you derive everything from the ticket
1. Fetch the ticket via **Linear MCP** (title, description, comments, labels, project)
2. Infer **repo** from ticket content/labels (ask me only if ambiguous)
3. Create branch: `{author}/ENG-XXX-short-description` (author = git user or header override; ENG uppercase)
4. Artifact dir: `<repo>/docs/tasks/<branch_name>/`
5. Confirm paths back to me in one message before grilling

**Starting point:** Linear ticket only — generate PRD through grilling. No pre-written PRD.

---

## MANDATORY: Load skills first
1. `.cursor/skills/grill-me-product/SKILL.md` — all grilling; follow phases + MVP stop rules below
2. `loudecho-brain/.agent/skills/agentic-discipline/SKILL.md`
3. UI work: `build-screen` → `loudecho-brand` → `loudecho-component-library` → `impeccable` → `frontend-design`
4. `loudecho-brain/.agent/skills/session-workflow/SKILL.md` — PRD format

Do NOT improvise grilling — use `grill-me-product`.

## Prerequisites
Confirm: grill-me-product loaded · Linear MCP · **Pencil MCP** (stdio — workspace `.cursor/mcp.json`) · **Paper MCP** (http://127.0.0.1:29979 — requires Paper Desktop open with a file). Stop if missing.

---

## MVP grilling rules (override endless interrogation)
Grill only what is **necessary to build the MVP**. Goal: **shared understanding, not complete certainty.**

**Stop when ANY of these is true:**
- MVP checklist below is complete
- Last **3 answers** needed no follow-up questions
- I say **"lock it"**, **"good enough"**, or **"write the PRD"**
- **15 questions** asked for this grillable piece (then crystallise)

**MVP checklist (all must be locked before stopping):**
- [ ] Problem + one sharp target user (not "everyone")
- [ ] Core happy path (entry → success)
- [ ] One error/empty state that matters for MVP
- [ ] One measurable success metric
- [ ] 3–5 explicit non-goals (what we are NOT building now)
- [ ] ≤1 blocking open question (rest → spikes, not build)

**While grilling:**
- One question at a time + **recommended answer** (I can say "yes")
- Codebase questions → read code first
- Depth-first; do NOT open v2 / nice-to-have / monetization / distribution-at-scale branches
- Skip questions you can **predict** my answer to
- Skip **reversible** decisions — note "decide in build"
- Big feature → chop into pieces; grill **one piece** per session
- Phase 4 routing: always **ready to spec → PRD for MVP**

**After stop — produce Grill Session Summary** in `01-grill-log.md`:
decisions locked · open questions · re-grill trigger (what would invalidate this)

---

## Workflow

### 0. Setup
- Fetch ticket · create branch + `docs/tasks/<branch_name>/case-study/screenshots/`
- Linear comment: "Case study started — artifacts on `<branch>`"

### 1. Grill (`grill-me-product` + MVP rules)
→ `case-study/01-grill-log.md`

### 2. Flows + key interactions (MVP only)
- Mermaid: entry → branches → error/empty/success → exit
- 2–3 interaction options per **key** step + recommendation
→ `case-study/02-flows-and-interactions.md`

### 3. Mock / wireframe phase (UI features) — MANDATORY UX READ FIRST

**Paper / Pencil / HTML all follow the same design VP as build.** Load the design skill stack before any mock surface.

**Design skill stack (MANDATORY before any mock):**
`build-screen` → `loudecho-brand` → `loudecho-component-library` → `impeccable` → `frontend-design`

**BEFORE any wireframe or mock screen**, read the target repo's existing UX so wireframes **extend IA, not invent unrelated UI**.

**UI reference rule:** **`dara-front` is the only design-system and mock chrome reference** (Storybook, `components.md`, tokens). **`echo-studio` is API/backend** (concept gen, variants, library providers) — pull it for integration and data contracts, **never** as the UI pattern source for mocks.

| Repo | Read for | Storybook / catalog |
|------|----------|---------------------|
| **dara-front** | **All mocks and operator-facing UI** — tabs, forms, banners, tables, sheets | `npm run storybook` → :6006; `loudecho-brain/.agent/skills/loudecho-component-library/components.md` |
| **echo-studio** | **API/backend only** — executors, providers, DB shapes, glue endpoints | Do not copy `studio/` app UI for mocks |
| **loud-echo-site** | Marketing pages only | `loudecho-brand` + `frontend-design` |

**Mock tool priority:**
1. **Paper MCP** (preferred) — product-faithful mocks using real tokens from `loudecho-brand/DESIGN.md` or repo CSS; reference Storybook story names from `components.md`
2. **Pencil MCP** — if available
3. **HTML + Chromium PNG** — only if Paper/Pencil unavailable; MUST use repo Tailwind classes/tokens from codebase read, NOT generic gray monospace wireframes

**Paper-specific rules:**
- Call `get_guide({ topic: "paper-mcp-instructions" })` once per session before first `write_html`
- Call `get_font_family_info` before typography; use fonts already in the product
- Every screen must name which **existing components** it reuses vs net-new (`LineTabs`, `Select`, `Sheet`, `TopBar`, etc.)
- Screenshot each artboard → `case-study/screenshots/`
- `03-mockup-notes.md` must include **Design fidelity checklist** (match / extension / gap per chrome element)

**Wireframe rules:**
- Wireframes must **extend existing information architecture** — new nav items, tabs, or surfaces slot into real chrome
- Reference **real component names** in mockup notes
- Screenshots must look like they **belong in the product**
- Layout broken → back to step 1 (re-grill), not pixel-tweak in chat

**HARD GATE:** Low-fi gray wireframes alone do NOT pass layout gate. Mocks must use **dara-front** design language. "Apply brand at build time" is NOT valid in this workflow.

→ `case-study/03-mockup-notes.md` + source (Paper file / HTML) + screenshots

### 4. Write PRD (after flows + mock settled)
- `prd.md` + `prd-resume.md` (session-workflow format)
- Include **Shape Up pitch sections:** Problem · Appetite · Solution · Rabbit holes · No-gos
- Target **≤3000 words** for MVP; split modules if longer
- Reference flows, mocks, screenshots by path

**Stop:** "PRD ready — approve?" No build until I approve.

### 5. Build from PRD
- Fresh pass; PRD only source of truth · design stack for UI
→ `case-study/04-build-notes.md`

### 6. Design review → Ship
→ `case-study/05-design-review.md` + `screenshots/06-built-ui.png`

### 7. Case study + Linear proof-of-work
**A.** `case-study/CASE-STUDY.md` (canonical in monorepo task dir)
**B.** Optional: branch README on **`gavrizz/prd-tests`** repo — senior PM/PD case study with evidence (metadata, narrative, screenshots, ratings). See existing `ENG1410-Control` / `ENG1409-Control` branches for format.
**C.** Ask me to push branch if not on GitHub
**D.** Linear on the ticket:
1. `save_document` — full CASE-STUDY.md on issue
2. `save_comment` — links to prd.md, CASE-STUDY.md, grill log, flows, PR URL, verdict
3. Upload **all** screenshots: `prepare_attachment_upload` → PUT → `create_attachment_from_upload`

Do NOT leave proof of work only on local disk.

---

## Rules
- Product decisions from me during grilling — don't invent
- Mock before PRD, not after build
- "bypass design review" only if I say so — log it
- No commit/push unless I ask (except push before step 7D)

## Start now
1. Prerequisites + fetch TICKET from Linear
2. Derive repo, branch, artifact path — confirm in one message
3. Post "case study started" on Linear
4. grill-me-product Phase 0 (brief) → **first MVP question only** (with recommended answer)
```

---

## How to use

1. **New Cursor agent** (skills reload on fresh chat).
2. Copy the fenced block above.
3. Change one line: `TICKET: ENG-1410` (add `· repo: dara-front` only if needed).
4. Send. One agent per feature.

## Installed skills

| Skill | Path |
|-------|------|
| `grill-me-product` | `.cursor/skills/grill-me-product/SKILL.md` |
| Design stack | `.cursor/skills/{build-screen,loudecho-brand,loudecho-component-library,impeccable,frontend-design}/` |

## Case study output (optional)

Planning runs may publish a PM critique to [gavrizz/prd-tests](https://github.com/gavrizz/prd-tests) on branch `{TICKET}-Control`. Each branch README is a narrative case study with evidence, embedded wireframes, ratings (1–5), and UX fidelity notes — not a bullet dump.
