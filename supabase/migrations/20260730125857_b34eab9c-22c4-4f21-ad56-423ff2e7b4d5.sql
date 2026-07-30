CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY "Admins manage documents" ON public.documents;
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage events" ON public.events;
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage gallery" ON public.gallery_images;
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage schedules" ON public.schedules;
CREATE POLICY "Admins manage schedules" ON public.schedules FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage site images" ON public.site_images;
CREATE POLICY "Admins manage site images" ON public.site_images FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage site texts" ON public.site_texts;
CREATE POLICY "Admins manage site texts" ON public.site_texts FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage staff" ON public.staff;
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage tournaments" ON public.tournaments;
CREATE POLICY "Admins manage tournaments" ON public.tournaments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins manage media objects" ON storage.objects;
CREATE POLICY "Admins manage media objects" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);