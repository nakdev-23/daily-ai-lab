import { getLang } from "@/lib/i18n"
import { getMyTickets } from "@/lib/support"
import SupportClient from "./_support-client"
import "./support.css"

export const metadata = { title: "ฟีดแบ็ก & ติดต่อ Support" }

export default async function SupportPage() {
  const [tickets, lang] = await Promise.all([getMyTickets(), getLang()])
  return <SupportClient tickets={tickets ?? []} tableMissing={tickets === null} lang={lang} />
}
