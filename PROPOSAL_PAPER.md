# LeInsights (Working Title): A Repayment Stress Simulator for Informal Filipino Sellers

## Abstract

LeInsights is a mobile-first fintech prototype that helps sari-sari store owners and small informal sellers test whether a loan can survive real-life cash-flow shocks before they borrow. Instead of only calculating repayment under normal conditions, the system simulates bad scenarios such as heavy rain reducing sales, sickness stopping store operations, emergency expenses, unpaid customer credit, or supplier price increases. The app then shows whether the seller's cash buffer remains safe, becomes risky, or breaks after repayment. By turning loan affordability into a simple bad-month stress test, LeInsights helps informal sellers make safer borrowing decisions without acting as a lender, credit scorer, wallet, or loan marketplace.

## Short Description of the Problem

Many small Filipino sellers borrow money for inventory, emergencies, or short-term cash gaps. The loan may be legal and available, but still harmful if repayment happens before the seller has enough sales to recover. A sari-sari store owner may look able to repay during a normal week, but a few days of rain, illness, unpaid customer credit, or higher restocking costs can erase their cash buffer and force them to use money meant for food, rent, transport, or school needs.

This problem is defensible in the Philippine context. The BSP's 2025 Consumer Finance and Inclusion Survey reported that only half of Filipino adults owned a formal financial account, while e-money and bank account ownership were 36 percent and 23 percent, respectively. The same report noted that borrowers consider repayment period, interest rate, and ease of application when borrowing, and that a sizable minority reported difficulty in repayment. Most importantly for this proposal, the BSP found that financial resilience remains weak, with only about 3 in 10 adults reporting that their current finances or savings would last.

Existing fintech tools often focus on finding loans, comparing interest rates, tracking expenses, or managing inventory. These are useful, but they do not directly answer the seller's most urgent borrowing question: "If something goes wrong next week, can I still repay without damaging my household or business cash flow?" LeInsights targets this gap by giving informal sellers a simple pre-borrowing readiness check based on their actual cash cycle.

## Objectives

1. Help informal Filipino sellers understand whether a loan is manageable under both normal and bad-month conditions.
2. Provide simple one-tap stress scenarios, such as lower sales, sickness, emergency expenses, and supplier price hikes.
3. Show a clear cash-buffer result using understandable risk labels such as safe, risky, or danger.
4. Recommend safer borrowing adjustments, such as reducing the loan amount, choosing a longer repayment term, delaying borrowing, or keeping a higher minimum buffer.
5. Demonstrate a feasible fintech prototype that uses rule-based cash-flow simulation without requiring bank integrations, production KYC, credit scoring, or sensitive financial data.

## Chosen Sustainable Development Goal

The chosen Sustainable Development Goal is **SDG 1: No Poverty**.

LeInsights supports SDG 1 by helping vulnerable microentrepreneurs avoid borrowing decisions that can worsen financial instability. For informal sellers, a poorly timed loan can quickly become a household crisis because business cash, food money, transport money, and emergency funds often overlap. By stress-testing repayment before the loan is accepted, the solution promotes financial resilience and reduces the risk that a short-term loan turns into deeper debt. The impact path is practical: better visibility into repayment risk leads to safer borrowing choices, which helps protect small sellers' income, inventory cycle, and household essentials.

## Proposed Solution

LeInsights asks the user for a few simple inputs: daily sales, daily expenses, inventory or restocking needs, loan amount, repayment amount, and due date. The system first calculates the seller's baseline cash buffer after repayment. Then the user can tap stress-test buttons such as "Heavy Rain: -20% Sales," "Sick for 3 Days," or "Supplier Price Hike: +10% Expenses." The app recalculates the buffer immediately and explains what changed.

For the prototype demo, a seller borrowing PHP 5,000 may appear safe in a normal week with a 5-day cash buffer. When the presenter applies a heavy-rain scenario, sales drop and the buffer turns negative. The app then suggests a safer option, such as borrowing PHP 3,500 or choosing a longer repayment period. This creates a clear and interactive demonstration of the product's value within the hackathon timeline.

## Market Gap and Source Support

The idea is connected to the current project direction because it keeps the same target user, borrowing moment, and scope boundary, but makes the core feature more compelling: a dynamic stress test instead of a static loan-fit calculation. The concept is not completely new as a financial method. Loan stress calculators already test income drops, expense increases, and interest-rate changes, while accounting platforms offer cash-flow scenario planning for formal businesses. The defensible gap is localization and simplicity: LeInsights applies stress testing to informal Filipino sellers before borrowing, without requiring accounting integrations, lender applications, credit scoring, or bank data.

Sources:

1. Bangko Sentral ng Pilipinas, 2025 Consumer Finance and Inclusion Survey. Supports the Philippine financial inclusion, borrowing, repayment difficulty, mobile-first, and financial resilience claims. https://www.bsp.gov.ph/Inclusive%20Finance/Financial%20Inclusion%20Reports%20and%20Publications/2025/2025CFISreport.pdf
2. Bangko Sentral ng Pilipinas, 2024 Report on E-Payments Measurement. Supports the claim that digital transactions are already mainstream in the Philippines, so the stronger gap is decision support rather than another wallet or payment app. https://www.bsp.gov.ph/PaymentAndSettlement/2024_Report_on_E-payments_Measurement.pdf
3. United Nations, SDG 1: No Poverty. Supports the SDG link, especially access to financial services and resilience against economic, social, environmental, and climate-related shocks. https://sdgs.un.org/goals/goal1
4. Calcix, Loan Stress Scenario Calculator. Shows that stress testing exists globally for general loans through income-drop and expense-increase scenarios, making LeInsights' novelty depend on Filipino informal-seller focus rather than the general stress-test method. https://calcix.net/calculators/loan-mortgage/loan-stress-scenario-calculator
5. Xero, Cash Flow Forecasting Software. Shows that cash-flow forecasting and scenario planning exist for formal businesses with accounting data. https://www.xero.com/us/accounting-software/analytics/cash-flow/
6. Float, Scenario Planning. Shows that business cash-flow tools already answer "what if" questions, but usually require a base forecast, budgets, invoices, bills, and bank/accounting records. https://intercom.help/floatapp/en/articles/1719419-scenario-planning
7. Savvy Spender, Philippine Financial Calculator. Shows that Philippine financial calculators already cover loan affordability, loan comparison, debt planning, savings goals, and emergency funds, but not a sari-sari-store bad-month repayment simulator. https://savvy-spender.vercel.app/
8. Digido PH and Moneezy PH. Show that Philippine loan-matching and comparison platforms focus on finding or applying for loans, not stress-testing informal sellers' cash buffers before borrowing. https://digido.com.ph/ and https://moneezy.ph/
9. Sari.PH / Packworks and SariPondo. Show that sari-sari store management, inventory, bookkeeping, cash-flow dashboards, and inventory-credit tools already exist, but the visible focus is store operations or credit access rather than pre-borrowing stress simulation. https://play.google.com/store/apps/details?id=com.packworks.microstoreapp and https://play.google.com/store/apps/details?id=com.sari_sari.store
