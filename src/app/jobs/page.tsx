import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { JobCard } from "@/components/jobs/JobCard";
import type { Prisma } from "@prisma/client";

interface SearchParams {
  q?: string;
  category?: string;
  workType?: string;
  contractType?: string;
  salaryMin?: string;
  featured?: string;
  page?: string;
}

const CATEGORIES = [
  { value: "", label: "All sectors" },
  { value: "marine", label: "⚓ Marine & Maritime" },
  { value: "hospitality", label: "🍽️ Hospitality & Tourism" },
  { value: "care", label: "❤️ Health & Social Care" },
  { value: "agri", label: "🌱 Agriculture" },
  { value: "trades", label: "🔧 Trades & Construction" },
  { value: "professional", label: "💼 Professional" },
  { value: "other", label: "📋 Other" },
];

const WORK_TYPES = [
  { value: "", label: "Any type" },
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

const CONTRACT_TYPES = [
  { value: "", label: "Any contract" },
  { value: "permanent", label: "Permanent" },
  { value: "temporary", label: "Temporary" },
  { value: "contract", label: "Contract" },
  { value: "apprenticeship", label: "Apprenticeship" },
];

const PAGE_SIZE = 20;

export default async function JobsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const where: Prisma.JobWhereInput = {
    status: "ACTIVE",
    ...(sp.q && {
      OR: [
        { title: { contains: sp.q, mode: "insensitive" } },
        { description: { contains: sp.q, mode: "insensitive" } },
        { employer: { companyName: { contains: sp.q, mode: "insensitive" } } },
      ],
    }),
    ...(sp.category && { category: sp.category }),
    ...(sp.workType && { workType: sp.workType }),
    ...(sp.contractType && { contractType: sp.contractType }),
    ...(sp.salaryMin && { salaryMin: { gte: Number(sp.salaryMin) } }),
    ...(sp.featured === "true" && { featured: true }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { employer: true },
      orderBy: [{ featured: "desc" }, { tier: "desc" }, { publishedAt: "desc" }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <Nav />
      <main>
        <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--line)", padding: "32px 0" }}>
          <div className="wrap">
            <h1 className="h2" style={{ marginBottom: 20 }}>Find jobs on the Isle of Wight</h1>
            <form style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                name="q"
                defaultValue={sp.q}
                placeholder="Job title or keyword…"
                className="input"
                style={{ flex: "1 1 260px", minWidth: 200 }}
              />
              <select name="category" defaultValue={sp.category} className="select" style={{ flex: "0 0 200px" }}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select name="workType" defaultValue={sp.workType} className="select" style={{ flex: "0 0 160px" }}>
                {WORK_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select name="contractType" defaultValue={sp.contractType} className="select" style={{ flex: "0 0 160px" }}>
                {CONTRACT_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <button type="submit" className="btn primary">Search</button>
            </form>
          </div>
        </div>

        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, padding: "32px 28px" }}>
          {/* Sidebar */}
          <aside>
            <div style={{ position: "sticky", top: 80 }}>
              <div className="micro" style={{ marginBottom: 12 }}>Filters</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="/jobs" className={`side-link ${!sp.category ? "active" : ""}`}>All sectors</a>
                {CATEGORIES.slice(1).map((c) => (
                  <a key={c.value} href={`/jobs?category=${c.value}`} className={`side-link ${sp.category === c.value ? "active" : ""}`}>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span className="small">{total} {total === 1 ? "job" : "jobs"} found{sp.q ? ` for "${sp.q}"` : ""}</span>
            </div>

            {jobs.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
                <div className="h4" style={{ marginBottom: 8 }}>No jobs found</div>
                <p className="small">Try different keywords or broaden your filters.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/jobs?${new URLSearchParams({ ...sp, page: String(p) })}`}
                    className={`btn ${p === page ? "primary" : "ghost"} sm`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
