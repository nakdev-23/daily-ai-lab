/**
 * Tool Registry — single source of truth for every AI tool in the app.
 *
 * To add a new tool:
 *  1. Add one entry to TOOLS below (all fields required)
 *  2. Create content/docs/{slug}/ and add .md files with `tool: "Name"` frontmatter
 *  3. Add logo: either a react-icons key in SI_KEYS or an SVG at /public/assets/.../icons/tool-{file}.svg
 *
 * Everything else (grid, colors, logo component, admin panel) auto-updates.
 */

export type ToolCategory = "chat" | "image" | "video" | "music" | "research"

/** How the tool's logo should be rendered */
export type ToolIconDef =
  | { type: "si"; key: string }       // react-icons/si — key matches SI_ICONS in tool-logo.tsx
  | { type: "svg"; file: string }     // /public/assets/daily-ai-lab/icons/{file}.svg

export type ToolDef = {
  /** Canonical display name — must match `tool:` in .md frontmatter exactly */
  name: string
  /** URL slug — must match docs folder name exactly */
  slug: string
  /** Whether this tool has /docs pages (shows in docs grid + admin visibility panel) */
  hasDocs: boolean
  category: ToolCategory
  catLabelTh: string
  catLabelEn: string
  /** Tile gradient (linear-gradient string) */
  bg: string
  /** One-letter fallback if icon can't be resolved */
  fallback: string
  /** CSS color for level dots / accents */
  dot: string
  /** Light tinted background for cards / banners */
  soft: string
  /** Box-shadow accent color */
  sh: string
  blob: string
  /** Horizontal progress bar gradient */
  bar: string
  bar2: string
  icon: ToolIconDef
}

export const TOOLS: ToolDef[] = [
  // ── Docs tools ──────────────────────────────────────────────────────────────
  {
    name: "ChatGPT",      slug: "chatgpt",    hasDocs: true,
    category: "chat",     catLabelTh: "แชท & เขียน",          catLabelEn: "Chat & writing",
    bg: "linear-gradient(160deg,#23D08A,#0E8F5E)",
    fallback: "G", dot: "var(--mint-500)",   soft: "#E6F8EF",
    sh: "rgba(20,168,113,.4)", blob: "rgba(20,168,113,.18)",
    bar: "linear-gradient(90deg,#23D08A,#0E8F5E)", bar2: "#0E8F5E",
    icon: { type: "si", key: "SiOpenai" },
  },
  {
    name: "Claude",       slug: "claude",     hasDocs: true,
    category: "chat",     catLabelTh: "คิดเป็นขั้นตอน & งานเขียนยาว", catLabelEn: "Reasoning & docs",
    bg: "linear-gradient(160deg,#FFA866,#E2611C)",
    fallback: "C", dot: "var(--punch-500,#E2611C)", soft: "#FFF0E4",
    sh: "rgba(226,97,28,.4)", blob: "rgba(226,97,28,.16)",
    bar: "linear-gradient(90deg,#FFA866,#E2611C)", bar2: "#E2611C",
    icon: { type: "si", key: "SiClaude" },
  },
  {
    name: "Codex",        slug: "codex",      hasDocs: true,
    category: "chat",     catLabelTh: "AI Coding Agent",       catLabelEn: "AI coding agent",
    bg: "linear-gradient(160deg,#6F9CFF,#2A6FF0)",
    fallback: "C", dot: "var(--sky-500)",    soft: "#E7F0FF",
    sh: "rgba(42,111,240,.38)", blob: "rgba(42,111,240,.16)",
    bar: "linear-gradient(90deg,#6F9CFF,#2A6FF0)", bar2: "#2A6FF0",
    icon: { type: "si", key: "SiOpenai" },
  },
  {
    name: "Gemini",       slug: "gemini",     hasDocs: true,
    category: "research", catLabelTh: "Google & ค้นคว้า",      catLabelEn: "Google & research",
    bg: "linear-gradient(160deg,#5B8CFF,#2A6FF0)",
    fallback: "G", dot: "var(--sky-500)",    soft: "#E7F0FF",
    sh: "rgba(42,111,240,.38)", blob: "rgba(42,111,240,.16)",
    bar: "linear-gradient(90deg,#5B8CFF,#2A6FF0)", bar2: "#2A6FF0",
    icon: { type: "si", key: "SiGooglegemini" },
  },
  {
    name: "Grok",         slug: "grok",       hasDocs: true,
    category: "chat",     catLabelTh: "AI โดย xAI",            catLabelEn: "xAI assistant",
    bg: "linear-gradient(160deg,#A78BFA,#7C3AED)",
    fallback: "G", dot: "var(--hero-500)",   soft: "#EEE9FE",
    sh: "rgba(124,58,237,.38)", blob: "rgba(124,58,237,.16)",
    bar: "linear-gradient(90deg,#A78BFA,#7C3AED)", bar2: "#7C3AED",
    icon: { type: "svg", file: "tool-grok" },
  },
  {
    name: "Kling AI",     slug: "kling-ai",   hasDocs: true,
    category: "video",    catLabelTh: "วิดีโอและภาพ AI",        catLabelEn: "AI video & image",
    bg: "linear-gradient(160deg,#FB7185,#E11D48)",
    fallback: "K", dot: "var(--berry-500)",  soft: "#FFE6EE",
    sh: "rgba(225,29,72,.38)", blob: "rgba(225,29,72,.16)",
    bar: "linear-gradient(90deg,#FB7185,#E11D48)", bar2: "#E11D48",
    icon: { type: "svg", file: "tool-kling-ai" },
  },
  {
    name: "Midjourney",   slug: "midjourney", hasDocs: true,
    category: "image",    catLabelTh: "ภาพอาร์ต AI",           catLabelEn: "AI image art",
    bg: "linear-gradient(160deg,#BC83FF,#6C3CF5)",
    fallback: "M", dot: "var(--hero-500)",   soft: "#EEE9FE",
    sh: "rgba(108,60,245,.4)", blob: "rgba(108,60,245,.18)",
    bar: "linear-gradient(90deg,#BC83FF,#6C3CF5)", bar2: "#6C3CF5",
    icon: { type: "svg", file: "tool-midjourney" },
  },
  {
    name: "Suno",         slug: "suno",       hasDocs: true,
    category: "music",    catLabelTh: "ทำเพลง AI",             catLabelEn: "AI music maker",
    bg: "linear-gradient(160deg,#FF93BE,#F45C97)",
    fallback: "S", dot: "var(--berry-500)",  soft: "#FFE9F2",
    sh: "rgba(244,92,151,.38)", blob: "rgba(244,92,151,.16)",
    bar: "linear-gradient(90deg,#FF93BE,#F45C97)", bar2: "#F45C97",
    icon: { type: "si", key: "SiSuno" },
  },
  {
    name: "ElevenLabs",   slug: "elevenlabs", hasDocs: true,
    category: "music",    catLabelTh: "เสียงและพากย์ AI",       catLabelEn: "AI voice & audio",
    bg: "linear-gradient(160deg,#6B7280,#111827)",
    fallback: "11", dot: "var(--cloud-700)", soft: "#EEF0F3",
    sh: "rgba(17,24,39,.34)", blob: "rgba(17,24,39,.14)",
    bar: "linear-gradient(90deg,#6B7280,#111827)", bar2: "#111827",
    icon: { type: "si", key: "SiElevenlabs" },
  },
  {
    name: "Runway",       slug: "runway",     hasDocs: true,
    category: "video",    catLabelTh: "วิดีโอ & เอฟเฟกต์",     catLabelEn: "AI video & FX",
    bg: "linear-gradient(160deg,#5C5675,#1B1729)",
    fallback: "R", dot: "var(--hero-500)",   soft: "#EEE9FE",
    sh: "rgba(27,23,41,.38)", blob: "rgba(27,23,41,.16)",
    bar: "linear-gradient(90deg,#5C5675,#1B1729)", bar2: "#1B1729",
    icon: { type: "svg", file: "tool-runway" },
  },
  {
    name: "Perplexity",   slug: "perplexity", hasDocs: true,
    category: "research", catLabelTh: "ค้นหาด้วย AI",          catLabelEn: "AI search",
    bg: "linear-gradient(160deg,#2FD68F,#0E8F5E)",
    fallback: "P", dot: "var(--mint-500)",   soft: "#E6F8EF",
    sh: "rgba(14,143,94,.38)", blob: "rgba(14,143,94,.16)",
    bar: "linear-gradient(90deg,#2FD68F,#0E8F5E)", bar2: "#0E8F5E",
    icon: { type: "si", key: "SiPerplexity" },
  },
  {
    name: "DALL·E",       slug: "dall-e",     hasDocs: true,
    category: "image",    catLabelTh: "ภาพอาร์ต AI",           catLabelEn: "AI image art",
    bg: "linear-gradient(160deg,#FFB36B,#E2611C)",
    fallback: "D", dot: "var(--punch-500,#E2611C)", soft: "#FFF0E4",
    sh: "rgba(226,97,28,.4)", blob: "rgba(226,97,28,.16)",
    bar: "linear-gradient(90deg,#FFB36B,#E2611C)", bar2: "#E2611C",
    icon: { type: "si", key: "SiOpenai" },
  },
  {
    name: "Seedance",     slug: "seedance",   hasDocs: true,
    category: "video",    catLabelTh: "วิดีโอ AI (ByteDance)",  catLabelEn: "AI video (ByteDance)",
    bg: "linear-gradient(160deg,#3CC8F5,#1464F4)",
    fallback: "S", dot: "var(--sky-500)",    soft: "#E4F4FE",
    sh: "rgba(20,100,244,.38)", blob: "rgba(20,100,244,.16)",
    bar: "linear-gradient(90deg,#3CC8F5,#1464F4)", bar2: "#1464F4",
    icon: { type: "si", key: "SiBytedance" },
  },
  {
    name: "OpenClaw",     slug: "openclaw",   hasDocs: true,
    category: "chat",     catLabelTh: "AI Agent โอเพนซอร์ส",    catLabelEn: "Open-source AI agent",
    bg: "linear-gradient(160deg,#FF7A59,#E23B2E)",
    fallback: "O", dot: "var(--punch-500,#E23B2E)", soft: "#FFEAE4",
    sh: "rgba(226,59,46,.36)", blob: "rgba(226,59,46,.16)",
    bar: "linear-gradient(90deg,#FF7A59,#E23B2E)", bar2: "#E23B2E",
    icon: { type: "svg", file: "tool-openclaw" },
  },
  {
    name: "Hermes",       slug: "hermes",     hasDocs: true,
    category: "chat",     catLabelTh: "AI Agent เรียนรู้เอง",   catLabelEn: "Self-improving AI agent",
    bg: "linear-gradient(160deg,#8B7CF6,#5B3FD6)",
    fallback: "H", dot: "var(--hero-500)",   soft: "#ECE8FE",
    sh: "rgba(91,63,214,.36)", blob: "rgba(91,63,214,.16)",
    bar: "linear-gradient(90deg,#8B7CF6,#5B3FD6)", bar2: "#5B3FD6",
    icon: { type: "svg", file: "tool-hermes" },
  },
  {
    name: "Kimi",         slug: "kimi",       hasDocs: true,
    category: "chat",     catLabelTh: "แชท & เอกสารยาว",        catLabelEn: "Chat & long context",
    bg: "linear-gradient(160deg,#5B6CF0,#2A2466)",
    fallback: "K", dot: "var(--hero-500)",   soft: "#E8EAFE",
    sh: "rgba(42,36,102,.4)", blob: "rgba(42,36,102,.18)",
    bar: "linear-gradient(90deg,#5B6CF0,#2A2466)", bar2: "#2A2466",
    icon: { type: "svg", file: "tool-kimi" },
  },
  {
    name: "Cursor",       slug: "cursor",     hasDocs: true,
    category: "chat",     catLabelTh: "AI Code Editor",         catLabelEn: "AI code editor",
    bg: "linear-gradient(160deg,#3A3A3A,#0B0B0B)",
    fallback: "C", dot: "var(--cloud-700,#3A3A3A)", soft: "#ECECEC",
    sh: "rgba(0,0,0,.42)", blob: "rgba(0,0,0,.16)",
    bar: "linear-gradient(90deg,#3A3A3A,#0B0B0B)", bar2: "#0B0B0B",
    icon: { type: "svg", file: "tool-cursor" },
  },
  {
    name: "Windsurf",     slug: "windsurf",   hasDocs: true,
    category: "chat",     catLabelTh: "AI Code Editor",         catLabelEn: "AI code editor",
    bg: "linear-gradient(160deg,#3DD6C4,#0E8C7F)",
    fallback: "W", dot: "var(--mint-500)",   soft: "#E2F8F4",
    sh: "rgba(14,140,127,.38)", blob: "rgba(14,140,127,.16)",
    bar: "linear-gradient(90deg,#3DD6C4,#0E8C7F)", bar2: "#0E8C7F",
    icon: { type: "si", key: "SiWindsurf" },
  },
  {
    name: "Ollama",       slug: "ollama",     hasDocs: true,
    category: "chat",     catLabelTh: "รันโมเดลในเครื่อง",      catLabelEn: "Run LLMs locally",
    bg: "linear-gradient(160deg,#4A4A4A,#111111)",
    fallback: "O", dot: "var(--cloud-700,#3A3A3A)", soft: "#ECECEC",
    sh: "rgba(0,0,0,.4)", blob: "rgba(0,0,0,.16)",
    bar: "linear-gradient(90deg,#4A4A4A,#111111)", bar2: "#111111",
    icon: { type: "si", key: "SiOllama" },
  },
  {
    name: "Hugging Face", slug: "huggingface", hasDocs: true,
    category: "chat",     catLabelTh: "ฮับโมเดล AI",            catLabelEn: "AI model hub",
    bg: "linear-gradient(160deg,#FFD21E,#FF9D00)",
    fallback: "H", dot: "var(--sun-500)",    soft: "#FFF6D9",
    sh: "rgba(255,157,0,.4)", blob: "rgba(255,157,0,.18)",
    bar: "linear-gradient(90deg,#FFD21E,#FF9D00)", bar2: "#FF9D00",
    icon: { type: "si", key: "SiHuggingface" },
  },
  {
    name: "OpenRouter",   slug: "openrouter", hasDocs: true,
    category: "chat",     catLabelTh: "เกตเวย์ API หลายโมเดล",  catLabelEn: "Multi-model API",
    bg: "linear-gradient(160deg,#6E8BFF,#3656D6)",
    fallback: "R", dot: "var(--sky-500)",    soft: "#E8EDFF",
    sh: "rgba(54,86,214,.38)", blob: "rgba(54,86,214,.16)",
    bar: "linear-gradient(90deg,#6E8BFF,#3656D6)", bar2: "#3656D6",
    icon: { type: "svg", file: "tool-openrouter" },
  },
  {
    name: "Google AI Studio", slug: "google-ai-studio", hasDocs: true,
    category: "chat",     catLabelTh: "สร้างต้นแบบกับ Gemini",  catLabelEn: "Prototype with Gemini",
    bg: "linear-gradient(160deg,#5C9BFF,#1A73E8)",
    fallback: "S", dot: "var(--sky-500)",    soft: "#E6F0FF",
    sh: "rgba(26,115,232,.38)", blob: "rgba(26,115,232,.16)",
    bar: "linear-gradient(90deg,#5C9BFF,#1A73E8)", bar2: "#1A73E8",
    icon: { type: "si", key: "SiGooglegemini" },
  },
  {
    name: "Antigravity", slug: "antigravity", hasDocs: true,
    category: "chat",     catLabelTh: "แพลตฟอร์มเขียนโค้ดด้วย AI", catLabelEn: "Agentic coding platform",
    bg: "linear-gradient(160deg,#7C8CF8,#3F4FB5)",
    fallback: "A", dot: "var(--hero-500)",   soft: "#EAECFE",
    sh: "rgba(63,79,181,.38)", blob: "rgba(63,79,181,.16)",
    bar: "linear-gradient(90deg,#7C8CF8,#3F4FB5)", bar2: "#3F4FB5",
    icon: { type: "svg", file: "tool-antigravity" },
  },
  {
    name: "Google Flow", slug: "google-flow", hasDocs: true,
    category: "video",    catLabelTh: "สร้างหนังด้วย AI (Veo)", catLabelEn: "AI filmmaking (Veo)",
    bg: "linear-gradient(160deg,#B06CFF,#6C3CF5)",
    fallback: "F", dot: "var(--hero-500)",   soft: "#F0E9FE",
    sh: "rgba(108,60,245,.38)", blob: "rgba(108,60,245,.16)",
    bar: "linear-gradient(90deg,#B06CFF,#6C3CF5)", bar2: "#6C3CF5",
    icon: { type: "svg", file: "tool-flow" },
  },
  {
    name: "Google Stitch", slug: "google-stitch", hasDocs: true,
    category: "image",    catLabelTh: "ออกแบบ UI ด้วย AI",      catLabelEn: "AI UI design",
    bg: "linear-gradient(160deg,#34D6B4,#0E9E8E)",
    fallback: "S", dot: "var(--mint-500)",   soft: "#E2F8F3",
    sh: "rgba(14,158,142,.38)", blob: "rgba(14,158,142,.16)",
    bar: "linear-gradient(90deg,#34D6B4,#0E9E8E)", bar2: "#0E9E8E",
    icon: { type: "svg", file: "tool-stitch" },
  },
  {
    name: "Google Jules", slug: "google-jules", hasDocs: true,
    category: "chat",     catLabelTh: "เอเจนต์เขียนโค้ดอัตโนมัติ", catLabelEn: "Async coding agent",
    bg: "linear-gradient(160deg,#FFB454,#F09000)",
    fallback: "J", dot: "var(--sun-500)",    soft: "#FFF2DD",
    sh: "rgba(240,144,0,.4)", blob: "rgba(240,144,0,.18)",
    bar: "linear-gradient(90deg,#FFB454,#F09000)", bar2: "#F09000",
    icon: { type: "svg", file: "tool-jules" },
  },
  {
    name: "Lovable",     slug: "lovable",    hasDocs: true,
    category: "chat",     catLabelTh: "สร้างเว็บแอปด้วยแชท",     catLabelEn: "Chat-to-app builder",
    bg: "linear-gradient(160deg,#FF7AC8,#E0398A)",
    fallback: "L", dot: "var(--berry-500)",  soft: "#FFE7F3",
    sh: "rgba(224,57,138,.38)", blob: "rgba(224,57,138,.16)",
    bar: "linear-gradient(90deg,#FF7AC8,#E0398A)", bar2: "#E0398A",
    icon: { type: "svg", file: "tool-lovable" },
  },
  {
    name: "Bolt",        slug: "bolt",       hasDocs: true,
    category: "chat",     catLabelTh: "สร้างเว็บแอปในเบราว์เซอร์", catLabelEn: "In-browser app builder",
    bg: "linear-gradient(160deg,#3A8BFF,#1452E0)",
    fallback: "B", dot: "var(--sky-500)",    soft: "#E5EEFF",
    sh: "rgba(20,82,224,.38)", blob: "rgba(20,82,224,.16)",
    bar: "linear-gradient(90deg,#3A8BFF,#1452E0)", bar2: "#1452E0",
    icon: { type: "si", key: "SiStackblitz" },
  },
  {
    name: "Base44",      slug: "base44",     hasDocs: true,
    category: "chat",     catLabelTh: "สร้างแอปครบจบในที่เดียว",  catLabelEn: "All-in-one app builder",
    bg: "linear-gradient(160deg,#3A3A3A,#0B0B0B)",
    fallback: "B", dot: "var(--cloud-700,#3A3A3A)", soft: "#ECECEC",
    sh: "rgba(0,0,0,.42)", blob: "rgba(0,0,0,.16)",
    bar: "linear-gradient(90deg,#3A3A3A,#0B0B0B)", bar2: "#0B0B0B",
    icon: { type: "svg", file: "tool-base44" },
  },
  {
    name: "Replit",      slug: "replit",     hasDocs: true,
    category: "chat",     catLabelTh: "เขียน-รันโค้ดบนคลาวด์",    catLabelEn: "Cloud IDE + AI Agent",
    bg: "linear-gradient(160deg,#F5762D,#E14E0E)",
    fallback: "R", dot: "var(--punch-500,#E14E0E)", soft: "#FFEBE0",
    sh: "rgba(225,78,14,.38)", blob: "rgba(225,78,14,.16)",
    bar: "linear-gradient(90deg,#F5762D,#E14E0E)", bar2: "#E14E0E",
    icon: { type: "si", key: "SiReplit" },
  },
  {
    name: "HeyGen",      slug: "heygen",     hasDocs: true,
    category: "video",    catLabelTh: "วิดีโออวตาร AI",           catLabelEn: "AI avatar video",
    bg: "linear-gradient(160deg,#7B6CF6,#4B2FD6)",
    fallback: "H", dot: "var(--hero-500)",   soft: "#ECE8FE",
    sh: "rgba(75,47,214,.38)", blob: "rgba(75,47,214,.16)",
    bar: "linear-gradient(90deg,#7B6CF6,#4B2FD6)", bar2: "#4B2FD6",
    icon: { type: "svg", file: "tool-heygen" },
  },
  {
    name: "Z.ai",        slug: "z-ai",       hasDocs: true,
    category: "chat",     catLabelTh: "โมเดล GLM (Zhipu AI)",    catLabelEn: "GLM models (Zhipu AI)",
    bg: "linear-gradient(160deg,#4F8DF7,#1E5BD6)",
    fallback: "Z", dot: "var(--sky-500)",    soft: "#E6EEFF",
    sh: "rgba(30,91,214,.38)", blob: "rgba(30,91,214,.16)",
    bar: "linear-gradient(90deg,#4F8DF7,#1E5BD6)", bar2: "#1E5BD6",
    icon: { type: "svg", file: "tool-z-ai" },
  },

  // ── Course-only tools (no /docs pages) ──────────────────────────────────────
  {
    name: "Prompt",       slug: "prompt",     hasDocs: false,
    category: "chat",     catLabelTh: "Prompt Engineering",    catLabelEn: "Prompt Engineering",
    bg: "linear-gradient(160deg,#BC83FF,#6C3CF5)",
    fallback: "P", dot: "var(--amber-500)",  soft: "#F0E9FE",
    sh: "rgba(108,60,245,.4)", blob: "rgba(108,60,245,.18)",
    bar: "linear-gradient(90deg,#BC83FF,#6C3CF5)", bar2: "#6C3CF5",
    icon: { type: "si", key: "SiOpenai" },
  },
  {
    name: "AI Work",      slug: "ai-work",    hasDocs: false,
    category: "chat",     catLabelTh: "AI ในการทำงาน",         catLabelEn: "AI for work",
    bg: "linear-gradient(160deg,#875EF6,#5728E0)",
    fallback: "W", dot: "var(--hero-500)",   soft: "#EEE9FE",
    sh: "rgba(87,40,224,.4)", blob: "rgba(87,40,224,.16)",
    bar: "linear-gradient(90deg,#875EF6,#5728E0)", bar2: "#5728E0",
    icon: { type: "si", key: "SiOpenai" },
  },
]

// ── Lookup helpers ──────────────────────────────────────────────────────────

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]))
const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]))

export const getTool      = (name: string) => BY_NAME.get(name)
export const getToolBySlug = (slug: string) => BY_SLUG.get(slug)

/** Tool names that appear in the /docs section */
export const DOCS_TOOL_NAMES = TOOLS.filter((t) => t.hasDocs).map((t) => t.name)

/** Default colors for unknown/custom tools */
export const DEFAULT_TOOL: Pick<ToolDef, "fallback" | "bg" | "dot" | "soft" | "sh" | "blob" | "bar" | "bar2"> = {
  fallback: "A",
  bg: "linear-gradient(160deg,#9B8ECB,#5728E0)",
  dot: "var(--hero-500)",
  soft: "#EEE9FE",
  sh: "rgba(87,40,224,.4)",
  blob: "rgba(87,40,224,.16)",
  bar: "linear-gradient(90deg,#9B8ECB,#5728E0)",
  bar2: "#5728E0",
}
