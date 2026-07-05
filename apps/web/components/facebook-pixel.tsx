"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { FB_PIXEL_ID, pageview, generateEventId } from "@/lib/pixel"

// PIXEL_ID is a numeric string from env — safe to inline (not user input).
const PIXEL_INIT_SCRIPT = FB_PIXEL_ID
  ? `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    if(localStorage.getItem('fb_pixel_consent')!=='granted'){fbq('consent','revoke')}
    fbq('init','${FB_PIXEL_ID}');
    fbq('track','PageView');
  `
  : null

function RouteChangeTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Subsequent navigations — initial PageView is fired by the base script.
    pageview(generateEventId())
  }, [pathname, searchParams])

  return null
}

export default function FacebookPixel() {
  if (!FB_PIXEL_ID || !PIXEL_INIT_SCRIPT) return null

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: PIXEL_INIT_SCRIPT }}
      />
      <noscript>
        {/* Fallback pixel — fires PageView for browsers with JS disabled */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* useSearchParams requires Suspense boundary */}
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  )
}
