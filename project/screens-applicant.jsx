// Applicant flows: signup, dashboard, profile, application submit, privacy center

const { useState: aUseState, useMemo: aUseMemo } = React;

// ── Signup wizard ─────────────────────────────────────────────────────
function ApplicantSignupScreen({ go }) {
  const [step, setStep] = aUseState(0);
  const steps = ["Account", "Profile", "Preferences", "Privacy"];
  return (
    <div className="screen wrap" style={{ paddingTop:40, paddingBottom:60, maxWidth:880 }}>
      <a className="row gap-2 small" style={{ cursor:"pointer", marginBottom:24 }} onClick={() => go("home")}><Icon name="arrowL" size={14}/> Back to home</a>
      <div className="row gap-3" style={{ marginBottom:32 }}>
        {steps.map((s, i) => (
          <div key={s} className="row gap-2 grow" style={{ alignItems:"center" }}>
            <div style={{ width:24, height:24, borderRadius:99, background: i<=step ? "var(--accent)" : "var(--bg-soft)", color: i<=step ? "var(--accent-ink)" : "var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:12 }}>{i<step ? "✓" : i+1}</div>
            <div style={{ fontSize:13, fontWeight: i===step?600:400, color: i===step?"var(--ink)":"var(--muted)" }}>{s}</div>
            {i < steps.length-1 ? <div className="grow" style={{ height:1, background: i<step?"var(--accent)":"var(--line)" }}/> : null}
          </div>
        ))}
      </div>

      <div className="card pad-8 stack gap-5">
        {step === 0 ? <SignupAccount/> : null}
        {step === 1 ? <SignupProfile/> : null}
        {step === 2 ? <SignupPreferences/> : null}
        {step === 3 ? <SignupPrivacy/> : null}
        <div className="row" style={{ justifyContent:"space-between", marginTop:8 }}>
          <Button variant="ghost" onClick={() => step > 0 ? setStep(step-1) : go("home")}>{step>0?"Back":"Cancel"}</Button>
          <Button variant="primary" onClick={() => step < steps.length-1 ? setStep(step+1) : go("applicant-dashboard")}>
            {step < steps.length-1 ? "Continue" : "Create profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SignupAccount() {
  return (
    <div className="stack gap-5">
      <div className="stack gap-2">
        <h2 className="h3" style={{ margin:0 }}>Create your account</h2>
        <p className="small">Takes about 4 minutes. You can apply for jobs as soon as you're done.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="First name" required><Input defaultValue="Imogen"/></Field>
        <Field label="Last name" required><Input defaultValue="Hartley"/></Field>
        <Field label="Email" required hint="We'll never share this" full><Input type="email" defaultValue="imogen.hartley@example.com"/></Field>
        <Field label="Password" required><Input type="password" defaultValue="••••••••"/></Field>
        <Field label="Confirm password" required><Input type="password" defaultValue="••••••••"/></Field>
      </div>
      <div className="hr"/>
      <div className="row gap-3">
        <Button variant="ghost" block icon="user">Continue with Google</Button>
        <Button variant="ghost" block icon="user">Continue with Apple</Button>
      </div>
    </div>
  );
}

function SignupProfile() {
  return (
    <div className="stack gap-5">
      <div className="stack gap-2">
        <h2 className="h3" style={{ margin:0 }}>Tell employers about you</h2>
        <p className="small">You can edit any of this later from your profile.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="Mobile phone"><Input type="tel" defaultValue="+44 7700 900812"/></Field>
        <Field label="Postcode" required hint="For commute-distance matching"><Input defaultValue="PO33 2DA"/></Field>
        <Field label="Headline" full hint="One line that sells you"><Input defaultValue="Hospitality manager — 6 yrs front-of-house"/></Field>
        <Field label="Right to work in the UK" required>
          <Select defaultValue="UK Citizen">
            <option>UK Citizen</option>
            <option>Settled / pre-settled status</option>
            <option>Skilled Worker visa</option>
            <option>Need sponsorship</option>
            <option>Other</option>
          </Select>
        </Field>
        <Field label="Availability">
          <Select defaultValue="2 weeks notice">
            <option>Immediately</option>
            <option>2 weeks notice</option>
            <option>1 month notice</option>
            <option>3+ months notice</option>
          </Select>
        </Field>
        <Field label="Upload your CV" full hint="PDF or DOCX, max 8MB. We'll parse work history automatically.">
          <div style={{ border:"1.5px dashed var(--line-2)", borderRadius:12, padding:24, textAlign:"center", background:"var(--bg-soft)" }}>
            <div style={{ marginBottom:8 }}><Icon name="upload" size={22}/></div>
            <div style={{ fontWeight:600, fontSize:14 }}>Drop your CV here</div>
            <div className="small">or <a style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer" }}>browse files</a></div>
          </div>
        </Field>
      </div>
    </div>
  );
}

function SignupPreferences() {
  return (
    <div className="stack gap-5">
      <div className="stack gap-2">
        <h2 className="h3" style={{ margin:0 }}>What are you looking for?</h2>
        <p className="small">We'll surface matching roles first.</p>
      </div>
      <Field label="Sectors of interest" hint="Pick up to 3">
        <div className="tags">
          {CATEGORIES.map(c => (
            <label key={c.id} className="badge outline" style={{ cursor:"pointer", padding:"8px 12px", fontSize:13 }}>
              <input type="checkbox" defaultChecked={c.id==="hosp"} style={{ marginRight:6, accentColor:"var(--accent)" }}/>
              {c.icon} {c.name}
            </label>
          ))}
        </div>
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="Work pattern">
          <div className="row gap-2" style={{ flexWrap:"wrap" }}>
            {["Full-time","Part-time","Hybrid","Remote","Seasonal"].map(t => <label key={t} className="badge outline" style={{ padding:"6px 12px" }}><input type="checkbox" defaultChecked={t==="Full-time"||t==="Hybrid"} style={{ marginRight:6, accentColor:"var(--accent)" }}/>{t}</label>)}
          </div>
        </Field>
        <Field label="Expected salary (annual)"><Input defaultValue="£32,000"/></Field>
        <Field label="Willing to commute to" full>
          <div className="row gap-2" style={{ flexWrap:"wrap" }}>
            {TOWNS.slice(0,7).map(t => <label key={t} className="badge outline" style={{ padding:"6px 12px" }}><input type="checkbox" defaultChecked={["Ryde","Newport","Cowes"].includes(t)} style={{ marginRight:6, accentColor:"var(--accent)" }}/>{t}</label>)}
          </div>
        </Field>
      </div>
    </div>
  );
}

function SignupPrivacy() {
  return (
    <div className="stack gap-5">
      <div className="stack gap-2">
        <h2 className="h3" style={{ margin:0 }}>Your data, your control</h2>
        <p className="small">Required by UK GDPR. You can change any of this anytime from <b>Privacy Center</b>.</p>
      </div>

      <div className="card pad-5 stack gap-4" style={{ background:"var(--bg-soft)", border:0 }}>
        <div className="row gap-3">
          <div style={{ width:36, height:36, borderRadius:10, background:"var(--accent-soft)", color:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="shield"/>
          </div>
          <div className="grow stack" style={{ gap:2 }}>
            <b style={{ fontSize:14 }}>What we store about you</b>
            <div className="small">Profile, applications, search activity. We never sell your data. Read our full <a style={{ color:"var(--accent)", fontWeight:600 }}>privacy notice (4 min)</a>.</div>
          </div>
        </div>
      </div>

      <ConsentRow title="Profile visible to verified employers" desc="Employers can find you in our talent pool. Turn off to be invisible — you can still apply." checked onChange={()=>{}}/>
      <div className="hr"/>
      <ConsentRow title="Job alerts by email" desc="Daily digest of new roles matching your filters." checked onChange={()=>{}}/>
      <div className="hr"/>
      <ConsentRow title="Marketing from Orca Jobs" desc="Career tips, island employer features. Once a week, max." onChange={()=>{}}/>
      <div className="hr"/>
      <ConsentRow title="Anonymous analytics" desc="Helps us know which features actually help job seekers." checked onChange={()=>{}}/>

      <div className="hr"/>
      <label className="checkbox"><input type="checkbox"/> I've read and agree to the <a style={{ color:"var(--accent)", fontWeight:600 }}>Terms of service</a> and <a style={{ color:"var(--accent)", fontWeight:600 }}>Privacy notice</a>.</label>
      <p className="small" style={{ color:"var(--muted)" }}>Lawful basis: contract performance (Art. 6(1)(b) UK GDPR) for your account; consent (Art. 6(1)(a)) for marketing &amp; analytics. You have the right to access, rectify, port, restrict, and erase your data.</p>
    </div>
  );
}

// ── Applicant dashboard ───────────────────────────────────────────────
function ApplicantDashboardScreen({ go }) {
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="row" style={{ justifyContent:"space-between", marginBottom:24 }}>
        <div className="stack gap-2">
          <h1 className="h2" style={{ margin:0 }}>Hi {APPLICANT.firstName} 👋</h1>
          <p className="small">Your profile is 82% complete. <a style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer" }} onClick={()=>go("applicant-profile")}>Finish to boost matches →</a></p>
        </div>
        <Button variant="primary" onClick={() => go("search")} icon="search">Find new roles</Button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <Stat label="Active applications" value="4" delta="2 in review"/>
        <Stat label="Profile views" value="38" delta="↑ 12 this week"/>
        <Stat label="Saved jobs" value="11" delta="3 new matches"/>
        <Stat label="Match score" value="92%" delta="for hospitality roles"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:24 }}>
        <div className="stack gap-5">
          <div className="card pad-6 stack gap-4">
            <div className="row" style={{ justifyContent:"space-between" }}>
              <h3 className="h4" style={{ margin:0 }}>Your applications</h3>
              <a className="small" style={{ cursor:"pointer", color:"var(--ink-2)" }}>View all</a>
            </div>
            <table className="tbl">
              <thead><tr><th>Role</th><th>Status</th><th>Applied</th><th></th></tr></thead>
              <tbody>
                {[
                  { role:"Front-of-House Manager", company:"The Hut", status:"Shortlisted", color:"good", date:"3 days ago" },
                  { role:"Marine Engineer", company:"Wight Shipyard", status:"Submitted", color:"", date:"5 days ago" },
                  { role:"Café Supervisor", company:"Quay Arts", status:"Interview Tue 14:00", color:"accent", date:"1 week ago" },
                  { role:"Events Coordinator", company:"Osborne House", status:"Withdrawn", color:"outline", date:"2 weeks ago" },
                ].map((r,i) => (
                  <tr key={i}>
                    <td><div style={{ fontWeight:600 }}>{r.role}</div><div className="small">{r.company}</div></td>
                    <td><span className={`badge ${r.color}`}>{r.status}</span></td>
                    <td><span className="small">{r.date}</span></td>
                    <td><a className="small" style={{ cursor:"pointer", color:"var(--accent)", fontWeight:600 }}>View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card pad-6 stack gap-4">
            <h3 className="h4" style={{ margin:0 }}>Recommended for you</h3>
            <div className="stack gap-3">
              {JOBS.slice(0,3).map(j => <JobCard key={j.id} job={j} go={go}/>)}
            </div>
          </div>
        </div>

        <div className="stack gap-3">
          <div className="card pad-5 stack gap-3">
            <div className="row gap-3">
              <div className="avatar" style={{ width:56, height:56, fontSize:18 }}>IH</div>
              <div className="grow stack" style={{ gap:2 }}>
                <b>{APPLICANT.firstName} {APPLICANT.lastName}</b>
                <div className="small">{APPLICANT.location}</div>
              </div>
            </div>
            <div className="stack gap-2">
              <div className="row" style={{ justifyContent:"space-between" }}>
                <span className="small">Profile completeness</span>
                <span className="small" style={{ fontWeight:600 }}>82%</span>
              </div>
              <div className="progress"><div style={{ transform:"scaleX(.82)" }}/></div>
            </div>
            <Button variant="ghost" block onClick={() => go("applicant-profile")} icon="edit">Edit profile</Button>
          </div>

          <div className="card pad-5 stack gap-3" style={{ background:"var(--bg-soft)", border:0 }}>
            <div className="row gap-2"><Icon name="bell" size={14}/><b style={{ fontSize:13 }}>Job alerts (2 active)</b></div>
            <div className="small">Hospitality + Ryde · daily<br/>Marine + East Cowes · weekly</div>
            <Button size="sm" variant="ghost" block>Manage alerts</Button>
          </div>

          <div className="card pad-5 stack gap-3">
            <div className="row gap-2"><Icon name="shield" size={14}/><b style={{ fontSize:13 }}>Privacy</b></div>
            <div className="small">Your profile is currently <b>visible to verified employers</b>.</div>
            <Button size="sm" variant="ghost" block onClick={() => go("privacy")}>Manage data &amp; privacy</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Applicant profile (editor) ────────────────────────────────────────
function ApplicantProfileScreen({ go }) {
  const [tab, setTab] = aUseState("about");
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="card pad-7 stack gap-5" style={{ marginBottom:20 }}>
        <div className="row gap-5" style={{ alignItems:"flex-start" }}>
          <div className="avatar" style={{ width:88, height:88, fontSize:30, fontFamily:"var(--font-display)" }}>IH</div>
          <div className="grow stack gap-2">
            <h1 className="h2" style={{ margin:0 }}>{APPLICANT.firstName} {APPLICANT.lastName}</h1>
            <div className="lede" style={{ fontSize:16 }}>{APPLICANT.headline}</div>
            <div className="row gap-3 small" style={{ flexWrap:"wrap" }}>
              <span className="row gap-2"><Icon name="pin" size={13}/>{APPLICANT.location}</span>
              <span className="row gap-2"><Icon name="briefcase" size={13}/>{APPLICANT.availability}</span>
              <span className="row gap-2"><Icon name="shield" size={13}/>{APPLICANT.rightToWork}</span>
            </div>
          </div>
          <div className="stack gap-2">
            <Button variant="primary" icon="eye">Preview as employer</Button>
            <Button variant="ghost" icon="download">Export data</Button>
          </div>
        </div>
      </div>

      <div className="row gap-2" style={{ marginBottom:16, borderBottom:"1px solid var(--line)" }}>
        {[["about","About"],["history","Work history"],["skills","Skills"],["cv","CV & video"],["prefs","Preferences"]].map(([id, l]) => (
          <button key={id} onClick={() => setTab(id)} className="nav-link" style={{ borderRadius:0, borderBottom: tab===id?"2px solid var(--accent)":"2px solid transparent", padding:"10px 12px", color: tab===id?"var(--ink)":"var(--muted)", fontWeight: tab===id?600:500 }}>{l}</button>
        ))}
      </div>

      {tab === "about" ? <ProfileAbout/> : null}
      {tab === "history" ? <ProfileHistory/> : null}
      {tab === "skills" ? <ProfileSkills/> : null}
      {tab === "cv" ? <ProfileCV/> : null}
      {tab === "prefs" ? <ProfilePrefs/> : null}
    </div>
  );
}

function ProfileAbout() {
  return (
    <div className="card pad-7 stack gap-5">
      <div className="row" style={{ justifyContent:"space-between" }}>
        <h3 className="h3" style={{ margin:0 }}>About you</h3>
        <Button variant="ghost" size="sm" icon="edit">Edit</Button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="Headline" full><Input defaultValue={APPLICANT.headline}/></Field>
        <Field label="Bio" full hint="Visible to employers"><Textarea defaultValue={APPLICANT.bio}/></Field>
        <Field label="First name"><Input defaultValue={APPLICANT.firstName}/></Field>
        <Field label="Last name"><Input defaultValue={APPLICANT.lastName}/></Field>
        <Field label="Email"><Input defaultValue={APPLICANT.email}/></Field>
        <Field label="Mobile phone"><Input defaultValue={APPLICANT.phone}/></Field>
        <Field label="Postcode"><Input defaultValue="PO33 2DA"/></Field>
        <Field label="Right to work">
          <Select defaultValue={APPLICANT.rightToWork}>
            <option>UK Citizen</option><option>Settled status</option><option>Skilled Worker visa</option><option>Need sponsorship</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function ProfileHistory() {
  return (
    <div className="card pad-7 stack gap-5">
      <div className="row" style={{ justifyContent:"space-between" }}>
        <h3 className="h3" style={{ margin:0 }}>Work history</h3>
        <Button variant="ghost" size="sm" icon="plus">Add role</Button>
      </div>
      <div className="stack" style={{ paddingLeft:24, position:"relative" }}>
        <div style={{ position:"absolute", left:8, top:8, bottom:8, width:2, background:"var(--line)" }}/>
        {APPLICANT.history.map((h, i) => (
          <div key={i} className="row gap-4" style={{ alignItems:"flex-start", padding:"16px 0", borderBottom: i<APPLICANT.history.length-1 ? "1px solid var(--line)" : "0", position:"relative" }}>
            <div style={{ position:"absolute", left:-22, top:22, width:14, height:14, borderRadius:99, background: i===0?"var(--accent)":"var(--card)", border:"2px solid var(--accent)" }}/>
            <div className="grow stack gap-2">
              <div className="row" style={{ justifyContent:"space-between", alignItems:"flex-start" }}>
                <div className="stack" style={{ gap:2 }}>
                  <div className="h4">{h.role}</div>
                  <div className="small">{h.company} · {h.from} – {h.to}</div>
                </div>
                <Button variant="ghost" size="sm" icon="edit"/>
              </div>
              <p className="small" style={{ margin:0, color:"var(--ink-2)", lineHeight:1.5 }}>{h.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSkills() {
  return (
    <div className="card pad-7 stack gap-5">
      <div className="row" style={{ justifyContent:"space-between" }}>
        <h3 className="h3" style={{ margin:0 }}>Skills</h3>
        <Button variant="ghost" size="sm" icon="plus">Add skill</Button>
      </div>
      <div className="tags">
        {APPLICANT.skills.map(s => (
          <span key={s} className="badge outline" style={{ padding:"8px 12px", fontSize:13 }}>
            {s} <Icon name="close" size={11}/>
          </span>
        ))}
      </div>
      <div className="hr"/>
      <div className="stack gap-3">
        <div className="micro">Endorsements (3)</div>
        <div className="row gap-3">
          {[
            { name:"Sarah Boyne", role:"GM at The Hut", skill:"Service leadership"},
            { name:"Tom Quinn",  role:"Head Chef at Quay Arts", skill:"Rota planning"},
            { name:"Eve Marsh",  role:"FoH at George Hotel", skill:"Wine knowledge"}
          ].map(e => (
            <div key={e.name} className="card pad-4 grow row gap-3" style={{ alignItems:"center" }}>
              <div className="avatar">{e.name.split(" ").map(n=>n[0]).join("")}</div>
              <div className="stack" style={{ gap:0 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{e.name}</div>
                <div className="small">{e.role}</div>
                <div className="small" style={{ color:"var(--accent)", fontWeight:600 }}>endorsed: {e.skill}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileCV() {
  return (
    <div className="card pad-7 stack gap-5">
      <h3 className="h3" style={{ margin:0 }}>CV &amp; video intro</h3>

      <div className="row gap-4" style={{ alignItems:"center", padding:16, border:"1px solid var(--line)", borderRadius:14 }}>
        <div style={{ width:48, height:60, background:"var(--accent-soft)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)" }}>
          <Icon name="file" size={20}/>
        </div>
        <div className="grow stack" style={{ gap:2 }}>
          <b style={{ fontSize:14 }}>{APPLICANT.cv.name}</b>
          <div className="small">{APPLICANT.cv.size} · uploaded {APPLICANT.cv.uploaded}</div>
        </div>
        <Button variant="ghost" size="sm" icon="eye">Preview</Button>
        <Button variant="ghost" size="sm" icon="upload">Replace</Button>
      </div>

      <div className="row gap-4" style={{ alignItems:"center", padding:16, border:"1px solid var(--line)", borderRadius:14 }}>
        <div style={{ width:80, height:60, borderRadius:8, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <Icon name="play" size={18}/>
        </div>
        <div className="grow stack" style={{ gap:2 }}>
          <b style={{ fontSize:14 }}>Video introduction</b>
          <div className="small">{APPLICANT.videoIntro.duration} · uploaded {APPLICANT.videoIntro.uploaded} · seen by 5 employers</div>
        </div>
        <Button variant="ghost" size="sm" icon="play">Watch</Button>
        <Button variant="ghost" size="sm" icon="upload">Re-record</Button>
      </div>

      <div className="card pad-5 stack gap-2" style={{ background:"var(--bg-soft)", border:0 }}>
        <b style={{ fontSize:13 }}>Tips for a good video intro</b>
        <div className="small">30–60 seconds. Quiet room. Tell us your name, your favourite kind of work, and what you're hoping to find next. No need to dress up.</div>
      </div>
    </div>
  );
}

function ProfilePrefs() {
  return (
    <div className="card pad-7 stack gap-5">
      <h3 className="h3" style={{ margin:0 }}>Job preferences</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Field label="Expected salary"><Input defaultValue={`£${APPLICANT.expectedSalary.toLocaleString()}`}/></Field>
        <Field label="Availability"><Select defaultValue={APPLICANT.availability}><option>Immediately</option><option>2 weeks notice</option><option>1 month notice</option></Select></Field>
        <Field label="Work pattern" full>
          <div className="row gap-2" style={{ flexWrap:"wrap" }}>
            {["Full-time","Part-time","Hybrid","Remote","Seasonal"].map(t => (
              <label key={t} className="badge outline" style={{ padding:"6px 12px" }}>
                <input type="checkbox" defaultChecked={APPLICANT.workPattern.includes(t)} style={{ marginRight:6, accentColor:"var(--accent)" }}/>{t}
              </label>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

// ── Apply flow ─────────────────────────────────────────────────────────
function ApplyScreen({ go, params, toast }) {
  const job = JOBS.find(j => j.id === params.id) || JOBS[0];
  const [step, setStep] = aUseState(0);
  const [coverLetter, setCoverLetter] = aUseState(`Dear ${job.company} team,\n\nI'd like to apply for the ${job.title} role. With six years on the island's hospitality scene, I'm ready for the responsibility.\n\nBest,\nImogen`);
  const [answers, setAnswers] = aUseState(["", "", ""]);

  const steps = ["Review profile", "Cover letter", "Screening", "Confirm"];

  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60, maxWidth:880 }}>
      <a className="row gap-2 small" style={{ cursor:"pointer", marginBottom:16 }} onClick={() => go("job-detail", { id: job.id })}><Icon name="arrowL" size={14}/> Back to job</a>

      <div className="card pad-5 row gap-4" style={{ marginBottom:20 }}>
        <div style={{ width:48, height:48, borderRadius:10, background:"var(--bg-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, border:"1px solid var(--line)" }}>{job.logo}</div>
        <div className="grow stack" style={{ gap:2 }}>
          <b>{job.title}</b>
          <div className="small">{job.company} · {job.location} · {job.salary}</div>
        </div>
        <span className="badge accent">★ 92% match</span>
      </div>

      <div className="row gap-3" style={{ marginBottom:24 }}>
        {steps.map((s, i) => (
          <div key={s} className="row gap-2 grow" style={{ alignItems:"center" }}>
            <div style={{ width:22, height:22, borderRadius:99, background: i<=step ? "var(--accent)" : "var(--bg-soft)", color: i<=step ? "var(--accent-ink)" : "var(--muted)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:11 }}>{i<step?"✓":i+1}</div>
            <div style={{ fontSize:12, fontWeight: i===step?600:400, color: i===step?"var(--ink)":"var(--muted)" }}>{s}</div>
            {i < steps.length-1 ? <div className="grow" style={{ height:1, background: i<step?"var(--accent)":"var(--line)" }}/> : null}
          </div>
        ))}
      </div>

      <div className="card pad-7 stack gap-5">
        {step === 0 ? (
          <div className="stack gap-4">
            <h2 className="h3" style={{ margin:0 }}>This is what {job.company} will see</h2>
            <p className="small">Edit any of it before submitting.</p>
            <div className="card pad-5 stack gap-3" style={{ background:"var(--bg-soft)", border:0 }}>
              <div className="row gap-3" style={{ alignItems:"flex-start" }}>
                <div className="avatar" style={{ width:48, height:48, fontSize:14 }}>IH</div>
                <div className="grow stack" style={{ gap:2 }}>
                  <b>{APPLICANT.firstName} {APPLICANT.lastName}</b>
                  <div className="small">{APPLICANT.headline}</div>
                  <div className="small">{APPLICANT.location} · {APPLICANT.email} · {APPLICANT.phone}</div>
                </div>
              </div>
              <div className="hr"/>
              <div className="row gap-4 small">
                <span><b>Right to work:</b> {APPLICANT.rightToWork}</span>
                <span><b>Available:</b> {APPLICANT.availability}</span>
                <span><b>Expected:</b> £{APPLICANT.expectedSalary.toLocaleString()}</span>
              </div>
              <div className="row gap-2"><Icon name="file" size={14}/><span className="small">{APPLICANT.cv.name}</span></div>
            </div>
            <label className="checkbox"><input type="checkbox" defaultChecked/> Include my video introduction</label>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="stack gap-4">
            <h2 className="h3" style={{ margin:0 }}>Cover letter</h2>
            <p className="small">Optional but recommended. {job.company} likes a personal note.</p>
            <Field label="Message" hint={`${coverLetter.length} characters`}>
              <Textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} style={{ minHeight:200 }}/>
            </Field>
            <div className="row gap-2">
              <Button variant="ghost" size="sm" icon="sparkle">Improve with AI</Button>
              <Button variant="ghost" size="sm">Use template</Button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="stack gap-4">
            <h2 className="h3" style={{ margin:0 }}>Screening questions</h2>
            <p className="small">Set by the employer. Answers are sent only to {job.company}.</p>
            {[
              "Do you have at least 3 years experience leading a front-of-house team?",
              "Are you available to start within 4 weeks?",
              "Tell us about a time you handled a difficult guest situation."
            ].map((q, i) => (
              <Field key={i} label={`${i+1}. ${q}`} required>
                {i === 2 ? <Textarea value={answers[i]} onChange={e=>setAnswers(a => a.map((v,j)=>j===i?e.target.value:v))} placeholder="A few sentences"/> : (
                  <div className="row gap-2">
                    <label className="radio"><input type="radio" name={`q${i}`} defaultChecked/> Yes</label>
                    <label className="radio"><input type="radio" name={`q${i}`}/> No</label>
                  </div>
                )}
              </Field>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="stack gap-4">
            <h2 className="h3" style={{ margin:0 }}>Ready to send</h2>
            <p className="lede">{job.company} will see your profile, CV, video intro, cover letter, and screening answers.</p>
            <div className="card pad-5 stack gap-2" style={{ background:"var(--bg-soft)", border:0 }}>
              <div className="row gap-2"><Icon name="shield" size={14}/><b style={{ fontSize:13 }}>What happens to your data</b></div>
              <div className="small">Your application is shared with {job.company}'s hiring team only. They will keep it for up to 12 months for this role and adjacent roles, then delete it. You can withdraw at any time.</div>
            </div>
            <label className="checkbox"><input type="checkbox" defaultChecked/> I confirm the information above is accurate.</label>
          </div>
        ) : null}

        <div className="row" style={{ justifyContent:"space-between", marginTop:8 }}>
          <Button variant="ghost" onClick={() => step > 0 ? setStep(step-1) : go("job-detail", { id: job.id })}>{step>0?"Back":"Cancel"}</Button>
          <Button variant="primary" onClick={() => {
            if (step < steps.length-1) setStep(step+1);
            else { toast("Application sent — good luck!"); go("applicant-dashboard"); }
          }}>{step < steps.length-1 ? "Continue" : "Submit application"}</Button>
        </div>
      </div>
    </div>
  );
}

// ── Privacy center ────────────────────────────────────────────────────
function PrivacyCenterScreen() {
  const [tab, setTab] = aUseState("consent");
  return (
    <div className="screen wrap" style={{ paddingTop:32, paddingBottom:60 }}>
      <div className="row gap-3" style={{ marginBottom:24 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:"var(--accent-soft)", color:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="shield" size={20}/>
        </div>
        <div className="stack gap-2">
          <h1 className="h2" style={{ margin:0 }}>Privacy Center</h1>
          <p className="small">UK GDPR &amp; Data Protection Act 2018 · last updated 4 May 2026</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:24 }}>
        <aside className="stack gap-1">
          {[
            ["consent","Your consents","check"],
            ["data","Data we hold","file"],
            ["rights","Your GDPR rights","shield"],
            ["export","Export your data","download"],
            ["delete","Delete your account","close"]
          ].map(([id,l,ic]) => (
            <a key={id} className={`side-link ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
              <Icon name={ic}/> {l}
            </a>
          ))}
        </aside>

        <div className="stack gap-4">
          {tab === "consent" ? (
            <div className="card pad-7 stack gap-5">
              <h3 className="h3" style={{ margin:0 }}>Your consents</h3>
              <p className="small">Each of these is opt-in. Withdrawing consent never affects your account or applications.</p>
              <ConsentRow title="Profile visible to verified employers" desc="Lawful basis: legitimate interests (Art. 6(1)(f))" checked onChange={()=>{}}/>
              <div className="hr"/>
              <ConsentRow title="Job alert emails" desc="Lawful basis: consent (Art. 6(1)(a))" checked onChange={()=>{}}/>
              <div className="hr"/>
              <ConsentRow title="Marketing emails from Orca Jobs" desc="Lawful basis: consent (Art. 6(1)(a))" onChange={()=>{}}/>
              <div className="hr"/>
              <ConsentRow title="Anonymous analytics" desc="Lawful basis: consent (Art. 6(1)(a))" checked onChange={()=>{}}/>
              <div className="hr"/>
              <ConsentRow title="Share aggregate data with researchers" desc="Lawful basis: consent (Art. 6(1)(a))" onChange={()=>{}}/>
            </div>
          ) : null}

          {tab === "data" ? (
            <div className="card pad-7 stack gap-4">
              <h3 className="h3" style={{ margin:0 }}>Data we hold about you</h3>
              <p className="small">Last refreshed 5 minutes ago.</p>
              <table className="tbl">
                <thead><tr><th>Category</th><th>Items</th><th>Retention</th></tr></thead>
                <tbody>
                  {[
                    ["Account",          "Email, password hash, 2FA",                   "Until account deletion"],
                    ["Profile",           "Name, phone, postcode, right-to-work",          "Until you remove it"],
                    ["Documents",         "1 CV, 1 video intro",                            "Until you remove it"],
                    ["Work history",      "3 roles",                                         "Until you remove it"],
                    ["Applications",      "4 sent · 11 saved jobs",                          "12 months from submission"],
                    ["Activity",          "Search & view history",                           "90 days then anonymised"],
                    ["Communications",    "8 messages with employers",                        "3 years (DPA legal record)"]
                  ].map(([c,i,r]) => (
                    <tr key={c}><td><b>{c}</b></td><td>{i}</td><td className="small">{r}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {tab === "rights" ? (
            <div className="card pad-7 stack gap-4">
              <h3 className="h3" style={{ margin:0 }}>Your rights under UK GDPR</h3>
              <div className="stack gap-3">
                {[
                  ["Right of access",      "See what we hold about you",                 "Use Export your data"],
                  ["Right to rectification","Correct inaccurate data",                    "Edit your profile"],
                  ["Right to erasure",     "Be forgotten",                                  "Delete your account"],
                  ["Right to restriction",  "Pause processing",                              "Email dpo@orcajobs.io"],
                  ["Right to portability",   "Take your data elsewhere",                       "Use Export your data"],
                  ["Right to object",        "Object to legitimate-interest processing",        "Adjust consents"],
                  ["Rights re. automated decisions", "Human review of any automation",  "Email dpo@orcajobs.io"],
                ].map(([t,d,h]) => (
                  <div key={t} className="row gap-3" style={{ padding:"12px 0", borderBottom:"1px solid var(--line)" }}>
                    <div className="grow stack" style={{ gap:2 }}>
                      <b>{t}</b>
                      <div className="small">{d}</div>
                    </div>
                    <a className="small" style={{ color:"var(--accent)", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{h} →</a>
                  </div>
                ))}
              </div>
              <p className="small" style={{ color:"var(--muted)" }}>You can also complain to the ICO at ico.org.uk if you believe we've handled your data unlawfully.</p>
            </div>
          ) : null}

          {tab === "export" ? (
            <div className="card pad-7 stack gap-4">
              <h3 className="h3" style={{ margin:0 }}>Export your data</h3>
              <p className="lede">Download everything Orca Jobs holds about you in a machine-readable format. We'll prepare a ZIP and email you a secure download link within 30 days (usually within 1 hour).</p>
              <div className="row gap-2">
                <Button variant="primary" icon="download">Request data export (JSON)</Button>
                <Button variant="ghost" icon="download">Export (PDF)</Button>
              </div>
              <div className="card pad-4 row gap-3" style={{ background:"var(--bg-soft)", border:0 }}>
                <Icon name="clock" size={16}/>
                <div className="small">Last export: <b>2 March 2026</b> · 412 KB · expired link</div>
              </div>
            </div>
          ) : null}

          {tab === "delete" ? (
            <div className="card pad-7 stack gap-4">
              <h3 className="h3" style={{ margin:0 }}>Delete your account</h3>
              <p className="lede">This permanently removes your profile, applications, messages and all associated data. We retain anonymised analytics and legal records (UK tax, employer disputes) as required by law.</p>
              <div className="card pad-5 stack gap-2" style={{ background:"color-mix(in srgb, var(--bad) 8%, transparent)", borderColor:"color-mix(in srgb, var(--bad) 30%, transparent)" }}>
                <b style={{ color:"var(--bad)" }}>Cannot be undone</b>
                <div className="small">After 30 days your data is unrecoverable. You can re-create an account with the same email anytime.</div>
              </div>
              <div className="row gap-2">
                <Button variant="ghost">Pause my account instead</Button>
                <Button style={{ background:"var(--bad)", color:"#fff" }}>Delete my account</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ApplicantSignupScreen, ApplicantDashboardScreen, ApplicantProfileScreen, ApplyScreen, PrivacyCenterScreen });
