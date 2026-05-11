import Link from "next/link";
import type { Job, EmployerProfile } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";

type JobWithEmployer = Job & { employer: EmployerProfile };

function formatSalary(min?: number | null, max?: number | null, period?: string | null, isPublic?: boolean) {
  if (!isPublic || (!min && !max)) return null;
  const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;
  const suffix = period === "hour" ? "/hr" : period === "day" ? "/day" : "/yr";
  if (min && max) return `${fmt(min)} – ${fmt(max)}${suffix}`;
  if (min) return `From ${fmt(min)}${suffix}`;
  if (max) return `Up to ${fmt(max)}${suffix}`;
  return null;
}

const categoryEmoji: Record<string, string> = {
  marine: "⚓",
  hospitality: "🍽️",
  care: "❤️",
  agri: "🌱",
  trades: "🔧",
  professional: "💼",
  other: "📋",
};

export function JobCard({ job }: { job: JobWithEmployer }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod, job.salaryPublic);
  const emoji = categoryEmoji[job.category] ?? "📋";

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div
        className="card job-card"
        style={{
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "start",
          background: job.featured ? "linear-gradient(135deg, #fff8f6, #fff)" : "var(--card)",
          borderColor: job.featured ? "var(--accent-soft)" : "var(--line)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            {job.featured && <Badge variant="accent">Featured</Badge>}
            {job.tier === "PREMIUM" && <Badge variant="accent">Premium</Badge>}
            <span className="small">{emoji} {job.category.charAt(0).toUpperCase() + job.category.slice(1)}</span>
          </div>

          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: "var(--ink)" }}>
            {job.title}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 10 }}>
            {job.employer.companyName}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 13, color: "var(--muted)" }}>
            <span>📍 {job.location}</span>
            <span style={{ color: "var(--line-2)" }}>·</span>
            <span>{job.workType.replace("_", " ")}</span>
            <span style={{ color: "var(--line-2)" }}>·</span>
            <span>{job.contractType}</span>
            {salary && (
              <>
                <span style={{ color: "var(--line-2)" }}>·</span>
                <span style={{ color: "var(--good)", fontWeight: 500 }}>{salary}</span>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: 80 }}>
          {job.publishedAt && (
            <div className="small">
              {Math.floor((Date.now() - new Date(job.publishedAt).getTime()) / 86400000)}d ago
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
