"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { locales, type Locale } from "@/lib/i18n/locale";
import {
  sendListingApprovedEmail,
  sendListingRejectedEmail,
  sendTalentApprovedEmail,
  sendTalentRejectedEmail,
  sendWarningEmail,
  sendSuspensionEmail,
} from "@/lib/email";

async function getUserEmail(userId: string): Promise<string | null> {
  const adminClient = createAdminClient();
  const { data } = await adminClient.auth.admin.getUserById(userId);
  return data?.user?.email ?? null;
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function setLocaleAction(formData: FormData) {
  const locale = formData.get("locale")?.toString();

  if (locales.includes(locale as Locale)) {
    const cookieStore = await cookies();
    cookieStore.set("locale", locale as string, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const referer = (await headers()).get("referer");
  redirect(referer || "/");
}

export async function saveSearchAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const query = formData.get("query")?.toString() ?? "";
  const category = formData.get("category")?.toString() ?? "Toutes catégories";
  const wilaya = formData.get("wilaya")?.toString() || null;
  const commune = formData.get("commune")?.toString() || null;

  await supabase.from("saved_searches").insert({
    user_id: user.id,
    query,
    category,
    wilaya,
    commune,
  });

  revalidatePath("/mes-recherches");

  const referer = (await headers()).get("referer") || "/produits";
  const separator = referer.includes("?") ? "&" : "?";
  redirect(`${referer}${separator}saved=1`);
}

export async function deleteSavedSearchAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const id = formData.get("id")?.toString();
  if (id) {
    await supabase
      .from("saved_searches")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }

  revalidatePath("/mes-recherches");
  redirect("/mes-recherches");
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
  const commune = formData.get("commune")?.toString().trim() || null;
  const emoji = formData.get("emoji")?.toString() || "🛍️";
  const description = formData.get("description")?.toString().trim() ?? "";
  const isDon = formData.get("don") === "on";
  const negociable = !isDon && formData.get("negociable") === "on";
  const photoFiles = [
    formData.get("photo1"),
    formData.get("photo2"),
    formData.get("photo3"),
  ].filter(
    (f): f is File =>
      f instanceof File && f.size > 0 && f.type.startsWith("image/")
  );

  const price = isDon ? 0 : Number(priceRaw);

  if (!title || !category || !location || !description) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!isDon && (!Number.isFinite(price) || price <= 0)) {
    return { error: "Le prix doit être un nombre positif." };
  }
  if (photoFiles.length === 0) {
    return { error: "Merci d'ajouter au moins une photo." };
  }
  if (photoFiles.length > 3) {
    return { error: "Vous ne pouvez ajouter que 3 photos maximum." };
  }
  if (photoFiles.some((f) => f.size > MAX_PHOTO_SIZE)) {
    return { error: "Chaque photo doit faire moins de 5 Mo." };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", user.id)
    .gte("created_at", oneHourAgo);

  if ((recentCount ?? 0) >= 10) {
    return {
      error:
        "Vous avez publié trop d'annonces récemment. Merci de réessayer dans une heure.",
    };
  }

  const photoPaths: string[] = [];
  for (const file of photoFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("listing-photos")
      .upload(path, file, { contentType: file.type });
    if (uploadError) {
      return { error: "L'envoi d'une photo a échoué. Merci de réessayer." };
    }
    photoPaths.push(path);
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: user.id,
    title,
    price,
    category,
    location,
    commune,
    emoji,
    photos: photoPaths,
    description,
    negociable,
    is_don: isDon,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null, success: true };
}

export type UpdateListingState = { error: string | null };

export async function updateListingAction(
  _prevState: UpdateListingState,
  formData: FormData
): Promise<UpdateListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const listingId = Number(formData.get("listingId"));

  const { data: existing } = await supabase
    .from("listings")
    .select("status, photos")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (!existing) {
    return { error: "Annonce introuvable." };
  }
  if (existing.status === "vendu") {
    return { error: "Une annonce vendue ne peut plus être modifiée." };
  }

  const title = formData.get("title")?.toString().trim() ?? "";
  const priceRaw = formData.get("price")?.toString() ?? "";
  const category = formData.get("category")?.toString() ?? "";
  const location = formData.get("location")?.toString().trim() ?? "";
  const commune = formData.get("commune")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() ?? "";
  const isDon = formData.get("don") === "on";
  const negociable = !isDon && formData.get("negociable") === "on";
  const photoFiles = [
    formData.get("photo1"),
    formData.get("photo2"),
    formData.get("photo3"),
  ].filter(
    (f): f is File =>
      f instanceof File && f.size > 0 && f.type.startsWith("image/")
  );

  const price = isDon ? 0 : Number(priceRaw);

  if (!title || !category || !location || !description) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!isDon && (!Number.isFinite(price) || price <= 0)) {
    return { error: "Le prix doit être un nombre positif." };
  }
  if (photoFiles.length > 3) {
    return { error: "Vous ne pouvez ajouter que 3 photos maximum." };
  }
  if (photoFiles.some((f) => f.size > MAX_PHOTO_SIZE)) {
    return { error: "Chaque photo doit faire moins de 5 Mo." };
  }

  let photoPaths = existing.photos;
  if (photoFiles.length > 0) {
    const newPaths: string[] = [];
    for (const file of photoFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(path, file, { contentType: file.type });
      if (uploadError) {
        return { error: "L'envoi d'une photo a échoué. Merci de réessayer." };
      }
      newPaths.push(path);
    }
    if (existing.photos?.length) {
      await supabase.storage.from("listing-photos").remove(existing.photos);
    }
    photoPaths = newPaths;
  }

  const { error } = await supabase
    .from("listings")
    .update({
      title,
      price,
      category,
      location,
      commune,
      photos: photoPaths,
      description,
      negociable,
      is_don: isDon,
    })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: error.message };
  }

  // La colonne "status" est protégée (voir security-audit-column-locks.sql) :
  // toute modification remet l'annonce en attente de validation, via le
  // client service_role plutôt que directement par la vendeuse ou le vendeur.
  const adminClient = createAdminClient();
  await adminClient
    .from("listings")
    .update({ status: "pending" })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  revalidatePath("/mes-annonces");
  redirect("/mes-annonces");
}

export async function deleteListingAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const listingId = Number(formData.get("listingId"));

  const { data: listing } = await supabase
    .from("listings")
    .select("photos")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();

  await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("seller_id", user.id);

  if (listing?.photos?.length) {
    await supabase.storage.from("listing-photos").remove(listing.photos);
  }

  revalidatePath("/mes-annonces");
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
  const metier = formData.get("metier")?.toString().trim();

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

  if (metier !== undefined) {
    await supabase.from("pro_profiles").upsert(
      { seller_id: user.id, metier, reviewed_at: null },
      { onConflict: "seller_id" }
    );
  }

  return { error: null, success: true };
}

// --- Les Talentueux (profil pro, portfolio, avis) ---

export async function addPortfolioItemAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const files = [
    formData.get("photo1"),
    formData.get("photo2"),
    formData.get("photo3"),
  ].filter(
    (f): f is File =>
      f instanceof File && f.size > 0 && f.type.startsWith("image/")
  );

  if (!title || files.length === 0 || files.length > 3) return;
  if (files.some((f) => f.size > MAX_PHOTO_SIZE)) return;

  const paths: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("portfolio-photos")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return;
    paths.push(path);
  }

  await supabase.from("portfolio_items").insert({
    seller_id: user.id,
    title,
    description,
    photos: paths,
  });

  revalidatePath("/profil");
  revalidatePath(`/vendeurs/${user.id}`);
}

export async function removePortfolioItemAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const itemId = Number(formData.get("itemId"));

  const { data: item } = await supabase
    .from("portfolio_items")
    .select("photos")
    .eq("id", itemId)
    .eq("seller_id", user.id)
    .maybeSingle();

  await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", itemId)
    .eq("seller_id", user.id);

  if (item?.photos?.length) {
    await supabase.storage.from("portfolio-photos").remove(item.photos);
  }

  revalidatePath("/profil");
  revalidatePath(`/vendeurs/${user.id}`);
}

export type SubmitReviewState = { error: string | null; success?: boolean };

export async function submitReviewAction(
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment")?.toString().trim() ?? "";

  if (!Number.isFinite(offerId) || !Number.isFinite(rating)) {
    return { error: "Formulaire invalide." };
  }
  if (rating < 1 || rating > 5) {
    return { error: "La note doit être comprise entre 1 et 5." };
  }

  // Le vendeur est déduit de l'offre elle-même côté serveur (jamais du
  // formulaire) pour qu'un avis ne puisse pas être attribué à un autre
  // vendeur en modifiant un champ caché.
  const { data: offer } = await supabase
    .from("offers")
    .select("listings(seller_id)")
    .eq("id", offerId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  const listings = offer?.listings as { seller_id: string } | { seller_id: string }[] | undefined;
  const sellerId = Array.isArray(listings) ? listings[0]?.seller_id : listings?.seller_id;

  if (!sellerId) {
    return { error: "Offre introuvable." };
  }

  const { error } = await supabase.from("reviews").insert({
    offer_id: offerId,
    seller_id: sellerId,
    buyer_id: user.id,
    rating,
    comment,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mes-offres");
  revalidatePath(`/vendeurs/${sellerId}`);

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
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (seller?.role !== "admin") redirect("/");

  return { supabase, adminId: user.id };
}

async function logAdminAction(
  supabase: SupabaseClient,
  adminId: string,
  action: string,
  cibleType: string,
  cibleId?: string | number | null,
  details?: Record<string, unknown>
) {
  await supabase.from("audit_log").insert({
    admin_id: adminId,
    action,
    cible_type: cibleType,
    cible_id: cibleId != null ? String(cibleId) : null,
    details: details ?? null,
  });
}

export async function approveListingAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const listingId = Number(formData.get("listingId"));
  // La colonne "status" a volontairement été retirée des droits d'écriture
  // du rôle authenticated (voir security-audit-column-locks.sql) pour
  // empêcher un vendeur de s'auto-approuver — mais Postgres ne distingue
  // pas "admin" de "utilisateur normal" au niveau des droits de colonne,
  // seulement via les policies RLS. On passe donc par le client
  // service_role (qui contourne RLS et ces droits) pour ce changement de
  // statut, après avoir vérifié ci-dessus que l'appelant est bien admin.
  const adminClient = createAdminClient();
  const { data: listing } = await adminClient
    .from("listings")
    .update({ status: "approved" })
    .eq("id", listingId)
    .select("seller_id, title")
    .maybeSingle();
  await logAdminAction(supabase, adminId, "approuver_annonce", "annonce", listingId);

  if (listing) {
    const email = await getUserEmail(listing.seller_id);
    if (email) await sendListingApprovedEmail(email, listing.title, listingId);
  }

  revalidatePath("/admin/annonces");
  redirect("/admin/annonces");
}

export async function rejectListingAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const listingId = Number(formData.get("listingId"));
  const adminClient = createAdminClient();
  const { data: listing } = await adminClient
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId)
    .select("seller_id, title")
    .maybeSingle();
  await logAdminAction(supabase, adminId, "rejeter_annonce", "annonce", listingId);

  if (listing) {
    const email = await getUserEmail(listing.seller_id);
    if (email) await sendListingRejectedEmail(email, listing.title);
  }

  revalidatePath("/admin/annonces");
  redirect("/admin/annonces");
}

export async function removeListingAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const listingId = Number(formData.get("listingId"));
  const reportId = formData.get("reportId")?.toString();

  const adminClient = createAdminClient();
  await adminClient
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId);
  await logAdminAction(supabase, adminId, "masquer_annonce", "annonce", listingId);

  if (reportId) {
    await supabase
      .from("reports")
      .update({ statut: "traite" })
      .eq("id", reportId);
    revalidatePath("/admin/signalements");
  }

  revalidatePath("/admin/annonces");
  redirect(reportId ? "/admin/signalements" : "/admin/annonces");
}

export async function rejectReportAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const reportId = Number(formData.get("reportId"));

  await supabase
    .from("reports")
    .update({ statut: "rejete" })
    .eq("id", reportId);
  await logAdminAction(supabase, adminId, "rejeter_signalement", "signalement", reportId);

  revalidatePath("/admin/signalements");
  redirect("/admin/signalements");
}

export async function warnUserAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const sellerId = formData.get("sellerId")?.toString() ?? "";
  const reportId = formData.get("reportId")?.toString();

  await logAdminAction(supabase, adminId, "avertir_utilisateur", "utilisateur", sellerId);

  let motif = "Non-respect des règles d'utilisation";
  if (reportId) {
    const { data: report } = await supabase
      .from("reports")
      .select("motif")
      .eq("id", reportId)
      .maybeSingle();
    if (report?.motif) motif = report.motif;

    await supabase
      .from("reports")
      .update({ statut: "traite" })
      .eq("id", reportId);
    revalidatePath("/admin/signalements");
  }

  const email = await getUserEmail(sellerId);
  if (email) await sendWarningEmail(email, motif);

  redirect("/admin/signalements");
}

export async function suspendUserAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const sellerId = formData.get("sellerId")?.toString() ?? "";
  const reportId = formData.get("reportId")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString() || "/admin/utilisateurs";

  const adminClient = createAdminClient();
  await adminClient
    .from("sellers")
    .update({ status: "suspendu" })
    .eq("id", sellerId);
  const { data: bannedUser } = await adminClient.auth.admin.updateUserById(sellerId, {
    ban_duration: "876000h",
  });

  await logAdminAction(supabase, adminId, "suspendre_utilisateur", "utilisateur", sellerId);

  if (bannedUser?.user?.email) {
    await sendSuspensionEmail(bannedUser.user.email);
  }

  if (reportId) {
    await supabase
      .from("reports")
      .update({ statut: "traite" })
      .eq("id", reportId);
    revalidatePath("/admin/signalements");
  }

  revalidatePath("/admin/utilisateurs");
  redirect(redirectTo);
}

export async function approveTalentAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const sellerId = formData.get("sellerId")?.toString() ?? "";

  // Même raison que pour listings.status : "verified" est verrouillée pour
  // le rôle authenticated (voir security-audit-column-locks.sql), donc on
  // passe par service_role pour ce changement une fois l'appelant vérifié
  // admin ci-dessus.
  const adminClient = createAdminClient();
  await adminClient
    .from("pro_profiles")
    .update({ verified: true, reviewed_at: new Date().toISOString() })
    .eq("seller_id", sellerId);
  await logAdminAction(supabase, adminId, "approuver_talentueux", "utilisateur", sellerId);

  const email = await getUserEmail(sellerId);
  if (email) await sendTalentApprovedEmail(email);

  revalidatePath("/admin/talentueux");
  redirect("/admin/talentueux");
}

export async function rejectTalentAction(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();
  const sellerId = formData.get("sellerId")?.toString() ?? "";

  const adminClient = createAdminClient();
  await adminClient
    .from("pro_profiles")
    .update({ verified: false, reviewed_at: new Date().toISOString() })
    .eq("seller_id", sellerId);
  await logAdminAction(supabase, adminId, "rejeter_talentueux", "utilisateur", sellerId);

  const email = await getUserEmail(sellerId);
  if (email) await sendTalentRejectedEmail(email);

  revalidatePath("/admin/talentueux");
  redirect("/admin/talentueux");
}

export async function createReportAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const type = formData.get("type")?.toString();
  const targetId = formData.get("targetId")?.toString();
  const motif = formData.get("motif")?.toString().trim();
  const description = formData.get("description")?.toString().trim() ?? "";
  const redirectTo = formData.get("redirectTo")?.toString() || "/";

  if (
    (type !== "annonce" && type !== "utilisateur") ||
    !targetId ||
    !motif
  ) {
    redirect(redirectTo);
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("reporter_id", user.id)
    .gte("created_at", oneDayAgo);

  if ((count ?? 0) >= 5) {
    redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}report_error=limit`);
  }

  await supabase.from("reports").insert({
    type,
    target_id: targetId,
    reporter_id: user.id,
    motif,
    description,
  });

  redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}reported=1`);
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
  revalidatePath("/mes-offres");
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
  revalidatePath("/mes-offres");
}

export async function concludeTransactionAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));

  const { data: offer } = await supabase
    .from("offers")
    .update({ conclue_par_acheteur: true, conclue_le: new Date().toISOString() })
    .eq("id", offerId)
    .eq("buyer_id", user.id)
    .select("listing_id")
    .maybeSingle();

  if (offer) {
    // La transaction conclue par l'acheteur fait automatiquement passer
    // l'annonce en "vendu" — la seule façon d'obtenir ce statut est donc
    // toujours reliée à une vraie offre conclue (sold_via_offer_id), pas
    // un bouton déclaratif du vendeur. "status" et "sold_via_offer_id"
    // sont verrouillées pour authenticated (voir schémas de sécurité),
    // d'où le passage par service_role ici.
    const adminClient = createAdminClient();
    await adminClient
      .from("listings")
      .update({ status: "vendu", sold_via_offer_id: offerId })
      .eq("id", offer.listing_id);
    revalidatePath(`/produits/${offer.listing_id}`);
    revalidatePath("/mes-annonces");
  }

  revalidatePath("/mes-offres");
}

export async function sellerRespondOfferAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion");

  const offerId = Number(formData.get("offerId"));
  const listingId = Number(formData.get("listingId"));
  const decision = formData.get("decision")?.toString();
  const counterRaw = formData.get("montant")?.toString();

  // Filtrer explicitement sur les annonces du vendeur connecté (en plus des
  // policies RLS) pour être sûr que la mise à jour cible bien la bonne ligne.
  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();

  if (listing) {
    if (decision === "accepter") {
      await supabase
        .from("offers")
        .update({ statut: "acceptee" })
        .eq("id", offerId)
        .eq("listing_id", listingId);
    } else if (decision === "refuser") {
      await supabase
        .from("offers")
        .update({ statut: "refusee" })
        .eq("id", offerId)
        .eq("listing_id", listingId);
    } else if (decision === "contre_offre") {
      const counter = Number(counterRaw);
      if (Number.isFinite(counter) && counter > 0) {
        await supabase
          .from("offers")
          .update({ statut: "contre_offre", montant_propose: counter })
          .eq("id", offerId)
          .eq("listing_id", listingId);
      }
    }
  }

  revalidatePath("/offres");
  revalidatePath("/mes-offres");
  if (Number.isFinite(listingId)) {
    revalidatePath(`/produits/${listingId}`);
  }
}
