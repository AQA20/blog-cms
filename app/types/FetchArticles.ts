export interface FetchArticleOptions {
  orderBy: 'views' | 'shares' | 'createdAt';
  order: 'DESC' | 'ASC';
  search: string;
}
