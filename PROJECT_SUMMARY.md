# CDR - CFO Fractional Services

## 📋 Qué es este proyecto

Landing page profesional para **CDR - Servicios de CFO Fractional** orientado a PYMEs argentinas. Incluye:

- **Landing page** con hero, servicios, metodología, FAQs
- **Blog** con artículos sobre finanzas y gestión
- **Mini-test** de salud financiera empresarial (calculadora interactiva)
- **Panel Admin** para gestión de blog (CRUD completo)
- **Integración Calendly** para agendar reuniones

**Objetivo principal:** Convertir visitas en reuniones de 30 minutos.

## 🚀 Stack Tecnológico

### Frontend

- **React 18.3.1** + **TypeScript** 5.8.2
- **Vite** 6.2.0 (build tool)
- **Tailwind CSS** (vía CDN en index.html)
- **Framer Motion** 11.15.0 (animaciones)
- **Lucide React** 0.460.0 (iconos)

### Backend/Database

- **Supabase** 2.39.7 (PostgreSQL + Auth + Row Level Security)
- **Clean Architecture** (4 capas: Domain, Application, Infrastructure, Presentation)

### Content Processing

- **marked** 11.1.1 (Markdown parser)
- **DOMPurify** 3.0.8 (XSS sanitization)

## 🛠️ Cómo correr el proyecto

### Instalación

```bash
npm install
```

### Desarrollo local

```bash
npm run dev
# o usar el script automático:
node start.js
```

Abre: **http://localhost:3000**

### Build para producción

```bash
npm run build
```

Los archivos compilados estarán en `/dist`.

## 🔐 Variables de Entorno

Crear archivo `.env.local` (usar `.env.example` como referencia):

```bash
# Supabase (Opcional - solo si conectas base de datos)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Gemini API (para Health Test - opcional)
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

**⚠️ IMPORTANTE:**

- No commitear el archivo `.env.local`
- Nunca hardcodear keys en el código fuente
- Usar variables de entorno en producción (Vercel, Netlify, etc.)

## 📂 Arquitectura del Proyecto

```
/
├── App.tsx                    # Router principal + todas las páginas
├── components/                # Componentes React reutilizables
│   ├── Admin.tsx             # AdminLogin + AdminPostList
│   ├── AdminPostEditor.tsx   # Editor completo con preview
│   ├── Button.tsx            # Componente Button reutilizable
│   ├── CalendlyModal.tsx     # Modal para Calendly
│   ├── HealthTest.tsx        # Mini-test de salud financiera
│   ├── Icons.tsx             # Exports de Lucide + SVG custom
│   ├── Layout.tsx            # Header, Footer, StickyMobileCTA
│   ├── Motion.tsx            # Wrappers de Framer Motion
│   └── UI.tsx                # Section, Card, Badge, Input, Select
├── services/
│   └── mockData.ts           # Posts de ejemplo (antes de Supabase)
├── src/                      # Clean Architecture
│   ├── domain/               # Entidades y Value Objects
│   │   ├── entities/Post.ts
│   │   ├── value-objects/Slug.ts, SeoMeta.ts
│   │   └── ports/           # Interfaces (contratos)
│   ├── application/          # Casos de uso + DTOs
│   │   ├── dto/PostDTO.ts, PostMapper.ts
│   │   └── use-cases/posts/ # CreatePost, UpdatePost, etc.
│   ├── infrastructure/       # Implementaciones concretas
│   │   └── supabase/        # Cliente, Repository, AuthService
│   └── presentation/         # Capa de UI
│       ├── hooks/           # usePosts, usePost, useAdminPosts
│       └── services/        # Facades para componentes
├── supabase/
│   ├── migrations/          # SQL para crear tablas (5 archivos)
│   └── seed.sql            # Datos de ejemplo
├── types.ts                 # Type definitions globales
├── index.html              # Entry point (Tailwind CDN)
├── index.tsx               # Render React
├── vite.config.ts          # Configuración Vite
├── package.json            # Dependencias y scripts
└── PROJECT_SUMMARY.md      # Este archivo
```

### Flujo de Datos (Clean Architecture)

```
UI Components → Hooks → Services (Facade) → Use Cases → Repository → Supabase
```

**Capas:**

1. **Domain**: Lógica de negocio pura (sin dependencias externas)
2. **Application**: Casos de uso y transformación de datos (DTOs)
3. **Infrastructure**: Implementación de Supabase (DB, Auth)
4. **Presentation**: React hooks y servicios para UI

## 🎯 Funcionalidades Clave

### 1. Landing Page (`/`)

- Hero con CTA principal (Calendly)
- Sección de servicios (Planificación Fiscal, Financiera, CFO Fractional)
- Metodología de 5 pasos
- FAQs interactivos
- Sticky mobile CTA

### 2. Quién Soy (`/about`)

- Perfil de Camilo D. Rodríguez
- Experiencia y credenciales
- Estadísticas (50+ PYMEs, 15+ años)
- Fondo animado con gradiente azulado y texturas SVG

### 3. Blog (`/blog`)

- Lista de posts publicados
- Filtros por tags y búsqueda
- Ordenamiento (newest, oldest, alpha)
- Vista de detalle con:
  - Markdown renderizado (sanitizado con DOMPurify)
  - Share buttons (LinkedIn, WhatsApp)
  - Posts relacionados
  - CTA en sidebar

### 4. Mini-Test de Salud Financiera (`/test-salud`)

- 10 preguntas sobre la empresa
- Scoring automático (0-100)
- Categorización: Crítico, Mejorable, Aceptable, Óptimo
- Análisis con Gemini AI (opcional)
- CTA para agendar reunión

### 5. Panel Admin (`/admin`)

- **Login**: Contraseña simple `admin123` (temporal, pre-Supabase)
- **Lista de posts**: Ver todos (publicados + drafts)
  - Filtros por estado y búsqueda
  - Acciones: Editar, Publicar/Despublicar, Eliminar
- **Editor**:
  - Markdown con preview en tiempo real
  - Campos: título, slug (auto-generado), extracto, contenido, imagen, categoría, tags
  - SEO: meta title y description
  - Guardar como draft o publicar directamente
  - Tiempo de lectura calculado automáticamente

## 🔒 Seguridad

### Implementado

✅ **Sanitización Markdown**: Todo contenido renderizado pasa por `DOMPurify.sanitize()`  
✅ **No hardcodeo de secrets**: Keys en `.env.local`, no en código fuente  
✅ **Env vars**: Supabase y Gemini API via `import.meta.env.VITE_*`  
✅ **Admin básico**: Contraseña temporal (`admin123`) - pendiente migrar a Supabase Auth

### Pendiente (cuando se conecte Supabase)

⏳ **Row Level Security (RLS)**: Políticas definidas en migrations, listas para activar  
⏳ **Supabase Auth**: Reemplazar contraseña hardcodeada por auth real  
⏳ **Validación de inputs**: Agregar Zod o similar para validar formularios

### OWASP Top 10 Consideraciones

- **A03 - Injection**: Markdown sanitizado ✅
- **A07 - Auth**: Temporal simple, migrar a Supabase Auth ⏳
- **A09 - Logging**: Console.errors en hooks para debugging (aceptable en dev)

## 🗄️ Supabase - Setup

### Migraciones (ejecutar en orden en SQL Editor)

1. `001_create_posts.sql` - Tabla posts
2. `002_create_tags.sql` - Tabla tags
3. `003_create_post_tags.sql` - Relación many-to-many
4. `004_create_admins.sql` - Tabla admins (user authorization)
5. `005_enable_rls.sql` - Row Level Security policies

### Crear usuario admin

1. En Supabase: **Authentication > Users** → Crear usuario
2. Copiar **User UID**
3. SQL Editor:

```sql
INSERT INTO public.admins (user_id) VALUES ('UID_AQUI');
```

### Row Level Security (RLS)

**Público (sin auth):**

- ✅ Leer posts publicados
- ❌ Crear/editar/eliminar

**Admin (autenticado + en tabla admins):**

- ✅ CRUD completo en posts, tags, post_tags

## ✅ Checklist de Verificación Manual

Después de cada cambio, verificar:

### Landing Page

- [ ] Hero con CTA Calendly funciona
- [ ] Servicios tienen hover effects
- [ ] Metodología (5 cards) renderiza correctamente
- [ ] FAQs abren/cierran
- [ ] Sticky mobile CTA aparece al scroll
- [ ] Botones "Servicios" y "Proceso" funcionan desde otras páginas

### Quién Soy

- [ ] Fondo azulado con animaciones carga correctamente
- [ ] Imagen de perfil renderiza
- [ ] Stats (+50 PYMEs, 15+ años) visibles
- [ ] CTA funciona

### Blog

- [ ] Lista de posts renderiza (mock data si no hay Supabase)
- [ ] Filtros por tags funcionan
- [ ] Búsqueda funciona
- [ ] Detalle de post renderiza Markdown correctamente
- [ ] Share buttons (LinkedIn, WhatsApp) funcionan
- [ ] Posts relacionados aparecen

### Mini-Test

- [ ] 10 preguntas visibles
- [ ] Inputs numéricos funcionan
- [ ] Botón "Calcular" genera score
- [ ] Categoría correcta (Crítico/Mejorable/Aceptable/Óptimo)
- [ ] CTA "Agendar reunión" funciona

### Admin Panel

- [ ] Login con `admin123` funciona
- [ ] Lista de posts carga (vacía si no hay datos)
- [ ] Filtros (Todos/Publicados/Borradores) funcionan
- [ ] Botón "Crear Post" abre editor
- [ ] Editor:
  - [ ] Preview en tiempo real funciona
  - [ ] Auto-generación de slug funciona
  - [ ] Tiempo de lectura se calcula
  - [ ] Guardar Draft funciona
  - [ ] Publicar funciona
- [ ] Editar post carga datos correctamente
- [ ] Publicar/Despublicar toggle funciona
- [ ] Eliminar post con confirmación funciona
- [ ] Logout limpia sesión

### Navegación

- [ ] Header: Logo, links, CTA visible
- [ ] Header: Transparente al inicio, solid al scroll
- [ ] Footer: Links funcionan
- [ ] Rutas: `/`, `/about`, `/blog`, `/blog/{slug}`, `/admin` funcionan
- [ ] Mobile menu funciona

### Performance

- [ ] Build sin errores: `npm run build`
- [ ] No hay warnings críticos de bundle size
- [ ] Imágenes cargan correctamente

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Server local en http://localhost:3000
node start.js        # Inicio automático con verificaciones

# Producción
npm run build        # Build optimizado en /dist
npm run preview      # Preview del build local

# Linting (no configurado aún - agregar ESLint si es necesario)
# Typecheck
npx tsc --noEmit     # Verificar errores TypeScript
```

## 🐛 Debugging

### Logs útiles en consola del navegador:

- Hooks: Errores en `usePosts`, `usePost`, `useAdminPosts` logean en console.error
- SeoMeta: Warnings si title >60 o description >160 caracteres

### Problemas comunes:

**Admin no funciona:**  
→ Verificar que usas `/admin` no `#admin` (history-based routing)

**Build warnings sobre bundle size:**  
→ Normal, el bundle es grande porque incluye React, Framer Motion, marked, etc. Considerar code-splitting en futuro.

**Supabase no conecta:**  
→ Verificar `.env.local` con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY correctas

**Markdown no renderiza:**  
→ Verificar que `marked` y `DOMPurify` estén instalados

## 🔮 Mejoras Futuras (No Implementadas por Riesgo)

Estas mejoras NO fueron aplicadas para evitar cambios en UX/UI o comportamiento:

1. **Code splitting**: Dynamic imports para reducir bundle size inicial
2. **Lazy loading**: React.lazy para componentes pesados (Admin, Editor)
3. **Image optimization**: Usar next/image equivalente o CDN con resize automático
4. **Service Worker**: PWA para offline
5. **Analytics**: Google Analytics o Plausible
6. **SEO mejorado**: react-helmet para meta tags dinámicos
7. **Testing**: Jest + React Testing Library
8. **ESLint + Prettier**: Linting y formato automático
9. **Supabase Auth real**: Reemplazar `admin123` por auth flow completo
10. **Validación con Zod**: Schema validation en forms

## 📦 Dependencias Clave

### Runtime

- `react`, `react-dom`: Framework UI
- `framer-motion`: Animaciones
- `lucide-react`: Iconos
- `@supabase/supabase-js`: Cliente Supabase
- `marked`: Parser Markdown
- `dompurify`: Sanitización XSS

### Dev

- `typescript`: Tipado estático
- `vite`: Build tool ultrarrápido
- `@vitejs/plugin-react`: Plugin Vite para React
- `@types/*`: Type definitions

### No Usadas (Limpieza Aplicada)

Ninguna dependencia no usada detectada.

## 🎨 Diseño Visual (NO Modificar)

- **Paleta de colores**: Definida en `index.html` → tailwind.config
  - Navy: `#0B1F3B` (primary)
  - Blue: `#123B7A` (secondary)
  - Gold: `#FFC83D` (accent)
  - Light: `#F0F6FF` (backgrounds)
- **Tipografía**: Inter (Google Fonts)
- **Animaciones**: Framer Motion con durations 300-700ms
- **Responsivo**: Mobile-first con breakpoints md, lg

## 🚢 Deployment (Próximo)

**Recomendación:** Vercel

1. Conectar repo GitHub
2. Configurar env vars en Vercel dashboard
3. Deploy automático en cada push a `main`
4. Domain custom: `cdr.com.ar` o similar

---

**Última actualización:** Diciembre 2025  
**Mantenido por:** Tech Lead Senior
