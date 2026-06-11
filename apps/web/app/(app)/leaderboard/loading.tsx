import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function LeaderboardLoading() {
  return (
    <>
      <div className="glass" style={{ padding: 26, borderRadius: 22, marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
        <Sk w={64} h={64} r={18} />
        <SkCol gap={11} style={{ flex: 1 }}>
          <Sk w={150} h={16} r={999} />
          <Sk w="40%" h={26} />
          <Sk w="60%" h={13} />
        </SkCol>
        <SkCol gap={6} style={{ alignItems: "center" }}>
          <Sk w={70} h={22} />
          <Sk w={44} h={12} />
        </SkCol>
      </div>

      {/* podium */}
      <SkRow gap={16} style={{ justifyContent: "center", alignItems: "flex-end", marginBottom: 26 }}>
        {[96, 124, 80].map((h, i) => (
          <SkCol key={i} gap={10} style={{ alignItems: "center" }}>
            <Sk w={56} h={56} circle />
            <Sk w={70} h={h} r={14} />
          </SkCol>
        ))}
      </SkRow>

      <SkCol gap={10}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: "12px 16px", borderRadius: 14 }}>
            <SkRow gap={14}>
              <Sk w={22} h={16} />
              <Sk w={40} h={40} circle />
              <SkCol gap={7} style={{ flex: 1 }}>
                <Sk w="40%" h={14} />
                <Sk w={90} h={11} />
              </SkCol>
              <Sk w={70} h={15} />
            </SkRow>
          </div>
        ))}
      </SkCol>
    </>
  )
}
