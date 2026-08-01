"use client";

import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

type NavLink = { href: string; label: string };

export default function MobileMenu({
  navLinks,
  isLoggedIn,
  displayName,
  bonjourLabel,
  deconnexionLabel,
  connexionLabel,
  inscriptionLabel,
  deposerLabel,
}: {
  navLinks: NavLink[];
  isLoggedIn: boolean;
  displayName?: string;
  bonjourLabel: string;
  deconnexionLabel: string;
  connexionLabel: string;
  inscriptionLabel: string;
  deposerLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-line bg-paper px-6 py-4 shadow-lg">
          <nav className="flex flex-col gap-1 text-[15px] font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 hover:bg-bg-alt"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className="px-2 py-1.5 text-sm font-medium text-ink-soft"
                >
                  {bonjourLabel} {displayName}
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink"
                  >
                    {deconnexionLabel}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/inscription"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-ink"
                >
                  {inscriptionLabel}
                </Link>
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="px-2 py-1.5 text-center text-sm font-medium text-ink-soft"
                >
                  {connexionLabel}
                </Link>
              </>
            )}
            <Link
              href="/publier"
              onClick={() => setOpen(false)}
              className="rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              {deposerLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
