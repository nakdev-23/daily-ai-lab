import Image from "next/image"
import Link from "next/link"
import { BriefcaseBusiness, ChevronRight, ClipboardCheck, FolderOpen } from "lucide-react"
import { getMyPortfolio } from "@/lib/path-projects"
import { getLang, makeT } from "@/lib/i18n"

function formatDate(iso: string, lang: "th" | "en") {
  return new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso))
}

export default async function PortfolioPage() {
  const [artifacts, lang] = await Promise.all([getMyPortfolio(), getLang()])
  const t = makeT(lang)

  return (
    <section className="portfolio-page">
      <header className="portfolio-head">
        <div>
          <span><BriefcaseBusiness size={17} /> {t("Portfolio artifacts")}</span>
          <h1 className="display">{t("Work you can show, reuse, and improve")}</h1>
          <p>{t("Projects from Career Paths are saved here with their rubric feedback.")}</p>
        </div>
        <Image src="/assets/daily-ai-lab/mascot-ds/mascot-laptop.png" alt="Riri" width={126} height={126} />
      </header>

      {artifacts.length === 0 ? (
        <div className="portfolio-empty">
          <FolderOpen size={34} />
          <h2 className="display">{t("Build your first portfolio artifact")}</h2>
          <p>{t("Complete a project in any Career Path. Your submitted work and feedback will appear here.")}</p>
          <Link className="btn btn--violet lg" href="/paths">{t("Choose a Career Path")} <ChevronRight size={18} /></Link>
        </div>
      ) : (
        <div className="portfolio-list">
          {artifacts.map((artifact) => (
            <article className="portfolio-artifact" key={artifact.id}>
              <div className="portfolio-meta">
                <span>{artifact.pathTitle}</span>
                <time>{formatDate(artifact.updatedAt, lang)}</time>
              </div>
              <h2 className="display">{artifact.artifactTitle}</h2>
              <p>{artifact.content.slice(0, 220)}{artifact.content.length > 220 ? "…" : ""}</p>
              <div className="portfolio-foot">
                <span className="portfolio-score"><ClipboardCheck size={16} /> {t("Rubric score")} {artifact.feedback.score}/100</span>
                <Link href={`/paths/${artifact.pathSlug}`}>
                  {t("Improve this project")} <ChevronRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
