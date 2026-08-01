"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

type AccountLink = { href: string; label: string };

export default function ProfileMenu({
  displayName,
  accountLinks,
  profilLabel,
  bonjourLabel,
  deconnexionLabel,
}: {
  displayName?: string;
  accountLinks: AccountLink[];
  profilLabel: string;
  bonjourLabel: string;
  deconnexionLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const initial = (displayName ?? "?").charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line py-1.5 pr-3.5 pl-1.5 text-sm font-medium transition-colors hover:border-ink"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-xs font-bold text-white">
          {initial}
        </span>
        <span className="max-w-[110px] truncate text-ink-soft">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-20 mt-2 w-56 rounded-xl border border-line bg-paper py-2 shadow-lg">
          <div className="border-b border-line px-4 pb-2">
            <span className="text-xs text-ink-soft">
              {bonjourLabel} {displayName}
            </span>
          </div>
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm font-medium hover:bg-bg-alt"
          >
            {profilLabel}
          </Link>
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm font-medium hover:bg-bg-alt"
            >
              {link.label}
            </Link>
          ))}
          <form action={signOutAction} className="border-t border-line mt-1 pt-1">
            <button
              type="submit"
              className="block w-full px-4 py-2 text-left text-sm font-medium text-ink-soft hover:bg-bg-alt"
            >
              {deconnexionLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
