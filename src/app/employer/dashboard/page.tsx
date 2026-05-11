import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Employer Dashboard" };

export default async function EmployerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      jobs: {
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!profile) redirect("/employer/onboarding");

  const activeJobs = profile.jobs.filter((j) => j.status === "ACTIVE").length;
  const totalApplications = profile.jobs.reduce((sum, j) => sum + j._count.applications, 0);

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 className="h3">{profile.companyName}</h1>
              <p className="small" style={{ marginTop: 4 }}>Employer dashboard</p>
            </div>
            <Button variant="primary" href="/employer/jobs/new">Post a job</Button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Active jobs", value: activeJobs },
              { label: "Total applications", value: totalApplications },
              { label: "Total jobs posted", value: profile.jobs.length },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: 20 }}>
                <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 36, fontWeight: 400 }}>{s.value}</div>
                <div className="small" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Jobs table */}
          <div className="h4" style={{ marginBottom: 16 }}>Your job listings</div>

          {profile.jobs.length === 0 ? (
            <div className="card" style={{ padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>No jobs posted yet</div>
              <p className="small" style={{ marginBottom: 16 }}>Post your first job and start receiving applications from Isle of Wight talent.</p>
              <Button variant="primary" href="/employer/jobs/new">Post your first job</Button>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Tier</th>
                    <th>Status</th>
                    <th>Applications</th>
                    <th>Posted</th>
                    <th>Expires</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {profile.jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link href={`/jobs/${job.slug}`} style={{ fontWeight: 500, color: "var(--ink)" }}>{job.title}</Link>
                      </td>
                      <td><span className="badge">{job.tier}</span></td>
                      <td><StatusBadge status={job.status} /></td>
                      <td>
                        {job.status === "ACTIVE" ? (
                          <Link href={`/employer/jobs/${job.id}/applications`} style={{ fontWeight: 600, color: "var(--accent)" }}>
                            {job._count.applications}
                          </Link>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>{job._count.applications}</span>
                        )}
                      </td>
                      <td className="small">{job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("en-GB") : "—"}</td>
                      <td className="small">{job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("en-GB") : "—"}</td>
                      <td>
                        <Link href={`/employer/jobs/${job.id}/edit`} className="small" style={{ color: "var(--accent)" }}>Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
