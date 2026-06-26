"use client"

import { useState } from "react"
import { Check, Copy, Printer } from "lucide-react"

export default function CertificateActions({
  copyLabel,
  copiedLabel,
  printLabel,
}: {
  copyLabel: string
  copiedLabel: string
  printLabel: string
}) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement("textarea")
      input.value = url
      input.style.position = "fixed"
      input.style.opacity = "0"
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="certificate-actions">
      <button type="button" onClick={copyLink} aria-live="polite">
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? copiedLabel : copyLabel}
      </button>
      <button type="button" className="primary" onClick={() => window.print()}>
        <Printer size={17} /> {printLabel}
      </button>
    </div>
  )
}
