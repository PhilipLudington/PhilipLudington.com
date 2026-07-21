---
title: "How I Drive Claude Code: A Practical Guide to Agentic Engineering"
description: "A working engineer's guide to getting correct, low-debt software out of a coding agent — design docs, phased delivery with verification gates, continuous review, and knowing when to change tactics."
date: 2026-07-21
tags: [claude-code, ai-agents, workflow, developer-tools, engineering]
---

Most of what gets written about coding agents falls into two piles. One pile says they're magic — point them at a repo and watch a startup fall out. The other says they're useless — glorified autocomplete that can't be trusted with anything real. Neither pile is written by someone who ships production software with an agent every day.

I'm in the third camp. I ship real software with an agent every day, and the honest answer is that it's neither magic nor useless — it's a power tool that rewards structure and punishes hope.

What follows is that structure: how I actually drive Claude Code to produce software that's *correct*, not just fast.

The whole method rests on one belief: **an agent is a capable but fallible engineer, not an oracle.** Everything below follows from taking that seriously. You don't hand a capable-but-fallible engineer a vague sentence and merge whatever comes back. You give them a spec, a plan, gates to prove they're on track, and review at the door. The agent is faster than a human at all of it — which means your leverage is entirely in the structure you put around it.

## 1. Start in conversation — capture the idea, then the design

The single biggest predictor of whether an agent session goes well is whether I know what I'm building before it starts typing. That sounds obvious. In practice almost nobody does it, because the agent is *right there* and it's so easy to just start.

Resist. My work starts as a conversation, not a task — and it happens in two distinct passes. First I capture the *idea*: talk it through with the agent, poke at edge cases, let it surface things I hadn't considered. When it's real, it goes into an `IDEA.md`. Then a *separate* conversation uses that idea to work out the *design* — the actual shape of the thing, the tradeoffs, what's explicitly out of scope — and that becomes a `DESIGN.md`. When a project has a strong opinion about *how* it should be built, the values that should win when two good options conflict, that lands in a `PHILOSOPHY.md` in between.

Splitting idea from design matters, because they want opposite headspaces. Ideation is divergent and greedy for possibilities; design is convergent and ruthless about scope. Collapse them into one prompt and you build the first plausible thing instead of the right thing. And the out-of-scope line in `DESIGN.md` earns its keep more than any other — it's the fence that stops a two-hour task from quietly becoming a two-day one.

These docs are also the artifact I hand *back* to the agent later, when context has rolled over and it's forgotten why a decision was made. Written-down intent is the thing agents don't have and can't reconstruct.

## 2. The document pipeline *is* the method

Here's the part that's easy to miss: those documents aren't notes to myself. They're a **named, formatted pipeline that both Claude Code and my own tooling read.** Work flows through a fixed chain of files:

```
IDEA.md → (PHILOSOPHY.md) → DESIGN.md → PLAN.md → BUG.md
```

Idea, then philosophy when it earns a place, then design, then the phased plan, then the bugs found along the way. Each document has a *specified format* — not for tidiness, but because format is an interface. When `PLAN.md` always structures its phases and tasks the same way, the agent knows exactly where to look — and so does the workflow tooling I've built to watch my projects (more on that below). Freeform notes are legible to a human on a good day. A specified format is legible to a machine every time.

If `DESIGN.md` says *what*, `PLAN.md` says *in what order, and how we'll know each step worked*. I break every non-trivial build into numbered phases, each with a goal, concrete deliverables, a task checklist, and — the part people skip — a **testing strategy that defines "done."** Phase 2 doesn't start until Phase 1 is provably complete.

```markdown
## Phase 1: Core parser
**Goal:** Tokenize and parse the full grammar into an AST.

### Tasks
- [x] Lexer with position tracking (completed 2026-07-14)
- [ ] Recursive-descent parser for expressions
- [ ] Error recovery with useful messages

### Testing Strategy
Round-trip 40 sample files; AST matches golden snapshots.
```

The phased plan is what turns "build me a compiler" — a prompt that produces a plausible-looking disaster — into fifteen small tasks, each of which the agent can actually get right, each of which I can actually verify.

## 3. Drive one phase at a time, and make the gate real

Here's the loop that does the actual work:

1. Point the agent at the current phase. Only the current phase.
2. Let it implement.
3. **Run the gate** — the tests, the build, the actual behavior — before accepting anything.
4. Green? Mark the tasks done, commit, move to the next phase.
5. Red? The agent debugs against the failure. It does not advance.

The discipline is entirely in step 3. An agent will happily tell you a phase is complete. Belief is not a gate. A passing test suite is a gate. A clean build is a gate. The app doing the thing when you run it is a gate. If "done" can't be checked by something other than the agent's say-so, it isn't done.

This is also why small phases win: a gate on a small phase tells you *exactly* what broke. A gate on a giant phase tells you only that something, somewhere, is wrong — which is barely more useful than no gate at all.

## 4. Give the agent a constitution, and enforce the house rules

An agent's context is its whole world. Anything not in it, or not reliably re-derivable from the repo, effectively doesn't exist. So I keep a `CLAUDE.md` at the top of every project — a constitution the agent reads every session. Project layout, build commands, conventions, and the non-negotiable rules.

Some of my rules are unusually strict on purpose. For example: **never write file contents through the shell** — no `echo >`, no `cat <<EOF`, no `printf` into a file. Always use the proper file-editing tools. Why so absolute? Because "usually use the editor" leaves a crack, and agents find cracks. A rule with an exception is a rule the agent will argue itself out of at 2am. A rule with no exceptions is one I never have to think about again.

Same reasoning drives "use the real search and read tools, not their shell equivalents." The point isn't the specific tool. The point is that a small number of bright-line rules, enforced without exception, eliminate an entire category of low-grade mistakes so I can spend my attention on the ones that matter.

## 5. Review continuously — pay the debt as you go

The failure mode of fast agents isn't bad code. It's *plausible* code — code that works, passes, and quietly accretes into a mess you can't extend three weeks later. Velocity without review isn't velocity; it's a loan.

So I review continuously, not at the end. After a meaningful change, a dedicated review pass — a fresh agent, or a review skill, whose whole job is to be skeptical of the diff: correctness, edge cases, coupling, tests that assert nothing. Bugs get fixed now, while the context is hot and the change is small, not discovered in production when it's neither. I run a lightweight "simplify" pass in the same spirit — reuse, dead code, needless complexity — purely to keep the debt down.

Continuous review is what makes the speed *safe*. It's the difference between shipping fast and shipping fast into a wall.

Right now that review lives in the conversation and in the fixes it produces. The next link I'm adding to the pipeline is making it an artifact like everything else — a review document with a specified format that my review agents write to, so findings become first-class and trackable instead of scrolling away. The chain isn't finished. That's rather the point: it's a pipeline, and pipelines earn new stages.

## 6. Track the work you can actually see

Because I run several projects at once, I can't hold each one's state in my head. So I externalize it — and this is where the specified formats pay off. Task state lives in `PLAN.md`. Bugs live in a `BUG.md` with checkboxes — open is `[ ]`, fixed is `[x]` — so status is a diff, not a vibe. Long-horizon work lives in a `ROADMAP.md` that spans the whole project, above any single sprint.

State also has to survive *stopping*. An agent's context is finite, and the useful life of a session ends long before the work does — you hit a natural pause, or the context fills with noise. So when I need to stop a task in flight, I have the agent write a `RESUME.md`: what we were doing, what's done, what's next, and any open threads or half-made decisions. A brand-new session reads it and picks up cold — no re-explaining, no reconstructing where we were. It's a save point for work-in-progress, and it's how a single task can span three sessions without losing the plot.

The tooling I mentioned earlier reads exactly these files. It's a menu-bar app — AirTower — that watches all of it at a glance: git status, whether the build's green, whether tests pass, how many tasks are left in the current plan, across every repo at once. Because every project speaks the same document format, one dashboard can read all of them. The agent moves fast; the dashboard is how I stay oriented while it does. You can't supervise what you can't see.

## 7. When it gets stubborn, change tactics — not just prompts

Sometimes a problem digs in. The agent circles, tries the same three things, and gets nowhere. Prompting harder rarely helps. Changing the *shape* of the attack does:

- **Switch the persona.** Tell it to stop being an implementer and be a skeptical reviewer of its own last attempt. A different role notices different things.
- **Stage a cross-model debate.** Put two models on the same bug and make them argue. Where they disagree is almost always where the truth is hiding.
- **Feed in your own hunch.** You've seen the system behave. That intuition — "I bet it's the rounding in the turn processor" — is real signal the agent doesn't have. Hand it over as a hypothesis to test, not a fact to accept.

The meta-skill is noticing you're stuck *early*, before you've burned an hour, and reaching for a different tool instead of a bigger hammer.

---

Structure is the whole game. The conversations, the named documents, the gates, the continuous review — none of it makes the agent smarter. It makes the agent's output *trustworthy*: fast where the agent is reliable, and caught before it ships where it isn't. An agent will proudly show you all green while something is quietly, deeply wrong; the structure is what stands between that and production. The judgment about when *not* to trust the green is still the job, and that part doesn't delegate.

---

*I write about game development and building with AI over at [MrPhilGames](https://mrphilgames.com). If you're hiring for this kind of work, [here's how I can help](/hire).*
