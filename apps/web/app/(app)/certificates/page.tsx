import Image from "next/image"
import Link from "next/link"
import { Award, CalendarDays, ChevronRight, ShieldCheck } from "lucide-react"
import { getMyCertificates } from "@/lib/certificates"
import { getLang, makeT } from "@/lib/i18n"

function formatDate(iso: string, lang: "th" | "en") {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso))
}

export default async function CertificatesPage() {
  const [certificates, lang] = await Promise.all([getMyCertificates(), getLang()])
  const t = makeT(lang)

  return (
    <section className="certificates-page">
      <div className="certificates-head">
        <div>
          <h1 className="display">{t("Your certificates")}</h1>
          <p>{t("Certificates appear here automatically when you complete a Career Path.")}</p>
        </div>
        <Image src="/assets/daily-ai-lab/mascot-ds/mascot-celebrate.png" alt="Riri" width={112} height={112} />
      </div>

      {certificates.length === 0 ? (
        <div className="certificates-empty">
          <Award size={34} />
          <h2 className="display">{t("Your first certificate is waiting")}</h2>
          <p>{t("Complete every step in a Career Path, and your verifiable certificate will be issued automatically.")}</p>
          <Link className="btn btn--violet lg" href="/paths">
            {t("Explore Career Paths")} <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="certificates-list">
          {certificates.map((certificate) => {
            const title = lang === "en" && certificate.pathTitleEn
              ? certificate.pathTitleEn
              : certificate.pathTitle
            return (
              <article className="certificate-row" key={certificate.verificationCode}>
                <span className="certificate-row-icon"><Award size={24} /></span>
                <div className="certificate-row-copy">
                  <h2 className="display">{title}</h2>
                  <p>
                    <CalendarDays size={14} />
                    {formatDate(certificate.issuedAt, lang)}
                    <span aria-hidden>·</span>
                    <ShieldCheck size={14} />
                    {certificate.valid ? t("Verified") : t("Revoked")}
                  </p>
                  <code>{certificate.verificationCode}</code>
                </div>
                <Link className="btn btn--violet sm" href={`/certificate/${certificate.verificationCode}`}>
                  {t("View certificate")} <ChevronRight size={16} />
                </Link>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
