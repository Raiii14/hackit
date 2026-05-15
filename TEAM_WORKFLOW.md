# Team Workflow

Use this file to onboard team members, AI tools, or a fresh work session for the Hack-It-UP 2026 FinTech hackathon project.

## Read First

1. `guidelines.md` - official event context, dates, deliverables, rules, judging criteria, and submission requirements.
2. `context/PROJECT_GUIDE.md` - project-local working standards for concept, pitch, prototype, and AI-assisted work.
3. `context/ONLINE_DATA_AND_GAPS.md` - online evidence, observed market similarities, and the gap worth targeting.
4. `features.md` - active core feature scope for the repayment stress simulator.
5. `systemflow.md` - active user flow, data flow, and input requirements.
6. `DESIGN.md` - visual direction and design-system guardrails for prototype screens.
7. `context/OLD_IDEAS.md` - rejected earlier directions and why they should not be revived casually.
8. `context/DECISIONS.md` - stable decisions that future work must respect.
9. `context/SESSION_CLOSEOUT.md` - checklist for ending meaningful sessions and pull requests.

## Current Project Frame

- Event: UP SoComSci Hack-It-UP 2026.
- Theme: FinTech for Change.
- Current concept: a repayment stress simulator for small informal Filipino sellers.
- Target user: sari-sari store owners and small online sellers.
- Core problem: informal sellers may find loans, but often cannot tell whether repayment timing will break their cash flow if income drops.
- Product angle: repayment stress testing and cash-flow fit, not lending, wallet creation, payment processing, credit scoring, or generic budgeting.
- Prototype expectation: a clear demo, mockup, or functional flow that can be defended in a 5-minute finals pitch and 10-minute Q&A.

## Source of Truth

- Use `guidelines.md` for exact event rules, deadlines, deliverables, eligibility, submission details, and judging weights.
- Use `context/PROJECT_GUIDE.md` for how to work on this project.
- Use `features.md` for the active feature scope.
- Use `systemflow.md` for the active product flow and input requirements.
- Use `DESIGN.md` for visual style, layout, typography, color, and component direction.
- Use `context/ONLINE_DATA_AND_GAPS.md` for market evidence and problem justification.
- Use `context/OLD_IDEAS.md` before bringing back older ideas.
- Do not treat chat history, personal memory, or copied notes as the source of truth when a repo file owns the information.

## Parallel Work Note

Another Codex session may be updating these product files:

- `features.md`
- `systemflow.md`
- `DESIGN.md`
- `context/ONLINE_DATA_AND_GAPS.md`

Avoid editing those files at the same time unless you are intentionally coordinating changes. If you need their latest content, read them before writing anything that depends on the idea direction.

## Team Rules

- Keep the scope hackathon-sized: one sharp user, one urgent financial decision, one memorable demo.
- Prefer specific Philippine user stories over broad "financial inclusion for everyone" claims.
- Do not build or pitch the project as a lender, credit bureau, wallet, KYC provider, or guaranteed scam detector.
- Keep scam or red-flag detection secondary unless the concept file explicitly changes.
- Support factual claims with sources from `context/ONLINE_DATA_AND_GAPS.md` or add sources there.
- Do not include school-identifying details in preliminary deliverables unless the official rules change.
- Keep durable decisions in `context/DECISIONS.md`, not buried in chat.
- Before opening or merging a pull request, run `context/SESSION_CLOSEOUT.md`; stale facts are treated as a review blocker.
- If a change makes any file stale, update that owning file in the same pull request.
- When unsure, choose the narrower, more defensible version.

## Work Lanes

Use these lanes to avoid duplicated work.

1. Research lane: validate the financial inclusion problem, market gap, competitors, sources, and citations.
2. Concept lane: refine the repayment stress simulator's problem framing, target user, objectives, SDG fit, and scope boundary.
3. Prototype lane: build the demo flow, screens, rules engine, percentage-drop testing, and mock data.
4. Design lane: apply `DESIGN.md` to screens so the prototype has a specific visual identity instead of generic fintech styling.
5. Pitch lane: prepare the 3-minute preliminary video story, 1-page paper, 5-minute finals pitch, and Q&A defense.
6. Review lane: test the idea against judging criteria, feasibility, originality, technology adoption, live demo clarity, and source-of-truth freshness.

## AI Tool Instructions

When starting a new AI session, ask it to read:

1. `TEAM_WORKFLOW.md`
2. `guidelines.md`
3. `context/PROJECT_GUIDE.md`
4. `features.md` and `systemflow.md` for product work
5. `DESIGN.md` for UI/prototype work
6. The specific file that owns the task

Tell the AI which lane it is working in. Keep edits scoped to that lane unless the task requires coordination.

## Session Closeout

At the end of a meaningful session, record:

- Stable decisions to append to `context/DECISIONS.md`.
- Updated concept, research, prototype, or pitch files.
- Any unresolved gaps or risky assumptions.
- The next active focus for the team.
- Whether `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md` still agree.

Use `context/SESSION_CLOSEOUT.md` for the exact closeout format.
