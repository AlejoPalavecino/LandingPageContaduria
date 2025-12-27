/**
 * Caso de Uso: ListAllPosts
 * Lista todos los posts con filtros (Admin)
 */

import { PostRepository, PostFilters } from '../../../domain/ports/PostRepository';
import { PostListItemDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export interface ListAllPostsResult {
  items: PostListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
}

export class ListAllPosts {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(filters: PostFilters & { page?: number; pageSize?: number } = {}): Promise<ListAllPostsResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const result = await this.postRepository.findAll({
      ...filters,
      limit: pageSize,
      offset,
    });

    return {
      items: result.items.map(post => PostMapper.toListItemDTO(post)),
      total: result.total,
      page,
      pageSize,
    };
  }
}
