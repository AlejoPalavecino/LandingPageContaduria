/**
 * Image Uploader Component
 * Permite subir imágenes desde archivo o URL externa
 */

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
      // Reset input para permitir subir el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUploadError(null);
    }
  };

  const handleRemoveImage = () => {
    onImageChange('');
    setUrlInput('');
    setUploadError(null);
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
          <Icons.ExternalLink className="inline w-4 h-4 mr-2" />
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
          <Icons.Plus className="inline w-4 h-4 mr-2" />
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
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-3 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
          <Button
            onClick={handleUrlSubmit}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={!urlInput.trim()}
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
            aria-label="Seleccionar imagen"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full px-4 py-8 border-2 border-dashed border-brand-border rounded-lg hover:border-brand-blue hover:bg-brand-light/50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-brand-navy">Subiendo...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Icons.Plus className="w-8 h-8 mx-auto text-brand-graySec" />
                <p className="text-sm text-brand-navy font-medium">
                  Click para seleccionar imagen
                </p>
                <p className="text-xs text-brand-graySec">
                  PNG, JPG, WebP, GIF (máx. 5MB)
                </p>
              </div>
            )}
          </button>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preview */}
      {currentImageUrl && (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-brand-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3EError al cargar imagen%3C/text%3E%3C/svg%3E';
            }}
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            title="Eliminar imagen"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
