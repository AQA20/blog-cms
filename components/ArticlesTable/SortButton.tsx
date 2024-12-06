import { PaginatedArticles } from '@/types/PaginatedArticles';
import { useAppStore } from '@/hooks/useAppStore';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '@/services/articlesService';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { setArticles } from '@/app/store/slices/ArticlesSlice';

export const SortButton = ({
  title,
  orderBy,
}: {
  title: string;
  orderBy: 'views' | 'shares' | 'createdAt';
}) => {
  const { dispatch, useSelect } = useAppStore();
  const { status } = useSelect((state) => state.articleStatus);
  const { page } = useSelect((state) => state.articles);
  const [isDesc, setIsDesc] = useState(true);
  const { data, refetch, isSuccess } = useQuery<PaginatedArticles>({
    queryKey: ['sortedArticles'],
    queryFn: async () =>
      await fetchArticles(status, page, {
        orderBy,
        order: isDesc ? 'DESC' : 'ASC',
      }),
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [isDesc, refetch, orderBy]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setArticles(data));
    }
  }, [isSuccess, data, dispatch]);

  return (
    <Button
      variant="ghost"
      className="hover:bg-secondary hover:text-secondary-foreground"
      onClick={() => setIsDesc(!isDesc)}
    >
      {title}
      <ArrowUpDown />
    </Button>
  );
};
