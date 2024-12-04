import { Article, RawArticle, RawSingleArticle } from '@/types/Article';
import { ArticleStatus } from '@/types/ArticleStatus';
import { PaginatedArticles } from '@/types/PaginatedArticles';
import apiClient from '@/services/apiClient';
import { handleAsyncError } from '@/lib/utils';
import { FIRST_PAGE } from '@/lib/constants';
import { ArticleFormData, EditArticleFormData } from '@/types/ArticleFormData';

const normalizeArticleData = (rawData: RawArticle[]): Article[] | [] => {
  return rawData.map((rawArticle) => {
    const {
      id,
      title,
      slug,
      description,
      author,
      status,
      createdAt,
      views,
      shares,
      Category,
      Tags,
      featuredImg,
    } = rawArticle;
    return {
      id,
      title,
      slug,
      description,
      author: author.name,
      status,
      createdAt: new Date(createdAt).toLocaleDateString(),
      views,
      shares,
      category: Category,
      tags: Tags,
      featuredImg,
    };
  });
};

export const normalizeArticleForEdit = (
  rawSingleArticle: RawSingleArticle,
): EditArticleFormData => {
  const { id, title, description, Category, Tags, content, thumbnailId } =
    rawSingleArticle;
  return {
    id,
    title,
    description,
    category: Category.name,
    thumbnailId,
    tags: Tags.map((tag) => tag.name),
    content,
  };
};

export const fetchArticle = handleAsyncError(
  async (articleId: number): Promise<RawSingleArticle> => {
    const {
      data: { data },
    } = await apiClient.get(`/article/${articleId}?allStatuses=include`);

    return data;
  },
);

export const fetchArticles = handleAsyncError(
  async (
    status: ArticleStatus,
    page = FIRST_PAGE,
  ): Promise<PaginatedArticles> => {
    const {
      data: { data },
    } = await apiClient.get(`/articles?page=${page}&status=${status}`);

    return {
      articles: normalizeArticleData(data.articles),
      page: data.page,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
    };
  },
);

export const updateArticleStatus = handleAsyncError(
  async (id: number, status: ArticleStatus): Promise<void> => {
    await apiClient.put(`/article/${id}/status`, { status });
  },
);
export const deleteArticle = handleAsyncError(
  async (id: number): Promise<void> => {
    await apiClient.delete(`/article/${id}`);
  },
);

export const restoreArticle = handleAsyncError(
  async (id: number): Promise<void> => {
    await apiClient.put(`/article/restore/${id}`);
  },
);

const createCategory = handleAsyncError(
  async (category: string): Promise<number> => {
    const {
      data: { data },
    } = await apiClient.post(`/category/${category}`);
    return data.id;
  },
);

const createTags = handleAsyncError(
  async (tags: string[]): Promise<number[]> => {
    const tagsData = await Promise.all(
      tags.map((tag) => apiClient.post(`/tag/${tag}`)),
    );
    return tagsData.map(({ data: { data: tagData } }) => tagData.id as number);
  },
);

const createArticleTags = handleAsyncError(
  async (tags: string[], articleId: number): Promise<number[]> => {
    const createdTags = await createTags(tags);
    await Promise.all(
      createdTags.map((tag) =>
        apiClient.post(`/article/${articleId}/tag/${tag}`),
      ),
    );
    return createdTags;
  },
);

const uploadArticleImage = handleAsyncError(
  async (articleId: number, file: File, capture: string | null = null) => {
    const formData = new FormData();
    formData.append('file', file);
    const {
      data: { data },
    } = await apiClient.post(
      `/image/${articleId}?type=ARTICLE&capture=${capture}`,
      formData,
    );
    return data;
  },
);

const setArticleFeaturedImg = handleAsyncError(
  async (articleId: number, thumbnailId: number) => {
    const {
      data: { data },
    } = await apiClient.put(`/article/${articleId}`, { thumbnailId });
    return data;
  },
);

export const createArticle = handleAsyncError(
  async (formData: ArticleFormData): Promise<RawArticle> => {
    const categoryId = await createCategory(formData.category);
    const articleData = {
      title: formData.title,
      description: formData.description,
      categoryId,
      content: formData.content,
    };
    const {
      data: { data: article },
    } = await apiClient.post('/article', articleData);

    await createArticleTags(formData.tags, article.id);

    if (formData.thumbnail) {
      const featuredImg = await uploadArticleImage(
        article.id,
        formData.thumbnail,
        formData.title,
      );
      await setArticleFeaturedImg(article.id, featuredImg.id);
    }

    return article;
  },
);

export const updateArticle = handleAsyncError(
  async (
    formData: ArticleFormData,
    articleId: number,
    thumbnailId: number,
  ): Promise<RawArticle> => {
    // Set thumbnailIdValue to previous id
    let thumbnailIdValue = thumbnailId;
    // Unless new image was uploaded
    if (formData.thumbnail) {
      const featuredImg = await uploadArticleImage(
        articleId,
        formData.thumbnail,
      );
      // Assign the new uploaded featuredImg id as the thumbnailId
      thumbnailIdValue = featuredImg.id;
    }
    // Create a new category (if category is already exist the server will
    // return the exist record)
    const categoryId = await createCategory(formData.category);
    // Data to update
    const articleData = {
      title: formData.title,
      description: formData.description,
      categoryId,
      content: formData.content,
      thumbnailId: thumbnailIdValue,
      tags: formData.tags,
    };
    const {
      data: { data: article },
    } = await apiClient.put(`/article/${articleId}`, articleData);

    return article;
  },
);
