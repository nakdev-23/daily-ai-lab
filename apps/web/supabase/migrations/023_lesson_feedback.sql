-- Migration 023: Lesson feedback — collect a rating + optional comment per lesson
-- After finishing a lesson the learner can rate it (1–5) and leave a short note.
-- One row per (user, course, lesson); re-submitting overwrites the previous one
-- (upsert), so the table always holds each learner's latest opinion of a lesson.
-- Admins read everything (to spot weak lessons); learners only see their own.
-- Run this in Supabase SQL Editor (safe to re-run).

create table if not exists lesson_feedback (
  user_id    uuid not null references auth.users(id) on delete cascade,
  course_id  text not null,                          -- matches courses.slug / path key
  lesson_num int  not null,
  rating     int  not null check (rating between 1 and 5),
  comment    text check (comment is null or char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_num)
);

-- Browse feedback for a lesson (admin reporting) without scanning the whole table.
create index if not exists lesson_feedback_lesson_idx
  on lesson_feedback (course_id, lesson_num, created_at desc);

alter table lesson_feedback enable row level security;

-- Drop-then-create so the policy block is idempotent (CREATE POLICY has no
-- IF NOT EXISTS — a plain re-run would otherwise fail with "already exists").
drop policy if exists "users read own feedback"   on lesson_feedback;
drop policy if exists "users insert own feedback" on lesson_feedback;
drop policy if exists "users update own feedback" on lesson_feedback;
drop policy if exists "admins read all feedback"  on lesson_feedback;

-- Learners manage only their own feedback.
create policy "users read own feedback"   on lesson_feedback for select using (auth.uid() = user_id);
create policy "users insert own feedback" on lesson_feedback for insert with check (auth.uid() = user_id);
create policy "users update own feedback" on lesson_feedback for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Admins can read all feedback to find lessons that need work.
create policy "admins read all feedback" on lesson_feedback for select using (is_admin(auth.uid()));
