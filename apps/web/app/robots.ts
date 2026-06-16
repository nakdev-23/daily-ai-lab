import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ailab.learnnakdev.online"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in app, lesson player, admin and API are not for crawlers.
        disallow: ["/admin", "/api/", "/daily-learn", "/learn", "/leaderboard", "/missions", "/profile", "/settings", "/upgrade", "/dashboard", "/auth/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
