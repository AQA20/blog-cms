import { ArticleStatus } from '@/types/ArticleStatus';

export interface RawArticle {
  id: number;
  title: string;
  slug: string;
  description: string;
  authorId: number;
  thumbnailId: number;
  categoryId: number;
  status: ArticleStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: null;
  views: number;
  shares: number;
  Category: {
    id: number;
    name: string;
  };
  Tags: Array<{ id: number; name: string }>; // Array of tag objects
  author: {
    id: number;
    name: string;
  };
  featuredImg: string; // URL to the featured image
}

export interface RawSingleArticle extends RawArticle {
  content: string;
  Images: Array<{
    id: number;
    name: string;
    imgUrl: string;
  }>;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  author: string;
  status: ArticleStatus;
  createdAt: string; // ISO date string
  views: number;
  shares: number;
  category: {
    id: number;
    name: string;
  };
  tags: Array<{ id: number; name: string }>; // Array of tag objects
  featuredImg: string; // URL to the featured image
}
