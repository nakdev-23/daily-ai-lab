import { Sk, SkRow } from "@/components/skeletons"

/**
 * Skeleton for the lesson player — shown the instant a learner taps a lesson,
 * so the slow fetch of lesson content + hearts never looks like a frozen tap.
 * Mirrors the player chrome: top bar (close · progress · hearts), a content
 * card, and the action button.
 */
export default function LessonLoading() {
  return (
    <div className="dlab-lesson">
      <div className="lesson-shell">
        <div className="lesson-top">
          <Sk w={36} h={36} circle />
          <div className="lprog" style={{ flex: 1 }}>
            <Sk w="32%" h="100%" r={999} />
          </div>
          <SkRow gap={6}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Sk key={i} w={20} h={20} circle />
            ))}
          </SkRow>
        </div>

        <div className="lesson-stage">
          <div className="lstep" style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
            <Sk w={120} h={26} r={999} />
            <Sk w="80%" h={32} style={{ marginTop: 18 }} />
            <div className="theory glass" style={{ marginTop: 20, padding: 24 }}>
              <Sk w="100%" h={14} />
              <Sk w="96%" h={14} style={{ marginTop: 12 }} />
              <Sk w="88%" h={14} style={{ marginTop: 12 }} />
              <Sk w="60%" h={14} style={{ marginTop: 12 }} />
              <Sk w="100%" h={120} r={16} style={{ marginTop: 22 }} />
            </div>
          </div>
        </div>

        <div className="lesson-foot" style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <Sk w={260} h={56} r={999} />
        </div>
      </div>
    </div>
  )
}
