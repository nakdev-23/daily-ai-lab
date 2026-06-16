import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"
import { unstable_cache } from "next/cache"

marked.setOptions({ gfm: true, breaks: true })

const DOCS_DIR = path.join(process.cwd(), "content", "docs")

export type DocLevel = "beginner" | "intermediate" | "pro"

export type DocMeta = {
  slug: string
  title: string
  tool: string
  toolSlug: string
  icon: string
  iconPath: string
  level: DocLevel
  summary: string
  readTime: string
  readers: string
  locked: boolean
  order: number
}

export const LEVELS: Record<DocLevel, { label: string; tag: string; color: string; note: string }> = {
  beginner: { label: "ระดับ Beginner", tag: "ฟรี", color: "bg-green-100 text-green-700", note: "เอกสารสำหรับผู้เริ่มต้น เรียนรู้พื้นฐานการใช้งาน AI" },
  intermediate: { label: "ระดับ Intermediate", tag: "Pro", color: "bg-purple-100 text-purple-700", note: "ยกระดับทักษะการใช้ AI ในงานจริง" },
  pro: { label: "ระดับ Pro", tag: "Pro", color: "bg-amber-100 text-amber-700", note: "เทคนิคขั้นสูงสำหรับมือโปร" },
}

const iconPath = (icon: string) => `/assets/daily-ai-lab/icons/${icon}.svg`

export type Lang = "th" | "en"

async function readDoc(file: string, lang: Lang = "th") {
  // English docs are an overlay: `foo/01.en.md` next to `foo/01.md`. Fall back
  // to the Thai original when a translation is missing so docs never go blank
  // while content is translated incrementally. The slug stays the base name
  // (no `.en`) so URLs are identical in both languages.
  const baseSlug = file.replace(/\.md$/, "")
  let raw: string
  if (lang === "en") {
    try { raw = await fs.readFile(path.join(DOCS_DIR, `${baseSlug}.en.md`), "utf8") }
    catch { raw = await fs.readFile(path.join(DOCS_DIR, file), "utf8") }
  } else {
    raw = await fs.readFile(path.join(DOCS_DIR, file), "utf8")
  }
  const { data, content } = matter(raw)
  const slug = baseSlug
  const icon = (data.icon as string) ?? "icon-docs"
  const tool = (data.tool as string) ?? "AI"
  const meta: DocMeta = {
    slug,
    title: (data.title as string) ?? slug,
    tool,
    toolSlug: slugify(tool),
    icon,
    iconPath: iconPath(icon),
    level: ((data.level as DocLevel) ?? "beginner"),
    summary: (data.summary as string) ?? "",
    readTime: (data.readTime as string) ?? "5 นาที",
    readers: (data.readers as string) ?? "0",
    locked: Boolean(data.locked),
    order: Number(data.order ?? 99),
  }
  return { meta, content }
}

async function collectMdFiles(base = ""): Promise<string[]> {
  let result: string[] = []
  const dir = base ? path.join(DOCS_DIR, base) : DOCS_DIR
  let entries: string[] = []
  try { entries = await fs.readdir(dir) } catch { return result }
  for (const entry of entries) {
    const rel = base ? `${base}/${entry}` : entry
    const full = path.join(DOCS_DIR, rel)
    const stat = await fs.stat(full).catch(() => null)
    if (!stat) continue
    if (stat.isDirectory()) result = result.concat(await collectMdFiles(rel))
    // `.en.md` (and any future `.xx.md`) are language overlays, not their own
    // docs — the listing is driven by the base Thai files only.
    else if (entry.endsWith(".md") && !/\.[a-z]{2}\.md$/.test(entry)) result.push(rel)
  }
  return result
}

const ttl = process.env.NODE_ENV === "production" ? 3600 : 30

async function _getAllDocs(lang: Lang = "th"): Promise<DocMeta[]> {
  let files: string[] = []
  try { files = await collectMdFiles() } catch { return [] }
  const docs = await Promise.all(files.map(async (f) => (await readDoc(f, lang)).meta))
  return docs.sort((a, b) => a.order - b.order)
}

// `lang` is an argument, so unstable_cache stores a separate entry per language.
export const getAllDocs = unstable_cache(_getAllDocs, ["dlab-docs-all"], { revalidate: ttl })

export async function getDocsByLevel(lang: Lang = "th"): Promise<Record<DocLevel, DocMeta[]>> {
  const all = await getAllDocs(lang)
  const groups: Record<DocLevel, DocMeta[]> = { beginner: [], intermediate: [], pro: [] }
  for (const d of all) groups[d.level]?.push(d)
  return groups
}

export type ToolGroup = {
  tool: string
  toolSlug: string
  count: number
  levels: DocLevel[]
  summary: string
  anyLocked: boolean
}

const LEVEL_ORDER: Record<DocLevel, number> = { beginner: 0, intermediate: 1, pro: 2 }

const TOOLS_CONFIG = path.join(process.cwd(), "content", "docs", "_tools.json")

export async function getToolConfig(): Promise<Record<string, boolean>> {
  try {
    const raw = await fs.readFile(TOOLS_CONFIG, "utf8")
    return JSON.parse(raw) as Record<string, boolean>
  } catch {
    return {}
  }
}

export async function saveToolConfig(config: Record<string, boolean>): Promise<void> {
  await fs.writeFile(TOOLS_CONFIG, JSON.stringify(config, null, 2), "utf8")
}

/** One entry per tool, aggregated from all docs — powers the /docs tool grid. */
export async function getToolGroups(lang: Lang = "th"): Promise<ToolGroup[]> {
  const [all, config] = await Promise.all([getAllDocs(lang), getToolConfig()])
  const map = new Map<string, ToolGroup>()
  for (const d of all) {
    if (config[d.tool] === false) continue
    const g = map.get(d.toolSlug)
    if (g) {
      g.count++
      if (!g.levels.includes(d.level)) g.levels.push(d.level)
      if (d.locked) g.anyLocked = true
      if (!g.summary) g.summary = d.summary
    } else {
      map.set(d.toolSlug, {
        tool: d.tool, toolSlug: d.toolSlug, count: 1,
        levels: [d.level], summary: d.summary, anyLocked: d.locked,
      })
    }
  }
  for (const g of map.values()) g.levels.sort((a, b) => LEVEL_ORDER[a] - LEVEL_ORDER[b])
  return [...map.values()].sort((a, b) => a.tool.localeCompare(b.tool))
}

/** All docs for one tool (by toolSlug), each with rendered html, grouped-ready (sorted by level then order). */
async function _getDocsForTool(toolSlug: string, lang: Lang = "th"): Promise<{ tool: string; sections: { meta: DocMeta; html: string }[] }> {
  const all = await getAllDocs(lang)
  const matching = all.filter((d) => d.toolSlug === toolSlug)
    .sort((a, b) => (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) || (a.order - b.order))
  const sections = await Promise.all(matching.map(async (m) => {
    const { content } = await readDoc(`${m.slug}.md`, lang)
    return { meta: m, html: marked.parse(content) as string }
  }))
  return { tool: matching[0]?.tool ?? toolSlug, sections }
}

export const getDocsForTool = unstable_cache(_getDocsForTool, ["dlab-docs-tool"], { revalidate: ttl })

export async function getDoc(slug: string, lang: Lang = "th"): Promise<{ meta: DocMeta; html: string } | null> {
  try {
    const { meta, content } = await readDoc(`${slug}.md`, lang)
    const html = marked.parse(content) as string
    return { meta, html }
  } catch {
    return null
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await getAllDocs()
  return all.map((d) => d.slug)
}

/** Raw markdown body for editing in the admin CRUD. */
export async function getDocSource(slug: string): Promise<{ meta: DocMeta; body: string } | null> {
  try {
    const { meta, content } = await readDoc(`${slug}.md`)
    return { meta, body: content }
  } catch {
    return null
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "doc"
}

export type DocInput = {
  slug?: string
  title: string
  tool: string
  icon?: string
  level: DocLevel
  summary: string
  readTime?: string
  readers?: string
  locked?: boolean
  order?: number
  body: string
}

/** Create or overwrite a markdown doc file (admin only — caller must authorize). */
export async function saveDoc(input: DocInput): Promise<string> {
  const slug = (input.slug && input.slug.trim()) ? input.slug.trim() : slugify(input.title)
  const data = {
    title: input.title,
    tool: input.tool || "AI",
    icon: input.icon || "icon-docs",
    level: input.level,
    summary: input.summary || "",
    readTime: input.readTime || "5 นาที",
    readers: input.readers || "0",
    locked: Boolean(input.locked),
    order: Number(input.order ?? 99),
  }
  const file = matter.stringify(input.body ?? "", data)
  await fs.mkdir(DOCS_DIR, { recursive: true })
  await fs.writeFile(path.join(DOCS_DIR, `${slug}.md`), file, "utf8")
  return slug
}

export async function deleteDoc(slug: string): Promise<void> {
  await fs.unlink(path.join(DOCS_DIR, `${slug}.md`))
}
