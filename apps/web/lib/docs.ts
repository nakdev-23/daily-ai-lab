import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { marked } from "marked"

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

async function readDoc(file: string) {
  const raw = await fs.readFile(path.join(DOCS_DIR, file), "utf8")
  const { data, content } = matter(raw)
  const slug = file.replace(/\.md$/, "")
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

export async function getAllDocs(): Promise<DocMeta[]> {
  let files: string[] = []
  try {
    files = (await fs.readdir(DOCS_DIR)).filter((f) => f.endsWith(".md"))
  } catch {
    return []
  }
  const docs = await Promise.all(files.map(async (f) => (await readDoc(f)).meta))
  return docs.sort((a, b) => a.order - b.order)
}

export async function getDocsByLevel(): Promise<Record<DocLevel, DocMeta[]>> {
  const all = await getAllDocs()
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

/** One entry per tool, aggregated from all docs — powers the /docs tool grid. */
export async function getToolGroups(): Promise<ToolGroup[]> {
  const all = await getAllDocs()
  const map = new Map<string, ToolGroup>()
  for (const d of all) {
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
export async function getDocsForTool(toolSlug: string): Promise<{ tool: string; sections: { meta: DocMeta; html: string }[] }> {
  const all = await getAllDocs()
  const matching = all.filter((d) => d.toolSlug === toolSlug)
    .sort((a, b) => (LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]) || (a.order - b.order))
  const sections = await Promise.all(matching.map(async (m) => {
    const { content } = await readDoc(`${m.slug}.md`)
    return { meta: m, html: marked.parse(content) as string }
  }))
  return { tool: matching[0]?.tool ?? toolSlug, sections }
}

export async function getDoc(slug: string): Promise<{ meta: DocMeta; html: string } | null> {
  try {
    const { meta, content } = await readDoc(`${slug}.md`)
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
