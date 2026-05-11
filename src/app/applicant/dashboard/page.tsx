import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "My Dashboard" };

export default async function ApplicantDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      applications: {
        include: { job: { include: { employer: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      savedJobs: {
        include: { job: { include: { employer: true } } },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!profile) redirect("/applicant/profile");

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const profileComplete = !!(profile.headline && profile.cvUrl && profile.skills);

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 className="h3">{fullName}</h1>
              <p className="small" style={{ marginTop: 4 }}>{profile.headline ?? "Complete your profile to stand out to employers"}</p>
            </div>
            <Button variant="ghost" href="/applicant/profile">Edit profile</Button>
          </div>

          {/* Profile completeness */}
          {!profileComplete && (
            <div className="card" style={{ padding: 20, marginBottom: 24, background: "var(--accent-soft)", borderColor: "var(--accent-soft)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Complete your profile</div>
                  <div className="small">A complete profile gets 3× more employer interest. Add a headline, upload your CV, and list your skills.</div>
                </div>
                <Button variant="primary" size="sm" href="/applicant/profile">Finish profile →</Button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
            {/* Applications */}
            <div>
              <div className="h4" style={{ marginBottom: 16 }}>My applications</div>
              {profile.applications.length === 0 ? (
                <div className="card" style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>No applications yet</div>
                  <p className="small" style={{ marginBottom: 16 }}>Browse jobs and apply with one click once your profile is ready.</p>
                  <Button variant="primary" size="sm" href="/jobs">Find jobs</Button>
                </div>
              ) : (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Company</th>
                        <th>Applied</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.applications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <Link href={`/jobs/${app.job.slug}`} style={{ fontWeight: 500, color: "var(--ink)" }}>
                              {app.job.title}
                            </Link>
                          </td>
                          <td className="small">{app.job.employer.companyName}</td>
                          <td className="small">{new Date(app.createdAt).toLocaleDateString("en-GB")}</td>
                          <td><StatusBadge status={app.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sidebar: saved jobs + quick stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card" style={{ padding: 20 }}>
                <div className="micro" style={{ marginBottom: 16 }}>Quick stats</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { value: profile.applications.length, label: "Applications" },
                    { value: profile.savedJobs.length, label: "Saved jobs" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", padding: 12, background: "var(--bg-soft)", borderRadius: 10 }}>
                      <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 28 }}>{s.value}</div>
                      <div className="small">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {profile.savedJobs.length > 0 && (
                <div className="card" style={{ padding: 20 }}>
                  <div className="micro" style={{ marginBottom: 14 }}>Saved jobs</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {profile.savedJobs.slice(0, 4).map((s) => (
                      <Link key={s.id} href={`/jobs/${s.job.slug}`} style={{ display: "block" }}>
                        <div style={{ fontWeight: 500, fontSize: 14, color: "var(--ink)" }}>{s.job.title}</div>
                        <div className="small">{s.job.employer.companyName}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* GDPR notice */}
              <div className="card" style={{ padding: 16, background: "var(--bg-soft)", border: "none" }}>
                <div className="micro" style={{ marginBottom: 8 }}>Your data</div>
                <p className="small" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                  Your personal data is stored securely and only shared with employers you apply to.
                </p>
                <Link href="/gdpr" className="small" style={{ color: "var(--accent)" }}>Manage my data →</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
