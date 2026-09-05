import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
export type ClubEvent = Database["public"]["Tables"]["events"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type ClubDocument = Database["public"]["Tables"]["documents"]["Row"];
export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
export type SiteText = Database["public"]["Tables"]["site_texts"]["Row"];
export type LopiviButton = Database["public"]["Tables"]["lopivi_buttons"]["Row"];
export type TournamentDocument = Database["public"]["Tables"]["tournament_documents"]["Row"];
export type TournamentStatus = Database["public"]["Tables"]["tournament_statuses"]["Row"];

/** Tamaños del texto de edades/categorías por dispositivo (editable en administración). */
export type CalendarStyle = {
  ageSizeDesktop: string;
  ageSizeTablet: string;
  ageSizeMobile: string;
};

export const DEFAULT_CALENDAR_STYLE: CalendarStyle = {
  ageSizeDesktop: "0.875rem",
  ageSizeTablet: "0.8125rem",
  ageSizeMobile: "0.75rem",
};

/** Apariencia global de toda la web pública, editable desde administración. */
export type AppearanceStyle = {
  menuFont: string;
  buttonFont: string;
  bodyFont: string;
  titleFont: string;
  subtitleFont: string;
  menuSize: string;
  buttonSize: string;
  bodySize: string;
  titleSize: string;
  subtitleSize: string;
  backgroundColor: string;
  secondaryColor: string;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  accentColor: string;
  darkSurfaceColor: string;
  cardColor: string;
  borderColor: string;
};

export const DEFAULT_APPEARANCE_STYLE: AppearanceStyle = {
  menuFont: '"Oswald", "Arial Narrow", sans-serif',
  buttonFont: '"Oswald", "Arial Narrow", sans-serif',
  bodyFont: '"Source Sans 3", system-ui, sans-serif',
  titleFont: '"Oswald", "Arial Narrow", sans-serif',
  subtitleFont: '"Source Sans 3", system-ui, sans-serif',
  menuSize: "0.875rem",
  buttonSize: "0.875rem",
  bodySize: "1rem",
  titleSize: "3rem",
  subtitleSize: "1rem",
  backgroundColor: "#FFFFFF",
  secondaryColor: "#F5F7FA",
  textColor: "#14305C",
  mutedTextColor: "#64748B",
  primaryColor: "#14305C",
  accentColor: "#A6ED19",
  darkSurfaceColor: "#14305C",
  cardColor: "#FFFFFF",
  borderColor: "#DDE3EC",
};

/** Ajustes visuales editables de la sección de horarios. */
export type ScheduleStyle = {
  titleSize: string;
  titleColor: string;
  daySize: string;
  dayColor: string;
  hourSize: string;
  hourColor: string;
  groupSize: string;
  groupColor: string;
  ageSize: string;
  ageColor: string;
  sectionBg: string;
  cardBg: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  gap: string;
};

export const DEFAULT_SCHEDULE_STYLE: ScheduleStyle = {
  titleSize: "2.25rem",
  titleColor: "#14305C",
  daySize: "0.75rem",
  dayColor: "#FFFFFF",
  hourSize: "0.75rem",
  hourColor: "#14305C",
  groupSize: "0.875rem",
  groupColor: "#14305C",
  ageSize: "0.8125rem",
  ageColor: "#14305C",
  sectionBg: "#F5F7FA",
  cardBg: "#FFFFFF",
  borderColor: "#DDE3EC",
  borderWidth: "1px",
  borderRadius: "0.75rem",
  gap: "0.75rem",
};


export type SiteContent = {
  schedules: Schedule[];
  events: ClubEvent[];
  staff: Staff[];
  tournaments: Tournament[];
  documents: ClubDocument[];
  gallery: GalleryImage[];
  texts: Record<string, { es: string; eu: string }>;
  images: Record<string, string>;
  lopiviButtons: LopiviButton[];
  tournamentDocuments: TournamentDocument[];
  tournamentStatuses: TournamentStatus[];
  scheduleStyle: ScheduleStyle;
  calendarStyle: CalendarStyle;
  appearanceStyle: AppearanceStyle;
};



export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const [schedules, events, staff, tournaments, documents, gallery, texts, images, lopivi, settings, tournamentDocs, tournamentStatuses] =
      await Promise.all([
        supabase.from("schedules").select("*").order("sort_order"),
        supabase.from("events").select("*").eq("published", true).order("event_date"),
        supabase.from("staff").select("*").order("sort_order"),
        supabase.from("tournaments").select("*").eq("published", true).order("event_date", { ascending: false }),
        supabase.from("documents").select("*").eq("published", true).order("sort_order"),
        supabase.from("gallery_images").select("*").order("sort_order"),
        supabase.from("site_texts").select("*"),
        supabase.from("site_images").select("*"),
        supabase.from("lopivi_buttons").select("*").eq("active", true).order("sort_order"),
        supabase.from("site_settings").select("*"),
        supabase.from("tournament_documents").select("*").eq("visible", true).order("sort_order"),
        supabase.from("tournament_statuses").select("*").eq("active", true).order("sort_order"),
      ]);


    const textMap: SiteContent["texts"] = {};
    for (const row of texts.data ?? []) {
      textMap[row.key] = { es: row.value_es, eu: row.value_eu };
    }

    const imageMap: SiteContent["images"] = {};
    for (const row of images.data ?? []) {
      if (row.image_url) imageMap[row.key] = row.image_url;
    }

    const scheduleRow = (settings.data ?? []).find((row) => row.key === "schedule_style");
    const scheduleStyle: ScheduleStyle = {
      ...DEFAULT_SCHEDULE_STYLE,
      ...((scheduleRow?.value as Partial<ScheduleStyle> | null) ?? {}),
    };

    const calendarRow = (settings.data ?? []).find((row) => row.key === "calendar_style");
    const calendarStyle: CalendarStyle = {
      ...DEFAULT_CALENDAR_STYLE,
      ...((calendarRow?.value as Partial<CalendarStyle> | null) ?? {}),
    };

    const appearanceRow = (settings.data ?? []).find((row) => row.key === "appearance_style");
    const appearanceStyle: AppearanceStyle = {
      ...DEFAULT_APPEARANCE_STYLE,
      ...((appearanceRow?.value as Partial<AppearanceStyle> | null) ?? {}),
    };

    // Las imágenes viven en el bucket privado: se firman en el servidor y nunca
    // se expone su ubicación real ni un enlace público permanente.
    const isStoragePath = (value: string | null | undefined) =>
      Boolean(value && value.trim() && !/^(https?:|data:|blob:|\/\/)/i.test(value.trim()));

    const paths = new Set<string>();
    for (const value of Object.values(imageMap)) if (isStoragePath(value)) paths.add(value.trim());
    for (const row of tournaments.data ?? []) if (isStoragePath(row.poster_url)) paths.add(row.poster_url!.trim());
    for (const row of staff.data ?? []) if (isStoragePath(row.photo_url)) paths.add(row.photo_url!.trim());
    for (const row of gallery.data ?? []) if (isStoragePath(row.image_url)) paths.add(row.image_url.trim());

    const signed = new Map<string, string>();
    if (paths.size > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: signedData } = await supabaseAdmin.storage
        .from("media")
        .createSignedUrls([...paths], 60 * 60);
      for (const item of signedData ?? []) {
        if (item.path && item.signedUrl) signed.set(item.path, item.signedUrl);
      }
    }

    const resolve = (value: string | null) => {
      if (!value) return value;
      const trimmed = value.trim();
      return isStoragePath(trimmed) ? (signed.get(trimmed) ?? null) : trimmed;
    };

    for (const [key, value] of Object.entries(imageMap)) {
      const url = resolve(value);
      if (url) imageMap[key] = url;
      else delete imageMap[key];
    }

    return {
      schedules: schedules.data ?? [],
      events: events.data ?? [],
      staff: (staff.data ?? []).map((row) => ({ ...row, photo_url: resolve(row.photo_url) })),
      tournaments: (tournaments.data ?? []).map((row) => ({ ...row, poster_url: resolve(row.poster_url) })),
      documents: documents.data ?? [],
      gallery: (gallery.data ?? []).map((row) => ({ ...row, image_url: resolve(row.image_url) ?? "" })),

      texts: textMap,
      images: imageMap,
      lopiviButtons: lopivi.data ?? [],
      tournamentDocuments: tournamentDocs.data ?? [],
      tournamentStatuses: tournamentStatuses.data ?? [],
      scheduleStyle,
      calendarStyle,
      appearanceStyle,
    };
  },
);

