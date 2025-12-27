/**
 * Caso de Uso: GetPublishedPostBySlug
 * Obtiene un post publicado por su slug (para el público)
 */

import { PostRepository } from '../../../domain/ports/PostRepository';
import { PostDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export class GetPublishedPostBySlug {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string): Promise<PostDTO | null> {
    const post = await this.postRepository.findBySlug(slug);

    if (!post || !post.isPublished()) {
      return null;
    }

    return PostMapper.toDTO(post);
  }
}
