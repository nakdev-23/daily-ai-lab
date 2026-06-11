-- Migration 013: real data for the admin overview dashboard
-- The /admin overview previously showed hardcoded mock numbers. RLS lets each
-- user read only their own game_state / course_progress / subscriptions rows,
-- so the page cannot aggregate across users with the session client. This
-- security-definer RPC computes every stat the dashboard needs in one
-- round-trip, and refuses non-admin callers.
-- Run this in Supabase SQL Editor (safe to re-run).

create or replace function get_admin_overview()
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_today         date := (now() at time zone 'Asia/Bangkok')::date;
  v_total_users   int;
  v_active_today  int;
  v_lessons_today int;
  v_lessons_total bigint;
  v_pro_count     int;
  v_price         int;
  v_new_7d        int;
  v_prev_7d       int;
  v_signups       jsonb;
  v_popular       jsonb;
begin
  if not is_admin(auth.uid()) then
    raise exception 'forbidden';
  end if;

  select count(*) into v_total_users from profiles;

  -- users who completed at least one lesson today (Bangkok day)
  select count(*) into v_active_today
  from game_state where lessons_today_date = v_today and lessons_today > 0;

  select coalesce(sum(lessons_today), 0) into v_lessons_today
  from game_state where lessons_today_date = v_today;

  select coalesce(sum(lessons_done), 0) into v_lessons_total from course_progress;

  select count(*) into v_pro_count
  from subscriptions
  where plan = 'pro' and (expires_at is null or expires_at > now());

  select pro_price_month into v_price from system_settings where id = 1;

  -- signups: this 7-day window vs the previous one (real trend for the KPI chip)
  select count(*) into v_new_7d
  from profiles where (created_at at time zone 'Asia/Bangkok')::date > v_today - 7;
  select count(*) into v_prev_7d
  from profiles
  where (created_at at time zone 'Asia/Bangkok')::date > v_today - 14
    and (created_at at time zone 'Asia/Bangkok')::date <= v_today - 7;

  -- daily signups for the last 7 days (zero-filled)
  select coalesce(jsonb_agg(jsonb_build_object('d', to_char(d.day, 'YYYY-MM-DD'), 'n', coalesce(s.n, 0)) order by d.day), '[]'::jsonb)
  into v_signups
  from generate_series(v_today - 6, v_today, interval '1 day') as d(day)
  left join (
    select (created_at at time zone 'Asia/Bangkok')::date as day, count(*)::int as n
    from profiles
    where (created_at at time zone 'Asia/Bangkok')::date >= v_today - 6
    group by 1
  ) s on s.day = d.day::date;

  -- most-learned courses by total lessons completed
  select coalesce(jsonb_agg(jsonb_build_object('course_id', p.course_id, 'done', p.done) order by p.done desc), '[]'::jsonb)
  into v_popular
  from (
    select course_id, sum(lessons_done)::int as done
    from course_progress
    group by course_id
    order by 2 desc
    limit 5
  ) p;

  return jsonb_build_object(
    'total_users',   v_total_users,
    'active_today',  v_active_today,
    'lessons_today', v_lessons_today,
    'lessons_total', v_lessons_total,
    'pro_count',     v_pro_count,
    'mrr',           v_pro_count * coalesce(v_price, 0),
    'new_users_7d',  v_new_7d,
    'prev_users_7d', v_prev_7d,
    'signups_7d',    v_signups,
    'popular',       v_popular
  );
end;
$$;

revoke execute on function get_admin_overview() from anon;
grant execute on function get_admin_overview() to authenticated;
