/** Shared AI-tool brand gradients — reused by docs grid, docs admin, dashboard, etc. */
export const TOOL_BG: Record<string, string> = {
  ChatGPT: "linear-gradient(160deg,#23D08A,#0E8F5E)",
  Claude: "linear-gradient(160deg,#FFA866,#E2611C)",
  Gemini: "linear-gradient(160deg,#6F9CFF,#2A6FF0)",
  Midjourney: "linear-gradient(160deg,#BC83FF,#6C3CF5)",
  Suno: "linear-gradient(160deg,#FF93BE,#F45C97)",
  Runway: "linear-gradient(160deg,#5C5675,#1B1729)",
  Perplexity: "linear-gradient(160deg,#2FD68F,#0E8F5E)",
  "DALL·E": "linear-gradient(160deg,#FFB36B,#E2611C)",
}

/** Fallback brand gradient for unknown tools. */
export const TOOL_BG_DEFAULT = "var(--g-violet)"

export const toolBg = (tool: string) => TOOL_BG[tool] ?? TOOL_BG_DEFAULT
