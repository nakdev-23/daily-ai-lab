-- Migration 008: system settings (real data for the admin System page)
-- A single-row table holding platform-wide defaults the admin can edit.
-- Run this in Supabase SQL Editor (safe to re-run).

create table if not exists system_settings (
  id                  int primary key default 1,
  daily_goal_minutes  int     not null default 15,
  hearts_per_round    int     not null default 5,
  xp_per_lesson       int     not null default 10,
  xp_perfect_quiz     int     not null default 15,
  pro_price_month     int     not null default 199,
  pro_price_year      int     not null default 1990,
  notify_streak       boolean not null default true,
  notify_weekly       boolean not null default true,
  maintenance_mode    boolean not null default false,
  updated_at          timestamptz not null default now(),
  constraint system_settings_single_row check (id = 1)
);

-- Seed the single row.
insert into system_settings (id) values (1) on conflict (id) do nothing;

alter table system_settings enable row level security;

-- Settings are non-secret platform config: any signed-in user may read them
-- (e.g. to show the live Pro price); only admins may change them.
drop policy if exists "anyone can read system settings" on system_settings;
create policy "anyone can read system settings"
  on system_settings for select using (true);

drop policy if exists "admins manage system settings" on system_settings;
create policy "admins manage system settings"
  on system_settings for all
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));
