import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") redirect("/");

  const [pendingJobs, recentJobs, deletionRequests, stats] = await Promise.all([
    prisma.job.findMany({
      where: { status: "PENDING" },
      include: { employer: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: { employer: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    prisma.dataDeletionRequest.findMany({
      where: { status: "pending" },
      include: { user: true },
      orderBy: { requestedAt: "asc" },
    }),
    prisma.$transaction([
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "APPLICANT" } }),
      prisma.user.count({ where: { role: "EMPLOYER" } }),
      prisma.application.count(),
    ]),
  ]);

  const [activeJobs, applicants, employers, applications] = stats;

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px" }}>
          <div style={{ marginBottom: 32 }}>
            <div className="micro" style={{ marginBottom: 8 }}>Admin panel</div>
            <h1 className="h3">Moderation dashboard</h1>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
            {[
              { label: "Active jobs", value: activeJobs },
              { label: "Applicants", value: applicants },
              { label: "Employers", value: employers },
              { label: "Applications", value: applications },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: 20 }}>
                <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 36 }}>{s.value}</div>
                <div className="small" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pending approval */}
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="h4">Pending approval</div>
              {pendingJobs.length > 0 && <span className="badge bad">{pendingJobs.length} awaiting review</span>}
            </div>

            {pendingJobs.length === 0 ? (
              <div className="card" style={{ padding: 24, textAlign: "center" }}>
                <span className="badge good">All clear — no jobs pending approval</span>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Job title</th>
                      <th>Employer</th>
                      <th>Tier</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingJobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <Link href={`/jobs/${job.slug}`} style={{ fontWeight: 500, color: "var(--ink)" }}>{job.title}</Link>
                        </td>
                        <td className="small">{job.employer.companyName}</td>
                        <td><span className="badge">{job.tier}</span></td>
                        <td className="small">{new Date(job.createdAt).toLocaleDateString("en-GB")}</td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <form action={`/api/admin/jobs/${job.id}/approve`} method="POST">
                              <button type="submit" className="btn sm" style={{ background: "var(--good)", color: "white" }}>Approve</button>
                            </form>
                            <form action={`/api/admin/jobs/${job.id}/reject`} method="POST">
                              <button type="submit" className="btn sm" style={{ background: "var(--bad)", color: "white" }}>Reject</button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* GDPR deletion requests */}
          {deletionRequests.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <div className="h4" style={{ marginBottom: 16 }}>
                Data deletion requests{" "}
                <span className="badge warn" style={{ marginLeft: 8 }}>{deletionRequests.length}</span>
              </div>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Requested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletionRequests.map((req) => (
                      <tr key={req.id}>
                        <td style={{ fontWeight: 500 }}>{req.user.name}</td>
                        <td className="small">{req.user.email}</td>
                        <td className="small">{new Date(req.requestedAt).toLocaleDateString("en-GB")}</td>
                        <td>
                          <form action={`/api/admin/gdpr/${req.id}/process`} method="POST">
                            <button type="submit" className="btn sm subtle">Process deletion</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Recent live jobs */}
          <section>
            <div className="h4" style={{ marginBottom: 16 }}>Live jobs</div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Employer</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link href={`/jobs/${job.slug}`} style={{ fontWeight: 500, color: "var(--ink)" }}>{job.title}</Link>
                      </td>
                      <td className="small">{job.employer.companyName}</td>
                      <td><span className="badge" style={{ textTransform: "capitalize" }}>{job.category}</span></td>
                      <td><StatusBadge status={job.status} /></td>
                      <td className="small">{job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("en-GB") : "—"}</td>
                      <td className="small">{job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("en-GB") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
