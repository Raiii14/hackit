import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Gauge,
  History,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  PiggyBank,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  UserRound,
} from 'lucide-react';
import { currency, percent, simulateLoan, stressModes } from './logic';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { CalendarDay, LoanInputs, LoanRecord, RiskStatus, StressMode } from './types';

const historyKey = 'loanwise-history';

const initialInputs: LoanInputs = {
  amountBorrowed: 5000,
  totalRepayment: 6500,
  dueDate: getFutureDate(30),
  normalCashLeft: 350,
  badDayCashLeft: 120,
  minimumBuffer: 1500,
};

const statusCopy: Record<RiskStatus, { title: string; body: string; icon: JSX.Element }> = {
  green: {
    title: 'Manageable',
    body: 'This loan keeps your cash above the minimum buffer after repayment.',
    icon: <CheckCircle2 aria-hidden="true" />,
  },
  yellow: {
    title: 'Thin buffer',
    body: 'You can repay, but the remaining cash falls below your safety floor.',
    icon: <AlertTriangle aria-hidden="true" />,
  },
  red: {
    title: 'High risk',
    body: 'The math shows a cash gap on or before the due date.',
    icon: <ShieldAlert aria-hidden="true" />,
  },
};

function getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function readHistory(): LoanRecord[] {
  try {
    return JSON.parse(localStorage.getItem(historyKey) ?? '[]') as LoanRecord[];
  } catch {
    return [];
  }
}

function writeHistory(records: LoanRecord[]) {
  localStorage.setItem(historyKey, JSON.stringify(records));
}

function App() {
  const [inputs, setInputs] = useState<LoanInputs>(initialInputs);
  const [selectedStress, setSelectedStress] = useState<StressMode>(stressModes[0]);
  const [customDrop, setCustomDrop] = useState(0);
  const [history, setHistory] = useState<LoanRecord[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [normalEstimator, setNormalEstimator] = useState({ sales: 1400, costs: 1050 });
  const [badEstimator, setBadEstimator] = useState({ sales: 700, costs: 580 });

  const result = useMemo(
    () => simulateLoan(inputs, selectedStress, customDrop),
    [inputs, selectedStress, customDrop],
  );

  const dashboard = useMemo(() => {
    const total = history.length;
    const green = history.filter((item) => item.status === 'green').length;
    const risky = history.filter((item) => item.status !== 'green').length;
    const averageCost =
      total > 0
        ? history.reduce((sum, item) => sum + item.costPerHundred, 0) / total
        : 0;

    return { total, green, risky, averageCost };
  }, [history]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  function updateInput(key: keyof LoanInputs, value: string) {
    setInputs((current) => ({
      ...current,
      [key]: key === 'dueDate' ? value : Number(value),
    }));
  }

  function chooseStress(mode: StressMode) {
    setSelectedStress(mode);
    setCustomDrop(mode.kind === 'drop' ? mode.drop : result.badDayDrop);
  }

  function handleCustomDrop(value: number) {
    setCustomDrop(value);
    setSelectedStress({
      label: `Custom drop - ${value}%`,
      shortLabel: `${value}% drop`,
      kind: 'drop',
      drop: value,
      durationDays: null,
    });
  }

  async function handleAuth(mode: 'sign-in' | 'sign-up') {
    if (!supabase) {
      setAuthMessage('Add Supabase keys to .env.local to enable accounts.');
      return;
    }

    setIsAuthBusy(true);
    setAuthMessage('');
    const authCall =
      mode === 'sign-in'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await authCall;
    setIsAuthBusy(false);
    setAuthMessage(error ? error.message : mode === 'sign-in' ? 'Signed in.' : 'Account created.');
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthMessage('Signed out.');
  }

  async function saveLoanCheck() {
    const record: LoanRecord = {
      ...inputs,
      ...result,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      stressDrop: customDrop,
      stressKind: selectedStress.kind,
    };
    const nextHistory = [record, ...history].slice(0, 20);
    setHistory(nextHistory);
    writeHistory(nextHistory);
    setSaveMessage('Saved to this browser.');

    if (!supabase || !session) return;

    const { error } = await supabase.from('loan_checks').insert({
      user_id: session.user.id,
      amount_borrowed: inputs.amountBorrowed,
      total_repayment: inputs.totalRepayment,
      due_date: inputs.dueDate,
      normal_cash_left: inputs.normalCashLeft,
      bad_day_cash_left: inputs.badDayCashLeft,
      minimum_buffer: inputs.minimumBuffer,
      days_until_due: result.daysUntilDue,
      projected_cash: result.projectedCash,
      status: result.status,
      stress_label: result.stressLabel,
      cost_per_hundred: result.costPerHundred,
      breakpoint_drop: result.breakpointDrop,
    });

    setSaveMessage(error ? `Saved locally. Supabase skipped: ${error.message}` : 'Saved locally and to Supabase.');
  }

  function loadFromHistory(record: LoanRecord) {
    setInputs({
      amountBorrowed: record.amountBorrowed,
      totalRepayment: record.totalRepayment,
      dueDate: record.dueDate,
      normalCashLeft: record.normalCashLeft,
      badDayCashLeft: record.badDayCashLeft,
      minimumBuffer: record.minimumBuffer,
    });

    if (record.stressKind === 'bad-day') {
      const badDayMode = stressModes.find((m) => m.kind === 'bad-day');
      if (badDayMode) setSelectedStress(badDayMode);
    } else {
      const matchingMode = stressModes.find(
        (m) => m.kind === 'drop' && m.drop === record.stressDrop,
      );
      if (matchingMode) {
        setSelectedStress(matchingMode);
      } else {
        setSelectedStress({
          label: `Custom drop - ${record.stressDrop}%`,
          shortLabel: `${record.stressDrop}% drop`,
          kind: 'drop',
          drop: record.stressDrop,
          durationDays: null,
        });
      }
      setCustomDrop(record.stressDrop);
    }

    setSaveMessage('');
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  }

  function applyEstimate(kind: 'normal' | 'bad') {
    const estimator = kind === 'normal' ? normalEstimator : badEstimator;
    const value = Math.max(0, estimator.sales - estimator.costs);
    setInputs((current) => ({
      ...current,
      [kind === 'normal' ? 'normalCashLeft' : 'badDayCashLeft']: value,
    }));
  }

  return (
    <div className="app-shell">
      <header className="nav-pill" aria-label="LoanWise navigation">
        <a className="brand" href="#top" aria-label="LoanWise home">
          <span className="brand-mark">
            <span />
            <span />
          </span>
          <span>LoanWise</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#simulator">Simulator</a>
          <a href="#calendar">Calendar</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#account">Account</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" type="button" aria-label="Search">
            <Search aria-hidden="true" />
          </button>
          <button className="icon-button mobile-only" type="button" aria-label="Menu">
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section" id="simulator">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Repayment stress test</p>
            <h1>Is your next loan safe for your store?</h1>
            <p>
              LoanWise turns a loan offer into a cash-flow stress test for sari-sari and small
              online sellers before they borrow.
            </p>
            <div className="hero-actions">
              <a className="primary-pill" href="#loan-form">Start free test</a>
              <a className="secondary-pill" href="#account">Use account</a>
            </div>
          </div>

          <section className={`gauge-panel status-${result.status}`} aria-live="polite">
            <div className="orbital-line" aria-hidden="true" />
            <div className="gauge-ring">
              <div>
                {statusCopy[result.status].icon}
                <strong>{statusCopy[result.status].title}</strong>
                <span>{currency(result.projectedCash)}</span>
              </div>
            </div>
            <p>{statusCopy[result.status].body}</p>
            <div className="quick-metrics">
              <span>{result.daysUntilDue} days</span>
              <span>{percent(result.breakpointDrop)} breakpoint</span>
              <span>{currency(result.shortfall)} gap</span>
            </div>
          </section>
        </section>

        <section className="workbench">
          <form className="input-panel" id="loan-form" onSubmit={(event) => event.preventDefault()}>
            <div className="section-heading">
              <p className="eyebrow"><span /> Six inputs</p>
              <h2>Check the offer</h2>
            </div>

            <div className="field-grid">
              <label>
                <span>Amount to borrow</span>
                <input
                  min="0"
                  type="number"
                  value={inputs.amountBorrowed}
                  onChange={(event) => updateInput('amountBorrowed', event.target.value)}
                />
              </label>
              <label>
                <span>Total repayment</span>
                <input
                  min="0"
                  type="number"
                  value={inputs.totalRepayment}
                  onChange={(event) => updateInput('totalRepayment', event.target.value)}
                />
              </label>
              <label>
                <span>Due date</span>
                <input
                  type="date"
                  value={inputs.dueDate}
                  onChange={(event) => updateInput('dueDate', event.target.value)}
                />
              </label>
              <label>
                <span>Minimum cash to keep</span>
                <input
                  min="0"
                  type="number"
                  value={inputs.minimumBuffer}
                  onChange={(event) => updateInput('minimumBuffer', event.target.value)}
                />
              </label>
            </div>

            <div className="estimator-grid">
              <Estimator
                title="Normal daily cash left"
                value={inputs.normalCashLeft}
                estimator={normalEstimator}
                onValueChange={(value) => updateInput('normalCashLeft', value)}
                onEstimatorChange={setNormalEstimator}
                onApply={() => applyEstimate('normal')}
              />
              <Estimator
                title="Bad-day cash left"
                value={inputs.badDayCashLeft}
                estimator={badEstimator}
                onValueChange={(value) => updateInput('badDayCashLeft', value)}
                onEstimatorChange={setBadEstimator}
                onApply={() => applyEstimate('bad')}
              />
            </div>
          </form>

          <section className="results-panel">
            <div className="section-heading">
              <p className="eyebrow"><span /> True cost</p>
              <h2>The loan in plain math</h2>
            </div>

            <div className="metric-row">
              <Metric icon={<CircleDollarSign />} label="Cost per ₱100" value={currency(result.costPerHundred)} />
              <Metric icon={<Clock3 />} label="Daily interest cost" value={currency(result.dailyInterestCost)} />
              <Metric icon={<PiggyBank />} label="Interest and fees" value={currency(result.interestCost)} />
            </div>

            <div className="stress-block">
              <div>
                <p className="eyebrow"><span /> What-if</p>
                <h3>Test your resilience</h3>
              </div>
              <div className="stress-buttons">
                {stressModes.map((mode) => (
                  <button
                    className={selectedStress.label === mode.label ? 'active' : ''}
                    key={mode.label}
                    type="button"
                    onClick={() => chooseStress(mode)}
                  >
                    {mode.shortLabel}
                  </button>
                ))}
              </div>
              <label className="slider-label">
                <span>Custom income drop: {percent(customDrop)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customDrop}
                  onChange={(event) => handleCustomDrop(Number(event.target.value))}
                />
              </label>
            </div>

            <div className="safety-path">
              <div>
                <Gauge aria-hidden="true" />
                <h3>Safety path</h3>
              </div>
              <p>
                To stay green, target around <strong>{currency(result.recommendedAmount)}</strong>
                {' '}borrowed on this cost ratio, or ask for about{' '}
                <strong>{result.recommendedTerm} days</strong> before repayment.
              </p>
              <button className="primary-pill button-reset" type="button" onClick={saveLoanCheck}>
                <Save aria-hidden="true" />
                Save check
              </button>
              {saveMessage ? <small>{saveMessage}</small> : null}
            </div>
          </section>
        </section>

        <RepaymentCalendar calendar={result.calendar} totalRepayment={inputs.totalRepayment} minimumBuffer={inputs.minimumBuffer} />

        <section className="dashboard-section" id="dashboard">
          <div className="section-heading">
            <p className="eyebrow"><span /> Saved history</p>
            <h2>Dashboard tables</h2>
          </div>

          <div className="dashboard-metrics">
            <Metric icon={<History />} label="Checks saved" value={String(dashboard.total)} />
            <Metric icon={<CheckCircle2 />} label="Green checks" value={String(dashboard.green)} />
            <Metric icon={<AlertTriangle />} label="Risky checks" value={String(dashboard.risky)} />
            <Metric icon={<CircleDollarSign />} label="Avg cost per ₱100" value={currency(dashboard.averageCost)} />
          </div>

          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Borrow</th>
                  <th>Repay</th>
                  <th>Stress</th>
                  <th>Projected cash</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No saved checks yet. Run the simulator and save one result.</td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="history-row">
                      <td>{new Date(item.createdAt).toLocaleDateString('en-PH')}</td>
                      <td>{currency(item.amountBorrowed)}</td>
                      <td>{currency(item.totalRepayment)}</td>
                      <td>{item.stressLabel}</td>
                      <td>{currency(item.projectedCash)}</td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>
                          {statusCopy[item.status].title}
                        </span>
                      </td>
                      <td>
                        <button
                          className="load-btn"
                          type="button"
                          title="Load this check into the simulator"
                          onClick={() => loadFromHistory(item)}
                        >
                          <RotateCcw aria-hidden="true" />
                          Load
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="account-section" id="account">
          <div className="account-copy">
            <p className="eyebrow"><span /> Optional accuracy</p>
            <h2>Accounts are ready for Supabase</h2>
            <p>
              Guest mode works today. When Supabase keys are added, email/password accounts can
              save loan checks under each user with row-level security.
            </p>
          </div>

          <div className="auth-panel">
            {session ? (
              <>
                <UserRound aria-hidden="true" />
                <h3>{session.user.email}</h3>
                <button className="secondary-pill button-reset" type="button" onClick={signOut}>
                  <LogOut aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <LockKeyhole aria-hidden="true" />
                <h3>Email account</h3>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="owner@example.com"
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                  />
                </label>
                <div className="auth-actions">
                  <button
                    className="primary-pill button-reset"
                    disabled={isAuthBusy || !isSupabaseConfigured}
                    type="button"
                    onClick={() => handleAuth('sign-in')}
                  >
                    <Mail aria-hidden="true" />
                    Sign in
                  </button>
                  <button
                    className="secondary-pill button-reset"
                    disabled={isAuthBusy || !isSupabaseConfigured}
                    type="button"
                    onClick={() => handleAuth('sign-up')}
                  >
                    Create
                  </button>
                </div>
              </>
            )}
            <small>
              {authMessage ||
                (isSupabaseConfigured
                  ? 'Supabase is configured.'
                  : 'Supabase is not configured yet. Add .env.local later.')}
            </small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <h2>LoanWise helps sellers check before they borrow.</h2>
        <div>
          <span>FinTech for Change</span>
          <span>SDG 1 / SDG 8 / SDG 10</span>
          <span>Prototype only, not lending advice</span>
        </div>
      </footer>
    </div>
  );
}

type EstimatorProps = {
  title: string;
  value: number;
  estimator: { sales: number; costs: number };
  onValueChange: (value: string) => void;
  onEstimatorChange: (value: { sales: number; costs: number }) => void;
  onApply: () => void;
};

function Estimator({
  title,
  value,
  estimator,
  onValueChange,
  onEstimatorChange,
  onApply,
}: EstimatorProps) {
  return (
    <div className="estimator">
      <label>
        <span>{title}</span>
        <input
          min="0"
          type="number"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
      </label>
      <details>
        <summary>Help me estimate</summary>
        <div className="mini-grid">
          <label>
            <span>Daily sales</span>
            <input
              min="0"
              type="number"
              value={estimator.sales}
              onChange={(event) =>
                onEstimatorChange({ ...estimator, sales: Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>Daily costs</span>
            <input
              min="0"
              type="number"
              value={estimator.costs}
              onChange={(event) =>
                onEstimatorChange({ ...estimator, costs: Number(event.target.value) })
              }
            />
          </label>
        </div>
        <button className="secondary-pill button-reset" type="button" onClick={onApply}>
          Use {currency(Math.max(0, estimator.sales - estimator.costs))}
          <ArrowRight aria-hidden="true" />
        </button>
      </details>
    </div>
  );
}

function RepaymentCalendar({
  calendar,
  totalRepayment,
  minimumBuffer,
}: {
  calendar: CalendarDay[];
  totalRepayment: number;
  minimumBuffer: number;
}) {
  const [viewMonth, setViewMonth] = useState<number>(0);

  const months = useMemo(() => {
    if (calendar.length === 0) return [];

    const grouped: { key: string; label: string; days: CalendarDay[]; year: number; month: number }[] = [];
    for (const day of calendar) {
      const y = day.date.getFullYear();
      const m = day.date.getMonth();
      const key = `${y}-${m}`;
      let group = grouped.find((g) => g.key === key);
      if (!group) {
        group = {
          key,
          label: day.date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }),
          days: [],
          year: y,
          month: m,
        };
        grouped.push(group);
      }
      group.days.push(day);
    }
    return grouped;
  }, [calendar]);

  useEffect(() => {
    setViewMonth(0);
  }, [months.length]);

  if (calendar.length === 0) return null;

  const currentGroup = months[Math.min(viewMonth, months.length - 1)];
  if (!currentGroup) return null;

  const firstDayOfMonth = new Date(currentGroup.year, currentGroup.month, 1).getDay();
  const daysInMonth = new Date(currentGroup.year, currentGroup.month + 1, 0).getDate();

  const dayMap = new Map<number, CalendarDay>();
  for (const d of currentGroup.days) {
    dayMap.set(d.date.getDate(), d);
  }

  const cells: (CalendarDay | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(dayMap.get(d) ?? null);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [tooltip, setTooltip] = useState<CalendarDay | null>(null);

  return (
    <section className="calendar-section" id="calendar">
      <div className="section-heading">
        <p className="eyebrow"><span /> Repayment breakdown</p>
        <h2>Payment calendar</h2>
      </div>

      <div className="calendar-card">
        <div className="calendar-header">
          <button
            className="icon-button calendar-nav"
            type="button"
            disabled={viewMonth === 0}
            onClick={() => setViewMonth((v) => Math.max(0, v - 1))}
            aria-label="Previous month"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <h3>{currentGroup.label}</h3>
          <button
            className="icon-button calendar-nav"
            type="button"
            disabled={viewMonth >= months.length - 1}
            onClick={() => setViewMonth((v) => Math.min(months.length - 1, v + 1))}
            aria-label="Next month"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="calendar-legend">
          <span className="legend-item"><span className="legend-dot legend-green" /> Above buffer</span>
          <span className="legend-item"><span className="legend-dot legend-yellow" /> Below buffer</span>
          <span className="legend-item"><span className="legend-dot legend-red" /> Cash gap</span>
          <span className="legend-item"><span className="legend-dot legend-stressed" /> Stressed day</span>
        </div>

        <div className="calendar-grid">
          {weekdays.map((wd) => (
            <div key={wd} className="calendar-weekday">{wd}</div>
          ))}
          {cells.map((day, i) => (
            <div
              key={i}
              className={[
                'calendar-cell',
                day ? `cell-${day.status}` : 'cell-empty',
                day?.isDueDate ? 'cell-due' : '',
                day?.isStressed ? 'cell-stressed' : '',
              ].join(' ')}
              onMouseEnter={() => day && setTooltip(day)}
              onMouseLeave={() => setTooltip(null)}
            >
              {day ? (
                <>
                  <span className="cell-date">{day.date.getDate()}</span>
                  <span className="cell-amount">{currency(day.dailyCash)}</span>
                </>
              ) : null}
            </div>
          ))}
        </div>

        {tooltip && (
          <div className="calendar-tooltip" aria-live="polite">
            <strong>Day {tooltip.dayIndex} — {tooltip.date.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
            <div className="tooltip-grid">
              <span>Daily cash:</span><span>{currency(tooltip.dailyCash)}</span>
              <span>Cumulative:</span><span>{currency(tooltip.cumulativeCash)}</span>
              <span>After repayment:</span><span className={`tooltip-${tooltip.status}`}>{currency(tooltip.cashAfterRepayment)}</span>
              <span>Repayment due:</span><span>{currency(totalRepayment)}</span>
              <span>Buffer target:</span><span>{currency(minimumBuffer)}</span>
            </div>
            {tooltip.isStressed && <small className="tooltip-stress">⚡ Stressed day</small>}
            {tooltip.isDueDate && <small className="tooltip-due">📅 Due date</small>}
          </div>
        )}

        <div className="calendar-summary">
          <Calendar aria-hidden="true" />
          <p>
            {calendar.length} days tracked.
            Final projected cash: <strong className={`tooltip-${calendar[calendar.length - 1].status}`}>
              {currency(calendar[calendar.length - 1].cashAfterRepayment)}
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;

