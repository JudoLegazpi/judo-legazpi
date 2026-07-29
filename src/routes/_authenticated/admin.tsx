import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  type: "text" | "textarea" | "number" | "date" | "time" | "select" | "boolean" | "file";
  options?: { value: string; label: string }[];
  accept?: string;
  required?: boolean;
};

type TableConfig = {
  key: string;
  table: "schedules" | "events" | "staff" | "tournaments" | "documents" | "gallery_images";
  label: string;
  orderBy: string;
  titleField: string;
  fields: Field[];
};

const DAYS = [1, 2, 3, 4, 5, 6, 7].map((d) => ({
  value: String(d),
  label: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][d - 1],
}));

const CONFIGS: TableConfig[] = [
  {
    key: "horarios",
    table: "schedules",
    label: "Horarios",
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
  },
  {
    key: "calendario",
    table: "events",
    label: "Calendario",
    orderBy: "event_date",
    titleField: "title_es",
    fields: [
      { name: "title_es", label: "Título (castellano)", type: "text", required: true },
      { name: "title_eu", label: "Título (euskera)", type: "text" },
      { name: "description_es", label: "Descripción (castellano)", type: "textarea" },
      { name: "description_eu", label: "Descripción (euskera)", type: "textarea" },
      { name: "event_date", label: "Fecha", type: "date", required: true },
      { name: "location", label: "Lugar", type: "text" },
      {
        name: "category",
        label: "Categoría",
        type: "select",
        options: [
          { value: "competicion", label: "Competición" },
          { value: "torneo", label: "Torneo" },
          { value: "examen", label: "Examen" },
          { value: "curso", label: "Curso" },
        ],
      },
      { name: "published", label: "Publicado", type: "boolean" },
    ],
  },
  {
    key: "cuerpo-tecnico",
    table: "staff",
    label: "Cuerpo técnico",
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
      { name: "photo_url", label: "Foto", type: "file", accept: "image/*" },
      { name: "sort_order", label: "Orden", type: "number" },
    ],
  },
  {
    key: "torneos",
    table: "tournaments",
    label: "Torneos",
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
      { name: "poster_url", label: "Cartel", type: "file", accept: "image/*" },
      { name: "results_url", label: "Resultados (PDF)", type: "file", accept: "application/pdf" },
      { name: "published", label: "Publicado", type: "boolean" },
    ],
  },
  {
    key: "documentos",
    table: "documents",
    label: "Documentos",
    orderBy: "sort_order",
    titleField: "title_es",
    fields: [
      { name: "title_es", label: "Título (castellano)", type: "text", required: true },
      { name: "title_eu", label: "Título (euskera)", type: "text" },
      {
        name: "category",
        label: "Categoría",
        type: "select",
        options: [
          { value: "club", label: "Club" },
          { value: "inscripcion", label: "Inscripción" },
          { value: "lopivi", label: "LOPIVI" },
        ],
      },
      { name: "file_url", label: "Archivo PDF", type: "file", accept: "application/pdf", required: true },
      { name: "sort_order", label: "Orden", type: "number" },
      { name: "published", label: "Publicado", type: "boolean" },
    ],
  },
  {
    key: "galeria",
    table: "gallery_images",
    label: "Galería",
    orderBy: "sort_order",
    titleField: "caption_es",
    fields: [
      { name: "image_url", label: "Imagen", type: "file", accept: "image/*", required: true },
      { name: "caption_es", label: "Pie de foto (castellano)", type: "text" },
      { name: "caption_eu", label: "Pie de foto (euskera)", type: "text" },
      { name: "sort_order", label: "Orden", type: "number" },
    ],
  },
];

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

async function uploadFile(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data) throw signError ?? new Error("No se pudo generar el enlace");
  return data.signedUrl;
}

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<string>("horarios");

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
        <p className="mt-2 text-muted-foreground">
          Esta cuenta no tiene permisos de administración del club.
        </p>
        <button onClick={signOut} className="mt-6 min-h-11 rounded-sm border border-border px-4">
          Cerrar sesión
        </button>
      </div>
    );
  }

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
          {[...CONFIGS.map((c) => ({ key: c.key, label: c.label })), { key: "imagenes", label: "Imágenes" }, { key: "textos", label: "Textos" }].map(
            (item) => (
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
            ),
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "textos" ? (
          <TextsEditor />
        ) : tab === "imagenes" ? (
          <ImagesEditor />
        ) : (
          <CrudSection config={CONFIGS.find((c) => c.key === tab)!} />
        )}
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
    const { data, error: loadError } = await supabase
      .from(config.table)
      .select("*")
      .order(config.orderBy);
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
        <h2 className="truncate text-2xl">{config.label}</h2>
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
          <li
            key={row.id}
            className="card-elevated grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"
          >
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {String(row[config.titleField] ?? "(sin título)")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {String(row[config.orderBy] ?? "")}
              </span>
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

  async function handleFile(field: Field, file: File) {
    setBusy(true);
    try {
      const url = await uploadFile(file);
      setValues((v) => ({ ...v, [field.name]: url }));
    } catch (uploadError) {
      onError(uploadError instanceof Error ? uploadError.message : "Error al subir el archivo");
    }
    setBusy(false);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = values[field.name];
      if (field.type === "number") payload[field.name] = value === "" ? 0 : Number(value);
      else if (field.type === "boolean") payload[field.name] = value === "true";
      else if (field.type === "select" && field.name === "day_of_week") payload[field.name] = Number(value);
      else payload[field.name] = value === "" ? null : value;
    }

    // Los campos son dinámicos por tabla, por eso el tipado genérico aquí es laxo.
    const table = supabase.from(config.table) as unknown as {
      update: (payload: Record<string, unknown>) => { eq: (col: string, val: string) => PromiseLike<{ error: { message: string } | null }> };
      insert: (payload: Record<string, unknown>) => PromiseLike<{ error: { message: string } | null }>;
    };
    const query = row ? table.update(payload).eq("id", row.id) : table.insert(payload);

    const { error } = await query;
    setBusy(false);
    if (error) onError(error.message);
    else await onSaved();
  }

  return (
    <form onSubmit={save} className="card-elevated mt-6 space-y-4 p-6">
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
            {field.type === "file" && (
              <div className="mt-1 space-y-2">
                <input
                  id={id}
                  type="file"
                  accept={field.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(field, file);
                  }}
                  className="block w-full text-sm"
                />
                {values[field.name] && (
                  <p className="truncate text-xs text-muted-foreground">{values[field.name]}</p>
                )}
              </div>
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

function ImagesEditor() {
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_images").select("key,label,image_url").order("key");
    setRows((data ?? []) as ImageRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function replace(row: ImageRow, file: File) {
    setStatus(`Subiendo ${file.name}…`);
    try {
      const url = await uploadFile(file);
      const { error } = await supabase.from("site_images").update({ image_url: url }).eq("key", row.key);
      setStatus(error ? error.message : `Actualizada: ${row.label}`);
      await load();
    } catch (uploadError) {
      setStatus(uploadError instanceof Error ? uploadError.message : "Error al subir la imagen");
    }
  }

  return (
    <section>
      <h2 className="text-2xl">Imágenes de la web</h2>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}
      <ul className="mt-6 space-y-4">
        {rows.map((row) => (
          <li key={row.key} className="card-elevated grid gap-4 p-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="aspect-[3/2] overflow-hidden rounded-sm bg-muted">
              {row.image_url && (
                <img src={row.image_url} alt={row.label} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <h3 className="text-base">{row.label}</h3>
              <label htmlFor={`img-${row.key}`} className="mt-2 block text-xs font-semibold">
                Sustituir imagen
              </label>
              <input
                id={`img-${row.key}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void replace(row, file);
                }}
                className="mt-1 block w-full text-sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

type TextRow = { key: string; label: string; value_es: string; value_eu: string };

function TextsEditor() {
  const [rows, setRows] = useState<TextRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_texts")
      .select("key,label,value_es,value_eu")
      .order("key")
      .then(({ data }) => setRows((data ?? []) as TextRow[]));
  }, []);

  async function save(row: TextRow) {
    const { error } = await supabase
      .from("site_texts")
      .update({ value_es: row.value_es, value_eu: row.value_eu })
      .eq("key", row.key);
    setStatus(error ? error.message : `Guardado: ${row.label}`);
  }

  return (
    <section>
      <h2 className="text-2xl">Textos de la web</h2>
      {status && <p className="mt-2 text-sm text-muted-foreground">{status}</p>}
      <ul className="mt-6 space-y-4">
        {rows.map((row, index) => (
          <li key={row.key} className="card-elevated p-5">
            <h3 className="text-base">{row.label}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`${row.key}-es`} className="block text-xs font-semibold">
                  Castellano
                </label>
                <textarea
                  id={`${row.key}-es`}
                  rows={4}
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
                  rows={4}
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
