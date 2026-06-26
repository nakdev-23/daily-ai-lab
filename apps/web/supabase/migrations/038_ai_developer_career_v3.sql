-- Migration 038: AI Developer career path v3
-- Rebuilds AI Developer into a career-native curriculum: build a real LLM-powered feature.
-- Lessons load from /content/career-paths/ai-developer instead of daily lessons.

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
