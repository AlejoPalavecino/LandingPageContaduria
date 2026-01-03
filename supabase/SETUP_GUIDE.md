# 🚀 Guía de Configuración de Supabase

Esta guía te ayudará a conectar el proyecto CDR con Supabase paso a paso.

---

## 📋 Pre-requisitos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Node.js 18+ instalado
- Proyecto CDR clonado localmente

---

## 🎯 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta (o inicia sesión)
2. Click en **"New Project"**
3. Configura tu proyecto:
   - **Name**: `cdr-cfo-services` (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la más cercana (ejemplo: `South America (São Paulo)`)
   - **Pricing Plan**: Free (suficiente para MVP)
4. Click en **"Create new project"** (tarda 1-2 minutos)

---

## 🗄️ Paso 2: Ejecutar el Schema SQL

Una vez que tu proyecto esté listo:

### Opción A: Desde el Dashboard (Recomendado para primera vez)

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono `</>` en el menú lateral)
2. Click en **"+ New query"**
3. Copia TODO el contenido del archivo `supabase/schema.sql`
4. Pega en el editor
5. Click en **"Run"** (botón verde inferior derecho)
6. Verifica que no haya errores (debe mostrar "Success. No rows returned")

### Opción B: Usando Supabase CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar en tu proyecto
supabase init

# Vincular con tu proyecto remoto
supabase link --project-ref tu-project-ref

# Aplicar migraciones
supabase db push
```

---

## 🔑 Paso 3: Obtener las Credenciales

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) → **API**
2. Copia los siguientes valores:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (una clave JWT larga)

3. **NO copies** la `service_role` key (solo úsala si es absolutamente necesario)

---

## 📝 Paso 4: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env.local`:

```bash
# En Windows PowerShell
New-Item -Path .env.local -ItemType File

# En Linux/Mac
touch .env.local
```

2. Edita `.env.local` y agrega:

```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Calendly (opcional por ahora)
VITE_CALENDLY_URL=https://calendly.com/cdr/reunion-30

# Google Analytics (opcional)
VITE_GA_TRACKING_ID=

# Gemini API (opcional)
GEMINI_API_KEY=
```

3. **IMPORTANTE**: Verifica que `.env.local` esté en tu `.gitignore` (no commitear secrets)

---

## 👤 Paso 5: Crear Usuario Admin

Necesitas crear tu primer usuario admin para acceder al panel de administración.

### 5.1 Crear Usuario en Supabase Auth

1. En Supabase Dashboard, ve a **Authentication** → **Users**
2. Click en **"Add user"** → **"Create new user"**
3. Configura:
   - **Email**: tu correo (ejemplo: `admin@cdr.com.ar`)
   - **Password**: una contraseña segura (guárdala)
   - **Auto Confirm User**: ✅ (marca esta opción)
4. Click en **"Create user"**
5. **Copia el UUID** del usuario (ejemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### 5.2 Agregar Usuario a Tabla `admins`

1. Ve a **SQL Editor** → **"+ New query"**
2. Ejecuta este SQL (reemplaza `TU_USER_UUID` con el UUID que copiaste):

```sql
-- Agregar tu usuario como admin
INSERT INTO public.admins (user_id)
VALUES ('TU_USER_UUID');

-- Verificar que se agregó correctamente
SELECT * FROM public.admins;
```

3. Click en **"Run"**
4. Deberías ver tu usuario en la tabla `admins`

---

## 🧪 Paso 6: Crear Posts de Prueba (Opcional)

Puedes crear algunos posts de ejemplo para probar:

1. Ve a **SQL Editor** → **"+ New query"**
2. Ejecuta este SQL:

```sql
-- Crear algunos tags
INSERT INTO public.tags (name, slug) VALUES
('Finanzas', 'finanzas'),
('Impuestos', 'impuestos'),
('Estrategia', 'estrategia'),
('CFO', 'cfo')
ON CONFLICT (slug) DO NOTHING;

-- Crear un post de ejemplo
INSERT INTO public.posts (
    title,
    slug,
    excerpt,
    content_md,
    status,
    published_at,
    seo_title,
    seo_description,
    reading_time_min
) VALUES (
    'Cómo optimizar tu carga fiscal en 2026',
    'como-optimizar-carga-fiscal-2026',
    'Estrategias legales para reducir impuestos en tu PYME sin riesgos.',
    '# Cómo optimizar tu carga fiscal en 2026

La planificación fiscal es clave para mantener rentable tu empresa. En este artículo te cuento...

## 1. Conocé tus deducciones

Lorem ipsum dolor sit amet...

## 2. Planificá tus inversiones

Lorem ipsum dolor sit amet...',
    'published',
    NOW(),
    'Cómo optimizar tu carga fiscal en 2026 | CDR',
    'Estrategias legales para reducir impuestos en tu PYME sin riesgos. Guía práctica 2026.',
    5
);

-- Asociar tags al post
INSERT INTO public.post_tags (post_id, tag_id)
SELECT
    (SELECT id FROM public.posts WHERE slug = 'como-optimizar-carga-fiscal-2026'),
    id
FROM public.tags
WHERE slug IN ('finanzas', 'impuestos');
```

---

## ✅ Paso 7: Verificar la Conexión

1. Verifica que tu archivo `.env.local` tiene las credenciales correctas
2. Reinicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre el navegador en `http://localhost:3000`
4. Navega a `/blog` → deberías ver el post de ejemplo
5. Navega a `/admin` → intenta hacer login con tu usuario admin

---

## 🔒 Verificar Seguridad (RLS)

Puedes verificar que Row Level Security está funcionando:

1. Ve a **SQL Editor**
2. Ejecuta:

```sql
-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('posts', 'tags', 'post_tags', 'admins');

-- Ver políticas activas
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

Deberías ver `rowsecurity = true` y todas las políticas creadas.

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

- Verifica que copiaste la `anon key` correcta (no la `service_role`)
- Verifica que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### Error: "Could not authenticate"

- Verifica que tu usuario esté en la tabla `admins`
- Verifica que el usuario tenga `confirmed_at` no null en `auth.users`

### No se ven posts en el blog

- Verifica que haya posts con `status = 'published'`
- Verifica que `published_at` no sea null
- Revisa la consola del navegador (F12) para errores

### Error de CORS

- Verifica que tu URL de Supabase sea correcta (sin `/` al final)
- Ve a Supabase → Settings → API → CORS y agrega `http://localhost:3000`

---

## 📚 Próximos Pasos

Una vez que tengas Supabase conectado:

1. ✅ Migrar autenticación hardcodeada a Supabase Auth
2. ✅ Implementar logout
3. ✅ Ajustar el panel admin para usar datos reales
4. ✅ Configurar Calendly real
5. ✅ Desplegar a Vercel/Netlify

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs del navegador (F12 → Console)
2. Revisa los logs de Supabase (Dashboard → Logs)
3. Consulta la documentación oficial: [https://supabase.com/docs](https://supabase.com/docs)

---

**¡Listo!** Tu proyecto ahora está conectado con Supabase 🎉
