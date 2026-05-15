# LoanWise Frontend Team Plan

**Last updated:** 2026-05-16  
**Canonical app:** `Frontend/`  
**Run:** `cd Frontend && npm run dev`  
**Legacy app:** root `src/` is archive-only after needed logic is ported.

## Goal

Ship a pitch-ready LoanWise demo from `Frontend/`.

The demo must work without narration:

1. User starts a free guest test.
2. User enters six loan and cash-flow inputs, or taps a sample fill.
3. User sees one verdict screen with status, true cost, projected cash, breakpoint, and stress controls.
4. User taps `30% drop` or `My bad day`; the result updates in place.
5. User can save the check and review it in history.

The pitch moment is simple: baseline looks manageable, stress exposes the risk.

## Source Of Truth

| Topic | File |
|---|---|
| Product behavior, inputs, formulas | `systemflow.md` |
| Feature scope | `features.md` |
| Visual direction | `DESIGN.md` |
| Durable decisions | `context/DECISIONS.md` |
| Session handoff / closeout | `context/PROJECT_HANDOFF.md` |
| Current implementation plan | This file |

Do not duplicate product rules here. If the rule belongs to the product, update `features.md` or `systemflow.md`.

## Non-Negotiables

- Keep guest mode fully usable.
- Keep all loan math in `Frontend/src/lib/loanLogic.ts` and `Frontend/src/lib/evaluation.ts`.
- Do not put formulas in React components.
- Use Philippine peso copy and sari-sari / small-store context.
- Show `prototype, not lending advice` in the UI.
- Do not present named scenarios as predictions unless evidence exists.

## Ship First

| Priority | Work | Done When |
|---|---|---|
| P0 | Merge evaluation and stress into one `Verdict` step | The user does not need to click `Run Stress Test` |
| P0 | Use 3 visible steps | Indicator shows `Baseline -> Verdict -> History` |
| P0 | Keep stress controls visible on verdict | Laptop viewport can show verdict and stress without hunting |
| P1 | Add sample fill | Presenter can demo without live typing |
| P1 | Add local history | Saved checks survive refresh through `localStorage` |
| P1 | Freeze demo numbers | Baseline can turn green-to-red at `30% drop` or `My bad day` |

Everything below this line is backlog until the demo loop is strong.

## Team Lanes

Use four lanes max. More lanes create coordination overhead.

| Lane | Owns | Primary Files | Acceptance |
|---|---|---|---|
| Verdict UX | Core result and inline stress | `App.tsx`, `StepEvaluation.tsx`, `StepStressTest.tsx`, `StepIndicator.tsx` | One `Verdict` step, stress updates in place |
| Baseline UX | Fast input flow | `StepBaseline.tsx` | Blank form, sample store, optional cash-left estimator |
| History | Save and reload checks | `App.tsx`, `StepHistory.tsx` | Save, reload, delete, refresh-safe |
| Pitch Polish | Demo data, copy, disclaimer | UI copy, README/demo notes if needed | 60-second demo is rehearsable |

Each PR should name its lane and the acceptance row it satisfies.

## Recommended UI Shape

Visible flow:

```text
Landing -> Baseline -> Verdict -> History
```

`Verdict` should combine what is currently split across evaluation and stress:

```text
Top: status, projected cash, true cost, breakpoint
Middle: stress chips + custom slider + My bad day
Body: chart/calendar, safer path, one contextual tip
Footer: save, optional export later
```

Avoid a fourth step for report/export. Add export as a button later if needed.

## Backlog

Do these only after the main demo loop is stable:

- Named scenario chips such as rainy week or sick days.
- `context/SCENARIO_EVIDENCE.md`.
- Print / PDF export.
- AI explainer.
- Supabase auth or cloud persistence.
- Full legacy `src/` archive cleanup.

Generic stress chips do not need research:

- `10% drop`
- `30% drop`
- `60% drop`
- `My bad day`
- custom slider

Research is only needed for named real-world labels.

## Scope Guard

Do not build before pitch:

- Supabase-dependent flows.
- AI that recommends taking a loan.
- Separate report step.
- Six micro-lesson accordions.
- Side-by-side multi-loan comparison.
- New formulas inside components.
- Named crisis claims without evidence or an `illustrative` label.

## Closeout

Before opening or merging a PR:

1. Check whether `features.md`, `systemflow.md`, `DESIGN.md`, `README.md`, `TEAM_WORKFLOW.md`, and `context/DECISIONS.md` still agree.
2. Log durable decisions in `context/DECISIONS.md`.
3. Use `context/PROJECT_HANDOFF.md` for continuity notes, risks, stale-fact checks, and next focus.
