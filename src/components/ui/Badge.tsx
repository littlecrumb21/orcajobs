import { clsx } from "clsx";

type BadgeVariant = "default" | "accent" | "good" | "warn" | "bad" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span className={clsx("badge", variant !== "default" && variant, className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    ACTIVE:      { label: "Active",      variant: "good" },
    PENDING:     { label: "Pending",     variant: "warn" },
    DRAFT:       { label: "Draft",       variant: "default" },
    EXPIRED:     { label: "Expired",     variant: "bad" },
    CLOSED:      { label: "Closed",      variant: "default" },
    REJECTED:    { label: "Rejected",    variant: "bad" },
    SUBMITTED:   { label: "Submitted",   variant: "accent" },
    VIEWED:      { label: "Viewed",      variant: "default" },
    SHORTLISTED: { label: "Shortlisted", variant: "good" },
    INTERVIEW:   { label: "Interview",   variant: "warn" },
    OFFERED:     { label: "Offered",     variant: "good" },
    WITHDRAWN:   { label: "Withdrawn",   variant: "default" },
  };
  const { label, variant } = map[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={variant}>{label}</Badge>;
}
