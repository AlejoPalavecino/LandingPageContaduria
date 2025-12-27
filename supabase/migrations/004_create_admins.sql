-- Migration: 004_create_admins
-- Descripción: Tabla de usuarios admin autorizados
-- Fecha: 2025-12-27

-- Crear tabla admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_admins_user_id ON public.admins(user_id);

-- Comentarios
COMMENT ON TABLE public.admins IS 'Usuarios autorizados como administradores del sistema';

-- Función helper para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
