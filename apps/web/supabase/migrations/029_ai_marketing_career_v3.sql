-- Migration 029: AI for Marketing career path v3
-- Rebuilds the third career path into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-for-marketing instead of daily lessons.

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
      'guidance', 'โจทย์การตลาด เป้าหมาย ลูกค้า สินค้า และผลลัพธ์ที่ต้องส่งต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The marketing task, goal, customer, product, and deliverable are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'insight',
      'label', 'Insight ลูกค้า',
      'label_en', 'Customer insight',
      'guidance', 'แยก pain, desire, barrier, trigger และ evidence ได้ ไม่ใช่แค่ demographic กว้าง ๆ',
      'guidance_en', 'Pain, desire, barrier, trigger, and evidence are clear, not just broad demographics.'
    ),
    jsonb_build_object(
      'key', 'message',
      'label', 'Message และข้อเสนอ',
      'label_en', 'Message and offer',
      'guidance', 'Positioning, promise, proof, offer และ CTA เชื่อมกันและเหมาะกับช่องทาง',
      'guidance_en', 'Positioning, promise, proof, offer, and CTA connect and fit the channel.'
    ),
    jsonb_build_object(
      'key', 'measurement',
      'label', 'การวัดผล',
      'label_en', 'Measurement',
      'guidance', 'มี metric, hypothesis, test plan, real run result หรือ decision rule ที่ช่วยตัดสินใจต่อได้',
      'guidance_en', 'Metrics, hypotheses, test plans, real run results, or decision rules support the next decision.'
    ),
    jsonb_build_object(
      'key', 'fact_check',
      'label', 'การตรวจข้อเท็จจริงและความเสี่ยง',
      'label_en', 'Fact/risk check',
      'guidance', 'ตรวจ claim ตัวเลข แหล่งข้อมูล คำกล่าวเกินจริง ข้อจำกัดแบรนด์ และ human review',
      'guidance_en', 'Claims, numbers, sources, exaggeration, brand constraints, and human review are checked.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-marketing';

  if _p is null then
    raise exception 'ai-for-marketing career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ทำงานการตลาดครบ workflow ตั้งแต่ research, customer insight, campaign brief, message matrix, copy, real campaign run, A/B test และ marketing playbook ที่ใช้กับสินค้า/บริการจริงได้',
    outcomes = array[
      'ตั้งโจทย์ research และแยก fact, assumption, need check ได้',
      'เปลี่ยนข้อมูลลูกค้าเป็น insight, positioning และ campaign brief ได้',
      'สร้าง message matrix และ copy หลายช่องทางที่ไม่หลุดทิศ',
      'ออกแบบ A/B test พร้อม metric และ decision rule ได้',
      'รันแคมเปญเล็ก ๆ หรือ smoke test กับคนจริงและเก็บผลจริงได้',
      'ทำ Marketing Playbook พร้อม prompt, KPI, real results และแผนปรับแคมเปญ'
    ],
    deliverables = array[
      'Marketing Work Brief',
      'Customer Insight Map',
      'Campaign Brief',
      'Message Matrix & Copy Pack',
      'Real Campaign Run Log',
      'Marketing Playbook Portfolio'
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
    where course_id = 'path:ai-for-marketing'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-marketing';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · Research และ Customer Insight', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Campaign Brief และ Message', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · Copy, Testing และ Campaign Kit', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · Real Run, Optimization และ Marketing Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI Marketing ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-for-marketing', 1, 15, 1),
    (_m1, 'Setup: เตรียม Marketing Workspace และ Research Sources', 'lesson', 'career-ai-for-marketing', 2, 15, 2),
    (_m1, 'Practice: สร้าง Customer Insight Map', 'lesson', 'career-ai-for-marketing', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Campaign Brief, Positioning และ Metric', 'lesson', 'career-ai-for-marketing', 4, 20, 1),
    (_m2, 'Practice: สร้าง Message Matrix และ Copy ชุดแรก', 'lesson', 'career-ai-for-marketing', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Research & Insight Brief',
    'checkpoint',
    'career-ai-for-marketing',
    6,
    35,
    3,
    'สรุป research และ customer insight สำหรับสินค้า/บริการหนึ่งอย่าง โดยแยก fact, assumption และสิ่งที่ต้องตรวจเพิ่มให้ชัด ก่อนนำไปทำ campaign',
    'ส่ง Research & Insight Brief ที่มี audience, pain/desire/barrier/trigger, competitor notes, evidence/source และ assumption ที่ต้องตรวจ',
    '## สินค้า/บริการ

## Audience

## Customer Insight
- Pain:
- Desire:
- Barrier:
- Trigger:
- Alternative:

## Competitor / Alternative Notes
1.
2.
3.

## Evidence / Source
- Fact:
- Source:

## Assumption ที่ต้องตรวจเพิ่ม
1.
2.

## Campaign angle ที่น่าทดสอบ
1.
2.
3.
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'A/B Test และ Quality Check สำหรับ Copy', 'lesson', 'career-ai-for-marketing', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: A/B Test Plan',
    'checkpoint',
    'career-ai-for-marketing',
    8,
    35,
    2,
    'ออกแบบการทดสอบ message หรือ copy 2 เวอร์ชัน โดยมี hypothesis, variable, metric และ decision rule ที่ใช้ตัดสินใจได้',
    'ส่ง A/B Test Plan พร้อม Version A/B, primary metric, secondary metric, risk/claim check และเกณฑ์เลือกผู้ชนะ',
    '## สิ่งที่จะทดสอบ

## Hypothesis

## Version A
- Message/Hook:
- Copy:
- CTA:

## Version B
- Message/Hook:
- Copy:
- CTA:

## Variable ที่เปลี่ยน

## Metrics
- Primary:
- Secondary:

## Decision rule

## Risk / Claim check ก่อนรัน
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Multi-channel Campaign Kit',
    'project',
    'career-ai-for-marketing',
    9,
    50,
    3,
    'สร้าง campaign kit สำหรับสินค้า/บริการหนึ่งรายการ โดยเชื่อม insight, brief, message matrix และ copy หลายช่องทางเข้าด้วยกัน',
    'ส่ง Campaign Kit ที่มี campaign brief, message matrix, ad copy, email copy, landing hero, CTA, visual direction และ metric',
    '# Multi-channel Campaign Kit

## Campaign Brief
- Objective:
- Audience:
- Insight:
- Positioning:
- Promise:
- Proof:
- Offer:
- Metric:

## Message Matrix
| Segment | Pain | Promise | Proof | Objection | CTA |
|---|---|---|---|---|---|

## Copy Pack
### Ad Copy 1

### Ad Copy 2

### Email

### Landing Hero

### Social Post

## Visual Direction

## Claim / Risk Checklist
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Real Campaign Run และ Results Log', 'lesson', 'career-ai-for-marketing', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Real Campaign Results Report',
    'project',
    'career-ai-for-marketing',
    11,
    45,
    2,
    'นำ campaign kit หรือ test plan ไปรันแบบเล็กและปลอดภัยกับคนจริง เช่น organic post, email/DM ที่ได้รับอนุญาต, community post ที่ไม่ผิดกฎ, survey หรือ landing/waitlist แล้ววิเคราะห์ผลจริงอย่างมีวินัย',
    'ส่ง Real Campaign Results Report ที่มีช่องทางที่รัน หลักฐาน/ลิงก์/screenshot ตัวเลขหรือ feedback จริง observation, interpretation, action และสิ่งที่จะทดสอบต่อ',
    '## Campaign / Test ที่รันจริง

## ช่องทางที่ใช้

## กลุ่มคนที่เห็นหรือให้ feedback

## หลักฐาน
- Link:
- Screenshot / export:
- จำนวน response:

## Results
| Version/Channel | Metric/Feedback | Result | Note |
|---|---:|---:|---|

## Observation

## Interpretation

## Action

## Do again

## Stop

## Need more data

## Next test

## Ethics / Consent check
- ไม่ spam:
- ได้รับอนุญาตก่อนส่ง DM/email:
- ไม่ใช้ claim ที่ยังตรวจไม่ได้:
- ไม่เก็บข้อมูลส่วนตัวโดยไม่ยินยอม:
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Marketing Playbook Portfolio',
    'project',
    'career-ai-for-marketing',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Marketing Playbook สำหรับสินค้า/บริการหนึ่งรายการ ให้คนอื่นในทีมใช้ซ้ำได้ ตั้งแต่ research, brief, copy, real run, test และ optimization',
    'ส่ง Marketing Playbook Portfolio ที่มี work brief, insight map, campaign brief, message matrix, copy pack, real run log, results report, prompt library และ KPI checklist',
    '# Marketing Playbook Portfolio

## 1. Marketing Work Brief

## 2. Research & Insight Summary

## 3. Campaign Brief

## 4. Message Matrix

## 5. Copy Pack
- Ad:
- Email:
- Landing:
- Social:

## 6. Real Campaign Run Log
- Channel:
- Audience/reviewer:
- Link/evidence:
- Metrics/feedback:
- Consent/risk note:

## 7. A/B Test Plan / Next Test

## 8. Results & Optimization Report

## 9. Prompt Library
- Research prompt:
- Insight prompt:
- Copy prompt:
- Test review prompt:
- Optimization prompt:

## 10. KPI / Claim / Human Review Checklist

## 11. วิธีใช้ playbook นี้ในทีม
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-marketing v3 must have exactly 12 steps';
  end if;
end $$;
