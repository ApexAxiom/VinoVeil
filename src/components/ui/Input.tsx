import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional label for accessibility. */
  label?: string;
  /** Error message for field. */
  error?: string;
}

/** Styled input control with label and error support. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="flex flex-col gap-2 text-sm text-parchment/80" htmlFor={inputId}>
        {label ? <span className="text-xs uppercase tracking-[0.2em] text-gold/80">{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-3xl border border-gold/40 bg-cocoa/70 px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 transition focus:border-gold focus:outline-none",
            error && "border-red-400 focus:border-red-400",
            className
          )}
          {...props}
        />
        {error ? <span className="text-xs text-red-300">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = "Input";
