create table if not exists public.signal_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  decision_key text not null,
  action_type text not null check (action_type in ('executed', 'simulated', 'skipped')),
  signal text not null default '',
  headline text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists signal_actions_user_created_idx
on public.signal_actions (user_id, created_at desc);

create index if not exists signal_actions_decision_idx
on public.signal_actions (user_id, decision_key, created_at desc);

alter table public.signal_actions enable row level security;

create policy "signal_actions_select_own"
on public.signal_actions
for select
to authenticated
using (auth.uid() = user_id);

create policy "signal_actions_insert_own"
on public.signal_actions
for insert
to authenticated
with check (auth.uid() = user_id);

create table if not exists public.recommendation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  decision_key text not null,
  headline text not null default '',
  signal text not null default '',
  why text not null default '',
  what_could_go_wrong text not null default '',
  safer_option text not null default '',
  confidence integer not null default 0,
  time_horizon text not null default '',
  biggest_issue text not null default '',
  issue_score integer not null default 0,
  action_status text not null check (action_status in ('executed', 'simulated', 'skipped')),
  recorded_at timestamptz not null default timezone('utc', now())
);

create index if not exists recommendation_history_user_recorded_idx
on public.recommendation_history (user_id, recorded_at desc);

create index if not exists recommendation_history_decision_idx
on public.recommendation_history (user_id, decision_key, recorded_at desc);

alter table public.recommendation_history enable row level security;

create policy "recommendation_history_select_own"
on public.recommendation_history
for select
to authenticated
using (auth.uid() = user_id);

create policy "recommendation_history_insert_own"
on public.recommendation_history
for insert
to authenticated
with check (auth.uid() = user_id);
