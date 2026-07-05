-- Migration 041: seed the "เลือก AI ให้ถูกงาน" mini-courses.
-- Each topic is its own SHORT, beginner, single-lesson daily course (pick any,
-- no fixed order). Lesson content lives in content/lessons/<slug>/01.json.
-- show_in_daily = true, is_pro = false. Idempotent (safe to re-run).
-- Run AFTER migration 017 (adds show_in_daily). Replaces an earlier combined
-- "choose-ai" course — that row is removed below if it exists.

-- Drop the old combined course if a previous version of this migration ran.
delete from courses where slug = 'choose-ai';

-- ═══ the 8 mini-courses ═══
insert into courses (slug, title, description, tool, level, status, units, lessons, order_index, show_in_daily, is_pro)
values
  ('choose-ai-overview', 'AI ตัวไหนทำอะไรได้บ้าง', 'แผนที่รวม: งานแบบไหน ควรใช้ AI ตัวไหน — รู้ภาพรวมใน 1 บทสั้น ๆ', 'AI', 'beginner', 'published', 1, 1, 1, true, false),
  ('choose-ai-image', 'สร้างรูปด้วย AI ใช้ตัวไหนดี', 'ChatGPT vs Gemini vs Midjourney — ใครเก่งอะไร ต่างกันยังไง ราคาเท่าไร ลองเองได้', 'AI', 'beginner', 'published', 1, 1, 2, true, false),
  ('choose-ai-write', 'เขียนงานด้วย AI ใช้ตัวไหนดี', 'ChatGPT vs Claude vs Gemini สำหรับงานเขียน ร่างเอกสาร และอีเมล', 'AI', 'beginner', 'published', 1, 1, 3, true, false),
  ('choose-ai-research', 'ค้นข้อมูลด้วย AI ใช้ตัวไหนดี', 'Perplexity vs Gemini vs ChatGPT สำหรับค้นข้อมูลและสรุปเว็บพร้อมแหล่งอ้างอิง', 'AI', 'beginner', 'published', 1, 1, 4, true, false),
  ('choose-ai-video', 'ทำวิดีโอด้วย AI ใช้ตัวไหนดี', 'Runway vs Google Veo และเพื่อน ๆ — สร้างคลิปสั้นจากข้อความและภาพ', 'AI', 'beginner', 'published', 1, 1, 5, true, false),
  ('choose-ai-music', 'ทำเพลงด้วย AI ใช้ตัวไหนดี', 'Suno และ Udio — แต่งเพลงพร้อมร้องจากข้อความ ใช้ตัวไหนเริ่มดี', 'AI', 'beginner', 'published', 1, 1, 6, true, false),
  ('choose-ai-code', 'เขียนโค้ดด้วย AI ใช้ตัวไหนดี', 'Claude Code vs Codex vs GitHub Copilot — ผู้ช่วยเขียนโค้ดตัวไหนเหมาะกับใคร', 'AI', 'beginner', 'published', 1, 1, 7, true, false),
  ('choose-ai-pricing', 'AI ตัวไหนคุ้ม ฟรีหรือเสียเงิน', 'สรุปราคาคร่าว ๆ ของแต่ละตัว และใครควรจ่าย ใครใช้ฟรีพอ', 'AI', 'beginner', 'published', 1, 1, 8, true, false)
on conflict (slug) do update set
  title = excluded.title, description = excluded.description, tool = excluded.tool,
  level = excluded.level, status = 'published', units = 1, lessons = 1,
  order_index = excluded.order_index, show_in_daily = true, is_pro = false;

-- ═══ one unit per course ═══
insert into course_units (course_id, title, order_index)
select c.id, 'เปรียบเทียบและลองเอง', 1
from courses c
where c.slug in (
  'choose-ai-overview','choose-ai-image','choose-ai-write','choose-ai-research',
  'choose-ai-video','choose-ai-music','choose-ai-code','choose-ai-pricing'
)
on conflict (course_id, order_index) do update set title = excluded.title;

-- ═══ one lesson per course (content = that slug's 01.json) ═══
insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, 'lesson', 10, 1
from course_units u
join courses c on c.id = u.course_id
join (values
  ('choose-ai-overview', 'AI ตัวไหนทำอะไรได้บ้าง'),
  ('choose-ai-image',    'สร้างรูปด้วย AI'),
  ('choose-ai-write',    'เขียนงานด้วย AI'),
  ('choose-ai-research', 'ค้นข้อมูลด้วย AI'),
  ('choose-ai-video',    'ทำวิดีโอด้วย AI'),
  ('choose-ai-music',    'ทำเพลงด้วย AI'),
  ('choose-ai-code',     'เขียนโค้ดด้วย AI'),
  ('choose-ai-pricing',  'AI ตัวไหนคุ้ม ฟรีหรือเสียเงิน')
) as v(slug, title) on v.slug = c.slug
where u.order_index = 1
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;
