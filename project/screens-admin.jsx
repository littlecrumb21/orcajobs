// Admin: moderation queue + stats

const { useState: adUseState } = React;

function AdminScreen({ go }) {
  const [filter, setFilter] = adUseState("Open");
  const flags = ADMIN_FLAGS.filter(f => filter === "All" ? true : f.status === filter);
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:20 }}>
        <div className="stack gap-2">
          <span className="micro">Moderation</span>
          <h1 className="h2" style={{ margin:0 }}>Trust &amp; Safety queue</h1>
        </div>
        <div className="row gap-2">
          <Button variant="ghost" icon="download">Export queue</Button>
          <Button variant="ghost" icon="gear">Rules &amp; auto-flags</Button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {ADMIN_STATS.map(s => <Stat key={s.label} {...s}/>)}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:24 }}>
        <aside className="stack gap-4">
          <div className="card pad-5 stack gap-2">
            <div className="micro">Filter</div>
            {["Open","Reviewing","Resolved","All"].map(s => (
              <a key={s} className={`side-link ${filter===s?"active":""}`} onClick={() => setFilter(s)}>
                <Icon name="flag"/> {s}
                <span className="grow"/>
                <span className="badge">{ADMIN_FLAGS.filter(f => s==="All"?true:f.status===s).length}</span>
              </a>
            ))}
          </div>
          <div className="card pad-5 stack gap-2">
            <div className="micro">Type</div>
            <label className="checkbox"><input type="checkbox" defaultChecked/> Job listings</label>
            <label className="checkbox"><input type="checkbox" defaultChecked/> Employers</label>
            <label className="checkbox"><input type="checkbox" defaultChecked/> Applicants</label>
            <label className="checkbox"><input type="checkbox"/> Messages</label>
          </div>
          <div className="card pad-5 stack gap-2" style={{ background:"var(--bg-soft)", border:0 }}>
            <b style={{ fontSize:13 }}>SLA: 4 hours</b>
            <div className="small">Open flags older than 4h are escalated to senior moderators automatically.</div>
          </div>
        </aside>

        <div className="stack gap-3">
          {flags.map(f => (
            <div key={f.id} className="card pad-5 row gap-4" style={{ alignItems:"flex-start" }}>
              <div style={{ width:36, height:36, borderRadius:8, background: f.status==="Open"?"color-mix(in srgb, var(--bad) 14%, transparent)":f.status==="Reviewing"?"color-mix(in srgb, var(--warn) 14%, transparent)":"color-mix(in srgb, var(--good) 14%, transparent)", color: f.status==="Open"?"var(--bad)":f.status==="Reviewing"?"var(--warn)":"var(--good)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="flag"/>
              </div>
              <div className="grow stack gap-2">
                <div className="row gap-2">
                  <span className="badge outline">{f.type}</span>
                  <span className={`pill-status`} style={{ background: f.status==="Open"?"color-mix(in srgb, var(--bad) 14%, transparent)":f.status==="Reviewing"?"color-mix(in srgb, var(--warn) 14%, transparent)":"color-mix(in srgb, var(--good) 14%, transparent)", color: f.status==="Open"?"var(--bad)":f.status==="Reviewing"?"var(--warn)":"var(--good)" }}>● {f.status}</span>
                  <span className="small" style={{ marginLeft:"auto" }}>{f.posted}</span>
                </div>
                <div style={{ fontWeight:600, fontSize:15 }}>{f.subject}</div>
                <div className="small">{f.reason} · {f.reporter}</div>
              </div>
              <div className="row gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm" style={{ color:"var(--bad)" }}>Remove</Button>
                <Button variant="primary" size="sm">Approve</Button>
              </div>
            </div>
          ))}
          {flags.length === 0 ? <div className="card pad-7 center" style={{ minHeight:140, color:"var(--muted)" }}>Nothing to review. Nice work.</div> : null}
        </div>
      </div>
    </div>
  );
}

function AdminStatsScreen() {
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <h1 className="h2" style={{ margin:"0 0 24px" }}>Platform stats</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {ADMIN_STATS.map(s => <Stat key={s.label} {...s}/>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
        <div className="card pad-6 stack gap-3">
          <h3 className="h4" style={{ margin:0 }}>Listings posted (last 12 weeks)</h3>
          <FakeBarChart/>
        </div>
        <div className="card pad-6 stack gap-3">
          <h3 className="h4" style={{ margin:0 }}>Top categories</h3>
          {CATEGORIES.slice(0,6).map(c => (
            <div key={c.id} className="stack gap-2">
              <div className="row" style={{ justifyContent:"space-between" }}>
                <span className="small row gap-2">{c.icon} {c.name}</span>
                <span className="small mono">{c.count}</span>
              </div>
              <div className="progress"><div style={{ transform:`scaleX(${c.count/100})` }}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FakeBarChart() {
  const bars = [42,55,38,61,48,72,80,68,75,84,79,92];
  const max = 100;
  return (
    <div className="row" style={{ alignItems:"flex-end", gap:6, height:180, paddingTop:8 }}>
      {bars.map((v, i) => (
        <div key={i} className="grow stack" style={{ alignItems:"center", gap:6 }}>
          <div style={{ width:"100%", height: `${(v/max)*100}%`, background: i===bars.length-1?"var(--accent)":"var(--bg-soft)", borderRadius:6, transition:"height .25s" }}/>
          <span className="small mono" style={{ fontSize:10 }}>w{i+1}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AdminScreen, AdminStatsScreen });
