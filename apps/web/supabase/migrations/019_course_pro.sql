-- Migration 019: Pro-only courses
-- Adds a per-course Pro lock (separate from career-path is_pro). Used for the
-- advanced daily tracks (AI Skills, MCP, Advanced AI) that should be available
-- to Pro members only. Free users see them in the grid with a Pro badge but
-- are sent to /upgrade when they try to open one.
-- Run this in Supabase SQL Editor (safe to re-run).

alter table courses add column if not exists is_pro boolean not null default false;

comment on column courses.is_pro is
  'When true, only Pro (or admin) users can open the course; Free users are sent to /upgrade.';
