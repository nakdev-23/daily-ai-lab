import "../home.css"
import LegalPage from "@/components/legal-page"
import { getLang } from "@/lib/i18n"

export const metadata = {
  title: "เงื่อนไขการใช้บริการ",
  description: "เงื่อนไขการใช้บริการของ Daily AI Lab — การสมัครสมาชิก แพ็กเกจ Pro การชำระเงิน และการยกเลิก",
  alternates: { canonical: "/terms" },
}

export default async function TermsPage() {
  const lang = await getLang()
  return <LegalPage kind="terms" lang={lang} />
}
