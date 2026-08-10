"use client";

// Redimensionne et recompresse une photo cote navigateur avant l'envoi,
// pour eviter les longs uploads (et les echecs) sur connexion mobile
// lente avec des photos de telephone non compressees (souvent 4-8 Mo).
async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.8
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

// Remplace le fichier selectionne dans un <input type="file"> par sa
// version compressee, pour que la soumission du formulaire natif envoie
// directement la version allegee.
export async function compressPhotoInput(
  input: HTMLInputElement
): Promise<void> {
  const file = input.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  try {
    const compressed = await compressImage(file);
    if (compressed.size >= file.size) return;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(compressed);
    input.files = dataTransfer.files;
  } catch {
    // En cas d'echec de compression (format non supporte, etc.), on
    // garde le fichier original tel quel.
  }
}
