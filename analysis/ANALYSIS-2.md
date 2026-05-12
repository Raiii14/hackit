# Strategy Evaluation: Borrowing Stress-Test Simulator (Gemini 3.1 Pro)
**Framework:** Research Lane Validation
**Status:** High-Priority Evolution

## 1. Critical Evaluation
This pivot is extremely effective because it solves the **"Static Math" problem**. While standard calculators assume a perfect world, informal sellers live in an unpredictable one. 

### Key Strengths:
*   **Evidence-Based Alignment:** This aligns with data showing only about 3 in 10 Filipino adults have finances that would last through a financial shock.
*   **High Demo Potential:** Perfect for a 5-minute pitch. A demo showing a safe loan turning "red" during a simulated "Typhoon Week (Sales -30%)" provides an immediate "Aha!" moment for judges.
*   **Technical Feasibility:** Mathematically simple to implement. It requires applying percentage multipliers to baseline cash flow logic and re-rendering the UI.
*   **SDG Relevance:** Directly builds financial resilience (SDG 1 & 8) by shifting user mindset from "access to cash" to "survivability of repayment."

## 2. Market Competitor Check
A search for "repayment stress simulators" and "microloan stress tests" reveals a significant market gap.

| Category | Existing Tools | The Gap |
| :--- | :--- | :--- |
| **Big Business / Banking** | Stress testing, DSCR models, Parlay software. | Too complex; requires formal accounting data. |
| **Consumers / Informal Sellers** | Basic Loan Calculators, Ledger Apps (GrowSari, Packworks), Loan Marketplaces. | Basic tools only track the past or push for borrowing; no "What-If" simulations. |

**Verdict:** No one has built a mobile-first "What-If" simulator simple enough for a sari-sari store owner to use before accepting a microloan.

## 3. Project Recommendations
We should officially pivot the core feature from a static "Cash Buffer Meter" to a **Stress-Test Simulator**.

### Proposed Demo Flow:
1.  **Baseline:** User inputs PHP 1,000 daily sales. *App: "Safe to repay in 7 days."*
2.  **Scenario Taps:** User selects "Sick for 2 days" or "20% sales drop due to rain."
3.  **Instant Recalculation:** *App: "Warning: If you are sick for 2 days, your buffer drops to zero. You will need to use your food budget to repay."*

---
**Next Step:** Update `context/IMPROVED_IDEA.md` and `context/DECISIONS.md` to reflect this pivot toward the "Stress Simulator" mechanic.