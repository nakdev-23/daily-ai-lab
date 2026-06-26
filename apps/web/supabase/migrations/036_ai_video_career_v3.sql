-- Migration 036: AI for Video career path v3
-- Rebuilds AI for Video into a career-native curriculum with a Real-Tool Mission.
-- Lessons load from /content/career-paths/ai-for-video instead of daily lessons.

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
