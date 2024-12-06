'use client';

import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Article } from '@/types/Article';
import { SortButton } from './SortButton';

export const columns: ColumnDef<Article>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
  {
    accessorKey: 'views',
    header: () => <SortButton orderBy="views" title="Views" key="views" />,
  },
  {
    accessorKey: 'shares',
    header: () => <SortButton orderBy="shares" title="Shares" key="shares" />,
  },
  {
    accessorKey: 'createdAt',
    header: () => <SortButton orderBy="createdAt" title="Date" key="Date" />,
  },
  {
    accessorKey: 'author',
    header: 'Creator',
  },
];
