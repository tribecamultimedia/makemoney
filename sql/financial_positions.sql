create table if not exists public.financial_positions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  liquid_cash numeric not null default 0,
  monthly_need numeric not null default 0,
  investments numeric not null default 0,
  retirement numeric not null default 0,
  real_estate numeric not null default 0,
  business_assets numeric not null default 0,
  credit_card_debt numeric not null default 0,
  loans numeric not null default 0,
  mortgage_debt numeric not null default 0,
  asset_ledger jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.financial_positions
add column if not exists asset_ledger jsonb not null default '[]'::jsonb;

alter table public.financial_positions enable row level security;

create policy "financial_positions_select_own"
on public.financial_positions
for select
to authenticated
using (auth.uid() = user_id);

create policy "financial_positions_insert_own"
on public.financial_positions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "financial_positions_update_own"
on public.financial_positions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
