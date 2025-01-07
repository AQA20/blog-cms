'use client';

import React, { useEffect } from 'react';
import { columns } from '@/components/ArticlesTable/columns';
import { DataTable } from '@/components/ArticlesTable/DataTable';
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '@/services/articlesService';
import { PaginatedArticles } from '@/types/PaginatedArticles';
import { setPage, setArticles } from '@/app/store/slices/ArticlesSlice';
import { FIRST_PAGE } from '@/lib/constants';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import { useAppStore } from '@/hooks/useAppStore';

export default function ArticlesTable() {
  const { dispatch, useSelect } = useAppStore();
  const {
    page,
    hasNextPage,
    articles,
    loading,
    error: articlesError,
  } = useSelect((state) => state.articles);
  const { status } = useSelect((state) => state.articleStatus);

  const { isPending, error, data, refetch, isSuccess } =
    useQuery<PaginatedArticles>({
      queryKey: ['articles'],
      queryFn: async () => await fetchArticles(status, page),
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setArticles(data));
    }
  }, [data, isSuccess, dispatch]);

  useEffect(() => {
    // rest the page when changing article status
    dispatch(setPage(FIRST_PAGE));
    refetch();
  }, [status, refetch, dispatch]);

  useEffect(() => {
    // refetch article when page changes
    refetch();
  }, [page, refetch]);

  if (isPending || loading) {
    return <LoadingIndicator />;
  } else if (error || articlesError) {
    return (
      <p className="text-destructive">{`An error has occurred: ${error ? error.message : articlesError}`}</p>
    );
  }
  return (
    <DataTable
      columns={columns}
      data={articles}
      page={page}
      hasNextPage={hasNextPage}
      onNextPage={() => dispatch(setPage(page + 1))}
      onPreviousPage={() => dispatch(setPage(page - 1))}
    />
  );
}
