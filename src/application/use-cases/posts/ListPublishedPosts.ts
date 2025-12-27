/**
 * Caso de Uso: ListPublishedPosts
 * Obtiene la lista de posts publicados (para el público)
 */

import { PostRepository, PaginatedResult } from '../../../domain/ports/PostRepository';
import { Post } from '../../../domain/entities/Post';
import { PostListItemDTO } from '../../dto/PostDTO';
import { PostMapper } from '../../dto/PostMapper';

export interface ListPublishedPostsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}

export interface ListPublishedPostsResult {
  items: PostListItemDTO[];
  total: number;
  page: number;
  pageSize: number;
}

export class ListPublishedPosts {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(filters: ListPublishedPostsFilters = {}): Promise<ListPublishedPostsResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const offset = (page - 1) * pageSize;

    const result = await this.postRepository.findPublished({
      search: filters.search,
      tag: filters.tag,
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
