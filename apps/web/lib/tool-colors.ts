/**
 * Tool color helpers — all data lives in lib/tool-registry.ts.
 * This file keeps the same API so existing callers don't need changes.
 */
import { getTool, DEFAULT_TOOL, type ToolDef } from "./tool-registry"

export type ToolColors = Pick<ToolDef, "fallback" | "bg" | "dot" | "soft" | "sh" | "blob" | "bar" | "bar2">

export const DEFAULT_TOOL_COLORS: ToolColors = DEFAULT_TOOL

export function getToolColors(tool: string): ToolColors {
  return getTool(tool) ?? DEFAULT_TOOL_COLORS
}
