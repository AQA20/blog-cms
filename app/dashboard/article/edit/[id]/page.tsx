import React from 'react';
import ArticleEditor from '@/components/ArticleEditor/ArticleEditor';
import {
  normalizeArticleForEdit,
  fetchArticle,
} from '@/services/articlesService';

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
  const routeParams = await params;
  const data = await fetchArticle(routeParams.id);
  const article = normalizeArticleForEdit(data);
  return <ArticleEditor article={article} />;
};

export default Page;
