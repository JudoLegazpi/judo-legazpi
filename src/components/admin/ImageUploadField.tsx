import { useEffect, useState } from "react";
import { ALLOWED_IMAGE_TYPES, isStoragePath, previewUrl, removeImage, uploadImage } from "@/lib/media";

/**
 * Campo único de imagen para toda la administración: solo permite subir un
 * archivo desde el dispositivo. Nunca acepta enlaces externos.
 */
export function ImageUploadField({
  id,
  label,
  value,
  folder,
  onChange,
  aspect = "aspect-[3/2]",
}: {
  id: string;
  label: string;
  value: string | null;
  folder: string;
  onChange: (path: string | null) => void;
  aspect?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const legacy = Boolean(value && !isStoragePath(value));

  useEffect(() => {
    let active = true;
    if (!value) {
      setPreview(null);
      return;
    }
    if (!isStoragePath(value)) {
      setPreview(value);
      return;
    }
    void previewUrl(value).then((url) => {
      if (active) setPreview(url);
    });
    return () => {
      active = false;
    };
  }, [value]);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    const result = await uploadImage(file, folder);
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    const previous = value;
    onChange(result.path);
    if (previous && isStoragePath(previous)) void removeImage(previous);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{label}</p>
      <div className={`${aspect} overflow-hidden rounded-2xl border border-border bg-muted`}>
        {preview ? (
          <img src={preview} alt={label} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
            Todavía no hay imagen.
          </div>
        )}
      </div>
      {legacy && (
        <p className="text-sm text-destructive">
          Esta imagen procede de un enlace antiguo. Súbela de nuevo desde tu dispositivo.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={id}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleFile(file);
          }}
          className="min-h-11 rounded-2xl border border-input bg-background px-3 text-sm"
        />
        {value && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (isStoragePath(value)) void removeImage(value);
              onChange(null);
            }}
            className="min-h-11 rounded-2xl border border-destructive px-4 text-sm text-destructive"
          >
            Eliminar imagen
          </button>
        )}
      </div>
      {busy && <p className="text-sm text-muted-foreground">Optimizando y subiendo…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        PNG, JPG, WEBP o AVIF (máx. 12 MB). Se optimiza automáticamente y se guarda en el almacenamiento
        privado del club.
      </p>
    </div>
  );
}
