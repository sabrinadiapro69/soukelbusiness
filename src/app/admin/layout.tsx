import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireAdminPage } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const t = dict.admin;

  const navItems = [
    { href: "/admin/dashboard", label: t.navDashboard },
    { href: "/admin/signalements", label: t.navSignalements },
    { href: "/admin/talentueux", label: t.navTalentueux },
    { href: "/admin/boutiques", label: t.navBoutiques },
    { href: "/admin/utilisateurs", label: t.navUtilisateurs },
    { href: "/admin/annonces", label: t.navAnnonces },
    { href: "/admin/journal", label: t.navJournal },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <div className="border-b border-line bg-bg-alt">
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 py-3 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-4 py-2 transition-colors hover:bg-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
