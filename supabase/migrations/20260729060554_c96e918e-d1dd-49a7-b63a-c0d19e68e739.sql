CREATE TABLE public.site_images (
  key text PRIMARY KEY,
  label text NOT NULL,
  image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site images are public" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admins manage site images" ON public.site_images FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_images_set_updated_at BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_images (key, label) VALUES
  ('hero', 'Imagen de portada'),
  ('club', 'Imagen de la sección Club'),
  ('lopivi', 'Imagen de la sección LOPIVI');