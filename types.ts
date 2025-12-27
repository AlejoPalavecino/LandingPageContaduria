export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  status: 'draft' | 'published';
  contentMarkdown: string;
  coverImageUrl?: string;
  category?: string;
  readingTimeMin?: number;
  updatedAt?: string;
}

export interface HealthTestResult {
  score: number;
  category: 'critical' | 'risk' | 'stable';
  message: string;
}

export interface HealthTestInput {
  revenue: number;
  margin: number;
  runway: string;
  control: string;
}

export type PageRoute = 
  | { path: 'landing' }
  | { path: 'about' }
  | { path: 'blog-list' }
  | { path: 'blog-detail'; slug: string }
  | { path: 'test-salud' }
  | { path: 'admin-login' }
  | { path: 'admin-posts' }
  | { path: 'admin-post-edit'; id?: string }; // id is optional for new