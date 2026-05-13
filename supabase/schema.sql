create table if not exists public.loan_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  amount_borrowed numeric not null,
  total_repayment numeric not null,
  due_date date not null,
  normal_cash_left numeric not null,
  bad_day_cash_left numeric not null,
  minimum_buffer numeric not null,
  days_until_due integer not null,
  projected_cash numeric not null,
  status text not null check (status in ('green', 'yellow', 'red')),
  stress_label text not null,
  cost_per_hundred numeric not null,
  breakpoint_drop numeric not null
);

alter table public.loan_checks enable row level security;

create policy "Users can read their own loan checks"
  on public.loan_checks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own loan checks"
  on public.loan_checks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own loan checks"
  on public.loan_checks
  for delete
  using (auth.uid() = user_id);
