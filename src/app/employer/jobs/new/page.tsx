import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PostJobForm } from "./PostJobForm";

export const metadata = { title: "Post a Job" };

export default async function PostJobPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  let profile = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Auto-create a stub profile if one doesn't exist yet
  if (!profile) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    profile = await prisma.employerProfile.create({
      data: {
        userId: session.user.id,
        companyName: user?.name ?? "My Company",
        companySlug: `company-${session.user.id.slice(-8)}`,
      },
    });
  }

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="h2">Post a job</h1>
            <p className="lede" style={{ marginTop: 8 }}>
              Reach Isle of Wight's active pool of local candidates.
            </p>
          </div>
          <PostJobForm employerId={profile.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
