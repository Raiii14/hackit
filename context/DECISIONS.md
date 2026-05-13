# DECISIONS.md

Log only decisions that affect future work.

Add an entry only if it changes scope, concept direction, target users, evaluation strategy, naming other work depends on, file ownership, or a standing project constraint.

Do not log brainstorming, temporary ideas, routine file creation, or observations that do not change later work.

## 2026-05-04

Decision: Keep `guidelines.md` as the source of truth for challenge rules, dates, deliverables, criteria, and requirements.
Why: It is the only official challenge brief currently present in the workspace and prevents drift between working notes and the event document.
Impact: Use `guidelines.md` whenever exact wording, dates, judging weights, or submission constraints matter.
Status: active

## 2026-05-04

Decision: Use `context/PROJECT_GUIDE.md` as the shared project working guide.
Why: One concise shared guide is clearer than parallel guide files.
Impact: Use `context/PROJECT_GUIDE.md` for execution behavior.
Status: active

## 2026-05-13

Decision: Use `features.md` and `systemflow.md` as the active product source of truth for the Repayment Stress Simulator.
Why: The team clarified that core features should live in `features.md`, while data flow and required inputs should live in `systemflow.md`.
Impact: Future prototype, pitch, and review work should read these two files first for product behavior. Older idea files remain background context only.
Status: active

## 2026-05-13

Decision: Use generic percentage-drop testing instead of named crisis scenarios.
Why: Named scenarios such as sickness, rain, or typhoon imply unsupported assumptions about how much income drops. Generic percentages are easier to defend and let users test their own situation without pretending the app knows the cause.
Impact: Prototype controls should focus on percentage drops such as 10%, 30%, 60%, 100%, and a custom slider. Scenario labels can be used only as examples, not as hard-coded claims.
Status: active

## 2026-05-13

Decision: Allow a no-login guest flow with six basic inputs, while reserving login/profile setup for more accurate results.
Why: The demo needs low friction, but richer accuracy requires more user data than the six-question guest flow can reasonably collect.
Impact: Guest mode should ask only for amount to borrow, total repayment, due date, normal daily cash left after expenses, bad-day cash left after expenses, and minimum cash to keep. Logged-in mode can collect more detailed income, costs, debts, and profile data.
Status: active

## 2026-05-13

Decision: Use "cash left after expenses" as the guest-mode cash input, with an optional estimator helper.
Why: Gross sales can make a loan look falsely safe because restocking, operating costs, and daily needs may already consume most sales. Asking directly for cash left is more accurate, while the helper reduces friction for users who do not know the number.
Impact: Guest UI should keep the main flow to six required inputs, but the two cash-left fields can offer an optional helper that estimates cash left from daily sales minus basic daily costs.
Status: active

## 2026-05-13

Decision: Use a simple guest-mode repayment safety formula for the prototype.
Why: The hackathon demo needs a defensible, explainable rule that does not pretend to have full accounting data.
Impact: Guest mode calculates Projected Cash After Repayment as Daily Cash Left After Expenses x Days Until Due - Total Repayment. The borrowed amount is used for true-cost calculations and safer-amount suggestions, but is not counted as spare cash by default.
Status: active

## 2026-05-13

Decision: Use root `DESIGN.md` as the visual design source of truth for prototype screens.
Why: The team added a Mastercard-inspired design reference to avoid generic website output and keep UI work visually specific.
Impact: UI and prototype work should read `DESIGN.md` before implementation. The design should use the documented warm editorial style, but must not copy proprietary Mastercard assets, logos, or licensed fonts directly.
Status: active

## 2026-05-13

Decision: Treat pre-PR closeout and stale-fact checks as mandatory.
Why: Previous pull requests skipped `context/SESSION_CLOSEOUT.md`, causing stale source-of-truth files and forcing later audit/clarification work.
Impact: Before opening or merging a pull request, update owning files, log durable decisions, and check that `README.md`, `TEAM_WORKFLOW.md`, `features.md`, `systemflow.md`, `DESIGN.md`, and `context/DECISIONS.md` agree. Stale facts are a review blocker.
Status: active

## 2026-05-14

Decision: Build the first website prototype as LoanWise using Vite, React, TypeScript, and optional Supabase email/password auth.
Why: The team requested a one-shot localhost prototype now, with Supabase accounts later and Vercel as the likely deployment path.
Impact: Guest mode must remain fully usable without Supabase credentials. Account features should degrade gracefully until `.env.local` is configured, and Vercel deployment should use standard Vite environment variables.
Status: active

## 2026-05-14

Decision: Include saved loan history and dashboard tables in the prototype while keeping persistence local-first.
Why: The team wanted history/dashboard tables in the one-shot build, but no Supabase project exists yet.
Impact: Saved checks are stored in browser local storage now. When Supabase is configured, `supabase/schema.sql` provides the `loan_checks` table and row-level-security policies for user-owned saved checks.
Status: active

## 2026-05-04

Decision: Keep project memory short and refer detailed context back to project files.
Why: Memory is useful for orientation, not for detailed specifications.
Impact: Store compact project facts in memory and defer details to `guidelines.md`, `context/PROJECT_GUIDE.md`, and future working files.
Status: active

## 2026-05-04

Decision: Treat concept direction as unset until a concrete fintech problem, target user, SDG, and prototype path are chosen.
Why: The current workspace contains the event brief and working rules, but no stable concept file.
Impact: Do not assume a fixed solution direction. Evaluate new ideas against the Hack-It-UP fintech theme, Philippine context, SDG fit, feasibility, and judging criteria.
Status: active

## 2026-05-12

Decision: Use `context/PROJECT_GUIDE.md` as the quick orientation file for project behavior and fintech concept quality checks.
Why: It now captures the hackathon-specific working frame without duplicating the full official brief.
Impact: Read `context/PROJECT_GUIDE.md` before brainstorming, evaluating, or implementing concept work; read `guidelines.md` for exact event requirements.
Status: active

## 2026-05-12

Decision: Pivot the core concept to a "Repayment Stress Simulator" (`context/IMPROVED_IDEA2.md`).
Why: The previous "borrowing readiness checker" was too static. Adding a "what-if" stress test (e.g., modeling a bad week of sales, sickness) provides a much stronger, more innovative "aha!" moment for the pitch and directly addresses the data that informal sellers lack financial resilience against shocks.
Impact: This historical decision led to the stress simulator direction, but its specific `IMPROVED_IDEA2.md` source-of-truth status and named scenario-button approach are no longer active.
Status: superseded on 2026-05-13 by the decision to use `features.md` and `systemflow.md` as the active product specs with generic percentage-drop testing.
