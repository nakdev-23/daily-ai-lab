-- Migration 026: job-ready Career Paths, 70% practice / 30% theory
-- Rebuilds curriculum version 2 for all 13 published paths.
-- Existing certificates remain valid. In-progress path counters are archived
-- and reset because the old step positions do not describe the new curriculum.
-- Run after 025_learning_projects.sql.

alter table career_paths add column if not exists outcomes text[] not null default '{}';
alter table career_paths add column if not exists deliverables text[] not null default '{}';
alter table career_paths add column if not exists practical_ratio int not null default 0
  check (practical_ratio between 0 and 100);
alter table career_paths add column if not exists curriculum_version int not null default 1;

create table if not exists career_path_progress_archive (
  id                 bigint generated always as identity primary key,
  user_id            uuid not null references auth.users(id) on delete cascade,
  course_id          text not null,
  lessons_done       int not null,
  previous_updated_at timestamptz,
  archived_at        timestamptz not null default now(),
  curriculum_version int not null
);

alter table career_path_progress_archive enable row level security;

drop policy if exists "admins read archived path progress" on career_path_progress_archive;
create policy "admins read archived path progress"
  on career_path_progress_archive for select to authenticated
  using ((select is_admin((select auth.uid()))));

create temporary table job_ready_curricula (
  slug          text primary key,
  description   text not null,
  outcomes      text[] not null,
  deliverables  text[] not null,
  step_titles   text[] not null,
  course_slugs  text[] not null,
  lesson_nums   int[] not null
) on commit drop;

insert into job_ready_curricula values
(
  'prompt-engineer',
  'ออกแบบ Prompt และระบบคำสั่งสำหรับงานจริง วัดคุณภาพ ปรับซ้ำ และส่งมอบเป็น Prompt Library ที่ทีมใช้ต่อได้',
  array['วิเคราะห์โจทย์และเลือกเทคนิค Prompt ได้','สร้าง Prompt Template ที่ใช้ซ้ำได้','ทดสอบผลลัพธ์ข้ามโมเดล','จัดทำ Prompt Library พร้อมคู่มือ'],
  array['Prompt Brief','Prompt Template Pack','Evaluation Sheet','Prompt Library'],
  array[
    'เข้าใจงานของ Prompt Engineer และข้อจำกัดของโมเดล',
    'แยกโจทย์เป็นเป้าหมาย บริบท ข้อจำกัด และรูปแบบ',
    'Checkpoint: แก้ Prompt ที่คลุมเครือจากโจทย์ลูกค้า',
    'เลือก Role, Example และ Output Contract ให้เหมาะกับงาน',
    'Checkpoint: สร้าง Prompt สำหรับอีเมล รายงาน และวิเคราะห์ข้อมูล',
    'Checkpoint: ทดสอบ Prompt เดียวกันกับ ChatGPT, Claude และ Gemini',
    'Checkpoint: สร้างเกณฑ์วัดความแม่น ความครบ และความสม่ำเสมอ',
    'Project: Prompt Template Pack สำหรับงานหนึ่งสายอาชีพ',
    'Checkpoint: Review และปรับ Prompt จากผลทดสอบ 3 รอบ',
    'Final project: Prompt Library พร้อมคู่มือใช้ในทีม'
  ],
  array['chatgpt-basic','chatgpt-basic','chatgpt-basic','chatgpt-advanced','chatgpt-advanced','claude-basic','gemini-basic','chatgpt-advanced','claude-basic','chatgpt-advanced'],
  array[4,5,6,2,3,4,7,9,10,11]
),
(
  'ai-content-creator',
  'สร้างระบบผลิตคอนเทนต์ตั้งแต่กลยุทธ์ ไอเดีย เขียน ออกแบบ ไปจนถึงจัดชุดผลงานที่เผยแพร่ได้จริง',
  array['วาง Content Strategy จากเป้าหมายธุรกิจ','เขียนหลายรูปแบบด้วย Brand Voice เดียวกัน','สร้างภาพประกอบที่สม่ำเสมอ','ผลิต Content Campaign พร้อมเผยแพร่'],
  array['Audience & Voice Guide','30-day Content Plan','Visual Content Kit','Content Campaign Portfolio'],
  array[
    'บทบาท Content Creator ใน workflow ที่มี AI',
    'วาง Audience, Message และ Brand Voice',
    'Checkpoint: สร้าง Audience Persona และ Voice Guide',
    'ออกแบบ Content Pillar และเส้นเรื่องของแบรนด์',
    'Checkpoint: แตกหัวข้อเดียวเป็นโพสต์ บทความ และอีเมล',
    'Checkpoint: เขียนและแก้ต้นฉบับให้คงน้ำเสียงแบรนด์',
    'Checkpoint: สร้าง Visual Direction และ Prompt ภาพ',
    'Project: Content Plan 30 วันพร้อม Template',
    'Checkpoint: Repurpose หนึ่งชิ้นเป็น 5 ช่องทาง',
    'Final project: Campaign 1 ชุดพร้อม Copy และ Visual'
  ],
  array['chatgpt-basic','chatgpt-basic','chatgpt-basic','claude-basic','claude-basic','claude-basic','claude-design','chatgpt-advanced','claude-other','claude-design'],
  array[1,5,6,8,9,10,3,4,2,6]
),
(
  'ai-for-marketing',
  'ใช้ AI ทำงานการตลาดครบวงจร ตั้งแต่ Research, Insight, Campaign Brief, Copy, Experiment และรายงานผล',
  array['ทำ Market Research พร้อมแหล่งอ้างอิง','เปลี่ยน Insight เป็น Campaign Brief','สร้าง Copy หลายช่องทาง','ออกแบบ A/B Test และสรุปผล'],
  array['Research Report','Campaign Brief','Multi-channel Campaign Kit','Marketing Playbook'],
  array[
    'Marketing workflow ที่ AI ช่วยได้และจุดที่คนต้องตัดสินใจ',
    'ตั้งโจทย์ Research และตรวจคุณภาพแหล่งข้อมูล',
    'Checkpoint: วิเคราะห์ลูกค้า คู่แข่ง และ Pain Point',
    'เปลี่ยน Insight เป็น Positioning และ Campaign Brief',
    'Checkpoint: สร้าง Message Matrix สำหรับ 3 กลุ่มลูกค้า',
    'Checkpoint: เขียน Ads, Email และ Landing Page Copy',
    'Checkpoint: ออกแบบ A/B Test พร้อม Success Metric',
    'Project: Campaign Kit สำหรับสินค้าจริงหนึ่งรายการ',
    'Checkpoint: วิเคราะห์ผลจำลองและเสนอการปรับแคมเปญ',
    'Final project: Marketing Playbook พร้อม Prompt และ KPI'
  ],
  array['chatgpt-basic','gemini-basic','gemini-basic','chatgpt-advanced','chatgpt-advanced','chatgpt-basic','gemini-advanced','chatgpt-advanced','gemini-advanced','claude-cowork'],
  array[1,7,8,3,4,11,6,5,7,11]
),
(
  'ai-for-business',
  'ใช้ AI ทำเอกสาร วิเคราะห์ข้อมูล และช่วยตัดสินใจเชิงธุรกิจ โดยมีหลักฐาน ความเสี่ยง และแผนลงมือทำชัดเจน',
  array['สร้างเอกสารผู้บริหารที่กระชับ','วิเคราะห์ข้อมูลและสมมติฐาน','เปรียบเทียบทางเลือกอย่างเป็นระบบ','สร้าง SOP และ AI Playbook ให้ทีม'],
  array['Executive Brief','Decision Memo','SOP Pack','Team AI Playbook'],
  array[
    'เลือกงานธุรกิจที่ควรและไม่ควรให้ AI ช่วย',
    'โครงสร้าง Executive Brief และ Decision Memo',
    'Checkpoint: สรุปเอกสารยาวเป็น Brief หนึ่งหน้า',
    'วิเคราะห์ข้อมูลโดยแยก Fact, Assumption และ Risk',
    'Checkpoint: สร้าง Decision Matrix เปรียบเทียบ 3 ทางเลือก',
    'Checkpoint: เขียน Proposal พร้อมข้อโต้แย้งและข้อจำกัด',
    'Checkpoint: เปลี่ยนกระบวนการงานเป็น SOP ตรวจสอบได้',
    'Project: ชุดเอกสารสำหรับการตัดสินใจหนึ่งเรื่อง',
    'Checkpoint: ออกแบบ workflow อนุมัติและ Human Review',
    'Final project: Team AI Playbook สำหรับหน่วยงานหนึ่งทีม'
  ],
  array['claude-basic','claude-basic','claude-basic','gemini-advanced','gemini-advanced','claude-cowork','claude-cowork','claude-basic','ai-advanced-pro','ai-skills-pro'],
  array[1,2,5,5,6,2,6,8,1,4]
),
(
  'ai-developer',
  'ใช้ AI พัฒนาซอฟต์แวร์อย่างมีวินัย ตั้งแต่ทำความเข้าใจ codebase วางแผน แก้โค้ด เขียน test review และส่งงาน production',
  array['เขียน task brief ที่ agent ทำงานได้','แก้โค้ดแบบจำกัดขอบเขต','เขียนและรัน test','Review diff และเตรียม PR พร้อมส่ง'],
  array['Engineering Task Brief','Tested Feature','Code Review Report','Production-ready PR Portfolio'],
  array[
    'AI coding workflow, sandbox และความรับผิดชอบของนักพัฒนา',
    'เขียน Task Brief ด้วย scope, constraints และ acceptance criteria',
    'Checkpoint: ให้ AI อ่าน codebase และทำแผนก่อนแก้',
    'เลือก context และแบ่งงานเพื่อไม่ให้ agent หลงทาง',
    'Checkpoint: แก้ bug แบบ targeted พร้อม regression test',
    'Checkpoint: สร้าง feature เล็กจาก schema ถึง UI',
    'Checkpoint: Review diff ด้าน correctness, security และ performance',
    'Project: Full-stack mini feature พร้อม tests',
    'Checkpoint: เขียน PR description และแผน rollback',
    'Final project: Ship feature production-ready หนึ่งชิ้น'
  ],
  array['codex-basic','codex-basic','codex-basic','codex-basic','codex-basic','codex-basic','codex-basic','codex-basic','chatgpt-advanced','codex-basic'],
  array[1,4,5,6,7,8,9,12,11,12]
),
(
  'ai-for-teacher',
  'ใช้ AI ออกแบบการสอน สื่อ แบบฝึก การประเมิน และ feedback โดยยังรักษาเป้าหมายการเรียนรู้ ความถูกต้อง และความเป็นธรรม',
  array['ออกแบบ Lesson Plan แบบ Backward Design','สร้างสื่อและกิจกรรมหลายระดับ','ทำ Rubric และ Feedback','สร้าง Teaching Kit พร้อมใช้'],
  array['Lesson Plan','Differentiated Worksheet Pack','Assessment & Rubric','Complete Teaching Kit'],
  array[
    'บทบาท AI ในงานครูและหลักการคุ้มครองข้อมูลผู้เรียน',
    'กำหนด Learning Outcome และ Evidence of Learning',
    'Checkpoint: เขียน Lesson Plan จากมาตรฐานการเรียนรู้',
    'ออกแบบกิจกรรมให้เหมาะกับระดับและเวลาที่มี',
    'Checkpoint: สร้าง Worksheet 3 ระดับความยาก',
    'Checkpoint: สร้างคำถามวัดจำ เข้าใจ และประยุกต์',
    'Checkpoint: ทำ Rubric และ Feedback Template',
    'Project: Teaching Kit สำหรับหนึ่งคาบเรียน',
    'Checkpoint: ตรวจ Bias, Fact และ Accessibility ของสื่อ',
    'Final project: หน่วยการเรียนรู้พร้อมสอนและประเมินผล'
  ],
  array['chatgpt-basic','chatgpt-basic','chatgpt-basic','gemini-basic','gemini-basic','chatgpt-advanced','claude-basic','chatgpt-basic','gemini-basic','claude-basic'],
  array[1,4,5,6,8,3,8,10,13,12]
),
(
  'ai-for-automation',
  'วิเคราะห์งานซ้ำ ออกแบบ workflow สร้าง automation และวางระบบตรวจสอบ ความปลอดภัย และทางกู้คืน',
  array['เลือกงานที่คุ้มค่าแก่การ automate','เขียน Workflow Spec และข้อมูลเข้าออก','สร้าง automation ที่มี error handling','ส่งมอบ Runbook และ Monitoring Plan'],
  array['Automation Opportunity Map','Workflow Specification','Working Automation','Operations Runbook'],
  array[
    'แยก Automation, Agent และงานที่ต้องใช้คนตัดสินใจ',
    'ทำ Process Map และหา bottleneck',
    'Checkpoint: เลือกงานซ้ำและคำนวณผลตอบแทนเวลา',
    'ออกแบบ Trigger, Input, Rule, Action และ Exception',
    'Checkpoint: เขียน Workflow Spec พร้อม test cases',
    'Checkpoint: สร้าง automation ต้นแบบหนึ่ง flow',
    'Checkpoint: เพิ่ม validation, retry, log และ human approval',
    'Project: Automation ลดงานซ้ำหนึ่งกระบวนการ',
    'Checkpoint: Threat model สิทธิ์และข้อมูลที่เชื่อมต่อ',
    'Final project: Automation พร้อม Runbook และ Monitoring'
  ],
  array['ai-advanced-pro','chatgpt-advanced','chatgpt-advanced','ai-mcp-pro','ai-mcp-pro','codex-basic','ai-advanced-pro','ai-mcp-pro','ai-mcp-pro','ai-advanced-pro'],
  array[1,4,5,1,2,4,2,3,4,4]
),
(
  'ai-for-students',
  'ใช้ AI เพื่อเข้าใจเนื้อหา ฝึกคิด ค้นคว้า และทำรายงานโดยอ้างอิงได้ ไม่ลอกงาน และอธิบายสิ่งที่ส่งได้จริง',
  array['สร้าง Study System ส่วนตัว','สรุปและตั้งคำถามจากแหล่งเรียน','ค้นคว้าและตรวจแหล่งอ้างอิง','ทำรายงานพร้อมบันทึกการใช้ AI'],
  array['Study Plan','Active Recall Pack','Source-backed Research Note','Academic Report Portfolio'],
  array[
    'ใช้ AI ช่วยเรียนโดยไม่แทนการคิด',
    'ตั้งคำถามเพื่ออธิบาย เปรียบเทียบ และทดสอบความเข้าใจ',
    'Checkpoint: สร้างแผนอ่านและ Active Recall หนึ่งวิชา',
    'สรุปเอกสารโดยรักษาความหมายและระบุสิ่งที่ไม่แน่ใจ',
    'Checkpoint: เปลี่ยนบทเรียนเป็น Flashcard และข้อสอบฝึก',
    'Checkpoint: ค้นแหล่งข้อมูลและทำ Source Evaluation',
    'Checkpoint: สร้าง Outline รายงานพร้อม Citation Map',
    'Project: รายงานสั้นที่มีแหล่งอ้างอิงตรวจสอบได้',
    'Checkpoint: ตรวจการอ้างอิง ความเหมือน และ AI Hallucination',
    'Final project: Study Portfolio พร้อม Reflection'
  ],
  array['chatgpt-basic','chatgpt-basic','chatgpt-basic','claude-basic','claude-basic','gemini-basic','gemini-basic','claude-basic','gemini-basic','claude-basic'],
  array[1,4,6,5,6,7,8,10,13,15]
),
(
  'ai-for-writing',
  'พัฒนางานเขียนตั้งแต่ Brief, Research, Outline, Draft, Edit และ Fact-check จนเป็นชิ้นงานพร้อมส่งในบริบทอาชีพจริง',
  array['เปลี่ยน Brief เป็นโครงงานเขียน','รักษา Voice และ Audience','แก้ไขงานอย่างเป็นระบบ','ส่งบทความ อีเมล และรายงานพร้อมใช้'],
  array['Writing Brief','Voice & Style Guide','Edited Long-form Piece','Professional Writing Portfolio'],
  array[
    'Workflow นักเขียนที่ใช้ AI โดยไม่เสียเสียงของตัวเอง',
    'วิเคราะห์ Audience, Purpose, Evidence และ Tone',
    'Checkpoint: สร้าง Writing Brief และ Outline',
    'ใช้ AI Research โดยแยกข้อมูลจริงกับข้อเสนอ',
    'Checkpoint: เขียน Draft จาก Outline และหลักฐาน',
    'Checkpoint: Edit ด้านโครงสร้าง ความชัด และน้ำเสียง',
    'Checkpoint: Fact-check และทำ Source Note',
    'Project: บทความหรือรายงานฉบับพร้อมส่ง',
    'Checkpoint: Repurpose เป็น Email และ Social Post',
    'Final project: Writing Portfolio 3 รูปแบบใน Voice เดียวกัน'
  ],
  array['claude-basic','chatgpt-basic','chatgpt-basic','gemini-basic','claude-basic','claude-basic','gemini-basic','claude-basic','claude-other','claude-basic'],
  array[1,5,6,7,8,9,13,10,2,12]
),
(
  'ai-for-productivity',
  'สร้างระบบทำงานส่วนตัวด้วย AI ตั้งแต่จัดลำดับงาน อีเมล ประชุม เอกสาร และการติดตามผล โดยลดงานซ้ำอย่างวัดผลได้',
  array['จัดระบบ Inbox และ Task','สรุปประชุมเป็น Action Item','สร้าง Template งานประจำ','วัดเวลาที่ประหยัดและปรับ workflow'],
  array['Personal Workflow Map','Meeting & Email Template Pack','Weekly Operating System','Productivity Playbook'],
  array[
    'วิเคราะห์งานประจำวันและเลือกจุดใช้ AI',
    'หลัก Capture, Clarify, Prioritize และ Review',
    'Checkpoint: ทำ Workflow Map และ Time Audit',
    'ออกแบบ Template สำหรับอีเมลและงานซ้ำ',
    'Checkpoint: สรุปประชุมเป็น Decision, Owner และ Deadline',
    'Checkpoint: สร้าง Weekly Plan จากเป้าหมายและข้อจำกัด',
    'Checkpoint: ทำระบบติดตามงานและ Follow-up',
    'Project: Personal Operating System หนึ่งสัปดาห์',
    'Checkpoint: วัดเวลาที่ประหยัดและจุดผิดพลาด',
    'Final project: Productivity Playbook ที่ใช้ซ้ำได้'
  ],
  array['chatgpt-basic','chatgpt-basic','chatgpt-basic','claude-cowork','claude-cowork','claude-cowork','gemini-basic','claude-cowork','gemini-basic','ai-skills-pro'],
  array[1,4,6,4,5,6,8,9,10,1]
),
(
  'ai-for-music',
  'ผลิตเพลงด้วย AI ตั้งแต่ Creative Brief, Lyrics, Style, Arrangement, Iteration และสิทธิ์การใช้งาน จนได้ Demo พร้อมนำเสนอ',
  array['เขียน Music Brief และ Reference Direction','สร้าง Lyrics และโครงเพลง','ปรับเวอร์ชันอย่างมีเกณฑ์','ส่ง Demo พร้อมเครดิตและสิทธิ์'],
  array['Music Creative Brief','Lyrics & Structure Sheet','Version Comparison','Release-ready Demo Pack'],
  array[
    'บทบาท AI ในการทำเพลงและข้อจำกัดด้านลิขสิทธิ์',
    'องค์ประกอบ Music Brief, Mood, Genre และ Audience',
    'Checkpoint: เขียน Creative Brief สำหรับเพลงหนึ่งเพลง',
    'ใช้ Style Prompt และ Song Structure คุมผลลัพธ์',
    'Checkpoint: เขียน Lyrics พร้อม Verse, Chorus และ Hook',
    'Checkpoint: สร้างและเปรียบเทียบเพลง 3 เวอร์ชัน',
    'Checkpoint: ปรับ Arrangement, Extend และ Remix',
    'Project: Demo เพลงเต็มหนึ่งเพลง',
    'Checkpoint: ตรวจสิทธิ์ เครดิต และแผนเผยแพร่',
    'Final project: Demo Pack พร้อม Brief, Lyrics และ Cover'
  ],
  array['suno-basic','suno-basic','suno-basic','suno-basic','suno-basic','suno-basic','suno-basic','suno-basic','suno-basic','midjourney-basic'],
  array[1,3,3,5,4,6,7,6,8,3]
),
(
  'ai-for-video',
  'ผลิตวิดีโอสั้นตั้งแต่ Brief, Script, Shot List, Generation, Continuity, Sound และ Export จนพร้อมเผยแพร่',
  array['เขียน Video Brief และ Script','สร้าง Shot List และ Prompt กล้อง','รักษาความต่อเนื่องระหว่างช็อต','ส่งวิดีโอพร้อมเสียงและไฟล์ Export'],
  array['Video Brief & Script','Storyboard/Shot List','Rough Cut','Published-ready Short Video'],
  array[
    'Video production workflow และข้อจำกัดของ AI Video',
    'คิดเป็น Shot, Duration, Motion และ Continuity',
    'Checkpoint: เขียน Script 30 วินาทีและ Shot List',
    'ใช้ Text-to-Video และ Image-to-Video ให้เหมาะกับช็อต',
    'Checkpoint: สร้าง Prompt กล้องสำหรับ 5 ช็อต',
    'Checkpoint: สร้าง Keyframe และรักษาตัวละคร/สินค้า',
    'Checkpoint: ประกอบ Rough Cut พร้อมเสียง',
    'Project: วิดีโอสั้น 15–30 วินาที',
    'Checkpoint: Review Hook, Pace, Caption และ CTA',
    'Final project: วิดีโอพร้อมเผยแพร่และ Production Notes'
  ],
  array['runway-basic','runway-basic','runway-basic','runway-basic','runway-basic','runway-basic','runway-basic','runway-basic','chatgpt-basic','runway-basic'],
  array[1,3,2,4,3,6,7,8,11,8]
),
(
  'ai-for-image',
  'สร้างงานภาพสำหรับแบรนด์ตั้งแต่ Visual Brief, Prompt, Style System, Iteration, Layout และสิทธิ์ จนเป็นชุดภาพใช้งานจริง',
  array['แปลง Brand Brief เป็น Visual Direction','ควบคุม Composition และ Style','สร้างชุดภาพที่สม่ำเสมอ','ส่ง Brand Visual Kit พร้อมสิทธิ์ใช้งาน'],
  array['Visual Brief','Prompt & Style Library','Campaign Image Set','Brand Visual Kit'],
  array[
    'งาน Image/Design ที่ AI เหมาะและไม่เหมาะ',
    'องค์ประกอบ Visual Brief, Composition และ Style',
    'Checkpoint: สร้าง Moodboard และ Visual Direction',
    'ใช้ Prompt, Parameter และ Reference อย่างควบคุมได้',
    'Checkpoint: สร้างภาพ 4 แบบจาก Brief เดียวกัน',
    'Checkpoint: คุม Style และตัวแบบให้ต่อเนื่อง',
    'Checkpoint: วางภาพใน Layout สำหรับ Social และ Ads',
    'Project: Campaign Image Set หนึ่งชุด',
    'Checkpoint: ตรวจ Artifact, Brand Fit และสิทธิ์',
    'Final project: Brand Visual Kit พร้อม Prompt Library'
  ],
  array['midjourney-basic','midjourney-basic','midjourney-basic','midjourney-basic','midjourney-basic','midjourney-basic','claude-design','midjourney-basic','midjourney-basic','claude-design'],
  array[1,3,3,4,5,7,2,8,8,6]
);

-- Archive old counters only once. Certificates are intentionally untouched.
insert into career_path_progress_archive (
  user_id, course_id, lessons_done, previous_updated_at, curriculum_version
)
select user_id, course_id, lessons_done, updated_at, 1
from course_progress
where course_id like 'path:%'
  and exists (
    select 1
    from career_paths cp
    join job_ready_curricula c on c.slug = substring(course_progress.course_id from 6)
    where cp.slug = c.slug and cp.curriculum_version < 2
  );

delete from course_progress progress
where progress.course_id like 'path:%'
  and exists (
    select 1
    from career_paths cp
    join job_ready_curricula c on c.slug = substring(progress.course_id from 6)
    where cp.slug = c.slug and cp.curriculum_version < 2
  );

do $rebuild$
declare
  c job_ready_curricula%rowtype;
  v_path_id uuid;
  v_module_id uuid;
  v_module_order int;
  v_module_title text;
  v_kind text;
  v_rubric jsonb := jsonb_build_array(
    jsonb_build_object('key','clarity','label','ความชัดเจน','label_en','Clarity','guidance','เป้าหมายและสิ่งที่ต้องทำชัดเจน','guidance_en','The goal and required action are clear.'),
    jsonb_build_object('key','context','label','บริบทงาน','label_en','Work context','guidance','มีข้อมูล ผู้ใช้ ข้อจำกัด และสถานการณ์จริงเพียงพอ','guidance_en','Audience, constraints, and real work context are sufficient.'),
    jsonb_build_object('key','quality','label','คุณภาพชิ้นงาน','label_en','Artifact quality','guidance','ชิ้นงานครบ ใช้ได้ และเหมาะกับมาตรฐานอาชีพ','guidance_en','The artifact is complete, usable, and meets professional expectations.'),
    jsonb_build_object('key','verification','label','การตรวจสอบ','label_en','Verification','guidance','มีวิธีตรวจข้อเท็จจริง ความเสี่ยง และผลลัพธ์ก่อนนำไปใช้','guidance_en','Facts, risks, and results are checked before use.')
  );
  i int;
begin
  for c in select * from job_ready_curricula loop
    select id into v_path_id
    from career_paths
    where slug = c.slug and curriculum_version < 2
    for update;

    if v_path_id is null then
      continue;
    end if;

    delete from path_modules where path_id = v_path_id;

    update career_paths
    set description = c.description,
        outcomes = c.outcomes,
        deliverables = c.deliverables,
        practical_ratio = 70,
        curriculum_version = 2,
        weeks = 4
    where id = v_path_id;

    for i in 1..10 loop
      v_module_order := case when i <= 3 then 1 when i <= 6 then 2 when i <= 8 then 3 else 4 end;
      v_module_title := case v_module_order
        when 1 then 'เข้าใจงานและตั้งโจทย์'
        when 2 then 'ฝึก Workflow หลัก'
        when 3 then 'ผลิตชิ้นงานจริง'
        else 'ส่งมอบและสร้าง Portfolio'
      end;

      v_module_id := null;
      select id into v_module_id
      from path_modules
      where path_id = v_path_id and order_index = v_module_order;

      if v_module_id is null then
        insert into path_modules (path_id, title, order_index)
        values (v_path_id, v_module_title, v_module_order)
        returning id into v_module_id;
      end if;

      v_kind := case
        when i in (1,2,4) then 'lesson'
        when i in (8,10) then 'project'
        else 'checkpoint'
      end;

      insert into path_steps (
        module_id, title, kind, course_slug, lesson_num, xp, order_index,
        brief, deliverable, starter_template, rubric, is_portfolio
      )
      values (
        v_module_id,
        c.step_titles[i],
        v_kind,
        c.course_slugs[i],
        c.lesson_nums[i],
        case v_kind when 'lesson' then 15 when 'checkpoint' then 30 else 50 end,
        i - case v_module_order when 1 then 0 when 2 then 3 when 3 then 6 else 8 end,
        case when v_kind = 'lesson' then null
          else 'สถานการณ์งานจริง: ' || c.step_titles[i] || E'\nทำงานจากโจทย์จริงหรือโจทย์จำลองที่ใกล้กับอาชีพนี้ และอธิบายเหตุผลในการตัดสินใจแต่ละขั้น'
        end,
        case when v_kind = 'lesson' then null
          else c.deliverables[least(array_length(c.deliverables, 1), greatest(1, ceil(i / 3.0)::int))]
        end,
        case when v_kind = 'lesson' then null else
          'โจทย์/เป้าหมาย:' || E'\n' ||
          'ผู้ใช้หรือผู้รับงาน:' || E'\n' ||
          'ข้อมูลและข้อจำกัด:' || E'\n' ||
          'ขั้นตอนที่ทำ:' || E'\n' ||
          'ชิ้นงานฉบับสุดท้าย:' || E'\n' ||
          'วิธีตรวจคุณภาพและข้อเท็จจริง:' || E'\n' ||
          'สิ่งที่จะปรับในรอบถัดไป:'
        end,
        case when v_kind = 'lesson' then '[]'::jsonb else v_rubric end,
        v_kind = 'project'
      );
    end loop;
  end loop;
end;
$rebuild$;

-- A published v2 path is valid only when exactly 70% of its steps require
-- submitted work and it contains at least two portfolio projects.
do $validate$
declare
  invalid_count int;
begin
  select count(*) into invalid_count
  from (
    select
      cp.id,
      count(*) filter (where ps.kind in ('checkpoint','project')) as practical,
      count(*) filter (where ps.kind = 'project') as projects,
      count(*) as total
    from career_paths cp
    join path_modules pm on pm.path_id = cp.id
    join path_steps ps on ps.module_id = pm.id
    where cp.curriculum_version = 2 and cp.is_published = true
    group by cp.id
    having count(*) <> 10
      or count(*) filter (where ps.kind in ('checkpoint','project')) <> 7
      or count(*) filter (where ps.kind = 'project') < 2
  ) invalid;

  if invalid_count > 0 then
    raise exception 'job-ready curriculum validation failed for % path(s)', invalid_count;
  end if;
end;
$validate$;
