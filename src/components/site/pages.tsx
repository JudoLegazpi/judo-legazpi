import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ShieldCheck, Users } from "lucide-react";
import heroImg from "@/assets/hero-judo.jpg";
import kidsImg from "@/assets/club-kids.jpg";
import { PageHeader, Section, SiteLayout } from "@/components/site/SiteLayout";
import { dayName, formatDate, localePath, pick, t, type Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/site-content.functions";
import { EMPTY_SITE_CONTENT } from "@/lib/site-content";

const to = (locale: Locale, path: string) => localePath(locale, path) as never;

export function HomePage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const upcoming = content.events
    .filter((e) => new Date(`${e.event_date}T00:00:00`) >= new Date(new Date().toDateString()))
    .slice(0, 3);

  const groups = Array.from(
    new Map(
      content.schedules.map((s) => [
        pick(locale, s.group_es, s.group_eu),
        { name: pick(locale, s.group_es, s.group_eu), age: s.age_range ?? "" },
      ]),
    ).values(),
  );

  return (
    <SiteLayout locale={locale} path="/">
      <section className="relative isolate">
        <img
          src={heroImg}
          alt={locale === "eu" ? "Judokak tatamian entrenatzen" : "Judokas entrenando sobre el tatami"}
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="overlay-ink absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 py-20 lg:px-6 lg:py-32">
          <p className="eyebrow">{t(locale, "hero_kicker")}</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-ink-foreground sm:text-5xl lg:text-6xl">
            {t(locale, "hero_title")}
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-foreground/85">
            {content.texts.home_intro?.[locale] ?? ""}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={to(locale, "/contacto")}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 font-display text-sm uppercase tracking-wide text-primary-foreground"
            >
              {t(locale, "cta_try")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={to(locale, "/horarios")}
              className="inline-flex min-h-11 items-center rounded-sm border border-ink-foreground/40 px-5 font-display text-sm uppercase tracking-wide text-ink-foreground"
            >
              {t(locale, "cta_schedule")}
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl sm:text-3xl">{t(locale, "next_events")}</h2>
            <ul className="mt-6 space-y-3">
              {upcoming.length === 0 && (
                <li className="text-muted-foreground">{t(locale, "calendar_empty")}</li>
              )}
              {upcoming.map((event) => (
                <li key={event.id} className="card-elevated flex flex-wrap items-center gap-4 p-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-sm bg-secondary font-display text-xl">
                    {new Date(`${event.event_date}T00:00:00`).getDate()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base uppercase">
                      {pick(locale, event.title_es, event.title_eu)}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {formatDate(locale, event.event_date)}
                      {event.location ? ` · ${event.location}` : ""}
                    </span>
                  </span>
                  <span className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold uppercase text-accent-foreground">
                    {t(locale, `cat_${event.category}`)}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to={to(locale, "/calendario")}
              className="mt-6 inline-flex items-center gap-2 font-display text-sm uppercase text-primary"
            >
              {t(locale, "see_all")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <aside className="card-elevated p-6">
            <h2 className="text-xl">{t(locale, "nav_schedule")}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {groups.map((group) => (
                <li key={group.name} className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                  <span className="font-semibold">{group.name}</span>
                  <span className="text-muted-foreground">{group.age}</span>
                </li>
              ))}
            </ul>
            <Link
              to={to(locale, "/horarios")}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
            >
              {t(locale, "cta_schedule")}
            </Link>
          </aside>
        </div>
      </Section>

      <section className="surface-ink">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 lg:px-6">
          {[
            { icon: Users, key: "nav_staff", path: "/cuerpo-tecnico", textKey: "staff_intro" },
            { icon: CalendarDays, key: "nav_tournaments", path: "/torneos", textKey: "tournaments_intro" },
            { icon: ShieldCheck, key: "nav_lopivi", path: "/lopivi", textKey: "lopivi_title" },
          ].map((item) => (
            <Link key={item.path} to={to(locale, item.path)} className="group block">
              <item.icon className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="mt-3 text-xl text-ink-foreground">{t(locale, item.key)}</h2>
              <p className="mt-2 text-sm text-ink-muted">{t(locale, item.textKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img
            src={kidsImg}
            alt={locale === "eu" ? "Haurren judo saioa" : "Clase de judo infantil"}
            width={1280}
            height={960}
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
          <div>
            <p className="eyebrow">{t(locale, "club_title")}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">{t(locale, "club_name")}</h2>
            <p className="mt-4 text-muted-foreground">{content.texts.club_history?.[locale] ?? ""}</p>
            <Link
              to={to(locale, "/club")}
              className="mt-6 inline-flex items-center gap-2 font-display text-sm uppercase text-primary"
            >
              {t(locale, "more_info")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>
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
            src={kidsImg}
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

export function CalendarPage({ locale, content = EMPTY_SITE_CONTENT }: { locale: Locale; content?: SiteContent }) {
  const today = new Date(new Date().toDateString());
  const upcoming = content.events.filter((e) => new Date(`${e.event_date}T00:00:00`) >= today);
  const past = content.events.filter((e) => new Date(`${e.event_date}T00:00:00`) < today).reverse();

  return (
    <SiteLayout locale={locale} path="/calendario">
      <PageHeader
        eyebrow={t(locale, "club_name")}
        title={t(locale, "calendar_title")}
        intro={t(locale, "calendar_intro")}
      />
      <Section>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">{t(locale, "calendar_empty")}</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((event) => (
              <li key={event.id} className="card-elevated p-5">
                <p className="eyebrow">{t(locale, `cat_${event.category}`)}</p>
                <h2 className="mt-1 text-xl">{pick(locale, event.title_es, event.title_eu)}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDate(locale, event.event_date)}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pick(locale, event.description_es, event.description_eu)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-12 text-xl">{t(locale, "past_events")}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {past.map((event) => (
                <li key={event.id} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2">
                  <span>{pick(locale, event.title_es, event.title_eu)}</span>
                  <span>{formatDate(locale, event.event_date)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
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
