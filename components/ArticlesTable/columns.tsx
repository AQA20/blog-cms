'use client';

import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Article } from '@/types/Article';
import { SortButton } from './SortButton';
import { Badges } from '@/components/Badges/Badges';
import ArticleCard from './ArticleCard';

export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="w-full sm:max-w-sm">
        <ArticleCard
          imgUrl={row.original.featuredImg}
          title={row.original.title}
          description={row.original.description}
          itemId={row.original.id}
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_WEB_URL}/${row.original.slug}`,
              '__blank',
            )
          }
        />
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => (
      <div className="min-w-max text-nowrap text-center">
        {row.original.category.name}
      </div>
    ),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex w-full min-w-max space-x-2 sm:max-w-sm">
        <Badges badges={row.original.tags} maxBadgesToShow={3} />
      </div>
    ),
  },
  {
    accessorKey: 'views',
    header: () => (
      <div className="text-center">
        <SortButton orderBy="views" title="Views" key="views" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('views')}</div>
    ),
  },
  {
    accessorKey: 'shares',
    header: () => (
      <div className="text-center">
        <SortButton orderBy="shares" title="Shares" key="shares" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('shares')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => (
      <div className="text-center">
        <SortButton orderBy="createdAt" title="Date" key="Date" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('createdAt')}</div>
    ),
  },
  {
    accessorKey: 'author',
    header: () => <div className="text-center">Creator</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('author')}</div>
    ),
  },
];
