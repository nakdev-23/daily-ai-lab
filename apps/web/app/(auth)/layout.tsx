export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100dvh", overflow: "hidden" }}>{children}</div>
}
