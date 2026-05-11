import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";

function formatSalary(min?: number | null, max?: number | null, period?: string | null) {
  const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;
  const suffix = period === "hour" ? "/hr" : period === "day" ? "/day" : "/yr";
  if (min && max) return `${fmt(min)} – ${fmt(max)}${suffix}`;
  if (min) return `From ${fmt(min)}${suffix}`;
  if (max) return `Up to ${fmt(max)}${suffix}`;
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({ where: { slug }, include: { employer: true } });
  if (!job) return {};
  return {
    title: `${job.title} — ${job.employer.companyName}`,
    description: job.summary ?? job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const job = await prisma.job.findUnique({
    where: { slug, status: "ACTIVE" },
    include: { employer: true },
  });
  if (!job) notFound();

  // Check if applicant has already applied
  let hasApplied = false;
  let applicantProfileId: string | null = null;
  if (userId) {
    const profile = await prisma.applicantProfile.findUnique({ where: { userId } });
    if (profile) {
      applicantProfileId = profile.id;
      const existing = await prisma.application.findUnique({
        where: { jobId_applicantId: { jobId: job.id, applicantId: profile.id } },
      });
      hasApplied = !!existing;
    }
  }

  const salary = job.salaryPublic ? formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) : null;
  const daysAgo = job.publishedAt ? Math.floor((Date.now() - new Date(job.publishedAt).getTime()) / 86400000) : null;

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>
          {/* Main content */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24, fontSize: 13, color: "var(--muted)" }}>
              <Link href="/jobs">Jobs</Link>
              <span>/</span>
              <span style={{ textTransform: "capitalize" }}>{job.category}</span>
              <span>/</span>
              <span>{job.title}</span>
            </div>

            <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
              {job.featured && <Badge variant="accent">Featured</Badge>}
              <Badge>{job.category}</Badge>
            </div>

            <h1 className="h2" style={{ marginBottom: 8 }}>{job.title}</h1>
            <div style={{ fontSize: 16, color: "var(--ink-2)", marginBottom: 20 }}>
              {job.employer.companyName} · {job.location}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32, fontSize: 14, color: "var(--ink-2)" }}>
              <span>📋 {job.contractType.replace("_", " ")}</span>
              <span>⏰ {job.workType.replace("_", " ")}</span>
              <span>📍 {job.location}</span>
              {salary && <span style={{ color: "var(--good)", fontWeight: 600 }}>💷 {salary}</span>}
              {daysAgo !== null && <span>Posted {daysAgo === 0 ? "today" : `${daysAgo}d ago`}</span>}
            </div>

            <hr className="hr" style={{ marginBottom: 32 }} />

            <div
              style={{ lineHeight: 1.75, color: "var(--ink-2)", fontSize: 15 }}
              dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, "<br/>") }}
            />
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{job.title}</div>
              <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 20 }}>{job.employer.companyName}</div>

              {salary && (
                <div style={{ background: "var(--bg-soft)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 24, color: "var(--good)" }}>{salary}</div>
                </div>
              )}

              {hasApplied ? (
                <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-soft)", borderRadius: 10 }}>
                  <Badge variant="good">✓ Applied</Badge>
                  <p className="small" style={{ margin: "8px 0 0" }}>You've already applied for this role.</p>
                </div>
              ) : session ? (
                applicantProfileId ? (
                  <Button variant="primary" block href={`/apply/${job.slug}`}>Apply now</Button>
                ) : (
                  <Button variant="primary" block href="/applicant/profile">Complete profile to apply</Button>
                )
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button variant="primary" block href={`/auth/signup?next=/apply/${job.slug}`}>Sign up to apply</Button>
                  <Button variant="ghost" block href={`/auth/login?next=/apply/${job.slug}`}>Sign in</Button>
                </div>
              )}

              <hr className="hr" style={{ margin: "20px 0" }} />

              <dl style={{ display: "grid", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Contract</dt>
                  <dd style={{ fontWeight: 500, textTransform: "capitalize" }}>{job.contractType.replace("_", " ")}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Type</dt>
                  <dd style={{ fontWeight: 500, textTransform: "capitalize" }}>{job.workType.replace("_", " ")}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Location</dt>
                  <dd style={{ fontWeight: 500 }}>{job.location}</dd>
                </div>
                {job.expiresAt && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <dt style={{ color: "var(--muted)" }}>Closes</dt>
                    <dd style={{ fontWeight: 500 }}>{new Date(job.expiresAt).toLocaleDateString("en-GB")}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Employer card */}
            <div className="card" style={{ padding: 20 }}>
              <div className="micro" style={{ marginBottom: 12 }}>About {job.employer.companyName}</div>
              {job.employer.description && (
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 12 }}>
                  {job.employer.description.slice(0, 200)}…
                </p>
              )}
              {job.employer.verified && <Badge variant="good">✓ Verified employer</Badge>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
