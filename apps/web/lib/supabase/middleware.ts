import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

// Routes that require a signed-in user.
const PROTECTED = ["/daily-learn", "/dashboard", "/learn", "/docs", "/paths", "/leaderboard", "/profile", "/settings", "/missions", "/upgrade", "/admin"]
// Auth pages — bounce signed-in users away from these.
const AUTH_PAGES = ["/login", "/register"]

const matches = (path: string, list: string[]) =>
  list.some((p) => path === p || path.startsWith(p + "/"))

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname

  // ── Rate limiting (per IP) — applies in all modes ──
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  // Stricter limit on auth endpoints to slow brute-force / signup abuse.
  const isAuth = matches(path, AUTH_PAGES)
  const { ok, reset } = isAuth
    ? rateLimit(`auth:${ip}`, 20, 60_000)
    : rateLimit(`req:${ip}`, 200, 10_000)
  if (!ok) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))) },
    })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // IMPORTANT: refreshes the session cookie; do not run code between this and the response.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && matches(path, PROTECTED)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  if (user && matches(path, AUTH_PAGES)) {
    const url = request.nextUrl.clone()
    url.pathname = "/daily-learn"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return response
}
