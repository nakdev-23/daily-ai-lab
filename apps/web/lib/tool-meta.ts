/**
 * Tool brand gradients — all data lives in lib/tool-registry.ts.
 * This file keeps the same API so existing callers don't need changes.
 */
import { getTool, DEFAULT_TOOL } from "./tool-registry"

export const TOOL_BG_DEFAULT = DEFAULT_TOOL.bg
export const toolBg = (tool: string) => getTool(tool)?.bg ?? TOOL_BG_DEFAULT

/** @deprecated Use toolBg() — kept for legacy callers */
export const TOOL_BG: Record<string, string> = new Proxy({} as Record<string, string>, {
  get: (_t, name: string) => toolBg(name),
})
