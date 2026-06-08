import type { IconType } from "react-icons"
import { SiOpenai, SiClaude, SiGooglegemini, SiSuno, SiPerplexity } from "react-icons/si"

/** Real brand logos where available; colored-letter fallback otherwise. */
const MAP: Record<string, IconType> = {
  ChatGPT: SiOpenai,
  "DALL·E": SiOpenai,
  "DALL-E": SiOpenai,
  Sora: SiOpenai,
  Claude: SiClaude,
  Gemini: SiGooglegemini,
  Suno: SiSuno,
  Perplexity: SiPerplexity,
}

export default function ToolLogo({ name, size = 24, fallback }: { name: string; size?: number; fallback?: string }) {
  const Icon = MAP[name]
  if (Icon) return <Icon size={size} />
  return <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size * 0.62, lineHeight: 1 }}>{fallback ?? name.charAt(0)}</span>
}
