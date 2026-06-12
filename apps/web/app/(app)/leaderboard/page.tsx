import Image from "next/image"
import { createClient, getAuthUser } from "@/lib/supabase/server"
import { getLang, makeT } from "@/lib/i18n"
import { Flame, Crown, Gem, Trophy } from "lucide-react"

type T = (en: string, vars?: Record<string, string | number>) => string

type LeaderRow = {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  avatar_key: string | null
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

/** Chosen Riri avatar wins, else the Google photo, else null (show the initial). */
function avatarSrcFor(r: LeaderRow): string | null {
  return r.avatar_key ? `/assets/daily-ai-lab/avatars/avatar-${r.avatar_key}.png` : r.avatar_url
}
function Avatar({ src, name }: { src: string | null; name: string | null }) {
  return src
    ? <Image src={src} alt="" width={56} height={56} unoptimized style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <>{(name ?? "?").charAt(0)}</>
}


function Row({ r, me, t, idx }: { r: LeaderRow; me: boolean; t: T; idx: number }) {
  return (
    <div className={`lbx-row${me ? " me" : ""}`}>
      {me && <span className="youtag">{t("you")}</span>}
      <span className="rk">{r.rank}</span>
      <span className="av" style={{ background: avatarSrcFor(r) ? "var(--cloud-100)" : bgFor(r.display_name, idx), overflow: "hidden" }}>
        <Avatar src={avatarSrcFor(r)} name={r.display_name} />
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
  const supabase = await createClient()
  const [user, { data: lb }] = await Promise.all([
    getAuthUser(),
    supabase.rpc("get_leaderboard", { limit_count: 200 }),
  ])
  const currentUserId: string | null = user?.id ?? null
  const rows: LeaderRow[] = ((lb as LeaderRow[]) ?? []).sort((a, b) => a.rank - b.rank)

  // All-time standings, no seasons: the hero shows real numbers only.
  const me = rows.find((r) => r.user_id === currentUserId) ?? null
  const champion = rows[0] ?? null

  // Podium: display order is silver (2nd), gold (1st), bronze (3rd)
  const top3 = rows.slice(0, 3)
  const podiumDisplay = [top3[1], top3[0], top3[2]].filter(Boolean) as LeaderRow[]
  const podiumClasses: Record<number, string> = { 0: "silver", 1: "gold", 2: "bronze" }
  // With more than 3 players the list continues below the podium; with 3 or
  // fewer, repeat them in the list so it never renders as an empty box.
  const listRows = rows.length > 3 ? rows.slice(3) : rows

  return (
    <>
      <div className="lbx-hero">
        <div className="lbx-gem"><Gem size={48} /></div>
        <div className="lbx-mid">
          <span className="eyebrow"><Trophy size={15} /> {t("All-time ranking")}</span>
          <h2 className="display">{t("Leaderboard")}</h2>
          <p>{t("Ranked by total XP · {n} players", { n: rows.length })}</p>
          {champion && (
            <div className="lbx-champ">
              <Crown size={14} className="text-amber-500" /> {t("Champion")}: <b>{champion.display_name ?? "—"}</b> · {champion.xp.toLocaleString()} XP
            </div>
          )}
        </div>
        <div className="lbx-timer">
          {me ? (
            <><b>#{me.rank}</b><span>{t("Your rank")}</span></>
          ) : (
            <><b>—</b><span>{t("Finish a lesson to get ranked")}</span></>
          )}
        </div>
      </div>

      <div className="lbx">
        <div className="lbx-podium">
          {podiumDisplay.map((p, di) => (
            <div key={p.user_id} className={`lbx-pod ${podiumClasses[di]}`}>
              {di === 1 && <span className="crown"><Crown size={26} /></span>}
              <span className="pav" style={{ background: avatarSrcFor(p) ? "var(--cloud-100)" : bgFor(p.display_name, p.rank - 1), overflow: "hidden" }}>
                <Avatar src={avatarSrcFor(p)} name={p.display_name} />
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
