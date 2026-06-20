# Translation progress (TH → EN) — autonomous task

Goal: translate ALL content to English so the language switch shows English
everywhere. Bilingual infra is already in place (Thai fallback when EN missing).

## How to translate (per file)
- Lessons: read `content/lessons/<course>/<nn>.json` (Thai), write
  `content/lessons/<course>/en/<nn>.json` (English). Translate only human text:
  `tag`, `title`, `body[].text`, `example`, `question`, `options[].text`.
  NEVER change `type`, `correct`, `bold`, `mascot`. Keep valid JSON.
- Docs: read `content/docs/<tool>/<file>.md`, write `<file>.en.md`. Translate
  frontmatter `title`/`summary` + the markdown body; keep other frontmatter keys,
  code blocks, tables, and links intact.

## Check what's left
`cd apps/web && node scripts/translate-content.mjs --kind all --dry-run`

## Done (80/219 lessons)
- chatgpt-basic ✅ · claude-basic ✅ · gemini-basic ✅
- ai-advanced-pro ✅ · ai-mcp-pro ✅ · ai-skills-pro ✅
- grok-basic ✅ · elevenlabs-basic ✅ · lovable-basic ✅ · midjourney-basic ✅

## Next (lessons first, then docs) — 139 lessons left
suno-basic (8) → runway-basic (8) → codex-basic (12) → codex-advanced (12) →
chatgpt-advanced (15) → claude-advanced (15) → gemini-advanced (15) →
claude-code (18) → claude-cowork (12) → claude-design (12) → claude-other (12)
→ (any remaining) → then all 349 docs (.en.md).
Always run the dry-run to confirm the true remaining set.

Commit per course/tool with message `feat(i18n): translate <name> to English`,
then push. Keep going until the dry-run reports 0 remaining.
