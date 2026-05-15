# PROJECT_HANDOFF.md

Use this at the end of meaningful work and before opening or merging a pull request.

This file is for current continuity, not a full session diary. Keep only what the next teammate or AI session needs to continue safely.

## Current State

Working:

- Product direction is LoanWise, a repayment stress simulator for sari-sari and small informal Filipino sellers.
- Active product specs are `features.md` and `systemflow.md`.
- Visual direction is owned by `DESIGN.md`.
- `Frontend/` is the canonical app for the pitch prototype.
- Loan math belongs in `Frontend/src/lib/loanLogic.ts` and `Frontend/src/lib/evaluation.ts`.
- Guest mode, six core inputs, generic percentage-drop testing, and local-first history remain active constraints.

In progress:

- Frontend execution planning is being simplified around `context/TEAM_PLAN_LEAN.md`.
- The main frontend UX focus is `Baseline -> Verdict -> History`, with evaluation and stress merged into one verdict surface.
- Root `src/` is legacy/archive-only after needed logic is ported.

Blocked:

- Named real-world scenario chips need evidence or an `illustrative` label before being presented as anything more than examples.
- Supabase-dependent flows are not required for the pitch demo and should not block guest mode.

## Source Owners

Before updating this file, check whether the new fact belongs somewhere else:

| Fact Type | Owner |
|---|---|
| Official event rules, dates, deliverables, judging criteria | `guidelines.md` |
| Stable project behavior and working rules | `context/PROJECT_GUIDE.md` |
| Durable decisions that affect future work | `context/DECISIONS.md` |
| Active feature scope | `features.md` |
| Product flow, inputs, and formulas | `systemflow.md` |
| Visual design rules | `DESIGN.md` |
| Public setup, usage, and onboarding | `README.md`, `TEAM_WORKFLOW.md` |
| Private team process or safety workflow | `context/TEAM_INTERNAL.md` |
| Current continuity, risks, and next focus | `context/PROJECT_HANDOFF.md` |

## Closeout Checklist

Before ending meaningful work or opening a PR:

1. Add only durable decisions to `context/DECISIONS.md`.
2. Update the owning file for changed product, design, setup, or workflow facts.
3. Check for stale facts across `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md`.
4. Record the next active focus here.
5. Note verification performed, or explicitly say what was not verified.
6. Do not store detailed specs in memory if a project file should own them.

## Last Meaningful Changes

- `context/PROJECT_HANDOFF.md` replaces the old session-closeout template as the project continuity and PR closeout file.
- `context/TEAM_PLAN_LEAN.md` is the compact frontend coordination plan for teammates.
- `context/TEAM_INTERNAL.md` is the project-specific internal coordination and safety runbook.

## Risks Or Stale Facts

- `context/FRONTEND_TEAM_PLAN.md` is longer than the lean plan and may be stale as an execution guide.
- Any named scenario such as rainy week, sickness, or late payments needs evidence in a scenario evidence doc or must be labeled illustrative.

## Next Focus

1. Share `context/TEAM_PLAN_LEAN.md` with teammates as the short frontend coordination plan.
2. Implement the merged `Verdict` step in `Frontend/`.
3. Add sample-fill demo data and localStorage-backed history after the verdict loop works.
