'use client';

import React, { Suspense } from 'react';
import clsx from 'clsx';
import RoundedImage from '@/components/RoundedImage';
import { ArticleCardAction } from './ArticleCardAction';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imgUrl: string;
  title: string;
  description: string;
  itemId: number;
  onClick?: () => void;
}

const ArticleCard: React.FC<Props> = ({
  imgUrl,
  title,
  description,
  itemId,
  onClick,
}) => {
  return (
    <section className="group">
      <article
        className={clsx('my-1 w-full min-w-[300px] cursor-pointer', {
          'flex justify-between gap-4': imgUrl,
        })}
      >
        <figure
          onClick={onClick}
          className="translate-all flex-shrink-0 self-start duration-200"
        >
          <Suspense fallback={<p>Loading image...</p>}>
            <RoundedImage src={imgUrl} width={120} height={80} alt={title} />
          </Suspense>
        </figure>
        <section className="relative">
          <header>
            <h3 className="text-onSurface mb-1 line-clamp-2 text-title-s">
              {title}
            </h3>
          </header>
          <section className="w-max-co line-clamp-2">
            <p className="text-onSurfaceVariant visible text-body-s group-hover:hidden">
              {description}
            </p>

            <div className="flex min-w-[248px] space-x-2 opacity-0 transition-opacity duration-500 ease-in-out group-hover:visible group-hover:opacity-100">
              {/* Card actions */}
              <ArticleCardAction itemId={itemId} />
            </div>
          </section>
        </section>
      </article>
    </section>
  );
};

export default ArticleCard;
