import Link from "next/link"
import Image from "next/image"
import "./home.css"
import HomeFx from "@/components/home-fx"
import CareerPathsCarousel from "@/components/career-paths-carousel"
import LangToggle from "@/components/lang-toggle"
import ToolLogo from "@/components/tool-logo"
import { getLang, makeT } from "@/lib/i18n"
import { getSystemSettings } from "@/lib/system-settings"
import {
  Flame, Zap, Award, Sparkles, Target, Rocket, Heart,
  BookOpen, CheckCircle2, Crown, RotateCcw,
  MessageSquareText,
  ChevronRight, Trophy, Star, Plus,
} from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
const iconStyle = { display: "inline-block", verticalAlign: "-2px" } as const

export default async function HomePage() {
  const [lang, settings] = await Promise.all([getLang(), getSystemSettings()])
  const t = makeT(lang)

  // Pricing is whatever the admin set in Admin › System (single source of truth).
  const priceMonth = settings.proPriceMonth
  const priceYear = settings.proPriceYear
  const yearlyPerMonth = Math.round(priceYear / 12)
  const savePct = priceMonth > 0 ? Math.round((1 - priceYear / (priceMonth * 12)) * 100) : 0

  return (
    <div className="dlab-home">
      <div className="nav-sentinel" aria-hidden />
      <div className="atmos" />
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="orb o3" />
      <div className="grain" />

      {/* ============================ NAV ============================ */}
      <header className="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand">
            <div className="brand-badge"><Image src={`${M}/mascot-hello.png`} alt="Riri" width={50} height={50} /></div>
            <div>
              <div className="brand-name">Daily AI Lab</div>
              <div className="brand-sub">{t("AI, every day")}</div>
            </div>
          </Link>
          <div className="nav-cta">
            <LangToggle current={lang} />
            <Link className="btn btn--violet sm" href="/login">{t("Log in")}</Link>
          </div>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="reveal">
            <span className="pill"><Flame size={14} style={iconStyle} /> {t("15 minutes a day · learn daily")}</span>
            <h1 className="display">{t("Learn AI")}<br />{t("fun and easy,")}<br /><span className="grad-text">{t("every single day!")}</span></h1>
            <p className="lead">{t("Master ChatGPT, Claude, Gemini, Midjourney, Suno & Runway through bite-size lessons, XP, streaks & adorable rewards — ")}<strong style={{ color: "var(--text-strong)" }}>{t("turn AI into a daily habit")}</strong></p>
            <div className="hero-cta">
              <Link className="btn btn--violet lg" href="/login">{t("Start learning free")}</Link>
            </div>
          </div>

          {/* mascot stage — 6 floating cards */}
          <div className="stage reveal">
            <div className="spot" />
            <span className="dot-star a">✦</span>
            <span className="dot-star b">✦</span>
            <span className="dot-star c">✦</span>

            {/* streak — top left */}
            <div className="fcard streak">
              <span className="ic" style={{ background: "var(--pink-100)" }}><Flame size={22} className="text-pink-500" /></span>
              <span className="tt"><span>{t("Streak")}</span><b>12 {t("days")}</b><span>{t("keep it alive!")} 🔥</span></span>
            </div>

            {/* xp — top right, vertical with bar */}
            <div className="fcard xp">
              <div className="xp-row">
                <span className="ic" style={{ background: "var(--sun-100)", width: 44, height: 44 }}><Zap size={22} className="text-amber-500" /></span>
                <div>
                  <div className="xp-val">+250 XP</div>
                  <div className="xp-sub">{t("lesson done")}</div>
                </div>
              </div>
              <div className="bar"><i /></div>
            </div>

            {/* lab — left middle, vertical with bar */}
            <div className="fcard lab">
              <div className="row">
                <span className="tt"><b style={{ fontSize: 13 }}>{t("Today's lab")}</b></span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--hero-600)" }}>3 / 5</span>
              </div>
              <div className="bar"><i /></div>
            </div>

            {/* hearts — right middle */}
            <div className="fcard hearts">
              <span className="ic" style={{ background: "#FFE5EC" }}><Heart size={22} className="text-rose-500" /></span>
              <div>
                <div className="tt"><b>{t("Hearts")}</b></div>
                <div className="hrow">
                  <span className="h">❤️</span><span className="h">❤️</span><span className="h">❤️</span><span className="h">❤️</span><span className="h empty">🤍</span>
                </div>
              </div>
            </div>

            {/* mission — bottom left */}
            <div className="fcard mission">
              <div className="mis-head">
                <span className="ic" style={{ background: "var(--mint-100)", width: 38, height: 38, borderRadius: 12 }}><CheckCircle2 size={20} className="text-emerald-500" /></span>
                <b>{t("Mission complete!")}</b>
              </div>
              <span className="mis-sub">{t("ChatGPT first steps")}</span>
              <span className="mis-chip"><Zap size={12} /> +100 XP</span>
            </div>

            {/* badge — bottom right */}
            <div className="fcard badge">
              <span className="ic" style={{ background: "var(--sky-100)" }}><Award size={22} className="text-sky-500" /></span>
              <span className="tt"><span>{t("Badge earned")}</span><b>AI Explorer</b></span>
            </div>

            <div className="podium" />
            <Image className="mascot" src={`${M}/cockatiel-superhero.png`} alt="Riri" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* ========================= MARQUEE ========================== */}
      <div className="marquee reveal">
        <div className="marquee-track">
          {[
            ["#19C37D", "G", "ChatGPT"], ["#FF9A52", "C", "Claude"], ["#2A6FF0", "G", "Gemini"], ["#6C3CF5", "M", "Midjourney"],
            ["#F45C97", "S", "Suno"], ["#1B1729", "R", "Runway"], ["#14A871", "P", "Perplexity"], ["#E2611C", "D", "DALL·E"],
            ["#19C37D", "G", "ChatGPT"], ["#FF9A52", "C", "Claude"], ["#2A6FF0", "G", "Gemini"], ["#6C3CF5", "M", "Midjourney"],
            ["#F45C97", "S", "Suno"], ["#1B1729", "R", "Runway"], ["#14A871", "P", "Perplexity"], ["#E2611C", "D", "DALL·E"],
          ].map(([bg, , name], i) => (
            <span className="mtool" key={i}><span className="sw" style={{ background: bg }}><ToolLogo name={name} size={13} /></span>{name}</span>
          ))}
        </div>
      </div>

      {/* ===================== PLAY / QUIZ DEMO ====================== */}
      <section className="block tinted" id="play">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow"><Sparkles size={14} style={iconStyle} /> {t("Learn by playing")}</span>
            <h2 className="display">{t("It feels like a game.")}<br />{t("Because it is.")}</h2>
            <p>{t("Tap an answer below — try it yourself. XP, hearts, streaks and badges keep you coming back.")}</p>
          </div>
          <div className="play">
            {/* interactive quiz */}
            <div className="quiz reveal">
              <div className="quiz-card glass">
                <div className="quiz-top">
                  <span className="x">✕</span>
                  <div className="qbar"><i /></div>
                  <div className="hearts">{Array.from({ length: 5 }).map((_, i) => <span key={i}><Heart size={16} className="text-rose-500" fill="currentColor" /></span>)}</div>
                </div>
                <div className="qtag"><Zap size={13} style={iconStyle} /> ChatGPT · {t("Lab")} 03</div>
                <div className="qhead">{t("Which prompt gives ChatGPT the clearest role to play?")}</div>
                <button className="opt"><span className="k">A</span> &quot;{t("write something about marketing")}&quot;</button>
                <button className="opt" data-correct="1"><span className="k">B</span> &quot;{t("Act as a marketing expert. Write 3 ad headlines for a coffee shop.")}&quot;</button>
                <button className="opt"><span className="k">C</span> &quot;{t("marketing pls")}&quot;</button>
                <div className="quiz-foot">
                  <span className="xp-pop"><Zap size={13} style={iconStyle} /> +15 แต้ม</span>
                  <span className="fb" />
                  <button className="quiz-reset"><RotateCcw size={13} style={iconStyle} /> {t("Try again")}</button>
                </div>
              </div>
              <Image className="quiz-riri" src={`${M}/mascot-thumbsup.png`} alt="Riri" width={130} height={130} />
            </div>

            {/* gamification features */}
            <div className="reveal">
              <span className="eyebrow">{t("Built to be addictive")}</span>
              <h3 className="display" style={{ fontSize: "clamp(26px,3.2vw,36px)", margin: "12px 0 6px" }}>{t("Every lab levels you up")}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 16, margin: 0, maxWidth: 420, lineHeight: 1.55 }}>
                {t("Riri turns 15 focused minutes into real momentum — and cheers you on the whole way.")}</p>
              <div className="feat">
                <div className="feat-row">
                  <span className="feat-ic" style={{ background: "var(--sun-100)" }}><Zap size={22} className="text-amber-500" /></span>
                  <div><h4>{t("Earn XP & level up")}</h4><p>{t("Every lesson and perfect quiz grows your AI level.")}</p></div>
                </div>
                <div className="feat-row">
                  <span className="feat-ic" style={{ background: "var(--berry-100)" }}><Heart size={22} className="text-rose-500" /></span>
                  <div><h4>{t("Hearts keep you sharp")}</h4><p>{t("Five per session — wrong answers cost one, so it really sticks.")}</p></div>
                </div>
                <div className="feat-row">
                  <span className="feat-ic" style={{ background: "var(--pink-100)" }}><Flame size={22} className="text-pink-500" /></span>
                  <div><h4>{t("Daily streaks")}</h4><p>{t("Build a habit. Save a slip-up with a streak freeze.")}</p></div>
                </div>
                <div className="feat-row">
                  <span className="feat-ic" style={{ background: "var(--sky-100)" }}><Award size={22} className="text-sky-500" /></span>
                  <div><h4>{t("Collect badges")}</h4><p>{t("Unlock shiny achievements as you master each tool.")}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== TOOLS =========================== */}
      <section className="tools-showcase" id="tools">
        <div className="wrap tools-wrap">
          <div className="tools-lab reveal">
            <span className="tools-gem gem-left" aria-hidden />
            <span className="tools-gem gem-right" aria-hidden />
            <span className="tools-spark s1" aria-hidden>✦</span>
            <span className="tools-spark s2" aria-hidden>✦</span>
            <span className="tools-spark s3" aria-hidden>✦</span>

            <div className="tools-hero-head">
              <span className="tools-kicker"><Sparkles size={18} /> เครื่องมือ AI</span>
              <h2 className="display">อยากเก่งเครื่องมือไหน เริ่มตรงนี้ได้เลย</h2>
              <p>มีบทเรียนให้เลือกง่าย ๆ ในเครื่องมือที่อยากใช้ หรือเริ่มจากเส้นทางแนะนำที่เราเตรียมไว้ให้คุณ</p>
            </div>

            <div className="tools-board">
              <Link href="/daily-learn/chatgpt-basic" className="tool-feature">
                <span className="feature-ribbon"><Star size={14} fill="currentColor" /> แนะนำสำหรับคุณ</span>
                <span className="feature-crown"><Crown size={20} fill="currentColor" /></span>
                <Image className="feature-riri" src={`${M}/mascot-point.png`} alt="Riri" width={230} height={230} />
                <div className="feature-copy">
                  <div className="feature-head">
                    <span className="feature-logo"><ToolLogo name="ChatGPT" size={40} /></span>
                    <div className="feature-id">
                      <h3>ChatGPT</h3>
                      <span className="feature-cat"><MessageSquareText size={13} /> แชท &amp; เขียน</span>
                    </div>
                  </div>
                  <p>ผู้ช่วยอัจฉริยะด้านการแชท การเขียน วิเคราะห์ และช่วยคิดไอเดียได้ทุกเรื่อง</p>
                  <div className="feature-stats">
                    <span><BookOpen size={15} /> 64 บทเรียน</span>
                    <span><Zap size={15} /> ระดับเริ่มต้น</span>
                  </div>
                  <span className="feature-button">เริ่มเรียนเลย <ChevronRight size={19} /></span>
                  <div className="feature-proof">
                    <span><Flame size={15} fill="currentColor" /> ยอดนิยมอันดับ 1</span>
                    <span className="avatar-stack" aria-label="ผู้เรียนกว่า 12,000 คน">
                      <i /><i /><i /><i />
                      <b>+12K เรียนแล้ว</b>
                    </span>
                  </div>
                </div>
              </Link>

              <div className="tool-mini-grid">
                {[
                  ["Claude", "52 บทเรียน", "แชท & เขียน", "linear-gradient(160deg,#FFAE72,#E2611C)"],
                  ["Gemini", "48 บทเรียน", "แชท & เขียน", "linear-gradient(160deg,#70A6FF,#2A6FF0)"],
                  ["Midjourney", "40 บทเรียน", "รูปภาพ", "linear-gradient(160deg,#BC83FF,#6C3CF5)"],
                  ["Suno", "32 บทเรียน", "เพลง", "linear-gradient(160deg,#FF8CBE,#F03C89)"],
                  ["Runway", "36 บทเรียน", "วิดีโอ", "linear-gradient(160deg,#161022,#050408)"],
                ].map(([name, lessons, tag, bg]) => (
                  <Link className="tool-mini" href="/docs" key={name}>
                    <span className="tool-mini-icon" style={{ background: bg }}><ToolLogo name={name} size={30} /></span>
                    <span className="tool-mini-copy">
                      <b>{name}</b>
                      <small>{lessons}</small>
                      <em>{tag}</em>
                    </span>
                    <ChevronRight className="tool-mini-arrow" size={20} />
                  </Link>
                ))}
                <Link className="tool-mini tool-all" href="/docs">
                  <span className="tool-all-plus"><Plus size={25} /></span>
                  <b>ดูเครื่องมือทั้งหมด</b>
                  <small>50+ เครื่องมือ</small>
                </Link>
              </div>
            </div>

            <div className="tools-bottom-cta">
              <div className="tools-choice">
                <span><Trophy size={26} /></span>
                <div>
                  <b>อยากเก่งเร็ว เลือกเริ่มจากเส้นทางแนะนำ</b>
                  <small>เรียนตามลำดับที่เราออกแบบไว้ เพื่อพาคุณเก่งจริง</small>
                </div>
                <Link href="#paths">ดูเส้นทางแนะนำ <ChevronRight size={18} /></Link>
              </div>
              <div className="tools-choice">
                <span><Sparkles size={26} fill="currentColor" /></span>
                <div>
                  <b>หรือเลือกดูเครื่องมือทั้งหมด</b>
                  <small>ค้นหาและเลือกเรียนในเครื่องมือที่คุณสนใจได้เลย</small>
                </div>
                <Link className="primary" href="/docs">ดูเครื่องมือทั้งหมด <ChevronRight size={18} /></Link>
              </div>
            </div>

          <div className="tools-grid">
            {[
              ["linear-gradient(160deg,#23D08A,#0E8F5E)", "G", "ChatGPT", t("Chat & writing · 64 lessons")],
              ["linear-gradient(160deg,#FFA866,#E2611C)", "C", "Claude", t("Reasoning & docs · 52 lessons")],
              ["linear-gradient(160deg,#6F9CFF,#2A6FF0)", "G", "Gemini", t("Google & research · 48 lessons")],
              ["linear-gradient(160deg,#BC83FF,#6C3CF5)", "M", "Midjourney", t("AI image art · 40 lessons")],
              ["linear-gradient(160deg,#FF93BE,#F45C97)", "S", "Suno", t("AI music maker · 32 lessons")],
              ["linear-gradient(160deg,#5C5675,#1B1729)", "R", "Runway", t("AI video & FX · 36 lessons")],
            ].map(([bg, , name, meta], i) => (
              <Link href="/docs" className="tcard glass tilt reveal" key={i}>
                <div className="tile" style={{ background: bg }}><ToolLogo name={name} size={24} /></div>
                <div><div className="tn">{name}</div><div className="tm">{meta}</div></div>
                <div className="go">→</div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className="block how-showcase" id="how">
        <div className="wrap">
          <div className="head how-head reveal">
            <span className="eyebrow"><Target size={14} style={iconStyle} /> {t("How it works")}</span>
            <h2 className="display">{t("Three steps. Every single day.")}</h2>
            <p>{t("The game-like loop that turns 15 minutes into a real AI skill.")}</p>
          </div>
          <div className="how">
            <div className="step reveal">
              <div className="num" style={{ background: "linear-gradient(160deg,#9173FA,#5728E0)", color: "#fff" }}><BookOpen size={26} /><span className="badge-n">1</span></div>
              <h3 className="display">{t("Learn the idea")}</h3>
              <p>{t("Short, plain-language lessons in Thai & English. No jargon — just what works.")}</p>
            </div>
            <div className="step reveal">
              <div className="num" style={{ background: "linear-gradient(160deg,#FFE066,#FBC400)", color: "var(--hero-700)" }}><CheckCircle2 size={26} /><span className="badge-n">2</span></div>
              <h3 className="display">{t("Take the quiz")}</h3>
              <p>{t("Instant feedback after every answer. Get it wrong, lose a heart — like a game.")}</p>
            </div>
            <div className="step reveal">
              <div className="num" style={{ background: "linear-gradient(160deg,#FF93BE,#F45C97)", color: "#fff" }}><Flame size={26} /><span className="badge-n">3</span></div>
              <h3 className="display">{t("Keep the streak")}</h3>
              <p>{t("Earn XP, collect badges, climb the leaderboard. Come back tomorrow.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= CAREER PATHS ======================= */}
      <section className="block paths-showcase" id="paths">
        <div className="wrap">
          <div className="head paths-head reveal">
            <span className="eyebrow"><Rocket size={14} style={iconStyle} /> {t("Career paths")}</span>
            <h2 className="display">{t("Go from curious to career-ready")}</h2>
            <p>{t("Guided multi-tool journeys that stack real, job-ready AI skills.")}</p>
          </div>
          <CareerPathsCarousel lang={lang} />
        </div>
      </section>


      {/* ========================= PRICING ========================== */}
      <section className="block" id="pricing">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow"><Heart size={14} style={iconStyle} className="text-violet-600" /> {t("Pricing")}</span>
            <h2 className="display">{t("Start free. Go Pro when you're ready.")}</h2>
            <p>{t("No credit card to begin. Cancel anytime.")}</p>
          </div>
          <div className="pricing-stage reveal">
            <input className="billing-toggle" id="billing-yearly" type="checkbox" aria-label="Use yearly billing" />
            <div className="billing-row">
              <label className="bill-label bill-month" htmlFor="billing-yearly">{t("Monthly")}</label>
              <label className="bill-switch" htmlFor="billing-yearly">
                <span className="bill-thumb" />
                <span className="bill-sparks" />
              </label>
              <label className="bill-label bill-year" htmlFor="billing-yearly">
                {t("Yearly")} <span>{t("Save 20%")}</span>
              </label>
            </div>

            <div className="price-grid">
              <div className="plan free glass">
                <div className="plan-orbit" aria-hidden />
                <div className="p-top">
                  <div>
                    <div className="pname" style={{ color: "var(--text-strong)" }}>{t("Free")}</div>
                    <div className="pdesc" style={{ color: "var(--text-muted)" }}>{t("For getting started")}</div>
                  </div>
                  <span className="plan-chip">{t("Ready instantly")}</span>
                </div>
                <div className="pcost" style={{ color: "var(--text-strong)" }}>
                  <span className="price-current">฿0</span>
                </div>
                <p className="pbill">{t("Free forever for daily practice")}</p>
                <ul className="plist">
                  <li><span className="ck ok">✓</span> {t("3 lessons per day")}</li>
                  <li><span className="ck ok">✓</span> {t("XP, streaks & leaderboard")}</li>
                  <li><span className="ck ok">✓</span> {t("Beginner docs library")}</li>
                  <li className="muted"><span className="ck no">×</span> <span>{t("Career paths")}</span></li>
                  <li className="muted"><span className="ck no">×</span> <span>{t("Unlimited hearts")}</span></li>
                </ul>
                <Link className="btn btn--ghost lg" style={{ width: "100%" }} href="/login">{t("Start free")}</Link>
              </div>

              <div className="pro-wrap">
                <span className="badge-pop">★ {t("Most popular")}</span>
                <div className="plan pro">
                  <div className="plan-glow" aria-hidden />
                  <div className="p-top">
                    <div>
                      <div className="pname">Pro</div>
                      <div className="pdesc">{t("For serious learners")}</div>
                    </div>
                    <span className="plan-chip pro-chip">{t("Every path unlocked")}</span>
                  </div>
                  <div className="pcost pro-cost">
                    <span className="price-month">฿{priceMonth.toLocaleString()}</span>
                    <span className="price-year">฿{yearlyPerMonth.toLocaleString()}</span>
                    <small> /{t("mo")}</small>
                  </div>
                  <p className="pbill">
                    <span className="bill-copy month-copy">{t("Pay monthly, cancel anytime")}</span>
                    <span className="bill-copy year-copy">{t("Pay yearly ฿{year}, save {pct}%", { year: priceYear.toLocaleString(), pct: savePct })}</span>
                  </p>
                  <ul className="plist">
                    <li><span className="ck ok">✓</span> {t("Unlimited lessons")}</li>
                    <li><span className="ck ok">✓</span> {t("All career paths")}</li>
                    <li><span className="ck ok">✓</span> {t("Full documentation library")}</li>
                    <li><span className="ck ok">✓</span> {t("Unlimited hearts")}</li>
                    <li><span className="ck ok">✓</span> {t("Streak freeze & Pro badges")}</li>
                  </ul>
                  <Link className="btn btn--sun lg" style={{ width: "100%" }} href="/login"><Crown size={18} /> {t("Go Pro")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FINAL CTA ========================= */}
      <section className="block final-cta-section">
        <div className="final-card reveal">
            <div>
              <span className="eyebrow">{t("Ready when you are")}</span>
              <h2 className="display" style={{ marginTop: 12 }}>{t("Start learning AI today")}</h2>
              <p>{t("Join 120,000+ learners. Your first lab takes 15 minutes — Riri will guide you the whole way.")}</p>
              <Link className="btn btn--violet lg" href="/login" data-confetti>{t("Create your free account")} <Rocket size={18} /></Link>
            </div>
            <Image className="final-mascot" src={`${M}/mascot-fly.png`} alt="Riri" width={280} height={280} />
        </div>
      </section>

      {/* ========================== FOOTER ========================== */}
      <footer className="foot">
        <div className="wrap foot-bar">
          <div className="brand" style={{ cursor: "default" }}>
            <div className="brand-badge"><Image src={`${M}/mascot-hello.png`} alt="Riri" width={40} height={40} /></div>
            <div className="brand-name" style={{ color: "#fff", fontSize: 15 }}>Daily AI Lab</div>
          </div>
          <span className="foot-copy">© 2026 Daily AI Lab</span>
          <div className="foot-legal">
            <Link href="/privacy">{t("Privacy")}</Link>
            <Link href="/terms">{t("Terms")}</Link>
          </div>
        </div>
      </footer>

      <HomeFx />
    </div>
  )
}
