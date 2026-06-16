-- ── 012  career path: AI for Teacher ─────────────────────────────────────────
-- Practical path for educators: planning, materials, grading, communication.
-- Built on published courses (chatgpt-basic, claude-basic, gemini-basic) plus
-- claude-cowork for classroom communication. Idempotent via the slug guard.

do $seed$
declare
  _tc uuid; _tc1 uuid; _tc2 uuid; _tc3 uuid; _tc4 uuid; _tc5 uuid;
begin

if not exists (select 1 from career_paths where slug = 'ai-for-teacher') then

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'ai-for-teacher',
    'AI for Teacher',
    'For educators',
    'ใช้ AI ช่วยสอนครบวงจร ตั้งแต่วางแผนบทเรียน ทำสื่อการสอน ออกข้อสอบ ไปจนถึงตรวจงานและสรุป',
    'mint',
    ARRAY['ChatGPT','Claude','Gemini'],
    5, true, true, 6
  ) returning id into _tc;

  insert into path_modules (path_id, title, order_index) values
    (_tc, 'Module 1 · AI Teaching Basics', 1) returning id into _tc1;
  insert into path_modules (path_id, title, order_index) values
    (_tc, 'Module 2 · Lesson Planning & Materials', 2) returning id into _tc2;
  insert into path_modules (path_id, title, order_index) values
    (_tc, 'Module 3 · Grading & Feedback', 3) returning id into _tc3;
  insert into path_modules (path_id, title, order_index) values
    (_tc, 'Module 4 · Classroom Communication', 4) returning id into _tc4;
  insert into path_modules (path_id, title, order_index) values
    (_tc, 'Module 5 · Research, Differentiation & Certificate', 5) returning id into _tc5;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_tc1, 'Meet AI, your teaching assistant',     'lesson',     'chatgpt-basic', 1, 10, 1),
    (_tc1, 'Write clear prompts for the classroom','lesson',     'chatgpt-basic', 2, 10, 2),
    (_tc1, 'Set tone for students vs. parents',    'lesson',     'chatgpt-basic', 3, 10, 3),
    (_tc1, 'Give AI context about your class',     'lesson',     'chatgpt-basic', 4, 10, 4),
    (_tc1, 'Checkpoint: your first lesson helper', 'checkpoint', 'chatgpt-basic', 5, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_tc2, 'Draft a full lesson plan in minutes', 'lesson',  'chatgpt-basic', 6,  10, 1),
    (_tc2, 'Create worksheets and exercises',     'lesson',  'chatgpt-basic', 7,  10, 2),
    (_tc2, 'Generate quizzes and answer keys',    'lesson',  'chatgpt-basic', 8,  10, 3),
    (_tc2, 'Adapt materials for any grade level', 'lesson',  'chatgpt-basic', 9,  10, 4),
    (_tc2, 'Project: a full week of lesson plans','project', 'chatgpt-basic', 10, 40, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_tc3, 'Build clear grading rubrics',         'lesson',     'claude-basic', 1, 10, 1),
    (_tc3, 'Give kind, specific feedback fast',   'lesson',     'claude-basic', 2, 10, 2),
    (_tc3, 'Summarise student work',              'lesson',     'claude-basic', 3, 10, 3),
    (_tc3, 'Spot common mistakes across a class', 'lesson',     'claude-basic', 4, 10, 4),
    (_tc3, 'Draft report-card comments',          'lesson',     'claude-basic', 5, 10, 5),
    (_tc3, 'Checkpoint: grade a set with AI',     'checkpoint', 'claude-basic', 6, 30, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_tc4, 'Write parent emails for any situation','lesson',  'claude-cowork', 1, 10, 1),
    (_tc4, 'Class newsletters and announcements',  'lesson',  'claude-cowork', 2, 10, 2),
    (_tc4, 'Behaviour and progress updates',       'lesson',  'claude-cowork', 3, 10, 3),
    (_tc4, 'Permission slips and handouts',        'lesson',  'claude-cowork', 4, 10, 4),
    (_tc4, 'Project: parent communication kit',    'project', 'claude-cowork', 5, 40, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_tc5, 'Research any topic you teach',         'lesson', 'gemini-basic', 1, 15, 1),
    (_tc5, 'Find examples, analogies and visuals', 'lesson', 'gemini-basic', 2, 15, 2),
    (_tc5, 'Differentiate for every learner',      'lesson', 'gemini-basic', 3, 15, 3),
    (_tc5, 'Build inclusive, accessible materials','lesson', 'gemini-basic', 4, 15, 4),
    (_tc5, 'Quiz: AI teaching strategies',         'quiz',   'gemini-basic', 5, 20, 5),
    (_tc5, 'Final exam: AI for Teachers',          'quiz',   'gemini-basic', 6, 50, 6);

end if;

end $seed$;
