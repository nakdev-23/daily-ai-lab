-- Migration 009: persistent hearts with a daily reset
-- Hearts now live in game_state and are shared across every lesson (no more
-- per-lesson reset). They refill to the max once per "day", where the day
-- boundary is configurable by the admin (hearts_reset_hour, Asia/Bangkok).
-- Run this in Supabase SQL Editor (safe to re-run).

-- 1. Track which reset-period the current hearts belong to.
alter table game_state add column if not exists hearts_date date;

-- 2. Admin-configurable reset hour (0–23, Bangkok time). 0 = midnight.
alter table system_settings add column if not exists hearts_reset_hour int not null default 0;
do $$ begin
  alter table system_settings add constraint hearts_reset_hour_range check (hearts_reset_hour between 0 and 23);
exception when duplicate_object then null; end $$;

-- 3. Single source of truth for reading / losing a heart.
--    p_lose = false → read current hearts (applying a daily reset if due)
--    p_lose = true  → deduct one heart (after any due reset)
--    Returns the resulting heart count.
create or replace function sync_hearts(p_lose boolean default false)
returns int
language plpgsql security definer
set search_path = public
as $$
declare
  v_user       uuid := auth.uid();
  v_max        int;
  v_reset_hour int;
  v_period     date;
  v_hearts     int;
  v_hdate      date;
begin
  if v_user is null then return null; end if;

  select hearts_per_round, hearts_reset_hour into v_max, v_reset_hour
  from system_settings where id = 1;
  v_max        := coalesce(v_max, 5);
  v_reset_hour := coalesce(v_reset_hour, 0);

  -- The current reset period: shift Bangkok time back by the reset hour, take the date.
  v_period := ((now() at time zone 'Asia/Bangkok') - make_interval(hours => v_reset_hour))::date;

  select hearts, hearts_date into v_hearts, v_hdate
  from game_state where user_id = v_user
  for update;

  if not found then
    insert into game_state (user_id, hearts, hearts_date)
    values (v_user, case when p_lose then greatest(v_max - 1, 0) else v_max end, v_period);
    return case when p_lose then greatest(v_max - 1, 0) else v_max end;
  end if;

  if v_hdate is distinct from v_period then
    -- New period → refill, then apply the loss (if any) on the fresh count.
    v_hearts := case when p_lose then greatest(v_max - 1, 0) else v_max end;
    update game_state
      set hearts = v_hearts, hearts_date = v_period,
          hearts_last_lost_at = case when p_lose then now() else hearts_last_lost_at end,
          updated_at = now()
      where user_id = v_user;
  elsif p_lose then
    v_hearts := greatest(coalesce(v_hearts, v_max) - 1, 0);
    update game_state
      set hearts = v_hearts, hearts_last_lost_at = now(), updated_at = now()
      where user_id = v_user;
  else
    -- Same period, just reading: no write needed.
    v_hearts := coalesce(v_hearts, v_max);
  end if;

  return v_hearts;
end;
$$;

revoke execute on function sync_hearts(boolean) from anon;
grant execute on function sync_hearts(boolean) to authenticated;
