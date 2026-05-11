import { clsx } from "clsx";

interface CardProps {
  elevated?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}

const paddingClass = {
  none: "",
  sm:   "p-4",
  md:   "p-6",
  lg:   "p-8",
};

export function Card({ elevated, padding = "md", className, children }: CardProps) {
  return (
    <div className={clsx("card", elevated && "elev", paddingClass[padding], className)}>
      {children}
    </div>
  );
}
