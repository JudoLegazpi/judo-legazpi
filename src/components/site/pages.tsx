import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Download, Mail } from "lucide-react";
import heroImg from "@/assets/hero-judo.jpg";
import kidsImg from "@/assets/club-kids.jpg";
import { PageHeader, Section, SiteLayout } from "@/components/site/SiteLayout";
import { dayName, formatDate, localePath, pick, t, type Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/site-content.functions";
import { EMPTY_SITE_CONTENT } from "@/lib/site-content";

const to = (locale: Locale, path: string) => localePath(locale, path) as never;

export const JOIN_URL = "https://judolegazpi.playoffinformatica.com/preinscripcion/";

const list = (value?: string | null) =>
  (value ?? "")
    .split(/[\n·,;]/)
    .map((v) => v.trim())
    .filter(Boolean);

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      <span className="mx-auto mt-4 block h-1 w-16 bg-accent" aria-hidden />
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

export function HomePage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {



  const lopiviDocs = content.documents.filter((d) => d.category === "lopivi");

  // Tabla semanal: filas = franjas horarias, columnas = días con clase.
  const days = Array.from(new Set(content.schedules.map((s) => s.day_of_week))).sort((a, b) => a - b);
  const slots = Array.from(
    new Set(content.schedules.map((s) => `${s.start_time.slice(0, 5)}|${s.end_time.slice(0, 5)}`)),
  ).sort();

  return (
    <SiteLayout locale={locale} path="/">
      {/* HERO a pantalla completa */}
      <section className="relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden">
        <img
          src={content.images.hero ?? heroImg}
          alt={locale === "eu" ? "Judokak tatamian entrenatzen" : "Judokas entrenando sobre el tatami"}
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/80" aria-hidden />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center">
          <h1 className="font-display text-6xl leading-[0.9] font-bold tracking-tight text-ink-foreground sm:text-8xl lg:text-9xl">
            Judo
            <span className="block text-accent">Legazpi</span>
          </h1>
          <p className="mt-6 text-base text-ink-muted sm:text-lg">{t(locale, "hero_tagline")}</p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={JOIN_URL}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-7 font-display text-sm font-semibold uppercase tracking-wider text-accent-foreground"
            >
              {t(locale, "cta_join")}
            </a>
            <a
              href="#kluba"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-ink-foreground/50 px-7 font-display text-sm font-semibold uppercase tracking-wider text-ink-foreground"
            >
              {t(locale, "cta_know")}
            </a>
          </div>
          <ChevronDown className="mt-12 h-6 w-6 animate-bounce text-accent" aria-hidden />
        </div>
      </section>

      {/* KLUBA */}
      <section id="kluba" className="scroll-mt-20">
        <Section>
          <SectionHead title={t(locale, "more_than_sport")} />
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <img
              src={content.images.club ?? kidsImg}
              alt={locale === "eu" ? "Haurren judo saioa" : "Clase de judo infantil"}
              width={1280}
              height={960}
              loading="lazy"
              className="w-full rounded-sm object-cover"
            />
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{content.texts.club_history?.[locale] ?? ""}</p>
              <p>{content.texts.club_values?.[locale] ?? ""}</p>
              <Link
                to={to(locale, "/club")}
                className="inline-flex items-center gap-2 font-display text-sm uppercase text-primary"
              >
                {t(locale, "more_info")} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Section>
      </section>

      {/* EKIPO TEKNIKOA */}
      {content.staff.length > 0 && (
        <section id="taldea" className="scroll-mt-20 bg-secondary">
          <Section>
            <SectionHead title={t(locale, "staff_title")} subtitle={t(locale, "staff_intro")} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.staff.map((person) => (
                <li key={person.id} className="card-elevated overflow-hidden">
                  {person.photo_url ? (
                    <img
                      src={person.photo_url}
                      alt={person.name}
                      loading="lazy"
                      className="aspect-3/4 w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-3/4 w-full bg-muted" aria-hidden />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl">{person.name}</h3>
                    <p className="mt-1 font-display text-sm uppercase tracking-wide text-primary">
                      {pick(locale, person.role_es, person.role_eu)}
                    </p>
                    {list(person.belt).length > 0 && (
                      <div className="mt-4">
                        <p className="eyebrow">{t(locale, "grading")}</p>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {list(person.belt).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {list(person.qualifications).length > 0 && (
                      <div className="mt-4">
                        <p className="eyebrow">{t(locale, "qualification")}</p>
                        <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {list(person.qualifications).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </section>
      )}

      {/* LOPIVI */}
      <section id="lopivi" className="surface-ink scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center lg:px-6 lg:py-20">
          <h2 className="text-3xl text-ink-foreground sm:text-4xl">{t(locale, "lopivi_title")}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 bg-accent" aria-hidden />
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">{t(locale, "lopivi_docs")}</p>
          {lopiviDocs.length > 0 && (
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {lopiviDocs.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.file_url}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-ink-border px-5 font-display text-xs uppercase tracking-wider text-ink-foreground"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {pick(locale, doc.title_es, doc.title_eu)}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 text-sm text-ink-muted">{t(locale, "lopivi_mail")}</p>
          <a
            href="mailto:info@judolegazpi.com"
            className="mt-2 inline-flex items-center gap-2 font-display text-base uppercase text-accent"
          >
            <Mail className="h-4 w-4" aria-hidden /> info@judolegazpi.com
          </a>
        </div>
      </section>

      {/* EGUTEGIA */}
      <section id="egutegia" className="scroll-mt-20">
        <Section>
          <SectionHead title={t(locale, "calendar_title")} subtitle={t(locale, "season")} />
          <CalendarBlock locale={locale} content={content} />
        </Section>
      </section>


      {/* ORDUTEGIA */}
      <section id="ordutegia" className="scroll-mt-20 bg-secondary">
        <Section>
          <SectionHead title={t(locale, "nav_schedule")} subtitle={t(locale, "season")} />
          {slots.length > 0 && (
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="surface-ink">
                    <th scope="col" className="p-3 text-left font-display text-xs uppercase tracking-wider">
                      {t(locale, "hour")}
                    </th>
                    {days.map((day) => (
                      <th key={day} scope="col" className="p-3 text-left font-display text-xs uppercase tracking-wider">
                        {dayName(locale, day)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => {
                    const [start, end] = slot.split("|");
                    return (
                      <tr key={slot} className="border-b border-border bg-card">
                        <th scope="row" className="p-3 text-left font-display text-xs whitespace-nowrap tabular-nums">
                          {start}–{end}
                        </th>
                        {days.map((day) => {
                          const cells = content.schedules.filter(
                            (s) =>
                              s.day_of_week === day &&
                              `${s.start_time.slice(0, 5)}|${s.end_time.slice(0, 5)}` === slot,
                          );
                          return (
                            <td key={day} className="p-3 align-top">
                              {cells.map((cell) => (
                                <span key={cell.id} className="block">
                                  <span className="block font-semibold">
                                    {pick(locale, cell.group_es, cell.group_eu)}
                                  </span>
                                  {cell.age_range && (
                                    <span className="block text-xs text-muted-foreground">{cell.age_range}</span>
                                  )}
                                </span>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-6 text-sm text-muted-foreground">{t(locale, "schedule_place")}</p>
          <div className="mt-6">
            <Link
              to={to(locale, "/horarios")}
              className="inline-flex items-center gap-2 font-display text-sm uppercase text-primary"
            >
              {t(locale, "more_info")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Section>
      </section>

      {/* BATU GURE TALDERA */}
      <section id="izena" className="scroll-mt-20 bg-accent">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6">
          <h2 className="text-3xl text-accent-foreground sm:text-4xl">{t(locale, "join_title")}</h2>
          <p className="mt-4 text-accent-foreground/80">{t(locale, "join_text")}</p>
          <a
            href={JOIN_URL}
            rel="noreferrer noopener"
            target="_blank"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-ink px-8 font-display text-sm font-semibold uppercase tracking-wider text-ink-foreground"
          >
            {t(locale, "join_short")}
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

export function ClubPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/club">
      <PageHeader eyebrow={t(locale, "club_name")} title={t(locale, "club_title")} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>{content.texts.club_history?.[locale]}</p>
            <p>{content.texts.club_values?.[locale]}</p>
          </div>
          <img
            src={content.images.club ?? kidsImg}
            alt={locale === "eu" ? "Klubaren entrenamendua" : "Entrenamiento del club"}
            width={1280}
            height={960}
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
        </div>
      </Section>
      {content.gallery.length > 0 && (
        <Section className="pt-0">
          <h2 className="text-2xl">{t(locale, "gallery")}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.gallery.map((image) => (
              <li key={image.id}>
                <img
                  src={image.image_url}
                  alt={pick(locale, image.caption_es, image.caption_eu)}
                  loading="lazy"
                  className="aspect-4/3 w-full rounded-sm object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </SiteLayout>
  );
}

export function SchedulePage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const groups = new Map<string, typeof content.schedules>();
  for (const row of content.schedules) {
    const key = pick(locale, row.group_es, row.group_eu);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return (
    <SiteLayout locale={locale} path="/horarios">
      <PageHeader
        eyebrow={t(locale, "nav_schedule")}
        title={t(locale, "schedule_title")}
        intro={t(locale, "schedule_intro")}
      />
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2">
          {Array.from(groups.entries()).map(([group, rows]) => (
            <li key={group} className="card-elevated p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl">{group}</h2>
                <span className="text-sm text-muted-foreground">{rows[0].age_range}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {rows.map((row) => (
                  <li key={row.id} className="flex justify-between gap-3 border-b border-border pb-2">
                    <span>{dayName(locale, row.day_of_week)}</span>
                    <span className="font-semibold tabular-nums">
                      {row.start_time.slice(0, 5)}–{row.end_time.slice(0, 5)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">{rows[0].location}</p>
            </li>
          ))}
        </ul>

        <div className="card-elevated mt-8 p-6">
          <h2 className="text-xl">{t(locale, "fees")}</h2>
          <p className="mt-3 text-muted-foreground">{content.texts.fees?.[locale]}</p>
          <Link
            to={to(locale, "/contacto")}
            className="mt-5 inline-flex min-h-11 items-center rounded-sm bg-primary px-5 font-display text-sm uppercase text-primary-foreground"
          >
            {t(locale, "cta_try")}
          </Link>
        </div>
      </Section>
    </SiteLayout>
  );
}

export function StaffPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/cuerpo-tecnico">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "staff_title")}
        intro={t(locale, "staff_intro")}
      />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.staff.map((person) => (
            <li key={person.id} className="card-elevated overflow-hidden">
              {person.photo_url ? (
                <img
                  src={person.photo_url}
                  alt={person.name}
                  loading="lazy"
                  className="aspect-3/4 w-full object-cover"
                />
              ) : (
                <div className="aspect-3/4 w-full bg-secondary" aria-hidden />
              )}
              <div className="p-5">
                <h2 className="text-lg">{person.name}</h2>
                <p className="text-sm text-primary">{pick(locale, person.role_es, person.role_eu)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[person.belt, person.qualifications].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {pick(locale, person.bio_es, person.bio_eu)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
}

function CalendarBlock({ locale, content }: { locale: Locale; content: SiteContent }) {
  const image = locale === "eu" ? (content.images.calendar_eu ?? content.images.calendar) : content.images.calendar;
  const pdf =
    (locale === "eu" ? content.texts.calendar_pdf_url?.eu : content.texts.calendar_pdf_url?.es)?.trim() ||
    content.texts.calendar_pdf_url?.es?.trim();
  const updated = pick(locale, content.texts.calendar_updated?.es, content.texts.calendar_updated?.eu);


  if (!image && !pdf) {
    return <p className="mt-8 text-center text-muted-foreground">{t(locale, "calendar_empty")}</p>;
  }

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      {image && (
        <img
          src={image}
          alt={locale === "eu" ? "Denboraldiko egutegia" : "Calendario de la temporada"}
          loading="lazy"
          className="w-full rounded-sm border border-border bg-background"
        />
      )}
      {(pdf || updated) && (
        <div className="mt-8 rounded-sm bg-secondary px-6 py-8 text-center">
          <p className="text-base text-muted-foreground">{t(locale, "calendar_download_intro")}</p>
          {updated && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t(locale, "calendar_updated_label")}: {updated}
            </p>
          )}
          {pdf && (
            <a
              href={pdf}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-accent px-7 font-display text-sm font-semibold uppercase tracking-wider text-accent-foreground"
            >
              <Download className="h-4 w-4" aria-hidden /> {t(locale, "calendar_download")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function CalendarPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/calendario">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "calendar_title")}
        intro={t(locale, "calendar_intro")}
      />
      <Section>
        <CalendarBlock locale={locale} content={content} />
      </Section>
    </SiteLayout>
  );
}


export function TournamentsPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/torneos">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "tournaments_title")}
        intro={t(locale, "tournaments_intro")}
      />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2">
          {content.tournaments.map((tournament) => (
            <li key={tournament.id} className="card-elevated overflow-hidden">
              {tournament.poster_url && (
                <img
                  src={tournament.poster_url}
                  alt={pick(locale, tournament.title_es, tournament.title_eu)}
                  loading="lazy"
                  className="aspect-16/9 w-full object-cover"
                />
              )}
              <div className="p-5">
                <p className="eyebrow">{tournament.edition}</p>
                <h2 className="mt-1 text-xl">{pick(locale, tournament.title_es, tournament.title_eu)}</h2>
                <p className="text-sm text-muted-foreground">
                  {tournament.event_date ? formatDate(locale, tournament.event_date) : ""}
                  {tournament.location ? ` · ${tournament.location}` : ""}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {pick(locale, tournament.description_es, tournament.description_eu)}
                </p>
                {tournament.results_url && tournament.results_url !== "#" && (
                  <a
                    href={tournament.results_url}
                    className="mt-4 inline-flex font-display text-sm uppercase text-primary"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {t(locale, "results")}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
}

export function LopiviPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const docs = content.documents.filter((d) => d.category === "lopivi");
  return (
    <SiteLayout locale={locale} path="/lopivi">
      <PageHeader eyebrow="LOPIVI" title={t(locale, "lopivi_title")} />
      <Section>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>{content.texts.lopivi_intro?.[locale]}</p>
          <p className="font-semibold text-foreground">{content.texts.lopivi_contact?.[locale]}</p>
        </div>
        {docs.length > 0 && (
          <ul className="mt-8 space-y-3">
            {docs.map((doc) => (
              <li key={doc.id} className="card-elevated flex flex-wrap items-center justify-between gap-3 p-4">
                <span>{pick(locale, doc.title_es, doc.title_eu)}</span>
                <a
                  href={doc.file_url}
                  className="font-display text-sm uppercase text-primary"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {t(locale, "download")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </SiteLayout>
  );
}

export function DocumentsPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const categories = Array.from(new Set(content.documents.map((d) => d.category)));
  return (
    <SiteLayout locale={locale} path="/documentos">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "documents_title")}
        intro={t(locale, "documents_intro")}
      />
      <Section>
        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-xl">{t(locale, `cat_${category}`)}</h2>
            <ul className="mt-4 space-y-3">
              {content.documents
                .filter((d) => d.category === category)
                .map((doc) => (
                  <li key={doc.id} className="card-elevated flex flex-wrap items-center justify-between gap-3 p-4">
                    <span>{pick(locale, doc.title_es, doc.title_eu)}</span>
                    <a
                      href={doc.file_url}
                      className="font-display text-sm uppercase text-primary"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {t(locale, "download")}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Section>
    </SiteLayout>
  );
}

export function ContactPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/contacto">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "contact_title")}
        intro={t(locale, "contact_intro")}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-elevated p-6">
            <h2 className="text-xl">{t(locale, "contact_title")}</h2>
            <p className="mt-3 text-muted-foreground">{content.texts.contact_info?.[locale]}</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a className="text-primary underline" href="mailto:info@judolegazpi.com">
                  info@judolegazpi.com
                </a>
              </li>
              <li>
                <a
                  className="text-primary underline"
                  href={content.texts.social_instagram?.[locale] ?? "#"}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="text-primary underline"
                  href={content.texts.social_telegram?.[locale] ?? "#"}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-sm border border-border">
            <iframe
              title={locale === "eu" ? "Legazpiko kiroldegiaren mapa" : "Mapa del polideportivo de Legazpi"}
              src="https://www.openstreetmap.org/export/embed.html?bbox=-2.3450%2C43.0530%2C-2.3230%2C43.0640&layer=mapnik"
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
