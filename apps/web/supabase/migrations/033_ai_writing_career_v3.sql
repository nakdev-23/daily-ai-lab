-- Migration 033: AI for Writing career path v3
-- Rebuilds AI for Writing into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-for-writing instead of daily lessons.

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
