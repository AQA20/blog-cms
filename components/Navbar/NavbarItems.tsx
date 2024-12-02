'use client';

import React from 'react';
import { RootState, useAppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { setArticleStatus } from '@/app/store/slices/ArticleStatusSlice';
import { ArticleStatus } from '@/types/ArticleStatus';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';

export const NavbarItems = () => {
  const { status } = useSelector((state: RootState) => state.articleStatus);
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="hidden md:flex">
        <ul className="flex items-center gap-x-3">
          <li className="cursor-pointer"></li>
          <li
            className={clsx('article-list-item-status', {
              active: status === 'Approved',
            })}
            onClick={() => dispatch(setArticleStatus('Approved'))}
          >
            Published
          </li>
          <li
            className={clsx('article-list-item-status', {
              active: status === 'Pending',
            })}
            onClick={() => dispatch(setArticleStatus('Pending'))}
          >
            Pending
          </li>
          <li
            className={clsx('article-list-item-status', {
              active: status === 'Rejected',
            })}
            onClick={() => dispatch(setArticleStatus('Rejected'))}
          >
            Rejected
          </li>
          <li
            className={clsx('article-list-item-status', {
              active: status === 'Trashed',
            })}
            onClick={() => dispatch(setArticleStatus('Trashed'))}
          >
            Trashed
          </li>
        </ul>
      </div>
      <div className="sm:flex md:hidden">
        <ul className="flex items-center gap-x-3">
          <li className="cursor-pointer pl-3">
            <Select
              defaultValue="Approved"
              value={status}
              onValueChange={(value: ArticleStatus) =>
                dispatch(setArticleStatus(value))
              }
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue defaultValue="Approved" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Article status</SelectLabel>
                  <SelectItem defaultChecked value="Approved">
                    Published
                  </SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Trashed">Trashed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </li>
        </ul>
      </div>
    </>
  );
};
