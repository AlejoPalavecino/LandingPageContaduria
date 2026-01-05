# 🚀 Implementación de Upload de Imágenes - Pasos a Seguir

## ✅ Código Implementado

Los siguientes archivos han sido creados/modificados:

1. ✅ **`supabase/setup_storage.sql`** - SQL para configurar Storage
2. ✅ **`src/infrastructure/supabase/SupabaseImageService.ts`** - Servicio de upload
3. ✅ **`components/ImageUploader.tsx`** - Componente UI
4. ✅ **`components/AdminPostEditor.tsx`** - Integrado con ImageUploader

---

## 📋 Pasos para Completar la Implementación

### Paso 1: Configurar Supabase Storage (5 min)

1. **Ir a Supabase Dashboard:**
   - Abrir https://supabase.com/dashboard
   - Seleccionar tu proyecto

2. **Ejecutar SQL:**
   - Ir a SQL Editor (menú izquierdo)
   - Abrir el archivo `supabase/setup_storage.sql`
   - Copiar todo el contenido
   - Pegar en el editor SQL
   - Click en "Run"

3. **Verificar:**
   - Ir a Storage (menú izquierdo)
   - Deberías ver el bucket `blog-images`
   - Click en el bucket para verificar que está público

---

### Paso 2: Verificar Variables de Entorno

Asegurate que tu `.env.local` tenga:

```env
VITE_SUPABASE_URL=https://urlwybmilxkasmxsrcsx.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

---

### Paso 3: Instalar y Probar Localmente (10 min)

```bash
# 1. Instalar dependencias (si es necesario)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Ir a http://localhost:3000/admin
# 4. Login con tu cuenta admin
# 5. Crear o editar un post
# 6. Probar upload de imagen:
#    - Tab "Subir Archivo" → Seleccionar imagen
#    - Tab "URL Externa" → Pegar URL
```

---

### Paso 4: Casos de Prueba

Probar los siguientes escenarios:

#### ✅ Caso 1: Upload de archivo exitoso
- [ ] Seleccionar imagen JPG < 5MB
- [ ] Ver progress "Subiendo..."
- [ ] Ver preview de imagen
- [ ] Guardar post
- [ ] Verificar que imagen aparece en blog público

#### ✅ Caso 2: Validaciones
- [ ] Intentar subir archivo > 5MB → Debe mostrar error
- [ ] Intentar subir PDF → Debe mostrar error
- [ ] Subir imagen válida → Debe funcionar

#### ✅ Caso 3: URL Externa
- [ ] Cambiar a tab "URL Externa"
- [ ] Pegar URL de imagen externa
- [ ] Click "Aplicar URL"
- [ ] Ver preview
- [ ] Guardar post → Debe funcionar

#### ✅ Caso 4: Eliminar imagen
- [ ] Hover sobre imagen preview
- [ ] Click en botón X rojo
- [ ] Imagen debe desaparecer

---

### Paso 5: Deploy a Producción

```bash
# 1. Commit y push
git add .
git commit -m "Feat: Implementar upload de imágenes en admin panel"
git push origin main

# 2. Vercel deployará automáticamente

# 3. Verificar en producción:
#    - Ir a https://tu-dominio.vercel.app/admin
#    - Probar upload de imagen
#    - Verificar que funciona correctamente
```

---

## 🔍 Troubleshooting

### Error: "Invalid bucket configuration"
**Solución:** Ejecutar `supabase/setup_storage.sql` en Supabase SQL Editor

### Error: "Authentication required"
**Solución:** 
1. Verificar que estás logueado en admin panel
2. Verificar policies en Supabase Storage

### Error: "Failed to upload"
**Solución:**
1. Abrir DevTools Console (F12)
2. Verificar el error específico
3. Verificar que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están correctas

### Imagen no se ve en preview
**Solución:**
1. Verificar que el bucket es público
2. Abrir la URL de la imagen directamente en el navegador
3. Verificar CORS en Supabase Settings > API

---

## 📊 Verificar en Supabase Dashboard

Después de subir imágenes, verificar en Supabase:

1. **Storage > blog-images:**
   - Deberías ver carpeta `covers/`
   - Dentro deberías ver tus imágenes con nombres únicos
   - Click en imagen → Ver URL pública

2. **Table Editor > posts:**
   - Verificar que `cover_image_url` tiene la URL correcta
   - Formato: `https://...supabase.co/storage/v1/object/public/blog-images/covers/...`

---

## 🎯 Próximos Pasos (Opcional)

Una vez que funcione correctamente, podés agregar:

- [ ] **Drag & Drop:** Arrastrar archivos directamente
- [ ] **Galería:** Ver todas las imágenes subidas
- [ ] **Crop/Resize:** Editar imagen antes de subir
- [ ] **Multiple Upload:** Subir varias imágenes a la vez
- [ ] **Progress Bar:** Barra de progreso detallada

---

## 📞 Soporte

Si tenés algún error:

1. Revisar console del navegador (F12)
2. Revisar logs de Supabase
3. Verificar que seguiste todos los pasos

**Estado:** ✅ Implementación completa - Lista para probar

Fecha: 5 de enero, 2026
