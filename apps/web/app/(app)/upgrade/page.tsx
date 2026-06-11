import { getSystemSettings } from "@/lib/system-settings"
import UpgradeClient from "./_upgrade-client"

export default async function UpgradePage() {
  // Pricing is whatever the admin set in Admin › System settings.
  const s = await getSystemSettings()
  return <UpgradeClient priceMonth={s.proPriceMonth} priceYear={s.proPriceYear} />
}
