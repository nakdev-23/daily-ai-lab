-- Migration 037: AI for Image & Design career path v3
-- Rebuilds AI for Image into a career-native curriculum with a Real-Tool Mission.
-- Lessons load from /content/career-paths/ai-for-image instead of daily lessons.

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
