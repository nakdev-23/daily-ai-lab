-- Migration 030: AI for Business career path v3
-- Rebuilds AI for Business into a career-native curriculum.
-- Lessons load from /content/career-paths/ai-for-business instead of daily lessons.

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
      'guidance', 'โจทย์ธุรกิจ ผู้ตัดสินใจ ผลลัพธ์ และ next step ต้องอ่านแล้วเข้าใจทันที',
      'guidance_en', 'The business task, decision owner, output, and next step are immediately clear.'
    ),
    jsonb_build_object(
      'key', 'evidence',
      'label', 'หลักฐานและข้อเท็จจริง',
      'label_en', 'Evidence',
      'guidance', 'แยก fact, assumption, source และ need check ได้ ไม่ทำให้สมมติฐานดูเป็นข้อเท็จจริง',
      'guidance_en', 'Facts, assumptions, sources, and need-check items are separated.'
    ),
    jsonb_build_object(
      'key', 'decision_quality',
      'label', 'คุณภาพการตัดสินใจ',
      'label_en', 'Decision quality',
      'guidance', 'มี criteria, options, trade-off, risk, recommendation และ decision rule ที่ตรวจได้',
      'guidance_en', 'Criteria, options, trade-offs, risks, recommendations, and decision rules are auditable.'
    ),
    jsonb_build_object(
      'key', 'workflow',
      'label', 'นำไปใช้ในทีมได้',
      'label_en', 'Operational usability',
      'guidance', 'มี owner, timeline, SOP, exception, quality check และ approval point ชัดเจน',
      'guidance_en', 'Owner, timeline, SOP, exceptions, quality checks, and approval points are clear.'
    ),
    jsonb_build_object(
      'key', 'risk_review',
      'label', 'ความปลอดภัยและ human review',
      'label_en', 'Risk and human review',
      'guidance', 'มีกฎข้อมูล จุดที่ห้ามใช้ AI จุดที่ต้องให้คนตรวจ และ feedback จาก stakeholder จริง',
      'guidance_en', 'Data rules, AI boundaries, human review points, and real stakeholder feedback are included.'
    )
  );
begin
  select id, curriculum_version into _p, _previous_version
  from career_paths
  where slug = 'ai-for-business';

  if _p is null then
    raise exception 'ai-for-business career path not found';
  end if;

  update career_paths
  set
    description = 'ฝึกใช้ AI ทำงานธุรกิจจริง ตั้งแต่ executive brief, decision memo, proposal, SOP, human review workflow และ Team AI Playbook ที่ทีมใช้ซ้ำได้อย่างปลอดภัย',
    outcomes = array[
      'เลือกงานธุรกิจที่เหมาะกับ AI และตั้งกฎข้อมูลให้ทีมได้',
      'สรุปเอกสารเป็น executive brief ที่ช่วยตัดสินใจได้',
      'ทำ decision memo, decision matrix และ proposal พร้อม risk/assumption ได้',
      'แปลงงานซ้ำเป็น SOP พร้อม exception, owner และ quality check ได้',
      'นำเอกสารไปให้ stakeholder review และปรับเป็น Team AI Playbook ที่ใช้จริงได้'
    ],
    deliverables = array[
      'Business Work Brief',
      'Executive Brief',
      'Decision Memo & Proposal',
      'SOP Pack',
      'Team AI Playbook Portfolio'
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
    where course_id = 'path:ai-for-business'
      and not exists (
        select 1
        from career_path_progress_archive a
        where a.user_id = course_progress.user_id
          and a.course_id = course_progress.course_id
          and a.curriculum_version = coalesce(_previous_version, 1)
      );

    delete from course_progress where course_id = 'path:ai-for-business';
  end if;

  delete from path_modules where path_id = _p;

  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 1 · Business Brief และ Data Rules', 1) returning id into _m1;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 2 · Decision Memo และ Proposal', 2) returning id into _m2;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 3 · SOP และ Human Review', 3) returning id into _m3;
  insert into path_modules (path_id, title, order_index)
  values (_p, 'Module 4 · Stakeholder Feedback และ Playbook', 4) returning id into _m4;

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m1, 'AI for Business ทำงานอะไรในโลกจริง', 'lesson', 'career-ai-for-business', 1, 15, 1),
    (_m1, 'Setup: ตั้ง Workspace และกฎข้อมูลทีม', 'lesson', 'career-ai-for-business', 2, 15, 2),
    (_m1, 'Practice: Executive Brief 1 หน้า', 'lesson', 'career-ai-for-business', 3, 20, 3);

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m2, 'Decision Memo, Risk และ Trade-off', 'lesson', 'career-ai-for-business', 4, 20, 1),
    (_m2, 'Practice: Proposal พร้อมข้อจำกัดและแผนตรวจผล', 'lesson', 'career-ai-for-business', 5, 20, 2);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m2,
    'Checkpoint: Executive Brief + Decision Memo',
    'checkpoint',
    'career-ai-for-business',
    6,
    35,
    3,
    'รวม executive brief และ decision memo สำหรับโจทย์ธุรกิจหนึ่งเรื่อง โดยแยก fact, assumption, options, criteria, risk และ recommendation ให้ชัดเจน',
    'ส่ง Executive Brief + Decision Memo ที่มี decision needed, options 3 ทาง, decision matrix, recommendation, risk และ need check ก่อนอนุมัติ',
    '## Business case

## Executive Brief
- Context:
- Key facts:
- Assumptions:
- Decision needed:
- Recommendation:
- Next steps:

## Decision Memo
| Criteria | Weight | Option A | Option B | Option C | Evidence / Note |
|---|---:|---:|---:|---:|---|

## Risks
1.
2.
3.

## Need check before approval
1.
2.

## Human reviewer / approver
',
    _rubric,
    false
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m3, 'SOP: แปลงงานซ้ำเป็นขั้นตอนที่ทีมทำตามได้', 'lesson', 'career-ai-for-business', 7, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Checkpoint: Human Review Workflow',
    'checkpoint',
    'career-ai-for-business',
    8,
    35,
    2,
    'ออกแบบ workflow ว่าตรงไหน AI ช่วยได้ ตรงไหนต้องให้คนตรวจ ใครอนุมัติ และถ้าเจอข้อมูลไม่ครบหรือความเสี่ยงสูงต้อง escalate อย่างไร',
    'ส่ง Human Review Workflow ที่มี AI-assisted steps, human review points, approval owner, escalation rules และ data safety rules',
    '## Workflow ที่ออกแบบ

## AI-assisted steps
1.
2.
3.

## Human review points
| Step | What to check | Reviewer | Approval needed |
|---|---|---|---|

## Escalation rules
- ถ้าข้อมูลไม่ครบ:
- ถ้าความเสี่ยงสูง:
- ถ้าเกี่ยวกับลูกค้า/พนักงาน/เงิน:

## Data safety rules

## Audit log: ต้องบันทึกอะไรไว้
',
    _rubric,
    false
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m3,
    'Project: Business Document Pack',
    'project',
    'career-ai-for-business',
    9,
    50,
    3,
    'สร้างชุดเอกสารธุรกิจสำหรับ case เดียวกัน ประกอบด้วย executive brief, decision memo, proposal และ SOP โดยทุกชิ้นต้องแยก fact/assumption/risk และมี human review point',
    'ส่ง Business Document Pack ที่มี brief, memo, proposal, SOP, data rules, review workflow และ checklist ก่อนนำไปใช้จริง',
    '# Business Document Pack

## 1. Business Work Brief

## 2. Executive Brief

## 3. Decision Memo

## 4. Proposal

## 5. SOP

## 6. Human Review Workflow

## 7. Data Rules

## 8. Checklist before use
- Fact checked:
- Assumptions labeled:
- Data safe:
- Reviewer assigned:
- Approval owner:
',
    _rubric,
    true
  );

  insert into path_steps (module_id, title, kind, course_slug, lesson_num, xp, order_index) values
    (_m4, 'Stakeholder Review และ Action Items', 'lesson', 'career-ai-for-business', 10, 20, 1);

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Project: Stakeholder Feedback Revision',
    'project',
    'career-ai-for-business',
    11,
    45,
    2,
    'นำเอกสารหนึ่งชิ้นไปให้ stakeholder หรือคนที่เข้าใจงานนั้น review จริง แล้วปรับเอกสารตาม feedback พร้อมเก็บ action items',
    'ส่ง revision report ที่มี reviewer role, feedback จริง, action items, สิ่งที่ AI ช่วยปรับ, สิ่งที่คนต้องตัดสินใจเอง และ before/after ของเอกสาร',
    '## Document reviewed

## Reviewer / role

## Review evidence
- Date:
- Screenshot / comment / meeting note:

## Feedback received

## Action items
| Action | Owner | Deadline | Evidence needed |
|---|---|---|---|

## Before revision

## After revision

## What AI helped improve

## What human must decide
',
    _rubric,
    true
  );

  insert into path_steps (
    module_id, title, kind, course_slug, lesson_num, xp, order_index,
    brief, deliverable, starter_template, rubric, is_portfolio
  ) values (
    _m4,
    'Final Project: Team AI Playbook Portfolio',
    'project',
    'career-ai-for-business',
    12,
    70,
    3,
    'รวมทุกอย่างเป็น Team AI Playbook สำหรับหน่วยงานหนึ่งทีม ให้ทีมรู้ว่าจะใช้ AI กับงานไหน ใช้ prompt ไหน ข้อมูลอะไรห้ามใช้ ตรงไหนต้องให้คนตรวจ และเอกสารตัวอย่างหน้าตาอย่างไร',
    'ส่ง Team AI Playbook Portfolio ที่มี usage rules, executive brief template, decision memo template, proposal template, SOP pack, review workflow, stakeholder feedback และ management-ready summary',
    '# Team AI Playbook Portfolio

## 1. ใช้สำหรับทีม/หน่วยงาน

## 2. AI Usage Rules
- Allowed work:
- Data allowed:
- Data forbidden:
- Human review required:

## 3. Prompt Library
- Executive brief prompt:
- Decision memo prompt:
- Proposal prompt:
- SOP prompt:
- Meeting/action item prompt:

## 4. Templates
- Executive Brief:
- Decision Memo:
- Proposal:
- SOP:

## 5. Business Document Pack

## 6. Human Review Workflow

## 7. Stakeholder Feedback & Revision Evidence

## 8. Management-ready Summary
- What changed:
- Business value:
- Risks:
- Next decision:

## 9. วิธีใช้ playbook นี้ในทีม
',
    _rubric,
    true
  );

  select count(*) into _step_count
  from path_modules pm
  join path_steps ps on ps.module_id = pm.id
  where pm.path_id = _p;

  if _step_count <> 12 then
    raise exception 'ai-for-business v3 must have exactly 12 steps';
  end if;
end $$;
