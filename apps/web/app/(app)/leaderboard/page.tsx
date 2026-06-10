import { createClient } from "@/lib/supabase/server"
import { isDevMock, MOCK_PROFILE } from "@/lib/mock-user"
import { getLang, makeT } from "@/lib/i18n"
import { Flame, Crown, Gem, Trophy, ArrowUp, Medal } from "lucide-react"

type T = (en: string, vars?: Record<string, string | number>) => string

type LeaderRow = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  xp: number
  level: number
  streak_current: number
  rank: number
}

const BG_POOL = ["#6C3CF5", "#14A871", "#F45C97", "#2A8CF0", "#FD7302", "#B06CFF", "#E2611C", "#0EA5E9", "#23D08A", "#BC83FF"]
function bgFor(name: string | null, idx: number) {
  if (!name) return BG_POOL[idx % BG_POOL.length]
  const sum = [...name].reduce((s, c) => s + c.charCodeAt(0), 0)
  return BG_POOL[sum % BG_POOL.length]
}

const MOCK_BOARD: LeaderRow[] = [
  { user_id: "u1", display_name: "พิมพ์", avatar_url: null, xp: 4860, level: 8, streak_current: 28, rank: 1 },
  { user_id: "u2", display_name: "กานต์", avatar_url: null, xp: 3120, level: 6, streak_current: 20, rank: 2 },
  { user_id: "u3", display_name: "Jenny", avatar_url: null, xp: 2940, level: 5, streak_current: 18, rank: 3 },
  { user_id: "u4", display_name: "Mike", avatar_url: null, xp: 2610, level: 4, streak_current: 22, rank: 4 },
  { user_id: "u5", display_name: "อรุณ", avatar_url: null, xp: 2540, level: 4, streak_current: 15, rank: 5 },
  { user_id: "mock-user-id", display_name: "Nin", avatar_url: null, xp: 2480, level: 4, streak_current: 12, rank: 6 },
  { user_id: "u6", display_name: "Somchai", avatar_url: null, xp: 2310, level: 3, streak_current: 9, rank: 7 },
  { user_id: "u7", display_name: "มาลี", avatar_url: null, xp: 2180, level: 3, streak_current: 7, rank: 8 },
  { user_id: "u8", display_name: "Tom", avatar_url: null, xp: 2050, level: 3, streak_current: 5, rank: 9 },
  { user_id: "u9", display_name: "ปกรณ์", avatar_url: null, xp: 1990, level: 3, streak_current: 4, rank: 10 },
  { user_id: "u10", display_name: "Bee", avatar_url: null, xp: 1840, level: 2, streak_current: 3, rank: 11 },
  { user_id: "u11", display_name: "วิชัย", avatar_url: null, xp: 1720, level: 2, streak_current: 2, rank: 12 },
]

const PIPS = [
  { icon: Medal, color: "text-orange-700" },
  { icon: Medal, color: "text-slate-400" },
  { icon: Medal, color: "text-amber-500" },
  { icon: Gem, color: "text-sky-500" },
  { icon: Gem, color: "text-amber-500" },
  { icon: Gem, color: "text-violet-600", cur: true },
]

function Row({ r, me, t, idx }: { r: LeaderRow; me: boolean; t: T; idx: number }) {
  return (
    <div className={`lbx-row${me ? " me" : ""}`}>
      {me && <span className="youtag">{t("you")}</span>}
      <span className="rk">{r.rank}</span>
      <span className="av" style={{ background: bgFor(r.display_name, idx) }}>
        {(r.display_name ?? "?").charAt(0)}
      </span>
      <span className="nm">
        <b>{r.display_name ?? "—"}</b>
        <small><Flame size={12} className="text-orange-500" /> {t("{n}-day streak", { n: r.streak_current })}</small>
      </span>
      <span className="xp">{r.xp.toLocaleString()} XP</span>
    </div>
  )
}

export default async function LeaderboardPage() {
  const t = makeT(await getLang())
  let rows: LeaderRow[] = []
  let currentUserId: string | null = null

  if (isDevMock()) {
    rows = MOCK_BOARD
    currentUserId = MOCK_PROFILE.id
  } else {
    const supabase = await createClient()
    const [{ data: { user } }, { data: lb }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.rpc("get_leaderboard"),
    ])
    currentUserId = user?.id ?? null
    rows = ((lb as LeaderRow[]) ?? []).sort((a, b) => a.rank - b.rank)
  }

  // Podium: display order is silver (2nd), gold (1st), bronze (3rd)
  const top3 = rows.slice(0, 3)
  const podiumDisplay = [top3[1], top3[0], top3[2]].filter(Boolean) as LeaderRow[]
  const podiumClasses: Record<number, string> = { 0: "silver", 1: "gold", 2: "bronze" }
  const listRows = rows.slice(3)

  return (
    <>
      <div className="lbx-hero">
        <div className="lbx-gem"><Gem size={48} /></div>
        <div className="lbx-mid">
          <span className="eyebrow"><Trophy size={15} /> {t("Season 7 · live")}</span>
          <h2 className="display">{t("Diamond Division")}</h2>
          <p>{t("Reach the Top 10 in XP to rank up · {n} players", { n: rows.length || 30 })}</p>
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
          {podiumDisplay.map((p, di) => (
            <div key={p.user_id} className={`lbx-pod ${podiumClasses[di]}`}>
              {di === 1 && <span className="crown"><Crown size={26} /></span>}
              <span className="pav" style={{ background: bgFor(p.display_name, p.rank - 1) }}>
                {(p.display_name ?? "?").charAt(0)}
              </span>
              <div className="pnm">{p.display_name ?? "—"}</div>
              <div className="pxp">{p.xp.toLocaleString()} XP</div>
              <div className="lbx-base"><span className="rkn">{p.rank}</span></div>
            </div>
          ))}
        </div>

        <div className="lbx-list glass">
          {listRows.map((r, i) => (
            <Row key={r.user_id} r={r} me={r.user_id === currentUserId} t={t} idx={i + 3} />
          ))}
          {listRows.length > 0 && (
            <div className="lbx-zone up"><ArrowUp size={13} /> {t("Promotion zone")}</div>
          )}
          {rows.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0", margin: 0 }}>
              {t("No players yet. Be the first!")}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
