import { cookies } from "next/headers"
import { cache } from "react"
import type { Lang } from "./i18n-core"

export type { Lang } from "./i18n-core"
export { makeT } from "./i18n-core"
export const LANG_COOKIE = "lang"

/** Read the active language in a Server Component (defaults to Thai). Memoized per request. */
export const getLang = cache(async (): Promise<Lang> => {
  const store = await cookies()
  return store.get(LANG_COOKIE)?.value === "en" ? "en" : "th"
})
