export default function DocsToolLoading() {
  return (
    <div className="docs-reader">
      <div className="skel" style={{ height: 18, width: 120, marginBottom: 20 }} />

      <div className="docs-body">
        {/* Left TOC skeleton */}
        <aside className="docs-toc" aria-hidden="true">
          {([
            [5, 80, 70, 64, 58, 72],
            [4, 76, 66, 58, 68],
            [3, 72, 62, 55],
          ] as number[][]).map((row, gi) => (
            <div key={gi} style={{ marginBottom: 22 }}>
              <div className="skel" style={{ height: 11, width: "58%", marginBottom: 13 }} />
              {row.slice(1).map((w, j) => (
                <div key={j} className="skel" style={{ height: 13, width: `${w}%`, marginBottom: 9, marginLeft: 14 }} />
              ))}
            </div>
          ))}
        </aside>

        {/* Main content skeleton */}
        <main className="docs-main" aria-busy="true">
          {/* Level banner */}
          <div className="skel" style={{ height: 120, borderRadius: 16, marginBottom: 28 }} />

          {/* Page counter */}
          <div className="skel" style={{ height: 11, width: "16%", marginBottom: 22 }} />

          {/* Prose lines — mix of heading-size and body-size */}
          {[100, 88, 92, 76, 94, 82, 20, 96, 72, 88, 68, 84, 78, 90].map((w, i) => (
            <div
              key={i}
              className="skel"
              style={{
                height: i === 6 ? 0 : i % 7 === 0 ? 20 : 13,
                width: `${w}%`,
                marginBottom: i === 6 ? 18 : i % 7 === 0 ? 22 : 9,
              }}
            />
          ))}
        </main>
      </div>
    </div>
  )
}
