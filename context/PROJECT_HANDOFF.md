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
- **AI chatbot is live:** `supabase/functions/chat` deployed on project `puoaptudxlejbloijhvu`; `LoanWiseChat` on Verdict/Stress steps returns Vertex replies for guest users.
- Setup and pitfalls documented in `context/AI_CHAT_IMPLEMENTATION.md`.
- `loanwise-ai.json` is a local Google service-account credential and is ignored by Git.

In progress:

- Merged `Verdict` UX (evaluation + stress in one surface) per `context/TEAM_PLAN_LEAN.md`.
- AI reply token cap is raised locally to `1200`; redeploy `supabase/functions/chat` before expecting the hosted function to stop truncating longer replies.

Blocked:

- Named real-world scenario chips need evidence or an `illustrative` label before being presented as anything more than examples.
- Public anon access to the chat function is not abuse-proof without rate limits.

## Source Owners

Before updating this file, check whether the new fact belongs somewhere else:

| Fact Type | Owner |
|---|---|
| Official event rules, dates, deliverables, judging criteria | `guidelines.md` |
| Stable project behavior and working rules | `context/PROJECT_GUIDE.md` |
| Durable decisions that affect future work | `context/DECISIONS.md` |
| AI setup, secrets, and debugging | `context/AI_CHAT_IMPLEMENTATION.md` |
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

- Minimal AI path shipped: Supabase Edge Function `chat` + Vertex `gemini-2.5-flash` + `LoanWiseChat` guest flow.
- Fixed corrupted `GOOGLE_SERVICE_ACCOUNT_JSON` secret (JSON + trailing `VERTEX_*` on one line).
- Aligned Vertex config with ClearStack pattern (`us-central1`, explicit `VERTEX_PROJECT_ID`).
- Added `context/AI_CHAT_IMPLEMENTATION.md` for setup, mistakes, and rationale.

## Risks Or Stale Facts

- `context/FRONTEND_TEAM_PLAN.md` may be stale; prefer `context/TEAM_PLAN_LEAN.md`.
- Named scenarios need evidence or `illustrative` labeling.
- Do not put Vertex env vars on the same line as Google JSON when setting Supabase secrets.

## Next Focus

1. Redeploy `supabase/functions/chat` so the `maxOutputTokens: 1200` change reaches the hosted function.
2. Continue merged **Verdict** step UX (`Baseline -> Verdict -> History`).
3. Pitch polish and 60-second demo walkthrough.

## Verification

- Verified: `chat` deployed and ACTIVE on `puoaptudxlejbloijhvu`; POST with anon JWT returns `{ reply }`.
- Verified: App **Ask AI** flow works after secret fix and deploy.
- Not verified: rate limiting, production Vercel env vars, function redeploy after token-cap change, or longer reply quality after redeploy.
