// Top navigation + cookie banner host

const { useState: navUseState } = React;

function TopNav({ route, go, role, setRole }) {
  const isPublic = role === "public";
  const isApplicant = role === "applicant";
  const isEmployer = role === "employer";
  const isAdmin = role === "admin";

  const links = isApplicant ? [
    { id:"applicant-dashboard", label:"Dashboard" },
    { id:"applicant-profile",   label:"Profile" },
    { id:"search",              label:"Find jobs" },
    { id:"privacy",             label:"Privacy" },
  ] : isEmployer ? [
    { id:"employer-dashboard",  label:"Dashboard" },
    { id:"employer-jobs",       label:"Listings" },
    { id:"post-job",            label:"Post a job" },
    { id:"employer-billing",    label:"Billing" },
  ] : isAdmin ? [
    { id:"admin",          label:"Moderation" },
    { id:"admin-stats",    label:"Stats" },
  ] : [
    { id:"home",      label:"Home" },
    { id:"search",    label:"Find jobs" },
    { id:"employers", label:"For employers" },
    { id:"about",     label:"About" },
  ];

  return (
    <header style={{
      position:"sticky", top:0, zIndex:50,
      background:"color-mix(in srgb, var(--bg) 88%, transparent)",
      backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
      borderBottom:"1px solid var(--line)"
    }}>
      <div className="wrap row gap-6" style={{ height:64 }}>
        <a onClick={() => go(isApplicant ? "applicant-dashboard" : isEmployer ? "employer-dashboard" : isAdmin ? "admin" : "home")} style={{ cursor:"pointer" }}>
          <Logo />
        </a>

        <nav className="row gap-2" style={{ marginLeft:8 }}>
          {links.map(l => (
            <a key={l.id} className={`nav-link ${route === l.id ? "active" : ""}`} onClick={() => go(l.id)}>{l.label}</a>
          ))}
        </nav>

        <div className="grow"/>

        <div className="row gap-2">
          {isPublic ? (
            <>
              <RoleSwitcher role={role} setRole={setRole} go={go}/>
              <Button variant="ghost" size="sm" onClick={() => { setRole("applicant"); go("applicant-dashboard"); }}>Sign in</Button>
              <Button variant="primary" size="sm" onClick={() => go("applicant-signup")}>Create profile</Button>
            </>
          ) : (
            <>
              <RoleSwitcher role={role} setRole={setRole} go={go}/>
              <button title="Notifications" className="nav-link" style={{ padding:"6px 8px" }}><Icon name="bell" /></button>
              <a className="row gap-2 nav-link" onClick={() => go(isApplicant ? "applicant-profile" : isEmployer ? "employer-account" : "admin")}>
                <span className="avatar" style={{ width:30, height:30, fontSize:11 }}>
                  {isApplicant ? "IH" : isEmployer ? "WS" : "AD"}
                </span>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function RoleSwitcher({ role, setRole, go }) {
  const [open, setOpen] = navUseState(false);
  const ROLES = [
    { id:"public",     label:"Visitor view",  goTo:"home" },
    { id:"applicant",  label:"Applicant: Imogen", goTo:"applicant-dashboard" },
    { id:"employer",   label:"Employer: Wight Shipyard", goTo:"employer-dashboard" },
    { id:"admin",      label:"Admin (moderator)", goTo:"admin" },
  ];
  return (
    <div style={{ position:"relative" }}>
      <button className="nav-link row gap-2" onClick={() => setOpen(o => !o)} style={{ border:"1px solid var(--line)" }}>
        <span className="badge dot" style={{ background:"transparent", color:"var(--accent)", paddingLeft:0 }}/>
        <span style={{ fontSize:12 }}>Demo as <b style={{ fontWeight:600 }}>{ROLES.find(r=>r.id===role)?.label.split(":")[0]}</b></span>
        <Icon name="chevD" size={12}/>
      </button>
      {open ? (
        <div className="card elev" style={{ position:"absolute", right:0, top:"calc(100% + 6px)", padding:6, minWidth:240, zIndex:60 }}>
          {ROLES.map(r => (
            <a key={r.id} className={`side-link ${r.id===role ? "active":""}`}
               onClick={() => { setRole(r.id); go(r.goTo); setOpen(false); }}>
              {r.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ borderTop:"1px solid var(--line)", marginTop:80, padding:"40px 0 60px", background:"var(--bg)" }}>
      <div className="wrap" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:32 }}>
        <div className="stack gap-3">
          <Logo />
          <div className="small" style={{ maxWidth:300 }}>The Isle of Wight's job board. Independent, island-owned, built for the local economy.</div>
          <div className="row gap-2">
            <span className="badge outline mono">PO30 • Newport</span>
          </div>
        </div>
        <FooterCol title="Job seekers" links={[["Find jobs","search"],["Create profile","applicant-signup"],["Privacy center","privacy"]]} go={go}/>
        <FooterCol title="Employers" links={[["Post a job","post-job"],["Pricing","employers"],["Employer dashboard","employer-dashboard"]]} go={go}/>
        <FooterCol title="Company" links={[["About","about"],["Contact",""],["Terms",""],["Cookies",""]]} go={go}/>
      </div>
      <div className="wrap row" style={{ marginTop:40, paddingTop:20, borderTop:"1px solid var(--line)", justifyContent:"space-between" }}>
        <div className="small">© 2026 Orca Jobs Ltd. Registered in England, ICO ZB‑********.</div>
        <div className="small">GDPR &amp; UK DPA 2018 compliant</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, go }) {
  return (
    <div className="stack gap-3">
      <div className="micro">{title}</div>
      <div className="stack gap-2">
        {links.map(([l, r]) => <a key={l} className="small" style={{ cursor:"pointer", color:"var(--ink-2)" }} onClick={() => r && go(r)}>{l}</a>)}
      </div>
    </div>
  );
}

Object.assign(window, { TopNav, Footer });
