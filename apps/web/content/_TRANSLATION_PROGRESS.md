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

## Done
- chatgpt-basic (15/15) ✅
- claude-basic (15/15) ✅
- gemini-basic (15/15) ✅

## Next (lessons first, then docs)
codex-basic → chatgpt-advanced → claude-advanced → gemini-advanced → claude-code
→ claude-cowork → claude-design → claude-other → codex-advanced → grok-basic →
lovable-basic → midjourney-basic → runway-basic → suno-basic → elevenlabs-basic
→ ai-skills-pro → ai-mcp-pro → ai-advanced-pro → (any remaining) → then all docs.

Commit per course/tool with message `feat(i18n): translate <name> to English`,
then push. Keep going until the dry-run reports 0 remaining.
