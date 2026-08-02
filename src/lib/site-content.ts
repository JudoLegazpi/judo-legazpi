import { DEFAULT_SCHEDULE_STYLE, type SiteContent } from "@/lib/site-content.functions";

/** Fallback usado si el contenido aún no ha llegado, para que la web nunca quede en blanco. */
export const EMPTY_SITE_CONTENT: SiteContent = {
  schedules: [],
  events: [],
  staff: [],
  tournaments: [],
  documents: [],
  gallery: [],
  texts: {},
  images: {},
  lopiviButtons: [],
  tournamentDocuments: [],

  scheduleStyle: DEFAULT_SCHEDULE_STYLE,
};
