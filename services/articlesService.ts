import { Article, RawArticle, RawSingleArticle } from '@/types/Article';
import { ArticleStatus } from '@/types/ArticleStatus';
import { PaginatedArticles } from '@/types/PaginatedArticles';
import { FetchArticleOptions } from '@/app/types/FetchArticles';
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
    options: Partial<FetchArticleOptions> = {
      orderBy: 'createdAt',
      order: 'DESC',
      search: '',
    },
  ): Promise<PaginatedArticles> => {
    const { orderBy = 'createdAt', order = 'DESC', search = '' } = options;
    const {
      data: { data },
    } = await apiClient.get(
      `/articles?page=${page}&status=${status}&orderBy=${orderBy}&order=${order}&search=${search}`,
    );

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
  async (articleId: number, file: File, capture?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    let url: string;
    if (capture) {
      url = `/image/${articleId}?type=ARTICLE&capture=${capture}`;
    } else {
      url = `/image/${articleId}?type=ARTICLE`;
    }
    const {
      data: { data },
    } = await apiClient.post(url, formData);
    return data;
  },
);

export const uploadImage = handleAsyncError(
  async (file: File): Promise<{ url: string; name: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const {
      data: { data },
    } = await apiClient.post('image/upload', formData);
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
  async (
    formData: ArticleFormData,
    thumbnail: File | undefined,
  ): Promise<RawArticle> => {
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

    if (thumbnail) {
      const featuredImg = await uploadArticleImage(
        article.id,
        thumbnail,
        formData.title,
      );
      await setArticleFeaturedImg(article.id, featuredImg.id);
    }

    return article;
  },
);

interface UpdateOptions {
  articleId: number;
  thumbnailId: number;
  thumbnail: File | undefined;
}

export const updateArticle = handleAsyncError(
  async (
    formData: ArticleFormData,
    options: UpdateOptions,
  ): Promise<RawArticle> => {
    // Set thumbnailIdValue to previous id
    let thumbnailIdValue = options.thumbnailId;
    // Unless new image was uploaded
    if (options.thumbnail) {
      const featuredImg = await uploadArticleImage(
        options.articleId,
        options.thumbnail,
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
    } = await apiClient.put(`/article/${options.articleId}`, articleData);

    return article;
  },
);

export const deleteImage = handleAsyncError(async (name: string) => {
  await apiClient.delete(`/image/permanent-delete/${name}?type=Article`);
});
