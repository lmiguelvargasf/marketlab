-- Workshop seed markets: keep open markets buyable with far-future close dates.
-- Safe to re-run: updates known titles and inserts missing sample markets.

update public.markets
set
  status = 'open',
  close_date = '2026-12-31T23:59:59+00'
where title in (
  'Is the food going to arrive cold?',
  'Is at least 50% of the people going to finish the workshop?'
);

insert into public.markets (title, description, status, close_date)
select *
from (
  values
    (
      'Will it rain in Quito this week?',
      'A simple weather market for trying fake-money Yes/No shares.',
      'open',
      '2026-12-31T23:59:59+00'::timestamptz
    ),
    (
      'Will the demo deploy succeed on the first try?',
      'Workshop market for testing purchases before close.',
      'open',
      '2026-12-31T23:59:59+00'::timestamptz
    ),
    (
      'Will more than 10 people join the afternoon session?',
      'Another open market for exploring positions.',
      'closed',
      '2026-12-31T23:59:59+00'::timestamptz
    )
) as seed (title, description, status, close_date)
where not exists (
  select 1
  from public.markets existing
  where existing.title = seed.title
);
