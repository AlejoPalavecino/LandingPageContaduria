# ✅ Schema de Supabase Listo para Usar

## 📦 Archivos Creados

### 1. **`supabase/schema.sql`** ⭐

Archivo consolidado con todo el esquema de la base de datos:

- ✅ 4 Tablas: `posts`, `tags`, `post_tags`, `admins`
- ✅ Índices optimizados para queries rápidas
- ✅ Funciones auxiliares (`update_updated_at_column`, `is_admin`)
- ✅ Triggers automáticos
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de seguridad completas
- ✅ Comentarios y documentación

### 2. **`supabase/SETUP_GUIDE.md`** 📖

Guía paso a paso para configurar Supabase desde cero:

- Cómo crear el proyecto
- Cómo ejecutar el schema
- Cómo obtener credenciales
- Cómo crear usuario admin
- Troubleshooting común

### 3. **`supabase/seed.sql`** 🌱

Datos de ejemplo para pruebas (tags y posts de muestra)

### 4. **`.env.example`** actualizado

Template con todas las variables necesarias

---

## 🎯 Estructura de la Base de Datos

```
┌─────────────────┐
│   auth.users    │  (Tabla de Supabase Auth)
│                 │
│  - id (UUID)    │
└────────┬────────┘
         │
         │ author_id
         │
┌────────▼────────┐      ┌──────────────┐
│   admins        │      │    tags      │
│                 │      │              │
│  - user_id (PK) │      │  - id (PK)   │
└─────────────────┘      │  - name      │
                         │  - slug      │
                         └──────┬───────┘
                                │
                    ┌───────────▼──────────┐
                    │     post_tags        │
                    │                      │
                    │  - post_id (FK)      │
                    │  - tag_id (FK)       │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │      posts           │
                    │                      │
                    │  - id (PK)           │
                    │  - title             │
                    │  - slug (UNIQUE)     │
                    │  - content_md        │
                    │  - status            │
                    │  - published_at      │
                    │  - seo_*             │
                    │  - author_id (FK)    │
                    └──────────────────────┘
```

---

## 🔐 Políticas de Seguridad (RLS)

### Posts

| Acción     | Público           | Admin                        |
| ---------- | ----------------- | ---------------------------- |
| **SELECT** | ✅ Solo published | ✅ Todos (draft + published) |
| **INSERT** | ❌                | ✅                           |
| **UPDATE** | ❌                | ✅                           |
| **DELETE** | ❌                | ✅                           |

### Tags & Post_Tags

| Acción                   | Público  | Admin    |
| ------------------------ | -------- | -------- |
| **SELECT**               | ✅ Todos | ✅ Todos |
| **INSERT/UPDATE/DELETE** | ❌       | ✅       |

### Admins

| Acción     | Público | Admin          |
| ---------- | ------- | -------------- |
| **SELECT** | ❌      | ✅ Solo admins |

---

## 📋 Checklist de Implementación

### Paso 1: Configuración Inicial

- [ ] Crear cuenta en Supabase
- [ ] Crear nuevo proyecto
- [ ] Ejecutar `schema.sql` en SQL Editor
- [ ] Verificar que todas las tablas se crearon correctamente

### Paso 2: Credenciales

- [ ] Copiar **Project URL**
- [ ] Copiar **anon key**
- [ ] Crear archivo `.env.local`
- [ ] Pegar credenciales en `.env.local`
- [ ] Verificar que `.env.local` está en `.gitignore`

### Paso 3: Usuario Admin

- [ ] Crear usuario en Authentication → Users
- [ ] Copiar UUID del usuario
- [ ] Insertar UUID en tabla `admins`
- [ ] Verificar con query SQL

### Paso 4: Datos de Prueba (Opcional)

- [ ] Ejecutar `seed.sql` para crear posts de ejemplo
- [ ] Verificar en Table Editor que los datos se insertaron

### Paso 5: Verificación

- [ ] Reiniciar servidor local (`npm run dev`)
- [ ] Abrir `/blog` → verificar que carga posts
- [ ] Abrir `/admin` → hacer login con usuario admin
- [ ] Crear un post de prueba desde el admin
- [ ] Verificar que el post aparece en `/blog`

---

## 🔧 Próximos Pasos (Código)

Una vez que Supabase esté configurado, necesitamos:

1. **Actualizar cliente de Supabase** en `src/infrastructure/supabase/client.ts`

   - Agregar validación de env vars
   - Configurar opciones del cliente

2. **Migrar autenticación Admin**

   - Reemplazar password hardcodeada con Supabase Auth
   - Implementar `signInWithPassword`
   - Implementar `signOut`
   - Agregar manejo de sesiones

3. **Conectar Repository real**

   - El `SupabasePostRepository` ya está implementado
   - Solo falta usarlo en lugar de mockData

4. **Actualizar hooks de presentación**

   - `usePosts` → cargar desde Supabase
   - `useAdminPosts` → CRUD real
   - Manejo de estados loading/error

5. **Testing**
   - Probar CRUD completo desde admin
   - Verificar RLS (usuario no admin no puede editar)
   - Verificar que posts draft no sean visibles públicamente

---

## 📚 Documentación de Referencia

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

## ⚠️ Notas Importantes

### Seguridad

1. **NUNCA** commitear `.env.local` al repositorio
2. **NUNCA** usar la `service_role` key en frontend
3. Siempre usar `anon key` con RLS habilitado
4. Las políticas RLS son tu primera línea de defensa

### Performance

1. Los índices ya están optimizados en el schema
2. Considera habilitar **Connection Pooler** en producción (Settings → Database)
3. Para blog con muchos posts, implementa paginación (ya contemplado en el código)

### Backups

- Supabase hace backups automáticos en plan Free (cada día)
- Para producción, considera plan Pro con Point-in-Time Recovery

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa `supabase/SETUP_GUIDE.md` (troubleshooting detallado)
2. Verifica logs en Supabase Dashboard → Logs
3. Usa el SQL Editor para debugging de queries
4. Consulta Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)

---

**Status**: ✅ Schema listo para usar
**Siguiente paso**: Ejecutar schema en Supabase y configurar credenciales
