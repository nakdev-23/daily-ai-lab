// Facebook Pixel — client-side utility
// event_id must be shared with CAPI (server-side) for deduplication.
// Consent is managed via fbq('consent', 'revoke/grant') — see grantConsent/revokeConsent.

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void
    _fbq: unknown
  }
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function fbq(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window.fbq as any)(...args)
  }
}

// ─── Standard Events ──────────────────────────────────────────────────────────

export function pageview(eventId = generateEventId()): void {
  fbq("track", "PageView", {}, { eventID: eventId })
}

export function viewContent(
  params: {
    content_ids?: string[]
    content_name?: string
    content_type?: string
    value?: number
    currency?: string
  },
  eventId = generateEventId()
): void {
  fbq("track", "ViewContent", params, { eventID: eventId })
}

export function addToCart(
  params: {
    content_ids: string[]
    content_name?: string
    value?: number
    currency?: string
  },
  eventId = generateEventId()
): void {
  fbq("track", "AddToCart", params, { eventID: eventId })
}

export function purchase(
  params: {
    value: number
    currency: string
    content_ids?: string[]
    num_items?: number
  },
  eventId = generateEventId()
): void {
  fbq("track", "Purchase", params, { eventID: eventId })
}

// ─── Consent Management ───────────────────────────────────────────────────────

const CONSENT_KEY = "fb_pixel_consent"

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(CONSENT_KEY) === "granted"
}

/** Call from consent banner "Accept" button */
export function grantConsent(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONSENT_KEY, "granted")
  fbq("consent", "grant")
}

/** Call from consent banner "Decline" or settings revoke */
export function revokeConsent(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONSENT_KEY, "denied")
  fbq("consent", "revoke")
}
