// Root app: routing + theme + tweaks panel + cookie banner

const { useState: appUseState, useEffect: appUseEffect } = React;

function App() {
  const [t, setTweak] = useTweaks(window.__TWEAKS);
  const [route, setRoute] = appUseState("home");
  const [params, setParams] = appUseState({});
  const [role, setRole] = appUseState("public");
  const [cookieOpen, setCookieOpen] = appUseState(true);
  const [toastMsg, setToastMsg] = appUseState(null);

  const go = (r, p = {}) => {
    setRoute(r);
    setParams(p);
    if (r === "applicant-signup") setRole("public");
    if (r === "applicant-dashboard" || r === "applicant-profile") setRole("applicant");
    if (r === "employer-dashboard" || r === "employer-jobs" || r === "employer-billing" || r === "post-job") setRole(role === "public" ? "employer" : role);
    if (r === "admin" || r === "admin-stats") setRole("admin");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  appUseEffect(() => {
    document.documentElement.classList.remove("theme-solent","theme-chalk","theme-tide");
    document.documentElement.classList.add(`theme-${t.theme}`);
  }, [t.theme]);

  return (
    <div>
      <TopNav route={route} go={go} role={role} setRole={setRole}/>

      {role === "public" && (route === "home") ? <HomeScreen go={go}/> : null}
      {(route === "search") ? <SearchScreen go={go} params={params}/> : null}
      {(route === "job-detail") ? <JobDetailScreen go={go} params={params}/> : null}
      {(route === "employers") ? <EmployersScreen go={go}/> : null}
      {(route === "about") ? <AboutScreen/> : null}

      {(route === "applicant-signup") ? <ApplicantSignupScreen go={go}/> : null}
      {(route === "applicant-dashboard") ? <ApplicantDashboardScreen go={go}/> : null}
      {(route === "applicant-profile") ? <ApplicantProfileScreen go={go}/> : null}
      {(route === "apply") ? <ApplyScreen go={go} params={params} toast={toast}/> : null}
      {(route === "privacy") ? <PrivacyCenterScreen/> : null}

      {(route === "employer-signup") ? <EmployerSignupScreen go={go}/> : null}
      {(route === "employer-dashboard") ? <EmployerDashboardScreen go={go}/> : null}
      {(route === "employer-jobs") ? <EmployerJobsScreen go={go}/> : null}
      {(route === "employer-billing") ? <EmployerBillingScreen/> : null}
      {(route === "post-job") ? <PostJobScreen go={go} params={params} toast={toast}/> : null}

      {(route === "admin") ? <AdminScreen go={go}/> : null}
      {(route === "admin-stats") ? <AdminStatsScreen/> : null}

      <Footer go={go}/>

      {cookieOpen && t.showCookieBanner ? <CookieBanner onClose={() => setCookieOpen(false)}/> : null}
      {toastMsg ? <div className="toast">{toastMsg}</div> : null}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Visual direction"/>
        <TweakRadio label="Theme" value={t.theme} options={["solent","chalk","tide"]} onChange={(v)=>setTweak("theme", v)}/>
        <div className="small" style={{ color:"#666", marginTop:-4, fontSize:11, lineHeight:1.4 }}>
          {t.theme==="solent" ? "Editorial cream + coral · Newsreader serif" : t.theme==="chalk" ? "High-contrast minimal · Manrope · electric blue" : "Dark mode · Instrument Serif italic · sand gold"}
        </div>

        <TweakSection label="Demo as"/>
        <TweakRadio label="Role" value={role} options={["public","applicant","employer","admin"]}
                    onChange={(v) => {
                      setRole(v);
                      if (v === "applicant") go("applicant-dashboard");
                      else if (v === "employer") go("employer-dashboard");
                      else if (v === "admin") go("admin");
                      else go("home");
                    }}/>

        <TweakSection label="Jump to screen"/>
        <TweakSelect label="Public" value={route} options={["home","search","job-detail","employers","about"]} onChange={(v) => go(v, v==="job-detail"?{id:"j-001"}:{})}/>
        <TweakSelect label="Applicant" value={route} options={["applicant-signup","applicant-dashboard","applicant-profile","apply","privacy"]} onChange={(v) => { setRole(v==="applicant-signup"?"public":"applicant"); go(v, v==="apply"?{id:"j-001"}:{}); }}/>
        <TweakSelect label="Employer" value={route} options={["employer-signup","employer-dashboard","employer-jobs","employer-billing","post-job"]} onChange={(v) => { setRole(v==="employer-signup"?"public":"employer"); go(v); }}/>
        <TweakSelect label="Admin" value={route} options={["admin","admin-stats"]} onChange={(v) => { setRole("admin"); go(v); }}/>

        <TweakSection label="UI"/>
        <TweakToggle label="Cookie banner" value={cookieOpen && t.showCookieBanner}
                     onChange={(v) => { setCookieOpen(v); setTweak("showCookieBanner", v); }}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
