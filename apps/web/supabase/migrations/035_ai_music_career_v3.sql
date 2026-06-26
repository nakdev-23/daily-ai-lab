-- Migration 035: AI for Music career path v3
-- Rebuilds AI for Music into a career-native curriculum with a Real-Tool Mission.
-- Lessons load from /content/career-paths/ai-for-music instead of daily lessons.

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
