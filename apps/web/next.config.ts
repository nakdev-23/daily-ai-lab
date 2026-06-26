import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@daily-ai-lab/core"],
  turbopack: {
    // `@lobehub/icons` pulls `@lobehub/ui` (+ antd) via its Avatar/Combine icon
    // variants, which this app never renders. Alias it to a lightweight stub so
    // the build resolves without the heavy peer-dep chain. See lib/lobehub-ui-stub.tsx.
    resolveAlias: {
      "@lobehub/ui": "./lib/lobehub-ui-stub.tsx",
    },
  },
}

export default nextConfig
