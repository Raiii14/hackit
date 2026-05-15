# PROJECT_GUIDE.md

Project-local behavioral guidelines for working on this Hack-It-UP 2026 fintech hackathon project.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

Use this file for working behavior. Use `guidelines.md` for official challenge details, rules, dates, deliverables, judging criteria, and contact information. Use memory only for short persistent context.

These principles also apply to proposal, pitch, prototype, and concept work. The goal is to reduce common LLM mistakes such as hidden assumptions, vague scope, unsupported claims, and solutions that sound impressive but do not fit the hackathon constraints.

## Hackathon Context

- Event: UP SoComSci Hack-It-UP 2026 under Tech Week 2026: Wreck-It, Fix-It.
- General theme: FinTech for Change.
- Expected domain: Financial Technology solutions with real-world impact in the Philippine context.
- Team format: exactly 4 enrolled college students.
- Preliminary deliverables: a maximum 3-minute `.mp4` video and a 1-page `.pdf` paper.
- Finals deliverable: a 5-minute pitch, 10-minute judge Q&A, and a working prototype, mockup, or functional demo.
- Judging signals: innovation, clarity of presentation, feasibility, technology integration, SDG relevance, live demo quality, and Q&A defense.
- Current SDG frame from the brief: SDG 1, SDG 8, or SDG 10.

## FinTech Direction

Prioritize concepts that are narrow enough to prototype quickly and concrete enough to defend under judging. Strong concepts should identify:

- A specific user group, such as students, sari-sari store owners, gig workers, OFWs and their families, underbanked households, microentrepreneurs, cooperatives, or local community organizations.
- A specific financial pain point, such as access to credit, savings behavior, remittances, budgeting, fraud prevention, financial literacy, cash-flow tracking, payment friction, insurance awareness, or responsible lending.
- A technology mechanism that is plausible in a hackathon prototype, such as a web app, mobile-first interface, rules engine, data dashboard, AI assistant, credit-risk explainer, fraud-risk checker, OCR-assisted receipt tracker, or lightweight analytics workflow.
- A measurable impact path tied to the selected SDG.

Avoid concepts that depend on bank partnerships, live payment rails, regulatory approval, production-grade KYC, or sensitive financial data access unless the prototype can clearly simulate those parts.

## Core Rules

1. Think before doing.
   - State assumptions.
   - Ask clarifying questions when requirements, scope, or constraints are unclear.
   - If multiple readings exist, surface them.
   - Prefer the simpler valid approach.

2. Keep it minimal.
   - Do only what was asked.
   - No speculative features or abstractions.
   - No extra configurability.
   - Rewrite overcomplicated code.

3. Change only what is needed.
   - Match existing style.
   - Do not refactor unrelated code.
   - Do not clean up unrelated comments or formatting.
   - Remove only the dead code your change creates.

4. Work against checks.
   - Define what success means.
   - Prefer verifiable steps.
   - Verify with the lightest useful check: readback, targeted test, or command output.
   - For concept work, check the idea against the judging criteria and the preliminary/finals deliverables.

5. Use the right source.
   - `guidelines.md`: rules, dates, requirements, criteria, prizes, and official event details.
   - memory: compact project facts.
   - this file: execution behavior.
   - If a detail matters, read the owning file.

6. In Codex CLI:
   - Inspect before editing when possible.
   - Keep diffs scoped to the request.
   - If sandboxing blocks a needed command, request escalation for that command.
   - If parallel work helps, split tasks cleanly.
   - At the end of a meaningful session, use `context/PROJECT_HANDOFF.md`.

## Concept Quality Bar

When drafting or evaluating a hackathon idea, answer these questions directly:

- What Philippine financial problem is being solved?
- Who experiences this problem, and why is the segment specific enough?
- Which SDG does the solution support, and what is the causal link?
- What can be shown in a prototype within the hackathon timeline?
- What assumptions are risky, especially around data, compliance, adoption, and trust?
- Why is the solution better than a spreadsheet, static information campaign, or existing fintech app?
- What would judges see during the live demo in the first 60 seconds?

## Communication Preferences

- Prefer short repo-relative file references such as `context/file.md` instead of long absolute paths, unless an absolute path is truly needed.
- Prefer pragmatic, skeptical, detail-oriented, and clever analysis.
- When evaluating an idea, surface weaknesses, scope risks, and tradeoffs directly instead of defending the idea by default.
- Use plain hackathon language: problem, users, solution, prototype, impact, risks, and judging fit.
