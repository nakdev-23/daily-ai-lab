-- Migration 032: AI for Students learning path v3
-- Rebuilds AI for Students into a study/portfolio curriculum inside career paths.
-- Lessons load from /content/career-paths/ai-for-students instead of daily lessons.

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
