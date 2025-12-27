/**
 * Value Object: SeoMeta
 * Representa los metadatos SEO de un post
 */

export class SeoMeta {
  constructor(
    public readonly title: string | null = null,
    public readonly description: string | null = null,
    public readonly ogImageUrl: string | null = null,
    public readonly canonicalUrl: string | null = null
  ) {
    // Validaciones opcionales (best practices SEO)
    // No logear en producción - solo útil en dev
  }

  static create(data: Partial<SeoMeta>): SeoMeta {
    return new SeoMeta(
      data.title ?? null,
      data.description ?? null,
      data.ogImageUrl ?? null,
      data.canonicalUrl ?? null
    );
  }

  /**
   * Verificar si tiene metadatos completos
   */
  isComplete(): boolean {
    return !!(this.title && this.description);
  }

  /**
   * Obtener el título para Open Graph (usa title o cae back a null)
   */
  getOgTitle(): string | null {
    return this.title;
  }

  /**
   * Obtener la descripción para Open Graph
   */
  getOgDescription(): string | null {
    return this.description;
  }
}
