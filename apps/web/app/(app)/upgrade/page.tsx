import Image from "next/image"
import Link from "next/link"
import { Crown, ChevronRight } from "lucide-react"
import { getSystemSettings } from "@/lib/system-settings"
import { getProfile, isPro } from "@/lib/auth"
import { getLang, makeT } from "@/lib/i18n"
import UpgradeClient from "./_upgrade-client"

export default async function UpgradePage() {
  // Pricing + Free quota are whatever the admin set in Admin › System settings.
  const [s, lang, profile] = await Promise.all([getSystemSettings(), getLang(), getProfile()])

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

  return <UpgradeClient priceMonth={s.proPriceMonth} priceYear={s.proPriceYear} freePerDay={s.freeLessonsPerDay} lang={lang} />
}
