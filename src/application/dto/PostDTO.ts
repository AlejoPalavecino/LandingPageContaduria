/**
 * DTO: PostDTO
 * Objeto de transferencia de datos para posts
 * Usado para comunicación entre capas
 */

export interface TagDTO {
  id: string;
  name: string;
  slug: string;
}

export interface SeoMetaDTO {
  title: string | null;
  description: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
}

export interface PostDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentMarkdown: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  coverImageUrl: string | null;
  seoMeta: SeoMetaDTO | null;
  tags: TagDTO[];
  readingTimeMin: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostListItemDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImageUrl: string | null;
  tags: TagDTO[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PostCreateInput {
  title: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown: string;
  coverImageUrl?: string;
  seoMeta?: Partial<SeoMetaDTO>;
  tagSlugs?: string[];
}

export interface PostUpdateInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentMarkdown?: string;
  coverImageUrl?: string;
  seoMeta?: Partial<SeoMetaDTO>;
  tagSlugs?: string[];
}

// Alias para compatibilidad
export type CreatePostDTO = PostCreateInput & { status?: 'draft' | 'published'; category?: string; tags?: string[]; };
