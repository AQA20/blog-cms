export interface ArticleFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

export interface EditArticleFormData extends ArticleFormData {
  id: number;
  thumbnailId: number;
}
