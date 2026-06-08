import { requireAdmin } from "@/lib/auth"
import { getLeagues, getBadges } from "@/lib/leagues"
import LeaguesAdmin from "./_leagues-admin"

export default async function AdminLeaguesPage() {
  await requireAdmin()
  const [leagues, badges] = await Promise.all([getLeagues(), getBadges()])
  return <LeaguesAdmin leagues={leagues} badges={badges} />
}
