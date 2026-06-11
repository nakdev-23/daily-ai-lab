import { getLang } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/server"
import { getSystemSettings } from "@/lib/system-settings"
import { getProfile } from "@/lib/auth"
import SettingsClient from "./_settings-client"

export default async function SettingsPage() {
  const [lang, settings, profile] = await Promise.all([getLang(), getSystemSettings(), getProfile()])

  let displayName = "นักเรียน"
  let email = ""
  let avatar: string | null = null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const meta = user.user_metadata ?? {}
    email = user.email ?? email
    // Prefer the saved profile display name over the Google metadata.
    displayName = profile?.displayName ?? (meta.full_name as string) ?? (meta.name as string) ?? displayName
    avatar = profile?.avatarUrl ?? (meta.avatar_url as string) ?? (meta.picture as string) ?? avatar
  }

  return <SettingsClient lang={lang} displayName={displayName} email={email} avatar={avatar} proPrice={settings.proPriceMonth} plan={profile?.plan ?? "free"} />
}
