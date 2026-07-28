import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, CalendarDays, Clock, Mail, Instagram, Send } from "lucide-react";
import { localePath, t, type Locale } from "@/lib/i18n";

type NavItem = { path: string; labelKey: string };

const NAV: NavItem[] = [
  { path: "/club", labelKey: "nav_club" },
  { path: "/horarios", labelKey: "nav_schedule" },
  { path: "/calendario", labelKey: "nav_calendar" },
  { path: "/torneos", labelKey: "nav_tournaments" },
  { path: "/cuerpo-tecnico", labelKey: "nav_staff" },
  { path: "/contacto", labelKey: "nav_contact" },
];

const SECONDARY: NavItem[] = [
  { path: "/lopivi", labelKey: "nav_lopivi" },
  { path: "/documentos", labelKey: "nav_documents" },
];

// El router tipa `to` con las rutas literales; construimos la ruta por idioma.
function to(locale: Locale, path: string) {
  return localePath(locale, path) as never;
}

function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link to={to(locale, "/")} className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-primary font-display text-lg font-semibold text-primary-foreground"
      >
        JL
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-base leading-none font-semibold uppercase">
          Judo Legazpi
        </span>
        <span className="block text-xs text-muted-foreground">
          {locale === "eu" ? "Judo Kluba · 1978" : "Club de Judo · 1978"}
        </span>
      </span>
    </Link>
  );
}

function LanguageSwitch({ locale, path }: { locale: Locale; path: string }) {
  return (
    <div className="flex items-center gap-1 text-xs font-semibold" aria-label="Idioma / Hizkuntza">
      <Link
        to={to("es", path)}
        className={locale === "es" ? "rounded-sm bg-foreground px-2 py-1 text-background" : "px-2 py-1 text-muted-foreground"}
      >
        ES
      </Link>
      <Link
        to={to("eu", path)}
        className={locale === "eu" ? "rounded-sm bg-foreground px-2 py-1 text-background" : "px-2 py-1 text-muted-foreground"}
      >
        EU
      </Link>
    </div>
  );
}

export function SiteLayout({
  locale,
  path,
  children,
}: {
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {locale === "eu" ? "Edukira joan" : "Ir al contenido"}
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-6">
          <Wordmark locale={locale} />

          <div className="flex items-center gap-2">
            <nav className="hidden lg:block" aria-label={t(locale, "menu")}>
              <ul className="flex items-center gap-5">
                {NAV.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={to(locale, item.path)}
                      className="font-display text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:text-primary"
                      activeProps={{ className: "text-primary" }}
                    >
                      {t(locale, item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="hidden lg:block">
              <LanguageSwitch locale={locale} path={path} />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? t(locale, "close") : t(locale, "menu")}
              className="grid h-11 w-11 place-items-center rounded-sm border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="menu-movil" className="border-t border-border bg-background lg:hidden" aria-label={t(locale, "menu")}>
            <ul className="mx-auto max-w-6xl px-4 py-2">
              {[...NAV, ...SECONDARY].map((item) => (
                <li key={item.path}>
                  <Link
                    to={to(locale, item.path)}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-3 font-display text-base uppercase"
                    activeProps={{ className: "text-primary" }}
                  >
                    {t(locale, item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-auto max-w-6xl px-4 py-3">
              <LanguageSwitch locale={locale} path={path} />
            </div>
          </nav>
        )}
      </header>

      <main id="contenido" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      <Footer locale={locale} />

      {/* Barra inferior móvil con las tres acciones más buscadas */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background lg:hidden"
        aria-label={locale === "eu" ? "Sarbide azkarra" : "Accesos rápidos"}
      >
        <Link to={to(locale, "/horarios")} className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs" activeProps={{ className: "text-primary" }}>
          <Clock className="h-5 w-5" aria-hidden />
          {t(locale, "nav_schedule")}
        </Link>
        <Link to={to(locale, "/calendario")} className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs" activeProps={{ className: "text-primary" }}>
          <CalendarDays className="h-5 w-5" aria-hidden />
          {t(locale, "nav_calendar")}
        </Link>
        <Link to={to(locale, "/contacto")} className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs" activeProps={{ className: "text-primary" }}>
          <Mail className="h-5 w-5" aria-hidden />
          {t(locale, "nav_contact")}
        </Link>
      </nav>
    </div>
  );
}

function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="surface-ink mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 lg:px-6">
        <div>
          <p className="font-display text-lg uppercase">{t(locale, "club_name")}</p>
          <p className="mt-2 text-sm text-ink-muted">
            Polideportivo Municipal · 20230 Legazpi (Gipuzkoa)
          </p>
        </div>
        <nav aria-label={t(locale, "menu")}>
          <ul className="space-y-2 text-sm">
            {[...NAV, ...SECONDARY].map((item) => (
              <li key={item.path}>
                <Link to={to(locale, item.path)} className="text-ink-muted hover:text-ink-foreground">
                  {t(locale, item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-3 text-sm">
          <a
            href="https://instagram.com/judolegazpi"
            className="flex items-center gap-2 text-ink-muted hover:text-ink-foreground"
            rel="noreferrer noopener"
            target="_blank"
          >
            <Instagram className="h-4 w-4" aria-hidden /> Instagram
          </a>
          <a
            href="https://t.me/judolegazpi"
            className="flex items-center gap-2 text-ink-muted hover:text-ink-foreground"
            rel="noreferrer noopener"
            target="_blank"
          >
            <Send className="h-4 w-4" aria-hidden /> Telegram
          </a>
          <Link to="/auth" className="block text-xs text-ink-muted underline">
            {t(locale, "admin")}
          </Link>
        </div>
      </div>
      <div className="border-t border-ink-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-muted lg:px-6">
          © {new Date().getFullYear()} {t(locale, "club_name")}
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-base text-muted-foreground">{intro}</p>}
      </div>
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`mx-auto max-w-6xl px-4 py-12 lg:px-6 lg:py-16 ${className}`}>{children}</section>;
}
