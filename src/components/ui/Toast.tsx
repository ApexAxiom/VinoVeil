import { cn } from "../../lib/cn";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
}

export interface ToastProps {
  message: ToastMessage;
}

const toneStyles: Record<NonNullable<ToastMessage["tone"]>, string> = {
  success: "border-emerald-400/40 text-emerald-100",
  error: "border-red-400/40 text-red-100",
  info: "border-gold/40 text-parchment"
};

/** Render a single toast notification. */
export function Toast({ message }: ToastProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-cocoa/90 px-4 py-3 shadow-card",
        toneStyles[message.tone ?? "info"]
      )}
      role="status"
    >
      <p className="text-sm font-semibold">{message.title}</p>
      {message.description ? <p className="mt-1 text-xs opacity-80">{message.description}</p> : null}
    </div>
  );
}
