import Image from "next/image"
import Link from "next/link"
import { Crown, ChevronRight } from "lucide-react"
import { getSystemSettings } from "@/lib/system-settings"
import { getProfile, isPro } from "@/lib/auth"
import { getLang, makeT } from "@/lib/i18n"
import { getCareerPath, totalSteps } from "@/lib/career-paths"
import { FREE_CAREER_PREVIEW_STEPS } from "@/lib/career-preview"
import UpgradeClient from "./_upgrade-client"

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; step?: string; reason?: string }>
}) {
  // Pricing + Free quota are whatever the admin set in Admin › System settings.
  const [s, lang, profile, sp] = await Promise.all([getSystemSettings(), getLang(), getProfile(), searchParams])

  // Already Pro → no sales pitch, just a friendly confirmation.
  if (isPro(profile)) {
    const t = makeT(lang)
    return (
      <div className="up-hero" style={{ paddingBottom: 40 }}>
        <Image className="up-mascot" src="/assets/daily-ai-lab/mascot-ds/cockatiel-superhero.png" alt="Riri Pro" width={120} height={120} />
        <h1><Crown size={26} className="text-amber-500" style={{ display: "inline", verticalAlign: "-3px" }} /> {t("You're on Pro")}</h1>
        <p>{t("Unlimited lessons, all career paths and unlimited hearts.")}</p>
        <Link className="btn btn--violet lg" href="/daily-learn" style={{ marginTop: 18 }}>
          {t("Keep learning")} <ChevronRight size={18} />
        </Link>
      </div>
    )
  }

  // Contextual upsell: when the user came from a locked path step, show a
  // path-specific pitch. Bad/missing slug → falls back to the generic page.
  const reason = sp.reason === "daily_limit" ? "daily_limit" : sp.path ? "path_locked" : undefined
  let pathContext: {
    title: string; remaining: number; outcomes: string[]; deliverables: string[]
  } | undefined
  if (sp.path) {
    const cp = await getCareerPath(sp.path, lang)
    if (cp) {
      pathContext = {
        title: cp.title,
        remaining: Math.max(1, totalSteps(cp) - FREE_CAREER_PREVIEW_STEPS),
        outcomes: cp.outcomes.slice(0, 4),
        deliverables: cp.deliverables.slice(0, 5),
      }
    }
  }

  return (
    <UpgradeClient
      priceMonth={s.proPriceMonth}
      priceYear={s.proPriceYear}
      freePerDay={s.freeLessonsPerDay}
      lang={lang}
      reason={reason}
      pathContext={pathContext}
    />
  )
}
