-- 022_content_i18n.sql
-- English translations for content metadata (titles + descriptions).
-- Every column is nullable: when an *_en value is missing the app falls back to
-- the Thai original, so this migration is safe to run before any translation
-- exists and the site keeps working throughout an incremental translation.

alter table courses        add column if not exists title_en       text;
alter table courses        add column if not exists description_en text;

alter table course_units   add column if not exists title_en       text;

alter table course_lessons add column if not exists title_en       text;

alter table career_paths   add column if not exists title_en       text;
alter table career_paths   add column if not exists description_en text;

alter table path_modules   add column if not exists title_en       text;

alter table path_steps     add column if not exists title_en       text;
