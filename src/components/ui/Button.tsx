import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. */
  variant?: ButtonVariant;
  /** Button size. */
  size?: ButtonSize;
  /** Loading state disables and shows shimmer. */
  loading?: boolean;
}

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

/** Primary button component for VinoVeil UI. */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70",
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && "cursor-not-allowed opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-pulse rounded-full bg-white/60" /> : null}
      {children}
    </button>
  );
}
