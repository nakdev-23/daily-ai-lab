import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function DailyLearnLoading() {
  return (
    <>
      <div className="goal-card goal-hero" style={{ minHeight: 150, display: "flex", alignItems: "center", gap: 20 }}>
        <SkCol gap={12} style={{ flex: 1 }}>
          <Sk w={160} h={22} r={999} />
          <Sk w="70%" h={30} />
          <Sk w="48%" h={15} />
        </SkCol>
        <Sk w={92} h={92} circle />
      </div>

      <div className="lrn-head" style={{ marginTop: 26 }}>
        <SkCol gap={9}>
          <Sk w={230} h={22} />
          <Sk w={310} h={14} />
        </SkCol>
      </div>

      <div className="lrn-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="lrn-card" key={i} style={{ pointerEvents: "none" }}>
            <SkRow gap={12}>
              <Sk w={44} h={44} r={12} />
              <SkCol gap={8} style={{ flex: 1 }}>
                <Sk w="58%" h={16} />
                <Sk w={84} h={12} />
              </SkCol>
            </SkRow>
            <Sk w="92%" h={12} style={{ marginTop: 16 }} />
            <Sk w="74%" h={12} style={{ marginTop: 8 }} />
            <SkRow gap={8} style={{ marginTop: 18, justifyContent: "space-between" }}>
              <Sk w={84} h={12} />
              <Sk w={58} h={12} />
            </SkRow>
            <Sk w="100%" h={8} r={999} style={{ marginTop: 12 }} />
          </div>
        ))}
      </div>
    </>
  )
}
