-- =====================================================
-- SUPABASE STORAGE: Configuración para Blog Images
-- =====================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-01-05
-- =====================================================

-- 1. Crear bucket público para imágenes del blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,  -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir lectura pública de imágenes
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 3. Permitir upload solo a admins autenticados
DROP POLICY IF EXISTS "Authenticated admins can upload" ON storage.objects;
CREATE POLICY "Authenticated admins can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.uid() IN (SELECT id FROM public.admins)
);

-- 4. Permitir delete solo a admins autenticados
DROP POLICY IF EXISTS "Authenticated admins can delete" ON storage.objects;
CREATE POLICY "Authenticated admins can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.uid() IN (SELECT id FROM public.admins)
);

-- 5. Verificar configuración
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'blog-images';
