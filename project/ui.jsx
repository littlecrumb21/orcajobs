// Shared UI primitives for Orca Jobs

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ─── Icons ──────────────────────────────────────────────────────────
function Icon({ name, size = 16, stroke = 1.6, className = "" }) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    className: `ic ${className}`,
  };
  const paths = {
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    pin:       <><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></>,
    bell:      <><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
    user:      <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bookmark:  <><path d="M6 3h12v18l-6-4-6 4z"/></>,
    arrow:     <><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>,
    arrowL:    <><path d="M19 12H5"/><path d="M11 5l-7 7 7 7"/></>,
    plus:      <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    check:     <><path d="M5 12l5 5L20 7"/></>,
    close:     <><path d="M6 6l12 12"/><path d="M18 6l-12 12"/></>,
    upload:    <><path d="M12 16V4"/><path d="M5 11l7-7 7 7"/><path d="M5 20h14"/></>,
    download:  <><path d="M12 4v12"/><path d="M5 13l7 7 7-7"/><path d="M5 20h14"/></>,
    play:      <><path d="M6 4l14 8-14 8z"/></>,
    clock:     <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    coin:      <><circle cx="12" cy="12" r="9"/><path d="M9 9h4a2 2 0 0 1 0 4H9"/><path d="M9 13h5a2 2 0 0 1 0 4H9"/><path d="M11 7v10"/></>,
    shield:    <><path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7z"/></>,
    eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff:    <><path d="M2 2l20 20"/><path d="M10.6 6.2A10 10 0 0 1 12 6c6.5 0 10 6 10 6a14 14 0 0 1-3.3 4M6.6 6.6A14 14 0 0 0 2 12s3.5 6 10 6c1.4 0 2.6-.2 3.7-.6"/></>,
    edit:      <><path d="M16 3l5 5L8 21H3v-5z"/></>,
    flag:      <><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></>,
    sparkle:   <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/></>,
    chev:      <><path d="M9 6l6 6-6 6"/></>,
    chevD:     <><path d="M6 9l6 6 6-6"/></>,
    filter:    <><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></>,
    grid:      <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    list:      <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
    gear:      <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.4l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.4-1.4L13.7 3h-3.4l-.4 2.2A7 7 0 0 0 7.5 6.6l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .5 0 1 .1 1.4l-2 1.6 2 3.4 2.4-1A7 7 0 0 0 9.9 18.8l.4 2.2h3.4l.4-2.2a7 7 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.4z"/></>,
    home:      <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    star:      <><path d="M12 3l3 6 6 1-4.5 4.5 1 6-5.5-3-5.5 3 1-6L3 10l6-1z"/></>,
    chart:     <><path d="M3 21V3"/><path d="M3 17h4l3-7 4 5 3-9 4 12"/></>,
    inbox:     <><path d="M3 13h5l1 3h6l1-3h5"/><path d="M3 13l3-8h12l3 8v8H3z"/></>,
    heart:     <><path d="M12 21s-8-5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-8 11-8 11z" /></>,
    boat:      <><path d="M3 18h18l-2 3H5z"/><path d="M5 14V8l7-3 7 3v6"/><path d="M12 5v9"/></>
  };
  return <svg {...props}>{paths[name] || null}</svg>;
}

// ─── Buttons / inputs ───────────────────────────────────────────────
function Button({ as = "button", variant = "primary", size, block, icon, iconAfter, children, className = "", ...rest }) {
  const C = as;
  const classes = [
    "btn",
    variant === "primary" ? "primary" : variant === "ghost" ? "ghost" : variant === "subtle" ? "subtle" : variant === "dark" ? "" : "",
    size === "sm" ? "sm" : size === "lg" ? "lg" : "",
    block ? "block" : "", className
  ].filter(Boolean).join(" ");
  return (
    <C className={classes} {...rest}>
      {icon ? <Icon name={icon} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} /> : null}
    </C>
  );
}

function Field({ label, hint, required, children, full }) {
  return (
    <div className="field" style={full ? { gridColumn: "1 / -1" } : null}>
      <label>
        {label}{required ? <span className="req">*</span> : null}
        {hint ? <span className="hint">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

function Input(props) { return <input className={`input ${props.className||""}`} {...props} />; }
function Textarea(props) { return <textarea className={`textarea ${props.className||""}`} {...props} />; }
function Select({ children, ...rest }) { return <select className="select" {...rest}>{children}</select>; }

// ─── Logo ───────────────────────────────────────────────────────────
function Logo({ size = 22 }) {
  return (
    <div className="row gap-2" style={{ alignItems:"center" }}>
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 3 C7 3 3 8 3 14 c0 6 4 11 11 11 c1.5 0 3-.3 4.3-.9 L23 26 l-1.6-4.6 C24 19.6 25 17 25 14 C25 8 21 3 14 3 z"
              fill="var(--ink)"/>
        <circle cx="18" cy="12" r="1.5" fill="var(--bg)"/>
        <path d="M8 16 c2 1 4 1 6 0 s4-1 6 0" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      </svg>
      <span style={{ fontFamily:"var(--font-display)", fontWeight:500, fontSize:18, letterSpacing:"-.01em" }}>
        Orca <span style={{ color:"var(--muted)", fontStyle:"italic" }}>jobs</span>
      </span>
    </div>
  );
}

// ─── Cookie banner ──────────────────────────────────────────────────
function CookieBanner({ onClose }) {
  const [adv, setAdv] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="row gap-3" style={{ alignItems:"flex-start" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--accent-soft)", color:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="shield" size={18}/>
        </div>
        <div className="grow stack gap-2">
          <div className="h4">Your data, your choice</div>
          <div className="small" style={{ color:"var(--ink-2)" }}>
            We use essential cookies to run the site. With your permission, we'd also use analytics to make it better, and marketing to tell you about new island roles. You can change this anytime in <a style={{ color:"var(--accent)", fontWeight:600 }}>Privacy Center</a>.
          </div>
        </div>
      </div>
      {adv ? (
        <div className="stack gap-3" style={{ background:"var(--bg-soft)", padding:14, borderRadius:12 }}>
          <ConsentRow title="Essential" desc="Login, security, fraud prevention. Always on." disabled checked />
          <ConsentRow title="Analytics" desc="Help us understand which pages help job seekers most." checked={analytics} onChange={setAnalytics} />
          <ConsentRow title="Marketing" desc="Email about new roles matching your interests." checked={marketing} onChange={setMarketing} />
        </div>
      ) : null}
      <div className="row gap-2" style={{ flexWrap:"wrap", justifyContent:"flex-end" }}>
        <Button variant="ghost" size="sm" onClick={() => setAdv(v => !v)}>{adv ? "Hide options" : "Manage"}</Button>
        <Button variant="ghost" size="sm" onClick={onClose}>Reject non-essential</Button>
        <Button variant="primary" size="sm" onClick={onClose}>Accept all</Button>
      </div>
    </div>
  );
}

function ConsentRow({ title, desc, checked, onChange, disabled }) {
  return (
    <div className="row gap-3" style={{ alignItems:"flex-start" }}>
      <div className="grow stack" style={{ gap:2 }}>
        <div style={{ fontWeight:600, fontSize:13 }}>{title}</div>
        <div className="small">{desc}</div>
      </div>
      <Toggle checked={!!checked} disabled={disabled} onChange={onChange}/>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      style={{
        width:38, height:22, borderRadius:99, border:"1px solid var(--line-2)",
        background: checked ? "var(--accent)" : "var(--bg-soft)",
        position:"relative", cursor: disabled ? "not-allowed" : "pointer", transition:"background .15s",
        opacity: disabled ? .5 : 1, padding:0,
      }}
      aria-pressed={checked}
    >
      <span style={{
        position:"absolute", top:2, left: checked ? 18 : 2,
        width:16, height:16, borderRadius:99, background:"#fff",
        boxShadow:"0 1px 3px rgba(0,0,0,.18)", transition:"left .15s",
      }}/>
    </button>
  );
}

// ─── Image placeholder helpers ─────────────────────────────────────
function Placeholder({ label = "image", aspect = "4/3", round, style, className = "" }) {
  return (
    <div className={`ph ${round ? "round" : ""} ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <span>{label}</span>
    </div>
  );
}

// ─── Pricing tag ────────────────────────────────────────────────────
function Money({ amount, big }) {
  return (
    <span style={{ fontFamily:"var(--font-display)", fontWeight:500, fontSize: big ? 44 : 18, letterSpacing:"-.02em", lineHeight:1 }}>
      <span style={{ fontSize: big ? 22 : 13, verticalAlign: big ? "top" : "baseline", marginRight:1, color:"var(--ink-2)" }}>£</span>{amount}
    </span>
  );
}

// ─── Misc ───────────────────────────────────────────────────────────
function Stat({ label, value, delta }) {
  return (
    <div className="card pad-5 stack" style={{ gap:6 }}>
      <div className="micro">{label}</div>
      <div className="display" style={{ fontSize:32 }}>{value}</div>
      {delta ? <div className="small">{delta}</div> : null}
    </div>
  );
}

Object.assign(window, {
  Icon, Button, Field, Input, Textarea, Select, Logo,
  CookieBanner, Toggle, ConsentRow, Placeholder, Money, Stat,
});
