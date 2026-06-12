-- ── 016  persist the chosen Riri avatar ──────────────────────────────────────
-- The avatar picked in Settings lived only in localStorage (per-device, invisible
-- to others). Store it on the profile so it shows everywhere — sidebar, profile,
-- leaderboard — and follows the user across devices.

alter table profiles add column if not exists avatar_key text;

-- get_leaderboard must return avatar_key too. Adding an OUT column changes the
-- function signature, so drop + recreate (then re-apply the 015 grants).
drop function if exists get_leaderboard(int);
create or replace function get_leaderboard(limit_count int default 50)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  avatar_key text,
  xp int,
  level int,
  streak_current int,
  rank bigint
) language sql security definer as $$
  select
    gs.user_id,
    p.display_name,
    p.avatar_url,
    p.avatar_key,
    gs.xp,
    gs.level,
    gs.streak_current,
    row_number() over (order by gs.xp desc) as rank
  from game_state gs
  join profiles p on p.id = gs.user_id
  order by gs.xp desc
  limit limit_count;
$$;

revoke execute on function get_leaderboard(int) from public;
revoke execute on function get_leaderboard(int) from anon;
grant execute on function get_leaderboard(int) to authenticated;
