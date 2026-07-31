"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  const negociable = formData.get("negociable") === "on";

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
    negociable,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null, success: true };
}

export type UpdateProfileState = { error: string | null; success?: boolean };

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const city = formData.get("city")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const avatarEmoji = formData.get("avatar_emoji")?.toString() || "🙂";

  if (!name || !city) {
    return { error: "Le nom et la ville sont obligatoires." };
  }

  const { error } = await supabase
    .from("sellers")
    .update({
      name,
      city,
      description,
      avatar_emoji: avatarEmoji,
    })
    .eq("id", user.id);

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

// --- Négociation (offres persistantes) ---

export async function makeOfferAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const listingId = Number(formData.get("listingId"));
  const montant = Number(formData.get("montant"));

  if (!Number.isFinite(listingId) || !Number.isFinite(montant) || montant <= 0) {
    return;
  }

  await supabase.from("offers").upsert(
    {
      listing_id: listingId,
      buyer_id: user.id,
      montant_propose: montant,
      statut: "en_attente",
      conclue_par_acheteur: false,
      conclue_le: null,
    },
    { onConflict: "listing_id,buyer_id" }
  );

  revalidatePath(`/produits/${listingId}`);
}

export async function acceptCounterAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));
  const listingId = Number(formData.get("listingId"));

  await supabase
    .from("offers")
    .update({ statut: "acceptee" })
    .eq("id", offerId)
    .eq("buyer_id", user.id);

  revalidatePath(`/produits/${listingId}`);
}

export async function concludeTransactionAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));
  const listingId = Number(formData.get("listingId"));

  await supabase
    .from("offers")
    .update({ conclue_par_acheteur: true, conclue_le: new Date().toISOString() })
    .eq("id", offerId)
    .eq("buyer_id", user.id);

  revalidatePath(`/produits/${listingId}`);
}

export async function sellerRespondOfferAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));
  const decision = formData.get("decision")?.toString();
  const counterRaw = formData.get("montant")?.toString();

  if (decision === "accepter") {
    await supabase.from("offers").update({ statut: "acceptee" }).eq("id", offerId);
  } else if (decision === "refuser") {
    await supabase.from("offers").update({ statut: "refusee" }).eq("id", offerId);
  } else if (decision === "contre_offre") {
    const counter = Number(counterRaw);
    if (Number.isFinite(counter) && counter > 0) {
      await supabase
        .from("offers")
        .update({ statut: "contre_offre", montant_propose: counter })
        .eq("id", offerId);
    }
  }

  revalidatePath("/offres");
}
