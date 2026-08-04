"use client";

import { useEffect, useRef, useState } from "react";

export default function WilayaSwitcher({
  wilayas,
  wilayasAlgerie,
  franceGroupLabel,
  algerieGroupLabel,
  changeLabel,
  action,
}: {
  wilayas: string[];
  wilayasAlgerie: string[];
  franceGroupLabel: string;
  algerieGroupLabel: string;
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
          <div className="px-4 pt-1 pb-1 text-[10.5px] font-semibold tracking-wide text-ink-soft/70 uppercase">
            {franceGroupLabel}
          </div>
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
          <div className="mt-1 border-t border-line px-4 pt-2 pb-1 text-[10.5px] font-semibold tracking-wide text-ink-soft/70 uppercase">
            {algerieGroupLabel}
          </div>
          {wilayasAlgerie.map((w) => (
            <button
              key={w}
              type="button"
              disabled
              className="block w-full cursor-not-allowed px-4 py-1.5 text-left text-[13px] font-medium text-ink-soft/40"
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
