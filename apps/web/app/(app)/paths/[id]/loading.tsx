import { Sk, SkRow, SkCol } from "@/components/skeletons"

export default function PathDetailLoading() {
  return (
    <>
      <div className="glass" style={{ padding: 28, borderRadius: 22, marginBottom: 26 }}>
        <SkRow gap={18}>
          <Sk w={72} h={72} r={18} />
          <SkCol gap={11} style={{ flex: 1 }}>
            <Sk w={150} h={20} r={999} />
            <Sk w="55%" h={28} />
            <Sk w="80%" h={14} />
          </SkCol>
        </SkRow>
        <SkRow gap={10} style={{ marginTop: 22 }}>
          <Sk w={120} h={48} r={999} />
          <Sk w={120} h={48} r={999} />
        </SkRow>
      </div>

      <Sk w={220} h={22} style={{ marginBottom: 18 }} />
      <SkCol gap={14}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderRadius: 16 }}>
            <SkRow gap={14}>
              <Sk w={42} h={42} circle />
              <SkCol gap={8} style={{ flex: 1 }}>
                <Sk w="46%" h={15} />
                <Sk w="70%" h={12} />
              </SkCol>
              <Sk w={26} h={26} circle />
            </SkRow>
          </div>
        ))}
      </SkCol>
    </>
  )
}
