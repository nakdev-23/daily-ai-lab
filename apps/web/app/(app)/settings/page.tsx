import { getLang } from "@/lib/i18n"
import { isDevMock, MOCK_PROFILE } from "@/lib/mock-user"
import { createClient } from "@/lib/supabase/server"
import SettingsClient from "./_settings-client"

export default async function SettingsPage() {
  const lang = await getLang()

  let displayName = MOCK_PROFILE.display_name ?? "Nin"
  let email = "nin@gmail.com"
  let avatar: string | null = MOCK_PROFILE.avatar_url

  if (!isDevMock()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const meta = user.user_metadata ?? {}
      email = user.email ?? email
      displayName = (meta.full_name as string) ?? (meta.name as string) ?? displayName
      avatar = (meta.avatar_url as string) ?? (meta.picture as string) ?? avatar
    }
  }

  return <SettingsClient lang={lang} displayName={displayName} email={email} avatar={avatar} />
}
