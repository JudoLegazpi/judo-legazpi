import { Download, ChevronDown, Mail } from "lucide-react";
import heroImg from "@/assets/hero-judo.jpg";
import kidsImg from "@/assets/club-kids.jpg";
import { PageHeader, Section, SiteLayout } from "@/components/site/SiteLayout";
import { dayName, formatDate, pick, t, tx, type Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/site-content.functions";
import { EMPTY_SITE_CONTENT } from "@/lib/site-content";

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

/** Los tres apartados fijos de LOPIVI, cada uno con título y enlace editables por idioma. */
function LopiviItems({ locale, content, tone }: { locale: Locale; content: SiteContent; tone: "ink" | "light" }) {
  const items = [1, 2, 3]
    .map((n) => ({
      title: tx(content.texts, locale, `lopivi_item${n}_title`),
      url: (content.texts[`lopivi_item${n}_url`]?.[locale] ?? "").trim(),
    }))
    .filter((item) => Boolean(item.title));


  if (items.length === 0) return null;

  const linkClass =
    tone === "ink"
      ? "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-ink-border px-5 font-display text-xs uppercase tracking-wider text-ink-foreground"
      : "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border border-border px-5 font-display text-xs uppercase tracking-wider text-foreground";

  return (
    <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.title}>
          {item.url ? (
            <a href={item.url} rel="noreferrer noopener" target="_blank" className={linkClass}>
              <Download className="h-4 w-4" aria-hidden />
              {item.title}
            </a>
          ) : (
            <span className={`${linkClass} opacity-60`}>{item.title}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function LopiviEmail({ locale, content, tone }: { locale: Locale; content: SiteContent; tone: "ink" | "light" }) {
  const email = tx(content.texts, locale, "lopivi_email").toLowerCase();
  return (
    <>
      <p className={`mt-8 text-sm ${tone === "ink" ? "text-ink-muted" : "text-muted-foreground"}`}>
        {tx(content.texts, locale, "lopivi_mail_label")}
      </p>
      <a
        href={`mailto:${email}`}
        className={`mt-2 inline-flex items-center gap-2 font-display text-base lowercase ${
          tone === "ink" ? "text-accent" : "text-primary"
        }`}
      >
        <Mail className="h-4 w-4" aria-hidden /> {email}
      </a>
    </>
  );
}

export function HomePage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  // Tabla semanal: filas = franjas horarias, columnas = días con clase.
  const days = Array.from(new Set(content.schedules.map((s) => s.day_of_week))).sort((a, b) => a - b);
  const slots = Array.from(
    new Set(content.schedules.map((s) => `${s.start_time.slice(0, 5)}|${s.end_time.slice(0, 5)}`)),
  ).sort();

  return (
    <SiteLayout locale={locale} path="/" texts={content.texts}>
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
          <p className="mt-6 text-base text-ink-muted sm:text-lg">{tx(content.texts, locale, "hero_tagline")}</p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={tx(content.texts, locale, "join_url")}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-7 font-display text-sm font-semibold uppercase tracking-wider text-accent-foreground"
            >
              {tx(content.texts, locale, "cta_join")}
            </a>
            <a
              href="#kluba"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-ink-foreground/50 px-7 font-display text-sm font-semibold uppercase tracking-wider text-ink-foreground"
            >
              {tx(content.texts, locale, "cta_know")}
            </a>
          </div>
          <ChevronDown className="mt-12 h-6 w-6 animate-bounce text-accent" aria-hidden />
        </div>
      </section>

      {/* KLUBA */}
      <section id="kluba" className="scroll-mt-20">
        <Section>
          <SectionHead title={tx(content.texts, locale, "club_section_title")} />
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
            </div>
          </div>
        </Section>
      </section>

      {/* EKIPO TEKNIKOA */}
      {content.staff.length > 0 && (
        <section id="taldea" className="scroll-mt-20 bg-secondary">
          <Section>
            <SectionHead
              title={tx(content.texts, locale, "staff_title")}
              subtitle={tx(content.texts, locale, "staff_intro")}
            />
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
          <h2 className="text-3xl text-ink-foreground sm:text-4xl">{tx(content.texts, locale, "lopivi_title")}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 bg-accent" aria-hidden />
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">{tx(content.texts, locale, "lopivi_docs_intro")}</p>
          <LopiviItems locale={locale} content={content} tone="ink" />
          <LopiviEmail locale={locale} content={content} tone="ink" />
        </div>
      </section>

      {/* EGUTEGIA */}
      <section id="egutegia" className="scroll-mt-20">
        <Section>
          <SectionHead
            title={tx(content.texts, locale, "calendar_title")}
            subtitle={tx(content.texts, locale, "calendar_season")}
          />
          <CalendarBlock locale={locale} content={content} />
        </Section>
      </section>

      {/* ORDUTEGIA */}
      <section id="ordutegia" className="scroll-mt-20 bg-secondary">
        <Section>
          <SectionHead
            title={tx(content.texts, locale, "schedule_title")}
            subtitle={tx(content.texts, locale, "calendar_season")}
          />
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
          <p className="mt-6 text-sm text-muted-foreground">{tx(content.texts, locale, "schedule_place")}</p>
        </Section>
      </section>

      {/* BATU GURE TALDERA */}
      <section id="izena" className="scroll-mt-20 bg-accent">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6">
          <h2 className="text-3xl text-accent-foreground sm:text-4xl">{tx(content.texts, locale, "join_title")}</h2>
          <p className="mt-4 text-accent-foreground/80">{tx(content.texts, locale, "join_text")}</p>
          <a
            href={tx(content.texts, locale, "join_url")}
            rel="noreferrer noopener"
            target="_blank"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-ink px-8 font-display text-sm font-semibold uppercase tracking-wider text-ink-foreground"
          >
            {tx(content.texts, locale, "join_short")}
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}

export function StaffPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/cuerpo-tecnico" texts={content.texts}>
      <PageHeader
        eyebrow={tx(content.texts, locale, "club_name")}
        title={tx(content.texts, locale, "staff_title")}
        intro={tx(content.texts, locale, "staff_intro")}
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
          <p className="text-base text-muted-foreground">{tx(content.texts, locale, "calendar_download_intro")}</p>
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
              <Download className="h-4 w-4" aria-hidden /> {tx(content.texts, locale, "calendar_download_label")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function CalendarPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/calendario" texts={content.texts}>
      <PageHeader
        eyebrow={tx(content.texts, locale, "club_name")}
        title={tx(content.texts, locale, "calendar_title")}
        intro={tx(content.texts, locale, "calendar_season")}
      />
      <Section>
        <CalendarBlock locale={locale} content={content} />
      </Section>
    </SiteLayout>
  );
}

export function TournamentsPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  return (
    <SiteLayout locale={locale} path="/torneos" texts={content.texts}>
      <PageHeader
        eyebrow={tx(content.texts, locale, "club_name")}
        title={tx(content.texts, locale, "tournaments_title")}
        intro={tx(content.texts, locale, "tournaments_intro")}
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
  return (
    <SiteLayout locale={locale} path="/lopivi" texts={content.texts}>
      <PageHeader eyebrow="LOPIVI" title={tx(content.texts, locale, "lopivi_title")} />
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground">
            {tx(content.texts, locale, "lopivi_docs_intro")}
          </p>
          <LopiviItems locale={locale} content={content} tone="light" />
          <LopiviEmail locale={locale} content={content} tone="light" />
        </div>
      </Section>
    </SiteLayout>
  );
}

export function DocumentsPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const categories = Array.from(new Set(content.documents.map((d) => d.category)));
  return (
    <SiteLayout locale={locale} path="/documentos" texts={content.texts}>
      <PageHeader
        eyebrow={tx(content.texts, locale, "club_name")}
        title={tx(content.texts, locale, "documents_title")}
        intro={tx(content.texts, locale, "documents_intro")}
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
  const email = tx(content.texts, locale, "contact_email");
  return (
    <SiteLayout locale={locale} path="/contacto" texts={content.texts}>
      <PageHeader
        eyebrow={tx(content.texts, locale, "club_name")}
        title={tx(content.texts, locale, "contact_title")}
        intro={tx(content.texts, locale, "contact_intro")}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-elevated p-6">
            <h2 className="text-xl">{tx(content.texts, locale, "contact_title")}</h2>
            <p className="mt-3 text-muted-foreground">{content.texts.contact_info?.[locale]}</p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a className="text-primary underline" href={`mailto:${email}`}>
                  {email}
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
