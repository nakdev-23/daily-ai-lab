-- Migration 004: seed course_units + course_lessons for all 12 courses
-- The app now reads course content from Supabase only (mock data removed).
-- Safe to run twice: upserts keyed by (course, order_index).
-- Requires migration 002 (courses seeded with slugs).

-- Unique keys so the seed is idempotent
create unique index if not exists course_units_course_order_idx on course_units (course_id, order_index);
create unique index if not exists course_lessons_unit_order_idx on course_lessons (unit_id, order_index);

-- Helper pattern, per course:
--   1) insert units (course looked up by slug)
--   2) insert lessons (unit looked up by course slug + unit order)

-- ═══ chatgpt-basic ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('รู้จัก ChatGPT', 1), ('เขียน Prompt พื้นฐาน', 2), ('ความสามารถของ ChatGPT', 3), ('Memory และ Custom', 4), ('Tips & Tricks', 5)
) as v(title, ord) where c.slug = 'chatgpt-basic'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'ChatGPT คืออะไร', 'lesson', 10, 1), (1, 'UI และการเริ่มต้นใช้งาน', 'lesson', 10, 2), (1, 'Models ต่างๆ (GPT-3.5 vs GPT-4o)', 'quiz', 15, 3),
  (2, 'Prompt คืออะไร', 'lesson', 10, 1), (2, 'ให้บทบาท (Role Prompting)', 'lesson', 10, 2), (2, 'บอกรูปแบบผลลัพธ์', 'quiz', 15, 3),
  (3, 'เขียนเนื้อหาและบทความ', 'lesson', 10, 1), (3, 'แปลภาษาและสรุปข้อความ', 'lesson', 10, 2), (3, 'ช่วยคิดและระดมสมอง', 'check', 20, 3),
  (4, 'Memory คืออะไร', 'lesson', 10, 1), (4, 'Custom Instructions', 'lesson', 10, 2), (4, 'Custom GPTs เบื้องต้น', 'quiz', 15, 3),
  (5, 'Iterate และ Refine', 'lesson', 10, 1), (5, 'ข้อจำกัดและ Hallucination', 'lesson', 10, 2), (5, 'เช็คพอยต์สุดท้าย', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'chatgpt-basic' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ chatgpt-advanced ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Advanced Prompting', 1), ('Code Interpreter & Data', 2), ('Tools & Integrations', 3), ('GPTs & Operators', 4), ('Productivity Workflows', 5)
) as v(title, ord) where c.slug = 'chatgpt-advanced'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Chain of Thought Prompting', 'lesson', 15, 1), (1, 'Few-shot Prompting', 'lesson', 15, 2), (1, 'System Instructions', 'quiz', 20, 3),
  (2, 'Code Interpreter คืออะไร', 'lesson', 15, 1), (2, 'วิเคราะห์ข้อมูลด้วย Python', 'lesson', 15, 2), (2, 'สร้างกราฟและ Visualization', 'check', 20, 3),
  (3, 'DALL·E ใน ChatGPT', 'lesson', 15, 1), (3, 'Web Search & Browsing', 'lesson', 15, 2), (3, 'File Upload & Analysis', 'quiz', 20, 3),
  (4, 'สร้าง Custom GPT', 'lesson', 15, 1), (4, 'Actions & API Integration', 'lesson', 15, 2), (4, 'ChatGPT Team & Enterprise', 'quiz', 20, 3),
  (5, 'ChatGPT + Zapier', 'lesson', 15, 1), (5, 'ChatGPT Voice Mode', 'lesson', 15, 2), (5, 'Canvas & Document Editing', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'chatgpt-advanced' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ codex-basic ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('รู้จัก Codex', 1), ('ใช้งาน Codex App', 2), ('Coding Workflows', 3), ('Advanced Features', 4)
) as v(title, ord) where c.slug = 'codex-basic'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'OpenAI Codex คืออะไร', 'lesson', 10, 1), (1, 'Codex App vs ChatGPT', 'lesson', 10, 2), (1, 'Tasks & Environments', 'quiz', 15, 3),
  (2, 'สร้าง Task แรก', 'lesson', 10, 1), (2, 'Branch & Sandbox', 'lesson', 10, 2), (2, 'Review และ Approve', 'check', 20, 3),
  (3, 'Debug ด้วย Codex', 'lesson', 10, 1), (3, 'เขียน Test อัตโนมัติ', 'lesson', 10, 2), (3, 'Refactor โค้ด', 'quiz', 15, 3),
  (4, 'Parallel Tasks', 'lesson', 10, 1), (4, 'GitHub Integration', 'lesson', 10, 2), (4, 'Pricing & Best Practices', 'check', 25, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'codex-basic' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ codex-advanced ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Agent Workflows', 1), ('Integrations', 2), ('Prompt Patterns for Code', 3), ('Production & Safety', 4)
) as v(title, ord) where c.slug = 'codex-advanced'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Agentic Coding คืออะไร', 'lesson', 15, 1), (1, 'Complex Multi-step Tasks', 'lesson', 15, 2), (1, 'Environment Config', 'quiz', 20, 3),
  (2, 'API & Webhook Automation', 'lesson', 15, 1), (2, 'CI/CD Integration', 'lesson', 15, 2), (2, 'Database Tasks', 'check', 20, 3),
  (3, 'Spec-driven Development', 'lesson', 15, 1), (3, 'Test-driven Development', 'lesson', 15, 2), (3, 'Documentation Generation', 'quiz', 20, 3),
  (4, 'Code Review & Safety', 'lesson', 15, 1), (4, 'Rate Limits & Quotas', 'lesson', 15, 2), (4, 'Security Best Practices', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'codex-advanced' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-basic ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('รู้จัก Claude', 1), ('การสนทนากับ Claude', 2), ('Projects', 3), ('Artifacts & Canvas', 4), ('Plans & Everyday Use', 5)
) as v(title, ord) where c.slug = 'claude-basic'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Claude คืออะไร', 'lesson', 10, 1), (1, 'Claude Models (Haiku, Sonnet, Opus)', 'lesson', 10, 2), (1, 'เริ่มใช้ Claude.ai', 'quiz', 15, 3),
  (2, 'สไตล์การตอบของ Claude', 'lesson', 10, 1), (2, 'Long Context คืออะไร', 'lesson', 10, 2), (2, 'Upload Files & Documents', 'check', 20, 3),
  (3, 'Projects คืออะไร', 'lesson', 10, 1), (3, 'Project Knowledge', 'lesson', 10, 2), (3, 'ใช้ Projects สำหรับงาน', 'quiz', 15, 3),
  (4, 'Artifacts คืออะไร', 'lesson', 10, 1), (4, 'Code Artifacts', 'lesson', 10, 2), (4, 'Preview & Share', 'quiz', 15, 3),
  (5, 'Free vs Pro vs Team', 'lesson', 10, 1), (5, 'Mobile App', 'lesson', 10, 2), (5, 'เช็คพอยต์สุดท้าย', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-basic' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-advanced ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Extended Thinking', 1), ('API & Integration', 2), ('Advanced Prompting', 3), ('Workflows', 4), ('Enterprise', 5)
) as v(title, ord) where c.slug = 'claude-advanced'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Extended Thinking คืออะไร', 'lesson', 15, 1), (1, 'ปรับระดับ Thinking Budget', 'lesson', 15, 2), (1, 'เมื่อไหร่ควรใช้ Extended Thinking', 'quiz', 20, 3),
  (2, 'Anthropic API คืออะไร', 'lesson', 15, 1), (2, 'System Prompt', 'lesson', 15, 2), (2, 'Tool Use (Function Calling)', 'check', 20, 3),
  (3, 'XML Tags ใน Prompt', 'lesson', 15, 1), (3, 'Chain of Thought', 'lesson', 15, 2), (3, 'Constitutional AI', 'quiz', 20, 3),
  (4, 'Computer Use', 'lesson', 15, 1), (4, 'Batch Processing', 'lesson', 15, 2), (4, 'Streaming Responses', 'quiz', 20, 3),
  (5, 'Claude for Teams', 'lesson', 15, 1), (5, 'Privacy & Security', 'lesson', 15, 2), (5, 'Enterprise Integrations', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-advanced' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-code ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('เริ่มต้น Claude Code', 1), ('Core Commands', 2), ('Agentic Workflows', 3), ('MCP & Integrations', 4), ('Configuration', 5), ('Advanced Patterns', 6)
) as v(title, ord) where c.slug = 'claude-code'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Claude Code คืออะไร', 'lesson', 15, 1), (1, 'ติดตั้งและตั้งค่า', 'lesson', 15, 2), (1, 'การสนทนาแรก', 'quiz', 20, 3),
  (2, 'Read, Edit และ Write', 'lesson', 15, 1), (2, 'Bash และการรันคำสั่ง', 'lesson', 15, 2), (2, 'Search และ Glob', 'quiz', 20, 3),
  (3, 'Let Claude Code Run', 'lesson', 15, 1), (3, 'Todo และ Task Tracking', 'lesson', 15, 2), (3, 'Plan Mode', 'check', 20, 3),
  (4, 'MCP คืออะไร', 'lesson', 15, 1), (4, 'เพิ่ม MCP Server', 'lesson', 15, 2), (4, 'VS Code Integration', 'quiz', 20, 3),
  (5, 'CLAUDE.md', 'lesson', 15, 1), (5, 'Hooks', 'lesson', 15, 2), (5, 'Permissions & Settings', 'quiz', 20, 3),
  (6, 'Multi-agent Workflows', 'lesson', 15, 1), (6, 'Custom Slash Commands', 'lesson', 15, 2), (6, 'Best Practices', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-code' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-cowork ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('งานเอกสาร', 1), ('Communication', 2), ('Research & Analysis', 3), ('Productivity', 4)
) as v(title, ord) where c.slug = 'claude-cowork'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'สรุปและย่อเอกสาร', 'lesson', 10, 1), (1, 'เขียนรายงานและ Memo', 'lesson', 10, 2), (1, 'แปลเอกสาร', 'quiz', 15, 3),
  (2, 'เขียน Email', 'lesson', 10, 1), (2, 'Meeting Notes & สรุปประชุม', 'lesson', 10, 2), (2, 'Presentation Outline', 'check', 20, 3),
  (3, 'Research ด้วย Claude', 'lesson', 10, 1), (3, 'วิเคราะห์ข้อมูลและตัวเลข', 'lesson', 10, 2), (3, 'Pro & Con Analysis', 'quiz', 15, 3),
  (4, 'To-do & Project Planning', 'lesson', 10, 1), (4, 'Claude + Notion/Google Docs', 'lesson', 10, 2), (4, 'Templates & Reusable Prompts', 'check', 25, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-cowork' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-design ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Claude กับ Design', 1), ('UX & Copy', 2), ('Visual & Brand', 3), ('Workflow', 4)
) as v(title, ord) where c.slug = 'claude-design'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'AI ในกระบวนการออกแบบ', 'lesson', 10, 1), (1, 'Design Brief & Creative Brief', 'lesson', 10, 2), (1, 'Mood Board และ Reference', 'quiz', 15, 3),
  (2, 'UX Copy คืออะไร', 'lesson', 10, 1), (2, 'Error Messages และ Microcopy', 'lesson', 10, 2), (2, 'Onboarding Copy', 'check', 20, 3),
  (3, 'Color Palette ด้วย AI', 'lesson', 10, 1), (3, 'Brand Voice & Tone', 'lesson', 10, 2), (3, 'Design System Documentation', 'quiz', 15, 3),
  (4, 'Figma + Claude', 'lesson', 10, 1), (4, 'Design Feedback & Critique', 'lesson', 10, 2), (4, 'Handoff to Development', 'check', 25, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-design' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ claude-other ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Education', 1), ('Creative Writing', 2), ('Research Tools', 3), ('Specialized Uses', 4)
) as v(title, ord) where c.slug = 'claude-other'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Claude สำหรับนักเรียน', 'lesson', 10, 1), (1, 'Tutor Mode', 'lesson', 10, 2), (1, 'สรุปและทบทวนบทเรียน', 'quiz', 15, 3),
  (2, 'นิยาย เรื่องสั้น กวีนิพนธ์', 'lesson', 10, 1), (2, 'Dialogue & Characters', 'lesson', 10, 2), (2, 'World Building', 'check', 20, 3),
  (3, 'Claude สำหรับงานวิจัย', 'lesson', 10, 1), (3, 'Literature Review', 'lesson', 10, 2), (3, 'Citation & Bibliography', 'quiz', 15, 3),
  (4, 'Legal & Compliance', 'lesson', 10, 1), (4, 'Claude for Healthcare', 'lesson', 10, 2), (4, 'Future of Claude', 'check', 25, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'claude-other' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ gemini-basic ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('รู้จัก Gemini', 1), ('Multimodal', 2), ('Google Integration', 3), ('Gems', 4), ('Everyday Use', 5)
) as v(title, ord) where c.slug = 'gemini-basic'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Gemini คืออะไร', 'lesson', 10, 1), (1, 'Gemini Models (Flash, Pro, Ultra)', 'lesson', 10, 2), (1, 'เริ่มใช้ Gemini.google.com', 'quiz', 15, 3),
  (2, 'อัปโหลดรูปภาพ', 'lesson', 10, 1), (2, 'วิเคราะห์ไฟล์ PDF', 'lesson', 10, 2), (2, 'Voice & Video', 'check', 20, 3),
  (3, 'Gemini ใน Gmail', 'lesson', 10, 1), (3, 'Gemini ใน Google Docs', 'lesson', 10, 2), (3, 'Gemini ใน Google Drive', 'quiz', 15, 3),
  (4, 'Gems คืออะไร', 'lesson', 10, 1), (4, 'สร้าง Gem', 'lesson', 10, 2), (4, 'แชร์ Gems', 'quiz', 15, 3),
  (5, 'Search + Gemini', 'lesson', 10, 1), (5, 'Gemini Mobile App', 'lesson', 10, 2), (5, 'เช็คพอยต์สุดท้าย', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'gemini-basic' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;

-- ═══ gemini-advanced ═══
insert into course_units (course_id, title, order_index)
select c.id, v.title, v.ord from courses c, (values
  ('Deep Research', 1), ('Advanced AI Features', 2), ('Creative Tools', 3), ('API & Development', 4), ('Workspace Advanced', 5)
) as v(title, ord) where c.slug = 'gemini-advanced'
on conflict (course_id, order_index) do update set title = excluded.title;

insert into course_lessons (unit_id, title, kind, xp, order_index)
select u.id, v.title, v.kind, v.xp, v.ord
from course_units u join courses c on c.id = u.course_id, (values
  (1, 'Deep Research คืออะไร', 'lesson', 15, 1), (1, 'Research Reports', 'lesson', 15, 2), (1, 'NotebookLM', 'quiz', 20, 3),
  (2, 'Thinking Mode', 'lesson', 15, 1), (2, '1M Context Window', 'lesson', 15, 2), (2, 'Gemini Flash Thinking', 'check', 20, 3),
  (3, 'Imagen ใน Gemini', 'lesson', 15, 1), (3, 'Veo สร้างวิดีโอ', 'lesson', 15, 2), (3, 'Music AI Sandbox', 'quiz', 20, 3),
  (4, 'Gemini API', 'lesson', 15, 1), (4, 'Google AI Studio', 'lesson', 15, 2), (4, 'Vertex AI', 'quiz', 20, 3),
  (5, 'Duet AI ใน Workspace', 'lesson', 15, 1), (5, 'Smart Features', 'lesson', 15, 2), (5, 'Gemini Enterprise', 'check', 30, 3)
) as v(uord, title, kind, xp, ord)
where c.slug = 'gemini-advanced' and u.order_index = v.uord
on conflict (unit_id, order_index) do update set title = excluded.title, kind = excluded.kind, xp = excluded.xp;
