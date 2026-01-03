-- =====================================================
-- CDR - CFO Fractional Services
-- Database Schema (Supabase / PostgreSQL)
-- =====================================================
-- Versión: 1.0.0
-- Fecha: 2026-01-02
-- Descripción: Schema completo para landing page + blog + admin
-- =====================================================

-- =====================================================
-- TABLA: posts
-- Descripción: Artículos del blog con soporte para drafts y publicados
-- =====================================================

CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content_md TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    cover_image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    og_image_url TEXT,
    canonical_url TEXT,
    reading_time_min INTEGER,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraint: si está publicado debe tener fecha
    CONSTRAINT published_must_have_date CHECK (
        (status = 'draft') OR 
        (status = 'published' AND published_at IS NOT NULL)
    )
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON public.posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON public.posts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);

-- Comentarios para documentación
COMMENT ON TABLE public.posts IS 'Artículos del blog con soporte para drafts y publicados';
COMMENT ON COLUMN public.posts.content_md IS 'Contenido en formato Markdown';
COMMENT ON COLUMN public.posts.status IS 'Estado: draft (borrador) o published (publicado)';
COMMENT ON COLUMN public.posts.slug IS 'URL-friendly identifier único para SEO';
COMMENT ON COLUMN public.posts.reading_time_min IS 'Tiempo estimado de lectura en minutos';

-- =====================================================
-- TABLA: tags
-- Descripción: Taxonomía de tags para clasificar posts
-- =====================================================

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name);

-- Comentarios
COMMENT ON TABLE public.tags IS 'Tags/categorías para clasificar posts del blog';
COMMENT ON COLUMN public.tags.slug IS 'URL-friendly identifier para navegación y filtros';

-- =====================================================
-- TABLA: post_tags
-- Descripción: Relación many-to-many entre posts y tags
-- =====================================================

CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (post_id, tag_id)
);

-- Índices para consultas bidireccionales
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Comentarios
COMMENT ON TABLE public.post_tags IS 'Relación many-to-many entre posts y tags';

-- =====================================================
-- TABLA: admins
-- Descripción: Usuarios autorizados como administradores
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);

-- Comentarios
COMMENT ON TABLE public.admins IS 'Usuarios autorizados como administradores del sistema';

-- =====================================================
-- FUNCIONES
-- =====================================================

-- Función: update_updated_at_column
-- Descripción: Actualiza automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: is_admin
-- Descripción: Verifica si un usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin IS 'Verifica si un usuario UUID está en la tabla de admins';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Actualizar updated_at en posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS: posts
-- =====================================================

-- Política: Lectura pública (solo posts publicados)
DROP POLICY IF EXISTS "Public can read published posts" ON public.posts;
CREATE POLICY "Public can read published posts"
ON public.posts
FOR SELECT
USING (status = 'published');

-- Política: Admin puede leer todos los posts
DROP POLICY IF EXISTS "Admins can read all posts" ON public.posts;
CREATE POLICY "Admins can read all posts"
ON public.posts
FOR SELECT
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Política: Admin puede insertar posts
DROP POLICY IF EXISTS "Admins can insert posts" ON public.posts;
CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- Política: Admin puede actualizar posts
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
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
DROP POLICY IF EXISTS "Admins can delete posts" ON public.posts;
CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- POLÍTICAS RLS: tags
-- =====================================================

-- Política: Lectura pública de tags
DROP POLICY IF EXISTS "Public can read tags" ON public.tags;
CREATE POLICY "Public can read tags"
ON public.tags
FOR SELECT
USING (true);

-- Política: Admin puede gestionar tags
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
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
-- POLÍTICAS RLS: post_tags
-- =====================================================

-- Política: Lectura pública de post_tags
DROP POLICY IF EXISTS "Public can read post_tags" ON public.post_tags;
CREATE POLICY "Public can read post_tags"
ON public.post_tags
FOR SELECT
USING (true);

-- Política: Admin puede gestionar post_tags
DROP POLICY IF EXISTS "Admins can manage post_tags" ON public.post_tags;
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
-- POLÍTICAS RLS: admins
-- =====================================================

-- Política: Solo admins pueden ver la tabla de admins
DROP POLICY IF EXISTS "Only admins can read admins table" ON public.admins;
CREATE POLICY "Only admins can read admins table"
ON public.admins
FOR SELECT
USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
);

-- =====================================================
-- COMENTARIOS DE POLÍTICAS
-- =====================================================

COMMENT ON POLICY "Public can read published posts" ON public.posts IS 
    'Permite lectura pública solo de posts con status=published';

COMMENT ON POLICY "Admins can read all posts" ON public.posts IS 
    'Permite a admins ver todos los posts incluyendo drafts';

COMMENT ON POLICY "Admins can insert posts" ON public.posts IS 
    'Solo admins autorizados pueden crear nuevos posts';

COMMENT ON POLICY "Admins can update posts" ON public.posts IS 
    'Solo admins autorizados pueden editar posts';

COMMENT ON POLICY "Admins can delete posts" ON public.posts IS 
    'Solo admins autorizados pueden eliminar posts';

COMMENT ON POLICY "Public can read tags" ON public.tags IS 
    'Todos pueden ver los tags para navegación y filtros';

COMMENT ON POLICY "Admins can manage tags" ON public.tags IS 
    'Solo admins pueden crear, editar y eliminar tags';

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
