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
  scheduleStyle: ScheduleStyle;
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

    const [schedules, events, staff, tournaments, documents, gallery, texts, images, lopivi, settings] =
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

    return {
      schedules: schedules.data ?? [],
      events: events.data ?? [],
      staff: staff.data ?? [],
      tournaments: tournaments.data ?? [],
      documents: documents.data ?? [],
      gallery: gallery.data ?? [],
      texts: textMap,
      images: imageMap,
      lopiviButtons: lopivi.data ?? [],
      scheduleStyle,
    };

  },
);
