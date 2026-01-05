# Plan de Implementación: Upload de Imágenes en Blog

## 📋 Objetivo
Permitir a los usuarios del admin panel subir imágenes directamente desde su computadora, además de poder usar URLs externas.

---

## 🏗️ Arquitectura de la Solución

### 1. Almacenamiento: Supabase Storage

**Por qué Supabase Storage:**
- ✅ Integrado con tu stack actual
- ✅ CDN global automático
- ✅ Control de acceso con RLS
- ✅ Optimización de imágenes
- ✅ Sin costos adicionales de infraestructura

**Estructura de Buckets:**
```
supabase-storage/
└── blog-images/          # Bucket público para imágenes de blog
    ├── covers/           # Imágenes de portada de posts
    ├── content/          # Imágenes dentro del contenido MD
    └── thumbnails/       # Miniaturas (opcional, futuro)
```

---

## 📊 Cambios en Base de Datos

### Esquema Actual (posts table)
```sql
-- Columna existente
cover_image_url TEXT  -- Puede ser URL externa O URL de Supabase Storage
```

**NO requiere cambios** en el schema. La columna `cover_image_url` funcionará para ambos casos:
- URLs externas: `https://example.com/image.jpg`
- URLs de Supabase: `https://urlwybmilxkasmxsrcsx.supabase.co/storage/v1/object/public/blog-images/covers/abc123.jpg`

### Tabla Adicional (Opcional - Futuro)
Para trackear imágenes subidas y permitir gestión:
```sql
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,  -- Ruta en Supabase Storage
  public_url TEXT NOT NULL,     -- URL pública completa
  size_bytes INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX idx_image_uploads_created_at ON image_uploads(created_at DESC);
```

---

## 🔧 Implementación Técnica

### Fase 1: Setup de Supabase Storage

#### 1.1. Crear Bucket en Supabase
```sql
-- Ejecutar en SQL Editor de Supabase
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);
```

#### 1.2. Configurar Policies de Storage
```sql
-- Permitir lectura pública de imágenes
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Permitir upload solo a admins autenticados
CREATE POLICY "Authenticated admins can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.uid() IN (SELECT id FROM admins)
);

-- Permitir delete solo a admins
CREATE POLICY "Authenticated admins can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  auth.uid() IN (SELECT id FROM admins)
);
```

---

### Fase 2: Servicio de Upload (Infrastructure Layer)

**Archivo:** `src/infrastructure/supabase/SupabaseImageService.ts`

```typescript
import { supabase } from './client';

export interface UploadImageResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export class SupabaseImageService {
  private readonly bucket = 'blog-images';

  /**
   * Subir imagen al storage de Supabase
   * @param file - Archivo de imagen
   * @param folder - Carpeta dentro del bucket ('covers' | 'content')
   * @returns URL pública de la imagen
   */
  async uploadImage(
    file: File,
    folder: 'covers' | 'content' = 'covers'
  ): Promise<UploadImageResult> {
    try {
      // Validaciones
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'El archivo debe ser una imagen' };
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { success: false, error: 'La imagen no debe superar 5MB' };
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload a Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
      }

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        error: 'Error inesperado al subir la imagen',
      };
    }
  }

  /**
   * Eliminar imagen del storage
   * @param publicUrl - URL pública de la imagen a eliminar
   */
  async deleteImage(publicUrl: string): Promise<boolean> {
    try {
      // Extraer path del bucket desde la URL
      const url = new URL(publicUrl);
      const pathMatch = url.pathname.match(/\/object\/public\/blog-images\/(.+)$/);
      
      if (!pathMatch) {
        console.error('Invalid image URL format');
        return false;
      }

      const filePath = pathMatch[1];

      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  }

  /**
   * Listar todas las imágenes (para futura galería)
   */
  async listImages(folder: string = 'covers'): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Error listing images:', error);
        return [];
      }

      return data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from(this.bucket)
          .getPublicUrl(`${folder}/${file.name}`);
        return publicUrlData.publicUrl;
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return [];
    }
  }
}
```

---

### Fase 3: Componente de Upload (Presentation Layer)

**Archivo:** `components/ImageUploader.tsx`

```typescript
import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { SupabaseImageService } from '../src/infrastructure/supabase/SupabaseImageService';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  folder?: 'covers' | 'content';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  folder = 'covers',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageService = new SupabaseImageService();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await imageService.uploadImage(file, folder);
      
      if (result.success && result.publicUrl) {
        onImageChange(result.publicUrl);
        setUrlInput(result.publicUrl);
      } else {
        setUploadError(result.error || 'Error al subir la imagen');
      }
    } catch (error) {
      setUploadError('Error inesperado');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs para elegir modo */}
      <div className="flex gap-2 border-b border-brand-border">
        <button
          onClick={() => setUploadMode('url')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'url'
              ? 'text-brand-blue border-b-2 border-brand-blue'
              : 'text-brand-graySec hover:text-brand-navy'
          }`}
        >
          <Icons.Link className="inline w-4 h-4 mr-2" />
          URL Externa
        </button>
        <button
          onClick={() => setUploadMode('file')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'file'
              ? 'text-brand-blue border-b-2 border-brand-blue'
              : 'text-brand-graySec hover:text-brand-navy'
          }`}
        >
          <Icons.Upload className="inline w-4 h-4 mr-2" />
          Subir Archivo
        </button>
      </div>

      {/* Content según modo */}
      {uploadMode === 'url' ? (
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <Button
            onClick={handleUrlSubmit}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Aplicar URL
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full px-4 py-8 border-2 border-dashed border-brand-border rounded-lg hover:border-brand-blue hover:bg-brand-light/50 transition-colors text-center disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Icons.Loader className="w-5 h-5 animate-spin" />
                <span>Subiendo...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Icons.Upload className="w-8 h-8 mx-auto text-brand-graySec" />
                <p className="text-sm text-brand-navy font-medium">
                  Click para seleccionar imagen
                </p>
                <p className="text-xs text-brand-graySec">
                  PNG, JPG, WebP (máx. 5MB)
                </p>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <Icons.AlertCircle className="w-4 h-4" />
          {uploadError}
        </div>
      )}

      {/* Preview */}
      {currentImageUrl && (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            onClick={() => {
              onImageChange('');
              setUrlInput('');
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Eliminar imagen"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
```

---

### Fase 4: Integración con AdminPostEditor

**Modificar:** `components/AdminPostEditor.tsx`

```typescript
// Agregar import
import { ImageUploader } from './ImageUploader';

// En el render, reemplazar la sección de Cover Image:

{/* Cover Image */}
<Card className="p-6">
  <label className="block text-sm font-bold text-brand-navy mb-4">
    Imagen de Portada
  </label>
  <ImageUploader
    currentImageUrl={formData.coverImageUrl}
    onImageChange={(url) => handleChange('coverImageUrl', url)}
    folder="covers"
  />
</Card>
```

---

## 🚀 Plan de Implementación por Fases

### **Fase 1: Setup Supabase Storage** (15 min)
1. ✅ Crear bucket `blog-images` en Supabase Dashboard
2. ✅ Aplicar SQL policies para acceso
3. ✅ Verificar que bucket es público

### **Fase 2: Servicio de Upload** (30 min)
1. ✅ Crear `SupabaseImageService.ts`
2. ✅ Implementar método `uploadImage()`
3. ✅ Implementar método `deleteImage()`
4. ✅ Testing manual con archivos

### **Fase 3: Componente UI** (45 min)
1. ✅ Crear `ImageUploader.tsx`
2. ✅ Implementar tabs URL/File
3. ✅ Drag & drop (opcional)
4. ✅ Preview y validaciones

### **Fase 4: Integración** (20 min)
1. ✅ Modificar `AdminPostEditor.tsx`
2. ✅ Testing end-to-end
3. ✅ Deploy y verificación

**Tiempo Total Estimado:** ~2 horas

---

## 📸 Casos de Uso Cubiertos

### Caso 1: URL Externa (Comportamiento Actual)
```
Usuario ingresa: https://unsplash.com/photo/abc123.jpg
BD guarda: https://unsplash.com/photo/abc123.jpg
```

### Caso 2: Upload de Archivo (Nuevo)
```
Usuario sube: mi-imagen.jpg (2MB)
Supabase crea: covers/1704470400000-x7j9k2.jpg
BD guarda: https://urlwybmilxkasmxsrcsx.supabase.co/storage/v1/object/public/blog-images/covers/1704470400000-x7j9k2.jpg
```

---

## 🔒 Seguridad

### Validaciones Frontend
- ✅ Tipos de archivo permitidos: `image/*`
- ✅ Tamaño máximo: 5MB
- ✅ Nombres únicos (timestamp + random)

### Validaciones Backend (RLS Policies)
- ✅ Solo admins autenticados pueden subir
- ✅ Solo admins pueden eliminar
- ✅ Lectura pública de imágenes

### Prevención de Abuso
- Rate limiting en Supabase (configuración por proyecto)
- Monitoreo de storage usage en dashboard

---

## 💰 Costos

### Supabase Free Tier
- **Storage:** 1GB gratis
- **Bandwidth:** 2GB/mes gratis
- **Estimación:** ~200-500 imágenes (promedio 2MB c/u)

### Plan Pro ($25/mes)
- **Storage:** 100GB
- **Bandwidth:** 200GB/mes
- **Estimación:** ~20,000-50,000 imágenes

**Conclusión:** Free tier es suficiente para comenzar.

---

## 🎯 Mejoras Futuras (Backlog)

1. **Galería de Imágenes**
   - Ver todas las imágenes subidas
   - Reutilizar imágenes anteriores
   - Buscar y filtrar

2. **Optimización Automática**
   - Resize automático (ej: 1200x630 para covers)
   - Conversión a WebP
   - Generación de thumbnails

3. **Editor de Markdown con Upload**
   - Drag & drop directo en editor MD
   - Insertar imágenes en contenido con `![alt](url)`

4. **CDN Custom**
   - Configurar dominio propio para imágenes
   - `images.cdr.com.ar` en vez de URL de Supabase

5. **Metadata de Imágenes**
   - Alt text automático con AI
   - Compresión inteligente
   - Análisis de contenido (objetos, colores)

---

## 📝 Checklist de Implementación

- [ ] **Setup Supabase**
  - [ ] Crear bucket `blog-images`
  - [ ] Aplicar policies SQL
  - [ ] Verificar acceso público

- [ ] **Código - Servicio**
  - [ ] Crear `SupabaseImageService.ts`
  - [ ] Implementar `uploadImage()`
  - [ ] Implementar `deleteImage()`
  - [ ] Agregar tests unitarios

- [ ] **Código - UI**
  - [ ] Crear `ImageUploader.tsx`
  - [ ] Implementar tabs URL/File
  - [ ] Agregar preview y validaciones
  - [ ] Integrar con `AdminPostEditor.tsx`

- [ ] **Testing**
  - [ ] Upload de imagen PNG
  - [ ] Upload de imagen JPG
  - [ ] Upload con tamaño > 5MB (debe fallar)
  - [ ] Upload de archivo no-imagen (debe fallar)
  - [ ] URL externa sigue funcionando
  - [ ] Delete de imagen

- [ ] **Deploy**
  - [ ] Commit y push a GitHub
  - [ ] Verificar build en Vercel
  - [ ] Testing en producción
  - [ ] Documentar en README

---

## 🆘 Troubleshooting

### Error: "Invalid bucket configuration"
**Solución:** Verificar que el bucket `blog-images` existe y es público.

### Error: "Authentication required"
**Solución:** Verificar que el admin está logueado y las policies permiten upload.

### Error: "File too large"
**Solución:** Supabase tiene límite de 50MB por archivo por defecto. Si necesitas más, configurar en Supabase Dashboard.

### Imágenes no cargan en preview
**Solución:** Verificar CORS en Supabase Settings > API > CORS. Agregar dominio de Vercel.

---

## 📚 Referencias

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase RLS for Storage](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Best Practices](https://web.dev/file-upload-best-practices/)

---

**Fecha de creación:** 5 de enero, 2026  
**Última actualización:** 5 de enero, 2026  
**Estado:** ✅ Plan Completo - Listo para Implementación
