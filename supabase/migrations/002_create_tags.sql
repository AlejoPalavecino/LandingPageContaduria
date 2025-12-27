-- Migration: 002_create_tags
-- Descripción: Taxonomía de tags para posts
-- Fecha: 2025-12-27

-- Crear tabla tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tags_slug ON public.tags(slug);

-- Comentarios
COMMENT ON TABLE public.tags IS 'Tags/categorías para clasificar posts del blog';
COMMENT ON COLUMN public.tags.slug IS 'URL-friendly identifier para navegación';
