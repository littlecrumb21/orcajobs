import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";

const specialisms = [
  { icon: "⚓", label: "Marine & Maritime", slug: "marine", desc: "Shipyards, ferry operators, sailing, watersports" },
  { icon: "🍽️", label: "Hospitality & Tourism", slug: "hospitality", desc: "Hotels, restaurants, events, visitor attractions" },
  { icon: "❤️", label: "Health & Social Care", slug: "care", desc: "NHS, care homes, community support" },
  { icon: "🌱", label: "Agriculture", slug: "agri", desc: "Farms, horticulture, food production" },
  { icon: "🔧", label: "Trades & Construction", slug: "trades", desc: "Builders, electricians, plumbers, engineers" },
  { icon: "💼", label: "Professional", slug: "professional", desc: "Finance, legal, admin, technology" },
];

const stats = [
  { value: "600+", label: "Local employers" },
  { value: "2,400+", label: "Active jobseekers" },
  { value: "98%", label: "Island-based roles" },
];

async function getFeaturedJobs() {
  return prisma.job.findMany({
    where: { status: "ACTIVE", featured: true },
    include: { employer: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });
}

async function getRecentJobs() {
  return prisma.job.findMany({
    where: { status: "ACTIVE" },
    include: { employer: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([getFeaturedJobs(), getRecentJobs()]);

  return (
    <>
      <Nav />
      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--bg)",
            paddingTop: 96,
            paddingBottom: 80,
          }}
        >
          {/* Subtle sea gradient */}
          <div
            style={{
              position: "absolute",
              inset: "auto 0 0 0",
              height: "42%",
              background: "radial-gradient(120% 80% at 50% 0%, transparent 0, var(--bg-soft) 70%), linear-gradient(180deg, transparent, var(--bg-soft))",
              pointerEvents: "none",
            }}
          />

          <div className="wrap" style={{ position: "relative", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div className="badge accent" style={{ marginBottom: 24, display: "inline-flex" }}>
              Isle of Wight's modern jobs platform
            </div>

            <h1 className="h1" style={{ marginBottom: 24 }}>
              Your next role is<br />
              <em style={{ color: "var(--accent)" }}>here on the island</em>
            </h1>

            <p className="lede" style={{ marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Connecting Isle of Wight talent with local employers across every sector — from the Solent to the Downs.
            </p>

            {/* Search bar */}
            <form
              action="/jobs"
              style={{
                display: "flex",
                gap: 8,
                background: "var(--card)",
                border: "1px solid var(--line-2)",
                borderRadius: 999,
                padding: "6px 6px 6px 20px",
                boxShadow: "var(--shadow)",
                maxWidth: 560,
                margin: "0 auto 24px",
              }}
            >
              <input
                name="q"
                placeholder="Job title, keyword, or company…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 15,
                  color: "var(--ink)",
                }}
              />
              <button type="submit" className="btn primary">
                Search jobs
              </button>
            </form>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <span className="small">Popular:</span>
              {["Marine engineer", "Care assistant", "Chef", "Electrician", "Admin"].map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?q=${encodeURIComponent(tag)}`}
                  style={{
                    fontSize: 13,
                    padding: "4px 12px",
                    background: "var(--bg-soft)",
                    borderRadius: 999,
                    color: "var(--ink-2)",
                    transition: "background 0.1s",
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap" style={{ display: "flex", justifyContent: "center", gap: 80, padding: "32px 28px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 32, fontWeight: 400, color: "var(--ink)" }}>{s.value}</div>
                <div className="small">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured jobs ─────────────────────────────────────────────────── */}
        {featured.length > 0 && (
          <section style={{ padding: "72px 0 0" }}>
            <div className="wrap">
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
                <h2 className="h3">Featured opportunities</h2>
                <Link href="/jobs?featured=true" className="small" style={{ color: "var(--accent)" }}>View all →</Link>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {featured.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── Latest jobs ───────────────────────────────────────────────────── */}
        <section style={{ padding: "72px 0 0" }}>
          <div className="wrap">
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
              <h2 className="h3">Latest jobs</h2>
              <Link href="/jobs" className="small" style={{ color: "var(--accent)" }}>All jobs →</Link>
            </div>
            {recent.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: "center" }}>
                <p className="lede" style={{ margin: 0 }}>Jobs coming soon — check back shortly.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {recent.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Button variant="ghost" href="/jobs">Browse all jobs</Button>
            </div>
          </div>
        </section>

        {/* ── Specialisms ───────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 0" }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="micro" style={{ marginBottom: 12 }}>Sectors</div>
              <h2 className="h2">Every part of island life</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {specialisms.map((s) => (
                <Link key={s.slug} href={`/jobs?category=${s.slug}`} className="specialism-link">
                  <div className="card specialism-card" style={{ padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                    <div className="h4" style={{ marginBottom: 6 }}>{s.label}</div>
                    <div className="small">{s.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Employer CTA ──────────────────────────────────────────────────── */}
        <section style={{ background: "var(--ink)", padding: "72px 0", color: "var(--bg)" }}>
          <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div className="micro" style={{ color: "rgba(246,244,239,.5)", marginBottom: 16 }}>For employers</div>
              <h2 className="h2" style={{ color: "var(--bg)", marginBottom: 16 }}>Hire island talent</h2>
              <p style={{ color: "rgba(246,244,239,.7)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
                Post a job from £29. Reach the Isle of Wight's active pool of local candidates — no recruitment agency fees.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Button variant="primary" size="lg" href="/employer/jobs/new">Post a job from £29</Button>
                <Button variant="ghost" size="lg" href="/for-employers" style={{ color: "var(--bg)", borderColor: "rgba(246,244,239,.3)" }}>Learn more</Button>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { tier: "Basic", price: "£29", desc: "Standard listing · 30 days" },
                  { tier: "Featured", price: "£59", desc: "Highlighted + top of category · 60 days" },
                  { tier: "Premium", price: "£99", desc: "Featured + logo + social push · 90 days" },
                ].map((p) => (
                  <div
                    key={p.tier}
                    style={{
                      background: "rgba(246,244,239,.08)",
                      border: "1px solid rgba(246,244,239,.12)",
                      borderRadius: 12,
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--bg)" }}>{p.tier}</div>
                      <div style={{ fontSize: 13, color: "rgba(246,244,239,.55)" }}>{p.desc}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 24, color: "var(--accent)" }}>{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
