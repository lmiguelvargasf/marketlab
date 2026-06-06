-- Atomic fake-money buy: deduct balance, upsert position, append ledger entry.
-- Uses auth.uid() only — no client-supplied user_id.

create or replace function public.buy_shares(
  p_market_id uuid,
  p_side text,
  p_amount_cents integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_balance integer;
  v_market_status text;
  v_market_close timestamptz;
  v_yes_shares integer;
  v_no_shares integer;
begin
  v_user := auth.uid();

  if v_user is null then
    raise exception 'Not authenticated';
  end if;

  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'Amount must be a positive integer';
  end if;

  if p_side not in ('yes', 'no') then
    raise exception 'Side must be yes or no';
  end if;

  select status, close_date
  into v_market_status, v_market_close
  from public.markets
  where id = p_market_id;

  if not found then
    raise exception 'Market not found';
  end if;

  if v_market_status <> 'open' or v_market_close <= now() then
    raise exception 'Market is not open';
  end if;

  select balance_cents
  into v_balance
  from public.profiles
  where id = v_user
  for update;

  if not found then
    raise exception 'Profile not found';
  end if;

  if v_balance < p_amount_cents then
    raise exception 'Insufficient fake balance';
  end if;

  update public.profiles
  set balance_cents = balance_cents - p_amount_cents
  where id = v_user;

  insert into public.positions (user_id, market_id, yes_shares_cents, no_shares_cents)
  values (
    v_user,
    p_market_id,
    case when p_side = 'yes' then p_amount_cents else 0 end,
    case when p_side = 'no' then p_amount_cents else 0 end
  )
  on conflict (user_id, market_id) do update
  set
    yes_shares_cents = public.positions.yes_shares_cents
      + case when p_side = 'yes' then p_amount_cents else 0 end,
    no_shares_cents = public.positions.no_shares_cents
      + case when p_side = 'no' then p_amount_cents else 0 end;

  select yes_shares_cents, no_shares_cents
  into v_yes_shares, v_no_shares
  from public.positions
  where user_id = v_user and market_id = p_market_id;

  insert into public.ledger_entries (user_id, market_id, amount_cents, entry_type, description)
  values (
    v_user,
    p_market_id,
    -p_amount_cents,
    'trade',
    case when p_side = 'yes' then 'Bought Yes shares' else 'Bought No shares' end
  );

  return jsonb_build_object(
    'balance_cents', v_balance - p_amount_cents,
    'yes_shares_cents', v_yes_shares,
    'no_shares_cents', v_no_shares
  );
end;
$$;

revoke all on function public.buy_shares(uuid, text, integer) from public;
grant execute on function public.buy_shares(uuid, text, integer) to authenticated;
