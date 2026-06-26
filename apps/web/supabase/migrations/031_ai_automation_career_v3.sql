-- Migration 031: AI for Automation career path v3
-- Rebuilds AI for Automation into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-for-automation instead of daily lessons.

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
