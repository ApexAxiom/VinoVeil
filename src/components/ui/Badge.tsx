import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional color style. */
  tone?: "gold" | "burgundy" | "neutral";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  gold: "border-gold/50 text-gold",
  burgundy: "border-burgundy/70 text-burgundy",
  neutral: "border-white/20 text-parchment/70"
};

/** Pill badge for metadata labels. */
export function Badge({ tone = "gold", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.32em]",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
