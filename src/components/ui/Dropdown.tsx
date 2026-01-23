import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/cn";

export interface DropdownItem {
  label: string;
  onSelect: () => void;
}

export interface DropdownProps {
  /** Label for trigger button. */
  label: string;
  /** Menu items. */
  items: DropdownItem[];
}

/** Simple accessible dropdown menu. */
export function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="rounded-full border border-gold/60 px-4 py-2 text-sm text-gold"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute right-0 z-20 mt-3 min-w-[12rem] rounded-2xl border border-gold/20 bg-cocoa/95 p-2 text-sm text-parchment shadow-card"
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
