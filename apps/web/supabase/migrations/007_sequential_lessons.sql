-- Migration 007: enforce sequential lesson completion
-- Fixes a progression-bypass: previously a client could call complete_lesson with
-- any lesson number (e.g. the last one) and `greatest(prev, p_lesson_num)` would
-- back-fill every earlier lesson as "done" + award XP for work never did.
-- Now a lesson only completes if it's the very next one (prev + 1).
-- Run this in Supabase SQL Editor (safe to re-run — create or replace).

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

  -- NEW: enforce sequential progress — you can only complete the next lesson,
  -- not jump ahead. Stops the "open last lesson URL → whole course done" exploit.
  if p_lesson_num > coalesce(v_prev, 0) + 1 then
    return false;
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
