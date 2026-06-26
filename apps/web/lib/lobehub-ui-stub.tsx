import * as React from "react"

/**
 * Stub for `@lobehub/ui`.
 *
 * `@lobehub/icons` v5 declares `@lobehub/ui` + `antd` as peer deps because its
 * brand-icon *variants* (`.Avatar`, `.Combine`) import layout components
 * (`Center`, `Flexbox`, …) from `@lobehub/ui`. This app only ever renders the
 * plain mono / `.Color` brand glyphs (see components/ai-logo.tsx) — never the
 * Avatar/Combine variants — so those imports get bundled but are NEVER executed.
 *
 * Aliasing `@lobehub/ui` to this stub (next.config.ts → turbopack.resolveAlias)
 * lets the build resolve without pulling the heavy antd-based `@lobehub/ui`
 * dependency chain into a Next 16 / React 19 app. If a real `@lobehub/ui`
 * component ever needs to render, install the real package and drop the alias.
 */
type AnyProps = { children?: React.ReactNode }

const Passthrough = React.forwardRef<HTMLDivElement, AnyProps>(
  function Passthrough({ children }, ref) {
    return React.createElement("div", { ref }, children)
  },
)

export const Center = Passthrough
export const Flexbox = Passthrough
export const Block = Passthrough
export const Grid = Passthrough
export const ActionIcon = Passthrough
export const CopyButton = Passthrough
export const Highlighter = Passthrough
export const Icon = Passthrough
export const SearchBar = Passthrough
export const Segmented = Passthrough
export const Snippet = Passthrough
export const Tag = Passthrough
export const Text = Passthrough
export const Tooltip = Passthrough
export const TooltipGroup = Passthrough

export default {}
