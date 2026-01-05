/**
 * Mapper: PostMapper
 * Convierte entre entidades de dominio y DTOs
 */

import { Post } from '../../domain/entities/Post';
import { SeoMeta } from '../../domain/value-objects/SeoMeta';
import { Slug } from '../../domain/value-objects/Slug';
import { PostDTO, PostListItemDTO, SeoMetaDTO } from '../dto/PostDTO';

export class PostMapper {
  /**
   * Convierte una entidad Post a PostDTO
   */
  static toDTO(post: Post): PostDTO {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug.toString(),
      excerpt: post.excerpt,
      contentMarkdown: post.contentMarkdown,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      coverImageUrl: post.coverImageUrl,
      seoMeta: post.seoMeta ? {
        title: post.seoMeta.title,
        description: post.seoMeta.description,
        ogImageUrl: post.seoMeta.ogImageUrl,
        canonicalUrl: post.seoMeta.canonicalUrl,
      } : null,
      tags: post.tags,
      readingTimeMin: post.readingTimeMin,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  /**
   * Convierte una entidad Post a PostListItemDTO (versión ligera)
   */
  static toListItemDTO(post: Post): PostListItemDTO {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug.toString(),
      excerpt: post.excerpt,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      coverImageUrl: post.coverImageUrl,
      tags: post.tags,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  /**
   * Convierte un PostDTO a entidad Post
   */
  static toDomain(dto: PostDTO): Post {
    return new Post(
      dto.id,
      dto.title,
      Slug.fromString(dto.slug),
      dto.contentMarkdown,
      dto.status,
      dto.excerpt,
      dto.publishedAt ? new Date(dto.publishedAt) : null,
      dto.coverImageUrl,
      dto.seoMeta ? SeoMeta.create(dto.seoMeta) : null,
      dto.tags,
      null,
      dto.readingTimeMin,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }
}
