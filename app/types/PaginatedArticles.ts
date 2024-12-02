import { Article } from '@/types/Article';

export interface PaginatedArticles {
  articles: Article[] | [];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}
