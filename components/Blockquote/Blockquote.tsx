'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  quoteBy?: string;
  className?: string;
}

export const Blockquote: React.FC<Props> = ({ quote, quoteBy, className }) => {
  return (
    <blockquote className={cn('relative w-full p-6', className)} dir="rtl">
      <div className="absolute bottom-0 right-0 top-0 w-[2px] bg-accent" />
      <div className="flex space-x-3">
        <div className="pl-2">
          <Quote className="text-accent" />
        </div>

        <p className="flex-1" data-quote-content={quote}>
          {quote}
        </p>
      </div>
      {quoteBy && (
        <p className="pt-4 text-accent">
          <strong data-quote-by={quoteBy}>{quoteBy}</strong>
        </p>
      )}
    </blockquote>
  );
};
