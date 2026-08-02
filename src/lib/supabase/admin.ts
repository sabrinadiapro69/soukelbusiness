import { createClient } from "@supabase/supabase-js";

// Client privilégié (clé service_role) — contourne RLS. À n'utiliser que
// dans des Server Actions déjà protégées par requireAdmin(), jamais
// exposé ou importé côté client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
