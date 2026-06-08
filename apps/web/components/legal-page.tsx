import Link from "next/link"
import LangToggle from "@/components/lang-toggle"
import { makeT, type Lang } from "@/lib/i18n"
import { FileText, Shield } from "lucide-react"

const M = "/assets/daily-ai-lab/mascot-ds"
type Pair = [string, string]
type Section = { h: Pair; p: Pair[] }

const TERMS: { title: Pair; intro: Pair; sections: Section[] } = {
  title: ["เงื่อนไขการใช้บริการ", "Terms of Service"],
  intro: [
    "ยินดีต้อนรับสู่ Daily AI Lab การเข้าใช้งานเว็บไซต์และแอปของเราถือว่าคุณยอมรับเงื่อนไขด้านล่างนี้ โปรดอ่านอย่างละเอียด",
    "Welcome to Daily AI Lab. By accessing our website and app, you agree to the terms below. Please read them carefully.",
  ],
  sections: [
    { h: ["การยอมรับเงื่อนไข", "Acceptance of terms"], p: [
      ["เมื่อสมัครสมาชิกหรือใช้งาน Daily AI Lab ถือว่าคุณยอมรับเงื่อนไขฉบับนี้และนโยบายความเป็นส่วนตัวของเรา หากไม่ยอมรับ กรุณางดใช้บริการ", "By creating an account or using Daily AI Lab, you accept these terms and our privacy policy. If you do not agree, please do not use the service."],
    ] },
    { h: ["การใช้บริการ", "Use of the service"], p: [
      ["คุณตกลงใช้บริการเพื่อการเรียนรู้ส่วนบุคคลอย่างถูกกฎหมาย ห้ามนำเนื้อหาไปทำซ้ำเพื่อการค้า เผยแพร่ต่อ หรือใช้ในทางที่ละเมิดสิทธิผู้อื่น", "You agree to use the service for lawful, personal learning. You may not reproduce content commercially, redistribute it, or use it in ways that infringe others' rights."],
    ] },
    { h: ["บัญชีผู้ใช้", "Your account"], p: [
      ["คุณมีหน้าที่รักษารหัสผ่านให้ปลอดภัย และรับผิดชอบกิจกรรมทั้งหมดภายใต้บัญชีของคุณ โปรดแจ้งเราทันทีหากพบการใช้งานที่ผิดปกติ", "You are responsible for keeping your password secure and for all activity under your account. Tell us immediately if you notice any unusual activity."],
    ] },
    { h: ["แพ็กเกจ Pro และการชำระเงิน", "Pro plan & payment"], p: [
      ["แพ็กเกจ Pro จ่ายแบบรายเดือนหรือรายปี และจะต่ออายุเองจนกว่าคุณจะยกเลิก ราคาที่เห็นรวมภาษีที่เกี่ยวข้องแล้ว", "The Pro plan is billed monthly or yearly and renews automatically until you cancel. Displayed prices include applicable taxes."],
    ] },
    { h: ["การยกเลิกและคืนเงิน", "Cancellation & refunds"], p: [
      ["คุณยกเลิกได้ทุกเมื่อในหน้าตั้งค่า Pro จะใช้ได้จนจบรอบที่จ่ายไว้แล้ว เราไม่คืนเงินสำหรับรอบที่ใช้งานไปแล้ว เว้นแต่กฎหมายกำหนด", "You can cancel anytime in account settings. Pro access remains until the end of the current billing cycle. We do not refund used periods unless required by law."],
    ] },
    { h: ["ทรัพย์สินทางปัญญา", "Intellectual property"], p: [
      ["เนื้อหา บทเรียน มาสคอต และแบรนด์ Daily AI Lab เป็นทรัพย์สินของเราหรือผู้ให้สิทธิ์ ชื่อเครื่องมือ AI ของบุคคลที่สามเป็นเครื่องหมายการค้าของเจ้าของนั้น ๆ", "Content, lessons, the mascot, and the Daily AI Lab brand belong to us or our licensors. Third-party AI tool names are trademarks of their respective owners."],
    ] },
    { h: ["ข้อจำกัดความรับผิด", "Limitation of liability"], p: [
      ["เราให้บริการตามที่มีอยู่ และพยายามทำให้ข้อมูลถูกต้องที่สุด แต่คำตอบจาก AI อาจผิดได้ ผู้ใช้ควรตรวจสอบก่อนนำไปใช้จริง", "The service is provided \"as is.\" We strive for accuracy but do not guarantee outcomes from using AI. We are not liable for indirect damages arising from use of the service."],
    ] },
    { h: ["การเปลี่ยนแปลงเงื่อนไข", "Changes to terms"], p: [
      ["เราอาจปรับปรุงเงื่อนไขเป็นครั้งคราว หากมีการเปลี่ยนแปลงสำคัญ เราจะแจ้งผ่านแอปหรืออีเมล การใช้งานต่อถือว่ายอมรับเงื่อนไขที่ปรับปรุงแล้ว", "We may update these terms from time to time. For significant changes we'll notify you in the app or by email. Continued use means you accept the updated terms."],
    ] },
    { h: ["ติดต่อเรา", "Contact us"], p: [
      ["มีคำถามเกี่ยวกับเงื่อนไข ติดต่อ team@daily-ai-lab.com", "Questions about these terms? Contact team@daily-ai-lab.com"],
    ] },
  ],
}

const PRIVACY: { title: Pair; intro: Pair; sections: Section[] } = {
  title: ["นโยบายความเป็นส่วนตัว", "Privacy Policy"],
  intro: [
    "เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายว่าเราเก็บ ใช้ และปกป้องข้อมูลของคุณอย่างไร",
    "We care about your privacy. This policy explains what data we collect, how we use it, and how we protect it.",
  ],
  sections: [
    { h: ["ข้อมูลที่เราเก็บ", "Data we collect"], p: [
      ["ข้อมูลบัญชี เช่น ชื่อและอีเมลที่คุณให้ตอนสมัคร รวมถึงข้อมูลการเรียน เช่น ความคืบหน้า แต้ม วันที่เรียนต่อเนื่อง และผลแบบฝึกหัด", "Account info such as your name and email provided at sign-up, and learning data such as progress, XP, streaks, and quiz results, to give you a continuous experience."],
    ] },
    { h: ["วิธีที่เราใช้ข้อมูล", "How we use your data"], p: [
      ["เราใช้ข้อมูลเพื่อเปิดบทเรียน บันทึกความคืบหน้า ปรับปรุงเนื้อหา ส่งเตือนให้กลับมาเรียน และดูแลบัญชีให้ปลอดภัย เราไม่ขายข้อมูลส่วนตัวของคุณ", "To deliver lessons, save your progress, improve content, send streak reminders, and keep the platform secure. We do not sell your personal data."],
    ] },
    { h: ["คุกกี้", "Cookies"], p: [
      ["เราใช้คุกกี้ที่จำเป็น เช่น การลงชื่อเข้าใช้และการจำภาษา รวมถึงคุกกี้เพื่อดูภาพรวมการใช้งาน คุณจัดการคุกกี้ได้ในเบราว์เซอร์", "We use essential cookies (e.g. sign-in and language preference) and analytics cookies to understand usage and improve the service. You can manage cookies in your browser."],
    ] },
    { h: ["การแบ่งปันข้อมูล", "Data sharing"], p: [
      ["เราแบ่งปันข้อมูลเฉพาะกับผู้ให้บริการที่จำเป็น เช่น การลงชื่อเข้าใช้และการชำระเงิน หรือเมื่อกฎหมายกำหนด", "We share data only with providers essential to operating the service, such as authentication and payment processors, under confidentiality agreements, or when required by law."],
    ] },
    { h: ["ความปลอดภัยของข้อมูล", "Data security"], p: [
      ["เราดูแลข้อมูลของคุณอย่างระมัดระวัง แม้ไม่มีบริการออนไลน์ใดปลอดภัย 100% แต่เราพยายามเต็มที่เพื่อปกป้องข้อมูลของคุณ", "We use encryption and industry-standard safeguards to protect your data. While no system is 100% secure, we do our best to keep it safe."],
    ] },
    { h: ["สิทธิของคุณ", "Your rights"], p: [
      ["คุณมีสิทธิ์เข้าถึง แก้ไข หรือขอลบข้อมูลส่วนบุคคลของคุณ และถอนความยินยอมได้ทุกเมื่อ โดยติดต่อทีมงานของเรา", "You have the right to access, correct, or request deletion of your personal data, and to withdraw consent at any time by contacting our team."],
    ] },
    { h: ["การเก็บรักษาข้อมูล", "Data retention"], p: [
      ["เราเก็บข้อมูลของคุณตราบเท่าที่บัญชียังใช้งานอยู่ หากคุณลบบัญชี เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้ภายในระยะเวลาที่เหมาะสม", "We keep your data while your account is active. If you delete your account, we will delete or anonymise your data within a reasonable period."],
    ] },
    { h: ["ติดต่อเรา", "Contact us"], p: [
      ["มีคำถามเกี่ยวกับความเป็นส่วนตัว ติดต่อ privacy@daily-ai-lab.com", "Questions about privacy? Contact privacy@daily-ai-lab.com"],
    ] },
  ],
}

export default function LegalPage({ kind, lang }: { kind: "terms" | "privacy"; lang: Lang }) {
  const t = makeT(lang)
  const pick = (p: Pair) => (lang === "th" ? p[0] : p[1])
  const data = kind === "terms" ? TERMS : PRIVACY
  const Icon = kind === "terms" ? FileText : Shield

  return (
    <div className="dlab-home">
      <div className="atmos" />
      <div className="orb o1" />
      <div className="grain" />

      <header className="nav">
        <div className="wrap nav-in">
          <Link className="brand" href="/">
            <span className="brand-badge"><img src={`${M}/mascot-hello.png`} alt="Riri" width={44} height={44} /></span>
            <div><div className="brand-name">Daily AI Lab</div><div className="brand-sub">{t("AI, every day")}</div></div>
          </Link>
          <nav className="nav-links">
            <Link href="/docs">{t("Docs")}</Link>
            <Link href="/paths">{t("Career paths")}</Link>
            <Link href="/about">{t("About")}</Link>
            <Link href="/#pricing">{t("Pricing")}</Link>
          </nav>
          <div className="nav-cta">
            <LangToggle current={lang} />
            <Link className="link-btn" href="/login">{t("Log in")}</Link>
            <Link className="btn btn--violet sm" href="/login">{t("Start free")}</Link>
          </div>
        </div>
      </header>

      <div className="wrap">
        <article className="legal">
          <span className="eyebrow"><Icon size={15} /> {t("Legal")}</span>
          <h1 className="display">{pick(data.title)}</h1>
          <p className="updated">{t("Last updated: 8 June 2026")}</p>
          <p className="intro">{pick(data.intro)}</p>

          {data.sections.map((s, i) => (
            <section key={i}>
              <h2><span className="n">{i + 1}</span> {pick(s.h)}</h2>
              {s.p.map((para, j) => <p key={j}>{pick(para)}</p>)}
            </section>
          ))}
        </article>
      </div>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-bottom">
            <span>© 2026 Daily AI Lab · {t("Learn AI every day")}</span>
            <span style={{ display: "flex", gap: 20 }}>
              <Link href="/terms" style={{ margin: 0 }}>{t("Terms")}</Link>
              <Link href="/privacy" style={{ margin: 0 }}>{t("Privacy")}</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
