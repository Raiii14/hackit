import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, DollarSign, Calendar, Info } from "lucide-react";
import type { LoanInputs } from "../App";
import { theme, cardFlat, pillButton, inputStyle } from "../../lib/theme";
import { StepHeader } from "./StepHeader";

interface Props {
  inputs: LoanInputs;
  onNext: (inputs: LoanInputs) => void;
}

function InputField({
  label,
  hint,
  prefix,
  type = "number",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  prefix?: string;
  type?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: theme.ink, fontSize: "0.875rem", fontWeight: 600 }}>
        {label}
      </label>
      {hint && (
        <p style={{ color: theme.slate, fontSize: "0.75rem", marginTop: -4 }}>{hint}</p>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-3 pointer-events-none"
            style={{ color: theme.slate, fontWeight: 500 }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={type === "number" ? 0 : undefined}
          style={{
            ...inputStyle,
            padding: prefix ? "11px 14px 11px 28px" : inputStyle.padding,
          }}
          onFocus={(e) => (e.target.style.borderColor = theme.ink)}
          onBlur={(e) => (e.target.style.borderColor = theme.line)}
        />
      </div>
    </div>
  );
}

export function StepBaseline({ inputs, onNext }: Props) {
  const toStr = (n: number) => (n === 0 ? "" : String(n));
  const [form, setForm] = useState({
    loanAmount: toStr(inputs.loanAmount),
    repaymentAmount: toStr(inputs.repaymentAmount),
    dueDate: inputs.dueDate,
    loanPurpose: inputs.loanPurpose,
    normalCashAfter: toStr(inputs.normalCashAfter),
    badDayCashAfter: toStr(inputs.badDayCashAfter),
    minCashBuffer: toStr(inputs.minCashBuffer),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const loan = parseFloat(form.loanAmount);
    const repay = parseFloat(form.repaymentAmount);
    const normal = parseFloat(form.normalCashAfter);
    const bad = parseFloat(form.badDayCashAfter);
    const buffer = parseFloat(form.minCashBuffer);

    if (!loan || loan <= 0) errs.loanAmount = "Enter a valid loan amount";
    if (!repay || repay < loan) errs.repaymentAmount = "Must be ≥ loan amount";
    if (!form.dueDate) errs.dueDate = "Select a due date";
    else {
      const due = new Date(form.dueDate + "T00:00:00");
      if (due <= new Date()) errs.dueDate = "Due date must be in the future";
    }
    if (!normal || normal <= 0) errs.normalCashAfter = "Enter normal day cash";
    if (!bad || bad <= 0) errs.badDayCashAfter = "Enter bad day cash";
    if (bad > normal) errs.badDayCashAfter = "Should be ≤ normal day cash";
    if (!Number.isFinite(buffer) || buffer < 0) {
      errs.minCashBuffer = "Enter a minimum buffer (can be 0)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext({
      loanAmount: parseFloat(form.loanAmount),
      repaymentAmount: parseFloat(form.repaymentAmount),
      dueDate: form.dueDate,
      loanPurpose: form.loanPurpose,
      normalCashAfter: parseFloat(form.normalCashAfter),
      badDayCashAfter: parseFloat(form.badDayCashAfter),
      minCashBuffer: parseFloat(form.minCashBuffer) || 0,
    });
  };

  return (
    <div className="space-y-5">
      <StepHeader
        eyebrow="Step 1"
        title="Baseline inputs"
        description="Tell us about your loan offer and current cash flow. We'll calculate whether this loan safely fits your finances."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5" style={cardFlat}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#EFEAE5", color: theme.ink }}
            >
              <DollarSign size={16} />
            </div>
            <h3 style={{ color: theme.ink, fontWeight: 600 }}>Loan details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <InputField
                label="Loan amount"
                hint="How much are you borrowing?"
                prefix="₱"
                value={form.loanAmount}
                onChange={(v) => set("loanAmount", v)}
                placeholder="500"
              />
              {errors.loanAmount && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.loanAmount}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Total repayment amount"
                hint="Full amount you'll owe (principal + fees + interest)"
                prefix="₱"
                value={form.repaymentAmount}
                onChange={(v) => set("repaymentAmount", v)}
                placeholder="575"
              />
              {errors.repaymentAmount && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.repaymentAmount}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Due date"
                hint="When do you have to repay?"
                type="date"
                value={form.dueDate}
                onChange={(v) => set("dueDate", v)}
              />
              {errors.dueDate && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.dueDate}
                </p>
              )}
            </div>

            <InputField
              label="Loan purpose (optional)"
              hint="e.g. Car repair, rent gap, medical bill"
              type="text"
              value={form.loanPurpose}
              onChange={(v) => set("loanPurpose", v)}
              placeholder="Car repair"
            />
          </div>
        </div>

        <div className="p-5" style={cardFlat}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E7F3EA", color: theme.green }}
            >
              <Calendar size={16} />
            </div>
            <h3 style={{ color: theme.ink, fontWeight: 600 }}>Your cash flow</h3>
          </div>

          <div className="space-y-4">
            <div>
              <InputField
                label="Normal day — net cash (per day)"
                hint="Daily cash left after all regular expenses on a typical day (e.g. ₱800/day, not monthly total)"
                prefix="₱"
                value={form.normalCashAfter}
                onChange={(v) => set("normalCashAfter", v)}
                placeholder="800"
              />
              {errors.normalCashAfter && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.normalCashAfter}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Bad day — net cash (per day)"
                hint="Daily cash left on your worst realistic day — late client, unexpected bill (must be ≤ normal day)"
                prefix="₱"
                value={form.badDayCashAfter}
                onChange={(v) => set("badDayCashAfter", v)}
                placeholder="400"
              />
              {errors.badDayCashAfter && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.badDayCashAfter}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Minimum cash buffer"
                hint="The absolute minimum you need to feel financially safe"
                prefix="₱"
                value={form.minCashBuffer}
                onChange={(v) => set("minCashBuffer", v)}
                placeholder="150"
              />
              {errors.minCashBuffer && (
                <p style={{ color: theme.danger, fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.minCashBuffer}
                </p>
              )}
            </div>

            <div
              className="flex gap-2 p-3 rounded-[20px]"
              style={{ backgroundColor: "#FFF6E8", border: `1px solid ${theme.line}` }}
            >
              <Info size={14} color={theme.rust} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: theme.charcoal, fontSize: "0.75rem", margin: 0 }}>
                Your <strong>bad day cash</strong> is the most important number — it reveals your
                true worst-case scenario before signing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          size="lg"
          style={{ ...pillButton, padding: "12px 28px", minHeight: 48 }}
        >
          Evaluate offer
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
