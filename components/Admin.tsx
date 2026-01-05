/**
 * Admin Panel Components
 * Panel de administración para gestión de posts del blog
 */

import React, { useState } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { Input, Card, Badge } from './UI';
import { Post } from '../types';

// ============================================================================
// ADMIN LOGIN
// ============================================================================

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 bg-brand-light rounded-2xl flex items-center justify-center text-brand-blue">
            <Icons.Lock className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-brand-navy text-center mb-2">Panel Admin</h1>
        <p className="text-brand-gray text-center mb-8">Ingresá con tu cuenta de Supabase</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              aria-label="Email de administrador"
              required
            />
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              aria-label="Contraseña de administrador"
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <Icons.AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// ============================================================================
// ADMIN POST LIST
// ============================================================================

interface AdminPostListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
  onTogglePublish: (postId: string, currentStatus: 'draft' | 'published') => void;
  onCreateNew: () => void;
}

export const AdminPostList: React.FC<AdminPostListProps> = ({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onTogglePublish,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-navy mb-2">Gestión de Posts</h1>
          <p className="text-brand-gray">{posts.length} artículos totales</p>
        </div>
        <Button onClick={onCreateNew}>
          <Icons.Plus className="w-5 h-5 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar por título o contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            aria-label="Buscar posts"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'published' ? 'Publicados' : 'Borradores'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          <p className="mt-4 text-brand-gray">Cargando posts...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && (
        <Card className="text-center py-12">
          <Icons.FileText className="w-16 h-16 mx-auto mb-4 text-brand-graySec" />
          <h3 className="text-xl font-bold text-brand-navy mb-2">No se encontraron posts</h3>
          <p className="text-brand-gray mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Intentá con otros filtros'
              : 'Comenzá creando tu primer artículo'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={onCreateNew}>Crear Artículo</Button>
          )}
        </Card>
      )}

      {/* Posts List */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostListItem
              key={post.id}
              post={post}
              onEdit={() => onEdit(post.id)}
              onDelete={() => onDelete(post.id)}
              onTogglePublish={() => onTogglePublish(post.id, post.status)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// POST LIST ITEM
// ============================================================================

interface PostListItemProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onEdit, onDelete, onTogglePublish }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Thumbnail */}
        {post.coverImageUrl && (
          <div className="lg:w-48 h-32 lg:h-auto rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-xl font-bold text-brand-navy flex-1 truncate">{post.title}</h3>
            <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
              {post.status === 'published' ? 'Publicado' : 'Borrador'}
            </Badge>
          </div>

          <p className="text-brand-gray text-sm mb-3 line-clamp-2">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-brand-graySec mb-4">
            <span className="flex items-center gap-1">
              <Icons.Calendar className="w-4 h-4" />
              {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString('es-AR') : 'Sin fecha'}
            </span>
            {post.readingTimeMin && (
              <span className="flex items-center gap-1">
                <Icons.Clock className="w-4 h-4" />
                {post.readingTimeMin} min
              </span>
            )}
            {post.category && (
              <span className="flex items-center gap-1">
                <Icons.Tag className="w-4 h-4" />
                {post.category}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-navy transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Icons.Edit className="w-4 h-4" />
              Editar
            </button>

            <button
              onClick={onTogglePublish}
              className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              {post.status === 'published' ? (
                <>
                  <Icons.EyeOff className="w-4 h-4" />
                  Despublicar
                </>
              ) : (
                <>
                  <Icons.Eye className="w-4 h-4" />
                  Publicar
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                showDeleteConfirm
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-red-500 hover:bg-red-50'
              }`}
            >
              <Icons.Trash2 className="w-4 h-4" />
              {showDeleteConfirm ? '¿Confirmar?' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
