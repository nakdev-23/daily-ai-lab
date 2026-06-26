import "server-only"

// Cheap, fast grader for a learner's practice prompt. Haiku 4.5 is plenty for a
// short rubric check and keeps the per-call cost near nothing. The model can be
// swapped here without touching callers.
const MODEL = "claude-haiku-4-5"

export type AiReviewCriterion = { label: string; met: boolean; note: string }

export type AiReviewResult =
  | { ok: true; overall: "strong" | "ok" | "weak"; summary: string; criteria: AiReviewCriterion[]; improved: string }
  | { ok: false; reason: "unavailable" | "invalid" | "error" }

// Structured-output schema: the model returns exactly this JSON (no prose),
// so the client never has to scrape free text. Note the structured-outputs
// limitation — no minLength/maxLength/enum-on-arrays; keep it simple.
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overall", "summary", "criteria", "improved"],
  properties: {
    overall: { type: "string", enum: ["strong", "ok", "weak"] },
    summary: { type: "string" },
    criteria: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "met", "note"],
        properties: {
          label: { type: "string" },
          met: { type: "boolean" },
          note: { type: "string" },
        },
      },
    },
    improved: { type: "string" },
  },
} as const

/**
 * Grades a learner's prompt against the lesson's requirements using Claude.
 * Never throws — returns `{ ok: false }` when the API key is missing, the input
 * is malformed, or the call fails, so the practice UI can degrade gracefully.
 * Pro-gating and rate-limiting are the caller's job (server action).
 */
export async function reviewPromptWithAI(input: {
  draft: string
  requirements: string[]
  scenario?: string
}): Promise<AiReviewResult> {
  const draft = input.draft?.trim() ?? ""
  const requirements = (input.requirements ?? []).map((r) => r.trim()).filter(Boolean).slice(0, 8)
  if (draft.length < 10 || draft.length > 2000 || requirements.length === 0) {
    return { ok: false, reason: "invalid" }
  }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, reason: "unavailable" }

  const system =
    "คุณเป็นติวเตอร์ AI ภาษาไทยที่ใจดีและให้กำลังใจ หน้าที่คือตรวจ prompt ที่ผู้เรียนมือใหม่เขียน " +
    "เทียบกับเกณฑ์ที่กำหนด แล้วบอกว่าแต่ละเกณฑ์ผ่านไหมพร้อมคำแนะนำสั้น ๆ ที่นำไปแก้ได้จริง " +
    "ใช้ภาษาที่เข้าใจง่าย เป็นกันเอง ไม่ใช้ศัพท์เทคนิค ตอบเป็น JSON ตาม schema เท่านั้น"

  const user =
    (input.scenario ? `สถานการณ์: ${input.scenario}\n\n` : "") +
    `เกณฑ์ที่ต้องมีครบ:\n${requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n` +
    `prompt ที่ผู้เรียนเขียน:\n"""${draft}"""\n\n` +
    "ประเมินแต่ละเกณฑ์ (criteria: label = ชื่อเกณฑ์, met = ผ่านไหม, note = คำแนะนำสั้น ๆ ภาษาไทย), " +
    "ให้ overall (strong/ok/weak), summary (1–2 ประโยคให้กำลังใจ + จุดที่ควรปรับ), " +
    "และ improved = ตัวอย่าง prompt ฉบับที่ดีขึ้นซึ่งผู้เรียนก๊อปไปใช้ต่อได้ทันที"

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: user }],
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
      }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) {
      console.error("ai-prompt-review failed", response.status, await response.text())
      return { ok: false, reason: "error" }
    }

    const res = await response.json() as {
      content?: Array<{ type?: string; text?: string }>
    }
    const text = res.content?.find((block) => block.type === "text")?.text
    if (!text) return { ok: false, reason: "error" }
    const parsed = JSON.parse(text) as {
      overall?: string
      summary?: string
      criteria?: { label?: string; met?: boolean; note?: string }[]
      improved?: string
    }

    const overall = parsed.overall === "strong" || parsed.overall === "weak" ? parsed.overall : "ok"
    const criteria = (parsed.criteria ?? [])
      .filter((c) => typeof c?.label === "string")
      .map((c) => ({ label: String(c.label), met: c.met === true, note: String(c.note ?? "") }))
    return {
      ok: true,
      overall,
      summary: String(parsed.summary ?? ""),
      criteria,
      improved: String(parsed.improved ?? ""),
    }
  } catch (err) {
    console.error("ai-prompt-review failed", err)
    return { ok: false, reason: "error" }
  }
}

export type AiRunResult =
  | { ok: true; output: string; comment: string }
  | { ok: false; reason: "unavailable" | "invalid" | "error" }

const RUN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["output", "comment"],
  properties: {
    output: { type: "string" },
    comment: { type: "string" },
  },
} as const

/**
 * Runs a learner's prompt for real and returns the model's answer (output) plus
 * a short coaching note (comment) on why the prompt produced that and how to
 * improve it — so they see "if I write it like this, here is what I get, and
 * here is how to make it better." Uses cheap Haiku; never throws. Auth +
 * rate-limiting are the caller's job. Output is an AI demo, not literally
 * ChatGPT/Gemini, which is fine for showing how wording changes the result.
 */
export async function runPromptDemo(prompt: string): Promise<AiRunResult> {
  const text = prompt?.trim() ?? ""
  if (text.length < 10 || text.length > 2000) return { ok: false, reason: "invalid" }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, reason: "unavailable" }

  const system =
    "คุณเป็นผู้ช่วยติวเตอร์ AI ภาษาไทย ผู้เรียนส่ง prompt มา ให้คุณทำสองอย่างแล้วตอบเป็น JSON ตาม schema เท่านั้น: " +
    "(1) output = ผลลัพธ์จริงถ้านำ prompt นี้ไปใช้ ทำตามที่ prompt สั่งจริง ตอบเป็นภาษาเดียวกับ prompt ไม่ต้องเกริ่นนำ " +
    "(2) comment = คำติชมสั้น ๆ 1-2 ประโยค ว่า prompt นี้ให้ผลแบบนี้เพราะอะไร และจะทำให้ผลดีขึ้นได้อย่างไร"

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system,
        messages: [{ role: "user", content: `prompt ของผู้เรียน:\n"""${text}"""` }],
        output_config: { format: { type: "json_schema", schema: RUN_SCHEMA } },
      }),
      signal: AbortSignal.timeout(25_000),
    })
    if (!response.ok) {
      console.error("ai-run failed", response.status, await response.text())
      return { ok: false, reason: "error" }
    }
    const res = await response.json() as { content?: Array<{ type?: string; text?: string }> }
    const raw = res.content?.find((b) => b.type === "text")?.text
    if (!raw) return { ok: false, reason: "error" }
    const parsed = JSON.parse(raw) as { output?: string; comment?: string }
    const output = String(parsed.output ?? "").trim()
    if (!output) return { ok: false, reason: "error" }
    return { ok: true, output, comment: String(parsed.comment ?? "").trim() }
  } catch (err) {
    console.error("ai-run failed", err)
    return { ok: false, reason: "error" }
  }
}

export type AiProjectReviewResult =
  | { ok: true; overall: "strong" | "ok" | "weak"; score: number; summary: string; criteria: AiReviewCriterion[]; priorityFix: string; improvedExample: string }
  | { ok: false; reason: "unavailable" | "invalid" | "error" }

// Adds a 0-100 score (drives the soft pass-gate) and an improvedExample — a
// concrete stronger version of the learner's work (e.g. a sharper prompt) they
// can read as a model answer.
const PROJECT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overall", "score", "summary", "criteria", "priorityFix", "improvedExample"],
  properties: {
    overall: { type: "string", enum: ["strong", "ok", "weak"] },
    score: { type: "integer" },
    summary: { type: "string" },
    criteria: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "met", "note"],
        properties: {
          label: { type: "string" },
          met: { type: "boolean" },
          note: { type: "string" },
        },
      },
    },
    priorityFix: { type: "string" },
    improvedExample: { type: "string" },
  },
} as const

/**
 * Grades a learner's career-path project/checkpoint submission against the
 * step's rubric using Claude. Like reviewPromptWithAI it never throws and
 * returns `{ ok: false }` on missing key / bad input / API failure so the
 * submission still saves with the deterministic rubric feedback. Pro-gating and
 * rate-limiting are the caller's responsibility.
 */
export async function reviewProjectWithAI(input: {
  artifactTitle: string
  content: string
  rubric: { label: string; guidance: string }[]
}): Promise<AiProjectReviewResult> {
  const content = input.content?.trim() ?? ""
  // Cap what we send to keep token cost bounded; the opening of a project is the
  // most diagnostic part and the rubric check does not need the full 20k chars.
  const excerpt = content.slice(0, 6000)
  const rubric = (input.rubric ?? [])
    .filter((c) => c && typeof c.label === "string")
    .slice(0, 8)
  if (content.length < 40 || rubric.length === 0) return { ok: false, reason: "invalid" }
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { ok: false, reason: "unavailable" }

  const system =
    "คุณเป็นเมนเทอร์สายอาชีพภาษาไทยที่ใจดีและให้กำลังใจ หน้าที่คือตรวจชิ้นงานโปรเจกต์ที่ผู้เรียนส่ง " +
    "เทียบกับเกณฑ์ (rubric) ของสายอาชีพนั้น แล้วบอกว่าแต่ละเกณฑ์ผ่านไหมพร้อมคำแนะนำสั้น ๆ ที่นำไปแก้ได้จริง " +
    "เน้นให้คำแนะนำที่ทำให้ชิ้นงานพร้อมใส่ portfolio หรือใช้กับงานจริง ตอบเป็น JSON ตาม schema เท่านั้น"

  const user =
    `ชื่อชิ้นงาน: ${input.artifactTitle}\n\n` +
    `เกณฑ์ที่ใช้ประเมิน (rubric):\n${rubric.map((c, i) => `${i + 1}. ${c.label} — ${c.guidance}`).join("\n")}\n\n` +
    `ชิ้นงานที่ผู้เรียนส่ง:\n"""${excerpt}"""\n\n` +
    "ประเมินแต่ละเกณฑ์ (criteria: label = ชื่อเกณฑ์, met = ผ่านไหม, note = คำแนะนำสั้น ๆ ภาษาไทย), " +
    "ให้ overall (strong/ok/weak), score = คะแนนรวม 0-100 ตามเกณฑ์ทั้งหมด (ต้องเข้มงวด: ผ่านดีจริงถึงให้ 90 ขึ้นไป), " +
    "summary (1–2 ประโยคให้กำลังใจ + ภาพรวมที่ควรปรับ), " +
    "priorityFix = สิ่งสำคัญที่สุดหนึ่งอย่างที่ควรแก้ก่อน, " +
    "และ improvedExample = ตัวอย่างฉบับที่ดีขึ้นของงานชิ้นนี้ (ถ้าเป็น prompt ให้เขียน prompt ที่คมและพร้อมใช้จริง) ที่ผู้เรียนดูเป็นแบบและก๊อปไปปรับต่อได้"

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system,
        messages: [{ role: "user", content: user }],
        output_config: { format: { type: "json_schema", schema: PROJECT_SCHEMA } },
      }),
      signal: AbortSignal.timeout(25_000),
    })
    if (!response.ok) {
      console.error("ai-project-review failed", response.status, await response.text())
      return { ok: false, reason: "error" }
    }

    const res = await response.json() as { content?: Array<{ type?: string; text?: string }> }
    const text = res.content?.find((block) => block.type === "text")?.text
    if (!text) return { ok: false, reason: "error" }
    const parsed = JSON.parse(text) as {
      overall?: string
      score?: number
      summary?: string
      criteria?: { label?: string; met?: boolean; note?: string }[]
      priorityFix?: string
      improvedExample?: string
    }

    const overall = parsed.overall === "strong" || parsed.overall === "weak" ? parsed.overall : "ok"
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)))
    const criteria = (parsed.criteria ?? [])
      .filter((c) => typeof c?.label === "string")
      .map((c) => ({ label: String(c.label), met: c.met === true, note: String(c.note ?? "") }))
    return {
      ok: true,
      overall,
      score,
      summary: String(parsed.summary ?? ""),
      criteria,
      priorityFix: String(parsed.priorityFix ?? ""),
      improvedExample: String(parsed.improvedExample ?? ""),
    }
  } catch (err) {
    console.error("ai-project-review failed", err)
    return { ok: false, reason: "error" }
  }
}
