'use client';

import React from 'react';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type Cell,
  type Row,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ArticleCard from './ArticleCard';
import { Article } from '@/types/Article';
import { Badges } from '@/components/Badges/Badges';
import { Button } from '@/components/ui/button';
import { FIRST_PAGE } from '@/lib/constants';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<Article>[]; // Constrain columns to Article type
  data: Article[]; // Constrain data to an array of Article
  page: number;
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const renderCell = (cell: Cell<Article, unknown>, row: Row<Article>) => {
  const tags = row.original.tags;
  switch (cell.column.id) {
    case 'title':
      return (
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
      );
    case 'tags':
      return (
        <div className="flex w-full min-w-max space-x-2 sm:max-w-sm">
          <Badges badges={tags} maxBadgesToShow={3} />
        </div>
      );
    case 'category':
      return (
        <div className="min-w-max text-nowrap">
          {row.original.category.name}
        </div>
      );

    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

export const DataTable: React.FC<Props> = ({
  columns,
  data,
  page,
  hasNextPage,
  onNextPage,
  onPreviousPage,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="z-10 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{renderCell(cell, row)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={page === FIRST_PAGE}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
