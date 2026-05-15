# System Flow Documentation

This document defines the chronological product flow for LoanWise, the Repayment Stress Simulator. It is the implementation reference for moving a user from first entry to loan evaluation, stress testing, and saved history.

The whole system should proceed in this order:

1. **Flow 1: Start and Set Up Inputs** - get the user into guest mode or optional login, then collect the baseline cash-flow inputs.
2. **Flow 2: Evaluate the Loan Offer** - calculate true cost, repayment fit, gauge status, and safety suggestions.
3. **Flow 3: Stress-Test the Loan** - apply percentage drops or the user's bad-day baseline and update the result in real time.
4. **Flow 4: Save, Review, and Close the Loan** - store the check, show history/dashboard data, and support an after-action report.

---

## Flow 1: Start and Set Up Inputs

**Goal:** Let a first-time user reach a usable loan check with minimal friction.

### 1. Entry Screen

- **User Action:** Opens the web app on mobile or desktop.
- **System Display:**
  - Product signal: `LoanWise`.
  - Primary prompt: "Is your next loan safe for your store?"
  - Primary CTA: `Start free test`.
  - Secondary path: `Use account`.
- **System Rule:** The first screen must lead into the working simulator, not a static marketing page.

### 2. Guest Mode or Optional Login

- **User Action:** Continues as a guest, signs in, or creates an account.
- **Guest Behavior:** The simulator works without login.
- **Account Behavior:** If Supabase is configured and the user signs in, saved checks can be attached to that user's account.
- **System Rule:** Login must improve persistence, not block the core stress test.

### 3. Baseline Input Collection

- **Required Guest Inputs:**
  - Amount to borrow
  - Total repayment
  - Due date
  - Normal daily cash left after expenses
  - Bad-day cash left after expenses
  - Minimum cash to keep after repayment
- **Optional Helper:** For both cash-left inputs, the user may estimate cash left as:
  - Cash Left = Daily Sales - Daily Costs
- **Validation Rules:**
  - Amounts cannot be negative.
  - Days until due must be at least 1.
  - Total repayment should be greater than or equal to amount borrowed. If it is lower, show a warning rather than blocking the demo.
- **Next Step:** Once the six inputs exist, the system moves into Flow 2 automatically.

### 4. Dashboard Entry Point

- **User Action:** Views the current simulator and saved history area.
- **System Display:**
  - Current cash-health gauge.
  - Recent saved checks table.
  - Account panel if the user wants persistence.
- **Next Step:** User evaluates the active loan offer in Flow 2.

---

## Flow 2: Evaluate the Loan Offer

**Goal:** Transform the raw loan offer into a clear repayment decision before any stress scenario is applied.

### 1. Loan Offer Readiness

- **Trigger:** Flow 2 starts when the six baseline inputs from Flow 1 are present.
- **System Inputs Used:**
  - Amount to borrow
  - Total repayment
  - Due date
  - Normal daily cash left after expenses
  - Minimum cash to keep
- **System Action:** Calculate the number of days from today to the due date.
- **Formula:**
  - Days Until Due = max(1, Due Date - Today)

### 2. True Cost Reveal

- **System Action:** Show the cost of the offer before showing the full risk interpretation.
- **Formulas:**
  - Interest and Fees = Total Repayment - Amount Borrowed
  - Cost per ₱100 Borrowed = Interest and Fees / Amount Borrowed x 100
  - Daily Interest Cost = Interest and Fees / Days Until Due
- **System Display:**
  - "This loan costs ₱X for every ₱100 borrowed."
  - "Your daily interest cost is ₱Y/day."
  - "Total interest and fees: ₱Z."
- **Purpose:** Make the repayment cost visible even if the user only thinks about the borrowed amount.

### 3. Baseline Repayment Simulation

- **System Action:** Calculate projected cash after repayment under normal conditions.
- **Formula:**
  - Projected Cash After Repayment = Normal Daily Cash Left After Expenses x Days Until Due - Total Repayment
- **System Rule:** The borrowed amount is not counted as spare cash because the prototype assumes it will be used for inventory, bills, or another borrowing purpose.

### 4. Cash Health Gauge

- **Gauge Logic:**
  - **GREEN:** Projected cash after repayment is greater than or equal to the minimum cash buffer.
  - **YELLOW:** Projected cash after repayment is non-negative but below the minimum cash buffer.
  - **RED:** Projected cash after repayment is negative.
- **System Display:**
  - **GREEN:** "Manageable. This loan keeps your cash above the minimum buffer after repayment."
  - **YELLOW:** "Thin buffer. You can repay, but the remaining cash falls below your safety floor."
  - **RED:** "High risk. The math shows a cash gap on or before the due date."
- **Output:** The user sees a status, projected cash after repayment, days until due, and any cash shortfall.

### 5. Breakpoint Analysis

- **System Action:** Calculate how much income can drop before the loan stops clearing the user's minimum buffer.
- **Formula:**
  - Required Daily Cash = (Total Repayment + Minimum Cash Buffer) / Days Until Due
  - Breakpoint Drop = 1 - (Required Daily Cash / Normal Daily Cash Left)
- **Display Rule:** Clamp the breakpoint drop between 0% and 100%.
- **System Display:** "Your daily cash left can drop by X% before this loan becomes unsafe."

### 6. Safer Borrowing Suggestions

- **Trigger:** Show suggestions for all statuses, but make them more prominent for Yellow and Red.
- **System Actions:**
  - Estimate a safer borrowed amount using the same repayment ratio.
  - Estimate a longer term needed to stay above the minimum buffer.
- **Formulas:**
  - Repayment Ratio = Total Repayment / Amount Borrowed
  - Safer Repayment Capacity = Normal Daily Cash Left x Days Until Due - Minimum Cash Buffer
  - Suggested Borrow Amount = Safer Repayment Capacity / Repayment Ratio
  - Suggested Term = ceil((Total Repayment + Minimum Cash Buffer) / Normal Daily Cash Left)
- **System Display:**
  - "To stay green, target around ₱X borrowed on this cost ratio."
  - "Or ask for about Y days before repayment."
- **Next Step:** User can continue to Flow 3 to test whether the baseline result survives income drops.

---

## Flow 3: Stress-Test the Loan

**Goal:** Show whether a loan that looks manageable under normal conditions can survive a drop in daily cash left.

### 1. Stress Mode Selection

- **Trigger:** Flow 3 starts from the result screen in Flow 2.
- **User Action:** Selects a stress mode.
- **Available Modes:**
  - Baseline: 0% drop
  - 10% drop
  - 30% drop
  - 60% drop
  - 100% drop
  - My bad day
  - Custom slider from 0% to 100%
- **System Rule:** Use generic percentage drops. Do not hard-code named crisis claims such as typhoon, sickness, or rain as if the app knows the cause.

### 2. Stress Cash Calculation

- **For Percentage Drops:**
  - Stress Daily Cash Left = Normal Daily Cash Left x (1 - Drop Percentage)
- **For My Bad Day:**
  - Stress Daily Cash Left = Bad-Day Cash Left After Expenses
- **For Custom Slider:**
  - Stress Daily Cash Left = Normal Daily Cash Left x (1 - Custom Drop Percentage)

### 3. Stress Repayment Simulation

- **Default Stress Rule:** Apply the selected stress cash value across the full term.
- **Special 100% Drop Rule:** A 100% drop may be modeled as 3 zero-income days, with the remaining days using normal daily cash left.
- **Full-Term Formula:**
  - Stress Projected Cash = Stress Daily Cash Left x Days Until Due - Total Repayment
- **Limited-Duration Formula:**
  - Stress Projected Cash = Stress Daily Cash Left x Stress Days + Normal Daily Cash Left x Remaining Days - Total Repayment
- **System Rule:** Reuse the same Green/Yellow/Red gauge logic from Flow 2.

### 4. Real-Time Result Update

- **System Action:** Instantly update:
  - Cash-health gauge
  - Projected cash after repayment
  - Breakpoint percentage
  - Cash shortfall
  - Safer borrowing suggestion
- **System Display:**
  - If still Green: "This loan survives the selected income drop."
  - If Yellow: "This loan becomes thin under the selected income drop."
  - If Red: "This loan fails under the selected income drop."

### 5. Crisis Explanation

- **System Action:** Translate the stressed result into a factual warning.
- **Display Rules:**
  - If shortfall is greater than 0: "You are short by ₱X against your minimum cash buffer."
  - If projected cash is below 0: "Your cash is fully depleted before or by the due date."
  - If projected cash remains above the buffer: "Your buffer remains above ₱X after repayment."
- **System Rule:** Keep the explanation blunt and mathematical. Do not imply certainty about real-world events.

### 6. Stress-Based Recommendation

- **System Action:** Recalculate the safety path using the stressed cash value.
- **System Display:**
  - "To survive this drop, you need ₱X cash buffer before borrowing."
  - "Or reduce the borrowed amount to around ₱Y on this repayment ratio."
  - "Or ask for about Z days before repayment."
- **Next Step:** User can save the check or return to Flow 2 by selecting Baseline.

---

## Flow 4: Save, Review, and Close the Loan

**Goal:** Turn a one-time stress test into a record the user can review later.

### 1. Save Loan Check

- **User Action:** Clicks `Save check`.
- **Guest Behavior:** Save the check in browser local storage.
- **Signed-In Behavior:** Save locally and insert the check into Supabase `public.loan_checks`.
- **Saved Fields:**
  - User id, if signed in
  - Amount borrowed
  - Total repayment
  - Due date
  - Normal daily cash left
  - Bad-day cash left
  - Minimum buffer
  - Days until due
  - Projected cash
  - Status
  - Stress label
  - Cost per ₱100
  - Breakpoint drop

### 2. Dashboard History

- **System Display:**
  - Total saved checks
  - Green checks
  - Risky checks
  - Average cost per ₱100
  - Recent loan-check table
- **Table Columns:**
  - Date
  - Borrowed amount
  - Total repayment
  - Stress mode
  - Projected cash
  - Status

### 3. Loan Completion

- **User Action:** Marks a real loan as fully paid. This is a future enhancement for the MVP unless time allows.
- **System Action:** Move the loan from active checks to history.
- **System Rule:** Do not claim repayment success automatically. The user must mark it manually.

### 4. After-Action Report

- **System Display:** A factual debrief:
  - Loan term
  - Final status at the time it was saved or closed
  - Lowest projected cash buffer from the selected stress case
  - Whether the user's minimum buffer stayed protected
- **Feature Integrated:** Impact status reporting and borrowing profile over time.

---

## MVP Implementation Notes

- Flow 1 should keep guest mode first.
- Flow 2 is the core decision engine.
- Flow 3 is the demo's main "aha" moment.
- Flow 4 should support local history now and Supabase persistence when auth is configured.
- The app must never present itself as a lender, credit bureau, guaranteed approval tool, or financial advisor.
