# LoanWise Frontend — Team Plan (canonical)

**Last updated:** 2026-05-16  
**Canonical app:** `Frontend/` (`cd Frontend && npm run dev`)  
**Legacy (archive only):** root `src/` — copy logic from here once, then do not maintain two apps.

**Product specs:** `features.md`, `systemflow.md`  
**Pitch behavior:** `context/IMPROVED_IDEA2.md`  
**Evidence / users:** `context/ONLINE_DATA_AND_GAPS.md`, `context/PROJECT_GUIDE.md`

---

## End goal (pitch-ready prototype)

A judge or sari-sari owner can, in **under 2 minutes** without narration:

1. Land → **Start free test** (guest, empty form or one-tap sample).
2. Enter loan + cash → see **verdict**: Green/Yellow/Red, **₱ per ₱100**, **projected cash on due date**, **breakpoint %**.
3. On the **same screen**, tap **30% drop** or **My bad day** → verdict flips (green → red = pitch moment).
4. See **safer borrow amount or longer term**.
5. Optionally **Save** → history persists (localStorage).

**Not required before pitch:** Supabase auth, six micro-lesson accordions, long APR essays.  
**Required:** Correct math (`systemflow.md`), inline stress, ₱ / Philippine context, “prototype, not lending advice.”

---

## Target UX (3 steps, 2 logical acts)

| Step | Screen | Contents |
|------|--------|----------|
| 1 | Baseline | Six inputs + optional cash estimator + sample fill |
| 2 | **Verdict** | Flow 2 + Flow 3 merged: status, true cost, breakpoint, **inline stress**, safer path |
| 3 | History | Saved checks (localStorage) |

**Remove:** Separate stress-only step, **Run Stress Test** button, duplicate evaluation math in components.

---

## What was wrong (Frontend before Lane A)

- `calculateEvaluation` used **daily cash − repayment** instead of **daily cash × days until due − total repayment**.
- Breakpoint formula did not match `systemflow.md`.
- Stress gated behind Step 3; landing promised stress on one journey.

---

## Lane status

| Lane | Owner | Status | Blocks |
|------|-------|--------|--------|
| **A — Engine** | — | **Done** (see `Frontend/src/lib/`) | Unblocks B–D |
| **B — Verdict screen** | — | Pending | After A |
| **C — Baseline & entry** | — | Pending | Parallel after A |
| **D — History persistence** | — | Pending | After B |
| **E — Docs & archive** | — | Pending | Anytime |
| **F — Pitch polish** | Presenter | Pending | After B |

---

## Lane A — Engine (P0)

**Files added:**

- `Frontend/src/lib/loanTypes.ts` — from legacy `src/types.ts`
- `Frontend/src/lib/loanLogic.ts` — from legacy `src/logic.ts` (`simulateLoan`, `stressModes`, calendar)
- `Frontend/src/lib/loanAdapter.ts` — UI field names ↔ logic field names
- `Frontend/src/lib/evaluation.ts` — `evaluateLoan()` → `EvaluationResult` for UI

**Rules:**

- **No loan math in React components** — only `loanLogic.ts` / `evaluation.ts`.
- UI names: `loanAmount`, `repaymentAmount`, `normalCashAfter`, `badDayCashAfter`, `minCashBuffer`.
- Logic names: `amountBorrowed`, `totalRepayment`, `normalCashLeft`, `badDayCashLeft`, `minimumBuffer`.

**Acceptance:**

- `projectedCash = normalCashLeft × daysUntilDue − totalRepayment` (baseline).
- Status: red if projected &lt; 0; yellow if &lt; minimum buffer; else green.
- Breakpoint matches `systemflow.md`.
- `npm run build` in `Frontend/` passes.

---

## Lane B — Verdict screen (P0/P1)

1. Merge `StepEvaluation` + `StepStressTest` → one step (e.g. `StepVerdict.tsx`).
2. `StepIndicator`: **Baseline → Verdict → History** (3 steps).
3. Verdict order: status + projected cash → cost per ₱100 → breakpoint → stress chips (10/30/60/100/My bad day + slider) → safer path.
4. Remove **Run Stress Test**; stress updates gauge in place.
5. Demote 0–100 health score as hero (optional secondary).

**Acceptance:** Pitch works without “click Next for stress.”

---

## Lane C — Baseline & entry (P1)

1. Empty defaults + **Try sample sari-sari store**.
2. Estimator collapsible (sales − costs) on normal + bad-day fields.
3. CTA: **See my verdict**.

---

## Lane D — History (P2)

1. `localStorage` key `loanwise-history`.
2. Save: status, projected cash, stress label, cost per ₱100, breakpoint.
3. Load restores verdict + stress selection.

---

## Lane E — Repo hygiene (P3)

1. Root `README.md` → run `Frontend/`.
2. Archive `src/` → `archive/src-legacy/` after Lane A merged.
3. Log in `context/DECISIONS.md`: canonical app = `Frontend/`.

---

## Lane F — Pitch polish

1. Freeze demo numbers (green at baseline, red at 30% or My bad day).
2. Disclaimer on landing.
3. Rehearse 60s script; cut extras.

---

## Copy from legacy `src/` (before archive)

| Legacy file | Use in Frontend |
|-------------|-----------------|
| `logic.ts` | `Frontend/src/lib/loanLogic.ts` |
| `types.ts` | `Frontend/src/lib/loanTypes.ts` |
| Estimator UI pattern | `StepBaseline.tsx` (Lane C) |
| `RepaymentCalendar` | Verdict or calendar component (Lane B) |
| `currency()` / `percent()` | Already in `loanLogic.ts` |
| `localStorage` history | Lane D |

**Do not port:** `src/App.tsx` layout, prefilled demo defaults, single-page scroll shell.

---

## Teammate AI brief (paste into chat)

```text
Canonical app: Frontend/
Math: Frontend/src/lib/loanLogic.ts + evaluation.ts only
Specs: systemflow.md, features.md
Plan: context/FRONTEND_TEAM_PLAN.md

My lane: [B|C|D|E|F]
Do not duplicate formulas in components.
Do not commit changes to archive/ or legacy src/ unless Lane E.
PR must state lane + acceptance criteria from FRONTEND_TEAM_PLAN.md.
```

---

## 60-second pitch script

1. “I need ₱5,000 for stock; lender says repay ₱6,500 in 30 days.”
2. Enter offer + normal/bad-day cash → **GREEN**, “₱40 per ₱100 borrowed,” “can survive up to X% drop.”
3. Tap **30% drop** or **My bad day** → **RED**, shortfall amount.
4. “To stay safe, borrow about ₱X or ask for Y days.”
5. Optional: Save check.

---

## Scope guard (do not do before pitch)

- Supabase in Frontend
- Full DESIGN.md visual rewrite
- Side-by-side multi-loan comparison
- Six accordion micro-lessons (max one contextual tip)
