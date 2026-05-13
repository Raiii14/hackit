import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, DollarSign, Calendar, Info } from "lucide-react";
import type { LoanInputs } from "../App";

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
      <label style={{ color: "#374151", fontSize: "0.875rem", fontWeight: 600 }}>
        {label}
      </label>
      {hint && (
        <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: -4 }}>{hint}</p>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-3 pointer-events-none"
            style={{ color: "#9ca3af", fontWeight: 500 }}
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
            width: "100%",
            padding: prefix ? "10px 12px 10px 28px" : "10px 12px",
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            backgroundColor: "white",
            color: "#111827",
            fontSize: "0.95rem",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
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
    if (buffer === undefined || buffer < 0) errs.minCashBuffer = "Enter a minimum buffer (can be 0)";

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
      {/* Header card */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 60%, #2563eb 100%)" }}
      >
        <h1 style={{ color: "white", marginBottom: 4 }}>Step 1: Baseline Inputs</h1>
        <p style={{ color: "#bfdbfe", fontSize: "0.9rem" }}>
          Tell us about your loan offer and your current cash flow. We'll calculate
          whether this loan safely fits your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Loan Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#eff6ff" }}
            >
              <DollarSign size={16} color="#3b82f6" />
            </div>
            <h3 style={{ color: "#111827" }}>Loan Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <InputField
                label="Loan Amount"
                hint="How much are you borrowing?"
                prefix="₱"
                value={form.loanAmount}
                onChange={(v) => set("loanAmount", v)}
                placeholder="500"
              />
              {errors.loanAmount && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.loanAmount}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Total Repayment Amount"
                hint="Full amount you'll owe (principal + fees + interest)"
                prefix="₱"
                value={form.repaymentAmount}
                onChange={(v) => set("repaymentAmount", v)}
                placeholder="575"
              />
              {errors.repaymentAmount && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.repaymentAmount}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Due Date"
                hint="When do you have to repay?"
                type="date"
                value={form.dueDate}
                onChange={(v) => set("dueDate", v)}
              />
              {errors.dueDate && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.dueDate}
                </p>
              )}
            </div>

            <InputField
              label="Loan Purpose (optional)"
              hint="e.g. Car repair, rent gap, medical bill"
              type="text"
              value={form.loanPurpose}
              onChange={(v) => set("loanPurpose", v)}
              placeholder="Car repair"
            />
          </div>
        </div>

        {/* Cash Flow Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#f0fdf4" }}
            >
              <Calendar size={16} color="#16a34a" />
            </div>
            <h3 style={{ color: "#111827" }}>Your Cash Flow</h3>
          </div>

          <div className="space-y-4">
            <div>
              <InputField
                label="Normal Day — Cash Left"
                hint="After all regular bills & expenses on a typical day"
                prefix="₱"
                value={form.normalCashAfter}
                onChange={(v) => set("normalCashAfter", v)}
                placeholder="800"
              />
              {errors.normalCashAfter && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.normalCashAfter}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Bad Day — Cash Left"
                hint="On your worst realistic day (late client, unexpected bill)"
                prefix="₱"
                value={form.badDayCashAfter}
                onChange={(v) => set("badDayCashAfter", v)}
                placeholder="400"
              />
              {errors.badDayCashAfter && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.badDayCashAfter}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Minimum Cash Buffer"
                hint="The absolute minimum you need to feel financially safe"
                prefix="₱"
                value={form.minCashBuffer}
                onChange={(v) => set("minCashBuffer", v)}
                placeholder="150"
              />
              {errors.minCashBuffer && (
                <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>
                  {errors.minCashBuffer}
                </p>
              )}
            </div>

            {/* Info tip */}
            <div
              className="flex gap-2 p-3 rounded-xl"
              style={{ backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}
            >
              <Info size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                Your <strong>bad day cash</strong> is the most important number —
                it reveals your true worst-case scenario before signing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          size="lg"
          style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px" }}
        >
          Evaluate Offer
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
