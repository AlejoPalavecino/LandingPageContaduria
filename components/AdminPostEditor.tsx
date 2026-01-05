/**
 * Admin Post Editor Component
 * Editor de posts con Markdown, preview, tags y SEO
 */

import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Icons } from './Icons';
import { Button } from './Button';
import { Input, Card } from './UI';
import { ImageUploader } from './ImageUploader';

// ============================================================================
// TYPES
// ============================================================================

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  readingTimeMin: number;
}

interface AdminPostEditorProps {
  initialData?: Partial<PostFormData>;
  isLoading?: boolean;
  onSave: (data: PostFormData, isDraft: boolean) => Promise<void>;
  onCancel: () => void;
}

// ============================================================================
// ADMIN POST EDITOR
// ============================================================================

export const AdminPostEditor: React.FC<AdminPostEditorProps> = ({
  initialData,
  isLoading = false,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    contentMarkdown: initialData?.contentMarkdown || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    readingTimeMin: initialData?.readingTimeMin || 0,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData?.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, initialData?.slug]);

  // Auto-calculate reading time
  useEffect(() => {
    const wordCount = formData.contentMarkdown.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    setFormData((prev) => ({ ...prev, readingTimeMin: readingTime }));
  }, [formData.contentMarkdown]);

  const handleChange = (field: keyof PostFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleChange('tags', formData.tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (isDraft: boolean) => {
    setIsSaving(true);
    try {
      await onSave(formData, isDraft);
    } finally {
      setIsSaving(false);
    }
  };

  const renderMarkdown = (markdown: string) => {
    const html = marked(markdown, { breaks: true }) as string;
    return DOMPurify.sanitize(html);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-navy mb-2">
            {initialData ? 'Editar Post' : 'Nuevo Post'}
          </h1>
          <p className="text-brand-gray">
            {showPreview ? 'Vista previa del artículo' : 'Completá los campos para crear el artículo'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-brand-gray hover:text-brand-navy transition-colors flex items-center gap-2"
        >
          <Icons.X className="w-5 h-5" />
          Cancelar
        </button>
      </div>

      {/* Toggle Preview */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowPreview(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !showPreview ? 'bg-brand-blue text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
          }`}
        >
          Editar
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showPreview ? 'bg-brand-blue text-white' : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
          }`}
        >
          Vista Previa
        </button>
      </div>

      {/* Editor Form */}
      {!showPreview ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Título *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Título del artículo"
                className="w-full text-2xl font-bold"
                required
              />
            </Card>

            {/* Slug */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                URL Slug *
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-del-articulo"
                className="w-full font-mono text-sm"
                required
              />
              <p className="text-xs text-brand-graySec mt-2">
                URL: /blog/{formData.slug || 'slug-del-articulo'}
              </p>
            </Card>

            {/* Excerpt */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Extracto *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Breve descripción del artículo (máx. 200 caracteres)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
                required
              />
              <p className="text-xs text-brand-graySec mt-2">
                {formData.excerpt.length}/200 caracteres
              </p>
            </Card>

            {/* Content Markdown */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Contenido (Markdown) *
              </label>
              <textarea
                value={formData.contentMarkdown}
                onChange={(e) => handleChange('contentMarkdown', e.target.value)}
                placeholder="Escribí el contenido usando Markdown...&#10;&#10;# Título&#10;## Subtítulo&#10;**Negrita** *cursiva*&#10;- Lista&#10;[Link](url)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm resize-none"
                rows={20}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-brand-graySec">
                  ~{formData.readingTimeMin} min de lectura
                </p>
                <a
                  href="https://www.markdownguide.org/basic-syntax/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-blue hover:underline"
                >
                  Guía de Markdown
                </a>
              </div>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
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

            {/* Category */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                aria-label="Seleccionar categoría"
              >
                <option value="">Seleccionar...</option>
                <option value="Fiscal">Fiscal</option>
                <option value="Financiero">Financiero</option>
                <option value="Estratégico">Estratégico</option>
                <option value="Gestión">Gestión</option>
                <option value="Tecnología">Tecnología</option>
              </select>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Agregar tag"
                  className="flex-1"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-navy transition-colors"
                  type="button"
                  aria-label="Agregar tag"
                >
                  <Icons.Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-light text-brand-blue rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-brand-navy"
                      type="button"
                      aria-label={`Eliminar tag ${tag}`}
                    >
                      <Icons.X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </Card>

            {/* SEO */}
            <Card className="p-6">
              <label className="block text-sm font-bold text-brand-navy mb-4">
                SEO (Opcional)
              </label>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Meta Título</label>
                  <Input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                    placeholder={formData.title || 'Título SEO'}
                    className="w-full"
                    maxLength={60}
                  />
                  <p className="text-xs text-brand-graySec mt-1">
                    {formData.seoTitle.length}/60
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Meta Descripción</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                    placeholder={formData.excerpt || 'Descripción para motores de búsqueda'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-blue focus:border-transparent text-sm resize-none"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-brand-graySec mt-1">
                    {formData.seoDescription.length}/160
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSaving || isLoading}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Icons.CheckCircle2 className="w-5 h-5 mr-2" />
                    Publicar
                  </>
                )}
              </Button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={isSaving || isLoading}
                className="w-full px-6 py-3 bg-gray-100 text-brand-navy rounded-lg hover:bg-gray-200 transition-colors font-bold disabled:opacity-50 flex items-center justify-center"
              >
                <Icons.Save className="w-5 h-5 mr-2" />
                Guardar Borrador
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview */
        <Card className="p-8 lg:p-12">
          {/* Cover Image */}
          {formData.coverImageUrl && (
            <img
              src={formData.coverImageUrl}
              alt={formData.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            {formData.title || 'Título del artículo'}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-brand-graySec mb-8 pb-8 border-b">
            {formData.category && (
              <span className="flex items-center gap-2">
                <Icons.Tag className="w-4 h-4" />
                {formData.category}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Icons.Clock className="w-4 h-4" />
              {formData.readingTimeMin} min de lectura
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-brand-gray mb-8 italic border-l-4 border-brand-gold pl-6">
            {formData.excerpt || 'Extracto del artículo...'}
          </p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(formData.contentMarkdown || '*Escribí contenido para ver la preview...*'),
            }}
          />

          {/* Tags */}
          {formData.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm font-bold text-brand-navy mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-brand-light text-brand-blue rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
