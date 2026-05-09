# dx-dp-1 — structure & idea graph

Working analysis of `blog/dx-dp-1.mdx` (slug: `dx-dp-1`, title: *"Calibrating the Spherical Developer: Turning the Levers"*).

---

## 0. Spine in one sentence

Part 0 introduced three levers (`a` prompt time, `v` verify time, `c` context-switch time) and a saturation theorem. This post pressure-tests them by walking through a real 3-day build (a personal paper reader) and showing which architectural / tooling choice pulls which lever — closing the loop by plugging measured numbers back into Part 0's formula.

**Rhetorical move:** every concrete decision is annotated with `{/* lever: ... */}` comments; the levers are a backdrop, not a checklist.

---

## 1. Section graph (linear order with transitions)

Each node: `ID | title | core claim | levers | inbound transition | outbound transition`.

### S0 — Opening (no heading, lines 16–34)
- **Core:** recap Part 0; honest test = build a real project and watch the parameters drift.
- **Project intro:** personal paper reader, three desiderata (progress, paragraph-chat, handwritten-note upload). Built in 3 days.
- **Method declaration (line 34):** "walk through the build roughly as it happened, calling out which knob I was turning."
- **Outbound:** "## Turning the levers" → "Frontend and backend, separate repos".

### S1 — Frontend/backend split (separate repos)
- **Core claim:** the biggest isolation boundary you can draw. Architectural good even pre-agents; happens to also help models.
- **Lever:** primarily `c` (cheap to switch), supports `a` (smaller stable contexts).
- **Supporting evidence (research aside):**
  - "Lost in the Middle" (Liu et al. 2023) — long-context attention leaky.
  - RULER — half of 32K-claim models fail at 32K.
  - SWE-bench Goes Live (2025) — repo size correlates with failure.
  - Prompt caches reward stable contexts.
- **Hedging move:** "Suggests, not proves." Architecture wins independently.
- **Inbound:** declared as the first knob-turn after the opening.
- **Outbound:** "The frontend/backend split is just the top of a hierarchy" → recursion to component scale.

### S2 — Same idea, one level down (presentational components first)
- **Core claim:** same isolation principle at component scale: dumb pieces first, smart pieces on top.
- **Levers:** `a, v` (small surface to prompt + verify), then `c` (wiring needs only props ↔ data).
- **Inbound:** "just the top of a hierarchy" — explicit fractal framing.
- **Outbound:** "In practice this turns into a short recipe" → the 4-step recipe.

### S3 — Recipe for the frontend (4 steps)
A nested recipe; each step adds one more rule to `CLAUDE.md` (cumulative artifact — see cross-cutting threads).

#### S3.1 — Step 1: one component per prompt
- **Core:** prompt = single sentence, single component, no business logic.
- **Levers:** `a` (small prompt), `v` (small surface).
- **Artifact:** `CLAUDE.md` — "Frontend components" section. Load-bearing rule = "Propose a new prop and stop." (prevents the agent from reaching into stores).
- **Outbound:** the prompt is small but you need somewhere to *see* the result → showcase route.

#### S3.2 — Step 2: showcase route
- **Core:** `/showcase` = a flat, auth-free verification surface; the loop = build → register → open → eyeball.
- **Lever:** `v` (deterministic, cheap, no app state required).
- **Artifact:** image (`showcase.png`) + new `CLAUDE.md` bullet ("export it from /showcase, open the route, confirm it renders").
- **Outbound (line 116):** "The 'open the route' part only works if the agent has the tools to open a browser. That is the next step." — explicit handoff.

#### S3.3 — Step 3: actually opening the browser
- **Core:** without a real browser, agents fake verification ("the diff looks plausible" ≠ "I looked at the thing").
- **Sub-narrative:** "ways agents trip over this" `<Details>` block (Claude+MCP misconfig, Codex spawning duplicate browsers, vite port-fallback chain → multi-process kill).
- **Tool:** Chrome DevTools MCP. Two modes:
  - Mode 1 — spawn fresh Chrome (stateless, CI-shaped).
  - Mode 2 — attach to existing Chrome (real session, real console, bypasses auth).
- **Levers:** `v` (real surface), `c` (agent verifies itself).
- **Artifact:** `CLAUDE.md` — "Browser verification" section. Load-bearing rule = "If MCP unavailable, stop and ask. Do not invent a workaround." (otherwise: `curl` + lying).
- **Side note:** these rules can also live in a Claude *skill* (browser-verification) — keeps preamble lean.
- **Outbound:** mode 2 power → security risk → step 4.

#### S3.4 — Step 4: stay a little paranoid
- **Core:** after N permission prompts there's a temptation to flip full-auto. Don't, while a real browser is in the loop.
- **Risk frame:** Simon Willison's *lethal trifecta* (real session + untrusted content + outbound action). Indirect prompt injection — attacker only needs to talk to a page the agent loads.
- **Rule of thumb:** logged-out routes → mode 1 + prompts is fine; mode 2 → keep prompts on.
- **Lever:** **brake, not accelerator.** Explicit anti-productivity move. (line 179: "thirty seconds of clicking 'allow' beats one multi-hour incident review")
- **Outbound:** end of recipe → switch to a *parallel* concern, styling.

### S4 — A note on styling
- **Core:** plain CSS, design tokens, no utility framework. Indulgent because the app is for me.
- **Two preferences stated:**
  - Lean on latest CSS (Interop / Baseline).
  - No utility-class abstraction (anti-Tailwind, by personal taste, with disclaimer).
- **Stack:** CSS files colocated, design tokens in `design-system.css`, no CSS-in-JS.
- **Modern CSS that pulls weight:** `oklch()`, `light-dark()`, `color-mix(in oklch)`, `color-scheme` + `data-theme`, logical properties, attribute selectors.
- **Lever:** `a, v` — small surface to prompt against, easy to verify on /showcase.

#### S4a — Sub-thread: agents are stuck in 2020 web
- **Trigger:** the *honest caveat* — newly available features sit in agents' blind spots.
- **Concrete example:** PDF text-selection popup. Agent's instinct = `getBoundingClientRect` + scroll/resize listeners + manual flip logic. Modern answer = CSS anchor positioning (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`).
- **Mechanism:** JS only feeds 4 custom properties; browser does placement, scroll-tracking, flip.
- **Generalised lesson:** "treat hand-rolled JS for something the platform now does for free as a small smell." Keep Interop/Baseline/MDN bookmarks.
- **Workflow micro-rule (line 265):** always build component + stylesheet **together** in one prompt. Splitting produces "awkward seams."
- **Outbound:** another reader-specific wrinkle → formulas/graphs.

### S5 — Formulas and graphs (region-as-image selection)
- **Core:** PDFs' text layer is unreliable for math/diagrams. Solution: dual selection mode — text for prose, *region-as-image* (Shift+drag → PNG) for everything else. Multimodal models ingest the PNG directly; no OCR pipeline needed.
- **Implementation note:** thin because architecture had already done the work — pdf.js renders pages to `ImageBitmap` (LRU-cached for perf); region capture just crops via `OffscreenCanvas`. Coords stored in PDF-space, not viewport pixels (zoom-invariant).
- **Two takeaways:**
  - Clean layer boundary pays again — agent reused existing infra. *(lever: a, c)*
  - Pre-empt agents reaching for `html2canvas` / DOM screenshot — wrong because pdf.js already produced the bitmap.
- **Outbound:** "Dumb components are only half the story" → wiring to backend.

### S6 — Wiring components to a backend
- **Core problem:** frontend repo cannot see the backend. Need a contract that gives just enough about the backend to wire up, without dragging the backend back into context.
- **General answer:** documented contract → typed clients generated from it (GraphQL / OpenAPI / tRPC — any, as long as it's source-of-truth + generated, not hand-written / vibes-based).
- **This project's choice:** FastAPI's free `openapi.json` + `openapi-typescript` + `openapi-fetch`. One `pnpm gen:api` script, ~3-line client, typed query wrapper.
- **Levers:**
  - `a, c` — agent never reads backend repo.
  - `v` — type checker does verification by hand.
- **Exception:** SSE for LLM token streaming — `openapi-fetch` doesn't model SSE, so SSE handlers are *hand-typed* — a deliberate hole.
- **`CLAUDE.md` "API" section** (cumulative): contract is source of truth; never hand-write types; SSE handlers stay hand-typed.
- **Closing line:** "Same trick as the frontend recipe, one layer down."
- **Outbound:** the recipe generalises to backend → next section.

### S7 — On the backend: the same cadence
- **Core:** same idea, three differently-shaped piles, all independently parallelisable.

#### S7.1 — Crafting the data model (templated CRUD)
- 3 mirrored files per resource (SQLAlchemy / Pydantic / FastAPI router). Nested resources mount under parent, reuse `Depends(owned_pdf)` for ownership.
- OpenAPI updates auto → `pnpm gen:api` on FE. End-to-end resource = one prompt per side.
- **Lever:** `a, v` (templated; type checker + discriminated unions + migration autogen carry verification).
- **Caveat:** multi-step contracts (PDF upload's init → signed-URL PUT → finalize) won't be inferred from openapi.json — must live in `CLAUDE.md` directly. Otherwise: silent regression to "let me proxy through backend."

#### S7.2 — Slow things in their own process (jobs/workers)
- LLM calls, image analysis. Pattern: jobs table + status enum + worker polling `SELECT ... FOR UPDATE SKIP LOCKED` + enqueue route.
- **Lever:** `c` — two processes never compete for context.
- **`CLAUDE.md` rule:** long model responses must not hold a DB connection. SSE handler closes session before LLM call, opens fresh one for streaming write.

#### S7.3 — Prompts, caches, knobs
- Fastest-changing surface; small, isolated; doesn't touch rest of code.
- Verification cheap with eval harness; without one, human stays in the loop. *(self-aware todo confession)*
- **Footgun example:** BYO-key Gemini calls can't reuse project-scoped cache → 404 silent → response loses context → 20 minutes of debugging. Goes straight into `CLAUDE.md`.
- **Meta-claim:** prompts are the one of three that genuinely needs human attention. While you sit with a prompt, agents elsewhere build microservices and data models in parallel — bottleneck moves to wherever you happen to look.

**Outbound (S7 closing, line 397):** "Same cadence, different surface… each pile parallelises against the others without competing for `c`." → the analytical step-back.

### S8 — Stepping back: what was that recipe doing?
- **Move:** explicit re-binding of every recipe choice to the three levers from Part 0.
- Restates Part 0 formula: throughput = min((1−s)/(a+v+c), p/x).
- Once `p` is "a couple of agents on a laptop", the bottleneck is `a + v + c`.
- **Lever-by-lever recap:**
  - `a` ↓ — small surface per task; project hands context for free via `CLAUDE.md`, generated types, design tokens, known component shape.
  - `v` ↓ — each layer has its own deterministic check (typechecker, /showcase + browser, OpenAPI generator).
  - `c` ↓ — seams line up with where work splits (repo, file, style next to markup).
- **Subtle counterpoint:** "pulling levers harder than necessary stops paying" — tighter verification stops catching anything new; longer prompts reabsorb agent's job; more agents grow `c` non-linearly. **Goal: drive `a+v+c` below `x/p` and stop.**
- **Closing line (line 417):** "Then, sometimes, work on yourself instead of the workflow 😉."

### S9 — Running multiple agents
- **Premise:** Part 0's parallelism rule assumed every agent needs periodic attention. With this recipe, mostly they don't.

#### S9.1 — Two task types that parallelise cleanly
- **Type 1: building components.** Self-contained loop (build → /showcase export → browser confirm → typecheck/lint → iterate or stop). One agent per todo component, ~8 in parallel.
- **Type 2: wiring components to backend.** Slightly more attention, but contract surface (OpenAPI types + browser MCP + tests) does the verification. Prompt = "wire up X. Component in place. Layout settled. Endpoint in schema."
- **Pipeline picture:** Feature A in component-build mode, Feature B (yesterday's components) in wiring mode — different stretches of pipeline don't compete for `c`.

#### S9.2 — Tools that match
- **Claude Code (terminal) — backend.** Smaller / less verbose changes; uses skills, slash commands, hooks. *(lever: a, v)*
- **Codex app (GUI) — frontend.** Two earning features: clear "needs input" indicator (no polling) and change summary as review surface. *(lever: c, v)*
- **Typical day:** 2 Claude Code terminals on backend + Codex window with 2 frontend agents = ~4 live agents.

#### S9.3 — Plugging in the formula
- Measured: `x = 10`, `a = 1`, `v = 2`, `c ≈ 0.5`, `s = 0.01`.
- `p* ≈ 10 × 0.99 / (1+2+0.5) ≈ 2.8` → ~3 agents at crossover. Runs 4 (one past crossover, prefers waiting over idle agents).
- **Vs Part 0:** Part 0's example was just under 2 → this post's choices nudged crossover up by ~1 agent.
- **Honest downside:** orchestrating 4 drains you over an afternoon.
- **Qualifier preserved:** *Sometimes.* Long-running tasks with cheap verification fit; subjective product work (*"build me a chat composer that feels right"*) doesn't.
- **Whole-project total:** ~8 hours focused work over 3 days, four-agent sessions stitched.

### S10 — What's next (teaser)
- Picking the right *tool*: which agent, which model, which skill/slash setup. Different tools sit on different points of the `a+v+c` curve.

---

## 2. Cross-cutting threads (idea graph, non-linear)

These are recurring threads that re-enter different sections; useful for spotting where to add, cut, or rebalance.

### T1 — `CLAUDE.md` as a cumulative artifact
The post incrementally builds up an instruction file. Each addition has a *load-bearing rule* the author flags explicitly. Sections that contribute:
- S3.1 — frontend components rules (load-bearing: "Propose a new prop and stop").
- S3.2 — showcase export rule.
- S3.3 — browser verification rules (load-bearing: "If MCP unavailable, stop and ask").
- S4a — anchor positioning instruction ("don't use position: absolute").
- S5 — pre-empt html2canvas reach.
- S6 — API contract rules (gen:api, no hand-written types, SSE hand-typed).
- S7.1 — multi-step upload contract.
- S7.2 — DB connection lifetime rule.
- S7.3 — Gemini cache footgun.

→ Implicit ambient claim: `CLAUDE.md` is how you compress your own learning into agent behaviour.

### T2 — Isolation as fractal principle
- S1 (repo), S2 (component), S5 (layer boundary in pdf.js bitmap reuse), S6 ("same trick, one layer down"), S7 (three independent piles).
- **The recursion is the engine of the post.** Same shape applied at each scale.

### T3 — "Agent's mental model is dated"
- S4a — anchor positioning, oklch, etc.
- S5 — html2canvas instinct vs ImageBitmap.
- S7.1 — multi-step upload (model can't infer from schema).
- S7.3 — Gemini BYO-key cache 404.
→ Generalised: agent training cutoffs + missing project-specific invariants → both go into `CLAUDE.md`.

### T4 — Verification surface engineering
- S3.2 (showcase) → S3.3 (real browser) → S6 (typechecker via OpenAPI) → S7.1 (migration autogen) → S9.1 (browser MCP attaches to authed session for wiring).
- Every layer gets its own cheap deterministic check; this is why `v` collapses.

### T5 — Lever annotations in the prose
The author embeds `{/* lever: ... */}` MDX comments throughout. Distribution:
- `c` only: S1 (repo split), S3.4 (the brake).
- `a, v`: S2, S3.1, S4 styling, S7.1.
- `v` only: S3.2 (showcase), S3.3 (browser), S6 (type-checker).
- `v, c`: S3.3 (mode 2 browser), S9.2 (Codex).
- `a, c`: S5 (bitmap reuse), S6 (no cross-repo hopping).
→ Note: S4 styling section gets only one lever annotation despite being long — possible imbalance to revisit.

### T6 — Honesty / hedging moves
- "Suggests, not proves" (S1).
- "Subjective product work doesn't fit. *Sometimes.*" (S9).
- Eval harness gap confession (S7.3).
- "Built it in three days — short enough not to pretend the result is polished" (S0).
- "Pulling levers harder than necessary stops paying" (S8).
→ The post repeatedly tempers its own claims; this is part of its voice.

### T7 — The brake (S3.4) as the post's only anti-productivity move
Stands out structurally: every other lever annotation is about going faster; S3.4 explicitly says "this is a brake." Worth flagging — it grounds the rest of the post in operational reality (lethal trifecta, prompt injection).

### T9 — The formula as tradeoff (push `v` onto `x`, compensate with `p`)
The formula is a system to rebalance, not a target to minimise. Verification can sit on either side of the human/agent line. When it sits on the agent's side, it raises `x` rather than `v`; if `x` grows enough that `p/x` slips behind, the response is to raise `p`. The trade only pays when `c` is cheap — this recipe drove `c ≈ 0.5`, which is what makes raising `p` nearly free.

**Where the trade lands in the post:**
- **Named** at the end of S3.2 (Step 2: showcase route) — formula paragraph immediately after the *"stops being… becomes…"* line, before the showcase image. Uses the linter analogy: *"nobody hand-checks formatting once a linter is set up."*
- **Recapped** in S8, between the residue paragraph and the *"normal architectural choices"* sentence — collects the wider list of instances and states the c-must-be-cheap invariant explicitly.

**Instances throughout the post (`/showcase` is canonical, others are siblings):**
- `/showcase` itself — the agent builds, opens the page, looks (S3.2).
- Typecheck + lint inside the agent's S9.1 loop.
- Browser MCP reading its own console (S3.3).
- OpenAPI generator catching contract drift at compile time (S6).

**The version not yet built:** comprehensive automated tests the agent runs as part of its loop, plus the eval harness confessed-as-missing in S7.3. T9 reframes the eval harness gap from "todo confession" to "the strongest trade I haven't made yet."

**Connections to other threads:**
- Direct extension of **T4** (verification-surface engineering) — names *why* the verification surfaces matter in formula terms.
- Bounds **T7** (the brake) — security verification *cannot* be pushed agent-side, which is exactly why the brake is a permanent floor on `v`.
- Supported by **T1** (`CLAUDE.md` cumulative) — agent-side verification rules persist via `CLAUDE.md`.

**Why the trade is recipe-specific:** in high-`c` settings (team coordination, expensive context-loading), the same move does not pay. The S8 recap states this explicitly.

**Refinement added in S9 opener:** Part 0 treated `c` as a single number per agent. The S9 opener now flags that `c` actually scales with how *different* the tasks are — switching between two components is almost free, but switching between a web-to-PDF microservice and a bookmark-icon background is the real cost Part 0's `c` was modelling. This means the *"`c` cheap → trade pays"* invariant is more nuanced: **`c` is cheap *within* a task type, not in general.** The recipe pays because the multi-agent setup keeps similar work bunched together (frontend agents on /showcase + a few wiring agents = within-task-type clusters), not because `c` is universally low.

**Editorial note:** moving T9's first naming from S8 (where it was framed as a quiet retroactive reveal) to S3.2 (where it now lands as the explicit point of `/showcase`) made `/showcase` carry more analytic weight, and made S8 a cleaner recap. Earlier draft of S8 said *"the trade this recipe has been making without naming it"* — now reads *"the trade already named at `/showcase` and made throughout."*

### T8 — What stays human (the residue `s` measures)
A real thread, not a gap. The post repeatedly names what the human still does:
- **Visual / structural review on /showcase** — S3.2 line 104 (*"I looked at the thing"*).
- **Backstop verification when types can't carry it** — S6 line 342 (*"the agent (or I) would otherwise do by hand"*).
- **Reading prompt outputs by eye** — S7.3 lines 389, 393 (eval harness gap; "the bottleneck moves to wherever you happen to be looking").
- **The "would-be-faster-by-hand" boundary** — S8 line 415 (*"Longer prompts raise `a` until you are doing the agent's job by hand"*) — i.e., *sometimes I write the code myself*. This is also the explicit echo of Part 0's P0-6.
- **Final review of agent diffs** — S9.2 line 450 (Codex change summary as review surface; "needs my input" indicator).
- **Security approvals** — S3.4 (every permission popup).

The thread is present but **unnamed** — the references are scattered and the reader has to assemble them. Naming it in S8 (one sentence) would make `s = 0.01` feel earned. See I5 (revised).

---

## 3. Transition phrasings (verbatim)

Map of how the author moves between sections — useful when reordering or rewriting:

| From → To | Phrase (line) |
|-----------|---------------|
| S0 → S1 | *"Rather than one section per lever, I will walk through the build…"* (34) |
| S1 → S2 | *"The frontend/backend split is just the top of a hierarchy."* (58) |
| S2 → S3 | *"In practice this turns into a short recipe."* (68) |
| S3.1 → S3.2 | *"After the first component lands, ask the agent to set up a /showcase route…"* (101) |
| S3.2 → S3.3 | *"The 'open the route' part only works if the agent has the tools to open a browser. That is the next step."* (116) |
| S3.3 → S3.4 | *"When the Chrome DevTools MCP is running, the agent pauses and asks before each click…"* (160) |
| S3.4 → S4 | *"This is the only step in the recipe that has nothing to do with productivity."* (179) — then hard pivot to "## A note on styling" |
| S4 → S4a | *"One honest caveat. Newly available features are, by definition, too new for most agents."* (230) |
| S4a → S5 | *"Another reader-specific wrinkle."* (269) |
| S5 → S6 | *"Dumb components are only half the story."* (298) |
| S6 → S7 | *"Same trick as the frontend recipe, one layer down…"* (363) → "## On the backend: the same cadence" |
| S7 → S8 | *"Same cadence, different surface… each pile parallelises against the others without competing for c."* (397) → horizontal rule → "## Stepping back" |
| S8 → S9 | *"Then, sometimes, work on yourself instead of the workflow."* (417) — also bridges via *"sometimes"* echo into S9 |
| S9 → S10 | *"The next post will look at picking the right tool."* (472) |

---

## 4. Skeleton at a glance

```
S0   Recap + project intro + method
└── S1  Repo split (c)            ──┐
    └── S2  Components first (a,v,c)│  isolation, recursive
        └── S3  Recipe              │
            ├── S3.1 one-prompt-one-component (a,v) + CLAUDE.md
            ├── S3.2 /showcase (v) + CLAUDE.md
            ├── S3.3 browser MCP (v,c) + CLAUDE.md
            └── S3.4 stay paranoid (BRAKE)
        ├── S4  Styling (a,v)
        │    └── S4a agents stuck in 2020 web (anchor positioning)
        ├── S5  Region-as-image selection (a,c)
        ├── S6  Frontend↔backend contract (a,v,c) + CLAUDE.md
        └── S7  Backend, same cadence
            ├── S7.1 templated CRUD (a,v) + CLAUDE.md
            ├── S7.2 workers (c) + CLAUDE.md
            └── S7.3 prompts/caches/knobs + CLAUDE.md
S8   Re-bind to a/v/c; Part 0 recap; "stop pulling once below x/p"
S9   Multi-agent
    ├── S9.1 two task types (build vs wire)
    ├── S9.2 two tools (Claude Code + Codex)
    └── S9.3 measured numbers; p* ≈ 2.8 → run 4
S10  Teaser: next post on tool choice
```

---

## 5. Open questions / possible weak spots

(Scratchpad for the author / future me to act on, not claims about the post.)

- **S4 (styling) length vs lever payoff.** Long passage with only one `{/* lever */}` annotation. Either the lever connection is implicit (prompt size + verification on /showcase) and could be sharpened, or the section serves voice/aesthetic rather than the spine — both are fine, but worth being deliberate about.
- **S5 (region-as-image)** is the shortest "why this exists" beat; it leans heavily on T2 (isolation pays again) for its lever connection. Could be tightened or expanded depending on what the next post needs to reference.
- **S3.3's `<Details>` block** has three concrete failure modes. They're great colour but they're also the densest tactical content in the post; if length is a concern, this is a place where you can prune without losing the through-line.
- **S9.3's measured numbers** are stated without showing how they were measured. Believable as a lived-experience claim, but if the series ever gets a methodology appendix, this is a hook for it.
- **Self-referential gap (S7.3):** eval harness "between *please* and *yesterday*" is honest but is also the only place the recipe explicitly admits a missing rung. Worth knowing if the next post addresses it or punts.
- **No conclusion beat dedicated to the cost of `CLAUDE.md` itself.** The artifact accrues across ~8 sections; the post never asks what happens when it gets too long, contradicts itself, or rots. (Possibly intentional — fits T6's hedging ethos — but flagged.)

---

## 6. Part 0 (`dx-dp.mdx`) — main ideas and where Part 1 picks them up

Part 0 is *"Scaling the Productivity of a Spherical Developer in a Vacuum #0"* (slug: `dx-dp`, published 2026-02-07). Part 1 (this post) explicitly positions itself as the empirical follow-through.

### 6.1 Part 0 idea inventory

| ID | Idea | Form in Part 0 |
|----|------|----------------|
| P0-1 | "Pick your metric first" — productivity is context-dependent (sprint-finish vs critical-issue examples) | Framing |
| P0-2 | Developer-as-web-server analogy: you handle tasks, ensure correctness/security | Framing metaphor |
| P0-3 | Agents are subprocesses (Gemini/Claude/Codex). Plan, run commands, iterate. Meaningful but not independent. | Framing |
| P0-4 | Token cost exists but is bracketed for the model | Explicit assumption |
| P0-5 | Always verify — the mock-test war story (agent built the wrong mock to satisfy a refactor) | `<Details>` story |
| P0-6 | Three operating realities: (a) you block all tasks, (b) some tasks non-delegatable, (c) sometimes you're faster than the agent | Three-bullet list |
| P0-7 | The 6-parameter model: `a` prompt time, `v` verify+iterate, `c` context-switch, `x` agent gen time, `p` agent count, `s` non-delegatable fraction | Definitions |
| P0-8 | Personal throughput = `(1-s)/(a+v+c)` | Formula |
| P0-9 | Agent-side throughput = `p/x` | Formula |
| P0-10 | Real throughput = `min` of the two (bottleneck framing) | Formula |
| P0-11 | Crossover: `p* ≈ x(1-s)/(a+v+c)`. Below → agents limit you; above → you limit them. | Formula + interpretation |
| P0-12 | Worked example: `a=1, v=2, c=0, s=0.5, x=15` → ~0.166 tasks/min → 2–3 agents optimal; "more becomes stressful" | Numeric example |
| P0-13 | Practical takeaway: see which side is slower; if you're the bottleneck, agent count won't help — only smaller `a/v/c` or smaller `s` will | Closing |
| P0-14 | Cliffhanger: "next post will dive into practical ways to improve those levers" | Promise |
| P0-15 | Interactive `<ThroughputCalculator />` | Tooling |
| P0-16 | Limitations (`<Details>` block): | "To be fair, the model is too simple" |
| P0-16a | • Context switching not constant — grows non-linearly past ~2 agents | Limitation |
| P0-16b | • Tasks not evenly distributed / equally prioritised | Limitation |
| P0-16c | • Independence assumption requires clean separation (different parts of codebase) | Limitation |
| P0-16d | • Token cost ignored | Limitation |
| P0-16e | • Error/rework cost negligible — but loops fold into the parameters | Limitation |
| P0-16f | • Infinite task supply assumed | Limitation |
| P0-16g | • "You are not a web server" | Limitation (joke + truth) |

### 6.2 Where Part 1 picks each idea up

| Part 0 idea | Status in Part 1 | Where |
|-------------|------------------|-------|
| P0-7 (`a/v/c/x/p/s`) | **Backbone.** All `{/* lever: ... */}` annotations are in this vocabulary. | Whole post; explicit at S0, S8 |
| P0-8 / P0-9 / P0-10 (formulas) | **Restated verbatim** as the recipe's framing. | S8 |
| P0-11 (crossover formula) | **Restated and applied.** | S9.3 |
| P0-12 (worked example) | **Replayed with new numbers.** P0: a=1, v=2, c=0, s=0.5, x=15 → ~2 agents. P1: a=1, v=2, c≈0.5, s=0.01, x=10 → ~2.8 agents → runs 4. The lower `s` is the headline shift. | S9.3 |
| P0-13 (find the slower side) | **Becomes the thesis of S8.** "Once `p` is big enough, your personal lane becomes `a+v+c`" → entire recipe is about shrinking the personal side. | S8 |
| P0-14 (cliffhanger promise) | **Cashed in.** Part 1 *is* "practical ways to improve those levers." | S0 (line 16: "more honest way to check that claim than staring at the formula") |
| P0-16a (`c` non-linear past 2 agents) | **Echoed twice.** "more agents raise `c`, because parallel work eats your attention non-linearly" (S8) and "orchestrating four agents at once does drain you" (S9.3) | S8, S9.3 |
| P0-16c (independence requires clean separation) | **Engine of the post.** T2 (isolation as fractal) is exactly this idea operationalised — repo, component, layer, contract, worker. | S1, S2, S5, S6, S7 (every "isolation" beat) |
| P0-16b (uneven tasks) | **Partially addressed** via S9.1's two-task-types split (build vs wire) and S7.3's "prompts need attention, others can run." Not flagged as a Part 0 caveat being honoured. | S7.3, S9.1 |
| P0-3 (Claude/Codex/Gemini named) | **Reappears concretely** — Claude Code on backend, Codex app on frontend, Gemini BYO-key footgun. | S9.2, S7.3 |
| P0-5 (verify-the-results story) | **Generalised** into S3.3's "the diff looks plausible ≠ I looked at the thing" and the whole verification-surface thread (T4). The specific story is not retold. | S3.3, T4 |
| P0-6 (you block all tasks; sometimes you're faster) | **Implicit only.** Recipe assumes the blocking model; never restates it. | (ambient) |

### 6.3 Part 0 ideas Part 1 does NOT pick up (gaps / opportunities)

These are deliberate or accidental — flagged so you know what's still on the table for later posts in the series.

| Part 0 idea | Why it's not in Part 1 |
|-------------|------------------------|
| P0-1 (pick your metric) | Part 1 just *assumes* throughput-of-features is the metric. No re-grounding. |
| P0-2 (web-server analogy) | Dropped. Part 1 doesn't lean on the metaphor at all. |
| P0-4 / P0-16d (token cost) | Still bracketed. Part 1 mentions caches benefiting from stable contexts (S1) but never costs tokens. **Likely candidate for the "next post" on tool choice (S10).** |
| P0-15 (`<ThroughputCalculator />`) | Not re-imported. Part 1 just shows the math inline at S9.3. |
| P0-16e (error/rework) | Folded silently into measured `x = 10` — never called out as Part 0's caveat being respected. |
| P0-16f (infinite task supply) | Untouched — and arguably violated by the "8 hours over 3 days" framing (you *do* finish). |
| P0-16g (you are not a web server) | Dropped along with P0-2. |

### 6.4 Net delta (Part 0 → Part 1)

- **Vocabulary stays.** The `a/v/c/x/p/s` lexicon is now load-bearing across both posts; future posts can rely on it without re-introduction.
- **`s` collapses.** Part 0's example used `s = 0.5`; Part 1 measures `s = 0.01`. The whole recipe is implicitly an answer to "how do you push `s` toward zero" — i.e., make almost everything delegatable. Worth surfacing more explicitly if you ever rewrite S8.
- **`c` grows on purpose.** Part 0 set `c = 0` in the example; Part 1 admits `c ≈ 0.5` because of the multi-agent setup. The crossover only moved up by ~1 agent because `s` dropped enough to compensate. This is the actual quantitative story of the post and could be foregrounded.
- **The brake (S3.4)** is genuinely new — Part 0 has no security beat. It's the post's only purely qualitative addition to the model.
- **What's still owed:** token cost (P0-4), metric choice (P0-1), uneven tasks as a first-class concern (P0-16b). The teaser at S10 ("which agent, which model, which skill setup") fits naturally with token cost.

---

## 7. Gap analysis — what's missing

This is the load-bearing edit pass: places where the graph has a hole, an unsupported claim, or a thread that should exist but doesn't. Ranked by how much they affect the post's spine.

### 7.A High-impact gaps (the spine wobbles here)

**G1 — The post promises drift, then never shows it.**
S0 line 17–18: *"work on it for long enough, and watch the parameters drift."* And line 32: *"all three knobs got yanked at least once, often in the wrong direction first."* The post then never shows a single wrong direction. Every example is the *final* state of the recipe. Either:
- Pull one or two specific "I tried X first, here's why I backed out" beats into S3, S4a, or S6; or
- Drop the framing promise from S0 and reframe the post as "the recipe I converged on" rather than "watch the parameters drift."

This is the biggest framing-vs-content gap.

**G2 — *Revised* — the human-residue thread exists but is unnamed.**
*Initial reading was wrong: the thread is in the post.* See T8 for the full set of references (S3.2, S6, S7.3 ×2, S8, S9.2, S3.4). The actual gap is smaller: the references aren't collected under a label, so the reader has to assemble them on their own to audit `s = 0.01`. Fix is one labelling sentence in S8, not a new beat. See I5 (revised).

**G3 — `CLAUDE.md` is the post's main protagonist and is never costed.**
T1 catalogues 9 incremental additions. The post never asks: how long is this file by the end? Does the agent re-ingest it on every prompt (token cost — P0-4 still owed)? Do rules conflict (the SSE "don't regenerate" rule directly contradicts the OpenAPI "always regenerate" rule and only works because the agent is asked to honour both — what if it's a junior model)? When does it need refactoring into skills (S3.3 mentions skills as an alternative but doesn't return)?
This is the recipe's own hidden tax; absence of any accounting weakens S8's "stop pulling once below x/p" honesty.

**G4 — *Revised* — the cleanest fix is to align `x` with Part 0, not paper over the difference.**
P0-12: `x = 15 min` for "draft a plan and implement changes." P1 currently: `x = 10 min` for "crafts a feature." Comparing crossovers across two different `x` values is apples-to-oranges. Cleanest fix: **set `x = 15` in P1 to match Part 0's measurement convention**, then recompute `p*` and the surrounding narrative. See I1 (revised) for the recomputation.

### 7.B Missing connective tissue (transitions)

**G5 — S0 → S1 has no establishing shot of the project.**
We learn the three desiderata (lines 26–28) and then jump straight to "Frontend and backend, separate repos." The reader has no mental model of the actual app — pages, data flow, what the chat looks like — before architectural choices start landing. The two screenshots (S3.2, S5) arrive much later. Consider one paragraph or one early image grounding what was built before discussing how.

**G6 — S3.4 → S4 leaves the brake unresolved.**
The brake section ends at "thirty seconds of clicking 'allow' beats one multi-hour incident review" (line 179) and then hard-pivots to "## A note on styling." Two missing connections:
- Back to the lever model: the brake imposes a floor on `v` and an effective tax on `c`. The post excuses itself from this with "this is a brake, not an accelerator," but the lever model could absorb it (a security floor on `v` that you accept).
- Forward into S4: there's no bridge sentence. We exit a risk frame and land in CSS taste cold.

**G7 — "A note on styling" (S4) is tonally and topically out-of-pattern.**
Every other section earns its place via the lever model. S4 is mostly aesthetic preference plus modern-CSS evangelism, with the lever connection (`a, v` — small surface to prompt against) appearing once at line 228, half-buried. Either:
- Promote the lever connection to the section's opening claim; or
- Mark the section as a deliberate detour (e.g., "## A taste interlude") so the reader doesn't expect the same analytic register.

S4a (the dated-mental-model beat) is much stronger because it cleanly returns to the agent-collaboration frame.

**G8 — S6's contract menu is presented without trade-off analysis.**
"Any of them work, as long as the contract is the source of truth" (line 304) flattens the choice. But the lever costs differ:
- GraphQL = bigger schema, separate runtime, more tokens to ingest.
- OpenAPI = free with FastAPI, but doesn't model SSE/WebSocket (acknowledged later for SSE only).
- tRPC = monorepo-shaped; would undermine S1's repo split.
The choice has lever consequences; the post hides them. One sentence per option ("tRPC trades repo split for type-safety; for this stack OpenAPI was free") would honour the framing.

**G9 — S7's three subsections aren't structurally parallel.**
S7.1 = procedure + caveat. S7.2 = pattern sketch + one rule. S7.3 = mostly footguns + confession. The opening claim ("three rough types, all independently parallelisable") sets up a parallel triad that the body doesn't deliver. Either parallelise (each: pattern → lever payoff → rule that goes into `CLAUDE.md`) or drop the triad framing.

### 7.C Missing cross-cutting threads

**G10 — A "failure modes" thread is latent but unbuilt.**
Scattered across the post: vite port-fallback chain (S3.3), `html2canvas` reach (S5), Gemini cache 404 (S7.3), Codex spawning new browsers (S3.3), agent inventing `curl` workarounds (S3.3), mock-test war story (Part 0). These all share a shape: *"the agent's default reflex is wrong; pre-empt in `CLAUDE.md`."* T3 ("agent's mental model is dated") covers part of this, but a sibling thread T8 — *"agent's reflex defaults are wrong"* — would unify the operational war stories and justify the `CLAUDE.md` accumulation in T1.

**G11 — No thread on the personal-project frame.**
Voice cues recur ("for me," "I get to indulge," "between *please* and *yesterday*") but the recipe is never asked: *does any of this survive a team setting?* `CLAUDE.md` shared by 8 people, conflicting opinions on styling, mode-2 browser attached to whose Chrome session, who owns the eval harness gap, etc. The post would gain credibility by explicitly bracketing scope ("this is solo recipe; team setup may differ") rather than letting the reader assume the recipe generalises.

**G12 — No thread on time / actually-finished work.**
Times are scattered: 3 days (S0), `x = 10 min` (S9.3), 8 hours total (S9.3), 15 min in P0. They never appear in the same frame. A small accounting at S9.3 — *"3 days × 4-agent sessions = ~8 wall hours; 8 / (10/60) = ~48 features"* — would (a) sanity-check the numbers, (b) make `p* ≈ 2.8 → run 4` feel earned, (c) honour Part 0's `<ThroughputCalculator />` legacy without re-importing it.

### 7.D Part 0 promises still unpaid

(See 6.3 for the full list; these are the ones that affect the post's argument now, not just future posts.)

**G13 — P0-16e (error/rework) is folded silently into `x = 10`.**
S9.1 step 5: *"Iterate until everything is clean, or stop and ask if it cannot."* That's the rework loop. P0-16e said the model still works *if you fold loops into the parameters.* The post does fold them in but never says so. One footnote-y sentence at S9.3 ("`x = 10` is end-to-end including iteration") closes this.

**G14 — P0-1 (pick your metric) is unobserved.**
The post optimises for "features per hour over a weekend" without ever declaring it. For a personal project that's fine — but Part 0 made metric-choice the very first move. The omission is louder for readers coming straight from Part 0.

### 7.E Hidden costs of the recipe (asymmetry: every payoff is shown, every cost hidden)

Each of these is a real cost paid for a recipe choice in the post; none appear in the text.

| Cost | Created by | Where it should land |
|------|-----------|----------------------|
| `CLAUDE.md` maintenance, conflict, length | T1 (every section) | New beat in S8 |
| `pnpm gen:api` discipline; stale-types failure mode | S6 | S6 closing |
| Plain-CSS = no component library ecosystem (no MUI/shadcn) | S4 | S4 honest-caveat |
| Separate repos = no atomic full-stack commit; manual coordination on contract changes | S1, S6 | S6 |
| Codex app = vendor lock; not OSS; subscription | S9.2 | S9.2 |
| Mode-2 browser = real session leak surface (the brake exists *because* of this cost) | S3.4 | already there, but uncosted |
| Eval harness gap = manual prompt review = `s` floor | S7.3 | acknowledged but never priced |

S8's honesty beat ("pulling levers harder than necessary stops paying") is the natural home for one or two of these — currently it's all upside.

### 7.F Structural balance

**G15 — Length vs payoff:** S4 (~50 lines incl. S4a) and S6 (~70 lines) are the two longest sections. S5 and S7.2 are the shortest. The lever annotations density is roughly inverse — S4 has the fewest annotations per line. If the post needs trimming, S4 is the place; if S5/S7.2 deserve growth, it's because their lever stories (clean-layer-reuse, process-isolation-as-context-isolation) are stronger than their current word count suggests.

**G16 — S8 (recap) lands mid-post, not at the end.**
This is unusual but probably intentional: it sets up S9 ("running multiple agents") as the *application* of the recap rather than another beat. Worth verifying with a reader: does the post feel like it ends at S8 and then surprises you with a coda, or does S9 feel like the natural payoff? If the former, consider tightening S8 to a single paragraph and merging with S9's opening.

### 7.G One-line callouts

- **S5** is the only section with no `CLAUDE.md` rule added (only "*worth pre-empting in CLAUDE.md if you build something similar*"). Either escalate to a real rule or note that not every lesson needs a rule.
- **S2** says "Build the stupid presentational components first." But the recipe (S3) immediately codifies that. S2 is a single-claim bridge; could be folded into S3's preamble.
- **The phrase "lever: ..." appears in MDX comments only.** Readers don't see them. The annotations are author scaffolding; the prose has to make the lever connection on its own. Worth auditing: are the annotated-but-unstated levers actually clear from the text? (Spot check: S5 line 291 annotates `a, c` but the prose doesn't earn `a` — only `c`.)
- **No mention of testing the components themselves.** The CLAUDE.md rule is "Do not write tests unless asked." Tests appear once in S9.1 ("Run typecheck and lint") and once in S9.1 ("Tests catch regressions in code that already worked"). Testing strategy is a real `v` lever and is essentially unaddressed.
- **The "skill" mechanism (S3.3) is mentioned once and dropped.** If skills are a way to keep `CLAUDE.md` lean (G3), they deserve a fuller beat or a callback in S8.

### 7.H Summary of biggest interventions to consider

1. **G1 + G2 + G14** form a cluster: the post needs to either show the drift or restate the metric and the irreducibly-human residue. Doing so would let `s = 0.01` feel earned instead of asserted.
2. **G3 + E** form a cluster: the recipe needs one honest beat about its own costs, ideally inside S8.
3. **G4** is a one-sentence fix at S9.3 and probably the highest-leverage edit in the whole post.
4. **G7 + G15** form a cluster: S4's role in the spine is unclear; either commit to it as analysis or mark it as detour.
5. **G10** is a free upgrade: a sibling thread to T3 that costs nothing structural — it just names a pattern the post already exhibits.

---

## 8. Suggested improvements

Concrete edits, ranked by leverage (impact ÷ effort). Each one names the gap it addresses, the location, and the rough shape of the change. Draft prose where it's short enough to be useful.

### 8.1 Surgical (one-line or one-paragraph) fixes — do these first

#### I1 — *Revised* — set `x = 15` to match Part 0 (addresses G4)
**Where:** S9.3, the measurement paragraph (line 456) and the formula immediately after (line 460).
**What:** Replace `x = 10` with `x = 15` (Part 0's convention) and recompute.

**New numbers** (a=1, v=2, c=0.5, s=0.01, **x=15**):

```
p* ≈ 15 × 0.99 / (1 + 2 + 0.5)
   ≈ 14.85 / 3.5
   ≈ 4.24
```

**Narrative consequence:** the current text says *"about three agents is where the agent side stops being the bottleneck. Four is what I tend to run, one past the crossover."* With `x = 15` the crossover lands at ~4.2, so the rephrasing becomes:

> *"About four agents is where the agent side stops being the bottleneck. Four is what I tend to run, right at the crossover — close enough that I would rather be the one waiting than have an agent sit idle."*

The "Part 0 put the same crossover at just under two" line still works: P0's example (a=1, v=2, c=0, s=0.5, x=15) → p* ≈ 2.5; P1's recipe drives it to ~4.2. The choices in this post nudge the crossover up by roughly **two** agents, not one — a stronger headline claim than the original draft, and now apples-to-apples.

**Why this is the highest-leverage edit:** it lets the comparison with Part 0 actually mean something. Plus the new "I run 4, right at the crossover" reads more honestly than "one past."

#### I2 — Acknowledge the rework loop is folded into `x` (addresses G13)
**Where:** S9.3, same paragraph as I1.
**What:** One half-sentence noting that `x = 15` is end-to-end (includes the iteration loop from S9.1), matching Part 0's convention.
**Draft:** *"`x = 15` is end-to-end, iteration loop included — the same convention Part 0 used."*

#### I3 — Lever annotation audit pass (addresses G7's spot-check, T5 imbalance)
**Where:** Search the post for `{/* lever:` and verify each one is *also* earned in prose.
**Known weak spots:** S5 line 291 annotates `a, c` but prose only earns `c`. S4 line 228 annotates `a, v` for the entire styling section but only the design-tokens paragraph supports it.
**What:** For each weak annotation, either add one prose sentence that earns the lever or drop the annotation.

#### I4 — Mark S2 as a bridge, not a section (addresses G7-callout)
**Where:** S2 ("The same idea, one level down") — currently a 6-line section.
**What:** Demote to S3's preamble. The single load-bearing claim ("same separation principle, one scale down") is enough as an opener for the recipe; it doesn't need its own H2.
**Effect:** Tightens the recipe block, removes a structurally redundant header.

### 8.2 One-beat additions — high payoff for ~1 paragraph

#### I5 — *Revised* — name the existing human-residue thread, don't add a new beat (addresses revised G2 + G14)
**What changed:** The thread is already in the post (T8). I was wrong that it was missing. The fix is smaller: give it a label so the reader can see it as one thing instead of six scattered references.
**Where:** S8, one sentence inside the lever-by-lever recap — or as a tail to the recap before "These are normal architectural choices…" (line 413).
**What:** One labelling sentence that points back at the existing references; no new content.
**Draft shape:**
> *"What `s` actually measures, end to end, is the residue this post has been quietly naming all along: glancing at /showcase to see if the thing rendered (S3.2), backstopping the type checker by hand when it can't carry the case (S6), reading prompt outputs by eye (S7.3), reviewing the Codex change summary when an agent flags it (S9.2), approving security prompts (S3.4), and writing the code myself on the cases where prompting it would cost more than typing it (S8). Part 0 put `s` at 0.5; this list drove it to ~0.01."*

(The S-numbers wouldn't appear in the final prose; they're here so you can see which thread-references the sentence is collecting. In the final post this becomes a smooth one-sentence enumeration.)

**Why:** Same payoff as the original I5 — earns `s = 0.01` and closes G1's "watch the parameters drift" framing — but at the cost of one sentence rather than a full paragraph, because the post already did the work elsewhere.

#### I6 — Honest costs beat in S8 (addresses G3 + E)
**Where:** S8, immediately after the "pulling levers harder than necessary stops paying" paragraph (line 415).
**What:** One paragraph naming 2–3 of the recipe's own costs from the table in 7.E.
**Draft shape:**
> *"And the recipe itself isn't free. `CLAUDE.md` accumulates — by the end of this post it has nine sections, and rules have started to caveat each other (regenerate the OpenAPI types, except the SSE handlers, except when the schema drift looks suspicious). The plain-CSS choice means no component library to lean on the day you want a complicated table. Two repos means no atomic commit when an endpoint changes shape. The brake from S3.4 is a permanent tax on `v`. Each of these is paid for elsewhere in lever savings — but they exist, and a recipe that pretends otherwise will mislead anyone copying it."*

**Why:** S8's honesty about diminishing returns is exactly the right place to also be honest about ongoing costs. Currently the post is monotonically positive on its own choices — adding this paragraph turns S8 from a recap into the post's most credible section.

#### I7 — Project establishing shot at S0 (addresses G5)
**Where:** S0, after the three-bullet desiderata (after line 28).
**What:** One short paragraph or one early image showing the *thing*. Could reuse the showcase screenshot from S3.2, just earlier and smaller.
**Draft shape:**
> *"Concretely: open a paper, drag-select a paragraph, get a chat panel pinned next to it. Shift-drag a region for a formula or figure, and the same panel takes the image. A handwritten note attaches to the page. That's the whole app — three desiderata become one screen, and the rest of this post is about how that screen got built."*

**Effect:** Reader has a mental model before architectural choices start landing.

### 8.3 Short new sub-sections — additive, ~10 lines each

#### I8 — Fold "agent reflex defaults are wrong" into T3 explicitly (addresses G10)
**Where:** Either S5 or as a sidebar in S7.3.
**What:** Promote T3 ("agent's mental model is dated") to cover a wider pattern: not just *temporally* dated training data, but *reflex defaults* (vite port-fallback, html2canvas, curl-as-verification, Gemini cache assumption).
**How:** One named sub-thread in S8's recap or a short callout in S5 that says "this is the same shape as html2canvas-vs-pdf.js — agents reach for the most common-looking answer; pre-empt in `CLAUDE.md`."
**Free because:** the war stories already exist; this just names the pattern.

#### I9 — Bracket scope at S0 (addresses G11)
**Where:** S0, one sentence near the end of the section.
**What:** Explicit scope statement.
**Draft:** *"This recipe is solo: one developer, one `CLAUDE.md`, one Chrome session. Multi-developer team versions of any of these (shared instruction files, attached browsers per dev, eval harness ownership) are out of scope here — and probably load-bearing enough to need their own post."*
**Why:** Sets reader expectations honestly; prevents the implicit "this scales to teams" misread.

#### I10 — Reorder S4 to lead with the lever (addresses G7)
**Where:** S4 opening (line 182).
**What:** Swap the current "I have strong preferences" opening for a lever-first opening.
**Draft shape:**
> *"Styling is where the recipe meets aesthetic taste, so this section is partly opinion. The lever payoff first: a flat token-based CSS system gives every new component a small, prompt-able surface and a verification target on /showcase, with no special vocabulary for the agent to misuse. The opinion second: I lean on plain CSS with modern features (no utility framework, no CSS-in-JS) because for me they read better. If you ship Tailwind happily, the lever argument still applies — substitute its tokens for mine."*
**Effect:** S4 stops being a tonal break and starts paying its way in the spine.

### 8.4 Restructuring — bigger, only worth it if the post is being rewritten

#### I11 — Show one wrong direction (addresses G1)
**Where:** Insert a short `<Details>` block in S3, S4a, or S6.
**What:** One concrete "I tried X first, here's what broke" beat. Best candidate from the codebase: probably the anchor-positioning story (the agent built the 2020 answer; you backed it out — but you only see the rebuilt version in S4a). Showing the *first* attempt as a foil would make G1 disappear.
**Effort:** Real — needs a story you didn't tell. But it's the cleanest fix for the post's biggest framing-vs-content gap.

#### I12 — Make S7 actually parallel (addresses G9)
**Where:** S7.1 / S7.2 / S7.3.
**What:** Each subsection in the same shape: pattern → lever payoff → `CLAUDE.md` rule → footgun. Currently S7.1 has the pattern most fully, S7.3 has the most footguns, S7.2 has the rule cleanest.
**Effort:** Medium — light rewriting of 3 subsections. Pays off because the parent claim ("three rough types, all parallelisable") finally has a triad-shaped body to rest on.

#### I13 — Trade-off pass on S6's contract menu (addresses G8)
**Where:** S6, paragraph beginning "A few well-trodden formats fit" (line 304).
**What:** One sentence per option naming its lever cost.
**Draft:**
> *"GraphQL: typed schema doubles as contract, but the schema sits in a separate runtime that costs tokens to ingest. tRPC: best-in-class type safety, but assumes monorepo — undermines the repo split from S1. OpenAPI: free with FastAPI, doesn't model SSE (which bites later). I went with OpenAPI because it was free; the SSE hole below is the cost."*
**Effect:** Choices stop looking equivalent and start looking lever-driven.

### 8.5 Don't bother

A few candidate edits that would add length without paying for themselves:

- **Don't re-import `<ThroughputCalculator />`.** S9.3's inline math is enough; the calculator was a Part 0 device.
- **Don't expand S5.** It's short for a reason — the lever story is "isolation pays again," not a new beat. Keep it lean.
- **Don't add a testing section.** The CLAUDE.md rule "Do not write tests unless asked" is a deliberate stance for this project; expanding it would invite a debate the post isn't trying to have. One callout flagging it (already in 7.G) is enough.
- **Don't add a teams-vs-solo section.** I9's one-sentence scope bracket is the right size; a full section would derail the spine.

### 8.6 Recommended editing order

If the goal is the highest-impact small set of edits, do these and stop:

1. **I1+I2** (one paragraph at S9.3) — fixes G4 + G13.
2. **I5** (one paragraph in S8) — fixes G2 + G14, retroactively earns `s = 0.01`.
3. **I6** (one paragraph in S8) — fixes G3, makes S8 the post's most credible section.
4. **I10** (rewrite S4 opening) — fixes G7, S4 stops feeling like a detour.
5. **I3** (lever annotation audit) — small mechanical pass, raises rigour throughout.

That's ~3 new paragraphs, one rewritten paragraph, and a search-replace pass. The post's spine straightens noticeably without changing its shape or length more than ~5%.
