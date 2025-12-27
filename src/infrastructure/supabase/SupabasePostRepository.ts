/**
 * Implementación de PostRepository con Supabase
 */

import { PostRepository, PostFilters, PaginatedResult } from '../../domain/ports/PostRepository';
import { Post, Tag, PostStatus } from '../../domain/entities/Post';
import { Slug } from '../../domain/value-objects/Slug';
import { SeoMeta } from '../../domain/value-objects/SeoMeta';
import { supabase } from './client';
import type { Database } from './types';

type DbPost = Database['public']['Tables']['posts']['Row'];
type DbTag = Database['public']['Tables']['tags']['Row'];

export class SupabasePostRepository implements PostRepository {
  /**
   * Mapea un row de DB a entidad Post
   */
  private mapToEntity(dbPost: DbPost, tags: Tag[] = []): Post {
    return new Post(
      dbPost.id,
      dbPost.title,
      Slug.fromString(dbPost.slug),
      dbPost.content_md,
      dbPost.status as PostStatus,
      dbPost.excerpt,
      dbPost.published_at ? new Date(dbPost.published_at) : null,
      dbPost.cover_image_url,
      dbPost.seo_title || dbPost.seo_description ? new SeoMeta(
        dbPost.seo_title,
        dbPost.seo_description,
        dbPost.og_image_url,
        dbPost.canonical_url
      ) : null,
      tags,
      dbPost.author_id,
      dbPost.reading_time_min,
      new Date(dbPost.created_at),
      new Date(dbPost.updated_at)
    );
  }

  /**
   * Obtiene los tags de un post
   */
  private async getPostTags(postId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('post_tags')
      .select(`
        tag_id,
        tags (
          id,
          name,
          slug
        )
      `)
      .eq('post_id', postId);

    if (error) throw new Error(`Error obteniendo tags: ${error.message}`);
    if (!data) return [];

    return data.map((pt: any) => ({
      id: pt.tags.id,
      name: pt.tags.name,
      slug: pt.tags.slug,
    }));
  }

  /**
   * Sincroniza los tags de un post
   */
  private async syncPostTags(postId: string, tagSlugs: string[]): Promise<void> {
    // 1. Eliminar tags existentes
    await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', postId);

    if (tagSlugs.length === 0) return;

    // 2. Obtener o crear tags
    const tagIds: string[] = [];
    
    for (const slug of tagSlugs) {
      // Buscar tag existente
      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('slug', slug)
        .single() as { data: { id: string } | null, error: any };

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        // Crear nuevo tag
        const { data: newTag, error } = await supabase
          .from('tags')
          .insert({ name: slug, slug } as any)
          .select('id')
          .single() as { data: { id: string } | null, error: any };

        if (error) throw new Error(`Error creando tag: ${error.message}`);
        if (newTag) tagIds.push(newTag.id);
      }
    }

    // 3. Crear relaciones post_tags
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId,
    }));

    const { error } = await supabase
      .from('post_tags')
      .insert(postTags as any);

    if (error) throw new Error(`Error sincronizando tags: ${error.message}`);
  }

  async findById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw new Error(`Error buscando post: ${error.message}`);
    }

    const tags = await this.getPostTags(id);
    return this.mapToEntity(data, tags);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single() as { data: DbPost | null, error: any };

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error buscando post por slug: ${error.message}`);
    }

    if (!data) return null;

    const tags = await this.getPostTags(data.id);
    return this.mapToEntity(data, tags);
  }

  async findAll(filters: PostFilters): Promise<PaginatedResult<Post>> {
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
    }

    // Paginación
    const limit = filters.limit ?? 10;
    const offset = filters.offset ?? 0;
    
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query as { data: DbPost[] | null, error: any, count: number | null };

    if (error) throw new Error(`Error listando posts: ${error.message}`);

    // Obtener tags para cada post
    const posts = await Promise.all(
      (data || []).map(async (dbPost) => {
        const tags = await this.getPostTags(dbPost.id);
        return this.mapToEntity(dbPost, tags);
      })
    );

    return {
      items: posts,
      total: count ?? 0,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async findPublished(filters: Omit<PostFilters, 'status'>): Promise<PaginatedResult<Post>> {
    return this.findAll({
      ...filters,
      status: 'published',
    });
  }

  async create(post: Post): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        id: post.id,
        title: post.title,
        slug: post.slug.toString(),
        excerpt: post.excerpt,
        content_md: post.contentMarkdown,
        status: post.status,
        published_at: post.publishedAt?.toISOString() ?? null,
        cover_image_url: post.coverImageUrl,
        seo_title: post.seoMeta?.title ?? null,
        seo_description: post.seoMeta?.description ?? null,
        og_image_url: post.seoMeta?.ogImageUrl ?? null,
        canonical_url: post.seoMeta?.canonicalUrl ?? null,
        reading_time_min: post.readingTimeMin,
        author_id: post.authorId,
      } as any)
      .select()
      .single() as { data: DbPost | null, error: any };

    if (error) throw new Error(`Error creando post: ${error.message}`);
    if (!data) throw new Error('No se pudo crear el post');

    // Sincronizar tags
    if (post.tags.length > 0) {
      await this.syncPostTags(data.id, post.tags.map(t => t.slug));
    }

    return this.findById(data.id) as Promise<Post>;
  }

  async update(id: string, post: Post): Promise<Post> {
    const updateData: any = {
      title: post.title,
      slug: post.slug.toString(),
      excerpt: post.excerpt,
      content_md: post.contentMarkdown,
      status: post.status,
      published_at: post.publishedAt?.toISOString() ?? null,
      cover_image_url: post.coverImageUrl,
      seo_title: post.seoMeta?.title ?? null,
      seo_description: post.seoMeta?.description ?? null,
      og_image_url: post.seoMeta?.ogImageUrl ?? null,
      canonical_url: post.seoMeta?.canonicalUrl ?? null,
      reading_time_min: post.readingTimeMin,
    };

    const result = await (supabase
      .from('posts') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    const { data, error } = result as { data: DbPost | null, error: any };

    if (error) throw new Error(`Error actualizando post: ${error.message}`);
    if (!data) throw new Error('Post no encontrado');

    // Sincronizar tags
    await this.syncPostTags(id, post.tags.map(t => t.slug));

    return this.findById(id) as Promise<Post>;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Error eliminando post: ${error.message}`);
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('posts')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Error verificando slug: ${error.message}`);

    return (data?.length ?? 0) > 0;
  }
}
