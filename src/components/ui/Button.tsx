import { clsx } from "clsx";
import Link from "next/link";

type Variant = "primary" | "ghost" | "subtle" | "default";
type Size = "sm" | "default" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  block?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "primary",
  ghost: "ghost",
  subtle: "subtle",
  default: "",
};

const sizeClass: Record<Size, string> = {
  sm: "sm",
  default: "",
  lg: "lg",
};

export function Button({
  variant = "default",
  size = "default",
  href,
  block,
  className,
  children,
  ...props
}: ButtonProps) {
  const cls = clsx(
    "btn",
    variantClass[variant],
    sizeClass[size],
    block && "block",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
