import Link from "next/link"
import "./home.css"
import HomeFx from "@/components/home-fx"
import LangToggle from "@/components/lang-toggle"
import ToolLogo from "@/components/tool-logo"
import { getLang, makeT } from "@/lib/i18n"
import {
  Flame, Zap, Award, Sparkles, Boxes, Target, Rocket, Heart,
  BookOpen, CheckCircle2, Brain, Megaphone, Briefcase, Crown, Clock, RotateCcw,
} from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
const iconStyle = { display: "inline-block", verticalAlign: "-2px" } as const

export default async function HomePage() {
  const lang = await getLang()
  const t = makeT(lang)

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
            <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" /></div>
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
            <h1 className="display">{t("Master AI tools,")}<br /><span className="grad-text">{t("one lab a day.")}</span></h1>
            <p className="lead">{t("Learn ChatGPT, Claude, Gemini, Midjourney, Suno & Runway through bite-size lessons, quizzes and streaks. Built like your favourite game — ")}<strong style={{ color: "var(--text-strong)" }}>{t("fun, easy, real AI skills")}</strong></p>
            <div className="hero-cta">
              <Link className="btn btn--violet lg" href="/login">{t("Start learning free")}</Link>
            </div>
            <div className="trust">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="faces">
                  <span className="face" style={{ background: "var(--hero-500)" }}>ก</span>
                  <span className="face" style={{ background: "var(--punch-500)" }}>N</span>
                  <span className="face" style={{ background: "var(--mint-500)" }}>พ</span>
                  <span className="face" style={{ background: "var(--pink-400)" }}>J</span>
                </span>
                <span className="trust-txt"><b data-count="120" data-suffix="K+">120K+</b><br />{t("learners worldwide")}</span>
              </div>
              <span className="trust-txt"><span className="stars">★★★★★</span><br /><b data-count="4.9">4.9</b> {t("average rating")}</span>
            </div>
          </div>

          {/* mascot stage */}
          <div className="stage reveal">
            <div className="spot" data-depth="-14" />
            <span className="dot-star a" data-depth="26">✦</span>
            <span className="dot-star b" data-depth="20">✦</span>
            <span className="dot-star c" data-depth="34">✦</span>

            <div className="fcard streak" data-depth="40">
              <span className="ic" style={{ background: "var(--pink-100)" }}><Flame size={20} className="text-pink-500" /></span>
              <span className="tt"><b>{t("12-day streak")}</b><span>{t("keep it alive!")}</span></span>
            </div>
            <div className="fcard xp" data-depth="50">
              <span className="ic" style={{ background: "var(--sun-100)" }}><Zap size={20} className="text-amber-500" /></span>
              <span className="tt"><b>+15 แต้ม</b><span>{t("lesson done")}</span></span>
            </div>
            <div className="fcard badge" data-depth="44">
              <span className="ic" style={{ background: "var(--sky-100)" }}><Award size={20} className="text-sky-500" /></span>
              <span className="tt"><b>สั่ง AI เก่งขึ้น</b><span>{t("badge unlocked")}</span></span>
            </div>
            <div className="fcard lab" data-depth="34" style={{ width: 172 }}>
              <div className="row"><span className="tt"><b style={{ fontSize: 13 }}>{t("Today's lab")}</b></span><span className="tt"><span style={{ fontWeight: 800, color: "var(--hero-600)" }}>3 / 5</span></span></div>
              <div className="bar"><i /></div>
            </div>

            <div className="podium" />
            <img className="mascot" data-depth="-22" src={`${M}/cockatiel-superhero.png`} alt="Riri" width={430} height={430} fetchPriority="high" decoding="async" />
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
              <img className="quiz-riri" src={`${M}/mascot-thumbsup.png`} alt="Riri" width={130} height={130} loading="lazy" decoding="async" />
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
      <section className="block" id="tools">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow"><Boxes size={14} style={iconStyle} /> {t("AI tools")}</span>
            <h2 className="display">{t("A track for every tool that matters")}</h2>
            <p>{t("Structured, beginner-to-pro labs for each major AI tool. Pick one, or follow a path.")}</p>
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
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section className="block tinted" id="how">
        <div className="wrap">
          <div className="head reveal">
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
      <section className="block" id="paths">
        <div className="wrap">
          <div className="head reveal">
            <span className="eyebrow"><Rocket size={14} style={iconStyle} /> {t("Career paths")}</span>
            <h2 className="display">{t("Go from curious to career-ready")}</h2>
            <p>{t("Guided multi-tool journeys that stack real, job-ready AI skills.")}</p>
          </div>
          <div className="paths-grid">
            {[
              { bg: "var(--hero-100)", icon: Sparkles, color: "text-violet-600", title: t("AI Content Creator"), desc: t("Write, design & produce with ChatGPT, Midjourney & Suno."), meta: t("6 weeks · 84 lessons") },
              { bg: "var(--sun-100)", icon: Brain, color: "text-amber-600", title: t("Prompt Engineer"), desc: t("Master prompting across every major model, beginner to pro."), meta: t("5 weeks · 72 lessons") },
              { bg: "var(--pink-100)", icon: Megaphone, color: "text-pink-500", title: t("AI for Marketing"), desc: t("Campaigns, copy & visuals that ship faster with AI."), meta: t("4 weeks · 60 lessons") },
              { bg: "var(--sky-100)", icon: Briefcase, color: "text-sky-600", title: t("AI for Business"), desc: t("Automate work and make smarter calls with AI tools."), meta: t("4 weeks · 56 lessons") },
            ].map((p, i) => (
              <Link href="/paths" className="path glass reveal" key={i}>
                <div className="pic" style={{ background: p.bg }}><p.icon size={26} className={p.color} /></div>
                <h3 className="display">{p.title}</h3>
                <p>{p.desc}</p>
                <div className="meta"><Clock size={13} style={iconStyle} /> {p.meta}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== STATS BAND ======================== */}
      <section className="block" style={{ padding: "30px 0" }}>
        <div className="wrap reveal">
          <div className="band">
            <div className="band-grid">
              <div className="s"><b><span data-count="120" data-suffix="K+">120K+</span></b><span>{t("Daily learners")}</span></div>
              <div className="s"><b><span data-count="7">7</span></b><span>{t("AI tools covered")}</span></div>
              <div className="s"><b><span data-count="400" data-suffix="+">400+</span></b><span>{t("Bite-size lessons")}</span></div>
              <div className="s"><b><span data-count="4.9">4.9</span>★</b><span>{t("Average rating")}</span></div>
            </div>
          </div>
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
          <div className="price-grid">
            <div className="plan free glass reveal">
              <div className="pname" style={{ color: "var(--text-strong)" }}>{t("Free")}</div>
              <div className="pdesc" style={{ color: "var(--text-muted)" }}>{t("For getting started")}</div>
              <div className="pcost" style={{ color: "var(--text-strong)" }}>฿0</div>
              <ul className="plist">
                <li><span className="ck" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}>✓</span> {t("3 lessons per day")}</li>
                <li><span className="ck" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}>✓</span> {t("XP, streaks & leaderboard")}</li>
                <li><span className="ck" style={{ background: "var(--mint-100)", color: "var(--mint-600)" }}>✓</span> {t("Beginner docs library")}</li>
                <li><span className="ck" style={{ background: "var(--cloud-100)", color: "var(--cloud-400)" }}>✕</span> <span style={{ color: "var(--text-muted)" }}>{t("Career paths")}</span></li>
                <li><span className="ck" style={{ background: "var(--cloud-100)", color: "var(--cloud-400)" }}>✕</span> <span style={{ color: "var(--text-muted)" }}>{t("Unlimited hearts")}</span></li>
              </ul>
              <Link className="btn btn--ghost lg" style={{ width: "100%" }} href="/login">{t("Start free")}</Link>
            </div>
            <div className="plan pro reveal">
              <span className="badge-pop">★ {t("Most popular")}</span>
              <div className="pname">Pro</div>
              <div className="pdesc" style={{ color: "var(--hero-100)" }}>{t("For serious learners")}</div>
              <div className="pcost">฿199<small style={{ color: "var(--hero-100)" }}> /{t("mo")}</small></div>
              <ul className="plist">
                <li><span className="ck" style={{ background: "rgba(255,255,255,.2)", color: "var(--sun-300)" }}>✓</span> {t("Unlimited lessons")}</li>
                <li><span className="ck" style={{ background: "rgba(255,255,255,.2)", color: "var(--sun-300)" }}>✓</span> {t("All career paths")}</li>
                <li><span className="ck" style={{ background: "rgba(255,255,255,.2)", color: "var(--sun-300)" }}>✓</span> {t("Full documentation library")}</li>
                <li><span className="ck" style={{ background: "rgba(255,255,255,.2)", color: "var(--sun-300)" }}>✓</span> {t("Unlimited hearts")}</li>
                <li><span className="ck" style={{ background: "rgba(255,255,255,.2)", color: "var(--sun-300)" }}>✓</span> {t("Streak freeze & Pro badges")}</li>
              </ul>
              <Link className="btn btn--sun lg" style={{ width: "100%" }} href="/login"><Crown size={18} /> {t("Go Pro")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FINAL CTA ========================= */}
      <section className="block" style={{ padding: "40px 0 84px" }}>
        <div className="wrap reveal">
          <div className="final-card">
            <div>
              <span className="eyebrow">{t("Ready when you are")}</span>
              <h2 className="display" style={{ marginTop: 12 }}>{t("Start learning AI today")}</h2>
              <p>{t("Join 120,000+ learners. Your first lab takes 15 minutes — Riri will guide you the whole way.")}</p>
              <Link className="btn btn--violet lg" href="/login" data-confetti>{t("Create your free account")} <Rocket size={18} /></Link>
            </div>
            <img className="final-mascot" src={`${M}/mascot-fly.png`} alt="Riri" width={280} height={280} loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      {/* ========================== FOOTER ========================== */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <div className="brand" style={{ cursor: "default" }}>
                <div className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={50} height={50} loading="lazy" decoding="async" /></div>
                <div><div className="brand-name" style={{ color: "#fff" }}>Daily AI Lab</div>
                  <div className="brand-sub" style={{ color: "var(--sun-300)" }}>{t("AI, every day")}</div></div>
              </div>
              <p className="blurb">{t("The fun, friendly way to learn AI tools — 15 minutes a day, one lab at a time.")}</p>
            </div>
            <div>
              <h5>{t("Learn")}</h5>
              <Link href="/docs">{t("All tools")}</Link><Link href="/paths">{t("Career paths")}</Link><a href="#how">{t("How it works")}</a><Link href="/docs">{t("Courses")}</Link>
            </div>
            <div>
              <h5>{t("Company")}</h5>
              <Link href="/about">{t("About")}</Link><a href="#">{t("Careers")}</a><a href="#">{t("Blog")}</a><a href="#">{t("Contact")}</a>
            </div>
            <div>
              <h5>{t("Get started")}</h5>
              <a href="#pricing">{t("Pricing")}</a><Link href="/login">{t("Log in")}</Link><Link href="/login">{t("Sign up free")}</Link><Link href="/dashboard">{t("Dashboard")}</Link>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Daily AI Lab · {t("Learn AI every day")}</span>
            <span style={{ display: "flex", gap: 20 }}><Link href="/privacy" style={{ margin: 0 }}>{t("Privacy")}</Link><Link href="/terms" style={{ margin: 0 }}>{t("Terms")}</Link></span>
          </div>
        </div>
      </footer>

      <HomeFx />
    </div>
  )
}
