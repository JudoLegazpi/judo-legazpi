INSERT INTO public.site_images (key, label) VALUES ('calendar', 'Calendario de temporada (imagen)') ON CONFLICT (key) DO NOTHING;
INSERT INTO public.site_texts (key, label, value_es, value_eu) VALUES
 ('calendar_updated', 'Calendario: fecha de actualización', '', ''),
 ('calendar_pdf_url', 'Calendario: enlace al PDF', '', '')
ON CONFLICT (key) DO NOTHING;