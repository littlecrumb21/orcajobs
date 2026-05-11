import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ProfileForm } from "./ProfileForm";

export const metadata = { title: "My Profile" };

export default async function ApplicantProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { workHistory: { orderBy: { startDate: "desc" } } },
  });

  return (
    <>
      <Nav />
      <main className="screen">
        <div className="wrap" style={{ padding: "40px 28px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h1 className="h2">My profile</h1>
            <p className="lede" style={{ marginTop: 8 }}>
              Keep your profile up to date so employers can find you.
            </p>
          </div>
          <ProfileForm profile={profile} workHistory={profile?.workHistory ?? []} userId={session.user.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
