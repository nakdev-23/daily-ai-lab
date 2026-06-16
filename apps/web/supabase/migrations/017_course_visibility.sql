-- Migration 017: per-course visibility in Daily Learn
-- Some courses (e.g. the media tracks: Suno music, Runway video, Midjourney
-- image) are meant to be reached THROUGH a career path, not browsed as a
-- standalone daily topic. This flag lets an admin choose: show in the
-- /daily-learn topic grid, or keep it path-only.
-- Run this in Supabase SQL Editor (safe to re-run).

alter table courses add column if not exists show_in_daily boolean not null default true;

comment on column courses.show_in_daily is
  'When false, the course is hidden from the Daily Learn topic grid but still usable inside career-path lessons.';
