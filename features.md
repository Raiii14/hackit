# Project Features: Repayment Stress Simulator

This document lists the refined features for the project, combining the core stress-testing logic with high-impact "Aha! Moment" features suggested by the team.

---

## 1. Dynamic Repayment Stress Simulator (The Core)
**Function:** A real-time tool that calculates if a loan fits a borrower's specific cash flow.
- **Guest Inputs:** Loan Amount, Total Repayment, Due Date, Normal Daily Cash Left After Expenses, Bad-Day Cash Left After Expenses, and Minimum Cash Buffer.
- **Estimator Helper:** If the user does not know cash left after expenses, the app can optionally estimate it from daily sales minus basic daily costs without adding required steps.
- **Core Formula:** Projected Cash After Repayment = Daily Cash Left After Expenses x Days Until Due - Total Repayment.
- **Outcome:** A dynamic visual gauge (Green/Yellow/Red) showing the cash health *after* the payment is made.
- **"Aha!" Moment:** Translates abstract loan numbers into a simple "Safe" or "Danger" signal.

## 2. Breakpoint & Percentage Drop Testing
**Function:** Lets users test how much income can drop before a loan becomes unsafe.
- **Breakpoint Analysis:** Tells the user the exact income drop percentage they can survive before they can no longer afford the loan.
- **Percentage Drop Use Cases:** Buttons for "10% Drop", "30% Drop", "60% Drop", and "100% Drop".
- **Bad-Day Anchor:** The user's bad-day cash input creates a personalized stress case and can be shown as an equivalent percentage drop from their normal day.
- **"Aha!" Moment:** Shows the user precisely where their "breaking point" is before they sign the contract.

## 3. True Cost Revealer (Oliver's Suggestion)
**Function:** Pulls back the curtain on the actual cost of borrowing.
- **Plain Language Math:** Shows "Cost per ₱100 borrowed" (e.g., "You pay ₱40 for every ₱100 you borrow").
- **Daily Burden:** Calculates how much of the user's daily work goes just to paying off interest.
- **"Aha!" Moment:** Exposes the high cost of informal loans (like 5-6) that often look cheap when presented as small daily amounts.

## 4. Danger Zone Calendar (Oliver's Suggestion)
**Function:** A visual calendar mapping payments against the user's sales rhythm.
- **Risk Mapping:** Highlights due dates that fall on the user's "slow days" (e.g., Mondays or rainy season).
- **Visual Warnings:** Marks "Danger Zones" where a payment is due but cash flow is predicted to be low.
- **"Aha!" Moment:** Makes the *timing* of the risk visible, not just the amount.

## 5. Safer Borrowing Suggestions
**Function:** Provides math-based alternatives when a loan fails the stress test.
- **Actionable Guidance:** If the result is Red, the app shows options that keep projected cash above the user's minimum buffer, such as "Borrow 20% less" or "Ask for a 30-day term instead of 7-day."
- **Side-by-Side Comparison:** Compare a "risky" loan vs. a "safe" suggestion to see the difference in cash buffer.
- **"Aha!" Moment:** Doesn't just say "No," but shows the user a path to a safer loan.

## 6. Contextual Micro-Lessons (Oliver's Suggestion)
**Function:** Integrated financial literacy that appears only when relevant.
- **Triggered Tips:** If the interest rate is high, a small card appears: "Tip: Most experts recommend keeping loan payments under 30% of your daily income."
- **AI-Driven Clarity:** Uses simple, human language to explain financial terms based on the user's current data.
- **"Aha!" Moment:** Provides "just-in-time" learning at the exact moment a decision is being made.

*Note: Production login, real databases, and manual database entry are descoped for the live demo. The prototype may show an optional login/profile path with mocked data only if it helps explain why more inputs improve accuracy.*
