# Hack-It-UP 2026 FinTech Project

Shared workspace for the UP SoComSci Hack-It-UP 2026 hackathon under Tech Week 2026: Wreck-It, Fix-It.

## Current Direction

Working concept: **LoanWise**, a repayment stress simulator for small informal Filipino sellers. It helps users test whether a loan still fits their cash flow after income drops before they borrow.

The project is aimed at the **FinTech for Change** theme and should stay grounded in Philippine financial inclusion, microenterprise resilience, and the Hack-It-UP judging criteria.

## Prototype

The current pitch prototype is the Vite + React + TypeScript app in `Frontend/`.

Run locally:

```bash
cd Frontend
npm install
npm run dev
```

Production check:

```bash
cd Frontend
npm run lint
npm run build
```

Supabase is intentionally optional for localhost. Guest mode and browser-saved history work without credentials. To enable accounts later, create `.env.local` from `.env.example`, add the Supabase project URL and anon key, then run `supabase/schema.sql` in the Supabase SQL editor.

The app is ready for Vercel deployment as a standard Vite project. Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values in Vercel project environment variables before deploying auth-enabled builds.

## Start Here

1. Read `TEAM_WORKFLOW.md` for how this repo should be used by team members and AI sessions.
2. Read `guidelines.md` for the official Hack-It-UP brief, dates, deliverables, rules, and judging criteria.
3. Read `context/PROJECT_GUIDE.md` for project-local working rules and idea quality standards.
4. Read `features.md` and `systemflow.md` before drafting, pitching, or prototyping.
5. Read `DESIGN.md` before building screens or visual prototypes.

## Important Files

- `TEAM_WORKFLOW.md` - team workflow, AI coordination, work lanes, and session rules.
- `guidelines.md` - official Hack-It-UP 2026 onboarding details and challenge requirements.
- `context/PROJECT_GUIDE.md` - shared rules for concept, pitch, prototype, and AI-assisted work.
- `context/TEAM_PLAN_LEAN.md` - compact frontend execution plan for the pitch prototype.
- `context/ONLINE_DATA_AND_GAPS.md` - evidence base and market gap behind the concept.
- `features.md` - active core feature scope for the repayment stress simulator.
- `systemflow.md` - active user flow, data flow, and input requirements.
- `DESIGN.md` - visual direction and design-system guardrails for avoiding generic website output.
- `context/OLD_IDEAS.md` - earlier ideas and why they were not selected.
- `context/DECISIONS.md` - stable decisions that affect later work.
- `context/PROJECT_HANDOFF.md` - current continuity, risks, next focus, and closeout checklist.
- `supabase/schema.sql` - optional Supabase table and row-level-security setup for saved loan checks.

## Collaboration Rule

Keep durable project context in repo files, not only in chat history. If a decision changes the concept, prototype scope, pitch, or submission plan, update the owning file in `context/`.

Before opening or merging a pull request, run the closeout checklist in `context/PROJECT_HANDOFF.md` and make sure the owning files are updated.
