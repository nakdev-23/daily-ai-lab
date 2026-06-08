import { Flame, Crown, Gem, Trophy, ArrowUp, Medal } from "lucide-react"
import { getLang, makeT } from "@/lib/i18n"

type T = (en: string, vars?: Record<string, string | number>) => string

const PODIUM = [
  { cls: "silver", bg: "linear-gradient(160deg,#7E8BFF,#4731D8)", a: "ก", name: "กานต์", xp: "3,120 แต้ม", rk: 2 },
  { cls: "gold", bg: "linear-gradient(160deg,#FFD45A,#E0A000)", a: "พ", name: "พิมพ์", xp: "4,860 แต้ม", rk: 1, crown: true },
  { cls: "bronze", bg: "linear-gradient(160deg,#FF93BE,#F45C97)", a: "J", name: "Jenny", xp: "2,940 แต้ม", rk: 3 },
]

const ROWS = [
  { rk: 4, up: true, bg: "#14A871", a: "M", name: "Mike", streak: 22, xp: "2,610 แต้ม" },
  { rk: 5, up: true, bg: "#FD7302", a: "อ", name: "อรุณ", streak: 15, xp: "2,540 แต้ม" },
  { rk: 6, me: true, bg: "var(--hero-500)", a: "N", name: "Nin", streak: 12, xp: "2,480 แต้ม" },
  { rk: 7, bg: "#2A8CF0", a: "S", name: "Somchai", streak: 9, xp: "2,310 แต้ม" },
  { rk: 8, bg: "#B06CFF", a: "ม", name: "มาลี", streak: 7, xp: "2,180 แต้ม" },
  { rk: 9, bg: "#14A871", a: "T", name: "Tom", streak: 5, xp: "2,050 แต้ม" },
  { rk: 10, bg: "#FD7302", a: "ป", name: "ปกรณ์", streak: 4, xp: "1,990 แต้ม" },
]
const BELOW = [
  { rk: 11, bg: "#F45C97", a: "B", name: "Bee", streak: 3, xp: "1,840 แต้ม" },
  { rk: 12, bg: "#2A8CF0", a: "ว", name: "วิชัย", streak: 2, xp: "1,720 แต้ม" },
]

const PIPS = [
  { icon: Medal, color: "text-orange-700" },
  { icon: Medal, color: "text-slate-400" },
  { icon: Medal, color: "text-amber-500" },
  { icon: Gem, color: "text-sky-500" },
  { icon: Gem, color: "text-amber-500" },
  { icon: Gem, color: "text-violet-600", cur: true },
]

function Row({ r, t }: { r: typeof ROWS[number]; t: T }) {
  return (
    <div className={`lbx-row${r.up ? " up" : ""}${r.me ? " me" : ""}`}>
      {r.me && <span className="youtag">{t("you")}</span>}
      <span className="rk">{r.rk}</span>
      <span className="av" style={{ background: r.bg }}>{r.a}</span>
      <span className="nm"><b>{r.name}</b><small><Flame size={12} className="text-orange-500" /> {t("{n}-day streak", { n: r.streak })}</small></span>
      <span className="xp">{r.xp}</span>
    </div>
  )
}

export default async function LeaderboardPage() {
  const t = makeT(await getLang())
  return (
    <>
      <div className="lbx-hero">
        <div className="lbx-gem"><Gem size={48} /></div>
        <div className="lbx-mid">
          <span className="eyebrow"><Trophy size={15} /> {t("Season 7 · live")}</span>
          <h2 className="display">{t("Diamond Division")}</h2>
          <p>{t("Reach the Top 10 in XP to rank up · 30 players")}</p>
          <div className="lbx-leagues">
            {PIPS.map((p, i) => (
              <span key={i} className={`lbx-pip ${p.cur ? "cur" : "done"}`}><p.icon size={15} className={p.color} /></span>
            ))}
          </div>
        </div>
        <div className="lbx-timer"><b>{t("2 days")}</b><span>{t("left")}</span></div>
      </div>

      <div className="lbx">
        <div className="lbx-podium">
          {PODIUM.map((p) => (
            <div key={p.name} className={`lbx-pod ${p.cls}`}>
              {p.crown && <span className="crown"><Crown size={26} /></span>}
              <span className="pav" style={{ background: p.bg }}>{p.a}</span>
              <div className="pnm">{p.name}</div><div className="pxp">{p.xp}</div>
              <div className="lbx-base"><span className="rkn">{p.rk}</span></div>
            </div>
          ))}
        </div>

        <div className="lbx-list glass">
          {ROWS.map((r) => <Row key={r.rk} r={r} t={t} />)}
          <div className="lbx-zone up"><ArrowUp size={13} /> {t("Promotion zone")}</div>
          {BELOW.map((r) => <Row key={r.rk} r={r} t={t} />)}
        </div>
      </div>
    </>
  )
}
