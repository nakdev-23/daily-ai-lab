-- Migration 028: AI Content Creator career path v3
-- Rebuilds the second career path into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-content-creator instead of daily lessons.

alter table career_paths add column if not exists outcomes text[] not null default '{}';
alter table career_paths add column if not exists deliverables text[] not null default '{}';
alter table career_paths add column if not exists practical_ratio int not null default 0
  check (practical_ratio between 0 and 100);
alter table career_paths add column if not exists curriculum_version int not null default 1;

alter table path_steps add column if not exists brief text;
alter table path_steps add column if not exists brief_en text;
alter table path_steps add column if not exists deliverable text;
alter table path_steps add column if not exists deliverable_en text;
alter table path_steps add column if not exists starter_template text;
alter table path_steps add column if not exists starter_template_en text;
alter table path_steps add column if not exists rubric jsonb not null default '[]'::jsonb;
alter table path_steps add column if not exists is_portfolio boolean not null default false;

create table if not exists career_path_progress_archive (
  id                  bigint generated always as identity primary key,
  user_id             uuid not null references auth.users(id) on delete cascade,
  course_id           text not null,
  lessons_done        int not null,
  previous_updated_at timestamptz,
  archived_at         timestamptz not null default now(),
  curriculum_version  int not null
);

do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'โจทย์ คอนเทนต์ที่จะทำ กลุ่มเป้าหมาย และผลลัพธ์ที่ต้องส่งต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The content task, audience, and deliverable are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'audience',
      'label', 'เข้าใจผู้ชม',
      'label_en', 'Audience fit',
      'guidance', 'ระบุ pain point ความต้องการ ภาษา ช่องทาง และเหตุผลที่ผู้ชมควรสนใจ',
      'guidance_en', 'Pain points, needs, language, channel, and reason to care are defined.'
    ),
    jsonb_build_object(
      'key', 'brand_voice',
      'label', 'น้ำเสียงแบรนด์',
      'label_en', 'Brand voice',
      'guidance', 'งานเขียนและภาพต้องคงบุคลิกแบรนด์ ไม่เปลี่ยนเสียงไปมาระหว่างชิ้นงาน',
      'guidance_en', 'Copy and visuals keep a consistent brand voice.'
    ),
    jsonb_build_object(
      'key', 'format',
      'label', 'รูปแบบพร้อมเผยแพร่',
      'label_en', 'Publishable format',
      'guidance', 'กำหนดช่องทาง ความยาว hook CTA asset และรูปแบบส่งมอบชัดเจน',
      'guidance_en', 'Channel, length, hook, CTA, assets, and delivery format are explicit.'
    ),
    jsonb_build_object(
      'key', 'fact_check',
      'label', 'การตรวจข้อเท็จจริงและความเสี่ยง',
      'label_en', 'Fact/risk check',
      'guidance', 'มีวิธีตรวจ claim ตัวเลข ลิขสิทธิ์ภาพ ข้อมูลสินค้า และคำกล่าวเกินจริง',
      'guidance_en', 'Claims, numbers, image rights, product facts, and exaggeration risks are checked.'
    )
  );
begin
  select id into _p from career_paths where slug = 'ai-content-creator';
  if _p is null then
    raise exception 'ai-content-creator career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ทำงาน Content Creator แบบครบ workflow ตั้งแต่เลือกแบรนด์ เข้าใจผู้ชม วาง content pillar เขียน copy สร้าง visual asset จริง publish หรือ smoke test และส่งมอบเป็น campaign portfolio ที่มีผลลัพธ์จริง',
    outcomes = array[
      'วิเคราะห์แบรนด์ ผู้ชม และเป้าหมายคอนเทนต์ได้',
      'สร้าง Audience Persona และ Brand Voice Guide ที่ใช้เขียนซ้ำได้',
      'แตกไอเดียเป็น content pillar, hook, caption และ CTA สำหรับหลายช่องทาง',
      'ทำ Visual Direction และสร้าง visual asset จริงที่ตรวจคุณภาพได้',
      'ปรับคอนเทนต์ตาม platform spec และเก็บ reach, engagement หรือ feedback จริงได้',
      'จัดชุด Content Campaign พร้อม calendar, copy, visual asset, metrics และ improvement plan'
    ],
    deliverables = array[
      'Audience & Voice Guide',
      'Content Pillar Map',
      'Caption & Hook Pack',
      'Visual Asset Evidence',
      'Published Content Metrics Log',
      'Content Campaign Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['ChatGPT', 'Claude', 'Canva', 'Midjourney']
  where id = _p;

  insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
  select user_id, course_id, lessons_done, updated_at, 2
  from course_progress
  where course_id = 'path:ai-content-creator'
    and not exists (
      select 1
      from career_path_progress_archive a
      where a.user_id = course_progress.user_id
        and a.course_id = course_progress.course_id
        and a.curriculum_version = 2
    );

  delete from course_progress where course_id = 'path:ai-content-creator';
  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เข้าใจแบรนด์และผู้ชม', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · เขียนคอนเทนต์ให้คงเสียงแบรนด์', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · ทำภาพและแผนเผยแพร่', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · สร้าง Campaign Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI Content Creator ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-content-creator', 1, 15, 1),
    (_m1, 'Setup: เตรียม brand workspace และ reference board', 'lesson', 'career-ai-content-creator', 2, 15, 2),
    (_m1, 'Practice: สร้าง Audience Persona และ Brand Voice', 'lesson', 'career-ai-content-creator', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Content Pillar, Hook และ CTA แบบเข้าใจง่าย', 'lesson', 'career-ai-content-creator', 4, 20, 1),
    (_m2, 'Practice: แตกหัวข้อเดียวเป็นหลาย format', 'lesson', 'career-ai-content-creator', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: สร้าง Audience & Voice Guide',
    'checkpoint',
    'career-ai-content-creator',
    6,
    35,
    3,
    'สร้างคู่มือสั้น ๆ ที่บอกว่าแบรนด์นี้พูดกับใคร พูดด้วยน้ำเสียงแบบไหน ห้ามพูดแบบไหน และตัวอย่างประโยคที่ควรใช้ เพื่อให้ AI เขียนคอนเทนต์ได้คงเสียงเดิม',
    'ส่ง Audience Persona 1 คน พร้อม Brand Voice Guide, do/don’t, ตัวอย่างประโยค และ prompt ที่ใช้ให้ AI เขียนตาม voice นี้',
    '## แบรนด์/โปรเจกต์

## Audience Persona
- เขาคือใคร:
- ปัญหาหรือความต้องการ:
- เขากลัว/ลังเลเรื่องอะไร:
- เขาใช้ช่องทางไหน:

## Brand Voice
- บุคลิกแบรนด์ 3 คำ:
- ควรพูดแบบ:
- ห้ามพูดแบบ:
- คำที่ใช้บ่อยได้:
- คำที่ควรเลี่ยง:

## ตัวอย่างประโยคใน voice นี้
1.
2.
3.

## Prompt สำหรับให้ AI เขียนตาม brand voice
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'Produce Visual Asset: สร้างภาพจริงจาก prompt', 'lesson', 'career-ai-content-creator', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: ทำ Visual Asset Evidence',
    'checkpoint',
    'career-ai-content-creator',
    8,
    35,
    2,
    'ออกแบบทิศทางภาพสำหรับคอนเทนต์หนึ่งชุด แล้วสร้าง visual asset จริงอย่างน้อย 1 ชิ้นจาก Canva, Midjourney หรือ AI image tool พร้อมตรวจคุณภาพก่อนใช้',
    'ส่ง Visual Asset Evidence พร้อม channel/spec, prompt ที่ใช้จริง, link/screenshot/ชื่อไฟล์, สิ่งที่ดี สิ่งที่ต้องแก้ และ checklist ความเสี่ยง',
    '## คอนเทนต์/แคมเปญที่จะทำภาพ

## Mood & Style
- Mood:
- สีหลัก:
- แสง/ฉาก:
- สิ่งที่ต้องมีในภาพ:
- สิ่งที่ห้ามมี:

## Image prompt 3 แบบ
1.
2.
3.

## Asset จริงที่สร้าง
- เครื่องมือ:
- Link / screenshot / ชื่อไฟล์:
- Channel/spec:

## สิ่งที่ภาพทำได้ดี

## สิ่งที่ต้องแก้ก่อน publish

## วิธีตรวจภาพก่อนใช้
- ตรง brand voice ไหม:
- อ่านง่ายในช่องทางที่จะลงไหม:
- มีความเสี่ยงเรื่องลิขสิทธิ์/คนจริง/โลโก้ไหม:
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Content Plan 30 วัน',
    'project',
    'career-ai-content-creator',
    9,
    50,
    3,
    'วางแผนคอนเทนต์ 30 วันสำหรับแบรนด์หรือโปรเจกต์หนึ่ง โดยให้มี pillar, hook, format, channel และ CTA ชัดเจน ไม่ใช่แค่รายการหัวข้อกว้าง ๆ',
    'ส่ง 30-day content plan พร้อม 4 pillars, ไอเดียอย่างน้อย 20 ชิ้น, hook ตัวอย่าง, channel และ CTA',
    '## แบรนด์/โปรเจกต์

## เป้าหมายของ 30 วันนี้

## Content Pillars
1.
2.
3.
4.

## 30-day Content Plan
| Day | Pillar | Topic | Hook | Format | Channel | CTA |
|---|---|---|---|---|---|---|
| 1 | | | | | | |

## วิธีตรวจแผน
- ครอบคลุม audience pain point ไหม:
- มี format หลากหลายไหม:
- มี CTA ชัดไหม:
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Platform Fit และ Metrics: ปล่อยจริงหรือทำ smoke test', 'lesson', 'career-ai-content-creator', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Published Content & Metrics Log',
    'project',
    'career-ai-content-creator',
    11,
    45,
    2,
    'เลือกคอนเทนต์หนึ่งชิ้นจาก campaign แล้วปรับให้เหมาะกับ platform จริง 1 ช่องทาง จากนั้นโพสต์จริงถ้าปลอดภัย หรือทำ smoke test กับคนจริง 5-10 คน พร้อมเก็บ metric หรือ feedback จริง',
    'ส่ง Published Content & Metrics Log ที่มี platform spec, copy/script, visual asset, link/screenshot, reach/view/click/reply หรือ feedback จริง และสิ่งที่จะปรับต่อ',
    '## Core message

## Platform ที่เลือก

## Platform spec
- ขนาด/สัดส่วน:
- ความยาว:
- Hook:
- CTA:

## Content ที่ปล่อยหรือส่งให้ดู
- Copy/script:
- Visual asset:

## วิธีทดสอบกับคนจริง
- Public post:
- Smoke test:
- Feedback form:

## Evidence
- Link:
- Screenshot:
- จำนวน response:

## Metrics / Feedback
- Reach/View:
- Click/Reply/DM:
- Like/Comment/Share/Save:
- Feedback:

## สิ่งที่เวิร์ก

## สิ่งที่ต้องปรับ

## เวอร์ชันถัดไปจะเปลี่ยนอะไร
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Content Campaign Portfolio',
    'project',
    'career-ai-content-creator',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น campaign 1 ชุดที่พร้อมส่งให้ลูกค้า ทีม หรือใช้เผยแพร่จริง มีเป้าหมาย audience message copy visual asset published/smoke-test evidence และแผนปรับจากผลจริง',
    'ส่ง campaign portfolio ที่มี campaign brief, audience, voice guide, content calendar, copy 5-8 ชิ้น, visual asset evidence, metrics/feedback log, improvement plan และ checklist ตรวจงาน',
    '# Content Campaign Portfolio

## Campaign Brief
- เป้าหมาย:
- Audience:
- Key message:
- Channel:

## Brand Voice Guide

## Content Calendar / Content Set

## Copy พร้อมใช้ 5-8 ชิ้น

## Visual Direction

## Visual Asset Evidence
- Link/screenshot:
- Prompt:
- Tool:

## Published / Smoke Test Metrics
- Channel:
- Link/evidence:
- Reach/View:
- Click/Reply/DM:
- Feedback:

## Improvement Plan
- สิ่งที่เวิร์ก:
- สิ่งที่ต้องปรับ:
- เวอร์ชันถัดไป:

## Checklist ก่อนเผยแพร่
- ข้อมูล/claim ถูกต้อง:
- น้ำเสียงตรงแบรนด์:
- CTA ชัด:
- ภาพและข้อความไม่เสี่ยงลิขสิทธิ์:
- เหมาะกับช่องทาง:
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-content-creator v3 must have exactly 12 steps';
  end if;
end $$;
