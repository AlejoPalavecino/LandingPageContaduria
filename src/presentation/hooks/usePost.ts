/**
 * Hook: usePost
 * Hook personalizado para manejar un post individual
 */

import { useState, useEffect } from 'react';
import { PostService } from '../services/PostService';
import type { PostDTO } from '../../application/dto/PostDTO';

export function usePost(slug: string | null) {
  const [post, setPost] = useState<PostDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await PostService.getPublishedPostBySlug(slug);
        setPost(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return {
    post,
    loading,
    error,
  };
}
