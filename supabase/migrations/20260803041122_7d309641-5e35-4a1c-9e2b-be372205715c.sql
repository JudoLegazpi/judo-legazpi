CREATE TABLE public.tournament_statuses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_es text NOT NULL DEFAULT '',
  name_eu text NOT NULL DEFAULT '',
  bg_color text NOT NULL DEFAULT '#A6ED19',
  text_color text NOT NULL DEFAULT '#14305C',
  icon text NOT NULL DEFAULT 'Info',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tournament_statuses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_statuses TO authenticated;
GRANT ALL ON public.tournament_statuses TO service_role;

ALTER TABLE public.tournament_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active tournament statuses are public"
  ON public.tournament_statuses FOR SELECT
  USING (active = true);

CREATE POLICY "Admins manage tournament statuses"
  ON public.tournament_statuses FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_tournament_statuses_updated_at
  BEFORE UPDATE ON public.tournament_statuses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.tournament_statuses (name_es, name_eu, bg_color, text_color, icon, sort_order, active) VALUES
  ('Inscripciones abiertas', 'Izen-emateak irekita', '#A6ED19', '#14305C', 'CheckCircle2', 1, true),
  ('Inscripciones cerradas', 'Izen-emateak itxita', '#14305C', '#FFFFFF', 'Lock', 2, true),
  ('Terminado', 'Amaituta', '#E6EAF1', '#14305C', 'Flag', 3, true),
  ('Cancelado', 'Bertan behera', '#C62828', '#FFFFFF', 'XCircle', 4, true);

ALTER TABLE public.tournaments
  ADD COLUMN status_id uuid REFERENCES public.tournament_statuses(id) ON DELETE RESTRICT,
  ADD COLUMN location_eu text,
  ADD COLUMN categories_es text,
  ADD COLUMN categories_eu text;

INSERT INTO public.site_settings (key, label, value)
VALUES ('calendar_style', 'Tamaños del texto de edades y categorías', '{"ageSizeDesktop":"0.875rem","ageSizeTablet":"0.8125rem","ageSizeMobile":"0.75rem"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
