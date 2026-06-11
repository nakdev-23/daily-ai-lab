import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function CourseLoading() {
  return (
    <section className="wrap">
      <div className="course-top" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32 }}>
        <SkCol gap={14}>
          <Sk w={64} h={64} r={18} />
          <Sk w={160} h={18} r={999} />
          <Sk w="80%" h={34} style={{ marginTop: 4 }} />
          <Sk w="100%" h={14} />
          <Sk w="64%" h={14} />
          <SkRow gap={20} style={{ marginTop: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkCol key={i} gap={6}>
                <Sk w={44} h={22} />
                <Sk w={56} h={11} />
              </SkCol>
            ))}
          </SkRow>
          <SkRow gap={12} style={{ marginTop: 18 }}>
            <Sk w={170} h={52} r={999} />
            <Sk w={150} h={52} r={999} />
          </SkRow>
        </SkCol>
        <Sk w="100%" h={300} r={24} />
      </div>

      <div style={{ marginTop: 44 }}>
        <Sk w={260} h={26} style={{ marginBottom: 20 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass" style={{ padding: 20, borderRadius: 16 }}>
              <Sk w={40} h={40} r={12} />
              <Sk w="70%" h={15} style={{ marginTop: 14 }} />
              <Sk w="90%" h={12} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
