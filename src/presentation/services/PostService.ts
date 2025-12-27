/**
 * Post Service (Capa de Presentación)
 * Facade que conecta los componentes UI con los casos de uso
 */

import { SupabasePostRepository } from '../../infrastructure/supabase/SupabasePostRepository';
import { ListPublishedPosts } from '../../application/use-cases/posts/ListPublishedPosts';
import { GetPublishedPostBySlug } from '../../application/use-cases/posts/GetPublishedPostBySlug';
import { CreatePost } from '../../application/use-cases/posts/CreatePost';
import { UpdatePost } from '../../application/use-cases/posts/UpdatePost';
import { PublishPost } from '../../application/use-cases/posts/PublishPost';
import { DeletePost } from '../../application/use-cases/posts/DeletePost';
import { ListAllPosts } from '../../application/use-cases/posts/ListAllPosts';
import type { 
  PostDTO, 
  PostListItemDTO, 
  PostCreateInput, 
  PostUpdateInput 
} from '../../application/dto/PostDTO';
import type { PostFilters } from '../../domain/ports/PostRepository';

/**
 * Singleton del repositorio
 */
const postRepository = new SupabasePostRepository();

/**
 * Servicio de Posts para la UI
 */
export class PostService {
  /**
   * Listar posts publicados (público)
   */
  static async listPublishedPosts(filters?: {
    page?: number;
    pageSize?: number;
    search?: string;
    tag?: string;
  }) {
    const useCase = new ListPublishedPosts(postRepository);
    return await useCase.execute(filters);
  }

  /**
   * Obtener un post publicado por slug (público)
   */
  static async getPublishedPostBySlug(slug: string): Promise<PostDTO | null> {
    const useCase = new GetPublishedPostBySlug(postRepository);
    return await useCase.execute(slug);
  }

  /**
   * Listar todos los posts con filtros (admin)
   */
  static async listAllPosts(filters?: PostFilters & { page?: number; pageSize?: number }) {
    const useCase = new ListAllPosts(postRepository);
    return await useCase.execute(filters);
  }

  /**
   * Crear un nuevo post (admin)
   */
  static async createPost(input: PostCreateInput): Promise<PostDTO> {
    const useCase = new CreatePost(postRepository);
    return await useCase.execute(input);
  }

  /**
   * Actualizar un post (admin)
   */
  static async updatePost(id: string, input: PostUpdateInput): Promise<PostDTO> {
    const useCase = new UpdatePost(postRepository);
    return await useCase.execute(id, input);
  }

  /**
   * Publicar un post (admin)
   */
  static async publishPost(id: string): Promise<PostDTO> {
    const useCase = new PublishPost(postRepository);
    return await useCase.execute(id, true);
  }

  /**
   * Despublicar un post (admin)
   */
  static async unpublishPost(id: string): Promise<PostDTO> {
    const useCase = new PublishPost(postRepository);
    return await useCase.execute(id, false);
  }

  /**
   * Obtener un post por ID (admin)
   */
  static async getPostById(id: string): Promise<PostDTO | null> {
    const post = await postRepository.findById(id);
    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug.toString(),
      excerpt: post.excerpt,
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: post.coverImageUrl,
      tags: post.tags,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString() || null,
      readingTimeMin: post.readingTimeMin,
      seoMeta: post.seoMeta ? {
        title: post.seoMeta.title,
        description: post.seoMeta.description,
        ogImageUrl: post.seoMeta.ogImageUrl,
        canonicalUrl: post.seoMeta.canonicalUrl,
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }

  /**
   * Eliminar un post (admin)
   */
  static async deletePost(id: string): Promise<void> {
    const useCase = new DeletePost(postRepository);
    return await useCase.execute(id);
  }
}
