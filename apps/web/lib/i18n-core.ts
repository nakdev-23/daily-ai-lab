// Client-safe i18n core (no next/headers). Import this from client components.
import { th } from "./locales/th"

export type Lang = "th" | "en"

type Vars = Record<string, string | number>

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** English string is the key. t("Start free") -> "เริ่มฟรี" in Thai. Supports {placeholders}. */
export function makeT(lang: Lang) {
  return (en: string, vars?: Vars) =>
    interpolate(lang === "th" ? (th[en] ?? en) : en, vars)
}
