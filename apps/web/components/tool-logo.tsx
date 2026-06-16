/**
 * ToolLogo — resolves the right icon for each AI tool.
 * All tool → icon mappings live in lib/tool-registry.ts.
 *
 * To add a new tool icon:
 *  - react-icons: add key to SI_ICONS below, set icon: { type: "si", key: "SiXxx" } in registry
 *  - SVG file:    drop file in /public/assets/daily-ai-lab/icons/, set icon: { type: "svg", file: "tool-xxx" } in registry
 */
import type { IconType } from "react-icons"
import {
  SiOpenai, SiClaude, SiGooglegemini, SiSuno, SiPerplexity, SiBytedance, SiWindsurf,
  SiOllama, SiHuggingface, SiStackblitz, SiReplit, SiElevenlabs,
} from "react-icons/si"
import { getTool } from "@/lib/tool-registry"

const SI_ICONS: Record<string, IconType> = {
  SiOpenai,
  SiClaude,
  SiGooglegemini,
  SiSuno,
  SiPerplexity,
  SiBytedance,
  SiWindsurf,
  SiOllama,
  SiHuggingface,
  SiStackblitz,
  SiReplit,
  SiElevenlabs,
}

export default function ToolLogo({
  name,
  size = 24,
  fallback,
}: {
  name: string
  size?: number
  fallback?: string
}) {
  const tool = getTool(name)
  const icon = tool?.icon

  if (icon?.type === "si") {
    const Icon = SI_ICONS[icon.key]
    if (Icon) return <Icon size={size} />
  }

  if (icon?.type === "svg") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG icons; next/image adds no value here
      <img
        src={`/assets/daily-ai-lab/icons/${icon.file}.svg`}
        alt={name}
        width={size}
        height={size}
        style={{ filter: "brightness(0) invert(1)", objectFit: "contain" }}
      />
    )
  }

  return (
    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size * 0.62, lineHeight: 1 }}>
      {fallback ?? tool?.fallback ?? name.charAt(0)}
    </span>
  )
}
