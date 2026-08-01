"use client";

import { useEffect, useRef, useState } from "react";

export default function WilayaSwitcher({
  wilayas,
  changeLabel,
  action,
}: {
  wilayas: string[];
  changeLabel: string;
  action: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <span ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="cursor-pointer text-xs opacity-60 underline decoration-1 underline-offset-2"
      >
        · {changeLabel}
      </button>

      {open && (
        <div className="absolute top-full right-0 z-30 mt-2 max-h-64 w-48 overflow-y-auto rounded-xl border border-line bg-paper py-2 text-ink shadow-lg sm:left-0 sm:w-56">
          {wilayas.map((w) => (
            <form key={w} action={action}>
              <input type="hidden" name="wilaya" value={w} />
              <button
                type="submit"
                className="block w-full px-4 py-1.5 text-left text-[13px] font-medium hover:bg-bg-alt"
              >
                {w}
              </button>
            </form>
          ))}
        </div>
      )}
    </span>
  );
}
