// Employer flows: signup, post-a-job + payment, dashboard, listings, billing

const { useState: eUseState, useMemo: eUseMemo } = React;

// ── Employer signup (lightweight) ─────────────────────────────────────
function EmployerSignupScreen({ go }) {
  return (
    <div className="screen wrap" style={{ paddingTop:40, paddingBottom:60, maxWidth:760 }}>
      <a className="row gap-2 small" style={{ cursor:"pointer", marginBottom:24 }} onClick={() => go("home")}><Icon name="arrowL" size={14}/> Back</a>
      <div className="stack gap-3" style={{ marginBottom:24 }}>
        <span className="micro">Employer signup</span>
        <h1 className="h2" style={{ margin:0 }}>Create your employer account</h1>
        <p className="lede">Free to set up. You only pay when you post a job.</p>
      </div>
      <div className="card pad-7 stack gap-5">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Field label="Company name" required full><Input defaultValue={EMPLOYER.company}/></Field>
          <Field label="Your name" required><Input defaultValue={EMPLOYER.contact}/></Field>
          <Field label="Job title"><Input defaultValue="Operations Director"/></Field>
          <Field label="Work email" required><Input defaultValue={EMPLOYER.email}/></Field>
          <Field label="Phone"><Input defaultValue={EMPLOYER.phone}/></Field>
          <Field label="Company address" required full><Input defaultValue={EMPLOYER.address}/></Field>
          <Field label="Company size">
            <Select defaultValue={EMPLOYER.size}><option>1–10</option><option>11–50</option><option>50–250 employees</option><option>250+</option></Select>
          </Field>
          <Field label="Industry">
            <Select defaultValue={EMPLOYER.industry}>{CATEGORIES.map(c => <option key={c.id}>{c.name}</option>)}</Select>
          </Field>
        </div>
        <div className="hr"/>
        <label className="checkbox"><input type="checkbox" defaultChecked/> I confirm I am authorised to post jobs on behalf of this company.</label>
        <label className="checkbox"><input type="checkbox" defaultChecked/> I agree to the Employer Terms and Data Processing Addendum (UK GDPR).</label>
        <div className="row" style={{ justifyContent:"space-between" }}>
          <Button variant="ghost" onClick={() => go("home")}>Cancel</Button>
          <Button variant="primary" onClick={() => go("employer-dashboard")}>Create employer account</Button>
        </div>
      </div>
    </div>
  );
}

// ── Post a job + payment ─────────────────────────────────────────────
function PostJobScreen({ go, params, toast }) {
  const [step, setStep] = eUseState(0);
  const [tier, setTier] = eUseState(params.tier || "featured");
  const [job, setJob] = eUseState({
    title:"Sous Chef",
    location:"East Cowes",
    type:"Full-time",
    remote:"On-site",
    category:"Hospitality & Tourism",
    salary:"£32,000 – £36,000",
    description:"We're looking for a sous chef to join our brigade at the shipyard canteen. 60 covers a service, focus on seasonal British produce.",
  });
  const steps = ["Details", "Pricing", "Payment", "Review"];

  const selected = PRICING.find(p => p.id === tier);

  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60, maxWidth:1080 }}>
      <a className="row gap-2 small" style={{ cursor:"pointer", marginBottom:16 }} onClick={() => go("employer-dashboard")}><Icon name="arrowL" size={14}/> Back to dashboard</a>

      <div className="row gap-3" style={{ marginBottom:24 }}>
        {steps.map((s, i) => (
          <div key={s} className="row gap-2 grow" style={{ alignItems:"center" }}>
            <div style={{ width:22, height:22, borderRadius:99, background: i<=step ? "var(--accent)" : "var(--bg-soft)", color: i<=step ? "var(--accent-ink)" : "var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:11 }}>{i<step?"✓":i+1}</div>
            <div style={{ fontSize:12, fontWeight: i===step?600:400, color: i===step?"var(--ink)":"var(--muted)" }}>{s}</div>
            {i < steps.length-1 ? <div className="grow" style={{ height:1, background: i<step?"var(--accent)":"var(--line)" }}/> : null}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: step===1 ? "1fr" : "1fr 320px", gap:24 }}>
        <div className="card pad-7 stack gap-5">
          {step === 0 ? (
            <div className="stack gap-4">
              <h2 className="h3" style={{ margin:0 }}>Job details</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Field label="Job title" required full><Input value={job.title} onChange={e=>setJob({...job, title:e.target.value})}/></Field>
                <Field label="Location" required>
                  <Select value={job.location} onChange={e=>setJob({...job, location:e.target.value})}>
                    {TOWNS.map(t => <option key={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Job type">
                  <Select value={job.type} onChange={e=>setJob({...job, type:e.target.value})}><option>Full-time</option><option>Part-time</option><option>Seasonal</option><option>Contract</option></Select>
                </Field>
                <Field label="Working pattern">
                  <Select value={job.remote} onChange={e=>setJob({...job, remote:e.target.value})}><option>On-site</option><option>Hybrid</option><option>Remote</option></Select>
                </Field>
                <Field label="Category">
                  <Select value={job.category} onChange={e=>setJob({...job, category:e.target.value})}>{CATEGORIES.map(c=><option key={c.id}>{c.name}</option>)}</Select>
                </Field>
                <Field label="Salary" full hint="Including range helps you get 2× more applicants"><Input value={job.salary} onChange={e=>setJob({...job, salary:e.target.value})}/></Field>
                <Field label="Description" required full hint="Markdown supported"><Textarea value={job.description} onChange={e=>setJob({...job, description:e.target.value})} style={{ minHeight:160 }}/></Field>
              </div>
              <div className="hr"/>
              <Field label="Skills (press enter to add)">
                <div className="row gap-2" style={{ flexWrap:"wrap" }}>
                  {["Knife skills","Service","Brigade leadership"].map(s => <span key={s} className="badge outline">{s} <Icon name="close" size={11}/></span>)}
                  <input className="input sm" placeholder="Add skill..." style={{ width:160 }}/>
                </div>
              </Field>
              <Field label="Screening questions" hint="Filter applicants automatically">
                <div className="stack gap-2">
                  {["Do you have at least 2 years professional kitchen experience?","Are you legally able to work in the UK?"].map((q,i) => (
                    <div key={i} className="row gap-2" style={{ background:"var(--bg-soft)", padding:"10px 12px", borderRadius:8 }}>
                      <span className="small" style={{ flex:1 }}>{q}</span>
                      <span className="badge">Yes/No</span>
                      <button className="nav-link" style={{ padding:6 }}><Icon name="close" size={14}/></button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" icon="plus">Add question</Button>
                </div>
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="stack gap-5">
              <h2 className="h3" style={{ margin:0 }}>Choose your listing tier</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {PRICING.map(p => (
                  <button key={p.id} onClick={() => setTier(p.id)} className="card pad-6 stack gap-3" style={{
                    textAlign:"left", border: tier===p.id?"2px solid var(--accent)":"1px solid var(--line)", background:"var(--card)", cursor:"pointer", position:"relative"
                  }}>
                    {p.best ? <span className="badge accent" style={{ position:"absolute", top:-12, left:24 }}>Most popular</span> : null}
                    <div className="row" style={{ justifyContent:"space-between" }}>
                      <span className="micro">{p.name}</span>
                      <div style={{ width:18, height:18, borderRadius:99, border:"2px solid var(--line-2)", background: tier===p.id?"var(--accent)":"transparent" }}/>
                    </div>
                    <Money amount={p.price} big/>
                    <div className="small">per ad · {p.duration}</div>
                    <div className="hr"/>
                    <ul style={{ listStyle:"none", padding:0, margin:0 }} className="stack gap-2">
                      {p.features.slice(0,4).map(f => <li key={f} className="row gap-2 small"><Icon name="check" size={13}/> {f}</li>)}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="card pad-5 row gap-3" style={{ background:"var(--bg-soft)", border:0, alignItems:"center" }}>
                <Icon name="sparkle" size={18}/>
                <div className="grow stack" style={{ gap:2 }}>
                  <b style={{ fontSize:13 }}>Add-ons</b>
                  <div className="small">CV screening (£15) · LinkedIn cross-post (£10) · Boost on day 14 (£20)</div>
                </div>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="stack gap-5">
              <h2 className="h3" style={{ margin:0 }}>Payment</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Field label="Cardholder name" required full><Input defaultValue="Daniel Marsh"/></Field>
                <Field label="Card number" required full>
                  <div className="input row gap-2" style={{ alignItems:"center" }}>
                    <input style={{ border:0, padding:0, background:"transparent", flex:1, font:"inherit" }} defaultValue="4242 4242 4242 4242"/>
                    <span className="badge">VISA</span>
                  </div>
                </Field>
                <Field label="Expiry"><Input defaultValue="08/29"/></Field>
                <Field label="CVC"><Input defaultValue="•••"/></Field>
                <Field label="Billing postcode" full><Input defaultValue="PO32 6RA"/></Field>
              </div>
              <div className="hr"/>
              <Field label="VAT number (optional)"><Input placeholder="GB123456789"/></Field>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Save this card for future ads</label>

              <div className="card pad-4 row gap-3" style={{ background:"var(--bg-soft)", border:0, alignItems:"center" }}>
                <Icon name="shield" size={18}/>
                <div className="small">Payment processed securely by Stripe. Orca never stores your full card number.</div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="stack gap-5">
              <h2 className="h3" style={{ margin:0 }}>Review &amp; publish</h2>
              <p className="small">This is exactly how your listing will appear in search.</p>
              <div className="card pad-6 stack gap-3" style={{ borderColor: tier==="featured"||tier==="premium" ? "var(--accent)" : "var(--line)" }}>
                <div className="row gap-3" style={{ alignItems:"flex-start" }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, border:"1px solid var(--line)" }}>WS</div>
                  <div className="grow stack" style={{ gap:2 }}>
                    <div className="row gap-2">
                      {tier==="featured"||tier==="premium" ? <span className="badge accent">★ Featured</span> : null}
                      {tier==="premium" ? <span className="badge outline">Premium</span> : null}
                      <span className="badge">{job.type}</span>
                    </div>
                    <div className="h4">{job.title}</div>
                    <div className="small">{EMPLOYER.company} · {job.location} · {job.salary}</div>
                  </div>
                </div>
                <p style={{ margin:0, color:"var(--ink-2)", fontSize:14 }}>{job.description}</p>
              </div>
            </div>
          ) : null}

          <div className="row" style={{ justifyContent:"space-between", marginTop:8 }}>
            <Button variant="ghost" onClick={() => step > 0 ? setStep(step-1) : go("employer-dashboard")}>{step>0?"Back":"Cancel"}</Button>
            <Button variant="primary" onClick={() => {
              if (step < steps.length-1) setStep(step+1);
              else { toast(`Job posted — ${selected.name} listing live`); go("employer-dashboard"); }
            }}>{step < steps.length-1 ? "Continue" : `Pay £${selected.price} & publish`}</Button>
          </div>
        </div>

        {step !== 1 ? (
          <aside className="stack gap-3" style={{ position:"sticky", top:80, alignSelf:"flex-start" }}>
            <div className="card pad-6 stack gap-3">
              <div className="micro">Order summary</div>
              <div className="sum-row"><span>{selected.name} listing</span><span>£{selected.price}</span></div>
              <div className="sum-row"><span>{selected.duration}</span><span></span></div>
              <div className="sum-row"><span>VAT (20%)</span><span>£{(selected.price*0.2).toFixed(2)}</span></div>
              <div className="sum-row total"><span>Total</span><span>£{(selected.price*1.2).toFixed(2)}</span></div>
              <div className="hr"/>
              <ul style={{ listStyle:"none", padding:0, margin:0 }} className="stack gap-2">
                {selected.features.slice(0,4).map(f => <li key={f} className="row gap-2 small" style={{ color:"var(--ink-2)" }}><Icon name="check" size={13}/> {f}</li>)}
              </ul>
            </div>
            <div className="card pad-5 stack gap-2" style={{ background:"var(--bg-soft)", border:0 }}>
              <b style={{ fontSize:13 }}>Need it gone fast?</b>
              <div className="small">Premium listings hit homepage rotation in under 60 minutes.</div>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

// ── Employer dashboard ────────────────────────────────────────────────
function EmployerDashboardScreen({ go }) {
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:24 }}>
        <div className="stack gap-2">
          <span className="micro">Employer · {EMPLOYER.company}</span>
          <h1 className="h2" style={{ margin:0 }}>Welcome back, {EMPLOYER.contact.split(" ")[0]}.</h1>
        </div>
        <div className="row gap-2">
          <Button variant="ghost" icon="download">Export applicants</Button>
          <Button variant="primary" icon="plus" onClick={() => go("post-job")}>Post a job</Button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <Stat label="Live listings" value="3" delta="2 featured"/>
        <Stat label="Applicants (30d)" value="62" delta="↑ 14% vs last month"/>
        <Stat label="Profile views" value="1,248" delta="from 4 listings"/>
        <Stat label="Spend (this month)" value="£297" delta="3 listings · 1 add-on"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:24 }}>
        <div className="stack gap-5">
          <div className="card pad-6 stack gap-4">
            <div className="row" style={{ justifyContent:"space-between" }}>
              <h3 className="h4" style={{ margin:0 }}>Active listings</h3>
              <a className="small" style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer" }} onClick={() => go("employer-jobs")}>Manage all →</a>
            </div>
            <div className="stack" style={{ gap:0 }}>
              {[
                { title:"Marine Engineer", tier:"Premium", views:642, apps:18, days:6, status:"live" },
                { title:"Welder (apprentice)", tier:"Featured", views:281, apps:12, days:11, status:"live" },
                { title:"Procurement Lead", tier:"Basic", views:148, apps:7, days:22, status:"live" }
              ].map(l => (
                <div key={l.title} className="row gap-4" style={{ padding:"14px 0", borderTop:"1px solid var(--line)", alignItems:"center" }}>
                  <div className="grow stack" style={{ gap:2 }}>
                    <div className="row gap-2">
                      <b>{l.title}</b>
                      <span className={`badge ${l.tier==="Premium"||l.tier==="Featured"?"accent":""}`}>{l.tier}</span>
                    </div>
                    <div className="small">{l.days} days remaining</div>
                  </div>
                  <div className="row gap-5 small">
                    <span className="row gap-2"><Icon name="eye" size={13}/>{l.views.toLocaleString()}</span>
                    <span className="row gap-2"><Icon name="user" size={13}/>{l.apps}</span>
                  </div>
                  <Button variant="ghost" size="sm">View applicants</Button>
                  <button className="nav-link" style={{ padding:6 }}><Icon name="gear" size={14}/></button>
                </div>
              ))}
            </div>
          </div>

          <div className="card pad-6 stack gap-4">
            <div className="row" style={{ justifyContent:"space-between" }}>
              <h3 className="h4" style={{ margin:0 }}>Recent applicants — Marine Engineer</h3>
              <a className="small" style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer" }}>See all 18</a>
            </div>
            <div className="stack" style={{ gap:0 }}>
              {APPLICATIONS.filter(a => a.job==="Marine Engineer").map(a => (
                <div key={a.id} className="row gap-4" style={{ padding:"12px 0", borderTop:"1px solid var(--line)", alignItems:"center" }}>
                  <div className="avatar">{a.applicant.split(" ").map(n=>n[0]).join("")}</div>
                  <div className="grow stack" style={{ gap:2 }}>
                    <b>{a.applicant}</b>
                    <div className="small">Applied {a.applied}</div>
                  </div>
                  <div className="stack" style={{ gap:2, width:80 }}>
                    <div className="row" style={{ justifyContent:"space-between" }}><span className="small">Match</span><span className="small" style={{ fontWeight:600 }}>{a.match}%</span></div>
                    <div className="progress"><div style={{ transform:`scaleX(${a.match/100})` }}/></div>
                  </div>
                  <span className={`badge ${a.stage==="Shortlisted"?"good":a.stage==="Rejected"?"bad":a.stage==="Interview"?"accent":""}`}>{a.stage}</span>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack gap-3">
          <div className="card pad-5 stack gap-3">
            <h4 className="h4" style={{ margin:0 }}>Hiring funnel</h4>
            {[
              ["Viewed",     1248, 100],
              ["Started apply", 184, 15],
              ["Submitted",   62, 5],
              ["Shortlisted", 14, 1.1],
              ["Interview",   6, 0.5],
              ["Hired",       1, 0.08],
            ].map(([l, n, pct]) => (
              <div key={l} className="stack gap-2">
                <div className="row" style={{ justifyContent:"space-between" }}>
                  <span className="small">{l}</span>
                  <span className="small mono">{n.toLocaleString()}</span>
                </div>
                <div className="progress"><div style={{ transform:`scaleX(${Math.max(0.04, pct/100)})` }}/></div>
              </div>
            ))}
          </div>

          <div className="card pad-5 stack gap-3" style={{ background:"var(--bg-soft)", border:0 }}>
            <b style={{ fontSize:13 }}>Quick actions</b>
            <Button variant="ghost" block icon="plus" onClick={() => go("post-job")}>Post a new job</Button>
            <Button variant="ghost" block icon="sparkle">Boost a listing</Button>
            <Button variant="ghost" block icon="download">Download candidates CSV</Button>
          </div>

          <div className="card pad-5 stack gap-3">
            <h4 className="h4" style={{ margin:0 }}>Account health</h4>
            <div className="row gap-2"><span className="badge good">✓ Verified employer</span></div>
            <div className="row gap-2"><span className="badge">DPA signed</span></div>
            <div className="small">Renewed billing card on file (·· 4242)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Employer listings (manage all) ────────────────────────────────────
function EmployerJobsScreen({ go }) {
  const rows = [
    { title:"Marine Engineer",       tier:"Premium",  status:"Live",      apps:18, posted:"6 days ago",  expires:"24 days"},
    { title:"Welder (apprentice)",   tier:"Featured", status:"Live",      apps:12, posted:"11 days ago", expires:"19 days"},
    { title:"Procurement Lead",      tier:"Basic",    status:"Live",      apps:7,  posted:"22 days ago", expires:"8 days"},
    { title:"Yard Foreman",           tier:"Featured",  status:"Closed",  apps:34, posted:"2 months ago", expires:"—"},
    { title:"Trainee Naval Architect",tier:"Premium",  status:"Draft",    apps:0,  posted:"—",            expires:"—"},
  ];
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:20 }}>
        <h1 className="h2" style={{ margin:0 }}>Listings</h1>
        <Button variant="primary" icon="plus" onClick={() => go("post-job")}>Post a job</Button>
      </div>
      <div className="card pad-4 row gap-3" style={{ marginBottom:16 }}>
        <input className="input sm grow" placeholder="Search your listings"/>
        <Select><option>All status</option><option>Live</option><option>Closed</option><option>Draft</option></Select>
        <Select><option>Any tier</option><option>Basic</option><option>Featured</option><option>Premium</option></Select>
      </div>
      <div className="card pad-4">
        <table className="tbl">
          <thead><tr><th>Title</th><th>Tier</th><th>Status</th><th>Applicants</th><th>Posted</th><th>Expires in</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.title}>
                <td><b>{r.title}</b></td>
                <td><span className={`badge ${r.tier==="Premium"||r.tier==="Featured"?"accent":""}`}>{r.tier}</span></td>
                <td><span className={`pill-status ${r.status==="Live"?"good":r.status==="Draft"?"warn":""}`} style={{ background: r.status==="Live"?"color-mix(in srgb, var(--good) 16%, transparent)":r.status==="Draft"?"color-mix(in srgb, var(--warn) 16%, transparent)":"var(--bg-soft)", color: r.status==="Live"?"var(--good)":r.status==="Draft"?"var(--warn)":"var(--muted)" }}>● {r.status}</span></td>
                <td>{r.apps}</td>
                <td className="small">{r.posted}</td>
                <td className="small">{r.expires}</td>
                <td><Button variant="ghost" size="sm">Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Employer billing ──────────────────────────────────────────────────
function EmployerBillingScreen() {
  const invoices = [
    { id:"INV-2026-082", date:"4 May 2026",   item:"Premium listing — Marine Engineer", amount:"£214.80" },
    { id:"INV-2026-079", date:"28 Apr 2026",  item:"Featured listing — Welder",          amount:"£118.80" },
    { id:"INV-2026-074", date:"19 Apr 2026",  item:"Basic listing — Procurement Lead",   amount:"£58.80"  },
    { id:"INV-2026-061", date:"3 Mar 2026",   item:"Premium listing — Yard Foreman",     amount:"£214.80" },
  ];
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <h1 className="h2" style={{ margin:"0 0 24px" }}>Billing</h1>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
        <Stat label="Spend (this month)" value="£297" delta="3 listings"/>
        <Stat label="Avg. cost per applicant" value="£4.79" delta="↓ from £6.20 last month"/>
        <Stat label="Lifetime spend" value="£3,421" delta="across 27 listings"/>
      </div>
      <div className="card pad-6">
        <div className="row" style={{ justifyContent:"space-between", marginBottom:12 }}>
          <h3 className="h4" style={{ margin:0 }}>Invoices</h3>
          <Button variant="ghost" size="sm" icon="download">Download all (CSV)</Button>
        </div>
        <table className="tbl">
          <thead><tr><th>Invoice</th><th>Date</th><th>Item</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i.id}>
                <td className="mono">{i.id}</td>
                <td>{i.date}</td>
                <td>{i.item}</td>
                <td><b>{i.amount}</b></td>
                <td><Button variant="ghost" size="sm" icon="download">PDF</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card pad-6 stack gap-4" style={{ marginTop:20 }}>
        <h3 className="h4" style={{ margin:0 }}>Payment method</h3>
        <div className="row gap-3" style={{ alignItems:"center" }}>
          <div style={{ width:48, height:32, background:"var(--ink)", color:"var(--bg)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-mono)", fontSize:11, fontWeight:700 }}>VISA</div>
          <div className="grow stack" style={{ gap:2 }}>
            <b style={{ fontSize:14 }}>Visa ending in 4242</b>
            <div className="small">Expires 08/29 · Default for invoices</div>
          </div>
          <Button variant="ghost" size="sm">Update</Button>
          <Button variant="ghost" size="sm" icon="plus">Add card</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EmployerSignupScreen, PostJobScreen, EmployerDashboardScreen, EmployerJobsScreen, EmployerBillingScreen });
