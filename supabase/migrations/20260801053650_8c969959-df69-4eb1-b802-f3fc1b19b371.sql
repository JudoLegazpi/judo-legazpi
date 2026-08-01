CREATE TABLE public.lopivi_buttons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es text NOT NULL DEFAULT '',
  title_eu text NOT NULL DEFAULT '',
  description_es text,
  description_eu text,
  url_es text,
  url_eu text,
  icon text NOT NULL DEFAULT 'FileText',
  icon_color text NOT NULL DEFAULT '#A6ED19',
  bg_color text NOT NULL DEFAULT '#FFFFFF',
  text_color text NOT NULL DEFAULT '#14305C',
  text_size text NOT NULL DEFAULT '1rem',
  new_tab boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.lopivi_buttons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lopivi_buttons TO authenticated;
GRANT ALL ON public.lopivi_buttons TO service_role;

ALTER TABLE public.lopivi_buttons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active lopivi buttons are public" ON public.lopivi_buttons
  FOR SELECT USING (active = true);
CREATE POLICY "Admins manage lopivi buttons" ON public.lopivi_buttons
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER lopivi_buttons_updated_at BEFORE UPDATE ON public.lopivi_buttons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  label text NOT NULL DEFAULT '',
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are public" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.lopivi_buttons (title_es, title_eu, url_es, url_eu, icon, sort_order)
SELECT
  COALESCE((SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item1_title'), 'Proyecto Deportivo'),
  COALESCE((SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item1_title'), 'Kirol Proiektua'),
  (SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item1_url'),
  (SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item1_url'),
  'FileText', 1
UNION ALL SELECT
  COALESCE((SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item2_title'), 'Protocolo LOPIVI 26/27'),
  COALESCE((SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item2_title'), 'LOPIVI Protokoloa 26/27'),
  (SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item2_url'),
  (SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item2_url'),
  'ShieldCheck', 2
UNION ALL SELECT
  COALESCE((SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item3_title'), 'Acta de nombramiento del responsable'),
  COALESCE((SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item3_title'), 'Arduradunaren Izendapen Akta'),
  (SELECT value_es FROM public.site_texts WHERE key = 'lopivi_item3_url'),
  (SELECT value_eu FROM public.site_texts WHERE key = 'lopivi_item3_url'),
  'UserCheck', 3;

INSERT INTO public.site_settings (key, label, value) VALUES
  ('schedule_style', 'Estilos de la sección de horarios', '{
    "titleSize": "2.25rem",
    "titleColor": "#14305C",
    "daySize": "0.75rem",
    "dayColor": "#FFFFFF",
    "hourSize": "0.75rem",
    "hourColor": "#14305C",
    "groupSize": "0.875rem",
    "groupColor": "#14305C",
    "sectionBg": "#F5F7FA",
    "cardBg": "#FFFFFF",
    "borderColor": "#DDE3EC",
    "borderWidth": "1px",
    "borderRadius": "0.75rem",
    "gap": "0.75rem"
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
