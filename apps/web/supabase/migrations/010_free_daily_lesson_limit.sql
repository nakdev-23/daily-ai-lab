-- Migration 010: daily lesson limit for the Free package
-- Free users may complete at most N new lessons per day (admin-configurable,
-- default 2). Pro users and admins are unlimited. Replaying an already-finished
-- lesson never counts against the limit (it already returns early with no XP).
-- The day boundary is Bangkok midnight — same as lessons_today tracking.
-- Run this in Supabase SQL Editor (safe to re-run).

-- 1. Admin-configurable limit (0 = Free users cannot learn at all).
alter table system_settings add column if not exists free_lessons_per_day int not null default 2;
do $$ begin
  alter table system_settings add constraint free_lessons_per_day_range check (free_lessons_per_day between 0 and 99);
exception when duplicate_object then null; end $$;

-- 2. Enforce the limit inside complete_lesson (the single place lessons are
--    awarded), so a crafted client request can't bypass the page-level gate.
create or replace function complete_lesson(p_course_id text, p_lesson_num int, p_xp int default 10)
returns boolean
language plpgsql security definer
set search_path = public
as $$
declare
  v_user        uuid := auth.uid();
  v_prev        int;
  v_today       date := (now() at time zone 'Asia/Bangkok')::date;
  v_xp          int := least(greatest(coalesce(p_xp, 10), 0), 50);  -- clamp: callable directly by clients
  v_max_lessons int;
  v_is_pro      boolean;
  v_limit       int;
  v_done_today  int;
begin
  if v_user is null then return false; end if;
  if p_lesson_num is null or p_lesson_num < 1 then return false; end if;

  -- reject lesson numbers beyond the course length (id::text avoids uuid cast errors on slugs)
  select lessons into v_max_lessons
  from courses
  where slug = p_course_id or id::text = p_course_id;
  if v_max_lessons is not null and v_max_lessons > 0 and p_lesson_num > v_max_lessons then
    return false;
  end if;

  -- lock the progress row so concurrent completions can't double-award XP
  select lessons_done into v_prev
  from course_progress
  where user_id = v_user and course_id = p_course_id
  for update;

  if coalesce(v_prev, 0) >= p_lesson_num then
    return false;  -- replay of an already-completed lesson: no progress, no XP
  end if;

  -- enforce sequential progress — you can only complete the next lesson,
  -- not jump ahead. Stops the "open last lesson URL → whole course done" exploit.
  if p_lesson_num > coalesce(v_prev, 0) + 1 then
    return false;
  end if;

  -- NEW (010): Free-package daily limit. Admins and active Pro subscribers are
  -- unlimited; everyone else stops once today's new-lesson count hits the cap.
  v_is_pro := exists (select 1 from profiles where id = v_user and role = 'admin')
    or exists (
      select 1 from subscriptions
      where user_id = v_user and plan = 'pro'
        and (expires_at is null or expires_at > now())
    );
  if not v_is_pro then
    select free_lessons_per_day into v_limit from system_settings where id = 1;
    v_limit := coalesce(v_limit, 2);
    select case when lessons_today_date = v_today then lessons_today else 0 end
      into v_done_today
    from game_state where user_id = v_user;
    if coalesce(v_done_today, 0) >= v_limit then
      return false;
    end if;
  end if;

  insert into course_progress (user_id, course_id, lessons_done, updated_at)
  values (v_user, p_course_id, p_lesson_num, now())
  on conflict (user_id, course_id) do update
    set lessons_done = greatest(course_progress.lessons_done, excluded.lessons_done),
        updated_at   = now();

  update game_state set
    xp = xp + v_xp,
    level = floor((xp + v_xp) / 500.0)::int + 1,
    lessons_today = case when lessons_today_date = v_today then lessons_today + 1 else 1 end,
    lessons_today_date = v_today,
    streak_current = case
      when streak_last_date = v_today then streak_current
      when streak_last_date = v_today - 1 then streak_current + 1
      else 1 end,
    streak_longest = greatest(streak_longest, case
      when streak_last_date = v_today then streak_current
      when streak_last_date = v_today - 1 then streak_current + 1
      else 1 end),
    streak_last_date = v_today,
    updated_at = now()
  where user_id = v_user;

  if not found then
    insert into game_state (user_id, xp, level, lessons_today, lessons_today_date, streak_current, streak_longest, streak_last_date)
    values (v_user, v_xp, 1, 1, v_today, 1, 1, v_today);
  end if;

  return true;
end;
$$;

revoke execute on function complete_lesson(text, int, int) from anon;
grant execute on function complete_lesson(text, int, int) to authenticated;
