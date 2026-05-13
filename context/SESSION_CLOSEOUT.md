# SESSION_CLOSEOUT.md

Use this at the end of a meaningful work session and before opening or merging a pull request.

## Closeout Checklist

1. Update memory with stable project facts only.
2. Append real decisions to `context/DECISIONS.md`.
3. Update the owning file for changed content:
   - `guidelines.md` for official challenge brief details
   - `features.md` for active feature scope
   - `systemflow.md` for active product flow, inputs, and formulas
   - `DESIGN.md` for visual direction and screen design rules
   - `TEAM_WORKFLOW.md` and `README.md` for onboarding/source-of-truth changes
   - other project files as needed
4. Check for stale facts across `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md`.
5. Record the next active focus.
6. Do not store detailed specs in memory if a project file should own them.

## Output Format

- Stable facts to memory:
- Decisions to log:
- Files to update:
- Stale-fact check:
- Next focus:

## 2026-05-13 Closeout

- Stable facts to memory: Active product specs are `features.md` and `systemflow.md`; the current concept is a Repayment Stress Simulator using generic percentage-drop testing.
- Decisions to log: Active product source of truth, generic percentage-drop testing, and six-input guest mode with optional login/profile accuracy upgrade were logged in `context/DECISIONS.md`.
- Files to update: `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `context/DECISIONS.md`, and `context/SESSION_CLOSEOUT.md`.
- Stale-fact check: Active product source of truth is aligned across `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, and `context/DECISIONS.md`.
- Next focus: Implement or prototype the six-input guest flow, optional cash-left estimator helper, and gauge logic defined in `systemflow.md`.

## 2026-05-13 Final Stabilization Closeout

- Stable facts to memory: `DESIGN.md` is now the visual design guardrail for prototype screens; closeout must happen before pull requests, not only after casual sessions.
- Decisions to log: Design source-of-truth and mandatory pre-PR closeout/source-of-truth freshness checks were logged in `context/DECISIONS.md`.
- Files to update: `README.md`, `TEAM_WORKFLOW.md`, `context/DECISIONS.md`, and `context/SESSION_CLOSEOUT.md`.
- Stale-fact check: Read-first/source-of-truth docs now include `DESIGN.md`, `features.md`, and `systemflow.md`; historical idea files are background only.
- Next focus: Start the next chat from `TEAM_WORKFLOW.md`, then implement the prototype using `features.md`, `systemflow.md`, and `DESIGN.md`.

## 2026-05-14 Prototype Closeout

- Stable facts to memory: none.
- Decisions to log: First website prototype is LoanWise on Vite + React + TypeScript with optional Supabase email/password auth; saved history/dashboard is local-first until Supabase exists.
- Files to update: `README.md`, `context/DECISIONS.md`, `context/SESSION_CLOSEOUT.md`, app source files in `src/`, project config files, and `supabase/schema.sql`.
- Stale-fact check: `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md` still agree on a repayment stress simulator, six-input guest mode, generic percentage-drop testing, optional account path, and design guardrails.
- Next focus: Create the Supabase project, add `.env.local`, run `supabase/schema.sql`, and deploy the Vite app on Vercel with the same environment variables.
