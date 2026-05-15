# TEAM_INTERNAL.md

Internal coordination notes for the LoanWise Hack-It-UP team.

Keep this file public-safe if it is committed to `origin/main`. Do not put secrets, personal data, private judging strategy, deployment credentials, or unreviewed sensitive notes here.

## How To Start Work

1. Read `TEAM_WORKFLOW.md`.
2. Read `context/PROJECT_GUIDE.md`.
3. Check active decisions in `context/DECISIONS.md`.
4. Check current continuity in `context/PROJECT_HANDOFF.md`.
5. For frontend work, read `context/TEAM_PLAN_LEAN.md`.
6. Read the owning file for the task before editing.

## Current Team Focus

- Ship the LoanWise pitch prototype from `Frontend/`.
- Keep the demo loop sharp: `Landing -> Baseline -> Verdict -> History`.
- AI chatbot path is live (`context/AI_CHAT_IMPLEMENTATION.md`); next UX focus is merged Verdict.
- Merge evaluation and stress into one verdict surface after the minimal AI path is stable.
- Make the pitch moment visible in one gesture: baseline looks manageable, stress exposes risk.
- Keep export and named scenario research behind the core demo loop.

## Frontend Coordination

Use four working lanes:

| Lane | Owns |
|---|---|
| Verdict UX | Merged verdict, stress controls, status, true cost, safer path |
| Baseline UX | Six inputs, direct CTA, optional cash-left estimator |
| AI Chatbot | Supabase Edge Function, guest frontend call, guarded result explanation |
| History | Save, reload, delete, localStorage persistence |
| Pitch Polish | Demo numbers, disclaimer, copy, 60-second walkthrough |

Rules:

- PRs should name their lane.
- Do not duplicate formulas in components.
- AI may explain computed results, but must not approve loans, invent rates, or act as financial advice.
- Do not make named scenario claims without evidence or an `illustrative` label.
- Do not let optional features block the guest demo.
- If two teammates touch the same component, agree on ownership first.

## Source Of Truth Rules

- Official hackathon facts: `guidelines.md`.
- Product behavior and formulas: `systemflow.md`.
- Feature scope: `features.md`.
- Visual direction: `DESIGN.md`.
- Durable decisions: `context/DECISIONS.md`.
- Current continuity and next focus: `context/PROJECT_HANDOFF.md`.
- Lean frontend coordination: `context/TEAM_PLAN_LEAN.md`.

Do not use chat history as the source of truth when a repo file owns the fact.

## Safety

Never commit:

- `.env` files or environment variable values.
- Supabase keys, API keys, tokens, passwords, or deployment secrets.
- Private contact information.
- Raw judge/team strategy notes that were not written for the repo.
- Screenshots or logs containing sensitive data.

Before pushing, check:

```sh
git status --short
git diff --cached --name-status
git diff --cached
```

## Closeout

Before ending meaningful work or opening a PR:

1. Update the owning source file if a product, design, setup, or workflow fact changed.
2. Add durable decisions to `context/DECISIONS.md`.
3. Update `context/PROJECT_HANDOFF.md` with current state, risks, and next focus.
4. Check for stale facts across `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md`.
5. Record what was verified.
