import Link from "next/link";

const year = new Date().getFullYear();

const links = [
  { section: "Jobs", items: [{ label: "Find jobs", href: "/jobs" }, { label: "Post a job", href: "/employer/jobs/new" }, { label: "Saved jobs", href: "/applicant/dashboard" }] },
  { section: "Employers", items: [{ label: "For employers", href: "/for-employers" }, { label: "Services", href: "/services" }, { label: "Pricing", href: "/for-employers#pricing" }] },
  { section: "Company", items: [{ label: "About Orca", href: "/about" }, { label: "Team", href: "/team" }, { label: "Specialisms", href: "/specialisms" }] },
  { section: "Legal", items: [{ label: "Privacy policy", href: "/privacy" }, { label: "Cookie policy", href: "/cookies" }, { label: "Terms of use", href: "/terms" }, { label: "GDPR centre", href: "/gdpr" }] },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--bg-2)",
        marginTop: 80,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {links.map((col) => (
            <div key={col.section}>
              <div className="micro" style={{ marginBottom: 14 }}>{col.section}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.items.map((item) => (
                  <Link key={item.href} href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="hr" style={{ marginBottom: 24 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 18 }}>Orca Jobs</span>
          <span className="small">
            © {year} Orca Jobs Ltd · Newport, Isle of Wight · ICO registered · REC member
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            <span className="badge">🇬🇧 UK GDPR compliant</span>
            <span className="badge">ICO registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
