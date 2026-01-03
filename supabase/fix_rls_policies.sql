-- =====================================================
-- FIX: Políticas RLS - Eliminar recursión infinita
-- =====================================================
-- Fecha: 2026-01-02
-- Problema: La política de "admins" causa recursión infinita
-- Solución: Usar auth.uid() directamente sin subquery
-- =====================================================

-- =====================================================
-- ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- =====================================================

DROP POLICY IF EXISTS "Admins can read all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can manage post_tags" ON public.post_tags;
DROP POLICY IF EXISTS "Only admins can read admins table" ON public.admins;

-- =====================================================
-- RECREAR POLÍTICAS SIN RECURSIÓN
-- =====================================================

-- POSTS: Admin puede leer todos los posts
CREATE POLICY "Admins can read all posts"
ON public.posts
FOR SELECT
USING (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- POSTS: Admin puede insertar posts
CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- POSTS: Admin puede actualizar posts
CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- POSTS: Admin puede eliminar posts
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- TAGS: Admin puede gestionar tags
CREATE POLICY "Admins can manage tags"
ON public.tags
FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- POST_TAGS: Admin puede gestionar post_tags
CREATE POLICY "Admins can manage post_tags"
ON public.post_tags
FOR ALL
USING (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- ADMINS: Cualquier usuario autenticado puede leer la tabla admins
-- (necesario para verificar permisos)
CREATE POLICY "Authenticated users can read admins table"
ON public.admins
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verifica que todas las políticas estén correctas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
