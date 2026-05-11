"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { PRICING } from "@/lib/stripe";

const CATEGORIES = [
  { value: "marine", label: "⚓ Marine & Maritime" },
  { value: "hospitality", label: "🍽️ Hospitality & Tourism" },
  { value: "care", label: "❤️ Health & Social Care" },
  { value: "agri", label: "🌱 Agriculture" },
  { value: "trades", label: "🔧 Trades & Construction" },
  { value: "professional", label: "💼 Professional" },
  { value: "other", label: "📋 Other" },
];

const CONTRACT_TYPES = [
  { value: "permanent", label: "Permanent" },
  { value: "temporary", label: "Temporary" },
  { value: "contract", label: "Contract" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

const WORK_TYPES = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

type Tier = "BASIC" | "FEATURED" | "PREMIUM";

interface Props {
  employerId: string;
}

export function PostJobForm({ employerId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "tier" | "paying">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>("BASIC");
  const [jobId, setJobId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "professional",
    contractType: "permanent",
    workType: "full_time",
    location: "Isle of Wight",
    description: "",
    summary: "",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "year",
    salaryPublic: true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, employerId, status: "DRAFT", tier: selectedTier }),
    });

    if (!res.ok) {
      setError("Failed to save. Please try again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setJobId(data.id);
    setStep("tier");
    setLoading(false);
  }

  async function handlePayment() {
    if (!jobId) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, tier: selectedTier }),
    });

    if (!res.ok) {
      setError("Payment setup failed. Please try again.");
      setLoading(false);
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  const pricing = PRICING[selectedTier];

  if (step === "tier") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="h4">Choose your listing tier</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {(Object.entries(PRICING) as [Tier, typeof PRICING.BASIC][]).map(([key, p]) => (
            <div
              key={key}
              onClick={() => setSelectedTier(key)}
              style={{
                border: `2px solid ${selectedTier === key ? "var(--accent)" : "var(--line-2)"}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                background: selectedTier === key ? "var(--accent-soft)" : "var(--card)",
                transition: "all 0.12s ease",
              }}
            >
              <div style={{ fontFamily: "var(--font-display, Newsreader, serif)", fontSize: 28, color: selectedTier === key ? "var(--accent)" : "var(--ink)", marginBottom: 4 }}>
                £{(p.amountPence / 100).toFixed(0)}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.label}</div>
              <div className="small" style={{ marginBottom: 12 }}>{p.description}</div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map((f) => (
                  <li key={f} className="small" style={{ display: "flex", gap: 6 }}>
                    <span style={{ color: "var(--good)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: "color-mix(in srgb, var(--bad) 10%, transparent)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "var(--bad)" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--bg-soft)", borderRadius: 12 }}>
          <div>
            <div style={{ fontWeight: 600 }}>{form.title}</div>
            <div className="small">{pricing.label} · {pricing.days} days · £{(pricing.amountPence / 100).toFixed(0)}</div>
          </div>
          <Button variant="primary" size="lg" onClick={handlePayment} disabled={loading}>
            {loading ? "Redirecting…" : `Pay £${(pricing.amountPence / 100).toFixed(0)}`}
          </Button>
        </div>

        <p className="small" style={{ color: "var(--muted)", textAlign: "center" }}>
          Secure payment via Stripe · Jobs go live after a quick moderation check · 100% refund if rejected
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Job basics */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Job details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Job title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Marine Engineer" required />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Category" required>
              <Select value={form.category} onChange={(e) => set("category", e.target.value)} options={CATEGORIES} />
            </Field>
            <Field label="Contract type" required>
              <Select value={form.contractType} onChange={(e) => set("contractType", e.target.value)} options={CONTRACT_TYPES} />
            </Field>
            <Field label="Work type" required>
              <Select value={form.workType} onChange={(e) => set("workType", e.target.value)} options={WORK_TYPES} />
            </Field>
            <Field label="Location" required>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Newport, Isle of Wight" required />
            </Field>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Salary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Field label="Min salary (£)">
            <Input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="25000" />
          </Field>
          <Field label="Max salary (£)">
            <Input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="35000" />
          </Field>
          <Field label="Per">
            <Select
              value={form.salaryPeriod}
              onChange={(e) => set("salaryPeriod", e.target.value)}
              options={[{ value: "year", label: "Year" }, { value: "hour", label: "Hour" }, { value: "day", label: "Day" }]}
            />
          </Field>
        </div>
        <label style={{ display: "flex", gap: 8, marginTop: 12, cursor: "pointer", fontSize: 13, color: "var(--ink-2)" }}>
          <input type="checkbox" checked={form.salaryPublic} onChange={(e) => set("salaryPublic", e.target.checked)} style={{ accentColor: "var(--accent)" }} />
          Show salary on listing
        </label>
      </div>

      {/* Description */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Job description</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Short summary" hint="Shown in search results (max 200 chars)">
            <Input value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="A brief one-sentence teaser…" maxLength={200} />
          </Field>
          <Field label="Full description" required>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the role, responsibilities, requirements, and what makes your company a great place to work…"
              style={{ minHeight: 280 }}
              required
            />
          </Field>
        </div>
      </div>

      {error && (
        <div style={{ background: "color-mix(in srgb, var(--bad) 10%, transparent)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "var(--bad)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Saving…" : "Continue to payment →"}
        </Button>
        <Button variant="ghost" href="/employer/dashboard">Cancel</Button>
      </div>
    </form>
  );
}
