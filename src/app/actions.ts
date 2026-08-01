"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { locales, type Locale } from "@/lib/i18n/locale";
import { wilayas } from "@/lib/wilayas";

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

export async function setWilayaAction(formData: FormData) {
  const wilaya = formData.get("wilaya")?.toString();

  if (wilaya && wilayas.includes(wilaya)) {
    const cookieStore = await cookies();
    cookieStore.set("wilaya_pref", wilaya, {
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
  const negociable = formData.get("negociable") === "on";
  const photoFiles = [
    formData.get("photo1"),
    formData.get("photo2"),
    formData.get("photo3"),
  ].filter(
    (f): f is File =>
      f instanceof File && f.size > 0 && f.type.startsWith("image/")
  );

  const price = Number(priceRaw);

  if (!title || !category || !location || !description) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!Number.isFinite(price) || price <= 0) {
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
    await supabase
      .from("pro_profiles")
      .upsert({ seller_id: user.id, metier }, { onConflict: "seller_id" });
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
  const listingId = Number(formData.get("listingId"));

  await supabase
    .from("offers")
    .update({ conclue_par_acheteur: true, conclue_le: new Date().toISOString() })
    .eq("id", offerId)
    .eq("buyer_id", user.id);

  revalidatePath(`/produits/${listingId}`);
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
