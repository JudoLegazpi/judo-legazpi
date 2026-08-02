CREATE TABLE public.tournament_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  title_es text NOT NULL DEFAULT '',
  title_eu text,
  url_es text,
  url_eu text,
  locale text NOT NULL DEFAULT 'both',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tournament_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_documents TO authenticated;
GRANT ALL ON public.tournament_documents TO service_role;

ALTER TABLE public.tournament_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible tournament documents are public"
  ON public.tournament_documents FOR SELECT
  USING (visible = true);

CREATE POLICY "Admins manage tournament documents"
  ON public.tournament_documents FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_tournament_documents_updated_at
  BEFORE UPDATE ON public.tournament_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX tournament_documents_tournament_idx ON public.tournament_documents(tournament_id, sort_order);