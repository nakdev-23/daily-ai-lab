-- ============================================================================
-- Daily AI Lab — Career Paths v3 (combined)
-- Applies all 13 career-path v3 rebuilds (migrations 027-039) in one file.
--
-- Safe to run in the Supabase SQL editor as a single statement batch.
-- Idempotent: re-running re-builds the modules/steps for each path.
-- PRECONDITION: the base career_paths rows must already exist (seed migrations
-- 005/006/012/021/026). Each block raises an exception if its path is missing.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Shared schema (runs once)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 027 · Prompt Engineer  (027_prompt_engineer_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'เป้าหมาย งานที่ต้องการให้ AI ทำ และเกณฑ์สำเร็จต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The goal, requested work, and success criteria are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'context',
      'label', 'บริบท',
      'label_en', 'Context',
      'guidance', 'มีข้อมูลผู้ใช้/ผู้รับสาร ข้อจำกัด ตัวอย่าง ข้อมูลจริง และสิ่งที่ AI ไม่ควรเดา',
      'guidance_en', 'Audience, constraints, examples, real data, and unknowns are included.'
    ),
    jsonb_build_object(
      'key', 'format',
      'label', 'รูปแบบผลลัพธ์',
      'label_en', 'Output format',
      'guidance', 'กำหนดโครงสร้าง ความยาว น้ำเสียง ตาราง/หัวข้อ/JSON หรือรูปแบบส่งมอบชัดเจน',
      'guidance_en', 'Structure, length, tone, tables/headings/JSON, or delivery format is explicit.'
    ),
    jsonb_build_object(
      'key', 'fact_check',
      'label', 'การตรวจข้อเท็จจริง',
      'label_en', 'Fact checking',
      'guidance', 'ระบุวิธีตรวจแหล่งข้อมูล ตัวเลข สมมติฐาน ความเสี่ยง และจุดที่ต้องให้คนตรวจ',
      'guidance_en', 'Sources, numbers, assumptions, risks, and human review points are defined.'
    ),
    jsonb_build_object(
      'key', 'reusability',
      'label', 'ใช้ซ้ำได้จริง',
      'label_en', 'Reusability',
      'guidance', 'prompt/template ต้องเปลี่ยนตัวแปรได้ มีวิธีใช้ และทีมอื่นนำไปใช้ต่อได้',
      'guidance_en', 'The prompt/template has variables, usage notes, and can be reused by others.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'prompt-engineer';
  if _p is null then
    raise exception 'prompt-engineer career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกออกแบบ Prompt สำหรับงานจริง ตั้งแต่รับโจทย์ วิเคราะห์บริบท เขียน template ทดสอบข้ามโมเดล แก้ผลลัพธ์ และส่งมอบเป็น Prompt Library ที่ทีมใช้ซ้ำได้',
    outcomes = array[
      'วิเคราะห์โจทย์งานจริงและแปลงเป็น Prompt Brief ได้',
      'เขียน prompt ด้วยสูตร 6 ช่องและเทคนิคเฉพาะงาน เช่น few-shot, schema, chaining และ safety rule',
      'สร้าง prompt template ที่ใช้ซ้ำกับงานหลายสถานการณ์ได้',
      'รัน prompt จริงและเปรียบเทียบ before/after output จาก ChatGPT, Claude หรือ Gemini ได้อย่างมีเกณฑ์',
      'ทำ Prompt Library พร้อม output evidence คู่มือใช้งาน และ checklist ตรวจคุณภาพ'
    ],
    deliverables = array[
      'Prompt Brief',
      'Reusable Prompt Template',
      'Before/After Output Evidence',
      'Prompt Debugging Report',
      'Multi-model Evaluation Sheet',
      'Prompt Library Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['ChatGPT', 'Claude', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:prompt-engineer'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:prompt-engineer';
  end if;
  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · รับโจทย์และตั้งระบบทำงาน', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · เขียน Prompt ที่ควบคุมผลลัพธ์ได้', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · ทดสอบ แก้ และทำให้ใช้จริง', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · ส่งมอบเป็น Prompt Library', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'Prompt Engineer ทำงานอะไรในโลกจริง', 'lesson', 'career-prompt-engineer', 1, 15, 1),
    (_m1, 'Setup: เตรียม ChatGPT, Claude, Gemini และพื้นที่เก็บ prompt', 'lesson', 'career-prompt-engineer', 2, 15, 2),
    (_m1, 'Practice: แปลงโจทย์งานเป็น Prompt Brief', 'lesson', 'career-prompt-engineer', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'สูตร 6 ช่อง + เทคนิค Prompt Engineer ที่ใช้จริง', 'lesson', 'career-prompt-engineer', 4, 20, 1),
    (_m2, 'Practice: สร้าง Prompt Template ที่ใช้ซ้ำได้', 'lesson', 'career-prompt-engineer', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: ปรับ prompt ที่คลุมเครือให้พร้อมใช้ในงานจริง',
    'checkpoint',
    'career-prompt-engineer',
    6,
    35,
    3,
    'โจทย์นี้ให้คุณฝึกแก้ prompt ที่สั้นและกว้างเกินไป เหมือนเพื่อนร่วมทีมส่งมาว่า “ช่วยเขียนโพสต์ขายคอร์ส AI ให้หน่อย” งานของคุณคือทำให้ prompt นี้ชัดพอที่ AI จะตอบได้ดีขึ้นและมั่วน้อยลง',
    'ส่ง prompt ฉบับใหม่ พร้อมบอกสั้น ๆ ว่าคุณเพิ่มอะไรเข้าไปบ้าง เช่น คนอ่านคือใคร น้ำเสียงแบบไหน ห้ามพูดอะไร ต้องตอบเป็นรูปแบบไหน และต้องตรวจอะไร',
    '## Prompt เดิมที่ต้องแก้
ช่วยเขียนโพสต์ขายคอร์ส AI ให้หน่อย

## Prompt ฉบับใหม่ของฉัน
คุณคือ...
งานที่ต้องทำคือ...
คนอ่านคือ...
ข้อมูลที่ต้องใช้คือ...
ข้อจำกัด/ข้อห้ามคือ...
รูปแบบคำตอบคือ...
ก่อนตอบให้ตรวจว่า...

## สิ่งที่เพิ่มเข้าไป
- งานชัดขึ้นตรงไหน:
- คนอ่าน/บริบทชัดขึ้นตรงไหน:
- ข้อห้ามหรือสิ่งที่ไม่ให้ AI เดาคือ:
- รูปแบบคำตอบที่กำหนดคือ:
- จุดที่ต้องตรวจเองคือ:

## ผลลัพธ์ที่คาดว่าจะได้
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'Real Tool Mission: รัน prompt จริงและเทียบ output', 'lesson', 'career-prompt-engineer', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: ทำ Evaluation Sheet สำหรับ Prompt หนึ่งงาน',
    'checkpoint',
    'career-prompt-engineer',
    8,
    35,
    2,
    'เลือก prompt หรือ template ที่คุณสร้างไว้ แล้วนำไปรันจริงอย่างน้อย 2 รอบ เช่น Prompt v1 เทียบ Prompt v2 หรือ Prompt v2 เทียบ 2 โมเดล จากนั้นใช้ rubric เดียวกันให้คะแนน output จริง',
    'ส่ง Evaluation Sheet ที่มี test cases, prompt v1/v2, output จริงก่อน/หลัง, คะแนน 1-4, หลักฐานการรัน และ decision ว่าจะใช้ prompt/model เวอร์ชันไหนต่อ',
    '## Prompt ที่ทดสอบ

## Test cases
1. เคสปกติ ข้อมูลครบ:
2. เคสยาก มีข้อจำกัดเยอะ:
3. เคสข้อมูลไม่พอ AI ไม่ควรเดา:

## เครื่องมือ/โมเดลที่ใช้
- Model A:
- Model B ถ้ามี:

## Prompt v1 หรือ prompt เดิม

## Output จริงจาก Prompt v1

## Criteria / คะแนน
- ตรงโจทย์ไหม:
- ครบถ้วนไหม:
- รูปแบบถูกไหม:
- มีข้อมูลที่ AI เดาเองไหม:
- เอาไปใช้ต่อได้ไหม:

## Prompt v2 ที่ปรับแล้ว

## Output จริงจาก Prompt v2

## ผลลัพธ์จากโมเดลที่ 2 ถ้ามี

## คะแนนเปรียบเทียบ
| Version/Model | ตรงโจทย์ | ครบ | รูปแบบ | ไม่เดา | ใช้ต่อได้ | รวม |
|---|---:|---:|---:|---:|---:|---:|

## Decision
ฉันเลือกใช้ ... เพราะ ...

## หลักฐานการรัน
เช่น screenshot / link / ชื่อแชต / วันที่รัน
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Prompt Template Pack สำหรับงานหนึ่งอาชีพ',
    'project',
    'career-prompt-engineer',
    9,
    50,
    3,
    'สร้างชุด prompt template 5 ชิ้นสำหรับงานจริงของอาชีพหรือทีมหนึ่ง เลือกสายที่คุณสนใจ เช่น marketing, HR, sales, teacher, developer หรือ creator ให้คิดว่า template pack นี้เป็นของที่คุณจะส่งให้เพื่อนร่วมทีมใช้ต่อ',
    'ส่ง template pack 5 ชิ้น โดยแต่ละชิ้นต้องบอกว่าใช้ทำอะไร ต้องกรอกช่องไหนบ้าง prompt คืออะไร ตัวอย่างการกรอกเป็นอย่างไร และจะตรวจ output ยังไง',
    '## ชื่อ Template Pack

## อาชีพ/ทีมที่จะใช้

## Template 1
ใช้ทำอะไร:
ช่องที่ต้องกรอก:
Prompt:
ตัวอย่างการกรอก:
ผลลัพธ์ที่ควรได้:
วิธีตรวจคำตอบ:

## Template 2
ใช้ทำอะไร:
ช่องที่ต้องกรอก:
Prompt:
ตัวอย่างการกรอก:
ผลลัพธ์ที่ควรได้:
วิธีตรวจคำตอบ:

## Template 3
ใช้ทำอะไร:
ช่องที่ต้องกรอก:
Prompt:
ตัวอย่างการกรอก:
ผลลัพธ์ที่ควรได้:
วิธีตรวจคำตอบ:

## Template 4
ใช้ทำอะไร:
ช่องที่ต้องกรอก:
Prompt:
ตัวอย่างการกรอก:
ผลลัพธ์ที่ควรได้:
วิธีตรวจคำตอบ:

## Template 5
ใช้ทำอะไร:
ช่องที่ต้องกรอก:
Prompt:
ตัวอย่างการกรอก:
ผลลัพธ์ที่ควรได้:
วิธีตรวจคำตอบ:
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Prompt Debugging: แก้ผลลัพธ์ที่ผิด หลุดโจทย์ หรือใช้งานไม่ได้', 'lesson', 'career-prompt-engineer', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Prompt Debugging Report',
    'project',
    'career-prompt-engineer',
    11,
    45,
    2,
    'นำ prompt ที่เคยได้คำตอบไม่ดีมาแก้แบบเป็นขั้นตอน ถ้ายังไม่มี prompt ของตัวเอง ให้ใช้ prompt ตัวอย่างใน template นี้ก็ได้ จุดสำคัญคือบอกให้ได้ว่าปัญหาเกิดจากอะไร ไม่ใช่แก้แบบเดาสุ่ม',
    'ส่งรายงานก่อน/หลัง โดยมี prompt เดิม output เดิมที่รันจริง ปัญหาที่เจอ สาเหตุ prompt ใหม่ output หลังแก้ที่รันจริง และคะแนนก่อน/หลัง',
    '## งานที่ต้องการให้ AI ทำ

## Prompt เดิม

## ผลลัพธ์เดิมที่มีปัญหา
วาง output จริงจากเครื่องมือ AI

## Diagnosis: ปัญหาอยู่ตรงไหน
- งานไม่ชัดหรือไม่:
- คนอ่าน/บริบทไม่ชัดหรือไม่:
- ข้อมูลไม่พอหรือไม่:
- รูปแบบคำตอบไม่ชัดหรือไม่:
- ไม่มีข้อห้าม/วิธีตรวจหรือไม่:

## Prompt ใหม่

## ผลลัพธ์หลังแก้
วาง output จริงจากเครื่องมือ AI

## ก่อน/หลังต่างกันอย่างไร

## คะแนนก่อน/หลัง
| เวอร์ชัน | ตรงโจทย์ | ครบ | รูปแบบ | ไม่เดา | ใช้ต่อได้ |
|---|---:|---:|---:|---:|---:|

## Debugging rule ที่จะจำไว้ใช้ต่อ
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Prompt Library พร้อมคู่มือใช้ในทีม',
    'project',
    'career-prompt-engineer',
    12,
    70,
    3,
    'รวม prompt ที่คุณสร้างทั้งหมดให้เป็น Prompt Library เหมือนคู่มือเล็ก ๆ ที่คนอื่นในทีมเปิดมาแล้วรู้ว่าจะใช้ prompt ไหน ใช้เมื่อไร ต้องกรอกอะไร ต้องรันอย่างไร และ output ที่ดีควรหน้าตาเป็นอย่างไร',
    'ส่ง Prompt Library 8-10 prompts พร้อมคำอธิบายวิธีใช้ ช่องที่ต้องกรอก ตัวอย่าง output จริง before/after evidence และ checklist ตรวจคุณภาพก่อนนำไปใช้จริง',
    '# Prompt Library

## ใช้สำหรับทีม/อาชีพ

## วิธีเลือกใช้ prompt
ถ้าต้องการ... ให้ใช้ Prompt ...
ถ้าข้อมูลไม่ครบ ให้ใช้ Prompt ...
ถ้าต้องส่งงานให้ลูกค้า/หัวหน้า ให้ตรวจด้วย checklist ...

## Prompt 1
ชื่อ:
ใช้เมื่อ:
ช่องที่ต้องกรอก:
Prompt:
Example:
Output evidence:
วิธีตรวจคำตอบ:

## Prompt 2
ชื่อ:
ใช้เมื่อ:
ช่องที่ต้องกรอก:
Prompt:
Example:
วิธีตรวจคำตอบ:

## Prompt 3
ชื่อ:
ใช้เมื่อ:
ช่องที่ต้องกรอก:
Prompt:
Example:
วิธีตรวจคำตอบ:

## Prompt 4
ชื่อ:
ใช้เมื่อ:
ช่องที่ต้องกรอก:
Prompt:
Example:
วิธีตรวจคำตอบ:

## Prompt 5
ชื่อ:
ใช้เมื่อ:
ช่องที่ต้องกรอก:
Prompt:
Example:
วิธีตรวจคำตอบ:

## Prompt 6-10
เพิ่ม prompt ที่จำเป็นต่อ workflow ของทีม

## Output Evidence รวม
| Prompt | Tool/Model | Test case | Before/After หรือ sample output | คะแนน | สิ่งที่เรียนรู้ |
|---|---|---|---|---:|---|

## Evaluation checklist

## ข้อควรระวัง / Human review

## วิธีปรับ library ในอนาคต
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'prompt-engineer v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 028 · AI Content Creator  (028_ai_content_creator_career_v3.sql)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 029 · AI for Marketing  (029_ai_marketing_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'โจทย์การตลาด เป้าหมาย ลูกค้า สินค้า และผลลัพธ์ที่ต้องส่งต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The marketing task, goal, customer, product, and deliverable are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'insight',
      'label', 'Insight ลูกค้า',
      'label_en', 'Customer insight',
      'guidance', 'แยก pain, desire, barrier, trigger และ evidence ได้ ไม่ใช่แค่ demographic กว้าง ๆ',
      'guidance_en', 'Pain, desire, barrier, trigger, and evidence are clear, not just broad demographics.'
    ),
    jsonb_build_object(
      'key', 'message',
      'label', 'Message และข้อเสนอ',
      'label_en', 'Message and offer',
      'guidance', 'Positioning, promise, proof, offer และ CTA เชื่อมกันและเหมาะกับช่องทาง',
      'guidance_en', 'Positioning, promise, proof, offer, and CTA connect and fit the channel.'
    ),
    jsonb_build_object(
      'key', 'measurement',
      'label', 'การวัดผล',
      'label_en', 'Measurement',
      'guidance', 'มี metric, hypothesis, test plan, real run result หรือ decision rule ที่ช่วยตัดสินใจต่อได้',
      'guidance_en', 'Metrics, hypotheses, test plans, real run results, or decision rules support the next decision.'
    ),
    jsonb_build_object(
      'key', 'fact_check',
      'label', 'การตรวจข้อเท็จจริงและความเสี่ยง',
      'label_en', 'Fact/risk check',
      'guidance', 'ตรวจ claim ตัวเลข แหล่งข้อมูล คำกล่าวเกินจริง ข้อจำกัดแบรนด์ และ human review',
      'guidance_en', 'Claims, numbers, sources, exaggeration, brand constraints, and human review are checked.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-marketing';

  if _p is null then
    raise exception 'ai-for-marketing career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ทำงานการตลาดครบ workflow ตั้งแต่ research, customer insight, campaign brief, message matrix, copy, real campaign run, A/B test และ marketing playbook ที่ใช้กับสินค้า/บริการจริงได้',
    outcomes = array[
      'ตั้งโจทย์ research และแยก fact, assumption, need check ได้',
      'เปลี่ยนข้อมูลลูกค้าเป็น insight, positioning และ campaign brief ได้',
      'สร้าง message matrix และ copy หลายช่องทางที่ไม่หลุดทิศ',
      'ออกแบบ A/B test พร้อม metric และ decision rule ได้',
      'รันแคมเปญเล็ก ๆ หรือ smoke test กับคนจริงและเก็บผลจริงได้',
      'ทำ Marketing Playbook พร้อม prompt, KPI, real results และแผนปรับแคมเปญ'
    ],
    deliverables = array[
      'Marketing Work Brief',
      'Customer Insight Map',
      'Campaign Brief',
      'Message Matrix & Copy Pack',
      'Real Campaign Run Log',
      'Marketing Playbook Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['ChatGPT', 'Claude', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-marketing'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-marketing';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · Research และ Customer Insight', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Campaign Brief และ Message', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · Copy, Testing และ Campaign Kit', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · Real Run, Optimization และ Marketing Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI Marketing ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-for-marketing', 1, 15, 1),
    (_m1, 'Setup: เตรียม Marketing Workspace และ Research Sources', 'lesson', 'career-ai-for-marketing', 2, 15, 2),
    (_m1, 'Practice: สร้าง Customer Insight Map', 'lesson', 'career-ai-for-marketing', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Campaign Brief, Positioning และ Metric', 'lesson', 'career-ai-for-marketing', 4, 20, 1),
    (_m2, 'Practice: สร้าง Message Matrix และ Copy ชุดแรก', 'lesson', 'career-ai-for-marketing', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Research & Insight Brief',
    'checkpoint',
    'career-ai-for-marketing',
    6,
    35,
    3,
    'สรุป research และ customer insight สำหรับสินค้า/บริการหนึ่งอย่าง โดยแยก fact, assumption และสิ่งที่ต้องตรวจเพิ่มให้ชัด ก่อนนำไปทำ campaign',
    'ส่ง Research & Insight Brief ที่มี audience, pain/desire/barrier/trigger, competitor notes, evidence/source และ assumption ที่ต้องตรวจ',
    '## สินค้า/บริการ

## Audience

## Customer Insight
- Pain:
- Desire:
- Barrier:
- Trigger:
- Alternative:

## Competitor / Alternative Notes
1.
2.
3.

## Evidence / Source
- Fact:
- Source:

## Assumption ที่ต้องตรวจเพิ่ม
1.
2.

## Campaign angle ที่น่าทดสอบ
1.
2.
3.
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'A/B Test และ Quality Check สำหรับ Copy', 'lesson', 'career-ai-for-marketing', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: A/B Test Plan',
    'checkpoint',
    'career-ai-for-marketing',
    8,
    35,
    2,
    'ออกแบบการทดสอบ message หรือ copy 2 เวอร์ชัน โดยมี hypothesis, variable, metric และ decision rule ที่ใช้ตัดสินใจได้',
    'ส่ง A/B Test Plan พร้อม Version A/B, primary metric, secondary metric, risk/claim check และเกณฑ์เลือกผู้ชนะ',
    '## สิ่งที่จะทดสอบ

## Hypothesis

## Version A
- Message/Hook:
- Copy:
- CTA:

## Version B
- Message/Hook:
- Copy:
- CTA:

## Variable ที่เปลี่ยน

## Metrics
- Primary:
- Secondary:

## Decision rule

## Risk / Claim check ก่อนรัน
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Multi-channel Campaign Kit',
    'project',
    'career-ai-for-marketing',
    9,
    50,
    3,
    'สร้าง campaign kit สำหรับสินค้า/บริการหนึ่งรายการ โดยเชื่อม insight, brief, message matrix และ copy หลายช่องทางเข้าด้วยกัน',
    'ส่ง Campaign Kit ที่มี campaign brief, message matrix, ad copy, email copy, landing hero, CTA, visual direction และ metric',
    '# Multi-channel Campaign Kit

## Campaign Brief
- Objective:
- Audience:
- Insight:
- Positioning:
- Promise:
- Proof:
- Offer:
- Metric:

## Message Matrix
| Segment | Pain | Promise | Proof | Objection | CTA |
|---|---|---|---|---|---|

## Copy Pack
### Ad Copy 1

### Ad Copy 2

### Email

### Landing Hero

### Social Post

## Visual Direction

## Claim / Risk Checklist
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Campaign Run และ Results Log', 'lesson', 'career-ai-for-marketing', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Real Campaign Results Report',
    'project',
    'career-ai-for-marketing',
    11,
    45,
    2,
    'นำ campaign kit หรือ test plan ไปรันแบบเล็กและปลอดภัยกับคนจริง เช่น organic post, email/DM ที่ได้รับอนุญาต, community post ที่ไม่ผิดกฎ, survey หรือ landing/waitlist แล้ววิเคราะห์ผลจริงอย่างมีวินัย',
    'ส่ง Real Campaign Results Report ที่มีช่องทางที่รัน หลักฐาน/ลิงก์/screenshot ตัวเลขหรือ feedback จริง observation, interpretation, action และสิ่งที่จะทดสอบต่อ',
    '## Campaign / Test ที่รันจริง

## ช่องทางที่ใช้

## กลุ่มคนที่เห็นหรือให้ feedback

## หลักฐาน
- Link:
- Screenshot / export:
- จำนวน response:

## Results
| Version/Channel | Metric/Feedback | Result | Note |
|---|---:|---:|---|

## Observation

## Interpretation

## Action

## Do again

## Stop

## Need more data

## Next test

## Ethics / Consent check
- ไม่ spam:
- ได้รับอนุญาตก่อนส่ง DM/email:
- ไม่ใช้ claim ที่ยังตรวจไม่ได้:
- ไม่เก็บข้อมูลส่วนตัวโดยไม่ยินยอม:
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Marketing Playbook Portfolio',
    'project',
    'career-ai-for-marketing',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Marketing Playbook สำหรับสินค้า/บริการหนึ่งรายการ ให้คนอื่นในทีมใช้ซ้ำได้ ตั้งแต่ research, brief, copy, real run, test และ optimization',
    'ส่ง Marketing Playbook Portfolio ที่มี work brief, insight map, campaign brief, message matrix, copy pack, real run log, results report, prompt library และ KPI checklist',
    '# Marketing Playbook Portfolio

## 1. Marketing Work Brief

## 2. Research & Insight Summary

## 3. Campaign Brief

## 4. Message Matrix

## 5. Copy Pack
- Ad:
- Email:
- Landing:
- Social:

## 6. Real Campaign Run Log
- Channel:
- Audience/reviewer:
- Link/evidence:
- Metrics/feedback:
- Consent/risk note:

## 7. A/B Test Plan / Next Test

## 8. Results & Optimization Report

## 9. Prompt Library
- Research prompt:
- Insight prompt:
- Copy prompt:
- Test review prompt:
- Optimization prompt:

## 10. KPI / Claim / Human Review Checklist

## 11. วิธีใช้ playbook นี้ในทีม
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-marketing v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 030 · AI for Business  (030_ai_business_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'โจทย์ธุรกิจ ผู้ตัดสินใจ ผลลัพธ์ และ next step ต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The business task, decision owner, output, and next step are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'evidence',
      'label', 'หลักฐานและข้อเท็จจริง',
      'label_en', 'Evidence',
      'guidance', 'แยก fact, assumption, source และ need check ได้ ไม่ทำให้สมมติฐานดูเป็นข้อเท็จจริง',
      'guidance_en', 'Facts, assumptions, sources, and need-check items are separated.'
    ),
    jsonb_build_object(
      'key', 'decision_quality',
      'label', 'คุณภาพการตัดสินใจ',
      'label_en', 'Decision quality',
      'guidance', 'มี criteria, options, trade-off, risk, recommendation และ decision rule ที่ตรวจได้',
      'guidance_en', 'Criteria, options, trade-offs, risks, recommendations, and decision rules are auditable.'
    ),
    jsonb_build_object(
      'key', 'workflow',
      'label', 'นำไปใช้ในทีมได้',
      'label_en', 'Operational usability',
      'guidance', 'มี owner, timeline, SOP, exception, quality check และ approval point ชัดเจน',
      'guidance_en', 'Owner, timeline, SOP, exceptions, quality checks, and approval points are clear.'
    ),
    jsonb_build_object(
      'key', 'risk_review',
      'label', 'ความปลอดภัยและ human review',
      'label_en', 'Risk and human review',
      'guidance', 'มีกฎข้อมูล จุดที่ห้ามใช้ AI จุดที่ต้องให้คนตรวจ และ feedback จาก stakeholder จริง',
      'guidance_en', 'Data rules, AI boundaries, human review points, and real stakeholder feedback are included.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-business';

  if _p is null then
    raise exception 'ai-for-business career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ทำงานธุรกิจจริง ตั้งแต่ executive brief, decision memo, proposal, SOP, human review workflow และ Team AI Playbook ที่ทีมใช้ซ้ำได้อย่างปลอดภัย',
    outcomes = array[
      'เลือกงานธุรกิจที่เหมาะกับ AI และตั้งกฎข้อมูลให้ทีมได้',
      'สรุปเอกสารเป็น executive brief ที่ช่วยตัดสินใจได้',
      'ทำ decision memo, decision matrix และ proposal พร้อม risk/assumption ได้',
      'แปลงงานซ้ำเป็น SOP พร้อม exception, owner และ quality check ได้',
      'นำเอกสารไปให้ stakeholder review และปรับเป็น Team AI Playbook ที่ใช้จริงได้'
    ],
    deliverables = array[
      'Business Work Brief',
      'Executive Brief',
      'Decision Memo & Proposal',
      'SOP Pack',
      'Team AI Playbook Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['Claude', 'ChatGPT', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-business'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-business';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · Business Brief และ Data Rules', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Decision Memo และ Proposal', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · SOP และ Human Review', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · Stakeholder Feedback และ Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Business ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-for-business', 1, 15, 1),
    (_m1, 'Setup: ตั้ง Workspace และกฎข้อมูลทีม', 'lesson', 'career-ai-for-business', 2, 15, 2),
    (_m1, 'Practice: Executive Brief 1 หน้า', 'lesson', 'career-ai-for-business', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Decision Memo, Risk และ Trade-off', 'lesson', 'career-ai-for-business', 4, 20, 1),
    (_m2, 'Practice: Proposal พร้อมข้อจำกัดและแผนตรวจผล', 'lesson', 'career-ai-for-business', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Executive Brief + Decision Memo',
    'checkpoint',
    'career-ai-for-business',
    6,
    35,
    3,
    'รวม executive brief และ decision memo สำหรับโจทย์ธุรกิจหนึ่งเรื่อง โดยแยก fact, assumption, options, criteria, risk และ recommendation ให้ชัดเจน',
    'ส่ง Executive Brief + Decision Memo ที่มี decision needed, options 3 ทาง, decision matrix, recommendation, risk และ need check ก่อนอนุมัติ',
    '## Business case

## Executive Brief
- Context:
- Key facts:
- Assumptions:
- Decision needed:
- Recommendation:
- Next steps:

## Decision Memo
| Criteria | Weight | Option A | Option B | Option C | Evidence / Note |
|---|---:|---:|---:|---:|---|

## Risks
1.
2.
3.

## Need check before approval
1.
2.

## Human reviewer / approver
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'SOP: แปลงงานซ้ำเป็นขั้นตอนที่ทีมทำตามได้', 'lesson', 'career-ai-for-business', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Human Review Workflow',
    'checkpoint',
    'career-ai-for-business',
    8,
    35,
    2,
    'ออกแบบ workflow ว่าตรงไหน AI ช่วยได้ ตรงไหนต้องให้คนตรวจ ใครอนุมัติ และถ้าเจอข้อมูลไม่ครบหรือความเสี่ยงสูงต้อง escalate อย่างไร',
    'ส่ง Human Review Workflow ที่มี AI-assisted steps, human review points, approval owner, escalation rules และ data safety rules',
    '## Workflow ที่ออกแบบ

## AI-assisted steps
1.
2.
3.

## Human review points
| Step | What to check | Reviewer | Approval needed |
|---|---|---|---|

## Escalation rules
- ถ้าข้อมูลไม่ครบ:
- ถ้าความเสี่ยงสูง:
- ถ้าเกี่ยวกับลูกค้า/พนักงาน/เงิน:

## Data safety rules

## Audit log: ต้องบันทึกอะไรไว้
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Business Document Pack',
    'project',
    'career-ai-for-business',
    9,
    50,
    3,
    'สร้างชุดเอกสารธุรกิจสำหรับ case เดียวกัน ประกอบด้วย executive brief, decision memo, proposal และ SOP โดยทุกชิ้นต้องแยก fact/assumption/risk และมี human review point',
    'ส่ง Business Document Pack ที่มี brief, memo, proposal, SOP, data rules, review workflow และ checklist ก่อนนำไปใช้จริง',
    '# Business Document Pack

## 1. Business Work Brief

## 2. Executive Brief

## 3. Decision Memo

## 4. Proposal

## 5. SOP

## 6. Human Review Workflow

## 7. Data Rules

## 8. Checklist before use
- Fact checked:
- Assumptions labeled:
- Data safe:
- Reviewer assigned:
- Approval owner:
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Stakeholder Review และ Action Items', 'lesson', 'career-ai-for-business', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Stakeholder Feedback Revision',
    'project',
    'career-ai-for-business',
    11,
    45,
    2,
    'นำเอกสารหนึ่งชิ้นไปให้ stakeholder หรือคนที่เข้าใจงานนั้น review จริง แล้วปรับเอกสารตาม feedback พร้อมเก็บ action items',
    'ส่ง revision report ที่มี reviewer role, feedback จริง, action items, สิ่งที่ AI ช่วยปรับ, สิ่งที่คนต้องตัดสินใจเอง และ before/after ของเอกสาร',
    '## Document reviewed

## Reviewer / role

## Review evidence
- Date:
- Screenshot / comment / meeting note:

## Feedback received

## Action items
| Action | Owner | Deadline | Evidence needed |
|---|---|---|---|

## Before revision

## After revision

## What AI helped improve

## What human must decide
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Team AI Playbook Portfolio',
    'project',
    'career-ai-for-business',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Team AI Playbook สำหรับหน่วยงานหนึ่งทีม ให้ทีมรู้ว่าจะใช้ AI กับงานไหน ใช้ prompt ไหน ข้อมูลอะไรห้ามใช้ ตรงไหนต้องให้คนตรวจ และเอกสารตัวอย่างหน้าตาอย่างไร',
    'ส่ง Team AI Playbook Portfolio ที่มี usage rules, executive brief template, decision memo template, proposal template, SOP pack, review workflow, stakeholder feedback และ management-ready summary',
    '# Team AI Playbook Portfolio

## 1. ใช้สำหรับทีม/หน่วยงาน

## 2. AI Usage Rules
- Allowed work:
- Data allowed:
- Data forbidden:
- Human review required:

## 3. Prompt Library
- Executive brief prompt:
- Decision memo prompt:
- Proposal prompt:
- SOP prompt:
- Meeting/action item prompt:

## 4. Templates
- Executive Brief:
- Decision Memo:
- Proposal:
- SOP:

## 5. Business Document Pack

## 6. Human Review Workflow

## 7. Stakeholder Feedback & Revision Evidence

## 8. Management-ready Summary
- What changed:
- Business value:
- Risks:
- Next decision:

## 9. วิธีใช้ playbook นี้ในทีม
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-business v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 031 · AI for Automation  (031_ai_automation_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'งานที่จะ automate, trigger, output และเจ้าของงานต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The task to automate, trigger, output, and owner are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'process_fit',
      'label', 'เลือกงานและ map ถูก',
      'label_en', 'Process fit',
      'guidance', 'เลือกงานที่เหมาะ automate (ซ้ำ ปริมาณมาก กฎชัด) และ map ขั้นตอนเป็น trigger/input/steps/output',
      'guidance_en', 'Picks an automatable task (repetitive, high-volume, rule-based) and maps trigger/input/steps/output.'
    ),
    jsonb_build_object(
      'key', 'reliability',
      'label', 'ทนทานและกันพัง',
      'label_en', 'Reliability',
      'guidance', 'มี test cases เคสปกติ/เคสพัง/ข้อมูลไม่ครบ พร้อม error handling และ fallback',
      'guidance_en', 'Normal, failure, and missing-data test cases with error handling and fallback are defined.'
    ),
    jsonb_build_object(
      'key', 'safety_review',
      'label', 'ความปลอดภัยและ human review',
      'label_en', 'Safety and human review',
      'guidance', 'มีกฎข้อมูล จุดที่ห้าม automate จุดที่ต้องให้คนตรวจ/อนุมัติ และ escalation',
      'guidance_en', 'Data rules, do-not-automate boundaries, human review/approval points, and escalation are clear.'
    ),
    jsonb_build_object(
      'key', 'measurement',
      'label', 'วัดผลและใช้ซ้ำได้',
      'label_en', 'Measurement and reuse',
      'guidance', 'วัดผลจริง (เวลาที่ประหยัด, error rate, feedback) มี owner/maintenance และ template ใช้ซ้ำได้',
      'guidance_en', 'Real results (time saved, error rate, feedback), owner/maintenance, and reusable templates are present.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-automation';

  if _p is null then
    raise exception 'ai-for-automation career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ลดงานซ้ำและสร้างระบบอัตโนมัติจริงด้วยเครื่องมือ no-code (Zapier, Make, n8n) ตั้งแต่หาโอกาส, map กระบวนการ, สร้าง automation recipe, ต่อเข้าเครื่องมือจริงให้ทำงานเอง, ทดสอบและกันพัง, รันจริงวัดผล และส่งมอบเป็น Team Automation Playbook',
    outcomes = array[
      'หางานซ้ำที่เหมาะ automate และ map กระบวนการเป็น trigger, input, steps, output ได้',
      'ออกแบบ automation recipe ที่มี prompt, ขั้นตอน, จุดตรวจ และ error handling',
      'ต่อ automation เข้ากับเครื่องมือ no-code จริง (Zapier/Make/n8n) และทดสอบด้วยเคสปกติ/พัง/ข้อมูลไม่ครบ',
      'ตั้งกฎข้อมูล จุดที่ห้าม automate และจุดที่ต้องให้คนตรวจ/อนุมัติ',
      'รัน automation จริงในเครื่องมือ วัดเวลาที่ประหยัด และทำ Team Automation Playbook'
    ],
    deliverables = array[
      'Automation Work Brief',
      'Process Map',
      'Automation Recipe',
      'Test & Safeguard Plan',
      'Team Automation Playbook Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['ChatGPT', 'Gemini', 'Claude']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-automation'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-automation';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · หาโอกาสและ Map กระบวนการ', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · ออกแบบ Automation Recipe', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · เชื่อมเครื่องมือ ทดสอบ และกันพัง', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · รันจริงและ Automation Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Automation ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-for-automation', 1, 15, 1),
    (_m1, 'Setup: เตรียม Workspace, Automation Log และกฎความปลอดภัย', 'lesson', 'career-ai-for-automation', 2, 15, 2),
    (_m1, 'Practice: เลือกงานซ้ำและทำ Process Map', 'lesson', 'career-ai-for-automation', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'ออกแบบ Automation: Trigger, Steps, Output และจุดตรวจ', 'lesson', 'career-ai-for-automation', 4, 20, 1),
    (_m2, 'Practice: สร้าง Automation Recipe ชุดแรก', 'lesson', 'career-ai-for-automation', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Process Map + Automation Recipe',
    'checkpoint',
    'career-ai-for-automation',
    6,
    35,
    3,
    'รวม process map และ automation recipe สำหรับงานซ้ำหนึ่งงาน โดยบอก trigger, ขั้นตอน, จุดที่ AI ช่วย, จุดที่คนต้องตรวจ และสิ่งที่ห้าม automate ให้ชัด',
    'ส่ง Process Map + Automation Recipe ที่มี trigger, input, steps, AI vs human, prompt, output, data rules และเวลาที่คาดว่าจะประหยัด',
    '## งานซ้ำที่เลือก

## Process Map
- Trigger / เริ่มเมื่อ:
- Input ที่ต้องมี:
- ขั้นตอนปกติ:
1.
2.
3.
- Output ที่ต้องได้:

## Automation Recipe
- ขั้นที่ AI ช่วย:
- Prompt ที่ใช้:
- ขั้นที่คนต้องทำหรือตรวจ:

## ห้าม automate / ต้องมีคนตรวจ

## Data rules: ข้อมูลที่ห้ามใส่ AI

## เวลาที่คาดว่าจะประหยัดต่อรอบ
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'ต่อ automation เข้าเครื่องมือจริง (Zapier/Make/n8n) และทดสอบ', 'lesson', 'career-ai-for-automation', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Test & Safeguard Plan',
    'checkpoint',
    'career-ai-for-automation',
    8,
    35,
    2,
    'ออกแบบการทดสอบ automation ด้วยเคสปกติ เคสพัง และข้อมูลไม่ครบ พร้อม error handling, fallback และจุดที่ต้อง escalate ให้คน',
    'ส่ง Test & Safeguard Plan ที่มี test cases 3 แบบ, expected result, error handling, fallback, human escalation และ data safety check',
    '## Automation ที่ทดสอบ
- เครื่องมือ no-code ที่จะใช้ (Zapier/Make/n8n):

## Test cases
1. เคสปกติ ข้อมูลครบ:
- คาดว่าจะได้:
2. เคสพัง / ผลผิด:
- จะรู้ได้อย่างไรว่าพัง:
3. เคสข้อมูลไม่ครบ:
- automation ควรทำอะไร:

## Error handling: ถ้า AI ตอบผิดหรือ format เพี้ยน

## Fallback: ถ้า automation ใช้ไม่ได้ ให้กลับไปทำอะไร

## จุดที่ต้อง escalate ให้คน

## Data safety check ก่อนรันจริง
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Automation Build Pack',
    'project',
    'career-ai-for-automation',
    9,
    50,
    3,
    'สร้าง automation จริงในเครื่องมือ no-code (Zapier/Make/n8n) สำหรับงานหนึ่งงาน พร้อม process map, recipe, prompt, test plan, error/fallback, data rules และ link/screenshot ของ automation ที่สร้างจริง ให้คนอื่นในทีมหยิบไปใช้ต่อได้',
    'ส่ง Automation Build Pack ที่มีชื่อเครื่องมือที่ใช้, link/screenshot ของ automation จริง, process map, recipe, prompt library, test plan, error/fallback, data rules และ owner/maintenance',
    '# Automation Build Pack

## 1. งาน / Process ที่ automate

## 2. เครื่องมือ no-code ที่ใช้
- เครื่องมือ (Zapier / Make / n8n / อื่น ๆ):
- Link หรือ screenshot ของ automation จริง:

## 3. Process Map
- Trigger:
- Input:
- Steps (modules ในเครื่องมือ):
- Output:

## 4. Automation Recipe
- ขั้นที่ AI ช่วย + ขั้นที่คนทำ:

## 5. Prompt Library
- Prompt 1:
- Prompt 2:

## 6. Test Plan
- เคสปกติ / เคสพัง / ข้อมูลไม่ครบ:

## 7. Error & Fallback

## 8. Data Rules & Human Checkpoint

## 9. Owner / Maintenance: ใครดูแลและตรวจเมื่อไร
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: รัน Automation จริงและวัดผล', 'lesson', 'career-ai-for-automation', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Automation Run Report',
    'project',
    'career-ai-for-automation',
    11,
    45,
    2,
    'รัน automation ที่สร้างไว้ในเครื่องมือ no-code จริงอย่างน้อย 1 รอบกับงานจริงหรือเคสจริง เก็บผลจาก run history จริง (เวลาเดิมเทียบเวลาใหม่, จำนวนงาน, error, ตัวอย่าง output จริง) แล้วสรุปว่าจะปรับอะไร ห้ามแต่งตัวเลขเอง',
    'ส่ง Run Report ที่มีเครื่องมือที่ใช้, link/run history, ผลจริง (before/after เวลา, error), ตัวอย่าง output จริง, สิ่งที่พัง, สิ่งที่ปรับ และหลักฐาน',
    '## Automation ที่รัน
- เครื่องมือ (Zapier / Make / n8n):
- Link หรือ run history:

## วิธีรันจริง
ตัวอย่าง: เปิด automation ในเครื่องมือแล้ว trigger จริง / รันกับเคสจริงที่เก็บไว้ / ให้เพื่อนร่วมทีมลองใช้

## ผลจริงที่ได้ (ห้ามแต่งตัวเลข)
- เวลาเดิมต่อรอบ:
- เวลาใหม่ต่อรอบ:
- จำนวนงานที่รัน:
- Error / ผิดพลาดกี่ครั้ง:
- ตัวอย่าง output จริง:

## สิ่งที่พังหรือต้องแก้

## สิ่งที่จะปรับใน automation รอบถัดไป

## หลักฐาน
ตัวอย่าง: screenshot ของ run history, log, link, ไฟล์ผลลัพธ์
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Team Automation Playbook Portfolio',
    'project',
    'career-ai-for-automation',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Team Automation Playbook ให้ทีมรู้ว่างานไหน automate ได้ ใช้ recipe ไหน prompt ไหน ข้อมูลอะไรห้ามใช้ ตรงไหนคนต้องตรวจ วัดผลได้เท่าไร และดูแลรักษาอย่างไร',
    'ส่ง Team Automation Playbook ที่มี automation list, recipes, prompt library, test & safeguard, run results, data rules, owner/maintenance และ management-ready summary',
    '# Team Automation Playbook Portfolio

## 1. ใช้สำหรับทีม / หน่วยงาน

## 2. งานที่ automate ได้ / งานที่ไม่ควร automate

## 3. Automation Recipes (เครื่องมือ no-code ที่ใช้ + link automation จริง)

## 4. Prompt Library
- Prompt 1:
- Prompt 2:
- Prompt 3:

## 5. Test & Safeguard

## 6. Data Rules & Human Checkpoints

## 7. Run Results / Time Saved

## 8. Owner & Maintenance

## 9. Management-ready Summary
- Time saved:
- Risk reduced:
- Next automation:

## 10. วิธีใช้ playbook นี้ในทีม
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-automation v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 032 · AI for Students  (032_ai_students_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'วิชา หัวข้อ เป้าหมายการเรียน และผลที่อยากได้ต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The subject, topic, study goal, and target outcome are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'understanding',
      'label', 'เข้าใจจริง',
      'label_en', 'Real understanding',
      'guidance', 'แสดงความเข้าใจด้วยคำของตัวเอง อธิบายกลับได้ ไม่ใช่ก๊อปคำตอบ AI มาส่ง',
      'guidance_en', 'Shows understanding in your own words and can explain it back, not copied AI output.'
    ),
    jsonb_build_object(
      'key', 'accuracy',
      'label', 'ความถูกต้องและแหล่งอ้างอิง',
      'label_en', 'Accuracy and sources',
      'guidance', 'ตรวจข้อเท็จจริง สูตร ตัวเลข และอ้างอิงแหล่ง ระวัง AI แต่งข้อมูลหรือมั่ว',
      'guidance_en', 'Facts, formulas, numbers, and sources are checked; AI hallucinations are caught.'
    ),
    jsonb_build_object(
      'key', 'practice',
      'label', 'ฝึกด้วยตัวเอง',
      'label_en', 'Active practice',
      'guidance', 'มี active recall, โจทย์ฝึก หรือ self-test ที่ทำเองจริง ไม่ใช่แค่อ่านผ่าน',
      'guidance_en', 'Active recall, practice questions, or self-tests are actually done, not just read.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'ความซื่อสัตย์ทางวิชาการ',
      'label_en', 'Academic integrity',
      'guidance', 'รู้ว่า AI ช่วยตรงไหนได้ ตรงไหนต้องทำเอง อ้างอิงการใช้ AI และไม่ส่งงาน AI เป็นของตัวเอง',
      'guidance_en', 'Knows where AI may help vs not, discloses AI use, and never submits AI work as ones own.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-students';

  if _p is null then
    raise exception 'ai-for-students career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI เป็นผู้ช่วยเรียนที่ทำให้เก่งขึ้นจริง ไม่ใช่ลอก ตั้งแต่ตั้งเป้าหมายเรียน ตั้ง NotebookLM/source workspace สรุปจากเอกสารจริง สร้างสื่อช่วยเรียน ทำรายงาน/ค้นคว้า ติวด้วย mock exam เอาไปใช้กับงานหรือสอบจริง และรวมเป็น Personal Study Playbook',
    outcomes = array[
      'ใช้ AI และ NotebookLM ช่วยเรียนโดยรักษาความซื่อสัตย์ทางวิชาการและอ้างอิงแหล่งได้',
      'สรุปเนื้อหาจากเอกสารจริงด้วยคำของตัวเอง และตรวจข้อเท็จจริงกับ source ได้',
      'สร้างสื่อช่วยเรียน เช่น flashcards, mind map, cheat sheet, glossary, worksheet หรือ slides จากเนื้อหาที่ตรวจแล้ว',
      'ทำรายงาน/ค้นคว้าอย่างมีวิจารณญาณ แยกข้อเท็จจริง แหล่งที่มา และสิ่งที่ AI อ้างแต่ยังต้องตรวจ',
      'สร้าง mock exam/self-test วัดผลก่อน-หลัง และรวมหลักฐานเป็น Personal Study Playbook'
    ],
    deliverables = array[
      'Study Goal Brief',
      'NotebookLM Source Summary + Self-check',
      'Practice + Mock Exam Set',
      'Research / Learning Media Pack',
      'Personal Study Playbook Portfolio'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['NotebookLM', 'ChatGPT', 'Claude', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-students'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-students';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · ตั้งเป้าหมายเรียนและความซื่อสัตย์', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · สรุปเนื้อหาให้เข้าใจจริง', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · ติวสอบและค้นคว้า', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · ใช้จริงและ Study Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Students: ใช้ AI เรียนให้เก่ง ไม่ใช่ลอก', 'lesson', 'career-ai-for-students', 1, 15, 1),
    (_m1, 'Setup: เตรียม NotebookLM, Study Workspace และกฎความซื่อสัตย์', 'lesson', 'career-ai-for-students', 2, 15, 2),
    (_m1, 'Practice: แตกหัวข้อเป็น Study Plan', 'lesson', 'career-ai-for-students', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'สรุปให้เข้าใจ ไม่ใช่ย่อให้สั้น และตรวจความถูกต้อง', 'lesson', 'career-ai-for-students', 4, 20, 1),
    (_m2, 'Practice: ทำ Summary และ Active Recall', 'lesson', 'career-ai-for-students', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: NotebookLM Source Summary + Self-check',
    'checkpoint',
    'career-ai-for-students',
    6,
    35,
    3,
    'สรุปหัวข้อหนึ่งจาก source จริง เช่น PDF สไลด์ โน้ต หรือชีต โดยใช้ NotebookLM/source workspace ช่วยถามประเด็นหลัก แล้วเขียนใหม่ด้วยคำของตัวเอง พร้อมตรวจความถูกต้องและทดสอบว่าอธิบายกลับได้',
    'ส่ง Source Summary ที่มี source ที่ใช้, คำถามที่ถาม NotebookLM/AI, สรุปด้วยคำตัวเอง, จุดที่ต้องตรวจ/ยังไม่แน่ใจ, แหล่งอ้างอิง และ self-check ว่าอธิบายกลับได้ไหม',
    '## วิชา / หัวข้อ

## Source ที่ใช้ใน NotebookLM / workspace
- ชื่อเอกสาร/สไลด์/โน้ต:
- หน้า/บท/ช่วงที่ใช้:

## คำถามที่ถาม NotebookLM หรือ AI
1.
2.
3.

## ประเด็นหลักจาก source

## สรุปด้วยคำของฉันเอง
ห้ามก๊อป AI มาตรง ๆ ให้เขียนเหมือนอธิบายให้เพื่อนฟัง

## จุดสำคัญที่ต้องจำ
1.
2.
3.

## จุดที่ยังไม่แน่ใจหรือต้องตรวจเพิ่ม

## ความถูกต้อง: ตรวจสูตร/ตัวเลข/ข้อเท็จจริงจากแหล่งไหน

## Self-check: อธิบายหัวข้อนี้ใน 3 ประโยคโดยไม่เปิดสรุป
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'ติวสอบด้วยโจทย์ ค้นคว้า และสร้างสื่อช่วยเรียน', 'lesson', 'career-ai-for-students', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Practice Question Set + Learning Media',
    'checkpoint',
    'career-ai-for-students',
    8,
    35,
    2,
    'ใช้ AI ออกโจทย์ฝึกสำหรับหัวข้อของคุณ แล้วทำเองจริง พร้อมตรวจคำตอบ จดสิ่งที่ยังพลาด และสร้างสื่อช่วยเรียน 1 ชิ้นจาก source ที่ตรวจแล้ว ไม่ใช่ให้ AI ทำข้อสอบให้',
    'ส่ง Practice Set ที่มีโจทย์อย่างน้อย 5 ข้อ, คำตอบที่คุณทำเอง, จุดที่พลาด, เฉลย/แหล่งตรวจ, สื่อช่วยเรียน 1 ชิ้น และสิ่งที่ต้องทบทวนต่อ',
    '## วิชา / หัวข้อที่ติว

## Source ที่ใช้
- NotebookLM/source workspace:
- ตำรา/สไลด์/เว็บที่ตรวจแล้ว:

## โจทย์ฝึก (ให้ AI ออก แต่เราทำเอง)
1.
2.
3.
4.
5.

## คำตอบที่ฉันทำเอง

## ข้อที่พลาดและเพราะอะไร

## ตรวจเฉลยจากแหล่งไหน (กัน AI เฉลยผิด)

## สื่อช่วยเรียนที่สร้าง
เลือกอย่างน้อย 1 อย่าง เช่น flashcards / mind map / cheat sheet / glossary / worksheet / slides

## เนื้อหาของสื่อช่วยเรียน

## จะใช้สื่อนี้ทบทวนอย่างไร

## สิ่งที่ต้องทบทวนต่อ
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Research / Learning Media Pack',
    'project',
    'career-ai-for-students',
    9,
    50,
    3,
    'สร้าง study guide หรือ outline รายงานจริงสำหรับหัวข้อหนึ่ง โดยใช้ AI ช่วยจัดโครง อธิบาย และแปลงเป็นสื่อช่วยเรียน แต่เนื้อหา การอ้างอิง และข้อสรุปต้องเป็นของคุณและตรวจจาก source แล้ว',
    'ส่ง Research / Learning Media Pack ที่มีโครงรายงานหรือ study guide, สรุปด้วยคำตัวเอง, สื่อช่วยเรียนอย่างน้อย 1 ชิ้น, ตัวอย่างโจทย์/จุดสำคัญ, แหล่งอ้างอิงที่ตรวจแล้ว และบันทึกว่า AI ช่วยตรงไหน',
    '# Research / Learning Media Pack

## 1. วิชา / หัวข้อ และเป้าหมาย

## 2. โครงเนื้อหา (outline)

## 3. สรุปด้วยคำของฉัน

## 4. จุดสำคัญ / สูตร / นิยาม ที่ต้องจำ

## 5. โจทย์ฝึกหรือคำถามทบทวน

## 6. สื่อช่วยเรียนที่สร้าง
เลือกอย่างน้อย 1 อย่าง เช่น flashcards / mind map / cheat sheet / glossary / worksheet / slides

## 7. วิธีใช้สื่อนี้ทบทวน

## 8. แหล่งอ้างอิง (ตรวจแล้ว)
- Source ใน NotebookLM/workspace:
- ตำรา/สไลด์/เว็บ:
- สิ่งที่ AI อ้างแต่ยังตรวจไม่ได้:

## 9. AI ช่วยตรงไหน และฉันทำเองตรงไหน
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Study Run: เอาไปใช้กับงานหรือสอบจริง', 'lesson', 'career-ai-for-students', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Mock Exam + Real Study Run Report',
    'project',
    'career-ai-for-students',
    11,
    45,
    2,
    'เอาระบบเรียนของคุณไปใช้กับ mock exam/self-test แบบปิดสรุปก่อนและหลังทบทวน แล้วถ้ามีงาน การบ้าน ควิซ สอบ หรือนำเสนอจริง ให้บันทึกผลจริงว่าเข้าใจขึ้นไหม ทำคะแนนได้เท่าไร หรือได้ feedback อะไร ห้ามแต่งผลเอง',
    'ส่ง Run Report ที่มี mock exam ก่อน/หลัง, วิธีทบทวนที่ใช้ เช่น NotebookLM summary หรือสื่อช่วยเรียน, สิ่งที่เอาไปใช้จริง, ผลจริงหรือ feedback, สิ่งที่ได้ผล, สิ่งที่ต้องปรับ และหลักฐาน',
    '## หัวข้อที่วัดผล

## Mock exam ที่สร้าง
- จำนวนข้อ:
- ระดับความยาก:
- ออกโดย AI จาก source/หัวข้อไหน:

## ผลก่อนทบทวน (ปิดสรุป)
- คะแนน:
- ข้อที่ผิด:
- เรื่องที่ยังไม่เข้าใจ:

## วิธีทบทวนที่ใช้
- NotebookLM/source summary:
- flashcards / mind map / cheat sheet / worksheet / slides:
- AI อธิบายข้อผิดหรือออกโจทย์เพิ่ม:

## ผลหลังทบทวน (ปิดสรุป ใช้โจทย์คนละชุดหรือ shuffled)
- คะแนน:
- ดีขึ้นตรงไหน:
- ยังพลาดตรงไหน:

## เอาไปใช้กับอะไรจริง (การบ้าน/ควิซ/สอบ/นำเสนอ)

## ผลจริงหรือ feedback ครู/เพื่อน

## สิ่งที่ได้ผลกับการเรียนของฉัน

## สิ่งที่ยังพลาดและจะปรับอย่างไร

## หลักฐาน (screenshot คะแนน, ใบงาน, comment ครู, link สื่อช่วยเรียน)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Personal Study Playbook & Study Portfolio',
    'project',
    'career-ai-for-students',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Personal Study Playbook และ Study Portfolio ของตัวเอง ให้รู้ว่าจะใช้ AI/NotebookLM ช่วยเรียนวิชาไหนอย่างไร ใช้ prompt อะไร สร้างสื่อช่วยเรียนอย่างไร ตรวจความถูกต้องอย่างไร วัดผลด้วย mock exam อย่างไร และทำอย่างไรให้ยังซื่อสัตย์ทางวิชาการ',
    'ส่ง Personal Study Playbook ที่มี study routine, NotebookLM/source workflow, prompt library, วิธีตรวจความถูกต้อง, กฎความซื่อสัตย์, study guide/research sample, learning media, mock exam results, run results และสิ่งที่จะทำต่อ',
    '# Personal Study Playbook & Study Portfolio

## 1. ฉันเรียนแบบไหนได้ดี (สไตล์การเรียน)

## 2. Study Routine กับ AI
- ก่อนเรียน:
- ระหว่างเรียน:
- ทบทวน/ก่อนสอบ:

## 3. Prompt Library สำหรับเรียน
- สรุปให้เข้าใจ:
- ออกโจทย์ฝึก:
- อธิบายซ้ำแบบง่ายขึ้น:
- ตรวจความเข้าใจของฉัน:

## 4. NotebookLM / Source Workflow
- เอกสารแบบไหนจะใส่ใน NotebookLM:
- คำถามที่ใช้ถาม source:
- วิธีจดแหล่งที่มา:

## 5. วิธีตรวจความถูกต้อง (กัน AI มั่ว)

## 6. กฎความซื่อสัตย์: AI ช่วยได้ / ห้ามใช้ตรงไหน

## 7. Study Guide / Research Sample

## 8. สื่อช่วยเรียนที่สร้าง
- flashcards / mind map / cheat sheet / glossary / worksheet / slides:
- link หรือหลักฐาน:

## 9. Mock Exam Results / คะแนนก่อน-หลัง

## 10. Run Results / ผลที่ดีขึ้นจากงานจริง

## 11. สิ่งที่จะปรับการเรียนต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-students v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 033 · AI for Writing  (033_ai_writing_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'โจทย์งานเขียน ผู้อ่าน เป้าหมาย และรูปแบบต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The writing task, reader, goal, and format are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'structure',
      'label', 'โครงและลำดับ',
      'label_en', 'Structure',
      'guidance', 'มีโครงที่ชัด ลำดับเหตุผลต่อเนื่อง เปิด-กลาง-ปิด และ flow ที่อ่านรู้เรื่อง',
      'guidance_en', 'A clear outline, logical order, opening-middle-close, and readable flow are present.'
    ),
    jsonb_build_object(
      'key', 'voice',
      'label', 'คุมโทนและเสียง',
      'label_en', 'Voice and tone',
      'guidance', 'คุมน้ำเสียงและสไตล์ให้เหมาะกับผู้อ่าน สม่ำเสมอ และเป็นเสียงของเราเอง ไม่ใช่เสียง AI กลาง ๆ',
      'guidance_en', 'Tone and style fit the reader, stay consistent, and sound like you, not generic AI.'
    ),
    jsonb_build_object(
      'key', 'craft',
      'label', 'ฝีมือการเขียน',
      'label_en', 'Craft',
      'guidance', 'ภาษากระชับ ตัดส่วนเกิน hook ดี ประโยคชัด และแก้จาก draft แรกให้ดีขึ้นจริง',
      'guidance_en', 'Tight language, cut filler, strong hook, clear sentences, and real improvement from the first draft.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'ข้อเท็จจริงและความซื่อสัตย์',
      'label_en', 'Accuracy and integrity',
      'guidance', 'ตรวจข้อเท็จจริง อ้างอิงแหล่ง ไม่อ้างเกินจริง และไม่ส่งงาน AI ล้วนเป็นของตัวเอง',
      'guidance_en', 'Facts and sources are checked, no over-claiming, and pure AI output is not passed off as ones own.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-writing';

  if _p is null then
    raise exception 'ai-for-writing career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI เขียนงานให้เร็วและดีขึ้น โดยเลือกสายงานเขียน (copywriting, content, technical, UX, business) คุมโทนและเสียงของตัวเอง วางโครง ร่าง แก้ให้คม ตรวจข้อเท็จจริง เผยแพร่จริง และรวมเป็น Writing Portfolio ที่ตรงกับงานจริงของสายนั้น',
    outcomes = array[
      'เลือกสายงานเขียน (niche) ที่มีงานจริงและรู้ว่าใครจ้างและต้องการอะไร',
      'วิเคราะห์ผู้อ่านและทำ writing brief ที่ตรงกับสายงานที่เลือก',
      'วางโครงและร่างงานโดยคุมโทนและเสียงของตัวเอง ไม่ใช่เสียง AI กลาง ๆ',
      'แก้ draft ให้คมขึ้น กระชับขึ้น และตรวจข้อเท็จจริงได้',
      'ทำ Writing Portfolio ตรงสาย พร้อมวิธีนำเสนองาน AI-assisted อย่างซื่อสัตย์ตอนหางาน'
    ],
    deliverables = array[
      'Writing Brief',
      'Outline + First Draft',
      'Polished Piece',
      'Feedback & Revision Report',
      'Writing Portfolio & Playbook'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['Claude', 'ChatGPT', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-writing'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-writing';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เข้าใจผู้อ่านและเสียงของงาน', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · วางโครงและร่าง', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · แก้ให้คมและตรวจข้อเท็จจริง', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · เผยแพร่จริงและ Writing Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Writing: เลือกสายงานเขียนและใช้ AI ให้ยังเป็นเสียงเรา', 'lesson', 'career-ai-for-writing', 1, 15, 1),
    (_m1, 'Setup: เตรียม Writing Workspace และ Style Reference', 'lesson', 'career-ai-for-writing', 2, 15, 2),
    (_m1, 'Practice: ทำ Writing Brief ให้ละเอียด', 'lesson', 'career-ai-for-writing', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'วางโครงให้เขียนง่ายและอ่านรู้เรื่อง', 'lesson', 'career-ai-for-writing', 4, 20, 1),
    (_m2, 'Practice: ร่าง Draft แรกโดยคุมโครงและเสียง', 'lesson', 'career-ai-for-writing', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Writing Brief + Outline + Draft',
    'checkpoint',
    'career-ai-for-writing',
    6,
    35,
    3,
    'รวม writing brief, outline และ draft แรกสำหรับงานเขียนหนึ่งชิ้น โดยระบุผู้อ่าน เป้าหมาย โทน และโครงให้ชัด',
    'ส่ง Writing Brief + Outline + First Draft ที่มีผู้อ่าน เป้าหมาย รูปแบบ โทน โครง และร่างที่คุมเสียงของตัวเอง',
    '## งานเขียน / รูปแบบ

## Writing Brief
- ผู้อ่านคือใคร:
- เป้าหมายของงานนี้:
- โทน / สไตล์:
- ความยาว / รูปแบบ:
- สิ่งที่ห้ามพูดหรือห้ามอ้างเกินจริง:

## Outline (โครง)
1.
2.
3.

## First Draft

## เสียงของฉันในงานนี้คือ (ไม่ใช่เสียง AI กลาง ๆ)
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'แก้ให้คม: ตัดส่วนเกิน คุม flow และตรวจข้อเท็จจริง', 'lesson', 'career-ai-for-writing', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Revision (Before/After) + Fact Check',
    'checkpoint',
    'career-ai-for-writing',
    8,
    35,
    2,
    'นำ draft มาแก้ให้คมขึ้นอย่างเป็นขั้นตอน โดยบอกว่าแก้อะไรและทำไม พร้อมตรวจข้อเท็จจริงและคำกล่าวที่อาจเกินจริง',
    'ส่ง Revision ที่มี before/after ของย่อหน้าสำคัญ, สิ่งที่ตัด/แก้และเหตุผล, จุดที่ fact-check และคำ claim ที่ปรับให้ตรวจได้',
    '## งานเขียนที่แก้

## Before (ย่อหน้าหรือส่วนที่จะแก้)

## After (ฉบับแก้แล้ว)

## ฉันแก้อะไรและทำไม
- ตัดส่วนเกิน:
- ทำให้ชัดขึ้น:
- ปรับโทน/flow:

## Fact check
- ข้อมูล/ตัวเลข/ชื่อ ที่ต้องตรวจ:
- ตรวจจากแหล่งไหน:

## คำ claim ที่ปรับให้ไม่เกินจริง
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Polished Piece',
    'project',
    'career-ai-for-writing',
    9,
    50,
    3,
    'เขียนงานหนึ่งชิ้นให้เสร็จพร้อมเผยแพร่ เช่น บทความ อีเมล หรือรายงาน โดยคุมโครง โทน เสียง และตรวจข้อเท็จจริงแล้ว',
    'ส่ง Polished Piece ฉบับสมบูรณ์ พร้อม brief, outline, ฉบับเขียนเสร็จ, จุดที่ตรวจข้อเท็จจริง และบันทึกว่า AI ช่วยตรงไหน',
    '# Polished Piece

## 1. งานเขียน / รูปแบบ และผู้อ่าน

## 2. Brief สั้น ๆ (เป้าหมาย, โทน)

## 3. Outline

## 4. ฉบับเขียนเสร็จ (พร้อมเผยแพร่)

## 5. จุดที่ตรวจข้อเท็จจริง / แหล่งอ้างอิง

## 6. AI ช่วยตรงไหน และฉันเขียน/ตัดสินใจตรงไหน
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: เผยแพร่หรือให้คนอ่านจริงให้ feedback', 'lesson', 'career-ai-for-writing', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Feedback & Revision Report',
    'project',
    'career-ai-for-writing',
    11,
    45,
    2,
    'นำงานเขียนไปเผยแพร่จริงหรือให้คนอ่านกลุ่มเป้าหมายอย่างน้อย 3-5 คน review แล้วเก็บ feedback จริงและปรับงาน ห้ามแต่ง feedback เอง',
    'ส่ง Report ที่มีช่องทาง/ผู้อ่านจริง, feedback จริง, สิ่งที่แก้, before/after และหลักฐาน (link/comment/screenshot)',
    '## งานเขียนที่นำไปใช้

## เผยแพร่ที่ไหน หรือให้ใครอ่าน
ตัวอย่าง: ลงบล็อก/เพจ / ส่งอีเมลจริง / ให้เพื่อนกลุ่มเป้าหมายอ่าน 3-5 คน

## คำถามที่ใช้ขอ feedback
1. เข้าใจง่ายไหม:
2. โทนเหมาะกับผู้อ่านไหม:
3. ตรงไหนที่อยากให้ชัดขึ้น:

## Feedback จริงที่ได้รับ

## สิ่งที่แก้หลังได้ feedback (before/after)

## หลักฐาน (link, comment, screenshot)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Writing Portfolio & Playbook',
    'project',
    'career-ai-for-writing',
    12,
    70,
    3,
    'รวมงานเขียนและวิธีทำงานเป็น Writing Portfolio และ Playbook ที่เจาะสายงานเขียนของคุณ ให้เห็นทั้งตัวอย่างงานจริง ระบบการเขียนที่ใช้ซ้ำได้ และวิธีนำเสนองาน AI-assisted อย่างซื่อสัตย์ตอนหางาน',
    'ส่ง Writing Portfolio ที่ระบุสายงาน, ใครจ้างและต้องการอะไร, ตัวอย่างงาน 2-3 ชิ้น, brief/outline, prompt library, วิธีคุมเสียง, วิธีตรวจข้อเท็จจริง, วิธีนำเสนองาน AI-assisted อย่างซื่อสัตย์ และ feedback evidence',
    '# Writing Portfolio & Playbook

## 1. เกี่ยวกับฉัน + สายงานเขียนที่ทำ (niche)

## 2. ลูกค้า/นายจ้างเป้าหมายของสายนี้ และสิ่งที่เขาต้องการ

## 3. ตัวอย่างงาน 2-3 ชิ้น (พร้อม link ถ้ามี)

## 4. กระบวนการเขียนของฉัน (Brief -> Outline -> Draft -> Edit)

## 5. Prompt Library สำหรับเขียน
- ช่วยวางโครง:
- ช่วยร่าง:
- ช่วยแก้ให้กระชับ:
- ช่วยตรวจโทน:

## 6. วิธีคุมโทนและเสียงให้เป็นของฉัน

## 7. วิธีตรวจข้อเท็จจริงและไม่อ้างเกินจริง

## 8. ฉันใช้ AI ช่วยตรงไหน และนำเสนออย่างซื่อสัตย์ตอนหางาน
- AI ช่วยตรงไหน (วางโครง/ร่าง/แก้):
- ส่วนที่เป็นเสียงและการตัดสินใจของฉันเอง:
- ถ้าผู้จ้างกังวลเรื่อง AI ฉันจะอธิบายอย่างไร:

## 9. Feedback / ผลตอบรับจริง

## 10. สิ่งที่จะพัฒนาในงานเขียนต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-writing v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 034 · AI for Productivity  (034_ai_productivity_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจน',
      'label_en', 'Clarity',
      'guidance', 'งาน เป้าหมาย และระบบที่ทำต้องอ่านแล้วเข้าใจว่าใช้ตอนไหนและอย่างไร',
      'guidance_en', 'The tasks, goals, and system are clear about when and how they are used.'
    ),
    jsonb_build_object(
      'key', 'systemization',
      'label', 'เป็นระบบและใช้ซ้ำได้',
      'label_en', 'Systemization',
      'guidance', 'มี template, SOP หรือขั้นตอนที่ชัดและหยิบไปใช้ซ้ำได้จริง ไม่ใช่ทำครั้งเดียวจบ',
      'guidance_en', 'Reusable templates, SOPs, or steps that can be applied again, not one-off work.'
    ),
    jsonb_build_object(
      'key', 'prioritization',
      'label', 'จัดลำดับและโฟกัส',
      'label_en', 'Prioritization',
      'guidance', 'เลือกทำสิ่งสำคัญก่อน ตัดหรือมอบงานที่ไม่จำเป็น และวางแผนตามความสำคัญจริง',
      'guidance_en', 'Important work is done first, low-value work is cut or delegated, and plans follow real priorities.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงและเวลาที่ประหยัด',
      'label_en', 'Impact',
      'guidance', 'วัดผลจริงได้ เช่น เวลาที่ลดลงหรือคุณภาพที่ดีขึ้น โดยไม่แต่งตัวเลข',
      'guidance_en', 'Real measurable results such as time saved or quality gained, with no made-up numbers.'
    ),
    jsonb_build_object(
      'key', 'judgment',
      'label', 'วิจารณญาณและความปลอดภัย',
      'label_en', 'Judgment and safety',
      'guidance', 'ตรวจ output ของ AI ก่อนใช้ ไม่ใส่ข้อมูลลับลงเครื่องมือสาธารณะ และรู้ว่าอะไรไม่ควรมอบให้ AI ตัดสิน',
      'guidance_en', 'AI output is checked before use, confidential data is not pasted into public tools, and some decisions are kept for a human.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-productivity';

  if _p is null then
    raise exception 'ai-for-productivity career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI สร้างระบบทำงานส่วนตัวที่ทำให้เร็วและคมขึ้น โดยเลือกบทบาทที่จะใช้ แมป workflow จัดการ input และการประชุม สร้าง template ที่ใช้ซ้ำได้ รันจริงและวัดเวลาที่ประหยัด แล้วรวมเป็น Productivity Operating System ที่นำไปใช้และนำเสนอได้จริง',
    outcomes = array[
      'เลือกบทบาทที่ใช้ productivity (เช่น personal, EA/chief of staff, ops/coordinator) และรู้ว่าระบบนี้ช่วยงานจริงอย่างไร',
      'แมป workflow และทำ time audit เพื่อรู้ว่าเวลาหมดไปกับอะไรและตรงไหนให้ AI ช่วยได้',
      'จัดการ input เปลี่ยนเป็น next action จัดลำดับ และสรุปประชุมเป็น action item ที่มีเจ้าของ',
      'สร้าง template และ SOP ที่ใช้ซ้ำได้ รวมเป็น Personal Operating System',
      'รันระบบจริง วัดเวลาที่ประหยัดแบบไม่แต่งตัวเลข และทำ Productivity Portfolio พร้อมวิธีนำเสนอกับทีม/นายจ้าง'
    ],
    deliverables = array[
      'Workflow Map & Time Audit',
      'Triage System + Weekly Plan',
      'Template Pack',
      'Personal Operating System',
      'Time-Saved Report & Playbook'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 4,
    tools = array['ChatGPT', 'Claude', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-productivity'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-productivity';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกบทบาทและตั้งระบบงาน', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · จัดการ input และวางแผน', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · สร้าง template และระบบที่ใช้ซ้ำได้', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · รันจริงและ Productivity Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Productivity: เลือกบทบาทและใช้ AI เป็นผู้ช่วย ไม่ใช่ออโต้ไพลอต', 'lesson', 'career-ai-for-productivity', 1, 15, 1),
    (_m1, 'Setup: ตั้ง AI Productivity Workspace และกฎความปลอดภัยข้อมูล', 'lesson', 'career-ai-for-productivity', 2, 15, 2),
    (_m1, 'Practice: ทำ Workflow Map และ Time Audit ของงานคุณ', 'lesson', 'career-ai-for-productivity', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'จัดการ input ให้กลายเป็น next action และจัดลำดับความสำคัญ', 'lesson', 'career-ai-for-productivity', 4, 20, 1),
    (_m2, 'Practice: เปลี่ยนโน้ตประชุมเป็นสรุปและ action item ที่มีเจ้าของ', 'lesson', 'career-ai-for-productivity', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Workflow Map + Triage System + Weekly Plan',
    'checkpoint',
    'career-ai-for-productivity',
    6,
    35,
    3,
    'รวม workflow map, ระบบ triage เปลี่ยน input เป็น next action และแผนรายสัปดาห์ที่จัดลำดับตามความสำคัญจริง',
    'ส่ง Workflow Map + Time Audit, Triage System (input -> next action) และ Weekly Plan ที่เลือกสิ่งสำคัญ 3 อย่าง',
    '## บทบาท / ที่ฉันใช้ productivity

## Workflow Map (งานประจำที่ทำซ้ำ)
1.
2.
3.

## Time Audit (เวลาหมดไปกับอะไร)
- งานที่กินเวลามากสุด:
- งานที่น่าจะให้ AI ช่วยได้:

## Triage System (เปลี่ยน input เป็น next action)
- กฎการคัดกรอง:
- ตัวอย่าง input -> next action:

## Weekly Plan (สิ่งสำคัญ 3 อย่างของสัปดาห์)
1.
2.
3.
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'สร้าง template และ SOP ที่ใช้ซ้ำได้สำหรับงานประจำ', 'lesson', 'career-ai-for-productivity', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Template Pack + เวลา Before/After',
    'checkpoint',
    'career-ai-for-productivity',
    8,
    35,
    2,
    'ทำ template หรือ SOP สำหรับงานประจำอย่างน้อยหนึ่งงาน พร้อม prompt มาตรฐาน checklist ตรวจ และเวลา before/after',
    'ส่ง Template/SOP ที่มีขั้นตอนชัด, prompt มาตรฐาน, checklist ตรวจก่อนใช้ และเวลา before/after ของงานนั้น',
    '## งานประจำที่ทำ template

## Template / SOP (ขั้นตอน)
1.
2.
3.

## Prompt มาตรฐานที่ใช้กับงานนี้

## Checklist ตรวจก่อนใช้ output

## เวลา Before (ทำเองทั้งหมด)

## เวลา After (ใช้ template + AI)
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Personal Operating System',
    'project',
    'career-ai-for-productivity',
    9,
    50,
    3,
    'ประกอบ template, ระบบจัดการ input และแผนรายสัปดาห์เป็นระบบทำงานส่วนตัวที่ใช้ซ้ำได้จริง พร้อมกฎความปลอดภัยข้อมูล',
    'ส่ง Personal Operating System ที่มีระบบจัดการ input, ระบบวางแผน, template pack, กฎความปลอดภัย และจุดที่ AI ช่วย',
    '# Personal Operating System

## 1. บทบาทและเป้าหมายของระบบนี้

## 2. ระบบจัดการ input และ next action

## 3. ระบบวางแผนรายสัปดาห์/รายวัน

## 4. Template Pack (งานประจำ + prompt ที่ใช้)
- อีเมล/ตอบกลับ:
- สรุปประชุม/อัปเดตสถานะ:
- วางแผน/จัดลำดับ:

## 5. กฎความปลอดภัยข้อมูลและการตรวจ output

## 6. AI ช่วยตรงไหน และฉันตัดสินใจตรงไหน
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: รันระบบจริงและวัดเวลาที่ประหยัดได้', 'lesson', 'career-ai-for-productivity', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Time-Saved Report',
    'project',
    'career-ai-for-productivity',
    11,
    45,
    2,
    'นำระบบไปใช้กับงานจริงหลายวันหรือหนึ่งสัปดาห์ จับเวลา before/after และเก็บผลจริง ห้ามแต่งตัวเลข',
    'ส่ง Report ที่มีงานจริงที่ใช้, เวลา before/after, เวลาที่ประหยัดจริง, คุณภาพที่เปลี่ยน และหลักฐาน',
    '## งาน/ระบบที่นำไปใช้จริง

## ใช้จริงช่วงไหน และกี่ครั้ง

## เวลา Before (ต่อครั้ง/ต่อสัปดาห์)

## เวลา After (ต่อครั้ง/ต่อสัปดาห์)

## เวลาที่ประหยัดได้ (ห้ามแต่งตัวเลข)

## คุณภาพดีขึ้น/แย่ลงอย่างไร

## หลักฐาน (screenshot, ลิงก์, ไฟล์ก่อน-หลัง)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Productivity Operating System & Playbook',
    'project',
    'career-ai-for-productivity',
    12,
    70,
    3,
    'รวมระบบ ผลจริง และวิธีทำงานเป็น Productivity Operating System และ Playbook ที่ใช้ซ้ำได้และนำเสนอกับทีมหรือนายจ้างได้',
    'ส่ง Portfolio ที่ระบุบทบาท, ปัญหาที่แก้, ระบบทำงาน, template library, time-saved จริง, กฎความปลอดภัย และวิธีนำเสนอ',
    '# Productivity Operating System & Playbook

## 1. เกี่ยวกับฉัน + บทบาทที่ใช้ productivity

## 2. ปัญหาเรื่องเวลา/งานที่ระบบนี้แก้ และใครได้ประโยชน์

## 3. ระบบทำงานของฉัน (Capture -> Plan -> Do -> Review)

## 4. Template / SOP Library
- อีเมล/สื่อสาร:
- ประชุม/สรุป:
- วางแผน/จัดลำดับ:

## 5. Time-Saved / ผลจริงที่วัดได้

## 6. กฎความปลอดภัยข้อมูลและการตรวจ output ของ AI

## 7. ฉันใช้ AI ช่วยตรงไหน และนำเสนอกับทีม/นายจ้างอย่างไร
- AI ช่วยตรงไหน:
- ส่วนที่เป็นวิจารณญาณของฉันเอง:
- จะอธิบายเรื่องความปลอดภัยข้อมูลให้ทีมอย่างไร:

## 8. สิ่งที่จะพัฒนาในระบบต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-productivity v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 035 · AI for Music  (035_ai_music_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจนของโจทย์เพลง',
      'label_en', 'Clarity',
      'guidance', 'แนว อารมณ์ ผู้ฟัง และการใช้งานของเพลงต้องชัดก่อนลงมือทำ',
      'guidance_en', 'The genre, mood, audience, and use of the song are clear before making it.'
    ),
    jsonb_build_object(
      'key', 'songcraft',
      'label', 'ฝีมือเพลงและเนื้อ',
      'label_en', 'Songcraft',
      'guidance', 'เนื้อมี theme และ hook ที่ชัด เพลงมีโครงสร้าง และสไตล์เหมาะกับโจทย์',
      'guidance_en', 'Lyrics have a clear theme and hook, the song has structure, and the style fits the brief.'
    ),
    jsonb_build_object(
      'key', 'direction',
      'label', 'การกำกับ AI และการคัดเลือก',
      'label_en', 'Direction and curation',
      'guidance', 'style prompt ชัด generate หลายเวอร์ชัน และเลือกอันที่ดีที่สุดอย่างมีเหตุผล',
      'guidance_en', 'Strong style direction, several versions generated, and the best one chosen with clear reasons.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงและการเผยแพร่',
      'label_en', 'Impact',
      'guidance', 'มีเพลงจริงที่ปล่อยหรือให้คนฟัง พร้อม feedback จริง โดยไม่แต่งผล',
      'guidance_en', 'A real track is released or shared with listeners, with honest feedback collected, no faking.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'ลิขสิทธิ์และความซื่อสัตย์',
      'label_en', 'Rights and integrity',
      'guidance', 'เข้าใจสิทธิเชิงพาณิชย์ของแพ็กเกจที่ใช้ เปิดเผยการใช้ AI และไม่ลอกผลงานหรือเสียงของศิลปินจริง',
      'guidance_en', 'Commercial rights of the tool tier are understood, AI use is disclosed, and the work of real artists is not copied.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-music';

  if _p is null then
    raise exception 'ai-for-music career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกทำเพลงครบเพลงด้วย AI โดยเลือกแนวทางอาชีพ ทำ brief เขียนเนื้อ กำกับสไตล์ สร้างเพลงจริงด้วยเครื่องมืออย่าง Suno คัดเลือกและคุมโครงสร้าง เผยแพร่ให้คนฟังจริง แล้วรวมเป็น Music Portfolio พร้อมเข้าใจลิขสิทธิ์และการเปิดเผยการใช้ AI',
    outcomes = array[
      'เลือกแนวทางทำเพลง (เช่น เพลงประกอบคลิป, ศิลปินปล่อยเพลง, เพลงตามสั่ง, jingle แบรนด์) และรู้ว่าใครจ้าง',
      'ทำ music brief และเขียนเนื้อเพลงที่มี theme และ hook เป็นเสียงของตัวเอง',
      'เขียน style prompt กำกับ AI และคัดเลือกจากหลายเวอร์ชันอย่างมีเหตุผล',
      'สร้างเพลงเสร็จจริงด้วยเครื่องมือ AI พร้อมลิงก์ และคุมโครงสร้างเพลง',
      'เผยแพร่ให้คนฟังจริง เก็บ feedback แบบไม่แต่ง และทำ Music Portfolio พร้อมเข้าใจลิขสิทธิ์และการเปิดเผยการใช้ AI'
    ],
    deliverables = array[
      'Music Brief',
      'Lyrics + Style Prompt',
      'Finished Song (link)',
      'Release & Feedback Report',
      'Music Portfolio & Playbook'
    ],
    practical_ratio = 80,
    curriculum_version = 3,
    weeks = 4,
    tools = array['Suno', 'ChatGPT']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-music'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-music';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกแนวทางและตั้งเครื่องมือ', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · เนื้อเพลงและการกำกับสไตล์', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · สร้างเพลงจริงและคัดเลือก', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · เผยแพร่จริงและ Music Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Music: เลือกแนวทางและกำกับ AI ให้เป็นเพลงของคุณ', 'lesson', 'career-ai-for-music', 1, 15, 1),
    (_m1, 'Setup: ตั้ง Suno และ Music Workspace พร้อมกฎลิขสิทธิ์', 'lesson', 'career-ai-for-music', 2, 15, 2),
    (_m1, 'Practice: ทำ Music Brief ให้ชัด', 'lesson', 'career-ai-for-music', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'เขียนเนื้อเพลงให้มี theme และ hook ที่เป็นเสียงคุณ', 'lesson', 'career-ai-for-music', 4, 20, 1),
    (_m2, 'Practice: เขียน Style Prompt สำหรับสั่ง AI ทำเพลง', 'lesson', 'career-ai-for-music', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Music Brief + Lyrics + Style Prompt',
    'checkpoint',
    'career-ai-for-music',
    6,
    35,
    3,
    'รวม music brief, เนื้อเพลงที่มี theme และ hook และ style prompt สำหรับสั่ง AI ให้พร้อมสร้างเพลงจริง',
    'ส่ง Music Brief + Lyrics (theme/hook/โครง) + Style Prompt ที่ระบุ genre อารมณ์ เครื่องดนตรี และข้อห้าม',
    '## แนวทาง/ที่จะใช้เพลงนี้

## Music Brief
- แนว (genre):
- อารมณ์/mood:
- ใครฟัง และใช้ที่ไหน:
- ความยาว/รูปแบบ:

## Lyrics (เนื้อเพลง)
- theme หลัก:
- โครง (verse/chorus/hook):

## Style Prompt สำหรับ AI
- genre + mood + เครื่องดนตรี + tempo:
- สิ่งที่ห้าม (เช่น ไม่เลียนเสียงศิลปินจริง):
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'สร้างหลายเวอร์ชันแล้วคัดเลือก และคุมโครงสร้างเพลง', 'lesson', 'career-ai-for-music', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: First Track (ลิงก์จริง) + เหตุผลการคัดเลือก',
    'checkpoint',
    'career-ai-for-music',
    8,
    35,
    2,
    'สร้างเพลงจริงหลายเวอร์ชันด้วยเครื่องมือ AI ฟังเทียบ เลือกเวอร์ชันที่ตรง brief และอธิบายเหตุผล พร้อมแนบลิงก์',
    'ส่ง First Track ที่มีลิงก์จริง เวอร์ชันที่ generate เวอร์ชันที่เลือกพร้อมเหตุผล และสิ่งที่จะปรับต่อ',
    '## เพลงที่ทำ (โจทย์)

## เวอร์ชันที่ generate (ลิงก์/ชื่อ)
1.
2.
3.

## เวอร์ชันที่เลือก และเพราะอะไร

## สิ่งที่จะปรับต่อ (prompt/เนื้อ/โครง)

## ลิงก์ track ที่เลือก
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Finished Song',
    'project',
    'career-ai-for-music',
    9,
    50,
    3,
    'ทำเพลงหนึ่งเพลงให้เสร็จพร้อมเผยแพร่ มีเนื้อสมบูรณ์ โครงสร้างเพลงชัด ลิงก์เพลงจริง และเครดิตการใช้ AI',
    'ส่ง Finished Song ที่มีเนื้อสมบูรณ์ style prompt โครงสร้างเพลง ลิงก์เพลงจริง และการเปิดเผยการใช้ AI',
    '# Finished Song

## 1. โจทย์เพลงและผู้ฟัง

## 2. เนื้อเพลงฉบับสมบูรณ์

## 3. Style prompt ที่ใช้

## 4. โครงสร้างเพลง (intro/verse/chorus/bridge/outro)

## 5. ลิงก์เพลงที่เสร็จแล้ว

## 6. ไฟล์ส่งมอบและความยาวที่ตัด (เช่น MP3/WAV, 15/30/60 วินาที)

## 7. เครดิตและการเปิดเผยการใช้ AI (และสิทธิเชิงพาณิชย์ของแพ็กเกจที่ใช้)
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: ปล่อยให้คนฟังจริงและเก็บ feedback', 'lesson', 'career-ai-for-music', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Release & Feedback Report',
    'project',
    'career-ai-for-music',
    11,
    45,
    2,
    'ปล่อยเพลงจริงหรือให้คนกลุ่มเป้าหมายฟังอย่างน้อย 3-5 คน เก็บ feedback จริงและปรับเพลง ห้ามแต่ง feedback เอง',
    'ส่ง Report ที่มีลิงก์เพลง ช่องทาง/ผู้ฟังจริง feedback จริง สิ่งที่ปรับ และหลักฐาน (ลิงก์/คอมเมนต์/ยอดฟัง)',
    '## เพลงที่เผยแพร่ (ลิงก์)

## เผยแพร่ที่ไหน หรือให้ใครฟัง

## คำถามที่ใช้ขอ feedback
1. ฟังแล้วรู้สึกอย่างไร:
2. ท่อนไหนติดหู/ท่อนไหนน่าเบื่อ:
3. เหมาะกับการใช้งานที่ตั้งใจไหม:

## Feedback จริงที่ได้รับ (ห้ามแต่งเอง)

## สิ่งที่จะปรับจาก feedback

## หลักฐาน (ลิงก์, คอมเมนต์, ยอดฟัง)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Music Portfolio & Playbook',
    'project',
    'career-ai-for-music',
    12,
    70,
    3,
    'รวมเพลงและวิธีทำงานเป็น Music Portfolio และ Playbook ที่เจาะแนวทางของคุณ พร้อมเรื่องลิขสิทธิ์และวิธีรับงาน',
    'ส่ง Portfolio ที่มีผลงาน 2-3 เพลง (ลิงก์), กระบวนการ, prompt library, เรื่องลิขสิทธิ์และการเปิดเผย AI และวิธีนำเสนอ',
    '# Music Portfolio & Playbook

## 1. เกี่ยวกับฉัน + แนวทางทำเพลงที่ทำ

## 2. ลูกค้า/ผู้ฟังเป้าหมาย และสิ่งที่เขาต้องการ

## 3. ผลงานเพลง 2-3 เพลง (ลิงก์)

## 4. กระบวนการทำเพลงของฉัน (Brief -> Lyrics -> Style -> Generate -> Curate)

## 5. Prompt / Style Library
- เพลงสนุก/อัปบีต:
- เพลงช้า/อารมณ์:
- jingle/เพลงสั้น:

## 6. ลิขสิทธิ์ การเปิดเผยการใช้ AI และสิทธิเชิงพาณิชย์

## 7. ฉันใช้ AI ช่วยตรงไหน และนำเสนอ/รับงานอย่างไร
- AI ช่วยตรงไหน:
- ส่วนที่เป็นการตัดสินใจ/ฝีมือของฉัน:
- ถ้าลูกค้ากังวลเรื่อง AI หรือลิขสิทธิ์ จะอธิบายอย่างไร:

## 8. Service & Rate Card (แพ็กเกจและราคา)
- แพ็กเกจที่ให้บริการ (เช่น เพลงประกอบคลิป 30 วินาที):
- ราคาโดยประมาณต่อแพ็กเกจ:
- จำนวนรอบแก้ที่รวมในราคา:

## 9. Deliverables & License (สิ่งที่ส่งมอบ)
- ไฟล์ที่ส่ง (เช่น MP3/WAV) และความยาวที่ตัด (15/30/60 วินาที):
- สิทธิการใช้งานที่ลูกค้าได้ (ตามแพ็กเกจเครื่องมือ):
- ข้อความเปิดเผยการใช้ AI ที่แนบให้ลูกค้า:

## 10. สิ่งที่จะพัฒนาต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-music v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 036 · AI for Video  (036_ai_video_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจนของโจทย์',
      'label_en', 'Clarity',
      'guidance', 'concept ผู้ชม แพลตฟอร์ม และการใช้งานของวิดีโอต้องชัดก่อนลงมือทำ',
      'guidance_en', 'The concept, audience, platform, and use of the video are clear before production.'
    ),
    jsonb_build_object(
      'key', 'storycraft',
      'label', 'การเล่าเรื่อง',
      'label_en', 'Storycraft',
      'guidance', 'มี hook ในไม่กี่วินาทีแรก โครงเล่าเรื่องชัด และตอนจบมี CTA หรือ impact',
      'guidance_en', 'A hook in the first seconds, a clear structure, and an ending with a CTA or payoff.'
    ),
    jsonb_build_object(
      'key', 'direction',
      'label', 'การกำกับและประกอบ',
      'label_en', 'Direction and assembly',
      'guidance', 'prompt ต่อ shot ชัด generate หลายเวอร์ชัน เลือกอย่างมีเหตุผล และประกอบเป็นคลิปที่ flow ลื่น',
      'guidance_en', 'Clear shot prompts, several versions generated, the best chosen with reasons, and clips assembled into a smooth cut.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงและการเผยแพร่',
      'label_en', 'Impact',
      'guidance', 'มีวิดีโอจริงที่เผยแพร่ พร้อม metrics หรือ feedback จริง โดยไม่แต่งผล',
      'guidance_en', 'A real video is published with real metrics or feedback collected, no faking.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'สิทธิและจริยธรรม',
      'label_en', 'Rights and ethics',
      'guidance', 'ตรวจสิทธิ เปิดเผยการใช้ AI ไม่ทำ deepfake คนจริง และไม่ใช้ฟุตเทจหรือเพลงที่มีลิขสิทธิ์',
      'guidance_en', 'Rights are checked, AI use is disclosed, real people are not deepfaked, and copyrighted footage or music is not used.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-video';

  if _p is null then
    raise exception 'ai-for-video career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกทำวิดีโอสั้นด้วย AI ตั้งแต่เลือกแนวทางอาชีพ ทำ brief เขียนสคริปต์ วาง shot list กำกับ AI สร้างคลิป คัดเลือกและประกอบเป็นคลิปเดียว ใส่เพลงและคำบรรยาย เผยแพร่จริงและวัดผล แล้วรวมเป็น Video Portfolio พร้อมเข้าใจสิทธิ การเปิดเผยการใช้ AI และจริยธรรมเรื่อง deepfake',
    outcomes = array[
      'เลือกแนวทางทำวิดีโอ (เช่น คอนเทนต์โซเชียล, โฆษณาสินค้า, explainer, วิดีโอตามสั่ง) และรู้ว่าใครจ้าง',
      'ทำ video brief เขียนสคริปต์ที่มี hook ใน 3 วินาทีแรก และวาง shot list',
      'เขียน prompt ต่อ shot กำกับ AI สร้างคลิป และคัดเลือกจากหลายเวอร์ชันอย่างมีเหตุผล',
      'ประกอบคลิป ใส่เพลงและคำบรรยาย เป็นวิดีโอสั้นที่ใช้งานได้จริงพร้อมลิงก์',
      'เผยแพร่จริง เก็บ metrics/feedback แบบไม่แต่ง และทำ Video Portfolio พร้อมเข้าใจสิทธิ การเปิดเผย AI และจริยธรรม deepfake'
    ],
    deliverables = array[
      'Video Brief',
      'Script + Shot List',
      'Finished Video (link)',
      'Release & Performance Report',
      'Video Portfolio & Playbook'
    ],
    practical_ratio = 80,
    curriculum_version = 3,
    weeks = 4,
    tools = array['Runway', 'ChatGPT', 'Suno']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-video'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-video';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกแนวทางและตั้งเครื่องมือ', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · สคริปต์และ Shot Plan', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · สร้างคลิปจริงและตัดต่อ', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · เผยแพร่จริงและ Video Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Video: เลือกแนวทางและกำกับ AI ให้เป็นวิดีโอของคุณ', 'lesson', 'career-ai-for-video', 1, 15, 1),
    (_m1, 'Setup: ตั้ง Runway และ Video Workspace พร้อมกฎสิทธิ์', 'lesson', 'career-ai-for-video', 2, 15, 2),
    (_m1, 'Practice: ทำ Video Brief ให้ชัด', 'lesson', 'career-ai-for-video', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'เขียนสคริปต์ที่มี hook ใน 3 วินาทีแรกสำหรับวิดีโอสั้น', 'lesson', 'career-ai-for-video', 4, 20, 1),
    (_m2, 'Practice: ทำ Shot List และ prompt ต่อ shot', 'lesson', 'career-ai-for-video', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Video Brief + Script + Shot List',
    'checkpoint',
    'career-ai-for-video',
    6,
    35,
    3,
    'รวม video brief, สคริปต์ที่มี hook ใน 3 วินาทีแรก และ shot list ที่แตกเป็นช็อตให้พร้อมสร้างคลิปจริง',
    'ส่ง Video Brief + Script (hook/เนื้อหา/CTA) + Shot List ที่ระบุภาพและความยาวต่อช็อต',
    '## แนวทาง/ที่จะใช้วิดีโอนี้

## Video Brief
- แพลตฟอร์ม (Reels/TikTok/YouTube):
- ผู้ชม และการใช้งาน:
- สัดส่วนและความยาว:
- อารมณ์/โทน:

## Script (สคริปต์)
- hook 3 วินาทีแรก:
- เนื้อหาหลัก:
- ปิดท้าย/CTA:

## Shot List
1.
2.
3.

## สิ่งที่ห้าม (เช่น ไม่ deepfake คนจริง):
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'สร้างคลิปหลายเวอร์ชัน คัดเลือก และประกอบเป็นคลิปเดียว', 'lesson', 'career-ai-for-video', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: First Cut (ลิงก์จริง) + เหตุผลการคัดเลือก',
    'checkpoint',
    'career-ai-for-video',
    8,
    35,
    2,
    'สร้างคลิปจริงต่อ shot หลายเวอร์ชันด้วยเครื่องมือ AI เลือกที่ตรง brief ประกอบเป็น first cut ใส่เพลง/ซับ และอธิบายเหตุผล พร้อมแนบลิงก์ ถ้ายังไม่มี credit ให้ทำ mock first cut พร้อมระบุช็อตที่ต้องกลับมา generate จริง',
    'ส่ง First Cut ที่มีลิงก์จริงหรือ mock first cut, คลิปที่ generate ต่อ shot เวอร์ชันที่เลือกพร้อมเหตุผล, เพลง/ซับที่ใช้, สิทธิ์เพลง และสิ่งที่จะปรับต่อ',
    '## วิดีโอที่ทำ (โจทย์)

## คลิปที่ generate ต่อ shot (ลิงก์/ชื่อ)
1.
2.
3.

## ถ้ายัง generate ไม่ได้: mock first cut / storyboard / Canva link

## เวอร์ชัน/คลิปที่เลือก และเพราะอะไร

## เพลงประกอบ / Suno music bed
- Prompt เพลงที่ใช้:
- ลิงก์/ชื่อไฟล์เพลง:
- สิทธิ์หรือแพ็กเกจที่ตรวจแล้ว:

## First cut ที่ประกอบแล้ว (ลิงก์)

## สิ่งที่จะปรับต่อ
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Finished Video',
    'project',
    'career-ai-for-video',
    9,
    50,
    3,
    'ทำวิดีโอสั้นหนึ่งชิ้นให้เสร็จพร้อมเผยแพร่ มีสคริปต์สมบูรณ์ ประกอบจากคลิป AI หรือ mock cut ที่กลับมาเติมคลิปจริงแล้ว ใส่เพลง/คำบรรยาย ลิงก์จริง และเครดิตการใช้ AI',
    'ส่ง Finished Video ที่มีสคริปต์สมบูรณ์ shot list ลิงก์วิดีโอจริง ไฟล์ส่งมอบ เพลง/ซับที่ใช้ สิทธิ์เพลง และการเปิดเผยการใช้ AI',
    '# Finished Video

## 1. โจทย์วิดีโอและผู้ชม

## 2. สคริปต์ฉบับสมบูรณ์

## 3. Shot list และ prompt ที่ใช้

## 4. ลิงก์วิดีโอที่เสร็จแล้ว

## 5. ไฟล์ส่งมอบและสัดส่วน/ความยาว (เช่น 9:16, 15/30/60 วินาที)

## 6. เพลงและคำบรรยายที่ใช้ (และสิทธิ)
- เพลงจาก Suno/เครื่องมืออื่น:
- Prompt เพลงหรือแหล่งที่มา:
- ตรวจสิทธิ์ตามแพ็กเกจแล้วหรือไม่:

## 7. เครดิตและการเปิดเผยการใช้ AI
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: เผยแพร่จริงและเก็บ metrics/feedback', 'lesson', 'career-ai-for-video', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Release & Performance Report',
    'project',
    'career-ai-for-video',
    11,
    45,
    2,
    'เผยแพร่วิดีโอจริงบนแพลตฟอร์มหรือให้กลุ่มเป้าหมายดู เก็บ metrics และ feedback จริง แล้วปรับ ห้ามแต่งตัวเลข',
    'ส่ง Report ที่มีลิงก์วิดีโอ ช่องทางเผยแพร่ metrics จริง feedback จริง สิ่งที่ปรับ และหลักฐาน',
    '## วิดีโอที่เผยแพร่ (ลิงก์)

## เผยแพร่ที่ไหน และเมื่อไร

## Metrics จริง (view, watch-through, like, comment, share)

## Feedback จริงที่ได้รับ (ห้ามแต่งเอง)

## สิ่งที่จะปรับจาก metrics/feedback

## หลักฐาน (screenshot analytics, ลิงก์, คอมเมนต์)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Video Portfolio & Playbook',
    'project',
    'career-ai-for-video',
    12,
    70,
    3,
    'รวมวิดีโอและวิธีทำงานเป็น Video Portfolio และ Playbook ที่เจาะแนวทางของคุณ พร้อมเรื่องสิทธิ จริยธรรม และวิธีรับงาน',
    'ส่ง Portfolio ที่มีผลงาน 2-3 ชิ้น (ลิงก์), กระบวนการ, shot/prompt library, สิทธิและการเปิดเผย AI, rate card และวิธีนำเสนอ',
    '# Video Portfolio & Playbook

## 1. เกี่ยวกับฉัน + แนวทางทำวิดีโอที่ทำ

## 2. ลูกค้า/ผู้ชมเป้าหมาย และสิ่งที่เขาต้องการ

## 3. ผลงานวิดีโอ 2-3 ชิ้น (ลิงก์)

## 4. กระบวนการทำวิดีโอของฉัน (Brief -> Script -> Shot list -> Generate -> Assemble)

## 5. Prompt / Shot Library
- คลิปเปิด/hook:
- คลิปสินค้า/โชว์ของ:
- คลิปปิด/CTA:

## 6. สิทธิ การเปิดเผยการใช้ AI และจริยธรรม deepfake

## 7. Service & Rate Card (แพ็กเกจและราคา)
- แพ็กเกจที่ให้บริการ (เช่น คลิปโซเชียล 30 วินาที):
- ราคาโดยประมาณต่อแพ็กเกจ:
- จำนวนรอบแก้ที่รวมในราคา:

## 8. Deliverables & License (สิ่งที่ส่งมอบ)
- ไฟล์ที่ส่ง (เช่น MP4) สัดส่วนและความยาว (9:16, 15/30/60 วินาที):
- สิทธิการใช้งานที่ลูกค้าได้ (ตามแพ็กเกจเครื่องมือ):
- ข้อความเปิดเผยการใช้ AI ที่แนบให้ลูกค้า:

## 9. ฉันใช้ AI ช่วยตรงไหน และนำเสนอ/รับงานอย่างไร
- AI ช่วยตรงไหน:
- ส่วนที่เป็นการตัดสินใจ/ฝีมือของฉัน:
- ถ้าลูกค้ากังวลเรื่อง AI หรือสิทธิ จะอธิบายอย่างไร:

## 10. สิ่งที่จะพัฒนาต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-video v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 037 · AI for Image & Design  (037_ai_image_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจนของโจทย์',
      'label_en', 'Clarity',
      'guidance', 'การใช้งาน แพลตฟอร์ม ผู้ชม และสเปกของภาพต้องชัดก่อนลงมือสร้าง',
      'guidance_en', 'The use, platform, audience, and specs of the image are clear before generating.'
    ),
    jsonb_build_object(
      'key', 'craft',
      'label', 'ฝีมือภาพ',
      'label_en', 'Craft',
      'guidance', 'องค์ประกอบ แสง และสไตล์เหมาะกับโจทย์ และได้ภาพที่คลีนใช้งานได้',
      'guidance_en', 'Good composition, lighting, and style that fit the brief, with clean usable images.'
    ),
    jsonb_build_object(
      'key', 'direction',
      'label', 'การกำกับและคุมสไตล์',
      'label_en', 'Direction and consistency',
      'guidance', 'prompt ชัด generate หลายเวอร์ชัน เลือกอย่างมีเหตุผล และคุมสไตล์หรือ brand ให้สม่ำเสมอ',
      'guidance_en', 'Clear prompts, several versions generated, the best chosen with reasons, and a consistent style or brand look.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงและการใช้งาน',
      'label_en', 'Impact',
      'guidance', 'มีภาพจริงที่นำไปใช้หรือให้ผู้ชมดู พร้อม feedback จริง โดยไม่แต่งผล',
      'guidance_en', 'Real images are used or shared with the audience and honest feedback is collected, no faking.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'สิทธิและจริยธรรม',
      'label_en', 'Rights and ethics',
      'guidance', 'ตรวจสิทธิ เปิดเผยการใช้ AI ไม่ลอกสไตล์ศิลปินที่มีชีวิตโดยอ้างชื่อ และไม่ใช้ตัวละครที่มีลิขสิทธิ์หรือหน้าคนจริงในทางที่ผิด',
      'guidance_en', 'Rights are checked, AI use is disclosed, living artists are not copied by name, and trademarked characters or real people are not misused.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-image';

  if _p is null then
    raise exception 'ai-for-image career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกสร้างภาพคุณภาพสูงด้วย AI ตั้งแต่เลือกแนวทางอาชีพ ทำ brief เขียน prompt คุมองค์ประกอบ สไตล์ และพารามิเตอร์ สร้างสไตล์ที่ใช้ซ้ำได้ คัดเลือกจากหลายเวอร์ชัน นำไปใช้จริงและเก็บ feedback แล้วรวมเป็น Image Portfolio พร้อมเข้าใจสิทธิและการเปิดเผยการใช้ AI',
    outcomes = array[
      'เลือกแนวทางทำภาพ (เช่น กราฟิกโซเชียล, ภาพแบรนด์/โฆษณา, ภาพสินค้า, ภาพประกอบ) และรู้ว่าใครจ้าง',
      'ทำ image brief และเขียน prompt ที่คุมองค์ประกอบ สไตล์ และพารามิเตอร์',
      'สร้างสไตล์ที่ใช้ซ้ำได้ คุม brand consistency และคัดเลือกจากหลายเวอร์ชันอย่างมีเหตุผล',
      'สร้างชุดภาพที่ใช้งานได้จริงพร้อมลิงก์ และทำให้พร้อมนำไปใช้',
      'นำภาพไปใช้จริง เก็บ feedback แบบไม่แต่ง และทำ Image Portfolio พร้อมเข้าใจสิทธิและการเปิดเผยการใช้ AI'
    ],
    deliverables = array[
      'Image Brief',
      'Prompt + Style Spec',
      'Finished Image Set (link)',
      'Usage & Feedback Report',
      'Image Portfolio & Playbook'
    ],
    practical_ratio = 80,
    curriculum_version = 3,
    weeks = 4,
    tools = array['Midjourney', 'Claude']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-image'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-image';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกแนวทางและตั้งเครื่องมือ', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Prompt และสไตล์', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · สร้างภาพจริงและคัดเลือก', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · ส่งมอบจริงและ Image Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Image: เลือกแนวทางและกำกับ AI ให้เป็นภาพของคุณ', 'lesson', 'career-ai-for-image', 1, 15, 1),
    (_m1, 'Setup: ตั้งเครื่องมือสร้างภาพและ Image Workspace พร้อมกฎสิทธิ์', 'lesson', 'career-ai-for-image', 2, 15, 2),
    (_m1, 'Practice: ทำ Image Brief ให้ชัด', 'lesson', 'career-ai-for-image', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'เขียน prompt ภาพให้คุมองค์ประกอบ สไตล์ และพารามิเตอร์', 'lesson', 'career-ai-for-image', 4, 20, 1),
    (_m2, 'Practice: สร้างสไตล์ที่ใช้ซ้ำได้และคุม brand consistency', 'lesson', 'career-ai-for-image', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Image Brief + Prompt + Style Spec',
    'checkpoint',
    'career-ai-for-image',
    6,
    35,
    3,
    'รวม image brief, prompt ที่คุมองค์ประกอบและพารามิเตอร์ และ style spec สำหรับคุมให้ภาพในชุดสม่ำเสมอ',
    'ส่ง Image Brief + Prompt + Style Spec ที่ระบุการใช้งาน สเปก subject สไตล์ และข้อห้าม',
    '## แนวทาง/ที่จะใช้ภาพนี้

## Image Brief
- การใช้งานและแพลตฟอร์ม:
- ผู้ชม:
- สเปก (สัดส่วน/ขนาด/รูปแบบไฟล์):
- อารมณ์/สไตล์:

## Prompt
- subject:
- style + composition + lighting:
- พารามิเตอร์ (อัตราส่วน ฯลฯ):

## Style Spec (คุมให้สม่ำเสมอ)
- สี/โทน:
- สิ่งที่ห้าม (เช่น ไม่ลอกสไตล์ศิลปินที่มีชีวิตโดยอ้างชื่อ):
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'สร้างหลายเวอร์ชัน คัดเลือก และทำให้ภาพใช้งานได้จริง', 'lesson', 'career-ai-for-image', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: First Image Set (ลิงก์จริง) + เหตุผลการคัดเลือก',
    'checkpoint',
    'career-ai-for-image',
    8,
    35,
    2,
    'สร้างภาพจริงหลายเวอร์ชันด้วยเครื่องมือ AI เลือกที่ตรง brief ทำให้ใช้งานได้ และอธิบายเหตุผล พร้อมแนบลิงก์',
    'ส่ง First Image Set ที่มีลิงก์จริง เวอร์ชันที่ generate เวอร์ชันที่เลือกพร้อมเหตุผล และวิธีทำให้ใช้งานได้',
    '## ภาพที่ทำ (โจทย์)

## เวอร์ชันที่ generate (ลิงก์/ชื่อ)
1.
2.
3.

## เวอร์ชันที่เลือก และเพราะอะไร

## วิธีทำให้ภาพใช้งานได้ (crop/upscale/แก้ไข)

## ลิงก์ภาพที่เลือก
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Finished Image Set',
    'project',
    'career-ai-for-image',
    9,
    50,
    3,
    'ทำชุดภาพให้เสร็จพร้อมใช้งาน มีสไตล์สม่ำเสมอ ลิงก์ภาพจริง ไฟล์ส่งมอบตามสเปก และเครดิตการใช้ AI',
    'ส่ง Finished Image Set ที่มีชุดภาพ prompt/style spec ลิงก์จริง ไฟล์ส่งมอบ และการเปิดเผยการใช้ AI',
    '# Finished Image Set

## 1. โจทย์ภาพและผู้ใช้งาน

## 2. Prompt และ style spec ที่ใช้

## 3. ชุดภาพที่เสร็จแล้ว (ลิงก์)

## 4. ความสม่ำเสมอของสไตล์ในชุดนี้

## 5. ไฟล์ส่งมอบและสเปก (สัดส่วน/ขนาด/ฟอร์แมต)

## 6. เครดิตและการเปิดเผยการใช้ AI (และสิทธิเชิงพาณิชย์ของแพ็กเกจที่ใช้)
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: นำภาพไปใช้จริงและเก็บ feedback', 'lesson', 'career-ai-for-image', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Usage & Feedback Report',
    'project',
    'career-ai-for-image',
    11,
    45,
    2,
    'นำภาพไปใช้จริงในโพสต์ สินค้า หรือให้กลุ่มเป้าหมายดู เก็บ feedback หรือผลจริง แล้วปรับ ห้ามแต่งผล',
    'ส่ง Report ที่มีลิงก์ภาพ ที่ใช้งานจริง feedback หรือผลจริง สิ่งที่ปรับ และหลักฐาน',
    '## ภาพที่นำไปใช้จริง (ลิงก์)

## ใช้ที่ไหน หรือให้ใครดู

## คำถามที่ใช้ขอ feedback
1. สื่อสารตรงไหม:
2. ดึงดูด/สะดุดตาไหม:
3. เหมาะกับการใช้งานที่ตั้งใจไหม:

## Feedback หรือผลจริงที่ได้รับ (ห้ามแต่งเอง)

## สิ่งที่จะปรับ

## หลักฐาน (ลิงก์, screenshot, engagement)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Image Portfolio & Playbook',
    'project',
    'career-ai-for-image',
    12,
    70,
    3,
    'รวมภาพและวิธีทำงานเป็น Image Portfolio และ Playbook ที่เจาะแนวทางของคุณ พร้อมเรื่องสิทธิและวิธีรับงาน',
    'ส่ง Portfolio ที่มีผลงาน 2-3 ชุด (ลิงก์), กระบวนการ, prompt/style library, สิทธิและการเปิดเผย AI, rate card และวิธีนำเสนอ',
    '# Image Portfolio & Playbook

## 1. เกี่ยวกับฉัน + แนวทางทำภาพที่ทำ

## 2. ลูกค้า/ผู้ชมเป้าหมาย และสิ่งที่เขาต้องการ

## 3. ผลงานภาพ 2-3 ชุด (ลิงก์)

## 4. กระบวนการทำภาพของฉัน (Brief -> Prompt -> Style -> Generate -> Curate)

## 5. Prompt / Style Library
- ภาพโซเชียล/โพสต์:
- ภาพสินค้า/โฆษณา:
- ภาพประกอบ/คาแรกเตอร์:

## 6. สิทธิ การเปิดเผยการใช้ AI และสิ่งที่ไม่ทำ

## 7. Service & Rate Card (แพ็กเกจและราคา)
- แพ็กเกจที่ให้บริการ (เช่น ชุดภาพโซเชียล 5 ภาพ):
- ราคาโดยประมาณต่อแพ็กเกจ:
- จำนวนรอบแก้ที่รวมในราคา:

## 8. Deliverables & License (สิ่งที่ส่งมอบ)
- ไฟล์ที่ส่ง (เช่น PNG/JPG) สัดส่วนและความละเอียด:
- สิทธิการใช้งานที่ลูกค้าได้ (ตามแพ็กเกจเครื่องมือ):
- ข้อความเปิดเผยการใช้ AI ที่แนบให้ลูกค้า:

## 9. ฉันใช้ AI ช่วยตรงไหน และนำเสนอ/รับงานอย่างไร
- AI ช่วยตรงไหน:
- ส่วนที่เป็นการตัดสินใจ/ฝีมือของฉัน:
- ถ้าลูกค้ากังวลเรื่อง AI หรือสิทธิ จะอธิบายอย่างไร:

## 10. สิ่งที่จะพัฒนาต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-image v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 038 · AI Developer  (038_ai_developer_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจนของ spec',
      'label_en', 'Clarity',
      'guidance', 'ฟีเจอร์ ผู้ใช้ input output และ success criteria ต้องชัดก่อนลงมือสร้าง',
      'guidance_en', 'The feature, users, inputs, outputs, and success criteria are clear before building.'
    ),
    jsonb_build_object(
      'key', 'prompt_design',
      'label', 'การออกแบบ prompt และ output',
      'label_en', 'Prompt design',
      'guidance', 'system และ user prompt พร้อม structured output ที่คุมได้และ parse ได้ เหมาะกับ production',
      'guidance_en', 'System and user prompts plus structured output that is controllable and parseable, fit for production.'
    ),
    jsonb_build_object(
      'key', 'reliability',
      'label', 'ความเสถียรและ eval',
      'label_en', 'Reliability',
      'guidance', 'มี eval หลายเคส error handling retry หรือ fallback และรู้เรื่อง cost และ latency',
      'guidance_en', 'Several eval cases, error handling, retry or fallback, and awareness of cost and latency.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงและการรัน',
      'label_en', 'Impact',
      'guidance', 'มีโค้ดที่รันได้จริงกับ input จริง พร้อมผลตามจริง โดยไม่แต่งผล',
      'guidance_en', 'Real working code that runs on real inputs, with honest results, no faking.'
    ),
    jsonb_build_object(
      'key', 'security',
      'label', 'ความปลอดภัย',
      'label_en', 'Security',
      'guidance', 'จัดการ API key และ secret อย่างปลอดภัย ระวัง prompt injection และ PII และไม่ ship output ที่ยังไม่ตรวจ',
      'guidance_en', 'API keys and secrets are handled safely, prompt injection and PII risks are managed, and unchecked output is not shipped.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-developer';

  if _p is null then
    raise exception 'ai-developer career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกสร้างฟีเจอร์และแอปที่ขับเคลื่อนด้วย LLM จริง ตั้งแต่เลือกแนวทางอาชีพ ทำ feature spec ตั้งสภาพแวดล้อมที่ปลอดภัย ออกแบบ prompt และ structured output เขียน integration จริง ทำ eval และจัดการความเสถียรและ cost ship และทำ Developer Portfolio พร้อม repo และความเข้าใจด้านความปลอดภัย',
    outcomes = array[
      'เลือกแนวทาง AI developer (เช่น เพิ่มฟีเจอร์ AI ในแอป, สร้าง AI tool/agent, ทำ AI API/service) และรู้ว่าตลาดต้องการอะไร',
      'ทำ feature spec และตั้งสภาพแวดล้อมที่จัดการ API key อย่างปลอดภัย',
      'ออกแบบ system/user prompt และ structured output (JSON schema) ที่คุมได้และ parse ได้',
      'เขียน integration จริงที่เรียก LLM ทำ eval หลายเคส และจัดการ error/retry/cost',
      'ship ฟีเจอร์ที่รันจริง เก็บผลและ cost แบบไม่แต่ง และทำ Developer Portfolio พร้อม repo และวิธีนำเสนอ'
    ],
    deliverables = array[
      'AI Feature Spec',
      'Prompt Design + Schema',
      'Working AI Feature (code + demo)',
      'Eval & Reliability Report',
      'Developer Portfolio & Playbook'
    ],
    practical_ratio = 80,
    curriculum_version = 3,
    weeks = 6,
    tools = array['Claude', 'Codex', 'ChatGPT']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-developer'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-developer';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกแนวทางและตั้งสภาพแวดล้อม', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Prompt และ Structured Output สำหรับ Production', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · สร้างจริง Eval และความเสถียร', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · Ship จริงและ Developer Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI Developer: เลือกแนวทางและให้ AI ช่วยโค้ดโดยคุณคุม design', 'lesson', 'career-ai-developer', 1, 15, 1),
    (_m1, 'Setup: ตั้งสภาพแวดล้อมและจัดการ API key อย่างปลอดภัย', 'lesson', 'career-ai-developer', 2, 15, 2),
    (_m1, 'Practice: ทำ AI Feature Spec ให้ชัด', 'lesson', 'career-ai-developer', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'ออกแบบ system/user prompt สำหรับ production', 'lesson', 'career-ai-developer', 4, 20, 1),
    (_m2, 'Practice: structured output (JSON schema) และ validation', 'lesson', 'career-ai-developer', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Feature Spec + Prompt Design + Schema',
    'checkpoint',
    'career-ai-developer',
    6,
    35,
    3,
    'รวม feature spec, การออกแบบ system/user prompt และ JSON schema สำหรับ output ให้พร้อมเขียน integration จริง',
    'ส่ง Feature Spec + Prompt Design + JSON Schema ที่ระบุ input output success criteria และวิธี parse ผล',
    '## แนวทาง/ที่จะสร้าง

## AI Feature Spec
- ฟีเจอร์นี้ทำอะไร:
- ผู้ใช้และ use case:
- input -> output:
- โมเดลที่จะใช้:
- success criteria (วัดอย่างไรว่าใช้ได้):

## Prompt Design
- system prompt:
- user prompt (โครง):

## Structured Output (JSON schema)
- ฟิลด์ที่ต้องได้:
- จะ parse และใช้ผลอย่างไร:

## ความเสี่ยง/ความปลอดภัยที่ต้องระวัง:
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'เขียน integration จริง ทำ eval set และจัดการ error/cost', 'lesson', 'career-ai-developer', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Working Integration (โค้ด + run จริง) + Eval',
    'checkpoint',
    'career-ai-developer',
    8,
    35,
    2,
    'เขียนโค้ดที่เรียก LLM จริง รันได้ พร้อม eval set หลายเคสและการจัดการ error เบื้องต้น',
    'ส่ง Working Integration ที่มีลิงก์โค้ด ผลรันจริง eval set และ error handling พร้อมข้อสังเกต cost/latency',
    '## ฟีเจอร์ที่ทำ

## โค้ด integration (เรียก API จริง) - ลิงก์ repo/gist หรือสรุปโค้ด

## ผลรันจริง (input -> output ตัวอย่าง)

## Eval set (เคสทดสอบและผลที่คาดหวัง)
1.
2.
3.

## error handling / retry / สิ่งที่ทำเมื่อผลผิดรูป

## cost/latency ที่สังเกตได้
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: AI Feature (code + demo + README)',
    'project',
    'career-ai-developer',
    9,
    50,
    3,
    'สร้างฟีเจอร์ที่ขับเคลื่อนด้วย LLM ให้รันได้จริง มีโค้ดใน repo, README วิธีรัน, ผลรันจริง และการจัดการความปลอดภัย',
    'ส่ง AI Feature ที่มีลิงก์ repo, README, prompt/schema, ผลรันจริง และการจัดการ API key/ความปลอดภัย',
    '# AI Feature

## 1. ฟีเจอร์และผู้ใช้

## 2. สถาปัตยกรรมสั้น ๆ (flow ของ input -> LLM -> output)

## 3. โค้ด (ลิงก์ repo) และวิธีรัน (README)

## 4. Prompt และ schema ที่ใช้

## 5. ตัวอย่างผลรันจริง (พร้อม screenshot/log)

## 6. การจัดการ API key และความปลอดภัย

## 7. AI ช่วยเขียนตรงไหน และฉันตรวจ/ตัดสินใจตรงไหน
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: รันกับ input จริงและเก็บผล/cost', 'lesson', 'career-ai-developer', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Eval & Reliability Report',
    'project',
    'career-ai-developer',
    11,
    45,
    2,
    'รันฟีเจอร์กับ input จริงหลากหลายหรือให้คนลองใช้ เก็บเคสที่ผ่าน/พัง cost จริง แล้วปรับ ห้ามแต่งผล',
    'ส่ง Report ที่มี input จริงที่ทดสอบ เคสผ่าน/พายตามจริง สาเหตุและวิธีแก้ cost จริง และหลักฐาน',
    '## ฟีเจอร์ที่นำไปรันจริง

## Input จริงที่ทดสอบ (กี่เคส และที่ไหน)

## เคสที่ผ่าน และเคสที่พัง (ตามจริง ห้ามแต่ง)

## สาเหตุที่พัง และวิธีแก้ (prompt/โค้ด/schema)

## cost และ latency จริงที่วัดได้

## หลักฐาน (log, screenshot, ลิงก์ repo)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Developer Portfolio & Playbook',
    'project',
    'career-ai-developer',
    12,
    70,
    3,
    'รวมงานและวิธีทำงานเป็น Developer Portfolio และ Playbook ที่เจาะแนวทางของคุณ พร้อม repo, eval, ความปลอดภัย และวิธีนำเสนอตอนสมัครงาน',
    'ส่ง Portfolio ที่มี repo + demo, กระบวนการ, prompt/schema library, eval/reliability, ความปลอดภัย และวิธีนำเสนอ',
    '# Developer Portfolio & Playbook

## 1. เกี่ยวกับฉัน + แนวทาง AI developer ที่ทำ

## 2. ปัญหาที่ฟีเจอร์นี้แก้ และใครได้ประโยชน์

## 3. ผลงาน (repo + demo + README)

## 4. กระบวนการของฉัน (Spec -> Prompt/Schema -> Integration -> Eval -> Ship)

## 5. Prompt / Schema Library ที่ใช้ซ้ำได้

## 6. Eval และวิธีทำให้เชื่อถือได้ (error handling, retry, cost)

## 7. ความปลอดภัย (API key, prompt injection, PII)

## 8. ฉันใช้ AI ช่วยตรงไหน และนำเสนอตอนสมัครงานอย่างไร
- AI ช่วยตรงไหน:
- ส่วนที่เป็น design/การตัดสินใจของฉันเอง:
- จะอธิบายความน่าเชื่อถือและความปลอดภัยให้ทีม/ผู้สัมภาษณ์อย่างไร:

## 9. สิ่งที่จะพัฒนาต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-developer v3 must have exactly 12 steps';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 039 · AI for Teacher  (039_ai_teacher_career_v3.sql)
-- ---------------------------------------------------------------------------
do $$
declare
  _p uuid;
  _m1 uuid; _m2 uuid; _m3 uuid; _m4 uuid;
  _step_count int;
  _previous_version int;
  _rubric jsonb := jsonb_build_array(
    jsonb_build_object(
      'key', 'clarity',
      'label', 'ความชัดเจนของเป้าหมาย',
      'label_en', 'Clarity',
      'guidance', 'learning objectives บริบท และผู้เรียนต้องชัดก่อนวางแผนบทเรียน',
      'guidance_en', 'The learning objectives, context, and learners are clear before planning.'
    ),
    jsonb_build_object(
      'key', 'pedagogy',
      'label', 'การออกแบบการสอน',
      'label_en', 'Pedagogy',
      'guidance', 'บทเรียน สื่อ และกิจกรรมตรงกับ objective และเหมาะกับระดับผู้เรียน พร้อมการปรับระดับ',
      'guidance_en', 'Lessons, materials, and activities match the objectives and the level of the learners, with differentiation.'
    ),
    jsonb_build_object(
      'key', 'assessment',
      'label', 'การประเมินและ feedback',
      'label_en', 'Assessment',
      'guidance', 'ข้อสอบ rubric และ feedback ตรงกับ objective ยุติธรรม และสร้างสรรค์',
      'guidance_en', 'Assessments, rubrics, and feedback align with the objectives, stay fair, and are constructive.'
    ),
    jsonb_build_object(
      'key', 'impact',
      'label', 'ผลจริงในห้องเรียน',
      'label_en', 'Impact',
      'guidance', 'นำสื่อไปใช้กับผู้เรียนจริง และเก็บผลหรือ feedback จริง โดยไม่แต่งผล',
      'guidance_en', 'Materials are used with real learners and real results or feedback are collected, no faking.'
    ),
    jsonb_build_object(
      'key', 'integrity',
      'label', 'ความถูกต้องและความรับผิดชอบ',
      'label_en', 'Accuracy and responsibility',
      'guidance', 'ตรวจความถูกต้องของเนื้อหา ปกป้องข้อมูลส่วนตัวนักเรียน และครูเป็นคนตัดสินสุดท้าย ไม่ใช่ AI',
      'guidance_en', 'Content accuracy is checked, student privacy is protected, and the teacher makes the final judgement, not the AI.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-teacher';

  if _p is null then
    raise exception 'ai-for-teacher career path not found';
  end if;

  update career_paths
  set
    description = 'ใช้ AI ช่วยงานครูครบวงจรอย่างมืออาชีพและมีความรับผิดชอบ ตั้งแต่เลือกบริบทการสอน ตั้งเป้าหมายการเรียนรู้ วาง lesson plan ทำสื่อและข้อสอบที่ตรวจความถูกต้องแล้ว สร้าง rubric และ feedback นำไปสอนจริงและเก็บผล แล้วรวมเป็น Teaching Portfolio พร้อมดูแลความเป็นส่วนตัวของนักเรียนและความซื่อสัตย์ทางวิชาการ',
    outcomes = array[
      'เลือกบริบทการสอน (ระดับ วิชา บทบาท) และตั้งเป้าหมายการเรียนรู้ที่ชัด',
      'วาง lesson plan ที่อิง objective และปรับระดับผู้เรียน (differentiation)',
      'ทำสื่อ ใบงาน และข้อสอบที่ตรงเป้าหมาย พร้อมตรวจความถูกต้อง',
      'สร้าง rubric และ feedback ที่ยุติธรรมและสร้างสรรค์ โดยครูเป็นคนตัดสินสุดท้าย',
      'นำไปสอนจริง เก็บผลจากผู้เรียนแบบไม่แต่ง และทำ Teaching Portfolio พร้อมเข้าใจความเป็นส่วนตัวและความซื่อสัตย์ทางวิชาการ'
    ],
    deliverables = array[
      'Teaching Context & Objectives',
      'Lesson Plan + Materials',
      'Assessment + Rubric',
      'Classroom Result & Reflection',
      'Teaching Portfolio & Playbook'
    ],
    practical_ratio = 75,
    curriculum_version = 3,
    weeks = 5,
    tools = array['ChatGPT', 'Claude', 'Gemini']
  where id = _p;

  if coalesce(_previous_version, 1) <> 3 then
    insert into career_path_progress_archive (user_id, course_id, lessons_done, previous_updated_at, curriculum_version)
    select user_id, course_id, lessons_done, updated_at, coalesce(_previous_version, 1)
    from course_progress
    where course_id = 'path:ai-for-teacher'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-teacher';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · เลือกบริบทและตั้งระบบ', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · วางแผนบทเรียนและสื่อ', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · ประเมินและให้ feedback', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · สอนจริงและ Teaching Portfolio', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Teacher: เลือกบริบทและให้ AI ช่วยโดยครูคุมการตัดสิน', 'lesson', 'career-ai-for-teacher', 1, 15, 1),
    (_m1, 'Setup: ตั้ง Teaching Workspace และกฎความเป็นส่วนตัวนักเรียน', 'lesson', 'career-ai-for-teacher', 2, 15, 2),
    (_m1, 'Practice: ทำ Teaching Context และ Learning Objectives', 'lesson', 'career-ai-for-teacher', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'วาง Lesson Plan ที่อิงเป้าหมายและปรับระดับผู้เรียน', 'lesson', 'career-ai-for-teacher', 4, 20, 1),
    (_m2, 'Practice: ทำสื่อและใบงานที่ตรงเป้าหมายและตรวจความถูกต้อง', 'lesson', 'career-ai-for-teacher', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Context + Lesson Plan + Materials',
    'checkpoint',
    'career-ai-for-teacher',
    6,
    35,
    3,
    'รวมบริบทการสอน learning objectives lesson plan และสื่อที่ตรงเป้าหมายและตรวจความถูกต้องแล้ว',
    'ส่ง Context + Objectives + Lesson Plan + Materials ที่อิง objective ปรับระดับผู้เรียน และตรวจความถูกต้องแล้ว',
    '## บริบทการสอน
- ระดับ/วิชา:
- ผู้เรียน (จำนวน/พื้นฐาน):

## Learning Objectives (สิ่งที่ผู้เรียนจะทำได้)
1.
2.

## Lesson Plan
- เปิด (ดึงความสนใจ):
- กิจกรรมหลัก (อิง objective):
- สรุป/ตรวจความเข้าใจ:

## สื่อ/ใบงาน
- รายการสื่อที่ทำ:

## การปรับระดับผู้เรียน (differentiation):

## จุดที่ต้องตรวจความถูกต้องก่อนใช้:
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'ออกข้อสอบ rubric และ feedback ที่ครูตรวจก่อนใช้', 'lesson', 'career-ai-for-teacher', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Assessment + Rubric + Feedback',
    'checkpoint',
    'career-ai-for-teacher',
    8,
    35,
    2,
    'ออกข้อสอบหรือแบบประเมินที่ตรง objective พร้อม rubric และตัวอย่าง feedback ที่สร้างสรรค์ โดยครูตรวจก่อนใช้',
    'ส่ง Assessment + Rubric + ตัวอย่าง feedback ที่ตรง objective ยุติธรรม และระบุสิ่งที่ครูต้องตรวจก่อนใช้',
    '## บทเรียนที่ประเมิน

## ข้อสอบ/แบบประเมิน (ตรง objective ข้อไหน)
1.
2.

## Rubric (เกณฑ์ให้คะแนน)

## ตัวอย่าง feedback ที่สร้างสรรค์

## สิ่งที่ครูต้องตรวจ/แก้ก่อนใช้จริง (ความถูกต้อง/ความยุติธรรม):
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Complete Lesson Kit',
    'project',
    'career-ai-for-teacher',
    9,
    50,
    3,
    'รวม lesson plan สื่อ และการประเมินเป็นชุดบทเรียนที่พร้อมใช้สอนจริง พร้อมตรวจความถูกต้องและดูแลความเป็นส่วนตัว',
    'ส่ง Complete Lesson Kit ที่มีบริบท objective lesson plan สื่อ assessment rubric differentiation และจุดที่ตรวจแล้ว',
    '# Complete Lesson Kit

## 1. บริบทและ learning objectives

## 2. Lesson plan (เปิด-กิจกรรม-สรุป)

## 3. สื่อและใบงาน (พร้อมใช้)

## 4. ข้อสอบ/แบบประเมิน + rubric

## 5. การปรับระดับผู้เรียน (differentiation)

## 6. จุดที่ตรวจความถูกต้องแล้ว และความเป็นส่วนตัวของนักเรียน

## 7. AI ช่วยตรงไหน และครูตัดสิน/ตรวจตรงไหน
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Run: นำไปสอนจริงและเก็บผลจากผู้เรียน', 'lesson', 'career-ai-for-teacher', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Classroom Result & Reflection Report',
    'project',
    'career-ai-for-teacher',
    11,
    45,
    2,
    'นำบทเรียนหรือสื่อไปใช้กับผู้เรียนจริง สังเกตความเข้าใจและผล แล้วสะท้อนและปรับ ห้ามแต่งผล',
    'ส่ง Report ที่มีบทเรียนที่ใช้จริง ผู้เรียนกลุ่มไหน ผลความเข้าใจ เวลาที่ประหยัด สิ่งที่ปรับ และหลักฐานแบบไม่เปิดเผยตัวตน',
    '## บทเรียน/สื่อที่นำไปใช้จริง

## ใช้กับผู้เรียนกลุ่มไหน และเมื่อไร

## ผู้เรียนเข้าใจไหม (สังเกต/ผลงาน/คะแนน)

## เวลาที่ประหยัดเทียบกับทำเอง

## สิ่งที่เวิร์ก และสิ่งที่ต้องปรับ (ตามจริง ห้ามแต่ง)

## หลักฐาน (ผลงานนักเรียนแบบไม่เปิดเผยตัวตน, ภาพ, บันทึก)
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Teaching Portfolio & Playbook',
    'project',
    'career-ai-for-teacher',
    12,
    70,
    3,
    'รวมงานและวิธีทำงานเป็น Teaching Portfolio และ Playbook ที่ใช้ซ้ำได้ พร้อมเรื่องความถูกต้อง ความเป็นส่วนตัว และการใช้ AI อย่างรับผิดชอบ',
    'ส่ง Portfolio ที่มีตัวอย่างผลงาน กระบวนการ prompt library ความถูกต้อง/ความเป็นส่วนตัว และวิธีนำเสนอ',
    '# Teaching Portfolio & Playbook

## 1. เกี่ยวกับฉัน + บริบทการสอนที่ทำ

## 2. ปัญหา/งานที่ AI ช่วยให้ดีขึ้น และใครได้ประโยชน์ (ผู้เรียน/โรงเรียน)

## 3. ตัวอย่างผลงาน (lesson kit, สื่อ, assessment)

## 4. กระบวนการของฉัน (Objective -> Plan -> Materials -> Assess -> Reflect)

## 5. Prompt Library สำหรับงานครู
- วางแผนบทเรียน:
- ทำสื่อ/ใบงาน:
- ออกข้อสอบ/rubric:
- ให้ feedback/สรุปงาน:

## 6. ความถูกต้อง ความเป็นส่วนตัวนักเรียน และความซื่อสัตย์ทางวิชาการ

## 7. ฉันใช้ AI ช่วยตรงไหน และครูตัดสินตรงไหน
- AI ช่วยตรงไหน:
- ส่วนที่เป็นวิจารณญาณของครู:
- จะอธิบายการใช้ AI อย่างรับผิดชอบให้เพื่อนครู/ผู้ปกครองอย่างไร:

## 8. สิ่งที่จะพัฒนาต่อไป
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-teacher v3 must have exactly 12 steps';
  end if;
end $$;

