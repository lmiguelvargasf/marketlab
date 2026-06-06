-- MarketLab minimal schema
-- Workshop starting fake balance: $100.00 (10,000 cents)
-- 1 fake cent spent = 1 share cent

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles (one-to-one with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  balance_cents integer not null check (balance_cents >= 0),
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- markets (binary Yes/No only)
-- ---------------------------------------------------------------------------

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null check (status in ('open', 'closed', 'resolved')),
  close_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger markets_set_updated_at
  before update on public.markets
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- positions (one row per user per market)
-- ---------------------------------------------------------------------------

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  market_id uuid not null references public.markets (id) on delete cascade,
  yes_shares_cents integer not null default 0 check (yes_shares_cents >= 0),
  no_shares_cents integer not null default 0 check (no_shares_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, market_id)
);

create index positions_user_id_idx on public.positions (user_id);
create index positions_market_id_idx on public.positions (market_id);

create trigger positions_set_updated_at
  before update on public.positions
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ledger_entries (append-only audit trail)
-- ---------------------------------------------------------------------------

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  market_id uuid references public.markets (id) on delete set null,
  amount_cents integer not null,
  entry_type text not null check (entry_type in ('starting_balance', 'trade', 'payout')),
  description text not null default '',
  created_at timestamptz not null default now()
);

create index ledger_entries_user_id_idx on public.ledger_entries (user_id);
create index ledger_entries_market_id_idx on public.ledger_entries (market_id);

-- ---------------------------------------------------------------------------
-- Row level security (read-only for clients in this workshop slice)
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.positions enable row level security;
alter table public.ledger_entries enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy markets_select_public
  on public.markets
  for select
  to anon, authenticated
  using (true);

create policy positions_select_own
  on public.positions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy ledger_entries_select_own
  on public.ledger_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Data API role grants (RLS controls rows; GRANT controls table access)
-- ---------------------------------------------------------------------------

grant select on table public.markets to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.positions to authenticated;
grant select on table public.ledger_entries to authenticated;

-- ---------------------------------------------------------------------------
-- Profile creation on auth signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  starting_balance_cents constant integer := 10000;
begin
  insert into public.profiles (id, balance_cents, first_name, last_name)
  values (
    new.id,
    starting_balance_cents,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );

  insert into public.ledger_entries (user_id, market_id, amount_cents, entry_type, description)
  values (
    new.id,
    null,
    starting_balance_cents,
    'starting_balance',
    'Welcome bonus'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
