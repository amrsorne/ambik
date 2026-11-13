-- Ambik project ONLY (ref: yaxvexccccbftxxjmozs)
-- Do not run on MyTeam FC (pvzygsqpwtloukjiangz)

-- Ensure waitlist table exists with expected columns (skip if already present)
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  service text not null,
  source text,
  remark text,
  created_at timestamptz not null default now()
);

-- Normalize email on write
create or replace function public.waitlist_normalize_email()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(trim(new.email));
  return new;
end;
$$;

drop trigger if exists waitlist_normalize_email on public.waitlist;
create trigger waitlist_normalize_email
  before insert on public.waitlist
  for each row
  execute function public.waitlist_normalize_email();

-- Constraints
alter table public.waitlist
  drop constraint if exists waitlist_email_format_check;

alter table public.waitlist
  add constraint waitlist_email_format_check check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(email) <= 254
  );

alter table public.waitlist
  drop constraint if exists waitlist_service_format_check;

alter table public.waitlist
  add constraint waitlist_service_format_check check (
    service ~ '^[a-z0-9_-]+$'
  );

drop index if exists waitlist_email_service_unique;
create unique index waitlist_email_service_unique
  on public.waitlist (email, service);

-- Throttle: max 5 waitlist rows per email per 24 hours (all services)
create or replace function public.waitlist_throttle_insert()
returns trigger
language plpgsql
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.waitlist
  where email = new.email
    and created_at > now() - interval '24 hours';

  if recent_count >= 5 then
    raise exception 'waitlist_rate_limited'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists waitlist_throttle_insert on public.waitlist;
create trigger waitlist_throttle_insert
  before insert on public.waitlist
  for each row
  execute function public.waitlist_throttle_insert();

-- RLS: anonymous users may insert only (no read/update/delete)
alter table public.waitlist enable row level security;

drop policy if exists waitlist_anon_insert on public.waitlist;
create policy waitlist_anon_insert
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Optional: service role / dashboard retains full access via bypass or separate policies in dashboard
