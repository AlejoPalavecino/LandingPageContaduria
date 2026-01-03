# ✅ Checklist Pre-Deploy

## Archivos Creados para Vercel

- [x] `vercel.json` - Configuración de rewrites y headers
- [x] `.env.production` - Template de variables de entorno
- [x] `DEPLOYMENT.md` - Guía completa de deployment
- [x] `.gitignore` actualizado - Excluye archivos sensibles y `.vercel/`

## Build Verificado

- [x] Build de producción completado sin errores
- [x] Output: `dist/index.html` (4.17 kB)
- [x] Bundle JS: 602.57 kB (178.26 kB gzipped)

## Variables de Entorno Requeridas

Configurar en Vercel (Project Settings > Environment Variables):

### Obligatorias

- [ ] `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- [ ] `VITE_SUPABASE_ANON_KEY` - Anon key de Supabase

### Opcionales

- [ ] `VITE_CALENDLY_URL` - URL de Calendly para agendar reuniones
- [ ] `VITE_GA_TRACKING_ID` - Google Analytics tracking ID

## Supabase Configuration

- [x] Schema aplicado (`schema.sql`)
- [x] Datos seed cargados (`seed.sql`)
- [x] RLS policies configuradas
- [x] Admin user creado (admin@cdr.com.ar)
- [ ] Verificar que el proyecto no esté pausado
- [ ] Copiar credenciales para Vercel

## Pre-Deploy Checklist

### Git Repository

```bash
# 1. Commitear cambios
git add .
git commit -m "Preparado para deploy en Vercel"

# 2. Pushear a GitHub/GitLab/Bitbucket
git push origin main
```

### Vercel Setup

1. [ ] Ir a [vercel.com/new](https://vercel.com/new)
2. [ ] Importar repositorio
3. [ ] Framework: Vite (detectado automáticamente)
4. [ ] Build Command: `npm run build`
5. [ ] Output Directory: `dist`
6. [ ] Configurar variables de entorno
7. [ ] Click en "Deploy"

## Post-Deploy Verification

### URLs a Probar

- [ ] `/` - Landing page carga correctamente
- [ ] `/about` - Página "Quién Soy" funciona
- [ ] `/blog` - Lista de posts desde Supabase
- [ ] `/blog/<slug>` - Detalle de post individual
- [ ] `/admin` - Panel de admin (login funciona)
- [ ] Calendly modal se abre correctamente

### Funcionalidad

- [ ] Navbar visible en todas las páginas
- [ ] Blog muestra posts publicados de Supabase
- [ ] Admin puede crear/editar/publicar posts
- [ ] Búsqueda y filtros funcionan en blog
- [ ] Posts relacionados se muestran correctamente
- [ ] Responsive en mobile/tablet/desktop

### Performance

- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

## Troubleshooting

### Si el blog no carga posts:

1. Verificar variables de entorno en Vercel
2. Verificar RLS policies en Supabase
3. Verificar que hay posts con status='published'

### Si admin no funciona:

1. Verificar credenciales de Supabase
2. Verificar tabla 'admins' en Supabase
3. Verificar que user admin@cdr.com.ar existe

### Si hay errores 404:

1. Verificar que `vercel.json` está en el repo
2. Re-deploy el proyecto

## Dominio Custom (Opcional)

- [ ] Configurar dominio en Vercel Settings > Domains
- [ ] Actualizar registros DNS
- [ ] Esperar propagación (24-48 horas)
- [ ] Verificar SSL/HTTPS automático

## Optimizaciones Futuras

- [ ] Code splitting para reducir bundle size
- [ ] Lazy loading de componentes pesados
- [ ] Image optimization con Vercel Image
- [ ] Analytics y monitoreo
- [ ] Error tracking (Sentry)

---

**Estado**: ✅ Listo para deploy
**Fecha**: 3 de enero, 2026
