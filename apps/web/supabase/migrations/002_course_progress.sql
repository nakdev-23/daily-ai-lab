-- Migration 002: file-based lesson progress system
-- Run this in Supabase SQL Editor

-- 1. Add slug column to courses (unique human-readable ID used in URLs and content files)
alter table courses add column if not exists slug text;
create unique index if not exists courses_slug_idx on courses (slug);

-- 2. Seed the 12 courses (upsert by slug so running twice is safe)
insert into courses (slug, title, description, tool, level, status, units, lessons, order_index)
values
  ('chatgpt-basic',    'ChatGPT พื้นฐาน',  'รู้จัก ChatGPT และเขียนพรอมป์แรก',            'ChatGPT', 'beginner',     'published', 5, 15,  1),
  ('chatgpt-advanced', 'ChatGPT Advance',   'เทคนิคขั้นสูง Code Interpreter และ Custom GPT', 'ChatGPT', 'advanced',     'queued',    5, 15,  2),
  ('codex-basic',      'Codex พื้นฐาน',    'ใช้ Codex ช่วยเขียนโค้ดและ debug',             'Codex',   'beginner',     'queued',    4, 12,  3),
  ('codex-advanced',   'Codex Advance',     'Agentic coding และ CI/CD integration',          'Codex',   'advanced',     'queued',    4, 12,  4),
  ('claude-basic',     'Claude พื้นฐาน',   'รู้จัก Claude Projects และ Files',              'Claude',  'beginner',     'published', 5, 15,  5),
  ('claude-advanced',  'Claude Advance',    'Extended Thinking, API และ Tool Use',            'Claude',  'advanced',     'queued',    5, 15,  6),
  ('claude-code',      'Claude Code',       'CLI tool สำหรับ developer',                     'Claude',  'advanced',     'queued',    6, 18,  7),
  ('claude-cowork',    'Claude Cowork',     'Claude สำหรับงานเอกสารและสื่อสาร',              'Claude',  'intermediate', 'queued',    4, 12,  8),
  ('claude-design',    'Claude Design',     'AI ในกระบวนการออกแบบและ UX',                    'Claude',  'intermediate', 'queued',    4, 12,  9),
  ('claude-other',     'Claude อื่นๆ',      'Education, Creative Writing และฟีเจอร์พิเศษ',   'Claude',  'intermediate', 'queued',    4, 12, 10),
  ('gemini-basic',     'Gemini พื้นฐาน',   'Gemini กับ Google และ Multimodal AI',            'Gemini',  'beginner',     'published', 5, 15, 11),
  ('gemini-advanced',  'Gemini Advance',    'Deep Research, Imagen และ Gemini API',           'Gemini',  'advanced',     'queued',    5, 15, 12)
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  tool        = excluded.tool,
  level       = excluded.level,
  status      = excluded.status,
  units       = excluded.units,
  lessons     = excluded.lessons,
  order_index = excluded.order_index,
  updated_at  = now();

-- 3. New course_progress table — tracks lessons completed per user per course
--    Replaces the old user_progress FK pattern for the file-based lesson system.
create table if not exists course_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  course_id    text not null,  -- matches courses.slug, e.g. "chatgpt-basic"
  lessons_done int  not null default 0,
  updated_at   timestamptz default now(),
  primary key  (user_id, course_id)
);

alter table course_progress enable row level security;

create policy "users can read own course progress"
  on course_progress for select using (auth.uid() = user_id);

create policy "users can upsert own course progress"
  on course_progress for insert with check (auth.uid() = user_id);

create policy "users can update own course progress"
  on course_progress for update using (auth.uid() = user_id);
