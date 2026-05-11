"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  return (
    <Link href={href} className={clsx("nav-link", pathname.startsWith(href) && href !== "/" && "active", pathname === "/" && href === "/" && "active")}>
      {label}
    </Link>
  );
}

export function Nav() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(246,244,239,.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap" style={{ display: "flex", alignItems: "center", height: 60, gap: 4 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display, Newsreader, serif)",
            fontSize: 20,
            fontWeight: 400,
            color: "var(--ink)",
            marginRight: 24,
            letterSpacing: "-0.02em",
          }}
        >
          Orca Jobs
        </Link>

        {/* Public links */}
        <NavLink href="/jobs" label="Find jobs" />
        <NavLink href="/about" label="About" />

        {/* Employer / agency pages */}
        <NavLink href="/services" label="Services" />
        <NavLink href="/for-employers" label="For employers" />

        <div style={{ flex: 1 }} />

        {/* Auth-aware right side */}
        {!session ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="ghost" size="sm" href="/auth/login">Sign in</Button>
            <Button variant="primary" size="sm" href="/auth/signup">Get started</Button>
          </div>
        ) : role === "EMPLOYER" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink href="/employer/dashboard" label="Dashboard" />
            <NavLink href="/employer/jobs" label="My jobs" />
            <Button variant="primary" size="sm" href="/employer/jobs/new" style={{ marginLeft: 8 }}>Post a job</Button>
            <UserMenu name={session.user?.name} onSignOut={() => signOut({ callbackUrl: "/" })} />
          </div>
        ) : role === "ADMIN" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink href="/admin" label="Admin" />
            <UserMenu name={session.user?.name} onSignOut={() => signOut({ callbackUrl: "/" })} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NavLink href="/applicant/dashboard" label="Dashboard" />
            <NavLink href="/applicant/profile" label="My profile" />
            <UserMenu name={session.user?.name} onSignOut={() => signOut({ callbackUrl: "/" })} />
          </div>
        )}
      </div>
    </header>
  );
}

function UserMenu({ name, onSignOut }: { name?: string | null; onSignOut: () => void }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
      <div className="avatar" title={name ?? ""}>{initials}</div>
      <button
        onClick={onSignOut}
        className="nav-link"
        style={{ fontSize: 13 }}
      >
        Sign out
      </button>
    </div>
  );
}
