# Improved Idea 2: Repayment Stress Simulator

## Why This Replaces the Previous Idea
The previous idea (`IMPROVED_IDEA.md` - "Borrowing Readiness Checker") focused on static math—comparing regular daily sales against a loan repayment. While useful, it assumed a perfect, predictable world. 

This new iteration pivots to a **Dynamic Stress Simulator**. The reality for informal sellers is unpredictable (e.g., getting sick, bad weather reducing foot traffic, supply delivery delays). The real value of the app is not just calculating the baseline, but answering: *"What happens if things go wrong?"*

This provides a much stronger "Aha!" moment for judges and directly aligns with the data in `ONLINE_DATA_AND_GAPS.md` showing only 3 in 10 Filipinos can survive a financial shock.

## One-Line Concept
A repayment stress simulator for informal sellers that lets them model bad scenarios (sickness, bad weather, supply disruptions) to see if a loan would break their business before they borrow.

## Target User
Sari-sari store owners and small informal offline/online sellers.

## Core Problem
Calculators and lenders approve loans based on perfect conditions. But micro-businesses are fragile. A 3-day sickness or a week of rain can turn a "safe" loan into a debt trap. Sellers need to test their financial resilience *before* taking the loan, not find out they are short during a crisis.

## Core Features
1. **Baseline Loan Fit (The Foundation)**
   - User enters daily sales, daily expenses, and the loan amount/due date.
   - App computes a "Cash Buffer" (how many days they can survive without sales after repayment).
   
2. **"What-If" Stress Test (The Core Innovation)**
   - One-tap scenario buttons: "Typhoon Week (-30% sales)", "Sick for 3 days (0 sales)", "Supplier Price Hike (+10% expenses)".
   - The app instantly recalculates the Cash Buffer. A green "Safe" loan can instantly turn into a red "High Risk of Default" warning.

3. **Resilience Recommendations**
   - If a scenario breaks the business, the app suggests: "Borrow 20% less to survive a 3-day sickness," or "Ask for a 30-day term instead of 7-day."

## Demo Flow (For Finals Pitch)
1. **Setup:** The presenter acts as a sari-sari store owner needing PHP 5,000 for inventory. 
2. **Baseline:** They enter normal sales. The app shows **GREEN (Safe)**: "You have a 5-day cash buffer." The loan looks great.
3. **The Twist:** The presenter says to the judges, "But what if it rains heavily next week and foot traffic drops?" They tap the **[Heavy Rain: -20% Sales]** button.
4. **The Impact:** The screen flashes **RED (Danger)**: "Your buffer is gone. You will need to use your family food budget to repay this loan."
5. **The Resolution:** The app suggests reducing the loan to PHP 3,500, which keeps the buffer in the green even during rain. 

## Judging Fit
- **Innovation:** Shifts from a static calculator to dynamic risk management (enterprise-level bank stress testing scaled down for micro-businesses).
- **Feasibility:** Very high. It's mathematically simple (percentage multipliers on the baseline variables) and visually striking to code.
- **SDG Relevance:** SDG 1 (No Poverty) and SDG 8 (Decent Work/Economic Growth) by actively preventing debt traps and building financial resilience against shocks.
- **Live Demo:** The interactive sliders and scenario buttons make for an incredible, visual 5-minute pitch.

## Scope Boundary
Build:
- Simple baseline input (sliders for sales/expenses).
- Scenario toggle buttons (Rain, Sickness, Emergency).
- Dynamic cash buffer gauge (Green/Yellow/Red).
- Safer alternative suggestion.

Do not build:
- Real loan origination or KYC.
- Complex multi-year projections.
- Bank API integrations.
