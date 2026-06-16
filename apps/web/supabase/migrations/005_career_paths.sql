-- ── 005  career paths ─────────────────────────────────────────────────────

create table if not exists career_paths (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        unique not null,
  title        text        not null,
  tag          text        not null default '',
  description  text        not null default '',
  tone         text        not null default 'violet',
  tools        text[]      not null default '{}',
  weeks        int         not null default 4,
  is_pro       boolean     not null default true,
  is_published boolean     not null default false,
  order_index  int         not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists path_modules (
  id          uuid primary key default gen_random_uuid(),
  path_id     uuid not null references career_paths(id) on delete cascade,
  title       text not null,
  order_index int  not null default 0
);

create index if not exists path_modules_path_id on path_modules(path_id);

create table if not exists path_steps (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references path_modules(id) on delete cascade,
  title       text not null,
  kind        text not null default 'lesson'
    check (kind in ('lesson','quiz','checkpoint','project')),
  course_slug text not null,
  lesson_num  int  not null check (lesson_num > 0),
  xp          int  not null default 10 check (xp > 0),
  order_index int  not null default 0
);

create index if not exists path_steps_module_id on path_steps(module_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table career_paths enable row level security;
alter table path_modules  enable row level security;
alter table path_steps    enable row level security;

-- career_paths: published visible to all authenticated; admins see everything
drop policy if exists "published_paths_visible" on career_paths;
create policy "published_paths_visible"
  on career_paths for select to authenticated
  using (is_published = true);

drop policy if exists "admin_career_paths_all" on career_paths;
create policy "admin_career_paths_all"
  on career_paths for all to authenticated
  using  (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- path_modules: same visibility as parent career_path
drop policy if exists "path_modules_visible" on path_modules;
create policy "path_modules_visible"
  on path_modules for select to authenticated
  using (exists (
    select 1 from career_paths cp where cp.id = path_id
    and (cp.is_published = true
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  ));

drop policy if exists "admin_path_modules_all" on path_modules;
create policy "admin_path_modules_all"
  on path_modules for all to authenticated
  using  (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- path_steps: visible if grandparent career_path is published or admin
drop policy if exists "path_steps_visible" on path_steps;
create policy "path_steps_visible"
  on path_steps for select to authenticated
  using (exists (
    select 1 from path_modules pm
    join career_paths cp on cp.id = pm.path_id
    where pm.id = module_id
    and (cp.is_published = true
      or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  ));

drop policy if exists "admin_path_steps_all" on path_steps;
create policy "admin_path_steps_all"
  on path_steps for all to authenticated
  using  (exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Seed: Prompt Engineer ─────────────────────────────────────────────────────

do $seed$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid; _m5 uuid;
begin
  select id into _p from career_paths where slug = 'prompt-engineer';
  if _p is not null then return; end if;

  insert into career_paths
    (slug, title, tag, description, tone, tools, weeks, is_pro, is_published, order_index)
  values (
    'prompt-engineer',
    'Prompt Engineer',
    'Most popular',
    'เก่งการเขียนพรอมป์ให้ AI ทุกตัว ตั้งแต่พื้นฐานถึงขั้นสูง คุม ChatGPT, Claude และ Gemini ให้ทำงานตรงใจ',
    'violet',
    ARRAY['ChatGPT','Claude','Gemini'],
    5, false, true, 1
  ) returning id into _p;

  insert into path_modules (path_id, title, order_index)
    values (_p, 'Module 1 · Prompt Basics', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
    values (_p, 'Module 2 · Intermediate Techniques', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
    values (_p, 'Module 3 · Prompts for Real Work', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
    values (_p, 'Module 4 · Claude & Gemini', 4) returning id into _m4;
  insert into path_modules (path_id, title, order_index)
    values (_p, 'Module 5 · Final Exam & Certificate', 5) returning id into _m5;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'How AI understands language',         'lesson',     'chatgpt-basic', 1, 10, 1),
    (_m1, 'Parts of a good prompt',              'lesson',     'chatgpt-basic', 2, 10, 2),
    (_m1, 'Give the AI a role',                  'lesson',     'chatgpt-basic', 3, 10, 3),
    (_m1, 'Set context and constraints',         'lesson',     'chatgpt-basic', 4, 10, 4),
    (_m1, 'Checkpoint: write your first prompt', 'checkpoint', 'chatgpt-basic', 5, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Few-shot: teach with examples',       'lesson',  'chatgpt-basic', 6,  10, 1),
    (_m2, 'Chain-of-thought prompting',          'lesson',  'chatgpt-basic', 7,  10, 2),
    (_m2, 'Control tone and length',             'lesson',  'chatgpt-basic', 8,  10, 3),
    (_m2, 'Build a reusable template',           'lesson',  'chatgpt-basic', 9,  10, 4),
    (_m2, 'Project: your first prompt template', 'project', 'chatgpt-basic', 10, 35, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'Prompts for writing',              'lesson',     'chatgpt-basic', 11, 10, 1),
    (_m3, 'Prompts for research',             'lesson',     'chatgpt-basic', 12, 10, 2),
    (_m3, 'Prompts for data and analysis',    'lesson',     'chatgpt-basic', 13, 10, 3),
    (_m3, 'Quiz: spot the better prompt',     'quiz',       'chatgpt-basic', 14, 20, 4),
    (_m3, 'Checkpoint: real-work scenarios',  'checkpoint', 'chatgpt-basic', 15, 30, 5);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Claude: long-form reasoning',     'lesson',  'claude-basic',  1, 10, 1),
    (_m4, 'Claude: detailed instructions',   'lesson',  'claude-basic',  2, 10, 2),
    (_m4, 'Gemini: search-grounded answers', 'lesson',  'gemini-basic',  1, 10, 3),
    (_m4, 'Gemini: multi-modal prompts',     'lesson',  'gemini-basic',  2, 10, 4),
    (_m4, 'Choose the right model',          'lesson',  'gemini-basic',  3, 10, 5),
    (_m4, 'Project: multi-model workflow',   'project', 'claude-basic',  3, 40, 6);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m5, 'System prompts and persona',  'lesson', 'chatgpt-advanced', 1, 15, 1),
    (_m5, 'Advanced prompt chaining',   'lesson', 'chatgpt-advanced', 2, 15, 2),
    (_m5, 'Final exam: Prompt Engineer','quiz',   'chatgpt-advanced', 3, 50, 3);
end $seed$;
