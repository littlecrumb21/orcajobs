import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 96, fontWeight: 400, color: "var(--bg-soft)", lineHeight: 1, marginBottom: 24 }}>
            404
          </div>
          <h1 style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 32, fontWeight: 400, marginBottom: 12 }}>
            Page not found
          </h1>
          <p style={{ color: "var(--ink-2)", marginBottom: 32 }}>
            We couldn't find what you were looking for. Head back to find jobs across the island.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button variant="primary" href="/jobs">Browse jobs</Button>
            <Button variant="ghost" href="/">Home</Button>
          </div>
          <p className="small" style={{ marginTop: 32 }}>
            Need help? Call us on{" "}
            <a href="tel:+441983000000" style={{ color: "var(--accent)" }}>01983 000 000</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
