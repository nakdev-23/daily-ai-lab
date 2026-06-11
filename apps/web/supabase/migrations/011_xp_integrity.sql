-- Migration 011: XP integrity — the server owns XP, and the client learns why
-- Fixes "finished a lesson but XP didn't move":
--   1. complete_lesson no longer trusts a client-sent XP amount. It derives the
--      lesson's XP from course content (course_units → course_lessons in display
--      order), falling back to system_settings.xp_per_lesson. A crafted request
--      can no longer award itself arbitrary XP (the old clamp allowed up to 50).
--   2. Returns jsonb {ok, xp, reason} instead of a bare boolean, so the UI can
--      tell "earned 15 XP" from "replay" from "daily-limit" instead of failing
--      silently behind a celebration screen.
--   3. Perfect-quiz bonus (xp_perfect_quiz, admin-configurable) is finally paid
--      out when the lesson is completed without a single wrong answer.
--   4. game_state gains xp_today / xp_today_date so the "Earn N XP today" quest
--      can show real progress (same Bangkok-midnight boundary as lessons_today).
-- Run this in Supabase SQL Editor (safe to re-run).

-- 1. Daily XP counter.
alter table game_state add column if not exists xp_today int not null default 0;
alter table game_state add column if not exists xp_today_date date;

-- 2. Replace the boolean signature with the jsonb one (drop first: changing the
--    return type of an existing signature is not allowed by CREATE OR REPLACE).
drop function if exists complete_lesson(text, int, int);

create or replace function complete_lesson(p_course_id text, p_lesson_num int, p_perfect boolean default false)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_user        uuid := auth.uid();
  v_prev        int;
  v_today       date := (now() at time zone 'Asia/Bangkok')::date;
  v_max_lessons int;
  v_is_pro      boolean;
  v_limit       int;
  v_done_today  int;
  v_xp          int;
  v_bonus       int := 0;
  v_course_uuid uuid;
begin
  if v_user is null then return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'not-signed-in'); end if;
  if p_lesson_num is null or p_lesson_num < 1 then return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'invalid'); end if;

  -- reject lesson numbers beyond the course length (id::text avoids uuid cast errors on slugs)
  select id, lessons into v_course_uuid, v_max_lessons
  from courses
  where slug = p_course_id or id::text = p_course_id;
  if v_max_lessons is not null and v_max_lessons > 0 and p_lesson_num > v_max_lessons then
    return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'invalid');
  end if;

  -- lock the progress row so concurrent completions can't double-award XP
  select lessons_done into v_prev
  from course_progress
  where user_id = v_user and course_id = p_course_id
  for update;

  if coalesce(v_prev, 0) >= p_lesson_num then
    -- replay of an already-completed lesson: no progress, no XP
    return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'replay');
  end if;

  -- sequential progress only — no jumping ahead via crafted URLs
  if p_lesson_num > coalesce(v_prev, 0) + 1 then
    return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'sequential');
  end if;

  -- Free-package daily limit (admins / active Pro are unlimited)
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
      return jsonb_build_object('ok', false, 'xp', 0, 'reason', 'daily-limit');
    end if;
  end if;

  -- XP comes from the course content itself: the Nth lesson in display order
  -- (units by order_index, then lessons by order_index) — exactly what the
  -- quest map shows the learner. Falls back to the admin's xp_per_lesson.
  select l.xp into v_xp
  from course_units u
  join course_lessons l on l.unit_id = u.id
  where u.course_id = v_course_uuid
  order by u.order_index, l.order_index
  offset p_lesson_num - 1 limit 1;

  if v_xp is null or v_xp <= 0 then
    select xp_per_lesson into v_xp from system_settings where id = 1;
    v_xp := coalesce(v_xp, 10);
  end if;

  -- Perfect run (no wrong answers) earns the admin-configured quiz bonus.
  if p_perfect then
    select xp_perfect_quiz into v_bonus from system_settings where id = 1;
    v_bonus := coalesce(v_bonus, 0);
  end if;

  v_xp := least(greatest(v_xp + v_bonus, 0), 1000);

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
    xp_today = case when xp_today_date = v_today then xp_today + v_xp else v_xp end,
    xp_today_date = v_today,
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
    insert into game_state (user_id, xp, level, lessons_today, lessons_today_date, xp_today, xp_today_date, streak_current, streak_longest, streak_last_date)
    values (v_user, v_xp, 1, 1, v_today, v_xp, v_today, 1, 1, v_today);
  end if;

  return jsonb_build_object('ok', true, 'xp', v_xp, 'reason', 'ok');
end;
$$;

revoke execute on function complete_lesson(text, int, boolean) from anon;
grant execute on function complete_lesson(text, int, boolean) to authenticated;
