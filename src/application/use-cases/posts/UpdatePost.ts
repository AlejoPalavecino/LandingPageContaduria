/**
 * Caso de Uso: UpdatePost
 * Actualiza un post existente (Admin)
 */

import { PostRepository } from '../../../domain/ports/PostRepository';
import { SeoMeta } from '../../../domain/value-objects/SeoMeta';
import { PostUpdateInput, PostDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export class UpdatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string, input: PostUpdateInput): Promise<PostDTO> {
    // Buscar post existente
    const existingPost = await this.postRepository.findById(id);
    
    if (!existingPost) {
      throw new Error(`Post no encontrado: ${id}`);
    }

    // Validar slug si se está cambiando
    if (input.slug && input.slug !== existingPost.slug.toString()) {
      const slugExists = await this.postRepository.slugExists(input.slug, id);
      if (slugExists) {
        throw new Error(`Ya existe un post con el slug: ${input.slug}`);
      }
    }

    // Preparar tags si se proporcionan
    const tags = input.tagSlugs?.map(slug => ({
      id: crypto.randomUUID(),
      name: slug,
      slug: slug
    }));

    // Actualizar entidad
    const updatedPost = existingPost.update({
      title: input.title,
      slug: input.slug,
      contentMarkdown: input.contentMarkdown,
      excerpt: input.excerpt,
      coverImageUrl: input.coverImageUrl,
      seoMeta: input.seoMeta ? SeoMeta.create(input.seoMeta) : undefined,
      tags,
    });

    // Persistir
    const savedPost = await this.postRepository.update(id, updatedPost);

    return PostMapper.toDTO(savedPost);
  }
}
