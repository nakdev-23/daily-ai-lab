import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function SettingsLoading() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, alignItems: "start" }}>
      <SkCol gap={10}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Sk key={i} w="100%" h={40} r={12} />
        ))}
      </SkCol>

      <SkCol gap={20}>
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="glass" style={{ padding: 24, borderRadius: 18 }}>
            <Sk w={160} h={20} style={{ marginBottom: 18 }} />
            {Array.from({ length: 2 }).map((_, r) => (
              <SkRow key={r} gap={16} style={{ justifyContent: "space-between", padding: "14px 0", borderTop: r ? "1px solid rgba(108,60,245,.08)" : undefined }}>
                <SkCol gap={8} style={{ flex: 1 }}>
                  <Sk w={140} h={14} />
                  <Sk w="60%" h={12} />
                </SkCol>
                <Sk w={120} h={40} r={12} />
              </SkRow>
            ))}
          </div>
        ))}
      </SkCol>
    </div>
  )
}
