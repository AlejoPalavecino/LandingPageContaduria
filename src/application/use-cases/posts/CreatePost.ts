/**
 * Caso de Uso: CreatePost
 * Crea un nuevo post (Admin)
 */

import { PostRepository } from '../../../domain/ports/PostRepository';
import { Post } from '../../../domain/entities/Post';
import { SeoMeta } from '../../../domain/value-objects/SeoMeta';
import { PostCreateInput, PostDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export class CreatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(input: PostCreateInput): Promise<PostDTO> {
    // Validar que el slug no exista
    const slug = input.slug || input.title;
    const slugExists = await this.postRepository.slugExists(slug);
    
    if (slugExists) {
      throw new Error(`Ya existe un post con el slug: ${slug}`);
    }

    // Crear entidad Post
    const tags = input.tagSlugs?.map(slug => ({
      id: crypto.randomUUID(),
      name: slug,
      slug: slug
    })) ?? [];

    const post = Post.create(
      input.title,
      slug,
      input.contentMarkdown,
      input.excerpt,
      tags
    );

    // Actualizar con metadatos adicionales si existen
    const updatedPost = post.update({
      coverImageUrl: input.coverImageUrl,
      seoMeta: input.seoMeta ? SeoMeta.create(input.seoMeta) : undefined,
    });

    // Persistir
    const savedPost = await this.postRepository.create(updatedPost);

    return PostMapper.toDTO(savedPost);
  }
}
