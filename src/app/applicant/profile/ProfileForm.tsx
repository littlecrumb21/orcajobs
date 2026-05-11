"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import type { ApplicantProfile, WorkHistory } from "@prisma/client";

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately" },
  { value: "1_month", label: "1 month notice" },
  { value: "3_months", label: "3 months notice" },
  { value: "6_months", label: "6 months notice" },
];

const RIGHT_TO_WORK_OPTIONS = [
  { value: "uk_citizen", label: "UK Citizen / Settled Status" },
  { value: "eu_settled", label: "EU Settled Scheme" },
  { value: "visa_required", label: "Requires Visa Sponsorship" },
  { value: "student_visa", label: "Student Visa" },
];

interface Props {
  profile: (ApplicantProfile & { workHistory?: WorkHistory[] }) | null;
  workHistory: WorkHistory[];
  userId: string;
}

export function ProfileForm({ profile, workHistory, userId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    firstName:   profile?.firstName ?? "",
    lastName:    profile?.lastName ?? "",
    phone:       profile?.phone ?? "",
    location:    profile?.location ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    headline:    profile?.headline ?? "",
    bio:         profile?.bio ?? "",
    jobTitle:    profile?.jobTitle ?? "",
    salaryMin:   profile?.salaryMin?.toString() ?? "",
    salaryMax:   profile?.salaryMax?.toString() ?? "",
    availability: profile?.availability ?? "",
    workTypes:   profile?.workTypes ?? "",
    rightToWork: profile?.rightToWork ?? "",
    skills:      profile?.skills ?? "",
    marketingConsent: profile?.marketingConsent ?? false,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    // Upload CV first if one was selected
    let cvUrl = profile?.cvUrl;
    let cvFileName = profile?.cvFileName;
    if (cvFile) {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: cvFile.name, contentType: cvFile.type, folder: "cvs" }),
      });
      if (uploadRes.ok) {
        const { url, publicUrl } = await uploadRes.json();
        await fetch(url, { method: "PUT", body: cvFile, headers: { "Content-Type": cvFile.type } });
        cvUrl = publicUrl;
        cvFileName = cvFile.name;
      }
    }

    const res = await fetch("/api/applicant/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cvUrl, cvFileName }),
    });

    if (!res.ok) {
      setError("Failed to save. Please try again.");
    } else {
      setSaved(true);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Personal details */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Personal details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="First name" required>
            <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
          </Field>
          <Field label="Last name" required>
            <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
          </Field>
          <Field label="Phone" hint="Not shown publicly">
            <Input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 900000" />
          </Field>
          <Field label="Location" hint="Town or area only">
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Newport, Isle of Wight" />
          </Field>
        </div>
        <div style={{ marginTop: 16 }}>
          <Field label="LinkedIn URL">
            <Input type="url" value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
          </Field>
        </div>
      </div>

      {/* Professional summary */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Professional summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Headline" hint="One line that describes you">
            <Input value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Marine Engineer with 8 years' experience" />
          </Field>
          <Field label="About me">
            <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="A brief summary of your background, skills, and what you're looking for…" style={{ minHeight: 120 }} />
          </Field>
          <Field label="Skills" hint="Comma-separated">
            <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Welding, CAD, Project management…" />
          </Field>
        </div>
      </div>

      {/* Job preferences */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 20 }}>Job preferences</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Desired job title">
            <Input value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
          </Field>
          <Field label="Availability">
            <Select value={form.availability} onChange={(e) => set("availability", e.target.value)} options={AVAILABILITY_OPTIONS} placeholder="When can you start?" />
          </Field>
          <Field label="Min salary (£/yr)">
            <Input type="number" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="25000" />
          </Field>
          <Field label="Max salary (£/yr)">
            <Input type="number" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="35000" />
          </Field>
        </div>
        <div style={{ marginTop: 16 }}>
          <Field label="Right to work in the UK">
            <Select value={form.rightToWork} onChange={(e) => set("rightToWork", e.target.value)} options={RIGHT_TO_WORK_OPTIONS} placeholder="Select…" />
          </Field>
        </div>
      </div>

      {/* CV upload */}
      <div className="card" style={{ padding: 28 }}>
        <div className="h4" style={{ marginBottom: 8 }}>CV</div>
        {profile?.cvFileName && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "10px 14px", background: "var(--bg-soft)", borderRadius: 8 }}>
            <span>📄</span>
            <span style={{ fontSize: 14, flex: 1 }}>{profile.cvFileName}</span>
            <span className="badge good">Uploaded</span>
          </div>
        )}
        <Field label={profile?.cvFileName ? "Replace CV" : "Upload CV"} hint="PDF, DOC or DOCX · max 5 MB">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="input"
            style={{ padding: "8px 12px" }}
          />
        </Field>
        <p className="small" style={{ marginTop: 8, lineHeight: 1.5 }}>
          Your CV is only shared with employers you apply to. You can delete it at any time from{" "}
          <a href="/gdpr" style={{ color: "var(--accent)" }}>your data settings</a>.
        </p>
      </div>

      {/* GDPR marketing consent */}
      <div className="card" style={{ padding: 20 }}>
        <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start", fontSize: 14 }}>
          <input
            type="checkbox"
            checked={form.marketingConsent}
            onChange={(e) => set("marketingConsent", e.target.checked)}
            style={{ marginTop: 2, accentColor: "var(--accent)" }}
          />
          <span style={{ color: "var(--ink-2)", lineHeight: 1.5 }}>
            I'm happy to receive job alerts and relevant updates from Orca Jobs by email. I can unsubscribe at any time.
          </span>
        </label>
      </div>

      {error && (
        <div style={{ background: "color-mix(in srgb, var(--bad) 10%, transparent)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "var(--bad)" }}>
          {error}
        </div>
      )}

      {saved && (
        <div style={{ background: "color-mix(in srgb, var(--good) 10%, transparent)", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "var(--good)" }}>
          ✓ Profile saved successfully.
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
        <Button variant="ghost" href="/applicant/dashboard">Back to dashboard</Button>
      </div>
    </form>
  );
}
