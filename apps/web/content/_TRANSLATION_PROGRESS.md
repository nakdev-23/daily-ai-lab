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

## Done — ALL 219 lessons ✅ (dry-run: 0/219 remaining)
All lesson courses translated to English and pushed.

## Next — DOCS (349 .en.md files left)
Translate per tool dir under `content/docs/<tool>/`:
antigravity(4) base44(4) bolt(4) chatgpt(14) claude(19) codex(11) cursor(6)
dall-e(13) elevenlabs(6) gemini(30) google-ai-studio(4) google-flow(4)
google-jules(4) google-stitch(4) grok(23) hermes(8) heygen(6) huggingface(4)
kimi(4) kling-ai(16) lovable(4) midjourney(56) ollama(4) openclaw(7)
openrouter(4) perplexity(18) replit(4) runway(20) seedance(5) suno(20)
windsurf(6) z-ai(13)
Always run the dry-run to confirm the true remaining set.

Commit per course/tool with message `feat(i18n): translate <name> to English`,
then push. Keep going until the dry-run reports 0 remaining.
