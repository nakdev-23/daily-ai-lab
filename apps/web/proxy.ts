import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Next renamed the "middleware" file convention to "proxy" in this version.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and files:
     * _next internals, the public asset folders, the service worker, and any
     * file with a common static extension.
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|icons/|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
