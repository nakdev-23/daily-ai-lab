import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function PathsLoading() {
  return (
    <>
      <SkCol gap={12} style={{ marginBottom: 26 }}>
        <Sk w={200} h={28} />
        <Sk w={360} h={15} />
      </SkCol>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass"
            style={{ padding: 22, borderRadius: 18, pointerEvents: "none" }}
          >
            <SkRow gap={14} style={{ marginBottom: 16 }}>
              <Sk w={52} h={52} r={14} />
              <SkCol gap={8} style={{ flex: 1 }}>
                <Sk w="60%" h={17} />
                <Sk w={90} h={12} />
              </SkCol>
            </SkRow>
            <Sk w="92%" h={13} />
            <Sk w="70%" h={13} style={{ marginTop: 9 }} />
            <SkRow gap={8} style={{ marginTop: 20 }}>
              <Sk w={72} h={24} r={999} />
              <Sk w={88} h={24} r={999} />
            </SkRow>
            <Sk w="100%" h={46} r={999} style={{ marginTop: 18 }} />
          </div>
        ))}
      </div>
    </>
  )
}
