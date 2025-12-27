/**
 * Port: PostRepository
 * Define el contrato para el repositorio de posts
 * Las implementaciones concretas estarán en la capa de infraestructura
 */

import { Post, PostStatus } from '../entities/Post';

export interface PostFilters {
  status?: PostStatus;
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PostRepository {
  /**
   * Obtener un post por su ID
   */
  findById(id: string): Promise<Post | null>;

  /**
   * Obtener un post por su slug
   */
  findBySlug(slug: string): Promise<Post | null>;

  /**
   * Listar posts con filtros y paginación
   */
  findAll(filters: PostFilters): Promise<PaginatedResult<Post>>;

  /**
   * Listar posts publicados (público)
   */
  findPublished(filters: Omit<PostFilters, 'status'>): Promise<PaginatedResult<Post>>;

  /**
   * Crear un nuevo post
   */
  create(post: Post): Promise<Post>;

  /**
   * Actualizar un post existente
   */
  update(id: string, post: Post): Promise<Post>;

  /**
   * Eliminar un post
   */
  delete(id: string): Promise<void>;

  /**
   * Verificar si existe un slug
   */
  slugExists(slug: string, excludeId?: string): Promise<boolean>;
}
