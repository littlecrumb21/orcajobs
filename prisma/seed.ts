// Seed script — creates one admin user and a few sample jobs
// Run with: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminHash = await bcrypt.hash("admin-change-me-123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@orca.jobs" },
    update: {},
    create: {
      email: "admin@orca.jobs",
      name: "Admin",
      password: adminHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("Admin user:", admin.email);

  // Sample employer
  const employerHash = await bcrypt.hash("password123", 12);
  const employerUser = await prisma.user.upsert({
    where: { email: "demo-employer@orca.jobs" },
    update: {},
    create: {
      email: "demo-employer@orca.jobs",
      name: "Wight Shipyard",
      password: employerHash,
      role: "EMPLOYER",
      emailVerified: new Date(),
    },
  });

  const employer = await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: "Wight Shipyard Ltd",
      companySlug: "wight-shipyard",
      description: "The Isle of Wight's leading marine engineering and repair yard, based in Cowes since 1962.",
      industry: "marine",
      size: "51-200",
      location: "Cowes, Isle of Wight",
      verified: true,
      verifiedAt: new Date(),
    },
  });

  // Sample jobs
  const jobs = [
    {
      title: "Senior Marine Engineer",
      slug: "senior-marine-engineer-wight-shipyard",
      category: "marine",
      contractType: "permanent",
      workType: "full_time",
      location: "Cowes, Isle of Wight",
      description: "We are looking for an experienced Senior Marine Engineer to join our busy yard in Cowes. You will oversee maintenance and repair of a range of vessels from leisure craft to commercial ferries.\n\nResponsibilities:\n- Engine and mechanical system maintenance\n- Supervising junior engineers\n- Working closely with clients\n- Safety compliance\n\nRequirements:\n- 5+ years marine engineering experience\n- OOW certificate or equivalent\n- Strong attention to detail\n- Full right to work in the UK",
      summary: "Experienced marine engineer needed for busy Cowes yard — permanent role, competitive salary.",
      salaryMin: 38000,
      salaryMax: 48000,
      salaryPeriod: "year",
      salaryPublic: true,
      tier: "FEATURED" as const,
      featured: true,
      status: "ACTIVE" as const,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 86400000),
    },
    {
      title: "Head Chef",
      slug: "head-chef-ryde-hotel",
      category: "hospitality",
      contractType: "permanent",
      workType: "full_time",
      location: "Ryde, Isle of Wight",
      description: "We're seeking a passionate Head Chef to lead our kitchen at one of the island's most popular seafront hotels. You'll create seasonal menus using local produce from across the island.\n\nWhat we offer:\n- Competitive salary + tips\n- Staff meals\n- Flexible rota\n- Genuine career progression\n\nYou'll have:\n- 3+ years as Head or Sous Chef\n- Strong knowledge of allergen requirements\n- Team leadership experience",
      summary: "Head Chef for busy Ryde seafront hotel — seasonal menus, local produce, great team.",
      salaryMin: 32000,
      salaryMax: 40000,
      salaryPeriod: "year",
      salaryPublic: true,
      tier: "BASIC" as const,
      featured: false,
      status: "ACTIVE" as const,
      publishedAt: new Date(Date.now() - 2 * 86400000),
      expiresAt: new Date(Date.now() + 28 * 86400000),
    },
    {
      title: "Care Worker",
      slug: "care-worker-newport",
      category: "care",
      contractType: "permanent",
      workType: "part_time",
      location: "Newport, Isle of Wight",
      description: "Join our dedicated care team supporting adults with learning disabilities in our Newport residential home.\n\nFull training provided — no experience necessary. What matters most is your compassion, reliability, and willingness to learn.\n\nWe offer:\n- Competitive hourly rate\n- Regular hours with some weekend shifts\n- Pension scheme\n- Training and career development\n- DBS check paid by us",
      summary: "Care Worker role in Newport — full training given, compassionate and reliable candidates welcome.",
      salaryMin: 12,
      salaryMax: 13,
      salaryPeriod: "hour",
      salaryPublic: true,
      tier: "BASIC" as const,
      featured: false,
      status: "ACTIVE" as const,
      publishedAt: new Date(Date.now() - 5 * 86400000),
      expiresAt: new Date(Date.now() + 25 * 86400000),
    },
  ];

  for (const jobData of jobs) {
    await prisma.job.upsert({
      where: { slug: jobData.slug },
      update: {},
      create: { ...jobData, employerId: employer.id },
    });
    console.log("Job:", jobData.title);
  }

  console.log("\nSeed complete. Admin login: admin@orca.jobs / admin-change-me-123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
