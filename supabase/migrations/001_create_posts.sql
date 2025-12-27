-- Migration: 001_create_posts
-- Descripción: Tabla principal de posts del blog
-- Fecha: 2025-12-27

-- Crear tabla posts
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
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Check constraint: si está publicado debe tener fecha
    CONSTRAINT published_must_have_date CHECK (
        (status = 'draft' AND published_at IS NULL) OR
        (status = 'published' AND published_at IS NOT NULL)
    )
);

-- Índices para optimizar consultas
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status_published_at ON public.posts(status, published_at DESC);
CREATE INDEX idx_posts_updated_at ON public.posts(updated_at DESC);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE public.posts IS 'Artículos del blog con soporte para drafts y publicados';
COMMENT ON COLUMN public.posts.content_md IS 'Contenido en formato Markdown';
COMMENT ON COLUMN public.posts.status IS 'Estado: draft (borrador) o published (publicado)';
