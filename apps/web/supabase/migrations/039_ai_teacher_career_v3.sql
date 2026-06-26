-- Migration 039: AI for Teacher career path v3
-- Rebuilds AI for Teacher into a career-native curriculum for educators.
-- Lessons load from /content/career-paths/ai-for-teacher instead of daily lessons.

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
