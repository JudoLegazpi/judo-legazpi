import {
  DEFAULT_APPEARANCE_STYLE,
  DEFAULT_CALENDAR_STYLE,
  DEFAULT_SCHEDULE_STYLE,
  type SiteContent,
} from "@/lib/site-content.functions";

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
  tournamentStatuses: [],
  scheduleStyle: DEFAULT_SCHEDULE_STYLE,
  calendarStyle: DEFAULT_CALENDAR_STYLE,
  appearanceStyle: DEFAULT_APPEARANCE_STYLE,
};
