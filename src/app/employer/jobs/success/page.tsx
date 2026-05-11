import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Payment successful" };

export default function PaymentSuccessPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 32, fontWeight: 400, marginBottom: 16 }}>
            Payment successful
          </h1>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 32 }}>
            Your job is now in our moderation queue. We'll review it and make it live shortly — usually within a few hours.
            You'll receive an email confirmation once it's published.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button variant="primary" href="/employer/dashboard">Go to dashboard</Button>
            <Button variant="ghost" href="/employer/jobs/new">Post another job</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
