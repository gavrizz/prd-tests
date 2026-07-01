# prd-tests

**Product research workflow experiments** — each branch is one agent run of the **grill-before-build** pipeline. The branch README is a **senior PM/PD case study with evidence**, not the PRD itself and not a bullet dump.

This repo tests whether an agent workflow (grill → flows → mock → PRD) produces build-ready product artifacts **before any code is written**. We evaluate **output quality and workflow fidelity**, not whether the underlying product ideas are good business.

---

## Standalone prototype model *(prd-tests only)*

**Each feature is a sliced interactive prototype — not a miniature dara-front.**

Think **Claude interactive prototype first, Figma later, merge into dara-front last** — not “boot the whole dashboard so one tab works.”

| Do | Don't |
|----|--------|
| Build **only the journey slice** for this ticket | Mount full app nav (Campaigns, Reports, Settings, …) unless the slice needs it |
| Pull **tokens + specific components** from dara-front (`LineTabs`, `Sheet`, `Select`, banners) | Require every unrelated page to load or function |
| Stub **just enough plumbing** (fake data, one tab, one panel) so the flow is clickable | Wire real Firebase, full campaign shell, or prod APIs for the prototype |
| Use **echo-studio** only for API/backend contracts the slice needs | Use echo-studio UI as chrome |
| Ship prototype in **`prototype/`** on the branch (or its own repo) | Block the experiment on integrating into monorepo first |

**Example:** A new **AI chat / threads** feature → prototype shows thread list + composer + one thread view in LoudEcho styling. You do **not** need Reports, Campaigns list, or Insights working. Vice versa for an Optimize tab slice — show campaign context chrome **minimally** (e.g. tab strip + Optimize panel), not the entire campaign product.

**Handoff to devs:** PRD + prototype + case study describe *what* to merge into `dara-front` `staging`. Devs pull components, patterns, and layout intent from the prototype — they do not copy-paste the standalone repo wholesale.

```
prd-tests branch (or feature prototype repo)
├── README.md                 ← case study + verdict
├── artifacts/                ← grill, flows, prd-resume, screenshots
└── prototype/                ← runnable interactive slice (Claude Code / Claude Design)
    ├── README.md             ← scope: what's in / out of this slice
    └── …                     ← HTML, Next mini-app, or Claude Design handoff bundle
```

*This sliced-prototype rule applies to **prd-tests experiments** only — not the production VP merge path into dara-front.*

---

## Setup & installation

Use this section to reproduce the workflow on a **new machine** (Cursor, Claude Code, or both). Everything you need to copy-paste lives in this repo or links below.

### 1. Clone repos

```bash
# Product research experiments (this repo)
git clone https://github.com/gavrizz/prd-tests.git
cd prd-tests

# LoudEcho monorepo (skills, brain, target apps) — required for real runs
git clone git@github.com:sepana-io/loudecho.git   # or your fork/path
cd loudecho
# Ensure sub-repos exist: loudecho-brain, dara-front, echo-studio, etc.
```

| Repo | Why you need it |
|------|-----------------|
| **prd-tests** | Case study critiques per branch; agent prompt copy |
| **loudecho** workspace | Skills, VP rules, target codebases, task artifacts |
| **loudecho-brain** | Source of truth for skills (`grill-me-product`, design stack) |

### 2. Cursor — skills & rules

Skills are **not** in prd-tests. They live in the LoudEcho workspace.

```bash
cd loudecho

# Workspace skills (symlink or copy from brain)
# Typical layout:
#   .cursor/skills/grill-me-product/
#   .cursor/skills/build-screen/
#   .cursor/skills/loudecho-brand/
#   .cursor/skills/loudecho-component-library/
#   .cursor/skills/impeccable/
#   .cursor/skills/frontend-design/
#   .cursor/skills/agentic-discipline/
```

**Brain paths (canonical):**

| Skill | Path |
|-------|------|
| Grill | `loudecho-brain/.agent/skills/grill-me-product/SKILL.md` |
| Design stack | `build-screen` → `loudecho-brand` → `loudecho-component-library` → `impeccable` → `frontend-design` |
| Safety | `loudecho-brain/.agent/skills/agentic-discipline/SKILL.md` |
| PRD format | `loudecho-brain/.agent/skills/session-workflow/SKILL.md` |

Cursor reads workspace rules from `loudecho/.cursor/rules/` and `AGENTS.md`. Open the **loudecho** folder as the Cursor workspace root (not prd-tests alone).

### 3. Cursor — MCP servers

Copy or merge `loudecho/.cursor/mcp.json`:

| Server | Purpose | Setup |
|--------|---------|--------|
| **Linear** | Fetch tickets | Cursor plugin or user MCP — authenticate once per machine |
| **Paper** | Product-faithful mocks | Install [Paper Desktop](https://paper.design); open a file; MCP at `http://127.0.0.1:29979/mcp` |
| **Pencil** | Optional vector mocks | Install Pencil.app; stdio MCP in `mcp.json` |
| **GitHub** | Push branches, PRs | Authenticate via plugin |

Reload Cursor after MCP changes: **Cmd+Shift+P → Developer: Reload Window**.

### 4. Storybook + UI reference — **dara-front only**

**LoudEcho product UI lives in `dara-front`.** That is the **only** design-system reference for mocks: components, layout, tokens, patterns, Storybook.

**`echo-studio` is not a UI reference.** It is the creative/API backend (concept generation, variants, library ingest, etc.). Pull it when the **feature integrates with that engine** — not to copy screens from the studio app.

```bash
cd loudecho/dara-front
npm install
npm run storybook    # http://localhost:6006
```

**Before any mock**, the agent must read:

| Reference | Path |
|-----------|------|
| Component routing table | `loudecho-brain/.agent/skills/loudecho-component-library/components.md` |
| Campaign tabs | `src/components/LineTabs.tsx` — Storybook: `Custom Components/Layout/LineTabs` |
| Simulation patterns | `src/components/SimulationMode/InputsPanel.tsx`, `SimulationModeCard.tsx` |
| Isolation / sim banners | `src/components/Overview.js` |
| Design tokens | `loudecho-brain/.agent/skills/loudecho-brand/DESIGN.md` |

**echo-studio (when needed):** pull for **API contracts, data models, and backend glue** — e.g. concept executor, surgical_edit, library providers. Do **not** use `studio/` UI as the mock chrome; render operator-facing flows in **dara-front** design language.

### 5. Standalone prototype (interactive slice)

After flows are locked, build a **runnable slice** — not full dara-front:

1. **Define the slice boundary** in `prototype/README.md` — entry point, screens in scope, explicit **out of scope** (e.g. “no Reports, no Campaign list”)
2. **Import only needed UI** from dara-front — copy/token-import specific components or mirror Storybook patterns; use `components.md` to pick primitives
3. **Stub data + plumbing** — enough to click through happy path + 1–2 key states
4. **echo-studio** — mock API responses or read contracts only; no need for live backend in the prototype
5. Prefer **Claude Code** or **Claude Design** for the interactive artifact; export/screenshot into `artifacts/screenshots/`

The slice must **look** like LoudEcho (dara-front tokens) but **be** independently runnable and showcaseable.

### 6. Paper / Claude Design mocks — design VP on the slice

Paper is **not** a freeform wireframe tool in this workflow. It follows the **same design ops as implementation**:

1. Load full design skill stack (`build-screen` → … → `frontend-design`)
2. Read target repo UX + `components.md` + Storybook paths above
3. Use **real token values** (colors, type, spacing) from `loudecho-brand/DESIGN.md` or repo `globals.css`
4. Name **real components** in mockup notes (`LineTabs`, `Select`, `Sheet`, `SimulationModeCard`, etc.)
5. Screenshot via Paper MCP → `case-study/screenshots/`
6. Document fidelity checklist in `03-mockup-notes.md` (match / extension / gap per element)

**Low-fi gray HTML wireframes are not sufficient** for PRD approval on any operator-facing UI. Mocks must use **dara-front** patterns and tokens.

Paper plugin: install `paper-desktop` Cursor plugin if not present. Ensure Paper Desktop is running with a file open before the agent calls Paper MCP.

### 7. Launch a case study (Cursor) — copy/paste

1. Open **loudecho** workspace in Cursor (fresh agent chat).
2. Open [`prompts/grill-before-build-agent-prompt.md`](prompts/grill-before-build-agent-prompt.md).
3. Copy the **fenced prompt block** (between the triple backticks).
4. Change one line: `TICKET: ENG-____` (e.g. `ENG-1410` or `ENG-1409`).
5. Paste into a **new agent** and send.

**Minimal Slack message to yourself/teammate:**

```
Run grill-before-build:
1. Clone loudecho + prd-tests
2. Open loudecho in Cursor, new agent
3. Paste prompt from https://github.com/gavrizz/prd-tests/blob/main/prompts/grill-before-build-agent-prompt.md
4. Set TICKET: ENG-XXXX
5. Paper Desktop open; Storybook optional at :6006 for dara-front
```

**After the run publishes a critique:**

```bash
cd prd-tests
git checkout -b ENGxxxx-YourVariant
# Copy artifacts + write README case study (see ENG1410-Control for format)
git push -u origin ENGxxxx-YourVariant
```

### 8. Claude Code + Claude Design (alternative path)

Anthropic’s **Claude Design** (beta) is a separate surface for on-brand visual work, synced with **Claude Code** for implementation. Useful if you prefer browser/desktop design canvas over Paper-in-Cursor.

#### Pull latest repos first (required)

**Yes — pull latest code before every Claude Code run.** A PRD alone is not enough for LoudEcho-faithful mocks or build.

| Repo | Role in this workflow | Pull? |
|------|------------------------|-------|
| **`dara-front`** (`staging`) | **UI + design system** — Storybook, components, mocks, build target for dashboard features | **Always** |
| **`echo-studio`** (`main`) | **API / backend** — creative engine, providers, glue; not a UI reference | When the ticket touches studio APIs |
| **`loudecho-brain`** | Skills, `components.md`, design tokens | **Always** |

```bash
cd loudecho
git pull

# UI reference — always
cd dara-front
git fetch origin && git checkout staging && git pull origin staging

# Backend / API — when feature uses echo-studio (library, concepts, variants, etc.)
cd ../echo-studio
git fetch origin && git checkout main && git pull origin main

cd ../loudecho-brain && git pull
```

| Phase | Need `dara-front`? | Need `echo-studio`? |
|-------|---------------------|---------------------|
| Grill + flows + PRD | **Yes** — real dashboard UX patterns | If ticket integrates with studio APIs |
| Mocks / draft UI | **Yes** — **only** dara-front design language | No — do not mock from studio app UI |
| Build | **Yes** — branch off `staging` | Only if implementing studio API integration |

Open the **`loudecho`** workspace root in Claude Code. Optional: `cd dara-front && npm run storybook` → `:6006`.

| Step | Where | Action |
|------|--------|--------|
| **Prep** | Terminal | Pull `staging` / `main` on target repo + `loudecho-brain` (see above) |
| Design | [claude.ai/design](https://claude.ai/design) or Claude **desktop app sidebar** | Create mockups, decks, prototypes |
| Import design system | Claude Design settings | Connect **`dara-front`** GitHub repo — our UI source of truth |
| Sync from code | Claude Code terminal | `/design-sync` from **`dara-front`** |
| Start from code | Claude Code | `/design` |
| Handoff to build | Claude Design → Export | Handoff bundle → Claude Code |
| Build | Claude Code in **`dara-front`** | Next.js + shadcn + our component catalog |

**LoudEcho-specific tips:**

- **Claude Design / mocks:** import **`dara-front` only** — not echo-studio (studio is API/backend).
- Point Claude at `loudecho-brain/.agent/skills/loudecho-brand/DESIGN.md` and `loudecho-component-library/components.md`.
- echo-studio: read for **API and data contracts** when the feature needs the creative engine; UI still follows dara-front.
- After Claude Code builds, push to GitHub → normal LoudEcho PR + design-reviewer gate still applies.

Claude Design shares usage limits with Claude Code (Pro/Max/Team). Enterprise may need admin enable.

### 9. Second machine checklist

- [ ] Clone `loudecho` + `prd-tests`
- [ ] **Pull latest `dara-front` `staging`** + `loudecho-brain` before every run
- [ ] Pull **`echo-studio` `main`** only when the ticket needs studio API/backend — **not** for UI reference
- [ ] Cursor: same account (Settings Sync optional for user rules)
- [ ] Symlink/copy skills from `loudecho-brain` → `.cursor/skills/`
- [ ] Copy `loudecho/.cursor/mcp.json`; re-auth Linear + GitHub
- [ ] Install Paper Desktop + Pencil (optional)
- [ ] `dara-front`: `npm install` + `npm run storybook` when mocking dashboard UI
- [ ] Paste agent prompt from this repo; set `TICKET`
- [ ] Publish case study branch to `gavrizz/prd-tests` when done

### 10. Quick links

| Resource | URL |
|----------|-----|
| Agent prompt (copy source) | [`prompts/grill-before-build-agent-prompt.md`](prompts/grill-before-build-agent-prompt.md) |
| Control case study (1410) | [`ENG1410-Control`](tree/ENG1410-Control) |
| Control case study (1409) | [`ENG1409-Control`](tree/ENG1409-Control) |
| Paper arm example (1410) | [`ENG1410-Paper`](tree/ENG1410-Paper) |
| Monorepo control report | LoudEcho `docs/case-studies/grill-before-build-control-arm-report.md` |

---

## How to read a case study

Each branch README follows a narrative case-study structure. A lay product person should be able to read one branch top-to-bottom and understand **what was tested, what got locked, and whether they'd green-light build**.

| Section | What you'll find |
|---------|------------------|
| **Metadata table** | Linear ticket, repo, branch, date, status (PLANNING / BUILD / SHIPPED) |
| **Executive summary** | 3-sentence verdict |
| **The bet** | Which workflow hypothesis this run tests |
| **Session narrative** | Pivotal Q&A exchanges with quoted decisions and why they mattered |
| **Flow walkthrough** | Plain-English summary of Mermaid diagrams (full diagrams in `artifacts/flows.md`) |
| **Interaction design** | 2–3 options + pick pattern with IA/app-logic rationale |
| **Wireframe review** | Embedded screenshots with captions explaining what each proves |
| **PRD resume** | Key What/Why/AC sections inline (full PRD stays in LoudEcho monorepo) |
| **UX fidelity** *(dara-front runs)* | Honest comparison of wireframes vs real component patterns |
| **Right / wrong** | What the agent got right and weak spots |
| **Critique verdict** | Superb or subpar — **with evidence**, skeptical but fair |
| **Ratings table** | Scored dimensions (see rubric below) |
| **Appendix** | Artifact index |

**Important:** Case studies judge **agent output quality** (clarity, scope discipline, buildability, traceability, UX fidelity). They do not evaluate product-market fit.

---

## Rating rubric (1–5)

Scores appear at the end of every branch case study.

| Dimension | 1 — Poor | 3 — Adequate | 5 — Excellent |
|-----------|----------|--------------|---------------|
| **Clarity added before build** | Major ambiguities remain; builder would re-discover scope in code | Core happy path locked; some open questions | Decisions traceable; ACs map to grill log; open questions explicit and few |
| **Grounding in design skill stack / IA / app logic** | Wireframes invent foreign UI; ignores existing nav/tabs/components | Extends real IA; wireframes structural only | Reads target repo UX before mock; references real component names; wireframes use repo tokens/patterns |
| **UX best practices / approach quality** | No error states; no option matrices; pixel debate in grill | Flows + key interactions documented; layout gate passed | Edge-state table; 2–3 options + rationale per step; isolation/accessibility considered |
| **Build readiness** | PRD not buildable; hidden backend deps; contract changes smuggled in | Buildable with conditions; stub seams or scope chop noted | Clear ACs, additive-only contracts, stub/backend seam explicit, P1 chop if needed |
| **Overall workflow grade** | Re-grill required | Approve with conditions | Approve; workflow superb |

---

## Workflow under test

```mermaid
flowchart LR
    A[Linear ticket] --> B[Grill Q&A]
    B --> C[Flows + interactions]
    C --> D[Standalone prototype slice]
    D --> E[PRD]
    E --> F[Dev merge into dara-front]
```

**Pipeline steps:**

1. **Grill** — structured Q&A locks product decisions (`grill-me-product` skill + MVP stop rules)
2. **Flows** — Mermaid diagrams + interaction option matrices for **this slice only**
3. **Prototype** — interactive runnable slice (Claude Code / Claude Design / Paper); **dara-front tokens + only the components needed**; not full app shell
4. **PRD** — Shape Up structure; notes how devs merge prototype into `dara-front`
5. **Dev merge** — separate session; out of scope for planning-only case study branches

Agent prompt: [`prompts/grill-before-build-agent-prompt.md`](prompts/grill-before-build-agent-prompt.md) (also in LoudEcho monorepo at `docs/case-studies/grill-before-build-agent-prompt.md`).

---

## Branch naming

```
{TICKET}-{Variant}
```

| Part | Meaning | Example |
|------|---------|---------|
| `TICKET` | Linear ID, no hyphen | `ENG1410`, `ENG1409` |
| `Variant` | Experiment arm | `Control` (standard prompt), `Skill-Test` (alternate skill stack) |

| Branch | Ticket | Variant | Status |
|--------|--------|---------|--------|
| [`ENG1410-Control`](tree/ENG1410-Control) | ENG-1410 Creative Library | Control (HTML wireframe) | PLANNING complete |
| [`ENG1410-Paper`](tree/ENG1410-Paper) | ENG-1410 Creative Library | Paper (design tokens) | PLANNING complete |
| [`ENG1409-Control`](tree/ENG1409-Control) | ENG-1409 Optimization Simulation | Control (HTML wireframe) | PLANNING complete |
| [`ENG1409-Pencil`](tree/ENG1409-Pencil) | ENG-1409 Optimization Simulation | Pencil arm | See branch |

---

## Branches at a glance

### ENG1410-Control · echo-studio

Ad Creative Library & Concept Generation. Nine locked decisions (D1–D9), reuse-heavy spec (Library + glue), three wireframe screens. **Verdict:** approve PRD with P1-first build chop. **Overall: 4/5.**

### ENG1409-Control · dara-front

Creative Optimization Simulation. Eight locked decisions + Q9 default, new Optimize tab on simulated campaigns, typed stub backend. **Verdict:** approve and build first. **Overall: 4/5.**

---

## Artifact layout (per branch)

```
ENGxxxx-Variant/
├── README.md              ← case study (start here)
├── artifacts/
│   ├── grill-log.md
│   ├── flows.md
│   ├── mockup-notes.md
│   ├── prd-resume.md
│   └── screenshots/*.png
└── prototype/             ← optional: runnable interactive slice
    ├── README.md          ← slice scope (in / out); how to run
    └── …                  ← Claude Code / Design output
```

Full PRDs remain in LoudEcho monorepo task directories; branches carry summaries and evidence only.

---

## Related

- Control-arm summary report: LoudEcho monorepo `docs/case-studies/grill-before-build-control-arm-report.md`
- Agent prompt template: [`prompts/grill-before-build-agent-prompt.md`](prompts/grill-before-build-agent-prompt.md)

---

*Maintained as a portfolio-style experiment log. Planning-phase audits unless branch status says otherwise.*
