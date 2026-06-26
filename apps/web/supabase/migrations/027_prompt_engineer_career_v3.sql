-- Migration 027: Prompt Engineer career path v3
-- Rebuilds the first career path into a career-native curriculum.
-- Lessons load from /content/career-paths/prompt-engineer instead of daily lessons.

-- Keep this migration runnable even if 025/026 were not applied yet in a
-- manual SQL editor session. These are no-op when the previous migrations
-- already created the columns/tables.
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
