import "../auth.css"
import AuthScreen from "../_auth-screen"
import LangToggle from "@/components/lang-toggle"
import { getLang } from "@/lib/i18n"

export default async function LoginPage() {
  const lang = await getLang()
  return (
    <>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}><LangToggle current={lang} /></div>
      <AuthScreen mode="login" lang={lang} />
    </>
  )
}
