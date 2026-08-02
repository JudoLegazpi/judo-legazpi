import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LOPIVI_ICON_NAMES, lopiviIcon } from "@/lib/lopivi-icons";
import { DEFAULT_SCHEDULE_STYLE, type ScheduleStyle } from "@/lib/site-content.functions";

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
  type: "text" | "textarea" | "number" | "date" | "time" | "select" | "boolean" | "url" | "color";
  options?: { value: string; label: string }[];
  accept?: string;
  required?: boolean;
};

type TableConfig = {
  key: string;
  table: "schedules" | "staff" | "tournaments" | "lopivi_buttons";
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
    { name: "photo_url", label: "Foto (URL externa)", type: "url" },
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
    { name: "location", label: "Lugar", type: "text" },
    { name: "description_es", label: "Descripción (castellano)", type: "textarea" },
    { name: "description_eu", label: "Descripción (euskera)", type: "textarea" },
    { name: "poster_url", label: "Cartel (URL externa)", type: "url" },
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

/** Cada pestaña corresponde a una sección pública de la web. */
type SectionTab = {
  key: string;
  label: string;
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
    label: "Inicio",
    title: "Portada",
    help: "Imagen principal, lema y botones de la portada.",
    imageKeys: ["hero"],
    textKeys: ["hero_tagline", "home_intro", "cta_join", "cta_know", "join_title", "join_text", "join_url"],
  },
  {
    key: "club",
    label: "El club",
    title: "Sección «El club»",
    imageKeys: ["club"],
    textKeys: ["club_section_title", "club_history", "club_values"],
  },
  {
    key: "cuerpo-tecnico",
    label: "Cuerpo técnico",
    title: "Cuerpo técnico",
    crud: STAFF_CONFIG,
    textKeys: ["staff_title", "staff_intro"],
  },
  {
    key: "lopivi",
    label: "LOPIVI",
    title: "LOPIVI y protección de la infancia",
    help: "Los botones se muestran como tarjetas pulsables; puedes elegir icono, colores, tamaño del texto y orden.",
    imageKeys: ["lopivi"],
    crud: LOPIVI_CONFIG,
    textKeys: ["lopivi_title", "lopivi_docs_intro", "lopivi_intro", "lopivi_mail_label", "lopivi_email", "lopivi_contact"],
  },
  {
    key: "horarios",
    label: "Horarios",
    title: "Horarios",
    crud: SCHEDULES_CONFIG,
    extra: "scheduleStyle",
    textKeys: ["schedule_title", "schedule_place", "calendar_season"],
  },
  {
    key: "calendario",
    label: "Calendario",
    title: "Calendario de temporada",
    extra: "calendar",
    textKeys: ["calendar_title", "calendar_download_intro", "calendar_download_label"],
  },
  {
    key: "torneos",
    label: "Torneos",
    title: "Torneos",
    help: "Cada torneo puede tener enlaces ilimitados a documentos externos.",
    crud: TOURNAMENTS_CONFIG,
    extra: "tournamentDocs",
    textKeys: ["tournaments_title", "tournaments_intro"],
  },
  {
    key: "general",
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
    return <p className="p-8 text-muted-foreground">Cargando…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8">
        <h1 className="text-2xl">Sin permisos</h1>
        <p className="mt-2 text-muted-foreground">Esta cuenta no tiene permisos de administración del club.</p>
        <button onClick={signOut} className="mt-6 min-h-11 rounded-sm border border-border px-4">
          Cerrar sesión
        </button>
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.key === tab) ?? SECTIONS[0];

  return (
    <div className="min-h-dvh bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl">Gestión del club</h1>
            <Link to="/" className="text-sm text-muted-foreground underline">
              Ver la web
            </Link>
          </div>
          <button onClick={signOut} className="min-h-11 rounded-sm border border-border px-4 text-sm">
            Cerrar sesión
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 pb-4" aria-label="Secciones">
          {SECTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              aria-current={tab === item.key}
              className={`min-h-10 rounded-sm px-3 font-display text-sm uppercase ${
                tab === item.key ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        <div>
          <h2 className="text-2xl">{section.title}</h2>
          {section.help && <p className="mt-1 text-sm text-muted-foreground">{section.help}</p>}
        </div>

        {section.crud && <CrudSection config={section.crud} />}
        {section.extra === "calendar" && <CalendarEditor />}
        {section.extra === "scheduleStyle" && <ScheduleStyleEditor />}
        {section.imageKeys && section.imageKeys.length > 0 && <ImagesEditor keys={section.imageKeys} />}
        {section.textKeys && section.textKeys.length > 0 && <TextsEditor keys={section.textKeys} />}
      </main>
    </div>
  );
}

type Row = Record<string, unknown> & { id: string };

function CrudSection({ config }: { config: TableConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase.from(config.table).select("*").order(config.orderBy);
    if (loadError) setError(loadError.message);
    setRows((data ?? []) as Row[]);
  }, [config.table, config.orderBy]);

  useEffect(() => {
    setEditing(null);
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!window.confirm("¿Seguro que quieres borrarlo?")) return;
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    await load();
  }

  return (
    <section>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h3 className="truncate text-xl">{config.label}</h3>
        <button
          onClick={() => setEditing("new")}
          className="min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
        >
          Añadir
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {editing && (
        <RecordForm
          config={config}
          row={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
          onError={setError}
        />
      )}

      <ul className="mt-6 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="card-elevated grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
            <span className="min-w-0">
              <span className="block truncate font-semibold">{String(row[config.titleField] ?? "(sin título)")}</span>
              <span className="block text-xs text-muted-foreground">{String(row[config.orderBy] ?? "")}</span>
            </span>
            <span className="flex gap-2">
              <button onClick={() => setEditing(row)} className="min-h-10 rounded-sm border border-border px-3 text-sm">
                Editar
              </button>
              <button
                onClick={() => remove(row.id)}
                className="min-h-10 rounded-sm border border-destructive px-3 text-sm text-destructive"
              >
                Borrar
              </button>
            </span>
          </li>
        ))}
      </ul>
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

  const preview = config.table === "lopivi_buttons";
  const PreviewIcon = lopiviIcon(values.icon);

  return (
    <form onSubmit={save} className="card-elevated mt-6 space-y-4 p-6">
      {preview && (
        <div className="rounded-sm border border-border bg-muted p-6">
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
                className="mt-1 w-full rounded-sm border border-input bg-background p-2"
              />
            )}
            {field.type === "select" && (
              <select
                id={id}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-2"
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
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-2"
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
                  className="h-11 w-16 rounded-sm border border-input bg-background"
                />
                <input
                  type="text"
                  aria-label={`${field.label} (código)`}
                  value={values[field.name]}
                  onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                  className="min-h-11 w-32 rounded-sm border border-input bg-background px-3"
                />
              </div>
            )}
            {field.type === "url" && (
              <input
                id={id}
                type="url"
                placeholder="https://…"
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
            )}

            {["text", "number", "date", "time"].includes(field.type) && (
              <input
                id={id}
                type={field.type}
                required={field.required}
                value={values[field.name]}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-sm bg-primary px-5 font-display text-sm uppercase text-primary-foreground disabled:opacity-60"
        >
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="min-h-11 rounded-sm border border-border px-5 text-sm">
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

  async function save(row: ImageRow, url: string) {
    const { error } = await supabase
      .from("site_images")
      .update({ image_url: url.trim() || null })
      .eq("key", row.key);
    setStatus(error ? error.message : `Actualizada: ${row.label}`);
    await load();
  }

  if (rows.length === 0) return null;

  return (
    <section>
      <h3 className="text-xl">Imágenes de esta sección</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Las imágenes se gestionan mediante enlaces externos (URL).
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}
      <ul className="mt-4 space-y-4">
        {rows.map((row) => (
          <li key={row.key} className="card-elevated grid gap-4 p-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="aspect-[3/2] overflow-hidden rounded-sm bg-muted">
              {row.image_url && <img src={row.image_url} alt={row.label} className="h-full w-full object-cover" />}
            </div>
            <div>
              <h4 className="text-base">{row.label}</h4>
              <label htmlFor={`img-${row.key}`} className="mt-2 block text-xs font-semibold">
                URL de la imagen
              </label>
              <input
                id={`img-${row.key}`}
                type="url"
                placeholder="https://…"
                value={row.image_url ?? ""}
                onChange={(e) =>
                  setRows((list) =>
                    list.map((item) => (item.key === row.key ? { ...item, image_url: e.target.value } : item)),
                  )
                }
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
              <button
                onClick={() => void save(row, row.image_url ?? "")}
                className="mt-3 min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
              >
                Guardar
              </button>
            </div>
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
    setStatus(error ? error.message : `Guardado: ${row.label}`);
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
                  className="mt-1 w-full rounded-sm border border-input bg-background p-2 text-sm"
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
                  className="mt-1 w-full rounded-sm border border-input bg-background p-2 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => save(row)}
              className="mt-3 min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
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
    setStatus(error ? error.message : "Estilos guardados");
  }

  return (
    <section>
      <h3 className="text-xl">Aspecto de la tabla de horarios</h3>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div
        className="mt-4 rounded-sm p-6"
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
                  className="h-11 w-16 rounded-sm border border-input bg-background"
                />
                <input
                  type="text"
                  aria-label={`${field.label} (código)`}
                  value={style[field.name]}
                  onChange={(e) => setStyle({ ...style, [field.name]: e.target.value })}
                  className="min-h-11 w-32 rounded-sm border border-input bg-background px-3"
                />
              </div>
            ) : (
              <input
                id={`style-${field.name}`}
                type="text"
                value={style[field.name]}
                onChange={(e) => setStyle({ ...style, [field.name]: e.target.value })}
                placeholder="1rem"
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => void save()}
        className="mt-4 min-h-11 rounded-sm bg-primary px-5 font-display text-sm uppercase text-primary-foreground"
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
    setStatus(error ? error.message : "Guardado");
  }

  async function saveImage(key: "calendar" | "calendar_eu", url: string) {
    const value = url.trim() || null;
    const { error } = await supabase.from("site_images").update({ image_url: value }).eq("key", key);
    setStatus(error ? error.message : "Imagen actualizada");
  }

  return (
    <section>
      <h3 className="text-xl">Imagen, enlaces y fechas del calendario</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        La sección pública muestra la imagen del idioma correspondiente, la fecha de actualización y el botón de
        descarga con la URL del calendario. Las imágenes se indican mediante enlaces externos.
      </p>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}

      <div className="card-elevated mt-4 space-y-8 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {(
            [
              ["calendar", "Imagen del calendario (castellano)", imageEs, setImageEs, "cal-img-es"] as const,
              ["calendar_eu", "Imagen del calendario (euskera)", imageEu, setImageEu, "cal-img-eu"] as const,
            ]
          ).map(([key, label, url, setUrl, id]) => (
            <div key={key}>
              <h4 className="text-base">{label}</h4>
              {url && <img src={url} alt={label} className="mt-3 w-full rounded-sm border border-border" />}
              <label htmlFor={id} className="mt-3 block text-xs font-semibold">
                URL de la imagen
              </label>
              <input
                id={id}
                type="url"
                placeholder="https://…"
                value={url ?? ""}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
              <button
                onClick={() => void saveImage(key, url ?? "")}
                className="mt-3 min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
              >
                Guardar imagen
              </button>
            </div>
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
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
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
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
            </div>
          </div>
          <button
            onClick={() => void saveText("calendar_pdf_url", pdfEs, pdfEu)}
            className="mt-3 block min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
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
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
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
                className="mt-1 min-h-11 w-full rounded-sm border border-input bg-background px-3"
              />
            </div>
          </div>
          <button
            onClick={() => void saveText("calendar_updated", updatedEs, updatedEu)}
            className="mt-3 block min-h-11 rounded-sm bg-foreground px-4 font-display text-sm uppercase text-background"
          >
            Guardar fechas
          </button>
        </div>
      </div>
    </section>
  );
}
