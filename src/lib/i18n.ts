export type Locale = "es" | "eu";

export const locales: Locale[] = ["es", "eu"];

/** Devuelve la ruta correcta según el idioma: "/horarios" o "/eu/horarios". */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "eu" ? `/eu${clean}` || "/eu" : clean || "/";
}

/** Elige el campo del idioma activo con castellano como respaldo. */
export function pick(
  locale: Locale,
  es: string | null | undefined,
  eu: string | null | undefined,
): string {
  if (locale === "eu" && eu && eu.trim().length > 0) return eu;
  return es ?? "";
}

type Dict = Record<string, { es: string; eu: string }>;

const dict: Dict = {
  club_name: { es: "Club Judo Legazpi", eu: "Legazpiko Judo Kluba" },
  nav_home: { es: "Inicio", eu: "Hasiera" },
  nav_club: { es: "El club", eu: "Kluba" },
  nav_staff: { es: "Cuerpo técnico", eu: "Talde teknikoa" },
  nav_schedule: { es: "Horarios", eu: "Ordutegiak" },
  nav_calendar: { es: "Calendario", eu: "Egutegia" },
  nav_tournaments: { es: "Torneos", eu: "Txapelketak" },
  nav_lopivi: { es: "LOPIVI", eu: "LOPIVI" },
  nav_documents: { es: "Documentos", eu: "Dokumentuak" },
  nav_contact: { es: "Contacto", eu: "Kontaktua" },
  menu: { es: "Menú", eu: "Menua" },
  close: { es: "Cerrar", eu: "Itxi" },
  hero_kicker: { es: "Judo en Legazpi", eu: "Judoa Legazpin" },
  hero_title: { es: "Tatami, esfuerzo y respeto", eu: "Tatamia, ahalegina eta errespetua" },
  cta_try: { es: "Prueba una clase", eu: "Probatu saio bat" },
  cta_schedule: { es: "Ver horarios", eu: "Ikusi ordutegiak" },
  next_events: { es: "Próximas citas", eu: "Hurrengo hitzorduak" },
  see_all: { es: "Ver todo", eu: "Ikusi dena" },
  schedule_title: { es: "Horarios", eu: "Ordutegiak" },
  schedule_intro: {
    es: "Grupos por edad, dos sesiones semanales. Puedes venir a probar cualquier día de entrenamiento.",
    eu: "Adinaren araberako taldeak, asteko bi saio. Edozein entrenamendu egunetan etor zaitezke probatzera.",
  },

  staff_title: { es: "Cuerpo técnico", eu: "Talde teknikoa" },
  staff_intro: {
    es: "Entrenadores titulados y formados en protección a la infancia.",
    eu: "Entrenatzaile tituludunak, haurren babesean trebatuak.",
  },
  calendar_title: { es: "Calendario", eu: "Egutegia" },
  calendar_intro: {
    es: "Competiciones, exámenes y actividades del club.",
    eu: "Lehiaketak, azterketak eta klubaren jarduerak.",
  },
  calendar_empty: { es: "El calendario aún no está publicado.", eu: "Egutegia oraindik ez dago argitaratuta." },
  calendar_download: { es: "Descargar calendario", eu: "Egutegia deskargatu" },
  calendar_download_intro: {
    es: "Puedes descargar el calendario en formato PDF",
    eu: "Egutegia PDF formatuan deskarga dezakezu",
  },
  calendar_updated_label: { es: "Actualizado", eu: "Eguneratua" },
  past_events: { es: "Ya celebrado", eu: "Jada egindakoa" },
  tournaments_title: { es: "Torneos del club", eu: "Klubaren txapelketak" },
  tournaments_intro: {
    es: "Competiciones que organizamos en Legazpi.",
    eu: "Legazpin antolatzen ditugun lehiaketak.",
  },
  documents_title: { es: "Documentos", eu: "Dokumentuak" },
  documents_intro: {
    es: "Descarga los formularios y protocolos del club en PDF.",
    eu: "Deskargatu klubaren inprimakiak eta protokoloak PDF formatuan.",
  },
  download: { es: "Descargar PDF", eu: "Deskargatu PDFa" },
  lopivi_title: { es: "Protección de la infancia (LOPIVI)", eu: "Haurren babesa (LOPIVI)" },
  contact_title: { es: "Contacto", eu: "Kontaktua" },
  contact_intro: {
    es: "Escríbenos o acércate al polideportivo en horario de entrenamiento.",
    eu: "Idatzi iezaguzu edo hurbildu kiroldegira entrenamendu orduetan.",
  },
  club_title: { es: "El club", eu: "Kluba" },
  gallery: { es: "Galería", eu: "Galeria" },
  admin: { es: "Administración", eu: "Administrazioa" },
  results: { es: "Resultados", eu: "Emaitzak" },
  back: { es: "Volver", eu: "Itzuli" },
  days: { es: "L,M,X,J,V,S,D", eu: "A,A,A,O,O,L,I" },
  day_names: {
    es: "Lunes,Martes,Miércoles,Jueves,Viernes,Sábado,Domingo",
    eu: "Astelehena,Asteartea,Asteazkena,Osteguna,Ostirala,Larunbata,Igandea",
  },
  cat_competicion: { es: "Competición", eu: "Lehiaketa" },
  cat_torneo: { es: "Torneo", eu: "Txapelketa" },
  cat_examen: { es: "Examen", eu: "Azterketa" },
  cat_curso: { es: "Curso", eu: "Ikastaroa" },
  cat_club: { es: "Club", eu: "Kluba" },
  hero_tagline: { es: "Club de Judo de Legazpi — desde 1986", eu: "Legazpi Judo taldea — 1986az geroztik" },
  cta_join: { es: "Inscripción 26/27", eu: "26/27 Izen Ematea" },
  cta_know: { es: "Conoce el club", eu: "Kluba ezagutu" },
  join_short: { es: "Inscripción", eu: "Izen Ematea" },
  more_than_sport: { es: "¡Mucho más que un deporte!", eu: "Kirola baino askoz gehiago!" },
  grading: { es: "Graduación", eu: "Graduazioa" },
  qualification: { es: "Titulación", eu: "Titulazioa" },
  lopivi_docs: { es: "Documentación en materia de protección de la infancia y la adolescencia", eu: "Haurren eta nerabeen babesaren arloko dokumentazioa" },
  lopivi_mail: { es: "Correo de contacto para asuntos relacionados con la LOPIVI:", eu: "LOPIVI Legearekin lotutako gaietarako harremanetarako emaila:" },
  season: { es: "Temporada 2026 - 2027", eu: "2026 - 2027 Denboraldia" },
  schedule_place: { es: "Lugar: gimnasio de Haztegi Ikastola — Legazpi", eu: "Lekua: Haztegi Ikastolako gimnasioa - Legazpi" },
  join_title: { es: "Únete a nuestro equipo", eu: "Batu gure taldera" },
  join_text: {
    es: "El plazo de inscripción para la temporada 2026/2027 está abierto. ¡No pierdas la oportunidad!",
    eu: "2026/2027 denboraldirako izena emateko epea irekita dago. Ez galdu aukera!",
  },
  hour: { es: "Horario", eu: "Ordutegia" },
  club_section_title: { es: "¡Mucho más que un deporte!", eu: "Kirola baino askoz gehiago!" },
  calendar_season: { es: "Temporada 2026 - 2027", eu: "2026 - 2027 Denboraldia" },
  calendar_download_label: { es: "Descargar calendario", eu: "Egutegia deskargatu" },
  lopivi_docs_intro: {
    es: "Documentación en materia de protección de la infancia y la adolescencia",
    eu: "Haurren eta nerabeen babesaren arloko dokumentazioa",
  },
  lopivi_mail_label: {
    es: "Correo de contacto para asuntos relacionados con la LOPIVI:",
    eu: "LOPIVI Legearekin lotutako gaietarako harremanetarako emaila:",
  },
  lopivi_email: { es: "lopivi@judolegazpi.com", eu: "lopivi@judolegazpi.com" },
  lopivi_item1_title: { es: "Proyecto Deportivo", eu: "Kirol Proiektua" },
  lopivi_item2_title: { es: "Protocolo LOPIVI", eu: "LOPIVI Protokoloa" },
  lopivi_item3_title: { es: "Acta de Responsable", eu: "Arduradunaren Akta" },
  contact_email: { es: "info@judolegazpi.com", eu: "info@judolegazpi.com" },
  footer_address: {
    es: "Polideportivo Municipal · 20230 Legazpi (Gipuzkoa)",
    eu: "Udal Kiroldegia · 20230 Legazpi (Gipuzkoa)",
  },
  join_url: {
    es: "https://judolegazpi.playoffinformatica.com/preinscripcion/",
    eu: "https://judolegazpi.playoffinformatica.com/preinscripcion/",
  },
  nav_intranet: { es: "Intranet", eu: "Intranet" },
  intranet_url: {
    es: "https://judolegazpi.playoffinformatica.com/",
    eu: "https://judolegazpi.playoffinformatica.com/",
  },
  footer_unsubscribe: { es: "Darse de baja", eu: "Baja eman" },
  footer_unsubscribe_url: {
    es: "https://judolegazpi.playoffinformatica.com/baja?idConfiguracioFormulariColegi=14",
    eu: "https://judolegazpi.playoffinformatica.com/baja?idConfiguracioFormulariColegi=14",
  },
  footer_contact_title: { es: "Contacto", eu: "Kontaktua" },
  contact_phone: { es: "+34600000000", eu: "+34600000000" },
  contact_phone_label: { es: "600 00 00 00", eu: "600 00 00 00" },
  documents: { es: "Documentos", eu: "Dokumentuak" },
  tournament_date: { es: "Fecha", eu: "Data" },
  tournament_place: { es: "Lugar", eu: "Lekua" },
  tournament_categories: { es: "Categorías", eu: "Kategoriak" },
  tournament_links: { es: "Enlaces y documentos", eu: "Loturak eta dokumentuak" },
  tournaments_empty: { es: "Pronto publicaremos los torneos.", eu: "Laster argitaratuko ditugu txapelketak." },
};



export type TextMap = Record<string, { es: string; eu: string }>;

/** Texto editable desde administración con respaldo en el diccionario estático. */
export function tx(texts: TextMap | undefined, locale: Locale, key: string): string {
  const value = texts?.[key]?.[locale]?.trim();
  if (value) return value;
  return t(locale, key);
}

/** Idioma preferido guardado por el usuario (euskera por defecto). */
export const LOCALE_STORAGE_KEY = "judolegazpi-locale";

export function t(locale: Locale, key: keyof typeof dict | string): string {
  const entry = dict[key as string];
  if (!entry) return key as string;
  return entry[locale];
}

export function formatDate(locale: Locale, iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(locale === "eu" ? "eu-ES" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function dayName(locale: Locale, day: number): string {
  const names = t(locale, "day_names").split(",");
  return names[(day - 1 + 7) % 7];
}
