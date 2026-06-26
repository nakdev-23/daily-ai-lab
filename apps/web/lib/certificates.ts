import "server-only"
import { cache } from "react"
import { createClient, getAuthUser } from "./supabase/server"
import { publicClient } from "./supabase/public"

export type Certificate = {
  verificationCode: string
  recipientName: string
  pathTitle: string
  pathTitleEn: string | null
  pathSlug: string
  completedSteps: number
  totalXp: number
  issuedAt: string
  valid: boolean
}

type CertificateRow = {
  verification_code: string
  recipient_name: string
  path_title: string
  path_title_en: string | null
  path_slug: string
  completed_steps: number
  total_xp: number
  issued_at: string
  revoked_at?: string | null
  valid?: boolean
}

function toCertificate(row: CertificateRow): Certificate {
  return {
    verificationCode: row.verification_code,
    recipientName: row.recipient_name,
    pathTitle: row.path_title,
    pathTitleEn: row.path_title_en,
    pathSlug: row.path_slug,
    completedSteps: row.completed_steps,
    totalXp: row.total_xp,
    issuedAt: row.issued_at,
    valid: row.valid ?? !row.revoked_at,
  }
}

/** Public, privacy-limited verification lookup. */
export const getCertificateByCode = cache(async (code: string): Promise<Certificate | null> => {
  if (!/^DAL-[A-F0-9]{20}$/i.test(code)) return null
  const { data, error } = await publicClient.rpc("verify_certificate", {
    p_code: code.toUpperCase(),
  })
  if (error || !Array.isArray(data) || data.length === 0) return null
  return toCertificate(data[0] as CertificateRow)
})

/** Certificates owned by the signed-in learner, newest first. */
export async function getMyCertificates(): Promise<Certificate[]> {
  const user = await getAuthUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("certificates")
    .select("verification_code,recipient_name,path_title,path_title_en,path_slug,completed_steps,total_xp,issued_at,revoked_at")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })
  return ((data as CertificateRow[] | null) ?? []).map(toCertificate)
}

/** Existing certificate for one path, used on the path completion card. */
export async function getMyCertificateForPath(pathId: string): Promise<Certificate | null> {
  const user = await getAuthUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from("certificates")
    .select("verification_code,recipient_name,path_title,path_title_en,path_slug,completed_steps,total_xp,issued_at,revoked_at")
    .eq("user_id", user.id)
    .eq("path_id", pathId)
    .maybeSingle()
  return data ? toCertificate(data as CertificateRow) : null
}

