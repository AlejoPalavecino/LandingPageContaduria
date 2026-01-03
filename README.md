# CDR - CFO Fractional Services 💼

> Landing page profesional para servicios de CFO Fractional orientado a PYMEs argentinas, con blog de insights financieros, calculadora interactiva y panel de administración.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39.7-3ECF8E?logo=supabase)](https://supabase.com/)

## 🎯 Descripción

Landing page moderna y optimizada para **CDR - Camilo D. Rodríguez**, Contador Público y Especialista en Finanzas Corporativas que ofrece servicios de CFO Fractional para PYMEs.

### Objetivo Principal

Convertir visitas en reuniones de 30 minutos mediante:

- 🎨 Diseño profesional con animaciones suaves
- 📝 Blog con contenido de valor sobre finanzas
- 🧮 Mini-test de salud financiera empresarial
- 📅 Integración directa con Calendly

## ✨ Características

### Para Visitantes

- **Landing Page**: Hero impactante, servicios, metodología de 5 pasos, FAQs
- **Sección "Quién Soy"**: Presentación profesional con fondo animado
- **Blog**: Artículos sobre finanzas con filtros por tags, búsqueda y posts relacionados
- **Mini-Test**: Calculadora de salud financiera (10 preguntas + scoring automático)
- **Responsive**: Diseño mobile-first con sticky CTA

### Para Administradores

- **Panel Admin** (`/admin`): Gestión completa de blog
  - Login seguro (contraseña temporal: `admin123`)
  - CRUD completo de posts
  - Editor Markdown con preview en tiempo real
  - Gestión de tags y categorías
  - SEO meta tags por post
  - Publicar/despublicar con un click
  - Cálculo automático de tiempo de lectura

### Seguridad

- ✅ Sanitización de Markdown con DOMPurify (protección XSS)
- ✅ Row Level Security (RLS) en Supabase
- ✅ Variables de entorno para keys sensibles
- ✅ Auth temporal (pendiente migrar a Supabase Auth)

## 🚀 Tech Stack

### Frontend

- **React** 18.3.1 + **TypeScript** 5.8.2
- **Vite** 6.2.0 (build ultrarrápido)
- **Framer Motion** 11.15.0 (animaciones)
- **Lucide React** (iconos)
- **TailwindCSS** (utility-first styling)

### Backend & Database

- **Supabase** 2.39.7
  - PostgreSQL con Row Level Security (RLS)
  - Auth (email/password)
  - Real-time capabilities
  - RESTful API auto-generada

### Arquitectura

- **Clean Architecture** (Domain, Application, Infrastructure, Presentation)
- **Repository Pattern** para abstracción de datos
- **Use Cases** para lógica de negocio
- **DTOs y Mappers** para transformación de datos

### Markdown & Security

- **Marked** 11.1.1 (parsing Markdown → HTML)
- **DOMPurify** 3.0.8 (sanitización XSS)

## 📦 Deployment

Este proyecto está listo para deployment en **Vercel**.

**Guía completa**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md)

### Deploy Rápido

1. **Fork/Clone** el repositorio
2. **Importar en Vercel**: [vercel.com/new](https://vercel.com/new)
3. **Configurar Environment Variables**:
   ```
   VITE_SUPABASE_URL=<tu-url>
   VITE_SUPABASE_ANON_KEY=<tu-key>
   ```
4. **Deploy** 🚀

Vercel detectará automáticamente Vite y usará la configuración óptima.

- **Tailwind CSS** (via CDN, 0 config)
- **Framer Motion** 11.15.0 (animaciones)
- **Lucide React** 0.460.0 (iconos)

### Backend & Database

- **Supabase** 2.39.7 (PostgreSQL + Auth + Storage)
- **Clean Architecture** (Domain, Application, Infrastructure, Presentation)

### Content Processing

- **marked** 11.1.1 (Markdown parser)
- **DOMPurify** 3.0.8 (XSS protection)

## 📋 Requisitos Previos

- **Node.js** 18+ y **npm**
- **(Opcional)** Cuenta en [Supabase](https://supabase.com) para conectar base de datos

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AlejoPalavecino/LandingPageContaduria.git
cd LandingPageContaduria

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:3000)
npm run build    # Build de producción en /dist
npm run preview  # Preview del build local
node start.js    # Inicio automático con verificaciones
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local` en la raíz (usar `.env.example` como referencia):

```bash
# Supabase (Opcional - solo si conectas base de datos)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Gemini AI (Opcional - para análisis avanzado del health test)
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

**⚠️ Importante:** No commitear `.env.local` al repositorio.

### Supabase Setup (Opcional)

Si querés conectar la base de datos real:

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar migraciones en orden desde `supabase/migrations/`
3. Configurar variables de entorno
4. Crear usuario admin (ver documentación en `PROJECT_SUMMARY.md`)

**Sin Supabase:** El proyecto funciona con mock data para el blog.

## 🗂️ Estructura del Proyecto

```
/
├── App.tsx                    # Router principal + páginas
├── components/                # Componentes React
│   ├── Admin.tsx             # Panel de administración
│   ├── AdminPostEditor.tsx   # Editor de posts
│   ├── Layout.tsx            # Header, Footer, CTA
│   └── ...
├── src/                      # Clean Architecture
│   ├── domain/               # Entidades y lógica de negocio
│   ├── application/          # Casos de uso
│   ├── infrastructure/       # Implementaciones (Supabase)
│   └── presentation/         # Hooks y servicios UI
├── supabase/                 # Migraciones SQL
├── services/mockData.ts      # Datos de prueba
└── PROJECT_SUMMARY.md        # Documentación técnica completa
```

## 🎨 Rutas Disponibles

| Ruta          | Descripción                              |
| ------------- | ---------------------------------------- |
| `/`           | Landing page principal                   |
| `/about`      | Quién soy (perfil de Camilo)             |
| `/blog`       | Lista de artículos del blog              |
| `/blog/:slug` | Detalle de un artículo                   |
| `/test-salud` | Mini-test de salud financiera            |
| `/admin`      | Panel de administración (requiere login) |

## 🔐 Acceso al Admin

**URL:** http://localhost:3000/admin  
**Contraseña temporal:** `admin123`

> **Nota:** La autenticación actual es temporal. Se recomienda migrar a Supabase Auth en producción.

## 📱 Funcionalidades Detalladas

### Landing Page

- Hero con propuesta de valor clara
- 3 servicios principales (Fiscal, Financiero, CFO Fractional)
- Metodología de 5 pasos con iconografía
- FAQs interactivos con animaciones
- CTAs estratégicos (Calendly)

### Blog

- Posts con Markdown enriquecido
- Filtros por tags y búsqueda en tiempo real
- Ordenamiento (newest, oldest, alphabetical)
- Posts relacionados por tags
- Share buttons (LinkedIn, WhatsApp)
- Metadata SEO por artículo

### Mini-Test de Salud Financiera

- 10 preguntas sobre la empresa
- Scoring automático (0-100 puntos)
- 4 categorías: Crítico, Mejorable, Aceptable, Óptimo
- Análisis con Gemini AI (opcional)
- CTA contextual post-resultado

### Panel Admin

- Dashboard con lista de todos los posts
- Filtros: Todos, Publicados, Borradores
- Editor Markdown con tabs (Editar/Preview)
- Auto-generación de slugs
- Gestión de tags y categoría
- Campos SEO (meta title, description)
- Tiempo de lectura calculado automáticamente
- Publicar/Despublicar con toggle
- Eliminar con confirmación

## 🌐 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlejoPalavecino/LandingPageContaduria)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno en Settings
3. Deploy automático en cada push a `main`

### Otras Plataformas

- **Netlify**: Drag & drop de carpeta `/dist`
- **GitHub Pages**: Requiere configuración adicional de routing

## 🤝 Contribución

Este es un proyecto privado para CDR. Si encontrás un bug o tenés una sugerencia:

1. Abrí un [Issue](https://github.com/AlejoPalavecino/LandingPageContaduria/issues)
2. Describí el problema o mejora
3. (Opcional) Creá un Pull Request con la solución

## 📄 Documentación Adicional

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**: Documentación técnica completa
- **[supabase/migrations/](supabase/migrations/)**: Scripts SQL para base de datos
- **[Documentacion/](Documentacion/)**: Requisitos y especificaciones originales

## 📞 Contacto

**Camilo D. Rodríguez**  
CFO Fractional & Estrategia Financiera

- 🌐 Website: [En desarrollo]
- 💼 LinkedIn: [Perfil profesional]
- 📧 Email: contacto@cdr.com.ar

---

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** con 4 capas claramente separadas:

```
Domain (Negocio)
    ↓
Application (Casos de Uso)
    ↓
Infrastructure (Implementaciones)
    ↓
Presentation (UI/Hooks)
```

**Beneficios:**

- ✅ Testeable
- ✅ Mantenible
- ✅ Escalable
- ✅ Independiente de frameworks

## 🐛 Troubleshooting

### Build Warnings

**Warning: Chunks > 500KB**  
➡️ Normal para este proyecto. React + Framer Motion + Supabase generan bundle grande. Considerar code-splitting en futuro.

### Supabase No Conecta

➡️ Verificar `.env.local` con variables correctas (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).

### Admin No Funciona

➡️ Usar `/admin` (no `#admin`). El proyecto usa history-based routing.

### TypeScript Errors

➡️ Ejecutar `npx tsc --noEmit` para ver errores específicos.

## 📈 Roadmap

- [ ] Migrar auth de `admin123` a Supabase Auth
- [ ] Analytics con Plausible o Google Analytics
- [ ] Code splitting con React.lazy
- [ ] Testing con Jest + React Testing Library
- [ ] PWA con Service Worker
- [ ] SEO dinámico con react-helmet
- [ ] Optimización de imágenes (CDN)

## 📜 Licencia

© 2025 CDR - Camilo D. Rodríguez. Todos los derechos reservados.

---

**Hecho con ❤️ usando React + TypeScript + Vite**

**Tech Lead:** [Alejo Palavecino](https://github.com/AlejoPalavecino)
