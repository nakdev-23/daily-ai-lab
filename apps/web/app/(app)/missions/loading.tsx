import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function MissionsLoading() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <SkRow gap={16} style={{ marginBottom: 24 }}>
        <SkCol gap={10} style={{ flex: 1 }}>
          <Sk w={200} h={26} />
          <Sk w={280} h={14} />
        </SkCol>
        <Sk w={64} h={64} circle />
      </SkRow>

      <SkCol gap={16}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderRadius: 16 }}>
            <SkRow gap={12} style={{ marginBottom: 14, justifyContent: "space-between" }}>
              <SkRow gap={12}>
                <Sk w={44} h={44} r={12} />
                <SkCol gap={7}>
                  <Sk w={150} h={15} />
                  <Sk w={50} h={11} />
                </SkCol>
              </SkRow>
            </SkRow>
            <Sk w="100%" h={8} r={999} />
          </div>
        ))}
      </SkCol>

      <SkRow gap={12} style={{ marginTop: 24 }}>
        <Sk w="50%" h={48} r={14} />
        <Sk w="50%" h={48} r={14} />
      </SkRow>
    </div>
  )
}
