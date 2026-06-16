// Client-safe i18n core (no next/headers). Import this from client components.
import { th } from "./locales/th"

export type Lang = "th" | "en"

type Vars = Record<string, string | number>

/**
 * Pick a localized DB field with Thai fallback. Content rows carry `<base>_en`
 * columns (e.g. `title_en`); when English is requested but the translation is
 * empty/missing, the Thai original (`<base>`) is used so nothing renders blank.
 */
export function locField(row: Record<string, unknown>, base: string, lang: Lang): string {
  if (lang === "en") {
    const en = row[`${base}_en`]
    if (typeof en === "string" && en.trim()) return en
  }
  return (row[base] as string) ?? ""
}

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** English string is the key. t("Start free") -> "เริ่มฟรี" in Thai. Supports {placeholders}. */
export function makeT(lang: Lang) {
  return (en: string, vars?: Vars) =>
    interpolate(lang === "th" ? (th[en] ?? en) : en, vars)
}
