/**
 * Supabase Database Types
 * Auto-generado basado en el esquema de Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content_md: string;
          status: 'draft' | 'published';
          published_at: string | null;
          cover_image_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          reading_time_min: number | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content_md: string;
          status?: 'draft' | 'published';
          published_at?: string | null;
          cover_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          reading_time_min?: number | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content_md?: string;
          status?: 'draft' | 'published';
          published_at?: string | null;
          cover_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          reading_time_min?: number | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      admins: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
