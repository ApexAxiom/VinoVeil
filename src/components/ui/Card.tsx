import { cn } from "../../lib/cn";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional padded card style. */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

/** Elevated card container. */
export function Card({ padding = "md", className, ...props }: CardProps) {
  return (
    <div className={cn("glass-card", paddingStyles[padding], className)} {...props} />
  );
}
