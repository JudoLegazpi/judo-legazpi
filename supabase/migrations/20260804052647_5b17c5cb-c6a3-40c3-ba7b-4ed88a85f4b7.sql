DROP POLICY IF EXISTS "Public read tournament posters" ON storage.objects;
CREATE POLICY "Public read tournament posters"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'tournaments');