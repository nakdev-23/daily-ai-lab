import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function UpgradeLoading() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <div className="glass" style={{ padding: 30, borderRadius: 24, marginBottom: 26, display: "flex", alignItems: "center", gap: 22 }}>
        <Sk w={120} h={120} circle />
        <SkCol gap={12} style={{ flex: 1 }}>
          <Sk w={150} h={20} r={999} />
          <Sk w="70%" h={30} />
          <Sk w="90%" h={14} />
        </SkCol>
      </div>

      <SkRow gap={20} style={{ alignItems: "stretch", flexWrap: "wrap" }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass" style={{ flex: "1 1 320px", padding: 26, borderRadius: 20 }}>
            <Sk w={100} h={16} r={999} />
            <Sk w="50%" h={40} style={{ marginTop: 16 }} />
            <Sk w="40%" h={14} style={{ marginTop: 10 }} />
            <SkCol gap={12} style={{ marginTop: 22 }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <SkRow key={j} gap={10}>
                  <Sk w={20} h={20} circle />
                  <Sk w="70%" h={13} />
                </SkRow>
              ))}
            </SkCol>
            <Sk w="100%" h={52} r={999} style={{ marginTop: 24 }} />
          </div>
        ))}
      </SkRow>
    </div>
  )
}
