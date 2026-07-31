"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export type CreateListingState = { error: string | null; success?: boolean };

export async function createListingAction(
  _prevState: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const title = formData.get("title")?.toString().trim() ?? "";
  const priceRaw = formData.get("price")?.toString() ?? "";
  const category = formData.get("category")?.toString() ?? "";
  const location = formData.get("location")?.toString().trim() ?? "";
  const emoji = formData.get("emoji")?.toString() || "🛍️";
  const description = formData.get("description")?.toString().trim() ?? "";

  const price = Number(priceRaw);

  if (!title || !category || !location || !description) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Le prix doit être un nombre positif." };
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: user.id,
    title,
    price,
    category,
    location,
    emoji,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null, success: true };
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const { data: seller } = await supabase
    .from("sellers")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!seller?.is_admin) redirect("/");

  return supabase;
}

export async function approveListingAction(formData: FormData) {
  const supabase = await requireAdmin();
  const listingId = Number(formData.get("listingId"));
  await supabase
    .from("listings")
    .update({ status: "approved" })
    .eq("id", listingId);
  redirect("/admin");
}

export async function rejectListingAction(formData: FormData) {
  const supabase = await requireAdmin();
  const listingId = Number(formData.get("listingId"));
  await supabase
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId);
  redirect("/admin");
}
