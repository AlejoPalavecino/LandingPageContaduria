/**
 * Hook: usePosts
 * Hook personalizado para manejar posts publicados en la UI
 */

import { useState, useEffect } from 'react';
import { PostService } from '../services/PostService';
import type { PostListItemDTO } from '../../application/dto/PostDTO';

interface UsePostsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  autoFetch?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<PostListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PostService.listPublishedPosts({
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 10,
        search: options.search,
        tag: options.tag,
      });

      setPosts(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchPosts();
    }
  }, [options.page, options.pageSize, options.search, options.tag]);

  return {
    posts,
    loading,
    error,
    total,
    refetch: fetchPosts,
  };
}
