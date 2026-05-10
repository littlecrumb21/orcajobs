// Public screens: Home, Search, Job detail, About, Employers (pricing landing)

const { useState: pUseState, useMemo: pUseMemo } = React;

// ── Home ──────────────────────────────────────────────────────────────
function HomeScreen({ go }) {
  const [q, setQ] = pUseState("");
  const [where, setWhere] = pUseState("");
  return (
    <div className="screen">
      <Hero onSearch={(query, loc) => { go("search", { q: query, where: loc }); }}/>
      <CategoriesStrip go={go}/>
      <FeaturedJobs go={go}/>
      <IslandProof />
      <EmployerCTA go={go}/>
    </div>
  );
}

function Hero({ onSearch }) {
  const [q, setQ] = pUseState("");
  const [w, setW] = pUseState("");
  return (
    <section style={{ position:"relative", overflow:"hidden", paddingBottom:60 }}>
      <div className="wrap" style={{ paddingTop:80, position:"relative", zIndex:2 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.2fr .8fr", gap:60, alignItems:"end" }}>
          <div className="stack gap-5">
            <span className="badge outline mono">↳ 684 live roles · updated this morning</span>
            <h1 className="h1" style={{ margin:0, maxWidth:680 }}>
              Work that fits <span style={{ fontStyle:"italic", color:"var(--accent)" }}>the island</span>.
            </h1>
            <p className="lede" style={{ maxWidth:520 }}>
              Every job on the Isle of Wight, in one place. From shipyards in Cowes to vineyards in Sandown — find roles that don't need a ferry commute.
            </p>
            <div className="card elev pad-4 row gap-2" style={{ borderRadius:14 }}>
              <div className="row gap-2 grow" style={{ paddingLeft:8 }}>
                <Icon name="search" size={18}/>
                <input className="input" style={{ border:0, padding:0, background:"transparent" }}
                  placeholder="Job title, skill, or company"
                  value={q} onChange={e=>setQ(e.target.value)}/>
              </div>
              <div className="vr" style={{ height:24 }}/>
              <div className="row gap-2" style={{ width:220, padding:"0 8px" }}>
                <Icon name="pin" size={18}/>
                <select className="select" style={{ border:0, padding:0, background:"transparent" }}
                        value={w} onChange={e=>setW(e.target.value)}>
                  <option value="">Anywhere on the island</option>
                  {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Button onClick={() => onSearch(q, w)} icon="arrow" iconAfter={null} variant="primary">Search</Button>
            </div>
            <div className="row gap-3 small" style={{ flexWrap:"wrap" }}>
              <span style={{ color:"var(--muted)" }}>Trending:</span>
              {["Marine engineer","Care worker","Ferry crew","Hospitality manager","Teaching assistant"].map(t => (
                <a key={t} className="badge" style={{ cursor:"pointer" }} onClick={() => onSearch(t,"")}>{t}</a>
              ))}
            </div>
          </div>
          <div className="stack gap-4">
            <Placeholder label="Cowes harbour at dawn" aspect="4/5" style={{ borderRadius:18 }}/>
            <div className="row gap-3">
              <div className="card pad-4 grow stack" style={{ gap:4 }}>
                <div className="display" style={{ fontSize:28 }}>£31.4k</div>
                <div className="small">Median island salary</div>
              </div>
              <div className="card pad-4 grow stack" style={{ gap:4 }}>
                <div className="display" style={{ fontSize:28 }}>2.1k</div>
                <div className="small">Active job seekers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesStrip({ go }) {
  return (
    <section className="wrap" style={{ marginTop:40 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:18 }}>
        <h2 className="h3" style={{ margin:0 }}>Browse by sector</h2>
        <a className="small row gap-2" style={{ cursor:"pointer", color:"var(--ink-2)" }} onClick={() => go("search")}>All categories <Icon name="arrow" size={14}/></a>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10 }}>
        {CATEGORIES.map(c => (
          <a key={c.id} className="card pad-4 stack gap-3 job-card" onClick={() => go("search", { cat: c.id })}>
            <div style={{ width:36, height:36, borderRadius:10, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{c.icon}</div>
            <div className="stack" style={{ gap:2 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
              <div className="small">{c.count} live roles</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedJobs({ go }) {
  const featured = JOBS.filter(j => j.featured).slice(0, 6);
  const all = JOBS.slice(0, 8);
  return (
    <section className="wrap" style={{ marginTop:60 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:18 }}>
        <div className="stack gap-2">
          <span className="micro">Featured this week</span>
          <h2 className="h3" style={{ margin:0 }}>Hand-picked roles from island employers</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => go("search")} iconAfter="arrow">See all 684 jobs</Button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {featured.slice(0,4).map(j => <JobCard key={j.id} job={j} go={go} variant="featured"/>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:12 }}>
        {all.slice(4,7).map(j => <JobCard key={j.id} job={j} go={go} variant="compact"/>)}
      </div>
    </section>
  );
}

function JobCard({ job, go, variant = "default" }) {
  const compact = variant === "compact";
  return (
    <article className="card job-card pad-5 stack gap-3" onClick={() => go("job-detail", { id: job.id })}>
      <div className="row gap-3" style={{ alignItems:"flex-start" }}>
        <div style={{ width:42, height:42, borderRadius:10, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, color:"var(--ink-2)", border:"1px solid var(--line)" }}>{job.logo}</div>
        <div className="grow stack" style={{ gap:2 }}>
          <div className="row gap-2" style={{ flexWrap:"wrap" }}>
            {job.featured ? <span className="badge accent">★ Featured</span> : null}
            {job.premium ? <span className="badge outline">Premium</span> : null}
            <span className="badge">{job.type}</span>
          </div>
          <h3 className="h4" style={{ margin:"4px 0 0", fontSize: compact ? 15 : 18 }}>{job.title}</h3>
          <div className="small">{job.company}</div>
        </div>
        <button onClick={(e)=>{e.stopPropagation()}} className="nav-link" style={{ padding:6 }}><Icon name="bookmark"/></button>
      </div>
      {!compact ? <p style={{ margin:0, color:"var(--ink-2)", fontSize:14 }}>{job.summary}</p> : null}
      <div className="hr"/>
      <div className="row" style={{ justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div className="row gap-3 small">
          <span className="row gap-2"><Icon name="pin" size={13}/>{job.location}</span>
          <span className="row gap-2"><Icon name="coin" size={13}/>{job.salary}</span>
        </div>
        <span className="small">{job.posted}</span>
      </div>
    </article>
  );
}

function IslandProof() {
  return (
    <section className="wrap" style={{ marginTop:80 }}>
      <div className="card pad-8" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", borderRadius:24 }}>
        <div className="stack gap-4">
          <span className="micro">Why Orca</span>
          <h2 className="h2" style={{ margin:0 }}>Made on the island, for the island.</h2>
          <p className="lede">Mainland boards lump us in with Hampshire. We don't. Every listing here is a real Isle of Wight role — verified by our team in Newport.</p>
          <div className="row gap-6" style={{ flexWrap:"wrap" }}>
            <Stat label="Verified employers" value="412" delta="Manually reviewed"/>
            <Stat label="Avg. time to first reply" value="3.2 days" delta="Faster than mainland boards"/>
          </div>
        </div>
        <Placeholder label="Island team in Newport office" aspect="4/3" style={{ borderRadius:18 }}/>
      </div>
    </section>
  );
}

function EmployerCTA({ go }) {
  return (
    <section className="wrap" style={{ marginTop:60 }}>
      <div className="card pad-7" style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:32, alignItems:"center", background:"var(--ink)", color:"var(--bg)", border:0, borderRadius:24 }}>
        <div className="stack gap-4">
          <span className="micro" style={{ color:"var(--bg)" }}>Hiring on the island?</span>
          <h2 className="h2" style={{ margin:0 }}>Reach the right people in the right postcodes.</h2>
          <p style={{ color:"var(--bg)", opacity:.85, fontSize:18, lineHeight:1.5, maxWidth:480 }}>
            Pay-per-ad pricing from £49. Featured listings reach 11,000+ island job seekers within 24 hours.
          </p>
          <div className="row gap-2">
            <Button variant="primary" onClick={() => go("post-job")}>Post a job</Button>
            <Button variant="ghost" onClick={() => go("employers")} className="" style={{ borderColor:"rgba(255,255,255,.25)", color:"var(--bg)" }}>See pricing</Button>
          </div>
        </div>
        <div className="stack gap-3">
          {PRICING.map(p => (
            <div key={p.id} className="row gap-3" style={{ background:"rgba(255,255,255,.07)", padding:"12px 16px", borderRadius:14 }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:24, color:"var(--bg)" }}>£{p.price}</div>
              <div className="grow stack" style={{ gap:0 }}>
                <div style={{ fontWeight:600, color:"var(--bg)" }}>{p.name}</div>
                <div style={{ fontSize:12, color:"var(--bg)", opacity:.7 }}>{p.duration} · {p.blurb}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Search ────────────────────────────────────────────────────────────
function SearchScreen({ go, params }) {
  const [q, setQ] = pUseState(params.q || "");
  const [where, setWhere] = pUseState(params.where || "");
  const [type, setType] = pUseState("");
  const [salary, setSalary] = pUseState(0);
  const [view, setView] = pUseState("list");
  const [sort, setSort] = pUseState("relevance");

  const filtered = pUseMemo(() => {
    return JOBS.filter(j => {
      if (q && !(`${j.title} ${j.company} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (where && j.location !== where) return false;
      if (type && j.type !== type) return false;
      if (salary && j.salaryNum < salary) return false;
      return true;
    }).sort((a,b) => sort === "salary" ? b.salaryNum - a.salaryNum : sort === "recent" ? 0 : (b.featured?1:0) - (a.featured?1:0));
  }, [q, where, type, salary, sort]);

  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:40 }}>
      <div className="card pad-5 row gap-3" style={{ borderRadius:14 }}>
        <div className="row gap-2 grow" style={{ paddingLeft:8 }}>
          <Icon name="search" size={18}/>
          <input className="input" style={{ border:0, background:"transparent", padding:0 }} placeholder="Title, skill, company" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <div className="vr" style={{ height:24 }}/>
        <div className="row gap-2" style={{ width:200, padding:"0 8px" }}>
          <Icon name="pin" size={18}/>
          <select className="select" style={{ border:0, background:"transparent", padding:0 }} value={where} onChange={e=>setWhere(e.target.value)}>
            <option value="">Anywhere on the island</option>
            {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Button variant="primary">Search</Button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:24, marginTop:24 }}>
        <aside className="stack gap-5">
          <div className="stack gap-3">
            <div className="micro">Filters</div>
            <div className="field">
              <label>Job type</label>
              <select className="select" value={type} onChange={e=>setType(e.target.value)}>
                <option value="">All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Seasonal</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="field">
              <label>Min salary <span className="hint">£{salary.toLocaleString()}</span></label>
              <input type="range" min="0" max="60000" step="2500" value={salary} onChange={e=>setSalary(+e.target.value)} style={{ accentColor:"var(--accent)" }}/>
            </div>
            <div className="field">
              <label>Working pattern</label>
              <div className="stack gap-2">
                {["Remote","Hybrid","On-site"].map(o => (
                  <label key={o} className="checkbox"><input type="checkbox"/> {o}</label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Posted</label>
              <div className="stack gap-2">
                {["Last 24 hours","Last 7 days","Last 30 days"].map(o => (
                  <label key={o} className="radio"><input type="radio" name="posted"/> {o}</label>
                ))}
              </div>
            </div>
          </div>
          <div className="card pad-5 stack gap-2" style={{ background:"var(--bg-soft)", border:0 }}>
            <div className="row gap-2"><Icon name="bell" size={14}/><b style={{ fontSize:13 }}>Job alerts</b></div>
            <div className="small">Email me when new roles match these filters.</div>
            <Button size="sm" variant="ghost" block>Create alert</Button>
          </div>
        </aside>

        <div className="stack gap-3">
          <div className="row" style={{ justifyContent:"space-between" }}>
            <div className="row gap-3">
              <div><b>{filtered.length}</b> <span className="small">jobs</span></div>
              <div className="small" style={{ color:"var(--muted)" }}>{q ? `for "${q}"` : ""}{where ? ` in ${where}` : ""}</div>
            </div>
            <div className="row gap-2">
              <select className="select sm" value={sort} onChange={e=>setSort(e.target.value)} style={{ width:160, padding:"6px 10px", fontSize:13 }}>
                <option value="relevance">Most relevant</option>
                <option value="recent">Most recent</option>
                <option value="salary">Highest salary</option>
              </select>
              <div className="row" style={{ background:"var(--bg-soft)", borderRadius:8, padding:2 }}>
                <button className="nav-link" style={{ padding:6, background: view==="list"?"var(--card)":"transparent" }} onClick={()=>setView("list")}><Icon name="list"/></button>
                <button className="nav-link" style={{ padding:6, background: view==="grid"?"var(--card)":"transparent" }} onClick={()=>setView("grid")}><Icon name="grid"/></button>
              </div>
            </div>
          </div>
          <div style={{ display: view==="grid"?"grid":"flex", gridTemplateColumns: view==="grid"?"1fr 1fr":undefined, flexDirection: view==="list"?"column":undefined, gap:12 }}>
            {filtered.map(j => <JobCard key={j.id} job={j} go={go} variant={view==="grid"?"compact":"default"}/>)}
            {filtered.length === 0 ? <div className="card pad-7 center" style={{ minHeight:200, color:"var(--muted)" }}>No matching jobs. Try widening your filters.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Job detail ────────────────────────────────────────────────────────
function JobDetailScreen({ go, params }) {
  const job = JOBS.find(j => j.id === params.id) || JOBS[0];
  const [saved, setSaved] = pUseState(false);
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:40 }}>
      <a className="row gap-2 small" style={{ cursor:"pointer", marginBottom:16 }} onClick={() => go("search")}><Icon name="arrowL" size={14}/> Back to search</a>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32 }}>
        <div className="stack gap-5">
          <div className="card pad-7 stack gap-4">
            <div className="row gap-4" style={{ alignItems:"flex-start" }}>
              <div style={{ width:64, height:64, borderRadius:14, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:18, border:"1px solid var(--line)" }}>{job.logo}</div>
              <div className="grow stack gap-2">
                <div className="row gap-2">
                  {job.featured ? <span className="badge accent">★ Featured</span> : null}
                  <span className="badge">{job.type}</span>
                  <span className="badge">{job.remote}</span>
                  <span className="badge">{job.category}</span>
                </div>
                <h1 className="h2" style={{ margin:0 }}>{job.title}</h1>
                <div className="row gap-3 small">
                  <span>{job.company}</span>
                  <span>·</span>
                  <span className="row gap-2"><Icon name="pin" size={13}/>{job.location}</span>
                  <span>·</span>
                  <span>{job.posted}</span>
                </div>
              </div>
              <button className="nav-link" onClick={() => setSaved(s=>!s)} style={{ padding:8 }} title="Save"><Icon name={saved?"heart":"bookmark"}/></button>
            </div>
            <div className="hr"/>
            <div className="row gap-6" style={{ flexWrap:"wrap" }}>
              <KV label="Salary" value={job.salary}/>
              <KV label="Hours" value={job.type}/>
              <KV label="Location" value={job.location}/>
              <KV label="Start" value="Immediate"/>
            </div>
          </div>

          <div className="card pad-7 stack gap-4">
            <h3 className="h3" style={{ margin:0 }}>About the role</h3>
            <p style={{ margin:0, whiteSpace:"pre-wrap", color:"var(--ink-2)", lineHeight:1.6 }}>{job.description}</p>
            <h4 className="h4" style={{ margin:"8px 0 0" }}>What you'll do</h4>
            <ul style={{ margin:0, paddingLeft:18, color:"var(--ink-2)", lineHeight:1.7 }}>
              {job.responsibilities.map(r => <li key={r}>{r}</li>)}
            </ul>
            <h4 className="h4" style={{ margin:"8px 0 0" }}>Skills</h4>
            <div className="tags">{job.skills.map(s => <span key={s} className="badge">{s}</span>)}</div>
            <h4 className="h4" style={{ margin:"8px 0 0" }}>Benefits</h4>
            <div className="tags">{job.benefits.map(b => <span key={b} className="badge outline">✓ {b}</span>)}</div>
          </div>

          <div className="card pad-6 stack gap-3" style={{ background:"var(--bg-soft)", border:0 }}>
            <div className="row gap-2"><Icon name="shield" size={14}/><b style={{ fontSize:13 }}>Verified employer</b></div>
            <div className="small">{job.company} has been on Orca Jobs since 2023, with 17 successful hires. Manually reviewed by our Newport team.</div>
          </div>
        </div>

        <aside className="stack gap-3" style={{ position:"sticky", top:80, alignSelf:"flex-start" }}>
          <div className="card pad-6 stack gap-3">
            <Button variant="primary" block onClick={() => go("apply", { id: job.id })}>Apply now</Button>
            <Button variant="ghost" block onClick={() => setSaved(s=>!s)} icon={saved?"heart":"bookmark"}>{saved?"Saved":"Save for later"}</Button>
            <div className="hr"/>
            <div className="small">37 people have applied. Apply soon.</div>
          </div>
          <div className="card pad-6 stack gap-3">
            <h4 className="h4" style={{ margin:0 }}>Similar roles</h4>
            {JOBS.filter(j => j.id !== job.id).slice(0,3).map(j => (
              <a key={j.id} onClick={() => go("job-detail", { id:j.id })} className="stack" style={{ gap:2, cursor:"pointer", padding:"6px 0", borderTop:"1px solid var(--line)" }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{j.title}</div>
                <div className="small">{j.company} · {j.location}</div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="stack" style={{ gap:2 }}>
      <div className="micro">{label}</div>
      <div style={{ fontWeight:600, fontSize:14 }}>{value}</div>
    </div>
  );
}

// ── Employers landing / pricing ──────────────────────────────────────
function EmployersScreen({ go }) {
  const [billing, setBilling] = pUseState("once");
  return (
    <div className="screen wrap" style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="stack gap-4" style={{ textAlign:"center", maxWidth:680, margin:"0 auto 40px" }}>
        <span className="micro" style={{ textAlign:"center" }}>For employers</span>
        <h1 className="h1" style={{ margin:0 }}>Hire your <span style={{ fontStyle:"italic", color:"var(--accent)" }}>next</span> islander.</h1>
        <p className="lede">Reach 11,000+ active job seekers across the Isle of Wight. Pay per ad — no contracts, no hidden fees.</p>
      </div>

      <div className="row" style={{ justifyContent:"center", marginBottom:24 }}>
        <div className="row" style={{ background:"var(--bg-soft)", borderRadius:99, padding:4 }}>
          {[["once","One-off ads"],["bundle","Bundles (save 20%)"]].map(([id, l]) => (
            <button key={id} onClick={()=>setBilling(id)} style={{ padding:"8px 16px", borderRadius:99, border:0, background: billing===id?"var(--card)":"transparent", color: billing===id?"var(--ink)":"var(--muted)", fontSize:13, fontWeight:600, cursor:"pointer" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {PRICING.map(p => (
          <div key={p.id} className={`card pad-7 stack gap-4 ${p.best ? "elev" : ""}`} style={{ borderColor: p.best ? "var(--accent)" : "var(--line)", borderWidth: p.best ? 2 : 1, position:"relative" }}>
            {p.best ? <span className="badge accent" style={{ position:"absolute", top:-12, left:24 }}>★ Most popular</span> : null}
            <div className="stack gap-2">
              <div className="micro">{p.name}</div>
              <Money amount={billing==="bundle" ? Math.round(p.price*0.8) : p.price} big/>
              <div className="small">per ad · {p.duration}</div>
            </div>
            <p style={{ margin:0, color:"var(--ink-2)" }}>{p.blurb}</p>
            <div className="hr"/>
            <ul style={{ listStyle:"none", padding:0, margin:0 }} className="stack gap-2">
              {p.features.map(f => (
                <li key={f} className="row gap-2 small" style={{ color:"var(--ink-2)" }}><Icon name="check" size={14}/> {f}</li>
              ))}
            </ul>
            <Button variant={p.best?"primary":"ghost"} block onClick={() => go("post-job", { tier: p.id })}>{p.cta}</Button>
          </div>
        ))}
      </div>

      <div className="card pad-8 stack gap-4" style={{ marginTop:60, textAlign:"center" }}>
        <h3 className="h3" style={{ margin:0 }}>Need to hire 10+ people this season?</h3>
        <p className="lede" style={{ margin:"0 auto", maxWidth:520 }}>Talk to our team about volume bundles, recruiting events, and integration with your ATS.</p>
        <div className="row gap-2" style={{ justifyContent:"center" }}>
          <Button variant="primary">Book a call</Button>
          <Button variant="ghost">Email sales</Button>
        </div>
      </div>
    </div>
  );
}

// ── About (lightweight) ───────────────────────────────────────────────
function AboutScreen() {
  return (
    <div className="screen wrap" style={{ paddingTop:60, paddingBottom:60, maxWidth:760 }}>
      <span className="micro">About Orca Jobs</span>
      <h1 className="h1" style={{ margin:"12px 0 24px" }}>Built in Newport, for the whole island.</h1>
      <p className="lede">Orca Jobs started in 2024 when our founders — three islanders who'd just moved back — couldn't find a single job board that took the Isle of Wight seriously. Mainland sites lump us in with Hampshire. Local Facebook groups are scattered. We wanted somewhere with the polish of a national board and the focus of a parish notice-board.</p>
      <p className="lede">Today we work with 412 island employers, from the NHS Trust to one-person ferry charters. Every listing is reviewed by a real person in our Newport office before it goes live.</p>
    </div>
  );
}

Object.assign(window, { HomeScreen, SearchScreen, JobDetailScreen, EmployersScreen, AboutScreen, JobCard });
