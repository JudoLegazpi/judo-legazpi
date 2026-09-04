import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Home,
  Images,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Tags,
  Timer,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LOPIVI_ICON_NAMES, lopiviIcon } from "@/lib/lopivi-icons";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  ConfirmDelete,
  DarkButton,
  EmptyState,
  GhostButton,
  Loading,
  StatusBadge,
} from "@/components/admin/kit";

import {
  DEFAULT_CALENDAR_STYLE,
  DEFAULT_SCHEDULE_STYLE,
  type CalendarStyle,
  type ScheduleStyle,
} from "@/lib/site-content.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de gestión — Club Judo Legazpi" },
      { name: "description", content: "Gestión de contenidos del Club Judo Legazpi." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel de gestión" },
      { property: "og:description", content: "Área privada del Club Judo Legazpi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "time"
    | "select"
    | "boolean"
    | "url"
    | "color"
    | "poster"
    | "status";
  options?: { value: string; label: string }[];
  accept?: string;
  required?: boolean;
};

type TableConfig = {
  key: string;
  table: "schedules" | "staff" | "tournaments" | "lopivi_buttons" | "tournament_statuses";
  label: string;
  orderBy: string;
  titleField: string;
  fields: Field[];
};

const DAYS = [1, 2, 3, 4, 5, 6, 7].map((d) => ({
  value: String(d),
  label: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][d - 1],
}));

const SCHEDULES_CONFIG: TableConfig = {
  key: "horarios",
  table: "schedules",
  label: "Grupos y horarios",
  orderBy: "sort_order",
  titleField: "group_es",
  fields: [
    { name: "group_es", label: "Grupo (castellano)", type: "text", required: true },
    { name: "group_eu", label: "Grupo (euskera)", type: "text" },
    { name: "age_range", label: "Edades", type: "text" },
    { name: "day_of_week", label: "Día", type: "select", options: DAYS, required: true },
    { name: "start_time", label: "Hora inicio", type: "time", required: true },
    { name: "end_time", label: "Hora fin", type: "time", required: true },
    { name: "location", label: "Lugar", type: "text" },
    { name: "sort_order", label: "Orden", type: "number" },
  ],
};

const STAFF_CONFIG: TableConfig = {
  key: "staff",
  table: "staff",
  label: "Personas del cuerpo técnico",
  orderBy: "sort_order",
  titleField: "name",
  fields: [
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "role_es", label: "Cargo (castellano)", type: "text" },
    { name: "role_eu", label: "Cargo (euskera)", type: "text" },
    { name: "belt", label: "Cinturón", type: "text" },
    { name: "qualifications", label: "Titulación", type: "text" },
    { name: "bio_es", label: "Biografía (castellano)", type: "textarea" },
    { name: "bio_eu", label: "Biografía (euskera)", type: "textarea" },
    { name: "photo_url", label: "Foto", type: "poster" },
    { name: "sort_order", label: "Orden", type: "number" },
  ],
};

const TOURNAMENTS_CONFIG: TableConfig = {
  key: "torneos",
  table: "tournaments",
  label: "Torneos organizados",
  orderBy: "event_date",
  titleField: "title_es",
  fields: [
    { name: "slug", label: "Identificador (sin espacios)", type: "text", required: true },
    { name: "title_es", label: "Título (castellano)", type: "text", required: true },
    { name: "title_eu", label: "Título (euskera)", type: "text" },
    { name: "edition", label: "Edición", type: "text" },
    { name: "event_date", label: "Fecha", type: "date" },
    { name: "location", label: "Lugar (castellano)", type: "text" },
    { name: "location_eu", label: "Lugar (euskera)", type: "text" },
    { name: "categories_es", label: "Categorías o edades (castellano)", type: "text" },
    { name: "categories_eu", label: "Categorías o edades (euskera)", type: "text" },
    { name: "status_id", label: "Estado del torneo", type: "status" },
    { name: "description_es", label: "Descripción (castellano)", type: "textarea" },
    { name: "description_eu", label: "Descripción (euskera)", type: "textarea" },
    { name: "poster_url", label: "Cartel del torneo", type: "poster" },
    { name: "results_url", label: "Resultados (URL externa)", type: "url" },

    { name: "published", label: "Publicado", type: "boolean" },
  ],
};

const LOPIVI_CONFIG: TableConfig = {
  key: "lopivi-buttons",
  table: "lopivi_buttons",
  label: "Botones de LOPIVI",
  orderBy: "sort_order",
  titleField: "title_es",
  fields: [
    { name: "title_es", label: "Título (castellano)", type: "text", required: true },
    { name: "title_eu", label: "Título (euskera)", type: "text" },
    { name: "description_es", label: "Descripción corta (castellano)", type: "text" },
    { name: "description_eu", label: "Descripción corta (euskera)", type: "text" },
    { name: "url_es", label: "Enlace (castellano)", type: "text" },
    { name: "url_eu", label: "Enlace (euskera)", type: "text" },
    {
      name: "icon",
      label: "Icono",
      type: "select",
      options: LOPIVI_ICON_NAMES.map((name) => ({ value: name, label: name })),
    },
    { name: "icon_color", label: "Color del icono", type: "color" },
    { name: "bg_color", label: "Color de fondo de la tarjeta", type: "color" },
    { name: "text_color", label: "Color del texto", type: "color" },
    {
      name: "text_size",
      label: "Tamaño del texto",
      type: "select",
      options: [
        { value: "0.875rem", label: "Pequeño" },
        { value: "1rem", label: "Normal" },
        { value: "1.125rem", label: "Grande" },
        { value: "1.375rem", label: "Muy grande" },
      ],
    },
    { name: "new_tab", label: "Abrir en pestaña nueva", type: "boolean" },
    { name: "sort_order", label: "Orden", type: "number" },
    { name: "active", label: "Visible en la web", type: "boolean" },
  ],
};

const STATUSES_CONFIG: TableConfig = {
  key: "estados-torneos",
  table: "tournament_statuses",
  label: "Estados de los torneos",
  orderBy: "sort_order",
  titleField: "name_es",
  fields: [
    { name: "name_es", label: "Nombre (castellano)", type: "text", required: true },
    { name: "name_eu", label: "Nombre (euskera)", type: "text" },
    {
      name: "icon",
      label: "Icono",
      type: "select",
      options: LOPIVI_ICON_NAMES.map((name) => ({ value: name, label: name })),
    },
    { name: "bg_color", label: "Color de fondo", type: "color" },
    { name: "text_color", label: "Color del texto", type: "color" },
    { name: "sort_order", label: "Orden", type: "number" },
    { name: "active", label: "Activo", type: "boolean" },
  ],
};

/** Cada pestaña corresponde a una sección pública de la web. */
type SectionTab = {
  key: string;
  label: string;
  icon: LucideIcon;
  title: string;
  help?: string;
  textKeys?: string[];
  imageKeys?: string[];
  crud?: TableConfig;
  extra?: "calendar" | "scheduleStyle" | "tournamentDocs";
};

const SECTIONS: SectionTab[] = [
  {
    key: "inicio",
    icon: Home,
    label: "Inicio",
    title: "Portada",
    help: "Imagen principal, lema y botones de la portada.",
    imageKeys: ["hero"],
    textKeys: ["hero_tagline", "hero_descriptor", "home_intro", "cta_join", "cta_know", "join_title", "join_text", "join_url"],
  },
  {
    key: "club",
    icon: Images,
    label: "El club",
    title: "Sección «El club»",
    imageKeys: ["club"],
    textKeys: ["club_section_title", "club_history", "club_values"],
  },
  {
    key: "cuerpo-tecnico",
    icon: Users,
    label: "Cuerpo técnico",
    title: "Cuerpo técnico",
    crud: STAFF_CONFIG,
    textKeys: ["staff_title", "staff_intro"],
  },
  {
    key: "lopivi",
    icon: ShieldCheck,
    label: "LOPIVI",
    title: "LOPIVI y protección de la infancia",
    help: "Los botones se muestran como tarjetas pulsables; puedes elegir icono, colores, tamaño del texto y orden.",
    imageKeys: ["lopivi"],
    crud: LOPIVI_CONFIG,
    textKeys: ["lopivi_title", "lopivi_docs_intro", "lopivi_intro", "lopivi_mail_label", "lopivi_email", "lopivi_contact"],
  },
  {
    key: "horarios",
    icon: Timer,
    label: "Horarios",
    title: "Horarios",
    crud: SCHEDULES_CONFIG,
    extra: "scheduleStyle",
    textKeys: ["schedule_title", "schedule_place", "calendar_season"],
  },
  {
    key: "calendario",
    icon: CalendarDays,
    label: "Calendario",
    title: "Calendario de temporada",
    extra: "calendar",
    textKeys: ["calendar_title", "calendar_download_intro", "calendar_download_label"],
  },
  {
    key: "torneos",
    icon: Trophy,
    label: "Torneos",
    title: "Torneos",
    help: "Cada torneo puede tener enlaces ilimitados a documentos externos.",
    crud: TOURNAMENTS_CONFIG,
    extra: "tournamentDocs",
    textKeys: ["tournaments_title", "tournaments_intro"],
  },
  {
    key: "estados-torneos",
    icon: Tags,
    label: "Estados de torneos",
    title: "Estados de los torneos",
    help: "Crea, edita, ordena, activa o desactiva los estados. No se puede borrar un estado asignado a algún torneo.",
    crud: STATUSES_CONFIG,
  },
  {
    key: "general",
    icon: Settings,
    label: "Configuración general",
    title: "Configuración general",
    help: "Elementos comunes a toda la web: datos de contacto del pie, redes sociales, enlaces externos y etiquetas del menú. El idioma por defecto es el euskera.",
    textKeys: [
      "club_name",
      "footer_address",
      "contact_email",
      "contact_phone",
      "contact_phone_label",
      "social_instagram",
      "social_telegram",
      "intranet_url",
      "footer_unsubscribe",
      "footer_unsubscribe_url",
      "join_short",
      "nav_home",
      "nav_club",
      "nav_staff",
      "nav_calendar",
      "nav_schedule",
      "nav_lopivi",
      "nav_tournaments",
      "nav_intranet",
    ],
  },
];





function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<string>("inicio");

  useEffect(() => {
    supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isAdmin === null) {
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-2xl">Sin permisos</h1>
        <p className="mt-2 text-muted-foreground">Esta cuenta no tiene permisos de administración del club.</p>
        <button onClick={signOut} className="mt-6 min-h-11 rounded-2xl border border-border px-4">
          Cerrar sesión
        </button>
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.key === tab) ?? SECTIONS[0];

  return (
    <div className="flex min-h-dvh flex-col bg-secondary lg:flex-row">
      <aside className="border-b border-border bg-background lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex flex-col gap-6 px-4 py-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Administración</p>
            <h1 className="mt-1 truncate font-display text-lg uppercase leading-tight">Gestión del club</h1>
          </div>

          <nav className="flex flex-wrap gap-1 lg:flex-col" aria-label="Secciones">
            {SECTIONS.map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  aria-current={active}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-2xl px-3 text-sm ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
            <Link to="/" className="text-muted-foreground underline">
              Ver la web
            </Link>
            <GhostButton onClick={signOut} className="min-h-10">
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </GhostButton>
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 lg:px-8">
        <div className="border-b border-border pb-6">
          <h2 className="text-2xl">{section.title}</h2>
          {section.help && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{section.help}</p>}
        </div>

        {section.crud && <CrudSection config={section.crud} />}
        {section.extra === "calendar" && (
          <>
            <CalendarEditor />
            <CalendarAgeStyleEditor />
          </>
        )}
        {section.extra === "scheduleStyle" && (
          <>
            <ScheduleStyleEditor />
            <CalendarAgeStyleEditor />
          </>
        )}
        {section.extra === "tournamentDocs" && <TournamentDocsEditor />}

        {section.imageKeys && section.imageKeys.length > 0 && <ImagesEditor keys={section.imageKeys} />}
        {section.textKeys && section.textKeys.length > 0 && <TextsEditor keys={section.textKeys} />}
      </main>
    </div>
  );
}

/** Muestra un aviso flotante y devuelve el mensaje para el texto en línea. */
function report(error: { message: string } | null, ok: string): string {
  if (error) {
    toast.error(error.message);
    return error.message;
  }
  toast.success(ok);
  return ok;
}

type Row = Record<string, unknown> & { id: string };

function CrudSection({ config }: { config: TableConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from(config.table).select("*").order(config.orderBy);
    if (loadError) {
      setError(loadError.message);
      toast.error("No se pudo cargar la lista");
    }
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }, [config.table, config.orderBy]);

  useEffect(() => {
    setEditing(null);
    setQuery("");
    void load();
  }, [load]);

  async function remove(id: string) {
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      toast.error("No se pudo borrar");
    } else {
      toast.success("Elemento borrado");
    }
    await load();
  }

  /** Campo de estado (publicado/visible/activo) si la tabla lo tiene. */
  const stateField = ["published", "visible", "active"].find((key) =>
    config.fields.some((field) => field.name === key),
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => typeof value === "string" && value.toLowerCase().includes(term)),
    );
  }, [rows, query]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="truncate text-xl">{config.label}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar…"
              aria-label="Buscar"
              className="min-h-11 w-44 rounded-2xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </span>
          <DarkButton onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" />
            Añadir
          </DarkButton>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {editing && (
        <RecordForm
          config={config}
          row={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            toast.success("Cambios guardados");
            await load();
          }}
          onError={(message) => {
            setError(message);
            if (message) toast.error("No se pudo guardar");
          }}
        />
      )}

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState
          text={
            rows.length === 0
              ? "Pulsa «Añadir» para crear el primer elemento."
              : "Ningún elemento coincide con la búsqueda."
          }
        />
      ) : (
        <ul className="mt-6 space-y-2">
          {filtered.map((row) => (
            <li key={row.id} className="card-elevated flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-semibold">
                    {String(row[config.titleField] ?? "(sin título)")}
                  </span>
                  {stateField && (
                    <StatusBadge on={Boolean(row[stateField])} onLabel="Visible" offLabel="Oculto" />
                  )}
                </span>
                <span className="block text-xs text-muted-foreground">{String(row[config.orderBy] ?? "")}</span>
              </span>
              <span className="flex gap-2">
                <GhostButton onClick={() => setEditing(row)} className="min-h-10">
                  Editar
                </GhostButton>
                <ConfirmDelete onConfirm={() => void remove(row.id)} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RecordForm({
  config,
  row,
  onCancel,
  onSaved,
  onError,
}: {
  config: TableConfig;
  row: Row | null;
  onCancel: () => void;
  onSaved: () => void | Promise<void>;
  onError: (message: string) => void;
}) {
  const initial = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of config.fields) {
      const raw = row?.[field.name];
      values[field.name] = raw === null || raw === undefined ? "" : String(raw);
    }
    return values;
  }, [config.fields, row]);

  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => setValues(initial), [initial]);




  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = values[field.name];
      if (field.type === "number") payload[field.name] = value === "" ? 0 : Number(value);
      else if (field.type === "boolean") payload[field.name] = value !== "false";
      else if (field.type === "select" && field.name === "day_of_week") payload[field.name] = Number(value);
      else payload[field.name] = value === "" ? null : value;
    }

    // Los campos son dinámicos por tabla, por eso el tipado genérico aquí es laxo.
    const table = supabase.from(config.table) as unknown as {
      update: (payload: Record<string, unknown>) => {
        eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }>;
      };
      insert: (payload: Record<string, unknown>) => PromiseLike<{ error: { message: string } | null }>;
    };
    const query = row ? table.update(payload).eq("id", row.id) : table.insert(payload);

    const { error } = await query;
    setBusy(false);
    if (error) onError(error.message);
    else await onSaved();
  }

  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([]);
  const needsStatuses = config.fields.some((field) => field.type === "status");

  useEffect(() => {
    if (!needsStatuses) return;
    void supabase
      .from("tournament_statuses")
      .select("id,name_es,active")
      .order("sort_order")
      .then(({ data }) =>
        setStatusOptions(
          (data ?? []).map((row) => ({
            value: row.id,
            label: row.active ? row.name_es : `${row.name_es} (inactivo)`,
          })),
        ),
      );
  }, [needsStatuses]);

  const preview = config.table === "lopivi_buttons";
  const statusPreview = config.table === "tournament_statuses";
  const PreviewIcon = lopiviIcon(values.icon);

  return (
    <form onSubmit={save} className="card-elevated mt-6 space-y-4 p-6">
      {preview && (
        <div className="rounded-2xl border border-border bg-muted p-6">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Previsualización</p>
          <span
            className="mx-auto flex min-h-48 max-w-64 flex-col items-center justify-center rounded-3xl p-8 text-center shadow-[0_10px_30px_-18px_rgba(20,48,92,0.45)]"
            style={{ backgroundColor: values.bg_color || "#FFFFFF" }}
          >
            <span
              className="grid h-16 w-16 place-items-center rounded-full"
              style={{ backgroundColor: `${values.icon_color || "#A6ED19"}22` }}
            >
              <PreviewIcon className="h-8 w-8" style={{ color: values.icon_color || "#A6ED19" }} />
            </span>
            <span
              className="mt-5 block font-display leading-snug font-semibold uppercase tracking-wide"
              style={{ color: values.text_color || "#14305C", fontSize: values.text_size || "1rem" }}
            >
              {values.title_es || "Título"}
            </span>
          </span>
        </div>
      )}

      {statusPreview && (
        <div className="rounded-2xl border border-border bg-muted p-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Previsualización</p>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: values.bg_color || "#A6ED19", color: values.text_color || "#14305C" }}
          >
            <PreviewIcon className="h-3.5 w-3.5" />
            {values.name_es || "Estado"}
          </span>
        </div>
      )}

      {config.fields.map((field) => {
        const id = `${config.key}-${field.name}`;
        return (
          <div key={field.name}>
            <label htmlFor={id} className="block text-sm font-semibold">
              {field.label}
            </label>
            {field.type === "textarea" && (
              <textarea
                id={id}
                rows={3}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-input bg-background p-2"
              />
            )}
            {field.type === "select" && (
              <select
                id={id}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-2"
              >
                <option value="">—</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === "boolean" && (
              <select
                id={id}
                value={values[field.name] === "false" ? "false" : "true"}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-2"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            )}
            {field.type === "color" && (
              <div className="mt-1 flex items-center gap-3">
                <input
                  id={id}
                  type="color"
                  value={values[field.name] || "#FFFFFF"}
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                  className="h-11 w-16 rounded-2xl border border-input bg-background"
                />
                <input
                  type="text"
                  aria-label={`${field.label} (código)`}
                  value={values[field.name]}
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                  className="min-h-11 w-32 rounded-2xl border border-input bg-background px-3"
                />
              </div>
            )}
            {field.type === "status" && (
              <select
                id={id}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-2"
              >
                <option value="">Sin estado</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === "poster" && (
              <ImageUploadField
                id={id}
                label={field.label}
                folder={config.key}
                value={values[field.name] || null}
                onChange={(path) => setValues({ ...values, [field.name]: path ?? "" })}
                aspect="aspect-[3/4]"
              />
            )}


            {field.type === "url" && (
              <input
                id={id}
                type="url"
                placeholder="https://…"
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            )}

            {["text", "number", "date", "time"].includes(field.type) && (
              <input
                id={id}
                type={field.type}
                required={field.required}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-2xl bg-primary px-5 font-display text-sm uppercase text-primary-foreground disabled:opacity-60"
        >
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="min-h-11 rounded-2xl border border-border px-5 text-sm">
          Cancelar
        </button>
      </div>
    </form>
  );
}




type ImageRow = { key: string; label: string; image_url: string | null };

function ImagesEditor({ keys }: { keys: string[] }) {
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const keyList = keys.join(",");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("site_images")
      .select("key,label,image_url")
      .in("key", keyList.split(","))
      .order("key");
    setRows((data ?? []) as ImageRow[]);
  }, [keyList]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(row: ImageRow, path: string | null) {
    const { error } = await supabase.from("site_images").update({ image_url: path }).eq("key", row.key);
    setStatus(report(error, `Actualizada: ${row.label}`));
    await load();
  }

  if (rows.length === 0) return null;

  return (
    <section>
      <h3 className="text-xl">Imágenes de esta sección</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Las imágenes se suben desde tu dispositivo y se guardan en el almacenamiento privado del club.
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <li key={row.key} className="card-elevated p-5">
            <ImageUploadField
              id={`img-${row.key}`}
              label={row.label}
              folder="site"
              value={row.image_url}
              onChange={(path) => void save(row, path)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}



type TextRow = { key: string; label: string; value_es: string; value_eu: string };

function TextsEditor({ keys }: { keys: string[] }) {
  const [rows, setRows] = useState<TextRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const keyList = keys.join(",");

  useEffect(() => {
    const order = keyList.split(",");
    supabase
      .from("site_texts")
      .select("key,label,value_es,value_eu")
      .in("key", order)
      .then(({ data }) => {
        const list = (data ?? []) as TextRow[];
        list.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
        setRows(list);
      });
  }, [keyList]);

  async function save(row: TextRow) {
    const { error } = await supabase
      .from("site_texts")
      .update({ value_es: row.value_es, value_eu: row.value_eu })
      .eq("key", row.key);
    setStatus(report(error, `Guardado: ${row.label}`));
  }

  if (rows.length === 0) return null;

  return (
    <section>
      <h3 className="text-xl">Textos de esta sección</h3>
      <p className="mt-1 text-sm text-muted-foreground">Castellano y euskera se editan y guardan de forma independiente.</p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}
      <ul className="mt-4 space-y-4">
        {rows.map((row, index) => (
          <li key={row.key} className="card-elevated p-5">
            <h4 className="text-base">{row.label}</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`${row.key}-es`} className="block text-xs font-semibold">
                  Castellano
                </label>
                <textarea
                  id={`${row.key}-es`}
                  rows={3}
                  value={row.value_es}
                  onChange={(e) => {
                    const next = [...rows];
                    next[index] = { ...row, value_es: e.target.value };
                    setRows(next);
                  }}
                  className="mt-1 w-full rounded-2xl border border-input bg-background p-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor={`${row.key}-eu`} className="block text-xs font-semibold">
                  Euskera
                </label>
                <textarea
                  id={`${row.key}-eu`}
                  rows={3}
                  value={row.value_eu}
                  onChange={(e) => {
                    const next = [...rows];
                    next[index] = { ...row, value_eu: e.target.value };
                    setRows(next);
                  }}
                  className="mt-1 w-full rounded-2xl border border-input bg-background p-2 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => save(row)}
              className="mt-3 min-h-11 rounded-2xl bg-foreground px-4 font-display text-sm uppercase text-background"
            >
              Guardar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const STYLE_FIELDS: { name: keyof ScheduleStyle; label: string; kind: "color" | "size" }[] = [
  { name: "titleSize", label: "Tamaño del título", kind: "size" },
  { name: "titleColor", label: "Color del título", kind: "color" },
  { name: "daySize", label: "Tamaño de los días", kind: "size" },
  { name: "dayColor", label: "Color de los días", kind: "color" },
  { name: "hourSize", label: "Tamaño de las horas", kind: "size" },
  { name: "hourColor", label: "Color de las horas", kind: "color" },
  { name: "groupSize", label: "Tamaño de los grupos", kind: "size" },
  { name: "groupColor", label: "Color de los grupos", kind: "color" },
  { name: "ageSize", label: "Tamaño de las edades", kind: "size" },
  { name: "ageColor", label: "Color del texto de EDADES", kind: "color" },

  { name: "sectionBg", label: "Fondo de la sección", kind: "color" },
  { name: "cardBg", label: "Fondo de la tabla", kind: "color" },
  { name: "borderColor", label: "Color de los bordes", kind: "color" },
  { name: "borderWidth", label: "Grosor de los bordes", kind: "size" },
  { name: "borderRadius", label: "Redondeo de la tabla", kind: "size" },
  { name: "gap", label: "Espaciado interior", kind: "size" },
];

function ScheduleStyleEditor() {
  const [style, setStyle] = useState<ScheduleStyle>(DEFAULT_SCHEDULE_STYLE);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "schedule_style")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setStyle({ ...DEFAULT_SCHEDULE_STYLE, ...(data.value as Partial<ScheduleStyle>) });
      });
  }, []);

  async function save() {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "schedule_style", label: "Estilos de la sección de horarios", value: style });
    setStatus(report(error, "Estilos guardados"));
  }

  return (
    <section>
      <h3 className="text-xl">Aspecto de la tabla de horarios</h3>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div
        className="mt-4 rounded-2xl p-6"
        style={{ backgroundColor: style.sectionBg }}
        aria-label="Previsualización de horarios"
      >
        <p style={{ fontSize: style.titleSize, color: style.titleColor }} className="font-display uppercase">
          Horarios
        </p>
        <table
          className="mt-4 w-full border-collapse text-left"
          style={{
            backgroundColor: style.cardBg,
            border: `${style.borderWidth} solid ${style.borderColor}`,
            borderRadius: style.borderRadius,
          }}
        >
          <tbody>
            <tr>
              <th
                className="font-display uppercase surface-ink"
                style={{
                  padding: style.gap,
                  fontSize: style.daySize,
                  color: style.dayColor,
                  border: `${style.borderWidth} solid ${style.borderColor}`,
                }}
              >
                Lunes
              </th>
              <td
                style={{
                  padding: style.gap,
                  fontSize: style.hourSize,
                  color: style.hourColor,
                  border: `${style.borderWidth} solid ${style.borderColor}`,
                }}
              >
                17:30–18:30
              </td>
              <td
                style={{
                  padding: style.gap,
                  fontSize: style.groupSize,
                  color: style.groupColor,
                  border: `${style.borderWidth} solid ${style.borderColor}`,
                }}
              >
                Benjamín
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card-elevated mt-4 grid gap-4 p-6 sm:grid-cols-2">
        {STYLE_FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={`style-${field.name}`} className="block text-xs font-semibold">
              {field.label}
            </label>
            {field.kind === "color" ? (
              <div className="mt-1 flex items-center gap-3">
                <input
                  id={`style-${field.name}`}
                  type="color"
                  value={style[field.name]}
                  onChange={(e) => setStyle({ ...style, [field.name]: e.target.value })}
                  className="h-11 w-16 rounded-2xl border border-input bg-background"
                />
                <input
                  type="text"
                  aria-label={`${field.label} (código)`}
                  value={style[field.name]}
                  onChange={(e) => setStyle({ ...style, [field.name]: e.target.value })}
                  className="min-h-11 w-32 rounded-2xl border border-input bg-background px-3"
                />
              </div>
            ) : (
              <input
                id={`style-${field.name}`}
                type="text"
                value={style[field.name]}
                onChange={(e) => setStyle({ ...style, [field.name]: e.target.value })}
                placeholder="1rem"
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => void save()}
        className="mt-4 min-h-11 rounded-2xl bg-primary px-5 font-display text-sm uppercase text-primary-foreground"
      >
        Guardar estilos
      </button>
    </section>
  );
}

function CalendarEditor() {
  const [imageEs, setImageEs] = useState<string | null>(null);
  const [imageEu, setImageEu] = useState<string | null>(null);
  const [pdfEs, setPdfEs] = useState("");
  const [pdfEu, setPdfEu] = useState("");
  const [updatedEs, setUpdatedEs] = useState("");
  const [updatedEu, setUpdatedEu] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: imgs }, { data: texts }] = await Promise.all([
      supabase.from("site_images").select("key,image_url").in("key", ["calendar", "calendar_eu"]),
      supabase.from("site_texts").select("key,value_es,value_eu").in("key", ["calendar_pdf_url", "calendar_updated"]),
    ]);
    for (const row of imgs ?? []) {
      if (row.key === "calendar") setImageEs(row.image_url ?? null);
      if (row.key === "calendar_eu") setImageEu(row.image_url ?? null);
    }
    for (const row of texts ?? []) {
      if (row.key === "calendar_pdf_url") {
        setPdfEs(row.value_es ?? "");
        setPdfEu(row.value_eu ?? "");
      }
      if (row.key === "calendar_updated") {
        setUpdatedEs(row.value_es ?? "");
        setUpdatedEu(row.value_eu ?? "");
      }
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveText(key: string, valueEs: string, valueEu: string) {
    const { error } = await supabase.from("site_texts").update({ value_es: valueEs, value_eu: valueEu }).eq("key", key);
    setStatus(report(error, "Guardado"));
  }

  async function saveImage(key: "calendar" | "calendar_eu", path: string | null) {
    const { error } = await supabase.from("site_images").update({ image_url: path }).eq("key", key);
    setStatus(report(error, "Imagen actualizada"));
  }

  return (
    <section>
      <h3 className="text-xl">Imagen, enlaces y fechas del calendario</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        La sección pública muestra la imagen del idioma correspondiente, la fecha de actualización y el botón de
        descarga con la URL del calendario. Las imágenes se suben desde tu dispositivo.
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div className="card-elevated mt-4 space-y-8 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {(
            [
              ["calendar", "Imagen del calendario (castellano)", imageEs, setImageEs, "cal-img-es"] as const,
              ["calendar_eu", "Imagen del calendario (euskera)", imageEu, setImageEu, "cal-img-eu"] as const,
            ]
          ).map(([key, label, path, setPath, id]) => (
            <ImageUploadField
              key={key}
              id={id}
              label={label}
              folder="calendar"
              value={path}
              onChange={(next) => {
                setPath(next);
                void saveImage(key, next);
              }}
            />
          ))}
        </div>



        <div>
          <h4 className="text-base">URLs de descarga del calendario</h4>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="cal-url-es" className="block text-xs font-semibold">
                URL calendario (castellano)
              </label>
              <input
                id="cal-url-es"
                type="url"
                placeholder="https://…"
                value={pdfEs}
                onChange={(e) => setPdfEs(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            </div>
            <div>
              <label htmlFor="cal-url-eu" className="block text-xs font-semibold">
                URL calendario (euskera)
              </label>
              <input
                id="cal-url-eu"
                type="url"
                placeholder="https://…"
                value={pdfEu}
                onChange={(e) => setPdfEu(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            </div>
          </div>
          <button
            onClick={() => void saveText("calendar_pdf_url", pdfEs, pdfEu)}
            className="mt-3 block min-h-11 rounded-2xl bg-foreground px-4 font-display text-sm uppercase text-background"
          >
            Guardar URLs
          </button>
        </div>

        <div>
          <h4 className="text-base">Fecha de actualización</h4>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="cal-updated-es" className="block text-xs font-semibold">
                Castellano (por ejemplo 19/06/2026)
              </label>
              <input
                id="cal-updated-es"
                type="text"
                value={updatedEs}
                onChange={(e) => setUpdatedEs(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            </div>
            <div>
              <label htmlFor="cal-updated-eu" className="block text-xs font-semibold">
                Euskera
              </label>
              <input
                id="cal-updated-eu"
                type="text"
                value={updatedEu}
                onChange={(e) => setUpdatedEu(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-3"
              />
            </div>
          </div>
          <button
            onClick={() => void saveText("calendar_updated", updatedEs, updatedEu)}
            className="mt-3 block min-h-11 rounded-2xl bg-foreground px-4 font-display text-sm uppercase text-background"
          >
            Guardar fechas
          </button>
        </div>
      </div>
    </section>
  );
}

const AGE_SIZE_FIELDS: { name: keyof CalendarStyle; label: string }[] = [
  { name: "ageSizeDesktop", label: "Ordenador" },
  { name: "ageSizeTablet", label: "Tablet" },
  { name: "ageSizeMobile", label: "Móvil" },
];

/** Tamaño del texto de edades y categorías, por dispositivo, con previsualización. */
function CalendarAgeStyleEditor() {
  const [style, setStyle] = useState<CalendarStyle>(DEFAULT_CALENDAR_STYLE);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    void supabase
      .from("site_settings")
      .select("value")
      .eq("key", "calendar_style")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setStyle({ ...DEFAULT_CALENDAR_STYLE, ...(data.value as Partial<CalendarStyle>) });
      });
  }, []);

  async function save() {
    const { error } = await supabase.from("site_settings").upsert({
      key: "calendar_style",
      label: "Tamaños del texto de edades y categorías",
      value: style,
    });
    setStatus(report(error, "Tamaños guardados"));
  }

  function toPx(value: string): number {
    const rem = parseFloat(value);
    return Number.isFinite(rem) ? Math.round(rem * 16) : 14;
  }

  return (
    <section>
      <h3 className="text-xl">Tamaño del texto de edades y categorías</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Se aplica al texto de edades de los horarios y a las categorías de los torneos, sin afectar al resto de textos.
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div className="card-elevated mt-4 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {AGE_SIZE_FIELDS.map((field) => (
            <div key={field.name}>
              <label htmlFor={`age-${field.name}`} className="block text-xs font-semibold">
                {field.label}: {toPx(style[field.name])} px
              </label>
              <input
                id={`age-${field.name}`}
                type="range"
                min={10}
                max={28}
                step={1}
                value={toPx(style[field.name])}
                onChange={(e) => setStyle({ ...style, [field.name]: `${Number(e.target.value) / 16}rem` })}
                className="mt-2 w-full"
              />
              <div className="mt-3 rounded-2xl border border-border bg-muted p-3">
                <p className="text-xs uppercase text-muted-foreground">Previsualización</p>
                <p
                  className="mt-1 font-semibold break-words text-foreground"
                  style={{ fontSize: style[field.name] }}
                >
                  Benjamín · 8-10 urte
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => void save()}
          className="min-h-11 rounded-2xl bg-primary px-5 font-display text-sm uppercase text-primary-foreground"
        >
          Guardar tamaños
        </button>
      </div>
    </section>
  );
}

type TournamentOption = { id: string; title_es: string };
type DocRow = {
  id: string;
  tournament_id: string;
  title_es: string;
  title_eu: string | null;
  url_es: string | null;
  url_eu: string | null;
  locale: string;
  sort_order: number;
  visible: boolean;
};

const EMPTY_DOC = {
  title_es: "",
  title_eu: "",
  url_es: "",
  url_eu: "",
  locale: "both",
  sort_order: 0,
  visible: true,
};

/** Enlaces ilimitados a documentos externos para cada torneo. */
function TournamentDocsEditor() {
  const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
  const [tournamentId, setTournamentId] = useState("");
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [draft, setDraft] = useState(EMPTY_DOC);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("tournaments")
      .select("id,title_es")
      .order("event_date", { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as TournamentOption[];
        setTournaments(list);
        setTournamentId((current) => current || (list[0]?.id ?? ""));
      });
  }, []);

  const load = useCallback(async () => {
    if (!tournamentId) {
      setDocs([]);
      return;
    }
    const { data, error } = await supabase
      .from("tournament_documents")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("sort_order");
    if (error) { setStatus(error.message); toast.error(error.message); }
    setDocs((data ?? []) as DocRow[]);
  }, [tournamentId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!tournamentId || !draft.title_es.trim()) {
      setStatus("Indica al menos el título en castellano");
      return;
    }
    const { error } = await supabase.from("tournament_documents").insert({
      tournament_id: tournamentId,
      title_es: draft.title_es.trim(),
      title_eu: draft.title_eu.trim() || null,
      url_es: draft.url_es.trim() || null,
      url_eu: draft.url_eu.trim() || null,
      locale: draft.locale,
      sort_order: Number(draft.sort_order) || 0,
      visible: draft.visible,
    });
    setStatus(report(error, "Documento añadido"));
    if (!error) setDraft(EMPTY_DOC);
    await load();
  }

  async function update(doc: DocRow) {
    const { error } = await supabase
      .from("tournament_documents")
      .update({
        title_es: doc.title_es,
        title_eu: doc.title_eu,
        url_es: doc.url_es,
        url_eu: doc.url_eu,
        locale: doc.locale,
        sort_order: doc.sort_order,
        visible: doc.visible,
      })
      .eq("id", doc.id);
    setStatus(report(error, "Documento guardado"));
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm("¿Borrar este documento?")) return;
    const { error } = await supabase.from("tournament_documents").delete().eq("id", id);
    setStatus(report(error, "Documento borrado"));
    await load();
  }

  function patch(id: string, changes: Partial<DocRow>) {
    setDocs((list) => list.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  const localeOptions = [
    { value: "both", label: "Los dos idiomas" },
    { value: "es", label: "Solo castellano" },
    { value: "eu", label: "Solo euskera" },
  ];

  return (
    <section>
      <h3 className="text-xl">Documentos de los torneos</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Enlaces externos (URL) por torneo: título, idioma, orden y visibilidad.
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div className="card-elevated mt-4 space-y-6 p-6">
        <div>
          <label htmlFor="doc-tournament" className="block text-xs font-semibold">
            Torneo
          </label>
          <select
            id="doc-tournament"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-2xl border border-input bg-background px-2"
          >
            {tournaments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title_es}
              </option>
            ))}
          </select>
        </div>

        <ul className="space-y-4">
          {docs.map((doc) => (
            <li key={doc.id} className="rounded-2xl border border-border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  aria-label="Título (castellano)"
                  placeholder="Título (castellano)"
                  value={doc.title_es}
                  onChange={(e) => patch(doc.id, { title_es: e.target.value })}
                  className="min-h-11 rounded-2xl border border-input bg-background px-3"
                />
                <input
                  aria-label="Título (euskera)"
                  placeholder="Título (euskera)"
                  value={doc.title_eu ?? ""}
                  onChange={(e) => patch(doc.id, { title_eu: e.target.value })}
                  className="min-h-11 rounded-2xl border border-input bg-background px-3"
                />
                <input
                  aria-label="URL (castellano)"
                  type="url"
                  placeholder="URL (castellano)"
                  value={doc.url_es ?? ""}
                  onChange={(e) => patch(doc.id, { url_es: e.target.value })}
                  className="min-h-11 rounded-2xl border border-input bg-background px-3"
                />
                <input
                  aria-label="URL (euskera)"
                  type="url"
                  placeholder="URL (euskera)"
                  value={doc.url_eu ?? ""}
                  onChange={(e) => patch(doc.id, { url_eu: e.target.value })}
                  className="min-h-11 rounded-2xl border border-input bg-background px-3"
                />
                <select
                  aria-label="Idioma"
                  value={doc.locale}
                  onChange={(e) => patch(doc.id, { locale: e.target.value })}
                  className="min-h-11 rounded-2xl border border-input bg-background px-2"
                >
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <input
                    aria-label="Orden"
                    type="number"
                    value={doc.sort_order}
                    onChange={(e) => patch(doc.id, { sort_order: Number(e.target.value) })}
                    className="min-h-11 w-24 rounded-2xl border border-input bg-background px-3"
                  />
                  <select
                    aria-label="Visible"
                    value={doc.visible ? "true" : "false"}
                    onChange={(e) => patch(doc.id, { visible: e.target.value === "true" })}
                    className="min-h-11 flex-1 rounded-2xl border border-input bg-background px-2"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Oculto</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => void update(doc)}
                  className="min-h-10 rounded-2xl bg-primary px-4 font-display text-sm uppercase text-primary-foreground"
                >
                  Guardar
                </button>
                <button
                  onClick={() => void remove(doc.id)}
                  className="min-h-10 rounded-2xl border border-destructive px-4 text-sm text-destructive"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-dashed border-border p-4">
          <h4 className="text-base">Añadir documento</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              aria-label="Nuevo título (castellano)"
              placeholder="Título (castellano)"
              value={draft.title_es}
              onChange={(e) => setDraft({ ...draft, title_es: e.target.value })}
              className="min-h-11 rounded-2xl border border-input bg-background px-3"
            />
            <input
              aria-label="Nuevo título (euskera)"
              placeholder="Título (euskera)"
              value={draft.title_eu}
              onChange={(e) => setDraft({ ...draft, title_eu: e.target.value })}
              className="min-h-11 rounded-2xl border border-input bg-background px-3"
            />
            <input
              aria-label="Nueva URL (castellano)"
              type="url"
              placeholder="URL (castellano)"
              value={draft.url_es}
              onChange={(e) => setDraft({ ...draft, url_es: e.target.value })}
              className="min-h-11 rounded-2xl border border-input bg-background px-3"
            />
            <input
              aria-label="Nueva URL (euskera)"
              type="url"
              placeholder="URL (euskera)"
              value={draft.url_eu}
              onChange={(e) => setDraft({ ...draft, url_eu: e.target.value })}
              className="min-h-11 rounded-2xl border border-input bg-background px-3"
            />
            <select
              aria-label="Idioma del nuevo documento"
              value={draft.locale}
              onChange={(e) => setDraft({ ...draft, locale: e.target.value })}
              className="min-h-11 rounded-2xl border border-input bg-background px-2"
            >
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              aria-label="Orden del nuevo documento"
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
              className="min-h-11 rounded-2xl border border-input bg-background px-3"
            />
          </div>
          <button
            onClick={() => void add()}
            className="mt-3 min-h-11 rounded-2xl bg-foreground px-4 font-display text-sm uppercase text-background"
          >
            Añadir
          </button>
        </div>
      </div>
    </section>
  );
}
