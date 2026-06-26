import Image from "next/image"
import Link from "next/link"
import { ShieldX } from "lucide-react"
import { getLang, makeT } from "@/lib/i18n"
import "./certificate.css"

export default async function CertificateNotFound() {
  const lang = await getLang()
  const t = makeT(lang)
  return (
    <main className="certificate-page">
      <div className="certificate-topbar">
        <Link href="/" className="certificate-brand">
          <Image src="/assets/daily-ai-lab/mascot-ds/mascot-hello.png" alt="Riri" width={44} height={44} />
          Daily AI Lab
        </Link>
      </div>
      <section className="certificate-sheet">
        <div className="certificate-seal" style={{ background: "#FCDFDE", color: "#B72D27", boxShadow: "0 5px 0 #EEAAA6" }}>
          <ShieldX size={38} />
        </div>
        <h1>{t("Certificate not found")}</h1>
        <p className="certificate-copy">
          {t("Check that the verification URL or certificate ID is complete and try again.")}
        </p>
        <div className="certificate-actions">
          <Link href="/" className="primary">{t("Go to Daily AI Lab")}</Link>
        </div>
      </section>
    </main>
  )
}

