-- Daily AI Lab — Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  display_name text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

alter table profiles enable row level security;
create policy "users can read own profile" on profiles for select using (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);

-- Promote a user to admin (run manually):
--   update profiles set role = 'admin' where id = '<user-uuid>';
-- Helper to check admin without recursive RLS:
create or replace function is_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = uid and role = 'admin');
$$;

-- Admins can read every profile (e.g. for an admin users list).
create policy "admins can read all profiles" on profiles for select using (is_admin(auth.uid()));

-- ─────────────────────────────────────────────
-- AUDIT LOG
-- ─────────────────────────────────────────────
create table audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete set null,
  actor_name  text,
  action      text not null,            -- e.g. admin.view_dashboard, role.change, auth.login
  details     jsonb,
  ip          text,
  created_at  timestamptz default now()
);
create index audit_logs_created_idx on audit_logs (created_at desc);

alter table audit_logs enable row level security;
-- Only admins may read the audit trail.
create policy "admins can read audit logs" on audit_logs for select using (is_admin(auth.uid()));
-- Writes go through a security-definer function so any authenticated user can
-- append their own events without being able to read or tamper with others'.
create or replace function record_audit(p_action text, p_details jsonb default null, p_ip text default null)
returns void language plpgsql security definer as $$
begin
  insert into audit_logs (user_id, actor_name, action, details, ip)
  values (
    auth.uid(),
    (select display_name from profiles where id = auth.uid()),
    p_action,
    p_details,
    p_ip
  );
end;
$$;

-- ─────────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────────
create table subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  plan            text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id    text,
  stripe_subscription_id text,
  expires_at      timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table subscriptions enable row level security;
create policy "users can read own subscription" on subscriptions for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- GAME STATE
-- ─────────────────────────────────────────────
create table game_state (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  xp                int not null default 0,
  level             int not null default 1,
  hearts            int not null default 5,
  hearts_last_lost_at timestamptz,
  streak_current    int not null default 0,
  streak_longest    int not null default 0,
  streak_last_date  date,
  streak_freeze_count int not null default 0,
  lessons_today     int not null default 0,
  lessons_today_date date,
  updated_at        timestamptz default now()
);

alter table game_state enable row level security;
create policy "users can read own game state" on game_state for select using (auth.uid() = user_id);
create policy "users can update own game state" on game_state for update using (auth.uid() = user_id);
create policy "users can insert own game state" on game_state for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- COURSES (admin-managed)
-- ─────────────────────────────────────────────
create table courses (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique,  -- human-readable ID used in URLs and content files (e.g. "chatgpt-basic")
  title       text not null,
  description text default '',
  tool        text not null default 'ChatGPT',
  level       text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  status      text not null default 'draft' check (status in ('published', 'draft', 'queued')),
  units       int not null default 0,
  lessons     int not null default 0,
  order_index int not null default 99,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table courses enable row level security;
create policy "anyone can read published courses" on courses for select using (status = 'published' or is_admin(auth.uid()));
create policy "admins manage courses" on courses for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Units (chapters) within a course, and the lessons inside each unit.
create table course_units (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid references courses(id) on delete cascade,
  title       text not null,
  order_index int not null default 0,
  created_at  timestamptz default now()
);
create table course_lessons (
  id          uuid primary key default uuid_generate_v4(),
  unit_id     uuid references course_units(id) on delete cascade,
  title       text not null,
  kind        text not null default 'lesson' check (kind in ('lesson', 'quiz', 'check', 'project')),
  xp          int not null default 10,
  order_index int not null default 0,
  created_at  timestamptz default now()
);
alter table course_units enable row level security;
alter table course_lessons enable row level security;
create policy "anyone can read course units" on course_units for select using (true);
create policy "anyone can read course lessons" on course_lessons for select using (true);
create policy "admins manage course units" on course_units for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "admins manage course lessons" on course_lessons for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- ─────────────────────────────────────────────
-- LEAGUES (admin-managed divisions)
-- ─────────────────────────────────────────────
create table leagues (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  xp_range    text not null default '0+ XP',
  min_xp      int not null default 0,
  order_index int not null default 0
);
alter table leagues enable row level security;
create policy "anyone can read leagues" on leagues for select using (true);
create policy "admins manage leagues" on leagues for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- ─────────────────────────────────────────────
-- LESSONS
-- ─────────────────────────────────────────────
create table lessons (
  id          text primary key,  -- e.g. "chatgpt/beginner/01-what-is-chatgpt"
  tool        text not null,     -- chatgpt, claude, gemini, ...
  path        text,              -- coding, video, music, ... (null = tool lesson)
  level       text not null check (level in ('beginner', 'intermediate', 'advanced')),
  order_index int not null,
  title       text not null,
  estimated_minutes int not null default 5,
  xp_reward   int not null default 10,
  published   boolean not null default false,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- USER PROGRESS
-- ─────────────────────────────────────────────
create table user_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  lesson_id     text references lessons(id),
  completed     boolean not null default false,
  completed_at  timestamptz,
  quiz_score    int,        -- 0-100
  attempts      int not null default 0,
  unique (user_id, lesson_id)
);

alter table user_progress enable row level security;
create policy "users can manage own progress" on user_progress for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- COURSE PROGRESS (file-based lesson system)
-- Tracks how many lessons a user has completed per course, keyed by slug.
-- No FK to lessons table — avoids constraint issues with file-based content.
-- ─────────────────────────────────────────────
create table course_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  course_id    text not null,  -- matches courses.slug, e.g. "chatgpt-basic"
  lessons_done int  not null default 0,
  updated_at   timestamptz default now(),
  primary key  (user_id, course_id)
);

alter table course_progress enable row level security;
create policy "users can read own course progress"   on course_progress for select using (auth.uid() = user_id);
create policy "users can upsert own course progress" on course_progress for insert with check (auth.uid() = user_id);
create policy "users can update own course progress" on course_progress for update using (auth.uid() = user_id);

-- Atomic lesson completion: marks progress and awards XP / streak / daily
-- counter in one transaction. See migrations/003_complete_lesson.sql for the
-- canonical definition (kept in sync here for reference).
-- complete_lesson(p_course_id text, p_lesson_num int, p_xp int) returns boolean

-- ─────────────────────────────────────────────
-- BADGES
-- ─────────────────────────────────────────────
create table badges (
  id          text primary key,  -- e.g. "streak-7"
  name        text not null,
  description text,
  icon        text,
  xp_bonus    int not null default 0
);
alter table badges enable row level security;
create policy "anyone can read badges" on badges for select using (true);
create policy "admins manage badges" on badges for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

create table user_badges (
  user_id     uuid references auth.users(id) on delete cascade,
  badge_id    text references badges(id),
  earned_at   timestamptz default now(),
  primary key (user_id, badge_id)
);

alter table user_badges enable row level security;
create policy "users can read own badges" on user_badges for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- LEADERBOARD (materialized via function)
-- ─────────────────────────────────────────────
create or replace function get_leaderboard(limit_count int default 50)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  xp int,
  level int,
  streak_current int,
  rank bigint
) language sql security definer as $$
  select
    gs.user_id,
    p.display_name,
    p.avatar_url,
    gs.xp,
    gs.level,
    gs.streak_current,
    row_number() over (order by gs.xp desc) as rank
  from game_state gs
  join profiles p on p.id = gs.user_id
  order by gs.xp desc
  limit limit_count;
$$;

-- ─────────────────────────────────────────────
-- TRIGGER: auto-create profile + game_state on signup
-- ─────────────────────────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into game_state (user_id)
  values (new.id);

  insert into subscriptions (user_id, plan)
  values (new.id, 'free');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
