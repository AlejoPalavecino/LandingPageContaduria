/**
 * Supabase Image Service
 * Gestión de imágenes en Supabase Storage
 */

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
