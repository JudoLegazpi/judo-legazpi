CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Horarios
CREATE TABLE public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_es text NOT NULL,
  group_eu text,
  age_range text,
  day_of_week smallint NOT NULL DEFAULT 1,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schedules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
GRANT ALL ON public.schedules TO service_role;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schedules are public" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Admins manage schedules" ON public.schedules FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER schedules_updated BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Eventos
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es text NOT NULL,
  title_eu text,
  description_es text,
  description_eu text,
  event_date date NOT NULL,
  end_date date,
  location text,
  category text NOT NULL DEFAULT 'competicion',
  link_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published events are public" ON public.events FOR SELECT USING (published = true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Cuerpo tecnico
CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_es text,
  role_eu text,
  belt text,
  qualifications text,
  bio_es text,
  bio_eu text,
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.staff TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff is public" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER staff_updated BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Torneos
CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_es text NOT NULL,
  title_eu text,
  edition text,
  event_date date,
  location text,
  description_es text,
  description_eu text,
  poster_url text,
  results_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tournaments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournaments TO authenticated;
GRANT ALL ON public.tournaments TO service_role;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published tournaments are public" ON public.tournaments FOR SELECT USING (published = true);
CREATE POLICY "Admins manage tournaments" ON public.tournaments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER tournaments_updated BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Documentos
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es text NOT NULL,
  title_eu text,
  category text NOT NULL DEFAULT 'club',
  file_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published documents are public" ON public.documents FOR SELECT USING (published = true);
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Galeria
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption_es text,
  caption_eu text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is public" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER gallery_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Textos editables
CREATE TABLE public.site_texts (
  key text PRIMARY KEY,
  label text NOT NULL,
  value_es text NOT NULL DEFAULT '',
  value_eu text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site texts are public" ON public.site_texts FOR SELECT USING (true);
CREATE POLICY "Admins manage site texts" ON public.site_texts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_texts_updated BEFORE UPDATE ON public.site_texts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contenido inicial
INSERT INTO public.schedules (group_es, group_eu, age_range, day_of_week, start_time, end_time, location, sort_order) VALUES
('Judo Txiki','Judo Txiki','4-6 años',1,'17:30','18:15','Polideportivo de Legazpi',1),
('Judo Txiki','Judo Txiki','4-6 años',3,'17:30','18:15','Polideportivo de Legazpi',2),
('Infantil','Haurrak','7-11 años',1,'18:15','19:15','Polideportivo de Legazpi',3),
('Infantil','Haurrak','7-11 años',3,'18:15','19:15','Polideportivo de Legazpi',4),
('Cadete y Junior','Kadete eta Junior','12-17 años',2,'19:00','20:30','Polideportivo de Legazpi',5),
('Cadete y Junior','Kadete eta Junior','12-17 años',4,'19:00','20:30','Polideportivo de Legazpi',6),
('Adultos','Helduak','18+',2,'20:30','22:00','Polideportivo de Legazpi',7),
('Adultos','Helduak','18+',4,'20:30','22:00','Polideportivo de Legazpi',8);

INSERT INTO public.staff (name, role_es, role_eu, belt, qualifications, bio_es, bio_eu, sort_order) VALUES
('Nombre Apellido','Director técnico','Zuzendari teknikoa','5º Dan','Entrenador Nacional Nivel 3','Más de 25 años vinculado al judo y al club, formando a varias generaciones de judokas en Legazpi.','25 urte baino gehiago judoari eta klubari lotuta, Legazpiko hainbat judoka belaunaldi trebatzen.',1),
('Nombre Apellido','Entrenadora','Entrenatzailea','3er Dan','Monitora Nivel 2','Responsable de las categorías infantiles y del trabajo de base del club.','Haur kategorien eta klubaren oinarrizko lanaren arduraduna.',2),
('Nombre Apellido','Entrenador','Entrenatzailea','2º Dan','Monitor Nivel 1','Acompaña a los equipos de competición en campeonatos territoriales y de Euskadi.','Lehiaketa taldeak lurraldeko eta Euskadiko txapelketetan laguntzen ditu.',3);

INSERT INTO public.events (title_es, title_eu, description_es, description_eu, event_date, location, category) VALUES
('Torneo de Navidad','Gabonetako Txapelketa','Torneo interno abierto a todas las categorías del club.','Klubeko kategoria guztientzako barne txapelketa.', (CURRENT_DATE + 21), 'Polideportivo de Legazpi','torneo'),
('Campeonato de Gipuzkoa infantil','Gipuzkoako Haur Txapelketa','Competición territorial. Convocatoria pendiente de publicar.','Lurraldeko lehiaketa. Deialdia argitaratzeko.', (CURRENT_DATE + 40), 'Donostia','competicion'),
('Examen de cinturones','Gerriko azterketa','Examen de paso de grado para todas las categorías.','Maila igotzeko azterketa kategoria guztietarako.', (CURRENT_DATE + 60), 'Polideportivo de Legazpi','examen');

INSERT INTO public.tournaments (slug, title_es, title_eu, edition, event_date, location, description_es, description_eu) VALUES
('torneo-villa-de-legazpi','Torneo Villa de Legazpi','Legazpiko Herriko Txapelketa','XXV edición', (CURRENT_DATE + 90), 'Polideportivo de Legazpi','El torneo de referencia del club, con participación de clubes de toda Gipuzkoa en categorías desde prebenjamín hasta cadete.','Klubaren erreferentziazko txapelketa, Gipuzkoa osoko klubekin.'),
('open-judo-txiki','Open Judo Txiki','Judo Txiki Open','III edición', (CURRENT_DATE - 120), 'Polideportivo de Legazpi','Jornada festiva y no competitiva para las categorías más pequeñas.','Kategoria txikienentzako jaialdia, lehiakortasunik gabe.');

INSERT INTO public.documents (title_es, title_eu, category, file_url, sort_order) VALUES
('Hoja de inscripción','Izena emateko orria','inscripcion','#',1),
('Autorización de imagen','Irudi baimena','inscripcion','#',2),
('Plan de protección LOPIVI','LOPIVI babes plana','lopivi','#',3),
('Código de conducta','Jokabide kodea','lopivi','#',4);

INSERT INTO public.site_texts (key, label, value_es, value_eu) VALUES
('home_intro','Presentación de la portada','Judo y defensa personal en Legazpi desde 1978. Formación deportiva, valores y competición para todas las edades.','Judoa eta defentsa pertsonala Legazpin 1978tik. Kirol formakuntza, balioak eta lehiaketa adin guztietarako.'),
('club_history','Historia del club','El Club Judo Legazpi nació en 1978 con el objetivo de acercar el judo al municipio. Desde entonces han pasado por nuestro tatami cientos de judokas, algunos de ellos con presencia en campeonatos de Euskadi y de España.','Legazpiko Judo Kluba 1978an sortu zen, judoa herrira hurbiltzeko helburuarekin. Ordutik ehunka judoka igaro dira gure tatamitik.'),
('club_values','Valores del club','Respeto, esfuerzo y compañerismo. Trabajamos la técnica y la competición, pero sobre todo formamos personas.','Errespetua, ahalegina eta lagunartekotasuna. Teknika eta lehiaketa lantzen ditugu, baina batez ere pertsonak hezten ditugu.'),
('fees','Tarifas','Cuota mensual 30 € · Cuota anual de licencia federativa según categoría · Descuento del 20% para el segundo hermano.','Hileko kuota 30 € · Urteko federazio lizentzia kategoriaren arabera · %20ko deskontua bigarren anai-arrebarentzat.'),
('lopivi_intro','Texto LOPIVI','El Club Judo Legazpi cumple con la Ley Orgánica 8/2021 de protección integral a la infancia y la adolescencia frente a la violencia. Contamos con un delegado de protección y un protocolo de actuación conocido por todo el cuerpo técnico.','Legazpiko Judo Klubak 8/2021 Lege Organikoa betetzen du. Babes ordezkari bat eta jarduera protokolo bat ditugu.'),
('lopivi_contact','Contacto delegado LOPIVI','Delegado de protección: lopivi@judolegazpi.com','Babes ordezkaria: lopivi@judolegazpi.com'),
('contact_info','Datos de contacto','Polideportivo Municipal de Legazpi · 20230 Legazpi (Gipuzkoa) · info@judolegazpi.com','Legazpiko Kiroldegia · 20230 Legazpi (Gipuzkoa) · info@judolegazpi.com'),
('social_instagram','Instagram','https://instagram.com/judolegazpi','https://instagram.com/judolegazpi'),
('social_telegram','Telegram','https://t.me/judolegazpi','https://t.me/judolegazpi');