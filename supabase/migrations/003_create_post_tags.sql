-- Migration: 003_create_post_tags
-- Descripción: Tabla puente para relación many-to-many entre posts y tags
-- Fecha: 2025-12-27

-- Crear tabla post_tags
CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (post_id, tag_id)
);

-- Índices para consultas bidireccionales
CREATE INDEX idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Comentarios
COMMENT ON TABLE public.post_tags IS 'Relación many-to-many entre posts y tags';
