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
