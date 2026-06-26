-- Migration 034: AI for Productivity career path v3
-- Rebuilds AI for Productivity into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-for-productivity instead of daily lessons.

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
