import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function TopicQuestmapLoading() {
  return (
    <>
      <div className="goal-card" style={{ minHeight: 130, display: "flex", alignItems: "center", gap: 20 }}>
        <Sk w={56} h={56} r={16} />
        <SkCol gap={10} style={{ flex: 1 }}>
          <Sk w="50%" h={26} />
          <Sk w="34%" h={14} />
          <Sk w="100%" h={8} r={999} style={{ marginTop: 4 }} />
        </SkCol>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, marginTop: 36 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkRow
            key={i}
            gap={16}
            style={{ width: "100%", maxWidth: 460, justifyContent: i % 2 ? "flex-end" : "flex-start" }}
          >
            {i % 2 === 0 && <Sk w={72} h={72} circle />}
            <SkCol gap={8} style={{ width: 150 }}>
              <Sk w="80%" h={14} />
              <Sk w="50%" h={11} />
            </SkCol>
            {i % 2 === 1 && <Sk w={72} h={72} circle />}
          </SkRow>
        ))}
      </div>
    </>
  )
}
