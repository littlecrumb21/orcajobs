"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

type Role = "APPLICANT" | "EMPLOYER";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [role, setRole] = useState<Role>("APPLICANT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setError("You must consent to data processing to register."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    await signIn("credentials", { email, password, redirect: false });
    router.push(role === "EMPLOYER" ? "/employer/dashboard" : "/applicant/profile");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 24, color: "var(--ink)" }}>
            Orca Jobs
          </Link>
          <h1 style={{ marginTop: 24, marginBottom: 8, fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 28, fontWeight: 400 }}>
            Create your account
          </h1>
          <p className="small">Join the Isle of Wight's jobs platform</p>
        </div>

        {/* Role selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {(["APPLICANT", "EMPLOYER"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                padding: "16px",
                borderRadius: 12,
                border: `2px solid ${role === r ? "var(--accent)" : "var(--line-2)"}`,
                background: role === r ? "var(--accent-soft)" : "var(--card)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.12s ease",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>{r === "APPLICANT" ? "👤" : "🏢"}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                {r === "APPLICANT" ? "Job seeker" : "Employer"}
              </div>
              <div className="small" style={{ marginTop: 4 }}>
                {r === "APPLICANT" ? "Find & apply for jobs" : "Post jobs & hire"}
              </div>
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label={role === "EMPLOYER" ? "Company or your name" : "Full name"} required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "EMPLOYER" ? "Acme Ltd" : "Jane Smith"}
                autoComplete="name"
                required
              />
            </Field>

            <Field label="Email address" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password" hint="Min. 8 characters" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </Field>

            {/* GDPR consent — required under UK GDPR Art. 7 */}
            <label style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--ink-2)", cursor: "pointer", alignItems: "flex-start" }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 2, accentColor: "var(--accent)" }}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" style={{ color: "var(--accent)" }}>Terms of Use</Link> and consent to Orca Jobs processing my personal data
                in accordance with the{" "}
                <Link href="/privacy" style={{ color: "var(--accent)" }}>Privacy Policy</Link>.
                My data will be stored for up to 2 years and I can request deletion at any time.
              </span>
            </label>

            {error && (
              <div style={{ background: "color-mix(in srgb, var(--bad) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--bad) 25%, transparent)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--bad)" }}>
                {error}
              </div>
            )}

            <Button variant="primary" block type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--ink-2)" }}>
          Already have an account?{" "}
          <Link href={`/auth/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
