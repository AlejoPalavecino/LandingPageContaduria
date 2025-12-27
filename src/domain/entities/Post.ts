/**
 * Entidad: Post
 * Representa un artículo del blog en el dominio
 */

import { Slug } from '../value-objects/Slug';
import { SeoMeta } from '../value-objects/SeoMeta';

export type PostStatus = 'draft' | 'published';

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export class Post {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: Slug,
    public readonly contentMarkdown: string,
    public readonly status: PostStatus,
    public readonly excerpt: string | null = null,
    public readonly publishedAt: Date | null = null,
    public readonly coverImageUrl: string | null = null,
    public readonly seoMeta: SeoMeta | null = null,
    public readonly tags: Tag[] = [],
    public readonly authorId: string | null = null,
    public readonly readingTimeMin: number | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Factory method para crear un nuevo post
   */
  static create(
    title: string,
    slug: string,
    contentMarkdown: string,
    excerpt?: string,
    tags: Tag[] = []
  ): Post {
    return new Post(
      crypto.randomUUID(),
      title,
      Slug.fromString(slug || title),
      contentMarkdown,
      'draft',
      excerpt || null,
      null,
      null,
      null,
      tags,
      null,
      null,
      new Date(),
      new Date()
    );
  }

  /**
   * Publicar el post
   */
  publish(): Post {
    return new Post(
      this.id,
      this.title,
      this.slug,
      this.contentMarkdown,
      'published',
      this.excerpt,
      new Date(),
      this.coverImageUrl,
      this.seoMeta,
      this.tags,
      this.authorId,
      this.readingTimeMin,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Despublicar el post (volver a draft)
   */
  unpublish(): Post {
    return new Post(
      this.id,
      this.title,
      this.slug,
      this.contentMarkdown,
      'draft',
      this.excerpt,
      null,
      this.coverImageUrl,
      this.seoMeta,
      this.tags,
      this.authorId,
      this.readingTimeMin,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Verificar si el post está publicado
   */
  isPublished(): boolean {
    return this.status === 'published';
  }

  /**
   * Actualizar contenido del post
   */
  update(updates: Partial<{
    title: string;
    slug: string;
    contentMarkdown: string;
    excerpt: string;
    coverImageUrl: string;
    seoMeta: SeoMeta;
    tags: Tag[];
  }>): Post {
    return new Post(
      this.id,
      updates.title ?? this.title,
      updates.slug ? Slug.fromString(updates.slug) : this.slug,
      updates.contentMarkdown ?? this.contentMarkdown,
      this.status,
      updates.excerpt ?? this.excerpt,
      this.publishedAt,
      updates.coverImageUrl ?? this.coverImageUrl,
      updates.seoMeta ?? this.seoMeta,
      updates.tags ?? this.tags,
      this.authorId,
      this.readingTimeMin,
      this.createdAt,
      new Date()
    );
  }
}
