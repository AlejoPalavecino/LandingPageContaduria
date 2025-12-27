/**
 * Admin Posts Hook
 * Hook personalizado para operaciones CRUD del panel admin
 */

import { useState, useEffect } from 'react';
import { PostService } from '../services/PostService';
import { PostDTO, CreatePostDTO } from '../../application/dto/PostDTO';

export interface UseAdminPostsResult {
  posts: any[]; // Usar any temporalmente para evitar problemas de tipos
  isLoading: boolean;
  error: string | null;
  createPost: (data: CreatePostDTO, isDraft: boolean) => Promise<void>;
  updatePost: (id: string, data: CreatePostDTO, isDraft: boolean) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  unpublishPost: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook para gestionar posts en el panel admin
 * Incluye todas las operaciones CRUD y gestión de estado
 */
export const useAdminPosts = (): UseAdminPostsResult => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await PostService.listAllPosts();
      setPosts(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar posts');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (data: CreatePostDTO, isDraft: boolean) => {
    try {
      setError(null);
      const status = isDraft ? 'draft' : 'published';
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.contentMarkdown,
        coverImageUrl: data.coverImageUrl,
        seoMeta: data.seoMeta,
        tagSlugs: data.tags,
      };
      await PostService.createPost(postData as any);
      await fetchPosts(); // Refetch after create
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear post');
      throw err;
    }
  };

  const updatePost = async (id: string, data: CreatePostDTO, isDraft: boolean) => {
    try {
      setError(null);
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentMarkdown: data.contentMarkdown,
        coverImageUrl: data.coverImageUrl,
        seoMeta: data.seoMeta,
        tagSlugs: data.tags,
      };
      await PostService.updatePost(id, postData as any);
      await fetchPosts(); // Refetch after update
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar post');
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      setError(null);
      await PostService.deletePost(id);
      // Remove from local state immediately for better UX
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar post');
      throw err;
    }
  };

  const publishPost = async (id: string) => {
    try {
      setError(null);
      await PostService.publishPost(id);
      await fetchPosts(); // Refetch after publish
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar post');
      throw err;
    }
  };

  const unpublishPost = async (id: string) => {
    try {
      setError(null);
      await PostService.unpublishPost(id);
      await fetchPosts(); // Refetch after unpublish
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al despublicar post');
      throw err;
    }
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    refetch: fetchPosts,
  };
};

/**
 * Hook para obtener un post individual para edición
 */
export const useAdminPost = (postId?: string) => {
  const [post, setPost] = useState<PostDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await PostService.getPostById(postId);
        setPost(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar post');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, isLoading, error };
};
