export default function DocsHubLoading() {
  return (
    <>
      <section className="wrap page-hero" style={{ paddingTop: 8 }}>
        <div className="skel" style={{ height: 12, width: 110, margin: "0 auto 20px" }} />
        <div className="skel" style={{ height: 44, width: "100%", maxWidth: 460, margin: "0 auto 20px", borderRadius: 999 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {[80, 120, 72, 95, 72, 105].map((w, i) => (
            <div key={i} className="skel" style={{ height: 38, width: w, borderRadius: 999 }} />
          ))}
        </div>
      </section>

      <section className="block" style={{ paddingTop: 24 }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div className="tools-big">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="glass" style={{ padding: 22, borderRadius: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
                  <div className="skel" style={{ width: 52, height: 52, borderRadius: 15, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skel" style={{ height: 18, width: "62%", marginBottom: 9 }} />
                    <div className="skel" style={{ height: 11, width: "42%" }} />
                  </div>
                </div>
                <div className="skel" style={{ height: 13, width: "85%", marginBottom: 8 }} />
                <div className="skel" style={{ height: 13, width: "65%", marginBottom: 20 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <div className="skel" style={{ height: 22, width: 70, borderRadius: 999 }} />
                  <div className="skel" style={{ height: 22, width: 80, borderRadius: 999 }} />
                  <div className="skel" style={{ height: 22, width: 60, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
