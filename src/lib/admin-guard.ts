import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Vérifie le rôle admin. Appelé à la fois par admin/layout.tsx (pour
// rediriger immédiatement) et par chaque page /admin/* individuellement :
// Next.js peut réutiliser le rendu d'un layout entre deux pages soeurs
// sans le ré-exécuter, donc on ne se fie pas uniquement au layout pour
// une vérification de sécurité.
export async function requireAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: seller } = await supabase
    .from("sellers")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (seller?.role !== "admin") redirect("/");

  return { adminClient: createAdminClient(), adminId: user.id };
}
