import { cn } from "../../lib/cn";

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

/** Quantity stepper control. */
export function QuantityStepper({ value, min = 1, max = 99, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gold/40 bg-cocoa/80">
      <button
        type="button"
        className={cn("px-3 py-2 text-gold", value <= min && "opacity-40")}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        disabled={value <= min}
      >
        -
      </button>
      <span className="px-4 text-sm text-parchment">{value}</span>
      <button
        type="button"
        className={cn("px-3 py-2 text-gold", value >= max && "opacity-40")}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
