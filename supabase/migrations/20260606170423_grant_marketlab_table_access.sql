-- Expose MarketLab tables to the Data API roles.
-- RLS policies control row access; GRANT controls table access.

grant select on table public.markets to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.positions to authenticated;
grant select on table public.ledger_entries to authenticated;
