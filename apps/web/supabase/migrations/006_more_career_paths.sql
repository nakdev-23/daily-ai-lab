-- ── 006  additional career paths ─────────────────────────────────────────────

do $seed$
declare
  -- AI Content Creator
  _cc uuid; _cc1 uuid; _cc2 uuid; _cc3 uuid; _cc4 uuid; _cc5 uuid;
  -- AI for Marketing
  _mk uuid; _mk1 uuid; _mk2 uuid; _mk3 uuid; _mk4 uuid;
  -- AI for Business
  _bz uuid; _bz1 uuid; _bz2 uuid; _bz3 uuid; _bz4 uuid;
  -- AI Developer
  _dv uuid; _dv1 uuid; _dv2 uuid; _dv3 uuid; _dv4 uuid; _dv5 uuid;
begin

-- ────────────────────────────────────────────────────────────────────────────
-- 1. AI Content Creator
-- ────────────────────────────────────────────────────────────────────────────
if not exists (select 1 from career_paths where slug = 'ai-content-creator') then

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'ai-content-creator',
    'AI Content Creator',
    'Beginner friendly',
    'สร้างคอนเทนต์ครบวงจรด้วย AI ตั้งแต่เขียนและคิดคอนเซปต์ ไปจนถึงงานภาพและดีไซน์',
    'pink',
    ARRAY['ChatGPT','Claude'],
    6, false, true, 2
  ) returning id into _cc;

  insert into path_modules (path_id, title, order_index) values
    (_cc, 'Module 1 · Writing Foundations', 1) returning id into _cc1;
  insert into path_modules (path_id, title, order_index) values
    (_cc, 'Module 2 · Creative Prompting', 2) returning id into _cc2;
  insert into path_modules (path_id, title, order_index) values
    (_cc, 'Module 3 · Long-form & Strategy', 3) returning id into _cc3;
  insert into path_modules (path_id, title, order_index) values
    (_cc, 'Module 4 · Visual Content Design', 4) returning id into _cc4;
  insert into path_modules (path_id, title, order_index) values
    (_cc, 'Module 5 · Final Project & Certificate', 5) returning id into _cc5;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_cc1, 'How AI writes like a human',       'lesson',     'chatgpt-basic', 1, 10, 1),
    (_cc1, 'Give ChatGPT a writing persona',   'lesson',     'chatgpt-basic', 2, 10, 2),
    (_cc1, 'Set tone, style and audience',     'lesson',     'chatgpt-basic', 3, 10, 3),
    (_cc1, 'Add context for better results',   'lesson',     'chatgpt-basic', 4, 10, 4),
    (_cc1, 'Checkpoint: write your first post','checkpoint', 'chatgpt-basic', 5, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_cc2, 'Teach with examples (few-shot)',   'lesson',  'chatgpt-basic', 6,  10, 1),
    (_cc2, 'Structure ideas step by step',     'lesson',  'chatgpt-basic', 7,  10, 2),
    (_cc2, 'Control length and format',        'lesson',  'chatgpt-basic', 8,  10, 3),
    (_cc2, 'Build reusable content templates', 'lesson',  'chatgpt-basic', 9,  10, 4),
    (_cc2, 'Project: content template library','project', 'chatgpt-basic', 10, 35, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_cc3, 'Write full articles with AI',      'lesson',     'chatgpt-basic', 11, 10, 1),
    (_cc3, 'Research and fact-check fast',     'lesson',     'chatgpt-basic', 12, 10, 2),
    (_cc3, 'Turn data into stories',           'lesson',     'chatgpt-basic', 13, 10, 3),
    (_cc3, 'Quiz: content strategy',           'quiz',       'chatgpt-basic', 14, 20, 4),
    (_cc3, 'Checkpoint: 30-day content plan',  'checkpoint', 'chatgpt-basic', 15, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_cc4, 'Design thinking with AI',          'lesson',  'claude-design', 1, 10, 1),
    (_cc4, 'Layout and visual structure',      'lesson',  'claude-design', 2, 10, 2),
    (_cc4, 'Colour, typography and brand',     'lesson',  'claude-design', 3, 10, 3),
    (_cc4, 'Visual storytelling',              'lesson',  'claude-design', 4, 10, 4),
    (_cc4, 'Brand consistency across formats', 'lesson',  'claude-design', 5, 10, 5),
    (_cc4, 'Project: visual identity kit',     'project', 'claude-design', 6, 40, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_cc5, 'Cross-platform content systems',   'lesson', 'claude-other', 1, 15, 1),
    (_cc5, 'Automate your content pipeline',   'lesson', 'claude-other', 2, 15, 2),
    (_cc5, 'Final project: content portfolio', 'quiz',   'claude-other', 3, 50, 3);

end if;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. AI for Marketing
-- ────────────────────────────────────────────────────────────────────────────
if not exists (select 1 from career_paths where slug = 'ai-for-marketing') then

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'ai-for-marketing',
    'AI for Marketing',
    'For marketers',
    'ทำการตลาดให้เร็วและคมด้วย AI ตั้งแต่เขียนคำโฆษณา วางแคมเปญ ไปจนถึงรีเสิร์ชและวิเคราะห์ข้อมูล',
    'sun',
    ARRAY['ChatGPT','Gemini','Claude'],
    4, true, true, 3
  ) returning id into _mk;

  insert into path_modules (path_id, title, order_index) values
    (_mk, 'Module 1 · Marketing Copy', 1) returning id into _mk1;
  insert into path_modules (path_id, title, order_index) values
    (_mk, 'Module 2 · Campaign Strategy', 2) returning id into _mk2;
  insert into path_modules (path_id, title, order_index) values
    (_mk, 'Module 3 · Research & Insights', 3) returning id into _mk3;
  insert into path_modules (path_id, title, order_index) values
    (_mk, 'Module 4 · Workflows & Certificate', 4) returning id into _mk4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_mk1, 'Write ad copy in seconds',           'lesson',     'chatgpt-basic', 1, 10, 1),
    (_mk1, 'Headlines that stop the scroll',     'lesson',     'chatgpt-basic', 2, 10, 2),
    (_mk1, 'Speak to your audience',             'lesson',     'chatgpt-basic', 3, 10, 3),
    (_mk1, 'Email subject lines and CTAs',       'lesson',     'chatgpt-basic', 4, 10, 4),
    (_mk1, 'Checkpoint: full ad campaign draft', 'checkpoint', 'chatgpt-basic', 5, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_mk2, 'Advanced persuasion techniques',  'lesson',  'chatgpt-advanced', 1, 10, 1),
    (_mk2, 'A/B test your copy with AI',      'lesson',  'chatgpt-advanced', 2, 10, 2),
    (_mk2, 'Build a campaign brief',          'lesson',  'chatgpt-advanced', 3, 10, 3),
    (_mk2, 'Multi-channel messaging',         'lesson',  'chatgpt-advanced', 4, 10, 4),
    (_mk2, 'Project: full campaign kit',      'project', 'chatgpt-advanced', 5, 40, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_mk3, 'Market research with Gemini',     'lesson', 'gemini-basic', 1, 10, 1),
    (_mk3, 'Competitor analysis fast',        'lesson', 'gemini-basic', 2, 10, 2),
    (_mk3, 'Trend spotting and analysis',     'lesson', 'gemini-basic', 3, 10, 3),
    (_mk3, 'Data-driven content ideas',       'lesson', 'gemini-basic', 4, 10, 4),
    (_mk3, 'Quiz: insights to action',        'quiz',   'gemini-basic', 5, 20, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_mk4, 'Marketing workflow with Claude',  'lesson', 'claude-cowork', 1, 10, 1),
    (_mk4, 'Briefing and approvals with AI',  'lesson', 'claude-cowork', 2, 10, 2),
    (_mk4, 'Repurpose content at scale',      'lesson', 'claude-cowork', 3, 10, 3),
    (_mk4, 'Build a marketing playbook',      'lesson', 'claude-cowork', 4, 10, 4),
    (_mk4, 'Project: marketing playbook',     'project','claude-cowork', 5, 40, 5),
    (_mk4, 'Final exam: AI Marketing Pro',    'quiz',   'claude-cowork', 6, 50, 6);

end if;

-- ────────────────────────────────────────────────────────────────────────────
-- 3. AI for Business
-- ────────────────────────────────────────────────────────────────────────────
if not exists (select 1 from career_paths where slug = 'ai-for-business') then

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'ai-for-business',
    'AI for Business',
    'For professionals',
    'ใช้ AI ลดงานซ้ำและตัดสินใจได้ดีขึ้น ตั้งแต่เอกสารธุรกิจ งานร่วมทีม ไปจนถึงการค้นคว้าข้อมูล',
    'sky',
    ARRAY['Claude','ChatGPT','Gemini'],
    4, true, true, 4
  ) returning id into _bz;

  insert into path_modules (path_id, title, order_index) values
    (_bz, 'Module 1 · Business Documents', 1) returning id into _bz1;
  insert into path_modules (path_id, title, order_index) values
    (_bz, 'Module 2 · Research & Analysis', 2) returning id into _bz2;
  insert into path_modules (path_id, title, order_index) values
    (_bz, 'Module 3 · Team Collaboration', 3) returning id into _bz3;
  insert into path_modules (path_id, title, order_index) values
    (_bz, 'Module 4 · Strategic Thinking & Certificate', 4) returning id into _bz4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_bz1, 'Write reports and proposals fast',  'lesson',     'claude-basic', 1, 10, 1),
    (_bz1, 'Summarise long documents',          'lesson',     'claude-basic', 2, 10, 2),
    (_bz1, 'Meeting notes and action items',    'lesson',     'claude-basic', 3, 10, 3),
    (_bz1, 'Email drafts for any situation',    'lesson',     'claude-basic', 4, 10, 4),
    (_bz1, 'SOPs and process documentation',    'lesson',     'claude-basic', 5, 10, 5),
    (_bz1, 'Checkpoint: executive brief',       'checkpoint', 'claude-basic', 6, 30, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_bz2, 'Business research with Gemini',     'lesson', 'gemini-basic', 6, 10, 1),
    (_bz2, 'Market and competitor analysis',    'lesson', 'gemini-basic', 7, 10, 2),
    (_bz2, 'Turn data into decisions',          'lesson', 'gemini-basic', 8, 10, 3),
    (_bz2, 'Financial summaries with AI',       'lesson', 'gemini-basic', 9, 10, 4),
    (_bz2, 'Quiz: business data insights',      'quiz',   'gemini-basic', 10, 20, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_bz3, 'AI-assisted team meetings',         'lesson',  'claude-cowork', 7,  10, 1),
    (_bz3, 'Delegate tasks to AI',              'lesson',  'claude-cowork', 8,  10, 2),
    (_bz3, 'Cross-functional communication',    'lesson',  'claude-cowork', 9,  10, 3),
    (_bz3, 'Onboarding and training docs',      'lesson',  'claude-cowork', 10, 10, 4),
    (_bz3, 'Build a team AI playbook',          'lesson',  'claude-cowork', 11, 10, 5),
    (_bz3, 'Project: team AI workflow',         'project', 'claude-cowork', 12, 40, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_bz4, 'Strategic planning with Claude',    'lesson', 'claude-advanced', 1, 15, 1),
    (_bz4, 'Scenario analysis and forecasting', 'lesson', 'claude-advanced', 2, 15, 2),
    (_bz4, 'OKRs and goal-setting with AI',     'lesson', 'claude-advanced', 3, 15, 3),
    (_bz4, 'Stakeholder communication',         'lesson', 'claude-advanced', 4, 15, 4),
    (_bz4, 'Final exam: AI Business Pro',       'quiz',   'claude-advanced', 5, 50, 5);

end if;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. AI Developer
-- ────────────────────────────────────────────────────────────────────────────
if not exists (select 1 from career_paths where slug = 'ai-developer') then

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'ai-developer',
    'AI Developer',
    'For developers',
    'ใช้ AI ช่วยเขียน รีวิว และส่งงานโค้ดได้เร็วขึ้น ตั้งแต่พื้นฐานจนถึงพรอมป์ขั้นสูงสำหรับนักพัฒนา',
    'mint',
    ARRAY['Claude','Codex','ChatGPT'],
    6, true, true, 5
  ) returning id into _dv;

  insert into path_modules (path_id, title, order_index) values
    (_dv, 'Module 1 · AI Coding Basics', 1) returning id into _dv1;
  insert into path_modules (path_id, title, order_index) values
    (_dv, 'Module 2 · Build with Codex', 2) returning id into _dv2;
  insert into path_modules (path_id, title, order_index) values
    (_dv, 'Module 3 · Claude for Code', 3) returning id into _dv3;
  insert into path_modules (path_id, title, order_index) values
    (_dv, 'Module 4 · Advanced Claude Code', 4) returning id into _dv4;
  insert into path_modules (path_id, title, order_index) values
    (_dv, 'Module 5 · Ship to Production & Certificate', 5) returning id into _dv5;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_dv1, 'How AI assists coding',                 'lesson',     'codex-basic', 1, 10, 1),
    (_dv1, 'Write your first function with AI',     'lesson',     'codex-basic', 2, 10, 2),
    (_dv1, 'Debug code with AI help',               'lesson',     'codex-basic', 3, 10, 3),
    (_dv1, 'Explain and document code',             'lesson',     'codex-basic', 4, 10, 4),
    (_dv1, 'Refactor for readability',              'lesson',     'codex-basic', 5, 10, 5),
    (_dv1, 'Checkpoint: build a CLI tool',          'checkpoint', 'codex-basic', 6, 30, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_dv2, 'Generate APIs and schemas',             'lesson',  'codex-basic', 7,  10, 1),
    (_dv2, 'Write unit tests with AI',              'lesson',  'codex-basic', 8,  10, 2),
    (_dv2, 'Database queries and migrations',       'lesson',  'codex-basic', 9,  10, 3),
    (_dv2, 'Frontend components in seconds',        'lesson',  'codex-basic', 10, 10, 4),
    (_dv2, 'Quiz: code quality review',             'quiz',    'codex-basic', 11, 20, 5),
    (_dv2, 'Project: full-stack mini app',          'project', 'codex-basic', 12, 40, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_dv3, 'Claude Code CLI basics',                'lesson',     'claude-code', 1, 10, 1),
    (_dv3, 'Read and understand any codebase',      'lesson',     'claude-code', 2, 10, 2),
    (_dv3, 'Make targeted edits safely',            'lesson',     'claude-code', 3, 10, 3),
    (_dv3, 'Run and iterate with bash tools',       'lesson',     'claude-code', 4, 10, 4),
    (_dv3, 'Write tests end-to-end',                'lesson',     'claude-code', 5, 10, 5),
    (_dv3, 'Checkpoint: refactor a real repo',      'checkpoint', 'claude-code', 6, 30, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_dv4, 'Complex multi-file edits',              'lesson',  'claude-code', 7,  10, 1),
    (_dv4, 'Custom slash commands and tools',       'lesson',  'claude-code', 8,  10, 2),
    (_dv4, 'MCP servers and integrations',          'lesson',  'claude-code', 9,  10, 3),
    (_dv4, 'Agentic workflows',                     'lesson',  'claude-code', 10, 10, 4),
    (_dv4, 'Secure and review AI code',             'lesson',  'claude-code', 11, 10, 5),
    (_dv4, 'Project: automate your dev workflow',   'project', 'claude-code', 12, 40, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_dv5, 'CI/CD with AI assistance',              'lesson', 'claude-code', 13, 15, 1),
    (_dv5, 'Code review and PR generation',         'lesson', 'claude-code', 14, 15, 2),
    (_dv5, 'Performance and security audits',       'lesson', 'claude-code', 15, 15, 3),
    (_dv5, 'Ship a production feature',             'lesson', 'claude-code', 16, 15, 4),
    (_dv5, 'Quiz: production readiness',            'quiz',   'claude-code', 17, 20, 5),
    (_dv5, 'Final exam: AI Developer',              'quiz',   'claude-code', 18, 50, 6);

end if;

end $seed$;
