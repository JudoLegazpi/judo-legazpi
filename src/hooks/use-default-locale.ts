import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n";

/**
 * Euskera es el idioma por defecto: si el visitante llega a una ruta en
 * castellano sin haber elegido idioma antes, se le lleva a la versión en euskera.
 * Si ya eligió, se respeta su preferencia guardada.
 */
export function useDefaultLocale(locale: Locale, euPath: string) {
  const router = useRouter();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      return;
    }

    if (stored === "es" || stored === "eu") {
      if (stored === locale) return;
      if (stored === "eu" && locale === "es") router.navigate({ to: euPath as never, replace: true });
      return;
    }

    if (locale === "es") router.navigate({ to: euPath as never, replace: true });
  }, [locale, euPath, router]);
}
