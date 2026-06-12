-- Migration 015: subscription integrity — one row per user, enforced
-- Found in testing: subscriptions has NO unique constraint on user_id, so a
-- double insert (webhook retry, concurrent checkout confirm, manual seed)
-- creates duplicate rows. With duplicates, maybeSingle() in getProfile errors
-- and a PAYING user is treated as Free. This dedupes existing rows (keeping
-- the most meaningful one) and locks the table to one row per user.
-- Run this in Supabase SQL Editor BEFORE going to production (safe to re-run).

-- 0. Columns used by Stripe billing (no-ops where schema.sql already has them).
alter table subscriptions add column if not exists stripe_customer_id text;
alter table subscriptions add column if not exists stripe_subscription_id text;

-- 1. Dedupe: per user keep the best row — prefer pro, then one linked to
--    Stripe, then the most recently updated.
with ranked as (
  select ctid,
         row_number() over (
           partition by user_id
           order by (plan = 'pro') desc,
                    (stripe_subscription_id is not null) desc,
                    updated_at desc nulls last,
                    created_at desc nulls last
         ) as rn
  from subscriptions
)
delete from subscriptions s
using ranked r
where s.ctid = r.ctid and r.rn > 1;

-- 2. Drop junk rows and forbid them forever. Found in testing: an anonymous
--    call to cancel_subscription() inserted a row with user_id NULL, because
--    (a) Postgres grants EXECUTE on new functions to PUBLIC by default and
--    (b) the function had no auth guard.
delete from subscriptions where user_id is null;
alter table subscriptions alter column user_id set not null;

-- 3. One subscription row per user, forever.
do $$ begin
  alter table subscriptions add constraint subscriptions_user_id_key unique (user_id);
exception when duplicate_table or duplicate_object then null; end $$;

-- 4. Harden cancel_subscription: refuse anonymous callers and revoke the
--    default PUBLIC execute grant (014 granted to authenticated but never
--    revoked anon/public).
create or replace function cancel_subscription()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;

  update subscriptions
     set plan = 'free',
         expires_at = null,
         stripe_subscription_id = null,
         updated_at = now()
   where user_id = auth.uid();

  if not found then
    insert into subscriptions (user_id, plan) values (auth.uid(), 'free');
  end if;
end;
$$;

revoke execute on function cancel_subscription() from public;
revoke execute on function cancel_subscription() from anon;
grant execute on function cancel_subscription() to authenticated;

-- 5. Same hole in get_leaderboard: anyone with the anon key could pull every
--    player's display name + XP without signing in. Leaderboard is a
--    signed-in surface — lock it down.
revoke execute on function get_leaderboard(int) from public;
revoke execute on function get_leaderboard(int) from anon;
grant execute on function get_leaderboard(int) to authenticated;
