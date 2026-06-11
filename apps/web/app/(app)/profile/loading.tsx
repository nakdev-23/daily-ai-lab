import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function ProfileLoading() {
  return (
    <>
      <div className="glass" style={{ padding: 26, borderRadius: 22, marginBottom: 24 }}>
        <SkRow gap={20} style={{ alignItems: "flex-start" }}>
          <Sk w={96} h={96} circle />
          <SkCol gap={12} style={{ flex: 1 }}>
            <Sk w="42%" h={28} />
            <SkRow gap={8}>
              <Sk w={90} h={26} r={999} />
              <Sk w={110} h={26} r={999} />
              <Sk w={80} h={26} r={999} />
            </SkRow>
            <Sk w="100%" h={8} r={999} style={{ marginTop: 6 }} />
          </SkCol>
        </SkRow>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderRadius: 16 }}>
            <Sk w={36} h={36} r={10} />
            <Sk w="60%" h={22} style={{ marginTop: 12 }} />
            <Sk w="80%" h={12} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>

      <Sk w={180} h={22} style={{ marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 14 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkCol key={i} gap={10} style={{ alignItems: "center" }}>
            <Sk w={72} h={72} circle />
            <Sk w="70%" h={12} />
          </SkCol>
        ))}
      </div>
    </>
  )
}
