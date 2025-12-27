/**
 * Caso de Uso: PublishPost
 * Publica o despublica un post (Admin)
 */

import { PostRepository } from '../../../domain/ports/PostRepository';
import { PostDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export class PublishPost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string, publish: boolean): Promise<PostDTO> {
    const post = await this.postRepository.findById(id);
    
    if (!post) {
      throw new Error(`Post no encontrado: ${id}`);
    }

    const updatedPost = publish ? post.publish() : post.unpublish();
    const savedPost = await this.postRepository.update(id, updatedPost);

    return PostMapper.toDTO(savedPost);
  }
}
