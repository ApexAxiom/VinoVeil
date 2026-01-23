import { useEffect } from "react";
import { cn } from "../../lib/cn";

export interface ModalProps {
  /** Open state of modal. */
  open: boolean;
  /** Modal title for accessibility. */
  title: string;
  /** Close callback. */
  onClose: () => void;
  /** Modal body content. */
  children: React.ReactNode;
  /** Optional className. */
  className?: string;
}

/** Accessible modal dialog with overlay. */
export function Modal({ open, title, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("glass-card relative z-10 w-full max-w-2xl p-8", className)}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-3xl text-gold">{title}</h2>
          <button
            type="button"
            className="text-parchment/70 transition hover:text-parchment"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-6 text-parchment/80">{children}</div>
      </div>
    </div>
  );
}
