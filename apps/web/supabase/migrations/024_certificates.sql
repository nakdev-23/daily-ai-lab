-- Migration 024: verifiable career-path certificates
-- A certificate is issued automatically when course_progress reaches the final
-- step of a published career path. The trigger runs in the same transaction as
-- complete_lesson, so progress and certificate issuance cannot drift apart.
--
-- Public visitors never receive user_id or other private profile fields. They
-- verify a certificate through verify_certificate(code), which returns only
-- the immutable certificate snapshot needed on the public verification page.
-- Safe to re-run.

create extension if not exists pgcrypto;

create table if not exists certificates (
  id                bigint generated always as identity primary key,
  verification_code text not null default (
    'DAL-' || upper(encode(gen_random_bytes(10), 'hex'))
  ),
  user_id           uuid not null references auth.users(id) on delete cascade,
  path_id           uuid not null references career_paths(id) on delete restrict,
  path_slug         text not null,
  recipient_name    text not null,
  path_title        text not null,
  path_title_en     text,
  completed_steps   int not null check (completed_steps > 0),
  total_xp          int not null default 0 check (total_xp >= 0),
  issued_at         timestamptz not null default now(),
  revoked_at        timestamptz,
  revoke_reason     text,
  constraint certificates_verification_code_key unique (verification_code),
  constraint certificates_user_path_key unique (user_id, path_id),
  constraint certificates_code_format check (
    verification_code ~ '^DAL-[A-F0-9]{20}$'
  )
);

create index if not exists certificates_user_issued_idx
  on certificates (user_id, issued_at desc);

create index if not exists certificates_path_issued_idx
  on certificates (path_id, issued_at desc);

alter table certificates enable row level security;

drop policy if exists "users read own certificates" on certificates;
create policy "users read own certificates"
  on certificates for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "admins read all certificates" on certificates;
create policy "admins read all certificates"
  on certificates for select to authenticated
  using ((select is_admin((select auth.uid()))));

-- The browser must not query certificate rows directly. Public verification
-- goes through the limited RPC below.
revoke all on table certificates from anon;
grant select on table certificates to authenticated;

create or replace function issue_path_certificate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path_slug   text;
  v_path        career_paths%rowtype;
  v_step_count  int;
  v_total_xp    int;
  v_name        text;
begin
  if new.course_id not like 'path:%' then
    return new;
  end if;

  v_path_slug := substring(new.course_id from 6);

  select cp.*
    into v_path
  from career_paths cp
  where cp.slug = v_path_slug
    and cp.is_published = true;

  if not found then
    return new;
  end if;

  select count(*)::int, coalesce(sum(ps.xp), 0)::int
    into v_step_count, v_total_xp
  from path_steps ps
  join path_modules pm on pm.id = ps.module_id
  where pm.path_id = v_path.id;

  if v_step_count = 0 or new.lessons_done < v_step_count then
    return new;
  end if;

  select nullif(trim(p.display_name), '')
    into v_name
  from profiles p
  where p.id = new.user_id;

  insert into certificates (
    user_id,
    path_id,
    path_slug,
    recipient_name,
    path_title,
    path_title_en,
    completed_steps,
    total_xp
  )
  values (
    new.user_id,
    v_path.id,
    v_path.slug,
    coalesce(v_name, 'Daily AI Lab Learner'),
    v_path.title,
    v_path.title_en,
    v_step_count,
    v_total_xp
  )
  on conflict (user_id, path_id) do nothing;

  return new;
end;
$$;

revoke all on function issue_path_certificate() from public;

drop trigger if exists issue_path_certificate_after_progress on course_progress;
create trigger issue_path_certificate_after_progress
  after insert or update of lessons_done on course_progress
  for each row execute function issue_path_certificate();

-- Issue certificates retroactively for paths completed before this migration.
insert into certificates (
  user_id,
  path_id,
  path_slug,
  recipient_name,
  path_title,
  path_title_en,
  completed_steps,
  total_xp,
  issued_at
)
select
  progress.user_id,
  progress.path_id,
  progress.path_slug,
  coalesce(nullif(trim(p.display_name), ''), 'Daily AI Lab Learner'),
  progress.path_title,
  progress.path_title_en,
  progress.step_count,
  progress.total_xp,
  coalesce(progress.updated_at, now())
from (
  select
    cpgr.user_id,
    cp.id as path_id,
    cp.slug as path_slug,
    cp.title as path_title,
    cp.title_en as path_title_en,
    count(ps.id)::int as step_count,
    coalesce(sum(ps.xp), 0)::int as total_xp,
    cpgr.lessons_done,
    cpgr.updated_at
  from course_progress cpgr
  join career_paths cp
    on cp.slug = substring(cpgr.course_id from 6)
   and cp.is_published = true
  join path_modules pm on pm.path_id = cp.id
  join path_steps ps on ps.module_id = pm.id
  where cpgr.course_id like 'path:%'
  group by
    cpgr.user_id,
    cpgr.lessons_done,
    cpgr.updated_at,
    cp.id,
    cp.slug,
    cp.title,
    cp.title_en
) progress
join profiles p on p.id = progress.user_id
where progress.step_count > 0
  and progress.lessons_done >= progress.step_count
on conflict (user_id, path_id) do nothing;

create or replace function verify_certificate(p_code text)
returns table (
  verification_code text,
  recipient_name text,
  path_title text,
  path_title_en text,
  path_slug text,
  completed_steps int,
  total_xp int,
  issued_at timestamptz,
  valid boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.verification_code,
    c.recipient_name,
    c.path_title,
    c.path_title_en,
    c.path_slug,
    c.completed_steps,
    c.total_xp,
    c.issued_at,
    c.revoked_at is null as valid
  from certificates c
  where c.verification_code = upper(trim(p_code))
  limit 1;
$$;

revoke all on function verify_certificate(text) from public;
grant execute on function verify_certificate(text) to anon, authenticated;
