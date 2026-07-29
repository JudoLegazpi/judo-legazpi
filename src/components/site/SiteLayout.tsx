import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, CalendarDays, Clock, Mail, Instagram, Send } from "lucide-react";
import { localePath, t, type Locale } from "@/lib/i18n";
import logoAsset from "@/assets/logo-judo-legazpi.png.asset.json";

const JOIN_URL = "https://judolegazpi.playoffinformatica.com/preinscripcion/";

type NavItem = { path: string; labelKey: string; hash?: string };

/** Navegación principal: una sola página con anclas, como pidió el club. */
const NAV: NavItem[] = [
  { path: "/", labelKey: "nav_home" },
  { path: "/", labelKey: "nav_club", hash: "kluba" },
  { path: "/", labelKey: "nav_staff", hash: "taldea" },
  { path: "/", labelKey: "nav_calendar", hash: "egutegia" },
  { path: "/", labelKey: "nav_schedule", hash: "ordutegia" },
  { path: "/torneos", labelKey: "nav_tournaments" },
];

const SECONDARY: NavItem[] = [
  { path: "/lopivi", labelKey: "nav_lopivi" },
  { path: "/documentos", labelKey: "nav_documents" },
  { path: "/contacto", labelKey: "nav_contact" },
];

// El router tipa `to` con las rutas literales; construimos la ruta por idioma.
function to(locale: Locale, path: string) {
  return localePath(locale, path) as never;
}

function Wordmark({ locale }: { locale: Locale }) {
  return (
    <Link to={to(locale, "/")} className="flex min-w-0 items-center gap-3">
      <img
        src={logoAsset.url}
        alt="Club Judo Legazpi"
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 object-contain"
      />
      <span className="block truncate font-display text-lg leading-none font-bold uppercase tracking-wide text-accent">
        Judo Legazpi
      </span>
    </Link>
  );
}

function LanguageSwitch({ locale, path }: { locale: Locale; path: string }) {
  const base = "px-2 py-1 font-display text-xs uppercase";
  return (
    <div className="flex items-center overflow-hidden rounded-sm border border-ink-border" aria-label="Idioma / Hizkuntza">
      <Link
        to={to("es", path)}
        className={locale === "es" ? `${base} bg-accent text-accent-foreground` : `${base} text-ink-muted`}
      >
        ES
      </Link>
      <Link
        to={to("eu", path)}
        className={locale === "eu" ? `${base} bg-accent text-accent-foreground` : `${base} text-ink-muted`}
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-foreground"
      >
        {locale === "eu" ? "Edukira joan" : "Ir al contenido"}
      </a>

      <header className="surface-ink sticky top-0 z-40 border-b border-ink-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-6">
          <Wordmark locale={locale} />

          <div className="flex items-center gap-3">
            <nav className="hidden lg:block" aria-label={t(locale, "menu")}>
              <ul className="flex items-center gap-5">
                {NAV.map((item) => (
                  <li key={item.labelKey}>
                    <Link
                      to={to(locale, item.path)}
                      hash={item.hash}
                      className="font-display text-sm font-medium uppercase tracking-wide text-ink-foreground/85 transition-colors hover:text-accent"
                    >
                      {t(locale, item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href={JOIN_URL}
              rel="noreferrer noopener"
              target="_blank"
              className="hidden min-h-10 items-center rounded-sm bg-accent px-4 font-display text-xs font-semibold uppercase tracking-wider text-accent-foreground lg:inline-flex"
            >
              {t(locale, "join_short")}
            </a>
            <div className="hidden lg:block">
              <LanguageSwitch locale={locale} path={path} />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? t(locale, "close") : t(locale, "menu")}
              className="grid h-11 w-11 place-items-center rounded-sm border border-ink-border text-ink-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="menu-movil" className="surface-ink border-t border-ink-border lg:hidden" aria-label={t(locale, "menu")}>
            <ul className="mx-auto max-w-6xl px-4 py-2">
              {[...NAV, ...SECONDARY].map((item) => (
                <li key={`${item.path}${item.hash ?? ""}${item.labelKey}`}>
                  <Link
                    to={to(locale, item.path)}
                    hash={item.hash}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink-border py-3 font-display text-base uppercase text-ink-foreground"
                  >
                    {t(locale, item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
              <LanguageSwitch locale={locale} path={path} />
              <a
                href={JOIN_URL}
                rel="noreferrer noopener"
                target="_blank"
                className="inline-flex min-h-10 items-center rounded-sm bg-accent px-4 font-display text-xs font-semibold uppercase tracking-wider text-accent-foreground"
              >
                {t(locale, "join_short")}
              </a>
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
        <Link to={to(locale, "/")} hash="ordutegia" className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs">
          <Clock className="h-5 w-5" aria-hidden />
          {t(locale, "nav_schedule")}
        </Link>
        <Link to={to(locale, "/")} hash="egutegia" className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs">
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
