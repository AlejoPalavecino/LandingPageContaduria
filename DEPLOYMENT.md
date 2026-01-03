# Guía de Deployment en Vercel

Este documento explica cómo deployar el proyecto CDR Portfolio en Vercel.

## Pre-requisitos

1. **Cuenta de Vercel**: Crear cuenta en [vercel.com](https://vercel.com)
2. **Proyecto en Supabase**: Ya configurado con schema y datos
3. **Git Repository**: Proyecto subido a GitHub, GitLab o Bitbucket

## Pasos para Deployment

### 1. Preparar el Repositorio

Asegurarse de que el proyecto esté en un repositorio Git:

```bash
git init
git add .
git commit -m "Preparado para deploy en Vercel"
git remote add origin <tu-repo-url>
git push -u origin main
```

### 2. Importar Proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Seleccionar "Import Git Repository"
3. Elegir el repositorio del proyecto
4. Vercel detectará automáticamente que es un proyecto Vite

### 3. Configurar Variables de Entorno

En **Project Settings > Environment Variables**, agregar:

#### Variables Requeridas (Supabase)

```
VITE_SUPABASE_URL = https://urlwybmilxkasmxsrcsx.supabase.co
VITE_SUPABASE_ANON_KEY = <tu-anon-key-de-supabase>
```

**Dónde encontrar las credenciales de Supabase:**

- Ir a tu proyecto en [supabase.com](https://supabase.com)
- Click en Settings > API
- Copiar "Project URL" → `VITE_SUPABASE_URL`
- Copiar "anon/public key" → `VITE_SUPABASE_ANON_KEY`

#### Variables Opcionales

```
VITE_CALENDLY_URL = https://calendly.com/tu-usuario/30min
VITE_GA_TRACKING_ID = G-XXXXXXXXXX
```

**Nota importante:** Agregar estas variables para **Production**, **Preview**, y **Development** environments.

### 4. Build Settings

Vercel detectará automáticamente la configuración, pero verificar:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` o `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. Deploy

1. Click en **Deploy**
2. Esperar que termine el build (2-3 minutos)
3. Vercel generará una URL de producción (ej: `cdr-portfolio.vercel.app`)

## Post-Deployment

### Verificar Funcionalidad

1. **Landing Page**: Verificar que cargue correctamente
2. **Blog**: Ir a `/blog` y verificar que muestre posts de Supabase
3. **Admin Panel**: Ir a `/admin` y verificar login
4. **Calendly Modal**: Verificar que se abra correctamente

### Configurar Dominio Custom (Opcional)

1. En Vercel: **Settings > Domains**
2. Agregar tu dominio (ej: `cdr.com.ar`)
3. Seguir instrucciones para configurar DNS:

   - Tipo: `A Record`
   - Name: `@` o `www`
   - Value: IP de Vercel (proporcionado)
   - TTL: 3600

4. Esperar propagación DNS (puede tomar 24-48 horas)

### Configurar CORS en Supabase (si es necesario)

Si tenés problemas de CORS:

1. Ir a Supabase > Settings > API
2. En "API Settings" > "Additional URLs"
3. Agregar tu dominio de Vercel: `https://tu-proyecto.vercel.app`

## Troubleshooting

### Error: "Module not found"

- Verificar que todas las dependencias estén en `package.json`
- Ejecutar `npm install` localmente y commitear `package-lock.json`

### Error: "Environment variables not defined"

- Verificar que las variables estén configuradas en Vercel
- Asegurar que empiezan con `VITE_` (requerido por Vite)
- Re-deployar después de agregar variables

### Error: "404 on refresh"

- El archivo `vercel.json` debe estar presente (ya incluido)
- Verifica que tenga la configuración de rewrites correcta

### Supabase connection error

- Verificar que la URL y anon key sean correctas
- Verificar RLS policies en Supabase
- Verificar que el proyecto de Supabase esté activo (no pausado)

## Comandos Útiles

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy desde terminal
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs <deployment-url>

# Abrir dashboard
vercel dashboard
```

## Auto-Deploy

Una vez configurado, cada push a la rama `main` dispara un deploy automático:

- **Production**: Push a `main`
- **Preview**: Push a otras ramas o Pull Requests

## Revertir Deploy

Si algo sale mal:

1. Ir a **Deployments** en Vercel dashboard
2. Encontrar deployment anterior estable
3. Click en **Promote to Production**

## Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Docs](https://supabase.com/docs)

---

**Última actualización**: 3 de enero, 2026
