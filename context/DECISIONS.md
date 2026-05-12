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
Impact: Future prototype and pitch work will focus on dynamic scenario modeling and interactive "stress test" buttons rather than just static loan calculators. The active concept file is now `context/IMPROVED_IDEA2.md`.
Status: active
