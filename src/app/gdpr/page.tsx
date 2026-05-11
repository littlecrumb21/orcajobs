import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "My Data — GDPR Centre" };

export default async function GdprPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      applicantProfile: true,
      deletionRequests: { orderBy: { requestedAt: "desc" }, take: 1 },
    },
  });

  const pendingDeletion = user?.deletionRequests[0]?.status === "pending";

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px", maxWidth: 680, margin: "0 auto" }}>
          <div className="micro" style={{ marginBottom: 12 }}>UK GDPR · Article 15, 17, 20</div>
          <h1 className="h2" style={{ marginBottom: 8 }}>Your data & privacy</h1>
          <p className="lede" style={{ marginBottom: 40 }}>
            You have full control over your personal data stored with Orca Jobs.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* What we hold */}
            <div className="card" style={{ padding: 24 }}>
              <div className="h4" style={{ marginBottom: 12 }}>What we hold about you</div>
              <dl style={{ display: "grid", gap: 10, fontSize: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Account email</dt>
                  <dd>{session.user.email}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Account created</dt>
                  <dd>{user?.applicantProfile?.createdAt ? new Date(user.applicantProfile.createdAt).toLocaleDateString("en-GB") : "—"}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Data consent given</dt>
                  <dd>{user?.applicantProfile?.dataConsentDate ? new Date(user.applicantProfile.dataConsentDate).toLocaleDateString("en-GB") : "—"}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>CV on file</dt>
                  <dd>{user?.applicantProfile?.cvFileName ?? "None"}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Marketing consent</dt>
                  <dd>{user?.applicantProfile?.marketingConsent ? "Yes" : "No"}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--muted)" }}>Data retention</dt>
                  <dd>{user?.applicantProfile?.retentionDays ?? 730} days from last activity</dd>
                </div>
              </dl>
            </div>

            {/* Export data (Art. 20) */}
            <div className="card" style={{ padding: 24 }}>
              <div className="h4" style={{ marginBottom: 8 }}>Export your data</div>
              <p className="small" style={{ marginBottom: 16, lineHeight: 1.5 }}>
                Under Article 20 of UK GDPR you have the right to receive your personal data in a portable format.
              </p>
              <form action="/api/gdpr/export" method="POST">
                <Button variant="ghost" type="submit">Request data export</Button>
              </form>
            </div>

            {/* Delete account (Art. 17) */}
            <div className="card" style={{ padding: 24, borderColor: pendingDeletion ? "var(--warn)" : "var(--line)" }}>
              <div className="h4" style={{ marginBottom: 8 }}>Delete my account</div>
              <p className="small" style={{ marginBottom: 16, lineHeight: 1.5 }}>
                Under Article 17 of UK GDPR you have the right to erasure. Deleting your account will permanently
                remove your personal details, CV, and application history. Active applications will be anonymised.
                This cannot be undone.
              </p>
              {pendingDeletion ? (
                <div className="badge warn">Deletion request pending — we'll process it within 30 days</div>
              ) : (
                <form action="/api/gdpr/delete-request" method="POST">
                  <Button variant="ghost" type="submit" style={{ borderColor: "var(--bad)", color: "var(--bad)" }}>
                    Request account deletion
                  </Button>
                </form>
              )}
            </div>

            <div className="card" style={{ padding: 20, background: "var(--bg-soft)", border: "none" }}>
              <div className="small" style={{ lineHeight: 1.6 }}>
                Questions about your data? Email us at{" "}
                <a href="mailto:privacy@orca.jobs" style={{ color: "var(--accent)" }}>privacy@orca.jobs</a>{" "}
                or write to our Data Controller at Orca Jobs Ltd, Newport, Isle of Wight.
                We're registered with the ICO (registration number pending).
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
