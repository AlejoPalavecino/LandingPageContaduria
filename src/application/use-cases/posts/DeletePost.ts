/**
 * Caso de Uso: DeletePost
 * Elimina un post (Admin)
 */

import { PostRepository } from '../../../domain/ports/PostRepository';

export class DeletePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    
    if (!post) {
      throw new Error(`Post no encontrado: ${id}`);
    }

    await this.postRepository.delete(id);
  }
}
