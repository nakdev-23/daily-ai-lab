import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Award, BookOpen, CalendarDays, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { getCertificateByCode } from "@/lib/certificates"
import { getLang, makeT } from "@/lib/i18n"
import CertificateActions from "./_certificate-actions"
import "./certificate.css"

type Props = { params: Promise<{ code: string }> }

function formatDate(iso: string, lang: "th" | "en") {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const certificate = await getCertificateByCode(code)
  return {
    title: certificate ? `Certificate: ${certificate.pathTitle}` : "Certificate not found",
    description: certificate
      ? `Verify the Daily AI Lab certificate issued to ${certificate.recipientName}.`
      : "Verify a Daily AI Lab certificate.",
    robots: { index: false, follow: false },
    alternates: { canonical: `/certificate/${code.toUpperCase()}` },
  }
}

export default async function CertificatePage({ params }: Props) {
  const { code } = await params
  const [certificate, lang] = await Promise.all([
    getCertificateByCode(code),
    getLang(),
  ])
  if (!certificate) notFound()

  const t = makeT(lang)
  const title = lang === "en" && certificate.pathTitleEn
    ? certificate.pathTitleEn
    : certificate.pathTitle

  return (
    <main className="certificate-page">
      <div className="certificate-topbar">
        <Link href="/" className="certificate-brand">
          <Image src="/assets/daily-ai-lab/mascot-ds/mascot-hello.png" alt="Riri" width={44} height={44} />
          Daily AI Lab
        </Link>
        <span className={`certificate-status${certificate.valid ? "" : " invalid"}`}>
          <ShieldCheck size={17} />
          {certificate.valid ? t("Certificate verified") : t("Certificate revoked")}
        </span>
      </div>

      <section className="certificate-sheet" aria-labelledby="certificate-title">
        <div className="certificate-seal"><Award size={38} strokeWidth={2.4} /></div>
        <p className="certificate-kicker">Daily AI Lab</p>
        <h1 id="certificate-title">{t("Certificate of completion")}</h1>
        <p className="certificate-presented">{t("This certificate is presented to")}</p>
        <div className="certificate-name">{certificate.recipientName}</div>
        <p className="certificate-copy">{t("for completing every learning step in")}</p>
        <h2 className="certificate-path-title">{title}</h2>

        <div className="certificate-facts">
          <span><CalendarDays size={16} /> {t("Issued on {date}", { date: formatDate(certificate.issuedAt, lang) })}</span>
          <span><BookOpen size={16} /> {t("{n} learning steps", { n: certificate.completedSteps })}</span>
          <span><Zap size={16} /> {certificate.totalXp.toLocaleString()} XP</span>
          <span>
            <Sparkles size={16} />
            {certificate.valid ? t("Verified achievement") : t("Certificate revoked")}
          </span>
        </div>

        <div className="certificate-code">
          {t("Certificate ID")}: {certificate.verificationCode}
        </div>
      </section>

      <CertificateActions
        copyLabel={t("Copy verification link")}
        copiedLabel={t("Verification link copied")}
        printLabel={t("Print or save PDF")}
      />
    </main>
  )
}
