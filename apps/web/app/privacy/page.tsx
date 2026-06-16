import "../home.css"
import LegalPage from "@/components/legal-page"
import { getLang } from "@/lib/i18n"

export const metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัวของ Daily AI Lab — ข้อมูลที่เราเก็บ วิธีใช้ และสิทธิของคุณ",
  alternates: { canonical: "/privacy" },
}

export default async function PrivacyPage() {
  const lang = await getLang()
  return <LegalPage kind="privacy" lang={lang} />
}
