"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 24, color: "var(--ink)" }}>
            Orca Jobs
          </Link>
          <h1 style={{ marginTop: 24, marginBottom: 8, fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 28, fontWeight: 400 }}>
            Welcome back
          </h1>
          <p className="small">Sign in to your account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Field>

            {error && (
              <div style={{ background: "color-mix(in srgb, var(--bad) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--bad) 25%, transparent)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "var(--bad)" }}>
                {error}
              </div>
            )}

            <Button variant="primary" block type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <div style={{ textAlign: "right" }}>
              <Link href="/auth/forgot-password" className="small" style={{ color: "var(--accent)" }}>
                Forgot password?
              </Link>
            </div>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--ink-2)" }}>
          Don't have an account?{" "}
          <Link href={`/auth/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} style={{ color: "var(--accent)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
