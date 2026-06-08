import type { Metadata, Viewport } from "next"
import { Prompt } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Daily AI Lab",
  description: "เรียน AI วันละ 15 นาที ค่อย ๆ เก่ง ChatGPT, Claude, Gemini และเครื่องมืออีกเพียบ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Daily AI Lab",
  },
}

export const viewport: Viewport = {
  themeColor: "#6c47ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${prompt.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f0efff] text-gray-900">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}

function ServiceWorkerRegister() {
  const isProd = process.env.NODE_ENV === "production"
  const code = isProd
    ? `if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js') })
      }`
    : `// Dev: unregister any service worker + clear caches to avoid stale-chunk/HTML loops
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister()))
      }
      if (window.caches) { caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))) }`
  return <Script id="sw-register" strategy="afterInteractive">{code}</Script>
}
