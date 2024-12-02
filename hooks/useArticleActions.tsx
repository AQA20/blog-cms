import { useAppStore } from '@/hooks/useAppStore';
import {
  deleteArticle,
  updateArticleStatus,
  restoreArticle,
} from '@/services/articlesService';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { ArticleStatus } from '@/types/ArticleStatus';
import { useAppToast } from './useAppToast';
import { useDialog } from './useDialog';

export const useArticleActions = (articleId: number) => {
  const { useSelect } = useAppStore();
  const { status } = useSelect((state) => state.articleStatus);
  const { showToast } = useAppToast();

  const [dialog, setDialog] = useDialog();

  const resetDialog = () =>
    setDialog({
      open: false,
      title: '',
      description: '',
      onConfirm: () => null,
    });

  const {
    mutate: updateStatus,
  }: UseMutationResult<void, Error, ArticleStatus> = useMutation({
    mutationFn: async (articleStatus: ArticleStatus): Promise<void> => {
      await updateArticleStatus(articleId, articleStatus);
    },
    onSuccess: () =>
      showToast({
        description: `Article status was successfully updated!`,
      }),
    onError: (error) =>
      showToast({
        description: error.message,
        success: false,
      }),
    onSettled: resetDialog,
  });

  const { mutate: deleteMutate }: UseMutationResult<void, Error, number> =
    useMutation({
      mutationFn: async (articleId: number): Promise<void> =>
        await deleteArticle(articleId),
      onSuccess: () =>
        showToast({
          description: `Article was successfully deleted!`,
        }),
      onError: (error) =>
        showToast({
          description: error.message,
          success: false,
        }),
      onSettled: resetDialog,
    });

  const { mutate: restoreMutate }: UseMutationResult<void, Error, number> =
    useMutation({
      mutationFn: async (articleId: number): Promise<void> =>
        await restoreArticle(articleId),
      onSuccess: () =>
        showToast({
          description: `Article was successfully restored!`,
        }),
      onError: (error) =>
        showToast({
          description: error.message,
          success: false,
        }),
      onSettled: resetDialog,
    });

  const handleActionStatusChange = (articleStatus: ArticleStatus) => {
    setDialog({
      open: true,
      title: 'Are you sure you want change article status?',
      description: `Article will be changed from ${status} to ${articleStatus}`,
      onConfirm: () => updateStatus(articleStatus),
    });
  };

  const handleArticleRemove = () => {
    setDialog({
      open: true,
      title: 'Are you sure you want to remove the article?',
      description:
        'Article will be removed and status will be updated to Pending',
      onConfirm: () => deleteMutate(articleId),
    });
  };

  const handleActionRestore = () => {
    setDialog({
      open: true,
      title: 'Are you sure you want to restore the article?',
      description: 'Article will be restored along with its associations!',
      onConfirm: () => restoreMutate(articleId),
    });
  };

  return {
    status,
    dialog,
    setDialog,
    handleActionStatusChange,
    handleArticleRemove,
    handleActionRestore,
  };
};
