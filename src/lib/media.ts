import { supabase } from "@/integrations/supabase/client";

/** Único bucket permitido: almacenamiento privado del club. */
export const MEDIA_BUCKET = "media";

/** Formatos aceptados al subir imágenes. */
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;

/** Tamaño máximo del archivo original. */
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

/** Ancho máximo tras la optimización (se conserva la proporción). */
export const MAX_IMAGE_WIDTH = 1920;

/** Duración de los enlaces firmados usados solo para previsualizar en administración. */
export const PREVIEW_SIGNED_SECONDS = 60 * 60;

/** Un valor es una ruta interna del almacenamiento (no un enlace externo). */
export function isStoragePath(value: string | null | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && !/^(https?:|data:|blob:|\/\/)/i.test(trimmed);
}

export function validateImageFile(file: File): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Formato no permitido. Usa PNG, JPG, WEBP o AVIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "El archivo es demasiado grande (máximo 12 MB).";
  }
  return null;
}

/**
 * Reduce el peso del archivo conservando la calidad visual: reescala a un ancho
 * máximo y lo convierte a WEBP. Si el navegador no puede procesarlo, se sube tal cual.
 */
export async function optimizeImage(file: File, maxWidth = MAX_IMAGE_WIDTH): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), "image/webp", 0.85),
    );
    if (!blob) return file;
    return blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Sube una imagen al almacenamiento privado y devuelve su ruta interna. */
export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ path: string } | { error: string }> {
  const invalid = validateImageFile(file);
  if (invalid) return { error: invalid };

  const optimized = await optimizeImage(file);
  const ext = optimized.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, optimized, {
    contentType: optimized.type || file.type,
    upsert: false,
  });
  if (error) return { error: error.message };
  return { path };
}

/** Elimina del almacenamiento una imagen que ya no se usa. */
export async function removeImage(path: string): Promise<void> {
  if (!isStoragePath(path)) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path.trim()]);
}

/** Enlace firmado temporal para previsualizar en la zona de administración. */
export async function previewUrl(path: string): Promise<string | null> {
  if (!isStoragePath(path)) return null;
  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path.trim(), PREVIEW_SIGNED_SECONDS);
  return data?.signedUrl ?? null;
}
