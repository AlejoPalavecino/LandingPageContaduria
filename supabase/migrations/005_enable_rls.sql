-- Migration: 005_enable_rls
-- Descripción: Habilitar Row Level Security y crear políticas
-- Fecha: 2025-12-27

-- =====================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABLA: posts
-- =====================================================

-- Política: Lectura pública (solo posts publicados)
CREATE POLICY "Public can read published posts"
ON public.posts
FOR SELECT
USING (status = 'published');

-- Política: Admin puede leer todos los posts
CREATE POLICY "Admins can read all posts"
ON public.posts
FOR SELECT
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Política: Admin puede insertar posts
CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Política: Admin puede actualizar posts
CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
)
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Política: Admin puede eliminar posts
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- POLÍTICAS PARA TABLA: tags
-- =====================================================

-- Política: Lectura pública de tags
CREATE POLICY "Public can read tags"
ON public.tags
FOR SELECT
USING (true);

-- Política: Admin puede gestionar tags
CREATE POLICY "Admins can manage tags"
ON public.tags
FOR ALL
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
)
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- POLÍTICAS PARA TABLA: post_tags
-- =====================================================

-- Política: Lectura pública de post_tags
CREATE POLICY "Public can read post_tags"
ON public.post_tags
FOR SELECT
USING (true);

-- Política: Admin puede gestionar post_tags
CREATE POLICY "Admins can manage post_tags"
ON public.post_tags
FOR ALL
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
)
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- POLÍTICAS PARA TABLA: admins
-- =====================================================

-- Política: Solo admins pueden ver la tabla de admins
CREATE POLICY "Only admins can read admins table"
ON public.admins
FOR SELECT
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON POLICY "Public can read published posts" ON public.posts IS 
    'Permite lectura pública solo de posts con status=published';

COMMENT ON POLICY "Admins can read all posts" ON public.posts IS 
    'Permite a admins ver todos los posts incluyendo drafts';
