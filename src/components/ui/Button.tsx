import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-gold to-amber text-night shadow-glow hover:shadow-[0_0_50px_rgba(201,166,107,0.55)]",
  secondary:
    "border border-gold/70 bg-gold/5 text-gold hover:border-gold hover:bg-gold/10",
  ghost: "border border-transparent text-parchment hover:bg-white/10",
  destructive: "bg-burgundy text-ivory hover:bg-burgundy/80"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-7 py-3.5 text-lg"
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night";

export function buttonSurfaceClassName(options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { variant = "primary", size = "md", className, disabled, loading } = options ?? {};
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-luxe",
    focusRing,
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && "cursor-not-allowed opacity-70",
    className
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** When set, renders a styled anchor (for external checkout links). */
  href?: string;
  target?: string;
  rel?: string;
}

/** Primary button (or anchor when `href` is set) for VinoVeil UI. */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  href,
  type = "button",
  target,
  rel,
  ...rest
}: ButtonProps) {
  const surface = buttonSurfaceClassName({ variant, size, className, disabled, loading });

  if (href) {
    return (
      <a
        href={href}
        className={surface}
        aria-disabled={disabled || loading}
        target={target}
        rel={rel}
        {...(rest as Record<string, unknown>)}
      >
        {loading ? <span className="h-4 w-4 animate-pulse rounded-full bg-white/60" /> : null}
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={surface} disabled={disabled || loading} {...rest}>
      {loading ? <span className="h-4 w-4 animate-pulse rounded-full bg-white/60" /> : null}
      {children}
    </button>
  );
}
