import { PaginatedArticles } from '@/types/PaginatedArticles';
import { useAppStore } from '@/hooks/useAppStore';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '@/services/articlesService';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import {
  setArticles,
  setError,
  setLoading,
  setOrder,
} from '@/app/store/slices/ArticlesSlice';

export const SortButton = ({
  title,
  orderBy,
}: {
  title: string;
  orderBy: 'views' | 'shares' | 'createdAt';
}) => {
  const { dispatch, useSelect } = useAppStore();
  const { status } = useSelect((state) => state.articleStatus);
  const { page, order } = useSelect((state) => state.articles);
  // const [order, setOrder] = useState<'DESC' | 'ASC'>('DESC');
  const { data, refetch } = useQuery<PaginatedArticles>({
    queryKey: ['sortedArticles'],
    queryFn: async () => {
      try {
        dispatch(setLoading(true));
        return await fetchArticles(status, page, {
          orderBy,
          order,
        });
      } catch (error) {
        const err = error as Error;
        dispatch(setError(err.message));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: false,
  });

  const handleSorting = () => {
    dispatch(setOrder(order === 'DESC' ? 'ASC' : 'DESC'));
    refetch();
  };

  useEffect(() => {
    if (data) {
      dispatch(setArticles(data));
    }
  }, [data, dispatch]);

  return (
    <Button
      variant="ghost"
      className="hover:bg-secondary hover:text-secondary-foreground"
      onClick={handleSorting}
    >
      {title}
      <ArrowUpDown />
    </Button>
  );
};
