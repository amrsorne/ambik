-- Ambik project ONLY (ref: zwjcafxhvblzwejtzmsn)
-- Run in Supabase SQL editor before enabling production cron.
-- Returns aggregate waitlist metrics only (no emails or PII).

create or replace function public.stats_waitlist_public()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'total', (select count(*)::int from public.waitlist),
    'new_7d', (
      select count(*)::int
      from public.waitlist
      where created_at > now() - interval '7 days'
    ),
    'new_30d', (
      select count(*)::int
      from public.waitlist
      where created_at > now() - interval '30 days'
    ),
    'by_service', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json)
      from (
        select service, count(*)::int as count
        from public.waitlist
        group by service
        order by count desc, service asc
      ) as t
    ),
    'signups_daily', (
      select coalesce(json_agg(row_to_json(d)), '[]'::json)
      from (
        select
          to_char((created_at at time zone 'UTC')::date, 'YYYY-MM-DD') as day,
          count(*)::int as count
        from public.waitlist
        where created_at >= ((now() at time zone 'UTC')::date - interval '29 days')
        group by 1
        order by 1
      ) as d
    )
  );
$$;

revoke all on function public.stats_waitlist_public() from public;
revoke all on function public.stats_waitlist_public() from anon, authenticated;
grant execute on function public.stats_waitlist_public() to service_role;
