"use client"

import {
  OpenAI, Claude, Gemini, Midjourney, Dalle, Sora, Suno, Runway, Perplexity,
  Grok, DeepSeek, Mistral, Stability, Ideogram, Flux, ElevenLabs, Kling, Pika,
  Udio, HuggingFace, Ollama, Qwen, Copilot, NotebookLM, Google, Meta, Microsoft,
} from "@lobehub/icons"

type LobeBrand = { Color?: React.ComponentType<{ size?: number }> } & React.ComponentType<{ size?: number }>

/** key -> { label, brand component }. The key is what we persist in a doc's frontmatter `icon`. */
export const AI_ICON_MAP: Record<string, { label: string; brand: LobeBrand }> = {
  openai: { label: "ChatGPT / OpenAI", brand: OpenAI as LobeBrand },
  claude: { label: "Claude", brand: Claude as LobeBrand },
  gemini: { label: "Gemini", brand: Gemini as LobeBrand },
  midjourney: { label: "Midjourney", brand: Midjourney as LobeBrand },
  dalle: { label: "DALL·E", brand: Dalle as LobeBrand },
  sora: { label: "Sora", brand: Sora as LobeBrand },
  suno: { label: "Suno", brand: Suno as LobeBrand },
  runway: { label: "Runway", brand: Runway as LobeBrand },
  perplexity: { label: "Perplexity", brand: Perplexity as LobeBrand },
  grok: { label: "Grok", brand: Grok as LobeBrand },
  deepseek: { label: "DeepSeek", brand: DeepSeek as LobeBrand },
  mistral: { label: "Mistral", brand: Mistral as LobeBrand },
  stability: { label: "Stability AI", brand: Stability as LobeBrand },
  ideogram: { label: "Ideogram", brand: Ideogram as LobeBrand },
  flux: { label: "Flux", brand: Flux as LobeBrand },
  elevenlabs: { label: "ElevenLabs", brand: ElevenLabs as LobeBrand },
  kling: { label: "Kling", brand: Kling as LobeBrand },
  pika: { label: "Pika", brand: Pika as LobeBrand },
  udio: { label: "Udio", brand: Udio as LobeBrand },
  huggingface: { label: "Hugging Face", brand: HuggingFace as LobeBrand },
  ollama: { label: "Ollama", brand: Ollama as LobeBrand },
  qwen: { label: "Qwen", brand: Qwen as LobeBrand },
  copilot: { label: "Copilot", brand: Copilot as LobeBrand },
  notebooklm: { label: "NotebookLM", brand: NotebookLM as LobeBrand },
  google: { label: "Google AI", brand: Google as LobeBrand },
  meta: { label: "Meta AI", brand: Meta as LobeBrand },
  microsoft: { label: "Microsoft", brand: Microsoft as LobeBrand },
}

export const AI_ICON_KEYS = Object.keys(AI_ICON_MAP)

/** Map a human tool name to an icon key (used to auto-pick a logo from a tool name). */
export function toolToIconKey(tool: string): string | undefined {
  const t = tool.toLowerCase().replace(/[^a-z]/g, "")
  const direct: Record<string, string> = {
    chatgpt: "openai", openai: "openai", dalle: "dalle", sora: "sora",
    claude: "claude", gemini: "gemini", midjourney: "midjourney", suno: "suno",
    runway: "runway", perplexity: "perplexity", grok: "grok", deepseek: "deepseek",
    mistral: "mistral", stability: "stability", ideogram: "ideogram", flux: "flux",
    elevenlabs: "elevenlabs", kling: "kling", pika: "pika", udio: "udio",
    huggingface: "huggingface", ollama: "ollama", qwen: "qwen", copilot: "copilot",
  }
  return direct[t] ?? (AI_ICON_MAP[t] ? t : undefined)
}

/**
 * Renders a real AI brand logo. `name` is an icon key (e.g. "openai") or a tool name.
 * Falls back to a colored-letter chip for unknown tools.
 */
export default function AiLogo({ name, size = 24, fallback }: { name: string; size?: number; fallback?: string }) {
  const key = AI_ICON_MAP[name] ? name : toolToIconKey(name)
  const entry = key ? AI_ICON_MAP[key] : undefined
  if (entry) {
    const Brand = entry.brand
    const Colored = Brand.Color ?? Brand
    return <Colored size={size} />
  }
  return <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size * 0.62, lineHeight: 1 }}>{fallback ?? name.charAt(0)}</span>
}
